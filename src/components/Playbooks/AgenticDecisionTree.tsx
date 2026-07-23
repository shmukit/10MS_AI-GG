import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, ExternalLink, Copy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DecisionNode,
  DecisionQuestionNode,
  DecisionResultNode,
  MODALITY_LABELS,
  extractPathContext,
  buildWhyForYou,
  resolveMondayStep,
  resolveToolsForModality,
} from '../../data/agenticDecisionTree';
import {
  getDecisionTreeNode,
  getDecisionTreeStartId,
} from '../../data/decisionTreeRegistry';

function isQuestion(node: DecisionNode): node is DecisionQuestionNode {
  return node.type === 'question';
}

function isResult(node: DecisionNode): node is DecisionResultNode {
  return node.type === 'result';
}

function progressStepLabel(
  node: DecisionQuestionNode,
  index: number,
  path: string[],
  treeKey: string
): string {
  const prevId = path[index - 1];
  const prevNode = prevId ? getDecisionTreeNode(treeKey, prevId) : undefined;
  if (prevNode && isQuestion(prevNode)) {
    const chosen = prevNode.options.find((o) => o.nextId === node.id);
    if (chosen?.label) {
      const short = chosen.label.length > 28 ? `${chosen.label.slice(0, 28)}…` : chosen.label;
      return short;
    }
  }
  return node.stepLabel;
}

interface AgenticDecisionTreeProps {
  embedded?: boolean;
  treeKey?: string;
}

export const AgenticDecisionTree: React.FC<AgenticDecisionTreeProps> = ({
  embedded = false,
  treeKey = 'agentic',
}) => {
  const startId = getDecisionTreeStartId(treeKey);
  const [path, setPath] = useState<string[]>([startId]);
  const [copied, setCopied] = useState(false);
  const [facilitatorOpen, setFacilitatorOpen] = useState(false);

  useEffect(() => {
    setPath([getDecisionTreeStartId(treeKey)]);
    setCopied(false);
    setFacilitatorOpen(false);
  }, [treeKey]);

  const currentId = path[path.length - 1];
  const currentNode = useMemo(() => getDecisionTreeNode(treeKey, currentId), [treeKey, currentId]);

  const pathContext = useMemo(
    () => extractPathContext(treeKey, path, getDecisionTreeNode),
    [treeKey, path]
  );

  const summaryStrip = useMemo(() => {
    const parts: string[] = [];
    if (pathContext.sector) parts.push(pathContext.sector);
    if (pathContext.role) parts.push(pathContext.role);
    if (pathContext.headache) parts.push(pathContext.headache.replace(/-/g, ' '));
    if (pathContext.modality) parts.push(MODALITY_LABELS[pathContext.modality]);
    return parts;
  }, [pathContext]);

  const goTo = (nextId: string) => {
    setPath((prev) => {
      if (prev[prev.length - 1] === nextId) return prev;
      return [...prev, nextId];
    });
  };

  // Single-answer steps (e.g. "tests green → Type 4") should not require another click.
  useEffect(() => {
    if (!currentNode || !isQuestion(currentNode) || currentNode.options.length !== 1) return;
    const only = currentNode.options[0];
    setPath((prev) => {
      if (prev[prev.length - 1] === only.nextId) return prev;
      return [...prev, only.nextId];
    });
  }, [currentId, currentNode]);

  const goBack = () => {
    if (path.length > 1) {
      setPath((prev) => prev.slice(0, -1));
    }
  };

  const restart = () => {
    setPath([startId]);
    setCopied(false);
    setFacilitatorOpen(false);
  };

  const copyHarnessCard = (result: DecisionResultNode) => {
    const monday = resolveMondayStep(result, pathContext.modality);
    const text = [
      `${result.title} (Type ${result.typeCode})`,
      buildWhyForYou(pathContext),
      '',
      `Do this first (15 min): ${monday}`,
      '',
      `Safety: ${result.safetyRule}`,
      '',
      'Facilitator — minimum harness:',
      ...result.harness.map((h) => `- ${h}`),
      '',
      'Harness card hints:',
      ...result.harnessCardHints.map((h) => `- ${h.field}: ${h.hint}`),
      '',
      `Do not: ${result.doNot}`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!currentNode) {
    return (
      <div className={embedded ? 'p-6' : 'min-h-screen bg-background p-6'}>
        <p className="text-muted-foreground">Decision node not found.</p>
        <button onClick={restart} className="mt-4 text-primary">Start over</button>
      </div>
    );
  }

  const headerTitle = 'Find the simplest AI help for your job';
  const headerSubtitle = 'Sector → role → real task → what to open on Monday. No jargon required.';

  return (
    <div className={embedded ? '' : 'min-h-screen bg-background'}>
      {!embedded && (
        <div className="border-b border-border bg-card">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="w-16" />
            <div className="text-center flex-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Workshop playbook</p>
              <h1 className="text-lg font-bold text-foreground">{headerTitle}</h1>
            </div>
            <button
              onClick={restart}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
          </div>
        </div>
      )}

      <div className={`max-w-3xl mx-auto px-4 ${embedded ? 'py-6' : 'py-8'}`}>
        {embedded && (
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Workshop playbook</p>
              <h2 className="text-xl font-bold text-foreground">{headerTitle}</h2>
              <p className="text-sm text-muted-foreground mt-1">{headerSubtitle}</p>
            </div>
            <button
              onClick={restart}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
          </div>
        )}

        {summaryStrip.length > 0 && (
          <div className="mb-4 px-3 py-2 rounded-lg border border-border bg-muted/40 text-sm text-muted-foreground">
            <span className="font-medium text-foreground mr-1">Your path:</span>
            {summaryStrip.join(' · ')}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          {path.map((id, index) => {
            const node = getDecisionTreeNode(treeKey, id);
            const label =
              node && isQuestion(node)
                ? progressStepLabel(node, index, path, treeKey)
                : node && isResult(node)
                  ? `Result · Type ${node.typeCode}`
                  : `${index + 1}`;
            return (
              <span
                key={`${id}-${index}`}
                className={`text-xs px-2.5 py-1 rounded-full border ${
                  index === path.length - 1
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {label}
              </span>
            );
          })}
        </div>

        {isQuestion(currentNode) && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-primary mb-1">
                {currentNode.stepLabel}
              </p>
              <h2 className={`font-bold text-foreground leading-snug ${embedded ? 'text-xl' : 'text-2xl'}`}>
                {currentNode.question}
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{currentNode.helpText}</p>
              {currentNode.examples && currentNode.examples.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground italic">
                  {currentNode.examples[0]}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Pick one option to continue.</p>
              {currentNode.options.map((option, index) => (
                <button
                  key={`${currentId}-${option.contextValue ?? option.label}-${index}`}
                  type="button"
                  onClick={() => goTo(option.nextId)}
                  className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-foreground">{option.label}</span>
                        {option.modality && (
                          <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground">
                            {MODALITY_LABELS[option.modality]}
                          </span>
                        )}
                      </div>
                      {option.example && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{option.example}</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>

            {path.length > 1 && (
              <button
                onClick={goBack}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Previous question
              </button>
            )}
          </div>
        )}

        {isResult(currentNode) && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5">
              <p className="text-xs font-medium uppercase tracking-wide text-primary mb-2">
                Your recommendation
              </p>
              <h2 className={`font-bold text-foreground ${embedded ? 'text-xl' : 'text-2xl'}`}>
                {currentNode.title}
              </h2>
              <p className="mt-3 text-foreground leading-relaxed">{currentNode.plainSummary}</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2">Why this fits you</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{buildWhyForYou(pathContext)}</p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">Do this first (15 min)</h3>
                {pathContext.modality && (
                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-emerald-500/40 text-emerald-700 dark:text-emerald-300">
                    {MODALITY_LABELS[pathContext.modality]}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {resolveMondayStep(currentNode, pathContext.modality)}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-2">Good for</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {currentNode.goodFor.map((item) => (
                    <li key={item}>+ {item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-2">Not for</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {currentNode.notFor.map((item) => (
                    <li key={item}>− {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
              <h3 className="font-semibold text-foreground mb-1">Safety rule</h3>
              <p className="text-sm text-muted-foreground">{currentNode.safetyRule}</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h3 className="font-semibold text-foreground">Tools for your work type</h3>
                {pathContext.modality && (
                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground">
                    {MODALITY_LABELS[pathContext.modality]}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {resolveToolsForModality(currentNode, pathContext.modality).map((link) => (
                  <a
                    key={link.url + link.label}
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border hover:border-primary hover:text-primary transition-colors"
                  >
                    {link.label}
                    {link.url.startsWith('http') && <ExternalLink className="w-3.5 h-3.5" />}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                type="button"
                onClick={() => setFacilitatorOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-accent/50 transition-colors"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Facilitator</p>
                  <h3 className="font-semibold text-foreground">
                    {currentNode.facilitatorPatternName}
                  </h3>
                </div>
                {facilitatorOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {facilitatorOpen && (
                <div className="px-4 pb-4 space-y-4 border-t border-border">
                  <p className="pt-4 text-sm text-muted-foreground">{currentNode.summary}</p>

                  <div>
                    <h4 className="font-semibold text-foreground mb-2 text-sm">Minimum harness</h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {currentNode.harness.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm">Do not overbuild</h4>
                    <p className="text-sm text-muted-foreground">{currentNode.doNot}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">Pros</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {currentNode.pros.map((item) => (
                          <li key={item}>+ {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 text-sm">Cons</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {currentNode.cons.map((item) => (
                          <li key={item}>− {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-foreground text-sm">Harness Card hints</h4>
                      <button
                        onClick={() => copyHarnessCard(currentNode)}
                        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-accent"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <dl className="space-y-2 text-sm">
                      {currentNode.harnessCardHints.map((hint) => (
                        <div key={hint.field}>
                          <dt className="font-medium text-foreground">{hint.field}</dt>
                          <dd className="text-muted-foreground">{hint.hint}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={goBack}
                className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent"
              >
                ← Change answers
              </button>
              <button
                onClick={restart}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90"
              >
                Try another task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export function isDecisionTreeResourceUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('agentic-decision') || url.includes('view=decision-tree');
}

import React, { useMemo, useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import {
  DecisionNode,
  DecisionQuestionNode,
  DecisionResultNode,
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

  useEffect(() => {
    setPath([getDecisionTreeStartId(treeKey)]);
    setCopied(false);
  }, [treeKey]);

  const currentId = path[path.length - 1];
  const currentNode = useMemo(() => getDecisionTreeNode(treeKey, currentId), [treeKey, currentId]);

  const goTo = (nextId: string) => {
    setPath((prev) => [...prev, nextId]);
  };

  const goBack = () => {
    if (path.length > 1) {
      setPath((prev) => prev.slice(0, -1));
    }
  };

  const restart = () => {
    setPath([startId]);
    setCopied(false);
  };

  const copyHarnessCard = (result: DecisionResultNode) => {
    const text = [
      `Pattern: ${result.title} (Type ${result.typeCode})`,
      `Summary: ${result.summary}`,
      '',
      'Minimum harness:',
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

  return (
    <div className={embedded ? '' : 'min-h-screen bg-background'}>
      {!embedded && (
        <div className="border-b border-border bg-card">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <div className="w-16" />
            <div className="text-center flex-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Workshop playbook</p>
              <h1 className="text-lg font-bold text-foreground">Choose Your AI Pattern</h1>
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
              <h2 className="text-xl font-bold text-foreground">Choose Your AI Pattern</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Walk through your workflow and land on the simplest AI architecture that fits.
              </p>
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

        <div className="mb-6 flex flex-wrap gap-2">
          {path.map((id, index) => {
            const node = getDecisionTreeNode(treeKey, id);
            const label = node && isQuestion(node)
              ? `Q${index + 1}`
              : node && isResult(node)
                ? `Type ${node.typeCode}`
                : `${index + 1}`;
            return (
              <span
                key={`${id}-${index}`}
                className={`text-xs px-2 py-1 rounded-full border ${
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
              <h2 className={`font-bold text-foreground leading-snug ${embedded ? 'text-xl' : 'text-2xl'}`}>
                {currentNode.question}
              </h2>
              {currentNode.helpText && (
                <p className="mt-3 text-muted-foreground">{currentNode.helpText}</p>
              )}
            </div>

            <div className="space-y-3">
              {currentNode.options.map((option) => (
                <button
                  key={option.nextId}
                  onClick={() => goTo(option.nextId)}
                  className="w-full text-left p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-foreground">{option.label}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
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
                Recommended pattern · Type {currentNode.typeCode}
              </p>
              <h2 className={`font-bold text-foreground ${embedded ? 'text-xl' : 'text-2xl'}`}>
                {currentNode.title}
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{currentNode.summary}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-2">Pros</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {currentNode.pros.map((item) => (
                    <li key={item}>+ {item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-2">Cons</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {currentNode.cons.map((item) => (
                    <li key={item}>− {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2">Minimum harness</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {currentNode.harness.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
              <h3 className="font-semibold text-foreground mb-1">Do not overbuild</h3>
              <p className="text-sm text-muted-foreground">{currentNode.doNot}</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-3">Suggested tools</h3>
              <div className="flex flex-wrap gap-2">
                {currentNode.toolLinks.map((link) => (
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

            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="font-semibold text-foreground">Harness Card hints</h3>
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
                Classify another workflow
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

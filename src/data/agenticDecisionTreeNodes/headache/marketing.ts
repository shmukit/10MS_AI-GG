import { headacheNode } from '../headacheNodeBuilder';

export const marketingHeadacheNode = headacheNode('q-headache-marketing', 'marketing', [
  {
    label: 'Rewrite ad copy or Facebook post in clear Bangla/English',
    example: 'Campaign brief → 3 caption options under 150 words.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'ad-copy',
  },
  {
    label: 'Fix or resize creatives for social',
    example: 'Old banner → square crop + text readable on mobile.',
    modality: 'image',
    nextId: 'q-finished',
    contextValue: 'social-creative',
  },
  {
    label: 'Plan a short product video from a brief',
    example: 'Bullets → 30s script + shot list for intern/editor.',
    modality: 'video',
    nextId: 'q-finished',
    contextValue: 'video-brief',
  },
  {
    label: 'Check claims before publish (compliance pass)',
    example: 'Draft post vs brand rules—flag risky lines before go-live.',
    modality: 'quality',
    nextId: 'q-finished-code-quality',
    contextValue: 'marketing-qa',
  },
  {
    label: 'Campaign results presentation for leadership',
    example: 'Reach, spend, leads → slide outline + speaker notes for Friday review.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'campaign-presentation',
  },
  {
    label: 'Organize brand assets and old campaign files',
    example: 'Mixed Drive folders → one library with naming rules and “approved” vs “draft”.',
    modality: 'text',
    nextId: 'q-finished-chain',
    contextValue: 'marketing-doc-org',
  },
]);

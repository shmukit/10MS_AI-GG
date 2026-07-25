import { headacheNode } from '../headacheNodeBuilder';

export const educationHeadacheNode = headacheNode('q-headache-education', 'education', [
  {
    label: 'Lesson plan or facilitator notes from syllabus',
    example: 'Syllabus PDF → session plan with activities and timing.',
    modality: 'text',
    nextId: 'q-needs-files',
    contextValue: 'lesson-plan',
  },
  {
    label: 'Feedback on student assignments (rubric-based)',
    example: '10 submissions scored against pinned rubric; you override edge cases.',
    modality: 'quality',
    nextId: 'q-finished-code-quality',
    contextValue: 'grade-assignments',
  },
  {
    label: 'Parent or student message drafts in Bangla',
    example: 'Bullet facts → polite message; you send from official account.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'parent-message',
  },
  {
    label: 'Donor or management program report',
    example: 'Activity data + stories → impact report with numbers you can verify.',
    modality: 'text',
    nextId: 'q-needs-files',
    contextValue: 'program-report',
  },
  {
    label: 'Training presentation from module outline',
    example: 'Syllabus bullets → slide titles, activities, and timing for a 2-hour session.',
    modality: 'text',
    nextId: 'q-finished',
    contextValue: 'training-presentation',
  },
  {
    label: 'Clean student or beneficiary data export',
    example: 'Enrollment dump → deduped names, correct grades/districts for M&E sheet.',
    modality: 'numbers',
    nextId: 'q-finished',
    contextValue: 'education-data-clean',
  },
]);

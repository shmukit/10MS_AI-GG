/**
 * Centralized input validation schemas for all database write operations.
 * Uses Zod for runtime validation to prevent malformed data from reaching Supabase.
 *
 * Usage:
 *   import { schemas, validate } from '@/utils/validation';
 *   const result = validate(schemas.notice.create, userInput);
 *   if (!result.success) return { error: result.error };
 *   // result.data is now typed and sanitized
 */

import { z } from 'zod';

// ============ SHARED PRIMITIVES ============

export const uuid = z.string().uuid('Invalid UUID format');
export const safeText = z.string().trim().min(1, 'Required').max(10000, 'Content too long');
export const shortText = z.string().trim().min(1, 'Required').max(255, 'Text too long');
export const optionalText = z.string().trim().max(10000).optional().nullable();
export const email = z.string().email('Invalid email address').max(255);
export const role = z.enum(['student', 'mentor', 'admin']);
export const priority = z.enum(['low', 'medium', 'high', 'urgent']);
export const progressStatus = z.enum(['not_started', 'in_progress', 'completed', 'overdue']);
export const batchStatus = z.enum(['active', 'completed', 'cancelled']);
export const taskType = z.enum(['watch', 'read', 'project', 'attend', 'mcq', 'written']);
export const difficultyLevel = z.enum(['beginner', 'intermediate', 'advanced']);

// ============ NOTICE SCHEMAS ============

const noticeCreate = z.object({
  title: shortText,
  content: safeText,
  author_id: uuid,
  batch_id: uuid.optional().nullable(),
  tag: shortText.optional().nullable(),
  priority: priority.default('medium'),
  scheduled_date: z.string().date().optional().nullable(),
  scheduled_time: z.string().optional().nullable(),
  is_published: z.boolean().default(false),
  target_student_id: uuid.optional().nullable(),
});

const noticeUpdate = noticeCreate.partial().omit({ author_id: true });

// ============ USER SCHEMAS ============

const userProfileUpdate = z.object({
  first_name: shortText.optional(),
  last_name: shortText.optional(),
  profile_picture_url: z.string().url().optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  // SECURITY: role, email, password_hash, is_active MUST NOT be updatable by the user
}).strict(); // .strict() rejects unknown keys like 'role'

// ============ DISCUSSION SCHEMAS ============

const discussionPostCreate = z.object({
  user_id: uuid,
  task_id: uuid.optional().nullable(),
  week_id: uuid.optional().nullable(),
  roadmap_id: uuid.optional().nullable(),
  content: safeText,
  parent_id: uuid.optional().nullable(),
});

const discussionPostUpdate = z.object({
  content: safeText,
});

// ============ PRACTICE DECK SCHEMAS ============

const practiceDeckCreate = z.object({
  title: shortText,
  description: optionalText,
  created_by: uuid,
  roadmap_id: uuid.optional().nullable(),
  week_id: uuid.optional().nullable(),
  is_public: z.boolean().default(false),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

const practiceDeckUpdate = practiceDeckCreate.partial().omit({ created_by: true });

// ============ PRACTICE CARD SCHEMAS ============

const practiceCardCreate = z.object({
  deck_id: uuid,
  question: safeText,
  answer: safeText,
  hint: optionalText,
  explanation: optionalText,
  difficulty: z.number().int().min(1).max(5).default(3),
  order_index: z.number().int().min(0).default(0),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

const practiceCardUpdate = practiceCardCreate.partial().omit({ deck_id: true });

// ============ STUDENT PROGRESS SCHEMAS ============

const studentProgressUpsert = z.object({
  student_id: uuid,
  task_id: uuid,
  status: progressStatus,
  completed_at: z.string().datetime().optional().nullable(),
  score: z.number().min(0).max(100).optional().nullable(),
  feedback: optionalText,
  submitted_files: z.array(z.string().url()).max(10).optional(),
});

// ============ BATCH SCHEMAS ============

const batchCreate = z.object({
  name: shortText,
  roadmap_id: uuid,
  mentor_id: uuid.optional().nullable(),
  max_students: z.number().int().min(1).max(500).default(30),
  start_date: z.string().date(),
  end_date: z.string().date().optional().nullable(),
  whatsapp_link: z.string().url().optional().nullable(),
  discord_link: z.string().url().optional().nullable(),
  emergency_contact: z.string().max(20).optional().nullable(),
  status: batchStatus.default('active'),
});

const batchUpdate = batchCreate.partial().omit({ roadmap_id: true });

// ============ ROADMAP SCHEMAS ============

const roadmapCreate = z.object({
  title: shortText,
  description: optionalText,
  total_weeks: z.number().int().min(1).max(52),
  difficulty_level: difficultyLevel.default('beginner'),
  category: shortText,
  is_active: z.boolean().default(true),
});

const roadmapTaskCreate = z.object({
  week_id: uuid,
  task_name: shortText,
  task_details: optionalText,
  task_type: taskType,
  relevant_links: z.array(z.string().url()).max(10).optional(),
  deadline: z.string().date().optional().nullable(),
  estimated_hours: z.number().int().min(0).max(100).optional().nullable(),
  points: z.number().int().min(0).max(1000).default(10),
  is_required: z.boolean().default(true),
});

// ============ EXPORT ============

export const schemas = {
  notice: {
    create: noticeCreate,
    update: noticeUpdate,
  },
  user: {
    profileUpdate: userProfileUpdate,
  },
  discussion: {
    create: discussionPostCreate,
    update: discussionPostUpdate,
  },
  practiceDeck: {
    create: practiceDeckCreate,
    update: practiceDeckUpdate,
  },
  practiceCard: {
    create: practiceCardCreate,
    update: practiceCardUpdate,
  },
  studentProgress: {
    upsert: studentProgressUpsert,
  },
  batch: {
    create: batchCreate,
    update: batchUpdate,
  },
  roadmap: {
    create: roadmapCreate,
    taskCreate: roadmapTaskCreate,
  },
} as const;

/**
 * Validate data against a Zod schema.
 * Returns a discriminated union: { success: true, data } | { success: false, error }
 */
export function validate<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const message = result.error.issues
    .map((i) => `${i.path.join('.')}: ${i.message}`)
    .join('; ');
  return { success: false, error: message };
}

/**
 * Validate and throw on failure (for internal service use where
 * invalid data means a programming error, not a user error).
 */
export function validateOrThrow<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> {
  const result = validate(schema, data);
  if (!result.success) {
    throw new Error(`Validation failed: ${result.error}`);
  }
  return result.data;
}

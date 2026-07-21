-- Forward-fixes: marketing homepage showed "13+ Active Learners" using the
-- completion-rate cohort (week 1+ finished, admins excluded), not total learners.
-- Add activeBatches for the public stats row; keep activeLearners internal to completion %.
-- Run in Supabase SQL Editor after 20260724_marketing_active_learner_stats.sql.

CREATE OR REPLACE FUNCTION public.get_public_marketing_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_roadmaps jsonb;
  v_mentors jsonb;
  v_active_batches integer;
  v_active_learners integer;
  v_avg_completion integer;
BEGIN
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', r.id,
        'title', r.title,
        'description', r.description,
        'total_weeks', r.total_weeks,
        'difficulty_level', r.difficulty_level,
        'category', r.category,
        'is_active', r.is_active,
        'created_at', r.created_at,
        'updated_at', r.updated_at,
        'batches', COALESCE((
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', b.id,
              'name', b.name,
              'roadmap_id', b.roadmap_id,
              'max_students', b.max_students,
              'current_students', b.current_students,
              'start_date', b.start_date,
              'end_date', b.end_date,
              'status', b.status,
              'created_at', b.created_at,
              'updated_at', b.updated_at,
              'mentors', COALESCE((
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'id', u.id,
                    'first_name', u.first_name,
                    'last_name', u.last_name,
                    'profile_picture_url', u.profile_picture_url,
                    'role', u.role
                  )
                  ORDER BY u.first_name, u.last_name
                )
                FROM batch_mentors bm
                JOIN users u ON u.id = bm.mentor_id
                WHERE bm.batch_id = b.id
              ), '[]'::jsonb)
            )
            ORDER BY b.start_date DESC NULLS LAST, b.name
          )
          FROM batches b
          WHERE b.roadmap_id = r.id
        ), '[]'::jsonb)
      )
      ORDER BY r.title
    ),
    '[]'::jsonb
  )
  INTO v_roadmaps
  FROM roadmaps r;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', mu.id,
        'first_name', mu.first_name,
        'last_name', mu.last_name,
        'profile_picture_url', mu.profile_picture_url,
        'role', mu.role,
        'mentor_profiles', COALESCE((
          SELECT jsonb_agg(
            jsonb_build_object(
              'designation', mp.designation,
              'organization', mp.organization
            )
          )
          FROM mentor_profiles mp
          WHERE mp.user_id = mu.id
        ), '[]'::jsonb),
        'roadmaps', COALESCE((
          SELECT jsonb_agg(jsonb_build_object('id', rm.id, 'title', rm.title) ORDER BY rm.title)
          FROM (
            SELECT DISTINCT rm.id, rm.title
            FROM batch_mentors bm2
            JOIN batches bb ON bb.id = bm2.batch_id
            JOIN roadmaps rm ON rm.id = bb.roadmap_id
            WHERE bm2.mentor_id = mu.id
          ) rm
        ), '[]'::jsonb)
      )
      ORDER BY mu.first_name, mu.last_name
    ),
    '[]'::jsonb
  )
  INTO v_mentors
  FROM (
    SELECT DISTINCT u.id, u.first_name, u.last_name, u.profile_picture_url, u.role
    FROM users u
    WHERE u.role IN ('mentor', 'admin')
      AND (
        EXISTS (SELECT 1 FROM batch_mentors bm WHERE bm.mentor_id = u.id)
        OR EXISTS (SELECT 1 FROM mentor_profiles mp WHERE mp.user_id = u.id)
      )
  ) mu;

  SELECT COUNT(*)::integer
  INTO v_active_batches
  FROM batches b
  WHERE b.status = 'active';

  WITH active_student_progress AS (
    SELECT
      sba.student_id,
      MAX(COALESCE(sba.progress_percentage, 0)) AS best_progress
    FROM student_batch_assignments sba
    JOIN users u ON u.id = sba.student_id
    WHERE u.role <> 'admin'
      AND COALESCE(sba.completed_weeks, 0) >= 1
    GROUP BY sba.student_id
  )
  SELECT
    COUNT(*)::integer,
    COALESCE(ROUND(AVG(best_progress)), 0)::integer
  INTO v_active_learners, v_avg_completion
  FROM active_student_progress;

  RETURN jsonb_build_object(
    'roadmaps', v_roadmaps,
    'mentors', v_mentors,
    'stats', jsonb_build_object(
      'activeBatches', COALESCE(v_active_batches, 0),
      'activeLearners', COALESCE(v_active_learners, 0),
      'avgCompletionRate', COALESCE(v_avg_completion, 0)
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_public_marketing_data() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_marketing_data() TO anon, authenticated;

-- Verification:
-- SELECT (get_public_marketing_data()->'stats') AS stats;

-- Fix habit_completions unique index (date cast must be immutable)
CREATE UNIQUE INDEX IF NOT EXISTS habit_completions_habit_day_uidx
  ON public.habit_completions (habit_id, ((completed_at AT TIME ZONE 'UTC')::date));

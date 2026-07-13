-- Row Level Security policies

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- User settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_settings_select_own" ON public.user_settings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "user_settings_insert_own" ON public.user_settings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "user_settings_update_own" ON public.user_settings FOR UPDATE USING (user_id = auth.uid());

-- Tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_all_own" ON public.tags FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_select_own" ON public.categories FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL);
CREATE POLICY "categories_insert_own" ON public.categories FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "categories_update_own" ON public.categories FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "categories_delete_own" ON public.categories FOR DELETE USING (user_id = auth.uid());

-- Goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "goals_select_own" ON public.goals FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL);
CREATE POLICY "goals_insert_own" ON public.goals FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "goals_update_own" ON public.goals FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "goals_delete_own" ON public.goals FOR DELETE USING (user_id = auth.uid());

-- Milestones
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "milestones_all_own" ON public.milestones FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_select_own" ON public.tasks FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL);
CREATE POLICY "tasks_select_trash" ON public.tasks FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NOT NULL);
CREATE POLICY "tasks_insert_own" ON public.tasks FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "tasks_update_own" ON public.tasks FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "tasks_delete_own" ON public.tasks FOR DELETE USING (user_id = auth.uid());

-- Task tags
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "task_tags_all" ON public.task_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_id AND t.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.tasks t WHERE t.id = task_id AND t.user_id = auth.uid()));

-- Task checklist
ALTER TABLE public.task_checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "task_checklist_all_own" ON public.task_checklist_items FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Task dependencies
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "task_deps_all_own" ON public.task_dependencies FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Task attachments
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "task_attachments_all_own" ON public.task_attachments FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Calendar events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "calendar_select_own" ON public.calendar_events FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL);
CREATE POLICY "calendar_insert_own" ON public.calendar_events FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "calendar_update_own" ON public.calendar_events FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "calendar_delete_own" ON public.calendar_events FOR DELETE USING (user_id = auth.uid());

-- Habits
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "habits_select_own" ON public.habits FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL);
CREATE POLICY "habits_insert_own" ON public.habits FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "habits_update_own" ON public.habits FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "habits_delete_own" ON public.habits FOR DELETE USING (user_id = auth.uid());

-- Habit completions
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "habit_completions_all_own" ON public.habit_completions FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Payment methods
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payment_methods_all_own" ON public.payment_methods FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Budgets
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "budgets_all_own" ON public.budgets FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transactions_select_own" ON public.transactions FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "transactions_update_own" ON public.transactions FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "transactions_delete_own" ON public.transactions FOR DELETE USING (user_id = auth.uid());

-- Transaction tags
ALTER TABLE public.transaction_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "transaction_tags_all" ON public.transaction_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.transactions tr WHERE tr.id = transaction_id AND tr.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.transactions tr WHERE tr.id = transaction_id AND tr.user_id = auth.uid()));

-- Note folders
ALTER TABLE public.note_folders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "note_folders_all_own" ON public.note_folders FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notes_select_own" ON public.notes FOR SELECT USING (user_id = auth.uid() AND deleted_at IS NULL);
CREATE POLICY "notes_insert_own" ON public.notes FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "notes_update_own" ON public.notes FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "notes_delete_own" ON public.notes FOR DELETE USING (user_id = auth.uid());

-- Note tags
ALTER TABLE public.note_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "note_tags_all" ON public.note_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.notes n WHERE n.id = note_id AND n.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.notes n WHERE n.id = note_id AND n.user_id = auth.uid()));

-- Note links
ALTER TABLE public.note_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "note_links_all_own" ON public.note_links FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Activity log
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_log_select_own" ON public.activity_log FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "activity_log_insert_own" ON public.activity_log FOR INSERT WITH CHECK (user_id = auth.uid());

-- Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('attachments', 'attachments', false, 10485760, NULL),
  ('receipts', 'receipts', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('note-images', 'note-images', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Avatars storage policies
CREATE POLICY "avatars_select" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "avatars_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Attachments storage policies
CREATE POLICY "attachments_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "attachments_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "attachments_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "attachments_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Receipts storage policies
CREATE POLICY "receipts_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "receipts_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "receipts_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "receipts_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Note images storage policies
CREATE POLICY "note_images_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'note-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "note_images_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'note-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "note_images_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'note-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "note_images_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'note-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to all study documents that are completed and not deleted
CREATE POLICY "Public can view study_documents" ON public.study_documents FOR SELECT USING (status != 'deleted');
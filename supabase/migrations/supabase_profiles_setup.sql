-- 1. Membuat Fungsi Trigger untuk otomatis menyalin user baru dari auth.users ke public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, created_at, updated_at)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    NOW(),
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Menempelkan Fungsi Trigger tersebut ke aksi INSERT pada tabel auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. [KRITIKAL] Menyalin user lama yang nyangkut/belum punya profil (seperti akun milikmu saat ini) agar error FKEY hilang
-- Menggunakan kolom 'name' untuk menyesuaikan schema asli Init Database-mu
INSERT INTO public.profiles (id, name, created_at, updated_at)
SELECT 
  id, 
  raw_user_meta_data->>'full_name',
  NOW(),
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);

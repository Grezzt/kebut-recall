import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; error?: string; message?: string; email?: string }>
}) {
  const supabase = await createClient()
  const { mode, error, message, email: emailParam } = await searchParams
  const isRegister = mode === 'register'
  const isVerify = mode === 'verify'

  // Return to dashboard if already logged in
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  const signInWithGoogle = async () => {
    "use server"

    const supabase = await createClient()
    const origin = (await headers()).get('origin')

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      console.error(error)
      return redirect('/login?error=Could not authenticate user')
    }

    if (data.url) {
      redirect(data.url) // Navigate to Google sign in
    }
  }

  const signInWithPassword = async (formData: FormData) => {
    "use server"

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?error=Email atau password salah')
    }

    return redirect('/dashboard')
  }

  const signUp = async (formData: FormData) => {
    "use server"

    const origin = (await headers()).get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    })

    if (error) {
      return redirect('/login?mode=register&error=Gagal mendaftar')
    }

    return redirect(`/login?mode=verify&email=${encodeURIComponent(email)}&message=Cek email kamu untuk kode OTP (8 digit) atau link verifikasi`)
  }

  const verifyOtp = async (formData: FormData) => {
    "use server"
    const email = formData.get('email') as string
    const token = formData.get('token') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    })

    if (error) {
      return redirect(`/login?mode=verify&email=${encodeURIComponent(email)}&error=Kode OTP salah atau kadaluarsa`)
    }

    return redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark p-4 font-sans">
      {/* Background decoration to match landing page */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-purple/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-dark/60 p-8 shadow-2xl backdrop-blur-xl text-center">
        <Link href="/" className="inline-block relative">
          <h1 className="text-2xl font-extrabold text-white mb-2 pb-1">
            Kebut
            <span className="text-yellow"> Recall</span>
          </h1>
        </Link>
        <p className="text-sm text-gray mb-8">
          {isVerify
            ? "Masukkan kode OTP yang dikirim ke email Anda."
            : isRegister
            ? "Mulai perjalanan sukses ujian dengan AI."
            : "Masuk untuk melanjutkan sesi belajarmu."}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-lg bg-green/10 p-3 text-sm text-green border border-green/20">
            {message}
          </div>
        )}

        {isVerify ? (
          <form action={verifyOtp} className="flex flex-col gap-4 text-left">
            <input type="hidden" name="email" value={emailParam || ''} />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray" htmlFor="token">
                Kode OTP (8 Digit)
              </label>
              <input
                id="token"
                name="token"
                type="text"
                maxLength={8}
                placeholder="12345678"
                required
                className="w-full tracking-widest text-center text-2xl rounded-xl border border-white/10 bg-dark-90 px-4 py-3 text-white placeholder-white/30 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
              />
            </div>
            <button
              type="submit"
              className="mt-2 flex w-full justify-center rounded-xl bg-purple px-4 py-3 text-sm font-bold text-white transition hover:bg-purple/90"
            >
              Verifikasi OTP
            </button>
            <div className="mt-4 text-center text-sm text-gray">
              Kembali ke <Link href="/login" className="text-white hover:underline">Halaman Login</Link>
            </div>
          </form>
        ) : (
          <>
            <form action={signInWithGoogle} className="mb-6">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26537 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            Lanjutkan dengan Google
          </button>
        </form>

        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative z-10 bg-dark px-3 text-xs text-gray uppercase tracking-wider bg-opacity-100 mix-blend-normal relative before:absolute before:inset-0 before:bg-dark before:-z-10">
            atau dengan email
          </div>
        </div>

        <form action={isRegister ? signUp : signInWithPassword} className="flex flex-col gap-4 text-left">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray" htmlFor="email">
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="kebut@semalam.com"
              required
              className="w-full rounded-xl border border-white/10 bg-dark-90 px-4 py-3 text-white placeholder-white/30 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray" htmlFor="password">
              Password {isRegister && "(Min. 6 Karakter)"}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={isRegister ? 6 : undefined}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-white/10 bg-dark-90 px-4 py-3 text-white placeholder-white/30 focus:border-purple focus:outline-none focus:ring-1 focus:ring-purple"
            />
          </div>

          <button
            type="submit"
            className="mt-2 flex w-full justify-center rounded-xl bg-purple px-4 py-3 text-sm font-bold text-white transition hover:bg-purple/90"
          >
            {isRegister ? "Buat Akun" : "Masuk"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray">
          {isRegister ? (
            <>
              Sudah punya akun?{" "}
              <Link href="/login" className="text-white font-medium hover:underline">
                Masuk di sini
              </Link>
            </>
          ) : (
            <>
              Belum punya akun?{" "}
              <Link href="/login?mode=register" className="text-white font-medium hover:underline">
                Daftar sekarang
              </Link>
            </>
          )}
        </div>
        </>
        )}

        <div className="mt-8 text-xs text-white/30">
          Aman dan terenkripsi menggunakan Supabase Auth
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const router = useRouter()

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000"
      }
    })
  }

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        router.push("/dashboard")
      }
      if (!user) {
  router.push("/")
}

    }

    checkUser()
  }, [])



  return (
  <div className="relative min-h-screen bg-[#0b1120] text-white overflow-hidden flex items-center justify-center px-6">

  {/* Animated Gradient Background */}
  <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
  <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

  <div className="relative max-w-4xl text-center">

    {/* Logo / Brand */}
    <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
      Organize Your Web
      <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
        Beautifully & Securely
      </span>
    </h1>

    {/* Subtitle */}
    <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
      Smart Bookmark helps you save, manage and access your favorite links 
      with realtime sync and secure Google authentication.
    </p>

    {/* CTA Section */}
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md mx-auto hover:scale-[1.02] transition duration-500">

      <button
        onClick={loginWithGoogle}
        className="group w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-4 rounded-xl transition-all duration-300 hover:bg-gray-200 hover:shadow-lg"
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.74 1.22 9.25 3.62l6.91-6.91C35.64 2.25 30.18 0 24 0 14.82 0 6.86 5.48 2.96 13.44l8.09 6.28C13.17 13.03 18.18 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.14 24.5c0-1.64-.15-3.21-.43-4.73H24v9h12.44c-.54 2.91-2.18 5.38-4.65 7.04l7.18 5.59C43.96 37.41 46.14 31.48 46.14 24.5z"/>
          <path fill="#FBBC05" d="M11.05 28.28A14.49 14.49 0 019.5 24c0-1.48.25-2.92.7-4.28l-8.09-6.28A23.93 23.93 0 000 24c0 3.87.93 7.52 2.6 10.72l8.45-6.44z"/>
          <path fill="#34A853" d="M24 48c6.18 0 11.64-2.04 15.52-5.54l-7.18-5.59c-2 1.34-4.56 2.13-8.34 2.13-5.82 0-10.83-3.53-12.95-8.22l-8.45 6.44C6.86 42.52 14.82 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      <p className="text-xs text-gray-500 mt-5">
        Secure authentication powered by Google
      </p>

    </div>

    {/* Feature Badges */}
    <div className="flex justify-center gap-6 mt-12 text-sm text-gray-400">
      <span className="bg-white/5 px-4 py-2 rounded-full border border-white/10">
        🔒 Secure
      </span>
      <span className="bg-white/5 px-4 py-2 rounded-full border border-white/10">
        ⚡ Realtime Sync
      </span>
      <span className="bg-white/5 px-4 py-2 rounded-full border border-white/10">
        ☁ Cloud Based
      </span>
    </div>

  </div>
</div>


  )
}

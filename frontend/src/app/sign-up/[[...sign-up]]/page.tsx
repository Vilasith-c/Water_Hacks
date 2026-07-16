"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to create account. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to sign up with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-black p-6">
      <div className="bg-[#111]/80 border border-[#222] rounded-2xl shadow-2xl max-w-md w-full p-8 backdrop-blur-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gold-600/10 text-gold-400 rounded-xl flex items-center justify-center mx-auto mb-4 border border-gold-500/20 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
          <p className="text-sm text-gray-400">Join your team&apos;s secure enterprise workspace.</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@company.com"
              className="w-full bg-[#050505] border border-[#222] rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full bg-[#050505] border border-[#222] rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-gold-500/50 focus:border-gold-500/50 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold-600 to-gold-500 text-black hover:from-gold-500 hover:to-gold-400 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(205,157,57,0.3)] transition-all duration-200 active:scale-95 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-[#222]"></div>
          <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-semibold uppercase">Or continue with</span>
          <div className="flex-grow border-t border-[#222]"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full bg-[#1a1a1a] hover:bg-[#222] text-white border border-[#333] font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        {/* Sign In Redirect */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-gold-500 hover:text-gold-400 font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

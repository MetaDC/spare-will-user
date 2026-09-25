import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { LOGO_URL } from "../data/mockData";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";

export const SignInScreen: React.FC = () => {
  const { signIn, signInWithGoogle, navigate, goBack, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    signIn(email.trim(), password);
  };

  const handleGoogleSignIn = () => {
    showToast("Signing in with Google...", "info");
    signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc] px-4 py-8 max-w-sm mx-auto w-full justify-between">
      {/* Header with Back Button and Logo */}
      <header className="flex flex-col items-center pt-2 pb-6">
        <div className="w-full flex items-center justify-between mb-6 -ml-2">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#181c1e] hover:bg-[#ebeef0] active:scale-95 transition-all cursor-pointer relative z-10"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("home")}
            className="focus:outline-none group cursor-pointer"
            aria-label="Spare Will Home"
          >
            <div className="flex items-center justify-center py-2">
              <img
                src={LOGO_URL}
                alt="Spare Will"
                className="w-[140px] sm:w-[160px] h-auto object-contain transition-transform group-active:scale-95"
              />
            </div>
          </button>
          <div className="w-10" />
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#181c1e] text-center w-full">
          Sign In
        </h1>
        <p className="text-sm text-[#43474c] text-center mt-1.5 w-full">
          Welcome back to modern automotive service.
        </p>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex flex-col justify-center">
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-[#181c1e] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#73777d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="you@example.com"
                className={`w-full h-12 pl-10 pr-4 bg-white border rounded-xl text-sm text-[#181c1e] placeholder:text-[#73777d] outline-none shadow-2xs transition-all ${
                  errors.email
                    ? "border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]"
                    : "border-[#c3c7cd] focus:border-[#fb7800] focus:ring-1 focus:ring-[#fb7800]"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-[#ba1a1a] mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#181c1e] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#73777d] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full h-12 pl-10 pr-11 bg-white border rounded-xl text-sm text-[#181c1e] placeholder:text-[#73777d] outline-none shadow-2xs transition-all ${
                  errors.password
                    ? "border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]"
                    : "border-[#c3c7cd] focus:border-[#fb7800] focus:ring-1 focus:ring-[#fb7800]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#73777d] hover:text-[#181c1e] p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-[#ba1a1a] mt-1">{errors.password}</p>
            )}

            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                onClick={() => navigate("forgot-password")}
                className="text-xs font-semibold text-[#fb7800] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full h-12 bg-[#fb7800] hover:bg-[#e06c00] text-white font-heading font-bold text-base rounded-xl shadow-[0_4px_16px_rgba(251,120,0,0.3)] active:scale-[0.99] transition-all cursor-pointer mt-2"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-[#e0e3e5]" />
          <span className="mx-4 text-xs font-bold text-[#73777d] uppercase tracking-wider">
            OR
          </span>
          <div className="flex-1 border-t border-[#e0e3e5]" />
        </div>

        {/* Social Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full h-12 bg-white border border-[#c3c7cd] hover:bg-[#f7fafc] text-[#181c1e] font-heading font-bold text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-2xs active:scale-[0.99] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
      </main>

      {/* Footer */}
      <footer className="pt-6 pb-2 text-center">
        <p className="text-sm text-[#43474c]">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("signup")}
            className="font-heading font-bold text-[#fb7800] hover:underline ml-1"
          >
            Sign Up
          </button>
        </p>
      </footer>
    </div>
  );
};

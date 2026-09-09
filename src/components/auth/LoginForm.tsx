"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { useTranslations } from "next-intl";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password, rememberMe });
      
      // Based on server response: { success: true, data: { accessToken: "...", refreshToken: "..." } }
      const token = response.data?.data?.accessToken || response.data?.accessToken || response.data?.token || response.data?.data?.token;
      const user = response.data?.data?.user || response.data?.user || { email }; // Fallback to email if user object missing

      if (token) {
        login(token, user);
      } else {
        setError(t("invalid_response"));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t("login_failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">{t("welcome_back")}</h1>
        <p className="text-slate-500">{t("login_subtitle")}</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">{t("email")}</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("email_placeholder")}
            className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500/20"
          />

          {/* Auto fill buttons for quick testing. later remove them */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setEmail("shakayet.dev@gmail.com");
                setPassword("12345678");
              }}
              className="text-[11px] font-medium px-2 py-1 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-lg transition-all border border-slate-200 active:scale-95"
            >
              {t("admin_login")}
            </button>
          </div>
        </div>
        <div className="space-y-2 text-left">
          <label className="text-sm font-medium text-slate-700">{t("password")}</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password_placeholder")}
              className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500/20 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2" onClick={() => setRememberMe(!rememberMe)}>
            <div className={`h-4 w-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-slate-200 bg-slate-50 hover:border-blue-500'}`}>
              {rememberMe && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-sm text-slate-500">{t("remember_password")}</span>
          </div>
          <Link href="/reset" className="text-sm text-slate-900 underline hover:text-blue-600 transition-colors">
            {t("forgot_password")}
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-bold bg-[#FF6B00] hover:bg-[#e56000] text-white shadow-lg shadow-[#FF6B00]/20 transition-all focus:ring-4 focus:ring-[#FF6B00]/30 active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? t("logging_in") : t("login_button")}
        </Button>
      </form>
    </div>
  );
}

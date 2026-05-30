"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, AlertTriangle, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Lütfen tüm alanları doldurun.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Giriş işlemi başarısız.");
      }

      // Login success, redirect to homepage editor
      router.push("/admin/edit/home");
      router.refresh();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Giriş yapılırken beklenmedik bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-bg text-dark-text flex flex-col justify-between select-none">
      {/* Background Subtle Overlay Grid */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,rgba(197,22,46,0.06)_0%,transparent_60%)] z-0" />
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] z-0" />

      {/* Spacing Header */}
      <header className="relative z-10 px-8 py-8 flex justify-center sm:justify-start">
        <div className="flex flex-col text-center sm:text-left">
          <span className="text-sm font-semibold tracking-[0.2em]">TANER TÜMER</span>
          <span className="mt-0.5 text-[10px] font-medium tracking-[0.32em] text-[#C5162E] uppercase">İNŞAAT</span>
        </div>
      </header>

      {/* Main Form Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] bg-[#0E1013] border border-neutral-800 p-8 sm:p-10 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col mb-8 text-center sm:text-left">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#C5162E]">
              Giriş Portalı
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-dark-text uppercase">
              YÖNETİM MODU
            </h2>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              Visual Editor görsel içerik düzenleme arayüzünü açmak için kimlik bilgilerinizi doğrulayın.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 flex items-start gap-3 bg-[#1C1415] border-l-2 border-[#C5162E] p-4 text-xs text-neutral-200">
              <AlertTriangle className="h-4.5 w-4.5 text-[#C5162E] shrink-0" />
              <div className="flex flex-col">
                <span className="font-bold font-mono uppercase text-[9px] text-[#C5162E]">Giriş Hatası</span>
                <span className="mt-1 leading-relaxed">{errorMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* E-posta input field */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                E-posta Adresi
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  placeholder="admin@tanertumerinsaat.com"
                  className="w-full bg-[#13161A] border border-neutral-800 pl-10 pr-4 py-2.5 text-xs text-dark-text placeholder-neutral-600 focus:outline-none focus:border-[#C5162E]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Şifre input field */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="w-full bg-[#13161A] border border-neutral-800 pl-10 pr-4 py-2.5 text-xs text-dark-text placeholder-neutral-600 focus:outline-none focus:border-[#C5162E]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 w-full flex h-12 items-center justify-center bg-surface text-[#08090B] font-mono text-[10px] font-bold uppercase tracking-[0.24em] transition-colors hover:bg-neutral-200 cursor-pointer disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Doğrulanıyor...
                </>
              ) : (
                <>
                  GİRİŞ YAP
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer copyright section */}
      <footer className="relative z-10 px-8 py-8 text-center sm:text-left">
        <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500">
          © {new Date().getFullYear()} Taner Tümer İnşaat. Tüm Hakları Saklıdır.
        </span>
      </footer>
    </div>
  );
}

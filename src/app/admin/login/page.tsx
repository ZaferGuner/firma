"use client";

import React, { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/admin-auth";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <div className="min-h-screen bg-[#24282C] text-white flex flex-col">
      <header className="px-8 py-8 flex justify-center sm:justify-start">
        <div className="flex flex-col text-center sm:text-left">
          <span className="text-sm font-semibold tracking-[0.2em] text-white">TANER TÜMER</span>
          <span className="mt-0.5 text-[10px] font-medium tracking-[0.32em] text-white uppercase">İNŞAAT</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[380px] border border-white/15 bg-[#24282C] p-8">
          <div className="flex flex-col mb-8 text-center sm:text-left">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-white/60">
              Giriş Portalı
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white uppercase">
              YÖNETİM MODU
            </h2>
          </div>

          {state.error && (
            <div className="mb-6 border border-white/15 p-4 text-xs text-white">
              <div className="flex flex-col gap-1">
                <span className="font-bold font-mono uppercase text-[9px] text-white">Giriş Hatası</span>
                <span className="mt-1 leading-relaxed">{state.error}</span>
              </div>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] font-bold uppercase tracking-wider text-white/65">
                E-posta Adresi
              </label>
              <input
                type="email"
                name="email"
                required
                disabled={isPending}
                placeholder="admin@tanertumerinsaat.com"
                className="w-full bg-[#1B1F23] border border-white/15 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[9px] font-bold uppercase tracking-wider text-white/65">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                required
                disabled={isPending}
                placeholder="••••••••"
                className="w-full bg-[#1B1F23] border border-white/15 px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white disabled:opacity-60"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full h-12 bg-white text-[#24282C] font-mono text-[10px] font-bold uppercase tracking-[0.24em] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "DOĞRULANIYOR..." : "GİRİŞ YAP"}
            </button>
          </form>
        </div>
      </main>

      <footer className="px-8 py-8 text-center sm:text-left">
        <span className="font-mono text-[8px] uppercase tracking-widest text-white/35">
          © {new Date().getFullYear()} Taner Tümer İnşaat. Tüm Hakları Saklıdır.
        </span>
      </footer>
    </div>
  );
}

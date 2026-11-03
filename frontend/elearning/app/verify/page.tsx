'use client'

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import BKNavbar from "@/components/BKNavbar";
import Footer from "@/components/Footer";

export default function VerifyIndex() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (normalized) router.push(`/verify/${encodeURIComponent(normalized)}`);
  };

  return (
    <>
      <BKNavbar />
      <main className="bp-grid border-b border-bk-line">
        <div className="section-shell py-20 sm:py-28">
          <p className="eyebrow">Xác minh chứng chỉ</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-bk-ink sm:text-5xl">
            Kiểm tra một chứng chỉ có <span className="text-bk-navy">thật</span> hay không.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-bk-slate">
            Nhập mã in trên chứng chỉ (dạng BK-XXXX-XXXX-XXXX) hoặc quét mã QR trên bản PDF.
          </p>

          <form onSubmit={submit} className="mt-8 flex max-w-xl items-center gap-2 rounded-lg border border-bk-line bg-white p-1.5 pl-4 focus-within:border-bk-blue">
            <ShieldCheck className="h-4 w-4 shrink-0 text-bk-slate" strokeWidth={1.5} />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-label="Mã chứng chỉ"
              placeholder="BK-XXXX-XXXX-XXXX"
              autoCapitalize="characters"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent py-2 font-mono text-sm uppercase tracking-wider text-bk-ink outline-none placeholder:text-bk-slate/60"
            />
            <button type="submit" className="button-primary px-4 py-2">
              Xác minh <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

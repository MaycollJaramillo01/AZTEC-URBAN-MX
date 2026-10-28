"use client";
import { useParams } from "next/navigation";
import { dictionary } from "@/lib/i18n";
export default function ErrorPage({ reset }: { reset: () => void }) {
  const params = useParams();
  const t = dictionary(params.lang === "es" ? "es" : "en");
  return (
    <div className="container section">
      <h1>{t.common.error}</h1>
      <button className="button" onClick={reset}>
        {t.common.retry}
      </button>
    </div>
  );
}

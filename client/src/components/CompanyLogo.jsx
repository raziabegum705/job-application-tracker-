import { useState } from "react";

// Generates a deterministic color from a string (for fallback avatar)
const colorFromString = (str = "") => {
  const colors = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-orange-500",
    "bg-pink-500", "bg-cyan-500", "bg-amber-500", "bg-rose-500",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// Best-effort guess at a domain from a company name (for Clearbit logo lookup)
const guessDomain = (company = "") => {
  const slug = company.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  return slug ? `${slug}.com` : null;
};

export default function CompanyLogo({ company, size = 40, className = "" }) {
  const [errored, setErrored] = useState(false);
  const domain = guessDomain(company);
  const initial = company?.charAt(0)?.toUpperCase() || "?";

  if (!domain || errored) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl text-white font-semibold flex-shrink-0 ${colorFromString(company)} ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        aria-label={company}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={company + " logo"}
      onError={() => setErrored(true)}
      className={`rounded-xl object-contain bg-white border border-line dark:border-slate-700 flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

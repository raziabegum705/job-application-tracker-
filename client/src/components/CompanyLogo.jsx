import { useState } from "react";

const colorFromString = (str = "") => {
  const colors = [
    "bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-orange-500",
    "bg-pink-500", "bg-cyan-500", "bg-amber-500", "bg-rose-500",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// Companies whose website is not simply <name>.com
const DOMAINS = {
  hcl: "hcltech.com",
  hcltech: "hcltech.com",
  lti: "ltimindtree.com",
  ltimindtree: "ltimindtree.com",
  techm: "techmahindra.com",
  meta: "meta.com",
  facebook: "meta.com",
  amazonwebservices: "aws.amazon.com",
  aws: "aws.amazon.com",
  tataconsultancyservices: "tcs.com",
  tcs: "tcs.com",
  samsung: "samsung.com",
  sap: "sap.com",
};

const guessDomain = (company = "") => {
  const slug = company.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  if (!slug) return null;
  return DOMAINS[slug] || `${slug}.com`;
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
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
      alt={company + " logo"}
      onError={() => setErrored(true)}
      onLoad={(e) => {
        // Google returns a tiny generic globe when a site has no icon
        if (e.target.naturalWidth <= 16) setErrored(true);
      }}
      className={`rounded-xl object-contain bg-white border border-line dark:border-slate-700 p-1 flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
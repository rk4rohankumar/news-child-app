import { useState } from "react";
import { motion } from "framer-motion";

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
};

const gradientFor = (seed = "") => {
  const palettes = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-sky-500 via-cyan-500 to-emerald-500",
    "from-amber-500 via-orange-500 to-rose-500",
    "from-slate-700 via-slate-600 to-slate-500",
    "from-fuchsia-600 via-violet-600 to-blue-600",
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return palettes[Math.abs(hash) % palettes.length];
};

const domainOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const faviconFor = (url, size = 128) => {
  const d = domainOf(url);
  if (!d) return "";
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=${size}`;
};

const PlaceholderIcon = () => (
  <svg
    className="w-16 h-16 rounded-xl bg-white/90 p-3 text-gray-700 shadow-md"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M4 5h13a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V5z" />
    <path d="M19 7v10a2 2 0 0 0 2 2" />
    <path d="M7 9h6M7 13h8M7 17h8" />
  </svg>
);

const ArticleCard = ({ article }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [faviconFailed, setFaviconFailed] = useState(false);

  const published = formatDate(article.publishedAt);
  const source = article.source?.name;
  const domain = domainOf(article.url);
  const favicon = faviconFor(article.url);
  const showImage = Boolean(article.urlToImage) && !imageFailed;

  return (
    <motion.article
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Fixed 16:9 box so cards keep their height whether the image loads, fails, or is absent. */}
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        {showImage ? (
          <img
            src={article.urlToImage}
            alt={`${source || "Article"} cover for: ${article.title}`}
            loading="lazy"
            decoding="async"
            width="640"
            height="360"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className={`absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 bg-gradient-to-br ${gradientFor(
              source || article.title
            )}`}
          >
            {favicon && !faviconFailed ? (
              <img
                src={favicon}
                srcSet={`${faviconFor(article.url, 64)} 1x, ${favicon} 2x`}
                alt={`${domain} site icon`}
                loading="lazy"
                decoding="async"
                width="64"
                height="64"
                onError={() => setFaviconFailed(true)}
                onLoad={(e) => {
                  // Sites that only ship a 16px favicon would upscale into a blur; use the placeholder instead.
                  if (e.currentTarget.naturalWidth < 32) setFaviconFailed(true);
                }}
                className="w-16 h-16 rounded-xl bg-white/90 p-2 shadow-md"
              />
            ) : (
              <PlaceholderIcon />
            )}
            <span className="text-white text-sm font-semibold text-center line-clamp-2 drop-shadow">
              {domain || source || article.title}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-3 rounded focus-within:ring-2 focus-within:ring-blue-500">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline hover:text-blue-700 focus:outline-none"
          >
            {article.title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </h2>
        {article.description && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {article.description}
          </p>
        )}
        {article.meta && (
          <p className="text-xs text-gray-500 mb-2">{article.meta}</p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          {source && <span className="font-medium">{source}</span>}
          {published && <time dateTime={article.publishedAt}>{published}</time>}
        </div>
      </div>
    </motion.article>
  );
};

export default ArticleCard;

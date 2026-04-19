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

const ArticleCard = ({ article }) => {
  const published = formatDate(article.publishedAt);
  const source = article.source?.name;
  const hasImage = Boolean(article.urlToImage);

  return (
    <motion.article
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {hasImage ? (
        <img
          src={article.urlToImage}
          alt=""
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="w-full h-52 object-cover bg-gray-100"
        />
      ) : (
        <div
          aria-hidden="true"
          className={`w-full h-52 flex items-center justify-center px-4 bg-gradient-to-br ${gradientFor(
            source || article.title
          )}`}
        >
          <span className="text-white text-lg font-semibold text-center line-clamp-3">
            {source || article.title}
          </span>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-3">
          {article.title}
        </h2>
        {article.description && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">
            {article.description}
          </p>
        )}
        {article.meta && (
          <p className="text-xs text-gray-500 mb-2">{article.meta}</p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500 mb-2">
          {source && <span className="font-medium">{source}</span>}
          {published && <time dateTime={article.publishedAt}>{published}</time>}
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label={`Read full article: ${article.title}`}
        >
          Read more &rarr;
        </a>
      </div>
    </motion.article>
  );
};

export default ArticleCard;

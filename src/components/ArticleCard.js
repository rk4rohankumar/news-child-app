import { motion } from "framer-motion";

const FALLBACK_IMG = "https://via.placeholder.com/400x200?text=No+Image";

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

const ArticleCard = ({ article }) => {
  const published = formatDate(article.publishedAt);
  const source = article.source?.name;

  return (
    <motion.article
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={article.urlToImage || FALLBACK_IMG}
        alt=""
        loading="lazy"
        decoding="async"
        onError={(e) => {
          if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG;
        }}
        className="w-full h-52 object-cover bg-gray-100"
      />
      <div className="p-4 flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h2>
        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{article.description}</p>
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

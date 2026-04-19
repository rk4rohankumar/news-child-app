import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import ArticleCard from "./components/ArticleCard";
import Loader from "./components/Loader";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import useDebouncedValue from "./hooks/useDebouncedValue";

const PAGE_SIZE = 12;
const CATEGORIES = [
  "general",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
];

const NewsPage = () => {
  const apiKey = process.env.REACT_APP_NEWS_API_KEY;
  const missingKey = !apiKey || apiKey === "YOUR_KEY_HERE";

  const [news, setNews] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("general");
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);

  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  const fetchNews = useCallback(async () => {
    if (missingKey) {
      setLoading(false);
      setError("Missing NewsAPI key.");
      return;
    }

    setLoading(true);
    setError(null);

    const params = {
      country: "us",
      category,
      pageSize: PAGE_SIZE,
      page,
      apiKey,
    };
    if (debouncedSearch.trim()) params.q = debouncedSearch.trim();

    try {
      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params,
      });
      const data = response.data;
      if (data.status === "error") {
        setError(data.message || "NewsAPI returned an error.");
        setNews([]);
        setTotalResults(0);
      } else {
        setNews(Array.isArray(data.articles) ? data.articles : []);
        setTotalResults(data.totalResults || 0);
      }
    } catch (err) {
      const apiMsg = err?.response?.data?.message;
      setError(apiMsg || "Failed to fetch news.");
      setNews([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [apiKey, missingKey, category, debouncedSearch, page]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews, reloadToken]);

  const totalPages = useMemo(() => {
    if (!totalResults) return 0;
    return Math.min(Math.ceil(totalResults / PAGE_SIZE), Math.ceil(100 / PAGE_SIZE));
  }, [totalResults]);

  const handleRetry = () => setReloadToken((n) => n + 1);

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Latest News</h1>

      <form
        role="search"
        aria-label="News search and filter"
        className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="news-search" className="sr-only">
          Search news
        </label>
        <input
          id="news-search"
          type="search"
          placeholder="Search news..."
          className="p-2 border border-gray-300 rounded-md w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label htmlFor="news-category" className="sr-only">
          Category
        </label>
        <select
          id="news-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full sm:w-48 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </form>

      <p className="text-sm text-gray-600 text-center mb-4" aria-live="polite">
        {loading
          ? "Loading results..."
          : error
          ? ""
          : `${totalResults} result${totalResults === 1 ? "" : "s"}${
              debouncedSearch ? ` for "${debouncedSearch}"` : ""
            }`}
      </p>

      {missingKey ? (
        <ErrorState
          message="NewsAPI key is not configured."
          missingKey
          onRetry={handleRetry}
        />
      ) : loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : news.length === 0 ? (
        <EmptyState query={debouncedSearch} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <ArticleCard key={article.url} article={article} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </main>
  );
};

export default NewsPage;

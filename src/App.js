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
  { value: "top", label: "Top Stories", source: "hn", tag: "front_page" },
  { value: "tech", label: "Tech (Stories)", source: "hn", tag: "story" },
  { value: "ask", label: "Ask HN", source: "hn", tag: "ask_hn" },
  { value: "show", label: "Show HN", source: "hn", tag: "show_hn" },
  { value: "space", label: "Space & Science", source: "spaceflight" },
];

const formatHnNumber = (n) => (typeof n === "number" ? n : 0);

const fetchFromHn = async ({ tag, query, page }) => {
  const endpoint = query
    ? "https://hn.algolia.com/api/v1/search"
    : "https://hn.algolia.com/api/v1/search_by_date";
  const params = {
    tags: tag,
    hitsPerPage: PAGE_SIZE,
    page: page - 1,
  };
  if (query) params.query = query;
  const res = await axios.get(endpoint, { params, timeout: 10000 });
  const data = res.data || {};
  const articles = (data.hits || [])
    .filter((h) => h.url && h.title)
    .map((h) => ({
      id: h.objectID,
      title: h.title,
      description: h.story_text
        ? h.story_text.replace(/<[^>]+>/g, "").slice(0, 220)
        : `by ${h.author || "anon"}`,
      urlToImage: null,
      url: h.url,
      publishedAt: h.created_at,
      source: { name: "Hacker News" },
      meta: `${formatHnNumber(h.points)} points · ${formatHnNumber(
        h.num_comments
      )} comments`,
    }));
  return {
    articles,
    totalResults: data.nbHits || articles.length,
    totalPages: Math.min(data.nbPages || 1, 50),
  };
};

const fetchFromSpaceflight = async ({ query, page }) => {
  const params = {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };
  if (query) params.title_contains = query;
  const res = await axios.get(
    "https://api.spaceflightnewsapi.net/v4/articles/",
    { params, timeout: 10000 }
  );
  const data = res.data || {};
  const articles = (data.results || []).map((a) => ({
    id: String(a.id),
    title: a.title,
    description: a.summary,
    urlToImage: a.image_url,
    url: a.url,
    publishedAt: a.published_at,
    source: { name: a.news_site || "Spaceflight News" },
    meta: null,
  }));
  return {
    articles,
    totalResults: data.count || articles.length,
    totalPages: Math.max(1, Math.ceil((data.count || 0) / PAGE_SIZE)),
  };
};

const fetchNews = ({ category, query, page }) => {
  const cat = CATEGORIES.find((c) => c.value === category) || CATEGORIES[0];
  if (cat.source === "spaceflight") return fetchFromSpaceflight({ query, page });
  return fetchFromHn({ tag: cat.tag, query, page });
};

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPagesFromApi, setTotalPagesFromApi] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("top");
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);

  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchNews({
        category,
        query: debouncedSearch.trim(),
        page,
      });
      setNews(result.articles);
      setTotalResults(result.totalResults);
      setTotalPagesFromApi(result.totalPages);
    } catch (err) {
      setError(err?.message || "Failed to fetch news.");
      setNews([]);
      setTotalResults(0);
      setTotalPagesFromApi(0);
    } finally {
      setLoading(false);
    }
  }, [category, debouncedSearch, page]);

  useEffect(() => {
    run();
  }, [run, reloadToken]);

  const totalPages = useMemo(() => totalPagesFromApi, [totalPagesFromApi]);

  const handleRetry = () => setReloadToken((n) => n + 1);

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-2">Latest News</h1>
      <p className="text-center text-xs text-gray-500 mb-6">
        Powered by Hacker News (Algolia) and Spaceflight News — no API key required.
      </p>

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
          className="p-2 border border-gray-300 rounded-md w-full sm:w-56 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
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

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorState message={error} onRetry={handleRetry} />
      ) : news.length === 0 ? (
        <EmptyState query={debouncedSearch} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <ArticleCard key={article.id || article.url} article={article} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </main>
  );
};

export default NewsPage;

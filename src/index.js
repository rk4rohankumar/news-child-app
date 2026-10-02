// Async boundary so webpack can negotiate shared singletons (react, react-dom, …)
// before any of them are evaluated. See src/bootstrap.js for the actual render.
import('./bootstrap');

// Central place for the backend's base URL.
// Falls back to localhost for local dev; set VITE_API_URL in a .env file
// (e.g. VITE_API_URL=https://your-backend.onrender.com) when deploying.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

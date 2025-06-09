// src/config/api.js
// In a Vite project environment variables use the VITE_ prefix and are
// accessed through import.meta.env.  Using process.env leaves the value
// undefined during the build which caused requests to be sent to
// `undefined/...`.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export {
    API_BASE_URL,
    API_BASE_URL as API_URL,
    // Add other constants if needed
}
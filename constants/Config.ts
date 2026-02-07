// Using the production URL for both dev and prod for now to ensure connectivity
// Ideally, for local dev, you would use your machine's IP address (e.g. 192.168.1.x) or localhost via adb reverse
const productionUrl = "https://managemymoneyapi-production.up.railway.app";
const devUrl = "https://managemymoneyapi-production.up.railway.app";

export const API_URL = __DEV__ ? devUrl : productionUrl;

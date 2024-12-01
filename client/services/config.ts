import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Axios instance for public api calls
 */

export const axiosPublicInstance = axios.create();

axiosPublicInstance.interceptors.request.use(undefined, (error) => {
  const { config, response } = error;
  const { method, url } = config;
  const status = response ? response.status : "No response";

  const errorMessage = `API request failed: ${method.toUpperCase()} ${url} returned status ${status}`;

  // eslint-disable-next-line no-console
  console.error(errorMessage);

  return Promise.reject(error);
});

/**
 * Axios instance for authorized api calls
 */

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.defaults.adapter = require("axios/lib/adapters/http"); // Required for axios to work in the browser

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = Cookies.get("access_token");
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = config.headers["Authorization"] =
          `Bearer ${accessToken}`;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error setting authorization header:", error);
    }

    return config;
  },
  (error) => {
    const { config, response } = error;
    const { method, url } = config;
    const status = response ? response.status : "No response";

    const errorMessage = `API request failed: ${method.toUpperCase()} ${url} returned status ${status}`;

    // eslint-disable-next-line no-console
    console.error(errorMessage);

    return Promise.reject(error);
  },
);

axiosInstance.interceptors.request.use(undefined, async (error) => {
  if (error?.response?.status === 401) {
    try {
      const accessToken = Cookies.get("access_token");
      const currentUrl = window.location.href;
      // Save current URL for redirect after login
      localStorage.setItem("redirectUrl", currentUrl);
      // logout(); // TODO

      // Show a toast only for the first 401 request.
      // The first failed request can be determined based on presence of access token
      if (accessToken) {
        // use timeout to avoid unmounting a toast during route change
        // setTimeout(() => {
        //   loggedOutToast(""); // TOD
        // }, 500);

        // eslint-disable-next-line no-console
        console.error("Session expired. Redirecting to login page.");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error handling 401 request: ", error);
    }

    const { config, response } = error;
    const { method, url } = config;
    const status = response ? response.status : "No response";

    const errorMessage = `API request failed: ${method.toUpperCase()} ${url} returned status ${status}`;

    // eslint-disable-next-line no-console
    console.error(errorMessage);

    return Promise.reject(error);
  }
});

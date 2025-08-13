import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const WEB_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const API_BASE_PATH =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const http = axios.create({
  baseURL: API_BASE_PATH,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor - following your pattern but without auth
http.interceptors.request.use(async (request: InternalAxiosRequestConfig) => {
  // Add timezone header like in your code
  try {
    request.headers["X-Timezone"] =
      Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (e) {
    console.log(e);
  }

  return request;
});

// Response interceptor - following your exact pattern
http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const response = error?.response;
    if (!response) {
      return Promise.reject(error);
    } else if (response.status === 401) {
      // Handle unauthorized - redirect to login if needed
      console.error("Unauthorized access");
      return Promise.reject({
        message: "Unauthorized access",
        status: response.status,
      });
    } else {
      const data = response?.data as any;
      const errorMessage =
        (data && data?.message) || response.statusText || data?.status?.message;

      return Promise.reject({
        message: errorMessage,
        data: data?.data,
        status: response.status,
        body: data,
      });
    }
  }
);

export { http };

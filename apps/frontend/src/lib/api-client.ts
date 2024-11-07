import axios, {
  type InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import Cookies from "js-cookie";

interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private static instance: ApiClient;
  private readonly client: AxiosInstance;
  private readonly TOKEN_KEY = "auth_token";
  private readonly API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

  private constructor() {
    this.client = axios.create({
      baseURL: this.API_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get(this.TOKEN_KEY);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    const fallbackError: ApiError = {
      message: "An unexpected error occurred",
      status: 500,
    };

    if (!error.response) {
      return {
        ...fallbackError,
        message: "Network error - please check your connection",
        code: "NETWORK_ERROR",
      };
    }

    const status = error.response.status;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const data = error.response.data as any;

    // Handle specific error cases
    switch (status) {
      case 401:
        this.handleUnauthorized();
        return {
          message: "Authentication required",
          status,
          code: "UNAUTHORIZED",
        };
      case 403:
        return {
          message: "You do not have permission to perform this action",
          status,
          code: "FORBIDDEN",
        };
      case 404:
        return {
          message: "The requested resource was not found",
          status,
          code: "NOT_FOUND",
        };
      default:
        return {
          message: data?.message || fallbackError.message,
          status,
          code: data?.code,
        };
    }
  }

  private handleUnauthorized(): void {
    // Clear auth token and redirect to login if needed
    Cookies.remove(this.TOKEN_KEY);
    // You might want to trigger a redirect or auth state update here
  }

  // Token management methods
  public setToken(token: string, expires = 7): void {
    Cookies.set(this.TOKEN_KEY, token, {
      expires, // Days until expiration
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }

  public clearToken(): void {
    Cookies.remove(this.TOKEN_KEY);
  }

  // HTTP method wrappers with type safety
  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url, config);
    return { data: response.data, status: response.status };
  }

  public async post<T>(
    url: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data, config);
    return { data: response.data, status: response.status };
  }

  public async put<T>(
    url: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data, config);
    return { data: response.data, status: response.status };
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url, config);
    return { data: response.data, status: response.status };
  }
}

// Export a singleton instance
const apiClient = ApiClient.getInstance();
export default apiClient;

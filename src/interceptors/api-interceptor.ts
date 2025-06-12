import axios from 'axios';
import { RootState, store } from "@/store/store";
import { updateUser } from "@/store/slices/auth-slice";
import RefreshTokenDTO from "@/DTOs/refresh-token-dto";
import { logoutAsync } from '@/services/auth-service';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const state: RootState = store.getState();
        const token = state.user.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (!config.url?.includes('/login') && token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => {
        if (response.data) {
            response.data = convertDatesToLocal(response.data);
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        const isAuthRoute = originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register") ||
            originalRequest.url?.includes("/auth/refresh-token");

        if ((error.response?.status === 401) && !originalRequest._retry && !isAuthRoute) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: unknown) => {
                            originalRequest.headers["Authorization"] = "Bearer " + token;
                            resolve(api(originalRequest));
                        },
                        reject: (err) => reject(err),
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const state: RootState = store.getState();
                const token: string = state.user.token ?? "";

                const refreshTokenDto: RefreshTokenDTO = {
                    token: token,
                };

                const response = await api.post("/auth/refresh-token", refreshTokenDto, {
                    withCredentials: true,
                });

                store.dispatch(updateUser(response.data));

                processQueue(null, response.data.token);

                originalRequest.headers["Authorization"] = "Bearer " + response.data.token;
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                if (typeof window !== "undefined") {
                    toast.error("Some error occurred. Please login again.");
                }
                await logoutAsync();

                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        const status = error.response?.status;

        const isLoginRoute = originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register")


        if (status === 400)
            toast.error(error.response?.data?.message || "Invalid request.");


        if (status === 401)
            if (isLoginRoute)
                toast.error(error.response?.data?.message || "Session expired. Please login again.");

        if (status === 403)
            toast.error(error.response?.data?.message || "You don't have permission to perform this action.");


        if (status === 404)
            toast.error(error.response?.data?.message || "Requested resource not found.");


        return Promise.reject(error);
    }
);

function parseUtcDate(dateStr: string): Date {
  if (!dateStr.endsWith("Z")) {
    return new Date(dateStr + "Z");
  }
  return new Date(dateStr);
}

function isIsoDateString(value: any): boolean {
  if (typeof value !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/.test(value);
}

function convertDatesToLocal(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToLocal);
  } else if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        if (isIsoDateString(val)) {
          const date = parseUtcDate(val);
          newObj[key] = date.toLocaleString('en-US');
        } else if (typeof val === "object" && val !== null) {
          newObj[key] = convertDatesToLocal(val);
        } else {
          newObj[key] = val;
        }
      }
    }
    return newObj;
  }
  return obj;
}

export default api;
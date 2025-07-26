import type { AxiosError, AxiosInstance } from "axios";
import axios from "axios";
import HttpStatusCode from "../constants/httpStatusCode.enum";
import { toast } from "react-toastify";
import {
  clearAccessTokenFromLS,
  getAccessTokenToLS,
  getRefreshTokenFromLS,
  setAccessTokenFromLS,
  setProfileToLS,
  setRefreshTokenToLS,
} from "./auth";
import type { AuthResponse, RefreshTokenReponse } from "../types/auth.type";
import config from "../constants/config";
import {
  URL_LOGIN,
  URL_LOGOUT,
  URL_REFRESH_TOKEN,
  URL_REGISTER,
} from "../apis/auth.api";
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from "./utils";
import { ErrorResponseApi } from "../types/utils.type";

class Http {
  instance: AxiosInstance;
  private access_token: string;
  private refreshToken: string;
  private refreshTokenRequest: Promise<string> | null;
  constructor() {
    this.access_token = getAccessTokenToLS();
    this.refreshToken = getRefreshTokenFromLS();
    this.refreshTokenRequest = null;
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "expire-access-token": 5, // 5 second
        "expire-refresh-token": 60 * 60, // 1 hours
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.access_token && config.headers) {
          config.headers.authorization = this.access_token;
          return config;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        if (
          response.config.url === URL_LOGIN ||
          response.config.url === URL_REGISTER
        ) {
          const data = response.data as AuthResponse;
          this.access_token = data.data.access_token;
          this.refreshToken = data.data.refresh_token;
          setAccessTokenFromLS(this.access_token);
          setRefreshTokenToLS(this.refreshToken);
          setProfileToLS(data.data.user);
        } else if (response.config.url === URL_LOGOUT) {
          this.access_token = "";
          this.refreshToken = "";
          clearAccessTokenFromLS();
        }
        return response;
      },
      (error: AxiosError) => {
        // Chỉ toast lỗi không phải 422 và 401
        if (
          ![
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.Unauthorized,
          ].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data;
          const message = data?.message || error.message;
          toast.error(message);
        }
        // Lỗi Unauthoied (401) có rất nhiều trường hợp
        // - Token không đúng
        // - Không truyền token
        // - Token hết hạn

        //nếu là lỗi 401
        if (
          isAxiosUnauthorizedError<
            ErrorResponseApi<{ name: string; message: string }>
          >(error)
        ) {
          const config = error.response?.config || {};
          const { url } = config;
          // Trường hợp Token hết hạn và request đó không phải của request refresh token => thì chúng ta mới tiến hành gọi refresh token
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null;
                  }, 10000);
                });
            return this.refreshTokenRequest.then((access_token) => {
              // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
              return this.instance({
                ...config,
                headers: { ...config.headers, authorization: access_token },
              });
            });
          }

          // Còn những trường hợp như token không đúng
          // không truyền token,
          // token hết hạn nhưng gọi refresh token bị fail
          // thì tiến hành xóa local storage và toast message

          clearAccessTokenFromLS();
          this.access_token = "";
          this.refreshToken = "";
          toast.error(
            error.response?.data.data?.message || error.response?.data.message
          );
          // window.location.reload()
        }
        return Promise.reject(error);
      }
    );
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenReponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken,
      })
      .then((res) => {
        const { access_token } = res.data.data;
        setAccessTokenFromLS(access_token);
        this.access_token = access_token;
        return access_token;
      })
      .catch((error) => {
        clearAccessTokenFromLS();
        this.access_token = "";
        this.refreshToken = "";
        throw error;
      });
  }
}
const http = new Http().instance;

export default http;

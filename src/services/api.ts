/**
 * API service - Centralized API client
 */

import type { AddressDTO, OrderDTO, ProductDTO, UserDTO } from "@/src/types";
import { Platform } from "react-native";

export interface LoginResponse {
  token: string;
  type?: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles?: string[];
}

declare global {
  var __COPLACA_API_URL__: string | undefined;
}

const platformFallback =
  Platform.OS === "android" ? "http://10.0.2.2:8080" : "http://localhost:8080";

const API_BASE_URL = (
  globalThis.__COPLACA_API_URL__?.trim() ||
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  platformFallback
).replace(/\/+$/, "");

/**
 * Make HTTP requests to the API
 */
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/**
 * API client for all endpoints
 */
export const api = {
  /**
   * Authentication
   */
  login(email: string, password: string) {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  signup(payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: AddressDTO;
  }) {
    return request<LoginResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ ...payload, role: "CUSTOMER" }),
    });
  },

  /**
   * Products
   */
  getProducts(query?: string, token?: string) {
    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined;

    if (query && query.trim().length > 0) {
      return request<ProductDTO[]>(
        `/api/v1/products/search?query=${encodeURIComponent(query.trim())}`,
        {
          headers,
        },
      );
    }

    return request<ProductDTO[]>("/api/v1/products", {
      headers,
    });
  },

  /**
   * User
   */
  getCurrentUser(token: string) {
    return request<UserDTO>("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  updateCurrentUser(token: string, payload: unknown) {
    return request<UserDTO>("/users/me", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  },

  deleteCurrentUser(token: string) {
    return request<void>("/users/me", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * Orders
   */
  getMyOrders(token: string) {
    return request<OrderDTO[]>("/orders/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createOrder(token: string, items: { productId: number; quantity: number }[]) {
    return request<OrderDTO>("/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentMethod: "CARD",
        paymentStatus: "PENDING",
        items,
      }),
    });
  },
};

export type {
    AddressDTO,
    OrderDTO,
    OrderItemDTO,
    ProductDTO,
    UserDTO
} from "@/src/types";


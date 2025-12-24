/* eslint-disable no-unused-vars */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../config/envConfig";

// Helper function to get the auth token
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, { getState, endpoint }) => {
      // Don't add Authorization header for public endpoints
      const publicEndpoints = ['forgotPassword', 'verifyEmail'];
      if (publicEndpoints.includes(endpoint)) {
        return headers;
      }

      const stateToken = getState()?.auth?.token;
      const storageToken =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      const token = stateToken || storageToken;

      if (token) {
        const value = String(token).startsWith("Bearer ")
          ? String(token)
          : `Bearer ${token}`;
        headers.set("Authorization", value);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "admin",
    "dashboard",
    "user",
    "termsAndConditions",
    "faq",
    "privacy",
    "categories",
    "formation",
    "coupon",
    "earning",
    "subscriber",
    "subscription",
    "profile",
    "category",
    "listings",
    "notification",
    "NDA",
    "invoices",
  ],
});

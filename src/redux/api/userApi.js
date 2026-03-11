import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (params) => ({
        url: "users/all",
        method: "GET",
        params: {
          ...params,
        },
      }),
      providesTags: ["user"],
    }),
    getRecentUser: builder.query({
      query: (params) => ({
        url: "users/all?page=1&limit=5",
        method: "GET",
        params: {
          ...params,
        },
      }),
      providesTags: ["user"],
    }),
    getTotalUser: builder.query({
      query: () => ({
        url: "users/total",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getSingleUser: builder.query({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `users/block/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),
     unBlockUser: builder.mutation({
      query: (userId) => ({
        url: `users/unblock/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    getEarningsSummary: builder.query({
      query: () => ({
        url: `admin/earnings/summary`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getBlockedUsers: builder.query({
      query: (params) => ({
        url: "users/blocked",
        method: "GET",
        params: {
          ...params,
        },
      }),
      providesTags: ["user"],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetTotalUserQuery,
  useGetSingleUserQuery,
  useBlockUserMutation,
  useUnBlockUserMutation,
  useGetEarningsSummaryQuery,
  useGetRecentUserQuery,
  useGetBlockedUsersQuery,
  useDeleteUserMutation,
} = userApi;

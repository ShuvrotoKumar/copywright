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
    getTotalUser: builder.query({
      query: () => ({
        url: "users/total",
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
    getEarningsSummary: builder.query({
      query: () => ({
        url: `admin/earnings/summary`,
        method: "GET",
      }),
      invalidatesTags: ["user"],
    }),
    
  }),
});

export const {
  useGetAllUserQuery,
  useGetTotalUserQuery,
  useBlockUserMutation,
  useUnBlockUserMutation,
  useGetEarningsSummaryQuery,
} = userApi;

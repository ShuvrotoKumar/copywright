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
    getSingleUser: builder.query({
      query: ({ userId }) => ({
        url: "dashboard/users-business-statistics",
        method: "GET",
        params: {
          userId,
        },
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
        url: `dashboard/delete-user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    
  }),
});

export const {
  useGetAllUserQuery,
  useGetSingleUserQuery,
  useBlockUserMutation,
  useUnBlockUserMutation,
  useDeleteUserMutation,
} = userApi;

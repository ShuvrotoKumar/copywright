import { baseApi } from "./baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateAdminProfile: builder.mutation({
      query: (data) => ({
        url: "admin/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["profile"],
    }),
    updateAdminAvatar: builder.mutation({
      query: (file) => ({
        url: "admin/update-avatar",
        method: "PATCH",
        body: file,
      }),
      invalidatesTags: ["profile"],
    }),
    changeAdminPassword: builder.mutation({
      query: (data) => ({
        url: "admin/change-password",
        method: "POST",
        body: data,
      }),
    }),
    getAdminProfile: builder.query({
      query: (params) => ({
        url: "admin/me",
        method: "GET",
        params: {
          ...params,
        },
      }),
      providesTags: ["profile"],
    }),
  }),
});

export const {
  useUpdateAdminAvatarMutation,
  useChangeAdminPasswordMutation,
  useUpdateAdminProfileMutation,
  useGetAdminProfileQuery,
} = profileApi;

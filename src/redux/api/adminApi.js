import { baseApi } from "./baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmin: builder.query({
      query: () => ({
        url: "admin/all-admins",
        method: "GET",
      }),
      providesTags: ["admin"],
    }),
    editAdmin: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/edit-admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/delete-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

export const {
  useGetAllAdminQuery,
  useEditAdminMutation,
  useDeleteAdminMutation,
} = adminApi;

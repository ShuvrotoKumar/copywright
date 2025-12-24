import { baseApi } from "./baseApi";

export const addAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addAdmin: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (data[key]) {
            formData.append(key, data[key]);
          }
        });
        return {
          url: "admin/register",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["admin"],
    }),
  }),
});

export const { useAddAdminMutation } = addAdminApi;

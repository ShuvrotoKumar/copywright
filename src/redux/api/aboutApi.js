import { baseApi } from "./baseApi";

const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAbout: builder.query({
      query: () => ({
        url: "legal-docs/about-us",
        method: "GET",
      }),
      providesTags: ["about"],
    }),
    updateAbout: builder.mutation({
      query: ({ requestData }) => ({
        url: "legal-docs/about-us",
        method: "PATCH",
        body: requestData,
      }),
      invalidatesTags: ["about"],
    }),
  }),
});

export const { useGetAboutQuery, useUpdateAboutMutation } = aboutApi;

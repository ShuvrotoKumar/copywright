import { baseApi } from "./baseApi";

const imprintApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getImprint: builder.query({
      query: () => ({
        url: "legal-docs/imprint",
        method: "GET",
      }),
      providesTags: ["imprint"],
    }),
    updateImprint: builder.mutation({
      query: ({ requestData }) => ({
        url: "legal-docs/imprint",
        method: "PATCH",
        body: requestData,
      }),
      invalidatesTags: ["imprint"],
    }),
  }),
});

export const { useGetImprintQuery, useUpdateImprintMutation } = imprintApi;

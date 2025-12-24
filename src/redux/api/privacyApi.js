import { baseApi } from "./baseApi";

const privacyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacy: builder.query({
      query: () => ({
        url: "legal-docs/privacy-policy",
        method: "GET",
      }),
      providesTags: ["privacy"],
    }),
    updatePrivacy: builder.mutation({
      query: ({ requestData }) => ({
        url: "legal-docs/privacy-policy",
        method: "PATCH",
        body: requestData,
      }),
      invalidatesTags: ["privacy"],
    }),
  }),
});

export const { useGetPrivacyQuery, useUpdatePrivacyMutation } = privacyApi;

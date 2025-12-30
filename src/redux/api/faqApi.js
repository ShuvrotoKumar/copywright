import { baseApi } from "./baseApi";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFaq: builder.query({
      query: (params) => ({
        url: "faqs",
        method: "GET",
        params,
      }),
      providesTags: ["faq"],
    }),
    deleteFaq: builder.mutation({
      query: ({ _id }) => ({
        url: `faqs/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["faq"],
    }),

    createFaq: builder.mutation({
      query: (data) => {
        console.log('FAQ API - Raw data received:', data);
        console.log('FAQ API - Body being sent:', data);
        return {
          url: "faqs",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["faq"],
    }),
    updateFaq: builder.mutation({
      query: ({ _id, data }) => ({
        url: `faqs/${_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["faq"],
    }),
  }),
});

export const {
  useGetAllFaqQuery,
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useUpdateFaqMutation,
} = faqApi;

export default faqApi;

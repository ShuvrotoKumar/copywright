import { baseApi } from "./baseApi";

export const invoicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query({
      query: () => ({
        url: "admin/transactions",
        method: "GET",
      }),
      providesTags: ["invoices"],
    }),
    getPdf: builder.query({
      query: (id) => ({
        url: `admin/transactions/export/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["invoices"],
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useGetPdfQuery,
  useLazyGetPdfQuery,
} = invoicesApi;

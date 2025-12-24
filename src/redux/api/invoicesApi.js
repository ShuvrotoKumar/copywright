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
  }),
});

export const { useGetAllTransactionsQuery } = invoicesApi;

import { baseApi } from "./baseApi";

export const invoicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query({
      query: (params) => ({
        url: "admin/invoices",
        method: "GET",
        params: {
          ...(params || {}),
        },
      }),
      providesTags: ["invoices"],
    }),
    getPdf: builder.query({
      query: (id) => ({
        url: `admin/invoices/download/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["invoices"],
    }),
    bulkDownload: builder.query({
      query: (params) => ({
        url: `admin/invoices/export/zip`,
        method: "GET",
        params: {
          ...(params || {}),
        },
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
  useBulkDownloadQuery,
  useLazyBulkDownloadQuery
} = invoicesApi;

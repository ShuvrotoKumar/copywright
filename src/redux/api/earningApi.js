import { baseApi } from "./baseApi";

const earningApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarning: builder.query({
      query: ({ year, page }) => ({
        url: "admin/earnings/summary",
        method: "GET",
        params: {
          year,
          page,
        },
      }),
      providesTags: ["earning"],
    }),
  }),
});

export const { useGetEarningQuery } = earningApi;

export default earningApi;

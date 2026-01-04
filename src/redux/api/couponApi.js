import { baseApi } from "./baseApi";

const couponApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    get_all_coupon: builder.query({
      query: ({ page }) => ({
        url: "subscription/coupons",
        method: "GET",
        params: { page },
      }),
      providesTags: ["coupon"],
    }),

    create_coupon: builder.mutation({
      query: (data) => ({
        url: "subscription/coupons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["coupon"],
    }),
    update_coupon: builder.mutation({
      query: ({ _id, data }) => ({
        url: `subscription/coupons/${_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["coupon"],
    }),
    delete_coupon: builder.mutation({
      query: ({ _id }) => ({
        url: `subscription/coupons/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupon"],
    }),
  }),
});
export const {
  useGet_all_couponQuery,
  useCreate_couponMutation,
  useUpdate_couponMutation,
  useDelete_couponMutation,
} = couponApis;

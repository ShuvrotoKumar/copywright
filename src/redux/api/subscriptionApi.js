import { baseApi } from "./baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query({
      query: ({ role }) => ({
        url: "subscription/plans/all",
        method: "GET",
        params: { role },
      }),
      providesTags: ["subscription"],
    }),
    updateSubscriptionPlan: builder.mutation({
      query: ({ subscriptionId, role, data }) => ({
        url: `subscription/plans/${subscriptionId}`,
        method: "PATCH",
        // Send both casings to be safe
        params: { subscriptionId, role },
        body: data,
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
});

export const { useGetSubscriptionPlansQuery, useUpdateSubscriptionPlanMutation } = subscriptionApi;

export default subscriptionApi;

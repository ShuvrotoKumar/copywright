import { baseApi } from "./baseApi";

const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotification: builder.query({
      query: (params) => ({
        url: "admin/notifications",
        method: "GET",
        params,
      }),
      providesTags: ["notification"],
    }),
    markAllNotificationAsRead: builder.mutation({
      query: (params) => ({
        url: "admin/notifications/mark-all-as-read",
        method: "PATCH",
        params,
      }),
      invalidatesTags: ["notification"],
    }),
  }),
});

export const {
  useGetAllNotificationQuery,
  useMarkAllNotificationAsReadMutation,
} = notificationApi;

export default notificationApi;

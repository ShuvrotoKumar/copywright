import { baseApi } from "./baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => ({
        url: "blogs",
        method: "GET",
      }),
      providesTags: ["blog"],
    }),
    createBlog: builder.mutation({
      query: (formData) => ({
        url: "blogs",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["blog"],
    }),
    getSingleBlog: builder.query({
      query: (id) => ({
        url: `blogs/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["blog"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `blogs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),
    deleteBlog: builder.mutation({
      query: ({ id }) => ({
        url: `blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useCreateBlogMutation,
  useGetSingleBlogQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;

export default blogApi;

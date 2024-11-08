import { apiSlice } from "../apiSlice";

const FOLLOW_URL = "/follow_users";

export const followUserApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addFollowUser: builder.mutation({
      query: (data) => ({
        url: `${FOLLOW_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getFollowUser: builder.query({
      query: () => ({
        url: `${FOLLOW_URL}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    deleteFollowUser: builder.mutation({
      query: (id) => ({
        url: `${FOLLOW_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    sendMailService: builder.mutation({
      query: (data) => ({
        url: `${FOLLOW_URL}/mail_service`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useAddFollowUserMutation,
  useGetFollowUserQuery,
  useDeleteFollowUserMutation,
  useSendMailServiceMutation,
  useSendWhatsappServiceMutation,
} = followUserApiSlice;

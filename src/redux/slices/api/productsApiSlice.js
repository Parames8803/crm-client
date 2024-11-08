import { apiSlice } from "../apiSlice";

const PRODUCT_URL = "/products";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addMultipleProducts: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useAddMultipleProductsMutation, useGetProductsQuery } =
  productsApiSlice;

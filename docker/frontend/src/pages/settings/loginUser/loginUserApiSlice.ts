import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const loginUserApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  reducerPath: "loginUserApi",
  tagTypes: ["LoginUser"],
  endpoints: build => ({
    getInternalLoginUser: build.mutation<any, any>({
      query() {
        return {
          url: `loginUsers/internalUsers?sort=username,desc`,
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    registerLoginUser: build.mutation<any, any>({
      query(params) {
        return {
          url: `loginUsers/registration`,
          method: "POST",
          body: Object.assign({}, params.body),
        }
      },
    }),
  }),
})

export const { useGetInternalLoginUserMutation, useRegisterLoginUserMutation } = loginUserApiSlice

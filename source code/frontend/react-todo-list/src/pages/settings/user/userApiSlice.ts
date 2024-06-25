import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { formatSortingString } from "utils/SearchUtil"

export const userApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  reducerPath: "userApi",
  tagTypes: ["User"],
  endpoints: build => ({
    searchUser: build.mutation<any, any>({
      query(params) {
        return {
          url: `loginUsers/search?page=${params.query.page}&size=${params.query.size}${formatSortingString(params.sort)}`,
          method: "POST",
          body: Object.assign({}, params.body),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    getUser: build.query<any, any>({
      query(id) {
        return {
          url: `loginUsers/${id}`,
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    createUser: build.mutation<any, any>({
      query(params) {
        return {
          url: `loginUsers`,
          method: "POST",
          body: Object.assign({}, params.body),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    updateUser: build.mutation<any, any>({
      query(params) {
        return {
          url: `loginUsers`,
          method: "PUT",
          body: Object.assign({}, params.body),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    deleteUser: build.mutation<any, any>({
      query(params) {
        return {
          url: `loginUsers`,
          method: "DELETE",
          body: params.body,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
  }),
})

export const {
  useSearchUserMutation,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice

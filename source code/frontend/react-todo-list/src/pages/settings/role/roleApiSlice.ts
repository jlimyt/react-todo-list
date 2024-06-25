import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { formatSortingString } from "utils/SearchUtil"

export const roleApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  reducerPath: "roleApi",
  tagTypes: ["Role"],
  endpoints: build => ({
    searchRole: build.mutation<any, any>({
      query(params) {
        return {
          url: `roles/search?page=${params.query.page}&size=${params.query.size}${formatSortingString(params.sort)}`,
          method: "POST",
          body: Object.assign({}, params.body),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    getRole: build.query<any, any>({
      query(id) {
        return {
          url: `roles/${id}`,
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    createRole: build.mutation<any, any>({
      query(params) {
        return {
          url: `roles`,
          method: "POST",
          body: Object.assign({}, params.body),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    updateRole: build.mutation<any, any>({
      query(params) {
        return {
          url: `roles`,
          method: "PUT",
          body: Object.assign({}, params.body),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    deleteRole: build.mutation<any, any>({
      query(params) {
        return {
          url: `roles`,
          method: "DELETE",
          body: params.body,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    getRoleDropdown: build.mutation<any, any>({
      query(params) {
        return {
          url: `roles/list`,
          method: "POST",
          body: Object.assign({}, params.body),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
  }),
})

export const {
  useSearchRoleMutation,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetRoleQuery,
  useUpdateRoleMutation,
  useGetRoleDropdownMutation,
} = roleApiSlice

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { formatSortingString } from "utils/SearchUtil"

export const todoApiSlice: any = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  reducerPath: "todoApi",
  tagTypes: ["Todo"],
  endpoints: build => ({
    searchTodo: build.mutation<any, any>({
      query(params) {
        return {
          url: `todos/search?page=${params.query.page}&size=${params.query.size}${formatSortingString(params.sort)}`,
          method: "POST",
          body: Object.assign({}, params.body),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    getTodo: build.query<any, any>({
      query(id) {
        return {
          url: `todos/${id}`,
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    createTodo: build.mutation<any, any>({
      query(params) {
        return {
          url: `todos`,
          method: "POST",
          body: Object.assign({}, params.body),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    updateTodo: build.mutation<any, any>({
      query(params) {
        return {
          url: `todos`,
          method: "PUT",
          body: Object.assign({}, params.body),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    deleteTodo: build.mutation<any, any>({
      query(params) {
        return {
          url: `todos`,
          method: "DELETE",
          body: params.body,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    getTodoDropdown: build.mutation<any, any>({
      query(params) {
        return {
          url: `todos/dropdown?lang=${params.lang}`,
          method: "POST",
          body: Object.assign({}, params.body),
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    getTodoStatistics: build.mutation<any, any>({
      query() {
        return {
          url: `todos/statistic`,
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    completeTodo: build.mutation<any, any>({
      query(id) {
        return {
          url: `todos/${id}/complete`,
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
    commentTodo: build.mutation<any, any>({
      query(params) {
        return {
          url: `todos/${params.id}/comment`,
          method: "POST",
          body: params.body,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      },
    }),
  }),
})

export const {
  useSearchTodoMutation,
  useGetTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useGetTodoDropdownMutation,
  useGetTodoStatisticsMutation,
  useCompleteTodoMutation,
  useCommentTodoMutation,
} = todoApiSlice

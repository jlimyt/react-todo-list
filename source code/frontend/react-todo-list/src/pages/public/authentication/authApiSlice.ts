import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { createAppSlice } from "app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

interface LoginBody {
  username: string
  password: string
}

interface AuthSliceState {
  userData: any
}

const initialState: AuthSliceState = {
  userData: null,
}

export const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: create => ({
    saveUserData: create.reducer((state, action: PayloadAction<any>) => {
      state.userData = action.payload
      localStorage.setItem("token", action.payload.token)
    }),
    logout: create.reducer(_ => {}),
  }),
  selectors: {
    selectUserData: auth => auth.userData,
  },
})

export const authApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  reducerPath: "authApi",
  tagTypes: ["Auth"],
  endpoints: build => ({
    login: build.mutation<any, LoginBody>({
      query(body) {
        return {
          url: "login",
          method: "POST",
          body,
        }
      },
    }),
  }),
})

export const { useLoginMutation } = authApiSlice

export const { saveUserData, logout } = authSlice.actions

export const { selectUserData } = authSlice.selectors

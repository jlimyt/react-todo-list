import { todoApiSlice } from "../pages/management/todo/todoApiSlice"
import type { Action, ThunkAction, UnknownAction } from "@reduxjs/toolkit"
import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { counterSlice } from "../features/counter/counterSlice"
import { quotesApiSlice } from "../features/quotes/quotesApiSlice"
import {
  authApiSlice,
  authSlice,
} from "pages/public/authentication/authApiSlice"
import logger from "redux-logger"
import { commonSlice } from "components/commonSlice"
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import { userApiSlice } from "pages/settings/user/userApiSlice"
import { roleApiSlice } from "pages/settings/role/roleApiSlice"
import { loginUserApiSlice } from "pages/settings/loginUser/loginUserApiSlice"

const persistConfig = {
  key: "root",
  version: 1,
  storage,

  whitelist: ["auth", "common"],
}

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const combinedReducer = combineSlices(
  counterSlice,
  quotesApiSlice,
  commonSlice,
  authApiSlice,
  authSlice,
  loginUserApiSlice,
  userApiSlice,
  todoApiSlice,
  roleApiSlice,
)
const rootReducer = (state: any, action: UnknownAction) => {
  if (action.type === "auth/logout") {
    storage.removeItem("persist:root")
    return combinedReducer(undefined, action)
  }
  return combinedReducer(state, action)
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof persistedReducer>

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const store = configureStore({
  reducer: persistedReducer,
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(quotesApiSlice.middleware)
      .concat(authApiSlice.middleware)
      .concat(loginUserApiSlice.middleware)
      .concat(userApiSlice.middleware)
      .concat(todoApiSlice.middleware)
      .concat(roleApiSlice.middleware)
      .concat(logger)
  },
})

export const persistor = persistStore(store)
// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>

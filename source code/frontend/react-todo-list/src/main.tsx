import React, { lazy, Suspense } from "react"
import type { ReactNode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { store, persistor } from "./app/store"
import "./index.css"
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { PersistGate } from "redux-persist/integration/react"
import { useAppSelector } from "app/hooks"
import { selectUserData } from "pages/public/authentication/authApiSlice"
import { ADMIN_BASE_PATH } from "@util/constants"
import Loader from "pages/common/Loader"
import ConfirmationDialog from "components/ConfirmationDialog"
import PublicApp from "PublicApp"
import ErrorPage from "pages/common/ErrorPage"
import "./i18n"

const Index = lazy(() => import("./pages/common/Index"))
const Role = lazy(() => import("./pages/settings/role/Role"))
const RoleInput = lazy(() => import("./pages/settings/role/RoleInput"))
const User = lazy(() => import("./pages/settings/user/User"))
const UserInput = lazy(() => import("./pages/settings/user/UserInput"))
const Todo = lazy(() => import("./pages/management/todo/Todo"))
const TodoInput = lazy(() => import("./pages/management/todo/TodoInput"))
const LandingPage = lazy(() => import("pages/public/LandingPage"))

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userData = useAppSelector(selectUserData)
  const isAuth = userData
  if (!isAuth) {
    return <Navigate to="/home" replace />
  }

  return children
}

const LazyLoadComponent = (props: { children: ReactNode }) => {
  return <Suspense fallback={<Loader />}>{props.children}</Suspense>
}

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/home",
    element: <PublicApp />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: (
              <LazyLoadComponent>
                <LandingPage />
              </LazyLoadComponent>
            ),
          }
        ],
      },
    ],
  },
  {
    path: ADMIN_BASE_PATH,
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: (
              <LazyLoadComponent>
                <Index />
              </LazyLoadComponent>
            ),
          },
          {
            path: "management",
            errorElement: <ErrorPage />,
            children: [
              {
                path: "todo",
                children: [
                  {
                    index: true,
                    element: (
                      <LazyLoadComponent>
                        <Todo />
                      </LazyLoadComponent>
                    ),
                  },
                  {
                    path: "create",
                    element: (
                      <LazyLoadComponent>
                        <TodoInput />
                      </LazyLoadComponent>
                    ),
                  },
                  {
                    path: "edit/:id",
                    element: (
                      <LazyLoadComponent>
                        <TodoInput />
                      </LazyLoadComponent>
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: "setting",
            errorElement: <ErrorPage />,
            children: [
              {
                path: "role",
                children: [
                  {
                    index: true,
                    element: (
                      <LazyLoadComponent>
                        <Role />
                      </LazyLoadComponent>
                    ),
                  },
                  {
                    path: "create",
                    element: (
                      <LazyLoadComponent>
                        <RoleInput />
                      </LazyLoadComponent>
                    ),
                  },
                  {
                    path: "edit/:id",
                    element: (
                      <LazyLoadComponent>
                        <RoleInput />
                      </LazyLoadComponent>
                    ),
                  },
                ],
              },
              {
                path: "user",
                children: [
                  {
                    index: true,
                    element: (
                      <LazyLoadComponent>
                        <User />
                      </LazyLoadComponent>
                    ),
                  },
                  {
                    path: "create",
                    element: (
                      <LazyLoadComponent>
                        <UserInput />
                      </LazyLoadComponent>
                    ),
                  },
                  {
                    path: "edit/:id",
                    element: (
                      <LazyLoadComponent>
                        <UserInput />
                      </LazyLoadComponent>
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
])

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfirmationDialog />
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}

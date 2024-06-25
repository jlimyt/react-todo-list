import "./App.css"
import { Outlet } from "react-router-dom"
import { AdminHeader } from "./components/Header"
import { AdminLayout, SideBar } from "./components/Layout"
import Breadcrumb from "components/Breadcrumb"

const App = () => {
  return (
    <>
      <AdminHeader />
      <AdminLayout>
        <SideBar />
        <article className="overflow-auto w-full">
          <div className="mb-2 mx-2">
            <Breadcrumb />
          </div>
          <div
            className="bg-white rounded w-full overflow-auto"
            style={{ height: "calc( 100vh - 80px - 52px)" }}
          >
            <Outlet />
          </div>
        </article>
      </AdminLayout>
    </>
  )
}

export default App

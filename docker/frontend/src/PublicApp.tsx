import "App.css"
import { PublicHeader } from "components/Header"
import { Outlet } from "react-router-dom"
import { PublicLayout } from "components/Layout"
function PublicApp() {
  return (
    <>
      <PublicHeader />
      <PublicLayout>
        <article>
          <Outlet />
        </article>
      </PublicLayout>
    </>
  )
}

export default PublicApp

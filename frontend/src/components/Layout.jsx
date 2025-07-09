import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

import React from "react"

const Layout = ({ children, showSidebar }) => {
  return (
    <div className="min-h-screen ">
      <div className="flex">
        {/* ie when showSidebar is true render <Sidebar/> */}
        {showSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col">
          <Navbar />
          {/* main screen as children */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default Layout

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Link, Outlet } from "react-router-dom";
import React from "react";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Glassy Menubar */}
      <header className="fixed w-full top-0 z-50">
        <Menubar
          className="flex justify-center items-center 
                     h-12 px-4
                     bg-white/30 backdrop-blur-md 
                     border-b border-white/20
                     transition-all duration-300"
        >
          {/* Flex wrapper ensures equal width */}
          <div className="flex w-full max-w-md">
            {/* Dashboard */}
            <div className="flex-1">
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Link
                    to="/"
                    className="w-full text-center px-3 py-1.5 rounded-md 
                               hover:bg-white/50 transition-colors duration-200
                               flex items-center justify-center"
                  >
                    Dashboard
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            </div>

            {/* Pupils */}
            <div className="flex-1">
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Link
                    to="/pupils"
                    className="w-full text-center px-3 py-1.5 rounded-md 
                               hover:bg-white/50 transition-colors duration-200
                               flex items-center justify-center"
                  >
                    Pupils
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            </div>

            {/* Add */}
            <div className="flex-1">
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Link
                    to="/pupils/add"
                    className="w-full text-center px-3 py-1.5 rounded-md 
                               hover:bg-white/50 transition-colors duration-200
                               flex items-center justify-center"
                  >
                    Add
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            </div>
          </div>
        </Menubar>
      </header>

      {/* Page content */}
      <main className="flex-1 pt-12">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;

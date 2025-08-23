import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Link, Outlet } from "react-router-dom";
import React from "react";

function Layout() {
  return (
    <div className="">
      {/* Glassy Menubar */}
      <div className="fixed w-full top-0 z-50">
        <Menubar
          className="flex justify-center items-center
            rounded-none w-full h-12
            border-b border-white/20 
            bg-white/30 backdrop-blur-md 
            transition-all duration-300
          "
        >
          {/* Dashboard */}
          <MenubarMenu>
            <MenubarTrigger>
              <Link
                to="/"
                className="px-3 py-1.5 rounded hover:bg-white/50 hover: transition transform duration-200"
              >
                Dashboard 
              </Link>
            </MenubarTrigger>
          </MenubarMenu>

          {/* Pupils */}
          <MenubarMenu>
            <MenubarTrigger>
              <Link
                to="/pupils"
                className="px-4 py-1.5 rounded hover:bg-white/50 hover: transition transform duration-200"
              >
                Pupils
              </Link>
            </MenubarTrigger>
          </MenubarMenu>

          {/* Add */}
          <MenubarMenu>
            <MenubarTrigger>
              <Link
                to="/pupils/add"
                className="px-5 py-1.5 rounded hover:bg-white/50 hover: transition transform duration-200"
              >
                Add
              </Link>
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Page content */}
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;

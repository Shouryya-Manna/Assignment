import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Link, Outlet } from "react-router-dom";
import React from "react";

function Layout() {
  return (
    <div>
      <Menubar className="px-16 py-6 rounded-none border-b border-border">
        <MenubarMenu>
          <MenubarTrigger>
            <Link to="/">Dashboard</Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>
            <Link to="/pupils">Pupils</Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>
            <Link to="/pupils/add">Add</Link>
          </MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      <Outlet />
    </div>
  );
}

export default Layout;

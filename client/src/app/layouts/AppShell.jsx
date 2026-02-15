import React from "react";
import { Outlet } from "react-router-dom";

export default function AppShell() {
  return (
    <div style={{ padding: 16 }}>
      <Outlet />
    </div>
  );
}

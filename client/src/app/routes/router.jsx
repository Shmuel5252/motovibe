import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RouteError from "../errors/RouteError.jsx";


import AppShell from "../layouts/AppShell.jsx";
import ProtectedLayout from "../layouts/ProtectedLayout.jsx";
import PublicOnlyLayout from "../layouts/PublicOnlyLayout.jsx";

import Home from "../../pages/Home.jsx";
import Login from "../../pages/auth/Login.jsx";
import Register from "../../pages/auth/Register.jsx";


import RoutesList from "../../pages/routes/RoutesList.jsx";

import RideActive from "../../pages/ride/RideActive.jsx";
import History from "../../pages/rides/History.jsx";



export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <Home /> },

      // Public-only (כשתהיה התחברות נעביר לפי token)
      {
        element: <PublicOnlyLayout />,
        children: [
          { path: "/auth/login", element: <Login /> },
          { path: "/auth/register", element: <Register /> },
        ],
      },

      // Protected
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/routes", element: <RoutesList/> },
          { path: "/ride/active", element: <RideActive/> },
          { path: "/rides/history", element: <History/> },
        ],
      },
    ],
  },
]);

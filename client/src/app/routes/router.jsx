import React from "react";
import { createBrowserRouter } from "react-router-dom";

import AppShell from "../layouts/AppShell.jsx";
import ProtectedLayout from "../layouts/ProtectedLayout.jsx";
import PublicOnlyLayout from "../layouts/PublicOnlyLayout.jsx";

import Home from "../../pages/Home.jsx";
import Login from "../../pages/auth/Login.jsx";
import Register from "../../pages/auth/Register.jsx";

import RoutesPlaceholder from "../../pages/placeholders/RoutesPlaceholder.jsx";
import RideActivePlaceholder from "../../pages/placeholders/RideActivePlaceholder.jsx";
import HistoryPlaceholder from "../../pages/placeholders/HistoryPlaceholder.jsx";

export const router = createBrowserRouter([
  {
    element: <AppShell />,
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
          { path: "/routes", element: <RoutesPlaceholder /> },
          { path: "/ride/active", element: <RideActivePlaceholder /> },
          { path: "/rides/history", element: <HistoryPlaceholder /> },
        ],
      },
    ],
  },
]);

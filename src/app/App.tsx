import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";
import "../styles/fonts.css";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <AppProvider>
      <>
        <div style={{ fontFamily: "Nunito, sans-serif" }}>
          <RouterProvider router={router} />
        </div>
        <Analytics />
      </>
    </AppProvider>
  );
}

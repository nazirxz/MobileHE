import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";
import "../styles/fonts.css";

export default function App() {
  return (
    <AppProvider>
      <div style={{ fontFamily: "Nunito, sans-serif" }}>
        <RouterProvider router={router} />
      </div>
    </AppProvider>
  );
}

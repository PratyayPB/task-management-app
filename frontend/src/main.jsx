import "./index.css";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";

import { ClerkProvider } from "@clerk/react";
import { StrictMode } from "react";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </StrictMode>,
);

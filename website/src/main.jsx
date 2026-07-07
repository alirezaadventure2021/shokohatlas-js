import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Routes from "./Routes";
import "./i18n";
import {HelmetProvider} from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <HelmetProvider>
          <RouterProvider router={Routes} />
      </HelmetProvider>
  </StrictMode>
);

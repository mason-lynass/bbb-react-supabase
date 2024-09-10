import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from '@vercel/analytics/react'
import RQApp from "./ReactQueryApp.jsx";
import "./global/CSS/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { APIProvider } from "@vis.gl/react-google-maps";
import { GMKey } from "./global/constants.jsx";

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <APIProvider apiKey={GMKey}>
          <RQApp />
          <Analytics />
        </APIProvider>
        <ReactQueryDevtools />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import RQApp from "./ReactQueryApp.jsx";
import "./global/CSS/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, RouterProvider } from "react-router-dom";

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RQApp />
        <ReactQueryDevtools />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

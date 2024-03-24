import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  QueryClientProvider,
  queryClient,
} from "./Components/QueryClient/QueryClient.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

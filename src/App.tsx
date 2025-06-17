<<<<<<< HEAD
=======
import ARouter from "./components/common/ARouter";
import { useAxiosInterceptor } from "./hooks/axiosInterceptor";
import { useRoleInit } from "./hooks/role";

import ThemeProvider from "./theme";
>>>>>>> release/v2.0.0
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./components/common/ARouter";
import "./globals.css";
import ThemeProvider from "./theme";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // window focus 만으로도 refetch를 발생시키는 조건 해제
    },
  },
});

function App() {
  useRoleInit();

  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;

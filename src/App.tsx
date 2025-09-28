import { useRoleInit } from "./hooks/role";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./components/ARouter";
import "./globals.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    useRoleInit();

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />

                <Toaster position="top-center" richColors />
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
}

export default App;

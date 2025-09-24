import { MantineProvider } from "@mantine/core"; // MantineProvider를 import 합니다.
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
        <MantineProvider>
            {" "}
            <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />

                    <Toaster position="top-center" richColors />
                </QueryClientProvider>
            </GoogleOAuthProvider>
        </MantineProvider>
    );
}

export default App;

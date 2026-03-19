import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AppLayout } from "@/components/layout";
import { ChatContainer } from "@/components/chat";
import "@/styles/globals.css";

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AppLayout>
                    <Routes>
                        <Route path="/" element={<ChatContainer />} />
                    </Routes>
                </AppLayout>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;

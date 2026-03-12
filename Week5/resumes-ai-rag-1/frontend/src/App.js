import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'react-hot-toast';
import { ChatPage } from '@/pages/ChatPage';
export default function App() {
    return (_jsxs(TooltipProvider, { children: [_jsx(Toaster, { position: "bottom-right", toastOptions: {
                    style: {
                        background: '#1e1e28',
                        color: '#f1f1f5',
                        border: '1px solid rgba(255,255,255,0.07)',
                    },
                    success: {
                        icon: '✓',
                    },
                    error: {
                        icon: '✕',
                    },
                } }), _jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsx(Route, { path: "/", element: _jsx(ChatPage, {}) }) }) })] }));
}
//# sourceMappingURL=App.js.map
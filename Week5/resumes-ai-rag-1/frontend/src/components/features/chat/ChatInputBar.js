import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
export function ChatInputBar({ onSubmit, isLoading }) {
    const textareaRef = useRef(null);
    const [value, setValue] = useState('');
    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '10px';
            const scrollHeight = Math.min(textareaRef.current.scrollHeight, 168);
            textareaRef.current.style.height = scrollHeight + 'px';
        }
    };
    useEffect(() => {
        adjustHeight();
    }, [value]);
    const handleSubmit = () => {
        const trimmed = value.trim();
        if (trimmed && !isLoading) {
            onSubmit(trimmed);
            setValue('');
            if (textareaRef.current) {
                textareaRef.current.style.height = '10px';
            }
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };
    return (_jsxs("div", { className: "border-t border-white/[0.07] bg-bg-surface p-4 space-y-3", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Textarea, { ref: textareaRef, value: value, onChange: (e) => setValue(e.target.value), onKeyDown: handleKeyDown, placeholder: "Search candidates... (Shift+Enter for new line)", className: "resize-none", disabled: isLoading }), _jsx(Button, { onClick: handleSubmit, disabled: !value.trim() || isLoading, size: "icon", className: "flex-shrink-0 h-10 w-10", "aria-label": "Send message", children: _jsx(Send, { className: "h-4 w-4" }) })] }), _jsx("p", { className: "text-xs text-text-muted text-center", children: "Press Enter to search \u00B7 Shift+Enter for new line" })] }));
}
//# sourceMappingURL=ChatInputBar.js.map
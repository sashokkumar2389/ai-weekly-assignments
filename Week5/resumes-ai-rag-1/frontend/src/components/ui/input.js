import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '@/lib/utils/cn';
const Input = React.forwardRef(({ className, type, ...props }, ref) => (_jsx("input", { type: type, className: cn('flex h-10 w-full rounded-md border border-white/[0.07] bg-bg-card px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50', className), ref: ref, ...props })));
Input.displayName = 'Input';
export { Input };
//# sourceMappingURL=input.js.map
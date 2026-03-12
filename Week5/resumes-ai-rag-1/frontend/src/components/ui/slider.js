import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils/cn';
const Slider = React.forwardRef(({ className, ...props }, ref) => (_jsxs(SliderPrimitive.Root, { ref: ref, className: cn('relative flex w-full touch-none select-none items-center', className), ...props, children: [_jsx(SliderPrimitive.Track, { className: "relative h-2 w-full grow overflow-hidden rounded-full bg-white/[0.1]", children: _jsx(SliderPrimitive.Range, { className: "absolute h-full bg-gradient-to-r from-primary to-accent" }) }), _jsx(SliderPrimitive.Thumb, { className: "block h-5 w-5 rounded-full border-2 border-accent bg-bg-card ring-offset-bg-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" })] })));
Slider.displayName = SliderPrimitive.Root.displayName;
export { Slider };
//# sourceMappingURL=slider.js.map
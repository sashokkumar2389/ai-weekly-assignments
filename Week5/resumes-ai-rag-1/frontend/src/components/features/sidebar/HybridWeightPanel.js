import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useHybridWeights } from '@/hooks/use-hybrid-weights';
import { HYBRID_WEIGHT_PRESETS } from '@/lib/utils/constants';
export function HybridWeightPanel() {
    const { bm25Weight, vectorWeight, handleBm25Change, applyPreset } = useHybridWeights();
    return (_jsxs(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2 }, className: "space-y-4", children: [_jsx("div", { className: "text-xs font-medium uppercase tracking-widest text-text-muted", children: "Search Weights" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { className: "text-xs text-text-muted", children: "BM25 Keyword" }), _jsxs(Badge, { variant: "secondary", children: [bm25Weight, "%"] })] }), _jsx(Slider, { value: [bm25Weight], onValueChange: handleBm25Change, min: 0, max: 100, step: 1, className: "w-full" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-2", children: [_jsx("span", { className: "text-xs text-text-muted", children: "Vector Semantic" }), _jsxs(Badge, { variant: "secondary", children: [vectorWeight, "%"] })] }), _jsx(Slider, { value: [vectorWeight], onValueChange: (value) => {
                                    const newVector = value[0];
                                    const newBm25 = 100 - newVector;
                                    handleBm25Change([newBm25]);
                                }, min: 0, max: 100, step: 1, className: "w-full" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs text-text-muted", children: "Presets" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: HYBRID_WEIGHT_PRESETS.map((preset) => (_jsx(Button, { size: "sm", variant: bm25Weight === preset.bm25 && vectorWeight === preset.vector
                                ? 'default'
                                : 'secondary', onClick: () => applyPreset(preset.bm25, preset.vector), className: "text-xs", children: preset.label }, preset.label))) })] })] }));
}
//# sourceMappingURL=HybridWeightPanel.js.map
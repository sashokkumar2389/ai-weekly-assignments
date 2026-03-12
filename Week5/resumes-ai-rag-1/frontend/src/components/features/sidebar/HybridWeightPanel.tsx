import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useHybridWeights } from '@/hooks/use-hybrid-weights';
import { HYBRID_WEIGHT_PRESETS } from '@/lib/utils/constants';

export function HybridWeightPanel() {
    const { bm25Weight, vectorWeight, handleBm25Change, applyPreset } = useHybridWeights();

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
        >
            <div className="text-xs font-medium uppercase tracking-widest text-text-muted">Search Weights</div>

            <div className="space-y-3">
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-xs text-text-muted">BM25 Keyword</span>
                        <Badge variant="secondary">{bm25Weight}%</Badge>
                    </div>
                    <Slider
                        value={[bm25Weight]}
                        onValueChange={handleBm25Change}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-xs text-text-muted">Vector Semantic</span>
                        <Badge variant="secondary">{vectorWeight}%</Badge>
                    </div>
                    <Slider
                        value={[vectorWeight]}
                        onValueChange={(value) => {
                            const newVector = value[0];
                            const newBm25 = 100 - newVector;
                            handleBm25Change([newBm25]);
                        }}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-xs text-text-muted">Presets</p>
                <div className="grid grid-cols-3 gap-2">
                    {HYBRID_WEIGHT_PRESETS.map((preset) => (
                        <Button
                            key={preset.label}
                            size="sm"
                            variant={
                                bm25Weight === preset.bm25 && vectorWeight === preset.vector
                                    ? 'default'
                                    : 'secondary'
                            }
                            onClick={() => applyPreset(preset.bm25, preset.vector)}
                            className="text-xs"
                        >
                            {preset.label}
                        </Button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

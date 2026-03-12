import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2', {
    variants: {
        variant: {
            default: 'border-primary/30 bg-primary/10 text-primary',
            secondary: 'border-white/[0.1] bg-white/5 text-text-muted hover:bg-white/10',
            vector: 'border-score-vector/30 bg-score-vector/10 text-score-vector',
            bm25: 'border-score-bm25/30 bg-score-bm25/10 text-score-bm25',
            hybrid: 'border-score-hybrid/30 bg-score-hybrid/10 text-score-hybrid',
            destructive: 'border-red-500/30 bg-red-500/10 text-red-400',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

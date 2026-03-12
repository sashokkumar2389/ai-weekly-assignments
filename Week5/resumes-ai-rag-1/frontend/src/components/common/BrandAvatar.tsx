import { StatusDot } from './StatusDot';

export function BrandAvatar() {
    return (
        <div className="flex items-center gap-3 pb-4 border-b border-white/[0.07]">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                R
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-text-primary">RecruitBot</h3>
                <StatusDot />
            </div>
        </div>
    );
}

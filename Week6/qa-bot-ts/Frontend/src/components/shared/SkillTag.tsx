import { cn } from "@/lib/utils";

interface SkillTagProps {
  skill: string;
  className?: string;
}

export const SkillTag = ({ skill, className }: SkillTagProps) => {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        className
      )}
    >
      {skill}
    </span>
  );
};

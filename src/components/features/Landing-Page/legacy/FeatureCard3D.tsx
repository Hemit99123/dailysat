import { cn } from "@/lib/utils";
import { Card } from "../../../common/Card";

interface FeatureCard3DProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: "blue" | "purple" | "green" | "orange";
  className?: string;
}

export function FeatureCard3D({
  icon,
  title,
  description,
  color = "blue",
  className,
}: FeatureCard3DProps) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20",
    purple: "from-purple-500/20 to-purple-600/20",
    green: "from-green-500/20 to-green-600/20",
    orange: "from-orange-500/20 to-orange-600/20",
  };

  return (
    <Card
      className={cn(
        "h-60 group relative overflow-hidden rounded-xl border-0 bg-gradient-to-br p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl text-black",
        colorClasses[color],
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-4 inline-block rounded-lg bg-white/10 p-3 backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </Card>
  );
}

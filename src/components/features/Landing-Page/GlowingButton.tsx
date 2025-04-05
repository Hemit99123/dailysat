import { cn } from "@/lib/utils"
import { Button } from "@/components/common/Button"

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function GlowingButton({ children, className, ...props }: GlowingButtonProps) {
  return (
    <Button
      className={cn(
        "w-full relative group overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),rgba(255,255,255,0))]" />
      <span className="relative">{children}</span>
    </Button>
  )
} 
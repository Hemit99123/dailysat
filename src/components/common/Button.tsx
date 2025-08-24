import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "running-stroke": "relative", /* stroke handled via pseudo-elements */
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export interface RunningStrokeProps {
  runningColor?: string;
  ringColor?: string;         // shorthand single color (degenerates to solid ring)
  fillColor?: string;         // inner fill
  textColor?: string;         // content color
  strokeThickness?: string;   // ring width (e.g. 4px)
  strokeSpeed?: string;       // rotation duration (e.g. 3s)
  strokeRadius?: string;      // border radius (e.g. 14px)
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & RunningStrokeProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      runningColor,
      ringColor,
      fillColor,
      textColor,
      strokeThickness,
      strokeSpeed,
      strokeRadius,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isRunning = variant === "running-stroke";
    let gradientValue: string | undefined;
    gradientValue = ringColor + ", " + runningColor + ", " + ringColor + ", " + ringColor + " ";
    console.log(gradientValue);
    const style: React.CSSProperties | undefined = isRunning ? ({
      "--rs-width": strokeThickness ?? "4px",
      "--rs-speed": strokeSpeed ?? "3s",
      "--rs-radius": strokeRadius ?? "14px",
      "--rs-fill": fillColor ?? "#0a0a0aAA",
      "--rs-text": textColor ?? "#fff",
      ...(gradientValue ? { "--rs-gradient": gradientValue } : {}),
    } as React.CSSProperties) : undefined;

    if (isRunning) {
      return (
        <Comp
          ref={ref}
          className={cn(buttonVariants({ variant, size }), className)}
          style={style}
          data-running-stroke=""
          data-size={size}
          {...props}
        >
          <div style={{display: "flex", alignItems: "center", justifyContent: "center", position: "relative"}}>
            <span className="rs-glow" aria-hidden="true" />
            <span className="rs-clip">
              <span className="rs-rotator" aria-hidden="true" />
              <span className="rs-inner">{children}</span>
            </span>
          </div>
        </Comp>
      );
    }
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        style={style}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

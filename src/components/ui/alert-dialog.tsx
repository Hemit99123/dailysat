"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../common/Button";

// Context for managing dialog state
const AlertDialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

// Root component that manages dialog state
const AlertDialog: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

// Trigger button component
const AlertDialogTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, ...props }, ref) => {
  const context = React.useContext(AlertDialogContext);
  if (!context)
    throw new Error("AlertDialogTrigger must be used within AlertDialog");

  return (
    <button ref={ref} onClick={() => context.setOpen(true)} {...props}>
      {children}
    </button>
  );
});
AlertDialogTrigger.displayName = "AlertDialogTrigger";

// Dialog overlay (backdrop)
const AlertDialogOverlay: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const context = React.useContext(AlertDialogContext);
  if (!context)
    throw new Error("AlertDialogOverlay must be used within AlertDialog");

  if (!context.open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      onClick={() => context.setOpen(false)}
      {...props}
    />
  );
};

// Main dialog content
const AlertDialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  const context = React.useContext(AlertDialogContext);
  if (!context)
    throw new Error("AlertDialogContent must be used within AlertDialog");

  if (!context.open) return null;

  return createPortal(
    <>
      <AlertDialogOverlay />
      <div
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </>,
    document.body
  );
};

const AlertDialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
));
AlertDialogHeader.displayName = "AlertDialogHeader";

// Footer section
const AlertDialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
));
AlertDialogFooter.displayName = "AlertDialogFooter";

// This component defines a reusable AlertDialogTitle using React.forwardRef.
// It forwards a ref to an <h2> element and uses className which the user defines.
// The component allows styling w/ Tailwind CSS and supports external ref forwarding,
// making it usable in modals or dialog headers where accessibility and focus control matter.
const AlertDialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

// Description component
const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";

// Action button
const AlertDialogAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(AlertDialogContext);
  if (!context)
    throw new Error("AlertDialogAction must be used within AlertDialog");

  return (
    <button
      ref={ref}
      className={cn(buttonVariants(), className)}
      onClick={() => context.setOpen(false)}
      {...props}
    />
  );
});
AlertDialogAction.displayName = "AlertDialogAction";

// Cancel button
const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(AlertDialogContext);
  if (!context)
    throw new Error("AlertDialogCancel must be used within AlertDialog");

  return (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className
      )}
      onClick={() => context.setOpen(false)}
      {...props}
    />
  );
});
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

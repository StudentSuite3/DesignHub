"use client";

import { Check, Copy } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";

type CopyButtonProps = Omit<ButtonProps, "onClick"> & {
  value: string;
  label?: string;
  toastMessage?: string;
};

function CopyButton({
  value,
  label = "Copy",
  toastMessage,
  variant = "ghost",
  size = "icon",
  children,
  ...props
}: CopyButtonProps) {
  const { copy, copied } = useCopy();
  const done = copied === value;

  return (
    <Button
      variant={variant}
      size={size}
      aria-label={children ? undefined : label}
      onClick={() => copy(value, toastMessage)}
      {...props}
    >
      {done ? <Check className="text-success" /> : <Copy />}
      {children}
    </Button>
  );
}

export { CopyButton };

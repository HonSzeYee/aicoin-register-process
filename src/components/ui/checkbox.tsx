import React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export type CheckboxProps = {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  className?: string;
  onCheckedChange?: (checked: boolean) => void;
  "aria-label"?: string;
};

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { checked = false, indeterminate = false, disabled = false, className, onCheckedChange, ...rest },
  ref
) {
  const isIndeterminate = indeterminate && !checked;
  const isActive = checked || isIndeterminate;

  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={isIndeterminate ? "mixed" : checked}
      disabled={disabled}
      onClick={() => {
        if (disabled || !onCheckedChange) return;
        onCheckedChange(!checked);
      }}
      className={cn(
        "inline-flex h-5 w-5 items-center justify-center rounded-[4px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        isActive ? "border-blue-500 bg-blue-500 text-white" : "border-muted-foreground/60 bg-background",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...rest}
    >
      {isIndeterminate ? <Minus className="h-3 w-3" /> : checked ? <Check className="h-3 w-3" /> : null}
    </button>
  );
});

export type CheckboxOption = {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  indeterminate?: boolean;
};

type CheckboxGroupProps = {
  value: string[];
  options: CheckboxOption[];
  onChange: (value: string[]) => void;
  className?: string;
  itemClassName?: string;
};

export function CheckboxGroup({ value, options, onChange, className, itemClassName }: CheckboxGroupProps) {
  const setChecked = (option: CheckboxOption, checked: boolean) => {
    if (option.disabled) return;
    if (checked) {
      onChange(Array.from(new Set([...value, option.value])));
      return;
    }
    onChange(value.filter((v) => v !== option.value));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {options.map((option) => {
        const checked = value.includes(option.value);
        return (
          <label
            key={option.value}
            className={cn("flex items-start gap-2 text-sm text-foreground/90", itemClassName)}
          >
            <Checkbox
              checked={checked}
              indeterminate={option.indeterminate}
              disabled={option.disabled}
              onCheckedChange={(next) => setChecked(option, next)}
            />
            <span className={option.disabled ? "text-muted-foreground/70" : ""}>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}

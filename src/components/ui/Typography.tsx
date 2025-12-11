import React from "react";

type TypographyVariant = "h6" | "subtitle1" | "subtitle2" | "body2" | "caption";

interface TypographyProps {
  variant?: TypographyVariant;
  className?: string;
  children: React.ReactNode;
}

export default function Typography({ variant = "body2", className = "", children }: TypographyProps) {
  const tagMap: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
    h6: "h2",
    subtitle1: "h3",
    subtitle2: "h4",
    body2: "p",
    caption: "span"
  };
  const Tag = tagMap[variant];
  const variantClasses: Record<TypographyVariant, string> = {
    h6: "text-lg font-semibold",
    subtitle1: "text-sm font-semibold",
    subtitle2: "text-xs font-semibold",
    body2: "text-xs",
    caption: "text-[11px]"
  };
  return <Tag className={(variantClasses[variant] || "") + " " + className}>{children}</Tag>;
}

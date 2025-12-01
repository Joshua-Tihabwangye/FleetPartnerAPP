import React from "react";

export default function Typography({ variant = "body2", className = "", children }) {
  let Tag = "p";
  if (variant === "h6") Tag = "h2";
  if (variant === "subtitle1") Tag = "h3";
  if (variant === "subtitle2") Tag = "h4";
  if (variant === "caption") Tag = "span";
  const variantClasses = {
    h6: "text-lg font-semibold",
    subtitle1: "text-sm font-semibold",
    subtitle2: "text-xs font-semibold",
    body2: "text-xs",
    caption: "text-[11px]"
  };
  return <Tag className={(variantClasses[variant] || "") + " " + className}>{children}</Tag>;
}

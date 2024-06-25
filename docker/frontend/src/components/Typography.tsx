import type { CSSProperties, MouseEvent, ReactNode } from "react"

interface TypographyProps {
  variant:
    | "heading1"
    | "heading2"
    | "heading3"
    | "heading4"
    | "body1"
    | "body2"
    | "body3"
    | "body4"
    | "mediumBody1"
    | "mediumBody2"
    | "mediumBody3"
    | "mediumBody4"
  children: ReactNode
  style?: CSSProperties
  className?: string
  onClick?: (e: MouseEvent<HTMLParagraphElement>) => void
  id?: string
  key?: string
}

const textStyle = (
  fontWeight: string,
  fontSize: string,
  lineHeight: string,
) => ({
  fontWeight,
  fontSize,
  lineHeight,
})

export function Typography({
  variant,
  children,
  style,
  className,
  onClick,
  id,
  key,
}: TypographyProps) {
  const fontStyle = {
    heading1: textStyle("bold", "4rem", "4.75rem"),
    heading2: textStyle("bold", "2.25rem", "2.75rem"),
    heading3: textStyle("bold", "1.75rem", "2.25rem"),
    heading4: textStyle("bold", "1.25rem", "1.75rem"),
    body1: textStyle("normal", "1.125rem", "1.75rem"),
    body2: textStyle("normal", "1rem", "1.5rem"),
    body3: textStyle("normal", "0.875rem", "1.25rem"),
    body4: textStyle("normal", "0.75rem", "1rem"),
    mediumBody1: textStyle("500", "1.125rem", "1.75rem"),
    mediumBody2: textStyle("500", "1rem", "1.5rem"),
    mediumBody3: textStyle("500", "0.875rem", "1.25rem"),
    mediumBody4: textStyle("500", "0.75rem", "1rem"),
  }

  return (
    <p
      style={{
        ...fontStyle[variant],
        ...style,
      }}
      className={className}
      onClick={onClick}
      key={key}
      id={id}
    >
      {children}
    </p>
  )
}

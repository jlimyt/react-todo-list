import { useTranslation } from "react-i18next"
import { Typography } from "../Typography"
interface SectionTitleProps {
  label?: string
  color?: string
}

function SectionTitle({
  label = "",
  color = "purpleHeart",
}: SectionTitleProps) {
  const { t } = useTranslation(["common"])

  if (!label) {
    label = t("basic-information")
  }

  return (
    <Typography variant="heading4" className={`text-${color}-500 mb-4`}>
      {label}
    </Typography>
  )
}

export default SectionTitle

import { Typography } from "components/Typography"

export default function Banner({
  imageURL = "/src/resources/images/DETC-banner.png",
  title = "賽馬會愛丁堡公爵訓練營",
}) {
  return (
    <div
      style={{ backgroundImage: `url(${imageURL})` }}
      className={`w-full h-[500px] flex`}
    >
      <Typography
        variant="heading1"
        className="m-auto text-white [text-shadow:_2px_2px_5px_var(--tw-shadow-color)] shadow-fuscousGray-950"
      >
        {title}
      </Typography>
    </div>
  )
}

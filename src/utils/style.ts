import { endOfMonth, parse } from "date-fns";

export function gridOfTheMonth(month: string) {
  const currentMonth = endOfMonth(
    parse(month, "MMMM-yyyy", new Date())
  ).toString();

  if (currentMonth === "28") {
    return "grid-cols-28";
  }
  if (currentMonth === "29") {
    return "grid-cols-29";
  }
  if (currentMonth === "30") {
    return "grid-cols-30";
  }
  return "grid-cols-31";
}

export function bgColor(index: number) {
  const color = [
    "bg-[#002f61]",
    "bg-[#003969]",
    "bg-[#004371]",
    "bg-[#004d78]",
    "bg-[#00567f]",
    "bg-[#005f85]",
    "bg-[#00688b]",
    "bg-[#00718f]",
    "bg-[#007a93]",
    "bg-[#008396]",
    "bg-[#008b98]",
    "bg-[#00949a]",
    "bg-[#009c9b]",
    "bg-[#00a49c]",
    "bg-[#00ad9b]",
    "bg-[#00b599]",
    "bg-[#00bd97]",
    "bg-[#00c593]",
    "bg-[#00cd8e]",
    "bg-[#01d589]",
    "bg-[#18dc82]",
    "bg-[#2ee379]",
    "bg-[#4ee870]",
    "bg-[#69ed68]",
    "bg-[#81f15e]",
    "bg-[#97f554]",
    "bg-[#adf849]",
    "bg-[#c2fa3d]",
    "bg-[#d6fc30]",
    "bg-[#ebfe1f]",
    "bg-[#ffff00]",
  ];

  return color[index];
}
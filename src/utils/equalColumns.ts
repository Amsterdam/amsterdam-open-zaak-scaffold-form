export const equalColumns = (num:number, buttonGutter:boolean) => {
  const fractions = [...Array(num)].map(_ => "1fr")
  if (buttonGutter) {
    fractions.push("auto")
  }
  return fractions.join(" ");
}

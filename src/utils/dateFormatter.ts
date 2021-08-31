export const dateFormatterOptions: Intl.DateTimeFormatOptions =
{
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Sao_Paulo"
} as const;

export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions)
{
  let formatterOptions = dateFormatterOptions;
  if (options != null)
    formatterOptions = options;

  const formattedDate = new Intl.DateTimeFormat("pt-BR", formatterOptions)
    .format(date)
    .split(" ");

  return `${formattedDate[0]} às ${formattedDate[1]}`;
}
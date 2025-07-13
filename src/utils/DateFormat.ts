const localeDateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

const localeOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

// example:	2024. 06. 18.
export function getFormattedLocaleDateString(date: string | Date) {
  if (date === "") return "";
  if (typeof date === "string") {
    return new Date(date).toLocaleDateString("ko-KR", localeDateOptions);
  } else if (typeof date === "object") {
    return date.toLocaleDateString("ko-KR", localeDateOptions);
  }
  return "";
}

// example: 2024. 06. 18. 14:30:00
export function getFormattedLocaleString(date: string | Date) {
  if (date === "") return "";
  if (typeof date === "string") {
    return new Date(date).toLocaleString("ko-KR", localeOptions);
  } else if (typeof date === "object") {
    return date.toLocaleString("ko-KR", localeOptions);
  }
  return "";
}

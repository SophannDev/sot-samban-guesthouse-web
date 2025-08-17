export const formatYYYYMMDDHHmmssToReadable = (dateTimeString: string): string => {
  if (!dateTimeString || dateTimeString.length !== 14) return "";

  const year = parseInt(dateTimeString.slice(0, 4), 10);
  const month = parseInt(dateTimeString.slice(4, 6), 10);
  const day = parseInt(dateTimeString.slice(6, 8), 10);
  // Optional: hour/minute/second if needed
  // const hour = parseInt(dateTimeString.slice(8, 10), 10);
  // const minute = parseInt(dateTimeString.slice(10, 12), 10);
  // const second = parseInt(dateTimeString.slice(12, 14), 10);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

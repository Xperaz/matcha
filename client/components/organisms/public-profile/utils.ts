"use client";
export const formatLastConnection = (stringDate: string | undefined) => {
  const timeZoneDate = stringDate
    ? new Date(stringDate).toLocaleString("en-US", {
        timeZone: "Africa/Casablanca",
      })
    : null;

  const date = timeZoneDate ? new Date(timeZoneDate) : null;
  if (!date) return "N/A";
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  return `${minutes} minutes ago`;
};

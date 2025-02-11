/**
 * Returns time in HH:mm format from a date string
 */
export const formatMessageTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * Returns time passed since the given date
 */

export const getPassedHours = (dateString: string): string => {
  const date = new Date(dateString);
  const currentDate = new Date();
  const diff = currentDate.getTime() - date.getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  return `${Math.floor(hours / 24)}d`;
};

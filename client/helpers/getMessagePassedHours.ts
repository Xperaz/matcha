export const getMessagePassedHours = (date: string) => {
  const givenDate = new Date(date);
  const currentDate = new Date();

  const diffInMs = currentDate.getTime() - givenDate.getTime();

  const diffHours = diffInMs / (1000 * 60 * 60);

  return Math.floor(diffHours);
};

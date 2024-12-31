export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(
        `data:${file.type};base64,${(reader.result as string).split(",")[1]}`,
      );
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

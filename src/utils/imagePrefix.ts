export function addImagePrefix(imageUrl: string) {
  if (!!!import.meta.env.VITE_PUBLIC_URL) {
    return imageUrl;
  }

  const delimiter = import.meta.env.VITE_BACK_FILE_BASE_URL;
  const [, imageId] = imageUrl.split(delimiter);

  return import.meta.env.VITE_BACK_BASE_URL + delimiter + imageId;
}

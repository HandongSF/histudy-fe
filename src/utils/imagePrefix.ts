import { BACKEND_BASE_URL } from "@/const/endpoints";

export function addImagePrefix(imageUrl: string) {
  if (!!!import.meta.env.VITE_PUBLIC_URL) {
    return imageUrl;
  }

  const delimiter = import.meta.env.VITE_BACK_FILE_BASE_URL;
  const [, imageId] = imageUrl.split(delimiter);

  return BACKEND_BASE_URL + delimiter + imageId;
}

export function convert2CDNImageUrl(imageUrl: string) {
  const cloudFrontUrl = import.meta.env.VITE_CLOUD_FRONT_BASE_URL;
  const delimiter = import.meta.env.VITE_BACK_FILE_BASE_URL;
  const [, imageKey] = imageUrl.split(delimiter);
  return cloudFrontUrl + "/" + imageKey;
}

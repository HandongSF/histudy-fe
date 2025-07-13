import imageCompression from "browser-image-compression";

const compressedImageFile = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  return imageCompression(file, options);
  // try {
  //   const compressedFile = await
  //   console.log(
  //     "compressedFile instanceof Blob",
  //     compressedFile instanceof Blob
  //   ); // true
  //   console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB

  //   return compressedFile; // write your own logic
  // } catch (error) {
  //   console.log(error);
  // }
};

export default compressedImageFile;

import imageCompression from 'browser-image-compression';

const compressedImageFile = async (file: File) => {
   const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
   };
   return imageCompression(file, options);
};

export default compressedImageFile;

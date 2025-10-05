import { heicTo } from 'heic-to';

export const Heic2Jpg = async (blob: Blob) => {
   const convertedFile = (await heicTo({
      blob,
      type: 'image/jpeg',
      quality: 0.5,
   })) as Blob;

   return convertedFile;
};
export default Heic2Jpg;

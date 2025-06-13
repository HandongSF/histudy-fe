import heic2any from "heic2any";

export const Heic2Jpg = async (file: File) => {
  if (file.type === "image/heic" || file.type === "image/heif") {
    const convertedFile = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.5,
    });

    return convertedFile;
  } else return file;
};
export default Heic2Jpg;

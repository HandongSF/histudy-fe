export const convertBlobToWebp = async (blob: Blob): Promise<Blob> => {
   const img = new Image();
   const url = URL.createObjectURL(blob);

   return new Promise((resolve, reject) => {
      img.onload = () => {
         const canvas = document.createElement('canvas');
         canvas.width = img.width;
         canvas.height = img.height;
         const ctx = canvas.getContext('2d');
         ctx?.drawImage(img, 0, 0);
         canvas.toBlob(
            (webpBlob) => {
               if (webpBlob) resolve(webpBlob);
               else reject(new Error('WebP 변환 실패'));
            },
            'image/webp',
            0.3,
         );
      };

      img.onerror = reject;
      img.src = url;
   });
};

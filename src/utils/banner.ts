const SAFE_EXTERNAL_PROTOCOLS = new Set(['http:', 'https:']);

export const getSafeExternalUrl = (value: string | null | undefined) => {
   const trimmedValue = value?.trim();

   if (!trimmedValue) {
      return null;
   }

   try {
      const parsedUrl = new URL(trimmedValue);

      if (!SAFE_EXTERNAL_PROTOCOLS.has(parsedUrl.protocol)) {
         return null;
      }

      return parsedUrl.toString();
   } catch {
      return null;
   }
};

export const getBannerAltText = ({ label, redirectUrl }: { label?: string | null; redirectUrl?: string | null }) => {
   const trimmedLabel = label?.trim();

   if (trimmedLabel) {
      return trimmedLabel;
   }

   const safeRedirectUrl = getSafeExternalUrl(redirectUrl);

   if (safeRedirectUrl) {
      return `${new URL(safeRedirectUrl).hostname}로 이동하는 배너`;
   }

   return '히스토리 홈 배너 이미지';
};

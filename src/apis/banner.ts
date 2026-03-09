import { AdminBanner, BannerFormPayload, PublicBanner } from '@/interface/banner';
import axiosInstance from '@/utils/axiosInstance';

export const getPublicBanners = async (): Promise<PublicBanner[]> => {
   const response = await axiosInstance.get<PublicBanner[]>('/api/public/banners');
   return response.data;
};

const buildBannerFormData = (payload: BannerFormPayload) => {
   const formData = new FormData();

   if (payload.label !== undefined) {
      formData.append('label', payload.label);
   }
   if (payload.redirectUrl !== undefined) {
      formData.append('redirectUrl', payload.redirectUrl);
   }
   if (payload.active !== undefined) {
      formData.append('active', String(payload.active));
   }
   if (payload.image) {
      formData.append('image', payload.image);
   }

   return formData;
};

export const getAdminBanners = async (): Promise<AdminBanner[]> => {
   const response = await axiosInstance.get<AdminBanner[]>('/api/admin/banners');
   return response.data;
};

export const createAdminBanner = async (payload: BannerFormPayload & { label: string; image: File }) => {
   const response = await axiosInstance.post<AdminBanner>('/api/admin/banners', buildBannerFormData(payload), {
      headers: {
         'Content-Type': 'multipart/form-data',
      },
   });
   return response.data;
};

export const updateAdminBanner = async ({
   bannerId,
   payload,
}: {
   bannerId: number;
   payload: BannerFormPayload;
}) => {
   const response = await axiosInstance.patch<AdminBanner>(
      `/api/admin/banners/${bannerId}`,
      buildBannerFormData(payload),
      {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      },
   );
   return response.data;
};

export const deleteAdminBanner = async (bannerId: number) => {
   const response = await axiosInstance.delete(`/api/admin/banners/${bannerId}`);
   return response.data;
};

export const reorderAdminBanners = async (orderedIds: number[]) => {
   const response = await axiosInstance.patch('/api/admin/banners/reorder', {
      orderedIds,
   });
   return response.data;
};

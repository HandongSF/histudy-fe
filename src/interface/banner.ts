export interface PublicBanner {
   id: number;
   imageUrl: string;
   redirectUrl: string | null;
}

export interface AdminBanner extends PublicBanner {
   label: string;
   active: boolean;
   displayOrder: number;
}

export interface BannerFormPayload {
   label?: string;
   redirectUrl?: string;
   active?: boolean;
   image?: File;
}

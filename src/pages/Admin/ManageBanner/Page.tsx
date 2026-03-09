import {
   closestCenter,
   DndContext,
   KeyboardSensor,
   PointerSensor,
   useSensor,
   useSensors,
   type DragEndEvent,
} from '@dnd-kit/core';
import {
   arrayMove,
   SortableContext,
   sortableKeyboardCoordinates,
   useSortable,
   verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
   createAdminBanner,
   deleteAdminBanner,
   getAdminBanners,
   reorderAdminBanners,
   updateAdminBanner,
} from '@/apis/banner';
import { NoData } from '@/components/NoData';
import { WaveLoading } from '@/components/WaveLoading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminBanner, BannerFormPayload } from '@/interface/banner';
import { cn } from '@/lib/utils';
import { getSafeExternalUrl } from '@/utils/banner';
import { ChevronDown, Eye, EyeOff, GripVertical, ImagePlus, Save, Trash2, X } from 'lucide-react';
import { ChangeEvent, Fragment, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'sonner';

interface BannerFormState {
   label: string;
   redirectUrl: string;
   image: File | null;
}

interface SortableBannerItemProps {
   banner: AdminBanner;
   isEditing: boolean;
   isBusy: boolean;
   dragDisabled: boolean;
   onToggleEdit: (banner: AdminBanner) => void;
   onToggleActive: (banner: AdminBanner) => void;
}

const DEFAULT_FORM_STATE: BannerFormState = {
   label: '',
   redirectUrl: '',
   image: null,
};

const NEW_BANNER_ROW_ID = 'new';
const INVALID_REDIRECT_URL_MESSAGE = '이동 URL은 http:// 또는 https://로 시작하는 주소만 사용할 수 있습니다.';

const formatErrorMessage = (error: unknown, fallback: string) => {
   if (typeof error === 'object' && error !== null && 'response' in error) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      return response?.data?.message || fallback;
   }

   return fallback;
};

function SortableBannerItem({
   banner,
   isEditing,
   isBusy,
   dragDisabled,
   onToggleEdit,
   onToggleActive,
}: SortableBannerItemProps) {
   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: banner.id,
      disabled: dragDisabled,
   });

   const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 10 : undefined,
   };

   return (
      <div ref={setNodeRef} style={style}>
         <Card
            className={cn(
               'gap-4 py-4 transition-shadow',
               isDragging && 'shadow-lg ring-1 ring-primary/20',
               isEditing && 'border-primary/40 bg-primary/5',
            )}
         >
            <CardContent className="px-4">
               <div className="grid gap-4 xl:grid-cols-[40px_minmax(0,1fr)_minmax(0,1fr)_40px] xl:items-start">
                  <div className="flex items-center justify-between xl:block">
                     <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        disabled={dragDisabled}
                        className={cn(
                           'flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors',
                           dragDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab hover:text-foreground',
                        )}
                        aria-label={`${banner.label} 순서 변경`}
                     >
                        <GripVertical className="h-4 w-4" />
                     </button>
                  </div>

                  <div className="relative overflow-hidden rounded-xl border bg-muted/20">
                     <div className="flex h-56 items-center justify-center p-3 xl:h-full xl:min-h-[220px]">
                        <img src={banner.imageUrl} alt={banner.label} className="h-full w-full object-contain" />
                     </div>
                     <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                     <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="bg-background/90 text-foreground">
                           순서 {banner.displayOrder}
                        </Badge>
                     </div>
                     <div className="absolute bottom-3 left-3">
                        <Badge
                           variant={banner.active ? 'default' : 'secondary'}
                           className={cn(
                              'px-2.5 py-1 text-xs shadow-sm',
                              banner.active
                                 ? 'bg-emerald-500 text-white hover:bg-emerald-500'
                                 : 'bg-slate-900/80 text-white hover:bg-slate-900/80',
                           )}
                        >
                           {banner.active ? '노출 중' : '비노출'}
                        </Badge>
                     </div>
                     <div className="absolute right-3 top-3">
                        <Button
                           variant="secondary"
                           size="icon"
                           onClick={() => onToggleActive(banner)}
                           disabled={isBusy}
                           className="h-9 w-9 rounded-full bg-background/90"
                           aria-label={banner.active ? '배너 숨기기' : '배너 노출하기'}
                        >
                           {banner.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                     </div>
                  </div>

                  <div className="min-w-0 space-y-3">
                     <div className="break-words text-base font-semibold">{banner.label}</div>

                     <div className="rounded-lg border bg-muted/20 p-3 text-sm">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                           클릭 URL
                        </div>
                        <div className="mt-1 break-all text-muted-foreground">{banner.redirectUrl || '설정 안 됨'}</div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <button
                        type="button"
                        onClick={() => onToggleEdit(banner)}
                        disabled={isBusy}
                        className="flex h-10 w-10 items-center justify-center self-start text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                        aria-label={isEditing ? '배너 수정 패널 닫기' : '배너 수정 패널 열기'}
                     >
                        <ChevronDown className={cn('h-4 w-4 transition-transform', isEditing && 'rotate-180')} />
                     </button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

export default function ManageBannerPage() {
   const { data, isLoading, refetch } = useQuery(['adminBanners'], getAdminBanners, {
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
   });

   const { mutateAsync: createBanner, isLoading: isCreating } = useMutation(createAdminBanner);
   const { mutateAsync: updateBanner, isLoading: isUpdating } = useMutation(updateAdminBanner);
   const { mutateAsync: removeBanner, isLoading: isDeleting } = useMutation(deleteAdminBanner);
   const { mutateAsync: reorderBanners, isLoading: isReordering } = useMutation(reorderAdminBanners);

   const banners = useMemo(() => data ?? [], [data]);
   const [displayBanners, setDisplayBanners] = useState<AdminBanner[]>([]);
   const [editingRowId, setEditingRowId] = useState<number | typeof NEW_BANNER_ROW_ID | null>(null);
   const [formState, setFormState] = useState<BannerFormState>(DEFAULT_FORM_STATE);
   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
   const [bannerPendingDelete, setBannerPendingDelete] = useState<AdminBanner | null>(null);

   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: {
            distance: 6,
         },
      }),
      useSensor(KeyboardSensor, {
         coordinateGetter: sortableKeyboardCoordinates,
      }),
   );

   const isSubmitting = isCreating || isUpdating || isDeleting || isReordering;
   const editingBanner = useMemo(
      () =>
         typeof editingRowId === 'number' ? displayBanners.find((banner) => banner.id === editingRowId) ?? null : null,
      [displayBanners, editingRowId],
   );

   useEffect(() => {
      setDisplayBanners(banners);
   }, [banners]);

   useEffect(() => {
      if (!formState.image) {
         setPreviewUrl(null);
         return;
      }

      const objectUrl = URL.createObjectURL(formState.image);
      setPreviewUrl(objectUrl);

      return () => {
         URL.revokeObjectURL(objectUrl);
      };
   }, [formState.image]);

   const resetEditor = () => {
      setEditingRowId(null);
      setFormState(DEFAULT_FORM_STATE);
   };

   const startCreate = () => {
      setEditingRowId(NEW_BANNER_ROW_ID);
      setFormState(DEFAULT_FORM_STATE);
   };

   const startEdit = (banner: AdminBanner) => {
      setEditingRowId((prev) => {
         if (prev === banner.id) {
            setFormState(DEFAULT_FORM_STATE);
            return null;
         }

         setFormState({
            label: banner.label,
            redirectUrl: banner.redirectUrl ?? '',
            image: null,
         });

         return banner.id;
      });
   };

   const handleTextChange = (field: keyof Omit<BannerFormState, 'image'>) => (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({
         ...prev,
         [field]: event.target.value,
      }));
   };

   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({
         ...prev,
         image: event.target.files?.[0] ?? null,
      }));
   };

   const normalizeRedirectUrl = (value: string) => {
      const trimmedValue = value.trim();

      if (!trimmedValue) {
         return '';
      }

      return getSafeExternalUrl(trimmedValue);
   };

   const buildUpdatePayload = (banner: AdminBanner, normalizedRedirectUrl: string): BannerFormPayload => {
      const payload: BannerFormPayload = {};
      const trimmedLabel = formState.label.trim();
      const currentRedirectUrl = getSafeExternalUrl(banner.redirectUrl) ?? banner.redirectUrl ?? '';

      if (trimmedLabel !== banner.label) {
         payload.label = trimmedLabel;
      }
      if (normalizedRedirectUrl !== currentRedirectUrl) {
         payload.redirectUrl = normalizedRedirectUrl;
      }
      if (formState.image) {
         payload.image = formState.image;
      }

      return payload;
   };

   const handleSubmit = async () => {
      const trimmedLabel = formState.label.trim();
      const normalizedRedirectUrl = normalizeRedirectUrl(formState.redirectUrl);

      if (!trimmedLabel) {
         toast.error('배너 라벨을 입력해주세요.');
         return;
      }

      if (formState.redirectUrl.trim() && !normalizedRedirectUrl) {
         toast.error(INVALID_REDIRECT_URL_MESSAGE);
         return;
      }

      try {
         if (editingRowId === NEW_BANNER_ROW_ID) {
            if (!formState.image) {
               toast.error('배너 이미지를 선택해주세요.');
               return;
            }

            await createBanner({
               label: trimmedLabel,
               redirectUrl: normalizedRedirectUrl ?? '',
               image: formState.image,
               active: true,
            });
            toast.success('배너가 생성되었습니다.');
         } else if (editingBanner) {
            const payload = buildUpdatePayload(editingBanner, normalizedRedirectUrl ?? '');

            if (Object.keys(payload).length === 0) {
               toast.error('변경된 내용이 없습니다.');
               return;
            }

            await updateBanner({
               bannerId: editingBanner.id,
               payload,
            });
            toast.success('배너가 수정되었습니다.');
         }

         resetEditor();
         refetch();
      } catch (error) {
         toast.error(formatErrorMessage(error, '배너 저장에 실패했습니다.'));
      }
   };

   const handleDelete = async () => {
      if (!bannerPendingDelete) {
         return;
      }

      try {
         await removeBanner(bannerPendingDelete.id);
         if (editingRowId === bannerPendingDelete.id) {
            resetEditor();
         }
         setBannerPendingDelete(null);
         toast.success('배너가 삭제되었습니다.');
         refetch();
      } catch (error) {
         toast.error(formatErrorMessage(error, '배너 삭제에 실패했습니다.'));
      }
   };

   const handleToggleActive = async (banner: AdminBanner) => {
      try {
         await updateBanner({
            bannerId: banner.id,
            payload: {
               active: !banner.active,
            },
         });
         toast.success(banner.active ? '배너를 숨겼습니다.' : '배너를 노출했습니다.');
         refetch();
      } catch (error) {
         toast.error(formatErrorMessage(error, '배너 노출 상태 변경에 실패했습니다.'));
      }
   };

   const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id || editingRowId !== null) {
         return;
      }

      const oldIndex = displayBanners.findIndex((banner) => banner.id === active.id);
      const newIndex = displayBanners.findIndex((banner) => banner.id === over.id);

      if (oldIndex < 0 || newIndex < 0) {
         return;
      }

      const previousBanners = displayBanners;
      const reordered = arrayMove(displayBanners, oldIndex, newIndex).map((banner, index) => ({
         ...banner,
         displayOrder: index + 1,
      }));

      setDisplayBanners(reordered);

      try {
         await reorderBanners(reordered.map((banner) => banner.id));
         toast.success('배너 순서가 변경되었습니다.');
         refetch();
      } catch (error) {
         setDisplayBanners(previousBanners);
         toast.error(formatErrorMessage(error, '배너 순서 변경에 실패했습니다.'));
      }
   };

   const renderEditorCard = (mode: 'create' | 'edit', banner?: AdminBanner) => (
      <Card className="gap-4 border-dashed py-4">
         <CardHeader className="px-4">
            <CardTitle className="text-base">{mode === 'create' ? '새 배너 추가' : '배너 수정'}</CardTitle>
         </CardHeader>
         <CardContent className="px-4">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
               <div className="space-y-2">
                  <Label htmlFor={`banner-image-${mode}`}>배너 이미지</Label>
                  {previewUrl ? (
                     <div className="flex h-[280px] items-center justify-center rounded-xl border bg-muted/20 p-3 lg:h-[360px] xl:h-[420px]">
                        <img
                           src={previewUrl}
                           alt="선택한 배너 미리보기"
                           className="h-full w-full rounded-lg object-contain"
                        />
                     </div>
                  ) : mode === 'edit' && banner ? (
                     <div className="relative overflow-hidden rounded-xl border">
                        <div className="flex h-[280px] items-center justify-center bg-muted/20 p-3 lg:h-[360px] xl:h-[420px]">
                           <img
                              src={banner.imageUrl}
                              alt={banner.label}
                              className="h-full w-full rounded-lg object-contain"
                           />
                        </div>
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute bottom-3 left-3">
                           <Badge
                              variant={banner.active ? 'default' : 'secondary'}
                              className={cn(
                                 'px-2.5 py-1 text-xs shadow-sm',
                                 banner.active
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-500'
                                    : 'bg-slate-900/80 text-white hover:bg-slate-900/80',
                              )}
                           >
                              {banner.active ? '노출 중' : '비노출'}
                           </Badge>
                        </div>
                     </div>
                  ) : (
                     <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground lg:h-[360px] xl:h-[420px]">
                        새 배너 미리보기
                     </div>
                  )}
               </div>

               <div className="min-w-0 space-y-4 xl:ml-auto xl:w-full xl:max-w-[360px]">
                  <div className="space-y-2">
                     <Label htmlFor={`banner-label-${mode}`}>라벨</Label>
                     <Input
                        id={`banner-label-${mode}`}
                        value={formState.label}
                        onChange={handleTextChange('label')}
                        placeholder="운영 식별용 라벨"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor={`banner-link-${mode}`}>이동 URL</Label>
                     <Input
                        id={`banner-link-${mode}`}
                        value={formState.redirectUrl}
                        onChange={handleTextChange('redirectUrl')}
                        placeholder="https://example.com"
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor={`banner-file-${mode}`}>업로드 파일</Label>
                     <Input id={`banner-file-${mode}`} type="file" accept="image/*" onChange={handleFileChange} />
                     <p className="text-xs text-muted-foreground">
                        {formState.image
                           ? `선택된 파일: ${formState.image.name}`
                           : mode === 'edit'
                           ? '이미지를 바꾸지 않으면 기존 이미지를 유지합니다.'
                           : '생성 시 이미지 파일이 필수입니다.'}
                     </p>
                  </div>
                  <div className="rounded-md border bg-muted/20 p-3 text-xs text-muted-foreground">
                     노출 여부는 목록의 눈 아이콘으로 바로 변경됩니다.
                  </div>
                  <div className="flex flex-col gap-2">
                     <Button onClick={handleSubmit} disabled={isSubmitting} className="sm:flex-1">
                        <Save className="mr-2 h-4 w-4" />
                        완료
                     </Button>
                     {mode === 'create' && (
                        <Button variant="outline" onClick={resetEditor} disabled={isSubmitting} className="sm:flex-1">
                           <X className="mr-2 h-4 w-4" />
                           취소
                        </Button>
                     )}
                     {mode === 'edit' && banner && (
                        <Button
                           variant="destructive"
                           onClick={() => setBannerPendingDelete(banner)}
                           disabled={isSubmitting}
                           className="sm:flex-1"
                        >
                           <Trash2 className="mr-2 h-4 w-4" />
                           삭제
                        </Button>
                     )}
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   );

   if (isLoading) {
      return <WaveLoading />;
   }

   return (
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
         <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
               <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold">배너 관리</h1>
                  <Badge variant="secondary">총 {displayBanners.length}개</Badge>
               </div>
               <p className="mt-2 text-sm text-muted-foreground">
                  드래그로 순서를 바꾸고, 눈 아이콘으로 노출 여부를 바로 전환할 수 있습니다.
               </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
               <Button
                  onClick={startCreate}
                  disabled={isSubmitting || editingRowId === NEW_BANNER_ROW_ID}
                  className="w-full sm:w-auto"
               >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  배너 추가
               </Button>
            </div>
         </div>

         <div className="space-y-4">
            {displayBanners.length === 0 && editingRowId !== NEW_BANNER_ROW_ID ? (
               <NoData
                  title="등록된 배너가 없습니다"
                  description="목록 상단에서 새 배너를 추가해보세요."
                  actionText="배너 추가"
                  onAction={startCreate}
                  className="border-0 shadow-none"
               />
            ) : (
               <>
                  {editingRowId === NEW_BANNER_ROW_ID && renderEditorCard('create')}

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                     <SortableContext
                        items={displayBanners.map((banner) => banner.id)}
                        strategy={verticalListSortingStrategy}
                     >
                        <div className="space-y-4">
                           {displayBanners.map((banner) => (
                              <Fragment key={banner.id}>
                                 <SortableBannerItem
                                    banner={banner}
                                    isEditing={editingRowId === banner.id}
                                    isBusy={isSubmitting || (editingRowId !== null && editingRowId !== banner.id)}
                                    dragDisabled={isSubmitting || editingRowId !== null}
                                    onToggleEdit={startEdit}
                                    onToggleActive={handleToggleActive}
                                 />
                                 {editingRowId === banner.id && renderEditorCard('edit', banner)}
                              </Fragment>
                           ))}
                        </div>
                     </SortableContext>
                  </DndContext>
               </>
            )}
         </div>

         <Dialog open={!!bannerPendingDelete} onOpenChange={(open) => !open && setBannerPendingDelete(null)}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle>배너를 삭제할까요?</DialogTitle>
                  <DialogDescription>
                     {bannerPendingDelete
                        ? `'${bannerPendingDelete.label}' 배너를 삭제하면 되돌릴 수 없습니다.`
                        : '선택한 배너를 삭제하면 되돌릴 수 없습니다.'}
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter>
                  <Button variant="outline" onClick={() => setBannerPendingDelete(null)} disabled={isDeleting}>
                     취소
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                     삭제
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}

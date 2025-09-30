import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Textarea는 더 이상 필요 없지만, 다른 필드에 사용될 수 있으므로 유지
import {
  BookOpen,
  Clock,
  FileText,
  ImageIcon,
  Users,
  XCircle,
} from "lucide-react";
import * as z from "zod";

import { teamCourses } from "@/apis/course";
import { readReportDetail } from "@/apis/manager";
import { ImageUploadApi as ImageUploadToServer } from "@/apis/rank";
import { modifyReport } from "@/apis/report";
import { getMyTeamUsers } from "@/apis/users";
import { NoData } from "@/components/NoData";
import { WaveLoading } from "@/components/WaveLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { paths } from "@/const/paths";
import { NewReport } from "@/interface/report";
import { StudyCertificationDialog } from "@/pages/ReportAdd/components/StudyCertificationDialog";
import Heic2Jpg from "@/utils/Heic2Jpg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef } from "react";
import { useQueries, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { convertBlobToWebp } from "@/utils/convertBlobToWebp";
import { addImagePrefix } from "@/utils/imagePrefix";

import { TiptapEditor } from "@/components/tiptap-editor";

// Zod 스키마 정의 (유효성 검사)
const reportFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "보고서 내용을 입력해주세요."),
  participants: z.array(z.number()).min(1, "스터디 참여 멤버를 선택해주세요."),
  totalMinutes: z.string().min(1, "스터디 시간을 입력해주세요."),
  courses: z.array(z.number()).min(1, "스터디 과목을 선택해주세요."),
  images: z.array(z.string()),
  previewImages: z.array(z.string()),
  blobImages: z.array(z.instanceof(File)),
});

type ReportFormState = z.infer<typeof reportFormSchema>;

export default function ReportEditPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { id } = useParams() as { id: string };
  const { data: report, isLoading } = useQuery({
    queryKey: ["report", id],
    queryFn: () => readReportDetail(+id),
  });

  const form = useForm<ReportFormState>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      content: "",
      participants: [],
      totalMinutes: "",
      images: [],
      courses: [],
      previewImages: [],
      blobImages: [],
    },
  });

  // 기존 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (report) {
      form.reset({
        title: report.title,
        content: report.content,
        participants: report.participants.map((participant) => participant.id),
        totalMinutes: String(report.totalMinutes),
        images: [],
        courses: report.courses.map((course) => course.id),
        // 이곳을 수정합니다.
        previewImages: report.images.map((image) => addImagePrefix(image.url)),
        blobImages: [],
      });
    }
  }, [report, form]);

  form.watch(["previewImages", "blobImages"]);

  const onValid = async (formData: ReportFormState) => {
    // Blob 이미지 업로드
    // const newImagePaths: string[] = [];
    // for (const blobImage of formData.blobImages) {
    //     const imageForm = new FormData();
    //     imageForm.append("image", blobImage);
    //     try {
    //         const res = await ImageUploadToServer(null, imageForm);
    //         newImagePaths.push(res.data.imagePath);
    //     } catch (error) {
    //         toast.error("이미지 업로드 중 오류가 발생했습니다.");
    //         return;
    //     }
    // }
    // // 기존 이미지 URL과 새로 업로드된 이미지 경로를 합침
    // const existingImages = report?.images.map((image) => image.url) || [];
    // const combinedImages = [...existingImages, ...newImagePaths];
    // // 보고서 수정 API 호출
    // const newReport = {
    //     title: formData.title,
    //     content: formData.content,
    //     totalMinutes: Number(formData.totalMinutes),
    //     participants: formData.participants,
    //     images: combinedImages,
    //     courses: formData.courses,
    // } as NewReport;
    // await modifyReport(+id, newReport);
    // queryClient.invalidateQueries({ queryKey: ["reports"] });
    // toast.success("보고서 수정이 완료되었습니다.");
    // navigate(paths.reports.root);
    // onValid 함수 내부 수정
    const newImagePaths: string[] = [];
    for (const blobImage of formData.blobImages) {
      const imageForm = new FormData();
      imageForm.append("image", blobImage);
      try {
        const res = await ImageUploadToServer(null, imageForm);
        newImagePaths.push(res.data.imagePath);
      } catch (error) {
        toast.error("이미지 업로드 중 오류가 발생했습니다.");
        return;
      }
    }

    // 폼의 최신 상태인 formData.previewImages에서 기존 이미지 URL만 필터링
    // 'data:'로 시작하는 것은 새로 추가된 미리보기 이미지이므로 제외
    const existingImagesFromForm = formData.previewImages.filter(
      (url) => !url.startsWith("data:")
    );

    // 기존 이미지 URL과 새로 업로드된 이미지 경로를 합침
    const combinedImages = [...existingImagesFromForm, ...newImagePaths];

    // 보고서 수정 API 호출
    const newReport = {
      title: formData.title,
      content: formData.content,
      totalMinutes: Number(formData.totalMinutes),
      participants: formData.participants,
      images: combinedImages, // 수정된 images 배열 사용
      courses: formData.courses,
    } as NewReport;

    await modifyReport(+id, newReport);
    queryClient.invalidateQueries({ queryKey: ["reports"] });

    toast.success("보고서 수정이 완료되었습니다.");
    navigate(paths.reports.root);
  };

  const [
    { data: coursesRes, isLoading: coursesLoading },
    { data: participants, isLoading: participantsLoading },
  ] = useQueries([
    {
      queryKey: ["teamCourses"],
      queryFn: teamCourses,
      cacheTime: 5 * 60 * 1000,
    },
    {
      queryKey: ["teamMembers"],
      queryFn: getMyTeamUsers,
      cacheTime: 5 * 60 * 1000,
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const onUploadImageButtonClick = useCallback(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.click();
  }, []);

  function blobToFile(blob: Blob, fileName: string) {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: new Date().getTime(),
    });
  }

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const currentImagesLength = form.getValues("previewImages").length;
    if (currentImagesLength >= 3) {
      toast.warning("최대 3개의 이미지만 업로드 가능합니다.");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    let targetBlob;
    if (file.type === "image/heic" || file.type === "image/heif") {
      targetBlob = await Heic2Jpg(file);
      targetBlob = await convertBlobToWebp(targetBlob);
    } else {
      targetBlob = await convertBlobToWebp(file);
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      form.setValue("previewImages", [
        ...form.getValues("previewImages"),
        reader.result as string,
      ]);
    };
    reader.readAsDataURL(targetBlob);

    form.setValue("blobImages", [
      ...form.getValues("blobImages"),
      blobToFile(
        targetBlob,
        `histudy_${new Date()
          .toISOString()
          .replace(/[-:.]/g, "")
          .slice(0, 15)}.webp`
      ),
    ]);
  };

  const onDeleteImage = (indexToDelete: number) => {
    const currentPreviewImages = form.getValues("previewImages");
    const currentBlobImages = form.getValues("blobImages");
    const originalImageCount = report?.images.length ?? 0;

    if (indexToDelete < originalImageCount) {
      const updatedPreviewImages = currentPreviewImages.filter(
        (_, i) => i !== indexToDelete
      );
      form.setValue("previewImages", updatedPreviewImages);
    } else {
      const blobIndex = indexToDelete - originalImageCount;
      const updatedBlobImages = currentBlobImages.filter(
        (_, i) => i !== blobIndex
      );
      form.setValue("blobImages", updatedBlobImages);

      const updatedPreviewImages = currentPreviewImages.filter(
        (_, i) => i !== indexToDelete
      );
      form.setValue("previewImages", updatedPreviewImages);
    }
  };

  if (isLoading || coursesLoading || participantsLoading) {
    return <WaveLoading />;
  }

  if (!report) {
    return (
      <div className="flex justify-center items-center h-screen">
        <NoData
          title="보고서를 찾을 수 없습니다."
          description="보고서를 찾을 수 없습니다. 다시 시도해주세요."
          height={300}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">
        보고서 수정
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onValid)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                인증샷 (1~3개)
              </CardTitle>
              <CardDescription>
                코드를 생성해서 참여한 멤버들과 사진을 찍고 인증샷을 올려주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="previewImages"
                render={() => (
                  <FormItem>
                    <div className="flex gap-2">
                      <StudyCertificationDialog />

                      <Button
                        type="button"
                        onClick={onUploadImageButtonClick}
                        disabled={form.getValues("previewImages").length >= 3}
                      >
                        인증샷 업로드
                      </Button>

                      <input
                        id="image-upload"
                        type="file"
                        ref={inputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={onImageChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {form.getValues("previewImages").map((url, index) => (
                        <div
                          key={`image-${index}`}
                          className="relative group aspect-square"
                        >
                          <img
                            src={url}
                            alt={`이미지 ${index + 1}`}
                            className="w-full h-full object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-70 group-hover:opacity-100"
                            onClick={() => onDeleteImage(index)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 스터디 과목 선택 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                스터디 과목
              </CardTitle>
              <CardDescription>
                스터디를 한 과목을 모두 골라주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="courses"
                render={() => (
                  <FormItem className="space-y-2">
                    {coursesRes?.courses.map((course) => (
                      <FormField
                        key={course.id}
                        control={form.control}
                        name="courses"
                        render={({ field }) => {
                          return (
                            <FormLabel
                              key={course.id}
                              htmlFor={`course-${course.id}`}
                              className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                            >
                              <Checkbox
                                id={`course-${course.id}`}
                                checked={field.value.includes(course.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        course.id,
                                      ])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (id) => id !== course.id
                                        )
                                      );
                                }}
                              />
                              <FormLabel
                                htmlFor={`course-${course.id}`}
                                className="text-sm font-normal"
                              >
                                {course.name} ({course.code})
                              </FormLabel>
                            </FormLabel>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 참여 멤버 선택 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                참여 멤버
              </CardTitle>
              <CardDescription>
                스터디에 참여한 멤버를 선택해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="participants"
                render={() => (
                  <FormItem>
                    {participants?.map((participant) => (
                      <FormField
                        key={participant.id}
                        control={form.control}
                        name="participants"
                        render={({ field }) => {
                          return (
                            <FormLabel
                              htmlFor={`participant-${participant.id}`}
                              className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                            >
                              <Checkbox
                                id={`participant-${participant.id}`}
                                checked={field.value?.includes(participant.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        participant.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== participant.id
                                        )
                                      );
                                }}
                              />
                              <FormLabel
                                htmlFor={`participant-${participant.id}`}
                                className="text-sm font-normal"
                              >
                                {participant.name}, {participant.sid}
                              </FormLabel>
                            </FormLabel>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 스터디 시간 입력 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                스터디 시간
              </CardTitle>
              <CardDescription>
                스터디 시간을 분 단위로 알려주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="relative h-[40px]">
                <FormField
                  control={form.control}
                  name="totalMinutes"
                  render={({ field }) => (
                    <FormItem className="h-[40px]">
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="예: 120"
                          {...field}
                          className="pr-12"
                        />
                      </FormControl>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        분
                      </span>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* 보고서 작성 섹션 - TiptapEditor 컴포넌트 사용 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                보고서 내용
              </CardTitle>
              <CardDescription>스터디 보고서를 작성해주세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제목</FormLabel>
                      <FormControl>
                        <Input placeholder="제목 작성" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>내용</FormLabel>
                      <FormControl>
                        <TiptapEditor
                          content={field.value}
                          onUpdate={(html) => field.onChange(html)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* 제출/취소 버튼 */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(paths.reports.root)}
            >
              취소
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              제출
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

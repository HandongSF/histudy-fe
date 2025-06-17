" ";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ImageUploadApi as ImageUploadToServer } from "@/apis/rank";
import { postReport } from "@/apis/report";
import { getMyTeamUsers } from "@/apis/users";
import Heic2Jpg from "@/components/Image/Heic2Jpg";
import compressedFile from "@/components/Image/compressFile";
import { StudyCertificationDialog } from "@/components/Post/StudyCertificationDialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NewReport } from "@/interface/report";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef } from "react";
import { useQueries, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { readReportDetail } from "@/apis/manager";
import { paths } from "@/const/paths";

// Zod 스키마 정의 (유효성 검사)
const reportFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().min(1, "보고서 내용을 입력해주세요."),
  participants: z.array(z.number()).min(1, "스터디 참여 멤버를 선택해주세요."),
  totalMinutes: z.string().min(1, "스터디 시간을 입력해주세요."),
  courses: z.array(z.number()).min(1, "스터디 과목을 선택해주세요."),
  images: z.array(z.string()),
  previewImages: z
    .array(z.string())
    .min(1, "최소 1개의 이미지를 업로드 해주세요.")
    .max(3, "최대 3개의 이미지만 업로드 가능합니다."),
  blobImages: z
    .array(z.instanceof(File))
    .min(1, "최소 1개의 이미지를 업로드 해주세요.")
    .max(3, "최대 3개의 이미지만 업로드 가능합니다."),
});

type ReportFormState = z.infer<typeof reportFormSchema>;

export default function EditReportPage() {
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const { data: report } = useQuery({
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

  useEffect(() => {
    if (report) {
      form.reset({
        title: report.title,
        content: report.content,
        participants: report.participants.map((participant) => participant.id),
        totalMinutes: String(report.totalMinutes),
        images: [],
        courses: report.courses.map((course) => course.id),
        previewImages: report.images.map((image) => image.url),
        blobImages: report.images.map((image) => new File([], image.url)),
      });
    }
  }, [report, form]);

  form.watch(["previewImages", "blobImages"]);

  console.log(form);

  const onValid = async (formData: ReportFormState) => {
    console.log(formData);

    for (let i = 0; i < formData.blobImages.length; ++i) {
      const imageForm = new FormData();
      imageForm.append("image", formData.blobImages[i]);

      await ImageUploadToServer(null, imageForm).then((res) => {
        form.setValue("images", [
          ...form.getValues("images"),
          res.data.imagePath,
        ]);
      });
    }

    // 보고서 생성 api 연결
    const newReport = {
      title: formData.title,
      content: formData.content,
      totalMinutes: Number(formData.totalMinutes),
      participants: formData.participants,
      images: form.getValues("images"),
      courses: formData.courses,
    } as NewReport;
    //  modifyReport(state.id, newReport) :
    postReport(newReport);

    alert("보고서 제출이 완료되었습니다.");
    navigate(paths.reports.root);
  };

  const [{ data: coursesRes }, { data: participants }] = useQueries([
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

  console.log(form.getValues());
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
    if (form.getValues("previewImages").length >= 3) {
      alert("최대 3개의 이미지만 업로드 가능합니다.");
      return;
    }
    const file = e.target.files;
    if (!file) return null;

    const convertedFile = await Heic2Jpg(file[0]);

    const lowCapacityFile = await compressedFile(convertedFile as File);

    const reader = new FileReader();
    reader.onloadend = () => {
      form.setValue("previewImages", [
        ...form.getValues("previewImages"),
        reader.result as string,
      ]);
    };
    reader.readAsDataURL(file[0]);

    form.setValue("blobImages", [
      ...form.getValues("blobImages"),
      blobToFile(lowCapacityFile, "test.jpg"),
    ]);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-center">
        새 보고서 작성
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
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={onImageChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {form.getValues("previewImages").map((url, index) => (
                        <div
                          key={`new-${index}`}
                          className="relative group aspect-square"
                        >
                          <img
                            src={url || "/img/placeholder.svg"}
                            alt={`새 이미지 ${index + 1}`}
                            className="w-full h-full object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 opacity-70 group-hover:opacity-100"
                            onClick={() => {
                              form.setValue(
                                "blobImages",
                                form
                                  .getValues("blobImages")
                                  .filter((_, i) => i !== index)
                              );
                              form.setValue(
                                "previewImages",
                                form
                                  .getValues("previewImages")
                                  .filter((_, i) => i !== index)
                              );
                            }}
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

          {/* 보고서 작성 섹션 */}
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
                        <Textarea
                          rows={10}
                          placeholder="보고서 내용 작성"
                          className="resize-none min-h-[200px] max-h-[400px]"
                          {...field}
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
            <Button type="submit" onClick={() => console.log(form.getValues())}>
              제출
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

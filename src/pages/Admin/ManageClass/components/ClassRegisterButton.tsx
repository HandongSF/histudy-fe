import { importCourses } from "@/apis/course";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { toast } from "sonner";
export default function ClassRegisterButton() {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (!window.confirm("해당 파일을 등록하시겠습니까??")) return;

    const formData = new FormData();

    if (!event.target.files) return;

    formData.append("file", event.target.files[0]);

    importCourses(formData).then((res) => {
      toast.success("성공적으로 등록되었습니다.");
      window.location.reload();
    });
  };

  const handleClick = () => {
    if (!fileRef.current) return;
    fileRef.current.click();
  };
  return (
    <>
      <input
        type="file"
        ref={fileRef}
        hidden
        // style={{ display: "hidden" }}
        onChange={handleChange}
      />
      <Button onClick={handleClick}>수업 목록 불러오기</Button>
    </>
  );
}

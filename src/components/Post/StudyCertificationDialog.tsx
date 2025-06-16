import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

function updateCurrentTime() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedTime;
}

setInterval(updateCurrentTime, 1000);

export function StudyCertificationDialog() {
  const [nowTime, setNowTime] = useState(updateCurrentTime());
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTime(updateCurrentTime());
    }, 1000);
    return () => clearInterval(interval);
  });

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">인증 코드 생성</Button>
        </DialogTrigger>
        <DialogContent className="">
          <div className="flex flex-col items-center justify-center w-full h-full p-6 pt-10 space-y-6">
            <img
              src="/img/study-certification.png"
              alt="study-certification"
              className="w-full h-full object-cover"
            />

            <div className="text-2xl font-bold">{nowTime}</div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}

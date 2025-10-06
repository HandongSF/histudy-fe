import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

function updateCurrentTime() {
   const currentDate = new Date();
   const year = currentDate.getFullYear();
   const month = String(currentDate.getMonth() + 1).padStart(2, '0');
   const day = String(currentDate.getDate()).padStart(2, '0');
   const hours = String(currentDate.getHours()).padStart(2, '0');
   const minutes = String(currentDate.getMinutes()).padStart(2, '0');
   const seconds = String(currentDate.getSeconds()).padStart(2, '0');

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
            <DialogContent className="w-full md:min-w-[700px]">
               <div className="flex flex-col items-center justify-center w-full h-full py-10 space-y-8">
                  <div className="text-blue-400 text-7xl md:text-8xl">HIStudy</div>

                  <div className="text-3xl md:text-5xl font-bold">{nowTime}</div>
               </div>
            </DialogContent>
         </form>
      </Dialog>
   );
}

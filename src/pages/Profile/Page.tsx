import { getProfile } from '@/apis/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WaveLoading } from '@/components/WaveLoading';
import { useHIStateValue } from '@/hooks/HIState';
import { roleState } from '@/store/HISAtom';

import { BadgeIcon as IdCard, Mail, User } from 'lucide-react';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

const roleMap = {
   USER: '학생',
   MEMBER: '스터디원',
   ADMIN: '관리자',
   NONUSER: '비회원',
};

export default function ProfilePage() {
   const { data, isLoading } = useQuery(['profile'], getProfile, {
      cacheTime: 24 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
   });

   const role = useHIStateValue(roleState);

   const userInfo = useMemo(() => {
      if (!data)
         return {
            name: 'NONUSER',
            sid: '********',
            email: '********',
         };
      return data;
   }, [data]);

   if (isLoading) {
      return <WaveLoading />;
   }

   return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
         <div className="container mx-auto py-8 px-4 max-w-2xl">
            <header className="mb-8">
               <h1 className="text-3xl font-bold tracking-tight mb-2">나의 프로필</h1>
            </header>
            <Card className="shadow-md ">
               <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                     <Avatar className="h-20 w-20 border-2 border-primary/10">
                        <AvatarImage src={'/img/default-profile.png'} alt={userInfo.name} />
                        <AvatarFallback className="text-2xl bg-primary/10">{userInfo.name.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <div>
                        <CardTitle className="text-2xl">{userInfo.name}</CardTitle>
                        <CardDescription>{roleMap[role]}</CardDescription>
                     </div>
                  </div>
               </CardHeader>

               <CardContent className="space-y-6">
                  <div className="space-y-4">
                     <div className="flex items-center py-2 border-b">
                        <User className="h-5 w-5 text-muted-foreground mr-3" />
                        <div>
                           <div className="text-sm font-medium text-muted-foreground">이름</div>
                           <div className="font-medium">{userInfo.name}</div>
                        </div>
                     </div>

                     <div className="flex items-center py-2 border-b">
                        <IdCard className="h-5 w-5 text-muted-foreground mr-3" />
                        <div>
                           <div className="text-sm font-medium text-muted-foreground">학번</div>
                           <div className="font-medium">{userInfo.sid}</div>
                        </div>
                     </div>

                     <div className="flex items-center py-2">
                        <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                        <div>
                           <div className="text-sm font-medium text-muted-foreground">이메일</div>
                           <div className="font-medium">{userInfo.email}</div>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}

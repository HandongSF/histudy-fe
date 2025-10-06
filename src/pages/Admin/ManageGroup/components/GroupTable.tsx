import { editUser, EditUserRequest } from '@/apis/manager';
import SpinnerLoading from '@/components/SpinnerLoading';
import { Input } from '@/components/ui/input';
import { SimpleCourse } from '@/interface/course';
import { Group } from '@/interface/group';
import { GroupMemberWithStudyInfo, UnAssignedUser } from '@/interface/user';
import { Check, Pencil, SearchIcon, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const displayGroupText = (groupValue: number | null) => {
   if (groupValue === null) {
      return '미배정';
   }
   return `Group ${groupValue}`;
};

const formatCourseDisplay = (course: SimpleCourse) => {
   const cleanedName = course.name.replace(/\n/g, ' ').trim();
   const cleanedProf = course.prof.replace(/\n/g, '').trim();
   return `${cleanedName} (${cleanedProf})`;
};

interface GroupTableProps {
   groups: Group[] | undefined;
   members: GroupMemberWithStudyInfo[] | UnAssignedUser[];
   refetch: () => void;
   loading: boolean;
}

const GROUP_OPTIONS = [
   { value: null, label: '미배정' },
   ...Array.from({ length: 50 }, (_, i) => ({
      value: i + 1,
      label: `Group ${i + 1}`,
   })),
];

export default function GroupTable({ members, groups, refetch, loading }: GroupTableProps) {
   const [editingMember, setEditingMember] = useState<EditUserRequest | null>(null);

   const [searchTerm, setSearchTerm] = useState('');

   const filteredMembers = members.filter(
      (member) =>
         member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (member.group !== null && displayGroupText(member.group).toLowerCase().includes(searchTerm.toLowerCase())) ||
         member.sid.toLowerCase().includes(searchTerm.toLowerCase()) ||
         member.email.toLowerCase().includes(searchTerm.toLowerCase()),
   );

   const handleEditToggle = (member: GroupMemberWithStudyInfo | UnAssignedUser) => {
      setEditingMember({
         id: member.id,
         team: member.group,
         name: member.name,
         sid: member.sid,
      });
   };

   const handleCancelEdit = () => {
      setEditingMember(null);
   };

   const handleSaveMember = async () => {
      if (!editingMember) {
         toast.error('수정할 학생을 선택해주세요.');
         return;
      }
      await editUser(editingMember);
      toast.success('수정되었습니다.');
      setEditingMember(null);
      refetch();
   };

   return (
      <div className="flex flex-col gap-4">
         <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
               type="search"
               placeholder="학생 이름, 학번, 이메일, 그룹 검색"
               className="pl-8 w-full"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="bg-white dark:bg-slate-800 border rounded-lg  h-[500px] overflow-y-auto">
            {loading ? (
               <div className="flex justify-center items-center h-full">
                  <SpinnerLoading />
               </div>
            ) : (
               <table className=" w-full min-w-[1000px] text-sm text-left text-slate-500 dark:text-slate-400">
                  <thead className=" border-b text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                     <tr>
                        <th scope="col" className="px-4 py-3 w-[12%]">
                           그룹
                        </th>
                        <th scope="col" className="px-4 py-3 w-[18%]">
                           학생 정보
                        </th>
                        <th scope="col" className="px-4 py-3 w-[18%]">
                           희망 1과목
                        </th>
                        <th scope="col" className="px-4 py-3 w-[18%]">
                           희망 2과목
                        </th>
                        <th scope="col" className="px-4 py-3 w-[18%]">
                           희망 3과목
                        </th>
                        <th scope="col" className="px-4 py-3 w-[11%]">
                           함께하고 싶은 친구
                        </th>
                        <th scope="col" className="px-4 py-3 w-[5%] text-center">
                           수정
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {filteredMembers.map((member) => (
                        <tr
                           key={member.id}
                           className={`border-b dark:border-slate-700 ${
                              editingMember?.sid === member.sid
                                 ? 'bg-sky-100 dark:bg-sky-900/50'
                                 : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                           }`}
                        >
                           <td className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                              {editingMember && editingMember?.sid === member.sid ? (
                                 <select
                                    value={editingMember.team!}
                                    onChange={(e) =>
                                       setEditingMember((prev) => ({
                                          ...prev!,
                                          team: Number(e.target.value),
                                       }))
                                    }
                                    className="px-2 py-1.5 border rounded w-full text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-sky-500 focus:border-sky-500"
                                    autoFocus
                                 >
                                    {GROUP_OPTIONS.map((option) => (
                                       <option key={option.value} value={option.value!}>
                                          {option.label}
                                       </option>
                                    ))}
                                 </select>
                              ) : (
                                 displayGroupText(member.group)
                              )}
                           </td>
                           <td className="px-4 py-3">
                              <div className="font-semibold text-slate-800 dark:text-slate-100">{member.name}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{member.sid}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">{member.email}</div>
                           </td>
                           {[0, 1, 2].map((courseIndex) => (
                              <td key={courseIndex} className="px-4 py-3">
                                 {member.courses[courseIndex] ? (
                                    formatCourseDisplay(member.courses[courseIndex])
                                 ) : (
                                    <span className="text-slate-400 dark:text-slate-500">-</span>
                                 )}
                              </td>
                           ))}
                           <td className="px-4 py-3">
                              {member.friends.length > 0 ? (
                                 member.friends
                                    .slice(0, 3)
                                    .map((friend) => friend.name)
                                    .join(', ')
                              ) : (
                                 <span className="text-slate-400 dark:text-slate-500">-</span>
                              )}
                           </td>
                           <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center space-x-1">
                                 {editingMember?.sid === member.sid ? (
                                    <>
                                       <button
                                          onClick={handleSaveMember}
                                          className="p-1 rounded text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                          aria-label={`Save group for ${member.name}`}
                                       >
                                          <Check size={18} />
                                       </button>
                                       <button
                                          onClick={handleCancelEdit}
                                          className="p-1 rounded text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                          aria-label="Cancel edit"
                                       >
                                          <XCircle size={18} />
                                       </button>
                                    </>
                                 ) : (
                                    <button
                                       onClick={() => handleEditToggle(member)}
                                       className="p-1 rounded text-blue-600 hover:text-blue-800 dark:text-sky-400 dark:hover:text-sky-300"
                                       aria-label={`Edit group for ${member.name}`}
                                    >
                                       <Pencil size={18} />
                                    </button>
                                 )}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>
      </div>
   );
}

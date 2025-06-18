import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookMarked,
  PlusCircle,
  Search,
  XCircle,
  BookOpen,
  Tag,
  UserCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Course } from "@/interface/course";
import { useDebounce } from "use-debounce";
import { useQuery } from "react-query";
import { searchCourses } from "@/apis/course";

const MAX_COURSES = 3;

interface StepAddCoursesProps {
  selectedCourses: Course[];
  onUpdateCourses: (courses: Course[]) => void;
}

export function StepAddCourses({
  selectedCourses,
  onUpdateCourses,
}: StepAddCoursesProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const { data: searchResults } = useQuery(
    ["searchCourse", debouncedSearchTerm],
    () => searchCourses(debouncedSearchTerm)
  );

  const handleAddCourse = (course: Course) => {
    if (selectedCourses.length < MAX_COURSES) {
      onUpdateCourses([...selectedCourses, course]);
      setSearchTerm("");
    } else {
      toast.error(`최대 ${MAX_COURSES}개의 수업만 추가할 수 있습니다.`);
    }
  };

  const handleRemoveCourse = (courseId: number) => {
    onUpdateCourses(selectedCourses.filter((course) => course.id !== courseId));
  };

  const filteredSearchResults = searchResults?.courses.filter(
    (course) => !selectedCourses.some((sc) => sc.id === course.id)
  );

  return (
    <div className="space-y-6">
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-2xl">2단계: 관련 수업 등록</CardTitle>
        <CardDescription>
          스터디와 관련된 수업을 과목명, 과목코드, 교수명으로 검색하여 최대{" "}
          {MAX_COURSES}개까지 추가하세요.
        </CardDescription>
      </CardHeader>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="과목명, 과목코드, 교수명 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          disabled={selectedCourses.length >= MAX_COURSES}
        />
      </div>

      <ScrollArea className="h-[400px] border rounded-md p-1 bg-background">
        {filteredSearchResults && filteredSearchResults.length > 0 && (
          <ul className="space-y-2 p-2">
            {filteredSearchResults.map((course) => (
              <li
                key={course.id}
                className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors"
                onClick={() => handleAddCourse(course)}
              >
                <div className="flex items-center space-x-3">
                  <BookMarked className="h-6 w-6 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{course.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.code} / {course.prof}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={selectedCourses.length >= MAX_COURSES}
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> 추가
                </Button>
              </li>
            ))}
          </ul>
        )}
        {searchTerm &&
          filteredSearchResults &&
          filteredSearchResults.length === 0 && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <p className="text-sm text-muted-foreground text-center">
                검색 결과가 없습니다.
              </p>
            </div>
          )}
      </ScrollArea>

      {selectedCourses.length > 0 && (
        <Card className="pt-0">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              선택된 수업 ({selectedCourses.length}/{MAX_COURSES})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {selectedCourses.map((course) => (
                <li
                  onClick={() => handleRemoveCourse(course.id)}
                  key={course.id}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg shadow-sm cursor-pointer "
                >
                  <div className="flex items-center space-x-3">
                    <BookMarked className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-sm">{course.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Tag className="h-3 w-3 mr-1" /> {course.code}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <UserCircle className="h-3 w-3 mr-1" /> {course.prof}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {selectedCourses.length >= MAX_COURSES && (
        <p className="text-sm text-center text-primary font-medium mt-2">
          최대 {MAX_COURSES}개의 수업을 모두 선택했습니다.
        </p>
      )}
    </div>
  );
}

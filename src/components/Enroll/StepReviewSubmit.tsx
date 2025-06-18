"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course } from "@/interface/course";
import { SimpleUser, User } from "@/interface/user";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  BookMarked,
  BookOpenCheck,
  Fingerprint,
  GripVertical,
  Mail,
  Tag,
  UserCircle,
  Users,
} from "lucide-react";

interface SortableCourseItemProps {
  course: Course;
  index: number;
}

function SortableCourseItem({ course, index }: SortableCourseItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: course.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.1)" : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center justify-between p-3 bg-background border rounded-lg mb-2 shadow-sm"
    >
      <div className="flex items-center space-x-3">
        <button
          {...listeners}
          className="cursor-grab p-1 text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <span className="font-semibold text-primary mr-2 text-lg">
          #{index + 1}
        </span>
        <BookMarked className="h-8 w-8 text-primary flex-shrink-0" />
        <div>
          <p className="font-semibold text-md">{course.name}</p>
          <p className="text-sm text-muted-foreground flex items-center">
            <Tag className="h-4 w-4 mr-1" /> {course.code}
          </p>
          <p className="text-sm text-muted-foreground flex items-center">
            <UserCircle className="h-4 w-4 mr-1" /> {course.prof}
          </p>
        </div>
      </div>
    </li>
  );
}

interface StepReviewSubmitProps {
  applicationData: {
    friends: SimpleUser[];
    courses: Course[];
  };
  onUpdateCoursesOrder: (courses: Course[]) => void;
}

export function StepReviewSubmit({
  applicationData,
  onUpdateCoursesOrder,
}: StepReviewSubmitProps) {
  const { friends, courses } = applicationData;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = courses.findIndex((c) => c.id === active.id);
      const newIndex = courses.findIndex((c) => c.id === over.id);
      onUpdateCoursesOrder(arrayMove(courses, oldIndex, newIndex));
    }
  }

  return (
    <div className="space-y-8">
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-2xl">
          3단계: 신청 내용 확인 및 제출
        </CardTitle>
        <CardDescription>
          선택하신 내용을 확인하고, 수업의 우선순위를 조정한 후 제출해주세요.
        </CardDescription>
      </CardHeader>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary" /> 선택된 친구 (
            {friends.length}명)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friends.length > 0 ? (
            <ul className="space-y-3">
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  className="flex items-center space-x-3 p-3 bg-secondary rounded-lg shadow-sm"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={"/img/profile.png"} alt={friend.name} />
                    <AvatarFallback>
                      {friend.name.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{friend.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Fingerprint className="h-3 w-3 mr-1" /> {friend.sid}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">선택된 친구가 없습니다.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <BookOpenCheck className="h-6 w-6 mr-2 text-primary" /> 선택된 수업
            ({courses.length}개) - 우선순위 변경 가능
          </CardTitle>
          <CardDescription>
            드래그하여 수업의 우선순위를 변경할 수 있습니다. (가장 위가 1순위)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {courses.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={courses.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-1">
                  {" "}
                  {/* 간격 조절 */}
                  {courses.map((course, index) => (
                    <SortableCourseItem
                      key={course.id}
                      course={course}
                      index={index}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          ) : (
            <p className="text-muted-foreground">선택된 수업이 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

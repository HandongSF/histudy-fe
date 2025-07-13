import { userSignup } from "@/apis/users";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import { useHIState } from "@/hooks/HIState";
import { isRegisterModalState, userLoginInfoState } from "@/store/HISAtom";
import { useState } from "react";

import { toast } from "sonner";

const nameConverter = (name: string) => {
  if (name.slice(-3) === "학부생") return name.slice(0, -3);
  return name;
};

export default function SignUpDialog() {
  const [userLoginInfo, setUserLoginInfo] = useHIState(userLoginInfoState);
  const [isDialogOpen, setIsDialogOpen] = useHIState(isRegisterModalState);
  const { login } = useAuth();
  const [sid, setSid] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 학번 검증
    if (sid.length === 0) {
      toast.error("학번을 입력해주세요");
      return;
    }

    if (sid.length !== 8) {
      toast.error("학번을 정확히 입력해주세요.");
      return;
    }

    if (!userLoginInfo || !userLoginInfo.sub) {
      toast.error("로그인 정보가 없습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const newUser = {
        sub: userLoginInfo.sub,
        email: userLoginInfo.email,
        name: nameConverter(userLoginInfo.name),
        sid: sid,
      };

      const res = await userSignup(newUser);
      console.log("res", res);
      login(res.tokens.accessToken, res.tokens.refreshToken, res.role);
      setIsDialogOpen(false);
      setUserLoginInfo(null);

      setSid("");
    } catch (error) {
      toast.error("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            정보 입력하기
          </DialogTitle>
          <DialogDescription className="text-center">
            회원가입을 위해 학번을 입력해주세요
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* 사용자 정보 표시 (읽기 전용) */}
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={userLoginInfo?.name || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="flex flex-col gap-4">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                value={userLoginInfo?.email || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="flex flex-col gap-4">
              <Label htmlFor="sid">학번 *</Label>
              <Input
                id="sid"
                placeholder="8자리 학번을 입력하세요"
                value={sid}
                onChange={(e) => setSid(e.target.value)}
                maxLength={8}
                className="text-center"
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button type="submit" disabled={isLoading} className="w-24">
              {isLoading ? "처리중..." : "가입완료"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { JwtHIStudyPayload } from "@/components/GoogleButton";
import { atom } from "recoil";

export const isRegisterModalState = atom<boolean>({
  key: "isRegisterModal",
  default: false,
});

export const userLoginInfo = atom<JwtHIStudyPayload | null>({
  key: "userLoginInfo",
  default: null,
});

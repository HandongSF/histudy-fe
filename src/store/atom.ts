import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { JwtHIStudyPayload } from "@/components/GoogleButton";
import { Role } from "@/interface/role";

export const isRegisterModalState = atom<boolean>({
  key: "isRegisterModal",
  default: false,
});

export const userLoginInfo = atom<JwtHIStudyPayload | null>({
  key: "userLoginInfo",
  default: null,
});

export const roleState = atom<Role>({
  key: "role",
  default: "NONUSER",
});

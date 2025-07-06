import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { JwtHIStudyPayload } from "@/components/GoogleButton";
import { Role } from "@/interface/role";

const { persistAtom } = recoilPersist({
  key: "localStorage", //원하는 key 값 입력
  storage: localStorage,
});

export const isLoginState = atom<boolean>({
  key: "isLogin",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

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

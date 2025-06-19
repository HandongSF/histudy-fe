import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { JwtHIStudyPayload } from "@/components/GoogleButton";

const { persistAtom } = recoilPersist({
  key: "localStorage", //원하는 key 값 입력
  storage: localStorage,
});

export const darkState = atom<boolean>({
  key: "darkMode",
  default: false,
  effects_UNSTABLE: [persistAtom],
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

export const isCodeModalState = atom<boolean>({
  key: "codeModal",
  default: false,
});

export const isDelete = atom<boolean>({
  key: "deleteSnackbar",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const selectState = atom<number>({
  key: "sidebarSelect",
  default: 1,
  effects_UNSTABLE: [persistAtom],
});

export const isLoadingState = atom<boolean>({
  key: "isLoading",
  default: false,
});

//TODO: 타입 정의 필요
export const groupAutoCompleteState = atom<any[]>({
  key: "groupAutoComplete",
  default: [],
});

export type Role = "MEMBER" | "USER" | "ADMIN" | "NONUSER";

export const roleState = atom<Role>({
  key: "role",
  default: "NONUSER",
});

export const isShowFullImageState = atom<boolean>({
  key: "isShowFullImage",
  default: false,
});

import { JwtHIStudyPayload } from "@/components/GoogleButton";
import { createHISAtom } from "@/hooks/HIState";
import { Role } from "@/interface/role";

export const counterState = createHISAtom<number>({
  key: "counter",
  default: 2,
});

export const roleState = createHISAtom<Role>({
  key: "role",
  default: "NONUSER",
});

export const isRegisterModalState = createHISAtom<boolean>({
  key: "isRegisterModal",
  default: false,
});

export const userLoginInfoState = createHISAtom<JwtHIStudyPayload | null>({
  key: "userLoginInfo",
  default: null,
});

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

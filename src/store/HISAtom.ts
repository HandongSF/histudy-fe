import { createHISAtom } from "@/hooks/HIState";

export const counterState = createHISAtom<number>({
  key: "counter",
  default: 2,
});

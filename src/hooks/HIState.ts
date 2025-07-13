import { HIStateManager, State } from "@/store/HIStateManager";
import { useSyncExternalStore } from "react";

interface Atom<T> {
  key: string;
  default: T;
}

interface GlobalStateMapValue<T> {
  atom: Atom<T>;
  stateManager: HIStateManager<T>;
}

type SetterOrUpdater<T> = (valOrUpdater: ((currVal: T) => T) | T) => void;

const globalStateMap = new Map<string, GlobalStateMapValue<any>>();

export function useHIState<T>(atom: Atom<T>): [State<T>, SetterOrUpdater<T>] {
  const store = globalStateMap.get(atom.key)!.stateManager;

  const value = useSyncExternalStore(
    (l) => store.subscribe(l),
    () => store.getState()
  );

  return [value, store.setState];
}

export function useHIStateValue<T>(atom: Atom<T>): State<T> {
  return useHIState(atom)[0];
}

export function useSetHiState<T>(atom: Atom<T>): SetterOrUpdater<T> {
  return useHIState(atom)[1];
}

export function createHISAtom<T>(atom: Atom<T>): Atom<T> {
  if (globalStateMap.has(atom.key)) {
    console.warn(`[HIState] Duplicate key "${atom.key}" ignored.`);
    return globalStateMap.get(atom.key)!.atom;
  }

  const stateManager = new HIStateManager<T>({ value: atom.default });

  globalStateMap.set(atom.key, {
    atom,
    stateManager,
  });
  return atom;
}

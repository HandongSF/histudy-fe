import { HIStateManager } from "@/store/HIStateManager";
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

export function useHIState<T>(atom: Atom<T>): [T, SetterOrUpdater<T>] {
  const store = globalStateMap.get(atom.key)!.stateManager;

  const value = useSyncExternalStore(store.subscribe, store.getState);

  return [value, store.setState];
}

export function useHIStateValue<T>(atom: Atom<T>): T {
  const store = globalStateMap.get(atom.key)!.stateManager;

  const value = useSyncExternalStore(store.subscribe, store.getState);

  return value;
}

export function useSetHiState<T>(atom: Atom<T>): SetterOrUpdater<T> {
  const globalStateMapValue = globalStateMap.get(atom.key)!;
  return globalStateMapValue.stateManager.setState;
}

export function createHISAtom<T>(atom: Atom<T>): Atom<T> {
  if (globalStateMap.has(atom.key)) {
    console.warn(`[HIState] Duplicate key "${atom.key}" ignored.`);
    return globalStateMap.get(atom.key)!.atom;
  }

  const stateManager = new HIStateManager<T>(atom.default);

  globalStateMap.set(atom.key, {
    atom,
    stateManager,
  });
  return atom;
}

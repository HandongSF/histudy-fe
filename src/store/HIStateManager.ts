type StateListener = () => void;
type SetStateParam<T> = T | ((prev: T) => T);

export interface StateManager<T> {
   setState: (newValue: SetStateParam<T>) => void;
   getState: () => T;
   subscribe: (listener: StateListener) => VoidFunction;
   emitChange: VoidFunction;
}

export class HIStateManager<T> implements StateManager<T> {
   private state: T;
   private listeners: StateListener[] = [];

   constructor(initialState: T) {
      this.state = initialState;
   }

   setState = (param: SetStateParam<T>) => {
      if (param instanceof Function) {
         const newState = param(this.state);
         this.state = newState;
      } else {
         this.state = param;
      }
      this.emitChange();
   };

   getState = () => {
      return this.state;
   };

   subscribe = (listener: StateListener) => {
      this.listeners = [...this.listeners, listener];
      return () => {
         this.listeners = this.listeners.filter((l) => l !== listener);
      };
   };

   emitChange = () => {
      for (let listener of this.listeners) {
         listener();
      }
   };
}

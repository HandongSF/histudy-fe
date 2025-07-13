export interface State<T> {
  value: T;
}
type StateListener = () => void;
type SetStateParam<T> = T | ((prev: T) => T);

export interface StateManager<T> {
  setState: (newValue: SetStateParam<T>) => void;
  getState: () => State<T>;
  subscribe: (listener: StateListener) => VoidFunction;
  emitChange: VoidFunction;
}

export class HIStateManager<T> implements StateManager<T> {
  private state: State<T>;
  private listeners: StateListener[] = [];

  constructor(initialState: State<T>) {
    this.state = initialState;
  }

  setState = (param: SetStateParam<T>) => {
    if (param instanceof Function) {
      const newState = { value: param(this.state.value) };
      this.state = newState;
    } else {
      this.state = { value: param };
    }
    this.emitChange();
  };

  getState = () => {
    console.log(this.state);
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

import { merge} from '../../../common/utils';

type StateListener<T = any> = (newValue: T, oldValue: T) => void;

class Store {
  private readonly state: Record<string, any> = {};
  private readonly listeners: Record<string, StateListener[]> = {};

  constructor(initialState: Record<string, any>) {
    this.state = { ...initialState };
    this.listeners = {};
  }

  addState(pluginName: string, state: Record<string, any>): void {
    if (this.state[pluginName]) {
      this.state[pluginName] = merge(this.state[pluginName], state);
    } else {
      this.state[pluginName] = merge({}, state);
    }
  }

  public get<T = any>(key: string): T | undefined {
    const keys = key.split('.');
    let currentState = this.state;
    for (const k of keys) {
      if (typeof currentState !== 'object' || currentState === null || !(k in currentState)) {
        return undefined;
      }
      currentState = currentState[k];
    }
    return currentState as T;
  }

  public set<T = any>(key: string, value: T): boolean {
    const keys = key.split('.');
    const lastKey = keys.pop();
    if (!lastKey) return false;

    let currentState = this.state;

    for (const k of keys) {
      if (!currentState.hasOwnProperty(k)) {
        currentState[k] = {};
      } else if (typeof currentState[k] !== 'object' || currentState[k] === null) {
        return false; // 中间路径非对象，无法设置
      }
      currentState = currentState[k];
    }

    // 获取旧值
    const oldValue = currentState[lastKey];
    if (oldValue === value) return false;

    // 设置新值
    currentState[lastKey] = value;
    // 通知监听器
    this.notify(key,value,oldValue);
    return true;
  }

  public watch<T = any>(key: string, listener: StateListener<T>): () => void {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }

    this.listeners[key].push(listener);

    // 返回一个取消监听的函数
    return () => {
      const listeners = this.listeners[key];
      if (!listeners) return;
      const index = listeners.indexOf(listener as StateListener);
      if (index !== -1) {
        listeners.splice(index, 1);
        if (listeners.length === 0) {
          delete this.listeners[key];
        }
      }
    };
  }

  private notify(key: string, newValue: any, oldValue: any): void {
    const listeners = this.listeners[key];
    if (listeners) {
      listeners.forEach((listener) => {
        listener(newValue, oldValue);
      });
    }
  }
}

export { Store };
import { PluginContext } from '../types';

abstract class AnPlugin {
  public abstract readonly name: string;
  protected context!: PluginContext;

  // 必须实现的方法
  abstract install(): void;
  abstract enable(): void;
  abstract disable(): void;

  // 初始化上下文
  protected initializeContext(context: PluginContext) {
    this.context = context;
  }
}

export { AnPlugin };

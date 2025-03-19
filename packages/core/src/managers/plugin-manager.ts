import { AnyExtension, Editor } from '@tiptap/core';
import { AnPlugin } from '../plugin';
import { CommandHandler, PluginContext } from '../types';
import { StoreManager } from './store-manager';
import { EventManager } from './event-manager';
import { I18nManager } from './i18n-manager';

class PluginManager {
  private plugins = new Map<string, AnPlugin>();
  private extensions: Set<AnyExtension> = new Set();
  private commands = new Map<string, CommandHandler>();

  constructor(
    private editor: Editor,
    private store: StoreManager,
    private events: EventManager,
    private i18n: I18nManager
  ) {}

  getPlugin<T extends AnPlugin>(name: string): T | null {
    return (this.plugins.get(name) as T) || null;
  }

  public createPluginContext(pluginName: string): PluginContext {
    return {
      editor: this.editor,
      store: this.store,
      events: this.events,
      i18n: this.i18n,
      getPlugin: <T extends AnPlugin>(name: string) => this.getPlugin<T>(name),
      registerExtension: (exts: AnyExtension[]) => this.registerExtension(pluginName, exts),
      registerCommand: (name: string, handler: CommandHandler) =>
        this.registerCommand(`${pluginName}:${name}`, handler),
    };
  }

  installPlugins(plugins: AnPlugin[]) {
    plugins.forEach(plugin => {
      plugin.install();
    });
  }

  private registerExtension(exts: AnyExtension[]) {
    exts.forEach(ext => this.extensions.add(ext));
  }

  // 注册命令的内部方法
  private registerCommand(name: string, handler: CommandHandler) {
    this.commands.set(name, handler);
  }

  // 执行命令的公共方法
  executeCommand(name: string, ...args: any[]): boolean | void {
    const handler = this.commands.get(name);
    if (handler) {
      return handler(...args);
    }
    return false;
  }

  // 获取所有命令
  getCommands(): string[] {
    return Array.from(this.commands.keys());
  }

  // 获取所有扩展
  getExtensions(): AnyExtension[] {
    return Array.from(this.extensions);
  }
}

export { PluginManager };

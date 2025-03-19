import { AnyExtension, Editor } from '@tiptap/core';
import { AnPlugin } from '../plugin';
import { CommandHandler, PluginConfig, ShortcutHandler } from '../types';
import { StoreManager } from './store-manager';
import { EventManager } from './event-manager';
import { I18nManager } from './i18n-manager';

class PluginManager {
  private plugins = new Map<string, AnPlugin>();
  private extensions = new Set<AnyExtension>();
  private commands = new Map<string, CommandHandler>();
  private shortcuts = new Map<string, ShortcutHandler>();

  constructor(
    private editor: Editor,
    private store: StoreManager,
    private events: EventManager,
    private i18n: I18nManager
  ) {}

  async install(pluginClass: typeof AnPlugin, config?: PluginConfig) {
    const pluginName = pluginClass.prototype.name || config?.name;
    if (!pluginName) throw new Error('Plugin must have a name');
    if (this.plugins.has(pluginName)) return;

    // 检查依赖
    const dependencies = config?.dependencies || [];
    dependencies.forEach(dep => {
      if (!this.plugins.has(dep)) {
        throw new Error(`Missing dependency: ${dep}`);
      }
    });

    // 初始化插件
    const plugin = new pluginClass(config || { name: pluginName });
    const context = this.createPluginContext(pluginName);
    plugin.initializeContext(context);

    // 安装插件
    plugin.install();

    // 注册扩展
    this.editor.registerExtensions([...this.extensions]);

    this.plugins.set(pluginName, plugin);
    plugin.enable();
  }

  uninstall(name: string) {
    const plugin = this.plugins.get(name);
    if (!plugin) return;

    plugin.disable();
    this.plugins.delete(name);

    // 清理相关资源
    this.commands.forEach((_, key) => {
      if (key.startsWith(`${name}:`)) this.commands.delete(key);
    });

    this.shortcuts.forEach((_, key) => {
      if (key.startsWith(`${name}:`)) this.shortcuts.delete(key);
    });

    // TODO: 清理扩展
  }

  getPlugin<T extends BasePlugin>(name: string): T | null {
    return (this.plugins.get(name) as T) || null;
  }

  private createPluginContext(pluginName: string): PluginContext {
    return {
      editor: this.editor,
      store: this.store,
      events: this.events,
      i18n: this.i18n,
      getPlugin: <T extends BasePlugin>(name: string) => this.getPlugin<T>(name),
    };
  }
  // 注册扩展的内部方法
  private registerExtension(ext: AnyExtension) {
    this.extensions.add(ext);
  }

  // 注册命令的内部方法
  private registerCommand(name: string, handler: Function) {
    this.commands.set(name, handler);
  }

  // 注册快捷键的内部方法
  private registerShortcut(keys: string, handler: Function) {
    this.shortcuts.set(keys, handler);
  }
}

export { PluginManager };

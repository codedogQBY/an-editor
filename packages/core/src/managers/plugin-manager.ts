import { Editor } from '@tiptap/core';
import { AnPlugin } from '../plugin';
import { PluginContext } from '../types';
import { StoreManager } from './store-manager';
import { EventManager } from './event-manager';
import { I18nManager } from './i18n-manager';
import { CommandManager } from './command-manager';

class PluginManager {
  private plugins = new Map<string, AnPlugin>();

  constructor(
    private editor: Editor,
    private store: StoreManager,
    private events: EventManager,
    private i18n: I18nManager,
    private commands: CommandManager
  ) {}

  getPlugin<T extends AnPlugin>(name: string): T | null {
    return (this.plugins.get(name) as T) || null;
  }

  public createPluginContext(): PluginContext {
    return {
      editor: this.editor,
      store: this.store,
      events: this.events,
      i18n: this.i18n,
      commands: this.commands,
      getPlugin: <T extends AnPlugin>(name: string) => this.getPlugin<T>(name),
    };
  }
}

export { PluginManager };

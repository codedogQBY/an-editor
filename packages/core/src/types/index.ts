import { Editor, AnyExtension, EditorOptions } from '@tiptap/core';
import { StoreManager, EventManager, I18nManager } from '../managers';
import { AnPlugin } from '../plugin';

export type Listener<T = any> = (newValue: T, oldValue: T) => void;
export type EventHandler<T = unknown> = (payload: T) => void;
export type CommandHandler = (...args: any[]) => boolean | void;
export type ShortcutHandler = () => void;

export interface EditorConfig extends EditorOptions {
  initialState?: Record<string, any>;
  locale?: string;
  plugins: AnPlugin[];
}

export interface PluginContext {
  editor: Editor;
  store: StoreManager;
  events: EventManager;
  i18n: I18nManager;
  getPlugin: <T extends AnPlugin>(name: string) => T | null;
  registerExtension: (exts: AnyExtension[]) => void;
  registerCommand: (name: string, handler: CommandHandler) => void;
}

export interface PluginConfig {
  name?: string;
  dependencies?: string[];
  extension: AnyExtension[];
  defaultConfig?: Record<string, any>;
  i18n?: Record<string, Record<string, string>>;
}

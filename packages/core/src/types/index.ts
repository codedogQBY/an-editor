import { Editor, AnyExtension } from '@tiptap/core';
import { StoreManager, EventManager, I18nManager } from '../managers';
import { AnPlugin } from '../plugin';

export type Listener<T = any> = (newValue: T, oldValue: T) => void;
export type EventHandler<T = unknown> = (payload: T) => void;
export type CommandHandler = (...args: any[]) => boolean | void;
export type ShortcutHandler = () => void;

export interface EditorConfig {
  initialState?: Record<string, any>;
  extensions?: AnyExtension[];
  locale?: string;
}

export interface EditorConfig {
  initialState?: Record<string, any>;
  extensions?: AnyExtension[];
  locale?: string;
}

export interface PluginContext {
  editor: Editor;
  store: StoreManager;
  events: EventManager;
  i18n: I18nManager;
  getPlugin: <T extends AnPlugin>(name: string) => T | null;
  registerExtension: (ext: AnyExtension) => void;
  registerCommand: (name: string, handler: CommandHandler) => void;
  registerShortcut: (keys: string, handler: ShortcutHandler) => void;
}

export interface PluginConfig {
  defaultConfig?: Record<string, any>;
  i18n?: Record<string, Record<string, string>>;
}

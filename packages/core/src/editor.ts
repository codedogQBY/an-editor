import { Editor, EditorOptions } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import {
  StoreManager,
  ShortcutManager,
  I18nManager,
  PluginManager,
  EventManager,
} from './managers';

class AnEditor {
  private editor: Editor | null = null;
  public store: StoreManager;
  public shortcuts: ShortcutManager;
  public i18n: I18nManager;
  public plugins: PluginManager;
  public events: EventManager;

  constructor() {}
  private init(options: EditorOptions) {
    const extensions = [...(options.extensions || []), StarterKit];
    this.editor = new Editor({
      extensions,
      ...options,
    });
    this.store = new StoreManager({
      common: {
        // 主题
        theme: 'dark',
        // 多语言
        locale: 'zh-CN',
      },
    });
  }

  public get html(): string {
    return this.editor?.getHTML() || '';
  }

  public get json(): Record<string, any> {
    return this.editor?.getJSON() || {};
  }

  public get isEmpty(): boolean {
    return this.editor?.isEmpty || true;
  }

  public get isFocused(): boolean {
    return this.editor?.isFocused || false;
  }

  public get isEditable(): boolean {
    return this.editor?.isEditable || false;
  }

  public get tipTapEditor(): Editor | null {
    return this.editor;
  }
}

export { Editor };

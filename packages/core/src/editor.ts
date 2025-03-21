import { AnyExtension, Editor as TiptapEditor } from '@tiptap/core';
import { StoreManager, I18nManager, PluginManager, EventManager, CommandManager } from './managers';
import { EditorConfig } from './types';

class AnEditor {
  private editor: TiptapEditor | null = null;
  public store: StoreManager;
  public i18n: I18nManager;
  public plugins: PluginManager;
  public events: EventManager;
  public commands: CommandManager;

  constructor(options: Partial<EditorConfig>) {
    // 初始化各个管理器
    this.store = new StoreManager(options.initialState || {});
    this.events = new EventManager();
    this.i18n = new I18nManager();
    this.commands = new CommandManager();

    // 设置语言
    if (options.locale) {
      this.i18n.setLanguage(options.locale);
    }
    // 初始化编辑器
    this.init(options);

    // 初始化plugin-manager
    this.plugins = new PluginManager(
      this.editor!,
      this.store,
      this.events,
      this.i18n,
      this.commands
    );
  }

  private init(options: Partial<EditorConfig>) {
    const baseExtensions = options.plugins?.reduce<AnyExtension[]>((extensions, plugin) => {
      const exts = plugin.extensions || [];
      return extensions.concat(exts);
    }, []);
    this.editor = new TiptapEditor({
      extensions: baseExtensions,
      content: options.content,
      element: options.element,
      autofocus: options.autofocus,
      editable: options.editable,
      injectCSS: options.injectCSS ?? true,
    });
  }

  // 执行编辑器命令
  executeCommand(pluginName: string, name: string, ...args: any[]): boolean | void {
    return this.commands.executeCommand(pluginName, name, ...args);
  }

  // 获取编辑器HTML内容
  public get html(): string {
    return this.editor?.getHTML() || '';
  }

  // 设置编辑器HTML内容
  public setContent(content: string | object) {
    this.editor?.commands.setContent(content);
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

  public get tipTapEditor(): TiptapEditor | null {
    return this.editor;
  }

  // 销毁编辑器
  public destroy() {
    this.editor?.destroy();
    this.editor = null;
  }
}

export { AnEditor };

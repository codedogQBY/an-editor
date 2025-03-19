import { PluginConfig, PluginContext } from '../types';
import { AnyExtension } from '@tiptap/core';

abstract class AnPlugin {
  public abstract readonly name: string;
  public abstract readonly extensions: AnyExtension[];
  protected context!: PluginContext;
  protected config: PluginConfig;

  protected constructor(config: PluginConfig) {
    this.config = config;
  }

  // 初始化上下文
  install(context: PluginContext) {
    this.context = context;

    // 如果插件提供了i18n资源，自动注册
    if (this.config.i18n) {
      Object.entries(this.config.i18n).forEach(([lang, translations]) => {
        this.context.i18n.add(lang, {
          [this.name]: translations,
        });
      });
    }

    // 如果插件提供了默认配置，自动注册到store
    if (this.config.defaultConfig) {
      this.context.store.addPluginState(this.name, this.config.defaultConfig);
    }
  }
}

export { AnPlugin };

import { merge } from '@an-editor/common';

type NestedTranslations = {
  [key: string]: string | NestedTranslations;
};

class I18nManager {
  private currentLang = 'en';
  private resources: Record<string, Record<string, string>> = {};

  setLanguage(lang: string) {
    this.currentLang = lang;
  }

  load(lang: string, translations: NestedTranslations | Record<string, string>) {
    this.resources[lang] = this.isFlat(translations)
      ? this.flattenToNested(translations)
      : translations;
  }

  add(lang: string, translations: NestedTranslations | Record<string, string>) {
    const nested = this.isFlat(translations) ? this.flattenToNested(translations) : translations;

    if (!this.resources[lang]) {
      this.resources[lang] = nested;
    } else {
      this.resources[lang] = merge(this.resources[lang], nested);
    }
  }

  private isFlat(obj: any): obj is Record<string, string> {
    return Object.values(obj).every(v => typeof v === 'string');
  }

  private flattenToNested(translations: Record<string, string>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(translations)) {
      const keys = key.split('.');
      let current = result;

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (i === keys.length - 1) {
          current[k] = value;
        } else {
          current[k] = current[k] || {};
          current = current[k];
        }
      }
    }

    return result;
  }

  t(key: string, params: Record<string, string> = {}): string {
    // 分割多级键名
    const keys = key.split('.');
    let template = this.findNestedValue(this.resources[this.currentLang], keys) || key;

    // 替换模板参数
    Object.entries(params).forEach(([k, v]) => {
      template = template.replace(new RegExp(`{{${k}}}`, 'g'), v);
    });

    return template;
  }

  private findNestedValue(obj: any, keys: string[]): string | undefined {
    let current = obj;
    for (const key of keys) {
      if (!current || typeof current !== 'object') return undefined;
      current = current[key];
    }
    return typeof current === 'string' ? current : undefined;
  }
}

export { I18nManager };

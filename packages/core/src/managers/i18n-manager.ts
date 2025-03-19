class I18nManager {
  private currentLang = 'en';
  private resources: Record<string, Record<string, string>> = {};

  setLanguage(lang: string) {
    this.currentLang = lang;
  }

  load(lang: string, translations: Record<string, string>) {
    this.resources[lang] = translations;
  }

  t(key: string, params: Record<string, string> = {}): string {
    let template = this.resources[this.currentLang]?.[key] || key;
    Object.entries(params).forEach(([k, v]) => {
      template = template.replace(new RegExp(`{${k}}`, 'g'), v);
    });
    return template;
  }
}

export { I18nManager };

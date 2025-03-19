import { ShortcutHandler } from '../types';

class ShortcutManager {
  private shortcuts = new Map<string, ShortcutHandler>();

  register(keys: string, handler: ShortcutHandler) {
    this.shortcuts.set(this.normalizeKeys(keys), handler);
  }

  handleKeyDown(e: KeyboardEvent) {
    const combo = this.getKeyCombo(e);
    const handler = this.shortcuts.get(combo);
    if (handler) {
      e.preventDefault();
      handler();
    }
  }

  private normalizeKeys(keys: string): string {
    return keys.toLowerCase().replace(/\s+/g, '');
  }

  private getKeyCombo(e: KeyboardEvent): string {
    const parts = [];
    if (e.ctrlKey) parts.push('ctrl');
    if (e.altKey) parts.push('alt');
    if (e.shiftKey) parts.push('shift');
    parts.push(e.key.toLowerCase());
    return parts.join('+');
  }
}

export { ShortcutManager };

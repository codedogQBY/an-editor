import { CommandConfig, CommandHandler } from '../types';

class CommandManager {
  /**
   * {
   *   heading:{
   *     h1:{
   *       name: 'H1',
   *       command: () => {},
   *       shortcut: 'Mod-Alt-1'
   *     }
   *   }
   * }
   */
  private commands = new Map<
    string,
    Map<string, { name: string; command: CommandHandler; shortcut?: string }>
  >();
  constructor() {
    this.commands = new Map();
  }

  registerCommand(pluginName: string, commandName: string, commandConfig: CommandConfig) {
    const { name, command, shortcut } = commandConfig;
    if (!this.commands.has(pluginName)) {
      this.commands.set(pluginName, new Map());
    }

    this.commands.get(pluginName)?.set(commandName, { name, command, shortcut });
  }

  executeCommand(pluginName: string, commandName: string, ...args: any[]): boolean | void {
    const handler = this.commands.get(pluginName)?.get(commandName)?.command;
    if (handler) {
      return handler(...args);
    }
    return false;
  }
}

export { CommandManager };

import { EventHandler } from '../types';

class EventManager {
  private events = new Map<string, Set<EventHandler>>();

  on<T = unknown>(event: string, handler: EventHandler<T>): () => void {
    const wrapper: EventHandler<unknown> = payload => handler(payload as T);
    const listeners = this.events.get(event) || new Set();
    listeners.add(wrapper);
    this.events.set(event, listeners);
    return () => this.off(event, wrapper);
  }

  off<T = unknown>(event: string, handler?: EventHandler<T>) {
    if (!handler) {
      this.events.delete(event);
    } else {
      this.events.get(event)?.delete(handler as EventHandler<unknown>);
    }
  }

  emit<T = unknown>(event: string, payload?: T) {
    this.events.get(event)?.forEach(handler => handler(payload));
  }
}

export { EventManager };

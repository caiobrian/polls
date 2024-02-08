type Message = { pollOptionId: string; votes: number };

export class VotingPubSub {
  private listeners: Record<string, ((message: Message) => void)[]> = {};

  subscribe(event: string, listener: (message: Message) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  emit(event: string, message: Message) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(message));
    }
  }
}

export const voting = new VotingPubSub();

declare module '@rails/actioncable' {
    export interface Channel {
        perform(action: string, data?: Record<string, unknown>): void;
        unsubscribe(): void;
        received?(data: unknown): void;
        connected?(): void;
        disconnected?(): void;
    }

    export interface Subscriptions {
        create(
            params: Record<string, unknown>,
            mixin: Partial<Channel>
        ): Channel;
        remove(subscription: Channel): void;
    }

    export interface Cable {
        subscriptions: Subscriptions;
    }

    export function createConsumer(url?: string): Cable;
}
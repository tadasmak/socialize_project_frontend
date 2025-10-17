export interface MessageType {
    id: string | number;
    body: string;
    created_at: string;
    user: {
        id: number;
        username: string;
    }
};

export interface MessageGroupType {
    messages: MessageType[];
    firstMessage: MessageType;
    user: {
        id: number;
        username: string;
    }
}
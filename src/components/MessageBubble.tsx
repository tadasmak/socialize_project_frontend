import { useRelativeTime } from "../hooks/useRelativeTime"
import { MessageType } from "../types/messageTypes"
import { UserType } from "../types/userTypes"

type Props = {
    message: MessageType
    user: UserType
    showMeta: boolean
}

export default function MessageBubble({ message, user, showMeta }: Props) {
    const isCurrentUsersMessage = message.user.id === user.id;
    const timeAgo = useRelativeTime(message.created_at)

    return (
        <div className={`flex flex-col ${isCurrentUsersMessage ? "items-end" : "items-start"}`}>
            {showMeta && (
                <div className="mb-1 text-xs text-gray-400">
                    <strong className="text-sm">{message.user.username}</strong> · {timeAgo}
                </div>
            )}
            <div className={`inline-block p-2 rounded-xl max-w-[40%] ${isCurrentUsersMessage ? 'bg-coral text-white rounded-tr-none shadow' : 'bg-[#35353d] text-gray-200 rounded-bl-none shadow-sm'}`}>
                <span className="text-sm">{message.body}</span>
            </div>
        </div>
    )
}
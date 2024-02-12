import axios from 'axios';

// Define the types for your API responses here
export interface IUnreadMentionCountResponse {
    unreadMentionCount: number;
}

export const getUnreadMentionCount = async (): Promise<IUnreadMentionCountResponse> => {
    try {
        const { data } = await axios.get<IUnreadMentionCountResponse>(
            `/ConversationNotifications/unread-mention-count`,
        );
        return data;
    } catch (error) {
        console.error('Error fetching unread mention count:', error);
        throw error;
    }
};

export const markMentionsAsRead = async (conversationId: string): Promise<void> => {
    try {
        await axios.post(`/ConversationNotifications/conversations/${conversationId}/mark-mentions-as-read`);
    } catch (error) {
        console.error('Error marking mentions as read:', error);
        throw error;
    }
};

export default {
    getUnreadMentionCount,
    markMentionsAsRead,
};

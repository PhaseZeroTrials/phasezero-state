import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { QueryOptions } from '@pz/state/common';

export const conversationNotificationQueryKeys = {
    unreadMentionCount: ['conversationNotifications', 'unreadMentionCount'] as const,
};

export const useUnreadMentionCount = (options?: QueryOptions) =>
    useQuery(
        conversationNotificationQueryKeys.unreadMentionCount,
        () => {
            return api.getUnreadMentionCount();
        },
        options,
    );

export const useMarkMentionsAsRead = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (conversationId: string) => {
            return api.markMentionsAsRead(conversationId);
        },
        {
            ...options,
            onSuccess: () => {
                queryClient.invalidateQueries(conversationNotificationQueryKeys.unreadMentionCount);
            },
        },
    );
};

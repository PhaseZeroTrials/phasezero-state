import { useQuery } from '@tanstack/react-query';
import api from './api';
import { QueryOptions } from '@pz/state/common';

export const conversationActivityQueryKeys = {
    all: ['conversationActivities'] as const,
    id: (id: string) => [...conversationActivityQueryKeys.all, id] as const,
    conversationId: (conversationId: string) => [...conversationActivityQueryKeys.all, conversationId] as const,
};

export const useConversationActivitiesForConversation = (conversationId: Guid, options?: QueryOptions) =>
    useQuery(
        conversationActivityQueryKeys.conversationId(conversationId),
        () => {
            return api.getConversationActivitiesForConversation(conversationId);
        },
        options,
    );

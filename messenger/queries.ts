import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryOptions } from '@pz/state/common';
import { IConversation } from '@pz/state';
import { messageQueryKeys } from '@pz/state/messages/queries';
import { conversationQueryKeys } from '@pz/state/conversations/queries';
import { conversationActivityQueryKeys } from '@pz/state/conversationActivities/queries';
import { messengerService } from '@pz/state/messenger/index';

export const useSendVisitorMessage = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (props: { tenantChannelId: string; body: string; subjectId?: number; conversationId?: string }) => {
            const { tenantChannelId, body, subjectId, conversationId } = props;
            return messengerService.sendVisitorMessage(tenantChannelId, body, subjectId, conversationId);
        },
        {
            ...options,
            onSuccess: (conversation: IConversation) => {
                options && options?.onSuccess && options.onSuccess(conversation);
                queryClient.invalidateQueries(messageQueryKeys.byConversationId(conversation.id));
                queryClient.invalidateQueries(conversationQueryKeys.inboxId(conversation.inboxId as string));
                queryClient.invalidateQueries(conversationActivityQueryKeys.conversationId(conversation.id));
            },
        },
    );
};

export const useSendMessage = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (props: { conversationId: string; body: string }) => {
            const { conversationId, body } = props;
            return messengerService.sendMessage(conversationId, body);
        },
        {
            ...options,
            onSuccess: (conversation: IConversation) => {
                options && options?.onSuccess && options.onSuccess(conversation);
                queryClient.invalidateQueries(messageQueryKeys.byConversationId(conversation.id));
                queryClient.invalidateQueries(conversationActivityQueryKeys.conversationId(conversation.id));
            },
        },
    );
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { smsService } from '@pz/state/sms/index';
import { QueryOptions } from '@pz/state/common';
import { IConversation } from '@pz/state';
import { messageQueryKeys } from '@pz/state/messages/queries';
import { conversationQueryKeys } from '@pz/state/conversations/queries';
import { conversationActivityQueryKeys } from '@pz/state/conversationActivities/queries';

export const useSendSms = (options?: QueryOptions) => {
    const queryClient = useQueryClient();

    return useMutation(
        (props: { to: string[]; from: string; body: string; medias: string[] }) => {
            const { to, from, body, medias } = props;
            return smsService.sendSms(to, from, body, medias);
        },
        {
            ...options,
            onSuccess: (conversations: IConversation[]) => {
                options && options?.onSuccess && options.onSuccess(conversations);
                conversations.map((conversation) => {
                    queryClient.invalidateQueries(messageQueryKeys.byConversationId(conversation.id));
                    queryClient.invalidateQueries(conversationQueryKeys.inboxId(conversation.inboxId as string));
                    queryClient.invalidateQueries(conversationActivityQueryKeys.conversationId(conversation.id));
                });
            },
        },
    );
};

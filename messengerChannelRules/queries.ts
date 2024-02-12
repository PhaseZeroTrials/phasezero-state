import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryOptions } from '../common';
import api, { IPartialMessengerChannelRule } from './api';

const messengerChannelRuleQueryKeys = {
    all: ['messengerChannelRules'] as const,
    messengerChannelRule: () => [...messengerChannelRuleQueryKeys.all, 'messengerChannelRule'] as const,
    messengerChannelRuleId: (id: string) => [...messengerChannelRuleQueryKeys.messengerChannelRule(), id] as const,
};

export const useMessengerChannelRule = (id: string, options?: QueryOptions) =>
    useQuery(
        messengerChannelRuleQueryKeys.messengerChannelRuleId(id),
        () => {
            return api.getMessengerChannelRule(id);
        },
        {
            ...options,
        },
    );

export const useCreateMessengerChannelRule = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (messengerChannelRule: IPartialMessengerChannelRule) => api.createMessengerChannelRule(messengerChannelRule),
        {
            onSuccess: (response) => {
                options && options.onSuccess && options.onSuccess(response);
                queryClient.invalidateQueries(messengerChannelRuleQueryKeys.all);
            },
        },
    );
};

export const useUpdateMessengerChannelRule = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation(
        (messengerChannelRule: IPartialMessengerChannelRule) => api.updateMessengerChannelRule(messengerChannelRule),
        {
            onSuccess: (response) => {
                options && options.onSuccess && options.onSuccess(response);
                queryClient.invalidateQueries(messengerChannelRuleQueryKeys.messengerChannelRuleId(response.id));
                // You can add more invalidation logic here as needed
            },
        },
    );
};

export const useDeleteMessengerChannelRule = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((id: string) => api.deleteMessengerChannelRule(id), {
        onSuccess: () => {
            queryClient.invalidateQueries(messengerChannelRuleQueryKeys.all);
        },
    });
};

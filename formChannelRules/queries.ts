import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IPartialFormChannelRule } from './api';
import { channelQueryKeys } from '@pz/state/channels/queries';

const formChannelRuleQueryKeys = {
    all: ['formChannelRules'] as const,
    formChannelRule: () => [...formChannelRuleQueryKeys.all, 'formChannelRule'] as const,
    formChannelRuleId: (id: string) => [...formChannelRuleQueryKeys.formChannelRule(), id] as const,
};

export const useFormChannelRule = (id: Guid, options?: QueryOptions) =>
    useQuery(
        formChannelRuleQueryKeys.formChannelRuleId(id),
        () => {
            return api.getFormChannelRule(id);
        },
        {
            ...options,
        },
    );

export const useCreateFormChannelRule = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((formChannelRule: IPartialFormChannelRule) => api.createFormChannelRule(formChannelRule), {
        onSuccess: (response) => {
            options && options.onSuccess && options.onSuccess(response);
            queryClient.invalidateQueries(formChannelRuleQueryKeys.all);
        },
    });
};

export const useUpdateFormChannelRule = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((formChannelRule: IPartialFormChannelRule) => api.updateFormChannelRule(formChannelRule), {
        onSuccess: (response) => {
            options && options.onSuccess && options.onSuccess(response);
            queryClient.invalidateQueries(formChannelRuleQueryKeys.formChannelRuleId(response.id));
            queryClient.invalidateQueries(channelQueryKeys.channelId(response.channelId));
        },
    });
};

export const useDeleteFormChannelRule = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((id: Guid) => api.deleteFormChannelRule(id), {
        onSuccess: (response) => {
            queryClient.invalidateQueries(formChannelRuleQueryKeys.all);
        },
    });
};

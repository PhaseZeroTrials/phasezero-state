import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { IPartialChannel } from './api';

export const channelQueryKeys = {
    all: ['channels'] as const,
    channel: () => [...channelQueryKeys.all, 'channel'] as const,
    channelId: (id: string) => [...channelQueryKeys.channel(), id] as const,
};

export const useChannels = (options?: QueryOptions) =>
    useQuery(
        channelQueryKeys.all,
        () => {
            return api.getChannels();
        },
        {
            ...options,
        },
    );

export const useChannel = (id: Guid, options?: QueryOptions) =>
    useQuery(
        channelQueryKeys.channelId(id),
        () => {
            return api.getChannel(id);
        },
        {
            ...options,
        },
    );

export const useCreateChannel = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((channel: IPartialChannel) => api.createChannel(channel), {
        onSuccess: (response) => {
            options && options.onSuccess && options.onSuccess(response);
            queryClient.invalidateQueries(channelQueryKeys.all);
        },
    });
};

export const useUpdateChannel = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((channel: IPartialChannel) => api.updateChannel(channel), {
        onSuccess: (response) => {
            options && options.onSuccess && options.onSuccess(response);
            queryClient.invalidateQueries(channelQueryKeys.channelId(response.id));
        },
    });
};

export const useDeleteChannel = (options?: QueryOptions) => {
    const queryClient = useQueryClient();
    return useMutation((channelId: string) => api.deleteChannel(channelId), {
        onSuccess: (response) => {
            queryClient.invalidateQueries(channelQueryKeys.all);
        },
    });
};

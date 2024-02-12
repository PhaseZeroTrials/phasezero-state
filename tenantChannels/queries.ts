import { useQuery } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api, { ITenantChannel } from './api';

const tenantChannelQueryKeys = {
    all: ['tenantChannels'] as const,
    tenantChannel: () => [...tenantChannelQueryKeys.all, 'tenantChannel'] as const,
    tenantAndChannelId: (tenantId: string, channelId: string) =>
        [...tenantChannelQueryKeys.tenantChannel(), tenantId, channelId] as const,
    tenantChannelById: (tenantChannelId: string) => [...tenantChannelQueryKeys.all, tenantChannelId] as const,
};

export const useTenantChannelForTenantAndChannel = (tenantId: string, channelId: string, options?: QueryOptions) =>
    useQuery(
        tenantChannelQueryKeys.tenantAndChannelId(tenantId, channelId),
        () => api.getTenantChannelForTenantAndChannel(tenantId, channelId),
        {
            ...options,
            onSuccess: (data) => {
                if (options?.onSuccess) {
                    options.onSuccess(data);
                }
            },
        },
    );

export const useTenantChannelById = (tenantChannelId: string, options?: QueryOptions) =>
    useQuery(
        tenantChannelQueryKeys.tenantChannelById(tenantChannelId),
        () => api.getTenantChannelById(tenantChannelId), // Call the new API function to get tenant channel by ID
        {
            ...options,
            onSuccess: (data: ITenantChannel) => {
                // Adjust onSuccess callback to include ITenantChannel type
                if (options?.onSuccess) {
                    options.onSuccess(data);
                }
            },
        },
    );

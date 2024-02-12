import axios from 'axios';
import { z } from 'zod';

import { logger } from '../../utils';
import { Channel } from '@pz/state/channels/api';

export const TenantChannel = z.object({
    id: z.string(),
    tenantId: z.string(),
    channelId: z.string(),
    channel: Channel.optional(),
    channelEmail: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type ITenantChannel = z.infer<typeof TenantChannel>;

async function getTenantChannelForTenantAndChannel(tenantId: Guid, channelId: Guid): Promise<ITenantChannel> {
    try {
        const { data } = await axios.get(`/TenantChannels/tenant/${tenantId}/channel/${channelId}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getTenantChannelById(tenantChannelId: string): Promise<ITenantChannel> {
    try {
        const { data } = await axios.get(`/TenantChannels/${tenantChannelId}`, {});
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getTenantChannelForTenantAndChannel,
    getTenantChannelById,
};

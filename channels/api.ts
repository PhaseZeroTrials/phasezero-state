import axios from 'axios';
import { z } from 'zod';

import { logger } from '../../utils';
import { FormChannelRule } from '@pz/state/formChannelRules/api';
import { MessengerChannelRule } from '@pz/state/messengerChannelRules/api';

export const ChannelTypes = {
    Sms: '89f4fd79-2d35-44c1-97da-41c10559f131',
    Gmail: '97d281da-579f-43d0-ad79-c9b21f50af82',
    Form: '3a2b4cde-5f67-4890-b123-456789abcdef',
    EmailDKIM: '1a192ccb-e46a-4378-a827-124f7ae1b085',
    Messenger: '4b4a6e18-86c7-4b6a-9a41-27ebc92a56e4',
};

export const Channel = z.object({
    id: z.string(),
    name: z.string(),
    inboxId: z.string(),
    channelTypeId: z.string(),
    twilioPhoneNumber: z.string().optional(),
    email: z.string().optional(),
    formId: z.number().optional(),
    archivedAt: z.number().optional(),
    phoneNumberConfigurationId: z.string().optional(),
    formChannelRules: FormChannelRule.array().optional(),
    messengerChannelRule: MessengerChannelRule.optional(),
});

// Create a partial
const PartialChannel = Channel.partial({ id: true, archivedAt: true });

export type IChannel = z.infer<typeof Channel>;
export type IPartialChannel = z.infer<typeof PartialChannel>;

async function getChannels(): Promise<IChannel[]> {
    try {
        const { data } = await axios.get(`/channels`);
        return Channel.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getChannel(id: string): Promise<IChannel> {
    try {
        const { data } = await axios.get(`/channels/${id}`);
        return Channel.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createChannel(channel: IPartialChannel): Promise<IChannel> {
    try {
        const { data } = await axios.post(`/channels`, channel);
        return Channel.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateChannel(channel: IPartialChannel): Promise<IChannel> {
    try {
        const { data } = await axios.put(`/channels`, channel);
        return Channel.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function deleteChannel(channelId: Guid): Promise<IChannel> {
    try {
        const { data } = await axios.delete(`/channels/${channelId}`);
        return Channel.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getChannels,
    getChannel,
    createChannel,
    updateChannel,
    deleteChannel,
};

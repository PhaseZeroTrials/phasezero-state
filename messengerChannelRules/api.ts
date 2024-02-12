import axios from 'axios';
import { z } from 'zod';
import { logger } from '../../utils';

export enum MessengerChannelRuleActionTypes {
    SendEmail,
    SendSms,
    None,
}

export const MessengerChannelRule = z.object({
    id: z.string(), // Guid represented as string
    channelId: z.string(), // Guid represented as string
    chatWidgetColor: z.string().optional(),
    chatWidgetLogoUrl: z.string().optional(),
    teamName: z.string().optional(),
    agentName: z.string().optional(),
    agentAvatarUrl: z.string().optional(),
    heading: z.string().optional(),
    subheading: z.string().optional(),
    defaultWelcomeMessage: z.string().optional(),
    promptOptions: z.number().optional(), // Prompt options currently an enum
});

// Create a partial
const PartialMessengerChannelRule = MessengerChannelRule.partial({ id: true, channelId: true });

export type IMessengerChannelRule = z.infer<typeof MessengerChannelRule>;
export type IPartialMessengerChannelRule = z.infer<typeof PartialMessengerChannelRule>;

async function getMessengerChannelRule(id: string): Promise<IMessengerChannelRule> {
    try {
        const { data } = await axios.get(`/messengerChannelRules/${id}`);
        return MessengerChannelRule.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createMessengerChannelRule(
    messengerChannelRule: IPartialMessengerChannelRule,
): Promise<IMessengerChannelRule> {
    try {
        const { data } = await axios.post('/messengerChannelRules', messengerChannelRule);
        return MessengerChannelRule.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateMessengerChannelRule(
    messengerChannelRule: IPartialMessengerChannelRule,
): Promise<IMessengerChannelRule> {
    try {
        const { data } = await axios.put('/messengerChannelRules', messengerChannelRule);
        return MessengerChannelRule.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function deleteMessengerChannelRule(id: string): Promise<IMessengerChannelRule> {
    try {
        const { data } = await axios.delete(`/messengerChannelRules/${id}`);
        return MessengerChannelRule.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getMessengerChannelRule,
    createMessengerChannelRule,
    updateMessengerChannelRule,
    deleteMessengerChannelRule,
};

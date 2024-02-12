import axios from 'axios';
import { z } from 'zod';

import { logger } from '../../utils';
import { IMessage } from '@pz/state';

export const EmailDefinition = z.object({
    from: z.string(),
    to: z.array(z.string()),
    cc: z.array(z.string()).optional(),
    bcc: z.array(z.string()).optional(),
    subject: z.string().optional(),
    body: z.string(),
    conversationId: z.string().uuid().optional(),
});

export type IEmailDefinition = z.infer<typeof EmailDefinition>;

async function syncEmails(channelId: string): Promise<void> {
    try {
        await axios.post(`/gmail/sync/${channelId}`);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function sendEmail(channelId: string, email: IEmailDefinition): Promise<IMessage> {
    try {
        const { data } = await axios.post(`/gmail/send/${channelId}`, email);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function sendReplyGmail(channelId: string, email: IEmailDefinition): Promise<IMessage> {
    try {
        const { data } = await axios.post(`/gmail/reply/${channelId}`, email);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    syncEmails,
    sendEmail,
    sendReplyGmail,
};

import axios from 'axios';
import { logger } from '../../utils';
import { IConversation } from '@pz/state';

async function sendVisitorMessage(
    tenantChannelId: string,
    body: string,
    subjectId?: number,
    conversationId?: string,
): Promise<IConversation> {
    try {
        const { data } = await axios.post(`/messenger/visitor/send`, {
            tenantChannelId,
            body,
            subjectId,
            conversationId,
        });
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function sendMessage(conversationId: string, body: string): Promise<IConversation> {
    try {
        const { data } = await axios.post(`/messenger/send`, { conversationId, body });
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default { sendVisitorMessage, sendMessage };

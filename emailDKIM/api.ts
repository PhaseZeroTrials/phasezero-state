import axios from 'axios';
import { logger } from '../../utils';
import { IMessage } from '@pz/state';
import { IEmailDefinition } from '@pz/state/gmail';

async function sendEmailDKIM(channelId: string, email: IEmailDefinition): Promise<IMessage> {
    try {
        const { data } = await axios.post(`/Emails/send/${channelId}`, email);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    sendEmailDKIM,
};

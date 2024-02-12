import axios from 'axios';
import { logger } from '../../utils';
import { IConversation } from '@pz/state';

async function sendSms(to: string[], from: string, body: string, medias: string[]): Promise<IConversation[]> {
    try {
        const { data } = await axios.post(`/sms/send`, { to, from, body, medias });
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default { sendSms };

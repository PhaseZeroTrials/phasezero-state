import axios from 'axios';
import { z } from 'zod';
import { logger } from '../../utils';

import { DateOrString } from '@pz/state/common';

export const CallActivity = z.object({
    id: z.string(),
    conversationId: z.string(),
    startTime: DateOrString,
    endTime: DateOrString.optional(),
    state: z.string().optional(),
    duration: z.string().optional(),
    createdAt: DateOrString.optional(),
});

export type ICallActivity = z.infer<typeof CallActivity>;

const PartialCallActivity = CallActivity.partial({ id: true, startTime: true, endTime: true });
export type IPartialCallActivity = z.infer<typeof PartialCallActivity>;
async function fetchVoiceToken(): Promise<string> {
    try {
        const { data } = await axios.get(`/Voice/token`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createCallActivity(callActivity: IPartialCallActivity): Promise<any> {
    try {
        const { data } = await axios.post(`/Voice/callactivity`, callActivity);
        return CallActivity.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateCallActivity(id: string, callActivity: IPartialCallActivity): Promise<any> {
    try {
        const { data } = await axios.put(`/Voice/callactivity/${id}`, callActivity);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    fetchVoiceToken,
    createCallActivity,
    updateCallActivity,
};

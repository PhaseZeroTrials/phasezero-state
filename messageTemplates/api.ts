import axios from 'axios';
import { z } from 'zod';

import { logger } from '@pz/utils';

export const MessageTemplate = z.object({
    id: z.string(),
    name: z.string(),
    body: z.string(),
});
export type IMessageTemplate = z.infer<typeof MessageTemplate>;

//  Create Partial<T> type without the 'id' property
const PartialMessageTemplate = MessageTemplate.partial({ id: true });

export type IPartialMessageTemplate = z.infer<typeof PartialMessageTemplate>;

const createMessageTemplate = async (messageTemplate: IPartialMessageTemplate) => {
    try {
        const { data } = await axios.post(`/MessageTemplates`, messageTemplate);
        return MessageTemplate.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getMessageTemplates = async () => {
    try {
        const { data } = await axios.get(`/MessageTemplates`);
        return MessageTemplate.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getMessageTemplateById = async (id: string) => {
    try {
        const { data } = await axios.get(`/MessageTemplates/${id}`);
        return MessageTemplate.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const updateMessageTemplate = async (messageTemplate: IMessageTemplate) => {
    try {
        const { data } = await axios.put(`/MessageTemplates`, messageTemplate);
        return MessageTemplate.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const deleteMessageTemplateById = async (id: string) => {
    try {
        const { data } = await axios.delete(`/MessageTemplates/${id}`);
        return MessageTemplate.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    createMessageTemplate,
    getMessageTemplates,
    getMessageTemplateById,
    updateMessageTemplate,
    deleteMessageTemplateById,
};

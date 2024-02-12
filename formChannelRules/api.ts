import axios from 'axios';
import { z } from 'zod';

import { logger } from '../../utils';

export enum FormChannelRuleActionTypes {
    SendEmail,
    SendSms,
    None,
}

export const FormChannelRule = z.object({
    id: z.string(), // Guid represented as string
    channelId: z.string(), // Guid represented as string
    fromChannelId: z.string(), // Guid represented as string
    formChannelRuleActionType: z.nativeEnum(FormChannelRuleActionTypes),
    subject: z.string().optional(),
    body: z.string(),
});

// Create a partial
const PartialFormChannelRule = FormChannelRule.partial({ id: true });

export type IFormChannelRule = z.infer<typeof FormChannelRule>;
export type IPartialFormChannelRule = z.infer<typeof PartialFormChannelRule>;

async function getFormChannelRule(id: Guid): Promise<IFormChannelRule> {
    try {
        const { data } = await axios.get(`/formChannelRules/${id}`);
        return FormChannelRule.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createFormChannelRule(formChannelRule: IPartialFormChannelRule): Promise<IFormChannelRule> {
    try {
        const { data } = await axios.post(`/formChannelRules`, formChannelRule);
        return FormChannelRule.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateFormChannelRule(formChannelRule: IPartialFormChannelRule): Promise<IFormChannelRule> {
    try {
        const { data } = await axios.put(`/formChannelRules`, formChannelRule);
        return FormChannelRule.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function deleteFormChannelRule(id: Guid): Promise<IFormChannelRule> {
    try {
        const { data } = await axios.delete(`/formChannelRules/${id}`);
        return FormChannelRule.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getFormChannelRule,
    createFormChannelRule,
    updateFormChannelRule,
    deleteFormChannelRule,
};

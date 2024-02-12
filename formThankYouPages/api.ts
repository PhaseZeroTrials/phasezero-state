import axios from 'axios';
import { z } from 'zod';
import { logger } from '../../utils';

export const FormThankYouPage = z.object({
    id: z.string(),
    formId: z.number(),
    thankYouPageTypeId: z.string(),
    targetFormId: z.number().nullable().optional(),
    thankYouPageHtml: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
    trialTaskId: z.string().optional(),
    trialTask: z.string().nullable().optional(),
    condition: z.string().nullable().optional(),
});

const PartialFormThankYouPage = FormThankYouPage.partial({ id: true });

export type IFormThankYouPage = z.infer<typeof FormThankYouPage>;
export type IPartialFormThankYouPage = z.infer<typeof PartialFormThankYouPage>;

async function getFormThankYouPage(formId: number): Promise<IFormThankYouPage | null> {
    try {
        const { data } = await axios.get(`/formThankYouPages/form/${formId}`);
        if (!data) return null;
        return FormThankYouPage.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createFormThankYouPage(formThankYouPage: IPartialFormThankYouPage): Promise<IFormThankYouPage> {
    try {
        const { data } = await axios.post('/formThankYouPages', formThankYouPage);
        return FormThankYouPage.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateFormThankYouPage(formThankYouPage: IPartialFormThankYouPage): Promise<IFormThankYouPage> {
    try {
        const { data } = await axios.put('/formThankYouPages', formThankYouPage);
        return FormThankYouPage.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function deleteFormThankYouPage(formThankYouPageId: number): Promise<IFormThankYouPage> {
    try {
        const { data } = await axios.delete(`/formThankYouPages/${formThankYouPageId}`);
        return FormThankYouPage.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getFormThankYouPage,
    createFormThankYouPage,
    updateFormThankYouPage,
    deleteFormThankYouPage,
};

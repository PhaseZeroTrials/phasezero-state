import axios from 'axios';
import { z } from 'zod';

import { Form } from '../forms';
import { logger } from '@pz/utils';

export const PortalSettings = z.object({
    id: z.string(),
    studyId: z.number(),
    portalUrl: z.string().optional(),
    helperText: z.string().optional(),
    logoUrl: z.string().optional(),
    theme: z.string().optional(),
    favIconUrl: z.string().optional(),
    intakeFormId: z.number().optional(),
    intakeForm: Form.optional(),
    resultsFormId: z.number().optional(),
    resultsForm: Form.optional(),
    portalForms: Form.array().optional(),
    sendMessageNotificationSms: z.boolean(),
    sendMessageNotificationEmail: z.boolean(),
    sendTaskNotificationSms: z.boolean(),
    sendTaskNotificationEmail: z.boolean(),
});

export type ITheme = {
    primaryColor?: string;
    primaryFontColor?: string;
    secondaryFontColor?: string;
    customFont?: string;
    customFontFile?: string;
    customFontUrl?: string;
};

export type IPortalSettings = z.infer<typeof PortalSettings>;

const PartialPortalSettings = PortalSettings.partial({ id: true });
export type IPartialPortalSettings = z.infer<typeof PartialPortalSettings>;

const createPortalSettings = async (settings: IPartialPortalSettings): Promise<IPortalSettings> => {
    try {
        const { data } = await axios.post('PortalSettings/', settings);
        return PortalSettings.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const updatePortalSettings = async (settings: IPortalSettings): Promise<IPortalSettings> => {
    try {
        const { data } = await axios.put('PortalSettings/', settings);
        return PortalSettings.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const deletePortalSettings = async (id: Guid): Promise<IPortalSettings> => {
    try {
        const { data } = await axios.delete(`PortalSettings/${id}`);

        return PortalSettings.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const getPortalSettingsByStudy = async (studyId: number): Promise<IPortalSettings | null> => {
    try {
        const { data } = await axios.get(`PortalSettings/study/${studyId}`);
        if (!data) {
            return null;
        }

        return PortalSettings.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const addFormToPortalSettings = async (formId: number, settings: IPortalSettings) => {
    try {
        // Returns a PortalFormAssociation, but ignored in the client for now
        await axios.post(`PortalSettings/${settings.id}/form/${formId}`);
        return settings;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const removeFormFromPortalSettings = async (formId: number, settings: IPortalSettings) => {
    try {
        // Returns a PortalFormAssociation, but ignored in the client for now
        await axios.delete(`PortalSettings/${settings.id}/form/${formId}`);
        return settings;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    addFormToPortalSettings,
    createPortalSettings,
    deletePortalSettings,
    getPortalSettingsByStudy,
    removeFormFromPortalSettings,
    updatePortalSettings,
};

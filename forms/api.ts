import axios, { AxiosResponse } from 'axios';
import { z } from 'zod';

import { TrialTask } from '../trialTasks';
import { logger } from '@pz/utils';
import { FormThankYouPage } from '@pz/state/formThankYouPages/api';

const FormType = z.object({
    id: z.string(),
    value: z.string(),
    description: z.string(),
});
export type IFormType = z.infer<typeof FormType>;

export const Form = z.object({
    id: z.number(),
    name: z.string(),
    studyId: z.number().optional(),
    formTypeId: z.string(),
    formType: FormType.optional(),
    formPurposeTypeId: z.string().optional(),
    schema: z.string(),
    isTemplate: z.boolean().optional(),
    publicUrlKey: z.string().optional(),
    allowPublicAccess: z.boolean().optional(),
    fieldCount: z.number().optional(),
    trialTasks: TrialTask.array().optional(),
    formThankYouPages: FormThankYouPage.array().optional(),
    thankYouPageHtmlString: z.string().optional(),
    coverImageUrl: z.string().optional(),
    logoUrl: z.string().optional(),
    analyticsId: z.string().optional(),
    amplitudeId: z.string().optional(),
    theme: z.string().optional(),
    codeInjection: z.string().optional(),
    formRenderVersionTypeId: z.string(),
});
export type IForm = z.infer<typeof Form>;

const PartialForm = Form.partial({ id: true, formRenderVersionTypeId: true });
export type IPartialForm = z.infer<typeof PartialForm>;

async function getForms(): Promise<IForm[]> {
    const { data } = await axios.get<IForm[]>(`/Forms`);
    return data;
}

async function getForm(id: number): Promise<IForm> {
    try {
        const { data } = await axios.get(`/Forms/${id}`);
        return data;
    } catch (error) {
        logger.log(error);
        return {} as IForm;
    }
}

async function deleteForm(record: IForm): Promise<IForm> {
    try {
        const { data } = await axios.delete(`/Forms/${record.id}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createOrUpdateForm(record: IPartialForm): Promise<IForm> {
    try {
        const response = await axios.post(`/Forms/createOrUpdate`, record);
        logger.log(response);
        return response.data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getTaskFormByPublicUrl(publicUrlKey: string): Promise<IForm> {
    const { data } = await axios.get(`/Forms/task/${publicUrlKey}/public`);
    return data;
}

async function getFormByPublicUrl(publicUrlKey: string): Promise<IForm> {
    const { data } = await axios.get(`/Forms/form/${publicUrlKey}/public`, {
        transformRequest: (data, headers) => {
            delete headers.Authorization;
            return data;
        },
    });
    return data;
}

async function getFormByTrialTaskId(tenantId: string, trialTaskId: string): Promise<IForm | null> {
    try {
        const { data } = await axios.get(`/Forms/tenant/${tenantId}/task/${trialTaskId}/public`, {
            transformRequest: (data, headers) => {
                // check if headers.common is defined
                delete headers.Authorization;
                return data;
            },
        });
        return data;
    } catch (error: any) {
        logger.log(error);
        if (error?.response?.status === 404) {
            return null;
        } else {
            throw error;
        }
    }
}

async function getFormByTenantIdAndFormId(tenantId: string, formId: number): Promise<IForm | null> {
    try {
        const { data } = await axios.get(`/Forms/tenant/${tenantId}/form/${formId}/public`, {
            transformRequest: (data, headers) => {
                // check if headers.common is defined
                delete headers.Authorization;
                return data;
            },
        });
        return data;
    } catch (error: any) {
        logger.log(error);
        if (error?.response?.status === 404) {
            return null;
        } else {
            throw error;
        }
    }
}

async function getFormsByStudyId(studyId: number): Promise<IForm[]> {
    const { data } = await axios.get(`/Forms/study/${studyId}`);
    return data;
}

async function getFormTemplates(): Promise<AxiosResponse<any>> {
    return await axios.get(`/Forms?template=true`);
}

async function getFormTypes(): Promise<AxiosResponse<any>> {
    return await axios.get(`/FormTypes/`);
}

async function getTrialTasksByFormId(formId: number): Promise<AxiosResponse<any>> {
    return await axios.get(`/trialtasks/form/${formId}`);
}

async function setFormPublic(formId: number): Promise<AxiosResponse<any>> {
    return await axios.post(`/Forms/${formId}/public`);
}

async function createForm(form: IPartialForm): Promise<IForm> {
    try {
        const { data } = await axios.post('/Forms', form); // Adjust the URL if necessary
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    createForm,
    getForms,
    getForm,
    deleteForm,
    createOrUpdateForm,
    getTaskFormByPublicUrl,
    getFormByPublicUrl,
    getFormByTrialTaskId,
    getFormsByStudyId,
    getFormTemplates,
    getFormTypes,
    getTrialTasksByFormId,
    setFormPublic,
    getFormByTenantIdAndFormId,
};

import axios from 'axios';
import { z } from 'zod';

import { Form } from '../forms';
import { Subject } from '../subjects';
import { DateOrString } from '../common';
import { logger } from '@pz/utils';

// Not used for parsing.
export const FormResponse = z.object({
    id: z.string(),
    subjectId: z.number().optional(),
    taskId: z.string().optional(),
    formId: z.number().optional(),
    form: Form.optional(),
    response: z.string(),
    subject: Subject.optional(),
    formVisitId: z.string().optional(),
    noteId: z.string().optional(),

    createdAt: DateOrString,
    updatedAt: DateOrString,
    //     not mapped
    conversationId: z.string().optional(),
    isCompleted: z.boolean().optional(),
});

export type IFormResponse = z.infer<typeof FormResponse>;

const PartialFormResponse = FormResponse.partial({ id: true, createdAt: true, updatedAt: true });
export type IPartialFormResponse = z.infer<typeof PartialFormResponse>;

// Parsed Form Responses
export const ParsedFormResponse = z.object({
    id: z.string(),
    internalId: z.string(),
    subjectTrialTaskFormResponseId: z.string(),
    title: z.string(),
    uiWidget: z.string().optional(),
    value: z.string(),
    variableId: z.string(),
    taskId: z.string().optional(),
    subjectId: z.number().optional(),

    updatedAt: DateOrString,
    createdAt: DateOrString,
    subjectTrialTaskFormResponseCreatedAt: DateOrString,
    subjectTrialTaskFormResponseUpdatedAt: DateOrString,
});

export type IParsedFormResponse = z.infer<typeof ParsedFormResponse>;

async function createOrUpdateFormResponse(formResponse: IPartialFormResponse): Promise<IFormResponse> {
    try {
        const { data } = await axios.post('/SubjectTaskFormResponse/createOrUpdate', formResponse);
        return FormResponse.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function patchFormResponse(formResponse: IPartialFormResponse) {
    return await axios.post('/SubjectTaskFormResponse/updateCellValue', formResponse);
}

async function createAnonResponse(tenantId: Guid, formResponse: IPartialFormResponse): Promise<IFormResponse> {
    try {
        const { data } = await axios.post(`/SubjectTaskFormResponse/tenant/${tenantId}/public`, formResponse);
        return FormResponse.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createResponseForSubject(tenantId: Guid, formResponse: IPartialFormResponse, runWorkflow?: boolean) {
    // Convert boolean to string

    if (runWorkflow !== undefined) {
        return await axios.post(`/SubjectTaskFormResponse/tenant/${tenantId}?runWorkflow=${runWorkflow}`, formResponse);
    }
    return await axios.post(`/SubjectTaskFormResponse/tenant/${tenantId}`, formResponse);
}

async function getFormResponseById(id: string): Promise<IFormResponse> {
    try {
        const { data } = await axios.get(`/SubjectTaskFormResponse/${id}`);
        return FormResponse.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getFormResponsesBySubjectId(subjectId: number): Promise<IFormResponse[]> {
    try {
        const { data } = await axios.get(`/SubjectTaskFormResponse/subject/${subjectId}/formResponse`);
        return FormResponse.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getFormResponsesBySubjectAndForm(formId: number, subjectId: number): Promise<IFormResponse[]> {
    try {
        const { data } = await axios.get(`/SubjectTaskFormResponse/form/${formId}/subject/${subjectId}`);
        return FormResponse.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getFormResponsesByFormId(formId: number): Promise<IFormResponse[]> {
    try {
        const { data } = await axios.get(`/SubjectTaskFormResponse/form/${formId}`);
        // Filter out nulls in data
        const filteredData = data.filter(function (el: any) {
            return el != null;
        });
        return FormResponse.array().parse(filteredData);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getFormResponsesBySubjectAndTaskId(subjectId: number, taskId: string): Promise<IFormResponse[]> {
    try {
        const { data } = await axios.get(`/SubjectTaskFormResponse/subject/${subjectId}/trialTaskId/${taskId}`);
        return FormResponse.array().parse(data);
    } catch (error: any) {
        logger.log(error);
        if (error?.response?.status === 404) {
            return [];
        } else {
            throw error;
        }
    }
}

async function updateFormResponse(formResponse: IPartialFormResponse): Promise<IFormResponse> {
    try {
        const { data } = await axios.put(`/SubjectTaskFormResponse/`, formResponse);
        return FormResponse.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function publicUpdateFormResponse(tenantId: Guid, formResponse: IPartialFormResponse): Promise<IFormResponse> {
    try {
        const { data } = await axios.put(`/SubjectTaskFormResponse/tenant/${tenantId}/publicUpdate`, formResponse);
        return FormResponse.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

const deleteFormResponseById = async (id: Guid): Promise<IFormResponse> => {
    try {
        const { data } = await axios.delete(`/SubjectTaskFormResponse/${id}`);
        return FormResponse.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

async function getFormResponseSummaryByFormId(formId: number) {
    return await axios.get(`/SubjectTrialTaskParsedFormResponse/summary/${formId}`);
}

async function getFormResponseSummaryByTaskId(taskId: string) {
    return await axios.get(`/SubjectTrialTaskParsedFormResponse/task/${taskId}/summary`);
}

async function getFormResponseTableByFormId(formId: number) {
    try {
        return await axios.get(`/SubjectTrialTaskParsedFormResponse/form/${formId}`);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getFormResponseTableByTaskId(taskId: string) {
    return await axios.get(`/SubjectTrialTaskParsedFormResponse/task/${taskId}`);
}

async function exportFormResponseToCsv(taskId: string) {
    return await axios.get(`/SubjectTrialTaskParsedFormResponse/task/${taskId}/export`, {
        responseType: 'arraybuffer',
    });
}

async function exportToSheet(taskId: string, spreadsheetName: string, tokenId: string) {
    return await axios.get(
        `/SubjectTrialTaskParsedFormResponse/task/${taskId}/export?googleSheet=true&name=${spreadsheetName}&tokenId=${tokenId}`,
    );
}

export default {
    createOrUpdateFormResponse,
    publicUpdateFormResponse,
    deleteFormResponseById,
    patchFormResponse,
    createAnonResponse,
    createResponseForSubject,
    getFormResponseById,
    updateFormResponse,
    getFormResponsesByFormId,
    getFormResponsesBySubjectAndForm,
    getFormResponsesBySubjectAndTaskId,
    getFormResponseSummaryByFormId,
    getFormResponseSummaryByTaskId,
    getFormResponseTableByFormId,
    getFormResponseTableByTaskId,
    exportToSheet,
    exportFormResponseToCsv,
    getFormResponsesBySubjectId,
};

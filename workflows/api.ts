import axios from 'axios';
import { z } from 'zod';

import { DateOrString } from '../common';
import { Study } from '../studies';
import { WorkflowTrigger } from '../workflowTriggers';
import { logger } from '../../utils';

export const Workflow = z.object({
    id: z.string(),
    studyId: z.number().optional(),
    study: Study.optional(),
    name: z.string(),
    description: z.string().optional(),
    enabled: z.boolean(),
    createdAt: DateOrString,
    updatedAt: DateOrString,
    formId: z.number().optional(),
    workflowTriggerId: z.string().optional(),
    workflowTrigger: WorkflowTrigger.optional(),
});

export type IWorkflow = z.infer<typeof Workflow>;

const PartialWorkflow = Workflow.partial({ id: true, enabled: true, createdAt: true, updatedAt: true });
export type IPartialWorkflow = z.infer<typeof PartialWorkflow>;

async function getWorkflows(): Promise<IWorkflow[]> {
    try {
        const { data } = await axios.get(`/workflows`);
        return Workflow.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getWorkflowsForProject(studyId: number): Promise<IWorkflow[]> {
    try {
        const { data } = await axios.get(`/workflows/study/${studyId}`);
        return Workflow.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getWorkflow(id: Guid): Promise<IWorkflow> {
    try {
        const { data } = await axios.get(`/workflows/${id}`);
        return Workflow.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function deleteWorkflow(record: IWorkflow): Promise<IWorkflow> {
    try {
        const { data } = await axios.delete(`/workflows/${record.id}`);
        return Workflow.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateWorkflow(record: IPartialWorkflow): Promise<IWorkflow> {
    try {
        const { data } = await axios.put(`/workflows/`, record);
        return Workflow.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createWorkflow(record: IPartialWorkflow): Promise<IWorkflow> {
    try {
        const { data } = await axios.post(`workflows`, record);
        return Workflow.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function rerunWorkflows(formResponseId: Guid) {
    try {
        const { data } = await axios.post(`workflows/Rerun/formResponse/${formResponseId}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getWorkflows,
    getWorkflowsForProject,
    getWorkflow,
    deleteWorkflow,
    updateWorkflow,
    createWorkflow,
    rerunWorkflows,
};

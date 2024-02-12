import axios from 'axios';
import { z } from 'zod';

import { Form } from '../forms';
import { TrialTask } from '../trialTasks';
import { Queue } from '../queue';
import { WorkflowAction } from '../workflowActions';
import { WorkflowActionTransition } from '../workflowTransitions';
import { logger } from '../../utils';

export const WorkflowTriggerTypeEnum = z.enum([
    'FormSubmitted',
    'TaskCreated',
    'AtScheduledTime',
    'FormResponseUpdated',
]);
export type WorkflowTriggerTypeEnum = z.infer<typeof WorkflowTriggerTypeEnum>;

export const WorkflowTriggerType = z.object({
    id: z.string(),
    value: WorkflowTriggerTypeEnum,
});
export type WorkflowTriggerType = z.infer<typeof WorkflowTriggerType>;

export const WorkflowTrigger = z.object({
    id: z.string(),
    workflowId: z.string(),
    workflowTriggerTypeId: z.string().optional(),
    workflowTriggerType: WorkflowTriggerType.optional(),
    trialTaskId: z.string().optional(),
    trialTask: TrialTask.optional(),
    formId: z.number().optional(),
    form: Form.optional(),
    queueId: z.string().optional(),
    queue: Queue.optional(),
    workflowActions: WorkflowAction.array().optional(),
    workflowActionTransitions: WorkflowActionTransition.array().optional(),
    params: z.string().optional(),
});

export type IWorkflowTrigger = z.infer<typeof WorkflowTrigger>;

const PartialWorkflowTrigger = WorkflowTrigger.partial({ id: true });
type IPartialWorkflowTrigger = z.infer<typeof PartialWorkflowTrigger>;

async function createWorkflowTrigger(workflowTrigger: IPartialWorkflowTrigger): Promise<IWorkflowTrigger> {
    try {
        const parsed = PartialWorkflowTrigger.parse(workflowTrigger);
        const { data } = await axios.post(`/WorkflowTriggers`, parsed);
        return WorkflowTrigger.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateWorkflowTrigger(workflowTrigger: IPartialWorkflowTrigger): Promise<IWorkflowTrigger> {
    try {
        const parsed = PartialWorkflowTrigger.parse(workflowTrigger);
        const { data } = await axios.put(`/WorkflowTriggers`, parsed);
        return WorkflowTrigger.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getWorkflowTriggersByFormId(formId: number): Promise<IWorkflowTrigger[]> {
    try {
        const { data } = await axios.get(`/WorkflowTriggers/Form/${formId}`);
        return WorkflowTrigger.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getWorkflowTriggersByStudyId(studyId: number): Promise<IWorkflowTrigger[]> {
    try {
        const { data } = await axios.get(`/WorkflowTriggers/Study/${studyId}`);
        return WorkflowTrigger.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getWorkflowTriggers(): Promise<IWorkflowTrigger[]> {
    try {
        const { data } = await axios.get(`/WorkflowTriggers`);
        return WorkflowTrigger.array().parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getWorkflowTriggers,
    getWorkflowTriggersByFormId,
    getWorkflowTriggersByStudyId,
    createWorkflowTrigger,
    updateWorkflowTrigger,
};

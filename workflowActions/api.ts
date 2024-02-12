import axios from 'axios';
import { z } from 'zod';

import { WorkflowActionTransition } from '../workflowTransitions';
import { logger } from '@pz/utils';

export const WorkflowActionTypeEnum = z.enum([
    'UpdateSubject',
    //'UpdateFormResponse',
    'SendEmail',
    'SendSms',
    'SendWebhook',
    'CreateTask',
    'CreateSubject',
    'AssignTask',
    'AssignCarePlan',
    'CreateFormResponse',
    'Delay',
    'NoOp',
]);
export type WorkflowActionTypeEnum = z.infer<typeof WorkflowActionTypeEnum>;

const WorkflowActionType = z.object({
    id: z.string(),
    value: WorkflowActionTypeEnum,
});

export const WorkflowAction = z.object({
    id: z.string(),
    workflowTriggerId: z.string(),
    //workflowTrigger: WorkflowTrigger.optional(),
    workflowActionTypeId: z.string().optional(),
    workflowActionType: WorkflowActionType.optional(),
    workflowActionTransitionId: z.string().optional(),
    workflowActionTransitionIn: WorkflowActionTransition.optional(),
    workflowActionTransitionsOut: WorkflowActionTransition.array().optional(),
    params: z.string().optional(),

    // Not Mapped but used for UI
    queueLevel: z.number().optional(),
    numSiblings: z.number().optional(),
    childNumber: z.number().optional(),
    coordinates: z.object({ x: z.number().optional(), y: z.number().optional() }).optional(),
});

export type IWorkflowAction = z.infer<typeof WorkflowAction>;

const PartialWorkflowAction = WorkflowAction.partial({ id: true });
export type IPartialWorkflowAction = z.infer<typeof PartialWorkflowAction>;

async function createWorkflowAction(workflowAction: IPartialWorkflowAction): Promise<IWorkflowAction> {
    try {
        const { data } = await axios.post(`/WorkflowActions`, workflowAction);
        return WorkflowAction.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateWorkflowAction(workflowAction: IWorkflowAction): Promise<IWorkflowAction> {
    try {
        const { data } = await axios.put(`/WorkflowActions`, workflowAction);
        return WorkflowAction.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function deleteWorkflowAction(workflowActionId: string): Promise<IWorkflowAction> {
    try {
        const { data } = await axios.delete(`/WorkflowActions/${workflowActionId}`);
        return WorkflowAction.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    createWorkflowAction,
    updateWorkflowAction,
    deleteWorkflowAction,
};

import axios from 'axios';
import { z } from 'zod';

import { logger } from '@pz/utils';

export const WorkflowActionTransition = z.object({
    id: z.string(),
    description: z.string().optional(),
    triggerFromId: z.string().optional(),
    //workflowTrigger: WorkflowTrigger.optional(),
    actionFromId: z.string().optional(),
    //fromWorkflowAction: WorkflowAction.optional(),
    actionToId: z.string(),
    //toWorkflowAction: WorkflowAction,
    transitionCondition: z.string().optional(),

    // Not Mapped
    // Used for UI as a way to track transitionCondition
    queryValue: z.string().optional(),
});
export type IWorkflowActionTransition = z.infer<typeof WorkflowActionTransition>;

const PartialWorkflowActionTransition = WorkflowActionTransition.partial({ id: true });
export type IPartialWorkflowActionTransition = z.infer<typeof PartialWorkflowActionTransition>;

async function createWorkflowActionTransition(workflowActionTransition: IPartialWorkflowActionTransition) {
    try {
        const { data } = await axios.post(`/WorkflowActionTransitions`, workflowActionTransition);
        return WorkflowActionTransition.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function deleteWorkflowActionTransition(workflowActionTransitionId: Guid) {
    try {
        const { data } = await axios.delete(`/WorkflowActionTransitions/${workflowActionTransitionId}`);
        return WorkflowActionTransition.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getWorkflowActionTransitionByTargetAction(targetActionId: Guid): Promise<IWorkflowActionTransition> {
    try {
        const { data } = await axios.get(`/WorkflowActionTransitions/target/${targetActionId}`);
        return WorkflowActionTransition.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function updateWorkflowActionTransition(
    workflowActionTransition: IPartialWorkflowActionTransition,
): Promise<IWorkflowActionTransition> {
    try {
        const { data } = await axios.put(`/WorkflowActionTransitions`, workflowActionTransition);
        return WorkflowActionTransition.parse(data);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    createWorkflowActionTransition,
    updateWorkflowActionTransition,
    deleteWorkflowActionTransition,
    getWorkflowActionTransitionByTargetAction,
};

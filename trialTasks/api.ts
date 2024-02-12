import axios from 'axios';
import { z } from 'zod';
import { ITrialTask } from './model';
import { logger } from '@pz/utils';

// Not used for parsing response yet.
export const TrialTask = z.object({
    id: z.string(),
    name: z.string().optional(),
    formId: z.number().optional(),
    formName: z.string().optional(),
    //form: Form.optional(),
    trialTaskGroupId: z.string().optional(),
    //trialTaskGroup: TrialTaskGroup.optional(),
    scheduleId: z.string().optional(),
    groupOrder: z.number().optional(),
    //workflowTriggers: WorkflowTrigger.array(),
    survey: z.boolean().optional(),
    status: z.string().optional(),
    className: z.string().optional(),
    selected: z.boolean().optional(),
    isPublic: z.boolean().optional(),
});
//export type ITrialTask = z.infer<typeof TrialTask>;

async function getTrialTasksForProject(studyId: number): Promise<ITrialTask[]> {
    try {
        const { data } = await axios.get(`/trialTasks/study/${studyId}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getRecurringTasksForSubject(subjectId: number): Promise<ITrialTask[]> {
    try {
        const { data } = await axios.get(`/trialTasks/subject/${subjectId}/today`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getRecurringTasksForSubject,
    getTrialTasksForProject,
};

import { IForm } from '../forms';
import { IWorkflowTrigger, ITrialTaskGroup } from '@pz/state';
import { ITrialTaskRecurrence } from '@pz/state/schedules/model';

export interface ITrialTask {
    id?: string;
    name?: string;
    form?: IForm;
    formName?: string;
    formId?: number;
    trialTaskGroup?: ITrialTaskGroup;
    recurrenceDefinition?: ITrialTaskRecurrence;
    trialTaskRecurrence?: ITrialTaskRecurrence;
    trialTaskGroupId?: string;
    scheduleId?: string;
    groupOrder?: number;
    workflowTriggers?: IWorkflowTrigger[];
    isPublic?: boolean;

    // Attributes
    survey?: boolean;
    status?: string;
    className?: string;
    selected?: boolean;
    isCompleted?: boolean;
}

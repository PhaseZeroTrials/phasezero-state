import { IStudy } from '@pz/state';
import { ITrialTask } from '@pz/state';

export interface ISchedule {
    id?: string;
    name: string;
    studyId: number;
    study?: IStudy;
    identifier?: string;
    trialTasks?: ITrialTask[];
    trialTaskGroups?: ITrialTaskGroup[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ITrialTaskGroup {
    id?: string;
    name: string;
    scheduleId: string;
    trialTasks?: ITrialTask[];
}

export interface IScheduleSubject {
    subjectId: number;
    scheduleId: Guid;
    trialTaskGroupIds?: Guid[];
}

export enum RecurrenceFrequency {
    Daily = 'bb291d91-9609-4acf-ae0c-080d111beb37',
    Weekly = 'a2ecb973-3da6-4f5a-a77e-b3aebb7f9b91',
    Monthly = '1cee1810-10d6-4a3c-91b0-49cd1b81356a',
}

export interface ITrialTaskRecurrence {
    id?: Guid;
    trialTaskId?: Guid;
    recurrenceFrequency?: string;
}

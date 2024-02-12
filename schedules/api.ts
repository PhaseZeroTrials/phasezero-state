import axios from 'axios';
import { ISchedule, ITrialTaskGroup } from './model';
import { ITrialTask } from '@pz/state';
import { logger } from '@pz/utils';

async function getSchedulesForStudy(studyId: number, includeSchema?: boolean): Promise<ISchedule[]> {
    const include = includeSchema ? includeSchema : false;
    try {
        const { data } = await axios.get(`/Schedules/study/${studyId}?includeSchema=${include}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getScheduleById(id: Guid): Promise<ISchedule> {
    try {
        const { data } = await axios.get(`/Schedules/${id}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function createTrialTaskGroup(trialTaskGroup: ITrialTaskGroup) {
    return await axios.post(`/TrialTasks/group`, trialTaskGroup);
}

async function updateTrialTaskGroup(trialTaskGroup: ITrialTaskGroup) {
    return await axios.put(`/TrialTasks/group`, trialTaskGroup);
}

async function deleteTrialTaskGroup(trialTaskGroupId: string) {
    return await axios.delete(`/TrialTasks/group/${trialTaskGroupId}`);
}

async function createTrialTask(trialTask: ITrialTask) {
    return await axios.post(`/TrialTasks`, trialTask);
}

async function deleteTrialTask(trialTaskId: string) {
    return await axios.delete(`/TrialTasks/${trialTaskId}`);
}

async function editTrialTask(trialTask: ITrialTask) {
    return await axios.put(`/TrialTasks`, trialTask);
}

async function reorderTrialTask(trialTask: ITrialTask) {
    return await axios.put(`/TrialTasks/reorder`, trialTask);
}

async function createSchedule(schedule: ISchedule): Promise<ISchedule> {
    try {
        const { data } = await axios.post(`/Schedules`, schedule);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function deleteSchedule(scheduleId: string): Promise<ISchedule> {
    try {
        return await axios.delete(`/Schedules/${scheduleId}`);
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function assignScheduleToSubject(
    subjectId: number,
    scheduleId: Guid,
    trialTaskGroupIds?: Guid[],
): Promise<ISchedule> {
    try {
        if (trialTaskGroupIds) {
            const { data } = await axios.post(
                `/Schedules/${scheduleId}/subject/${subjectId}/assign`,
                trialTaskGroupIds,
            );
            return data;
        }
        const { data } = await axios.post(`/Schedules/${scheduleId}/subject/${subjectId}/assign`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getScheduleForSubject(subjectId: number): Promise<ISchedule | null> {
    try {
        const { data } = await axios.get(`/Schedules/subject/${subjectId}`);
        return data;
    } catch (error: any) {
        // Catch 404 errors and return null
        if (error?.response?.status === 404) {
            return null;
        }
        logger.log(error);
        throw error;
    }
}

export default {
    assignScheduleToSubject,
    getScheduleForSubject,
    createSchedule,
    getScheduleById,
    getSchedulesForStudy,
    createTrialTaskGroup,
    createTrialTask,
    deleteTrialTask,
    editTrialTask,
    reorderTrialTask,
    updateTrialTaskGroup,
    deleteTrialTaskGroup,
    deleteSchedule,
};

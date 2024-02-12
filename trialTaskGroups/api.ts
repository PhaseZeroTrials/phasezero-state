import axios from 'axios';
import { ITrialTaskGroup } from '@pz/state';
import { logger } from '@pz/utils';

async function getTrialTaskGroupsForSchedule(scheduleId: Guid): Promise<ITrialTaskGroup[]> {
    try {
        const { data } = await axios.get(`/Schedules/${scheduleId}/groups`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getTrialTaskGroupsForSchedule,
};

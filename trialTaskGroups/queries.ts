import { useQuery } from '@tanstack/react-query';

import { QueryOptions } from '../common';
import api from './api';

const trialTaskGroupQueryKeys = {
    all: ['trialTaskGroup'] as const,
    id: (id: Guid) => [...trialTaskGroupQueryKeys.all, id] as const,
    schedule: () => [...trialTaskGroupQueryKeys.all, 'schedule'] as const,
    scheduleId: (scheduleId: Guid) => [...trialTaskGroupQueryKeys.schedule(), scheduleId] as const,
};

export const useTrialTaskGroupsByScheduleId = (scheduleId: Guid, options?: QueryOptions) =>
    useQuery(
        trialTaskGroupQueryKeys.scheduleId(scheduleId),
        () => {
            return api.getTrialTaskGroupsForSchedule(scheduleId);
        },
        options,
    );

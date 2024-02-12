// TODO: Load data from backend
export const TaskStatus = {
    OPEN: '049bf9d9-c264-45c0-8f87-772bc5dd067d',
    INPROGRESS: 'fdf3a542-e584-4191-ae16-e8e6a3262aba',
    BLOCKED: '9a9609a9-95b8-4e0a-8ca4-520b77821a7c',
    RESOLVED: 'f17376f3-09ed-4301-8a3b-5f8452f10eaf',
};

// TODO: Allows user to rename the issue via API
export const TaskStatusCopy = {
    [TaskStatus.OPEN]: 'Open',
    [TaskStatus.INPROGRESS]: 'In progress',
    [TaskStatus.BLOCKED]: 'Blocked',
    [TaskStatus.RESOLVED]: 'Resolved',
};

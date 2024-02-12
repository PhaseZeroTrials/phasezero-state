import { faPencil } from '@fortawesome/pro-light-svg-icons/faPencil';
import { faFileCheck } from '@fortawesome/pro-light-svg-icons/faFileCheck';
import { faPaperPlane } from '@fortawesome/pro-light-svg-icons/faPaperPlane';
import { faExclamationCircle } from '@fortawesome/pro-light-svg-icons/faExclamationCircle';
import { faClock } from '@fortawesome/pro-light-svg-icons/faClock';
import { faUser } from '@fortawesome/pro-light-svg-icons/faUser';
import { faContainerStorage } from '@fortawesome/pro-light-svg-icons/faContainerStorage';
import { faTableCells } from '@fortawesome/pro-light-svg-icons/faTableCells';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons/faEnvelope';
import { faAlarmClock } from '@fortawesome/pro-light-svg-icons/faAlarmClock';
import { faMessageSms } from '@fortawesome/pro-light-svg-icons/faMessageSms';
import { faStopCircle } from '@fortawesome/pro-regular-svg-icons/faStopCircle';
import { faPencilAlt } from '@fortawesome/pro-light-svg-icons/faPencilAlt';

import { WorkflowTriggerTypeEnum } from '@pz/state';
import { WorkflowActionTypeEnum } from '@pz/state';

export type WorkflowActionInfo = {
    type: WorkflowActionTypeEnum;
    name: string;
    description?: string;
    icon?: any;
    id: string;
};

export type WorkflowActionInfoMapType = {
    [key in WorkflowActionTypeEnum]: WorkflowActionInfo;
};

export const WorkflowActionInfoMap: WorkflowActionInfoMapType = {
    [WorkflowActionTypeEnum.enum.NoOp]: {
        id: '1f37da2d-3f8c-4d34-9ea6-fdae10be2e17',
        type: WorkflowActionTypeEnum.enum.NoOp,
        name: 'Please select an action',
        icon: faExclamationCircle,
    },
    [WorkflowActionTypeEnum.enum.SendEmail]: {
        id: '5a495750-93ae-4124-a5fc-a39a04495c6c',
        type: WorkflowActionTypeEnum.enum.SendEmail,
        name: 'Send an email',
        icon: faEnvelope,
    },
    [WorkflowActionTypeEnum.enum.SendSms]: {
        id: '93f2d653-e46a-4d3d-a9cb-1315dad408c4',
        type: WorkflowActionTypeEnum.enum.SendSms,
        name: 'Send an SMS',
        icon: faMessageSms,
    },
    [WorkflowActionTypeEnum.enum.SendWebhook]: {
        id: '327d4c7c-9bae-47b8-aded-6f58b80abf3e',
        type: WorkflowActionTypeEnum.enum.SendWebhook,
        name: 'Send a webhook',
        icon: faPaperPlane,
    },
    [WorkflowActionTypeEnum.enum.UpdateSubject]: {
        id: '8c325d3c-7bfa-474a-9384-554c2b4ba315',
        type: WorkflowActionTypeEnum.enum.UpdateSubject,
        name: 'Update a record',
        icon: faPencil,
    },
    [WorkflowActionTypeEnum.enum.CreateSubject]: {
        id: '5ad425df-ab1f-4def-a2f1-f174e5467b6e',
        type: WorkflowActionTypeEnum.enum.CreateSubject,
        name: 'Create a record',
        icon: faUser,
    },
    [WorkflowActionTypeEnum.enum.CreateTask]: {
        id: 'c1ce6f07-d940-4ecc-80d7-f402465d0731',
        type: WorkflowActionTypeEnum.enum.CreateTask,
        name: 'Create a task',
        icon: faExclamationCircle,
    },
    [WorkflowActionTypeEnum.enum.AssignTask]: {
        id: '936a77ff-e832-4009-9605-2f1fb663294f',
        type: WorkflowActionTypeEnum.enum.AssignTask,
        name: 'Auto Assign a task',
        icon: faUser,
    },
    [WorkflowActionTypeEnum.enum.AssignCarePlan]: {
        id: '63fdcdb6-489e-4e2c-87f2-f1c53204b059',
        type: WorkflowActionTypeEnum.enum.AssignCarePlan,
        name: 'Assign a care plan to a patient',
        icon: faTableCells,
    },
    [WorkflowActionTypeEnum.enum.CreateFormResponse]: {
        id: '8b56db1a-1f55-42a0-990a-56276375b051',
        type: WorkflowActionTypeEnum.enum.CreateFormResponse,
        name: 'Create a form',
        icon: faContainerStorage,
    },
    [WorkflowActionTypeEnum.enum.Delay]: {
        id: 'a007a710-a407-4e06-abd6-f09f50f4f071',
        type: WorkflowActionTypeEnum.enum.Delay,
        name: 'Please configure a time delay',
        icon: faClock,
    },
};

export type WorkflowTriggerInfo = {
    type: WorkflowTriggerTypeEnum;
    name: string;
    description?: string;
    icon?: any;
    id: string;
};

export type WorkflowTriggerInfoMapType = {
    [key in WorkflowTriggerTypeEnum]: WorkflowTriggerInfo;
};

export const WorkflowTriggerInfoMap: WorkflowTriggerInfoMapType = {
    [WorkflowTriggerTypeEnum.enum.FormSubmitted]: {
        type: WorkflowTriggerTypeEnum.enum.FormSubmitted,
        name: 'When a form is submitted',
        icon: faFileCheck,
        id: 'dc8e25e2-ef41-4cf4-9bb2-3fd94358e46f',
    },
    FormResponseUpdated: {
        type: WorkflowTriggerTypeEnum.enum.FormResponseUpdated,
        name: 'When a form response is updated',
        icon: faPencilAlt,
        id: 'a4e7bf86-4f1e-44fd-bd5d-ee146f734b2b',
    },
    [WorkflowTriggerTypeEnum.enum.TaskCreated]: {
        type: WorkflowTriggerTypeEnum.enum.TaskCreated,
        name: 'When a task status is updated',
        icon: faFileCheck,
        id: 'f0e58d71-d519-4f94-b122-d283235cb043',
    },
    [WorkflowTriggerTypeEnum.enum.AtScheduledTime]: {
        type: WorkflowTriggerTypeEnum.enum.AtScheduledTime,
        name: 'At a scheduled time',
        icon: faAlarmClock,
        id: '229ca780-f32e-4a63-97a8-7f1675e28ab7',
    },
};

export enum WorkflowEndTypesEnum {
    End = 'end',
}

export type WorkflowEndType = {
    type: WorkflowEndTypesEnum;
    name: string;
    description?: string;
    icon?: any;
};

export type WorkflowEndTypes = {
    [key in WorkflowEndTypesEnum]: WorkflowEndType;
};

export const WorkflowEnd: WorkflowEndTypes = {
    [WorkflowEndTypesEnum.End]: {
        type: WorkflowEndTypesEnum.End,
        name: 'The end of the automation',
        icon: faStopCircle,
    },
};

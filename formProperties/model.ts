export interface IFormProperty {
    trialTaskId: string;
    formId?: number;
    taskName: string;
    internalId: string;
    identifier: string;
    title: string;
    widget: string;
    enabled: boolean;
}

export interface IFormPropertyDefinition {
    studyId: number;
    trialTaskId?: string;
    identifier: string;
}

export interface IFormVisit {
    id?: string;
    formId?: number;
}

export interface IFormVisitEvent {
    formVisitId: string;
    formVisitEventTypeId: string;
    previousInternalId?: string;
    internalId?: string;
    variableId?: string;
}

export interface IFormMetric {
    views: number;
    starts: number;
    responses: number;
}

export interface IFormPage {
    pageNumber: number;
    pageId: string;
    firstVariableId: string;
    firstQuestionTitle: string;
    hasDiplsayLogic: boolean;
}

export interface IFormPageMetric {
    formPage: IFormPage;
    views: number;
    numberDropOut: number;
    dropOutRate: string;
}

export enum FormVisitEventType {
    FormStarted = 'ff53fe36-79e4-4651-a9eb-586d4c59d42f',
    FormQuestionView = '4daa2803-d3fd-4cd3-8621-87593eb9dc9e',
    FormSubmitted = '95690191-C863-4ADB-901E-633A2BC36083',
}

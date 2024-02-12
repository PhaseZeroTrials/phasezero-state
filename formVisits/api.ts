import axios, { AxiosResponse } from 'axios';
import { IFormMetric, IFormPageMetric, IFormVisit, IFormVisitEvent } from './model';

async function createFormVisit(tenantId: string, formId: number): Promise<AxiosResponse<IFormVisit>> {
    return await axios.post(`FormVisits/formOpened/tenant/${tenantId}/form/${formId}`);
}

async function createFormVisitEvent(
    tenantId: string,
    formVisitEvent: IFormVisitEvent,
): Promise<AxiosResponse<IFormVisitEvent>> {
    return await axios.post(`FormVisits/event/tenant/${tenantId}`, formVisitEvent);
}

async function getFormMetricSummary(formId: number): Promise<AxiosResponse<IFormMetric>> {
    return await axios.get(`FormVisits/summary/form/${formId}`);
}

async function getFormPageMetric(formId: number): Promise<AxiosResponse<IFormPageMetric[]>> {
    return await axios.get(`FormVisits/metric/form/${formId}`);
}

export default {
    createFormVisit,
    createFormVisitEvent,
    getFormMetricSummary,
    getFormPageMetric,
};

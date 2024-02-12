import axios, { AxiosResponse } from 'axios';
import { ITenant } from './model';

const getAvailableTenants = async (): Promise<Array<ITenant>> => {
    const { data } = await axios.get(`/TenantMembership`);
    return data;
};

async function getLastAccessedTenant(): Promise<AxiosResponse<ITenant> | null> {
    return await axios.get(`/TenantMembership/default`).catch(() => null);
}

async function switchTenant(tenantId: string): Promise<AxiosResponse<ITenant>> {
    return await axios.post(`/TenantMembership/switch?tenantId=${tenantId}`);
}

export default {
    getAvailableTenants,
    getLastAccessedTenant,
    switchTenant,
};

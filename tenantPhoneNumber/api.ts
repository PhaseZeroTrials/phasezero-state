import axios from 'axios';
import { z } from 'zod';

import { logger } from '../../utils';

export const TenantPhoneNumber = z.object({
    id: z.string(),
    number: z.string(),
});

export type ITenantPhoneNumber = z.infer<typeof TenantPhoneNumber>;

async function getTenantPhoneNumbersForTenant(tenantId: Guid): Promise<ITenantPhoneNumber[]> {
    try {
        const { data } = await axios.get(`/TenantPhoneNumber/tenant/${tenantId}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function provisionTenantPhoneNumber(): Promise<string> {
    try {
        const { data } = await axios.post(`/TenantPhoneNumber/provision`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function provisionTwiML(): Promise<any> {
    try {
        const { data } = await axios.post(`/TenantPhoneNumber/create-twiml-apikey`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    getTenantPhoneNumbersForTenant,
    provisionTenantPhoneNumber,
    provisionTwiML,
};

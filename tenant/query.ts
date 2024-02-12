import { useQuery } from '@tanstack/react-query';
import tenantService from './api';

const tenantKeys = {
    all: ['tenants'] as const,
};

export const useAvailableTenants = () =>
    useQuery(tenantKeys.all, () => {
        return tenantService.getAvailableTenants();
    });

export default {
    useAvailableTenants,
};

import { Action, Thunk, action, thunk } from 'easy-peasy';
import provisioningService from './api';
import { ITenant } from './model';

interface TenantSlice {
    // State
    tenants: Array<ITenant>;
    selected: ITenant | undefined;

    // Reducers
    setSelected: Action<TenantSlice, ITenant>;
    setTenants: Action<TenantSlice, Array<ITenant>>;

    // Actions
    getTenants: Thunk<TenantSlice>;
}

const tenantSlice: TenantSlice = {
    // States
    tenants: [],
    selected: undefined,

    setSelected: action((state, payload: ITenant) => {
        state.selected = payload;
    }),

    setTenants: action((state, payload: Array<ITenant>) => {
        state.tenants = payload;
    }),

    getTenants: thunk(async (actions) => {
        await provisioningService
            .getAvailableTenants()
            .then((data) => {
                actions.setTenants(data);
            })
            .catch(() => {
                // TODO
            });
    }),
};

export default tenantSlice;

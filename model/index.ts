import { loginSlice } from '../login';
import { studySlice } from '../studies';
import { tenantSlice } from '../tenant';

const storeModel = {
    login: loginSlice,
    studies: studySlice,
    tenants: tenantSlice,
};

export type StoreModel = typeof storeModel;

export default storeModel;

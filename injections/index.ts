import { loginService } from '../login';
import provisioningService from '../../state/tenant/api';
import userService from '../../state/user/api';

const injections = {
    loginService,
    provisioningService,
    userService,
};

export type Injections = typeof injections;

export default injections;

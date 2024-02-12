import axios from 'axios';
import { stringify } from 'qs';

import { EligibilityRequestInfo } from './model';
import { logger } from '@pz/utils';

const instance = axios.create({
    timeout: 3000,
});

const getToken = async () => {
    try {
        // If the headers are already populated then don't get a new token.
        if (instance.defaults?.headers?.common['Authorization']) {
            return instance.defaults.headers.common['Authorization'];
        }

        const { data } = await instance.post(
            // /Test/Token for test.
            'https://api.pverify.com/Token',
            stringify({
                Client_Id: '9349f09e-5239-4700-a5c3-f2cd43ed442d',
                Client_Secret: 'RLNDYjEWcQtdKlLaFfXxk1OpuCRA',
                grant_type: 'client_credentials',
            }),
        );

        console.log(data);

        // Load the default settings into the axios instance
        instance.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token;
        instance.defaults.headers.common['Client-API-Id'] = '9349f09e-5239-4700-a5c3-f2cd43ed442d';
        // /test/api for test.
        instance.defaults.baseURL = 'https://api.pverify.com/api';

        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

const eligibilitySummary = async (requestInfo: EligibilityRequestInfo) => {
    try {
        const { data } = await instance.post('/EligibilitySummary', requestInfo);
        console.log(data);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
};

export default {
    getToken,
    eligibilitySummary,
};

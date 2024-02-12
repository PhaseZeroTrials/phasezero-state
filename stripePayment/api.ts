import axios, { AxiosResponse } from 'axios';
import { IStripeAccount, IStripeAccountResponse } from './model';

async function createStripeAccount(): Promise<AxiosResponse<IStripeAccountResponse>> {
    return await axios.post(`/StripePayment/Account`);
}

// async function getStripeAccount(accountId: string): Promise<AxiosResponse<IStripeAccount>> {
//     return await axios.get(`/StripePayment/Account/${accountId}`);
// }

async function notifyStripeAccountCreated(tenantId: string): Promise<AxiosResponse<IStripeAccount>> {
    return await axios.post(`/StripePayment/NotifyAccountCreated/${tenantId}`);
}

async function getPaymentIntent(accountId: string, amount: number) {
    return await axios.get(`/StripePayment/PaymentIntent/Account/${accountId}?amount=${amount}`);
}

export default {
    notifyStripeAccountCreated,
    createStripeAccount,
    getPaymentIntent,
};

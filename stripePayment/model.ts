export interface IStripeAccount {
    id: string;
}

// https://stripe.com/docs/api/account_links
export interface IStripeAccountLink {
    url: string;
}

export interface IStripeAccountResponse {
    account: IStripeAccount;
    accountLink: IStripeAccountLink;
}

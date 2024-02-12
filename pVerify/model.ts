interface pVerifyProvider {
    firstName?: string;
    middleName?: string;
    lastName: string;
    npi: string;
}

interface pVerifySubscriber {
    firstName?: string;
    lastName?: string;
    memberId: string;
    dob?: string; // date of birth as MM/dd/YYYY
    ssn?: string;
}

export interface EligibilityRequestInfo {
    payerCode: string;
    payerName?: string;
    provider: pVerifyProvider;
    subscriber: pVerifySubscriber;
    isSubscriberPatient: string; // true for self, false for dependent
    doS_StartDate: string; // date of service start as MM/dd/YYYY
    doS_EndDate: string; // end of service as MM/dd/YYYY
    practiceTypeCode?: string;
    referenceId?: string;
    location?: string;
    includeTextResponse?: boolean;
}

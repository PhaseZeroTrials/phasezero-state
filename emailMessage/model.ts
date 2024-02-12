export enum EmailStatus {
    'Not Sent',
    'Sending',
    'Sent',
    'Failed',
}

export interface IEmailAutomationMessage {
    status: EmailStatus;
    email: string;
    subject: string;
    message: string;
}

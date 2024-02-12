import axios from 'axios';
import { IEmailAutomationMessage } from './model';

async function sendEmailMessage(emailMessage: IEmailAutomationMessage) {
    return await axios.post(`/SubjectEmail/send`, emailMessage);
}

export default {
    sendEmailMessage,
};

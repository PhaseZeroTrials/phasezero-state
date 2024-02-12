import axios from 'axios';
import { logger } from '../../utils';

interface GoogleAuthData {
    code: string;
    state: string;
}

async function initiateAuth(): Promise<{ url: string }> {
    try {
        const { data } = await axios.get(`/GoogleCalendarAuth/initiate-auth/`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function oAuth2Callback(authData: GoogleAuthData): Promise<string> {
    try {
        const { data } = await axios.post(`/GoogleCalendarAuth/oauth2-callback`, authData);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function getEvents(): Promise<any[]> {
    try {
        const { data } = await axios.get(`/GoogleCalendarAuth/events`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function listCalendars(email: string): Promise<any[]> {
    try {
        const { data } = await axios.get(`/GoogleCalendarAuth/list-calendars/${email}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

async function selectCalendar(calendarId: string): Promise<string> {
    try {
        const { data } = await axios.post(`/GoogleCalendarAuth/select-calendar/${calendarId}`);
        return data;
    } catch (error) {
        logger.log(error);
        throw error;
    }
}

export default {
    initiateAuth,
    oAuth2Callback,
    getEvents,
    listCalendars,
    selectCalendar,
};

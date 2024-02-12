import axios from 'axios';
import { z } from 'zod';
import { logger } from '@pz/utils';

export enum PhoneNumberActionTypeEnum {
    Ivr = '285b2e6e-7c73-4a72-b4f9-983d6abddcf8',
    RecordVoicemail = 'f8d9a47c-e1c4-4b18-ae8c-d6ea7d27f9f2',
    SendText = '6a1e9e87-3d3b-476e-9d53-8b32f5c5249a',
    RingPhone = '3b12e8f2-05ef-4a45-bf6f-e78b48a0d0c5',
    ForwardCall = 'd5e4a2c1-063d-47af-9e5a-6347c0a80f0b',
}

export const PhoneNumberConfiguration = z.object({
    id: z.string(),
    channelId: z.string(),
    phoneNumberActionTypeId: z.string(),
    smsConfigurationJson: z.string().nullable().optional(),
    ivrConfigurationJson: z.string().nullable().optional(),
    forwardingNumber: z.string().nullable().optional(),
});

export type IPhoneNumberConfiguration = z.infer<typeof PhoneNumberConfiguration>;

const PartialPhoneNumberConfiguration = PhoneNumberConfiguration.partial({ id: true });
export type IPartialPhoneNumberConfiguration = z.infer<typeof PartialPhoneNumberConfiguration>;

const getPhoneNumberConfigurationById = async (id: string) => {
    const { data } = await axios.get(`/phoneNumberConfigurations/${id}`);
    return PhoneNumberConfiguration.parse(data);
};

const getPhoneNumberConfigurationsByChannelId = async (channelId: string) => {
    try {
        const { data } = await axios.get(`/phoneNumberConfigurations/channel/${channelId}`);
        return PhoneNumberConfiguration.parse(data);
    } catch (error) {
        logger.log(error);
        return [];
    }
};

const createPhoneNumberConfiguration = async (phoneNumberConfiguration: IPartialPhoneNumberConfiguration) => {
    const parsed = PartialPhoneNumberConfiguration.parse(phoneNumberConfiguration);
    const { data } = await axios.post('/phoneNumberConfigurations', parsed);
    return PhoneNumberConfiguration.parse(data);
};

const updatePhoneNumberConfiguration = async (
    id: string,
    phoneNumberConfiguration: IPartialPhoneNumberConfiguration,
) => {
    const parsed = PartialPhoneNumberConfiguration.parse(phoneNumberConfiguration);
    const { data } = await axios.put(`/phoneNumberConfigurations/${id}`, parsed);
    return PhoneNumberConfiguration.parse(data);
};

export default {
    getPhoneNumberConfigurationById,
    getPhoneNumberConfigurationsByChannelId,
    createPhoneNumberConfiguration,
    updatePhoneNumberConfiguration,
};

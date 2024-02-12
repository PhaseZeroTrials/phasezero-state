export const STUDY_FORM_ID = 'fcc82849-911c-4b5f-aa5c-bc30fcfa2c35';
export const SURVEY_FORM_ID = '6b2f3504-deba-420d-bf04-10ff7e6f650b';

export enum ThankYouPageType {
    ShowThankYouPage = 'd543552c-f031-4610-924c-49453398a49c',
    RedirectUrl = 'f4d4476e-ed3f-4f3f-91d6-a6eb428dd42a',
    LoadForm = '7eab014c-c102-4f52-8d51-8770792c8cf6',
}

export enum FormRenderVersion {
    V0 = 'a2014579-5cca-4129-9f3d-43720ed12647',
    V1 = '5a31dff5-3b5d-4f0e-88b8-7cb562c167ab',
}

// Define an enum for FormPurposeType values if it's not already defined
export enum FormPurposeTypeEnum {
    Internal = 'Internal',
    Intake = 'Intake',
    FollowUp = 'FollowUp',
    CustomData = 'CustomData',
}

// Define the FormPurposeType type if it's not already defined
export type FormPurposeType = {
    Id: Guid;
    Value: FormPurposeTypeEnum;
};

// Define the Guid type if it's not already defined
// This is just a placeholder, replace it with your actual Guid type definition
export type Guid = string;

// Define the static readonly members
export const FormPurposeTypes = {
    Internal: {
        Id: 'a659263d-9a79-47c7-80c5-b45f3f08c92e' as Guid,
        Value: FormPurposeTypeEnum.Internal,
    },
    Intake: {
        Id: '84d57ab9-fd3d-4d48-88e5-1a463fc2191c' as Guid,
        Value: FormPurposeTypeEnum.Intake,
    },
    FollowUp: {
        Id: 'c1468f71-c422-45e7-92f9-485e3ba2f09c' as Guid,
        Value: FormPurposeTypeEnum.FollowUp,
    },
    CustomData: {
        Id: '2352792d-cf94-471f-ba0e-c9ea8ae5b048' as Guid,
        Value: FormPurposeTypeEnum.CustomData,
    },
};

// Export the entire object

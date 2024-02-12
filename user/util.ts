import userService from './api';

const OWNER_ID = '3c52f75e-33ab-4a0e-8815-c1f6c3c01034';
const CREATOR_ID = 'bb9dc99f-3eb2-47fb-9ff7-f50f9e83adfc';
const ADMIN = [OWNER_ID, CREATOR_ID];

const getIsAdmin = (username: string) => {
    // Need to make the call to the server to get the user since this is a client-side check
    // We can't use the data stored in local storage since the user could change it and gain permissions they
    // wouldn't otherwise have
    return userService
        .getUserByEmail(username as string)
        .then((user) => {
            const userRoleId = user.userRoleId ? user.userRoleId : '';
            return ADMIN.includes(<string>userRoleId);
        })
        .catch(() => {
            return false;
        });
};

export default {
    getIsAdmin,
};

import { loadAmplify } from '@pz/amplify';

async function signInUser({ email, password }): Promise<any> {
    return await loadAmplify().then(async (module) => {
        return await module.Auth.signIn(email, password);
    });
}

async function getJwtToken(): Promise<any> {
    return await loadAmplify().then(async (module) => {
        return await module.Auth.currentSession().then((data) => data.getIdToken().getJwtToken());
    });
}

async function forgotPassword(email) {
    return await loadAmplify().then(async (module) => {
        return await module.Auth.forgotPassword(email);
    });
}

async function confirmSignup({ email, verificationCode }) {
    return await loadAmplify().then(async (module) => {
        return await module.Auth.confirmSignUp(email, verificationCode);
    });
}

async function confirmForgotPassword({ email, verificationCode, password }) {
    return await loadAmplify().then(async (module) => {
        return await module.Auth.forgotPasswordSubmit(email, verificationCode, password);
    });
}

async function completeNewPassword(user: any, password: string) {
    return await loadAmplify().then(async (module) => {
        return await module.Auth.completeNewPassword(user, password);
    });
}

async function changePassword({ password, newPassword, confirmNewPassword }) {
    if (newPassword !== confirmNewPassword || newPassword === null) {
        return Promise.reject({ detail: 'Passwords do not match' });
    }

    await loadAmplify().then(async (module) => {
        return await module.Auth.currentAuthenticatedUser()
            .then(async (user) => {
                return await module.Auth.changePassword(user, password, newPassword);
            })
            .catch((error) => {
                console.error(error);
                return { detail: 'Error changing password' };
            });
    });

    return null;
}

export default {
    signInUser,
    getJwtToken,
    forgotPassword,
    confirmSignup,
    confirmForgotPassword,
    completeNewPassword,
    changePassword,
};

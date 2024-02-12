import { Action, Thunk, action, thunk } from 'easy-peasy';
import jwt_decode from 'jwt-decode';
import { CurrentUser, ICurrentUser, userService } from '../user';
import { Injections } from '../injections';
import { authConfig } from '../../configs';
import { UserAccountStatusEnum } from '@pz/state/user/model';

export interface LoginSlice {
    // State
    authenticated: boolean;
    currentUser: CurrentUser | null;
    loginFailed: boolean;
    passwordReset: boolean;
    newPassword: boolean;
    forgotPassword: boolean;
    reVerifyEmail: boolean;
    requestVerificationCode: boolean;
    loginLoading: boolean;
    initialUsername: string;
    initialPassword: string;
    initialFirstName: string;
    initialLastName: string;
    infoMessage: string;
    errorMessage: string;
    tenantId: string;
    isSignUp: boolean;

    // Reducers
    setCurrentUser: Action<LoginSlice, ICurrentUser | null>;
    authenticateUser: Action<LoginSlice>;
    loggingIn: Action<LoginSlice>;
    changingPassword: Action<LoginSlice>;
    newPasswordRequired: Action<LoginSlice, any>;
    resetRequired: Action<LoginSlice, any>;
    verifyEmail: Action<LoginSlice, any>;
    requestForgotPassword: Action<LoginSlice, any>;
    authenticationError: Action<LoginSlice, any>;
    verificationError: Action<LoginSlice, any>;
    logout: Action<LoginSlice>;
    setUsername: Action<LoginSlice, string>;
    changingTenantId: Action<LoginSlice, string>;
    resetState: Action<LoginSlice>;

    // Actions
    signInUser: Thunk<LoginSlice, { email: string; password: string }, Injections>;
    changePassword: Thunk<LoginSlice, any, Injections>;
    completeNewPassword: Thunk<LoginSlice, any, Injections>;
    confirmUser: Thunk<LoginSlice, any, Injections>;
    confirmForgotPassword: Thunk<LoginSlice, any, Injections>;
    changeTenant: Thunk<LoginSlice, string, Injections>;
    changeCurrentUser: Thunk<LoginSlice, string, Injections>;
    completeAuthentication: Thunk<LoginSlice, string, Injections>;
}

const loginSlice: LoginSlice = {
    // States

    authenticated: true,
    currentUser: null,
    loginFailed: false,
    reVerifyEmail: false,
    passwordReset: false,
    newPassword: false,
    forgotPassword: false,
    requestVerificationCode: false,
    loginLoading: false,
    initialUsername: '',
    initialPassword: '',
    initialFirstName: '',
    initialLastName: '',
    infoMessage: '',
    errorMessage: '',
    tenantId: '',
    isSignUp: false,

    setCurrentUser: action((state, currentUser) => {
        state.currentUser = currentUser;
    }),

    authenticateUser: action((state) => {
        state.authenticated = true;
        state.loginFailed = false;
        state.passwordReset = false;
        state.newPassword = false;
        state.forgotPassword = false;
        state.reVerifyEmail = false;
        state.requestVerificationCode = false;
        state.loginLoading = false;
        state.isSignUp = false;
    }),

    loggingIn: action((state) => {
        state.authenticated = false;
        state.loginFailed = false;
        state.passwordReset = false;
        state.newPassword = false;
        state.reVerifyEmail = false;
        state.requestVerificationCode = false;
        state.loginLoading = true;
        state.isSignUp = false;
    }),

    changingPassword: action((state) => {
        state.authenticated = false;
        state.loginFailed = false;
        state.passwordReset = true;
        state.newPassword = false;
        state.reVerifyEmail = false;
        state.requestVerificationCode = false;
        state.loginLoading = true;
        state.isSignUp = false;
    }),

    resetState: action((state) => {
        state.authenticated = false;
        state.loginFailed = false;
        state.passwordReset = false;
        state.newPassword = false;
        state.forgotPassword = false;
        state.reVerifyEmail = false;
        state.requestVerificationCode = false;
        state.loginLoading = false;
        state.isSignUp = false;
    }),

    newPasswordRequired: action((state, payload) => {
        state.authenticated = false;
        state.loginLoading = false;
        state.loginFailed = false;
        state.passwordReset = true;
        state.newPassword = true;
        state.forgotPassword = false;
        state.reVerifyEmail = false;
        state.requestVerificationCode = false;
        state.initialUsername = payload.email;
        state.initialPassword = payload.password;
        state.infoMessage = 'A new password is required';
        state.isSignUp = false;
    }),

    resetRequired: action((state, payload) => {
        state.authenticated = false;
        state.loginLoading = false;
        state.loginFailed = false;
        state.passwordReset = false;
        state.newPassword = false;
        state.forgotPassword = true;
        state.reVerifyEmail = false;
        state.requestVerificationCode = false;
        state.initialUsername = payload.email;
        state.initialPassword = payload.password;
        state.infoMessage =
            payload.infoMessage || 'A password reset is required. A verification code has been sent to your email.';
        state.isSignUp = false;
    }),

    requestForgotPassword: action((state, payload) => {
        state.authenticated = false;
        state.loginLoading = false;
        state.loginFailed = false;
        state.passwordReset = false;
        state.newPassword = false;
        state.forgotPassword = false;
        state.requestVerificationCode = true;
        state.reVerifyEmail = false;
        state.infoMessage = payload.infoMessage || 'Please enter your email address to request a verification code';
        state.isSignUp = false;
    }),

    verifyEmail: action((state, payload) => {
        state.authenticated = false;
        state.loginLoading = false;
        state.loginFailed = false;
        state.passwordReset = false;
        state.newPassword = false;
        state.reVerifyEmail = true;
        state.isSignUp = false;
        state.initialUsername = payload.email;
        state.initialPassword = payload.password;
        state.infoMessage = payload.infoMessage
            ? payload.infoMessage
            : 'Please check your email for a verification code';
    }),

    authenticationError: action((state, errorMessage) => {
        state.errorMessage = errorMessage;
        state.authenticated = false;
        state.loginFailed = true;
        state.loginLoading = false;
        state.isSignUp = false;
    }),

    verificationError: action((state, errorMessage) => {
        state.errorMessage = errorMessage;
        state.authenticated = false;
        state.loginFailed = true;
        state.loginLoading = false;
        state.isSignUp = false;
        state.reVerifyEmail = true;
    }),

    setUsername: action((state, payload) => {
        state.initialUsername = payload;
    }),

    logout: action((state) => {
        return { ...state, authenticated: false, currentUser: null };
    }),

    changingTenantId: action((state, payload) => {
        state.tenantId = payload;
    }),

    changeCurrentUser: thunk(async (actions, email, { injections }) => {
        const { userService } = injections;

        const user = await userService.getUserByEmail(email);
        const currentUser = new CurrentUser({ user: user });
        userService.setCurrentUser(currentUser);
        actions.setCurrentUser(currentUser);
    }),

    signInUser: thunk(async (actions, payload, { injections }) => {
        const { loginService, provisioningService } = injections;

        actions.loggingIn();
        if (authConfig.useBackdoor()) {
            const email = import.meta.env.VITE_DEV_USERNAME || '';
            actions.setUsername(email);

            // get the default tenant Id from the backend, now that we have a token
            const defaultTenantResponse = await provisioningService.getLastAccessedTenant();

            if (defaultTenantResponse === null) {
                actions.authenticationError(
                    'You do not appear to have access to this application. Please contact your administrator.',
                );
                actions.resetState();
                return;
            }

            const tenantId = defaultTenantResponse.data.tenantId;

            // switch to the tenant
            await provisioningService
                .switchTenant(tenantId)
                .then((response) => {
                    // don't change the tenantId state var here, it'll cause the page to reload
                    const tenantId = response.headers['x-tenant-id'];
                    localStorage.setItem('tenantId', tenantId);
                })
                .catch((reason) => {
                    const errorMessage = reason.response.data['detail']
                        ? reason.response.data['detail']
                        : 'Something went wrong, unable to change tenant';
                    actions.authenticationError(errorMessage);
                });

            // Load current user and set it
            await actions.changeCurrentUser(email);

            // authenticate user
            actions.authenticateUser();
        } else {
            await loginService
                .signInUser(payload)
                .then((response) => {
                    if (response?.challengeName === 'NEW_PASSWORD_REQUIRED') {
                        throw { code: 'NewPasswordRequiredException' };
                    }
                })
                .then(async () => {
                    await actions.completeAuthentication(payload.email);
                })
                .catch(async (reason) => {
                    switch (reason.code) {
                        // Password reset required
                        case 'PasswordResetRequiredException':
                            await loginService.forgotPassword(payload.email);
                            actions.resetRequired(payload);
                            break;
                        // User must confirm email
                        case 'UserNotConfirmedException':
                            actions.verifyEmail({
                                ...payload,
                                infoMessage:
                                    'Your email address requires confirmation. Please check your email for a verification code.',
                            });
                            break;
                        case 'NewPasswordRequiredException':
                            actions.newPasswordRequired(payload);
                            break;
                        default:
                            // If request is bad show an error to the user
                            const msgText = reason.message || 'Error logging in';
                            actions.authenticationError(msgText);
                            break;
                    }
                });
        }
    }),

    completeAuthentication: thunk(async (actions, email, { injections }) => {
        const { loginService, provisioningService } = injections;

        await loginService
            .getJwtToken()
            .then(async (jwtToken) => {
                const jwt = jwt_decode(jwtToken);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const email = jwt.email;
                actions.setUsername(email);

                // get the default tenant Id from the backend, now that we have a token
                const defaultTenantResponse = await provisioningService.getLastAccessedTenant();

                if (defaultTenantResponse === null) {
                    actions.authenticationError(
                        'You do not appear to have access to this application. Please contact your administrator.',
                    );
                    actions.resetState();
                    return;
                }

                const tenantId = defaultTenantResponse.data.tenantId;

                // switch to the tenant
                await provisioningService
                    .switchTenant(tenantId)
                    .then((response) => {
                        // don't change the tenantId state var here, it'll cause the page to reload
                        const tenantId = response.headers['x-tenant-id'];
                        localStorage.setItem('tenantId', tenantId);
                    })
                    .catch((reason) => {
                        const errorMessage = reason.response.data['detail']
                            ? reason.response.data['detail']
                            : 'Something went wrong, unable to change tenant';
                        actions.authenticationError(errorMessage);
                    });

                // Load current user and set it
                await actions.changeCurrentUser(email);

                // Update user status and last logged in. Use try/catch to still let user login in case update call fails
                try {
                    const user = await userService.getUserByEmail(email);
                    if (user) {
                        const newAccountStatusId = UserAccountStatusEnum.Active;
                        const { userRole, userType, ...userWithoutRoleAndType } = user;
                        const updatedUser = {
                            ...userWithoutRoleAndType,
                            lastLoggedIn: new Date().toISOString(),
                            ...(newAccountStatusId !== user.userAccountStatusId && {
                                userAccountStatusId: newAccountStatusId,
                            }),
                        };

                        await userService.updateUser(updatedUser);
                    }
                } catch (error) {
                    console.error('Failed to update user, but continuing with authentication:', error);
                }

                // authenticate user
                actions.authenticateUser();
            })
            .catch(async (reason) => {
                // If request is bad show an error to the user
                const msgText = reason.message || 'Error logging in';
                actions.authenticationError(msgText);
            });
    }),

    confirmForgotPassword: thunk(async (actions, payload, { injections }) => {
        actions.loggingIn();
        const { loginService } = injections;

        await loginService
            .confirmForgotPassword(payload)
            .then(async () => {
                await actions.signInUser(payload);
            })
            .catch((error) => {
                if (error.code === 'CodeMismatchException') {
                    actions.authenticationError(
                        error?.message || 'Verification code mismatch. Please check your code and try again.',
                    );
                    actions.resetRequired(payload);
                } else {
                    actions.authenticationError(error?.message || 'There was a problem confirming your new password');
                    actions.resetState();
                }
            });
    }),

    confirmUser: thunk(async (actions, payload, { injections }) => {
        actions.loggingIn();
        const { loginService } = injections;
        await loginService
            .confirmSignup(payload)
            .then(async () => {
                await actions.signInUser(payload);
            })
            .catch((error) => {
                switch (error.code) {
                    case 'CodeMismatchException':
                        actions.verificationError(
                            error?.message || 'Verification code mismatch. Please check your code and try again.',
                        );
                        actions.verifyEmail({ ...payload, infoMessage: '' });
                        break;
                    default:
                        actions.verificationError(error?.message || 'There was a problem verifying your account');
                        actions.resetState();
                        break;
                }
            });
    }),

    changePassword: thunk(async (actions, payload, { injections }) => {
        actions.loggingIn();
        const { loginService } = injections;
        await loginService
            .changePassword(payload)
            .then(() => {
                actions.authenticateUser();
            })
            .catch((reason) => {
                // If request is bad show an error to the user
                const msgText = reason?.detail || 'Error changing password';
                actions.authenticationError(msgText);
            });
    }),

    completeNewPassword: thunk(async (actions, payload, { injections }) => {
        actions.loggingIn();
        const { loginService } = injections;
        await loginService
            .signInUser(payload)
            .then(async (response) => {
                if (response?.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    await loginService.completeNewPassword(response, payload.newPassword);
                }
            })
            .then(async () => {
                await actions.completeAuthentication(payload.email);
            })
            .catch((reason) => {
                // If request is bad show an error to the user
                const msgText = reason?.detail || 'Error changing password';
                actions.authenticationError(msgText);
            });
    }),

    changeTenant: thunk(async (actions, tenantId, { injections }) => {
        const { provisioningService } = injections;

        const currentlySelectedTenantId = localStorage.getItem('tenantId');

        // Return if the user is trying to change to the same tenant
        if (currentlySelectedTenantId === tenantId) {
            return;
        }

        actions.loggingIn();
        await provisioningService
            .switchTenant(tenantId)
            .then((response) => {
                const tenantId = response.headers['x-tenant-id'];
                localStorage.setItem('tenantId', tenantId);
                actions.changingTenantId(tenantId);
            })
            .catch((reason) => {
                const errorMessage = reason.response.data['detail']
                    ? reason.response.data['detail']
                    : 'Something went wrong, unable to change Workspace';
                actions.authenticationError(errorMessage);
            });
    }),
};

export default loginSlice;

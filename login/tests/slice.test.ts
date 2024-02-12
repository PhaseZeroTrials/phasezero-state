import { createStore } from 'easy-peasy';
import jwt_encode from 'jwt-encode';
import { utc } from 'moment';
import loginSlice from '../slice';

beforeEach(() => localStorage.clear());

describe('loginSlice', () => {
    const emailPassword = { email: 'joe@email.com', password: '1234' };

    const jwtToken = jwt_encode({ email: 'joe@email.com' }, 'secret');

    const lastAccessedTenantResponse = {
        data: {
            tenantId: '1234',
            tenantName: 'foo tenant',
            lastLoggedInAt: utc(),
        },
        response: 200,
    };

    const tenantId = '1234';

    const switchTenantResponse = {
        headers: {
            'x-tenant-id': '1234',
        },
        response: 200,
    };

    const getUserByEmailResponse = {
        firstName: 'Joe',
        lastName: 'User',
        email: 'joe@email.com',
    };

    describe('user sign in', () => {
        test('it signs in successfully', async () => {
            // Arrange
            const mockLoginService = {
                signInUser: jest.fn(() => Promise.resolve()),
                getJwtToken: jest.fn(() => Promise.resolve(jwtToken)),
            };

            const mockProvisioningService = {
                getLastAccessedTenant: jest.fn().mockImplementation(() => Promise.resolve(lastAccessedTenantResponse)),
                switchTenant: jest.fn().mockImplementation(() => Promise.resolve(switchTenantResponse)),
            };

            const mockUserService = {
                getUserByEmail: jest.fn().mockImplementation(() => Promise.resolve(getUserByEmailResponse)),
                setCurrentUser: jest.fn().mockImplementation(() => Promise.resolve()),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                    provisioningService: mockProvisioningService,
                    userService: mockUserService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().signInUser(emailPassword);

            // Assert
            expect(mockLoginService.signInUser).toHaveBeenCalledWith({
                email: emailPassword.email,
                password: emailPassword.password,
            });
            expect(mockProvisioningService.getLastAccessedTenant).toHaveBeenCalled();
            expect(mockProvisioningService.switchTenant).toHaveBeenCalledWith('1234');
            expect(localStorage.getItem('tenantId')).toEqual('1234');
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.signInUser(start)', payload: emailPassword },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@thunk.completeAuthentication(start)', payload: emailPassword.email },
                { type: '@action.setUsername', payload: emailPassword.email },
                { type: '@thunk.changeCurrentUser(start)', payload: emailPassword.email },
                { type: '@action.setCurrentUser', payload: { user: getUserByEmailResponse } },
                { type: '@thunk.changeCurrentUser(success)', payload: emailPassword.email, result: undefined },
                { type: '@action.authenticateUser', payload: undefined },
                { type: '@thunk.completeAuthentication(success)', payload: emailPassword.email, result: undefined },
                { type: '@thunk.signInUser(success)', payload: emailPassword, result: undefined },
            ]);
        });

        test('it new password required', async () => {
            // Arrange
            const signInResponse = { challengeName: 'NEW_PASSWORD_REQUIRED' };

            const mockLoginService = {
                signInUser: jest.fn(() => Promise.resolve(signInResponse)),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().signInUser(emailPassword);

            // Assert
            expect(mockLoginService.signInUser).toHaveBeenCalledWith({
                email: emailPassword.email,
                password: emailPassword.password,
            });
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.signInUser(start)', payload: emailPassword },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.newPasswordRequired', payload: emailPassword },
                { type: '@thunk.signInUser(success)', payload: emailPassword, result: undefined },
            ]);
        });
        test('it password reset required', async () => {
            // Arrange
            const signInResponse = { code: 'PasswordResetRequiredException' };

            const mockLoginService = {
                signInUser: jest.fn(() => Promise.reject(signInResponse)),
                forgotPassword: jest.fn(() => Promise.resolve()),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().signInUser(emailPassword);

            // Assert
            expect(mockLoginService.signInUser).toHaveBeenCalledWith({
                email: emailPassword.email,
                password: emailPassword.password,
            });
            expect(mockLoginService.forgotPassword).toHaveBeenCalledWith(emailPassword.email);
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.signInUser(start)', payload: emailPassword },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.resetRequired', payload: emailPassword },
                { type: '@thunk.signInUser(success)', payload: emailPassword, result: undefined },
            ]);
        });

        test('it user is not confirmed', async () => {
            // Arrange
            const signInResponse = { code: 'UserNotConfirmedException' };

            const mockLoginService = {
                signInUser: jest.fn(() => Promise.reject(signInResponse)),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().signInUser(emailPassword);

            // Assert
            expect(mockLoginService.signInUser).toHaveBeenCalledWith({
                email: emailPassword.email,
                password: emailPassword.password,
            });
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.signInUser(start)', payload: emailPassword },
                { type: '@action.loggingIn', payload: undefined },
                {
                    type: '@action.verifyEmail',
                    payload: {
                        ...emailPassword,
                        infoMessage:
                            'Your email address requires confirmation. Please check your email for a verification code.',
                    },
                },
                { type: '@thunk.signInUser(success)', payload: emailPassword, result: undefined },
            ]);
        });

        test('it fails to sign in with reason', async () => {
            const mockLoginService = {
                signInUser: jest.fn(() => Promise.reject({ message: "We just don't like you." })),
            };

            const store = createStore(loginSlice, {
                injections: { loginService: mockLoginService },
                mockActions: true,
            });

            await store.getActions().signInUser(emailPassword);

            expect(mockLoginService.signInUser).toHaveBeenCalledWith({
                email: emailPassword.email,
                password: emailPassword.password,
            });
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.signInUser(start)', payload: emailPassword },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.authenticationError', payload: "We just don't like you." },
                { type: '@thunk.signInUser(success)', payload: emailPassword, result: undefined },
            ]);
        });

        test('it fails to sign in for other reason', async () => {
            const mockLoginService = {
                signInUser: jest.fn(() => Promise.reject('Some other error')),
            };

            const store = createStore(loginSlice, {
                injections: { loginService: mockLoginService },
                mockActions: true,
            });

            await store.getActions().signInUser(emailPassword);

            expect(mockLoginService.signInUser).toHaveBeenCalledWith({
                email: emailPassword.email,
                password: emailPassword.password,
            });
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.signInUser(start)', payload: emailPassword },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.authenticationError', payload: 'Error logging in' },
                { type: '@thunk.signInUser(success)', payload: emailPassword, result: undefined },
            ]);
        });
    });

    describe('confirmation and verification', () => {
        const confirmUser = { email: 'joe@email.com', password: '1234', verificationCode: 'supersecretcode' };

        test('it confirms user', async () => {
            // Arrange
            const mockLoginService = {
                confirmSignup: jest.fn(() => Promise.resolve()),
                signInUser: jest.fn(() => Promise.resolve()),
                getJwtToken: jest.fn(() => Promise.resolve(jwtToken)),
            };

            const mockProvisioningService = {
                getLastAccessedTenant: jest.fn().mockImplementation(() => Promise.resolve(lastAccessedTenantResponse)),
                switchTenant: jest.fn().mockImplementation(() => Promise.resolve(switchTenantResponse)),
            };

            const mockUserService = {
                getUserByEmail: jest.fn().mockImplementation(() => Promise.resolve(getUserByEmailResponse)),
                setCurrentUser: jest.fn().mockImplementation(() => Promise.resolve()),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                    provisioningService: mockProvisioningService,
                    userService: mockUserService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().confirmUser(confirmUser);

            // Assert
            expect(mockLoginService.confirmSignup).toHaveBeenCalledWith({
                ...confirmUser,
            });
            expect(mockLoginService.signInUser).toHaveBeenCalledWith({
                ...confirmUser,
            });
            expect(mockProvisioningService.getLastAccessedTenant).toHaveBeenCalled();
            expect(mockProvisioningService.switchTenant).toHaveBeenCalledWith('1234');
            expect(localStorage.getItem('tenantId')).toEqual('1234');
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.confirmUser(start)', payload: confirmUser },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@thunk.signInUser(start)', payload: confirmUser },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@thunk.completeAuthentication(start)', payload: emailPassword.email },
                { type: '@action.setUsername', payload: emailPassword.email },
                { type: '@thunk.changeCurrentUser(start)', payload: emailPassword.email },
                { type: '@action.setCurrentUser', payload: { user: getUserByEmailResponse } },
                { type: '@thunk.changeCurrentUser(success)', payload: emailPassword.email, result: undefined },
                { type: '@action.authenticateUser', payload: undefined },
                { type: '@thunk.completeAuthentication(success)', payload: emailPassword.email, result: undefined },
                { type: '@thunk.signInUser(success)', payload: confirmUser, result: undefined },
                { type: '@thunk.confirmUser(success)', payload: confirmUser, result: undefined },
            ]);
        });

        it('it verification code mismatch', async () => {
            // Arrange
            const confirmSignupResponse = { code: 'CodeMismatchException', message: 'Code mismatch' };

            const mockLoginService = {
                confirmSignup: jest.fn(() => Promise.reject(confirmSignupResponse)),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().confirmUser(confirmUser);

            // Assert
            expect(mockLoginService.confirmSignup).toHaveBeenCalledWith({
                ...confirmUser,
            });
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.confirmUser(start)', payload: confirmUser },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.verificationError', payload: 'Code mismatch' },
                { type: '@action.verifyEmail', payload: { ...confirmUser, infoMessage: '' } },
                { type: '@thunk.confirmUser(success)', payload: confirmUser, result: undefined },
            ]);
        });

        test('it fails to confirm user for other reason', async () => {
            // Arrange
            const confirmSignupResponse = 'Some other error';

            const mockLoginService = {
                confirmSignup: jest.fn(() => Promise.reject(confirmSignupResponse)),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().confirmUser(confirmUser);

            // Assert
            expect(mockLoginService.confirmSignup).toHaveBeenCalledWith({
                ...confirmUser,
            });
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.confirmUser(start)', payload: confirmUser },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.verificationError', payload: 'There was a problem verifying your account' },
                { type: '@action.resetState', payload: undefined },
                { type: '@thunk.confirmUser(success)', payload: confirmUser, result: undefined },
            ]);
        });
    });

    describe('forgot password', () => {
        const confirmUser = { email: 'joe@email.com', password: '1234', verificationCode: 'supersecretcode' };

        test('it confirm forgotten password', async () => {
            // Arrange
            const mockLoginService = {
                confirmForgotPassword: jest.fn(() => Promise.resolve()),
                signInUser: jest.fn(() => Promise.resolve()),
                getJwtToken: jest.fn(() => Promise.resolve(jwtToken)),
            };

            const mockProvisioningService = {
                getLastAccessedTenant: jest.fn().mockImplementation(() => Promise.resolve(lastAccessedTenantResponse)),
                switchTenant: jest.fn().mockImplementation(() => Promise.resolve(switchTenantResponse)),
            };

            const mockUserService = {
                getUserByEmail: jest.fn().mockImplementation(() => Promise.resolve(getUserByEmailResponse)),
                setCurrentUser: jest.fn().mockImplementation(() => Promise.resolve()),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                    provisioningService: mockProvisioningService,
                    userService: mockUserService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().confirmForgotPassword(confirmUser);

            // Assert
            expect(mockLoginService.confirmForgotPassword).toHaveBeenCalledWith({
                ...confirmUser,
            });
            expect(mockLoginService.signInUser).toHaveBeenCalledWith({
                ...confirmUser,
            });
            expect(mockProvisioningService.getLastAccessedTenant).toHaveBeenCalled();
            expect(mockProvisioningService.switchTenant).toHaveBeenCalledWith('1234');
            expect(localStorage.getItem('tenantId')).toEqual('1234');
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.confirmForgotPassword(start)', payload: confirmUser },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@thunk.signInUser(start)', payload: confirmUser },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@thunk.completeAuthentication(start)', payload: emailPassword.email },
                { type: '@action.setUsername', payload: emailPassword.email },
                { type: '@thunk.changeCurrentUser(start)', payload: emailPassword.email },
                { type: '@action.setCurrentUser', payload: { user: getUserByEmailResponse } },
                { type: '@thunk.changeCurrentUser(success)', payload: emailPassword.email, result: undefined },
                { type: '@action.authenticateUser', payload: undefined },
                { type: '@thunk.completeAuthentication(success)', payload: emailPassword.email, result: undefined },
                { type: '@thunk.signInUser(success)', payload: confirmUser, result: undefined },
                { type: '@thunk.confirmForgotPassword(success)', payload: confirmUser, result: undefined },
            ]);
        });

        it('it verification code mismatch', async () => {
            // Arrange
            const confirmForgotPasswordResponse = { code: 'CodeMismatchException', message: 'Code mismatch' };

            const mockLoginService = {
                confirmForgotPassword: jest.fn(() => Promise.reject(confirmForgotPasswordResponse)),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().confirmForgotPassword(confirmUser);

            // Assert
            expect(mockLoginService.confirmForgotPassword).toHaveBeenCalledWith({
                ...confirmUser,
            });
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.confirmForgotPassword(start)', payload: confirmUser },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.authenticationError', payload: 'Code mismatch' },
                { type: '@action.resetRequired', payload: confirmUser },
                { type: '@thunk.confirmForgotPassword(success)', payload: confirmUser, result: undefined },
            ]);
        });

        test('it fails to confirm user for other reason', async () => {
            // Arrange
            const confirmForgotPasswordResponse = 'Some other error';

            const mockLoginService = {
                confirmForgotPassword: jest.fn(() => Promise.reject(confirmForgotPasswordResponse)),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().confirmForgotPassword(confirmUser);

            // Assert
            expect(mockLoginService.confirmForgotPassword).toHaveBeenCalledWith({
                ...confirmUser,
            });
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.confirmForgotPassword(start)', payload: confirmUser },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.authenticationError', payload: 'There was a problem confirming your new password' },
                { type: '@action.resetState', payload: undefined },
                { type: '@thunk.confirmForgotPassword(success)', payload: confirmUser, result: undefined },
            ]);
        });
    });

    describe('new password required', () => {
        test('it completes new password', async () => {
            // Arrange
            const payload = { ...emailPassword, newPassword: '5678', confirmNewPassword: '5678' };

            const signInResponse = { challengeName: 'NEW_PASSWORD_REQUIRED' };

            const mockLoginService = {
                signInUser: jest
                    .fn()
                    .mockReturnValueOnce(Promise.resolve(signInResponse))
                    .mockReturnValueOnce(Promise.resolve()),
                completeNewPassword: jest.fn(() => Promise.resolve()),
                getJwtToken: jest.fn(() => Promise.resolve(jwtToken)),
            };

            const mockProvisioningService = {
                getLastAccessedTenant: jest.fn().mockImplementation(() => Promise.resolve(lastAccessedTenantResponse)),
                switchTenant: jest.fn().mockImplementation(() => Promise.resolve(switchTenantResponse)),
            };

            const mockUserService = {
                getUserByEmail: jest.fn().mockImplementation(() => Promise.resolve(getUserByEmailResponse)),
                setCurrentUser: jest.fn().mockImplementation(() => Promise.resolve()),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                    provisioningService: mockProvisioningService,
                    userService: mockUserService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().completeNewPassword(payload);

            // Assert
            expect(mockLoginService.completeNewPassword).toHaveBeenCalledWith(signInResponse, payload.newPassword);
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.completeNewPassword(start)', payload },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@thunk.completeAuthentication(start)', payload: emailPassword.email },
                { type: '@action.setUsername', payload: emailPassword.email },
                { type: '@thunk.changeCurrentUser(start)', payload: emailPassword.email },
                { type: '@action.setCurrentUser', payload: { user: getUserByEmailResponse } },
                { type: '@thunk.changeCurrentUser(success)', payload: emailPassword.email, result: undefined },
                { type: '@action.authenticateUser', payload: undefined },
                { type: '@thunk.completeAuthentication(success)', payload: emailPassword.email, result: undefined },
                { type: '@thunk.completeNewPassword(success)', payload, result: undefined },
            ]);
        });

        test('it flows through normal auth process when no new password is required', async () => {
            // Arrange
            const payload = { ...emailPassword, newPassword: '5678', confirmNewPassword: '5678' };

            const mockLoginService = {
                signInUser: jest.fn(() => Promise.resolve()),
                completeNewPassword: jest.fn(() => Promise.resolve()),
                getJwtToken: jest.fn(() => Promise.resolve(jwtToken)),
            };

            const mockProvisioningService = {
                getLastAccessedTenant: jest.fn().mockImplementation(() => Promise.resolve(lastAccessedTenantResponse)),
                switchTenant: jest.fn().mockImplementation(() => Promise.resolve(switchTenantResponse)),
            };

            const mockUserService = {
                getUserByEmail: jest.fn().mockImplementation(() => Promise.resolve(getUserByEmailResponse)),
                setCurrentUser: jest.fn().mockImplementation(() => Promise.resolve()),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                    provisioningService: mockProvisioningService,
                    userService: mockUserService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().completeNewPassword(payload);

            // Assert
            expect(mockLoginService.completeNewPassword).not.toHaveBeenCalled();
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.completeNewPassword(start)', payload },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@thunk.completeAuthentication(start)', payload: emailPassword.email },
                { type: '@action.setUsername', payload: emailPassword.email },
                { type: '@thunk.changeCurrentUser(start)', payload: emailPassword.email },
                { type: '@action.setCurrentUser', payload: { user: getUserByEmailResponse } },
                { type: '@thunk.changeCurrentUser(success)', payload: emailPassword.email, result: undefined },
                { type: '@action.authenticateUser', payload: undefined },
                { type: '@thunk.completeAuthentication(success)', payload: emailPassword.email, result: undefined },
                { type: '@thunk.completeNewPassword(success)', payload, result: undefined },
            ]);
        });

        test('it fails to complete user password', async () => {
            // Arrange
            const payload = { ...emailPassword, newPassword: '5678', confirmNewPassword: '5678' };

            const signInResponse = { challengeName: 'NEW_PASSWORD_REQUIRED' };

            const mockLoginService = {
                signInUser: jest
                    .fn()
                    .mockReturnValueOnce(Promise.resolve(signInResponse))
                    .mockReturnValueOnce(Promise.resolve()),
                completeNewPassword: jest.fn(() => Promise.reject({ detail: "We really, really, don't like you" })),
            };

            const store = createStore(loginSlice, {
                injections: {
                    loginService: mockLoginService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().completeNewPassword(payload);

            // Assert
            expect(mockLoginService.completeNewPassword).toHaveBeenCalledWith(signInResponse, payload.newPassword);
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.completeNewPassword(start)', payload },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.authenticationError', payload: "We really, really, don't like you" },
                { type: '@thunk.completeNewPassword(success)', payload, result: undefined },
            ]);
        });
    });

    describe('change password', () => {
        test('it changes user password', async () => {
            // Arrange
            const payload = { ...emailPassword, newPassword: '5678', confirmNewPassword: '5678' };

            const mockLoginService = {
                changePassword: jest.fn(() => Promise.resolve()),
            };

            const store = createStore(loginSlice, {
                injections: { loginService: mockLoginService },
                mockActions: true,
            });

            // Act
            await store.getActions().changePassword(payload);

            // Assert
            expect(mockLoginService.changePassword).toHaveBeenCalledWith(payload);
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.changePassword(start)', payload },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.authenticateUser', payload: undefined },
                { type: '@thunk.changePassword(success)', payload, result: undefined },
            ]);
        });

        test('it fails to change user password', async () => {
            // Arrange
            const payload = { ...emailPassword, newPassword: '5678', confirmNewPassword: '5678' };

            const mockLoginService = {
                changePassword: jest.fn(() => Promise.reject()),
            };

            const store = createStore(loginSlice, {
                injections: { loginService: mockLoginService },
                mockActions: true,
            });

            // Act
            await store.getActions().changePassword(payload);

            // Assert
            expect(mockLoginService.changePassword).toHaveBeenCalledWith(payload);
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.changePassword(start)', payload },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.authenticationError', payload: 'Error changing password' },
                { type: '@thunk.changePassword(success)', payload, result: undefined },
            ]);
        });
    });

    describe('tenant switching', () => {
        test('it changes tenant', async () => {
            // Arrange
            const mockProvisioningService = {
                switchTenant: jest.fn().mockImplementation(() => Promise.resolve(switchTenantResponse)),
            };

            const store = createStore(loginSlice, {
                injections: {
                    provisioningService: mockProvisioningService,
                },
                mockActions: true,
            });

            // Act
            await store.getActions().changeTenant(tenantId);

            // Assert
            expect(mockProvisioningService.switchTenant).toHaveBeenCalledWith('1234');
            expect(localStorage.getItem('tenantId')).toEqual('1234');
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.changeTenant(start)', payload: tenantId },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.changingTenantId', payload: tenantId },
                { type: '@thunk.changeTenant(success)', payload: tenantId, result: undefined },
            ]);
        });

        test('it fails to change tenant', async () => {
            // Arrange
            const switchTenantFailResponse = { response: { data: { detail: "We still don't like you" } } };

            const mockProvisioningService = {
                switchTenant: jest.fn().mockImplementation(() => Promise.reject(switchTenantFailResponse)),
            };

            const store = createStore(loginSlice, {
                injections: { provisioningService: mockProvisioningService },
                mockActions: true,
            });

            // Act
            await store.getActions().changeTenant(tenantId);

            // Assert
            expect(mockProvisioningService.switchTenant).toHaveBeenCalledWith(tenantId);
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.changeTenant(start)', payload: tenantId },
                { type: '@action.loggingIn', payload: undefined },
                { type: '@action.authenticationError', payload: "We still don't like you" },
                { type: '@thunk.changeTenant(success)', payload: tenantId, result: undefined },
            ]);
        });

        test('it changing tenant to same tenant does nothing', async () => {
            // Arrange
            const mockProvisioningService = {
                switchTenant: jest.fn().mockImplementation(() => Promise.resolve(switchTenantResponse)),
            };

            const store = createStore(loginSlice, {
                injections: {
                    provisioningService: mockProvisioningService,
                },
                mockActions: true,
            });

            // Set the tenant Id in local storage so it will appear as if we're switching to the same tenant
            localStorage.setItem('tenantId', tenantId);

            // Act
            await store.getActions().changeTenant(tenantId);

            // Assert
            expect(mockProvisioningService.switchTenant).not.toHaveBeenCalled();
            expect(store.getMockedActions()).toEqual([
                { type: '@thunk.changeTenant(start)', payload: tenantId },
                { type: '@thunk.changeTenant(success)', payload: tenantId, result: undefined },
            ]);
        });
    });
});

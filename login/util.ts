import Amplify from '@aws-amplify/core';
import { authConfig } from '../../configs';
import { loadAmplify } from '@pz/amplify';
import { COGNITO, PORTAL_COGNITO } from '@pz/configs/auth';

export async function checkAuthenticated(): Promise<boolean> {
    // Check for a valid auth session and update application default headers if needed
    let authenticated = false;

    if (authConfig.useBackdoor()) {
        return new Promise<boolean>(async (resolve) => {
            const tenantId = getTenantId();
            // Always auth'd in backdoor mode, unless there's no tenant
            resolve(tenantId !== null);
        });
    } else {
        // Check the current auth session and see if it's valid
        return await loadAmplify().then(async (module) => {
            if (authConfig.isPortal()) {
                Amplify.configure({
                    aws_cognito_region: PORTAL_COGNITO.REGION,
                    aws_user_pools_id: PORTAL_COGNITO.USER_POOL_ID,
                    aws_user_pools_web_client_id: PORTAL_COGNITO.APP_CLIENT_ID,
                });
            } else {
                Amplify.configure({
                    aws_cognito_region: COGNITO.REGION,
                    aws_user_pools_id: COGNITO.USER_POOL_ID,
                    aws_user_pools_web_client_id: COGNITO.APP_CLIENT_ID,
                });
            }
            await module.Auth.currentAuthenticatedUser()
                .then(() => {
                    return module.Auth.currentSession();
                })
                .then(() => {
                    // user is currently authenticated w/ the idp, so let's check to make sure the tenant Id is also present
                    // also let's make sure the headers are all present
                    const tenantId = getTenantId();

                    // We're considered authenticated if there's a tenant specified (there must be at least _one_ set on login)
                    authenticated = tenantId !== null;

                    // short circuit if not auth'd
                    if (!authenticated) {
                        return;
                    }
                })
                .catch(() => {
                    authenticated = false;
                });

            return authenticated;
        });
        return authenticated;
    }
}

export async function portalCheckAuthenticated(): Promise<boolean> {
    let authenticated = false;

    // Check for a valid auth session and update application default headers if needed
    await loadAmplify().then(async (module) => {
        await module.Auth.currentAuthenticatedUser()
            .then(() => {
                return module.Auth.currentSession();
            })
            .then(() => {
                authenticated = true;
            });

        return authenticated;
    });
    return authenticated;
}

export function getTenantId(): string | null {
    return localStorage.getItem('tenantId');
}

export function setTenantId(tenantId: string): void {
    return localStorage.setItem('tenantId', tenantId);
}

export default {
    checkAuthenticated,
    portalCheckAuthenticated,
    getTenantId,
};

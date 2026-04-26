import { Credentials } from 'google-auth-library';

const DEVICE_CODE_URL = 'https://oauth2.googleapis.com/device/code';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:device_code';

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_url: string;
  expires_in: number;
  interval: number;
}

interface TokenResponse extends Credentials {
  error?: string;
  error_description?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function authenticateWithDeviceFlow(
  clientId: string,
  clientSecret: string,
  scopes: string[]
): Promise<Credentials> {
  const deviceCodeRes = await fetch(DEVICE_CODE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      scope: scopes.join(' '),
    }),
  });

  if (!deviceCodeRes.ok) {
    throw new Error(`Device code request failed: ${deviceCodeRes.statusText}`);
  }

  const deviceCode = (await deviceCodeRes.json()) as DeviceCodeResponse;

  console.log('\nAuthentication required:');
  console.log(`1. Visit: ${deviceCode.verification_url}`);
  console.log(`2. Enter code: ${deviceCode.user_code}\n`);

  let interval = deviceCode.interval ?? 5;
  const expiresAt = Date.now() + deviceCode.expires_in * 1000;

  while (Date.now() < expiresAt) {
    await sleep(interval * 1000);

    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        device_code: deviceCode.device_code,
        grant_type: GRANT_TYPE,
      }),
    });

    const token = (await tokenRes.json()) as TokenResponse;

    if (token.access_token) {
      return token as Credentials;
    }

    if (token.error === 'slow_down') {
      interval += 5;
      continue;
    }

    if (token.error !== 'authorization_pending') {
      throw new Error(`Authentication failed: ${token.error} - ${token.error_description}`);
    }
  }

  throw new Error('Device code expired. Please try again.');
}

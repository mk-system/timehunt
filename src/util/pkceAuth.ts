import { randomBytes, createHash } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { createServer, Server } from 'http';
import { URL } from 'url';
import { spawn } from 'child_process';
import { platform } from 'os';

async function openBrowser(url: string): Promise<void> {
  const os = platform();
  let command: string;
  let args: string[];

  switch (os) {
    case 'darwin': // macOS
      command = 'open';
      args = [url];
      break;
    case 'win32': // Windows
      command = 'start';
      args = ['', url]; // Empty string for window title
      break;
    default: // Linux and others
      command = 'xdg-open';
      args = [url];
      break;
  }

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      detached: true,
      stdio: 'ignore'
    });
    
    child.on('error', reject);
    child.on('spawn', () => {
      child.unref();
      resolve();
    });
  });
}

export class PKCEHelper {
  private codeVerifier: string;
  private codeChallenge: string;
  private server: Server | null = null;
  private port: number = 8080;

  constructor() {
    this.codeVerifier = this.generateCodeVerifier();
    this.codeChallenge = this.generateCodeChallenge(this.codeVerifier);
  }

  private generateCodeVerifier(): string {
    return randomBytes(32)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private generateCodeChallenge(verifier: string): string {
    return createHash('sha256')
      .update(verifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  generateAuthUrl(oauth2Client: OAuth2Client, scopes: string[]): string {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      code_challenge: this.codeChallenge,
      code_challenge_method: 'S256' as any,
    });
  }

  async startLocalServer(): Promise<string> {
    return new Promise((resolve, reject) => {
      const server = createServer((req, res) => {
        if (req.url) {
          const url = new URL(req.url, `http://localhost:${this.port}`);
          const code = url.searchParams.get('code');
          const error = url.searchParams.get('error');

          if (error) {
            res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
              <html>
                <body>
                  <h1>Authentication Error</h1>
                  <p>Authentication failed: ${error}</p>
                  <p>Please close this window.</p>
                </body>
              </html>
            `);
            reject(new Error(`Authentication error: ${error}`));
            return;
          }

          if (code) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
              <html>
                <body>
                  <h1>Authentication Successful</h1>
                  <p>Google authentication completed.</p>
                  <p>Please close this window.</p>
                  <script>window.close();</script>
                </body>
              </html>
            `);
            resolve(code);
            return;
          }
        }

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      });

      server.listen(this.port, 'localhost', () => {
        console.log(`Local server started on port ${this.port}`);
      });

      server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          this.port++;
          if (this.port > 8090) {
            reject(new Error('No available port found'));
            return;
          }
          server.listen(this.port, 'localhost');
        } else {
          reject(err);
        }
      });

      this.server = server;
    });
  }

  stopLocalServer(): void {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }

  getRedirectUrl(): string {
    return 'http://localhost:8080/callback';
  }

  getCodeVerifier(): string {
    return this.codeVerifier;
  }

  async exchangeCodeForTokens(oauth2Client: OAuth2Client, code: string) {
    const { tokens } = await oauth2Client.getToken({
      code,
      codeVerifier: this.codeVerifier,
    });
    return tokens;
  }
}

export async function authenticateWithPKCE(
  oauth2Client: OAuth2Client,
  scopes: string[]
): Promise<any> {
  const pkce = new PKCEHelper();
  
  (oauth2Client as any).redirectUri = pkce.getRedirectUrl();
  
  const authUrl = pkce.generateAuthUrl(oauth2Client, scopes);
  
  console.log('Opening authentication page in browser...');
  console.log('Authentication URL:', authUrl);
  
  try {
    await openBrowser(authUrl);
    console.log('Browser opened.');
  } catch (error) {
    console.log('Could not open browser automatically. Please open the above URL manually in your browser.');
  }
  
  try {
    const code = await pkce.startLocalServer();
    const tokens = await pkce.exchangeCodeForTokens(oauth2Client, code);
    pkce.stopLocalServer();
    return tokens;
  } catch (error) {
    pkce.stopLocalServer();
    throw error;
  }
}
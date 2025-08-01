import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface Config {
  DATE_FORMAT: string;
  TIME_FORMAT: string;
  TIME_SEPERATOR: string;
  GOOGLE_CALENDAR_ID: string;
}

const DEFAULT_CONFIG: Config = {
  DATE_FORMAT: 'EEE, dd MMM yyyy',
  TIME_FORMAT: 'h:mm a',
  TIME_SEPERATOR: '〜',
  GOOGLE_CALENDAR_ID: ''
};

const getConfigDir = (): string => {
  const xdgConfigHome = process.env.XDG_CONFIG_HOME;
  if (xdgConfigHome) {
    return path.join(xdgConfigHome, 'timehunt');
  }
  return path.join(os.homedir(), '.config', 'timehunt');
};

const getConfigPath = (): string => {
  return path.join(getConfigDir(), 'config.json');
};

const ensureConfigDir = (): void => {
  const configDir = getConfigDir();
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
};

export const loadConfig = (): Config => {
  const configPath = getConfigPath();
  
  if (!fs.existsSync(configPath)) {
    ensureConfigDir();
    fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
    return DEFAULT_CONFIG;
  }

  try {
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    return { ...DEFAULT_CONFIG, ...config };
  } catch (error) {
    console.warn('Failed to load config, using defaults:', error);
    return DEFAULT_CONFIG;
  }
};

export const saveConfig = (config: Partial<Config>): void => {
  const currentConfig = loadConfig();
  const newConfig = { ...currentConfig, ...config };
  
  ensureConfigDir();
  const configPath = getConfigPath();
  fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
};

export const getConfigValue = <K extends keyof Config>(key: K): Config[K] => {
  const config = loadConfig();
  return config[key];
};

export const setConfigValue = <K extends keyof Config>(key: K, value: Config[K]): void => {
  saveConfig({ [key]: value } as Partial<Config>);
};
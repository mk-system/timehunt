#!/usr/bin/env node
import { huntCommandHandler } from './hunt';
import { fixCommandHandler } from './fix';
import { configCommand } from './config';
import { exit } from 'process';
import { displayHowToUse } from './help';
import { initializeI18n } from './translation';

initializeI18n();

switch (process.argv[2]) {
  case 'hunt':
    huntCommandHandler(process.argv[3]);
    break;
  case 'fix':
    fixCommandHandler(process.argv[3], process.argv[4], process.argv[5]);
    break;
  case 'config':
    configCommand(process.argv.slice(3));
    break;
  case 'help':
  case '-h':
  case '--help':
  default:
    console.log(displayHowToUse());
    exit();
}

#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import login from './commands/login'
import logout from './commands/logout'
import theme from './commands/theme'
import whoami from './commands/whoami'

yargs(hideBin(process.argv))
  .command(login)
  .command(logout)
  .command(theme as any)
  .command(whoami)
  .alias('version', 'v')
  .describe('version', 'Show version information')
  .demandCommand(1)
  .parse()

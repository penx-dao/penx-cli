import yargs, { ArgumentsCamelCase } from 'yargs'
import { clearConfig } from '../lib/utils'

type Args = {}

class Command {
  readonly command = 'logout'
  readonly describe = 'Logout from Penx CLI'

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
    clearConfig()
    console.log('Logout successfully!')
  }
}

const command = new Command()

export default command

import meow from 'meow';
import { commandGetWorkspaces } from './commands';


const COMMANDS = {
  workspaces: commandGetWorkspaces,
};

const helpMessage = `
  usage
    $ mono-ci [command] <...args> <...opts>
  commands
    run          run a bolt command inside all workspaces
    workspaces   show projects
  options
  --changed='direct' Include "direct" dependent packages
`;

export default async function cli(
  argv: string[],
  exit = false,
): Promise<void> {
  const { input, flags } = meow({
    argv,
    help: helpMessage,
    description: 'Display an array of changed packages since master',
    flags: {
      changed: {
        type: 'string',
        alias: 'b',
      },
    },
  });
  const [command, ...commandArgs] = input;

  try {
    if (COMMANDS[command]) {
      await COMMANDS[command](commandArgs, flags);
    }
  } catch (err) {
    if (exit) {
      process.exit(1);
    } else {
      throw err;
    }
  }
}

import meow from 'meow';
import { commandGetWorkspaces, commandRunWorkspaces } from './commands';
import * as logger from './utils/logger';


const COMMANDS = {
  workspaces: commandGetWorkspaces,
  run: commandRunWorkspaces,
};

const helpMessage = `
  usage
    $ mono-ci [command] <...args> <...opts>
  commands
    run                run a command inside all workspaces
    workspaces         show projects
  options
  --since=<branch|tag> Only include packages that have been updated since the specified ref. 
                       If no ref is passed, it defaults to the most-recent tag.
`;

export default async function cli(
  argv: string[] = [],
  exit = false,
): Promise<void> {
  const flagOpts: any = {
    '--': true,
    changed: {
      type: 'string',
      alias: 'b',
    },
  };
  const {
    pkg,
    input,
    flags,
    showHelp,
  } = meow(helpMessage, {
    argv,
    help: helpMessage,
    description: 'A tool for managing JavaScript projects with multiple packages based on Bolt.',
    flags: flagOpts,
  });

  logger.title(
    `mono-ci v${pkg.version}`,
    `(node v${process.versions.node})`,
    { emoji: '⌚' },
  );
  const [command, ...commandArgs] = input;

  try {
    if (COMMANDS[command]) {
      await COMMANDS[command](commandArgs, flags);
    } else {
      showHelp(0);
    }
  } catch (err) {
    console.error(err);
    if (exit) {
      process.exit(1);
    } else {
      throw err;
    }
  }
  return null;
}

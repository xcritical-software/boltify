import meow from 'meow';
import { commandGetWorkspaces } from './commands';
import * as logger from './utils/logger';


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
  --since=<branch|tag> Include "direct" dependent packages
`;

export default async function cli(
  argv: string[] = [],
  exit = false,
): Promise<void> {
  const {
    pkg,
    input,
    flags,
    showHelp,
  } = meow(helpMessage, {
    argv,
    help: helpMessage,
    description: 'A tool for managing JavaScript projects with multiple packages based on Bolt.',
    flags: {
      changed: {
        type: 'string',
        alias: 'b',
      },
    },
  });

  logger.title(
    `mono-ci v${pkg.version}`,
    `(node v${process.versions.node})`,
    { emoji: '⌚' },
  );
  const [command, ...commandArgs] = input;

  try {
    if (COMMANDS[command]) {
      logger.cmd([
        ...input,
        ...Object.entries(flags)
          .map(item => `--${item.join('=')}`),
      ].join(' '));
      await COMMANDS[command](commandArgs, flags);
    } else {
      showHelp(0);
    }
  } catch (err) {
    if (exit) {
      process.exit(1);
    } else {
      throw err;
    }
  }
}

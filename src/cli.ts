/* eslint-disable @typescript-eslint/promise-function-async */
import meow from 'meow';
import log from 'npmlog';

import { configureLogging } from './configuration';
import {
  commandGetWorkspaces,
  commandRunWorkspaces,
  commandGetChangesFromLastTagByWorkspaces,
  commandGetVersionsByWorkspaces,
} from './commands';
import * as logger from './utils/logger';


const COMMANDS = {
  workspaces: commandGetWorkspaces,
  ws: commandGetWorkspaces,
  run: commandRunWorkspaces,
  changes: commandGetChangesFromLastTagByWorkspaces,
  version: commandGetVersionsByWorkspaces,
};

const flagOpts: any = {
  '--': true,
  changed: {
    type: 'string',
    alias: 'b',
  },
  push: {
    type: 'boolean',
    default: true,
  },
  'git-tag-version': {
    type: 'boolean',
    default: true,
  },
  loglevel: {
    type: 'string',
    default: 'info',
  },
};

const helpMessage = `
  usage
    $ boltify [command] <...args> <...opts>
  commands
    run                run a command inside all workspaces
    workspaces         show projects
    changes            show changes of files grouped by workspaces
    version           get new versions for release by workspaces
      --no-git-tag-version      
                       By default, versions will add and push tags.
                       Pass --no-git-tag-version to disable the behavior.
  options
  --since=<branch|tag> Only include packages that have been updated since the specified ref. 
                       If no ref is passed, it defaults to the most-recent tag.
`;

function runCommand(
  input: string[],
  flags: { [key: string]: object },
  showHelp: any,
): Promise<void> | void {
  const [command, ...commandArgs] = input;
  if (COMMANDS[command]) {
    return COMMANDS[command](commandArgs, flags);
  }
  return showHelp(0);
}

export default async function cli(
  argv: string[] = [],
  exit = false,
): Promise<any> {
  log.pause();
  log.heading = 'boltify';

  log.silly('argv', argv.join(' '));

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


  return new Promise((resolve, reject): any => {
    // run everything inside a Promise chain
    let chain = Promise.resolve();

    chain = chain.then(() => configureLogging(flags));
    chain = chain.then(() => logger.title(
      `v${pkg.version}`,
      `(node v${process.versions.node})`,
      { emoji: '⌚' },
    ));
    chain = chain.then(() => runCommand(input, flags, showHelp));

    chain.then(
      (result) => {
        resolve(result);
      },
      (err) => {
        log.error(null, null, err);
        reject(err);
      },
    );
  }).catch(() => {
    if (exit) {
      process.exit(1);
    }
  });
}

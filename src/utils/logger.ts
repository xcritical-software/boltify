/* eslint-disable no-console */
import columnify from 'columnify';
import chalk from 'chalk';
import log from 'npmlog';
import { IPackagePrint } from 'src/commands';


interface ILoggerOpts {
  prefix?: string | false;
  emoji?: string;
}

interface IColumnifyOptions {
  showHeaders: boolean;
}

function fmt(result: string, opts: ILoggerOpts = {}): string {
  let prefix = opts.prefix || '';

  if (opts.emoji) {
    prefix = `${opts.emoji}  ${prefix}`;
  }

  if (prefix) {
    result = result
      .trimRight()
      .split('\n')
      .map(line => `${prefix} ${line}`)
      .join('\n');
  }

  return result;
}
export function output(...args: any[]): void {
  log.clearProgress();
  console.log(...args);
  log.showProgress();
}

export function trimmedColumns(
  formattedResults: any[],
  columns: string[],
  options: IColumnifyOptions = {
    showHeaders: true,
  },
): string {
  const str = columnify(formattedResults, {
    columns,
    config: {
      version: {
        align: 'right',
      },
    },
    ...options,
  });

  // columnify leaves a lot of trailing space in the last column, remove that here
  return str
    .split('\n')
    .map((line: string) => line.trimRight())
    .join('\n');
}

export function write(
  message: string,
  opts: ILoggerOpts = {},
  err = false,
): void {
  if (err) {
    log.error('', fmt(message, opts));
  } else {
    log.verbose('', fmt(message, opts));
  }
}

export function title(
  _title: string,
  subtitle: string,
  opts: ILoggerOpts = {},
): void {
  let str = chalk.bold(_title);
  if (subtitle) str += ` ${chalk.dim(subtitle)}`;
  log.info(str, opts.emoji);
}


export function cmd(str: string): void {
  write(chalk.bgBlack.magenta(`\`${str}\``));
}


function formatJSON(resultList: IPackagePrint[]): string {
  return JSON.stringify(resultList, null, 2);
}

function formatColumns(resultList: IPackagePrint[]): string {
  const formattedResults = resultList.map((result) => {
    const formatted: any = {
      name: result.name,
    };

    if (result.version) {
      formatted.version = chalk.green(`v${result.version}`);
    } else {
      formatted.version = chalk.yellow('MISSING');
    }

    if (result.private) {
      formatted.private = `(${chalk.red('PRIVATE')})`;
    }

    return formatted;
  });

  return trimmedColumns(formattedResults, ['name', 'version', 'private', 'description']);
}

export function outputFormat(pkgList: IPackagePrint[], { json }: any): void {
  let text = '';
  if (json) {
    text = formatJSON(pkgList);
  } else {
    text = formatColumns(pkgList);
  }

  output(text);
}

import columnify from 'columnify';
import chalk from 'chalk';


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
    console.error(fmt(message, opts));
  } else {
    console.log(fmt(message, opts));
  }
}

export function title(
  _title: string,
  subtitle: string,
  opts: ILoggerOpts = {},
): void {
  let str = chalk.bold(_title);
  if (subtitle) str += ` ${chalk.dim(subtitle)}`;
  write(str, opts);
}


export function cmd(str: string): void {
  write(chalk.bgBlack.magenta(`\`${str}\``));
}

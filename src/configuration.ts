import log from 'npmlog';


export function configureLogging({ loglevel }: { [key: string]: any}): void {
  if (loglevel) {
    log.level = loglevel;
  }

  // handle log.success()
  log.addLevel('success', 3001, { fg: 'green', bold: true });

  log.resume();
}

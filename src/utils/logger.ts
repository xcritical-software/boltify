import columnify from 'columnify';


export function trimmedColumns(formattedResults: any[], columns: string[]): string {
  const str = columnify(formattedResults, {
    showHeaders: false,
    columns,
    config: {
      version: {
        align: 'right',
      },
    },
  });

  // columnify leaves a lot of trailing space in the last column, remove that here
  return str
    .split('\n')
    .map((line: string) => line.trimRight())
    .join('\n');
}

export interface ICommitParsersOptions {
  headerPattern: RegExp;
  headerCorrespondence: string[];
  referenceActions: string[];
  issuePrefixes: string[];
  noteKeywords: string[];
  fieldPattern: RegExp;
  revertPattern: RegExp;
  revertCorrespondence: string[];
  mergePattern: null | RegExp;
  mergeCorrespondence: null | RegExp;
}

export const options: ICommitParsersOptions = {
  headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
  headerCorrespondence: ['type', 'scope', 'subject'],
  referenceActions: [
    'close',
    'closes',
    'closed',
    'fix',
    'fixes',
    'fixed',
    'resolve',
    'resolves',
    'resolved',
    'add',
    'adds',
    'added',
  ],
  issuePrefixes: ['#', 'CRM-'],
  noteKeywords: ['BREAKING CHANGE'],
  fieldPattern: /^-(.*?)-$/,
  revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\./,
  revertCorrespondence: ['header', 'hash'],
  mergePattern: null as any,
  mergeCorrespondence: null as any,
};

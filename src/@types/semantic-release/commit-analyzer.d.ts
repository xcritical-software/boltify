declare module '@semantic-release/commit-analyzer/lib/analyze-commit' {
  interface IAngularRule {
    type: string;
    release: string;
  }

  interface IAtomRule {
    emoji: string;
    release: string;
  }

  interface IESLintRule {
    tag: string;
    release: string;
  }

  interface IExpressRule {
    component: string;
    release: string;
  }

  type Rule = IAngularRule | IAtomRule | IESLintRule | IExpressRule;

  export default function analyzeCommit(releaseRules: Rule[], commit: any): string;
}

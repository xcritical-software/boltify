declare module '@semantic-release/commit-analyzer/lib/analyze-commit' {
  interface IAngularRule {
    type: string;
    scope?: string;
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

  interface IRevertRule {
    revert: boolean;
    release: string;
  }

  interface IBreakingRule {
    breaking: boolean;
    release: string;
  }

  type Rule = IAngularRule | IAtomRule | IESLintRule | IExpressRule | IRevertRule | IBreakingRule;

  export default function analyzeCommit(releaseRules: Rule[], commit: any): string;
}

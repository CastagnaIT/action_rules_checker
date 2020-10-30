# Action Rules checker

[![release][release-badge]][release]
[![license][license-badge]][license]

This is a GitHub action to check some rules in any issues that are opened or edited.

Current checks:
- If log links are attached
- If the Issue use a definited template

I created this GitHub Action project for exclusive use in my repository so it won't be published in the Marketplace, those who want to use this Action can do it following the instructions, improvements and feature additions will be welcome.

## Usage

In your project repository create a `.github/workflows/rules-checker.yml` file:

```yaml
name: 'Rules checker'
on:
  issues:
    types:
      - opened
jobs:
  rules-checker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        name: "Run Rules checker"
      - uses: CastagnaIT/action_rules_checker@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          log-miss-label-text: "Ignored rules"
          log-section-start-text: "### Debug log"
          log-section-end-text: "### Additional context or screenshots (if appropriate)"
          log-miss-comment-text: |
            Hey boy you forgot to attach the log
            Please fix it
          generic-comment-text: |
            Hey boy you have not studied your homework
            Now you will take the exam
          triage-needed-label: "Triage: Needed"
```

## Configuration

The following inputs are required:

- `github-token`: your GitHub token
- `log-section-start-text`: text part of Issue body where to start the log search (case sensitive)
- `log-section-end-text`: text part of Issue body to end the log search (case sensitive)
- `log-miss-comment-text`: the text of the comment to be add to any issues that do not have a log attached
- `generic-comment-text`: the text of the comment to be add to any issues that was made with an unknown template

## License

MIT

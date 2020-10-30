import * as helper from './helper'
import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const gitHubToken = core.getInput('github-token', {required: true})
    const context = github.context

    //console.log(context.payload)

    const client = github.getOctokit(gitHubToken)
    let bodyText
    let issueNumber = 0

    if (context.payload.issue && (context.payload.action === 'opened' || context.payload.action === 'edited')) {
      //An issue was opened or updated
      bodyText = context.payload.issue.body
      issueNumber = context.issue.number
    }

    /*
    if (context.payload.pull_request && (context.payload.action === 'opened' || context.payload.action === 'edited')) {
      //A pull request was opened or updated
      bodyText = context.payload.pull_request.body
      issueNumber = context.payload.pull_request.number
    }
    
    if (context.payload.comment && (context.payload.action === 'created' || context.payload.action === 'edited')) {
      //A comment was added to the issue/pull request
      bodyText = context.payload.comment.body;
      issueNumber = context.issue.number;
    }
    */

    let notifyForLog: Boolean = false
    let notifyForGenericRules: Boolean = false
    let notifyTriageNeeded: Boolean = false
    let notifyFeatureRequest: Boolean = false

    if (bodyText == null || bodyText.length == 0) {
      // The body content is null, undefined or empty
      notifyForGenericRules = true
    } else {
      // Remove markdown comments from body text
      bodyText = bodyText.replace(/<!--[\r\n\w\W]*?-->/g, "")
      let issueType: string = helper.detectIssueType(bodyText)
      console.info(`Detected Issue with template of type: ${issueType}\n`)
      console.info('------------------------------------------------------\n')
      switch (issueType) {
        case helper.issueTypes.BUG:
          // Check if a log has been attached
          let sectionStartText = core.getInput('log-section-start-text', {required: true})
          let sectionEndText = core.getInput('log-section-end-text', {required: true})
          if (helper.isLogAttached(bodyText, sectionStartText, sectionEndText) === false) {
            console.info('Log link not found.\n')
            notifyForLog = true
          } else{
            notifyTriageNeeded = true
          }
          break
        case helper.issueTypes.FEATURE:
          notifyFeatureRequest = true
          break
        case helper.issueTypes.HELP:
          // Do nothing
          break
        default:
          // Unknown issue template, the body content could be customized by user
          notifyForGenericRules = true
          break
      }
    }

    if (notifyForLog) {
      let labelText = core.getInput('log-miss-label-text', {required: false})
      client.issues.addLabels({
        labels: [labelText],
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber
      })

      let commentText = core.getInput('log-miss-comment-text', {required: true})
      client.issues.createComment({
        body: commentText,
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber
      })
    }

    if (notifyTriageNeeded){
      let labelText = core.getInput('triage-needed-label', {required: false})
      client.issues.addLabels({
        labels: [labelText],
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber
      })
    }

    if (notifyForGenericRules) {
      let labelText = core.getInput('generic-label-text', {required: false})
      client.issues.addLabels({
        labels: [labelText],
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber
      })

      let commentText = core.getInput('generic-comment-text', {required: true})
      client.issues.createComment({
        body: commentText,
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber
      })
    }

    if (notifyFeatureRequest) {
      let labelText = core.getInput('feature-label-text', {required: false})
      client.issues.addLabels({
        labels: [labelText],
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: issueNumber
      })
    }
  } catch (error) {
    console.error(error)
    core.setFailed(error.message)
  }
}

run()

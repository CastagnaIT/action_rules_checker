function getFirstTextLine(text: string) {
  let index = text.indexOf('\n');
  if (index === -1) return '';
  return text.substring(0, index);
}

export const issueTypes = {
  BUG: 'BUG REPORT',
  FEATURE: 'FEATURE REQUEST',
  HELP: 'HELP REQUEST',
  UNKNOWN: 'UNKNOWN'
}

export function detectIssueType(text: string) {
  let firstLineText = getFirstTextLine(text).toLowerCase();
  if (firstLineText.includes('## bug report')) return issueTypes.BUG;
  if (firstLineText.includes('## feature request')) return issueTypes.FEATURE;
  if (firstLineText.includes('## help request')) return issueTypes.HELP;
  return issueTypes.UNKNOWN;
}

function isLinkIncluded(text: string){
  var regExp = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#/%=~_|$?!:,.]*\)|[A-Z0-9+&@#/%=~_|$])/gi;
  var match;
  var disallowCases = ['.jpg', '.jpeg', '.gif', '.png', 'user-images.githubusercontent.com'];
  while (match = regExp.exec(text)) {
    var isLinkDisallowed = false;
    for (var index in disallowCases) {
      if (match[0].includes(disallowCases[index]) === true) {
        isLinkDisallowed = true;
        break;
      }
    }
    if (isLinkDisallowed === false) {
      return true;
    }
  }
  return false;
}

export function isLogAttached(text: string, sectionStartText: string, sectionEndText: string) {
  var ret: string[];
  if (sectionStartText != null && sectionStartText.length > 0 && text.includes(sectionStartText)) {
    ret = text.split(sectionStartText);
    if (sectionEndText != null && sectionEndText.length > 0 && ret[1].includes(sectionEndText)) {
      // Check inside log section only
      let logSection = ret[1].split(sectionEndText)[0];
      return isLinkIncluded(logSection);
    }
    // Check from log section until the end of the Issue body
    return isLinkIncluded(ret[1]);
  }
  // The BUG Issue template has been completely customized, try check anyway
  return isLinkIncluded(text);
}
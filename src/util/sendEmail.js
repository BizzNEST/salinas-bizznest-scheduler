import { mailToMessageObject } from "../constants/constants.js";

export default function generateMailToString(
  emails,
  subject = mailToMessageObject.subject,
  body = mailToMessageObject.body,
) {
  const emailString = Array.isArray(emails) ? emails.join(",") : emails;
  return `mailto:${emailString}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

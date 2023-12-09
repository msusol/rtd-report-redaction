// Use regex101.com to test and build javascript code examples.
//
// https://regex101.com/codegen?language=javascript
// @param regex A regex literal like: /(?<=- Reporter E-mail: )(.*?)(?=\&#x0D;)/gim
function ReplaceReporterField(report, regex){
  const redacted = '[REDACTED]';
  // NOTE: Do not use alternative syntax using RegExp constructor, i.e. new RegExp('pattern', 'gim')
  // As I couldn't reproduce the same results as in the UI, codegen doesn't use it.
  // TypeError: Cannot read properties of undefined (reading 'replace')
  const redactedReport = report?.replace(regex, redacted);
  return redactedReport;
}

function RedactReport(report){
  var redacted_report = report

  // Specific report tags, ex: '- Another Field: something to redact here&#x0D;'
  //redacted_report = ReplaceReporterField(redacted_report, /(?<=- Another Field: )(.*?)(?=\&#x0D;)/gim);
  redacted_report = ReplaceReporterField(redacted_report, /(?<=- Phone Number: )(.*?)(?=\&#x0D;)/gim);
  redacted_report = ReplaceReporterField(redacted_report, /(?<=- Phone Type: )(.*?)(?=\&#x0D;)/gim);
  redacted_report = ReplaceReporterField(redacted_report, /(?<=- Reporter E-mail: )(.*?)(?=\&#x0D;)/gim);
  redacted_report = ReplaceReporterField(redacted_report, /(?<=- Reporter Name: )(.*?)(?=\&#x0D;)/gim);
  redacted_report = ReplaceReporterField(redacted_report, /(?<=- Reporter Home Address: )(.*?)(?=\&#x0D;)/gim);
  redacted_report = ReplaceReporterField(redacted_report, /(?<=- Reporter's Name: )(.*?)(?=\&#x0D;)/gim);
  redacted_report = ReplaceReporterField(redacted_report, /(?<=- Reporter's Phone Number: )(.*?)(?=\&#x0D;)/gim);

  // free form `name dob` type comments
  redacted_report = ReplaceReporterField(redacted_report, /(\S+)\s*(\S+)\s*correction on dob\s*/gim);  // 10/10/1993 correction on dob
  redacted_report = ReplaceReporterField(redacted_report, /(\S+)\s*(\S+)\s*dob\s*(\S+)/gim);  // 'dob' only

  // https://regex101.com/r/fjAyuB/1
  // last[,] first [middle] mm/dd/yy[yy]
  // last[,] first [middle] mm-dd-yy[yy]
  // last[,] first [middle] mmddyy[yy]
  const last_first_name_dob = /([A-Za-z]+)[, ]+\s*([A-Za-z]+)\s*([A-Za-z]+)*(\S+)\s*\d{2}([/-]?)+\d{2}([/-]?)+\d{2,4}/gim;
  redacted_report = ReplaceReporterField(redacted_report, last_first_name_dob);

  return redacted_report;
}

var mockReport = `
- E-mail: official@foo.com&#x0D;
- Other Phone Number: 13031234567&#x0D;
- Reporter e-mail: reporter@foo.com&#x0D;  /gim "i" means case insensitive
- Reporter E-mail: reporter@foo.com&#x0D;
- Phone Number: 13031234567&#x0D;
- Phone Type: MOBILE&#x0D;
- Reporter Name: JANE DOE&#x0D;
- Reporter's Name: JANE DOE&#x0D;
- Reporter Home Address: 123 yellow brick Road, kansas&#x0D;
... | last, first DOB 10/21/1968 12:00:00 PM | ...
... | LAST, first DOB 10-21-1968 12:00:00 PM | ...
...  Doe Jane 03/10/10 Jan 20 2022 7:14PM | ...
...  DOE, jane 03/10/10 Jan 20 2022 7:14PM | ...
...  DOE, jane nicole 03/10/10 Jan 20 2022 7:14PM | ...
... | 10/10/1993 correction on dob Jan 20 2022 7:14PM | DOE, jane nicole 03/10/10 Jan 20 2022 7:14PM | ... | DOE, Jane 10/12/1993 Jan 20 2022 7:11PM | ...
... | john Doe DOB112789 .. actual date example
... | john Doe DOB11/27/1989 .. different possible date schema
... | Samuel Dickerson 08/08/2001 Mar 17 2022  2:44PM | ...
... | Samuel, Dickerson 082990 Jan 28 2022 12:31PM | ...
... | Samuel, Dickerson 08-29-90 Jan 28 2022 12:31PM | ...
`;

//Logger.log(RedactReport(mockReport))

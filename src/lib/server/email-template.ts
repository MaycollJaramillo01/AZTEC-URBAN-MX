// Email-safe HTML: tables and inline styles only, no images, fonts or remote assets.
const body = "Arial,Helvetica,sans-serif";
const display = "'Arial Narrow','Helvetica Neue',Arial,sans-serif";
const escape = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

export function mailto(email: string, subject?: string) {
  // validEmail allows URI-reserved characters only in the local part.
  const [local, domain] = email.split("@");
  return `mailto:${encodeURIComponent(local)}@${domain}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}
export function emailHtml({
  preheader,
  eyebrow,
  title,
  rows,
  message,
  note,
  actions,
  footer,
}: {
  preheader: string;
  eyebrow: string;
  title: string;
  rows: { label: string; value: string; href?: string }[];
  message: { label: string; text: string };
  note?: string;
  actions: { label: string; href: string }[];
  footer: string;
}) {
  const cell = "padding:12px 0;border-top:1px solid #eee2d0;vertical-align:top;";
  const details = rows
    .map(
      ({ label, value, href }) =>
        `<tr><td style="${cell}width:40%;font-size:12px;line-height:20px;color:#686354;">${escape(label)}</td><td style="${cell}font-size:15px;line-height:22px;color:#171713;">${href ? `<a href="${escape(href)}" style="color:#344a3b;text-decoration:underline;">${escape(value)}</a>` : escape(value)}</td></tr>`,
    )
    .join("");
  const text = message.text
    ? `<p style="margin:28px 0 8px;font-size:11px;line-height:16px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;color:#686354;">${escape(message.label)}</p><div style="background:#f5ebdd;border-left:3px solid #344a3b;padding:16px 18px;font-size:15px;line-height:24px;color:#171713;">${escape(message.text).replace(/\n/g, "<br>")}</div>`
    : "";
  const attachment = note
    ? `<p style="margin:20px 0 0;padding:12px 14px;border:1px dashed #8a806d;border-radius:4px;font-size:14px;line-height:20px;color:#171713;">${escape(note)}</p>`
    : "";
  const buttons = actions
    .map(
      ({ label, href }, index) =>
        `<a href="${escape(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border:1px solid #171713;border-radius:4px;background:${index ? "#ffffff" : "#171713"};color:${index ? "#171713" : "#f5ebdd"};font-size:14px;line-height:20px;font-weight:bold;text-decoration:none;">${escape(label)}</a>`,
    )
    .join("");
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escape(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f5ebdd;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5ebdd;">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #d6cbb9;border-radius:6px;font-family:${body};">
<tr><td style="background:#171713;padding:22px 32px;border-radius:6px 6px 0 0;"><span style="font-family:${display};font-size:30px;line-height:34px;font-weight:bold;letter-spacing:3px;color:#f5ebdd;">AZTEC</span><span style="padding-left:10px;font-size:10px;letter-spacing:3px;color:#d5a044;">URBAN MX</span></td></tr>
<tr><td style="height:4px;line-height:4px;font-size:0;background:#d5a044;">&nbsp;</td></tr>
<tr><td style="padding:32px;">
<p style="margin:0 0 10px;font-size:11px;line-height:16px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;color:#ad462c;">${escape(eyebrow)}</p>
<h1 style="margin:0 0 20px;font-family:${display};font-size:30px;line-height:36px;font-weight:bold;color:#171713;">${escape(title)}</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${details}</table>
${text}${attachment}
<div style="margin-top:28px;">${buttons}</div>
</td></tr>
<tr><td style="padding:20px 32px 28px;border-top:1px solid #eee2d0;font-size:12px;line-height:18px;color:#686354;">${escape(footer)}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

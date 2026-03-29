import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface ContactEmailData {
  fullName: string;
  email: string;
  phone?: string;
  eventDate?: string;
  eventType?: string;
  packageInterest?: string;
  venue?: string;
  referralSource?: string;
  message?: string;
}

export async function sendContactNotification(data: ContactEmailData) {
  const notificationEmail =
    process.env.NOTIFICATION_EMAIL || "hello@heliawedding.com";

  const safe = {
    fullName: escapeHtml(data.fullName),
    email: escapeHtml(data.email),
    phone: data.phone ? escapeHtml(data.phone) : "",
    eventDate: data.eventDate ? escapeHtml(data.eventDate) : "",
    eventType: data.eventType ? escapeHtml(data.eventType) : "",
    packageInterest: data.packageInterest ? escapeHtml(data.packageInterest) : "",
    venue: data.venue ? escapeHtml(data.venue) : "",
    referralSource: data.referralSource ? escapeHtml(data.referralSource) : "",
    message: data.message ? escapeHtml(data.message) : "",
  };

  await resend.emails.send({
    from: "Helia Wedding <onboarding@resend.dev>",
    to: notificationEmail,
    subject: `New Inquiry from ${safe.fullName}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1A1A1A;">
        <h1 style="font-size: 24px; font-weight: 300; color: #3C3C3C; border-bottom: 1px solid #C4A87C; padding-bottom: 16px;">
          New Consultation Request
        </h1>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 140px; vertical-align: top;">Name:</td>
            <td style="padding: 8px 0;">${safe.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${safe.email}">${safe.email}</a></td>
          </tr>
          ${data.phone ? `<tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Phone:</td><td style="padding: 8px 0;">${safe.phone}</td></tr>` : ""}
          ${data.eventDate ? `<tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Event Date:</td><td style="padding: 8px 0;">${safe.eventDate}</td></tr>` : ""}
          ${data.eventType ? `<tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Event Type:</td><td style="padding: 8px 0;">${safe.eventType}</td></tr>` : ""}
          ${data.packageInterest ? `<tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Package:</td><td style="padding: 8px 0;">${safe.packageInterest}</td></tr>` : ""}
          ${data.venue ? `<tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Venue:</td><td style="padding: 8px 0;">${safe.venue}</td></tr>` : ""}
          ${data.referralSource ? `<tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Found us via:</td><td style="padding: 8px 0;">${safe.referralSource}</td></tr>` : ""}
        </table>

        ${
          data.message
            ? `<div style="margin-top: 24px; padding: 16px; background: #F2F1EF; border-left: 3px solid #C4A87C;">
                <p style="margin: 0 0 8px 0; font-weight: bold;">Message:</p>
                <p style="margin: 0; line-height: 1.6;">${safe.message}</p>
              </div>`
            : ""
        }

        <p style="margin-top: 32px; font-size: 12px; color: #6B6B6B;">
          This inquiry was submitted through heliawedding.com
        </p>
      </div>
    `,
  });
}

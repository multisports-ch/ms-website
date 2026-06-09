import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "mail.infomaniak.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    await transporter.sendMail({
        from: `"Multisports" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
    });
}

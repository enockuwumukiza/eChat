import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_MAIL as string,
    pass: process.env.MAILER_PASS as string,
  },
  // maxConnections: 5,
  // maxMessages: 10,
  // rateDelta: 200,
  // rateLimit:5
});

export async function sendEmail(toMail: string, actionUrl: string, name: string): Promise<void> {
    try {
      
    const htmlFile = fs.readFileSync(path.join(__dirname, 'templates', 'email-template.html'), 'utf-8');
    const htmlContent = htmlFile.replace('{{actionUrl}}', actionUrl);

      if (!htmlContent) {
        console.log('Email content not found');
        return;
      }
      const info = await transporter.sendMail({
      from: `eChat <${process.env.MAILER_MAIL}>`,
      to: toMail,
      subject: 'Welcome message',
      text: `Hello dear ${name}?`,
      html: htmlContent,
    });
        
        
  } catch (error) {
    console.error(`Failed to send email: ${error}`);
  }
}

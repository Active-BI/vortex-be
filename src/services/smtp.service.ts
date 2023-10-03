import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
const nodemailer = require('nodemailer');

@Injectable()
export class SmtpService {
  constructor(private prisma: PrismaService) {}

  transporter() {
    return nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
      auth: {
        user: process.env['SMTP_EMAIL'],
        pass: process.env['SMTP_PASS'],
      },
    });
  }

  async renderMessage(
    { content, subject }: { content: string; subject: string },
    receivers: string[],
  ) {
    try {
      await this.transporter().sendMail({
        from: process.env['SMTP_EMAIL'], // sender address
        to: receivers, // list of receivers
        subject: subject, // Subject line
        text: '', // plain text body
        html: content,
      });
    } catch (e) {
      throw new BadRequestException('Email não encontrado');
    }
  }
}

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
        user: 'embedded@activebi.com.br',
        pass: 'Paq21687',
      },
    });
  }

  async renderMessage(message: string, receivers: string[]) {
    try {
      await this.transporter().sendMail({
        from: 'embedded@activebi.com.br', // sender address
        to: receivers, // list of receivers
        subject: '', // Subject line
        text: '', // plain text body
        html: message,
      });
    } catch (e) {
      throw new BadRequestException('Email não encontrado');
    }
  }
}

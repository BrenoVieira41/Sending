import { Sms, Email } from './dto/Sms';
import { Twilio } from 'twilio';
import { config } from 'dotenv';
import { MailService } from '@sendgrid/mail';
import * as EmailValidator from 'email-validator';


config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.ACCOUNT_TOKEN;
const twilioNumber = process.env.ACCOUNT_NUMBER;
const sendGridKey = process.env.SENDGRID_KEY;
const sendGridUser = process.env.SENDGRID_USER;

class SendService {
  private readonly client: Twilio;
  private readonly sendGrid: MailService;

  constructor() {
    this.client = new Twilio(accountSid, authToken);
    this.sendGrid = new MailService();
    this.sendGrid.setApiKey(sendGridKey);
  }

  public async sendSms(sms: Sms): Promise<string> {
    try {
      const { phone, message } = sms;
      this.valdiatePhone(phone);
      const formatPhone = `+55${phone}`;

      if (this.valdiateString(message.length, 5, 500)) {
        throw new Error('Mensagem esperada de 5 à 500 caracteres');
      }

      await this.client.messages.create({
        from: twilioNumber,
        to: formatPhone,
        body: message
      });

      return 'Mensagem enviada com sucesso';
    } catch (err) {
      throw new Error(err);
    }
  }

  public async sendEmail(email: Email) {
    try {
      const { recipient, message, title } = email;

      const validateEmail = EmailValidator.validate(recipient);

      if (!validateEmail) {
        throw new Error('Email inválido.');
      }

      if (this.valdiateString(message.length, 5, 500)) {
        throw new Error('Mensagem esperada de 5 à 500 caracteres');
      }

      if (this.valdiateString(title.length, 3, 50)) {
        throw new Error('Título espera de 3 à 50 caracteres');
      }

      await this.sendGrid.send({
        from: sendGridUser,
        to: recipient,
        subject: title,
        html: `
        <h1>${title}</h1>
        </br>
        <p>${message}<p></p>
        `
      });

      return 'Mensagem enviada com sucesso';
    } catch (err) {
      throw new Error(err);
    }
  }

  private valdiateString(value: number, min: number, max: number) {
    if ((value < min) || (value > max)) {
      return true
    } else {
      return false;
    }
  }

  private valdiatePhone(phone: string) {
    if (!phone) {
      throw new Error('É esperado um (phone) com 11 números');
    }

    const validateNumbers = !!phone.match(/^[0-9]+$/);

    if (!validateNumbers || phone.length !== 11) {
      throw new Error('Número de telefone inválido')
    }

    return;
  }
}

export default new SendService();

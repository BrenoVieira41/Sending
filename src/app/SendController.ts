import { Request, Response } from 'express';
import SendService from './SendService';

export class SendController {

  async sendSms(req: Request, res: Response): Promise<Response> {
    try {
      const sms = req.body;

      const sendSms = await SendService.sendSms(sms);
      return res.status(200).send({ content: sendSms });
    } catch(err) {
      return res.status(400).send(err.message);
    }
  }

  async sendEmail(req: Request, res: Response): Promise<Response> {
    try {
      const email = req.body;

      const sendEmail = await SendService.sendEmail(email);
      return res.status(200).send({ content: sendEmail });
    } catch(err) {
      return res.status(400).send(err.message);
    }
  }
}

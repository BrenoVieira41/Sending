import { Router } from 'express';
import { SendController } from './app/SendController';

const router = Router();

const sendController = new SendController();

router.post('/send/sms', sendController.sendSms);
router.post('/send/email', sendController.sendEmail);

export { router };

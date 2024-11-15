import express from "express"
import {enviarMail} from '../../controllers/email/emailController.mjs'
const router = express.Router();
router.use(express.json());

router.post('/enviarEmail', enviarMail)


export default router


import express from 'express'
import Authenticate from '../models/authenticate'

const router = express.Router()

router.route('/').post(Authenticate)

export default router

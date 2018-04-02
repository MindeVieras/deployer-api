
import express from 'express'
import authenticateRoutes from './authenticate.route'
// import userRoutes from './user.route';

const router = express.Router()

// mount auth routes at /authenticate
router.use('/authenticate', authenticateRoutes)

// mount user routes at /users
// router.use('/users', userRoutes);

export default router

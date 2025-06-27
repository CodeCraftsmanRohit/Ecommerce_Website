import express from'express'

import userAuth from '../middleware/userAuth.js'

import { getUserData,getLeaderboard } from '../controllers/userController.js'

const userRouter=express.Router();

userRouter.get('/data',userAuth,getUserData)

userRouter.get("/leaderboard", getLeaderboard);


export default userRouter;
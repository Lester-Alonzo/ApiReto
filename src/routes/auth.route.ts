import { Router } from "express"
import {Login, Register} from '../controllers/auth'

const auth = Router()

auth.post("/login", Login)
auth.post("/register", Register)
// auth.post("/change_password")
// auth.post("/confirm_email/:user_hash")
// auth.post("/verify_session")

export {auth}
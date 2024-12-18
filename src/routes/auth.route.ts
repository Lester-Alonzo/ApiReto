import { Router } from "express"
import {Login, Register, ChangePass, CpassC, ChanginPass} from '../controllers/auth'

const auth = Router()

auth.post("/login", Login)
auth.post("/register", Register)
auth.post("/change_password", ChangePass)
auth.get("/cpass_confirm/:key", CpassC)
auth.post("/changing_pass/:id", ChanginPass)
// auth.post("/confirm_email/:user_hash")

export {auth}
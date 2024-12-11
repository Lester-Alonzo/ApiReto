import { Router } from "express"

const auth = Router()

auth.post("/login")
auth.post("/register")
auth.post("/change_password")
auth.post("/confirm_email/:user_hash")
auth.post("/verify_session")

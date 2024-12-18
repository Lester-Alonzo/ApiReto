import type {Request} from 'express'

export type Error_G = string | null
declare namespace Express {
    export interface RequestE extends Request {
        context?:{
            models:any
            me:any
        }
    }
}

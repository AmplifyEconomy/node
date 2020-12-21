import BodyParser from 'body-parser'
import { Express } from 'express'

export function ConfigureServer (Server: Express) {
  Server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    return next()
  })

  Server.use(BodyParser.json())
  Server.use(BodyParser.urlencoded({ extended: true }))
}

import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import router from './routes/api'
import 'dotenv/config'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(compression())
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));

app.use('/api', router)

export default app

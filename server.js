import 'dotenv/config'
import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import mongoose from 'mongoose'
import DeviceRoute from './src/services/devices/routes.js'
import ReportRoute from './src/services/reports/routes.js'
import { corsConfig } from './src/utils/serverConfig.js'

const server = express()

// ******************** MIDDLEWARE ******************
server.use(cors(corsConfig));
server.use(express.json())

// ******************* ROUTES ***********************
 server.use("/device", DeviceRoute)
 server.use("/report", ReportRoute)

// ******************* Server Configure ******************
mongoose.connect(process.env.MONGO_DEV_URL)

mongoose.connection.on("connected", () => {
  console.log('Successfully connected to mongo!')
  server.listen(3003, () => {
    console.table(listEndpoints(server))
    console.log("Server is running on port ", 3003)
  })
})

mongoose.connection.on("error", err => {
  console.log("MONGO ERROR: ", err)
})
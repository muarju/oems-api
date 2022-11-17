import express from 'express'
import Devices from './schema.js'
import mongoose from 'mongoose'
import DeviceData from './deviceDataSchema.js'


const DeviceRoute = express.Router()

DeviceRoute.get('/', async (req, res, next) => {
    try {
        const devices = await Devices.find()
        res.status(200).send(devices)
    } catch (error) {
        next(error)
    }
})
DeviceRoute.post('/', async (req, res, next) => {
    try {
        const { apiKey } = req.body
        const devices = await Devices.find({ apiKey: apiKey })
        if (!devices.length>0) {
            const newDevice = new Devices(req.body)
            const device = await newDevice.save({ new: true })
            res.status(201).send(device)
        } else {
            next(createHttpError(401, "API Key already Used."))
        }

    } catch (error) {
        next(error)
    }
})

DeviceRoute.get('/device-parameters/:deviceId',  async (req, res, next) => {
    try {
        const parameters = await DeviceData.aggregate([
            {
                // only match documents that have this field
                // you can omit this stage if you don't have missing fieldX
                $match: { "device": new mongoose.Types.ObjectId(req.params.deviceId) }
            },
            {
                $group: {
                    "_id": "$name",
                    "device": { "$first": "$device" },  //$first accumulator
                    "count": { "$sum": 1 },  //$sum accumulator
                }
            }

        ])
        res.status(200).send(parameters)
    } catch (error) {
        console.log(error)
    }
})
export default DeviceRoute;



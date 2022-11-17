import express from 'express'
import deviceDataSchema from "../devices/deviceDataSchema.js"
import createHttpError from 'http-errors'

const ReportRoute = express.Router()

ReportRoute.post('/', async (req, res, next) => {
    const { interval, device, from, to, parameter } = req.body;
    try {
        const data = await deviceDataSchema.find({
            device: device, name: parameter,
            createdAt: {
                $gte: new Date(new Date(from)),
                $lte: new Date(new Date(to))
            }
        })
        res.status(200).send(data)


    } catch (error) {
        next(createHttpError(401, error))
        console.log(error)
    }
})

export default ReportRoute;
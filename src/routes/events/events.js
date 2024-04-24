import eventsActions from '../../actions/events'

exports.createEvent = (ctx) => {
    const threshold = ctx.params.threshold
    const eventData = ctx.request.body
    try {
        const data = eventsActions.createEvent(threshold, eventData)
        ctx.body = { "data": data }
        ctx.status = 200
    } catch (error) {
        if (error.message === "Invalid data") {
            ctx.body = { 
                "status": "NOK",
                "error_message": "One or more attributes did no came on the request"
            }
            ctx.status = 400
        } else {
            ctx.body = { 
                "status": "NOK",
                "error_message": "INTERNAL SERVER ERROR"
            }
            ctx.status = 500
        }
    }
    return ctx
}
import eventsData from '../data/events.json'

let events = eventsData

function exportData() {
    const path = process.cwd()+"\\src\\data\\events.json"
    require('fs').writeFile(path, JSON.stringify(events), (error) => {if (error) {throw error;} })
}

function maxDelay(event, oldEvents) {
    let max = Math.abs(Number(event.timestamp) - Number(oldEvents[0].timestamp))
    for (let i = 1; i < oldEvents.length; i++) {
        const oldEvent = oldEvents[i]
        const diff = Math.abs(Number(event.timestamp) - Number(oldEvent.timestamp))
        if (diff > max) {
            max = diff
        }
    }
    return max
}

exports.formatData = (threshold) => { 
    const data = []
    let carsIndex = 0
    let newCarIncident = {
        "incidents_id": carsIndex,
        "incidents": []
    }
    for (let eventsIndex = 0; eventsIndex < events.length; eventsIndex++) {
        const event = events[eventsIndex]
        if (data.length === 0) { // First car incident
            const newCarIncident = {
                "incidents_id": carsIndex++,
                "incidents": [event]
            }
            data.push(newCarIncident)
        } else {
            const carData = data.filter( carIncident => carIncident.incidents[0].metadata === event.metadata)
            if (carData.length === 0) { // First incident of a new car
                const newCarIncident = {
                    "incidents_id": carsIndex++,
                    "incidents": [event]
                }
                data.push(newCarIncident)
            } else { // Incident of a car that already had one incident
                const maxTimeBetwwenTimestamps = maxDelay(event,carData[0].incidents)
                if (maxTimeBetwwenTimestamps <= threshold*1000) {
                    data.map( carIncident => {
                        if (carIncident.incidents[0].metadata === event.metadata) {
                            carIncident.incidents.push(event)
                        }
                    })
                }
            }
        }
    }
    return data 
}

exports.createEvent = (threshold, eventData) => {
    if (threshold === undefined || eventData === undefined) {
        throw new Error("Internal server error")
    }
    if (eventData.event_id === undefined || eventData.context === undefined || eventData.metadata === undefined || eventData.timestamp === undefined) {
        throw new Error("Invalid data")
    }
    const newEvent = {
        "event_id": eventData.event_id,
        "context": eventData.context,
        "metadata": eventData.metadata,
        "timestamp": eventData.timestamp
    }
    events.push(newEvent)
    try {
        exportData()
    } catch (error) {
        console.log(error)
    }
    return formatData(threshold)
}
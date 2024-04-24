import eventsData from '../data/events.json'

let events = eventsData

function exportData() {
    const path = process.cwd()+"\\src\\data\\events.json"
    require('fs').writeFile(path, JSON.stringify(events), (error) => {if (error) {throw error;} })
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
    return events
}
import Router from 'koa-router'
import getHealth from './health/health'
import {createEvent} from './events/events'
import {formatData} from './events/events'

const router = new Router()

router.get('/health', getHealth)

router.get('/api/event/threshold/:threshold', formatData)
router.post('/api/event/threshold/:threshold', createEvent)

export default router

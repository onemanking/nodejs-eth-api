import Router from 'koa-router'
import controller from './controllers/wallet.controller'

const router = new Router({ prefix: '/v1' })

router.get('/wallet/getBalance/', controller.getBalance)
router.get('/ether/getGasPrice/', controller.getGasPrice)
router.post('/wallet/sendEth', controller.sendEther)
router.post('/wallet/sendEtherWithPk', controller.sendEtherWithPk)

export default router
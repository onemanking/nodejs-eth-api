import Router from 'koa-router'
import wallet from './controllers/wallet.controller'
import ether from './controllers/ether.controller'

const router = new Router({ prefix: '/v1' })

router.get('/ether/getGasPrice/', ether.getGasPrice)
router.get('/wallet/getBalance/', wallet.getBalance)
router.post('/wallet/sendEth', wallet.sendEther)
router.post('/wallet/sendEtherWithPk', wallet.sendEtherWithPk)

export default router
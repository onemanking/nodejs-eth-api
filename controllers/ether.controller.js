import getCurrentGasPrice from '../libraries/getCurrentGasPrice'

const Ether =  { 
    getGasPrice: async ctx => {
        const gasPrice = await getCurrentGasPrice()

        ctx.body = gasPrice
    }
}

export default Ether
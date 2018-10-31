import axios from 'axios'
import { utils } from 'web3'

const getCurrentGasPrice = async isParseToWei => {
    const response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    const prices = !isParseToWei ? {
                    low: response.data.safeLow / 10,
                    medium: response.data.average / 10,
                    high: response.data.fast / 10
                } : {
                    low: utils.toWei((response.data.safeLow / 10).toString(), 'gwei'),
                    medium: utils.toWei((response.data.average / 10).toString(), 'gwei'),
                    high: utils.toWei((response.data.fast / 10).toString(), 'gwei')
                }

    const unit = isParseToWei ? 'WEI' : 'GWEI'
    console.log(`Current ETH Gas Prices (in ${unit}):`)
    console.log(`Low: ${prices.low} (transaction completes in < 30 minutes)`)
    console.log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`)
    console.log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`)

    return prices
}

export default getCurrentGasPrice
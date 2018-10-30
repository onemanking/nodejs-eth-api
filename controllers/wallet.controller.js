import config from '../config'
import Web3 from 'web3'
import axios from 'axios'

const networkToUse = `https://${config.network}.infura.io/v3/${config.apiKey}`
const web3 = new Web3(new Web3.providers.HttpProvider(networkToUse))

const getCurrentGasPrice = async isParseToWei => {
    const response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json')
    const prices = !isParseToWei ? {
                    low: response.data.safeLow / 10,
                    medium: response.data.average / 10,
                    high: response.data.fast / 10
                } : {
                    low: web3.utils.toWei((response.data.safeLow / 10).toString(), 'gwei'),
                    medium: web3.utils.toWei((response.data.average / 10).toString(), 'gwei'),
                    high: web3.utils.toWei((response.data.fast / 10).toString(), 'gwei')
                }
    console.log(`Current ETH Gas Prices (in GWEI):`)
    console.log(`Low: ${prices.low} (transaction completes in < 30 minutes)`)
    console.log(`Standard: ${prices.medium} (transaction completes in < 5 minutes)`)
    console.log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`)

    return prices
}

const Wallet = {
    getBalance: async ctx => {
        try {
            const { walletAddress } = ctx.query
            const balanceWei = await web3.eth.getBalance(walletAddress)
            const balance = await web3.utils.fromWei(balanceWei, 'ether')
            ctx.body = balance
        } catch (e) {
            ctx.status = 500
            ctx.message = `Cannot get wallet balance : ${e}` 
        }
    },
    getGasPrice: async ctx => {
        const gasPrice = await getCurrentGasPrice()

        ctx.body = gasPrice
    },
    sendEther: async ctx => {
        try {
            let { keystore, password, addressList, amountToSend } = ctx.request.body 
            if(!keystore) keystore = config.keystore
            if(!password) password = config.password
            if(!amountToSend) amountToSend = 0.0005123
            if(!Array.isArray(addressList)) addressList = [addressList]
            const decryptedAccount = web3.eth.accounts.decrypt(keystore, password)
            const gasPrice = await getCurrentGasPrice(true)
            const nonce = await web3.eth.getTransactionCount(decryptedAccount.address)
            const signedTxResult = []
            for (let i = 0; i < addressList.length; i++) {
                const address = addressList[i]
                const rawTransaction = {
                    'to': address,
                    'value': web3.utils.toWei(amountToSend.toString(), 'ether'),
                    'gas': 21000,
                    'gasPriace': gasPrice.high,
                    'nonce': nonce + i
                }
                const signedTx = decryptedAccount.signTransaction(rawTransaction)
                signedTxResult.push(signedTx)
            }
            
            const signedPromise = await Promise.all(signedTxResult)
            const transactionResult = []
            for (let i = 0; i < signedPromise.length; i++) {
                const signedTx = signedPromise[i]
                await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .on('transactionHash', tx => {
                    console.log(tx)
                })
                .on('receipt', receipt => {
                    console.log(receipt)
                    transactionResult[i] = receipt
                })
            }
            
            console.log(`Transactions success : ${transactionResult}`)
            ctx.body = { "Transactions result": transactionResult }
        } catch (e) {
            console.log(e)
            ctx.status = 500
            ctx.message = `Cannot send Ether : ${e}` 
        }
    },
    sendEtherWithPk: async ctx => {
        try {
            let { addressList, amountToSend } = ctx.request.body
            if(!Array.isArray(addressList)) addressList = [addressList]
            if(!amountToSend) amountToSend = 0.0005123
            const privateKey = `0x${config.privateKey}`
            const decryptedAccount = await web3.eth.accounts.privateKeyToAccount(privateKey)
            const gasPrice = await getCurrentGasPrice(true)
            const nonce = await web3.eth.getTransactionCount(decryptedAccount.address)
            const signedTxResult = []
            for (let i = 0; i < addressList.length; i++) {
                const address = addressList[i]
                const rawTransaction = {
                    'to': address,
                    'value': web3.utils.toWei(amountToSend.toString(), 'ether'),
                    'gas': 21000,
                    'gasPriace': gasPrice.high,
                    'nonce': nonce + i
                }
                const signedTx = decryptedAccount.signTransaction(rawTransaction)
                signedTxResult.push(signedTx)
            }
            
            const signedPromise = await Promise.all(signedTxResult)
            const transactionResult = []
            for (let i = 0; i < signedPromise.length; i++) {
                const signedTx = signedPromise[i]
                await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .on('transactionHash', tx => {
                    console.log(tx)
                })
                .on('receipt', receipt => {
                    console.log(receipt)
                    transactionResult[i] = receipt
                })
            }
            
            console.log(`Transactions success : ${transactionResult}`)
            ctx.body = { "Transactions result": transactionResult }
        } catch (e) {
            console.log(e)
            ctx.status = 500
            ctx.message = `Cannot send Ether : ${e}` 
        }
    }
}

export default Wallet
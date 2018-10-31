import config from '../config'
import Web3 from 'web3'
import getCurrentGasPrice from '../libraries/getCurrentGasPrice'

const networkToUse = `https://${config.network}.infura.io/v3/${config.apiKey}`
const web3 = new Web3(new Web3.providers.HttpProvider(networkToUse))

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
    sendEther: async ctx => {
        try {
            let { keystore, password, addressList, amount } = ctx.request.body 
            if(!keystore) keystore = config.keystore
            if(!password) password = config.password
            if(!amount) amount = 0.0005123
            if(!Array.isArray(addressList)) addressList = [addressList]
            const decryptedAccount = web3.eth.accounts.decrypt(keystore, password)
            const gasPrice = await getCurrentGasPrice(true)
            const nonce = await web3.eth.getTransactionCount(decryptedAccount.address)
            const signedTxResult = []
            for (let i = 0; i < addressList.length; i++) {
                const address = addressList[i]
                const rawTransaction = {
                    'to': address,
                    'value': web3.utils.toWei(amount.toString(), 'ether'),
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
            let { addressList, amount } = ctx.request.body
            if(!Array.isArray(addressList)) addressList = [addressList]
            if(!amount) amount = 0.0005123
            const privateKey = `0x${config.privateKey}`
            const decryptedAccount = await web3.eth.accounts.privateKeyToAccount(privateKey)
            const gasPrice = await getCurrentGasPrice(true)
            const nonce = await web3.eth.getTransactionCount(decryptedAccount.address)
            const signedTxResult = []
            for (let i = 0; i < addressList.length; i++) {
                const address = addressList[i]
                const rawTransaction = {
                    'to': address,
                    'value': web3.utils.toWei(amount.toString(), 'ether'),
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
import 'dotenv/config'

const config = {
    network: process.env.NETWORK,
    apiKey: process.env.API_KEY,
    port: process.env.PORT,
    privateKey: process.env.PRIVATE_KEY,
    keystore: process.env.KEYSTORE,
    password: process.env.PASSWORD
}

export default config
# nodejs-eth

1. npm i
2. create .env to setup env
3. npm start
4. use postman
    - GET : http://localhost:{config.port}/v1/wallet/getBalance/?walletAddress=YOURADDRESS : to get wallet balance
    - GET : http://localhost:{config.port}/v1/ether/getGasPrice : to get current gas price
    - POST : http://localhost:{config.port}/v1/wallet/sendEth require rawBody with keystoreV3, password, addressList and amountToSend : to send ether with Keystore
    - POST : http://localhost:{config.port}/v1/wallet/sendEthWithPk require rawBody with addressList and amountToSend : to send ether with Private Key

const https = require('https')
const fs = require('fs')

const package = require('../package.json')


const { clearpool: { contractsVersion } } = package
const abiLocalPath = './src/contracts/abis'
const abiRemotePath = `https://clearpool-finance.github.io/public-config/abis/eth/cpool/${contractsVersion}`

const abisToDownload = [
  'Auction.json',
  'CPOOL.json',
  'PoolBase.json',
  'PoolFactory.json',
  'PoolMaster.json',
  'MembershipStaking.json',
  'DefaultInterestRateModel.json',
  'CosineInterestRateModel.json'
]


const download = (abiFilename) => {

  console.log(`Downloading new version of ${contractsVersion}/${abiFilename}`)

  const file = fs.createWriteStream(`${abiLocalPath}/${abiFilename}`)

  https.get(`${abiRemotePath}/${abiFilename}`, (response) => {

    response.on('data', () => {
      if (response.statusCode !== 200) {
        console.error(abiFilename, response.statusMessage)
        process.exit(1)
      }
    })

    response.pipe(file)
  })
}

if (!fs.existsSync(abiLocalPath)) {
  fs.mkdirSync(abiLocalPath)
}

abisToDownload.map(download)

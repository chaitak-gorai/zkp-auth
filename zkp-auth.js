const elliptic = require('elliptic')
const ec = new elliptic.ec('secp256k1') // elliptic curve used by Bitcoin
const crypto = require('crypto')
function generateKeyPair() {
  const keyPair = ec.genKeyPair()
  const privateKey = keyPair.getPrivate()
  const publicKey = keyPair.getPublic()
  console.log('Private key: ', privateKey.toString(16))
  console.log('Public key: ', publicKey.encode('hex'))
  return { privateKey, publicKey }
}
const { users, writeUsers } = require('./users')
const EC = require('elliptic/lib/elliptic/ec')

function registerUser(publicKey, id) {
  users[id] = publicKey
  console.log(`User registered with ID: ${id}`)
  writeUsers(users)
}

function authenticate(id) {
  const challenge = crypto.randomBytes(32)
  console.log(`Challenge sent to user with ID: ${id}`)
  return challenge
}

function verifyZkp(challenge, signature, publicKey, id) {
  //   const key = users[id]
  //   if (!key) {
  //     throw new Error(`User not registered with ID     ${id}`)
  //   }
  //   console.log(key)
  //   const valid = key.verify(challenge, signature)
  //   console.log(`ZKP ${valid ? 'valid' : 'invalid'} for user with ID: ${id}`)
  //   return valid
  const ec = new EC('secp256k1')
  const parsedPublicKey = ec.keyFromPublic(publicKey, 'hex')
  if (!parsedPublicKey.validate()) {
    throw new Error(`Invalid public key for user with ID ${id}`)
  }

  const valid = parsedPublicKey.verify(challenge, signature)
  console.log(`ZKP ${valid ? 'valid' : 'invalid'} for user with ID: ${id}`)
  return valid
}

function sign() {
  const privKey = ec.keyFromPrivate(
    '13288b211a2ee8fe93b8fe249b0b39cd48afb87edc787c6b19a647bbbbcb1654',
    'hex'
  )
  const challenge = Buffer.from(
    'e7ef8f500898358775b46b51c7129e71541adbd38f9969fde062819061a9436c',
    'hex'
  )
  const signature = privKey.sign(challenge).toDER('hex')
  console.log(signature)
}
sign()
module.exports = { generateKeyPair, registerUser, authenticate, verifyZkp }

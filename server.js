const elliptic = require('elliptic')
const ec = new elliptic.ec('secp256k1')
const express = require('express')
const {
  registerUser,
  authenticate,
  verifyZkp,
  generateKeyPair,
} = require('./zkp-auth')
const app = express()

app.use(express.json())
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ZKP Auth' })
})
app.use('/generateKeys', (req, res) => {
  const { privateKey, publicKey } = generateKeyPair()
  res.json({
    privateKey: privateKey.toString(16),
    publicKey: publicKey.encode('hex'),
  })
})
app.post('/register', (req, res) => {
  console.log(req.body)
  const publicKey = ec.keyFromPublic(req.body.publicKey, 'hex')

  registerUser(publicKey, req.body.publicKey)
  return res.status(201).json({ message: 'User registered' })
})

app.post('/authenticate', (req, res) => {
  const challenge = authenticate(req.body.publicKey)
  res.json({ challenge: challenge.toString('hex') })
})

app.post('/verify', (req, res) => {
  const publicKey = ec.keyFromPublic(req.body.publicKey, 'hex')
  const signature = req.body.signature
  const challenge = Buffer.from(req.body.challenge, 'hex')
  const valid = verifyZkp(challenge, signature, publicKey, req.body.publicKey)
  res.json({ valid })
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})

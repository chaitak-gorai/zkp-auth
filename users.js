// users.js

const fs = require('fs')

const usersFilePath = './users.json'

function readUsers() {
  try {
    const data = fs.readFileSync(usersFilePath)
    return JSON.parse(data)
  } catch (err) {
    console.error(`Error reading users file: ${err}`)
    return {}
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users))
  } catch (err) {
    console.error(`Error writing users file: ${err}`)
  }
}

const users = readUsers()

module.exports = { users, writeUsers }

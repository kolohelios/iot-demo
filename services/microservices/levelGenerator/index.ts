import { readFile } from 'fs'
import * as mqtt from 'mqtt'
import * as Parse from 'parse/node'
import { promisify } from 'util'
import * as uuidv1 from 'uuid/v1'

const readFileAsync = promisify(readFile)

const connect = async (): Promise<void> => {
  const client = mqtt.connect('mqtt://services_mqtt_1', { port: 1883 })
  await new Promise((fulfilled) => {
    client.on('connect', fulfilled)
  })
  const applicationIDSecret = (await readFileAsync(
    '/run/secrets/parse_server_application_id'
  ))
    .toString()
    .replace('\n', '')
  const masterKey = (await readFileAsync(
    '/run/secrets/parse_server_master_key'
  ))
    .toString()
    .replace('\n', '')
  Parse.initialize(applicationIDSecret, masterKey)
  ;(Parse as any).serverURL = 'http://services_parse_1:1337/parse'

  const Levels = Parse.Object.extend('level')
  const query = new Parse.Query(Levels)

  let levels = await query.find()

  if (!levels.length) {
    const newLevels = []
    for (let i = 0; i < 3; i++) {
      // TODO add type for levels and use it here
      const newLevel: any = new Parse.Object('level')
      newLevel.set('levelId', uuidv1())
      newLevels.push(newLevel)
    }

    levels = await Parse.Object.saveAll(newLevels)
  }

  const levelIdArray = levels.map((level) => {
    return level.get('levelId')
  })

  setInterval(() => {
    levelIdArray.forEach((levelId) => {
      client.publish(
        `level/${levelId}/item`,
        Math.floor(Math.random() * 100).toString()
      )
    })
  }, 2 * 1000)
}

// TODO handle the error if it's a missing secret by throwing a meaningful error
connect().catch(console.error)

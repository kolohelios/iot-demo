import * as mqtt from 'mqtt'
import * as Parse from 'parse/node'
import * as uuidV1 from 'uuid/v1'
import { applicationIDSecret, masterKey } from '../common/secrets'

const connect = async (): Promise<void> => {
  const client = mqtt.connect('mqtt://services_mqtt_1', {
    port: 1883,
    clientId: 'levelGenerator',
  })
  await new Promise((fulfilled) => {
    client.on('connect', fulfilled)
  })

  Parse.initialize(await applicationIDSecret(), await masterKey())
  ;(Parse as any).serverURL = 'http://services_parse_1:1337/parse'

  const Levels = Parse.Object.extend('level')
  const query = new Parse.Query(Levels)

  let levels = await query.find()

  if (!levels.length) {
    const newLevels = []
    const numberOfLevelsToCreate = 3
    for (let i = 0; i < numberOfLevelsToCreate; i++) {
      // TODO add type for levels and use it here
      const newLevel: any = new Parse.Object('level')
      newLevel.set('levelId', uuidV1())
      newLevels.push(newLevel)
    }

    levels = await Parse.Object.saveAll(newLevels)
  }

  const levelIdArray = levels.map((level) => {
    return level.get('levelId')
  })

  const intervalInMilliseconds = 2000
  setInterval(() => {
    levelIdArray.forEach((levelId) => {
      client.publish(
        `level/${levelId}/item`,
        Math.floor(Math.random() * 100).toString()
      )
    })
  }, intervalInMilliseconds)
}

// TODO handle the error if it's a missing secret by throwing a meaningful error
connect().catch((error) => {
  throw new Error(error)
})

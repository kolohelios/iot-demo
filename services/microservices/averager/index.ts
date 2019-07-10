import * as mqtt from 'mqtt'
import * as Parse from 'parse/node'
import { applicationIDSecret, masterKey } from '../common/secrets'

interface ILevelsData {
  levels: number[]
  average: number
}

interface ILevelsDataDictionary {
  [index: string]: ILevelsData
}

const run = async (): Promise<void> => {
  const client = mqtt.connect('mqtt://services_mqtt_1', {
    port: 1883,
    clientId: 'averager',
  })
  // ERRATA we have to be careful about the placement of the "client.on('connect', ...)" call, because we may not hear the event if it's after something awaited
  await new Promise((fulfilled) => client.on('connect', () => fulfilled()))

  Parse.initialize(await applicationIDSecret(), await masterKey())
  ;(Parse as any).serverURL = 'http://services_parse_1:1337/parse'

  const levelsDataDictionary: ILevelsDataDictionary = {}

  const Levels = Parse.Object.extend('level')
  const query = new Parse.Query(Levels)

  const levels = await query.find()

  levels.forEach((level) => {
    const levelId = level.get('levelId')
    levelsDataDictionary[levelId] = {
      levels: [],
      average: 0,
    }
  })

  Object.keys(levelsDataDictionary).forEach((levelId) =>
    client.subscribe(`level/${levelId}/item`)
  )

  client.on('message', (topic, message) => {
    const levelId = (topic.match(/.+\/(.+)\/.+/) || [])[1] || ''

    levelsDataDictionary[levelId].levels.push(parseInt(message.toString(), 10))
  })

  client.on('error', (error) => {
    // tslint:disable-next-line: no-console
    console.log(error)
  })

  setInterval(() => {
    Object.keys(levelsDataDictionary).forEach((levelKey) => {
      const levelsFromDictionary = levelsDataDictionary[levelKey].levels
      if (levelsFromDictionary.length) {
        const sum = levelsFromDictionary.reduce((acc: number, v) => acc + v, 0)
        levelsDataDictionary[levelKey].average =
          sum / levelsFromDictionary.length
      }

      client.publish(
        `level/${levelKey}/item/avg`,
        levelsDataDictionary[levelKey].average.toString()
      )

      levelsDataDictionary[levelKey].levels = []
    })
  }, 10 * 1000)
}

// TODO handle the error if it's a missing secret by throwing a meaningful error
run().catch((error) => {
  throw new Error(error)
})

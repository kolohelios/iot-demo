import { readFile } from 'fs'
import * as Parse from 'parse/node'
import { promisify } from 'util'

const readFileAsync = promisify(readFile)

const connect = async (): Promise<void> => {
  // TODO change to use /run/secrets when the dev tooling is updated
  const applicationIDSecret = (await readFileAsync(
    '../secrets/parse_server_application_id'
    // '/run/secrets/parse_server_application_id'
  ))
    .toString()
    .replace('\n', '')
  const masterKey = (await readFileAsync(
    // TODO change to use /run/secrets when the dev tooling is updated
    '../secrets/parse_server_master_key'
    // '/run/secrets/parse_server_master_key'
  ))
    .toString()
    .replace('\n', '')
  Parse.initialize(applicationIDSecret, masterKey)
  ;(Parse as any).serverURL = 'http://localhost:1337/parse'

  const Levels = Parse.Object.extend('level')
  const query = new Parse.Query(Levels)

  const levels = await query.find()
  console.log(levels)
}

// TODO handle the error if it's a missing secret by throwing a meaningful error
connect().catch(console.error)

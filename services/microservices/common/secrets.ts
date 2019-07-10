import { readFile } from 'fs'
import { promisify } from 'util'

const readFileAsync = promisify(readFile)

const fetchSecret = async (secretPath: string) => {
  const secret = (await readFileAsync(secretPath)).toString().replace('\n', '')
  return secret
}

export const applicationIDSecret = async () => {
  const secretPath = '/run/secrets/parse_server_application_id'

  return fetchSecret(secretPath)
}

export const masterKey = async () => {
  const secretPath = '/run/secrets/parse_server_master_key'

  return fetchSecret(secretPath)
}

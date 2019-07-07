const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');

const secretsDirectory = process.env.SECRETS_DIRECTORY;

const secretsDirectoryList = fs.readdirSync(secretsDirectory);

Object.keys(process.env).forEach((envItemKey) => {
  const [fullStringMatched, secretName] =
      process.env[envItemKey].match(/{{DOCKER-SECRET:(.+)}}$/) || [];

  if (!secretName) {
    // nothing to do here
    return;
  } else if (secretsDirectoryList.indexOf(secretName) === -1) {
    console.error(`Unable to expand secret; be sure to include a secret file named "${
        secretName}" in your /secrets directory that contains the secret value. Exiting.`);
    process.exit(1);
  } else {
    console.log(`Matching secret for environmental variable named ${
        envItemKey} that is mapped to value ${fullStringMatched}.`);
    const secretFileContents = fs.readFileSync(
        path.join(secretsDirectory, secretName), {encoding: 'UTF8'});
    // TODO as this approach is limited and as-is won't allow multi-line secret
    // values (like JSON files), we should add functionality to more safely trim
    // only the last new line character
    const secretValue = secretFileContents.replace('\n', '');
    process.env[envItemKey] = secretValue;
  }
});

const parseServer = exec('node ./bin/parse-server');
parseServer.stdout.on('data', (data) => {
  console.log(data.toString());
});
parseServer.stderr.on('data', (data) => {
  console.log(data.toString());
});

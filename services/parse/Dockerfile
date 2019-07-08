FROM parseplatform/parse-server

COPY expandSecrets.js /usr/bin
ENV SECRETS_DIRECTORY /run/secrets
ENV PARSE_SERVER_APPLICATION_ID {{DOCKER-SECRET:parse_server_application_id}}
ENV PARSE_SERVER_MASTER_KEY {{DOCKER-SECRET:parse_server_master_key}}
ENV PARSE_SERVER_DATABASE_URI mongodb://services_parse-db_1/parse
ENTRYPOINT [ "node" ]
CMD [ "/usr/bin/expandSecrets.js" ]

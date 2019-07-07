FROM parseplatform/parse-server

CMD [ "--appId",  "$(< /run/secrets/parse_app_id)", "--masterKey", "$(< /run/secrets/parse_master_key)", "--databaseURI", "mongodb://iot-demo_parse-db_1/parse" ]

#!/bin/bash
set -x
cd "$(dirname "$0")"
docker exec -i mysql mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} < ./CREATE_TABLES.sql
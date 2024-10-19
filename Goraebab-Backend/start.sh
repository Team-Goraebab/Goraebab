#!/bin/bash

DBMS=$1
DB_USERNAME="root"
DB_PASSWORD="root"


if [[ "$DBMS" == "mysql" ]]; then
    DB_URL="jdbc:mysql://172.17.0.1:3306/goraebab"
    DB_DRIVER_CLASS_NAME="com.mysql.cj.jdbc.Driver"
elif [[ "$DBMS" == "postgresql" ]]; then
    DB_URL="jdbc:postgresql://172.17.0.1:5432/goraebab"
    DB_DRIVER_CLASS_NAME="org.postgresql.Driver"
elif [[ "$DBMS" == "oracle" ]]; then
    DB_URL="jdbc:oracle:thin:@172.17.0.1:1521:goraebab"
    DB_DRIVER_CLASS_NAME="oracle.jdbc.driver.OracleDriver"
elif [[ "$DBMS" == "sqlserver" ]]; then
    DB_URL="jdbc:sqlserver://172.17.0.1:1433;databaseName=goraebab"
    DB_DRIVER_CLASS_NAME="com.microsoft.sqlserver.jdbc.SQLServerDriver"
else
    echo "Unknown DBMS. Choose between 'mysql', 'postgresql', 'oracle', 'sqlserver'."
    exit 1
fi

export DB_URL
export DB_USERNAME
export DB_PASSWORD
export DB_DRIVER_CLASS_NAME

docker-compose up "$DBMS" -d
docker-compose up backend -d


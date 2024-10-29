#!/bin/bash

DBMS=$1


if [[ "$DBMS" == "mysql" ]]; then
    DB_URL="jdbc:mysql://172.18.0.20:3306/goraebab"
    DB_DRIVER_CLASS_NAME="com.mysql.cj.jdbc.Driver"
elif [[ "$DBMS" == "mariadb" ]]; then
    DB_URL="jdbc:mariadb://172.18.0.20:3306/goraebab"
    DB_DRIVER_CLASS_NAME="org.mariadb.Driver"
elif [[ "$DBMS" == "postgresql" ]]; then
    DB_URL="jdbc:postgresql://172.18.0.20:5432/goraebab"
    DB_DRIVER_CLASS_NAME="org.postgresql.Driver"
elif [[ "$DBMS" == "oracle" ]]; then
    DB_URL="jdbc:oracle:thin:@172.18.0.20:1521/XEPDB1"
    DB_DRIVER_CLASS_NAME="oracle.jdbc.driver.OracleDriver"
elif [[ "$DBMS" == "sqlserver" ]]; then
    DB_URL="jdbc:sqlserver://172.18.0.20:1433;databaseName=goraebab"
    DB_DRIVER_CLASS_NAME="com.microsoft.sqlserver.jdbc.SQLServerDriver"
else
    echo "Unknown DBMS. Choose between 'mysql', 'mariadb', 'postgresql'."
    exit 1
fi


docker-compose -f docker-compose."$DBMS".yml up -d


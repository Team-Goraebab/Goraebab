CREATE
DATABASE goraebab
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template0
    CONNECTION LIMIT = -1;

\c goraebab;

CREATE TABLE daemon
(
    id           BIGSERIAL PRIMARY KEY,
    host         VARCHAR(255) NOT NULL,
    port         INTEGER      NOT NULL,
    name         VARCHAR(255) NOT NULL,
    date_created TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE storage
(
    id       BIGSERIAL PRIMARY KEY,
    host     VARCHAR(255) NOT NULL,
    port     INTEGER      NOT NULL,
    dbms     VARCHAR(50)  NOT NULL,
    name     VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_created TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blueprint
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    data       TEXT        NOT NULL,
    is_remote  BOOLEAN,
    storage_id BIGINT,
    FOREIGN KEY (storage_id) REFERENCES storage (id),
    date_created TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
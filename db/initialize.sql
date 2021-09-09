CREATE DATABASE students;

\c students

CREATE TABLE users (
    id SERIAL primary key,
    username text NOT NULL UNIQUE,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL
);

CREATE TABLE lessons (
    id SERIAL primary key,
    lesson_date TIMESTAMP NOT NULL,
    teacher integer REFERENCES users(id),
    student integer REFERENCES users(id),
    date_created TIMESTAMP NOT NULL default now()
);

CREATE TABLE notes (
    id SERIAL primary key,
    content text NOT NULL,
    date_created TIMESTAMP NOT NULL default now(),
);
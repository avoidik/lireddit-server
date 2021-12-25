#!/bin/bash

docker run --rm --name postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=database \
  -p 5432:5432 \
  -d \
  postgres:14

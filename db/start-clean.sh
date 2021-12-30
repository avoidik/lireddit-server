#!/bin/bash

docker run --rm --name postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=database \
  -p 5432:5432 \
  -d \
  postgres:14 -c 'shared_buffers=256MB' -c 'max_connections=10'

docker run --rm --name redis \
  -e REDIS_PASSWORD=password \
  -p 6379:6379 \
  -d \
  redis:6 /bin/sh -c 'redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}'

#!/bin/sh

if [ "$1" = 'redis-cluster' ]; then
    sleep 10
    IP=`ifconfig | grep "inet addr:17" | cut -f2 -d ":" | cut -f1 -d " "`
    echo "yes" | ruby /redis/src/redis-trib.rb create --replicas 0 ${IP}:7000 ${IP}:7001 ${IP}:7002
    echo "DONE"
else
  exec "$@"
fi

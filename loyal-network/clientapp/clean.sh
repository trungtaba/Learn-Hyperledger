#!/bin/bash

docker stop $(docker ps -aq)
docker rm -f $(docker ps -aq)
images=$(docker images)
for i in "${images[@]}"
do
	echo Removing image : $i
    docker rmi -f $i
done

#docker rmi -f $(docker images | grep none)
images=( dev-shop-peer dev-fitcoin-peer)
for i in "${images[@]}"
do
	echo Removing image : $i
  docker rmi -f $(docker images | grep $i )
done

docker rmi $(docker images -f "dangling=true" -q)

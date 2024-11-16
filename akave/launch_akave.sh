#!/bin/bash

# Parametre kontrolü
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <public_node_address> <private_key>"
  exit 1
fi

# Parametreleri değişkenlere atama
PUBLIC_NODE_ADDRESS=$1
PRIVATE_KEY=$2

# Docker container'ı çalıştırma
docker run -d \
  -p 8000:3000 \
  -e NODE_ADDRESS="$PUBLIC_NODE_ADDRESS" \
  -e PRIVATE_KEY="$PRIVATE_KEY" \
  akave/akavelink:latest

if [ $? -eq 0 ]; then
  echo "Docker container started susccessfully!"
else
  echo "An error occured while docker container starting."
fi
#!/bin/bash

if [ -z $1 ]; then
    dir=$(dirname $(realpath $(dirname $(dirname $0))))
else
    dir=$(realpath $1)
fi

if [ ! -d $dir ]; then
    echo "Project directory not found"
    exit 1
fi

cp $dir/.env.sample $dir/.env

if [ ! -f $dir/compose/dev/.env ]; then
    echo -en "ROOT=$dir\nCOMPOSE_PROJECT_NAME=laborator-compose" > $dir/compose/dev/.env
fi

echo -e "Development environment initialization complete, to start the project run:\n$ docker-compose -f $dir/compose/dev/docker-compose.yml up -d"
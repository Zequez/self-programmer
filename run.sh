#!/bin/bash
denon run --allow-net --allow-read --allow-run --unstable --config ./tsconfig.json --importmap ./import_map.json ./main.ts $1

#!/bin/bash
# TODO: Not sure why these don't work
# --config tsconfig.json --importmap importmap.json
deno run --allow-net --allow-read --allow-run --unstable --importmap importmap.json ./main.ts start

#!/bin/sh
# PN59INH => Connect High-Priority schedule
curl 'https://hudl.pagerduty.com/api/v1/schedules/PN59INH/overrides/' \
  -X POST \
  -H 'cookie: xxx-xxx-xxx' \
  -H 'sec-fetch-mode: cors' \
  -H 'origin: https://hudl.pagerduty.com' \
  -H 'accept-encoding: gzip, deflate, br' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'x-requested-with: XMLHttpRequest' \
  -H 'x-pagerduty-api-local: 1' \
  -H 'content-type: application/json' \
  -H 'accept: application/vnd.pagerduty+json;version=2' \
  -H 'referer: https://hudl.pagerduty.com/schedules' \
  -H 'authority: hudl.pagerduty.com' \
  -H 'sec-fetch-site: same-origin' \
  -H 'dnt: 1' \
  --data-binary '{"override":{"start":"2019-11-29T09:30:00.000Z","end":"2019-11-29T17:30:00.000Z","user":{"id":"xxx-xxx-xxx","type":"user"}}}' \
  --compressed

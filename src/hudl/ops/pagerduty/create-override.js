#!/usr/bin/env node
const yargs = require('yargs');
const fetch = require('node-fetch');

async function main() {
  const argv = yargs.argv;

  if (argv.helpMe) {
    help();
    return;
  }

  const {
    schedule,
    startDate,
    startTime,
    endDate,
    endTime,
    user,
    cookie,
  } = argv;

  if (!schedule || !startDate || !user) {
    console.error('Invalid input, need to provide at least schedule, startDate and user');
    return;
  }

  if (!cookie) {
    console.warn('You probably want to provide cookie. Use `document.cookie` from PD > JavaScript Console to get logged-in value');
  }

  const url = `https://hudl.pagerduty.com/api/v1/schedules/${schedule}/overrides`;
  const data = {
    override: {
      start: `${startDate}T${startTime || '09:30:00'}.000Z`,
      end: `${endDate || startDate}T${endTime || '17:30:00'}.000Z`,
      user: {
        id: user,
        type: 'user',
      },
    },
  };

  const decodedCookie = Buffer.from(cookie, 'base64').toString('ascii');

  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      referrer: 'https://hudl.pagerduty.com/schedules',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/vnd.pagerduty+json;version=2',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Cookie': decodedCookie,
        'DNT': 1,
        'Pragma': 'no-cache',
        'X-PagerDuty-Api-Local': '1',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    const { override } = await response.json();
    console.log('Override created:', override);
  } catch (error) {
    console.log(error);
  }
}

function help() {
  console.log(
    ' _____                      _____        _         _       _    _ _____                  _         \n',
    '|  __ \                    |  __ \      | |       ( )     | |  | |_   _|                | |        \n',
    '| |__) |_ _  __ _  ___ _ __| |  | |_   _| |_ _   _|/ ___  | |  | | | |    ___ _   _  ___| | _____  \n',
    '|  ___/ _` |/ _` |/ _ \ ,__| |  | | | | | __| | | | / __| | |  | | | |   / __| | | |/ __| |/ / __| \n',
    '| |  | (_| | (_| |  __/ |  | |__| | |_| | |_| |_| | \__ \ | |__| |_| |_  \__ \ |_| | (__|   <\__\  \n',
    '|_|   \__ _|\__  |\___|_|  |_____/ \__ _|\__|\__  | |___/  \____/|_____| |___/\__ _|\___|_|\_\___/ \n',
    '             __/ |                            __/ |                                                \n',
    '            |___/                            |___/                                                   '
  );

  console.log('Arguments:', [
    'schedule',
    'user',
    'cookie (base64 encoded e.g. `Buffer.from("<cookie>").toString("base64")` in Node or `btoa(document.cookie)` in JavaScript Console)',
    'startDate',
    'startTime (optional, defaults to 09:30, relative to your user timezone preference)',
    'endDate (optional, defaults to $startDate)',
    'endTime (optional, defaults to 17:30, relative to your user timezone preference)',
  ]);

  console.log('Schedules:', {
    'Connect High Urgency': 'PN59INH',
    'Connect Low Urgency': 'P77U0AW',
    'First Tier': 'PZY553V',
  });

  console.log('Steps to use:', [
    'Open browser Dev Tools',
    'Manually create the first override',
    'Open POST request; check request headers; copy Cookie value',
    'Convert Cookie value to Base64; pass in via --cookie'
  ]);
}

main();

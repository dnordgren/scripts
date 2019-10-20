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
    endTime,
    user,
    cookie,
    fullWeek,
  } = argv;

  if (!schedule || !startDate || !user) {
    console.error('Invalid input, need to provide at least schedule, startDate and user');
    return;
  }

  if (!cookie) {
    console.warn('You probably want to provide cookie. Use `document.cookie` from PD > JavaScript Console to get logged-in value');
  }

  const dates = [ startDate ];

  if (fullWeek) {
    const monday = new Date(startDate);

    // Ensure we set up the overrides M-F.
    if (monday.getDay() !== 1) {
      console.warn('You selected to schedule for the full week via --fullWeek, but the provided date isn\'t a Monday');
      return;
    }

    let theNextDay = monday;
    for (let i = 0; i < 4; i++) {
      // Increment day by one, M-F.
      theNextDay.setDate(theNextDay.getDate() + 1);
      // Add date to array in YYYY-MM-DD format.
      dates.push(`${theNextDay.getFullYear()}-${theNextDay.toLocaleDateString("en-US", { month: "2-digit" })}-${theNextDay.toLocaleDateString("en-US", { day: "2-digit" })}`);
    }
  }

  const requestDataPerDay = dates.map(date => ({
    override: {
      start: `${date}T${startTime || '09:30:00'}.000Z`,
      end: `${date}T${endTime || '17:30:00'}.000Z`,
      user: { id: user, type: 'user' },
    },
  }));

  const url = `https://hudl.pagerduty.com/api/v1/schedules/${schedule}/overrides`;
  const decodedCookie = Buffer.from(cookie, 'base64').toString('ascii');

  dates.forEach(async (date, index) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        referrer: 'https://hudl.pagerduty.com/schedules',
        body: JSON.stringify(requestDataPerDay[index]),
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
      console.error(`Failed to create override for date ${date}`, error);
    }
  });
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
    'endTime (optional, defaults to 17:30, relative to your user timezone preference)',
    'fullWeek (optional, defaults to false, schedules M-F)',
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
    'Convert Cookie value to Base64; pass in via --cookie',
  ]);
}

main();

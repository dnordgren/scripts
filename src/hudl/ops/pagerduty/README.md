## Documentation
Run `--helpMe`; it'll print helpful stuff.

## Sample Request
```
./create-override.js \
  --schedule PN59INH \ # Connect High-Urgency
  --startDate 2019-10-26 \
  --user P27DPYJ \ # Me
  --fullWeek \ # Schedules M-F
  --cookie base64Cookie
```

## Ideas
- [x] Make it schedule entire week for user via 5 requests.
- [ ] Hard-code map of Engineer:PagerDuty ID so --user can be argument like 'Derek'

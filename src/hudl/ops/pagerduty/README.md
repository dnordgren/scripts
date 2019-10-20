## Documentation
Run `--helpMe`; it'll print helpful stuff.

## Sample Request
```
./create-override.js \
  --schedule PN59INH \ # Connect High-Urgency
  --startDate 2019-10-26 \
  --user P27DPYJ \ # Me
  --cookie base64Cookie
```

## Ideas
* Make it schedule entire week for user via 5 requests.
  * Validate it's Monday and use `Date-Fns` or similar to find valid days.

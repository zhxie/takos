<p align="center">
  <img src="/assets/icons/256x256.png">
</p>

# Takos

[![GitHub release](https://img.shields.io/github/release/zhxie/Takos.svg)](https://github.com/zhxie/takos/releases/latest)

**Takos** is a cross-platform schedule and battle statistic client of Splatoon 2.

## Features

- Automatic cookie generation of SplatNet
- Get current and coming schedules and shifts
- Get battles and jobs with details including weapons and gears
- View battles and jobs with filter
- Analyze battles and jobs in statistics
- Order gears in SplatNet Gear Shop
- English (North America), Japanese and Chinese

## Security and Privacy

### Automatic Cookie Generation

Takos uses cookies to access SplatNet, get schedule and battle data. This cookie may be obtained automatically using Automatic Cookie Generation which is also instructed in [splatnet2statink/Cookie Generation](https://github.com/frozenpandaman/splatnet2statink#cookie-generation). Please read the following paragraph CAREFULLY before you use Automatic Cookie Generation.

Automatic Cookie Generation involves making a secure request to **two non-Nintendo servers** with minimal, non-identifying information. For details, please refer to [splatnet2statink/api docs](https://github.com/frozenpandaman/splatnet2statink/wiki/api-docs). The developers aim to be 100% transparent about this and provide in-depth information in [splatnet2statink/Cookie Generation/Automatic](https://github.com/frozenpandaman/splatnet2statink#automatic)'s privacy statement.

If you do not want to use Automatic Cookie Generation for obtaining cookie, you may also retrieve one by intercepting into the device's traffic with SplatNet, which is also called MitM. You may follow the [splatnet2statink/mitmproxy instructions](https://github.com/frozenpandaman/splatnet2statink/wiki/mitmproxy-instructions) to get one, and fill in the app's Cookie textbox.

## License

Takos is licensed under [the MIT License](/LICENSE).

Takos uses API of [splatnet2statink](https://github.com/frozenpandaman/splatnet2statink) by [eli fessler](https://github.com/frozenpandaman), flapg API by [NexusMine](https://twitter.com/NexusMine) and [Splatoon2.ink](https://github.com/misenhower/splatoon2.ink) API by [Matt Isenhower](https://github.com/misenhower).

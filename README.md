# PureYt
Chromium based YouTube extension that
- removes "Shorts" and "Trending" sections
- removes videos whose title contains banned regex expression in banned.json
- removes videos from channels in banned.json

## Usage
In browser, enable developer mode in Extension tab and load this directory.

Customize `banned.json` to filter video titles or channels. E.g.,
```json
{
    "banWords": [
        "!$",
        "^Meet",
        "^You won't",
        "^I tried",
        "^Can I",
        "^Surpris",
        "^How",
        "^Why",
        "^Could"
    ],
    "banChannels": [
        "MrBeast",
        "Jordan Matter"
    ]
}


```

## After
<img src="./res/after.png" width="800" height="600">

## Before
<img src="./res/before.png" width="800" height="600">


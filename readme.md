# node-lyrics

> Get the lyrics to your favorite songs (via LyricWikia API)

## Requirements

* node.js

## Install

```
$ npm install --save node-lyrics
```

## Usage

```js
const lyrics = require('node-lyrics');

const albums = await lyrics.getAlbums('Local Natives');
/*
[
    'Gorilla Manor',
    'Hummingbird',
    'Sunlit Youth',
    'Violet Street'
]
*/
```

## v2
* Supports Promises!
* `getTopSongs` was deprecated

## API

Besides the methods provided by default, I've added 2 new methods:

* **getAlbums**
* **parseLyrics**

### getAlbums(artist, options, callback)

Fetches the **artist** albums. [Array]

#### options (object)

**ignore**: none (default), 'Unreleased', 'B-Sides', 'Other Songs'. (string or array)

---

### getArtist(artist, options, callback)

Gets the **artist** albums. [Object]

#### options (object)

**fmt** (format): JSON (default), XML, HTML  
**ignore**: none (default), 'Unreleased', 'B-Sides', 'Other Songs'. (string or array)

---

### getHometown(artist, options, callback)

Gets the **artist** country, state and hometown info. [Object]

#### options (object)

**fmt** (format): JSON (default), XML, HTML

---

### getSOTD(options, callback)

Returns the song of the day. [Object]

#### options (object)

**fmt** (format): JSON (default), XML, HTML

---

### getSong(artist, song, options, callback)

Returns the URL to the song's lyrics and the lyric's beginning. [Object]

#### options (object)

**fmt** (format): JSON (default), XML, HTML

---

### parseLyrics(artist, song, callback)
DISCLAIMER: This method uses web scraping to grab the song's lyrics.

Returns the lyrics for the song. [Object]

---

**DEPRECATED**

~~### getTopSongs(artist, options, callback)~~

---

## License

MIT © Ricardo Matias

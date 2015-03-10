# node-lyrics [![Build Status](https://travis-ci.org/ricardomatias/node-lyrics?branch=master)](https://travis-ci.org/ricardomatias/node-lyrics)

> LyricWikia API client written in node.js

## Requirements

* node.js

## Install

```
$ npm install --save node-lyrics
```

## Usage

```js
var lyrics = require('node-lyrics');

lyrics.getAlbums('Radiohead', function(err, albums) {
    if (err) {
        // do something
    }
    console.log(albums)
});
```

## API

Besides the methods provided by default, I've added 2 new methods.

**getAlbums** and **parseLyrics**

### getAlbums(artist, options, callback)

Fetches the **artist** albums. [Array]

#### options (object)

**Ignore**: none (default), 'Unreleased', 'B-Sides', 'Other Songs'. (string or array)

### getArtist(artist, options, callback)

Gets the **artist** albums. [Object]

#### options (object)

**fmt** (format): JSON (default), XML, HTML
**ignore**: none (default), 'Unreleased', 'B-Sides', 'Other Songs'. (string or array)

### getHometown(artist, options, callback)

Gets the **artist** country, state and hometown info. [Object]

#### options (object)

**fmt** (format): JSON (default), XML, HTML

### getSOTD(artist, options, callback)

Returns the song of the day. [Object]

#### options (object)

**fmt** (format): JSON (default), XML, HTML

### getTopSongs(artist, options, callback)

Returns the top songs. [Object]

#### options (object)

**fmt** (format): JSON (default), XML, HTML

### getTopSongs(artist, options, callback)

Returns the top songs. [Object]

#### options (object)

**fmt** (format): JSON (default), XML, HTML

### getSong(artist, song, options, callback)

Returns the url to the song's lyrics and the lyric's beginning. [Object]

#### options (object)

**fmt** (format): JSON (default), XML, HTML

### parseLyrics(artist, song, callback)
DISCLAIMER: This method uses web scraping to grab the song's lyrics.

Returns the lyrics for the song. [Object]

## License

MIT © Ricardo Matias

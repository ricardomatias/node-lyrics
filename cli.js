#!/usr/bin/env node --no-warnings

const { Readable } = require('stream');
const meow = require('meow');
const chalk = require('chalk');
const { parseLyrics, getAlbums, getArtist } = require('./');

const cli = meow(chalk`
  {yellow.bold Usage}
      $ lyrics <action> [-c]
  {yellow.bold Actions}
      song - ex: lyrics song <artist> <song>
      artist - ex: lyrics artist <artist>
      album - ex: lyrics album <artist> [album]
  {yellow.bold Options}
      -c, --clean  Just lyrics without title
  {yellow.bold Examples}
      $ {green.bold lyrics} radiohead reckoner
      {grey > radiohead - reckoner [In Rainbows]}
      {grey > Reckoner,}
      {grey > You can't take it with you, ..}
`, {
    flags: {
        clean: {
            type: 'boolean',
            alias: 'c',
            default: false,
        },
    }
});

const actions = ['song', 'artist', 'album' ];

const [action, ...args] = cli.input;

if (!actions.includes(action) || !args.length) {
    cli.showHelp();
}

const capitalize = (word) => (word.substr(0, 1).toUpperCase() + word.substr(1, word.length));

const getSongLyrics = async (artist, song, silent = false) => {
    const res = await parseLyrics(artist, song);

    let lyrics = res.lyrics.split('\n').map((line) => {
        if (line[0] == ',') {
            line = line.substr(1, line.length);
        }
        return line;
    }).join('\n');

    let title = `${capitalize(artist)} - ${song} [${res.album}]\n\n`;

    if (cli.flags.clean) {
        title = '';
    }

    const body = `${title}${lyrics}`;

    if (!silent) {
        console.log(body);
    }

    return body;
}

async function main(action, args) {
    if (action === 'song') {
        getSongLyrics(...args);
    }

    if (action === 'artist') {
        const [artist] = args;
        const res = await getArtist(artist);
        const albums = res.albums.map((elem) => {
            const songs = elem.songs.map((song) => (`   - ${song}`)).join('\n');

            if (elem.album[0] == ',') {
                elem.album = elem.album.substr(1, elem.album.length);
            }

            return `${elem.album} (${elem.year})\n${songs}\n`;
        });

        const body = `${capitalize(artist)}\n\n${albums.join('\n')}`;

        console.log(body);
    }

    if (action === 'album') {
        if (args.length === 1) {
            const [artist] = args;
            const albums = await getAlbums(artist);

            console.log(albums);
        } else {
            const [artist, album] = args;

            const res = await getArtist(artist);
            const albums = res.albums.map((elem) => elem.album.toLowerCase());
            const albumIdx = albums.findIndex((alb) => alb === album.toLowerCase());

            const songs = res.albums[albumIdx].songs.map((song) => (song.toLowerCase()));

            const requests = Promise.all(songs.map(async (song) => await getSongLyrics(artist, song, true)));

            requests.then((lyrics) => {
                console.log(lyrics.join('\n\n'));
            });
        }
    }
}

main(action, args);

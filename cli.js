#!/usr/bin/env node

const { Readable } = require('stream');
const meow = require('meow');
const chalk = require('chalk');
const { parseLyrics } = require('./');

const cli = meow(chalk`
  {yellow.bold Usage}
      $ lyrics [artist] [song] [-c]
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

const [artist, song] = cli.input;

if (!artist || !song) {
    cli.showHelp();
}

const main = async () => {
    const res = await parseLyrics(artist, song);
    let lyrics = res.lyrics.split('\n').map((line) => {
        if (line[0] == ',') {
            line = line.substr(1, line.length);
        }
        return line;
    }).join('\n');

    let title = `${artist} - ${song} [${res.album}]\n\n`;

    if (cli.flags.clean) {
        title = '';
    }

    const body = `${title}${lyrics}`;

    const outStream = new Readable({ read() {} });

    outStream.push(body);

    outStream.pipe(process.stdout);
}

main();

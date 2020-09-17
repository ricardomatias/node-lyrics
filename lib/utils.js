'use strict';

exports.LYRICS_API = 'https://lyrics.fandom.com/api.php';

exports.parseJSON = function(data) {
    try {
        var text = data && data.replace(/^\s*|\s*$/g, '');
        return text && JSON.parse(text);
    } catch (e) {
        throw new Error('There was an issue parsing the response.');
    }
};

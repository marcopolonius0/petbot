// This is a script used for testing the locale system. Useful for finding locale errors, learning the locale system or otherwise messing around.
// The locale system also handles:
// Command messages
// Command descriptions (used in /help)
// Pet descriptions (used in /petinfo)

// Requires fs. To use the locale, also requires text.js in './locale/text.js'.
const fs = require('fs');
const text = require('./locale/text.js');

// Fetch locales.
let locale = {};
const localeFiles = fs.readdirSync('./locale').filter(file => file.endsWith('.json'));
for(const file of localeFiles){
    const lang = require(`./locale/${file}`);
    if(!lang.version || lang.version != 1) continue;
    locale[lang.name] = lang;
};

// Send locale data to be able to use it. Requires text.js.
text.update(locale);

// Example usage. Requires text.js.
const test = text.text({lang:'en',msg:'test_message'});
console.log(test);

// Combine strings to make some messages make sense.
const test2 = `${text.text({lang:'en',msg:'missing_permissions'})}ADMINISTRATOR`;
// Longer alternative: const test2 = text.text({lang:'en',msg:'missing_permissions'}) + 'ADMINISTRATOR';
console.log(test2);

// Fetch locale. Only useful for debugging. Otherwise, should not be used, especially in the main file.
const fetchedLocale = text.locale();
console.log('- Output of fetchedLocale:\n| ' + JSON.stringify(fetchedLocale.en.messages));

// An example using discord.js code (will NOT work unless you set up discord.js in this file).
/*
message.channel.send(text.text({lang:guild.lang, msg:'unknown_error'}) + 'if you want, you could add something like a variable here. Not required.')
*/
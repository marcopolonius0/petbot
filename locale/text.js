// Define variables:
const {readdirSync} = require('fs');

// Locale is stored here for use within the function.
let locale = {};
const localeFiles = readdirSync('./locale').filter(file => file.endsWith('.json'));
for(const file of localeFiles){
    const lang = require(`./${file}`);
    if(!lang.version || lang.version != 1) continue;
    locale[lang.name] = lang;
};

module.exports = {
    // Return a message. Handles basically all errors for you gracefully.
    // Params:
    // data.lang: any supported language name defined in the .json locale files;
    // data.msg: any message within the "messages" defined in the .json locale files;
    // Example usage can be found in '../localetest.js'.
    text(data){
        if(!data.lang || !locale[data.lang]) data.lang = 'en';
        let msg = locale[data.lang].messages[data.msg];
        if(!msg) msg = locale[data.lang].messages['undefined'] + `'${data.msg}'`;
        return msg;
    },
    // Returns command description in corrct locale.
    cmdDescription(data){
        if(!data.lang || !locale[data.lang]) data.lang = 'en';
        let msg = locale[data.lang].commands[data.cmd];
        if(!msg) msg = locale[data.lang].messages['undefined'] + `'${data.cmd}'`;
        return msg;
    },
    // Returns pet description in correct locale.
    petDescription(data){
        if(!data.lang || !locale[data.lang]) data.lang = 'en';
        let msg = locale[data.lang].pets.descriptions[data.pet];
        if(!msg) msg = locale[data.lang].messages['undefined'] + `'${data.pet}'`;
        return msg;
    },
    // Returns stat name in correct locale.
    stats(data){
        if(!data.lang || !locale[data.lang]) data.lang = 'en';
        let msg = locale[data.lang].stats[data.stat];
        if(!msg) msg = locale[data.lang].messages['undefined'] + `'${data.stat}'`;
        return msg;
    },
    // Returns event name and description in correct locale.
    events(data){
        if(!data.lang || !locale[data.lang]) data.lang = 'en';
        let msg = locale[data.lang].events[data.event];
        if(!msg) msg = {name:`${locale[data.lang].messages['undefined']}'${data.event}'`,description:`${locale[data.lang].messages['undefined']}'${data.event}'`};
        return msg;
    },
    // Returns raw locale data, useful for debugging.
    locale(){
        return locale;
    }
};
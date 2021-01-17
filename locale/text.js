// Locale is stored here for use within the function.
let locale;

module.exports = {
    // Update locale data, could be used to reset locale without restarting bot. Required on startup.
    update(data){
        locale = data;
    },
    // Return a message. Handles basically all errors for you gracefully.
    // Params:
    // data.lang: any supported language name defined in the .json locale files;
    // data.msg: any message within the "messages" defined in the .json locale files;
    // Example usage can be found in '../localetest.js'.
    text(data){
        if(!data.lang || !locale[data.lang]) data.lang = 'en';
        let msg = locale[data.lang].messages[data.msg];
        if(!msg)
            msg = locale[data.lang].messages['undefined'] + `'${data.msg}'`;
        return msg;
    },
    // Returns command description in corrct locale.
    cmdDescription(data){
        if(!data.lang || !locale[data.lang]) data.lang = 'en';
        let msg = locale[data.lang].commands[data.cmd];
        if(!msg)
            msg = locale[data.lang].messages['undefined'] + `'${data.msg}'`;
        return msg;
    },
    // Returns pet description in correct locale.
    petDescription(data){
        if(!data.lang || !locale[data.lang]) data.lang = 'en';
        let msg = locale[data.lang].pets.descriptions[data.pet];
        if(!msg)
            msg = locale[data.lang].messages['undefined'] + `'${data.pet}'`;
        return msg;
    },
    // Returns raw locale data, useful for debugging.
    locale(){
        return locale;
    }
};
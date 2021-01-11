const locale = require('../locale/text.js');

module.exports = {
    name: 'locale',
    syntax:'/locale [print/line ID] [all/language]',
    admin: true,
    execute(message,args,db){
        if(!args[0]) return message.channel.send(locale.text({lang:'en',msg:'test_message'}));
        if(args[0] == 'print'){
            let i = locale.locale(); // Fetch full locale from text.js. Usually not a good idea unless debugging.
            if(args[1]){
                if(args[1] == 'all') return message.channel.send(`\`\`\`json\n${JSON.stringify(i)}\`\`\``);
                return message.channel.send(`\`\`\`json\n${JSON.stringify(i[args[1]])}\`\`\``);
            }
            return message.channel.send(`\`\`\`json\n${JSON.stringify(i['en'])}\`\`\``);
        };
        if(args[1]) return message.channel.send(locale.text({lang:args[1],msg:args[0]}));
        return message.channel.send(locale.text({lang:args[0],msg:'test_message'}));
    }
};
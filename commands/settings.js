const locale = require('../locale/text.js');

module.exports = {
    name:'settings',
    aliases:['setting'],
    syntax:'/settings [language] [options]',
    admin:false,
    async execute(message,args,db){
        let userdata = await db.maindb.get(message.author.id);
        if(!args[0]) return message.channel.send(locale.text({lang:db.lang,msg:"syntax_error"})+this.syntax);
        if(args[0] == 'lang' || args[0] == 'language'){
            if(!args[1]) return message.channel.send(locale.text({lang:db.lang,msg:"syntax_options"})+"`/settings language [english/french]`");
            if(args[1] == 'en' || args[1] == 'english'){
                userdata.lang = 'en';
                await db.maindb.set(message.author.id,userdata);
                return message.channel.send(locale.text({lang:userdata.lang,msg:"new_language"}));
            };
            if(args[1] == 'fr' || args[1] == 'french'){
                userdata.lang = 'fr';
                await db.maindb.set(message.author.id,userdata);
                return message.channel.send(locale.text({lang:userdata.lang,msg:"new_language"}));
            };
            return message.channel.send(locale.text({lang:db.lang,msg:"syntax_options"})+"`/settings language [english/french]`");
        };
        return message.channel.send(locale.text({lang:db.lang,msg:"syntax_error"})+this.syntax);
    }
};
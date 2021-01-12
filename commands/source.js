const Discord = require('discord.js');
const locale = require('../locale/text.js');

module.exports = {
    name:'source',
    syntax:'/source',
    admin:false,
    execute(message,args,db){
        let msg = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTimestamp()
            .setTitle(locale.text({lang:db.lang,msg:"source_title"}))
            .setDescription(locale.text({text:db.lang,msg:"source_description"}));
        return message.channel.send(msg);
    }
};
const {MessageEmbed} = require('discord.js');
const locale = require('../locale/text.js');

module.exports = {
    name:'stats',
    aliases:['statistics','stat'],
    syntax:'/stats [@user]',
    admin:false,
    async execute(message,args,db){
        let user = message.mentions.users.first();
        if(!user) user = message.author;
        let data = await db.petsdb.get(user.id);
        if(!data || !data.stats) return;
        let msg = new MessageEmbed()
            .setColor('#AAAAAA')
            .setTitle(`Statistics for ${user.tag}:`)
            .setDescription(`These are some statistics of your usage:\n`)
            .setTimestamp();
        for(const i in data.stats){
            let statname = locale.stats({lang:db.lang,stat:i});
            msg.setDescription(msg.description + `\n${statname}${data.stats[i]}`);
        };
        return message.channel.send({embed:msg,split:true});
    }
};
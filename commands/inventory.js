const Discord = require('discord.js');
const itemdata = require('../items/items.json');

module.exports = {
    name:'inventory',
    syntax:'/inventory',
    admin:false,
    async execute(message,args,db){
        let userpets = await db.petsdb.get(message.author.id);
        let msg = new Discord.MessageEmbed()
            .setTitle(`${message.author.username}'s Inventory:`)
            .setColor('#DDDDAA')
            .setTimestamp()
            .setDescription(`**Tokens:**\n${userpets.tokens.count} tokens\n`);
        let items = {};
        for(const i in userpets.items){
            let item = userpets.items[i];
            if(items[item.id]){
                items[item.id].count += 1;
                continue;
            };
            items[item.id] = {
                id:item.id,
                count:1
            };
        };
        for(const i in items){
            let itemdb = items[i];
            let item = itemdata.items[itemdb.id];
            msg.setDescription(msg.description + `\n**${itemdb.count}x** ${item.displayName}`);
        };
        return message.channel.send({embed:msg,split:true});
    }
};
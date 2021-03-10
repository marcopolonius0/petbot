const { MessageEmbed } = require('discord.js');
const itemdata = require('../items/items.json');

module.exports = {
    name:'inventory',
    syntax:'/inventory [@user]',
    aliases:['inv','i'],
    admin:false,
    async execute(message,args,db){
        let user = message.mentions.users.first();
        if(!user) user = message.author;
        let userpets = await db.petsdb.get(user.id);
        let msg = new MessageEmbed()
            .setTitle(`${user.username}'s Inventory:`)
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
        msg.setDescription(msg.description + `\n**Items:**\nUse \`/sell [item name]\` to sell an item.`);
        for(const i in items){
            let itemdb = items[i];
            let item = itemdata.items[itemdb.id];
            msg.setDescription(msg.description + `\n**${itemdb.count}x** ${item.displayName} (${Math.floor(item.price*0.5)} tokens)`);
        };
        return message.channel.send({embed:msg,split:true});
    }
};
const {MessageEmbed} = require("discord.js");
const items = require('../items/items.json');
const locale = require('../locale/text.js');
const eventinfo = require('../events/events.json');

module.exports = {
    name:'shop',
    aliases:['s'],
    syntax:'/shop',
    admin:false,
    async execute(message,args,db){
        let msg = new MessageEmbed()
            .setColor('#d1d1d1')
            .setTitle(`${locale.text({lang:db.lang,msg:"shop_title"})}`)
            .setDescription(`${locale.text({lang:db.lang,msg:"shop_description"})}\n`)
            .setTimestamp();
        for(const i in items.items){
            const item = items.items[i];
            if(!item.purchaseable) continue;
            if(item.startTime && item.startTime > Date.now()) continue;
            if(item.endTime && item.endTime < Date.now()) continue;
            if(item.event){
                let event = eventinfo.events[item.event];
                if(event.startTime > Date.now()) continue;
                if(event.endTime < Date.now()) continue;
            };
            if(item.endTime || item.event) msg.setDescription(msg.description + `\nLIMITED: **${item.displayName}** (${Math.floor(item.price)} tokens)`);
            else msg.setDescription(msg.description + `\n**${item.displayName}** (${Math.floor(item.price)} tokens)`);
        };
        return message.channel.send({embed:msg,split:true});
    }
};
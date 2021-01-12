const Discord = require("discord.js");
const Item = require('../items/item.js');
const items = require('../items/items.json');
const locale = require('../locale/text.js');

module.exports = {
    name:'shop',
    syntax:'/shop [buy/sell] [item]',
    admin:false,
    async execute(message,args,db){
        if(!args[0]){
            let msg = new Discord.MessageEmbed()
                .setColor('#d1d1d1')
                .setTitle(`${locale.text({lang:db.lang,msg:"shop_title"})} `)
                .setDescription(`${locale.text({lang:db.lang,msg:"shop_description"})} `)
                .setTimestamp();
            for(const i in items.items){
                const item = items.items[i];
                if(!item.obtainable) continue;
                msg.addField(item.displayName,`Buy price: ${Math.floor(item.price)}\nSell price: ${Math.floor(item.price*0.5)}`);
            };
            return message.channel.send({embed:msg,split:true});
        };
        if(args[0] == 'buy' && args[1]){
            let query = args; query.shift();
            let item = Item.searchItemByName({args:query});
            if(!item) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_found"}));
            if(!item.obtainable) return message.channel.send(locale.text({lang:db.lang,msg:"item_unobtainable"}));
            let userpets = await db.petsdb.get(message.author.id);
            if(userpets.tokens.count < Math.floor(item.value)) return message.channel.send(locale.text({lang:db.lang,msg:"no_funds"}));
            userpets.tokens.count -= Math.floor(item.value);
            userpets = Item.giveItem({id:item.id,userpets:userpets});
            await db.petsdb.set(message.author.id,userpets);
            return message.channel.send(locale.text({lang:db.lang,msg:"bought_item"})+`${item.displayName}.`);
        };
        if(args[0] == 'sell' && args[1]){
            let query = args; query.shift();
            let item = Item.searchItemByName({args:query});
            if(!item) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_found"}));
            if(!item.obtainable) return message.channel.send(locale.text({lang:db.lang,msg:"item_unobtainable"}));
            let userpets = await db.petsdb.get(message.author.id);
            if(!Item.hasItem({id:item.id,userpets:userpets})) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_owned"}))
            userpets.tokens.count += Math.floor(item.value*0.5);
            userpets = Item.removeItem({id:item.id,userpets:userpets});
            await db.petsdb.set(message.author.id,userpets);
            return message.channel.send(locale.text({lang:db.lang,msg:"sold_item"})+`${item.displayName}.`);
        };
        return message.channel.send(locale.text({lang:db.lang,msg:"syntax_error"})+this.syntax);
    }
};
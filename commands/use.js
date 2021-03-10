const locale = require('../locale/text.js');
const Item = require('../items/item.js');
const {tradingUsers} = require('../commands/trade.js');

module.exports = {
    name:'use',
    aliases:['u'],
    syntax:'/use [item name]',
    admin:false,
    async execute(message,args,db){
        if(tradingUsers[message.author.id]) return message.channel.send(locale.text({lang:db.lang,msg:"in_trade"}));
        if(!args[0]) return message.channel.send(locale.text({lang:db.lang,msg:"syntax"})+this.syntax);
        let userpets = await db.petsdb.get(message.author.id), item = Item.searchItemByName({args:args});
        if(!item) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_found"}));
        let index = Item.hasItem({id:item.id,userpets:userpets});
        if(index == null) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_owned"}));
        if(!item.useable) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_useable"}));
        if(!userpets.stats.itemsUsed) userpets.stats.itemsUsed = 0;
        userpets.stats.itemsUsed += 1;
        userpets = await Item.useItem({userpets:userpets,itemIndex:index});
        await db.petsdb.set(message.author.id,userpets);
        return message.channel.send(locale.text({lang:db.lang,msg:"item_used"})+item.displayName);
    }
};
const Item = require('../items/item.js');
const locale = require('../locale/text.js');

module.exports = {
    name: 'sell',
    syntax: '/sell [owned item]',
    admin: false,
    async execute(message,args,db){
        if(!args[0]) return message.channel.send(locale.text({lang:db.lang,msg:"syntax_error"})+this.syntax);
        let item = Item.searchItemByName({args:args});
        if(!item) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_found"}));
        if(!item.salable) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_salable"}));
        let userpets = await db.petsdb.get(message.author.id);
        if(!Item.hasItem({id:item.id,userpets:userpets})) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_owned"}))
        userpets.tokens.count += Math.floor(item.price*0.5);
        if(!userpets.stats.itemsSold) userpets.stats.itemsSold = 0;
        userpets.stats.itemsSold += 1;
        userpets = await Item.removeItem({id:item.id,userpets:userpets});
        await db.petsdb.set(message.author.id,userpets);
        return message.channel.send(locale.text({lang:db.lang,msg:"sold_item"})+`${item.displayName}.`);
    }
};
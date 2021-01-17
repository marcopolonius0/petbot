const locale = require('../locale/text.js');
const Item = require('../items/item.js');

module.exports = {
    name:'use',
    syntax:'/use [item name]',
    admin:false,
    async execute(message,args,db){
        if(!args[0]) return message.channel.send(locale.text({lang:db.lang,msg:"syntax"})+this.syntax);
        let userpets = await db.petsdb.get(message.author.id);
        let item = Item.searchItemByName({args:args});
        if(!item) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_found"}));
        let index = Item.hasItem({id:item.id,userpets:userpets});
        if(index == null) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_owned"}));
        if(!item.useable) return message.channel.send(locale.text({lang:db.lang,msg:"item_not_useable"}));
        if(!userpets.stats.itemsUsed) userpets.stats.itemsUsed = 0;
        userpets.stats.itemsUsed += 1;
        let data = await Item.useItem({userpets:userpets,itemIndex:index});
        if(!data) return message.channel.send(locale.text({lang:db.lang,msg:"unknown_error"}));
        userpets = data;
        await db.petsdb.set(message.author.id,userpets);
        return message.channel.send(locale.text({lang:db.lang,msg:"item_used"})+item.displayName);
    }
};
const locale = require('../locale/text.js');
const Pet = require('../pets/pet.js');
const Item = require('../items/item.js');

module.exports = {
    name:'petadmin',
    aliases:['padmin','pa'],
    syntax:'/petadmin [user ID/mention] [r/ap/dp/ai/di]',
    admin:true,
    async execute(message,args,db){
        // Validation checks...
        if(!args[0] || !args[1]) return message.channel.send(locale.text({lang:db.lang,msg:"syntax_error"})+this.syntax);
        let user = message.mentions.users.first();
        if(!user) user = await message.client.users.fetch(args[0],true);
        if(!user) return message.channel.send(locale.text({lang:db.lang,msg:"syntax_error"})+this.syntax);
        let userpets = await db.petsdb.get(user.id);
        if(!userpets) return message.channel.send('No data found for this user.');

        // Print users data:
        if(args[1] == 'print' || args[1] == 'read' || args[1] == 'r'){
            if(args[2]) return message.channel.send('```json\n'+JSON.stringify(userpets)+'```');
            return message.channel.send('```json\n'+JSON.stringify(userpets,null,"\t")+'```');
        };
        
        // Add a new pet
        if(args[1] == 'addpet' || args[1] == 'ap'){
            if(!args[2]) return message.channel.send('Make sure to specify a Pet ID. The syntax would be `/petadmin <@user> ap <Pet ID> [level] [exp] [age]`');
            if(args[2] in userpets.pets) return message.channel.send('This user already has this pet.');
            userpets.pets[args[2]] = new Pet({
                id: args[2],
                level: Number(args[3]) || undefined,
                exp: Number(args[4]) || undefined,
                age: Number(args[5]) || undefined
            });
            await db.petsdb.set(user.id,userpets);
            return message.channel.send(`Successfully added \`${args[2]}\` as a pet to user ${user.tag}.`);
        };

        // Remove an existing pet
        if(args[1] == 'delpet' || args[1] == 'dp'){
            if(!args[2]) return message.channel.send('Make sure to specify a Pet ID. The syntax would be `/petadmin <@user> dp <Pet ID>`');
            if(!args[2] in userpets.pets) return message.channel.send('This user does not have this pet.');
            if(userpets.activePet == args[2]) userpets.activePet = null;
            delete userpets.pets[args[2]];
            await db.petsdb.set(user.id,userpets);
            return message.channel.send(`Successfully removed pet \`${args[2]}\` from user ${user.tag}.`);
        };

        // Add an item
        if(args[1] == 'additem' || args[1] == 'ai'){
            if(!args[2]) return message.channel.send('Make sure to specify a Item ID. The syntax would be `/petadmin <@user> ai <Item ID>`');
            userpets = await Item.giveItem({
                id:args[2],
                userpets:userpets
            });
            await db.petsdb.set(user.id,userpets);
            return message.channel.send(`Successfully added \`${args[2]}\` as an item to user ${user.tag}.`);
        };

        // Delete an item
        if(args[1] == 'delitem' || args[1] == 'di'){
            if(!args[2]) return message.channel.send('Make sure to specify a Item ID. The syntax would be `/petadmin <@user> di <Item ID>`');
            if(!Item.hasItem({id:args[2],userpets:userpets})) return message.channel.send('This user does not have this item.');
            userpets = await Item.removeItem({id:args[2],userpets:userpets});
            await db.petsdb.set(user.id,userpets);
            return message.channel.send(`Successfully removed item \`${args[2]}\` from user ${user.tag}.`)
        };

        // None of the above:
        return message.channel.send(locale.text({lang:db.lang,msg:"syntax_error"})+this.syntax);
    }
};
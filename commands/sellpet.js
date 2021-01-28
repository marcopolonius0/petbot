const {MessageEmbed} = require('discord.js');
const Pet = require('../pets/pet.js');
const locale = require('../locale/text.js');

module.exports = {
    name:'sellpet',
    aliases:['sp'],
    syntax:'/sellpet [pet name]',
    admin:false,
    async execute(message,args,db){
        if(!args[0]) return message.channel.send(locale.text({lang:db.lang,msg:"syntax_error"})+"`/sellpet [pet name]`");
        let userpets = await db.petsdb.get(message.author.id);
        const pet = await Pet.searchByName({args:args,userdata:userpets});
        if(pet == null) return message.channel.send(locale.text({lang:db.lang,msg:"no_owned_pets_with_name"}));
        if(pet.value == 0) return message.channel.send(locale.text({lang:db.lang,msg:"pet_no_value"}));
        const value = new Number(pet.value)*userpets.tokens.multiplier
        userpets.tokens.count += value;
        if(userpets.activePet == pet.id) userpets.activePet = null;
        delete userpets.pets[pet.id];
        if(!userpets.stats.petsSold) userpets.stats.petsSold = 0;
        userpets.stats.petsSold += 1;
        await db.petsdb.set(message.author.id,userpets);
        let msg = new MessageEmbed()
            .setColor('#00FF00')
            .setTitle(`Successfully sold ${pet.displayName}:`)
            .attachFiles([`./pets/sprites/${pet.sprite}`])
            .setImage(`attachment://${pet.sprite}`)
            .setDescription(`You sold ${pet.displayName} for ${value} tokens.\nYou are now at ${userpets.tokens.count} tokens.`)
            .setTimestamp();
        return message.channel.send(msg);
    }
};
const Discord = require('discord.js');
const locale = require('../locale/text');
const Pet = require('../pets/pet.js');
const petinfo = require('../pets/pets.json');

module.exports = {
    name:'petinfo',
    syntax:'/petinfo [pet name]',
    admin:false,
    async execute(message,args,db){
        if(!args[0]) return message.channel.send(locale.text({lang:db.lang,msg:"syntax_error"})+this.syntax);
        let searchedPet = await Pet.searchByName({args:args});
        if(searchedPet == null) return message.channel.send(locale.text({lang:db.lang,msg:"no_pets_with_name"}));
        const userpets = await db.petsdb.get(message.author.id);
        let owned = false;
        if(userpets.pets[searchedPet.id]) owned = true;
        let msg = new Discord.MessageEmbed()
            .setColor('#DD00DD')
            .setTitle(`Information on ${searchedPet.displayName}:`)
            .attachFiles([`./pets/sprites/${searchedPet.sprite}`])
            .setImage(`attachment://${searchedPet.sprite}`)
            .setDescription(`Description: ${locale.petDescription({lang:db.lang,pet:searchedPet.id})}\nRarity: ${searchedPet.rarity}\nToken Value: ${searchedPet.value} tokens\nObtainable from claim wheel: ${(searchedPet.obtainable)?"Yes":"No"}\nOwned: ${(owned)?"Yes":"No"}`)
            .setTimestamp();
        if(searchedPet.evolution){
            let evolutions = [];
            for(const p of searchedPet.evolution){
                let name = petinfo.pets[p].displayName;
                evolutions.push(name);
            };
            msg.setDescription(msg.description + `\nEvolution(s): ${evolutions.join('; ')}.`);
        };
        return message.channel.send(msg);
    }
};
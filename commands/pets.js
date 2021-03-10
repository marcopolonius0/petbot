const { MessageEmbed } = require('discord.js');
const locale = require('../locale/text.js');
const petinfo = require('../pets/pets.json');

module.exports = {
    name: 'pets',
    aliases:['p'],
    syntax:'/pets [@user]',
    admin: false,
    async execute(message,args,db){
        let user = message.mentions.users.first();
        if(!user) user = message.author;
        let userpets = await db.petsdb.get(user.id);
        if(Object.keys(userpets.pets).length < 1) return message.channel.send(locale.text({lang:db.lang,msg:"no_pets"}));
        // Base embed
        let msg = new MessageEmbed()
            .setColor('#dd00dd')
            .setTitle(`${user.username}'s Pet Inventory:`);
        // Token count (if any)
        if(userpets.tokens.count > 0){
            msg.addField('Tokens:',`${userpets.tokens.count} tokens.`);
        };
        // Active pet (if any)
        if(userpets.activePet){
            let pet = userpets.pets[userpets.activePet];
            if(pet.level > 9){
                msg.addField('Active Pet:',`Name: ${petinfo.pets[userpets.activePet].displayName}\nLevel: ${pet.level}\nEXP: MAX/MAX`);
            } else {
                msg.addField('Active Pet:',`Name: ${petinfo.pets[userpets.activePet].displayName}\nLevel: ${pet.level}\nEXP: ${pet.exp}/${petinfo.req.base[pet.level] * petinfo.req[petinfo.pets[pet.id].rarity]}`);
            };
        };
        // Other pets (if any)
        if(userpets.pets){
            let otherPets = [];
            for(const p in userpets.pets){
                let pet = petinfo.pets[p];
                if(pet.id == userpets.activePet) continue;
                otherPets.push(pet.displayName);
            };
            try {
                msg.addField('Other Pets:',otherPets.join('\n'));
            } catch (error) {
                msg.addField('Other Pets:','none');
            };
        };
        return message.channel.send(msg);
    }
};
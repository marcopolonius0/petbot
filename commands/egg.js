const { MessageEmbed } = require('discord.js');
const Pet = require('../pets/pet.js');
const locale = require('../locale/text.js');
const petinfo = require('../pets/pets.json');
const { tradingUsers } = require('../commands/trade.js');

module.exports = {
    name:'egg',
    syntax:'/egg',
    admin:false,
    event:'easter-2021',
    async execute(message,args,db){
        if(tradingUsers[message.author.id]) return message.channel.send(locale.text({lang:db.lang,msg:"in_trade"}));
        let userpets = await db.petsdb.get(message.author.id);
        if(!userpets.claimCooldown){
            userpets.claimCooldown = 0;
            await db.petsdb.set(message.author.id,userpets);
            userpets = await db.petsdb.get(message.author.id);
        };
        if(Date.now() < userpets.claimCooldown) return message.channel.send(locale.text({lang:db.lang,msg:"claim_cooldown"}));
        userpets.claimCooldown = Date.now() + 21600000;
        if(userpets.stats.totalClaimed == undefined) userpets.stats.totalClaimed = 0;
        userpets.stats.totalClaimed += 1;
        let newPet = new Pet({event:this.event});
        let petstats = petinfo.pets[newPet.id];
        let msg = new MessageEmbed().setTitle(`Pet claim: ${petstats.displayName}`);
        if(newPet.id in userpets.pets){
            const value = new Number(petstats.value) * userpets.tokens.multiplier;
            if(userpets.stats.petDuplicates == undefined) userpets.stats.petDuplicates = 0;
            userpets.stats.petDuplicates += 1;
            userpets.tokens.count += value;
            await db.petsdb.set(message.author.id,userpets);
            msg.setColor('#FF0000')
                .attachFiles([`./pets/sprites/${petstats.sprite}`])
                .setImage(`attachment://${petstats.sprite}`)
                .setDescription(`You have this pet in your inventory! As compensation, you received ${value} tokens.`)
                .setTimestamp();
            return message.channel.send(msg);
        };
        userpets.pets[newPet.id] = newPet;
        if(userpets.stats.petsClaimed == undefined) userpets.stats.petsClaimed = 0;
        userpets.stats.petsClaimed += 1;
        await db.petsdb.set(message.author.id,userpets);
        msg.setColor('#00FF00')
            .attachFiles([`./pets/sprites/${petstats.sprite}`])
            .setImage(`attachment://${petstats.sprite}`)
            .setDescription(`You unlocked ${petstats.displayName}! It was added to your collection.`)
            .setTimestamp();
        return message.channel.send(msg);
    }
};
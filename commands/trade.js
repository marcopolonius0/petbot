const { MessageEmbed } = require('discord.js');
const { admins } = require('../private/config.json');
const Pet = require('../pets/pet.js');
const Item = require('../items/item.js');
const petinfo = require('../pets/pets.json');
const iteminfo = require('../items/items.json');
const locale = require('../locale/text.js');

// Function used to update the trading interface:
async function updateEmbed(embed, user1, user2){
    for(const i in embed.fields){
        let field = embed.fields[i];
        // Update user 1...
        if(field.name.endsWith(`| ${user1.username}'s offer:`)){
            // Update whether the trade was confirmed:
            field.name = `${user1.confirmed ? '☑️' : '⛔'} | ${user1.username}'s offer:`
            let value = '';
            // Update the listed pets:
            for(const i in user1.offer.pets){
                let tradePet = user1.offer.pets[i];
                let petName = petinfo.pets[tradePet.id].displayName;
                value = `${value}\n${petName}`;
            };
            // Update the listed items:
            for(const i in user1.offer.items){
                let tradeItem = user1.offer.items[i];
                let itemName = iteminfo.items[tradeItem.id].displayName;
                value = `${value}\n${itemName}`;
            };
            // If nothing is being traded, set it to 'Empty!':
            if(value == ''){
                field.value = 'Empty!';
            } else {
                field.value = value;
            };
        };
        // Update user 2...
        if(field.name.endsWith(`| ${user2.username}'s offer:`)){
            // Update whether the trade was confirmed:
            field.name = `${user2.confirmed ? '☑️' : '⛔'} | ${user2.username}'s offer:`
            let value = '';
            // Update the listed pets:
            for(const i in user2.offer.pets){
                let tradePet = user2.offer.pets[i];
                let petName = petinfo.pets[tradePet.id].displayName;
                value = `${value}\n${petName}`;
            };
            // Update the listed items:
            for(const i in user2.offer.items){
                let tradeItem = user2.offer.items[i];
                let itemName = iteminfo.items[tradeItem.id].displayName;
                value = `${value}\n${itemName}`;
            };
            // If nothing is being traded, set it to 'Empty!':
            if(value == ''){
                field.value = 'Empty!';
            } else {
                field.value = value;
            };
        };
    };
    return embed;
};

module.exports = {
    name:'trade',
    aliases:[],
    syntax:'/trade [@user]',
    admin:false,
    async execute(message,args,db){
        let user1 = message.author;
        if(this.tradingUsers[user1.id]) return message.channel.send(locale.text({lang:db.lang,msg:"in_trade"}));

        let user2 = message.mentions.users.first();

        if(!user2){
            if(!args[0]) return message.channel.send(locale.text({lang:db.lang,msg:"no_user_trade"}));
            try {
                user2 = await message.client.users.fetch(args[0]);
            } catch {
                return message.channel.send(locale.text({lang:db.lang,msg:"no_user_trade"}));
            };
        };

        if(!user2) return message.channel.send(locale.text({lang:db.lang,msg:"no_user_trade"}));
        if(this.tradingUsers[user2.id]) return message.channel.send(locale.text({lang:db.lang,msg:"in_trade"}));
        if(user1.id == user2.id) return message.channel.send(`You can't trade with yourself.`);
        if(user1.bot || user2.bot) return message.channel.send(`You can't trade with a bot.`);

        user1.offer = {pets:{},items:[]};
        user1.confirmed = false;
        user2.offer = {pets:{},items:[]};
        user2.confirmed = false;

        let data = {};
        data[user1.id] = await db.petsdb.get(user1.id);
        data[user2.id] = await db.petsdb.get(user2.id);
        if(!data[user1.id] || !data[user2.id]) return msg.channel.send('A database error occured.');
        if(Object.keys(data[user1.id].pets).length < 1) return message.channel.send(locale.text({lang:db.lang,msg:"no_pets"}));
        if(Object.keys(data[user2.id].pets).length < 1) return message.channel.send(locale.text({lang:db.lang,msg:"no_pets"}));

        this.tradingUsers[user1.id] = true;
        this.tradingUsers[user1.id] = true;

        let embed = new MessageEmbed()
            .setColor('#AA11AA')
            .setTitle(`Trading interface:`)
            .setDescription('⏫ | To add a pet to the trade, press the ⏫ reaction.\n⏬ | To remove a pet from the trade, press the ⏬ reaction.\n⬆️ | To add an item to the trade, press the ⬆️ reaction.\n⬇️ | To remove an item from the trade, press the ⬇️ reaction.\n✅ | To confirm the trade, press the ✅ reaction.\n❌ | To cancel the trade, press the ❌ reaction.')
            .addField(`⛔ | ${user1.username}'s offer:`,"Empty!")
            .addField(`⛔ | ${user2.username}'s offer:`,"Empty!")
            .setTimestamp();
        const msg = await message.channel.send(embed);

        await msg.react('⏫');
        await msg.react('⏬');
        await msg.react('⬆️');
        await msg.react('⬇️');
        await msg.react('✅');
        await msg.react('❌');

        const filter = (reaction,user) => (user.id == user1.id || user.id == user2.id) || (reaction.emoji.name == '❌' && admins.includes(user.id));
        const collector = msg.createReactionCollector(filter,{time:300000});

        collector.on('collect', async (reaction,user) => {
            if(reaction.emoji.name == '⏫'){
                // Add a pet to the trade:
                let curUser;
                let otherUser;
                if(user.id == user1.id) {curUser = user1; otherUser = user2};
                if(user.id == user2.id) {curUser = user2; otherUser = user1};
                if(!curUser) return;

                const addPetMsg = await reaction.message.channel.send(`${user.username}, please type the name of one of your pets. To see a list use \`/pets\`.`);
                
                const messageFilter = (m) => (m.author.id == user.id);
                const messageCollector = reaction.message.channel.createMessageCollector(messageFilter, {time: 15000});

                messageCollector.on('collect', async usermsg => {
                    let args = usermsg.content.split(/ +/);
                    let pet = await Pet.searchByName({args:args,userpets:data[curUser.id]});
                    if(pet){
                        if(!pet.tradeable){
                            msg.channel.send('You cannot trade this pet.');
                            usermsg.delete();
                            addPetMsg.delete();
                            return messageCollector.stop();
                        };

                        if(pet.id in data[otherUser.id].pets){
                            msg.channel.send('Your trading partner already has this pet.');
                            usermsg.delete();
                            addPetMsg.delete();
                            return messageCollector.stop();
                        };

                        if(user.id == user1.id){
                            if(pet.id in user1.offer.pets){
                                msg.channel.send('This pet is already in the offer.');
                                usermsg.delete();
                                addPetMsg.delete();
                                return messageCollector.stop();
                            };
                            user1.offer.pets[pet.id] = data[user1.id].pets[pet.id];
                            delete data[user1.id].pets[pet.id];
                        };

                        if(user.id == user2.id){
                            if(pet.id in user2.offer.pets){
                                msg.channel.send('This pet is already in the offer.');
                                usermsg.delete();
                                addPetMsg.delete();
                                return messageCollector.stop();
                            };
                            user2.offer.pets[pet.id] = data[user2.id].pets[pet.id];
                            delete data[user2.id].pets[pet.id];
                        };

                        embed = await updateEmbed(embed, user1, user2);
                        await msg.edit({embed:embed});
                        msg.channel.send(`Successfully added ${pet.displayName} to the trade.`);
                        usermsg.delete();
                        addPetMsg.delete();
                        collector.resetTimer({time:300000});
                        messageCollector.stop();
                    } else {
                        if(!msg.content.startsWith('/')) msg.channel.send('Please type the name of one of your owned pets to add it to the trade.');
                    };
                });

                messageCollector.on('end', (collected, reason) => {
                    if(reason == 'time') return reaction.message.channel.send('Time for adding a pet expired.');
                    return;
                });
            };

            if(reaction.emoji.name == '⏬'){
                // Remove a pet from the trade:
                let curUser;
                if(user.id == user1.id) curUser = user1;
                if(user.id == user2.id) curUser = user2;
                if(!curUser) return;

                const removePetMsg = await reaction.message.channel.send(`${user.username}, please type the name of a pet in the trade to remove.`);

                const messageFilter = (m) => (m.author.id == user.id);
                const messageCollector = reaction.message.channel.createMessageCollector(messageFilter, {time: 15000});

                messageCollector.on('collect', async usermsg => {
                    let args = usermsg.content.split(/ +/);
                    let pet = await Pet.searchByName({args:args,userpets:curUser.offer});

                    if(!pet){
                        message.channel.send('This pet is not in the trade.');
                        usermsg.delete();
                        removePetMsg.delete();
                        return messageCollector.stop();
                    };
                    
                    if(curUser.id == user1.id){
                        data[curUser.id].pets[pet.id] = user1.offer.pets[pet.id];
                        delete user1.offer.pets[pet.id];
                    };

                    if(curUser.id == user2.id){
                        data[curUser.id].pets[pet.id] = user2.offer.pets[pet.id];
                        delete user2.offer.pets[pet.id];
                    };

                    embed = await updateEmbed(embed, user1, user2);
                    await msg.edit({embed:embed});
                    msg.channel.send(`Successfully removed ${pet.displayName} from the trade.`);
                    usermsg.delete();
                    removePetMsg.delete();
                    collector.resetTimer({time:300000});
                    return messageCollector.stop();
                });

                messageCollector.on('stop', (collected, reason) => {
                    if(reason == 'time') return reaction.message.channel.send('Time for removing a pet expired.');
                    return;
                });
            };

            if(reaction.emoji.name == '⬆️'){
                // Add an item to the trade:
                let curUser;
                if(user.id == user1.id) curUser = user1;
                if(user.id == user2.id) curUser = user2;
                if(!curUser) return;

                const addItemMsg = await reaction.message.channel.send(`${user.username}, please type the name of one of your items. To see a list, use \`/inv\`.`);
                
                const messageFilter = (m) => (m.author.id == user.id);
                const messageCollector = reaction.message.channel.createMessageCollector(messageFilter, {time: 15000});

                messageCollector.on('collect', async usermsg => {
                    let args = usermsg.content.split(/ +/);
                    let item = await Item.searchItemByName({args:args});
                    if(!item && !msg.content.startsWith('/')) return msg.channel.send('Please type the name of one of your items to add it to the trade.');
                    let hasItem = await Item.hasItem({id:item.id,userpets:data[curUser.id]});
                    if(hasItem){
                        if(!item.tradeable){
                            msg.channel.send('You cannot trade untradeable items.');
                            usermsg.delete();
                            addItemMsg.delete();
                            return messageCollector.stop();
                        };

                        if(user.id == user1.id){
                            user1.offer.items.push(data[user1.id].items[hasItem]);
                            data[user1.id].items.splice(hasItem,1);
                        };

                        if(user.id == user2.id){
                            user2.offer.items.push(data[user2.id].items[hasItem]);
                            data[user2.id].items.splice(hasItem,1);
                        };

                        embed = await updateEmbed(embed, user1, user2);
                        await msg.edit({embed:embed});
                        msg.channel.send(`Successfully added ${item.displayName} to the trade.`);
                        usermsg.delete();
                        addItemMsg.delete();
                        collector.resetTimer({time:300000});
                        messageCollector.stop();
                    } else {
                        if(!msg.content.startsWith('/')) msg.channel.send('Please type the name of one of your items to add it to the trade.');
                    };
                });

                messageCollector.on('end', (collected, reason) => {
                    if(reason == 'time') return reaction.message.channel.send('Time for adding an item expired.');
                    return;
                });
            };

            if(reaction.emoji.name == '⬇️'){
                // Remove an item from the trade:
                let curUser;
                if(user.id == user1.id) curUser = user1;
                if(user.id == user2.id) curUser = user2;
                if(!curUser) return;

                const removeItemMsg = await reaction.message.channel.send(`${user.username}, please type the name of an item in the trade to remove.`);

                const messageFilter = (m) => (m.author.id == user.id);
                const messageCollector = reaction.message.channel.createMessageCollector(messageFilter, {time: 15000});

                messageCollector.on('collect', async usermsg => {
                    let args = usermsg.content.split(/ +/);
                    let item = await Item.searchItemByName({args:args});
                    if(!item) return message.channel.send('Please provide a valid item name.');
                    let itemInTrade = await Item.hasItem({id:item.id,userpets:curUser.offer});

                    if(!itemInTrade){
                        message.channel.send('This item is not in the trade.');
                        usermsg.delete();
                        removeItemMsg.delete();
                        return messageCollector.stop();
                    };
                    
                    if(curUser.id == user1.id){
                        data[user1.id].items.push(user1.offer.items[itemInTrade]);
                        user1.offer.items.splice(itemInTrade,1);
                    };

                    if(curUser.id == user2.id){
                        data[user2.id].items.push(user2.offer.items[itemInTrade]);
                        user2.offer.items.splice(itemInTrade,1);
                    };

                    embed = await updateEmbed(embed, user1, user2);
                    await msg.edit({embed:embed});
                    msg.channel.send(`Successfully removed ${item.displayName} from the trade.`);
                    usermsg.delete();
                    removeItemMsg.delete();
                    collector.resetTimer({time:300000});
                    return messageCollector.stop();
                });

                messageCollector.on('stop', (collected, reason) => {
                    if(reason == 'time') return reaction.message.channel.send('Time for removing an item expired.');
                    return;
                });
            };

            if(reaction.emoji.name == '✅'){
                // Confirm the trade, requires both users to accept:
                if(user.id == user1.id) user1.confirmed = !user1.confirmed;
                if(user.id == user2.id) user2.confirmed = !user2.confirmed;

                embed = await updateEmbed(embed, user1, user2);
                await msg.edit({embed:embed});
                collector.resetTimer({time:300000});
                
                if(user1.confirmed && user2.confirmed){
                    // Increase trading stats:
                    if(!data[user1.id].stats.tradesDone) data[user1.id].stats.tradesDone = 0;
                    if(!data[user2.id].stats.tradesDone) data[user2.id].stats.tradesDone = 0;
                    data[user1.id].stats.tradesDone += 1;
                    data[user2.id].stats.tradesDone += 1;
                    // Add pets & items to each user:
                    data[user1.id].items = data[user1.id].items.concat(user2.offer.items);
                    data[user2.id].items = data[user2.id].items.concat(user1.offer.items);

                    let returned1 = [];
                    let returned2 = [];
                    for(const i in user1.offer.pets){
                        let petData = user1.offer.pets[i];
                        if(data[user2.id].pets[petData.id]){
                            data[user1.id].pets[petData.id] = petData;
                            returned1.push(petData);
                            continue;
                        };
                        data[user2.id].pets[petData.id] = petData;
                    };
                    for(const i in user2.offer.pets){
                        let petData = user2.offer.pets[i];
                        if(data[user1.id].pets[petData.id]){
                            data[user2.id].pets[petData.id] = petData;
                            returned2.push(petData);
                            continue;
                        };
                        data[user1.id].pets[petData.id] = petData;
                    };

                    if(returned1.length > 0) message.channel.send(`Some pets had to have been returned to ${user1.username} to to the trading partner already having them. Exact data returned:\n\`${returned1.toString()}\``);
                    if(returned2.length > 0) message.channel.send(`Some pets had to have been returned to ${user2.username} to to the trading partner already having them. Exact data returned:\n\`${returned2.toString()}\``);

                    console.log(data);

                    await db.petsdb.set(user1.id,data[user1.id]);
                    await db.petsdb.set(user2.id,data[user2.id]);
                    // Notify of the trade being successful:
                    embed.setTimestamp();
                    embed.setColor('#11DD11');
                    embed.setDescription(`Trade completed between ${user1.username} and ${user2.username}.`);
                    await msg.edit({embed:embed});
                    collector.stop('trade_confirmed');
                };
            };

            if(reaction.emoji.name == '❌'){
                // Cancel the trade:
                await msg.edit(`Trade cancelled by ${admins.includes(user.id) ? 'a bot admin' : user.username}.`,{embed:null});
                collector.stop('user_end');
            };

            await reaction.users.remove(user);
        });

        collector.on('end', async (collected, reason) => {
            await msg.reactions.removeAll();
            delete this.tradingUsers[user1.id];
            delete this.tradingUsers[user2.id];
            if(reason == 'time') return msg.edit('Trade expired.',{embed:null});
        });
    },
    tradingUsers:{}
};
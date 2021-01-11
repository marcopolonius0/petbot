module.exports = {
    name:'petadmin',
    syntax:'/petadmin [options]',
    admin:true,
    async execute(message,args,db){
        if(!args[0] || !args[1]) return message.channel.send('Syntax: `/petadmin [user ID/mention] [r/m]`');
        let user = message.mentions.users.first();
        if(!user) user = await message.client.users.fetch(args[0],true);
        if(!user) return message.channel.send('Invalid arguments passed. Syntax: `/petadmin [user ID/mention] [r/m]`');
        let userpets = await db.petsdb.get(user.id);
        if(args[1] == 'm'){
            if(!args[2]) return message.channel.send('Use syntax: `/petadmin [user ID/mention] m [l/e] [pet ID] [value]`');
            if(args[2] =='l'){
                if(!args[3] || !args[4]) return message.channel.send('Use syntax: `/petadmin [user ID/mention] m l [pet ID] [value]`');
                if(!userpets.pets[args[3]]) return message.channel.send(`User ${user.username} does not have this pet.`);
                userpets.pets[args[3]].level = Number(args[4]);
                await db.petsdb.set(message.author.id,userpets);
                return message.channel.send(`Successfully set pet level for user ${user.username} on pet ${userpets.pets[args[3]].id} to ${args[4]}.`);
            };
            if(args[2] =='e'){
                if(!args[3] || !args[4]) return message.channel.send('Use syntax: `/petadmin [user ID/mention] m e [pet ID] [value]`');
                if(!userpets.pets[args[3]]) return message.channel.send(`User ${user.username} does not have this pet.`);
                userpets.pets[args[3]].exp = Number(args[4]);
                await db.petsdb.set(message.author.id,userpets);
                return message.channel.send(`Successfully set pet EXP for user ${user.username} on pet ${userpets.pets[args[3]].id} to ${args[4]}.`);
            };
            return message.channel.send('Use syntax: `/petadmin [user ID/mention] m [l/e] [pet ID] [value]`');
        };
        if(args[1]=='r'){
            if(!userpets) return message.channel.send('No data found for this user.');
            return message.channel.send('```json\n'+JSON.stringify(userpets)+'```');
        };
        return message.channel.send('Invalid arguments passed. Syntax: `/petadmin [user ID/mention] [r/m]`');
    }
};
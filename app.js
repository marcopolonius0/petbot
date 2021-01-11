// Define variables:
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const config = require('./private/config.json');
const text = require('./locale/text.js');
const petinfo = require('./pets/pets.json');
const commands = require('./commands.js');
const prefix = `/`;

// Fetch and update locale data:
let locale = {};
const localeFiles = fs.readdirSync('./locale').filter(file => file.endsWith('.json'));
for(const file of localeFiles){
    const lang = require(`./locale/${file}`);
    if(!lang.version || lang.version != 1) continue;
    locale[lang.name] = lang;
};
text.update(locale);

// Start database:
const Keyv = require('keyv');
const Pet = require('./pets/pet');
const maindb = new Keyv('sqlite://private/data/main.sqlite');
const petsdb = new Keyv('sqlite://private/data/pets.sqlite');

// Knowledge of when the bot is fully started:
client.on('ready', () => {
    console.log('Bot started.');
});

// Handle messages:
client.on('message', async (message) => {
    // Ignore other bots:
    if(message.author.bot) return;
    // Load data for user, if inexistent set to defaults:
    let userpets = await petsdb.get(message.author.id);
    if(!userpets){
        await petsdb.set(message.author.id,{pets:{},activePet:null,petMessageCooldown:0,items:{},tokens:{count:0,multiplier:1},stats:{},claimCooldown:0});
        userpets = await petsdb.get(message.author.id);
    };
    let usersettings = await maindb.get(message.author.id);
    if(!usersettings){
        await maindb.set(message.author.id,{lang:'en'});
        usersettings = await maindb.get(message.author.id);
    };
    // Active pet training:
    if(userpets.activePet && !message.content.startsWith(prefix)){
        let pet = userpets.pets[userpets.activePet];
        if(!pet){
            userpets.activePet = null;
            await petsdb.set(message.author.id,userpets);
        } else {
            if(userpets.petMessageCooldown <= Date.now() && pet.level < 10){
                pet.exp += 1;
                if(pet.exp >= petinfo.req.base[pet.level]*petinfo.req[petinfo.pets[pet.id].rarity] && pet.level < 10){
                    pet.level += 1;
                    pet.exp = 0;
                };
                if(pet.level > 9 && petinfo.pets[pet.id].evolution){
                    try{
                        let res = Pet.evolvePet(pet);
                        if(res !== null){
                            let oldPet = pet;
                            delete userpets.pet[activePet];
                            userpets.activePet = res.id;
                            pet = res;
                            let notification = new Discord.MessageEmbed()
                                .setColor('#0000FF')
                                .setTitle(`Pet Evolution: ${petinfo.pets[pet.id].displayName}`)
                                .attachFiles([`./pets/sprites/${petinfo.pets[pet.id].sprite}`])
                                .setImage(`attachment://${petstpetinfo.pets[pet.id].sprite}`)
                                .setDescription(`Your old pet ${petinfo.pets[oldPet.id].displayName} evolved! It has become ${petinfo.pets[pet.id].displayName}.`)
                            message.channel.send(notification);
                        };
                    } catch(error){
                        console.log(error);
                    };
                }
                userpets.pets[userpets.activePet] = pet;
                userpets.petMessageCooldown = Date.now() + 10000;
                await petsdb.set(message.author.id,userpets);
            };
        };
        return;
    };
    // Command handling
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if(commands.has(command)){
        const cmd = commands.get(command);
        if(cmd.admin && !config.admins.includes(message.author.id)) return message.channel.send(text.text({locale:usersettings.lang,msg:'no_admin'}));
        try{
            cmd.execute(message,args,{maindb:maindb,petsdb:petsdb,lang:usersettings.lang,commands:commands});
        } catch(error){
            console.log(error);
        };
    };
});

// Knowledge of when somebody adds the bot to a guild:
client.on('guildCreate', guild => {
    console.log(`New guild: ${guild.name} (ID: ${guild.id}).`);
});

// Logging in. Make sure to set up './private/config.json' to be able to use a token.
client.login(config.token);
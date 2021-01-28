const {MessageEmbed} = require('discord.js');
const locale = require('../locale/text.js');
const {admins} = require('../private/config.json');

module.exports = {
    name:'help',
    aliases:['?'],
    syntax:'/help [command]',
    admin:false,
    async execute(message,args,db){
        if(!args[0]){
            let msg = new MessageEmbed()
                .setColor('#3F3FFF')
                .setTitle(`${locale.text({lang:db.lang,msg:"help_title"})} `)
                .setDescription(`${locale.text({lang:db.lang,msg:"help_description"})}\n`)
                .setTimestamp();
            for(const [key,cmd] of db.commands.entries()){
                if(!cmd) continue;
                if(cmd.admin && !admins.includes(message.author.id)) continue;
                msg.setDescription(msg.description + `\n\n**/${cmd.name}**:\n${locale.cmdDescription({lang:db.lang,cmd:cmd.name})}`);
            };
            return message.channel.send({embed:msg,split:true});
        };
        if(db.commands.has(args[0].toLowerCase())){
            let cmd = await db.commands.get(args[0].toLowerCase());
            if(cmd.admin && !admins.includes(message.author.id)) return message.channel.send(`${locale.text({lang:db.lang,msg:"no_command_with_name"})}${args[0]}`);
            let msg = new MessageEmbed()
                .setColor('#3F3FFF')
                .setTitle(`${locale.text({lang:db.lang,msg:"help_title"})} ${cmd.name}`)
                .addField(`${locale.text({lang:db.lang,msg:"desc"})}`,`${locale.cmdDescription({lang:db.lang,cmd:cmd.name})}`)
                .addField(`${locale.text({lang:db.lang,msg:"syntax"})}`,`\`${cmd.syntax}\` `)
                .setTimestamp();
            return message.channel.send({embed:msg,split:true});
        };
        return message.channel.send(`${locale.text({lang:db.lang,msg:"no_command_with_name"})}${args[0]} `);
    }
};
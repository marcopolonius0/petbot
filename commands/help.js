const Discord = require('discord.js');
const locale = require('../locale/text.js');
const {admins} = require('../private/config.json');

module.exports = {
    name:'help',
    syntax:'/help [command]',
    admin:false,
    async execute(message,args,db){
        if(!args[0]){
            let msg = new Discord.MessageEmbed()
                .setColor('#3F3FFF')
                .setTitle(`${locale.text({lang:db.lang,msg:"help_title"})} `)
                .setDescription(`${locale.text({lang:db.lang,msg:"help_description"})} `)
                .setTimestamp();
            for(const [key,cmd] of db.commands.entries()){
                if(!cmd) continue;
                if(cmd.admin && !admins.includes(message.author.id)) continue;
                msg.addField(`/${cmd.name} `,`${locale.text({lang:db.lang,msg:"desc"})}${locale.cmdDescription({lang:db.lang,cmd:cmd.name})} `);
            };
            return message.channel.send(msg);
        };
        const str = String(args[0]).toLowerCase();
        if(db.commands.has(str)){
            let cmd = db.commands.get(str);
            if(cmd.admin && !admins.includes(message.author.id)) return message.channel.send(`${locale.text({lang:db.lang,msg:"no_command_with_name"})}${args[0]}`);
            let msg = new Discord.MessageEmbed()
                .setColor('#3F3FFF')
                .setTitle(`${locale.text({lang:db.lang,msg:"help_title"})} ${cmd.name}`)
                .addField(`${locale.text({lang:db.lang,msg:"desc"})} `,`${locale.cmdDescription({lang:db.lang,cmd:cmd.name})} `)
                .addField(`${locale.text({lang:db.lang,msg:"syntax"})} `,`\`${cmd.syntax}\` `)
                .setTimestamp();
            return message.channel.send(msg);
        };
        return message.channel.send(`${locale.text({lang:db.lang,msg:"no_command_with_name"})}${args[0]} `);
    }
};
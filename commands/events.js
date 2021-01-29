const {MessageEmbed} = require('discord.js');
const locale = require('../locale/text.js');
const events = require('../events/events.json');

module.exports = {
    name:'events',
    aliases:['evnts','ev'],
    admin:false,
    async execute(message,args,db){
        let activeEvents = [];
        for(const e in events.events){
            let event = events.events[e];
            if(event.startTime > Date.now() || event.endTime < Date.now()) continue;
            activeEvents.push(event);
        };
        if(activeEvents.length < 1) return message.channel.send(locale.text({lang:db.lang,msg:"no_events"}));
        let msg = new MessageEmbed().setTitle(`Ongoing Events:`).setTimestamp().setColor('#DDDDDD').setDescription('A list of every on-going active event.');
        for(const i in activeEvents){
            let event = activeEvents[i];
            let eventData = locale.events({lang:db.lang,event:event.id})
            msg.addField(eventData.name,eventData.description);
        };
        return message.channel.send({embed:msg,split:true});
    }
};
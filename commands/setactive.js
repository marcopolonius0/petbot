const locale = require('../locale/text.js');
const Pet = require('../pets/pet.js');

module.exports = {
    name:'setactive',
    syntax:'/setactive [pet name]',
    admin:false,
    async execute(message,args,db){
        if(!args[0]) return message.channel.send(locale.text({lang:db.lang,msg:"syntax_error"}) + this.syntax);
        let userpets = await db.petsdb.get(message.author.id);
        let newActivePet = await Pet.searchByName({args:args,userdata:userpets});
        if(newActivePet == null) return message.channel.send(locale.text({lang:db.lang,msg:"no_owned_pets_with_name"}));
        userpets.activePet = newActivePet.id;
        await db.petsdb.set(message.author.id,userpets);
        return message.channel.send(locale.text({lang:db.lang,msg:"successful_new_active_pet"})+newActivePet.displayName+'.');
    }
};
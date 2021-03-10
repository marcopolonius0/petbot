const items = require('./items.json');
const Pet = require('../pets/pet.js');
const petinfo = require('../pets/pets.json');

class Item {
    // New item generation:
    constructor(options){
        this.id = options.id || 'item';
        this.data = options.data || undefined;
        return this;
    };
    
    // Check if a users data has a specific item ID:
    static async hasItem(options){
        if(!options.id || !options.userpets) return null;
        let res = null;
        for(const i in options.userpets.items){
            let item = options.userpets.items[i];
            if(item.id == options.id){
                res = i;
                break;
            };
        };
        return res;
    };

    // Give a new item to a users data, return with new data:
    static giveItem(options){
        if(!options.id || !options.userpets) return null;
        options.userpets.items.push(new Item(options));
        return options.userpets;
    };

    // Remove an item from a users data, return with new data:
    static removeItem(options){
        if(!options.id || !options.userpets) return options.userpets;
        if(options.data){
            for(const i in options.userpets.items){
                let item = options.userpets.items[i];
                if(item.id == options.id && item.data == options.data){
                    options.userpets.items.slice(i,1);
                    break;
                };
            };
            return options.userpets;
        };
        for(const i in options.userpets.items){
            let item = options.userpets.items[i];
            if(item.id == options.id){
                options.userpets.items.splice(i,1);
                break;
            };
        };
        return options.userpets;
    };

    // Get information for an item:
    static getItem(item){
        if(!item) return null;
        let res = items.items[item];
        if(!res) return null;
        return res;
    };

    // Search for an items complete data by searching it using it's display name:
    static async searchItemByName(options){
        if(!options.args) return null;
        let res = null;
        let name = options.args.join(' ');
        for(const i in items.items){
            const item = items.items[i];
            if(item.displayName.toLowerCase() == name.toLowerCase()){
                res = item;
                break;
            };
        };
        return res;
    };

    // Use an item if it's useable, returns with data:
    static async useItem(options){
        if(!options.userpets || !options.itemIndex) return options.userpets;
        let itemdata = options.userpets.items[options.itemIndex];
        if(!itemdata) return options.userpets;
        let item = items.items[itemdata.id];
        if(!item) return options.userpets;
        if(item.id.startsWith('exp_boost')){
            let boost = 0;
            if(item.id == 'exp_boost_small') boost = 50;
            if(item.id == 'exp_boost_medium') boost = 100;
            if(item.id == 'exp_boost_large') boost = 200;
            if(item.id == 'exp_boost_huge') boost = 500;
            let pet = options.userpets.pets[options.userpets.activePet];
            if(!pet) return options.userpets;
            if(pet.level > 9) return
            pet.exp += boost;
            if(pet.exp >= petinfo.req[petinfo.pets[pet.id].rarity] * petinfo.req.base[pet.level])
                pet.exp = pet.exp - (petinfo.req[petinfo.pets[pet.id].rarity] * petinfo.req.base[pet.level])
                pet.level += 1;
            options.userpets.pets[pet.id] = pet;
            options.userpets = await Item.removeItem({id:item.id,userpets:options.userpets});
            return options.userpets;
        };
        if(item.id == 'pet_token'){
            if(!itemdata.data.pet) return null;
            if(!petinfo.pets[itemdata.data.pets]) return null;
            if(Pet.searchByName({petName:petinfo.pets[itemdata.data.pets].displayName,userpets:options.userpets})) return null;
            let newPet = new Pet({id:itemdata.data.pet});
            options.userpets.pets[newPet.id] = newPet;
            options.userpets = await Item.removeItem({id:item.id,userpets:options.userpets,data:itemdata.data});
            return options.userpets;
        };
        return options.userpets;
    };
};

module.exports = Item;
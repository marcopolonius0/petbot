const items = require('./items.json');
const Pet = require('../pets/pet.js');
const petinfo = require('../pets/pets.json');

class Item {
    constructor(options){
        this.id = options.id || 'item';
        this.data = options.data || undefined;
        return this;
    };
    
    static hasItem(options){
        if(!options.id || !options.userpets) return null;
        let res = false;
        for(const i in options.userpets.items){
            let item = options.userpets.items[i];
            if(item.id == options.id){
                res = i;
                break;
            };
        };
        return res;
    };

    static giveItem(options){
        if(!options.id || !options.userpets) return null;
        options.userpets.items.push(new Item(options));
        return options.userpets;
    };

    static removeItem(options){
        if(!options.id || !options.userpets) return null;
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

    static getItem(item){
        if(!item) return null;
        let res = items.items[item];
        if(!res) return null;
        return res;
    };

    static searchItemByName(options){
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

    static async useItem(options){
        if(!options.userpets || !options.itemIndex) return null;
        let itemdata = options.userpets.items[options.itemIndex];
        if(!itemdata) return null;
        let item = items.items[itemdata.id];
        if(!item) return null;
        if(item.id.startsWith('exp_boost')){
            let boost = 0;
            if(item.id == 'exp_boost_small') boost = 50;
            if(item.id == 'exp_boost_medium') boost = 100;
            if(item.id == 'exp_boost_large') boost = 200;
            if(item.id == 'exp_boost_huge') boost = 500;
            let pet = options.userpets.pets[userpets.activePet];
            if(!pet) return null;
            pet.exp += boost;
            options.userpets = await Item.removeItem({id:item.id,userpets:options.userpets});
            return options.userpets;
        };
        if(item.id == 'pet_voucher'){
            if(!itemdata.data.pet) return null;
            if(!petinfo.pets[itemdata.data.pets]) return null;
            if(Pet.searchByName({petName:petinfo.pets[itemdata.data.pets].displayName,userpets:options.userpets})) return null;
            let newPet = new Pet({id:itemdata.data.pet});
            options.userpets.pets[newPet.id] = newPet;
            options.userpets = await Item.removeItem({id:item.id,userpets:options.userpets,data:itemdata.data});
            return options.userpets;
        };
    };
};

module.exports = Item;
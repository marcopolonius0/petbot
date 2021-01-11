const items = require('./items.json');

class Item {
    constructor(options){
        this.id = options.id || 'item';
        this.count = options.count || 1;
        this.data = options.data || {};
        return this;
    };
    static giveItem(options){
        if(!options.id || !options.count || !options.userpets) return null;
        let userpets = options.userpets;
        if(userpets.items[options.id]){
            userpets.items[options.id].count += options.count;
            if(userpets.items[options.id].count < 1) delete userpets.items[options.id];
            return userpets;
        };
        userpets.items[options.id] = new Item(options);
        return userpets;
    };
    static getItem(item){
        if(!item) return null;
        let res = items.items[item];
        if(!res) return null;
        return res;
    };
};

module.exports = Item;
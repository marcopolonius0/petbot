class Item {
    constructor(id,options){
        this.id = id;
        this.count = options.count || 1;
        return this;
    };
    static addItem(userdata,options){
        if(userdata.items[options.id]){
            userdata.items[options.id].count += options.count;
            return userdata;
        };
        let item = new Item(options.id,{count:options.count});
        userdata.items[item.id] = item;
        return userdata;
    };
    static removeItem(userdata,options){
        if(userdata.items[options.id]){
            if(userdata.items[options.id].count >= options.count){
                userdata.items[options.id].count -= options.count;
                if(userdata.items[options.id].count < 1) delete userdata.items[options.id];
                return userdata;
            } else {
                return null;
            };
        } else {
            return null;
        };
    };
};

module.exports = Item;
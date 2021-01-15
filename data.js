class Data {
    constructor(type,options){
        if(type == 'pets'){
            this.version = 1;
            this.pets = options.pets || {};
            this.activePet = options.activePet || null;
            this.petMessageCooldown = options.petMessageCooldown || 0;
            this.items = options.items || [];
            this.tokens = options.tokens || {
                count:0,
                multiplier:1
            };
            this.stats = options.stats || {};
            this.claimCooldown = options.claimCooldown || 0;
        };
        if(type == 'main'){
            this.version = 1;
            this.lang = options.lang || 'en';
        };
        return this;
    };
    // Fix breaking database changes.
    static updateData(type,data) {
        if(type == 'pets')
            if(!data.version){
                if(data.items)
                    delete data.items;
                    data.items = [];
                if(data.tokens.count == null) data.tokens.count = 0;
            };
            data.version = 1;
        if(type == 'main')
            if(!data.version) data.version = 1;
        return data;
    };
};

module.exports = Data;
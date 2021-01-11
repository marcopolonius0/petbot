// Define important variables:
const petinfo = require('./pets.json');

// Pet list:
let petList = [];
for(const p in petinfo.pets){
    const pet = petinfo.pets[p];
    if(!pet.obtainable) continue;
    petList.push(pet);
};

// Pet constructor:
class Pet {
    constructor(options){
        this.id = options.pet || petList[Math.floor(Math.random()*petList.length)].id;
        this.level = options.level || 0;
        this.exp = options.exp || 0;
        this.age = options.age || Date.now();
        return this;
    };
    static searchByName(options){
        let petName = options.args.join(' ');
        let res = null;
        // Loop through pets, check if any have the same display name:
        // Owned pets only:
        if(options.userdata){
            for(const p in options.userdata.pets){
                let pet = petinfo.pets[p];
                if(pet.displayName.toLowerCase() == petName.toLowerCase()){
                    res = pet;
                    break;
                };
            };
            return res;
        // All pets:
        } else {
            for(const p in petinfo.pets){
                let pet = petinfo.pets[p];
                if(pet.displayName.toLowerCase() == petName.toLowerCase()){
                    res = pet;
                    break;
                };
            };
            return res;
        };
    };
    static evolvePet(petData){
        let pet = petinfo.pets[petData.id];
        if(!pet.evolution) return null;
        let newPet;
        if(pet.evolution.length > 1){newPet = pet.evolution[Math.floor(Math.random()*pet.evolution.length)]}
        else{newPet = pet.evolution[0]};
        let res = new Pet({pet:newPet,age:petData.age});
        return res;
    };
};

module.exports = Pet;
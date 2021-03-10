// Define important variables:
const petinfo = require('./pets.json');
const eventinfo = require('../events/events.json');

// Pet claim list:
let petList = [];
let totalWeight = 0;

function calculatePetWeight(exclusiveEvent){
    petList = [];
    totalWeight = 0;
    if(exclusiveEvent){
        for(const p in petinfo.pets){
            const pet = petinfo.pets[p];
            if(pet.event != exclusiveEvent) continue;
            if(pet.startTime && pet.startTime > Date.now()) continue;
            if(pet.endTime && pet.endTime < Date.now()) continue;
            if(pet.event){
                let event = eventinfo.events[pet.event];
                if(event.startTime > Date.now()) continue;
                if(event.endTime < Date.now()) continue;
            };
            totalWeight += pet.weight;
            petList.push(pet);
        };
        return;
    };

    for(const p in petinfo.pets){
        const pet = petinfo.pets[p];
        if(!pet.obtainable) continue;
        if(pet.startTime && pet.startTime > Date.now()) continue;
        if(pet.endTime && pet.endTime < Date.now()) continue;
        if(pet.event){
            let event = eventinfo.events[pet.event];
            if(event.startTime > Date.now()) continue;
            if(event.endTime < Date.now()) continue;
        };
        totalWeight += pet.weight;
        petList.push(pet);
    };
};

function newPet(exclusiveEvent){
    calculatePetWeight(exclusiveEvent);
    let reward = Math.random() * totalWeight;
    for(const i in petList){
        const drop = petList[i];
        if(reward < drop.weight) return drop.id;
        reward -= drop.weight;
    };
    // Failsafe backup pet:
    return 'basic_egg';
};

// Pet constructor:
class Pet {
    constructor(options){
        this.id = options.id || newPet(options.event);
        this.level = options.level || 0;
        this.exp = options.exp || 0;
        this.age = options.age || Date.now();
        return this;
    };

    static async searchByName(options){
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
        if(pet.evolution.length > 1) newPet = pet.evolution[Math.floor(Math.random()*pet.evolution.length)];
        else newPet = pet.evolution[0];
        let res = new Pet({id:newPet,age:petData.age});
        return res;
    };
};

module.exports = Pet;
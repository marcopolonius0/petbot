# Pets:
## Adding new pets:
Adding new pets is ratehr simple. Have `pets.json` open which is found in this directory.
When adding a new pet, you need to add data into the `pets` object in the json file, as well as making sure to fill in the locale for the pets description in at least english. Read `/locale/info.md` for more information.

Here's an example of a new pet
`pets.json`:
```json
{
    "pets":{
        "new_pet":{
            "id":"new_pet",
            "displayName":"New Pet",
            "sprite":"new_pet.png",
            "obtainable":true,
            "weight":80,
            "value":4,
            "rarity":"Mythic"
        }
    }
}
```

`locale/en.json` (or any other language file):
```json
{
    "pets":{
        "descriptions":{
            "new_pet":"A pet that is new."
        }
    }
}
```

## Structure:
`pets.json` file:
* `id`: The ID used to store the pet. MUST be the same as the object name.
* `displayName`: The name of the item shown to users.
* `sprite`: The sprite file in /pets/sprites. You can add folders as well, please remember to add in the folder directory properly though.
* `obtainable`: Whether or not the can is obtained through claiming.
* `weight`: The chance of the pet being obtained from claiming. Only required if `obtainable` = true.
* `value`: The sell value of the pet. Make sure it is a valid number.
* `rarity`: The rarity used to define how much EXP is needed to progress to the next level. Adding new rarities can easily be done but is not part of this tutorial for simplicity.
* `startTime` (Optional): The starting time (in valid JS Date, Unix Epoch + milliseconds, as a number) of when this pet becomes obtainable.
* `endTime` (Optional): The ending time (in valid JS Date, Unix Epoch + milliseconds, as a number) of when this pet becomes unobtainable.

`<locale>.json` file(s):
* `description`: The description of the pet.
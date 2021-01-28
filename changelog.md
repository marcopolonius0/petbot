# Changelogs:
These are all the changelogs for every version to date.

# b3.0
## Additions/changes:
* The `/help` command was changed to be description only instead of field-based, allowing much more commands to be displayed on a single page.
* Several modules were made faster by not requiring the entire Discord/fs library each time and instead only requiring the MessageEmbed/readDirSync classes/functions.
* Aliases were added to some commands, meaning there are multiple ways to execute it. This is not mandatory, there does not need to be any.
* Removed the `obtainable` tag in `items.json` in favour of `purchaseable` and `salable`
* The `/shop` command is now split into 3 commands:
* * `/shop` now shows a list of all the purchaseable items;
* * `/buy` is used to buy any purchaseable item;
* * `/sell` is used to sell any salable items.
* The `/inventory` and `/pets` commands now accept user mentions as parameters.
* Items sold from the shop can now be "limited", i.e. they will appear/disapear at a specific time (optional).
* Pets from claiming can now also be "limited", also optional.
* Pets from claiming now have different chances to be dropped (weighted random). Some can be very common while some can be very rare.
## Fixes:
* Syntax for `/petadmin` was undescriptive, fixed.
* Fixed the no-admin message always being in English.
* Fixed the delete pet admin tool not removing the active pet if they are the same.
* Fixed `item/info.md` saying that the useItem function was in the Pet module.
* Fixed `/settings` not awaiting the database call (didn't seem to affect anything, but can't hurt to be safe).

# b2.1
## Changes:
* Statistics are now viewable from the `/stats` command.
* Added a new `commandsUsed` statistic.
* Locale is now managed fully by `text.js`, previously the locale was first loaded in `app.js` and then sent to `text.js`.
* Some important files are now commented.
* The `/petadmin` command was revamped to be more user-friendly and more effective.
* When provided with wrong data, the `item.js` class will no longer return 'null' and instead just return the database structure with no changes to avoid setting a users data to 'null'. This eliminates any risk when adding new commands that interact with this class.
* Fixed some command descriptions that were forgotten.

# b2.0
The bot is still in beta since not every feature intended for release is provided. Here is a list of new features included in this release:
## Additions:
* Items have been added properly, as an array of objects in the database.
* Items can be sold, purchased, and used as of now. Respective commands: `/shop`; `/use`. Trading may come later.
* Owned items can be seen using `/inventory`.
* Commands are now listed in their own module, allowing for reading commands from other commands being possible.
* A help interface has been added which lists every command and their description.
* Data is now versioned to support migrating old userdata. Please note that as of now, the user has to send a message in order to have their data migrated.
* Data is also now created as a class, making it easier to add new fields and defaults. Use `data.js` in the root directory.
* Added information files for adding new locales, new items and new pets.
* `/source` was added to make finding the bots source code simpler.
## Fixes:
* Unused statistics for pet duplicates is now fixed, previously it would always become 1. While there may be some inaccuracy, the statistic will be added to a user properly if they migrate their data based on the other claiming related statistics.
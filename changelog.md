# Changelogs:
These are all the changelogs for every version to date.

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
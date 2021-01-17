# Changelogs:
These are all the changelogs for various versions.

# b2.0
The bot is still in beta since not every feature intended for release is provided. Here is a list of new features included in this release:
## Additions:
* Items have been added properly, as an array of objects in the database.
* Items can be sold, purchased, and used as of now. Respecitive commands: `/shop`; `/use`. Trading may come later.
* Owned items can be seen using `/inventory`.
* Commands are now listed in their own module, allowing for reading commands from other commands being possible.
* A help interface has been added which lists every command and their description.
* Data is now versioned to support migrating old userdata. Please note that as of now, the user has to send a message in order to have their data migrated.
* Data is also now created as a class, making it easier to add new fields and defaults. Use `data.js` in the root directory.
* Added information files for adding new locales, new items and new pets.
* `/source` was added to make finding the bots source code simpler.
## Fixes:
* Unused statistics for pet duplicates is now fixed, previously it would always become 1. While there may be some inacuracy, the statistic will be added to a user properly if they migrate their data based on the other claiming related statistics.
# Locales
## Adding new locales:
To add a new locale, first you need to create a file for it. It is reccomended that you use a 2 letter code (such as 'en' for english, 'es' for spanish, etc.).
Example filename: en.json (for English, which is shipped with the bot).

An easy way to directly translate into another language would be to copy the entire 'en.json' frile in this folder and replace all the values along the way with your translations, so that you don't miss any lines.

Make sure to set the "name" key to whatever 2 letter code you used for your language (ie. 'en' for English, 'es' for Spanish, etc.).

Once done with this, the rest is simple. In '/commands/settings.json' just add in (and fill in the blanks):
```js
if(args[1] == '/*Your 2 letter code here*/' || args[1] == '/*Name of language (does NOT need to be the 2 letter code)*/'){
    userdata.lang = '/*Your 2 letter code here*/';
    await db.maindb.set(message.author.id,userdata);
    return message.channel.send(locale.text({lang:userdata.lang,msg:"new_language"}));
};
```

After this, the rest should be automatic. Enjoy your new language!

## Adding new lines to existing languages:
It's rather simple to add new lines to the locale system, as long as you format your JSON correctly.
Under any of the message object containers, you can add a new string with a key.
Example:
```json
"messages":{
    "new_message":"This is a new message. To use it, I can use something like '<locale>.text({lang:<database>.lang,msg:'new_message'})'."
}
```
You don't need to add the message in every language, however if it is called and the language doesn't have the lext it will return an error message so be wary of it.

## Structure:
* `name`: The 2 letter key of the language.
* `version`: The version of the language. Currently only set to 1.
* `messages`: An object holding all the messages used in any command.
* `commands`: An object holding all the command descriptions used in the `/help` command.
* `pets`: An object holding all the pet descriptions used in various pet related tasks.
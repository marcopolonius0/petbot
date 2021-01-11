# Adding new items:
Have "items.json" open, found in this directory.
When adding a new item, please make sure to add an object in the "items" object.

Here's an example of a new item:
```json
"food":{
    "id":"food",
    "displayName":"Food",
    "price":6,
    "obtainable":true,
    "tradeable":true,
    "useable":true
}
```

## Values:
* id: The id of the item. MUST be the same as the name of the object.
* displayName: The name seen by users. Just any string will do.
* price: The buy price of this item, as a number. The sell price is always 0.5*price.
* obtainable: Whether this item is listed in the shop or not. Can still be given using admin permissions, or by players who've already obtained it trading it (if tradeable = true).
* tradeable: Whether this item can be exchanged between players or not. Can still be given using admin permissions, or from the shop (if obtainable = true).
* useable: Whether this item can be "used" and consumed. This requires using the Pet module and the function useItem().
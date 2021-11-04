# A5 - Chatbot

## Two Star Yelp Review Drive Thru: Premise
You're at a drive thru at the worst spot in town. The person behind the drive thru desperately wants you to get one specific item for reasons unknown.
(This made a lot more sense in my head than it did in reality)

## Buttons
- Reject: Reject the cashier's plea to buy the item. Watch him become desperate.
- Show order: If you've ordered anything, the cashier will tell you your order.
- Random order: Tells the cashier a random order, may be the item that he wants you to get.
- Finish order: Attempts to close the order if items have been ordered.
- Menu items: Clicking on a menu item on the side will order one of that item.

## Valid inputs:
- Ordering one or more item of any quantity is a valid input (i.e "twenty burgers", "2 nuggets", or "twenty burgers, 2 nuggets, and three fries")
- Any combination of show/my and order will show the current order
- If the bot asks "anything else", saying "no" or "yes" will elicit either a rejection response or end state depending if you bought the item. 

## Tracery Generated Instances:
- The name of the chain restaurant is generated. 
- The adjectives on the menu items are generated.
- A rejection will elicit a generated response for the worker's responsiblities.
- Buying the item of choice and rejecting after buying the item of choice will generate an insult.
- If an item is ordered and it's not the item of choice, then the worker will add a negative adjective to one of the items ordered. 

## Attribution
- Chatbot boilerplate code provided by Professor Kate Compton
- Styling the scrollbar: "https://www.w3schools.com/howto/howto_css_custom_scrollbar.asp"
- Turning text numbers into ints: "https://stackoverflow.com/questions/11980087/javascript-words-to-numbers"
- Vue.js documentation: "https://vuejs.org/v2/guide/"

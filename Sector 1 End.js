destination = [188.5, 1, -30.5]
itemName = "Jump Potion (Sector 1)"
api.setPosition(api.myId, destination)
api.giveItem(api.myId, "Jump Potion", 1, {customDisplayName: itemName})
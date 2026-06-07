//==============================================
// Callbacks (be careful with race conditions)
//==============================================
onPlayerJoin = (playerId, fromGameReset) => {
    Save.load(playerId)
    Respawn.init(playerId)
    WelcomeGift.init(playerId)
}
onPlayerLeave = (playerId, serverIsShuttingDown) => Save.store(playerId)
doPeriodicSave = () => Save.backup()
onMobKilledPlayer = (attackingMob, killedPlayer, damageDealt, withItem) => {
    let keepInventory = Respawn.keepInventory()
    return keepInventory
}
onPlayerKilledOtherPlayer = (attackingPlayer, killedPlayer, damageDealt, withItem) => {
    let keepInventory = Respawn.keepInventory()
    return keepInventory
}
onPlayerDamagingOtherPlayer = (attackingPlayer, damagedPlayer, damageDealt, withItem, bodyPartHit, damagerDbId) => Respawn.checkProtection(damagedPlayer, damageDealt)
onMobDamagingPlayer = (attackingMob, damagedPlayer, damageDealt, withItem) => Respawn.checkProtection(damagedPlayer, damageDealt)
onPlayerMoveInvenItem = (playerId, fromIdx, toStartIdx, toEndIdx, amount) => {
    let preventMove = Save.checkMove(playerId, fromIdx)
    return preventMove
}
onPlayerDropItem = (playerId, x, y, z, itemName, itemAmount, fromIdx) => {
    let preventDrop = Save.checkDrop(playerId, fromIdx)
    return preventDrop
}
//====Delete later (tests/debugging)====
onPlayerClickUp = (playerId, b, c, d, e, f, g) => {
    //Save.backup()
}
onWorldChangeBlock = (x, y, z, fromBlock, toBlock, initiatorDbId, extraInfo) => {api.log("[onWorldChangeBlock] ${toBlock}")}
onPlayerSpawnMob = (playerId, mobId, mobType, x, y, z, mobHerdId, playSoundOnSpawn) => {api.log("[onPlayerSpawnMob] ${mobId} | ${mobType}")}
//====Delete later (tests/debugging)====

//===========================
// Mods
//===========================
//Likely a dependency to many mods.
class Save{
    //Use inventory if false.
    static useMoonstoneChest = true
    static movable = false
    //Bottom-right slot.
    static inventorySlot = 10
    //Top-left slot.
    static chestSlot = 51
    static slot = () => Save.useMoonstoneChest ? Save.chestSlot : Save.inventorySlot
    static icon = "Lucky Block"
    //Temporary storage indexed by playerId.
    static activeData = {}
    static displayName = "Save Data"
    static defaultData = {}
    static backup(){
        let storeSave = Save.useMoonstoneChest ? api.setMoonstoneChestItemSlot : api.setItemSlot
        for(playerId in Save.activeData){
            if(!api.playerIsInGame(playerId)){continue}
            let attributes = {customDisplayName: Save.displayName, customAttributes: Save.activeData[playerId]}
            storeSave(playerId, Save.slot(), Save.icon, 1, attributes)
        }
    }
    static store(playerId){
        let storeSave = Save.useMoonstoneChest ? api.setMoonstoneChestItemSlot : api.setItemSlot
        let attributes = {customDisplayName: Save.displayName, customAttributes: Save.activeData[playerId]}
        storeSave(playerId, Save.slot(), Save.icon, 1, attributes)
    }
    static load(playerId){
        let loadSave = Save.useMoonstoneChest ? api.getMoonstoneChestItemSlot : api.getItemSlot
        Save.activeData[playerId] = loadSave(playerId, Save.slot())?.attributes.customAttributes
    }
    static checkMove(playerId, slot){
        if(Save.movable || slot != Save.slot()){return}
        return "preventChange"
    }
    static checkDrop(playerId, slot){
        if(Save.movable || slot != Save.slot()){return}
        return "preventDrop"
    }
}
class Respawn{
    static auto = true
    static keepInventory = true
    static delay = 0
    //Under 1000ms may result in respawn screen softlocks.
    static protectionTime = 1000
    static lastRespawns = {}
    static init(playerId){
        api.setClientOptions(playerId, {autoRespawn: Respawn.auto, secsToRespawn: Respawn.delay})
        Respawn.lastRespawns[playerId] = 0;
    }
    static keepInventory(){
        if(Respawn.keepInventory){return "keepInventory"}
    }
    static checkProtection(damagedPlayer, damageDealt){
        let currentHealth = api.getHealth(damagedPlayer)
        if(damageDealt < currentHealth){return}
        let elapsed = api.now() - Respawn.lastRespawns[damagedPlayer]
        if(elapsed < Respawn.protectionTime){return}
        api.killLifeform(damagedPlayer)
        Respawn.lastRespawns[damagedPlayer] = api.now()
    }
}
class WelcomeGift{
    static giftedPlayers = {}
    static items = [{type: "Jump Potion", amount: 1, attributes: {customDescription: "Welcome Gift!"}}]
    static message = ""
    static init(playerId){
        let saveEntry = "WelcomeGift.received"
        let saveData = Save.activeData[playerId]
        api.log(Save.activeData)
        if(saveEntry in saveData){return}
        if(WelcomeGift.message != ""){api.sendMessage(playerId, WelcomeGift.message)}
        WelcomeGift.items.forEach((x) => api.giveItem(playerId, x.type, x.amount, x.attributes))
        saveData[saveEntry] = true
    }
}
class BoatTracker{}
class ProgressTracker{}
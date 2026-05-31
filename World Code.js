/*
*/

//==============================================
// Callbacks (be careful with race conditions)
//==============================================
onPlayerJoin = (playerId, fromGameReset) => {
    Respawn.init(playerId)
    WelcomeGift.init(playerId)
}
onMobKilledPlayer = (attackingMob, killedPlayer, damageDealt, withItem) => {
    returnValue = Respawn.keepInventory()
    return returnValue
}
onPlayerKilledOtherPlayer = (a, b, c, d) => {
    returnValue = Respawn.keepInventory()
    return returnValue
}
onPlayerDamagingOtherPlayer = (attackingPlayer, damagedPlayer, damageDealt, withItem, bodyPartHit, damagerDbId) => {
    Respawn.checkProtection(damagedPlayer, damageDealt)
}
onMobDamagingPlayer = (attackingMob, damagedPlayer, damageDealt, withItem) => {
    Respawn.checkProtection(damagedPlayer, damageDealt)
}

onWorldChangeBlock = (x, y, z, fromBlock, toBlock, initiatorDbId, extraInfo) => {api.log("[onWorldChangeBlock] ${toBlock}")}
onPlayerSpawnMob = (playerId, mobId, mobType, x, y, z, mobHerdId, playSoundOnSpawn) => {api.log("[onPlayerSpawnMob] ${mobId} | ${mobType}")}
//===========================
// Mods
//===========================
class Respawn{
    static auto = true
    static keepInventory = true
    static delay = 0
    //Under 1000ms may result in respawn screen softlocks.
    static protectionTime = 1000
    static lastRespawns = {}
    static init(playerId){
        let name = api.getEntityName(playerId)
        Respawn.lastRespawns[name] = 0;
        api.setClientOptions(playerId, {autoRespawn: Respawn.auto, secsToRespawn: Respawn.delay})
    }
    static keepInventory(){
        if(Respawn.keepInventory){return "keepInventory"}
    }
    static checkProtection(damagedPlayer, damageDealt){
        let currentHealth = api.getHealth(damagedPlayer)
        if(damageDealt < currentHealth){return}
        let name = api.getEntityName(damagedPlayer)
        let elapsed = api.now() - Respawn.lastRespawns[name]
        if(elapsed < Respawn.protectionTime){return}
        api.killLifeform(damagedPlayer)
        Respawn.lastRespawns[name] = api.now()
    }
}
class WelcomeGift{
    static giftedPlayers = {}
    static items = [{type: "Jump Potion", amount: 1, attributes: {customDescription: "Welcome Gift!"}}]
    static message = ""
    static init(playerId){
        let name = api.getEntityName(playerId)
        if(name in WelcomeGift.giftedPlayers){
            api.log("Already gifted")
            return
        }
        if(WelcomeGift.message != null && WelcomeGift.message != ""){api.sendMessage(playerId, WelcomeGift.message)}
        WelcomeGift.items.forEach((x) => api.giveItem(playerId, x.type, x.amount, x.attributes))
        WelcomeGift.giftedPlayers[name] = true
    }
}
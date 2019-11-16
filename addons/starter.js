starter: {
  console.log("Loaded StarterJS")
  
  module.exports.JSON = function () {
    return {}
  }
  
  Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)]
  }
  
  
  module.exports.dsctools = function () {
    return {
      getInvite: function (client) {
        return `https://discordapp.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`
      },
      toEmbed: function (json) {
        return {embed: json}
      } 
    }
  }
}
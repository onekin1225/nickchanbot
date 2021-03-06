const parseTag = require("../custom_modules/parse-tag-vars.js");
module.exports = {
  name: "parse-tag-source",
  guildOnly: true,
  args: true,
  execute: async (message, args) => {
    try {
      message.channel.send(
        parseTag(
          message,
          {
            name: "example-tag",
            description: "example description",
            content:args.join(" "),
            nsfw: false
          },
          args
        )
      );
    } catch (error) {
      message.reply("Tag Error\n```" + error + "```")
    }
  }
};

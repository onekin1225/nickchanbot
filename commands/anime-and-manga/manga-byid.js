require('dotenv').config()
const anilist = new (require('anilist-node'))(process.env.ANILIST_TOKEN)
const { writeFileSync } = require("fs")
const { MessageEmbed } = require("discord.js")
module.exports = {
    name: 'manga-byid',
    aliases: ['mangabyid'],
    description:{en: 'GET manga by id on AniList'},
    execute: async (message, args) => await module.exports.getManga(message, parseInt(args.join(' '))),
    async getManga(message, id) {
        anilist.media
            .manga(id)
            .then(async manga => {
                if (!manga.siteUrl)
                    return message.reply("That's not a valid manga ID!");
                writeFileSync(`/tmp/${manga.id}.json`, JSON.stringify(manga, null, 2));
                if (manga.isAdult && !message.channel.nsfw)
                    return message.reply(
                        "That anime contains NSFW content,please try again in a NSFW channel."
                    );
                    let character
                    if (manga.characters) character = await anilist.people.character(manga.characters[0].id);
                const embed = new MessageEmbed()
                    .setURL(manga.siteUrl)
                    .setTitle(
                        manga.title.romaji || manga.title.english || manga.title.native
                    )
                    .setDescription(manga.description.replace(/(<([^>]+)>)/gi, ""))
                    .addField("Native title", manga.title.native || manga.title.english)
                    .addField("Romaji Title", manga.title.romaji || "N/A")
                    .addField("English title", manga.title.romaji || "N/A")
                    .addField(
                        "Links",
                        (() => manga.externalLinks ? manga.externalLinks
                            .map((link, index) => `[${index}](${link})`)
                            .join(",") : "N/A")()
                    )
                    .addField("Country of origin", manga.countryOfOrigin)
                    .addField("Popularity", manga.popularity)
                    .addField("Format", manga.format)
                    .addField("Status", manga.status)
                    .addField("Season", manga.season)
                    .addField(
                        "Start Date",
                        `${manga.startDate.day}-${manga.startDate.month}-${manga.startDate.year}`
                    )
                    .addField(
                        "End date",
                        `${manga.endDate.day}-${manga.endDate.month}-${manga.endDate.year}`
                    )
                    .addField(
                        "Staff",
                        manga.staff
                            .map(x => `${x.native || x.name} (${x.name}) - ID: ${x.id}`)
                            .join("\n")
                    )
                    .addField("Weighted mean score", manga.averageScore + "/100")
                    .addField("Trending", manga.trending)
                    .addField("Mean Score", manga.meanScore + "/100")
                    .addField("Genres", manga.genres)
                    .addField("NSFW", manga.isAdult || false)
                    .setThumbnail(manga.coverImage.large)
                    .addField(
                        "Misc",
                        `AniList ID: ${manga.id}
    MAL ID:${manga.idMal}`
                    )
                    .attachFiles([`/tmp/${manga.id}.json`])
                    .setColor("RANDOM")
                    .setImage(manga.bannerImage)
                    .addField("Synonyms", (() => manga.synonyms ? manga.synonyms.join(", ") : "N/A")())
                    .addField(
                        "Relations",
                        manga.relations
                            .map(r => {
                                return `**${r.title.romaji ||
                                    r.title.english ||
                                    r.title.native}** (ID:${r.id})`;
                            })
                            .join(" ,") || "N/A"
                    )
                    .addField("Last updated", new Date(manga.updatedAt * 1000));
                    if (character)                     embed.setFooter(
                        `${character.name.native || ""}  (${
                        character.name.first
                        } ${character.name.last || ""})`,
                        character.image.large
                    )
                    if (manga.tags[0]) embed.addField(
                        "Tags",
                        manga.tags
                            .map(tag => {
                                if (tag.isMediaSpoiler) return `||${tag}||`
                                else return tag
                            })
                            .join(", ")
                    )
                    if (manga.characters) embed.addField(
                        "Characters",
                        manga.characters.map(x => `${x.name}  (${x.id})`).join(", ") 
                    )
                    if (manga.staff)  embed.setAuthor(manga.staff[0].native || manga.staff[0].name)
                await message.channel.send("", { embed: embed });
            })
            .catch(console.error);
    }
}
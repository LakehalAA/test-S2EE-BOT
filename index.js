const { Console } = require("console");
const Discord = require("discord.js");
const client = new Discord.Client();
let list = [];
let msgid = "";
client.login("ODQxNzIwMjExMzcxODUxODE4.YJq3CA.CNnUavO3xWlxSxsuH3o2GNSsLio");

let commandQuit = "!quitfile";

mapfilesattente = [
  "853632334653947925",
  "853632401863213066",
  "853632439162634250",
];
mapfilesattentechannel = [
  "853631244746096650",
  "853631282113675314",
  "853631314937511966",
];
/**************************************/
let postulantActuel = "Click the icon ➡️ to start";

let URL = "https://i.postimg.cc/xdFSqMNS/t-l-charger.png";

let mapChannelsControlPanel = [
  "853631792673456139",
  "853634879459426344",
  "853634960670195732",
];

let mapControlPanel = [
  "854713596729884737",
  "854713909105000478",
  "854713910107308104",
];

/**************************************/

N = 3;
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  list[0] = [];
  list[1] = [];
  list[2] = [];

  for (i = 0; i < N; i++) {
    let ch = await client.channels.cache.get(mapfilesattentechannel[i]);
    console.log(mapfilesattentechannel[i]);
    let ms = await ch.messages.fetch(mapfilesattente[i]);
    em = new Discord.MessageEmbed();
    em.setColor("RED");
    em.setTitle(ms.embeds[0].title);
    em.setDescription("");
    ms.edit(em);
    ms.reactions.removeAll();
    ms.react("841785083010482206");

    let emCP;
    emCP = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Control Panel : Entreprise " + (i + 1))
      .setURL("https://etic-club.net/")
      .setDescription("Control Panel")
      .setThumbnail(URL)
      .addFields(
        { name: "Candidat Actuel", value: postulantActuel },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
        { name: "Inline field title", value: "Some value here", inline: true }
      )
      .addField("Inline field title", "Some value here", true)
      .setTimestamp()
      .setFooter(
        "➡️ : Pour passer au prochain postulant\n⏯️ : ¨Pour terminer l'entretien et prendre une pause\n",
        URL
      );

    ch = await client.channels.cache.get(mapChannelsControlPanel[i]);
    ms = await ch.messages.fetch(mapControlPanel[i]);

    ms.reactions.removeAll();

    ms.react("➡️");
    ms.react("⏸");
    ms.react("⏹");

    ms.edit("Bonjour, voilà votre panel de control");
    ms.edit(emCP);
  }
});

client.on("message", async function (message) {
  if (message.content.toLowerCase() != commandQuit) return;
  user = message.author;
  user.dmChannel || (await user.createDM());
  exist = -1;
  for (i = 0; i < N; i++) {
    if (list[i].includes(user.id)) exist = i;
  }
  if (exist >= 0) {
    index = list[exist].indexOf(user.id);
    list[exist].splice(index, 1);
    console.log(exist);
    let ch = await client.channels.cache.get(mapfilesattentechannel[exist]);
    let ms = await ch.messages.fetch(mapfilesattente[exist]);
    em2 = new Discord.MessageEmbed();

    em2.setTitle(ms.embeds[0].title);
    em2.setColor("RED");
    description = "";

    list[exist].forEach((hooman) => {
      description = description + "\n<@" + hooman + ">";
    });
    em2.setDescription(description);
    ms.edit(em2);
    ms.reactions.cache.get("841785083010482206").users.remove(user.id);
    user.send("Vous avez quitté la file d'attente.");
  } else {
    user.send("Vous n'êtes dans aucune file d'attente.");
  }
});

client.on("message", async function (message) {
  if (message.author.bot) return;
  if (!message.content.toLowerCase().startsWith("ping")) return;
  em = new Discord.MessageEmbed();
  const args = message.content.split(":");

  em.setDescription("");
  em.setTitle("Liste d'attente " + args[1]);
  em.setColor("RED");
  message.channel.send(em);
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;

  if (mapControlPanel.includes(reaction.message.id)) {
    var i = mapControlPanel.indexOf(reaction.message.id);
    next = async (indx) => {
      let file;

      file = list[indx];
      postulantActuel = "<@" + file.shift() + ">";

      console.log(postulantActuel);

      let em;
      em = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Control Panel : Entreprise " + indx)
        .setURL("https://etic-club.net/")
        .setDescription("Control Panel")
        .setThumbnail(URL)
        .addFields(
          { name: "Candidat Actuel", value: postulantActuel },
          { name: "\u200B", value: "\u200B" }
        )
        .addField("Inline field title", "Some value here", true)
        .setTimestamp()
        .setFooter(
          "➡️ : Pour passer au prochain postulant\n⏯️ : ¨Pour terminer l'entretien et prendre une pause\n",
          URL
        );

      let ch = await client.channels.cache.get(mapChannelsControlPanel[indx]);
      let ms = await ch.messages.fetch(mapControlPanel[indx]);

      ms.edit(em);
    };

    try {
      await reaction.users.remove(user.id);
    } catch (error) {
      console.error("Failed to remove reaction.");
    }

    next(i);
  }

  if (!mapfilesattente.includes(reaction.message.id)) return;
  em = new Discord.MessageEmbed();
  id = mapfilesattente.indexOf(reaction.message.id);
  if (list[id].includes(user.id)) return;
  em.setTitle(reaction.message.embeds[0].title);
  em.setColor("RED");
  exist = -1;
  user = await client.users.fetch(user.id);
  user.dmChannel || (await user.createDM());
  for (i = 0; i < N; i++) {
    if (list[i].includes(user.id)) exist = i;
  }
  if (exist >= 0) {
    user.send(
      "Vous êtes déjà dans une file d'attente. Voulez-vous abondonner votre place dans la première file ? Répondez par 'Oui'/'Non'"
    );
    const filter = (m) => !m.author.bot;
    contin = true;
    while (contin) {
      const reply = await user.dmChannel.awaitMessages(filter, { max: 1 });
      let str = "";
      console.log(reply.first().content);
      if (
        reply.first().content.toLowerCase() != "non" &&
        reply.first().content.toLowerCase() != "oui"
      ) {
        user.send("Erreur, répondez par oui ou non uniquement.");
      } else {
        if (reply.first().content.toLowerCase() == "oui") {
          index = list[exist].indexOf(user.id);
          list[exist].splice(index, 1);
          let ch = await client.channels.cache.get(
            mapfilesattentechannel[exist]
          );
          let ms = await ch.messages.fetch(mapfilesattente[exist]);
          em2 = new Discord.MessageEmbed();
          em2.setTitle(ms.embeds[0].title);
          em2.setColor("RED");
          description = "";

          list[exist].forEach((hooman) => {
            description = description + "\n<@" + hooman + ">";
          });
          em2.setDescription(description);
          ms.edit(em2);
          console.log(reaction._emoji.id);
          ms.reactions.cache.get(reaction._emoji.id).users.remove(user.id);
          user.send(
            "Vous avez rejoint la nouvelle file d'attente et quitté l'ancienne."
          );
        } else if (reply.first().content.toLowerCase() == "non") {
          reaction.users.remove(user.id);
          user.send("Vous n'avez pas rejoint la nouvelle file d'attente.");
          return;
        }

        contin = false;
      }
    }
  }

  list[id].push(user.id);
  description = "";

  list[id].forEach((hooman) => {
    description = description + "\n<@" + hooman + ">";
  });
  em.setDescription(description);

  reaction.message.edit(em);
});

client.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot) return;
  if (!mapfilesattente.includes(reaction.message.id)) return;
  exist = -1;
  for (i = 0; i < N; i++) {
    if (list[i].includes(user.id)) exist = i;
  }
  if (list[exist].includes(user.id)) {
    user.send(
      "Utilisez la commande " + commandQuit + " pour quitter la file d'attente."
    );
  }
});

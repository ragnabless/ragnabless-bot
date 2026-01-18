import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = "MTQ2MjUyMTczNzczOTc2Mzc5Ng.GRV6FJ.CGBgDG2WL0OTUvJYLLPvjMLENPvKVfBu4AmT88";
const API_URL = "https://ragnabless.infinityfreeapp.com/create_account.php";

client.once("ready", () => {
  console.log(`Bot online como ${client.user.tag}`);
});

// Registrar slash command
client.on("ready", async () => {
  await client.application.commands.create({
    name: "criarconta",
    description: "Criar conta no Ragnarok",
    options: [
      {
        name: "login",
        description: "Login da conta",
        type: 3,
        required: true
      },
      {
        name: "senha",
        description: "Senha da conta",
        type: 3,
        required: true
      },
      {
        name: "email",
        description: "Email da conta",
        type: 3,
        required: true
      }
    ]
  });
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "criarconta") {
    await interaction.deferReply({ ephemeral: true });

    const login = interaction.options.getString("login");
    const senha = interaction.options.getString("senha");
    const email = interaction.options.getString("email");
    const discordId = interaction.user.id;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: login,
          password: senha,
          email: email,
          discord_id: discordId
        })
      });

      const text = await response.text();
      await interaction.editReply(text);
    } catch (err) {
      await interaction.editReply("Erro ao conectar com o servidor.");
    }
  }
});

client.login(TOKEN);

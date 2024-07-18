module.exports = {
    name: "hi",
    description: "Replies with hi!",
  
    callback: async (client, interaction) => {
      await interaction.deferReply();
  
      interaction.editReply(
        `Wola cara de bolaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`,
      );
    },
  };
export async function onRequestPost({ request, env }) {
  if (!env.DISCORD_WEBHOOK_URL) {
    return Response.json(
      { error: "Le webhook Discord n'est pas configuré." },
      { status: 500 }
    );
  }

  let data;

  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Données invalides." }, { status: 400 });
  }

  const platform = String(data.platform || "").trim();
  const accountName = String(data.accountName || "").trim();
  const reason = String(data.reason || "").trim();

  if (!["Twitch", "Discord", "Youtube"].includes(platform)) {
    return Response.json(
      { error: "Choisis Twitch, Discord ou Youtube." },
      { status: 400 }
    );
  }

  if (
    !accountName ||
    !reason ||
    accountName.length > 100 ||
    reason.length > 3000
  ) {
    return Response.json(
      { error: "Vérifie les champs du formulaire." },
      { status: 400 }
    );
  }

  const moderationRoles = {
    Twitch: "1555693891863453756",
    Discord: "1539393533838885035",
    Youtube: "1555694201478324224"
  };

  const roleId = moderationRoles[platform];

  const message = {
    content: `<@&${roleId}> Nouvelle demande d'appel pour ${platform}`,
    allowed_mentions: {
      roles: [roleId]
    },
    embeds: [
      {
        title: `Demande d'appel — ${platform}`,
        fields: [
          { name: "Compte", value: accountName },
          { name: "Motif", value: reason }
        ]
      }
    ]
  };

  let discordResponse;

  try {
    discordResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });
  } catch {
    return Response.json(
      { error: "Impossible de contacter Discord." },
      { status: 502 }
    );
  }

  if (!discordResponse.ok) {
    return Response.json(
      { error: "Discord n'a pas accepté la demande." },
      { status: 502 }
    );
  }

  return Response.json({ success: true });
}
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

  const discordName = String(data.discordName || "").trim();
  const reason = String(data.reason || "").trim();

  if (!discordName || !reason || discordName.length > 100 || reason.length > 3000) {
    return Response.json({ error: "Vérifie les champs du formulaire." }, { status: 400 });
  }

  const discordResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `Nouvelle demande @everyone\n**Compte Discord :** ${discordName}\n**Motif :**\n${reason}`
    })
  });

  if (!discordResponse.ok) {
    return Response.json({ error: "Discord n'a pas accepté la demande." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
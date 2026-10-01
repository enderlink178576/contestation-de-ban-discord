const appealForm = document.querySelector("#appeal-form");
const replyForm = document.querySelector("#reply-form");
const conversation = document.querySelector("#conversation");
const messages = document.querySelector("#messages");
const status = document.querySelector("#status");

function addMessage(author, text, isMod = false) {
    const article = document.createElement("article");
    article.className = isMod ? "message mod" : "message";

    const label = document.createElement("small");
    label.textContent = author;

    const content = document.createElement("div");
    content.textContent = text; // Affiche le texte sans interpréter du HTML.

    article.append(label, content);
    messages.append(article);
}

appealForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const discordName = document.querySelector("#discord-name").value.trim();
    const reason = document.querySelector("#reason").value.trim();

    if (!discordName || !reason) return;

    conversation.hidden = false;
    addMessage("Ta demande", `Compte Discord : ${discordName}\n\n${reason}`);
    status.textContent =
     "Démo uniquement : cette demande n’a pas été envoyée à Discord.";
    appealForm.hidden = true;
});

replyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = document.querySelector("#reply");
    const text = input.value.trim();

    if (!text) return;

    addMessage("Toi", text);
    input.value = "";
    status.textContent =
    "Démo uniquement : ce message n’a pas été envoyé à Discord.";
});
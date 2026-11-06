const form = document.getElementById("wishForm");
const nameInput = document.getElementById("girlName");
const wishInput = document.getElementById("wishText");
const message = document.getElementById("formMessage");
const grid = document.getElementById("wishesGrid");
const count = document.getElementById("wishCount");
const dialog = document.getElementById("wishDialog");
const supabaseReady = window.supabase &&
  window.SUPABASE_URL && !window.SUPABASE_URL.startsWith("PEGA_") &&
  window.SUPABASE_ANON_KEY && !window.SUPABASE_ANON_KEY.startsWith("PEGA_");
const db = supabaseReady ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;
let wishes = [];

function showWish(wish) {
  document.getElementById("dialogName").textContent = wish.name;
  document.getElementById("dialogWish").textContent = wish.wish;
  dialog.showModal();
}
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });

function renderWishes() {
  count.textContent = wishes.length;
  if (!wishes.length) {
    grid.innerHTML = '<div class="empty-state">Todavía no hay deseos. ¡Sé la primera en encender una esfera! 💜</div>';
    return;
  }
  grid.replaceChildren();
  wishes.forEach(w => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "wish-card";
    const person = document.createElement("div");
    person.className = "wish-person";
    person.textContent = "💜 " + w.name;
    const preview = document.createElement("div");
    preview.className = "wish-preview";
    preview.textContent = w.wish.length > 82 ? w.wish.slice(0, 82) + "…" : w.wish;
    const hint = document.createElement("small");
    hint.className = "wish-hint";
    hint.textContent = "Toca para leer ✨";
    card.append(person, preview, hint);
    card.addEventListener("click", () => showWish(w));
    grid.append(card);
  });
}

async function loadWishes() {
  if (!db) {
    wishes = JSON.parse(localStorage.getItem("moonlight-wishes-demo") || "[]");
    renderWishes();
    message.textContent = "Vista de prueba: los deseos se guardan en este navegador hasta conectar Supabase.";
    return;
  }
  const { data, error } = await db.from("wishes").select("id,name,wish,created_at").order("created_at", { ascending: false });
  if (error) {
    message.textContent = "No pudimos cargar los deseos. Revisa la configuración de Supabase.";
    console.error(error);
    return;
  }
  wishes = data || [];
  renderWishes();
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const wish = wishInput.value.trim();
  if (!name || !wish) return;
  if (wish.length > 240) { message.textContent = "Tu deseo debe tener máximo 240 caracteres."; return; }
  const submit = form.querySelector("button[type=submit]");
  submit.disabled = true;
  submit.textContent = "Guardando…";
  if (db) {
    const { error } = await db.from("wishes").insert({ name, wish });
    if (error) {
      message.textContent = "No se pudo guardar. Intenta nuevamente.";
      console.error(error);
    } else {
      message.textContent = "¡Tu deseo ya está brillando en nuestro árbol! 💜";
      form.reset();
      await loadWishes();
    }
  } else {
    wishes.unshift({ id: crypto.randomUUID(), name, wish, created_at: new Date().toISOString() });
    localStorage.setItem("moonlight-wishes-demo", JSON.stringify(wishes));
    renderWishes();
    message.textContent = "¡Tu deseo ya está brillando en esta vista de prueba! 💜";
    form.reset();
  }
  submit.disabled = false;
  submit.innerHTML = 'Colocar mi deseo <span>✧</span>';
});

loadWishes();
if (db) {
  db.channel("wishes-live").on("postgres_changes", { event: "*", schema: "public", table: "wishes" }, loadWishes).subscribe();
}

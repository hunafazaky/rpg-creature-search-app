type CreatureType = { name: string };
type CreatureStat = { name: string; base_stat: number };

export type CreatureData = {
  id: number;
  name: string;
  weight: number;
  height: number;
  types: CreatureType[];
  stats: CreatureStat[];
};

const apiBaseUrl = "https://rpg-creature-api.freecodecamp.rocks/api/creature";

export async function fetchCreature(search: string): Promise<CreatureData> {
  const query = search.trim();
  if (!query) {
    throw new Error("Search field is empty");
  }

  const response = await fetch(`${apiBaseUrl}/${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("Creature not found");
  }

  const data = await response.json();
  return data as CreatureData;
}

const statRows = [
  { id: "hp", label: "HP" },
  { id: "attack", label: "ATK" },
  { id: "defense", label: "DEF" },
  { id: "special-attack", label: "SP. ATK" },
  { id: "special-defense", label: "SP. DEF" },
  { id: "speed", label: "SPD" },
];

const statNameMap = new Map<string, string>([
  ["hp", "hp"],
  ["attack", "attack"],
  ["defense", "defense"],
  ["special-attack", "special-attack"],
  ["special-defense", "special-defense"],
  ["speed", "speed"],
]);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSearchContent(): string {
  return `
    <section class="search-panel">
      <div class="search-row">
        <label for="search-input">Creature name or id</label>
        <input id="search-input" type="text" value="Pyrolynx" />
        <button id="search-button" type="button">Search</button>
      </div>
      <div id="search-status" class="search-status" aria-live="polite"></div>
    </section>

    <section class="main-info">
      <p>
        <span id="creature-name" class="creature-name"></span>
        <span id="creature-id" class="creature-id"></span>
      </p>
      <p id="weight" class="creature-detail"></p>
      <p id="height" class="creature-detail"></p>
      <div id="types" class="creature-types"></div>
    </section>

    <section class="stats-table">
      <table>
        <thead>
          <tr>
            <th>Base</th>
            <th>Stats</th>
          </tr>
        </thead>
        <tbody>
          ${statRows.map((row) => `<tr><td>${row.label}:</td><td class="stat" id="${row.id}"></td></tr>`).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function updateCreatureInfo(root: HTMLElement, creature: CreatureData): void {
  const nameElement = root.querySelector<HTMLSpanElement>("#creature-name")!;
  const idElement = root.querySelector<HTMLSpanElement>("#creature-id")!;
  const weightElement = root.querySelector<HTMLParagraphElement>("#weight")!;
  const heightElement = root.querySelector<HTMLParagraphElement>("#height")!;
  const typesElement = root.querySelector<HTMLDivElement>("#types")!;

  nameElement.textContent = creature.name;
  idElement.textContent = `#${creature.id}`;
  weightElement.textContent = `Weight: ${creature.weight}`;
  heightElement.textContent = `Height: ${creature.height}`;
  typesElement.innerHTML = creature.types
    .map(
      (creatureType) =>
        `<span class="tag">${escapeHtml(creatureType.name)}</span>`,
    )
    .join(" ");

  const statEntries = new Map(
    creature.stats.map((stat) => [stat.name.toLowerCase(), stat.base_stat]),
  );

  for (const [statId] of statNameMap) {
    const statElement = root.querySelector<HTMLTableCellElement>(`#${statId}`)!;
    const statValue = statEntries.get(statId) ?? "-";
    statElement.textContent = String(statValue);
  }
}

function updateStatus(
  root: HTMLElement,
  message: string,
  isError = false,
): void {
  const statusElement = root.querySelector<HTMLDivElement>("#search-status")!;
  statusElement.textContent = message;
  statusElement.style.color = isError ? "crimson" : "inherit";
}

export function setupCreatureSearchApp(root: HTMLElement): void {
  root.innerHTML = renderSearchContent();

  const input = root.querySelector<HTMLInputElement>("#search-input")!;
  const button = root.querySelector<HTMLButtonElement>("#search-button")!;

  async function handleSearch(): Promise<void> {
    const searchTerm = input.value.trim();

    if (!searchTerm) {
      updateStatus(root, "Please enter a creature name or id.", true);
      return;
    }

    updateStatus(root, "Loading...");

    try {
      const creature = await fetchCreature(searchTerm);
      updateCreatureInfo(root, creature);
      updateStatus(root, "Creature loaded successfully.");
    } catch (error) {
      console.error(error);
      updateStatus(
        root,
        "Creature not found. Please try another name or id.",
        true,
      );
      const nameElement =
        root.querySelector<HTMLSpanElement>("#creature-name")!;
      const idElement = root.querySelector<HTMLSpanElement>("#creature-id")!;
      const weightElement =
        root.querySelector<HTMLParagraphElement>("#weight")!;
      const heightElement =
        root.querySelector<HTMLParagraphElement>("#height")!;
      const typesElement = root.querySelector<HTMLDivElement>("#types")!;
      nameElement.textContent = "";
      idElement.textContent = "";
      weightElement.textContent = "";
      heightElement.textContent = "";
      typesElement.textContent = "";
      for (const [statId] of statNameMap) {
        const statElement = root.querySelector<HTMLTableCellElement>(
          `#${statId}`,
        )!;
        statElement.textContent = "";
      }
    }
  }

  button.addEventListener("click", handleSearch);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  });
}

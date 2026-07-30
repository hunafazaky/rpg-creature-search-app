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
  <h1>RPG Creature Search App</h1>
    <div class=" text-brand-dark mx-auto sm:my-4 md:w-1/2 sm:w-3/4 w-full p-4">
      <section class="search-panel text-sm">
        <div class="search-row flex flex-col">
          <label for="search-input" class="text-left py-1">Creature Name or ID</label>
          <div class="flex">
            <input id="search-input" type="text" value="Pyrolynx" class="grow bg-brand-base rounded p-1 border"/>
            <button id="search-button" type="button" class="cursor-pointer bg-sky-700 hover:bg-sky-900 text-brand-base px-2 py-0.5 rounded w-1/5">Search</button>
          </div>
        </div>
        <div class="text-amber-500 h-10">
          <div id="search-status" class="search-status p-2" aria-live="polite"></div>
        </div>
      </section>

      <section class="main-info text-left text-sm bg-brand-base border rounded">
        <div class="border-b p-2 font-bold">
          <span id="creature-id" class="creature-id">#id - </span>
          <span id="creature-name" class="creature-name">CreatureName</span>
        </div>
        <div class="p-2">
          <p id="weight" class="creature-detail">Weight: -</p>
          <p id="height" class="creature-detail">Height: -</p>
          <div id="types" class="creature-types">Type: -</div>
        </div>
      </section>

      <section class="stats-table border rounded my-4 text-sm">
        <table class="table-fixed w-full rounded bg-brand-base text-left">
          <thead>
            <tr>
              <th class="p-2 border-r">Base</th>
              <th class="p-2">Stats</th>
            </tr>
          </thead>
          <tbody>
            ${statRows.map((row) => `<tr><td class="p-2 border-t border-r">${row.label}:</td><td class="stat p-2 border-t" id="${row.id}"></td></tr>`).join("")}
          </tbody>
        </table>
      </section>
    </div>
  `;
}

function updateCreatureInfo(root: HTMLElement, creature: CreatureData): void {
  const nameElement = root.querySelector<HTMLSpanElement>("#creature-name")!;
  const idElement = root.querySelector<HTMLSpanElement>("#creature-id")!;
  const weightElement = root.querySelector<HTMLParagraphElement>("#weight")!;
  const heightElement = root.querySelector<HTMLParagraphElement>("#height")!;
  const typesElement = root.querySelector<HTMLDivElement>("#types")!;

  nameElement.textContent = creature.name;
  idElement.textContent = `#${creature.id} - `;
  weightElement.textContent = `Weight: ${creature.weight}`;
  heightElement.textContent = `Height: ${creature.height}`;
  typesElement.innerHTML = creature.types
    .map(
      (creatureType) =>
        `<span class="tag">Element: ${escapeHtml(creatureType.name)}</span>`,
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

const input = document.querySelector("#search-input");
const button = document.querySelector("#search-button");
const cName = document.querySelector("#creature-name");
const cId = document.querySelector("#creature-id");
const weight = document.querySelector("#weight");
const height = document.querySelector("#height");
const types = document.querySelector("#types");
const stats = document.querySelectorAll(".stat");

async function fetchData(search) {
  const url = `https://rpg-creature-api.freecodecamp.rocks/api/creature/${search}`;
  const response = await fetch(url);
  return response.json();
}

button.addEventListener("click", async function () {
  if (input.value !== "") {
    try {
      const data = await fetchData(input.value);
      console.log(data);
      cName.innerHTML = `${data.name}`;
      cId.innerHTML = `#${data.id}`;
      weight.innerHTML = `weight: ${data.weight}`;
      height.innerHTML = `Height: ${data.height}`;
      types.innerHTML = "";
      data.types.forEach((element) => {
        types.innerHTML += `<div class="tag">${element.name}</div>`;
      });
      // <div>${data.types[1].name}</div>
      data.stats.forEach((element, i) => {
        if (element.name === stats[i].id)
          stats[i].innerHTML = element.base_stat;
      });
    } catch (error) {
      console.log(error);
      alert("Creature not found");
    }
  } else {
    cName.innerHTML = "no";
  }
});

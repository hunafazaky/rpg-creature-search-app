(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://rpg-creature-api.freecodecamp.rocks/api/creature`;async function t(t){let n=t.trim();if(!n)throw Error(`Search field is empty`);let r=await fetch(`${e}/${encodeURIComponent(n)}`);if(!r.ok)throw Error(`Creature not found`);return await r.json()}var n=[{id:`hp`,label:`HP`},{id:`attack`,label:`ATK`},{id:`defense`,label:`DEF`},{id:`special-attack`,label:`SP. ATK`},{id:`special-defense`,label:`SP. DEF`},{id:`speed`,label:`SPD`}],r=new Map([[`hp`,`hp`],[`attack`,`attack`],[`defense`,`defense`],[`special-attack`,`special-attack`],[`special-defense`,`special-defense`],[`speed`,`speed`]]);function i(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function a(){return`
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
          <div id="types" class="creature-types">Element: -</div>
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
            ${n.map(e=>`<tr><td class="p-2 border-t border-r">${e.label}:</td><td class="stat p-2 border-t" id="${e.id}"></td></tr>`).join(``)}
          </tbody>
        </table>
      </section>
    </div>
  `}function o(e,t){let n=e.querySelector(`#creature-name`),a=e.querySelector(`#creature-id`),o=e.querySelector(`#weight`),s=e.querySelector(`#height`),c=e.querySelector(`#types`);n.textContent=t.name,a.textContent=`#${t.id} - `,o.textContent=`Weight: ${t.weight}`,s.textContent=`Height: ${t.height}`,c.innerHTML=t.types.map(e=>`<span class="tag">Element: ${i(e.name)}</span>`).join(` `);let l=new Map(t.stats.map(e=>[e.name.toLowerCase(),e.base_stat]));for(let[t]of r){let n=e.querySelector(`#${t}`),r=l.get(t)??`-`;n.textContent=String(r)}}function s(e,t,n=!1){let r=e.querySelector(`#search-status`);r.textContent=t,r.style.color=n?`crimson`:`inherit`}function c(e){e.innerHTML=a();let n=e.querySelector(`#search-input`),i=e.querySelector(`#search-button`);async function c(){let i=n.value.trim();if(!i){s(e,`Please enter a creature name or id.`,!0);return}s(e,`Loading...`);try{o(e,await t(i)),s(e,`Creature loaded successfully.`)}catch(t){console.error(t),s(e,`Creature not found. Please try another name or id.`,!0);let n=e.querySelector(`#creature-name`),i=e.querySelector(`#creature-id`),a=e.querySelector(`#weight`),o=e.querySelector(`#height`),c=e.querySelector(`#types`);n.textContent=``,i.textContent=``,a.textContent=``,o.textContent=``,c.textContent=``;for(let[t]of r){let n=e.querySelector(`#${t}`);n.textContent=``}}}i.addEventListener(`click`,c),n.addEventListener(`keydown`,e=>{e.key===`Enter`&&c()})}var l=document.querySelector(`#app`);if(!l)throw Error(`Root element #app not found`);c(l);
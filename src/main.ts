import "./style.css";
import { setupCreatureSearchApp } from "./search.ts";

const appRoot = document.querySelector<HTMLDivElement>("#app");
if (!appRoot) {
  throw new Error("Root element #app not found");
}

setupCreatureSearchApp(appRoot);

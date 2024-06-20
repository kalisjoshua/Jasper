import { Jasper } from "./jasper.engine.mjs";
import { asks } from "./jasper.asks.mjs";

let challengesList;
const current = "current";
let once = () => {
  challengesList.querySelector("li:first-child").classList.add("complete");
  once = () => {};
};

window.Jasper = window.jasper = new Proxy(Jasper, {
  apply(fn, context, args) {
    fn.apply(context, args)
      .catch(({ error, message }) => {
        console.error({ error });
        console.log({ message });

        return Jasper();
      })
      .then((result) => console.log(result));
  },
});

Jasper("listen", (event) => {
  const { level } = event.challenge;

  // Mark the first list item completed because there is no good way
  // to detect if the browser's devtools/console has been opened.
  if (!/ask|listen/i.test(event.invocation.command)) once();

  if (event.result) {
    document
      .querySelector(`[title="${event.challenge.info.intro}"]`)
      ?.classList.add("complete");
  }

  if (challengesList) {
    challengesList.querySelector(`.${current}`)?.classList.remove(current);
    challengesList
      .querySelector(`li:nth-of-type(${level + 1 + !!event.result})`)
      ?.classList.add(current);
  }
});

addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  challengesList = document.querySelector("[data-challenges]");

  asks.forEach(([title, hint, fn], index) => {
    Jasper("ask", title, hint, fn);

    const elDetails = document.createElement("DETAILS");
    const elLI = document.createElement("LI");
    const elSummary = document.createElement("SUMMARY");
    const elHint = document.createElement("P");

    elSummary.innerHTML = title;
    elHint.innerHTML = hint;
    elLI.setAttribute("title", title);

    elDetails.appendChild(elSummary);
    elDetails.appendChild(elHint);
    elLI.appendChild(elDetails);
    challengesList.appendChild(elLI);
  });
});

console.log(
  "Level 0: Completed by opening your browser's console.\n" +
    "'Jasper' is waiting for 'start'. GL! HF!",
);

document.addEventListener("DOMContentLoaded", () => {
  TinyTimer.mount({
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
    start: document.getElementById("start"),
    reset: document.getElementById("reset"),
    preset: document.getElementById("preset"),
    status: document.getElementById("status")
  });

  MiniGames.boot({
    canvas: document.getElementById("gameCanvas"),
    board: document.getElementById("gameBoard"),
    stage: document.getElementById("gameStage"),
    hud: document.getElementById("gameHud"),
    hint: document.getElementById("gameHint"),
    tabs: document.getElementById("gameTabs")
  });

  Workshop.boot({
    dock: document.querySelector(".dock"),
    sheet: document.getElementById("sheet"),
    sheetBody: document.getElementById("sheetBody"),
    sheetClose: document.getElementById("sheetClose"),
    luckyLayer: document.getElementById("luckyLayer"),
    chips: document.getElementById("packChips"),
    toast: document.getElementById("toast")
  });

  document.getElementById("restart").addEventListener("click", () => MiniGames.restart());
});

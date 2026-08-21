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

  document.getElementById("restart").addEventListener("click", () => MiniGames.restart());
});

/* 25 playable cabinet games. Canvas + DOM boards. */
const Arcade = {
  canvas: null, ctx: null, game: null, raf: 0, keys: {}, running: false, score: 0,
  boot() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.refreshSelect();
    addEventListener("keydown", (e) => { this.keys[e.key] = true; if (this.game && this.game.key) this.game.key(e); });
    addEventListener("keyup", (e) => { this.keys[e.key] = false; });
    this.canvas.addEventListener("mousedown", (e) => this.game && this.game.click && this.game.click(this.mouse(e)));
    this.canvas.addEventListener("mousemove", (e) => this.game && this.game.move && this.game.move(this.mouse(e)));
  },
  refreshSelect() {
    const sel = document.getElementById("gameSelect");
    if (!sel) return;
    sel.innerHTML = "";
    CHAOS_FEATURES.filter((f) => f.cat === "game" && (!window.Progress || Progress.has(f.action))).forEach((f) => {
      const o = document.createElement("option"); o.value = f.action; o.textContent = f.name; sel.appendChild(o);
    });
  },
  mouse(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) * (this.canvas.width / r.width), y: (e.clientY - r.top) * (this.canvas.height / r.height) };
  },
  launchSelected() { this.open(document.getElementById("gameSelect").value); },
  openPicker() { document.getElementById("arcade").scrollIntoView({ behavior: "smooth" }); toast("Arcade cabinet"); },
  open(id) {
    if (window.Progress && !Progress.has(id)) { toast("still locked"); return; }
    this.close();
    this.running = true;
    this.score = 0;
    const canvasGames = ["gameSnake","gameBrickDrop","gameFlappy","gameMoles","gamePong","gameBreakout","gameReflex","gameAim","gameAsteroids","gameTyping"];
    const useCanvas = canvasGames.includes(id);
    this.canvas.classList.toggle("hidden", !useCanvas);
    document.getElementById("gameBoard").classList.toggle("hidden", useCanvas);
    this.game = Games[id] && Games[id]();
    if (!this.game) { toast("Unknown game"); return; }
    this.game.init && this.game.init();
    if (useCanvas) this.loop();
    document.getElementById("gameHud").textContent = CHAOS_FEATURES.find((f) => f.action === id).name;
    Badge.earn("arcade");
    Shop.add(1);
  },
  close() {
    this.running = false; cancelAnimationFrame(this.raf); this.game = null;
    this.canvas.classList.add("hidden");
    document.getElementById("gameBoard").classList.add("hidden");
    document.getElementById("gameBoard").innerHTML = "";
  },
  loop() {
    if (!this.running || !this.game) return;
    this.game.step && this.game.step();
    this.game.draw && this.game.draw(this.ctx);
    this.raf = requestAnimationFrame(() => this.loop());
  },
  hud(s) { document.getElementById("gameHud").textContent = s; }
};

const Games = {
  gameSnake() {
    const cs = 16, cols = 40, rows = 22;
    let snake, dir, food, dead, acc;
    return {
      init() { snake = [{x:8,y:8}]; dir = {x:1,y:0}; food = {x:20,y:10}; dead = false; acc = 0; },
      key(e) {
        const m = { ArrowUp:[0,-1], ArrowDown:[0,1], ArrowLeft:[-1,0], ArrowRight:[1,0] };
        if (m[e.key]) { const [x,y] = m[e.key]; if (dir.x !== -x && dir.y !== -y) dir = {x,y}; }
      },
      step() {
        if (dead) return;
        acc++; if (acc % 6) return;
        const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        if (h.x<0||h.y<0||h.x>=cols||h.y>=rows||snake.some((s)=>s.x===h.x&&s.y===h.y)) { dead = true; Arcade.hud("snake down · "+snake.length); return; }
        snake.unshift(h);
        if (h.x===food.x && h.y===food.y) { food = { x:(Math.random()*cols)|0, y:(Math.random()*rows)|0 }; Shop.add(1); }
        else snake.pop();
        Arcade.hud("snake "+snake.length);
      },
      draw(c) {
        c.fillStyle = "#140806"; c.fillRect(0,0,640,360);
        c.fillStyle = "#ffd23a"; c.fillRect(food.x*cs, food.y*cs, cs-1, cs-1);
        snake.forEach((s,i) => { c.fillStyle = i? "#ff4b1f":"#b6ff4a"; c.fillRect(s.x*cs,s.y*cs,cs-1,cs-1); });
      }
    };
  },
  gameBrickDrop() {
    const W=10,H=16,S=22;
    const shapes = [[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];
    let grid, piece, x, y, tick;
    function spawn() { piece = shapes[(Math.random()*shapes.length)|0]; x = 4; y = 0; }
    function hit(nx,ny,p) {
      for (let r=0;r<p.length;r++) for (let c=0;c<p[r].length;c++) if (p[r][c] && (ny+r>=H||nx+c<0||nx+c>=W||grid[ny+r][nx+c])) return true;
      return false;
    }
    function merge() {
      piece.forEach((row,r)=>row.forEach((v,c)=>{ if(v&&y+r>=0) grid[y+r][x+c]=1; }));
      grid = grid.filter((row)=>row.some((v)=>!v));
      while (grid.length<H) grid.unshift(Array(W).fill(0));
      spawn();
    }
    return {
      init() { grid = Array.from({length:H},()=>Array(W).fill(0)); spawn(); tick=0; },
      key(e) {
        if (e.key==="ArrowLeft" && !hit(x-1,y,piece)) x--;
        if (e.key==="ArrowRight" && !hit(x+1,y,piece)) x++;
        if (e.key==="ArrowDown" && !hit(x,y+1,piece)) y++;
        if (e.key==="ArrowUp") {
          const r = piece[0].map((_,i)=>piece.map((row)=>row[i]).reverse());
          if (!hit(x,y,r)) piece = r;
        }
      },
      step() { tick++; if (tick%20) return; if (!hit(x,y+1,piece)) y++; else merge(); },
      draw(c) {
        c.fillStyle="#140806"; c.fillRect(0,0,640,360);
        const ox=210;
        const paint=(px,py,col)=>{ c.fillStyle=col; c.fillRect(ox+px*S, py*S, S-1, S-1); };
        grid.forEach((row,r)=>row.forEach((v,col)=>{ if(v) paint(col,r,"#ff8a3d"); }));
        piece.forEach((row,r)=>row.forEach((v,col)=>{ if(v) paint(x+col,y+r,"#2ee6ff"); }));
      }
    };
  },
  gameFlappy() {
    let y, vy, pipes, alive, t;
    return {
      init() { y=160; vy=0; pipes=[{x:640,h:120}]; alive=true; t=0; },
      click() { vy = -6; AudioBus.tone(520,0.08,"square","sfx",0.1); },
      key(e) { if (e.key===" ") { e.preventDefault(); vy=-6; } },
      step() {
        if (!alive) return;
        t++; vy += 0.28; y += vy;
        if (t%90===0) pipes.push({x:640,h:60+Math.random()*160});
        pipes.forEach((p)=>p.x-=3);
        pipes = pipes.filter((p)=>p.x>-40);
        const hit = y<0||y>360||pipes.some((p)=>p.x<80&&p.x>40&&(y<p.h||y>p.h+90));
        if (hit) { alive=false; Arcade.hud("flapped out"); }
        else Arcade.hud("flaps "+t);
      },
      draw(c) {
        c.fillStyle="#1a3d4a"; c.fillRect(0,0,640,360);
        c.fillStyle="#3db54a"; pipes.forEach((p)=>{ c.fillRect(p.x,0,36,p.h); c.fillRect(p.x,p.h+90,36,360); });
        c.fillStyle="#ffd23a"; c.fillRect(56,y,24,24);
      }
    };
  },
  gameMoles() {
    let moles, hits, t;
    return {
      init() { moles=Array(6).fill(0); hits=0; t=0; },
      click(p) {
        const i = Math.floor(p.x/106) + (p.y>180?3:0);
        if (moles[i]) { moles[i]=0; hits++; Shop.add(1); AudioBus.drum("wood"); Dopamine.combo("+WHACK","#b6ff4a"); }
      },
      step() {
        t++;
        if (t%40===0) moles[(Math.random()*6)|0] = 30;
        moles = moles.map((m)=>Math.max(0,m-1));
        Arcade.hud("moles "+hits);
      },
      draw(c) {
        c.fillStyle="#2a120c"; c.fillRect(0,0,640,360);
        moles.forEach((m,i)=>{
          const x=(i%3)*210+40, y=(i<3?40:200);
          c.fillStyle="#3a2218"; c.beginPath(); c.ellipse(x+60,y+90,70,24,0,0,6.28); c.fill();
          if (m) { c.fillStyle="#c98a3b"; c.beginPath(); c.arc(x+60,y+50,28,0,6.28); c.fill(); }
        });
      }
    };
  },
  gamePong() {
    let bx,by,vx,vy,py,ay, ps, as;
    return {
      init() { bx=320;by=180;vx=4;vy=3;py=140;ay=140;ps=0;as=0; },
      move(p) { py = Math.max(0, Math.min(300, p.y-30)); },
      step() {
        bx+=vx; by+=vy;
        if (by<0||by>360) vy*=-1;
        if (bx<18 && by>py && by<py+60) { vx=Math.abs(vx); ps++; }
        if (bx>622 && by>ay && by<ay+60) { vx=-Math.abs(vx); }
        if (bx<0) { as++; bx=320; }
        if (bx>640) { ps++; bx=320; }
        ay += Math.sign((by-30)-ay)*3;
        Arcade.hud("pong "+ps+"–"+as);
      },
      draw(c) {
        c.fillStyle="#140806"; c.fillRect(0,0,640,360);
        c.fillStyle="#2ee6ff"; c.fillRect(8,py,10,60);
        c.fillStyle="#ff3ec8"; c.fillRect(622,ay,10,60);
        c.fillStyle="#ffd23a"; c.beginPath(); c.arc(bx,by,7,0,6.28); c.fill();
      }
    };
  },
  gameBreakout() {
    let bricks, bx, by, vx, vy, px;
    return {
      init() {
        bricks=[]; for (let r=0;r<4;r++) for (let c=0;c<10;c++) bricks.push({x:c*62+10,y:r*22+20,on:1});
        bx=320; by=200; vx=3; vy=-3; px=280;
      },
      move(p) { px = p.x-40; },
      step() {
        bx+=vx; by+=vy;
        if (bx<0||bx>640) vx*=-1;
        if (by<0) vy*=-1;
        if (by>330 && bx>px && bx<px+80) vy=-Math.abs(vy);
        bricks.forEach((b)=>{ if(b.on && bx>b.x&&bx<b.x+58&&by>b.y&&by<b.y+18){ b.on=0; vy*=-1; Shop.add(1);} });
        Arcade.hud("bricks "+bricks.filter((b)=>b.on).length);
      },
      draw(c) {
        c.fillStyle="#140806"; c.fillRect(0,0,640,360);
        bricks.forEach((b)=>{ if(!b.on)return; c.fillStyle=["#ff4b1f","#ffd23a","#2ee6ff","#ff3ec8"][(b.y/22)|0]; c.fillRect(b.x,b.y,58,18); });
        c.fillStyle="#fff"; c.fillRect(px,340,80,10);
        c.fillStyle="#ffd23a"; c.beginPath(); c.arc(bx,by,6,0,6.28); c.fill();
      }
    };
  },
  gameReflex() {
    let state, t0;
    return {
      init() {
        const board = document.getElementById("gameBoard");
        state="wait"; t0=0;
        board.classList.remove("hidden"); document.getElementById("gameCanvas").classList.add("hidden");
        board.innerHTML = `<div id="refx" style="height:220px;border-radius:16px;display:grid;place-items:center;background:#511;font-size:1.4rem;cursor:pointer">wait for green…</div>`;
        setTimeout(() => { state="go"; t0=performance.now(); document.getElementById("refx").style.background="#1a5a1a"; document.getElementById("refx").textContent="STRIKE"; }, 900+Math.random()*1800);
        board.onclick = () => {
          if (state==="wait") { document.getElementById("refx").textContent="too soon"; AudioBus.drum("crash"); }
          else if (state==="go") { const ms=(performance.now()-t0)|0; document.getElementById("refx").textContent=ms+" ms"; Shop.add(2); Badge.earn("reflex"); }
        };
      }
    };
  },
  gameAim() {
    let tars, hits, shots;
    return {
      init() { tars=[]; hits=0; shots=0; },
      click(p) {
        shots++;
        const i = tars.findIndex((t)=>Math.hypot(t.x-p.x,t.y-p.y)<t.r);
        if (i>=0) { tars.splice(i,1); hits++; Shop.add(1); Dopamine.combo("+HIT","#2ee6ff"); }
        Arcade.hud("aim "+hits+"/"+shots);
      },
      step() { if (tars.length<4 && Math.random()<0.04) tars.push({x:40+Math.random()*560,y:40+Math.random()*280,r:16+Math.random()*16,life:120}); tars=tars.filter((t)=>--t.life>0); },
      draw(c) {
        c.fillStyle="#0b1020"; c.fillRect(0,0,640,360);
        tars.forEach((t)=>{ c.strokeStyle="#ff4b1f"; c.beginPath(); c.arc(t.x,t.y,t.r,0,6.28); c.stroke(); c.beginPath(); c.arc(t.x,t.y,t.r/2,0,6.28); c.stroke(); });
      }
    };
  },
  gameTyping() {
    const words = ["timer","chaos","sahur","magma","forge","ember","graffiti","popup","kiosk","brainrot"];
    let falling, typed, hp;
    return {
      init() { falling=[]; typed=""; hp=3; },
      key(e) {
        if (e.key.length===1) typed += e.key.toLowerCase();
        if (e.key==="Backspace") typed = typed.slice(0,-1);
        const i = falling.findIndex((w)=>w.s===typed);
        if (i>=0) { falling.splice(i,1); typed=""; Shop.add(1); }
      },
      step() {
        if (Math.random()<0.02) falling.push({s:words[(Math.random()*words.length)|0],x:40+Math.random()*400,y:0});
        falling.forEach((w)=>w.y+=1.2);
        falling = falling.filter((w)=>{ if(w.y>340){ hp--; return false;} return true; });
        Arcade.hud("type "+typed+" · hp "+hp);
      },
      draw(c) {
        c.fillStyle="#140806"; c.fillRect(0,0,640,360);
        c.fillStyle="#ffd23a"; c.font="20px Trebuchet MS";
        falling.forEach((w)=>c.fillText(w.s,w.x,w.y));
      }
    };
  },
  gameAsteroids() {
    let ship, rocks, bullets;
    return {
      init() {
        ship={x:320,y:180,a:0,vx:0,vy:0};
        rocks=Array.from({length:5},()=>({x:Math.random()*640,y:Math.random()*360,vx:Math.random()-0.5,vy:Math.random()-0.5,r:20+Math.random()*20}));
        bullets=[];
      },
      key(e) { if (e.key===" ") bullets.push({x:ship.x,y:ship.y,a:ship.a,l:40}); },
      step() {
        if (Arcade.keys.ArrowLeft) ship.a -= 0.08;
        if (Arcade.keys.ArrowRight) ship.a += 0.08;
        if (Arcade.keys.ArrowUp) { ship.vx += Math.cos(ship.a)*0.2; ship.vy += Math.sin(ship.a)*0.2; }
        ship.x=(ship.x+ship.vx+640)%640; ship.y=(ship.y+ship.vy+360)%360;
        ship.vx*=0.99; ship.vy*=0.99;
        bullets.forEach((b)=>{ b.x+=Math.cos(b.a)*6; b.y+=Math.sin(b.a)*6; b.l--; });
        bullets=bullets.filter((b)=>b.l>0);
        rocks.forEach((r)=>{ r.x=(r.x+r.vx+640)%640; r.y=(r.y+r.vy+360)%360; });
        bullets.forEach((b)=>{
          rocks.forEach((r,i)=>{ if(Math.hypot(r.x-b.x,r.y-b.y)<r.r){ rocks.splice(i,1); Shop.add(2); b.l=0; } });
        });
        Arcade.hud("rocks "+rocks.length);
      },
      draw(c) {
        c.fillStyle="#0b1020"; c.fillRect(0,0,640,360);
        c.strokeStyle="#ffd23a"; c.save(); c.translate(ship.x,ship.y); c.rotate(ship.a);
        c.beginPath(); c.moveTo(12,0); c.lineTo(-8,8); c.lineTo(-8,-8); c.closePath(); c.stroke(); c.restore();
        c.fillStyle="#c9a36b"; rocks.forEach((r)=>{ c.beginPath(); c.arc(r.x,r.y,r.r,0,6.28); c.fill(); });
        c.fillStyle="#fff"; bullets.forEach((b)=>{ c.fillRect(b.x,b.y,3,3); });
      }
    };
  }
};

function board(html) {
  const el = document.getElementById("gameBoard");
  el.classList.remove("hidden"); document.getElementById("gameCanvas").classList.add("hidden");
  el.innerHTML = html;
  return el;
}

Games.gameMemory = function() {
  return { init() {
    const icons = ["spray","tung","dragon","flame","dice","coin","tomato","egg","tea","shop","virus","bell"];
    const deck = icons.concat(icons).sort(()=>Math.random()-0.5);
    let first = null, lock=false, pairs=0;
    const el = board(`<div class="board" style="grid-template-columns:repeat(4,52px)" id="mem"></div>`);
    const mem = el.querySelector("#mem");
    deck.forEach((k,i) => {
      const c = document.createElement("div"); c.className="cell"; c.dataset.k=k; c.innerHTML="?";
      c.onclick = () => {
        if (lock || c.dataset.on) return;
        c.innerHTML = iconHTML(k);
        if (!first) first = c;
        else if (first !== c) {
          if (first.dataset.k===k) { first.dataset.on=c.dataset.on="1"; pairs++; first=null; Shop.add(1); }
          else { lock=true; setTimeout(()=>{ first.innerHTML="?"; c.innerHTML="?"; first=null; lock=false; }, 600); }
        }
        Arcade.hud("pairs "+pairs);
      };
      mem.appendChild(c);
    });
  }};
};
Games.gameTicTac = function() {
  return { init() {
    let cells = Array(9).fill("");
    const el = board(`<div class="board" style="grid-template-columns:repeat(3,64px)" id="tt"></div>`);
    const box = el.querySelector("#tt");
    function win(p){ const L=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; return L.some(([a,b,c])=>cells[a]+cells[b]+cells[c]===p+p+p); }
    function ai(){ const i=cells.findIndex((x)=>!x); if(i>=0){ cells[i]="O"; draw(); if(win("O")) Arcade.hud("machine wins"); } }
    function draw(){ [...box.children].forEach((n,i)=>n.textContent=cells[i]); }
    for (let i=0;i<9;i++) {
      const d=document.createElement("div"); d.className="cell";
      d.onclick=()=>{ if(cells[i])return; cells[i]="X"; draw(); if(win("X")){ Arcade.hud("you win"); Shop.add(3);} else ai(); };
      box.appendChild(d);
    }
  }};
};
Games.gameRPS = function() {
  return { init() {
    const el = board(`<div class="row" style="justify-content:center" id="rps"></div><p class="hud" id="rpsOut">choose</p>`);
    ["rock","paper","scissors"].forEach((m) => {
      const b=document.createElement("button"); b.textContent=m;
      b.onclick=()=>{
        const ai=["rock","paper","scissors"][(Math.random()*3)|0];
        const map={rock:"scissors",paper:"rock",scissors:"paper"};
        const res = m===ai?"draw": map[m]===ai?"win":"lose";
        el.querySelector("#rpsOut").textContent = `you ${m} vs ${ai} · ${res}`;
        if (res==="win") Shop.add(2);
      };
      el.querySelector("#rps").appendChild(b);
    });
  }};
};
Games.gameGuess = function() {
  return { init() {
    const n = 1 + (Math.random()*100)|0; let tries=0;
    const el = board(`<p>Oracle picked 1-100</p><input id="gss" type="number"><button id="ggo">Guess</button><p class="hud" id="gout"></p>`);
    el.querySelector("#ggo").onclick=()=>{
      tries++; const g=Number(el.querySelector("#gss").value);
      el.querySelector("#gout").textContent = g===n?`yes in ${tries}`: g<n?"higher":"lower";
      if (g===n) Shop.add(3);
    };
  }};
};
Games.gameScramble = function() {
  return { init() {
    const words=["MAGMA","SAHUR","EMBER","GRAFFITI","KIOSK","VIRUS","CHAOS","TIMER"];
    const w=words[(Math.random()*words.length)|0];
    const sh=w.split("").sort(()=>Math.random()-0.5).join("");
    const el=board(`<p>Unscramble <b>${sh}</b></p><input id="sc"><button id="scgo">Solve</button><p class="hud" id="sco"></p>`);
    el.querySelector("#scgo").onclick=()=>{
      const ok=el.querySelector("#sc").value.toUpperCase()===w;
      el.querySelector("#sco").textContent=ok?"cleared":"nope";
      if(ok) Shop.add(2);
    };
  }};
};
Games.gameCookie = function() {
  return { init() {
    let n=0, rate=0;
    const el=board(`<button id="ck" style="width:160px;height:160px;border-radius:50%">${iconHTML("cookie","xl")}</button><p class="hud" id="ckn">0 cookies</p><button id="up">+1/sec (8 cookies)</button>`);
    setInterval(()=>{ n+=rate; el.querySelector("#ckn").textContent=n.toFixed(0)+" cookies"; },1000);
    el.querySelector("#ck").onclick=()=>{ n++; Shop.add(n%10===0?1:0); el.querySelector("#ckn").textContent=n.toFixed(0)+" cookies"; Dopamine.combo("+1","#c9a36b"); };
    el.querySelector("#up").onclick=()=>{ if(n>=8){ n-=8; rate++; } };
  }};
};
Games.gameSlots = function() {
  return { init() {
    const sym=["flame","coin","tomato","egg","dragon","tung"];
    const el=board(`<div class="row" id="reels" style="justify-content:center;font-size:2rem"></div><button id="spin">Spin (2 ticks)</button><p class="hud" id="slout"></p>`);
    const spin=()=>{
      if (!Shop.spend(2,true)) return toast("need 2 ticks");
      const r=[0,0,0].map(()=>sym[(Math.random()*sym.length)|0]);
      el.querySelector("#reels").innerHTML=r.map((s)=>iconHTML(s,"lg")).join("");
      const win=r[0]===r[1]&&r[1]===r[2];
      el.querySelector("#slout").textContent=win?"JACKPOT":"spin again";
      if (win) { Shop.add(12); Visuals.confetti(); }
    };
    el.querySelector("#spin").onclick=spin;
  }};
};
Games.gameDice = function() {
  return { init() {
    const el=board(`<div class="row" id="diceRow"></div><p class="hud" id="dv"></p>`);
    [4,6,8,10,12,20].forEach((s)=>{
      const b=document.createElement("button"); b.className="ghost"; b.textContent="d"+s;
      b.onclick=()=>{ const n=1+(Math.random()*s)|0; el.querySelector("#dv").textContent="d"+s+" = "+n; AudioBus.drum("tom"); };
      el.querySelector("#diceRow").appendChild(b);
    });
  }};
};
Games.gameCoin = function() {
  return { init() {
    const el=board(`<button id="flipc">${iconHTML("coin","xl")}</button><p class="hud" id="cout">flip</p>`);
    el.querySelector("#flipc").onclick=()=>{
      el.querySelector("#cout").textContent="spinning…";
      setTimeout(()=>{ el.querySelector("#cout").textContent=Math.random()<0.5?"HEADS":"TAILS"; AudioBus.tone(880,0.1,"triangle","sfx",0.2); }, 600);
    };
  }};
};
Games.game2048 = function() {
  return { init() {
    let g=Array.from({length:4},()=>Array(4).fill(0));
    function spawn(){ const e=[]; g.forEach((r,i)=>r.forEach((v,j)=>{ if(!v)e.push([i,j]); })); if(!e.length)return; const [i,j]=e[(Math.random()*e.length)|0]; g[i][j]=Math.random()<0.9?2:4; }
    function slide(row){ const a=row.filter(Boolean); for(let i=0;i<a.length-1;i++) if(a[i]===a[i+1]){ a[i]*=2; a[i+1]=0; Shop.add(1);} return a.filter(Boolean).concat([0,0,0,0]).slice(0,4); }
    function rot(){ g=g[0].map((_,c)=>g.map((r)=>r[c]).reverse()); }
    function move(dir){ for(let i=0;i<dir;i++) rot(); g=g.map(slide); for(let i=0;i<(4-dir)%4;i++) rot(); spawn(); draw(); }
    spawn(); spawn();
    const el=board(`<div class="board" style="grid-template-columns:repeat(4,64px)" id="g48"></div><p class="hud">arrows to slide</p>`);
    function draw(){ const box=el.querySelector("#g48"); box.innerHTML=""; g.flat().forEach((v)=>{ const d=document.createElement("div"); d.className="cell"; d.textContent=v||""; d.style.background=v?`hsl(${30+Math.log2(v)*20},80%,45%)`:"#141428"; box.appendChild(d); }); }
    draw();
    Games._2048key = (e)=>{ const m={ArrowLeft:0,ArrowUp:3,ArrowRight:2,ArrowDown:1}; if(m[e.key]!==undefined) move(m[e.key]); };
    addEventListener("keydown", Games._2048key);
  }};
};
Games.gameMines = function() {
  return { init() {
    const N=8, M=10;
    const mines=new Set(); while(mines.size<M) mines.add((Math.random()*N*N)|0);
    const el=board(`<div class="board" style="grid-template-columns:repeat(8,36px)" id="mn"></div>`);
    const vis=Array(N*N).fill(false);
    function count(i){ let n=0; const x=i%N,y=(i/N)|0; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ const nx=x+dx,ny=y+dy; if(nx>=0&&ny>=0&&nx<N&&ny<N&&mines.has(ny*N+nx)) n++; } return n; }
    function reveal(i){
      if (vis[i]) return; vis[i]=true;
      const cell=el.querySelectorAll(".cell")[i];
      if (mines.has(i)) { cell.textContent="X"; cell.style.background="#511"; toast("boom"); return; }
      const n=count(i); cell.textContent=n||""; cell.style.background="#3a2218";
      if (!n) { const x=i%N,y=(i/N)|0; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ const nx=x+dx,ny=y+dy; if(nx>=0&&ny>=0&&nx<N&&ny<N) reveal(ny*N+nx); } }
    }
    for(let i=0;i<N*N;i++){ const d=document.createElement("div"); d.className="cell"; d.style.width=d.style.height="36px"; d.onclick=()=>reveal(i); el.querySelector("#mn").appendChild(d); }
  }};
};
Games.gameHangman = function() {
  return { init() {
    const w=["GRAFFITI","SAHUR","EMBER","POPUP","KIOSK"][(Math.random()*5)|0];
    let got=new Set(), miss=0;
    const el=board(`<p id="hw"></p><div class="row" id="hb"></div><p class="hud" id="hm"></p>`);
    function draw(){
      el.querySelector("#hw").textContent=w.split("").map((c)=>got.has(c)?c:"_").join(" ");
      el.querySelector("#hm").textContent="miss "+miss+"/6";
      if (w.split("").every((c)=>got.has(c))) { el.querySelector("#hm").textContent="saved"; Shop.add(4); }
      if (miss>=6) el.querySelector("#hw").textContent=w;
    }
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((l)=>{
      const b=document.createElement("button"); b.className="ghost"; b.textContent=l; b.style.padding="4px 8px";
      b.onclick=()=>{ if(w.includes(l)) got.add(l); else miss++; draw(); };
      el.querySelector("#hb").appendChild(b);
    });
    draw();
  }};
};
Games.gameTrivia = function() {
  return { init() {
    const q=[
      {q:"How many wonders in this museum?", a:["50","100","12"], i:1},
      {q:"What does Ember eat?", a:["ticks","taxes","wifi"], i:0},
      {q:"Tung Tung Tung Sahur wields a…", a:["bat","spoon","laser"], i:0},
      {q:"The shop is…", a:["the homepage","a side kiosk","a bank"], i:1}
    ];
    let i=0, ok=0;
    const el=board(`<p id="tq"></p><div id="ta"></div>`);
    function show(){
      if (i>=q.length) { el.querySelector("#tq").textContent="score "+ok; return; }
      el.querySelector("#tq").textContent=q[i].q;
      const box=el.querySelector("#ta"); box.innerHTML="";
      q[i].a.forEach((t,idx)=>{
        const b=document.createElement("button"); b.textContent=t;
        b.onclick=()=>{ if(idx===q[i].i){ ok++; Shop.add(1);} i++; show(); };
        box.appendChild(b);
      });
    }
    show();
  }};
};
Games.gameSimon = function() {
  return { init() {
    const colors=["#ff4b1f","#ffd23a","#2ee6ff","#b6ff4a"];
    let seq=[], input=[], lock=false;
    const el=board(`<div class="board" style="grid-template-columns:repeat(2,80px)" id="sm"></div>`);
    const btns=[];
    function flash(i){ btns[i].style.filter="brightness(2)"; setTimeout(()=>btns[i].style.filter="", 280); AudioBus.tone(330+i*80,0.15,"square","sfx",0.12); }
    function play(){ lock=true; seq.forEach((n,k)=>setTimeout(()=>flash(n), 400*(k+1))); setTimeout(()=>{ lock=false; input=[]; }, 400*(seq.length+1)); }
    function next(){ seq.push((Math.random()*4)|0); Arcade.hud("simon "+seq.length); play(); }
    for (let i=0;i<4;i++){
      const d=document.createElement("div"); d.className="cell"; d.style.width=d.style.height="80px"; d.style.background=colors[i];
      d.onclick=()=>{
        if(lock)return; flash(i); input.push(i);
        if (input[input.length-1]!==seq[input.length-1]) { Arcade.hud("broken prism"); seq=[]; return; }
        if (input.length===seq.length) { Shop.add(1); setTimeout(next, 500); }
      };
      btns.push(d); el.querySelector("#sm").appendChild(d);
    }
    next();
  }};
};
Games.gameConnect4 = function() {
  return { init() {
    const W=7,H=6; let g=Array.from({length:H},()=>Array(W).fill(0)), turn=1;
    const el=board(`<div class="board" style="grid-template-columns:repeat(7,40px)" id="c4"></div>`);
    function draw(){
      const box=el.querySelector("#c4"); box.innerHTML="";
      for (let r=0;r<H;r++) for (let c=0;c<W;c++) {
        const d=document.createElement("div"); d.className="cell"; d.style.width=d.style.height="40px";
        d.style.borderRadius="50%"; d.style.background=g[r][c]===1?"#ff4b1f":g[r][c]===2?"#ffd23a":"#141428";
        d.onclick=()=>{
          for (let y=H-1;y>=0;y--) if(!g[y][c]){ g[y][c]=turn; turn=turn===1?2:1; draw(); break; }
        };
        box.appendChild(d);
      }
    }
    draw();
  }};
};

window.Arcade = Arcade;
window.Games = Games;

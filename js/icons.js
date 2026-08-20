/* Custom vector sticker set. Thick soot outlines, magma fills, no emoji. */
(function () {
  const SOOT = "#1c0b08";
  function svg(inner, box) {
    box = box || "0 0 32 32";
    return `<svg viewBox="${box}" xmlns="http://www.w3.org/2000/svg" class="ico" aria-hidden="true">${inner}</svg>`;
  }
  function sticker(fill, glyph) {
    return svg(
      `<rect x="3.2" y="4.2" width="25.5" height="25.5" rx="8" fill="${SOOT}"/>` +
      `<rect x="1.4" y="1.4" width="25.5" height="25.5" rx="8" fill="${fill}" stroke="${SOOT}" stroke-width="1.7"/>` +
      glyph
    );
  }
  const ink = `fill="none" stroke="${SOOT}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;
  const inkF = `stroke="${SOOT}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`;

  const I = {
    pause: sticker("#FFD23A", `<rect x="9" y="8" width="4" height="14" rx="1" fill="${SOOT}"/><rect x="17" y="8" width="4" height="14" rx="1" fill="${SOOT}"/>`),
    play: sticker("#B6FF4A", `<path d="M12 8 L23 16 L12 24 Z" fill="${SOOT}"/>`),
    forge: sticker("#FF8A3D", `<path d="M8 22 L18 10 L22 14 L12 26 Z" fill="#FFD23A" ${inkF}/><circle cx="21" cy="9" r="2.2" fill="${SOOT}"/>`),
    tomato: sticker("#FF4B1F", `<ellipse cx="16" cy="17" rx="8" ry="7" fill="#FF4B1F" ${inkF}/><path d="M16 10 C16 7 19 7 20 9" ${ink}/><path d="M12 11 Q16 8 20 11" fill="#3DB54A" ${inkF}/>`),
    tea: sticker("#7CFF9A", `<path d="M9 12 H21 V20 C21 24 9 24 9 20 Z" fill="#F4FFF0" ${inkF}/><path d="M21 14 C25 14 25 20 21 20" ${ink}/><path d="M13 8 C13 11 16 11 16 8" ${ink}/>`),
    egg: sticker("#FFF4CC", `<ellipse cx="16" cy="17" rx="7" ry="9" fill="#FFF8E0" ${inkF}/><ellipse cx="14" cy="16" rx="2" ry="2.4" fill="#FFD23A"/>`),
    stopwatch: sticker("#2EE6FF", `<circle cx="16" cy="17" r="8" fill="#E8FFFF" ${inkF}/><path d="M16 17 L16 12 M16 17 L20 19" ${ink}/><rect x="13" y="6" width="6" height="3" rx="1" fill="${SOOT}"/>`),
    flame: sticker("#FF4B1F", `<path d="M16 26 C10 26 9 18 14 14 C13 20 17 18 16 10 C22 14 24 24 16 26 Z" fill="#FFD23A" ${inkF}/>`),
    swords: sticker("#C9D4E8", `<path d="M8 24 L18 10 M10 8 L24 22" ${ink}/><path d="M7 21 L11 25 M21 7 L25 11" stroke="#FF4B1F" stroke-width="2"/>`),
    globe: sticker("#2EE6FF", `<circle cx="16" cy="16" r="9" fill="#1A6B8A" ${inkF}/><ellipse cx="16" cy="16" rx="4" ry="9" ${ink}/><path d="M7 16 H25 M9 11 H23 M9 21 H23" ${ink}/>`),
    alarm: sticker("#FF4B1F", `<circle cx="16" cy="17" r="8" fill="#FFD23A" ${inkF}/><path d="M16 17 V12 M16 17 L20 19" ${ink}/><path d="M8 9 L12 12 M24 9 L20 12" ${ink}/>`),
    calendar: sticker("#FFD23A", `<rect x="8" y="9" width="16" height="15" rx="2" fill="#FFF8E0" ${inkF}/><path d="M8 13 H24 M12 7 V11 M20 7 V11" ${ink}/><rect x="11" y="16" width="3" height="3" fill="#FF4B1F"/>`),
    scope: sticker("#B6FF4A", `<circle cx="14" cy="14" r="7" ${ink}/><circle cx="14" cy="14" r="3" fill="#2EE6FF"/><path d="M19 19 L25 25" ${ink}/>`),
    flag: sticker("#FF3EC8", `<path d="M10 7 V25" ${ink}/><path d="M10 8 H24 L20 12 L24 16 H10 Z" fill="#FF4B1F" ${inkF}/>`),
    keys: sticker("#C9D4E8", `<rect x="7" y="10" width="18" height="12" rx="2" fill="#F4F1FF" ${inkF}/><path d="M11 14 H13 M16 14 H21 M11 18 H21" ${ink}/>`),
    vault: sticker("#8B7DFF", `<rect x="8" y="10" width="16" height="14" rx="2" fill="#D9D2FF" ${inkF}/><circle cx="16" cy="17" r="3" ${ink}/><rect x="14" y="7" width="4" height="4" fill="${SOOT}"/>`),
    flip: sticker("#FFD23A", `<rect x="8" y="8" width="7" height="16" rx="1" fill="#FFF8E0" ${inkF}/><rect x="17" y="8" width="7" height="16" rx="1" fill="#FFF8E0" ${inkF}/><path d="M8 16 H24" ${ink}/>`),
    analog: sticker("#2EE6FF", `<circle cx="16" cy="16" r="10" fill="#E8FFFF" ${inkF}/><path d="M16 16 L16 8 M16 16 L22 16" ${ink}/><circle cx="16" cy="16" r="1.6" fill="${SOOT}"/>`),
    binary: sticker("#B6FF4A", `<circle cx="10" cy="12" r="2.2" fill="${SOOT}"/><circle cx="16" cy="12" r="2.2" fill="#FF4B1F"/><circle cx="22" cy="12" r="2.2" fill="${SOOT}"/><circle cx="10" cy="20" r="2.2" fill="#FF4B1F"/><circle cx="16" cy="20" r="2.2" fill="${SOOT}"/><circle cx="22" cy="20" r="2.2" fill="#FF4B1F"/>`),
    morse: sticker("#FFD23A", `<circle cx="16" cy="11" r="4" fill="#FFF8E0" ${inkF}/><path d="M16 15 V22 M12 22 H20" ${ink}/><path d="M8 26 H12 M14 26 H18 M20 26 H24" stroke="${SOOT}" stroke-width="2"/>`),
    roman: sticker("#E8D5A3", `<path d="M10 8 L16 24 L22 8" ${ink}/><path d="M8 8 H12 M20 8 H24" ${ink}/>`),
    sticker: sticker("#FF3EC8", `<text x="16" y="21" text-anchor="middle" font-size="14" font-weight="800" font-family="Trebuchet MS,sans-serif" fill="${SOOT}">5</text>`),
    halo: sticker("#2EE6FF", `<circle cx="16" cy="16" r="9" fill="none" stroke="${SOOT}" stroke-width="3"/><circle cx="16" cy="16" r="9" fill="none" stroke="#FF4B1F" stroke-width="3" stroke-dasharray="20 40"/>`),
    hourglass: sticker("#FFD23A", `<path d="M10 8 H22 L16 16 L22 24 H10 L16 16 Z" fill="#FF8A3D" ${inkF}/>`),
    pixel: sticker("#B6FF4A", `<rect x="8" y="8" width="5" height="16" fill="${SOOT}"/><rect x="15" y="8" width="4" height="7" fill="${SOOT}"/><rect x="21" y="12" width="4" height="12" fill="${SOOT}"/>`),
    cube: sticker("#8B7DFF", `<path d="M16 7 L25 12 V22 L16 27 L7 22 V12 Z" fill="#D9D2FF" ${inkF}/><path d="M16 7 V17 L7 22 M16 17 L25 12" ${ink}/>`),
    scroll: sticker("#FFF4CC", `<path d="M9 8 H21 C23 8 23 12 21 12 H11 V22 C9 22 8 20 8 18 V10 C8 8 9 8 9 8 Z" fill="#FFF8E0" ${inkF}/><path d="M12 15 H20 M12 18 H18" ${ink}/>`),
    hex: sticker("#2EE6FF", `<path d="M16 6 L25 11 V21 L16 26 L7 21 V11 Z" fill="#1A6B8A" ${inkF}/><text x="16" y="20" text-anchor="middle" font-size="9" font-weight="800" fill="#E8FFFF" font-family="monospace">0F</text>`),
    flask: sticker("#B6FF4A", `<path d="M13 7 H19 V12 L24 24 H8 L13 12 Z" fill="#7CFF9A" ${inkF}/><path d="M11 20 H21" stroke="#FF4B1F" stroke-width="3"/>`),
    mirror: sticker("#C9D4E8", `<ellipse cx="16" cy="16" rx="8" ry="11" fill="#F4F8FF" ${inkF}/><path d="M13 12 L18 20" stroke="#2EE6FF" stroke-width="2"/>`),
    titan: sticker("#FF8A3D", `<rect x="6" y="6" width="20" height="20" rx="2" fill="#FFD23A" ${inkF}/><text x="16" y="21" text-anchor="middle" font-size="10" font-weight="800" fill="${SOOT}" font-family="Trebuchet MS,sans-serif">FS</text>`),
    confetti: sticker("#FF3EC8", `<rect x="8" y="8" width="4" height="4" transform="rotate(20 10 10)" fill="#FFD23A"/><rect x="18" y="9" width="3" height="6" transform="rotate(-15 20 12)" fill="#2EE6FF"/><circle cx="14" cy="20" r="2.2" fill="#B6FF4A"/><rect x="21" y="18" width="5" height="3" fill="#FF4B1F"/>`),
    nova: sticker("#FF4B1F", `<path d="M16 6 L18 14 L26 16 L18 18 L16 26 L14 18 L6 16 L14 14 Z" fill="#FFD23A" ${inkF}/>`),
    quake: sticker("#C9A36B", `<path d="M6 18 L11 12 L16 20 L21 10 L26 18" ${ink}/><path d="M6 22 H26" stroke="#FF4B1F" stroke-width="2"/>`),
    disco: sticker("#FF3EC8", `<circle cx="16" cy="16" r="9" fill="#2EE6FF" ${inkF}/><path d="M16 7 L16 25 M7 16 H25 M10 10 L22 22 M22 10 L10 22" stroke="#FFD23A" stroke-width="1.4"/>`),
    matrix: sticker("#1A3D1A", `<text x="8" y="14" font-size="7" fill="#B6FF4A" font-family="monospace">01</text><text x="16" y="22" font-size="7" fill="#7CFF9A" font-family="monospace">10</text><text x="10" y="26" font-size="6" fill="#3DB54A" font-family="monospace">11</text>`),
    lava: sticker("#FF4B1F", `<ellipse cx="12" cy="20" rx="6" ry="5" fill="#FF8A3D" ${inkF}/><ellipse cx="20" cy="14" rx="5" ry="6" fill="#FFD23A" ${inkF}/>`),
    wave: sticker("#2EE6FF", `<path d="M6 18 C10 10 14 26 18 18 C22 10 26 22 26 18" ${ink}/><path d="M6 24 C12 18 16 28 26 22" stroke="#1A6B8A" stroke-width="2"/>`),
    star: sticker("#0B1020", `<path d="M16 7 L18 14 L25 14 L19 18 L21 25 L16 21 L11 25 L13 18 L7 14 L14 14 Z" fill="#FFD23A" ${inkF}/>`),
    glitch: sticker("#FF3EC8", `<rect x="7" y="10" width="18" height="12" fill="#2EE6FF"/><rect x="9" y="12" width="18" height="12" fill="#FF4B1F" opacity=".7"/><rect x="8" y="14" width="16" height="4" fill="${SOOT}"/>`),
    crt: sticker("#1A3D1A", `<rect x="7" y="8" width="18" height="14" rx="2" fill="#0B1020" ${inkF}/><path d="M9 12 H23 M9 16 H21" stroke="#B6FF4A" stroke-width="1.3"/><rect x="12" y="23" width="8" height="2" fill="${SOOT}"/>`),
    firefly: sticker("#1A3D1A", `<circle cx="11" cy="14" r="2" fill="#B6FF4A"/><circle cx="20" cy="11" r="1.5" fill="#FFD23A"/><circle cx="17" cy="20" r="2.4" fill="#B6FF4A"/><circle cx="8" cy="21" r="1.2" fill="#FFD23A"/>`),
    spray: sticker("#FF4B1F", `<rect x="12" y="10" width="8" height="14" rx="2" fill="#2EE6FF" ${inkF}/><rect x="14" y="6" width="4" height="5" fill="${SOOT}"/><circle cx="22" cy="10" r="3" fill="#FFD23A" opacity=".8"/>`),
    flipg: sticker("#8B7DFF", `<path d="M10 8 H22 V14 L16 18 L10 14 Z" fill="#D9D2FF" ${inkF}/><path d="M16 18 V24 M12 24 H20" ${ink}/>`),
    dvd: sticker("#0B1020", `<rect x="6" y="12" width="20" height="10" rx="2" fill="#2EE6FF" ${inkF}/><text x="16" y="19" text-anchor="middle" font-size="6" font-weight="800" fill="${SOOT}" font-family="Trebuchet MS,sans-serif">DVD</text>`),
    virus: sticker("#C9D4E8", `<rect x="7" y="9" width="18" height="14" rx="1" fill="#F4F1FF" ${inkF}/><rect x="7" y="9" width="18" height="4" fill="#3A6EA5"/><path d="M12 18 L16 14 L20 20" stroke="#FF4B1F" stroke-width="2"/>`),
    snake: sticker("#3DB54A", `<path d="M8 20 C8 12 14 12 16 16 C18 20 24 18 24 12" ${ink}/><circle cx="24" cy="11" r="2.2" fill="#B6FF4A" ${inkF}/>`),
    brick: sticker("#FF8A3D", `<rect x="8" y="8" width="7" height="5" fill="#FF4B1F" ${inkF}/><rect x="16" y="8" width="8" height="5" fill="#FFD23A" ${inkF}/><rect x="8" y="14" width="16" height="5" fill="#FF4B1F" ${inkF}/><rect x="8" y="20" width="10" height="5" fill="#FF8A3D" ${inkF}/>`),
    flap: sticker("#2EE6FF", `<rect x="12" y="12" width="8" height="8" fill="#FFD23A" ${inkF}/><path d="M8 14 L12 16 L8 18" fill="#FF4B1F"/><path d="M24 14 L20 16 L24 18" fill="#FF4B1F"/>`),
    memory: sticker("#8B7DFF", `<rect x="7" y="8" width="8" height="8" rx="1" fill="#D9D2FF" ${inkF}/><rect x="17" y="8" width="8" height="8" rx="1" fill="#FFD23A" ${inkF}/><rect x="7" y="18" width="8" height="8" rx="1" fill="#FFD23A" ${inkF}/><rect x="17" y="18" width="8" height="8" rx="1" fill="#D9D2FF" ${inkF}/>`),
    mole: sticker("#C9A36B", `<ellipse cx="16" cy="20" rx="10" ry="5" fill="#5A3A22" ${inkF}/><circle cx="16" cy="14" r="6" fill="#8B5A2B" ${inkF}/><circle cx="14" cy="13" r="1" fill="${SOOT}"/><circle cx="18" cy="13" r="1" fill="${SOOT}"/>`),
    pong: sticker("#0B1020", `<rect x="7" y="10" width="3" height="12" fill="#2EE6FF"/><rect x="22" y="8" width="3" height="12" fill="#FF3EC8"/><circle cx="16" cy="16" r="2" fill="#FFD23A"/>`),
    breakout: sticker("#FF4B1F", `<rect x="8" y="8" width="16" height="4" fill="#2EE6FF"/><rect x="8" y="13" width="16" height="4" fill="#FF3EC8"/><circle cx="14" cy="22" r="2" fill="#FFD23A"/><rect x="11" y="25" width="10" height="2" fill="#FFF"/>`),
    tictac: sticker("#F4F1FF", `<path d="M12 8 V24 M20 8 V24 M8 12 H24 M8 20 H24" ${ink}/><path d="M9 9 L15 15 M15 9 L9 15" stroke="#FF4B1F" stroke-width="1.6"/>`),
    rps: sticker("#FFD23A", `<path d="M10 18 L14 10 L18 18 Z" fill="#C9D4E8" ${inkF}/><rect x="18" y="14" width="6" height="8" fill="#FF4B1F" ${inkF}/>`),
    guess: sticker("#8B7DFF", `<text x="16" y="22" text-anchor="middle" font-size="16" font-weight="800" fill="${SOOT}" font-family="Trebuchet MS,sans-serif">?</text>`),
    scramble: sticker("#FF3EC8", `<text x="7" y="20" font-size="8" font-weight="800" fill="${SOOT}" font-family="Trebuchet MS,sans-serif" transform="rotate(-12 16 16)">TMEI</text>`),
    meteor: sticker("#0B1020", `<path d="M8 8 L14 14" stroke="#FF8A3D" stroke-width="2"/><circle cx="20" cy="20" r="6" fill="#C9A36B" ${inkF}/>`),
    bolt: sticker("#FFD23A", `<path d="M18 6 L10 16 H16 L14 26 L24 14 H18 Z" fill="#FF4B1F" ${inkF}/>`),
    aim: sticker("#FF4B1F", `<circle cx="16" cy="16" r="9" ${ink}/><circle cx="16" cy="16" r="4" ${ink}/><path d="M16 5 V9 M16 23 V27 M5 16 H9 M23 16 H27" ${ink}/>`),
    cookie: sticker("#C9A36B", `<circle cx="16" cy="16" r="9" fill="#E8B86D" ${inkF}/><circle cx="12" cy="13" r="1.4" fill="${SOOT}"/><circle cx="19" cy="12" r="1.2" fill="${SOOT}"/><circle cx="15" cy="20" r="1.5" fill="${SOOT}"/><circle cx="20" cy="18" r="1" fill="${SOOT}"/>`),
    slots: sticker("#FF4B1F", `<rect x="7" y="8" width="18" height="16" rx="2" fill="#FFD23A" ${inkF}/><rect x="10" y="11" width="4" height="10" fill="#FFF8E0"/><rect x="14" y="11" width="4" height="10" fill="#FFF8E0"/><rect x="18" y="11" width="4" height="10" fill="#FFF8E0"/>`),
    dice: sticker("#F4F1FF", `<rect x="8" y="8" width="16" height="16" rx="3" fill="#FFF" ${inkF}/><circle cx="12" cy="12" r="1.4" fill="${SOOT}"/><circle cx="20" cy="12" r="1.4" fill="${SOOT}"/><circle cx="16" cy="16" r="1.4" fill="${SOOT}"/><circle cx="12" cy="20" r="1.4" fill="${SOOT}"/><circle cx="20" cy="20" r="1.4" fill="${SOOT}"/>`),
    coin: sticker("#FFD23A", `<circle cx="16" cy="16" r="9" fill="#FFE566" ${inkF}/><ellipse cx="16" cy="16" rx="5" ry="7" ${ink}/>`),
    merge: sticker("#B6FF4A", `<rect x="7" y="10" width="8" height="8" rx="1" fill="#FFD23A" ${inkF}/><rect x="17" y="10" width="8" height="8" rx="1" fill="#FFD23A" ${inkF}/><path d="M15 14 H17 M16 18 V24" ${ink}/>`),
    mine: sticker("#C9D4E8", `<circle cx="16" cy="17" r="7" fill="#5A6570" ${inkF}/><rect x="15" y="7" width="2" height="5" fill="${SOOT}"/><circle cx="16" cy="16" r="2" fill="#FF4B1F"/>`),
    hang: sticker("#E8D5A3", `<path d="M8 26 H24 M10 26 V8 H20 V12" ${ink}/><circle cx="20" cy="15" r="2.2" ${ink}/>`),
    trivia: sticker("#8B7DFF", `<circle cx="16" cy="14" r="7" fill="#D9D2FF" ${inkF}/><path d="M13 14 C13 11 19 11 19 14 C19 17 16 16 16 19" ${ink}/><circle cx="16" cy="23" r="1.2" fill="${SOOT}"/>`),
    simon: sticker("#0B1020", `<path d="M16 7 L25 16 L16 25 L7 16 Z" fill="#FF4B1F" ${inkF}/><path d="M16 11 L21 16 L16 21 L11 16 Z" fill="#2EE6FF"/>`),
    connect: sticker("#3A6EA5", `<circle cx="10" cy="10" r="3" fill="#FF4B1F"/><circle cx="16" cy="10" r="3" fill="#FFD23A"/><circle cx="22" cy="10" r="3" fill="#FF4B1F"/><circle cx="10" cy="18" r="3" fill="#FFD23A"/><circle cx="16" cy="18" r="3" fill="#FF4B1F"/><circle cx="22" cy="18" r="3" fill="#FFD23A"/>`),
    aster: sticker("#0B1020", `<path d="M16 8 L22 14 L18 24 L10 20 L8 12 Z" fill="#C9A36B" ${inkF}/><path d="M20 9 L26 6" stroke="#FFD23A"/>`),
    synth: sticker("#FF3EC8", `<rect x="7" y="10" width="18" height="14" rx="2" fill="#1C0B08" ${inkF}/><rect x="9" y="13" width="3" height="8" fill="#2EE6FF"/><rect x="14" y="16" width="3" height="5" fill="#FFD23A"/><rect x="19" y="12" width="3" height="9" fill="#FF4B1F"/>`),
    melody: sticker("#8B7DFF", `<path d="M14 8 V22" ${ink}/><circle cx="11" cy="22" r="3" fill="#FF3EC8" ${inkF}/><path d="M14 8 H22 V12 H14" fill="#FFD23A" ${inkF}/>`),
    piano: sticker("#F4F1FF", `<rect x="6" y="10" width="20" height="14" fill="#FFF" ${inkF}/><rect x="10" y="10" width="4" height="8" fill="${SOOT}"/><rect x="18" y="10" width="4" height="8" fill="${SOOT}"/>`),
    drum: sticker("#FF8A3D", `<ellipse cx="16" cy="12" rx="10" ry="5" fill="#FFD23A" ${inkF}/><path d="M6 12 V20 C6 24 26 24 26 20 V12" fill="#FF4B1F" ${inkF}/>`),
    metro: sticker("#FF4B1F", `<rect x="12" y="6" width="8" height="20" rx="2" fill="#FFF8E0" ${inkF}/><path d="M16 24 L16 12 L20 10" ${ink}/>`),
    rain: sticker("#1A6B8A", `<path d="M10 14 C10 8 22 8 22 14 C26 14 26 24 16 24 C6 24 6 14 10 14 Z" fill="#2EE6FF" ${inkF}/><path d="M12 26 L10 30 M16 26 L16 31 M20 26 L22 30" stroke="#2EE6FF"/>`),
    lofi: sticker("#3A2218", `<ellipse cx="16" cy="18" rx="10" ry="6" fill="#8B5A2B" ${inkF}/><circle cx="16" cy="12" r="5" fill="#C9A36B" ${inkF}/>`),
    fanfare: sticker("#FFD23A", `<path d="M8 14 H16 L24 8 V24 L16 18 H8 Z" fill="#FF8A3D" ${inkF}/><circle cx="8" cy="16" r="3" fill="#FF4B1F"/>`),
    mic: sticker("#C9D4E8", `<rect x="13" y="6" width="6" height="12" rx="3" fill="#F4F1FF" ${inkF}/><path d="M10 14 C10 20 22 20 22 14 M16 20 V25 M12 25 H20" ${ink}/>`),
    moon: sticker("#0B1020", `<path d="M18 8 C12 8 8 14 10 20 C16 22 24 16 18 8 Z" fill="#FFD23A" ${inkF}/>`),
    flex: sticker("#FF4B1F", `<path d="M8 18 C8 12 14 10 16 16 C18 10 24 12 24 18 C24 24 8 24 8 18 Z" fill="#FF8A3D" ${inkF}/>`),
    grid: sticker("#0B1020", `<g fill="#2EE6FF">${[0,1,2,3].map((x)=>[0,1,2].map((y)=>`<rect x="${8+x*4.2}" y="${8+y*5}" width="3.4" height="3.4" rx=".5"/>`).join("")).join("")}</g>`),
    theremin: sticker("#B6FF4A", `<rect x="8" y="18" width="16" height="6" rx="1" fill="#3A2218" ${inkF}/><path d="M12 18 V10 M20 18 V8" ${ink}/>`),
    uke: sticker("#E8B86D", `<circle cx="16" cy="18" r="7" fill="#C9A36B" ${inkF}/><circle cx="16" cy="10" r="4" fill="#E8B86D" ${inkF}/><path d="M16 6 V4" ${ink}/>`),
    viz: sticker("#0B1020", `<rect x="8" y="16" width="3" height="8" fill="#2EE6FF"/><rect x="13" y="10" width="3" height="14" fill="#FFD23A"/><rect x="18" y="13" width="3" height="11" fill="#FF4B1F"/><rect x="23" y="18" width="3" height="6" fill="#FF3EC8"/>`),
    loop: sticker("#2EE6FF", `<path d="M22 16 A6 6 0 1 1 16 10" ${ink}/><path d="M16 10 L20 8 L19 13" fill="${SOOT}"/>`),
    bell: sticker("#FFD23A", `<path d="M10 14 C10 8 22 8 22 14 V20 H10 Z" fill="#FFE566" ${inkF}/><rect x="14" y="20" width="4" height="3" fill="${SOOT}"/><circle cx="16" cy="8" r="1.5" fill="${SOOT}"/>`),
    mixer: sticker("#C9D4E8", `<rect x="9" y="8" width="4" height="16" rx="1" fill="#F4F1FF" ${inkF}/><rect x="20" y="8" width="4" height="16" rx="1" fill="#F4F1FF" ${inkF}/><circle cx="11" cy="14" r="2" fill="#FF4B1F"/><circle cx="22" cy="20" r="2" fill="#2EE6FF"/>`),
    eight: sticker("#0B1020", `<circle cx="16" cy="16" r="10" fill="#1C1C28" ${inkF}/><circle cx="16" cy="16" r="5" fill="#3A3A80"/><text x="16" y="19" text-anchor="middle" font-size="8" fill="#FFF" font-family="Trebuchet MS,sans-serif">8</text>`),
    dragon: sticker("#FF4B1F", `<path d="M8 20 C8 12 14 8 18 12 C24 8 26 16 22 20 C28 22 18 26 12 24 C8 26 6 22 8 20 Z" fill="#FF8A3D" ${inkF}/><circle cx="20" cy="14" r="1.2" fill="${SOOT}"/>`),
    badge: sticker("#FFD23A", `<path d="M16 6 L19 13 H26 L20 17 L22 25 L16 20 L10 25 L12 17 L6 13 H13 Z" fill="#FF8A3D" ${inkF}/>`),
    streak: sticker("#FF4B1F", `<path d="M16 26 C9 26 8 16 14 12 C14 18 18 16 16 8 C24 12 24 24 16 26 Z" fill="#FFD23A" ${inkF}/><path d="M20 8 L22 4 M24 12 L28 10" stroke="#FF8A3D"/>`),
    boss: sticker("#3A2218", `<ellipse cx="16" cy="18" rx="10" ry="7" fill="#5A3A22" ${inkF}/><circle cx="16" cy="12" r="6" fill="#8B5A2B" ${inkF}/><path d="M10 10 L7 6 M22 10 L25 6" ${ink}/>`),
    konami: sticker("#B6FF4A", `<path d="M16 7 L19 13 H16 L20 20 H12 L16 13 H13 Z" fill="#FF4B1F" ${inkF}/>`),
    shop: sticker("#FF8A3D", `<path d="M6 14 L16 8 L26 14 V24 H6 Z" fill="#FFD23A" ${inkF}/><rect x="13" y="17" width="6" height="7" fill="#3A2218"/><path d="M6 14 H26" ${ink}/>`),
    tung: sticker("#C9A36B", `<rect x="12" y="8" width="8" height="16" rx="2" fill="#E8B86D" ${inkF}/><path d="M8 18 H12 M20 12 L26 8" ${ink}/><circle cx="15" cy="12" r="1" fill="${SOOT}"/><circle cx="18" cy="12" r="1" fill="${SOOT}"/>`),
    brain: sticker("#FF3EC8", `<path d="M10 16 C8 8 16 6 16 12 C18 6 24 10 22 16 C26 22 8 24 10 16 Z" fill="#FF8AD4" ${inkF}/>`),
    chaos: sticker("#FF4B1F", `<circle cx="16" cy="16" r="10" fill="#FFD23A" ${inkF}/><circle cx="12" cy="13" r="1.5" fill="${SOOT}"/><circle cx="20" cy="13" r="1.5" fill="${SOOT}"/><circle cx="16" cy="20" r="1.5" fill="${SOOT}"/>`),
    museum: sticker("#E8D5A3", `<path d="M6 14 L16 8 L26 14 V24 H6 Z" fill="#FFF8E0" ${inkF}/><rect x="10" y="16" width="3" height="8" fill="${SOOT}"/><rect x="19" y="16" width="3" height="8" fill="${SOOT}"/>`),
    close: sticker("#FF4B1F", `<path d="M10 10 L22 22 M22 10 L10 22" ${ink}/>`),
    post: sticker("#2EE6FF", `<rect x="8" y="10" width="16" height="12" rx="2" fill="#E8FFFF" ${inkF}/><path d="M8 10 L16 17 L24 10" ${ink}/>`),
    tick: sticker("#FFD23A", `<circle cx="16" cy="16" r="9" fill="#FFE566" ${inkF}/><text x="16" y="20" text-anchor="middle" font-size="10" font-weight="800" fill="${SOOT}" font-family="Trebuchet MS,sans-serif">T</text>`),
    love: sticker("#FF3EC8", `<path d="M16 24 C10 18 7 14 10 11 C12 9 16 11 16 11 C16 11 20 9 22 11 C25 14 22 18 16 24 Z" fill="#FF4B1F" ${inkF}/>`),
    phone: sticker("#B6FF4A", `<rect x="11" y="6" width="10" height="20" rx="2" fill="#1C0B08" ${inkF}/><circle cx="16" cy="22" r="1.4" fill="#B6FF4A"/>`),
    accept: sticker("#B6FF4A", `<path d="M8 16 L13 22 L24 10" ${ink}/>`),
    decline: sticker("#FF4B1F", `<rect x="7" y="14" width="18" height="4" rx="2" fill="${SOOT}"/>`),
    reset: sticker("#C9D4E8", `<path d="M22 12 A8 8 0 1 0 16 24" ${ink}/><path d="M22 12 L26 12 L22 8" fill="${SOOT}"/>`)
  };

  window.ICONS = I;
  window.iconHTML = function (name, cls) {
    return `<span class="ico-wrap ${cls || ""}">${I[name] || I.star}</span>`;
  };

  window.CHAR = {
    ember: svg(
      `<ellipse cx="48" cy="70" rx="28" ry="10" fill="#1c0b08" opacity=".35"/>
       <path d="M22 58 C18 40 34 22 52 28 C70 18 86 40 78 58 C96 62 70 82 46 76 C28 84 20 70 22 58 Z" fill="#FF4B1F" stroke="#1c0b08" stroke-width="3"/>
       <path d="M40 44 C42 34 58 34 56 46 C70 40 74 58 60 60 C48 70 34 58 40 44 Z" fill="#FFD23A"/>
       <circle cx="62" cy="42" r="4" fill="#1c0b08"/><circle cx="63.5" cy="41" r="1.4" fill="#fff"/>
       <path d="M74 36 L88 24 M78 44 L92 40 M72 28 L80 16" stroke="#FF8A3D" stroke-width="3" stroke-linecap="round"/>
       <path d="M30 36 L18 22" stroke="#FF4B1F" stroke-width="3"/>`,
      "0 0 96 96"
    ),
    tung: svg(
      `<rect x="38" y="18" width="28" height="64" rx="8" fill="#C98A3B" stroke="#1c0b08" stroke-width="3"/>
       <rect x="42" y="24" width="20" height="8" rx="2" fill="#E8B86D"/>
       <rect x="42" y="36" width="20" height="6" rx="2" fill="#8B5A2B"/>
       <rect x="42" y="46" width="20" height="6" rx="2" fill="#E8B86D"/>
       <circle cx="48" cy="34" r="2.4" fill="#1c0b08"/><circle cx="58" cy="34" r="2.4" fill="#1c0b08"/>
       <path d="M44 56 Q52 62 60 56" fill="none" stroke="#1c0b08" stroke-width="2"/>
       <path d="M38 50 L18 58 L22 64 L38 56" fill="#C98A3B" stroke="#1c0b08" stroke-width="2"/>
       <path d="M66 40 L86 22 L90 28 L70 48" fill="#C98A3B" stroke="#1c0b08" stroke-width="2"/>
       <path d="M84 18 L96 8 L92 28 Z" fill="#8B5A2B" stroke="#1c0b08" stroke-width="2"/>
       <circle cx="24" cy="84" r="8" fill="#3A2218"/><circle cx="72" cy="84" r="8" fill="#3A2218"/>`,
      "0 0 104 96"
    ),
    croc: svg(
      `<ellipse cx="56" cy="50" rx="36" ry="18" fill="#3DB54A" stroke="#1c0b08" stroke-width="3"/>
       <path d="M20 50 L4 44 L8 56 Z" fill="#2A8A38" stroke="#1c0b08" stroke-width="2"/>
       <circle cx="78" cy="44" r="4" fill="#1c0b08"/><rect x="70" y="52" width="16" height="6" fill="#FFF4CC" stroke="#1c0b08" stroke-width="1.5"/>
       <rect x="40" y="64" width="10" height="16" fill="#1c0b08"/><rect x="60" y="64" width="10" height="16" fill="#1c0b08"/>
       <path d="M30 36 L34 24 L40 36" fill="#FFD23A" stroke="#1c0b08"/>`,
      "0 0 104 96"
    ),
    cup: svg(
      `<path d="M28 28 H68 L64 70 H32 Z" fill="#F4F1FF" stroke="#1c0b08" stroke-width="3"/>
       <path d="M68 34 C82 34 82 54 68 54" fill="none" stroke="#1c0b08" stroke-width="3"/>
       <path d="M40 20 C40 10 56 10 56 20" stroke="#C9A36B" stroke-width="3" fill="none"/>
       <rect x="36" y="40" width="22" height="8" fill="#FF4B1F"/>
       <circle cx="44" cy="44" r="2" fill="#1c0b08"/><circle cx="52" cy="44" r="2" fill="#1c0b08"/>`,
      "0 0 96 96"
    )
  };
})();

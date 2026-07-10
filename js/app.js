import { db } from './firebase.js';
import { doc, setDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const DRINKS = [
  {id:'raspberry-lemonade', name:'Sparkling Raspberry Lemonade', cat:'LEMONADES', kj:'380 kJ', desc:'Sparkling lemonade mixed with real raspberry puree and topped with freeze-dried raspberries.', img:'https://images.ctfassets.net/crbk84xktnsl/2jDIUGQAYen0jw9XXjK5pV/38310f93931f907dcb3bfa24a42f135f/1_Sparkling_Raspberry_Lemonade.png', color:'#E0294B'},
  {id:'peach-lemonade', name:'Sparkling Peach Pop Lemonade', cat:'LEMONADES', kj:'695 kJ', desc:'Sparkling lemonade packed with juicy peach syrup and infused with zesty yuzu puree.', color:'#FF9F45', img:'https://images.ctfassets.net/crbk84xktnsl/6nLjCgzV71dV8lF3OjZ6KT/c8edc0d7a98fdd24e48de7c60f28f4c5/2_Sparkling_Peach_Pop_Lemonade.png'},
  {id:'watermelon-boba', name:'Watermelon Boba Refresher', cat:'BOBA REFRESHERS', kj:'426 kJ', desc:'Famous lemonade combined with fruity watermelon puree and hibiscus flavoured boba.', color:'#E8567C', img:'https://images.ctfassets.net/crbk84xktnsl/4dAxYkwUmQoVyivKzHCr5R/2550324835eb0453928b925d2dfb09ef/3_Watermelon_Boba_Refresher.png'},
  {id:'lychee-boba', name:'Lychee Boba Refresher', cat:'BOBA REFRESHERS', kj:'874 kJ', desc:'Famous lemonade combined with juicy lychee syrup, floral osmanthus syrup, and hibiscus boba.', color:'#D98BB5', img:'https://images.ctfassets.net/crbk84xktnsl/2GLkUucCvUpA1zhLv3K3dY/066d0adf322166c6e1a74dc878c8cc48/5_Lychee_Boba_Refresher.png'},
  {id:'choc-shake', name:'Chocolate Krunch Shake', cat:'KRUNCH SHAKES', kj:'2449 kJ', desc:'Creamy indulgent chocolate shake with luxurious dark chocolate sauce & crunchy biscuit crumb.', color:'#5C3A21', img:'https://images.ctfassets.net/crbk84xktnsl/4rXuLJcrpmVVNOE7wZkOsM/2c16aa911db2fd6da2dded7bcbc26a2d/6_Chocolate_Krunch_Shake.png'},
  {id:'caramel-shake', name:'Caramel Krunch Shake', cat:'KRUNCH SHAKES', kj:'2639 kJ', desc:'Creamy indulgent caramel shake drizzled with luxurious caramel sauce & crunchy biscuit crumb.', color:'#C17817', img:'https://images.ctfassets.net/crbk84xktnsl/56fdCMDaEVvAfoDnMzC5dy/03a1354f56f09be76ea20c4618b07c3f/7_Caramel_Krunch_Shake.png'},
  {id:'fairy-shake', name:'Fairy Bread Krunch Shake', cat:'KRUNCH SHAKES', kj:'2401 kJ', desc:'Creamy vanilla shake with strawberry purée, whipped cream and sprinkles. Nostalgic fairy bread energy.', color:'#FF7EB6', img:'https://images.ctfassets.net/crbk84xktnsl/3KgTe5HYNBVxvHd5rIYB0i/f0c6e655b96085bc42fb020b5599b00c/8_Fairy_Bread_Krunch_Shake.png'},
  {id:'pepsi-spider', name:'Pepsi Spider', cat:'SPIDERS', kj:'956 kJ', desc:'The legendary KFC Freeze levelled up: Pepsi Freeze meets indulgent vanilla thick shake.', color:'#1E3A8A', img:'https://images.ctfassets.net/crbk84xktnsl/4G8UI0PiYfPCjtgEOR3oS5/b8f3f407436c229e2fc343da4f8f212b/9_Pepsi_Frozen_Float.png'},
  {id:'mtndew-spider', name:'Mountain Dew Spider', cat:'SPIDERS', kj:'1018 kJ', desc:'The legendary KFC Freeze levelled up: Mountain Dew Freeze meets indulgent vanilla thick shake.', color:'#9ACD32', img:'https://images.ctfassets.net/crbk84xktnsl/7FSoglFOH6zyLrNDxkGT0i/3468e77e8064f632d74db0759d3a8a90/10_Mountain_Dew_Frozen_Float.png'},
  {id:'raspberry-spider', name:'Raspberry Spider', cat:'SPIDERS', kj:'994 kJ', desc:'The legendary KFC Freeze levelled up: Raspberry Freeze meets indulgent vanilla thick shake.', color:'#C2185B', img:'https://images.ctfassets.net/crbk84xktnsl/5DsjMmXV60L9Yy27xVA6qL/67ebd91a6d19ebb50ca6e2669df43f7b/11_Raspberry_Frozen_Float.png'},
];

const CAT_COLORS = { 'LEMONADES':'#FFB100', 'BOBA REFRESHERS':'#05A8A6', 'KRUNCH SHAKES':'#8B5E34', 'SPIDERS':'#3949AB' };

let globalRatings = {};

function cupSvg(color, id) {
  return `<svg class="cup" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="clip-${id}"><path d="M6 8 L34 8 L30 46 L10 46 Z"/></clipPath></defs>
    <path d="M6 8 L34 8 L30 46 L10 46 Z" fill="#fff" stroke="#D8CBB2" stroke-width="2"/>
    <g clip-path="url(#clip-${id})">
      <rect class="cup-fill" id="fill-${id}" x="0" y="46" width="40" height="0" fill="${color}"/>
    </g>
    <path d="M6 8 L34 8 L30 46 L10 46 Z" fill="none" stroke="#D8CBB2" stroke-width="2"/>
    <line x1="8" y1="8" x2="34" y2="8" stroke="#D8CBB2" stroke-width="2"/>
    <line x1="26" y1="2" x2="20" y2="18" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}

function setCupFill(id, value) {
  const fill = document.getElementById(`fill-${id}`);
  if(!fill) return;
  const h = (value / 10) * 38;
  fill.setAttribute('height', h);
  fill.setAttribute('y', 46 - h);
}

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  
  DRINKS.forEach(d => {
    const activeScore = globalRatings[d.id] !== undefined ? globalRatings[d.id] : 5;
    
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <span class="cat-badge" style="background:${CAT_COLORS[d.cat]}">${d.cat}</span>
      <div class="card-top">
        <img class="card-img" src="${d.img}" alt="${d.name}">
        <div>
          <p class="card-title">${d.name}</p>
          <div class="card-kj">${d.kj}</div>
        </div>
      </div>
      <p class="card-desc">${d.desc}</p>
      <div class="rate-row">
        ${cupSvg(d.color, d.id)}
        <div class="slider-col">
          <input type="range" min="1" max="10" step="1" value="${activeScore}" id="range-${d.id}">
          <div class="slider-labels"><span>1</span><span>10</span></div>
        </div>
        <div class="rate-value" id="val-${d.id}" style="color:${d.color}">${activeScore}</div>
      </div>
      <div class="saved-pill" id="pill-${d.id}">✓ Saved</div>
    `;
    grid.appendChild(card);
    setCupFill(d.id, activeScore);

    const range = card.querySelector(`#range-${d.id}`);
    const valEl = card.querySelector(`#val-${d.id}`);
    const pill = card.querySelector(`#pill-${d.id}`);
    let saveTimeout;

    range.addEventListener('input', () => {
      valEl.textContent = range.value;
      setCupFill(d.id, parseInt(range.value, 10));
    });

    range.addEventListener('change', async () => {
      const score = parseInt(range.value, 10);
      pill.textContent = 'Saving…';
      pill.style.color = '#a99c85';
      pill.classList.add('show');
      
      try {
        // Overwrites the single global master score for this drink ID
        await setDoc(doc(db, "kwench-scores", d.id), { score: score });
        pill.textContent = '✓ Saved';
        pill.style.color = '#3a9a5c';
      } catch (err) {
        console.error("Firestore save error: ", err);
        pill.textContent = '⚠ Could not save — try moving the slider again';
        pill.style.color = '#c0392b';
      }
      
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => pill.classList.remove('show'), 1400);
    });
  });
}

function renderLeaderboard() {
  const board = document.getElementById('board');
  
  const scoredDrinks = DRINKS.map(d => {
    const score = globalRatings[d.id] !== undefined ? globalRatings[d.id] : null;
    return { ...d, score };
  });

  // Sort strictly by the shared master score
  scoredDrinks.sort((a, b) => {
    if (a.score === null && b.score === null) return 0;
    if (a.score === null) return 1;
    if (b.score === null) return -1;
    return b.score - a.score;
  });

  board.innerHTML = '';
  scoredDrinks.forEach((d, i) => {
    const row = document.createElement('div');
    row.className = 'board-row';
    const rankClass = (i === 0 && d.score !== null) ? 'gold' : '';
    const pct = d.score !== null ? (d.score / 10) * 100 : 0;
    
    row.innerHTML = `
      <div class="rank-num ${rankClass}">${i + 1}</div>
      <img class="board-thumb" src="${d.img}" alt="">
      <div class="board-name">
        <b>${d.name}</b>
        <small>${d.cat}</small>
      </div>
      <div class="board-bar-wrap"><div class="board-bar" style="width:${pct}%;background:${d.color}"></div></div>
      <div class="board-score">
        ${d.score !== null ? d.score : '—'}
        <small>${d.score !== null ? 'Live Score' : 'unrated'}</small>
      </div>
    `;
    board.appendChild(row);
  });
}

function listenToDatabase() {
  let loadedDrinksCount = 0;
  
  DRINKS.forEach(d => {
    onSnapshot(doc(db, "kwench-scores", d.id), (snapshot) => {
      if (snapshot.exists()) {
        globalRatings[d.id] = snapshot.data().score;
      } else {
        globalRatings[d.id] = 5; // Default if completely untouched yet
      }
      
      if (loadedDrinksCount < DRINKS.length) {
        loadedDrinksCount++;
      }
      
      if (loadedDrinksCount >= DRINKS.length) {
        renderLeaderboard();
        DRINKS.forEach(drink => {
          const rInput = document.getElementById(`range-${drink.id}`);
          if (rInput && document.activeElement !== rInput) {
            const currentScore = globalRatings[drink.id];
            rInput.value = currentScore;
            const valLabel = document.getElementById(`val-${drink.id}`);
            if (valLabel) valLabel.textContent = currentScore;
            setCupFill(drink.id, currentScore);
          }
        });
      }
    }, (error) => {
      console.error("Firestore listener error: ", error);
    });
  });
  
  setTimeout(() => {
    renderGrid();
    renderLeaderboard();
  }, 800);
}

listenToDatabase();
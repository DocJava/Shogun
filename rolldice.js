  // FUNZIONI PER GESTIRE IL DADO
  const cube = document.getElementById('cube');
  const popup = document.getElementById('dice-popup');
  const cubeWrapper = document.getElementById('cubeWrapper');
  
  const finalRot = {
    1: {x:   0, y:   0},
    2: {x:  90, y:   0},
    3: {x:   0, y: -90},
    4: {x:   0, y:  90},
    5: {x: -90, y:   0},
    6: {x: 180, y:   0}
  };

  let currentX = 0;
  let currentY = 0;

  function rollDice() {
  
    // Fade in del popup
    popup.style.opacity = "1";
	
		// Zoom-in del wrapper per il dado
    cubeWrapper.style.transform = "scale(1)";
	
    const roll = Math.floor(Math.random() * 6) + 1;
	
		const r1 = Math.floor(Math.random() * 2) + 2;
		const r2 = Math.floor(Math.random() * 2) + 2;

		const turnsX = r1 + Math.floor(Math.random() * r2);
		const turnsY = r2 + Math.floor(Math.random() * r1);	
	
		const baseX = finalRot[roll].x;
		const baseY = finalRot[roll].y;

		// normalizza l'orientamento attuale a [0, 360)
		const normX = ((currentX % 360) + 360) % 360;
		const normY = ((currentY % 360) + 360) % 360;

		// differenza per arrivare alla faccia giusta
		const deltaX = baseX - normX;
		const deltaY = baseY - normY;

		// nuovo target: tanti giri + correzione verso la faccia giusta
		currentX += turnsX * 360 + deltaX;
		currentY += turnsY * 360 + deltaY;

		const targetX = currentX;
		const targetY = currentY;

    pendingResolve = () => {
			// Fade-out del popup
			setTimeout(() => {
				popup.style.opacity = "0";			
				cubeWrapper.style.transform = "scale(0.8)";
			}, 2000); // <-- ritardo in millisecondi      
    };
	
	
    cube.style.transform = `rotateX(${targetX}deg) rotateY(${targetY}deg)`;

    return roll;
  };
  
  cube.addEventListener('transitionend', () => {
  		if (pendingResolve) {	
				pendingResolve();
				pendingResolve = null;
		}
  });
  
  // FUNZIONI PER GESTIRE LE STATISTICHE PERSONAGGIO
  const statsPopup = document.getElementById('stats-popup');

  function viewStats() {
    
		// Fade in del popup
    statsPopup.style.opacity = "1";
		statsPopup.style.pointerEvents = "auto";

    pendingStats = () => {
		// Fade-out del popup
		setTimeout(() => {
				statsPopup.style.opacity = "0";	
				statsPopup.style.pointerEvents = "none";			
			}, 500); // <-- ritardo in millisecondi      
    };
  }
  
  statsPopup.addEventListener('click', e => {
  	if (pendingStats && e.target === statsPopup) {	
			pendingStats();
			pendingStats = null;
		}
  });


  // FUNZIONI PER GESTIRE L'INVENTARIO
  const invPopup = document.getElementById('inv-popup');

  function viewInventory(output) {
    
	// Show the inventory
	const invSheet = document.getElementById('inventory');
	invSheet.innerHTML = output.replace(/\n/g, "<br>");
	
	// Fade in del popup
    invPopup.style.opacity = "1";
	invPopup.style.pointerEvents = "auto";

    pendingInv = () => {
		// Fade-out del popup
		setTimeout(() => {
				invPopup.style.opacity = "0";	
				invPopup.style.pointerEvents = "none";			
			}, 500); // <-- ritardo in millisecondi      
    };
  }
  
  invPopup.addEventListener('click', e => {
  	if (pendingInv && e.target === invPopup) {	
			pendingInv();
			pendingInv = null;
		}
  });


  // FUNZIONI PER GESTIRE L'OROLOGIO
  let edoTimer = null;      // intervallo animazione
	let edoTarget = null;     // tempo di arrivo
	let edoSpeed = 1;         // minuti per tick
	let edoTime = 360 //720; // tempo di partenza in minuti (360 = 6 del mattino)  

	function startEdoClock(startValue, endValue, speed = 1) {
		edoTime = startValue;
		edoTarget = endValue;
		edoSpeed = speed;

		if (edoTimer) clearInterval(edoTimer);

		edoTimer = setInterval(() => {
			
			edoTime += edoSpeed;

			updateEdoClock();

			if (edoTime >= edoTarget) {
				clearInterval(edoTimer);
				if (edoTime >= 1440) edoTime -= 1440; // ciclo 24h
				edoTimer = null;
			}
		}, 50); // velocità animazione (50ms = fluido)
	}

	/*
	function stopEdoClock() {
		if (edoTimer) {
			clearInterval(edoTimer);
			edoTimer = null;
		}
	}
	*/

	function updateEdoClock() {

		var currentTime = edoTime % 1440;
		
		// 0–360° → 0° = mezzogiorno
		const angleSun = (currentTime / 1440) * 360 - 180;
		const angleMoon = angleSun + 180;

		// ruota i wrapper
		document.getElementById("edo-orbit-sun").style.transform =
			`rotate(${angleSun}deg)`;
		document.getElementById("edo-orbit-moon").style.transform =
			`rotate(${angleMoon}deg)`;

	
		// normalizza 0–360
		let normSun = angleSun % 360;
		if (normSun < 0) normSun += 360;

		let normMoon = angleMoon % 360;
		if (normMoon < 0) normMoon += 360;

		const skyDayImg = document.getElementById("edo-sky-day");
		const skyNightImg = document.getElementById("edo-sky-night");
		const skyDuskImg = document.getElementById("edo-sky-dusk");
		const skyDawnImg = document.getElementById("edo-sky-dawn");

		let t;
		let dayOpacity = 0;
		let nightOpacity = 0;
		let duskOpacity = 0;
		let dawnOpacity = 0;

		// TRAMONTO RAPIDO (80° → 100°)
		if (normSun >= 60 && normSun <= 80) {
			t = (normSun - 60) / 20; // 0→1
			dayOpacity = 1 - t; //  1 - t/2;
			//nightOpacity = t/2;
			duskOpacity = t;
		}

		// TRAMONTO RAPIDO (80° → 120°)
		else if (normSun > 80 && normSun <= 110) {
			t = (normSun - 80) / 30; // 0→1
			dayOpacity = 0; //0.5 - t/2;
			duskOpacity = 1 - t;
			nightOpacity = t; //0.5 + t/2;
		}

		// ALBA RAPIDA (260° → 280°)
		else if (normSun >= 240 && normSun <= 260) {
			t = (normSun - 240) / 20; // 0→1
			//dayOpacity = t/2;
			dawnOpacity = t;
			nightOpacity = 1 - t; //1 - t/2;
		}

		else if (normSun >= 260 && normSun <= 290) {
			t = (normSun - 260) / 30; // 0→1
			dayOpacity = t; //0.5 + t/2;
			dawnOpacity = 1 - t;
			nightOpacity = 0; //0.5 - t/2;
		}

		// NOTTE PIENA (100° → 260°)
		else if (normSun > 110 && normSun < 240) {
			dayOpacity = 0;
			duskOpacity = 0;
			nightOpacity = 1;
			dawnOpacity = 0;
		}

		// GIORNO PIENO (tutto il resto: intorno a 0°)
		else {
			dayOpacity = 1;
			duskOpacity = 0;
			nightOpacity = 0;
			dawnOpacity = 0;
		}

		skyDayImg.style.opacity = dayOpacity;
		skyNightImg.style.opacity = nightOpacity;
		skyDuskImg.style.opacity = duskOpacity;
		skyDawnImg.style.opacity = dawnOpacity;
	}

	function advanceEdoClock(start, interval, tick) {

		// calcola il target
		let target = (start + interval); // % 1440;
		
		//console.log("Start : " + start + " Interval : " + interval + " Target : " + target);

		// avvia l’orologio verso il target
		startEdoClock(start, target, tick);
	}
  
	function showEdoClock() {
		const p = document.getElementById("edo-clock-popup");
		p.style.opacity = "1";
		p.style.pointerEvents = "auto";
	}

	function hideEdoClock() {
		const p = document.getElementById("edo-clock-popup");
		p.style.opacity = "0";
		p.style.pointerEvents = "none";
	}  
  	
	const panel = document.getElementById("edo-clock-panel");

	panel.addEventListener("touchstart", () => {
		panel.style.transform = "scale(1.0)";
	});

	panel.addEventListener("touchend", () => {
		panel.style.transform = "scale(0.6)";
	});


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

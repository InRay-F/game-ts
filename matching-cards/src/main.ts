document.addEventListener("DOMContentLoaded", () => {
    const themes = {
      animals: {
        backgroundColor: "#A8D5BA",
        cardBackColor: "#f9e5de",
        // cardFrontColor: "#1E1F59",
        images: [
          "images/animals/cow.png",
          "images/animals/elephant.webp",
          "images/animals/fox.png",
          "images/animals/hamster.png",
          "images/animals/lion.webp",
          "images/animals/monkey.webp",
          "images/animals/panda.webp",
          "images/animals/penguin.png"
        ]
      },
      space: {
        backgroundColor: "#0B0C2A",
        cardBackColor: "#1E1F59",
        images: [
          "images/space/planet.png",
          "images/space/rocket.png",
          "images/space/star.png",
          "images/space/ufo.png",
          "images/space/astronaut.png",
          "images/space/moon.png",
          "images/space/alien.png",
          "images/space/satellite.png"
        ]
      },
      fantasy: {
        backgroundColor: "#FFD6E8",
        cardBackColor: "#FF69B4",
        images: [
          "images/fantasy/dragon.png",
          "images/fantasy/unicorn.png",
          "images/fantasy/fairy.png",
          "images/fantasy/castle.png",
          "images/fantasy/sword.png",
          "images/fantasy/potion.png",
          "images/fantasy/wizard.png",
          "images/fantasy/phoenix.png"
        ]
      }
    };
  
    const gameBoard = document.getElementById("game-board")!;
    const messageDisplay = document.getElementById("display__message")!;
    const timerDisplay = document.getElementById("display__timer")!;
    const hintButton = document.getElementById("hint-button")!;
    const restartButton = document.getElementById("restart-button")!;
  
    let flippedCards: HTMLElement[] = [];
    let matchedCards: HTMLElement[] = [];
    let canClick = true;
    let hintUses = 0;
    let time = 0;
    let timerInterval: number | undefined;
    let currentTheme: keyof typeof themes = "animals"; // default
  
    const matchMessages = ["Yay!", "You got it!", "Nice match!", "Woohoo!", "😄"];
    const noMatchMessages = ["Oops!", "Try again!", "Not quite!", "😭"];
  
    function getRandomMessage(list: string[]) {
      const index = Math.floor(Math.random() * list.length);
      return list[index];
    }
  
    function startTimer() {
      time = 0;
      timerDisplay.textContent = `Time: ${time}s`;
      timerInterval = window.setInterval(() => {
        time++;
        timerDisplay.textContent = `Time: ${time}s`;
      }, 1000);
    }
  
    function stopTimer() {
      clearInterval(timerInterval);
    }
  
    function createCard(imageSrc: string, name: string, cardBackColor: string): HTMLElement {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.name = name;
  
      const inner = document.createElement("div");
      inner.classList.add("card__inner");
  
      const front = document.createElement("div");
      front.classList.add("card__front");
      const frontImg = document.createElement("img");
      frontImg.src = imageSrc;
      front.appendChild(frontImg);
  
      const back = document.createElement("div");
      back.classList.add("card__back");
      back.style.backgroundColor = cardBackColor;
  
      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);
  
      return card;
    }
  
    function setupGameLogic(cards: HTMLElement[]) {
      flippedCards = [];
      matchedCards = [];
      canClick = true;
      hintUses = 0;
      messageDisplay.textContent = "";
      timerDisplay.style.display = "block";
      hintButton.disabled = false;
      stopTimer();
      startTimer();
  
      cards.forEach(card => {
        card.addEventListener("click", () => {
          if (!canClick || flippedCards.includes(card) || matchedCards.includes(card)) return;
  
          card.classList.add("card--flipped");
          flippedCards.push(card);
  
          if (flippedCards.length === 2) {
            const [firstCard, secondCard] = flippedCards;
            canClick = false;
  
            if (firstCard.dataset.name === secondCard.dataset.name) {
              messageDisplay.textContent = getRandomMessage(matchMessages);
              matchedCards.push(firstCard, secondCard);
              flippedCards = [];
              canClick = true;
            } else {
              messageDisplay.textContent = getRandomMessage(noMatchMessages);
              setTimeout(() => {
                firstCard.classList.remove("card--flipped");
                secondCard.classList.remove("card--flipped");
                flippedCards = [];
                canClick = true;
                messageDisplay.textContent = "";
              }, 1000);
            }
  
            if (matchedCards.length === cards.length) {
              stopTimer();
              messageDisplay.textContent = `🎉 You won in ${time} seconds! WOW 🥳`;
              timerDisplay.style.display = "none";
            }
          }
        });
      });
    }
  
    function startGame(themeName: keyof typeof themes) {
      currentTheme = themeName;
      const theme = themes[themeName];
  
      document.body.className = `themes__${themeName}`;
      gameBoard.innerHTML = "";
  
      const images = [...theme.images, ...theme.images];
      const shuffled = images.sort(() => 0.5 - Math.random());
  
      const newCards = shuffled.map(img => {
        const name = img.split("/").pop()?.split(".")[0] || "";
        return createCard(img, name, theme.cardBackColor);
      });
  
      newCards.forEach(card => gameBoard.appendChild(card));
      setupGameLogic(newCards);
    }
  
    // Theme button events
    document.getElementById("theme-1")?.addEventListener("click", () => startGame("animals"));
    document.getElementById("theme-2")?.addEventListener("click", () => startGame("space"));
    document.getElementById("theme-3")?.addEventListener("click", () => startGame("fantasy"));
  
    // Restart game
    restartButton.addEventListener("click", () => {
      startGame(currentTheme);
    });
  
    // Hint logic
    hintButton.addEventListener("click", () => {
      if (hintUses >= 2) {
        hintButton.disabled = true;
        return;
      }
  
      hintUses++;
      canClick = false;
  
      const cards = Array.from(gameBoard.querySelectorAll(".card")) as HTMLElement[];
      const unmatched = cards.filter(card => !card.classList.contains("card--flipped") && !matchedCards.includes(card));
  
      unmatched.forEach(card => card.classList.add("card--flipped"));
  
      setTimeout(() => {
        unmatched.forEach(card => card.classList.remove("card--flipped"));
        canClick = true;
      }, 1000);
    });
  
    // Start with default theme
    startGame("animals");
  });
  
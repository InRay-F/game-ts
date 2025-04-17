document.addEventListener("DOMContentLoaded", () => {
  const themes = {
    animals: {
      cardBackColor: "#f9e5de",
      cardFrontColor: "#c1b1ce",
      cardMatchedColor: "#9dd9d2",
      images: [
        "images/animals/cow.png",
        "images/animals/elephant.webp",
        "images/animals/fox.png",
        "images/animals/hamster.png",
        "images/animals/lion.webp",
        "images/animals/monkey.webp",
        "images/animals/panda.webp",
        "images/animals/penguin.png",
      ],
    },
    space: {
      cardBackColor: "#1E1F59",
      cardFrontColor: "#9683EC",
      cardMatchedColor: "#28c4f5",
      images: [
        "images/space/alien.webp",
        "images/space/astronaut.webp",
        "images/space/galaxy.webp",
        "images/space/moon.png",
        "images/space/planet.png",
        "images/space/rocket.png",
        "images/space/star.png",
        "images/space/sun.png",
      ],
    },
    fantasy: {
      cardBackColor: "#D0F0C0",
      cardFrontColor: "#E3DAC9",
      cardMatchedColor: "#85ccec",
      images: [
        "images/fantasy/castle.png",
        "images/fantasy/crown.png",
        "images/fantasy/dragon.webp",
        "images/fantasy/griffin.webp",
        "images/fantasy/potion.png",
        "images/fantasy/sword.png",
        "images/fantasy/unicorn.png",
        "images/fantasy/wand.png",
      ],
    },
  };

  const sounds = {
    flip: new Audio("sounds/flip.mp3"),
    match: new Audio("sounds/match.wav"),
    win: new Audio("sounds/win.mp3"),
    hint: new Audio("sounds/hint.wav"),
    again: new Audio("sounds/again.wav"),
    themeAnimals: new Audio("sounds/theme-animals.wav"),
    themeSpace: new Audio("sounds/theme-space.wav"),
    themeFantasy: new Audio("sounds/theme-fantasy.wav"),
  };

  const gameBoard = document.getElementById("game-board")!;
  const messageDisplay = document.getElementById("display__message")!;
  const timerDisplay = document.getElementById("display__timer")!;
  const hintButton = document.getElementById(
    "hint-button"
  ) as HTMLButtonElement;
  const restartButton = document.getElementById("restart-button")!;

  let flippedCards: HTMLElement[] = [];
  let matchedCards: HTMLElement[] = [];
  let canClick = true;
  let hintUses = 0;
  let time = 0;
  let timerInterval: number | undefined;
  let hasStarted = false;
  let currentTheme: keyof typeof themes = "animals";

  //display logic

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
  // create cards
  function createCard(
    imageSrc: string,
    name: string,
    cardBackColor: string,
    cardFrontColor: string,
    cardMatchedColor: string
  ): HTMLElement {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = name;
    card.dataset.matchedColor = cardMatchedColor;

    const inner = document.createElement("div");
    inner.classList.add("card__inner");

    const front = document.createElement("div");
    front.classList.add("card__front");
    front.style.backgroundColor = cardFrontColor;

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
  //set up logic
  function setupGameLogic(cards: HTMLElement[]) {
    flippedCards = [];
    matchedCards = [];
    canClick = true;
    hintUses = 0;
    hasStarted = false;
    stopTimer();
    timerDisplay.textContent = "Time: 0s";
    timerDisplay.style.display = "block";
    hintButton.disabled = false;
    messageDisplay.textContent = "";

    //card logic
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (
          !canClick ||
          flippedCards.includes(card) ||
          matchedCards.includes(card)
        )
          return;

        if (!hasStarted) {
          hasStarted = true;
          -startTimer();
        }

        card.classList.add("card--flipped");
        sounds.flip.play();
        flippedCards.push(card);

        if (flippedCards.length === 2) {
          const [firstCard, secondCard] = flippedCards;
          canClick = false;

          if (firstCard.dataset.name === secondCard.dataset.name) {
            sounds.match.play();
            messageDisplay.textContent = getRandomMessage(matchMessages);
            matchedCards.push(firstCard, secondCard);

            const matchedColor = firstCard.dataset.matchedColor!;
            firstCard
              .querySelector(".card__front")!
              .setAttribute("style", `background-color: ${matchedColor}`);
            secondCard
              .querySelector(".card__front")!
              .setAttribute("style", `background-color: ${matchedColor}`);

            firstCard.classList.add("card--matched");
            secondCard.classList.add("card--matched");

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
            sounds.win.play();
            messageDisplay.textContent = `🎉 You won in ${time} seconds! WOW 🥳`;
            timerDisplay.style.display = "none";
          }
        }
      });
    });
  }
  //start game logic
  function startGame(themeName: keyof typeof themes) {
    currentTheme = themeName;
    const theme = themes[themeName];

    document.body.className = `themes__${themeName}`;
    gameBoard.innerHTML = "";

    const images = [...theme.images, ...theme.images];
    const shuffled = images.sort(() => 0.5 - Math.random());

    const newCards = shuffled.map((img) => {
      const name = img.split("/").pop()?.split(".")[0] || "";
      return createCard(
        img,
        name,
        theme.cardBackColor,
        theme.cardFrontColor,
        theme.cardMatchedColor
      );
    });

    newCards.forEach((card) => gameBoard.appendChild(card));
    setupGameLogic(newCards);
  }

  // Theme button events
  document.getElementById("theme-1")?.addEventListener("click", () => {
    sounds.themeAnimals.play();
    startGame("animals");
  });

  document.getElementById("theme-2")?.addEventListener("click", () => {
    sounds.themeSpace.play();
    startGame("space");
  });

  document.getElementById("theme-3")?.addEventListener("click", () => {
    sounds.themeFantasy.play();
    startGame("fantasy");
  });

  // Restart game
  restartButton.addEventListener("click", () => {
    sounds.again.play();
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

    const cards = Array.from(
      gameBoard.querySelectorAll(".card")
    ) as HTMLElement[];
    const unmatched = cards.filter(
      (card) =>
        !card.classList.contains("card--flipped") &&
        !matchedCards.includes(card)
    );

    unmatched.forEach((card) => card.classList.add("card--flipped"));
    sounds.hint.play();

    setTimeout(() => {
      unmatched.forEach((card) => card.classList.remove("card--flipped"));
      canClick = true;
    }, 1000);
  });

  // Start with default theme
  startGame("animals");
});

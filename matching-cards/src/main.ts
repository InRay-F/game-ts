// Wait until the HTML content is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // Select the game board container from the DOM
    const gameBoard = document.querySelector(".game__board");

    // Get all card elements and convert the NodeList into a real array
    const cards = document.querySelectorAll(".card");
    const cardArr = Array.from(cards);


    // Grab the message display element
    const messageDisplay = document.getElementById("display__message") as HTMLElement;
    const timerDisplay = document.getElementById("display__timer") as HTMLElement;

    let time = 0;
    let timerInterval: number | undefined;

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

    startTimer();

    // Arrays to track flipped and matched cards
    let flippedCards: Element[] = [];
    let matchedCards: Element[] = [];

    // Flag to temporarily disable clicks when 2 cards are being compared
    let canClick = true;
    

    // Add a click event to each card
    cardArr.forEach((card) => {
        card.addEventListener("click", () => {
            // Block clicks if we're waiting to flip cards back
            if (!canClick) return;

            // Do nothing if card is already matched or flipped
            if (matchedCards.includes(card) || flippedCards.includes(card)) return;

            // Log card ID for debugging
            console.log("Card clicked:", card.id);

            // Flip the card visually
            card.classList.add("card--flipped");

            // Add it to the flippedCards array
            flippedCards.push(card);

            // If two cards are flipped, check for match
            if (flippedCards.length === 2) {
                // Cast to HTMLElement for dataset access
                const firstCard = flippedCards[0] as HTMLElement;
                const secondCard = flippedCards[1] as HTMLElement;

                // Disable further clicks temporarily
                canClick = false;

                const matchMessages = ["Yay!", "You got it!", "Nice match!", "Woohoo!", "😄", "👏", "👍", "👌"];
                const noMatchMessages = ["Oops!", "Try again!", "Not quite!", "Almost!", "😭", "👎", "🥺", "🙈"] ;

                function getRandomMessage(messages: string[]): string {
                    const index = Math.floor(Math.random() * messages.length);
                    return messages[index];
                  }
                  
                // Check if the data-name matches
                if (firstCard.dataset.name === secondCard.dataset.name) {
                    console.log("Match");
                    messageDisplay.textContent = getRandomMessage(matchMessages);

                    firstCard.classList.add("card--matched");
                    secondCard.classList.add("card--matched");

                    // Add to matchedCards array
                    matchedCards.push(firstCard, secondCard);

                    // Reset flippedCards and allow clicks again
                    flippedCards = [];
                    canClick = true;
                } else {
                    console.log("No Match");
                    messageDisplay.textContent = getRandomMessage(noMatchMessages);


                    // Wait 1 second before flipping them back
                    setTimeout(() => {
                        firstCard.classList.remove("card--flipped");
                        secondCard.classList.remove("card--flipped");
                        flippedCards = [];
                        canClick = true;
                        messageDisplay.textContent = "";
                    }, 1000);
                }

                // If all cards are matched, display win message
                if (matchedCards.length === cards.length) {
                    stopTimer();
                    messageDisplay.textContent = `🎉You won & in ${time} seconds! WOW🥳`;
                    timerDisplay.style.display = "none";
                }
            }
        });
    });
    // Grab the hint button
    const hintButton = document.getElementById("hint-button") as HTMLButtonElement;
    let hintUses = 0; // Tracks how many times the hint has been used
    const hintLimit = 2; // Max number of allowed hint uses

    hintButton?.addEventListener("click", () => {
         // Stop if hint limit has been reached
        if (hintUses >= hintLimit) {
            console.log("No more hints left!");
            hintButton.disabled = true;
            return; // Stop the function here
        }
        
    // Increase hint use count BEFORE applying the hint logi
        hintUses++; 
        console.log("Hint used!", `(${hintUses}/${hintLimit})`);
        // Disable clicking temporarily
        canClick = false;
    
        // Find unmatched & unflipped cards
        const hintCards = cardArr.filter((card) => {
            return !matchedCards.includes(card) && !flippedCards.includes(card);
        });
    
        // Flip them temporarily
        hintCards.forEach((card) => card.classList.add("card--flipped"));
    
        // Hide them again after 1 second
        setTimeout(() => {
            hintCards.forEach((card) => card.classList.remove("card--flipped"));
            canClick = true;
        }, 1000);

         // Disable the hint button if the limit is now reached
    if (hintUses >= hintLimit) {
        hintButton.disabled = true;
    };
        
    });


    // Grab the restart button
    const restartButton = document.getElementById("restart-button");

    // Add a click event to the restart button
    restartButton?.addEventListener("click", () => {
        // Reset game state
        flippedCards = [];
        matchedCards = [];
        canClick = true;
        messageDisplay.textContent = "";
        stopTimer(); // Stop old timer if running
        startTimer(); // Start a new one
        hintUses = 0;
        hintButton.disabled = false;
        timerDisplay.style.display = "block";

       
        // Unflip all cards visually
        cardArr.forEach((card) => {
            card.classList.remove("card--flipped");
        });

        cardArr.forEach((card) => {
            card.classList.remove("card--matched");
        });

        // Shuffle cards again using Fisher-Yates
        for (let i = cardArr.length - 1; i > 0; i--) {
            const r = Math.floor(Math.random() * (i + 1));
            [cardArr[i], cardArr[r]] = [cardArr[r], cardArr[i]];
        }

        // Clear the board and re-append the shuffled cards
        gameBoard!.innerHTML = "";
        cardArr.forEach((card) => {
            gameBoard?.appendChild(card);
        });
    });
    
});
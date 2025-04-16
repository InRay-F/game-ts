// Wait until the HTML content is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    
    // Get all card elements and convert the NodeList into a real array
    const cards = document.querySelectorAll(".card");
    const cardArr = Array.from(cards);

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

                
                // Check if the data-name matches
                if (firstCard.dataset.name === secondCard.dataset.name) {
                    console.log("Match");
                
                    firstCard.classList.add("card--matched");
                    secondCard.classList.add("card--matched");

                    // Add to matchedCards array
                    matchedCards.push(firstCard, secondCard);

                    // Reset flippedCards and allow clicks again
                    flippedCards = [];
                    canClick = true;
                } else {
                    console.log("No Match");
                }
            }
            });
        });
    });
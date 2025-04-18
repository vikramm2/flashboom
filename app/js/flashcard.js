// app/js/flashcard.js
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ai') !== 'true') {
      document.body.innerHTML = '<p>No AI session detected.</p>';
      return;
    }
  
    // 1) Grab the cards
    const raw = localStorage.getItem('ai_flashcards') || '[]';
    let cards;
    try {
      cards = JSON.parse(raw);
    } catch {
      return document.body.innerHTML = '<p>Error parsing flashcards.</p>';
    }
    if (!Array.isArray(cards) || cards.length === 0) {
      return document.body.innerHTML = '<p>No flashcards found.</p>';
    }
  
    // 2) Set up state & DOM refs
    let idx = 0;
    const qDiv    = document.getElementById('question');
    const aDiv    = document.getElementById('answer');
    const flipBtn = document.getElementById('flip-btn');
    const nextBtn = document.getElementById('next-btn');
    const prog    = document.getElementById('progress');
  
    function render() {
      const { question, answer } = cards[idx];
      qDiv.textContent = question;
      aDiv.textContent = answer;
      aDiv.style.display = 'none';
      flipBtn.textContent = 'Show Answer';
      nextBtn.disabled = true;
      prog.textContent = `Card ${idx+1} of ${cards.length}`;
    }
  
    // 3) Hook up flip
    flipBtn.addEventListener('click', () => {
      const showing = aDiv.style.display === 'block';
      if (showing) {
        aDiv.style.display = 'none';
        flipBtn.textContent = 'Show Answer';
        nextBtn.disabled = false;
      } else {
        aDiv.style.display = 'block';
        flipBtn.textContent = 'Hide Answer';
        nextBtn.disabled = false;
      }
    });
  
    // 4) Hook up next
    nextBtn.addEventListener('click', () => {
      if (idx < cards.length - 1) {
        idx += 1;
        render();
      } else {
        // End of deck: go back to home or disable
        nextBtn.disabled = true;
        flipBtn.disabled = true;
        prog.textContent = 'Done!';
      }
    });
  
    // 5) Initial draw
    render();
  });
  
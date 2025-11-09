// Değişkenler
let playerScore = 0;
let computerScore = 0;
let playerName = '';
let currentRound = 1;
let bestScore = localStorage.getItem('bestScore') || 0;
const maxRounds = 5;
let difficulty = 'easy'; // Varsayılan zorluk
let playerHistory = []; // Oyuncunun önceki seçimlerini takip etmek için (Zor mod için)

// Fonksiyon: Bilgisayarın seçimi (zorluk seviyesine göre)
function getComputerChoice(playerChoice) {
    const choices = ['Taş', 'Kağıt', 'Makas'];
    let computerChoice;

    if (difficulty === 'easy') {
        // Kolay: Tam rastgele
        computerChoice = choices[Math.floor(Math.random() * 3)];
    } else if (difficulty === 'medium') {
        // Orta: Kazanma olasılığını artır (%60 kazanma şansı)
        const random = Math.random();
        if (random < 0.6) {
            // Kazanma yönünde seçim yap
            if (playerChoice === 'Taş') computerChoice = 'Kağıt';
            else if (playerChoice === 'Kağıt') computerChoice = 'Makas';
            else computerChoice = 'Taş';
        } else {
            computerChoice = choices[Math.floor(Math.random() * 3)];
        }
    } else if (difficulty === 'hard') {
        // Zor: Basit AI - Oyuncunun son seçimine göre
        const lastPlayerChoice = playerHistory[playerHistory.length - 1];
        if (lastPlayerChoice === 'Taş') computerChoice = 'Kağıt'; // Taş'ı yener
        else if (lastPlayerChoice === 'Kağıt') computerChoice = 'Makas'; // Kağıt'ı yener
        else if (lastPlayerChoice === 'Makas') computerChoice = 'Taş'; // Makas'ı yener
        else computerChoice = choices[Math.floor(Math.random() * 3)]; // İlk tur için rastgele
    }

    return computerChoice;
}

// Fonksiyon: Oyunu oynama
function playGame(playerChoice) {
    if (currentRound > maxRounds) {
        alert('Oyun bitti! Yeniden başla.');
        return;
    }

    // Oyuncunun seçimini geçmişe ekle (Zor mod için)
    playerHistory.push(playerChoice);
    if (playerHistory.length > 5) playerHistory.shift(); // Son 5'i tut

    const computerChoice = getComputerChoice(playerChoice);
    let result = '';

    // Koşullar: Kazanma/kaybetme mantığı
    if (playerChoice === computerChoice) {
        result = 'Berabere!';
    } else if (
        (playerChoice === 'Taş' && computerChoice === 'Makas') ||
        (playerChoice === 'Kağıt' && computerChoice === 'Taş') ||
        (playerChoice === 'Makas' && computerChoice === 'Kağıt')
    ) {
        result = 'Kazandın!';
        playerScore++;
    } else {
        result = 'Kaybettin!';
        computerScore++;
    }

    // Sonuçları güncelle
    document.getElementById('player-choice').textContent = `Senin seçimin: ${playerChoice}`;
    document.getElementById('computer-choice').textContent = `Bilgisayarın seçimi: ${computerChoice}`;
    document.getElementById('game-result').textContent = `Sonuç: ${result}`;
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;

    // Tur güncellemesi
    currentRound++;
    document.getElementById('current-round').textContent = currentRound;

    // Oyun bitişi kontrolü
    if (currentRound > maxRounds) {
        if (playerScore > bestScore) {
            bestScore = playerScore;
            localStorage.setItem('bestScore', bestScore);
            document.getElementById('best-score').textContent = bestScore;
            alert(`${playerName}, yeni rekor! En iyi skor: ${bestScore}`);
        } else {
            alert(`Oyun bitti, ${playerName}! Skorun: ${playerScore}`);
        }
    }
}

// Başlangıç ekranı ve oyun başlatma
document.getElementById('start-game').addEventListener('click', () => {
    playerName = document.getElementById('player-name').value.trim();
    difficulty = document.getElementById('difficulty').value; // Zorluk seviyesini al
    if (!playerName) {
        alert('Lütfen adınızı girin!');
        return;
    }
    document.querySelector('.start-screen').style.display = 'none';
    document.querySelector('.game-screen').style.display = 'block';
    document.getElementById('best-score').textContent = bestScore;
});

// Butonlara olay dinleyicisi ekleme
document.getElementById('rock').addEventListener('click', () => playGame('Taş'));
document.getElementById('paper').addEventListener('click', () => playGame('Kağıt'));
document.getElementById('scissors').addEventListener('click', () => playGame('Makas'));

// Yeniden Başla butonu
document.getElementById('reset-game').addEventListener('click', () => {
    playerScore = 0;
    computerScore = 0;
    currentRound = 1;
    playerHistory = []; // Geçmişi sıfırla
    document.getElementById('player-score').textContent = 0;
    document.getElementById('computer-score').textContent = 0;
    document.getElementById('current-round').textContent = 1;
    document.getElementById('player-choice').textContent = 'Senin seçimin: ';
    document.getElementById('computer-choice').textContent = 'Bilgisayarın seçimi: ';
    document.getElementById('game-result').textContent = 'Sonuç: ';
    document.querySelector('.start-screen').style.display = 'block';
    document.querySelector('.game-screen').style.display = 'none';
});
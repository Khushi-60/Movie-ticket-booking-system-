 // Sample data
const movies = [
    { id: 1, title: "Avengers: Endgame", genre: "Action, Adventure", poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg" },
    { id: 2, title: "Spider-Man: No Way Home", genre: "Action, Adventure", poster: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_FMjpg_UX1000_.jpg" },
    { id: 3, title: "The Batman", genre: "Action, Crime", poster: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg" },
    { id: 4, title: "Dune", genre: "Sci-Fi, Adventure", poster: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg" },
    { id: 5, title: "No Time to Die", genre: "Action, Thriller", poster: "https://m.media-amazon.com/images/M/MV5BYWQ2NzQ1NjktMzNkNS00MGY1LTgwMmMtYTllYTI5YzNmMmE0XkEyXkFqcGdeQXVyMjM4NTM5NDY@._V1_.jpg" },
    { id: 6, title: "Shang-Chi", genre: "Action, Fantasy", poster: "https://m.media-amazon.com/images/M/MV5BNTliYjlkNDQtMjFlNS00NjgzLWFmMWEtYmM2Mzc2Zjg3ZjEyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg" },
    { id: 7, title: "Black Widow", genre: "Action, Adventure", poster: "https://m.media-amazon.com/images/M/MV5BNjRmNDI5MjMtMmFhZi00YzcwLWI4ZGItMGI2MjI0N2Q3YmIwXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg" },
    { id: 8, title: "Eternals", genre: "Action, Fantasy", poster: "https://m.media-amazon.com/images/M/MV5BMTExZmVjY2ItYTAzYi00MDdlLWFlOWItNTJhMDRjMzQ5ZGY0XkEyXkFqcGdeQXVyODIyOTEyMzY@._V1_.jpg" },
    { id: 9, title: "Doctor Strange 2", genre: "Action, Fantasy", poster: "https://m.media-amazon.com/images/M/MV5BNWM0ZGJlMzMtZmYwMi00NzI3LTgzMzMtNjMzNjliNDRmZmFlXkEyXkFqcGdeQXVyMTM1MTE1NDMx._V1_.jpg" },
    { id: 10, title: "Top Gun: Maverick", genre: "Action, Drama", poster: "https://m.media-amazon.com/images/M/MV5BZWYzOGEwNTgtNWU3NS00ZTQ0LWJkODUtMmVhMjIwMjA1ZmQwXkEyXkFqcGdeQXVyMjkwOTAyMDU@._V1_.jpg" }
];

const showtimes = [
    "10.30" ,"13.00","16.00","19.00","21.30" ];

// Booking data
let bookingData = {
    movie: null,
    showtime: null,
    seats: [], // Now stores objects with seat number and type
    paymentMethod: null,
    total: 0,
    user: {
        name: "Guest User",
        email: "guest@example.com",
        balance: 0,
        isLoggedIn: false
    }
};

// Seat prices
const SEAT_PRICES = {
    regular: 300,
    vip: 400,
    recliner: 500
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadMovies();
    updateAccountDisplay();
});

// Load movies into the grid
function loadMovies() {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-genre">${movie.genre}</div>
            </div>
        `;
        movieCard.addEventListener('click', () => selectMovie(movie));
        movieGrid.appendChild(movieCard);
    });
}

// Select a movie
function selectMovie(movie) {
    bookingData.movie = movie;
    document.getElementById('summaryMovie').textContent = movie.title;
    updateTotal();
    
    // Remove active class from all movie cards
    document.querySelectorAll('.movie-card').forEach(card => {
        card.style.border = '1px solid #e0e0e0';
    });
    
    // Add active class to selected movie
    event.currentTarget.style.border = `2px solid var(--primary)`;
}

// Load showtimes
function loadShowtimes() {
    const showtimeGrid = document.getElementById('showtimeGrid');
    showtimeGrid.innerHTML = '';
    
    showtimes.forEach(time => {
        const showtimeBtn = document.createElement('button');
        showtimeBtn.className = 'showtime-btn';
        showtimeBtn.textContent = time;
        showtimeBtn.addEventListener('click', () => selectShowtime(time));
        showtimeGrid.appendChild(showtimeBtn);
    });
}

// Select a showtime
function selectShowtime(time) {
    bookingData.showtime = time;
    document.getElementById('summaryShowtime').textContent = time;
    updateTotal();
    
    // Remove selected class from all showtime buttons
    document.querySelectorAll('.showtime-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked showtime
    event.currentTarget.classList.add('selected');
}

// Load seat map
function loadSeatMap() {
    const seatMap = document.getElementById('seatMap');
    seatMap.innerHTML = '';
    
    // Generate 50 seats (5 rows x 10 seats)
    for (let i = 1; i <= 20; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';
        seat.textContent = i;
        
        // Assign seat types (for demo)
        let seatType = 'regular';
        if (i >=11 && i<=15) {
            seatType = 'vip';
            seat.classList.add('vip');
        } else if (i >=16) {
            seatType = 'recliner';
            seat.classList.add('recliner');
        }
        
        // Randomly mark some seats as occupied (for demo)
        if (Math.random() < 0.2) {
            seat.classList.add('occupied');
        } else {
            seat.addEventListener('click', () => toggleSeatSelection(seat, i, seatType));
        }
        
        seatMap.appendChild(seat);
    }
}

// Toggle seat selection
function toggleSeatSelection(seat, seatNumber, seatType) {
    seat.classList.toggle('selected');
    
    if (seat.classList.contains('selected')) {
        // Add seat to selection
        bookingData.seats.push({
            number: seatNumber,
            type: seatType,
            price: SEAT_PRICES[seatType]
        });
    } else {
        // Remove seat from selection
        bookingData.seats = bookingData.seats.filter(s => s.number !== seatNumber);
    }
    
    // Update display
    updateSeatsDisplay();
    updateTotal();
}

// Helper function to update seats display
function updateSeatsDisplay() {
    const seatsText = bookingData.seats.map(s => `${s.number} (${s.type})`).join(', ');
    document.getElementById('summarySeats').textContent = seatsText || 'Not selected';
}

// Update the total calculation
function updateTotal() {
    bookingData.total = bookingData.seats.reduce((sum, seat) => sum + seat.price, 0);
    
    // Update summary display
    document.getElementById('summaryPrice').textContent = 
        bookingData.seats.map(s => `₹${s.price}`).join(' + ') || '₹0';
    document.getElementById('summaryTotal').textContent = `Total: ₹${bookingData.total}`;
    
    // Also update confirmation display if we're on that step
    if (document.getElementById('step5').classList.contains('active')) {
        document.getElementById('confSeats').textContent = 
            bookingData.seats.map(s => `${s.number} (${s.type} - ₹${s.price})`).join(', ');
        document.getElementById('confTotal').textContent = `Total Paid: ₹${bookingData.total}`;
    }
}

// Update account display
function updateAccountDisplay() {
    document.getElementById('accountName').textContent = bookingData.user.name;
    document.getElementById('accountEmail').textContent = bookingData.user.email;
    document.getElementById('accountBalance').textContent = `₹${bookingData.user.balance}`;
    document.getElementById('walletOption').textContent = `Wallet (₹${bookingData.user.balance})`;
    document.getElementById('loginText').textContent = bookingData.user.isLoggedIn ? 'Logout' : 'Login';
}

// Toggle login/logout
function toggleLogin() {
    if (bookingData.user.isLoggedIn) {
        // Logout
        bookingData.user = {
            name: "Guest User",
            email: "guest@example.com",
            balance: 0,
            isLoggedIn: false
        };
    } else {
        // Login (simulated)
        bookingData.user = {
            name: "John Doe",
            email: "john.doe@example.com",
            balance: 1500,
            isLoggedIn: true
        };
    }
    updateAccountDisplay();
}

// Select payment method
function selectPayment(method) {
    bookingData.paymentMethod = method;
    
    // Remove selected class from all payment cards
    document.querySelectorAll('.payment-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked payment card
    event.currentTarget.classList.add('selected');
    
    // Show credit card form if credit/debit selected
    if (method === 'credit' || method === 'debit') {
        document.getElementById('creditCardForm').style.display = 'block';
    } else {
        document.getElementById('creditCardForm').style.display = 'none';
    }
}

// Process payment
function processPayment() {
    if (!bookingData.paymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    // Check wallet balance if using wallet
    if (bookingData.paymentMethod === 'wallet' && bookingData.user.balance < bookingData.total) {
        alert('Insufficient wallet balance');
        return;
    }
    
    if ((bookingData.paymentMethod === 'credit' || bookingData.paymentMethod === 'debit') && 
        (!document.getElementById('cardNumber').value || 
         !document.getElementById('expiryDate').value || 
         !document.getElementById('cvv').value || 
         !document.getElementById('cardName').value)) {
        alert('Please fill all card details');
        return;
    }
    
    // Process payment
    if (bookingData.paymentMethod === 'wallet') {
        bookingData.user.balance -= bookingData.total;
        updateAccountDisplay();
    }
    
    // Generate random booking ID
    const bookingId = 'BMS' + Math.floor(100000 + Math.random() * 900000);
    
    // Update confirmation page
    document.getElementById('confMovie').textContent = bookingData.movie.title;
    document.getElementById('confShowtime').textContent = bookingData.showtime;
    document.getElementById('confSeats').textContent = 
        bookingData.seats.map(s => `${s.number} (${s.type} - ₹${s.price})`).join(', ');
    document.getElementById('confBookingId').textContent = bookingId;
    document.getElementById('confTotal').textContent = `Total Paid: ₹${bookingData.total}`;
    
    // Log booking data
    console.log('Booking data:', {
        ...bookingData,
        bookingId,
        paymentDetails: bookingData.paymentMethod === 'credit' || bookingData.paymentMethod === 'debit' ? {
            cardLast4: document.getElementById('cardNumber').value.slice(-4),
            cardType: bookingData.paymentMethod
        } : {
            method: bookingData.paymentMethod
        },
        bookingDate: new Date().toISOString()
    });
    
    // Move to confirmation step
    nextStep(4);
}

// Navigation functions
function nextStep(currentStep) {
    // Validate current step before proceeding
    if (currentStep === 1 && !bookingData.movie) {
        alert('Please select a movie');
        return;
    }
    
    if (currentStep === 2 && !bookingData.showtime) {
        alert('Please select a showtime');
        return;
    }
    
    if (currentStep === 3 && bookingData.seats.length === 0) {
        alert('Please select at least one seat');
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Show next step
    const nextStep = currentStep + 1;
    document.getElementById(`step${nextStep}`).classList.add('active');
    
    // Load data for next step if needed
    if (nextStep === 2) loadShowtimes();
    if (nextStep === 3) loadSeatMap();
}

function prevStep(currentStep) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Show previous step
    const prevStep = currentStep - 1;
    document.getElementById(`step${prevStep}`).classList.add('active');
}
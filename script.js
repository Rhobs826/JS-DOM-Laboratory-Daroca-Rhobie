const hotelsData = [
    { id: 1, name: "Amboy Hometel", location: "Basco", pricePerNight: 2800, imageIcon: "🏢", imageUrl: "amboy.jpg", rating: 4.5, reviews: 120, description: "Cozy hometel with scenic views.", roomsLeft: 2 },
    { id: 2, name: "Villa Ferrer", location: "Mahatao", pricePerNight: 1500, imageIcon: "🏠", imageUrl: "villa ferrer.jpg", rating: 4.2, reviews: 85, description: "Affordable stay near town center.", roomsLeft: 5 },
    { id: 3, name: "Fundacion Pacita", location: "Basco", pricePerNight: 9500, imageIcon: "🏰", imageUrl: "Fundacion Pacita.jpg", rating: 4.9, reviews: 340, description: "Luxury nature lodge on a hilltop.", roomsLeft: 1 },
    { id: 4, name: "Batanes Seaside Lodge", location: "Basco", pricePerNight: 3500, imageIcon: "⛱️", imageUrl: "Seaside.webp", rating: 4.6, reviews: 210, description: "Beachfront resort with family rooms.", roomsLeft: 3 },
    { id: 5, name: "Vatan Inn", location: "Mahatao", pricePerNight: 1800, imageIcon: "🏠", imageUrl: "vatan inn.jpg", rating: 4.0, reviews: 50, description: "Quiet and peaceful inn for relaxing.", roomsLeft: 4 }
];

const state = {
    selectedLocation: "All",
    checkInDate: null,
    checkOutDate: null,
    totalNights: 0
};

const hotelGrid = document.getElementById("hotel-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");
const summaryText = document.getElementById("total-nights-summary");
const errorText = document.getElementById("date-error");

function init() {
    if (!hotelGrid || !filterButtons || !checkinInput || !checkoutInput || !summaryText || !errorText) {
        console.error("DOM initialization failed: required elements are missing.");
        return;
    }

    renderHotels(hotelsData);
    setupEventListeners();
}

function setupEventListeners() {
    filterButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const target = event.currentTarget;
            if (!target) return;

            filterButtons.forEach(btn => btn.classList.remove("active"));
            target.classList.add("active");

            state.selectedLocation = target.dataset.location || "All";
            filterAndRenderHotels();
        });
    });

    checkinInput.addEventListener("change", (e) => {
        state.checkInDate = e.target.value;

        if (e.target.value) {
            const checkinDate = new Date(e.target.value);
            checkinDate.setDate(checkinDate.getDate() + 1);
            const minCheckout = checkinDate.toISOString().split("T")[0];
            checkoutInput.min = minCheckout;

            if (state.checkOutDate && state.checkOutDate <= minCheckout) {
                state.checkOutDate = null;
                checkoutInput.value = "";
            }
        } else {
            checkoutInput.min = "";
        }

        calculateStay();
    });

    checkoutInput.addEventListener("change", (e) => {
        state.checkOutDate = e.target.value;
        calculateStay();
    });
}

function filterAndRenderHotels() {
    let filtered = state.selectedLocation === "All"
        ? hotelsData
        : hotelsData.filter(h => h.location === state.selectedLocation);

    renderHotels(filtered);
}

function renderHotels(hotels) {
    hotelGrid.innerHTML = "";

    if (hotels.length === 0) {
        hotelGrid.innerHTML = "<p>No hotels found.</p>";
        return;
    }

    hotels.forEach((hotel, index) => {
        const card = document.createElement("div");
        card.className = "hotel-card fade-in";
        card.style.animationDelay = `${index * 0.1}s`;

        const formattedPrice = hotel.pricePerNight.toLocaleString();
        
        let totalPriceHtml = "";
        if (state.totalNights > 0) {
            const total = (hotel.pricePerNight * state.totalNights).toLocaleString();
            totalPriceHtml = `<div class="hotel-total-price">Total for ${state.totalNights} night(s): <strong>₱${total}</strong></div>`;
        }

        card.innerHTML = `
            <div class="hotel-image" style="background-image: url('${hotel.imageUrl}');">
                <span class="hotel-image-icon">${hotel.imageIcon}</span>
            </div>
            <div class="hotel-info">
                <div class="hotel-header">
                    <h3 class="hotel-name">${hotel.name}</h3>
                    <span class="hotel-rating">⭐ ${hotel.rating} <span class="reviews">(${hotel.reviews})</span></span>
                </div>
                <div class="hotel-location">📍 ${hotel.location}, Batanes</div>
                <p class="hotel-description">${hotel.description}</p>
                <div class="hotel-availability">🔥 Only ${hotel.roomsLeft} rooms left!</div>
                <div class="hotel-price-tag">
                    <span class="price-val">₱${formattedPrice}</span> <span class="per-night">/ night</span>
                </div>
                ${totalPriceHtml}
                <button class="book-btn">Book Now</button>
            </div>
        `;

        const bookBtn = card.querySelector(".book-btn");
        bookBtn.addEventListener("click", () => {
            if (state.totalNights > 0) {
                alert(`Redirecting to booking system for ${hotel.name}...`);
            } else {
                alert(`Please select valid check-in and check-out dates to book ${hotel.name}.`);
            }
        });

        hotelGrid.appendChild(card);
    });
}

function calculateStay() {
    if (!state.checkInDate || !state.checkOutDate) {
        state.totalNights = 0;
        filterAndRenderHotels();
        summaryText.textContent = "Select dates to calculate your stay.";
        errorText.classList.add("hidden");
        summaryText.classList.remove("hidden");
        return;
    }

    const inDate = new Date(state.checkInDate);
    const outDate = new Date(state.checkOutDate);

    if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime()) || outDate <= inDate) {
        errorText.classList.remove("hidden");
        summaryText.classList.add("hidden");
        state.totalNights = 0;
        filterAndRenderHotels();
        return;
    }

    errorText.classList.add("hidden");
    summaryText.classList.remove("hidden");

    state.totalNights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
    summaryText.textContent = `Total stay: ${state.totalNights} night${state.totalNights > 1 ? "s" : ""}`;
    filterAndRenderHotels();
}

document.addEventListener("DOMContentLoaded", init);
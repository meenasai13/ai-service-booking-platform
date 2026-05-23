async function registerUser() {

    const name = document.getElementById('name').value;

    const email = document.getElementById('email').value;

    const password = document.getElementById('password').value;

    const response = await fetch(
        'http://127.0.0.1:5000/register',
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        }
    );

    const data = await response.json();

    alert(data.message);
}

//
// LOGIN USER
//
async function loginUser() {

    const email =
        document.getElementById('loginEmail').value;

    const password =
        document.getElementById('loginPassword').value;

    const response = await fetch(
        'http://127.0.0.1:5000/login',
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    );

    const data = await response.json();

    document.getElementById('output').innerHTML =
        `<h3>${data.message}</h3>`;
}

//
// GET PROVIDERS
//
async function getProviders() {

    hideAllSections();

    document.getElementById('providersSection').style.display =
        'block';

    const response = await fetch(
        'http://127.0.0.1:5000/providers'
    );

    const data = await response.json();

    console.log(data);

    let output = "<h2>Providers</h2>";

    // HANDLE ERRORS
    if (data.error) {

        output += `<h3>${data.error}</h3>`;

    } else {

        data.forEach(provider => {

            output += `

            <div class="provider-card">

                <img src="images/${provider[2].toLowerCase()}.jpg">

                <div>

                    <h3>${provider[1]}</h3>

                    <p>
                        <b>Service:</b>
                        ${provider[2]}
                    </p>

                    <p>
                        <b>Location:</b>
                        ${provider[3]}
                    </p>

                    <p>
                        <b>Rating:</b>
                        ${provider[4]}
                    </p>

                    <button onclick="bookProvider(${provider[0]})">
                        Book Now
                    </button>

                </div>

            </div>

            `;
        });
    }

    document.getElementById('output').innerHTML =
        output;
}

//
// AI RECOMMENDATION
//
async function getRecommendation() {

    const response = await fetch(
        'http://127.0.0.1:5000/recommend',
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                rating: 4.7,
                experience: 4,
                bookings: 100
            })
        }
    );

    const data = await response.json();

    let output = "<h2>Recommended Providers</h2>";

    if (data.error) {

        output += `<h3>${data.error}</h3>`;

    } else {

        data.recommended_providers.forEach(provider => {

            output += `
                <p>${provider}</p>
            `;
        });
    }

    document.getElementById('output').innerHTML =
        output;
}

//
// BOOK PROVIDER
//
async function bookProvider(providerId) {

    const response = await fetch(
        'http://127.0.0.1:5000/book',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                user_id: 1,
                provider_id: providerId,
                booking_date: "2026-05-20"
            })
        }
    );

    const data = await response.json();

    alert(data.message);

    getBookings();
}

//
// VIEW BOOKINGS
//
async function getBookings() {

    hideAllSections();

    document.getElementById('bookingsSection').style.display =
        'block';

    const response = await fetch(
        'http://127.0.0.1:5000/bookings'
    );

    const data = await response.json();

    let output = "<h2>Booking History</h2>";

    if (data.error) {

        output += `<h3>${data.error}</h3>`;

    } else {

        data.forEach(booking => {

            output += `

            <div class="provider-card">

                <div>

                    <h3>
                        Booking ID:
                        ${booking[0]}
                    </h3>

                    <p>
                        <b>User ID:</b>
                        ${booking[1]}
                    </p>

                    <p>
                        <b>Provider ID:</b>
                        ${booking[2]}
                    </p>

                    <p>
                        <b>Date:</b>
                        ${booking[3]}
                    </p>

                    <p>
                        <b>Status:</b>
                        ${booking[4]}
                    </p>

                    <button onclick="cancelBooking(${booking[0]})">
                        Cancel Booking
                    </button>

                </div>

            </div>

            `;
        });
    }

    document.getElementById('bookings').innerHTML =
        output;
}

//
// CANCEL BOOKING
//
async function cancelBooking(id) {

    const response = await fetch(
        `http://127.0.0.1:5000/cancel/${id}`,
        {
            method: 'DELETE'
        }
    );

    const data = await response.json();

    alert(data.message);

    getBookings();
}

//
// SHOW CHATBOT
//
function showChatbot() {

    hideAllSections();

    document.getElementById('chatbot').style.display =
        'block';
}

//
// SEND CHAT MESSAGE
//
async function sendMessage() {

    const message =
        document.getElementById('userMessage').value;

    const response = await fetch(
        'http://127.0.0.1:5000/chat',
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                message: message
            })
        }
    );

    const data = await response.json();

    document.getElementById('chatOutput').innerHTML =
        `
        <p>
            <b>Bot:</b>
            ${data.reply}
        </p>
        `;
}

//
// SHOW DASHBOARD
//
async function showDashboard() {

    hideAllSections();

    document.getElementById('dashboard').style.display =
        'block';

    const response = await fetch(
        'http://127.0.0.1:5000/bookings'
    );

    const bookings = await response.json();

    let totalBookings = 0;

    if (!bookings.error) {
        totalBookings = bookings.length;
    }

    let output = `

        <div class="dashboard-card">

            <h3>Total Bookings</h3>

            <p>${totalBookings}</p>

        </div>

        <div class="dashboard-card">

            <h3>AI Feature</h3>

            <p>
                Smart Provider Recommendation Enabled
            </p>

        </div>

        <div class="dashboard-card">

            <h3>Status</h3>

            <p>System Running Successfully</p>

        </div>
    `;

    document.getElementById('dashboardContent').innerHTML =
        output;
}

//
// HIDE ALL SECTIONS
//
function hideAllSections() {

    document.getElementById('providersSection').style.display =
        'none';

    document.getElementById('bookingsSection').style.display =
        'none';

    document.getElementById('chatbot').style.display =
        'none';

    document.getElementById('dashboard').style.display =
        'none';
}
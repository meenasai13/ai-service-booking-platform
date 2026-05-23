from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# DATABASE CONNECTION FUNCTION
def get_db_connection():

    return mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="root",
        database="service_booking",
        auth_plugin='mysql_native_password'
    )

# LOAD ML MODEL
model = joblib.load('../ml/provider_model.pkl')

# HOME ROUTE
@app.route('/')
def home():
    return "Backend Running Successfully"

# REGISTER API
@app.route('/register', methods=['POST'])
def register():

    try:

        db = get_db_connection()
        cursor = db.cursor()

        data = request.json

        name = data['name']
        email = data['email']
        password = data['password']

        query = """
        INSERT INTO users(name, email, password)
        VALUES(%s, %s, %s)
        """

        values = (name, email, password)

        cursor.execute(query, values)

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "User Registered Successfully"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# LOGIN API
@app.route('/login', methods=['POST'])
def login():

    try:

        db = get_db_connection()

        cursor = db.cursor(buffered=True)

        data = request.json

        email = data.get('email')
        password = data.get('password')

        query = """
        SELECT * FROM users
        WHERE email=%s AND password=%s
        """

        values = (email, password)

        cursor.execute(query, values)

        user = cursor.fetchone()

        cursor.close()
        db.close()

        if user:

            return jsonify({
                "message": "Login Successful"
            })

        else:

            return jsonify({
                "message": "Invalid Email or Password"
            })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })
# GET PROVIDERS API
@app.route('/providers', methods=['GET'])
def get_providers():

    try:

        db = get_db_connection()
        cursor = db.cursor()

        query = "SELECT * FROM providers"

        cursor.execute(query)

        providers = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(providers)

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# BOOK PROVIDER API
@app.route('/book', methods=['POST'])
def book_provider():

    try:

        db = get_db_connection()
        cursor = db.cursor()

        data = request.json

        user_id = data['user_id']
        provider_id = data['provider_id']
        booking_date = data['booking_date']

        status = "Booked"

        query = """
        INSERT INTO bookings(user_id, provider_id, booking_date, status)
        VALUES(%s, %s, %s, %s)
        """

        values = (
            user_id,
            provider_id,
            booking_date,
            status
        )

        cursor.execute(query, values)

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "Provider Booked Successfully"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# VIEW BOOKINGS API
@app.route('/bookings', methods=['GET'])
def get_bookings():

    try:

        db = get_db_connection()
        cursor = db.cursor()

        query = "SELECT * FROM bookings"

        cursor.execute(query)

        bookings = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(bookings)

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# AI RECOMMENDATION API
@app.route('/recommend', methods=['POST'])
def recommend():

    try:

        data = request.json

        rating = data['rating']
        experience = data['experience']
        bookings = data['bookings']

        input_data = pd.DataFrame([[
            rating,
            experience,
            bookings
        ]], columns=[
            'rating',
            'experience',
            'bookings'
        ])

        distances, indices = model.kneighbors(input_data)

        provider_names = [
            'Ravi',
            'Suresh',
            'Anil'
        ]

        recommended = []

        for i in indices[0]:
            recommended.append(provider_names[i])

        return jsonify({
            "recommended_providers": recommended
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# AI CHATBOT API
@app.route('/chat', methods=['POST'])
def chat():

    try:

        data = request.json

        message = data['message'].lower()

        if "electrician" in message:
            reply = "Ravi is the best electrician."

        elif "plumber" in message:
            reply = "Suresh is a good plumber."

        elif "cleaner" in message:
            reply = "Anil is available for cleaning."

        else:
            reply = "Please ask about electrician, plumber, or cleaner."

        return jsonify({
            "reply": reply
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# CANCEL BOOKING API
@app.route('/cancel/<int:id>', methods=['DELETE'])
def cancel_booking(id):

    try:

        db = get_db_connection()
        cursor = db.cursor()

        query = "DELETE FROM bookings WHERE id=%s"

        values = (id,)

        cursor.execute(query, values)

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "message": "Booking Cancelled Successfully"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        })

# RUN APP
if __name__ == '__main__':
    app.run(debug=True)
import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="service_booking"
)

print("Database Connected Successfully")
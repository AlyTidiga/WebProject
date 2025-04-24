import sqlite3
from werkzeug.security import generate_password_hash

# Connect to the database (creates users.db if it doesn't exist)
conn = sqlite3.connect('users.db')
cursor = conn.cursor()

# Create the users table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
    )
''')

# Insert a test user (admin@example.com/admin/password123)
username = 'admin'
email = 'admin@example.com'
password = 'password123'
password_hash = generate_password_hash(password)

cursor.execute('''
    INSERT OR IGNORE INTO users (username, email, password_hash)
    VALUES (?, ?, ?)
''', (username, email, password_hash))

# Commit and close
conn.commit()
conn.close()

print("Database initialized with test user admin@example.com/admin/password123")
from flask import Flask, request, render_template, redirect, url_for, session
import sqlite3
from werkzeug.security import check_password_hash, generate_password_hash
import pickle
import pandas as pd
import numpy as np

# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'a1b2c3d4e5f6g7h8i9j0k1l2'  # Secure secret key

# Function to connect to the database
def get_db_connection():
    conn = sqlite3.connect('users.db', timeout=10)  # Set timeout to 10 seconds
    conn.row_factory = sqlite3.Row
    return conn

# Load model, scaler, and feature names
with open('rf_model.pkl', 'rb') as file:
    model = pickle.load(file)

with open('scaler.pkl', 'rb') as file:
    scaler = pickle.load(file)

with open('feature_names.pkl', 'rb') as file:
    feature_names = pickle.load(file)

# Middleware to check if user is logged in
def login_required(f):
    def wrapper(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

# Route for the welcome page
@app.route('/', methods=['GET'])
def welcome():
    return render_template('welcome.html')

# Route for the registration page
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        # Validate input
        if not username or not email or not password:
            return render_template('register.html', error='Tous les champs sont requis.')

        # Connect to the database
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Check if username or email already exists
            cursor.execute('SELECT * FROM users WHERE username = ? OR email = ?', (username, email))
            existing_user = cursor.fetchone()

            if existing_user:
                return render_template('register.html', error='Nom d\'utilisateur ou email déjà existant.')

            # Hash the password and insert the new user
            password_hash = generate_password_hash(password)
            cursor.execute('''
                INSERT INTO users (username, email, password_hash)
                VALUES (?, ?, ?)
            ''', (username, email, password_hash))
            conn.commit()
        except sqlite3.OperationalError as e:
            conn.rollback()
            return render_template('register.html', error=f'Erreur de base de données : {str(e)}')
        finally:
            cursor.close()
            conn.close()  # Ensure connection is closed

        return redirect(url_for('login'))

    return render_template('register.html')

# Route for the login page
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        # Connect to the database
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
            user = cursor.fetchone()

            # Verify credentials
            if user and check_password_hash(user['password_hash'], password):
                session['logged_in'] = True
                session['username'] = username
                return redirect(url_for('predict_form'))
            else:
                return render_template('login.html', error='Nom d\'utilisateur ou mot de passe invalide.')
        except sqlite3.OperationalError as e:
            return render_template('login.html', error=f'Erreur de base de données : {str(e)}')
        finally:
            cursor.close()
            conn.close()  # Ensure connection is closed

    return render_template('login.html')

# Route for the prediction form
@app.route('/predict_form', methods=['GET'])
@login_required
def predict_form():
    return render_template('index.html')

# Route for predictions
@app.route('/predict', methods=['POST'])
@login_required
def predict():
    try:
        # Retrieve form data
        input_data = {
            'Age': float(request.form['Age']),
            'Academic Pressure': float(request.form['Academic Pressure']),
            'Work Pressure': float(request.form['Work Pressure']),
            'CGPA': float(request.form['CGPA']),
            'Study Satisfaction': float(request.form['Study Satisfaction']),
            'Job Satisfaction': float(request.form['Job Satisfaction']),
            'Sleep Duration': float(request.form['Sleep Duration']),
            'Work/Study Hours': float(request.form['Work/Study Hours']),
            'Total Pressure': float(request.form['Academic Pressure']) + float(request.form['Work Pressure'])
        }

        # Convert data to DataFrame
        input_df = pd.DataFrame([input_data])

        # Ensure all expected columns are present
        for col in feature_names:
            if col not in input_df.columns:
                input_df[col] = 0

        # Reorder columns to match training order
        input_df = input_df[feature_names]

        # Standardize numerical features
        num_feats = ['Age', 'Academic Pressure', 'Work Pressure', 'CGPA',
                     'Study Satisfaction', 'Job Satisfaction', 'Sleep Duration',
                     'Work/Study Hours', 'Total Pressure']
        input_df[num_feats] = scaler.transform(input_df[num_feats])

        # Make prediction
        prediction = model.predict(input_df)[0]
        prediction_proba = model.predict_proba(input_df)[0][1]

        # Convert prediction to readable text
        result = 'Déprimé' if prediction == 1 else 'Non déprimé'

        return render_template('index.html', prediction=result, probability=round(prediction_proba * 100, 2))

    except Exception as e:
        return render_template('index.html', prediction=f"Erreur : {str(e)}")

# Route for logout
@app.route('/logout', methods=['GET'])
@login_required
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    return redirect(url_for('welcome'))

if __name__ == '__main__':
    app.run(debug=True)
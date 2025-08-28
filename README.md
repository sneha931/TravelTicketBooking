

This project is a full-stack web application built with:

Frontend: React (Vite)

Backend: Django REST Framework (DRF)

Containerization: Docker & Docker Compose


Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

2. Backend Setup (Django)

Make sure your requirements.txt contains:

Django>=4.0
djangorestframework
django-cors-headers


Run migrations and create a superuser:

python manage.py migrate
python manage.py createsuperuser

Then cd myworld/travels
python manage.py runserver


3. Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev

4. Docker Setup
Build and Run with Docker Compose

Make sure you have Docker and Docker Compose installed.

docker-compose up --build
# MMM - Make My Meal

## Overview

MMM (Make My Meal) is a dynamic web application designed for ordering and delivering food from restaurants.
The application caters to multiple user roles including Administrators, Restaurant Administrators, Delivery Personnel, and Customers, each with specific functionalities.

## Features

### Administrator
- **CRUD Operations:** Manage (create, read, update, delete) restaurants.
- **User Management:** Create and manage restaurant administrator accounts.
- **Lookup Tables:** CRUD operations for lookup tables (food types, restaurant types, etc.).
- **Data Overview:** View data on all restaurants, offers, and orders.

### Restaurant Administrator
- **Menu Management:** Administer individual menu items including details, images, prices, and promotions.
- **Delivery Management:** Create invoices for delivery personnel.
- **Order Management:** Approve orders and assign them to delivery personnel.
- **Restaurant Details:** Edit restaurant data such as delivery distance.

### Delivery Personnel
- **Order Overview:** View all orders scheduled for delivery on a given day.
- **Order Details:** Access order data, status, price, and other relevant information.
- **Order Status Updates:** Communicate order delivery status to administrators.
- **Single Restaurant Assignment:** Each delivery personnel works for a single restaurant.

### Customer
- **User Registration:** Register with name, surname, address, and email. Address can be entered via map or as latitude-longitude pair.
- **Restaurant Search:** View restaurants within delivery range, search by name and item type.
- **Offers and Recommendations:** Access special offers and recommendations.
- **Order Creation:** Place orders specifying quantity, payment method, and other details. Receive an email confirmation upon successful order creation.
- **Delivery Time:** Specify preferred delivery time or use the creation time as the minimum delivery time.
- **Order History:** View all past orders.

## Additional Features

- **Chat:** Communication with the main administrator or restaurant administrator.
- **Notifications:** Notify restaurant administrators of new orders and delivery confirmations.
- **Order Map:** Visualize orders on a map with different markers for statuses and filter by delivery personnel.
- **Service Rating:** Users can rate restaurant services through a survey upon delivery.
- **Dark Mode:** Users can switch between light and dark theme.
- **Background Music:** An online radio stream with background music that can be muted by choice.
- **Reset Password:** A mechanism for users to reset their passwords through a link sent to their email address.

## Getting Started

### Backend Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/emadjedovic/MMM-MakeMyMeal.git

2. **Navigate to the Project Directory:**
   ```bash
   cd MMM-MakeMyMeal

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt

4. **Run the Application:**
   ```bash
   uvicorn main:app --reload

### Frontend Setup

1. **Navigate to the Frontend Directory:**
    ```bash
    cd frontend

2. **Install Dependencies:**
     ```bash
    npm install

3. **Run the Frontend:**
     ```bash
    npm start

This will start the React development server and open the application in your default web browser.

## Credits and License

**Author:** Ema Djedović 
**University of Sarajevo:** Department of Mathematics and Computer Science, Faculty of Science

This project is licensed under the MIT License - see the LICENSE file for details.

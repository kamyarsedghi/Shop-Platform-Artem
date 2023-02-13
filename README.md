# Shop Platform Test Web.Smart 

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Endpoints](#endpoints)

---
## About <a name = "about"></a>

Requested by Artem Lakiza web.smart <br>
Author: Kamyar Sedghi

---
## Getting Started <a name = "getting_started"></a>

This project is a test for Fojin.tech web.smart with the following prompt: <br>
Create the REST API that meets requirements below:
- User endpoints:
    - User registration and sign in (JWT token), fields: username, first name, last
name, password
    - Create an endpoint to change user’s password
- Product endpoints:
    - Create an endpoint to show all details about a specific product
    - Create an endpoint to add a new product
    - Create an endpoint to edit a specific product
    - Only registered users can create a product.
- Separate endpoint - unrelated to the endpoints above:
    - Create an endpoint for large file upload with emails. It should filter the file from emails with the ‘yahoo.com’ domain and return the filtered file.
- Required technologies
    - Relational Database (MySql was used)
    - TypeScript 
    - Express.js
 <br>

Each endpoint have a validation of the input data as a middleware of each route (routes/shopRoute.ts) that the controller of each endpoint is located on middleware/validatorMid.ts file, respectively. <br>

For validation data we use express-validator module <br>
For database connection we use mysql2 module <br>
For JWT token we use jsonwebtoken module <br>
For file upload we use multer module <br>
For file filtering we use csv-parser module <br>
For environment variables we use dotenv module <br>

---
### Prerequisites

Run npm install <br>
Add your environment variables:
- PORT
- DB_HOST, DB_NAME, DB_USER, DB_PASSWORD
    - Default: localhost, test-db, root, root12345 
    - Can be changes in utils/dbConfig.ts (not from config file located in config folder)
- JWT_SECRET


Also you can import postman collection

### Installing

```
npm install
```

---
## Usage <a name = "usage"></a>
```
npm run dev
```
## Endpoints <a name = "endpoints"></a>
**All routes for the shop and user functionality begins with /shop/**

### Check server functionality:
```
curl localhost:5850
```

### User signup:

```
curl -X POST localhost:5850/shop/signup
-H 'Content-Type: application/json'
-d '{"username":"my_username", "password":"my_password", "firstname": "my_firstname", "lastname": "my_lastname"}'
```

### User login:
```
curl -X POST localhost:5850/shop/login
-H 'Content-Type: application/json'
-d '{"username":"my_username", "password":"my_password"}'
```

After a successful login, the user will receive a JWT token in the response. <br>

### User change password:
```
curl -X PATCH localhost:5850/shop/changePassword
-H 'Content-Type: application/json'
-H "Authorization: Bearer {token}"
-d '{"username":"my_username", "password":"my_password", "newPassword": "my_new_password", "confirmNewPassword": "my_new_password"}'
```
The generated token must be sent in the header of the request as a Bearer Token. <br>

### Get a product:
```
curl localhost:5850/shop/product/{productId}
```

### Add a product:
```
curl -X POST localhost:5850/shop/addProduct
-H 'Content-Type: application/json'
-H "Authorization: Bearer {token}"
-d '{"title":"my_product_title", "price":"my_product_price", "description": "my_product_description", "imageUrl": "my_product_image_url"}'
```
imageUrl can be an empty string as there is default value in postAddProduct function (controllers/shopCtrl.ts)<br>

### Edit a product:
```
curl -X PATCH localhost:5850/shop/editProduct?product={productId}
-H 'Content-Type: application/json'
-H "Authorization: Bearer {token}"
-d '{"title":"my_product_title", "price":"my_product_price", "description": "my_product_description", "imageUrl": "my_product_image_url"}'
```
Each of the fields can be empty, but at least one field must be filled. <br>

### Upload a file:
```
localhost:5850/upload
```
Form-data field name(key) must be "file".

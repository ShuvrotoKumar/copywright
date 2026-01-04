# Coupon API Documentation

## Base URL
- Development: `http://localhost:5173/api/v1/`
- Production: `https://instagram-copyright-check-backend.onrender.com/api/v1/`

## Coupon Endpoints

### 1. Get All Coupons
- **Method**: `GET`
- **URL**: `{{base-url}}/subscription/coupons`
- **Query Params**: `page` (optional)
- **Headers**: 
  - `Content-Type: application/json`
  - `Cookie: accessToken=your_token`

### 2. Create Coupon
- **Method**: `POST`
- **URL**: `{{base-url}}/subscription/coupons`
- **Body**: 
```json
{
  "code": "WELCOME100",
  "discountPercentage": 100,
  "isActive": true
}
```
- **Headers**: 
  - `Content-Type: application/json`
  - `Cookie: accessToken=your_token`

### 3. Update Coupon
- **Method**: `PUT`
- **URL**: `{{base-url}}/subscription/coupons/{{coupon_id}}`
- **Example**: `{{base-url}}/subscription/coupons/695ad9fbac99f6dbbe519c36`
- **Body**: 
```json
{
  "code": "WELCOME100",
  "discountPercentage": 100,
  "isActive": true
}
```
- **Headers**: 
  - `Content-Type: application/json`
  - `Cookie: accessToken=your_token`

### 4. Delete Coupon
- **Method**: `DELETE`
- **URL**: `{{base-url}}/subscription/coupons/{{coupon_id}}`
- **Example**: `{{base-url}}/subscription/coupons/695ad9fbac99f6dbbe519c36`
- **Headers**: 
  - `Content-Type: application/json`
  - `Cookie: accessToken=your_token`

## Frontend Integration

The frontend is now properly configured with:
- Complete edit modal with all fields (code, discount percentage, status)
- Proper API integration using Redux Toolkit Query
- Error handling and success messages
- Form validation

## Postman Configuration

For testing the update API in Postman:
1. Use `PUT` method (not DELETE)
2. URL: `http://localhost:5173/api/v1/subscription/coupons/695ad9fbac99f6dbbe519c36`
3. Body should contain the complete coupon object with updated fields
4. Include proper headers with authentication token

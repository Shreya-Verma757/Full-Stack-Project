const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');

const Listing = require('../models/listing.js');
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');

const listingController = require('../controller/listings.js');

const { storage } = require('../cloudConfig.js');
const multer = require('multer');
const upload = multer({ storage });

// NEW ROUTE
router.get('/new', isLoggedIn, listingController.renderNewForm);

// Main route and Create route are combined here 
router.route('/')
.get(wrapAsync(listingController.index))
.post(isLoggedIn,  upload.single('listing[image]'), wrapAsync(listingController.createListing));
// .post( upload.single('listing[image]'), (req, res) =>{
//     res.send(req.file);
// });


// SHOW ROUTE & UPDATE ROUTE & DELETE ROUTE
router.route('/:id')
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, wrapAsync(listingController.deleteListing));


// EDIT ROUTE
router.get('/:id/edit',isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// UPDATE ROUTE
// router.put('/:id',isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// DELETE ROUTE
// router.delete('/:id',isLoggedIn, wrapAsync(listingController.deleteListing));

module.exports = router;
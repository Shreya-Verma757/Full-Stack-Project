const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

const reviewController = require('../controller/reviews.js');

// REVIEWS
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//DELETE REVIEWS
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
const Review = require('../models/Review');

exports.createReview = async (req, res, next) => {
  try {
    const { user, product, rating, comment } = req.body;
    const review = new Review({
      user,
      product,
      rating,
      comment
    });

    const savedReview = await review.save();

    res.status(201).json({
      message: 'Review created successfully',
      review: savedReview
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while creating the review.'
    });
  }
};

exports.getReviewById = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }
    res.status(200).json({
      review
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching the review.'
    });
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating,
        comment
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while updating the review.'
    });
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const deletedReview = await Review.findByIdAndRemove(reviewId);

    if (!deletedReview) {
      return res.status(404).json({
        message: 'Review not found'
      });
    }

    res.status(200).json({
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while deleting the review.'
    });
  }
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();

    res.status(200).json({
      reviews
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while fetching the reviews.'
    });
  }
};

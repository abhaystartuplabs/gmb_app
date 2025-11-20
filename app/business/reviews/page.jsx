"use client";

import { useEffect, useState } from "react";
// Assuming 'lucide-react' Star component supports direct style props for fill/color
import { Star } from 'lucide-react';

// --- Style Definitions ---

const styles = {
  // Shared Styles
  indigo700: '#4338ca',
  indigo300: '#a5b4fc',
  gray900: '#111827',
  gray800: '#1f2937',
  gray500: '#6b7280',
  gray400: '#9ca3af',
  gray200: '#e5e7eb',
  gray100: '#f3f4f6',
  yellow500: '#f59e0b',
  white: '#ffffff',

  // Container Styles
  mainContainer: {
    minHeight: '100vh',
    backgroundColor: 'rgba(199, 210, 254, 0.5)', // bg-indigo-50/50
    padding: '2.5rem', // p-10 (using a medium padding value)
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // shadow-2xl
    borderRadius: '1rem', // rounded-xl
    padding: '2rem', // p-8
    maxWidth: '56rem', // max-w-4xl
    margin: '0 auto', // mx-auto
  },
  // Header Styles
  header: {
    fontSize: '2.25rem', // text-4xl
    fontWeight: '800', // font-extrabold
    color: '#111827', // text-gray-900
    marginBottom: '2rem', // mb-8
    borderBottom: '1px solid #e5e7eb', // border-b border-gray-200
    paddingBottom: '1rem', // pb-4
    textAlign: 'center',
  },
  // List & Review Card Styles
  reviewList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem', // space-y-6
  },
  reviewCard: {
    padding: '1.5rem', // p-6
    border: '1px solid #f3f4f6', // border border-gray-100
    borderRadius: '0.5rem', // rounded-lg
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', // shadow-md
    backgroundColor: '#ffffff',
    transition: 'all 300ms ease-in-out',
    // Note: Cannot apply hover styles with inline CSS easily
  },
  // Review Header Styles
  reviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  profilePhoto: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  reviewerName: {
    fontSize: '16px',
    fontWeight: '600',
  },
  // Rating Styles
  ratingContainer: {
    display: 'flex',
    color: '#f59e0b', // text-yellow-500
  },
  // Location Styles
  locationText: {
    fontSize: '0.875rem', // text-sm
    color: '#6b7280', // text-gray-500
    marginBottom: '0.75rem', // mb-3
  },
  locationLabel: {
    fontWeight: '600', // font-semibold
    color: '#4b5563', // text-gray-600
  },
  // Comment Styles
  commentText: {
    fontSize: '1rem', // text-base
    color: '#1f2937', // text-gray-800
    fontStyle: 'italic',
    borderLeft: '4px solid #a5b4fc', // border-l-4 border-indigo-300
    paddingLeft: '1rem', // pl-4
    paddingTop: '0.25rem', // py-1
    paddingBottom: '0.25rem',
    marginBottom: '1rem', // mb-4
  },
  // Timestamp Styles
  timestampText: {
    fontSize: '0.75rem', // text-xs
    color: '#9ca3af', // text-gray-400
  },
  // Footer Text
  footerText: {
    marginTop: '2rem', // mt-8
    textAlign: 'center',
    fontSize: '0.875rem', // text-sm
    color: '#6b7280', // text-gray-500
    fontWeight: '600', // Ensure bolding for count
  },
  // Loading State
  loadingContainer: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb', // bg-gray-50
  },
  loadingText: {
    fontSize: '1.25rem', // text-xl
    fontWeight: '500', // font-medium
    color: '#4f46e5', // text-indigo-600
    // No simple inline CSS for animate-pulse
  },
  // No Reviews State
  noReviewsText: {
    fontSize: '1.125rem', // text-lg
    color: '#4b5563', // text-gray-600
  }
};

// Helper function to render star rating (updated for inline style)
const renderRating = (rating) => {
  const numericRating = rating ? parseInt(rating.split('_')[0]) : 0;

  return (
    <div style={styles.ratingContainer}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          style={{
            width: '1.25rem', // w-5
            height: '1.25rem', // h-5
            fill: i < numericRating ? styles.yellow500 : 'none', // fill-yellow-500 or fill-none
            color: styles.yellow500, // stroke color
          }}
          strokeWidth={2}
        />
      ))}
    </div>
  );
};


export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch("/api/business/reviews");
        const data = await res.json();
        if (data.success) setReviews(data.reviews);
      } catch (e) {
        console.error("Failed to load reviews:", e);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  // --- Loading State ---
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>
          Loading dazzling reviews... 🌟
        </p>
      </div>
    );
  }

  // --- No Reviews State ---
  if (reviews.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.noReviewsText}>
          No reviews found for this location.
        </p>
      </div>
    );
  }

  // --- Main Content ---
  return (
    <div style={styles.mainContainer}>

      <div style={styles.cardContainer}>

        <h1 style={styles.header}>
          💬 Google Business Reviews
        </h1>

        <div style={styles.reviewList}>
          {reviews.map((r, i) => (
            <div key={i} style={styles.reviewCard}>

              <div style={styles.reviewHeader}>
                <h3 style={styles.reviewerName}>
                  {r.reviewer?.displayName}
                </h3>
                {renderRating(r.starRating)}
              </div>


              <p style={styles.locationText}>ß
                <span style={styles.locationLabel}>Location:</span> {r.location}
              </p>

              <p style={styles.commentText}>
                {r.comment}
              </p>

              <p style={styles.timestampText}>
                Reviewed on: {r.createTime ? new Date(r.createTime).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "N/A"}
              </p>
            </div>
          ))}
        </div>

        <p style={styles.footerText}>
          Showing **{reviews.length}** latest reviews.
        </p>
      </div>
    </div>
  );
}
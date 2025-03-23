// Import chart modules
import { createBarChart } from 'js/barChart.js';
import { createLineChart } from 'js/lineChart.js';
import { createBubbleChart } from 'js/bubbleChart.js';

// Sample data for the charts (would be loaded from an API/CSV in a real app)
// NYC Airbnb dataset sample

// Bar chart data - Distribution by neighborhood group
const neighborhoodData = [
    { neighborhood: "Manhattan", count: 21661 },
    { neighborhood: "Brooklyn", count: 20104 },
    { neighborhood: "Queens", count: 5666 },
    { neighborhood: "Bronx", count: 1091 },
    { neighborhood: "Staten Island", count: 373 }
];

// Line chart data - Average price by minimum nights
const priceByNightsData = [
    { min_nights: 1, avg_price: 152 },
    { min_nights: 2, avg_price: 175 },
    { min_nights: 3, avg_price: 165 },
    { min_nights: 4, avg_price: 157 },
    { min_nights: 5, avg_price: 149 },
    { min_nights: 6, avg_price: 141 },
    { min_nights: 7, avg_price: 185 },
    { min_nights: 10, avg_price: 169 },
    { min_nights: 14, avg_price: 196 },
    { min_nights: 30, avg_price: 211 }
];

// Bubble chart data - Room type, price, reviews, and minimum nights
const roomTypeData = [
    { room_type: "Entire home/apt", reviews: 37, price: 225, min_nights: 3 },
    { room_type: "Private room", reviews: 72, price: 89, min_nights: 2 },
    { room_type: "Shared room", reviews: 45, price: 70, min_nights: 1 },
    { room_type: "Entire home/apt", reviews: 15, price: 350, min_nights: 4 },
    { room_type: "Private room", reviews: 127, price: 65, min_nights: 1 },
    { room_type: "Entire home/apt", reviews: 23, price: 195, min_nights: 2 },
    { room_type: "Shared room", reviews: 31, price: 45, min_nights: 1 },
    { room_type: "Private room", reviews: 85, price: 110, min_nights: 3 },
    { room_type: "Entire home/apt", reviews: 56, price: 275, min_nights: 7 },
    { room_type: "Private room", reviews: 94, price: 95, min_nights: 2 },
    { room_type: "Entire home/apt", reviews: 12, price: 399, min_nights: 5 },
    { room_type: "Shared room", reviews: 26, price: 55, min_nights: 2 },
    { room_type: "Entire home/apt", reviews: 43, price: 189, min_nights: 3 },
    { room_type: "Private room", reviews: 110, price: 79, min_nights: 1 },
    { room_type: "Shared room", reviews: 18, price: 60, min_nights: 1 }
];

// Initialize charts when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    createBarChart(neighborhoodData, '#bar-chart');
    createLineChart(priceByNightsData, '#line-chart');
    createBubbleChart(roomTypeData, '#bubble-chart');
});

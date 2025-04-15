import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";

const storeLocation = { lat: 8.5435, lng: 124.7575 }; // Tagoloan coordinates

const GoogleMapComponent = ({ orderType }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (orderType === "pickup") {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(userLocation);
          getDirections(userLocation, storeLocation);
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, [orderType]);

  const getDirections = (origin, destination) => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING, // You can change to WALKING, BICYCLING, TRANSIT
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap center={storeLocation} zoom={15} mapContainerStyle={{ width: "100%", height: "300px", borderRadius: "10px" }}>
        {currentLocation && <Marker position={currentLocation} label="You" />}
        <Marker position={storeLocation} label="Store" />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;

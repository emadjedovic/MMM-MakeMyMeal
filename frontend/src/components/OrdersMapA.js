import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

const OrdersMapA = ({
  restaurants,
  selectedRestaurantName,
  deliveryId,
  date,
  orders,
  setSelectedRestaurantName,
  setDeliveryId,
  setDate
}) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) {
            const map = mapRef.current.leafletElement;
            // Force the map to recalculate its size
            map.invalidateSize();
        }
    }, [orders]);

    const STATUS_MARKERS = {
        "NOT ASSIGNED": "pin-yellow.png",
        "ASSIGNED": "pin-red.png",
        "IN PROGRESS": "pin-blue.png",
        "COMPLETED": "pin-green.png",
    };

    return (
        <div>
            <select
                value={selectedRestaurantName}
                onChange={(e) => {
                    setSelectedRestaurantName(e.target.value);
                }}
            >
                <option value="">Select Restaurant</option>
                {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.name}>
                        {restaurant.name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Delivery ID"
                value={deliveryId}
                onChange={(e) => setDeliveryId(e.target.value)}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <MapContainer
                center={[43.8486, 18.3564]}
                zoom={13}
                style={{ height: "90vh", width: "90%" }}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {orders.map((order) => {
                    const { latitude, longitude, status, id } = order;
                    const markerIcon = L.icon({
                        iconUrl: STATUS_MARKERS[status] || STATUS_MARKERS["NOT ASSIGNED"],
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                    });

                    return (
                        <Marker key={id} position={[latitude, longitude]} icon={markerIcon}>
                            <Popup>
                                <div>
                                    <h3>Order ID: {id}</h3>
                                    <p>Status: {status}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default OrdersMapA;

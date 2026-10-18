import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";
import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./DeliveryTrackingMap.css";

const makeMarkerIcon = (kind) =>
    L.divIcon({
        className: "delivery-map-marker-wrapper",
        html: `<span class="delivery-map-marker ${kind}"></span>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });

const riderIcon = makeMarkerIcon("rider-marker");
const destinationIcon = makeMarkerIcon("destination-marker");

const MapBounds = ({
    riderLatitude,
    riderLongitude,
    destinationLatitude,
    destinationLongitude,
}) => {
    const map = useMap();

    useEffect(() => {
        const points = [];
        if (riderLatitude !== null && riderLongitude !== null) {
            points.push([riderLatitude, riderLongitude]);
        }
        if (
            destinationLatitude !== null &&
            destinationLongitude !== null
        ) {
            points.push([destinationLatitude, destinationLongitude]);
        }

        if (points.length > 1) {
            map.fitBounds(points, { padding: [36, 36], maxZoom: 15 });
        } else if (points.length === 1) {
            map.setView(points[0], 15);
        }
    }, [
        map,
        riderLatitude,
        riderLongitude,
        destinationLatitude,
        destinationLongitude,
    ]);

    return null;
};

const DeliveryTrackingMap = ({ orderId, url, token, onOrderUpdate }) => {
    const [tracking, setTracking] = useState(null);
    const [error, setError] = useState("");
    const [currentTime, setCurrentTime] = useState(Date.now());
    const isPausedRef = React.useRef(false);

    const fetchTracking = useCallback(async () => {
        if (isPausedRef.current) return;

        try {
            const response = await axios.get(
                `${url}/api/order/tracking/${orderId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!response.data.success || !response.data.data) {
                throw new Error(
                    response.data.message || "Unable to load live tracking."
                );
            }

            setTracking(response.data.data);
            setError("");
            onOrderUpdate(orderId, response.data.data);
        } catch (requestError) {
            if (requestError.response?.status === 404) {
                // Route not available on remote server or order tracking not active yet
                setError("Live tracking is not active for this order yet.");
                isPausedRef.current = true;
            } else {
                console.warn("Live tracking update:", requestError.message);
                setError(
                    requestError.response?.data?.message ||
                        "Live tracking could not be refreshed. Please try again."
                );
            }
        }
    }, [onOrderUpdate, orderId, token, url]);

    useEffect(() => {
        isPausedRef.current = false;
        fetchTracking();
        const pollingId = window.setInterval(fetchTracking, 15000);
        const clockId = window.setInterval(() => setCurrentTime(Date.now()), 15000);

        return () => {
            window.clearInterval(pollingId);
            window.clearInterval(clockId);
        };
    }, [fetchTracking]);

    const riderLatitude = tracking?.riderLocation?.latitude ?? null;
    const riderLongitude = tracking?.riderLocation?.longitude ?? null;
    const destinationLatitude =
        tracking?.deliveryLocation?.latitude ?? null;
    const destinationLongitude =
        tracking?.deliveryLocation?.longitude ?? null;
    const riderPoint =
        riderLatitude !== null && riderLongitude !== null
            ? [riderLatitude, riderLongitude]
            : null;
    const destinationPoint =
        destinationLatitude !== null && destinationLongitude !== null
            ? [destinationLatitude, destinationLongitude]
            : null;
    const points = [riderPoint, destinationPoint].filter(Boolean);

    const lastUpdated = tracking?.riderLocationUpdatedAt
        ? new Date(tracking.riderLocationUpdatedAt)
        : null;
    const locationIsStale =
        lastUpdated && currentTime - lastUpdated.getTime() > 45000;

    return (
        <section className="delivery-tracking" aria-label="Live delivery tracking">
            <div className="delivery-tracking-header">
                <div>
                    <span className="delivery-tracking-eyebrow">LIVE DELIVERY</span>
                    <h3>Track your parcel</h3>
                </div>
                <span
                    className={`tracking-live-status${tracking?.trackingActive && !locationIsStale ? " is-live" : ""}`}
                >
                    <span />
                    {tracking?.trackingActive
                        ? !riderPoint
                            ? "Waiting for GPS fix"
                            : locationIsStale
                            ? "Location may be out of date"
                            : "GPS sharing active"
                        : "Waiting for rider"}
                </span>
            </div>

            {error && (
                <p className="delivery-tracking-error" role="alert">
                    {error}
                </p>
            )}

            {points.length > 0 ? (
                <>
                    <div className="delivery-map">
                        <MapContainer
                            center={points[0]}
                            zoom={14}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapBounds
                                riderLatitude={riderLatitude}
                                riderLongitude={riderLongitude}
                                destinationLatitude={destinationLatitude}
                                destinationLongitude={destinationLongitude}
                            />
                            {riderPoint && (
                                <Marker
                                    position={riderPoint}
                                    icon={riderIcon}
                                    title="Rider's live location"
                                />
                            )}
                            {destinationPoint && (
                                <Marker
                                    position={destinationPoint}
                                    icon={destinationIcon}
                                    title="Your delivery location"
                                />
                            )}
                        </MapContainer>
                    </div>
                    <div className="delivery-map-legend">
                        {riderPoint && (
                            <span>
                                <i className="legend-rider" /> Rider
                            </span>
                        )}
                        {destinationPoint ? (
                            <span>
                                <i className="legend-destination" /> Delivery pin
                            </span>
                        ) : (
                            <span>
                                No delivery pin was added at checkout.
                            </span>
                        )}
                        {lastUpdated && (
                            <span>
                                Last update:{" "}
                                {lastUpdated.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        )}
                    </div>
                </>
            ) : (
                <div className="delivery-map-waiting" role="status">
                    {tracking?.trackingActive
                        ? "Waiting for the rider's first GPS update..."
                        : "The restaurant has not started GPS sharing yet."}
                    {!destinationPoint && (
                        <p>
                            No delivery pin was added at checkout. The rider's
                            live position will appear here once sharing starts.
                        </p>
                    )}
                </div>
            )}
        </section>
    );
};

export default DeliveryTrackingMap;

"use client";

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet issue & Define Custom Holographic Icon
const HolographicIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="relative w-8 h-8 group">
             <div class="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping"></div>
             <div class="absolute inset-0 bg-black/80 border-2 border-emerald-400 rounded-full flex items-center justify-center shadow-[0_0_15px_#10b981] group-hover:scale-125 transition-transform">
                <div class="w-2 h-2 bg-emerald-300 rounded-full shadow-[0_0_5px_#fff]"></div>
             </div>
             <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gradient-to-t from-transparent to-emerald-500 opacity-50"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20]
});

interface HistoryMapProps {
    activeEra: any;
}

// Map Controller to handle View Updates without re-mounting the container
function MapController({ bounds }: { bounds: any }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // Invalidate size to ensure correct rendering if container resized
        map.invalidateSize();

        if (bounds) {
            try {
                const geoJsonLayer = L.geoJSON(bounds);
                const targetBounds = geoJsonLayer.getBounds();
                if (targetBounds.isValid()) {
                    map.fitBounds(targetBounds, {
                        padding: [80, 80],
                        animate: true,
                        duration: 1.5,
                    });
                }
            } catch (err) { }
        }
    }, [bounds, map]);

    return null;
}

export default function HistoryMap({ activeEra }: HistoryMapProps) {
    return (
        <div className="w-full h-full relative z-0">
            <MapContainer
                center={[24.4672, 39.6111]}
                zoom={4}
                className="w-full h-full"
                zoomControl={false}
                scrollWheelZoom={true}
                attributionControl={false}
            >
                {/* GAME MAP BASE: DarkMatter */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                <MapController bounds={activeEra?.boundary_data} />

                {activeEra?.boundary_data && (
                    <>
                        {/* Tactical Zone Fill - Key ensures layer is replaced when era changes */}
                        <GeoJSON
                            key={`geo-${activeEra.id}`}
                            data={activeEra.boundary_data}
                            style={{
                                color: "#10b981", // Emerald Neon
                                weight: 2,
                                opacity: 0.8,
                                fillColor: "#059669",
                                fillOpacity: 0.15,
                                dashArray: "4, 8", // Tactical Dashes
                            }}
                        />
                        {/* Outer Sensor Ring */}
                        <GeoJSON
                            key={`glow-${activeEra.id}`}
                            data={activeEra.boundary_data}
                            style={{
                                color: "#34d399",
                                weight: 1,
                                opacity: 0.3,
                                fillColor: "transparent",
                                dashArray: "10, 20"
                            }}
                        />
                    </>
                )}

                {/* HOLOGRAPHIC MARKERS */}
                {activeEra?.relics?.map((relic: any, idx: number) => {
                    if (!relic.coordinates) return null;
                    return (
                        <Marker
                            key={`marker-${activeEra.id}-${idx}`}
                            position={[relic.coordinates.lat, relic.coordinates.lng]}
                            icon={HolographicIcon}
                        >
                            <Popup className="crystal-popup">
                                <div className="p-3 min-w-[200px] max-w-[250px] bg-black/90 backdrop-blur-xl border border-emerald-500/30 text-white rounded-none clip-popup shadow-[0_0_30px_rgba(0,0,0,1)]">
                                    <h4 className="font-black text-[10px] text-emerald-400 uppercase tracking-widest mb-1">{relic.name}</h4>
                                    <div className="w-full h-0.5 bg-emerald-500/30 mb-2"></div>
                                    {relic.image && (
                                        <div className="w-full h-32 relative mb-2 border border-emerald-500/20 bg-emerald-900/20 overflow-hidden">
                                            <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                                            <img
                                                src={relic.image}
                                                alt={relic.name}
                                                className="w-full h-full object-cover relative z-10"
                                            />
                                        </div>
                                    )}
                                    <p className="text-[9px] text-gray-400 leading-relaxed">{relic.description}</p>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            <style jsx global>{`
                .leaflet-popup-content-wrapper {
                    background: transparent !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                }
                .leaflet-popup-tip {
                    display: none;
                }
                .clip-popup {
                    clip-path: polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%);
                }
            `}</style>
        </div>
    );
}

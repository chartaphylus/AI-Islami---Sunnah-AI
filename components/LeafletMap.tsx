"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { ArrowLeft, MousePointerClick } from "lucide-react";
import NeonMarker from "./NeonMarker";
import InfoPanel from "./InfoPanel";

interface EraData {
    id: number;
    era_name: string;
    description: string;
    year_start_m: number;
    year_end_m: number;
    capital: string;
    capital_geo?: { lat: number; lng: number };
    leader_info: any;
    key_events: any;
    relics: any;
    boundary_data: any; // GeoJSON
    symbol_url?: string;
}

const DEFAULT_CENTER: [number, number] = [24.4686, 39.6142]; // Medina coordinate roughly
const DEFAULT_ZOOM = 4;

const CITY_COORDINATES: Record<string, [number, number]> = {
    "Madinah": [24.4672, 39.6102],
    "Mecca": [21.3891, 39.8579],
    "Mekkah": [21.3891, 39.8579],
    "Kufa": [32.0269, 44.4009],
    "Kufah": [32.0269, 44.4009],
    "Damaskus": [33.5138, 36.2765],
    "Damascus": [33.5138, 36.2765],
    "Baghdad": [33.3152, 44.3661],
    "Cordoba": [37.8882, -4.7794],
    "Kordoba": [37.8882, -4.7794],
    "Cairo": [30.0444, 31.2357],
    "Kairo": [30.0444, 31.2357],
    "Fustat": [30.0055, 31.2268],
    "Istanbul": [41.0082, 28.9784],
    "Konstantinopel": [41.0082, 28.9784],
    "Anbar": [33.3586, 43.4228],
    "Samarra": [34.1983, 43.8743],
    "Qayrawan": [35.6781, 10.0963],
    "Marrakesh": [31.6295, -7.9811],
    "Granada": [37.1773, -3.5986],
    "Bursa": [40.1885, 29.0610],
    "Edirne": [41.6763, 26.5564],
    "Sogut": [40.0194, 30.1787],
    "Nishapur": [36.2133, 58.7958],
    "Isfahan": [32.6546, 51.6680],
    "Konya": [37.8746, 32.4932],
    "Agra": [27.1767, 78.0081],
    "Delhi": [28.7041, 77.1025],
    "Lahore": [31.5204, 74.3587],
    "Jeddah": [21.4858, 39.1925],
    "Sekretariat OKI": [21.4858, 39.1925],
    "Mahdia": [35.5024, 11.0457]
};

function getCapitalCoordinates(era: EraData): [number, number] | null {
    let baseCoords: [number, number] | null = null;

    if (era.capital_geo && typeof era.capital_geo.lat === 'number') {
        baseCoords = [era.capital_geo.lat, era.capital_geo.lng];
    } else {
        // Fuzzy match
        const capitalName = era.capital ? era.capital.trim() : "";
        for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
            if (capitalName.toLowerCase().includes(city.toLowerCase())) {
                baseCoords = coords;
                break;
            }
        }
    }

    if (baseCoords) {
        // Apply small "jitter" offset based on era.id to prevent perfect overlap
        // 0.05 degrees is roughly 5km, enough to separate markers visually at standard zoom
        const offset = (era.id % 5 - 2) * 0.15;
        const latOffset = (era.id * 0.02) % 0.1;

        // Use a deterministic pseudo-random offset based on ID
        return [
            baseCoords[0] + (Math.sin(era.id) * 0.2),
            baseCoords[1] + (Math.cos(era.id) * 0.2)
        ];
    }

    return null; // No match found
}

function MapController() {
    const map = useMap();
    useEffect(() => {
        // Force map invalidation on resize to prevent grey areas
        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    }, [map]);
    return null;
}

export default function LeafletMap() {
    const [eras, setEras] = useState<EraData[]>([]);
    const [selectedEra, setSelectedEra] = useState<EraData | null>(null);

    useEffect(() => {
        async function fetchEras() {
            try {
                const res = await fetch("/api/eras");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();

                setEras(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchEras();
    }, []);

    const onEraClick = (era: EraData) => {
        setSelectedEra(era);
    };

    return (
        <div className="relative w-full h-full bg-black">
            <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                className="w-full h-full z-0"
                scrollWheelZoom={true}
                zoomControl={false}
            >
                <MapController />

                {/* Carto Dark Matter Tiles - Cyberpunk base */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    className="map-tiles"
                />

                {eras.map((era) => (
                    <div key={era.id}>
                        {/* GeoJSON Boundary - ONLY render if selected */}
                        {selectedEra?.id === era.id && era.boundary_data && (
                            <GeoJSON
                                key={`boundary-${era.id}`} // Force re-render on change
                                data={era.boundary_data}
                                style={{
                                    color: "#0ff",
                                    weight: 3,
                                    opacity: 1,
                                    fillColor: "#00f3ff",
                                    fillOpacity: 0.2,
                                    className: "neon-boundary-active"
                                }}
                            />
                        )}

                        {/* Capital Marker with Fallback - Always show but highlight selected */}
                        {(() => {
                            const position = getCapitalCoordinates(era);
                            if (position) {
                                const isSelected = selectedEra?.id === era.id;
                                return (
                                    <NeonMarker
                                        position={position}
                                        onClick={() => onEraClick(era)}
                                    />
                                );
                            }
                            return null;
                        })()}
                    </div>
                ))}

            </MapContainer>

            {/* Info Panel Overlay */}
            <InfoPanel era={selectedEra} onClose={() => setSelectedEra(null)} />

            {/* UI Overlays */}
            <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-4 pointer-events-none">
                {/* Back Button */}
                <Link href="/" className="pointer-events-auto group flex items-center gap-2 bg-black/60 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-full hover:bg-cyan-900/40 hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(0,255,255,0.2)]">
                    <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-cyberpunk text-cyan-300 group-hover:text-cyan-100">KEMBALI</span>
                </Link>
            </div>

            {/* Hologram Instruction Bar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[990] pointer-events-none hidden md:block">
                <div className="relative bg-black/60 backdrop-blur-sm border-x-2 border-cyan-500/50 px-8 py-2 overflow-hidden clip-path-polygon">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,255,255,0.1)_3px)]"></div>
                    <div className="flex items-center gap-3 animate-pulse">
                        <MousePointerClick className="w-5 h-5 text-neon-pink" />
                        <span className="text-sm font-cyberpunk tracking-widest text-cyan-100 uppercase drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]">
                            KLIK SALAH SATU TITIK UNTUK ANALISIS ERA
                        </span>
                    </div>
                    {/* Scanning Line Animation */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400/50 shadow-[0_0_10px_#0ff] animate-[scan_3s_ease-in-out_infinite]"></div>
                </div>
            </div>

            {/* Mobile Instruction (Simpler) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[990] md:hidden pointer-events-none w-max">
                <div className="bg-black/70 backdrop-blur border border-cyan-500/30 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                    <MousePointerClick className="w-3 h-3 text-neon-pink" />
                    <span className="text-[10px] font-bold text-cyan-200 uppercase">Klik titik untuk detail</span>
                </div>
            </div>

            {/* Decorative Overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[500] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-[500]"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-[500]"></div>
        </div>
    );
}

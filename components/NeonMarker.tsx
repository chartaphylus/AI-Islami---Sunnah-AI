"use client";

import { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const createNeonIcon = () => {
    return L.divIcon({
        className: "custom-div-icon",
        html: `<div class="marker-neon w-4 h-4 shadow-[0_0_10px_#0ff] bg-cyan-400 rounded-full"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });
};

export default function NeonMarker({ position, onClick }: { position: [number, number]; onClick: () => void }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const marker = L.marker(position, { icon: createNeonIcon() }).addTo(map);
        marker.on("click", onClick);

        return () => {
            marker.remove();
        };
    }, [map, position, onClick]);

    return null;
}

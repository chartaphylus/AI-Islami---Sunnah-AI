"use client";

import { X, Calendar, MapPin, Crown, ScrollText, Landmark } from "lucide-react";
import Image from "next/image";
import AiButton from "./AiButton";

interface EraData {
    id: number;
    era_name: string;
    description: string;
    year_start_m: number;
    year_end_m: number;
    capital: string;
    leader_info: any;
    key_events: any;
    relics: any;
    symbol_url?: string;
}

interface InfoPanelProps {
    era: EraData | null;
    onClose: () => void;
}

export default function InfoPanel({ era, onClose }: InfoPanelProps) {
    if (!era) return null;

    return (
        <div className={`
      fixed z-[1000] transition-all duration-500 ease-in-out
      md:top-20 md:right-4 md:w-[400px] md:h-[calc(100vh-6rem)] md:rounded-xl
      bottom-0 left-0 w-full h-[60vh] rounded-t-2xl
      glass-panel glass-panel-mobile flex flex-col overflow-hidden
      border-l border-t border-r border-cyan-500/30
    `}>
            {/* Header */}
            <div className="p-4 border-b border-cyan-500/30 flex justify-between items-center bg-black/40 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative bg-cyan-900/40 rounded-full border border-cyan-400 p-1 overflow-hidden">
                        <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>
                        <Image
                            src={era.symbol_url && era.symbol_url.startsWith('http') ? era.symbol_url : "/icons/default_cyberpunk.png"}
                            alt="Symbol"
                            fill
                            className="object-cover rounded-full p-1"
                            unoptimized
                            priority
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.srcset = "/icons/default_cyberpunk.png";
                            }}
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-cyberpunk text-neon-blue uppercase tracking-wider">
                            {era.era_name}
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-cyan-300 font-tech">
                            <Calendar className="w-3 h-3" />
                            <span>{era.year_start_m} - {era.year_end_m} M</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-cyan-500/20 rounded-full text-cyan-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 cyber-scrollbar font-tech text-gray-200">

                {/* Description */}
                <div className="bg-black/30 p-4 rounded-lg border border-cyan-900/50">
                    <p className="text-sm leading-relaxed text-gray-300">
                        {era.description}
                    </p>
                </div>

                {/* Capital */}
                <div className="flex items-center gap-3 p-3 bg-cyan-900/10 rounded-lg border border-cyan-500/20">
                    <MapPin className="w-5 h-5 text-neon-pink" />
                    <div>
                        <span className="block text-xs text-cyan-500 uppercase">Ibu Kota</span>
                        <span className="text-lg font-bold text-white">{era.capital}</span>
                    </div>
                </div>

                {/* Leaders */}
                {era.leader_info && (
                    <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-neon-gold font-cyberpunk text-sm uppercase">
                            <Crown className="w-4 h-4" /> Pemimpin Utama
                        </h3>
                        <div className="space-y-2">
                            {(() => {
                                let leaders: any[] = [];
                                try {
                                    leaders = typeof era.leader_info === 'string' ? JSON.parse(era.leader_info) : era.leader_info;
                                    if (!Array.isArray(leaders)) leaders = [leaders];
                                } catch (e) {
                                    leaders = [];
                                }

                                return leaders.map((leader: any, idx: number) => (
                                    <div key={idx} className="bg-black/40 p-3 rounded-lg border-l-2 border-yellow-500 hover:bg-yellow-900/10 transition-colors">
                                        <p className="text-sm font-bold text-white">{leader.name || leader.nama}</p>
                                        <div className="flex justify-between items-start mt-1">
                                            <p className="text-xs text-gray-400 italic">{leader.note || leader.catatan}</p>
                                            <span className="text-[10px] text-neon-gold border border-yellow-500/30 px-1.5 py-0.5 rounded">{leader.period || leader.periode}</span>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                )}

                {/* Key Events */}
                {era.key_events && (
                    <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-neon-blue font-cyberpunk text-sm uppercase">
                            <ScrollText className="w-4 h-4" /> Peristiwa Penting
                        </h3>
                        <div className="relative pl-4 border-l border-cyan-500/30 space-y-4">
                            {(() => {
                                let events: any[] = [];
                                try {
                                    events = typeof era.key_events === 'string' ? JSON.parse(era.key_events) : era.key_events;
                                    if (!Array.isArray(events)) events = [events];
                                } catch (e) { events = [] }

                                return events.map((ev: any, idx: number) => (
                                    <div key={idx} className="relative group">
                                        <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_#0ff] group-hover:scale-125 transition-transform"></div>
                                        <div className="bg-blue-900/10 p-2 rounded border border-blue-500/10 group-hover:border-blue-500/40 transition-colors">
                                            <span className="text-xs font-bold text-cyan-400 block mb-0.5">{ev.year || ev.tahun}</span>
                                            <p className="text-sm text-gray-200">{ev.event || ev.kejadian || ev.event_name}</p>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                )}

                {/* Relics */}
                {era.relics && (
                    <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-purple-400 font-cyberpunk text-sm uppercase">
                            <Landmark className="w-4 h-4" /> Peninggalan
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {(() => {
                                let relics: any[] = [];
                                try {
                                    relics = typeof era.relics === 'string' ? JSON.parse(era.relics) : era.relics;
                                    if (!Array.isArray(relics)) relics = [relics];
                                } catch (e) { relics = [] }

                                return relics.map((relic: any, idx: number) => (
                                    <div key={idx} className="bg-purple-900/10 p-3 rounded-lg border border-purple-500/20 flex gap-3 hover:border-purple-500/50 transition-colors">
                                        {relic.image && (
                                            <div className="w-16 h-16 relative rounded-md overflow-hidden border border-purple-500/30 flex-shrink-0 bg-purple-900/20">
                                                <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>
                                                <Image
                                                    src={relic.image}
                                                    alt={relic.name || relic.nama}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                    unoptimized
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-purple-300 mb-1">{relic.name || relic.nama}</h4>
                                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{relic.description || relic.deskripsi}</p>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                )}

                <AiButton eraId={era.id} />

                <div className="h-10"></div> {/* Spacer */}
            </div>
        </div>
    );
}

import axios from 'axios';

// API Endpoints
const PRAYER_API_BASE = 'https://api.aladhan.com/v1';
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const EQURAN_API_BASE = 'https://equran.id/api/v2';

export interface PrayerTimesData {
    timings: {
        Fajr: string;
        Sunrise: string;
        Dhuhr: string;
        Asr: string;
        Maghrib: string;
        Isha: string;
        [key: string]: string;
    };
    date: {
        readable: string;
        timestamp: string;
        gregorian: {
            date: string;
            format: string;
            day: string;
            weekday: { en: string };
            month: { number: number; en: string };
            year: string;
        };
        hijri: {
            date: string;
            format: string;
            day: string;
            weekday: { en: string; ar: string };
            month: { number: number; en: string; ar: string };
            year: string;
        };
    };
}

/**
 * Fetch Hijri Calendar and Prayer Times for a specific month
 */
export async function fetchHijriCalendar(year: number, month: number, lat: number, lng: number): Promise<PrayerTimesData[]> {
    try {
        const response = await axios.get(`${PRAYER_API_BASE}/calendar/${year}/${month}`, {
            params: {
                latitude: lat,
                longitude: lng,
                method: 20, // Kemenag / Egyptian authority often used as standard
                shafaq: 'general',
                tune: '0,0,0,0,0,0,0,0,0', // Adjustments if needed
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching calendar:', error);
        throw error;
    }
}

/**
 * Reverse Geocoding to get City Name from Coordinates
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        const response = await axios.get(`${NOMINATIM_BASE}/reverse`, {
            params: {
                format: 'json',
                lat: lat,
                lon: lng,
                zoom: 10,
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'AI-Islami-App/1.0' // Good practice for OSM
            }
        });

        const address = response.data.address;
        return address.city || address.town || address.village || address.county || "Lokasi Saya";
    } catch (error) {
        console.error('Error reverse geocoding:', error);
        return "Lokasi Saya";
    }
}
/**
 * Fetch all surahs from equran.id
 */
export async function fetchAllSurahs() {
    try {
        const response = await axios.get(`${EQURAN_API_BASE}/surat`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching all surahs:', error);
        throw error;
    }
}

/**
 * Fetch surah detail from equran.id
 */
export async function fetchSurahDetail(nomor: number) {
    try {
        const response = await axios.get(`${EQURAN_API_BASE}/surat/${nomor}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching surah detail for ${nomor}:`, error);
        throw error;
    }
}

/**
 * Fetch surah tafsir from equran.id
 */
export async function fetchSurahTafsir(nomor: number) {
    try {
        const response = await axios.get(`${EQURAN_API_BASE}/tafsir/${nomor}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching tafsir for ${nomor}:`, error);
        throw error;
    }
}

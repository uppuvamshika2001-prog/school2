'use client';

import { useState, useEffect } from 'react';
import {
    Bus,
    MapPin,
    Clock,
    Navigation,
    AlertCircle,
    Phone,
    User,
    Gauge,
    Timer,
    Bell,
    Home,
    School,
    CheckCircle,
    Radio,
    AlertTriangle,
    Shield,
} from 'lucide-react';
import { toast } from 'sonner';

// Student-specific bus data
interface BusStop {
    id: string;
    name: string;
    lat: number;
    lng: number;
    eta: string;
    status: 'completed' | 'current' | 'upcoming';
    isMyStop: boolean;
}

interface StudentBusData {
    busNumber: string;
    routeName: string;
    myBoardingPoint: string;
    myStatus: 'waiting' | 'boarded' | 'alighted';
    boardingTime?: string;
    alightingTime?: string;
    currentLocation: { lat: number; lng: number; address: string };
    speed: number;
    direction: string;
    lastUpdated: Date;
    driver: {
        name: string;
        phone: string;
        photo: string;
    };
    cleaner: {
        name: string;
        phone: string;
        photo: string;
    };
    tripType: 'home-to-school' | 'school-to-home';
    stops: BusStop[];
    etaToMyStop: string;
    distanceToMyStop: string;
}

// Mock student bus data
const mockStudentBus: StudentBusData = {
    busNumber: 'DL-01-AB-1234',
    routeName: 'Route A - North Delhi',
    myBoardingPoint: 'Model Town',
    myStatus: 'waiting',
    currentLocation: {
        lat: 28.7041,
        lng: 77.1025,
        address: 'Pitampura Metro Station, New Delhi',
    },
    speed: 32,
    direction: 'Northeast',
    lastUpdated: new Date(),
    driver: {
        name: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        photo: '👨‍✈️',
    },
    cleaner: {
        name: 'Sunita Devi',
        phone: '+91 98765 43211',
        photo: '👩',
    },
    tripType: 'home-to-school',
    stops: [
        { id: '1', name: 'Rohini Sector 7', lat: 28.7041, lng: 77.1025, eta: 'Completed', status: 'completed', isMyStop: false },
        { id: '2', name: 'Pitampura Metro', lat: 28.6942, lng: 77.1314, eta: 'Current Location', status: 'current', isMyStop: false },
        { id: '3', name: 'Model Town', lat: 28.7196, lng: 77.1910, eta: '5 mins', status: 'upcoming', isMyStop: true },
        { id: '4', name: 'Civil Lines', lat: 28.6769, lng: 77.2220, eta: '15 mins', status: 'upcoming', isMyStop: false },
        { id: '5', name: 'School Campus', lat: 28.6139, lng: 77.2090, eta: '25 mins', status: 'upcoming', isMyStop: false },
    ],
    etaToMyStop: '5 minutes',
    distanceToMyStop: '2.3 km',
};

export default function StudentBusTrackingPage() {
    const [busData, setBusData] = useState<StudentBusData>(mockStudentBus);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notificationSent, setNotificationSent] = useState(false);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Simulate real-time bus updates
    useEffect(() => {
        const interval = setInterval(() => {
            setBusData(prev => ({
                ...prev,
                speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 10),
                lastUpdated: new Date(),
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Send notification when bus is approaching
    useEffect(() => {
        if (busData.etaToMyStop === '5 minutes' && !notificationSent) {
            toast.info('🚌 Bus Approaching!', {
                description: `Your bus will arrive at ${busData.myBoardingPoint} in 5 minutes. Please be ready!`,
                duration: 10000,
            });
            setNotificationSent(true);
        }
    }, [busData.etaToMyStop, busData.myBoardingPoint, notificationSent]);

    const handleEmergencySOS = () => {
        toast.error('🚨 Emergency Alert Sent!', {
            description: 'Your parents and school have been notified immediately.',
            duration: 5000,
        });
    };

    const myStop = busData.stops.find(s => s.isMyStop);

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20 p-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-100 via-blue-100 to-indigo-100 dark:from-sky-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl shadow-lg border border-sky-200 dark:border-sky-800">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 text-sky-800 dark:text-sky-200">
                            <Bus className="w-8 h-8" />
                            My Bus Tracker
                        </h1>
                        <p className="text-sky-700 dark:text-sky-300 mt-2">
                            Track your school bus in real-time
                        </p>
                    </div>
                    <button
                        onClick={handleEmergencySOS}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg animate-pulse"
                    >
                        <AlertTriangle className="w-5 h-5" />
                        Emergency SOS
                    </button>
                </div>
            </div>

            {/* My Bus Status - Prominent Card */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 p-6 rounded-2xl shadow-lg border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                            <Bus className="w-8 h-8 text-emerald-700 dark:text-emerald-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{busData.busNumber}</h2>
                            <p className="text-emerald-700 dark:text-emerald-300">{busData.routeName}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">My Boarding Point</p>
                        <p className="text-xl font-bold text-emerald-800 dark:text-emerald-200">{busData.myBoardingPoint}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-white/60 dark:bg-emerald-900/30 backdrop-blur-sm p-4 rounded-xl border border-emerald-200 dark:border-emerald-700">
                        <div className="flex items-center gap-2 mb-2">
                            <Timer className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">ETA</p>
                        </div>
                        <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{busData.etaToMyStop}</p>
                    </div>
                    <div className="bg-white/60 dark:bg-emerald-900/30 backdrop-blur-sm p-4 rounded-xl border border-emerald-200 dark:border-emerald-700">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">Distance</p>
                        </div>
                        <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{busData.distanceToMyStop}</p>
                    </div>
                    <div className="bg-white/60 dark:bg-emerald-900/30 backdrop-blur-sm p-4 rounded-xl border border-emerald-200 dark:border-emerald-700">
                        <div className="flex items-center gap-2 mb-2">
                            <Gauge className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">Speed</p>
                        </div>
                        <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{Math.round(busData.speed)} km/h</p>
                    </div>
                    <div className="bg-white/60 dark:bg-emerald-900/30 backdrop-blur-sm p-4 rounded-xl border border-emerald-200 dark:border-emerald-700">
                        <div className="flex items-center gap-2 mb-2">
                            <Navigation className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">Direction</p>
                        </div>
                        <p className="text-xl font-bold text-emerald-800 dark:text-emerald-200">{busData.direction}</p>
                    </div>
                </div>
            </div>

            {/* My Status Card */}
            <div className="bg-card rounded-xl border shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    My Boarding Status
                </h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${busData.myStatus === 'boarded' ? 'bg-green-100 dark:bg-green-900/30' :
                            busData.myStatus === 'waiting' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                'bg-blue-100 dark:bg-blue-900/30'
                            }`}>
                            {busData.myStatus === 'boarded' ? '✓' :
                                busData.myStatus === 'waiting' ? '⏳' : '↓'}
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Current Status</p>
                            <p className="text-2xl font-bold capitalize">
                                {busData.myStatus === 'boarded' ? 'On Board' :
                                    busData.myStatus === 'waiting' ? 'Waiting at Stop' :
                                        'Reached Destination'}
                            </p>
                            {busData.boardingTime && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Boarded at: {busData.boardingTime}
                                </p>
                            )}
                        </div>
                    </div>
                    {busData.myStatus === 'waiting' && (
                        <div className="text-right">
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-lg">
                                <p className="text-sm font-medium">Bus arriving in</p>
                                <p className="text-3xl font-bold">{busData.etaToMyStop}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Map & Route */}
                <div className="lg:col-span-2 space-y-6">
                    {/* GPS Map Placeholder */}
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-muted/50">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Live Bus Location
                            </h3>
                        </div>
                        <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                        <Bus className="w-16 h-16 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-lg font-semibold">Bus: {busData.busNumber}</p>
                                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {busData.currentLocation.address}
                                        </p>
                                        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                                            <span>Lat: {busData.currentLocation.lat.toFixed(4)}</span>
                                            <span>Lng: {busData.currentLocation.lng.toFixed(4)}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Updated: {busData.lastUpdated.toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg inline-block">
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            🗺️ Live map with route will be displayed here
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Route Progress */}
                    <div className="bg-card rounded-xl border shadow-sm">
                        <div className="p-4 border-b bg-muted/50">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold flex items-center gap-2">
                                    {busData.tripType === 'home-to-school' ? (
                                        <>
                                            <Home className="w-5 h-5 text-primary" />
                                            Home to School
                                        </>
                                    ) : (
                                        <>
                                            <School className="w-5 h-5 text-primary" />
                                            School to Home
                                        </>
                                    )}
                                </h3>
                                <span className="text-sm text-muted-foreground">
                                    {currentTime.toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {busData.stops.map((stop, index) => (
                                    <div key={stop.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${stop.isMyStop ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 ring-4 ring-purple-300 dark:ring-purple-700' :
                                                stop.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    stop.status === 'current' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' :
                                                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                                }`}>
                                                {stop.isMyStop ? <Home className="w-6 h-6" /> :
                                                    stop.status === 'completed' ? <CheckCircle className="w-6 h-6" /> :
                                                        stop.status === 'current' ? <Radio className="w-6 h-6" /> :
                                                            index + 1}
                                            </div>
                                            {index < busData.stops.length - 1 && (
                                                <div className={`w-0.5 h-16 ${stop.status === 'completed' ? 'bg-green-300 dark:bg-green-700' : 'bg-gray-300 dark:bg-gray-700'
                                                    }`} />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-semibold">{stop.name}</h4>
                                                        {stop.isMyStop && (
                                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-bold rounded-full">
                                                                MY STOP
                                                            </span>
                                                        )}
                                                    </div>
                                                    {stop.status === 'current' && (
                                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                                                            Bus is here now
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stop.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    stop.status === 'current' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                                    }`}>
                                                    {stop.eta}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Staff & Alerts */}
                <div className="space-y-6">
                    {/* Driver Information */}
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                            <h3 className="font-semibold flex items-center gap-2 text-blue-800 dark:text-blue-200">
                                <User className="w-5 h-5 text-blue-700 dark:text-blue-300" />
                                Bus Driver
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center text-3xl border-2 border-blue-200 dark:border-blue-700">
                                    {busData.driver.photo}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg">{busData.driver.name}</h4>
                                    <div className="space-y-2 mt-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <a href={`tel:${busData.driver.phone}`} className="text-primary hover:underline">
                                                {busData.driver.phone}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Shield className="w-4 h-4" />
                                            <span>Licensed Driver</span>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Call Driver
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cleaner Information */}
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
                            <h3 className="font-semibold flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                                <User className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                                Bus Attendant
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center text-3xl border-2 border-emerald-200 dark:border-emerald-700">
                                    {busData.cleaner.photo}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg">{busData.cleaner.name}</h4>
                                    <div className="space-y-2 mt-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <a href={`tel:${busData.cleaner.phone}`} className="text-primary hover:underline">
                                                {busData.cleaner.phone}
                                            </a>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Call Attendant
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Important Alerts */}
                    <div className="bg-card rounded-xl border shadow-sm">
                        <div className="p-4 border-b bg-muted/50">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary" />
                                Important Alerts
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {busData.myStatus === 'waiting' && (
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    <div className="flex items-start gap-2">
                                        <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                                                Bus Approaching!
                                            </p>
                                            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                                Your bus will arrive at {busData.myBoardingPoint} in {busData.etaToMyStop}. Please be ready!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                            Current Location
                                        </p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                            Bus is at {busData.currentLocation.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                            On Schedule
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                            Bus is running on time
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Safety Tips */}
                    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 p-6 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800">
                        <h3 className="font-semibold mb-3 flex items-center gap-2 text-purple-800 dark:text-purple-200">
                            <Shield className="w-5 h-5 text-purple-700 dark:text-purple-300" />
                            Safety Reminder
                        </h3>
                        <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-600 dark:text-purple-400">•</span>
                                <span>Always wait at your designated stop</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-white">•</span>
                                <span>Stay seated while the bus is moving</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-white">•</span>
                                <span>Use the Emergency SOS button if needed</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-white">•</span>
                                <span>Follow the driver's instructions</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

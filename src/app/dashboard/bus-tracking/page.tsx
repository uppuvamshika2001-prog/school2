'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Bus,
    MapPin,
    Clock,
    Navigation,
    AlertCircle,
    Phone,
    Users,
    Gauge,
    Calendar,
    Bell,
    User,
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Radio,
    Route,
    Timer,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock bus data
interface Student {
    id: string;
    name: string;
    rollNo: string;
    boardingPoint: string;
    status: 'boarded' | 'waiting' | 'alighted';
    boardingTime?: string;
    alightingTime?: string;
}

interface BusStop {
    id: string;
    name: string;
    lat: number;
    lng: number;
    eta: string;
    status: 'completed' | 'current' | 'upcoming';
    studentsCount: number;
}

interface BusData {
    busNumber: string;
    routeName: string;
    currentLocation: { lat: number; lng: number; address: string };
    speed: number;
    direction: string;
    lastUpdated: Date;
    driver: {
        name: string;
        phone: string;
        licenseNo: string;
        photo: string;
    };
    cleaner: {
        name: string;
        phone: string;
        photo: string;
    };
    capacity: number;
    studentsOnBoard: number;
    tripType: 'home-to-school' | 'school-to-home';
    stops: BusStop[];
    students: Student[];
}

const mockBuses: BusData[] = [
    {
        busNumber: 'DL-01-AB-1234',
        routeName: 'Route A - North Delhi',
        currentLocation: {
            lat: 28.7041,
            lng: 77.1025,
            address: 'Connaught Place, New Delhi',
        },
        speed: 35,
        direction: 'Northeast',
        lastUpdated: new Date(),
        driver: {
            name: 'Rajesh Kumar',
            phone: '+91 98765 43210',
            licenseNo: 'DL-0320210012345',
            photo: '👨‍✈️',
        },
        cleaner: {
            name: 'Sunita Devi',
            phone: '+91 98765 43211',
            photo: '👩',
        },
        capacity: 40,
        studentsOnBoard: 28,
        tripType: 'home-to-school',
        stops: [
            { id: '1', name: 'Rohini Sector 7', lat: 28.7041, lng: 77.1025, eta: 'Completed', status: 'completed', studentsCount: 8 },
            { id: '2', name: 'Pitampura Metro', lat: 28.6942, lng: 77.1314, eta: 'Completed', status: 'completed', studentsCount: 6 },
            { id: '3', name: 'Model Town', lat: 28.7196, lng: 77.1910, eta: '5 mins', status: 'current', studentsCount: 7 },
            { id: '4', name: 'Civil Lines', lat: 28.6769, lng: 77.2220, eta: '15 mins', status: 'upcoming', studentsCount: 5 },
            { id: '5', name: 'School Campus', lat: 28.6139, lng: 77.2090, eta: '25 mins', status: 'upcoming', studentsCount: 2 },
        ],
        students: [
            { id: '1', name: 'Aarav Sharma', rollNo: '101', boardingPoint: 'Rohini Sector 7', status: 'boarded', boardingTime: '07:15 AM' },
            { id: '2', name: 'Aditi Patel', rollNo: '102', boardingPoint: 'Rohini Sector 7', status: 'boarded', boardingTime: '07:15 AM' },
            { id: '3', name: 'Arjun Singh', rollNo: '103', boardingPoint: 'Pitampura Metro', status: 'boarded', boardingTime: '07:25 AM' },
            { id: '4', name: 'Diya Gupta', rollNo: '104', boardingPoint: 'Model Town', status: 'waiting' },
            { id: '5', name: 'Ishaan Kumar', rollNo: '105', boardingPoint: 'Model Town', status: 'waiting' },
        ],
    },
    {
        busNumber: 'DL-01-CD-5678',
        routeName: 'Route B - South Delhi',
        currentLocation: {
            lat: 28.5355,
            lng: 77.3910,
            address: 'Saket, New Delhi',
        },
        speed: 28,
        direction: 'North',
        lastUpdated: new Date(),
        driver: {
            name: 'Amit Verma',
            phone: '+91 98765 43212',
            licenseNo: 'DL-0320210012346',
            photo: '👨‍✈️',
        },
        cleaner: {
            name: 'Rekha Sharma',
            phone: '+91 98765 43213',
            photo: '👩',
        },
        capacity: 35,
        studentsOnBoard: 22,
        tripType: 'home-to-school',
        stops: [
            { id: '1', name: 'Hauz Khas', lat: 28.5494, lng: 77.2001, eta: 'Completed', status: 'completed', studentsCount: 6 },
            { id: '2', name: 'Green Park', lat: 28.5595, lng: 77.2066, eta: '8 mins', status: 'current', studentsCount: 8 },
            { id: '3', name: 'INA Market', lat: 28.5678, lng: 77.2167, eta: '18 mins', status: 'upcoming', studentsCount: 5 },
            { id: '4', name: 'School Campus', lat: 28.6139, lng: 77.2090, eta: '30 mins', status: 'upcoming', studentsCount: 3 },
        ],
        students: [
            { id: '6', name: 'Kavya Reddy', rollNo: '106', boardingPoint: 'Hauz Khas', status: 'boarded', boardingTime: '07:20 AM' },
            { id: '7', name: 'Mira Nair', rollNo: '107', boardingPoint: 'Green Park', status: 'waiting' },
        ],
    },
];

export default function BusTrackingPage() {
    const [selectedBus, setSelectedBus] = useState<BusData>(mockBuses[0]);
    const [showSOS, setShowSOS] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedBus(prev => ({
                ...prev,
                speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 10),
                lastUpdated: new Date(),
            }));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSOS = () => {
        setShowSOS(true);
        toast.error('🚨 EMERGENCY SOS ACTIVATED!', {
            description: 'Parents and school administration have been notified immediately.',
            duration: 5000,
        });
        // In real implementation, this would trigger actual emergency protocols
    };

    const handleStudentBoarding = (studentId: string) => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        setSelectedBus(prev => ({
            ...prev,
            students: prev.students.map(s =>
                s.id === studentId
                    ? { ...s, status: 'boarded' as const, boardingTime: timeStr }
                    : s
            ),
            studentsOnBoard: prev.studentsOnBoard + 1,
        }));

        const student = selectedBus.students.find(s => s.id === studentId);
        toast.success(`✅ ${student?.name} boarded the bus`, {
            description: `Time: ${timeStr} | Stop: ${student?.boardingPoint}`,
        });
    };

    const nextStop = selectedBus.stops.find(s => s.status === 'current' || s.status === 'upcoming');

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20 p-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 rounded-2xl shadow-xl text-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Bus className="w-8 h-8" />
                            Live Bus Tracking
                        </h1>
                        <p className="text-white/90 mt-2">
                            Real-time monitoring of school buses with GPS tracking
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-sm text-white"
                            value={selectedBus.busNumber}
                            onChange={(e) => {
                                const bus = mockBuses.find(b => b.busNumber === e.target.value);
                                if (bus) setSelectedBus(bus);
                            }}
                        >
                            {mockBuses.map(bus => (
                                <option key={bus.busNumber} value={bus.busNumber} className="text-gray-900">
                                    {bus.busNumber} - {bus.routeName}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleSOS}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg animate-pulse"
                        >
                            <AlertTriangle className="w-5 h-5" />
                            SOS
                        </button>
                    </div>
                </div>
            </div>

            {/* SOS Alert Modal */}
            {showSOS && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-2xl p-6 max-w-md w-full border-4 border-red-500 shadow-2xl">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">EMERGENCY SOS ACTIVATED</h2>
                            <p className="text-muted-foreground mb-6">
                                Emergency alert has been sent to:
                            </p>
                            <div className="space-y-2 text-left bg-muted/50 p-4 rounded-lg mb-6">
                                <p className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    All parents notified via SMS
                                </p>
                                <p className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    School administration alerted
                                </p>
                                <p className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Emergency services contacted
                                </p>
                                <p className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    GPS location shared
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSOS(false)}
                                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bus Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Current Speed</p>
                            <h3 className="text-4xl font-bold mt-1">{Math.round(selectedBus.speed)}</h3>
                            <p className="text-white/80 text-sm">km/h</p>
                        </div>
                        <Gauge className="w-12 h-12 text-white/30" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Students On Board</p>
                            <h3 className="text-4xl font-bold mt-1">{selectedBus.studentsOnBoard}/{selectedBus.capacity}</h3>
                            <p className="text-white/80 text-sm">Capacity</p>
                        </div>
                        <Users className="w-12 h-12 text-white/30" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Direction</p>
                            <h3 className="text-2xl font-bold mt-1">{selectedBus.direction}</h3>
                            <p className="text-white/80 text-sm">Heading</p>
                        </div>
                        <Navigation className="w-12 h-12 text-white/30" />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/80 text-sm font-medium">ETA to Next Stop</p>
                            <h3 className="text-2xl font-bold mt-1">{nextStop?.eta || 'N/A'}</h3>
                            <p className="text-white/80 text-sm">{nextStop?.name || 'No stops'}</p>
                        </div>
                        <Timer className="w-12 h-12 text-white/30" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Map & Location */}
                <div className="lg:col-span-2 space-y-6">
                    {/* GPS Map Placeholder */}
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-muted/50">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Live GPS Tracking
                            </h3>
                        </div>
                        <div className="relative h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
                            {/* Map Placeholder - In production, integrate Google Maps or Mapbox */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                        <Bus className="w-16 h-16 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-lg font-semibold">Bus: {selectedBus.busNumber}</p>
                                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {selectedBus.currentLocation.address}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Lat: {selectedBus.currentLocation.lat.toFixed(4)},
                                            Lng: {selectedBus.currentLocation.lng.toFixed(4)}
                                        </p>
                                        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            Last updated: {selectedBus.lastUpdated.toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg inline-block">
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            🗺️ Map integration with Google Maps/Mapbox will show live route here
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Route Timeline */}
                    <div className="bg-card rounded-xl border shadow-sm">
                        <div className="p-4 border-b bg-muted/50">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Route className="w-5 h-5 text-primary" />
                                Route Progress - {selectedBus.tripType === 'home-to-school' ? 'Home to School' : 'School to Home'}
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {selectedBus.stops.map((stop, index) => (
                                    <div key={stop.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${stop.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    stop.status === 'current' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' :
                                                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                                }`}>
                                                {stop.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                                                    stop.status === 'current' ? <Radio className="w-5 h-5" /> :
                                                        index + 1}
                                            </div>
                                            {index < selectedBus.stops.length - 1 && (
                                                <div className={`w-0.5 h-16 ${stop.status === 'completed' ? 'bg-green-300 dark:bg-green-700' : 'bg-gray-300 dark:bg-gray-700'
                                                    }`} />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-8">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold">{stop.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {stop.studentsCount} student{stop.studentsCount !== 1 ? 's' : ''}
                                                    </p>
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

                    {/* Students List */}
                    <div className="bg-card rounded-xl border shadow-sm">
                        <div className="p-4 border-b bg-muted/50">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Students Tracking ({selectedBus.students.length} total)
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground font-medium">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Student</th>
                                        <th className="px-6 py-4 text-left">Roll No</th>
                                        <th className="px-6 py-4 text-left">Boarding Point</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Time</th>
                                        <th className="px-6 py-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm">
                                    {selectedBus.students.map((student) => (
                                        <tr key={student.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4 font-medium">{student.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{student.rollNo}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{student.boardingPoint}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === 'boarded' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        student.status === 'waiting' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                    {student.status === 'boarded' ? '✓ Boarded' :
                                                        student.status === 'waiting' ? '⏳ Waiting' :
                                                            '↓ Alighted'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-muted-foreground">
                                                {student.boardingTime || student.alightingTime || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {student.status === 'waiting' && (
                                                    <button
                                                        onClick={() => handleStudentBoarding(student.id)}
                                                        className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90"
                                                    >
                                                        Mark Boarded
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column - Staff Info & Alerts */}
                <div className="space-y-6">
                    {/* Driver Information */}
                    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                            <h3 className="font-semibold flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Driver Information
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl">
                                    {selectedBus.driver.photo}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg">{selectedBus.driver.name}</h4>
                                    <div className="space-y-2 mt-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <a href={`tel:${selectedBus.driver.phone}`} className="text-primary hover:underline">
                                                {selectedBus.driver.phone}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Shield className="w-4 h-4" />
                                            <span>{selectedBus.driver.licenseNo}</span>
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
                        <div className="p-4 border-b bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                            <h3 className="font-semibold flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Cleaner Information
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl">
                                    {selectedBus.cleaner.photo}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-lg">{selectedBus.cleaner.name}</h4>
                                    <div className="space-y-2 mt-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <a href={`tel:${selectedBus.cleaner.phone}`} className="text-primary hover:underline">
                                                {selectedBus.cleaner.phone}
                                            </a>
                                        </div>
                                    </div>
                                    <button className="mt-4 w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 flex items-center justify-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Call Cleaner
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bus Details */}
                    <div className="bg-card rounded-xl border shadow-sm">
                        <div className="p-4 border-b bg-muted/50">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Bus className="w-5 h-5 text-primary" />
                                Bus Details
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Bus Number</span>
                                <span className="font-semibold">{selectedBus.busNumber}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Route</span>
                                <span className="font-semibold">{selectedBus.routeName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Trip Type</span>
                                <span className="font-semibold capitalize">{selectedBus.tripType.replace('-', ' ')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Capacity</span>
                                <span className="font-semibold">{selectedBus.capacity} students</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Current Time</span>
                                <span className="font-semibold">{currentTime.toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Alerts */}
                    <div className="bg-card rounded-xl border shadow-sm">
                        <div className="p-4 border-b bg-muted/50">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary" />
                                Recent Alerts
                            </h3>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                            Student Boarded
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                            Aarav Sharma boarded at Rohini Sector 7 - 07:15 AM
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                            Approaching Stop
                                        </p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                            Bus arriving at Model Town in 5 minutes
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                                            Speed Alert
                                        </p>
                                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                            Bus exceeded speed limit - 07:10 AM
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

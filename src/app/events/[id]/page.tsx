
'use client';

import { useParams } from 'next/navigation';
import { events, setEventStatus } from '@/lib/events-data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Users, Map, Clock, Upload, Download, Save, Play, Pause, XCircle, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function EventDetailPage() {
    const params = useParams();
    const eventId = parseInt(params.id as string, 10);
    const event = events.find(e => e.id === eventId);

    if (!event) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold">Event not found</h1>
                <Link href="/events">
                    <Button variant="link">Back to events</Button>
                </Link>
            </div>
        );
    }
    
    const handleCloseEvent = () => {
        setEventStatus(eventId, 'concluded');
        // In a real app, you might navigate away or show a success message
    }
    
    const handlePauseEvent = () => {
        const newStatus = event.status === 'paused' ? 'ongoing' : 'paused';
        setEventStatus(eventId, newStatus);
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div>
                <Link href="/events" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Events
                </Link>
                <h1 className="text-4xl font-bold tracking-tight">{event.name}</h1>
                <p className="text-muted-foreground">
                    From {new Date(event.startDate).toLocaleDateString()} to {new Date(event.endDate).toLocaleDateString()}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Map className="h-5 w-5"/> Live Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                                <p className="text-muted-foreground">Map placeholder</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5"/> Hashtag Media</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex gap-2">
                                <Button variant="outline" className="w-full"><Plus className="mr-2"/>Upload Media</Button>
                                <Button variant="outline" size="icon" title="Download All"><Download/></Button>
                                <Button variant="outline" size="icon" title="Save All to Memory Bank"><Save/></Button>
                            </div>
                             <div className="text-center text-sm text-muted-foreground py-8">
                                No media uploaded yet.
                             </div>
                        </CardContent>
                    </Card>

                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Attendees</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Placeholder for attendees */}
                            <p className="text-sm text-muted-foreground">Attendee list functionality coming soon.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5"/> Time to Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Placeholder for time to location */}
                            <p className="text-sm text-muted-foreground">Time tracking functionality coming soon.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Event Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button variant="outline" onClick={handlePauseEvent}>
                                {event.status === 'paused' ? <Play className="mr-2"/> : <Pause className="mr-2"/>}
                                {event.status === 'paused' ? 'Resume Event' : 'Pause Event'}
                            </Button>
                            <Button variant="destructive" onClick={handleCloseEvent}>
                                <XCircle className="mr-2"/>
                                Close Event
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

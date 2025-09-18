
'use client';

import { useParams } from 'next/navigation';
import { events, setEventStatus } from '@/lib/events-data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Users, Map, Clock, Upload, Download, Save, Play, Pause, XCircle, Plus, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const MapPlaceholder = ({ location }: { location: string }) => (
    <div className="aspect-video bg-muted rounded-md flex flex-col items-center justify-center text-center p-4">
        <Map className="h-12 w-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground font-semibold text-lg">{location}</p>
        <p className="text-muted-foreground text-sm">Live map placeholder</p>
        <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm">Open in Google Maps</Button>
            <Button variant="outline" size="sm">Open in Apple Maps</Button>
        </div>
    </div>
);


export default function EventDetailPage() {
    const params = useParams();
    const eventId = parseInt(params.id as string, 10);
    const event = events.find(e => e.id === eventId);
    const [isConveneOpen, setIsConveneOpen] = useState(false);

    if (!event) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold">Event not found</h1>
                <Link href="/circles">
                    <Button variant="link">Back to Circles</Button>
                </Link>
            </div>
        );
    }
    
    const handleCloseEvent = () => {
        setEventStatus(eventId, 'concluded');
    }
    
    const handlePauseEvent = () => {
        const newStatus = event.status === 'paused' ? 'ongoing' : 'paused';
        setEventStatus(eventId, newStatus);
    }

    const mockCircles = [
        { id: 1, name: "Project Team", members: ["Alice", "Bob", "Charlie"] },
        { id: 2, name: "Close Friends", members: ["David", "Eve"] },
    ];

    const mockMembers = ["Frank", "Grace", "Heidi"];

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div>
                <Link href="/circles" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Circles
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">{event.name}</h1>
                        <p className="text-muted-foreground">
                            From {new Date(event.startDate).toLocaleDateString()} to {new Date(event.endDate).toLocaleDateString()}
                        </p>
                    </div>
                     <Badge className={event.status === 'ongoing' ? 'bg-green-500' : event.status === 'paused' ? 'bg-yellow-500' : ''}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Map className="h-5 w-5"/> Live Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MapPlaceholder location={event.location} />
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5"/> Attendees</CardTitle>
                             <Button variant="outline" size="sm" onClick={() => setIsConveneOpen(true)}><Plus className="mr-2 h-4 w-4"/>Add</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             {event.attendees.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                {event.attendees.map(attendee => (
                                    <div key={attendee} className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                             <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${attendee}`} />
                                            <AvatarFallback>{attendee.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{attendee}</span>
                                    </div>
                                ))}
                                </div>
                             ) : (
                                <div className="text-center text-sm text-muted-foreground py-8">
                                    No attendees invited yet.
                                </div>
                             )}
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
                            <CardTitle>Event Controls</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button variant="outline" onClick={handlePauseEvent} disabled={event.status === 'concluded'}>
                                {event.status === 'paused' ? <Play className="mr-2"/> : <Pause className="mr-2"/>}
                                {event.status === 'paused' ? 'Resume Event' : 'Pause Event'}
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={event.status === 'concluded'}>
                                        <XCircle className="mr-2"/>
                                        Close Event
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>This will conclude the event. This action cannot be undone.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleCloseEvent}>Confirm & Close</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5"/> Time to Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Time tracking functionality coming soon.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isConveneOpen} onOpenChange={setIsConveneOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Convene Attendees</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6 py-4">
                        <div>
                            <h3 className="font-semibold mb-2">Invite Circles</h3>
                            <div className="space-y-2">
                                {mockCircles.map(circle => (
                                    <div key={circle.id} className="flex items-center gap-3 p-2 rounded-md border">
                                        <Checkbox id={`circle-${circle.id}`}/>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://picsum.photos/seed/${circle.id}/100`} />
                                            <AvatarFallback>{circle.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <Label htmlFor={`circle-${circle.id}`} className="font-medium">{circle.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-2">Invite Members</h3>
                             <div className="space-y-2">
                                {mockMembers.map(member => (
                                    <div key={member} className="flex items-center gap-3 p-2 rounded-md border">
                                        <Checkbox id={`member-${member}`}/>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${member}`} />
                                            <AvatarFallback>{member.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <Label htmlFor={`member-${member}`} className="font-medium">{member}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => setIsConveneOpen(false)}>Cancel</Button>
                        <Button>Send Invites</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

    
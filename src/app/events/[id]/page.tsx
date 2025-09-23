
'use client';

import { useParams } from 'next/navigation';
import { events, setEventStatus } from '@/lib/events-data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Users, Map, Clock, Upload, Download, Save, Play, Pause, XCircle, Plus, Mail, Pin, Route, Navigation } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Image from 'next/image';


const EventMap = ({ event }: { event: any }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    const mapStyles = [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
        { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
        { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
        { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
        { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
    ];
    
    useEffect(() => {
        const initMap = () => {
            if (!mapRef.current || !window.google || !window.google.maps || !event.locationData) return;
            
            class CustomMarker extends window.google.maps.OverlayView {
                private latlng: google.maps.LatLng;
                private imageSrc: string;
                private div: HTMLDivElement | null;
                private listeners: google.maps.MapsEventListener[];

                constructor(latlng: google.maps.LatLng, imageSrc: string, map: google.maps.Map) {
                    super();
                    this.latlng = latlng;
                    this.imageSrc = imageSrc;
                    this.div = null;
                    this.listeners = [];
                    this.setMap(map);
                }

                onAdd() {
                    const div = document.createElement("div");
                    div.style.position = "absolute";
                    div.style.transform = "translate(-50%, -100%)";
                    div.innerHTML = `
                        <div style="position: relative; width: 56px; height: 56px; transform-origin: bottom center;">
                            <div style="position: absolute; inset: 0; background-color: hsl(var(--primary) / 0.3); border-radius: 50%; animation: pulse 2s infinite; transform: scale(1.2);"></div>
                            <img src="${this.imageSrc}" style="width: 48px; height: 48px; border-radius: 50%; border: 4px solid hsl(var(--primary)); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                        </div>
                        <style>
                            @keyframes pulse {
                                0% { transform: scale(1); opacity: 0.7; }
                                70% { transform: scale(1.8); opacity: 0; }
                                100% { transform: scale(1); opacity: 0; }
                            }
                        </style>
                    `;
                    this.div = div;
                    const panes = this.getPanes()!;
                    panes.floatPane.appendChild(div);

                    this.listeners.push(
                        google.maps.event.addDomListener(this.div, "click", (e) => {
                            google.maps.event.trigger(this, "click", e);
                        })
                    );
                }

                draw() {
                    const overlayProjection = this.getProjection();
                    if (!overlayProjection || !this.div) return;
                    const sw = overlayProjection.fromLatLngToDivPixel(this.latlng)!;
                    this.div.style.left = sw.x + "px";
                    this.div.style.top = sw.y + "px";
                }

                onRemove() {
                    if (this.div) {
                        this.div.parentNode!.removeChild(this.div);
                        this.div = null;
                    }
                    this.listeners.forEach(listener => google.maps.event.removeListener(listener));
                }
                
                getPosition() {
                    return this.latlng;
                }
            }


            const map = new window.google.maps.Map(mapRef.current, {
                center: event.locationData,
                zoom: 16,
                styles: mapStyles,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: false,
                gestureHandling: 'cooperative'
            });
            
            const organizerAvatar = "https://picsum.photos/seed/user/100";
            const marker = new CustomMarker(new window.google.maps.LatLng(event.locationData), organizerAvatar, map);

            map.addListener("center_changed", () => {
                window.setTimeout(() => {
                    const markerPos = marker.getPosition();
                    if (markerPos) {
                       map.panTo(markerPos);
                    }
                }, 3000);
            });

            marker.addListener("click", () => {
                const markerPos = marker.getPosition();
                if (markerPos) {
                    map.setZoom(18);
                    map.setCenter(markerPos);
                }
            });


            const redirectButton = document.createElement('div');
            redirectButton.innerHTML = `<button style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4); cursor: pointer;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>`;
            redirectButton.style.margin = '16px';
            redirectButton.onclick = () => {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${event.locationData.lat},${event.locationData.lng}`, '_blank');
            };

            map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(redirectButton);
        }

        if (window.google && window.google.maps) {
            initMap();
        } else {
            const interval = setInterval(() => {
                if (window.google && window.google.maps) {
                    clearInterval(interval);
                    initMap();
                }
            }, 100);
        }
    }, [event, mapStyles]);
    
    return (
        <div ref={mapRef} className="aspect-video w-full rounded-lg bg-muted animate-pulse" />
    )
};


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
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                          <Pin/>
                          <p>{event.location}</p>
                        </div>
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
                           {event.locationData ? <EventMap event={event} /> : <p>No location data for this event.</p>}
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

    
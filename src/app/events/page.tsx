
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, CheckCircle, Save, ArrowLeft } from 'lucide-react';
import { events as eventData, setEvents } from '@/lib/events-data';

export default function EventsPage() {
    const [events, setLocalEvents] = useState(eventData);

    useEffect(() => {
        const interval = setInterval(() => {
            // This is to force re-render and update time-sensitive UI like countdowns
            setLocalEvents([...eventData]);
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const ongoingEvents = events.filter(e => e.status === 'ongoing' || e.status === 'paused');
    const concludedEvents = events.filter(e => e.status === 'concluded');

    const getDaysRemaining = (dateStr: string) => {
        const endDate = new Date(dateStr);
        const conclusionDate = new Date(endDate.setDate(endDate.getDate() + 30));
        const now = new Date();
        const diffTime = conclusionDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    const saveToMemoryBank = (eventId: number) => {
        console.log(`Saving event ${eventId} to Memory Bank`);
        // In a real app, this would perform an action and likely remove the event from this view
    }

    return (
        <div className="container mx-auto p-4 space-y-8">
             <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold tracking-tight">Events</h1>
                <Button variant="outline" asChild>
                    <Link href="/circles">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Circles
                    </Link>
                </Button>
            </div>

            <section>
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                    <CalendarClock className="text-primary"/>
                    Ongoing Events
                </h2>
                {ongoingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ongoingEvents.map(event => (
                            <Link href={`/events/${event.id}`} key={event.id}>
                                <Card className="hover:border-primary transition-colors h-full">
                                    <CardHeader>
                                        <CardTitle>{event.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">Ends: {new Date(event.endDate).toLocaleDateString()}</p>
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <div className={`h-2 w-2 rounded-full ${event.status === 'ongoing' ? 'bg-green-500' : 'bg-yellow-500'}`}/>
                                            <span className={`text-xs font-semibold ${event.status === 'ongoing' ? 'text-green-500' : 'text-yellow-500'}`}>{event.status === 'ongoing' ? 'Current' : 'Paused'}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No ongoing events.</p>
                )}
            </section>

            <section>
                <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                    <CheckCircle className="text-primary"/>
                    Concluded Events
                </h2>
                {concludedEvents.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {concludedEvents.map(event => {
                             const daysRemaining = getDaysRemaining(event.endDate);
                             return (
                                <Card key={event.id} className={daysRemaining <= 0 ? 'opacity-50' : ''}>
                                    <CardHeader>
                                        <CardTitle>{event.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <p className="text-sm text-muted-foreground">Concluded on: {new Date(event.endDate).toLocaleDateString()}</p>
                                        {daysRemaining > 0 ? (
                                            <p className="text-xs text-amber-600">Disappears in {daysRemaining} day{daysRemaining !== 1 && 's'}.</p>
                                        ) : (
                                            <p className="text-xs text-red-600">This event has disappeared.</p>
                                        )}
                                        <Button size="sm" variant="outline" onClick={() => saveToMemoryBank(event.id)} disabled={daysRemaining <= 0}>
                                            <Save className="mr-2 h-4 w-4"/>
                                            Save to Memory Bank
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No concluded events yet.</p>
                )}
            </section>
        </div>
    );
}

    

    
import ConnectionCircles from "@/components/connection-circles";

export default function ConnectionsPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-12rem)]">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground/80 to-accent-foreground/70 pb-2">
                Your Connections
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Click on your profile to see your circles. Discover new connections and see what your friends are up to.
            </p>
        </div>
        <ConnectionCircles />
    </div>
  );
}

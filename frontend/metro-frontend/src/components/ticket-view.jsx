import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function TicketView({ ticket, onBack }) {
  if (!ticket) return null;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">

      {/* Success header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="size-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Check className="size-7 text-primary" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Journey Confirmed</h3>
          <p className="text-sm text-muted-foreground">Your ticket has been issued</p>
        </div>
      </div>

      {/* Ticket card */}
      <div className="rounded-xl border border-border overflow-hidden">

        {/* Route section */}
        <div className="bg-secondary p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                From
              </p>
              <p className="font-semibold text-base leading-snug">
                {ticket.sourceStation.name}
              </p>
            </div>

            <div className="text-primary flex-shrink-0 mt-4 text-lg font-light">→</div>

            <div className="min-w-0 flex-1 text-right">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
                To
              </p>
              <p className="font-semibold text-base leading-snug">
                {ticket.destinationStation.name}
              </p>
            </div>
          </div>
        </div>

        {/*
          Perforated divider effect.
          The half-circles use bg-card to match the Home panel background,
          creating the appearance of punched holes on the ticket edge.
        */}
        <div className="relative flex items-center bg-secondary" style={{ margin: '0 -1px' }}>
          <div className="size-5 rounded-full bg-card border border-border flex-shrink-0 -ml-2.5 z-10" />
          <div className="flex-1 border-t border-dashed border-border/60" />
          <div className="size-5 rounded-full bg-card border border-border flex-shrink-0 -mr-2.5 z-10" />
        </div>

        {/* Fare + status section */}
        <div className="bg-secondary p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
              Fare Paid
            </p>
            <p className="text-2xl font-bold text-primary">${ticket.farePaid}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
              Status
            </p>
            <div className="flex items-center gap-1.5 justify-end">
              <div className="size-1.5 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">Confirmed</span>
            </div>
          </div>
        </div>

      </div>

      {/* Back action */}
      <Button
        onClick={onBack}
        variant="outline"
        className="w-full h-10 border-border/80 hover:border-primary/30 hover:text-primary transition-all duration-150"
      >
        Book Another Journey
      </Button>

    </div>
  );
}

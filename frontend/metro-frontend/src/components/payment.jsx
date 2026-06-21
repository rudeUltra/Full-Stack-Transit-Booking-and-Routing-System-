import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Train, ArrowUpDown, ChevronDown } from 'lucide-react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const selectClass =
  'w-full h-11 rounded-lg border border-border bg-secondary px-3 pr-9 text-sm text-foreground ' +
  'transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ' +
  'disabled:opacity-50 cursor-pointer appearance-none';

const PolarPayment = ({ stations, distanceMatrix }) => {
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [price, setPrice] = useState(null);
  const [distance, setDistance] = useState(null);

  if (!stations || Object.keys(stations).length === 0 || !distanceMatrix) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="size-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading stations...</p>
      </div>
    );
  }

  useEffect(() => {
    if (source && destination && source !== destination) {
      const dist = distanceMatrix[source]?.[destination];
      if (dist !== undefined) {
        setPrice(Math.round(dist * 2));
        setDistance(dist);
      } else {
        setPrice(null);
      }
    } else {
      setPrice(null);
    }
  }, [source, destination, distanceMatrix]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!price) return;

    setLoading(true);

    sessionStorage.setItem(
      'last_ticket',
      JSON.stringify({ source: stations[source], destination: stations[destination], price })
    );

    try {
      const response = await fetch(`${baseUrl}/payments/create-session`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price, sourceId: source, destId: destination }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Payment Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-7">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Plan your route</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select stations to calculate fare
        </p>
      </div>

      {/* Route Selector */}
      <div className="flex flex-col gap-2">

        {/* FROM */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="source"
            className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest"
          >
            From
          </label>
          <div className="relative">
            <select
              id="source"
              className={selectClass}
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="" disabled>Select origin station</option>
              {Object.entries(stations || {}).map(([id, name]) => (
                <option key={id} value={id} disabled={id === destination}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Swap divider */}
        <div className="flex items-center gap-3 py-0.5">
          <div className="flex-1 h-px bg-border" />
          <div className="size-7 rounded-full border border-border flex items-center justify-center text-muted-foreground">
            <ArrowUpDown className="size-3" />
          </div>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* TO */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="destination"
            className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest"
          >
            To
          </label>
          <div className="relative">
            <select
              id="destination"
              className={selectClass}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              <option value="" disabled>Select destination station</option>
              {Object.entries(stations || {}).map(([id, name]) => (
                <option key={id} value={id} disabled={id === source}>
                  {name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Fare Card — only when route is selected */}
      {price !== null && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">
              Total Fare
            </p>
            <p className="text-2xl font-bold text-primary">${price}</p>
            <p className="text-xs text-muted-foreground mt-1.5">
              {distance} km × $2.00 / km
            </p>
          </div>
          <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Train className="size-5 text-primary" />
          </div>
        </div>
      )}

      {/* CTA */}
      <Button
        onClick={handleCheckout}
        className="w-full h-11 font-medium"
        disabled={loading || price === null}
      >
        {loading ? (
          <>
            <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            Redirecting...
          </>
        ) : (
          'Continue to Payment →'
        )}
      </Button>

    </div>
  );
};

export default PolarPayment;

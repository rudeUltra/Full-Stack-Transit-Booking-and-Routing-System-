import MetroMap from './Map';
import React, { useEffect, useState } from 'react';
import PolarPayment from '../components/payment';
import { TicketView } from '@/components/ticket-view';
import { Train } from 'lucide-react';

const baseUrl = import.meta.env.VITE_BACKEND_URL;
console.log('Backend URL:', baseUrl);
const Home = () => {
  const [metroData, setMetroData] = useState(null);
  const [purchasedTicket, setPurchasedTicket] = useState(null);
  const [loadingTicket, setLoadingTicket] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const checkoutId = searchParams.get('checkout_id');

    if (checkoutId) {
      setLoadingTicket(true);
      fetchTicketStatus(checkoutId);
    }

    fetch(`${baseUrl}/graph/distances`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => (res.status === 401 ? (window.location.href = '/login') : res.json()))
      .then((data) => data && setMetroData(data));
  }, []);

  const fetchTicketStatus = async (checkoutId, attempt = 1) => {
    const MAX_ATTEMPTS = 10;
    const DELAY = Math.min(attempt * 1000, 10000);

    if (attempt > MAX_ATTEMPTS) {
      setLoadingTicket(false);
      alert('Payment taking longer than usual. Please check your email or history.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/payments/status/${checkoutId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.status === 'completed') {
        setPurchasedTicket(data.tickets[0]);
        setLoadingTicket(false);
      } else {
        setTimeout(() => fetchTicketStatus(checkoutId, attempt + 1), DELAY);
      }
    } catch (error) {
      console.error('Polling error:', error);
      setTimeout(() => fetchTicketStatus(checkoutId, attempt + 1), DELAY);
    }
  };

  const handleBack = () => {
    setPurchasedTicket(null);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  /* Full-screen loading state */
  if (!metroData) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading metro network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">

      {/* Left: Metro Map — takes remaining space */}
      <div className="flex-1 relative min-w-0">
        <MetroMap data={metroData} />
      </div>

      {/* Right: Booking Panel */}
      <div className="w-[420px] flex-shrink-0 flex flex-col bg-card border-l border-border">

        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              <Train className="size-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Urban Flow</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>

        {/* Panel content */}
        <div className="flex-1 flex flex-col justify-center px-6 py-8 overflow-y-auto">
          {loadingTicket ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <div>
                <p className="font-medium">Verifying payment...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This usually takes a few seconds.
                </p>
              </div>
            </div>
          ) : purchasedTicket ? (
            <TicketView ticket={purchasedTicket} onBack={handleBack} />
          ) : (
            <PolarPayment
              stations={metroData.stations}
              distanceMatrix={metroData.distanceMatrix}
            />
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;

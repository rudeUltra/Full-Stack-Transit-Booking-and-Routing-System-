import { Train } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="grid h-screen w-full overflow-hidden lg:grid-cols-[2fr_3fr]">

      {/* Left: Login Panel */}
      <div className="flex flex-col h-full p-8 md:p-12 bg-card border-r border-border">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Train className="size-4 text-primary-foreground" />
          </div>
          <span className="font-semibold tracking-tight text-sm">Urban Flow</span>
        </div>

        {/* Form — vertically centered */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground">
          © 2025 Urban Flow. Built for commuters.
        </p>
      </div>

      {/* Right: Atmospheric Panel */}
      <div className="relative hidden lg:block overflow-hidden">
        {/*
          IMAGE PLACEHOLDER
          Replace the div below with:
            <img src="/your-image.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
          or set a background:
            style={{ backgroundImage: "url('/your-image.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        */}
        <div className="absolute inset-0 bg-secondary flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground/20 select-none">
            <Train className="size-20" />
            <span className="text-xs uppercase tracking-widest">Image placeholder</span>
          </div>
        </div>

        {/* Gradient overlay — bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Tagline */}
        <div className="absolute bottom-12 left-10 right-10">
          <p className="text-4xl font-bold leading-tight">
            The city moves.<br />Keep up.
          </p>
          <p className="text-muted-foreground text-sm mt-3 max-w-xs">
            Real-time metro routing, instant ticketing, seamless travel.
          </p>
        </div>

        {/* Top-right accent dots */}
        <div className="absolute top-10 right-10 flex gap-1.5">
          <div className="size-1.5 rounded-full bg-primary/60" />
          <div className="size-1.5 rounded-full bg-primary/30" />
          <div className="size-1.5 rounded-full bg-primary/15" />
        </div>
      </div>

    </div>
  );
}

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/car.jpg')" }}
    >
      {/* Overlay (optional for contrast) */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Login Form */}
      <div className="relative z-10 flex h-full w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl bg-white/90 p-8 rounded-lg shadow-lg">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

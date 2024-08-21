import Logo from "@/components/logo";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col items-center justify-center gap-y-4 min-h-screen">
      <Logo />
      {children}
    </main>
  );
}

import { Navigation } from "@/components/Navigation";

export default function MealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <div className="flex-1">{children}</div>
    </>
  );
}

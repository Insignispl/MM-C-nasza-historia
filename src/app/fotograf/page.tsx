import { PhotographerDashboard } from "./PhotographerDashboard";

export const metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default function PhotographerPage() {
  return <PhotographerDashboard />;
}

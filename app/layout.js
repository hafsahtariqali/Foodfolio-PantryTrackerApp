import { Poppins } from "next/font/google";
import "./globals.css";

// Import the Poppins font with necessary weights
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "Foodfolio",
  description: "Monitor your pantry inventory, minimize food waste, and stay informed about your stock. FoodFolio assists you in organizing your pantry effectively, so you always have the essentials on hand.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}

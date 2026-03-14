import "./globals.css";

export const metadata = {
  title: "Arachne Next Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

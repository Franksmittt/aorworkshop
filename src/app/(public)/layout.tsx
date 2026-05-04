import Footer from "@/components/Footer";
import Header from "@/components/Header";

// This layout will now apply to all pages inside the (public) folder,
// ensuring the login page and customer project pages are consistent.
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
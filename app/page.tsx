import Nav from "./components/Nav";
import Hero from "./components/Hero";
import TheDetails from "./components/TheDetails";
import Gift from "./components/Gift";
import InviteBanner from "./components/InviteBanner";
import OurStory from "./components/OurStory";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TheDetails />
        <Gift />
        <InviteBanner />
        <OurStory />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}

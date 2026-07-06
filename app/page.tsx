import Nav from "./components/Nav";
import Hero from "./components/Hero";
import InviteBanner from "./components/InviteBanner";
import OurStory from "./components/OurStory";
import Gallery from "./components/Gallery";
import Schedule from "./components/Schedule";
import Venue from "./components/Venue";
import DressCode from "./components/DressCode";
import Gift from "./components/Gift";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <InviteBanner />
        <OurStory />
        <Gallery />
        <Schedule />
        <Venue />
        <DressCode />
        <Gift />
      </main>
      <Footer />
    </>
  );
}

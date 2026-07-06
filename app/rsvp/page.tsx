import type { Metadata } from "next";
import RsvpForm from "../components/RsvpForm";

export const metadata: Metadata = {
  title: "RSVP — j2everyday",
  description:
    "RSVP for Jesulayomi & Justin's wedding celebration on November 7, 2026.",
};

export default function RsvpPage() {
  return <RsvpForm />;
}

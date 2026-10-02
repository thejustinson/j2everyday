import type { Metadata } from "next";
import UploadForm from "../components/UploadForm";

export const metadata: Metadata = {
  title: "Upload Photos — Jesulayomi & Justin #j2everyday",
  description:
    "Upload and share photos and videos taken at Jesulayomi & Justin's wedding celebration.",
};

export default function UploadPage() {
  return <UploadForm />;
}

import React from "react";
import dynamic from "next/dynamic";

import AppData from "@data/app.json";

import ReleaseWeekSection from "@components/sections/ReleaseWeek";
import HistorySection from "@components/sections/History";

const TestimonialSlider = dynamic(() => import("@components/sliders/Testimonial"), { ssr: false });

export const metadata = {
  title: {
		default: "Experience — Career & Education",
	},
  description: "Professional experience for David N Allen: CRO & UI/UX at Simpler Trading, Lead UI/UX at Leading Response, Interactive Manager at Adperio. BA Visual Communication.",
}

async function HistoryPage() {
  return (
    <>
      <HistorySection paddingTop={1} />
      <TestimonialSlider />
      <ReleaseWeekSection />
    </>
  );
};
export default HistoryPage;
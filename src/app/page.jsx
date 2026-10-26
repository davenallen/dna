import React from "react";

import AppData from "@data/app.json";

import HeroSection from "@components/sections/Hero";
import CountersSection from "@components/sections/Counters";
import FeaturedWorkSection from "@components/sections/FeaturedWork";
import WhyHireSection from "@components/sections/WhyHire";
import ServicesSection from "@components/sections/Services";
import ExperienceSnapshotSection from "@components/sections/ExperienceSnapshot";
import ReleaseWeekSection from "@components/sections/ReleaseWeek";

export const metadata = {
  title: {
		default: "David N Allen — React, Next.js & CRO",
		template: "%s | " + AppData.settings.siteName,
	},
  description: AppData.settings.siteDescription,
  keywords: AppData.settings.siteKeywords,
}

async function Home1() {
  return (
    <>
      <HeroSection variant="copy" />
      <CountersSection />
      <FeaturedWorkSection />
      <WhyHireSection />
      <ServicesSection />
      <ExperienceSnapshotSection />
      <ReleaseWeekSection paddingTop={30} />
    </>
  );
};

export async function generateStaticParams() {
  return [];
}
export default Home1;

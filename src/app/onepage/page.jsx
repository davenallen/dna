import React, { Suspense } from "react";
import dynamic from "next/dynamic";

import AppData from "@data/app.json";

import { getSortedPostsData } from "@library/posts";
import { getSortedProjectsData } from "@library/projects";

import HeroSection from "@components/sections/Hero";
import CountersSection from "@components/sections/Counters";
import ServicesSection from "@components/sections/Services";
import PricingSection from "@components/sections/Pricing";
import ReleaseWeekSection from "@components/sections/ReleaseWeek";
import HistorySection from "@components/sections/History";
import ContactInfoSection from "@components/sections/ContactInfo";
import ContactFormSection from "@components/sections/Contact";

const TestimonialSlider = dynamic( () => import("@components/sliders/Testimonial"), { ssr: false } );
const LatestPostsSlider = dynamic( () => import("@components/sliders/LatestPosts"), { ssr: false } );
const ProjectsMasonry = dynamic( () => import("@components/ProjectsMasonry"), { ssr: false } );

export const metadata = {
  title: {
		default: "Home 3",
	},
  description: AppData.settings.siteDescription,
}

async function HomeOnePage() {
  const posts = await getAllPosts();
  const projects = await getAllProjects();

  return (
    <>
      <HeroSection />
      <CountersSection />
      <ServicesSection />
      <PricingSection />
      <TestimonialSlider />

      <Suspense fallback={<div>Loading...</div>}>
        <ProjectsMasonry projects={projects} categories={AppData.projects.categories} />
      </Suspense>

      <HistorySection />

      <Suspense fallback={<div>Loading...</div>}>
        <LatestPostsSlider posts={posts} />
      </Suspense>
      
      <ContactInfoSection />
      <ContactFormSection />
      <ReleaseWeekSection />
    </>
  );
};
export default HomeOnePage;

async function getAllPosts() {
  const allPosts = getSortedPostsData();
  return allPosts;
}

async function getAllProjects() {
  const allProjects = getSortedProjectsData();
  return allProjects;
}
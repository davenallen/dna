import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import AppData from "@data/app.json";

const ProjectsMasonry = dynamic( () => import("@components/ProjectsMasonry"), { ssr: false } );

import { getSortedProjectsData } from "@library/projects";

export const metadata = {
  title: {
		default: "Selected Work",
	},
  description: "Production interfaces by David N Allen — pages and UI for membership, registration, and CRO.",
}

async function Projects() {
  const projects = await getAllProjects();

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectsMasonry projects={projects} categories={AppData.projects.categories} />
      </Suspense>
    </>
  );
};
export default Projects;

async function getAllProjects() {
  const allProjects = getSortedProjectsData();
  return allProjects;
}
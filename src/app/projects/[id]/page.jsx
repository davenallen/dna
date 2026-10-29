import React, { Suspense } from "react";
import { notFound } from 'next/navigation';
import dynamic from "next/dynamic";

import { getSortedProjectsData, getAllProjectsIds, getProjectData } from "@library/projects";

const ImagesFullSlider = dynamic( () => import("@components/sliders/ImagesFull"), { ssr: false } );
const CaseShots = dynamic( () => import("@components/sliders/CaseShots"), { ssr: false } );
const ImageFull = dynamic( () => import("@components/ImageFull"), { ssr: false } );
const ImagesGallery = dynamic( () => import("@components/ImagesGallery"), { ssr: false } );
const ClickableHero = dynamic(() => import("@components/ClickableHero"), { ssr: false });

import { Button, Card, LiveEmbed, LiveModule, SectionTitle, TextLink } from "@components/system";
import ProjectCover from "@components/ImageFull";

export async function generateMetadata({ params }) {
  const postData = await getSingleProjectData(params);
  const description = postData.summary
    || (typeof postData.description?.content === "string"
      ? postData.description.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160)
      : undefined);

  return {
      title: postData.title + " — Case Study",
      description: description || `${postData.title} case study by David N Allen — frontend engineer and UI/UX designer.`,
  }
}

const BELOW_MARKER = "<!--below-->";

function caseStudyParts(html, carousel) {
  const marker = "<!--shots-->";
  if (!html.includes(marker) || !carousel) return [html];
  return html.split(marker);
}

function CaseStudyBlock({ title, html, carousel, showTitle = true, button }) {
  if (!html || !html.trim()) return null;
  const parts = caseStudyParts(html, carousel);

  return (
    <div className="container-fluid">
      <div className="row p-30-0">
        <div className="col-lg-12">
          <Card className="dna-case-body">
            {showTitle && title ? <h5 className="mb-15">{title}</h5> : null}
            <div className="dna-case-content mb-15">
              {parts.map((part, partIndex) => (
                <div key={`case-part-${partIndex}`}>
                  {part.trim() ? <div dangerouslySetInnerHTML={{ __html: part }} /> : null}
                  {partIndex < parts.length - 1 ? (
                    <Suspense fallback={null}>
                      <CaseShots items={carousel} />
                    </Suspense>
                  ) : null}
                </div>
              ))}
            </div>
            {button !== undefined && (
              <div className="dna-buttons-frame">
                <TextLink
                  native
                  href={button.link || button.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-no-swup
                >
                  {button.label}
                </TextLink>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

async function ProjectDetail ( { params } ) {
  const postData = await getSingleProjectData(params);
  const projects = await getAllProjects();

  const primarySlugs = new Set(["web-templates", "web-system", "ui-elements"]);
  const group = projects.filter(
    (item) => primarySlugs.has(item.category_slug) === primarySlugs.has(postData.category_slug)
  );
  const index = group.findIndex((item) => item.id === postData.id);
  const prev = {
    id: group.length > 1 ? group[(index - 1 + group.length) % group.length].id : 0,
  };
  const next = {
    id: group.length > 1 ? group[(index + 1) % group.length].id : 0,
  };

  const metaItems = postData.details?.items || [];
  const isLiveModule = Boolean(postData.module) || (postData.category_slug === "ui-elements" && Boolean(postData.iframe));
  const caseHtml = postData.description?.content || "";
  const argumentFirst = Boolean(postData.embed && postData.iframe && !isLiveModule && caseHtml.includes(BELOW_MARKER));
  const caseLead = argumentFirst ? caseHtml.split(BELOW_MARKER)[0] : "";
  const caseFollow = argumentFirst ? caseHtml.split(BELOW_MARKER).slice(1).join(BELOW_MARKER) : caseHtml;
  const usedOnPage = new Set(["web-system", "ui-elements"]);
  const embedPills = (Array.isArray(postData.uses) ? postData.uses : [])
    .map((id) => projects.find((project) => project.id === id))
    .filter((project) => project && usedOnPage.has(project.category_slug))
    .map((project) => ({ id: project.id, title: project.title }));

  return (
    <>
        <div className="container-fluid">
          <div className="row p-30-0">
            <div className="col-lg-12">
              <SectionTitle
                className="dna-project-title"
                title={postData.title}
                aside={<div className="dna-project-category">{postData.category}</div>}
              />
              {postData.summary && (
                <p className="dna-case-lede mb-20">{postData.summary}</p>
              )}
              {metaItems.length > 0 && (
                <div className="dna-case-meta">
                  {metaItems.map((item, key) => (
                    <div className="dna-case-meta-item" key={`meta-${key}`}>
                      <h6>{item.label}</h6>
                      <span dangerouslySetInnerHTML={{ __html: item.value }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {argumentFirst ? (
          <CaseStudyBlock
            title={postData.description?.title}
            html={caseLead}
            carousel={postData.carousel}
          />
        ) : null}

        {isLiveModule ? (
          <>
            {postData.cover && postData.image ? (
              <ProjectCover
                src={postData.image}
                title={postData.title}
                href={`/projects/${postData.id}`}
                plain
              />
            ) : null}
            {postData.iframe ? (
              <div className="container-fluid mb-30">
                <div className="row">
                  <div className="col-lg-12">
                    <LiveEmbed src={postData.iframe} title={postData.title} fullscreen />
                  </div>
                </div>
              </div>
            ) : null}
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  {postData.module ? (
                    <LiveModule id={postData.module} />
                  ) : (
                    <LiveEmbed src={postData.iframe} title={postData.title} />
                  )}
                </div>
              </div>
            </div>
          </>
        ) : postData.embed && postData.iframe ? (
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <LiveEmbed src={postData.iframe} title={postData.title} fullscreen pills={embedPills} />
              </div>
            </div>
          </div>
        ) : postData.carousel !== undefined ? (
          <Suspense fallback={<div>Loading...</div>}>
            <ImagesFullSlider items={postData.carousel} href={`/projects/${postData.id}`} />
          </Suspense>
        ) : postData.iframe ? (
          <Suspense fallback={<div>Loading...</div>}>
            <ClickableHero 
              image={postData.image} 
              title={postData.title} 
              iframeSrc={postData.iframe}
              href={`/projects/${postData.id}`}
            />
          </Suspense>
        ) : postData.image ? (
          <Suspense fallback={<div>Loading...</div>}>
            <ImageFull src={postData.image} title={postData.title} href={`/projects/${postData.id}`} />
          </Suspense>
        ) : null}

        <CaseStudyBlock
          title={postData.description?.title}
          html={caseFollow}
          carousel={postData.carousel}
          showTitle={!argumentFirst}
          button={postData.description?.button}
        />

        {!isLiveModule && postData.gallery !== undefined && (
          <Suspense fallback={<div>Loading...</div>}>
            <ImagesGallery items={postData.gallery.items} title={postData.gallery.title} href={`/projects/${postData.id}`} />
          </Suspense>
        )}

        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="dna-a dna-banner dna-banner-hire dna-banner-cta" style={{"backgroundImage": "url(/img/bg-1.jpg)"}}>
                <div className="dna-banner-overlay dna-banner-overlay-cta">
                  <div className="dna-banner-title text-center">
                    <h1 className="mb-15">Looking for this kind of work on your team?</h1>
                    <div className="dna-lg-text dna-code mb-25">I build production interfaces in React and Next.js, and the events those pages fire. I can own the frontend. Let&apos;s talk.</div>
                    <div className="dna-buttons-frame dna-buttons-center">
                      <Button href="/contact">Start a conversation</Button>
                      <Button href="/files/dna-resume-2026.pdf" external variant="secondary">Resume</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dna-a dna-pagination">
                {prev.id != 0 && (
                  <TextLink href={`/projects/${prev.id}`} direction="left">
                    Previous case study
                  </TextLink>
                )}
                <div className="dna-pagination-center dna-m-hidden">
                  <TextLink href="/projects" tone="muted" chevron={false}>All work</TextLink>
                </div>
                {next.id != 0 && (
                  <TextLink href={`/projects/${next.id}`}>Next case study</TextLink>
                )}
              </div>
            </div>
          </div>
        </div>

    </>
  );
}

export default ProjectDetail;

export async function generateStaticParams() {
  const allProjects = getAllProjectsIds();
  
  return allProjects.map(project => ({
    id: project.params.id
  }));
}

async function getSingleProjectData(params) {
  const postData = await getProjectData(params.id)
  
  if ( !postData ) {
    notFound()
  } else {
    return postData
  }
}

async function getAllProjects() {
  const allProjects = await getSortedProjectsData()
  return allProjects
}

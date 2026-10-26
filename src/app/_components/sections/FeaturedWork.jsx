import Link from "next/link";
import Data from "@data/sections/featured-work.json";
import { getSortedProjectsData } from "@library/projects";
import { LiveEmbed, LiveModule, SectionTitle, TextLink } from "@components/system";
import FeaturedPreview from "./FeaturedPreview";
import { UsePills } from "@components/UsePills";

const PREVIEW_IDS = new Set(["06-sales-page-project"]);

const FeaturedWorkSection = () => {
  const all = getSortedProjectsData();
  const items = (Data.ids || [])
    .map((id) => all.find((p) => p.id === id))
    .filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12">
          <SectionTitle
            title={Data.title}
            aside={Data.viewAll ? <TextLink href={Data.viewAll.link}>{Data.viewAll.label}</TextLink> : null}
          />
          {Data.intro && <p className="dna-why-hire-intro mb-15">{Data.intro}</p>}
        </div>

        {items.map((item) => {
          const isLiveModule = (Boolean(item.module) && item.module_grid !== false) || (item.embed && Boolean(item.iframe)) || (item.category_slug === "ui-elements" && Boolean(item.iframe));
          const isPreviewCard = (PREVIEW_IDS.has(item.id) || item.module_grid === false) && Boolean(item.poster || item.image);

          return (
            <div className="col-lg-4 col-md-6" key={item.id}>
              <article className="dna-a dna-featured-card">
                {isLiveModule ? (
                  <div className="dna-featured-card-media dna-featured-card-media--live">
                    {item.module ? (
                      <LiveModule id={item.module} preview />
                    ) : (
                      <LiveEmbed src={item.iframe} title={item.title} preview />
                    )}
                  </div>
                ) : isPreviewCard ? (
                  <FeaturedPreview
                    src={item.image}
                    thumb={item.poster || item.image}
                    title={item.title}
                    href={`/projects/${item.id}`}
                  />
                ) : (
                  <Link href={`/projects/${item.id}`} className="dna-featured-card-media">
                    <img src={item.poster || item.image} alt={item.title} />
                  </Link>
                )}
                <div className="dna-featured-card-body">
                  <span className="dna-featured-card-cat">{item.category}</span>
                  <h5 className="mb-10">
                    <Link href={`/projects/${item.id}`}>{item.title}</Link>
                  </h5>
                  {item.summary && <p className="dna-project-summary mb-15">{item.summary}</p>}
                  <TextLink href={`/projects/${item.id}`}>View case study</TextLink>
                  <UsePills item={item} projects={all} />
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedWorkSection;

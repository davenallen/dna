import AppData from "@data/app.json";
import { Button, Card, FormField, InfoRow, SectionTitle, TextLink } from "@components/system";
import { TokenSwatch } from "@components/system/TokenSwatch";
import { groupMeta, groupOrder, tokensInGroup } from "@design/tokens";

export const metadata = {
  title: "Design system",
  description:
    "The tokens and components this site is built from: color, type, space, radius, shadow, motion, and the buttons, cards, fields, and rows that use them.",
};

const sidebarInfo = (AppData.profile.info || []).filter((item) => item.label !== "Resume");

function ColorGroup({ items }) {
  return (
    <div className="row">
      {items.map((item) => (
        <div className="col-6 col-md-4 col-lg-3" key={item.cssVar}>
          <Card className="ds-token-card">
            <TokenSwatch cssVar={item.cssVar} fallback={item.value} />
            <div className="ds-token-name">{item.cssVar}</div>
            {item.used ? <p className="ds-token-used">{item.used}</p> : null}
          </Card>
        </div>
      ))}
    </div>
  );
}

function TypeGroup({ items }) {
  const families = items.filter((item) => item.name.startsWith("family"));
  const sizes = items.filter((item) => item.name.startsWith("size."));
  const weights = items.filter((item) => item.name.startsWith("weight."));

  return (
    <Card>
      {families.map((item) => (
        <div className="ds-type-row" key={item.cssVar} style={{ fontFamily: item.value }}>
          <strong>{item.used}</strong>
          <span>{item.cssVar}</span>
        </div>
      ))}
      {sizes.map((item) => (
        <div className="ds-type-row" key={item.cssVar}>
          <strong
            style={{
              fontSize: item.value,
              fontWeight: item.name === "size.display" ? "var(--type-weight-black)" : "var(--type-weight-semibold)",
              fontFamily: ["size.display", "size.title", "size.ui"].includes(item.name)
                ? "var(--type-family-headline)"
                : undefined,
            }}
          >
            Ag
          </strong>
          <span>
            {item.cssVar} · {item.value}
          </span>
        </div>
      ))}
      {weights.map((item) => (
        <div className="ds-type-row" key={item.cssVar}>
          <strong style={{ fontWeight: item.value }}>{item.used}</strong>
          <span>
            {item.cssVar} · {item.value}
          </span>
        </div>
      ))}
    </Card>
  );
}

function SpaceGroup({ items }) {
  return (
    <Card>
      {items.map((item) => (
        <div className="ds-space-row" key={item.cssVar}>
          <span className="ds-space-bar" style={{ width: item.value }} />
          <span className="ds-space-label">
            {item.cssVar} · {item.value} · {item.used}
          </span>
        </div>
      ))}
    </Card>
  );
}

function RadiusGroup({ items }) {
  return (
    <div className="row">
      {items.map((item) => (
        <div className="col-6 col-md-4" key={item.cssVar}>
          <Card className="ds-token-card">
            <span
              className="ds-token-swatch ds-radius-shape"
              style={{ borderRadius: item.value, width: "100%", height: "72px" }}
            />
            <div className="ds-token-name">{item.cssVar}</div>
            <p className="ds-token-value">
              {item.value} · {item.used}
            </p>
          </Card>
        </div>
      ))}
    </div>
  );
}

function ShadowGroup({ items }) {
  return (
    <div className="row">
      {items.map((item) => (
        <div className="col-md-4" key={item.cssVar}>
          <Card className="ds-token-card">
            <span className="ds-token-swatch ds-shadow-shape" style={{ boxShadow: `var(${item.cssVar})`, width: "100%" }} />
            <div className="ds-token-name">{item.cssVar}</div>
            <p className="ds-token-used">{item.used}</p>
          </Card>
        </div>
      ))}
    </div>
  );
}

function MotionGroup({ items }) {
  return (
    <Card>
      {items.map((item) => (
        <div className="ds-motion-row" key={item.cssVar}>
          <span className="ds-motion-dot" style={{ transition: `transform ${item.value}` }} />
          <span className="ds-motion-label">
            {item.cssVar} · {item.value} · {item.used}
          </span>
        </div>
      ))}
      <p className="ds-specimen-note">Hover a row. The dot uses that duration.</p>
    </Card>
  );
}

const groupView = {
  color: ColorGroup,
  type: TypeGroup,
  space: SpaceGroup,
  radius: RadiusGroup,
  shadow: ShadowGroup,
  motion: MotionGroup,
};

export default function SystemPage() {
  return (
    <>
      <div className="container-fluid">
        <div className="row p-30-0">
          <div className="col-lg-12">
            <SectionTitle title="The system this site ships from" />
            <p className="ds-lede mb-15">
              Color, type, space, radius, shadow, and motion live in one file. The buttons, cards, titles, info rows,
              and fields below are the same components used on the home page, the sidebar, and the contact form.
            </p>
            <TextLink href="/projects">See the interfaces in production</TextLink>
          </div>
        </div>
      </div>

      <div className="container-fluid" id="foundations">
        {groupOrder.map((group) => {
          const View = groupView[group];
          const items = tokensInGroup(group);
          if (!View || !items.length) return null;
          const meta = groupMeta[group];

          return (
            <div className="row" key={group}>
              <div className="col-lg-12">
                <SectionTitle title={meta.title} />
                <p className="ds-group-note">{meta.note}</p>
                <View items={items} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="container-fluid" id="components">
        <div className="row">
          <div className="col-lg-12">
            <SectionTitle title="Components" />
            <p className="ds-group-note">
              Each one reads the tokens. Change the component, or change a token, and the site follows.
            </p>
          </div>

          <div className="col-lg-6">
            <Card>
              <p className="ds-specimen-label">Button</p>
              <div className="ds-specimen-row">
                <Button href="/contact">Let&apos;s talk</Button>
                <Button href={AppData.profile.resume} external variant="secondary">
                  Resume
                </Button>
                <Button href="/contact" size="sm">
                  Contact
                </Button>
              </div>
              <p className="ds-specimen-note">Hero, sidebar, contact form, and the close of a case study.</p>
            </Card>
          </div>

          <div className="col-lg-6">
            <Card>
              <p className="ds-specimen-label">Text link</p>
              <div className="ds-specimen-row">
                <TextLink href="/projects">View case study</TextLink>
                <TextLink href="/history" direction="left">
                  Full experience
                </TextLink>
              </div>
              <p className="ds-specimen-note">Section actions, case studies, and previous or next.</p>
            </Card>
          </div>

          <div className="col-lg-6">
            <Card>
              <p className="ds-specimen-label">Section title</p>
              <SectionTitle title="Patterns in production" aside={<TextLink href="/projects">View all</TextLink>} />
              <p className="ds-specimen-note">Every section title on the site is this component.</p>
            </Card>
          </div>

          <div className="col-lg-6">
            <Card>
              <p className="ds-specimen-label">Info row</p>
              <ul className="ds-info-list">
                {sidebarInfo.map((item) => (
                  <InfoRow key={item.label} label={item.label} value={item.value} />
                ))}
              </ul>
              <p className="ds-specimen-note">The same rows as the sidebar.</p>
            </Card>
          </div>

          <div className="col-lg-12">
            <Card>
              <p className="ds-specimen-label">Form field</p>
              <div className="row">
                <div className="col-md-6">
                  <FormField id="specimen-name" label="Name" icon={<i className="fas fa-user"></i>} readOnly />
                </div>
                <div className="col-md-6">
                  <FormField
                    id="specimen-email"
                    label="Email"
                    type="email"
                    icon={<i className="fas fa-at"></i>}
                    readOnly
                  />
                </div>
                <div className="col-lg-12">
                  <FormField
                    as="textarea"
                    id="specimen-message"
                    label="Message"
                    icon={<i className="far fa-envelope"></i>}
                    readOnly
                  />
                </div>
              </div>
              <div className="ds-specimen-row">
                <Button type="button">Send message</Button>
              </div>
              <p className="ds-specimen-note">The contact form uses these fields and this button.</p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Single source for color, type, space, radius, shadow, and motion.
 * CSS custom properties are injected on <html> from `cssVars`.
 * SCSS aliases in src/app/_styles/scss/_config.scss point at these names.
 */

const tokens = {
  color: {
    accent: {
      value: "#07b5ff",
      used: "Primary actions, links, status",
    },
    "accent-10": {
      value: "rgba(7, 181, 255, 0.1)",
      used: "Skill chips",
      specimen: false,
    },
    "accent-12": {
      value: "rgba(7, 181, 255, 0.12)",
      used: "Secondary button hover and status pill",
      specimen: false,
    },
    "accent-20": {
      value: "rgba(7, 181, 255, 0.2)",
      used: "Status lamp",
      specimen: false,
    },
    "accent-22": {
      value: "rgba(7, 181, 255, 0.22)",
      used: "Chip border",
      specimen: false,
    },
    "accent-35": {
      value: "rgba(7, 181, 255, 0.35)",
      used: "Status pill border",
      specimen: false,
    },
    success: {
      value: "#13c37d",
      used: "Included checks",
    },
    danger: {
      value: "#ff4d67",
      used: "Marks for what a package leaves out",
    },
    text: {
      value: "rgba(250, 250, 252, 1)",
      used: "Headings and primary text",
    },
    "text-muted": {
      value: "rgba(140, 140, 142, 1)",
      used: "Body copy",
    },
    "text-dim": {
      value: "rgba(100, 100, 102, 1)",
      used: "Meta labels",
    },
    surface: {
      value: "rgba(30, 30, 40, 1)",
      used: "Page background",
    },
    "surface-98": {
      value: "rgba(30, 30, 40, 0.98)",
      specimen: false,
    },
    "surface-88": {
      value: "rgba(30, 30, 40, 0.88)",
      specimen: false,
    },
    deep: {
      value: "rgba(25, 25, 35, 1)",
      used: "Portrait and media wells",
    },
    "deep-98": {
      value: "rgba(25, 25, 35, 0.98)",
      specimen: false,
    },
    "deep-88": {
      value: "rgba(25, 25, 35, 0.88)",
      specimen: false,
    },
    "info-bar": {
      value: "rgba(32, 32, 42, 1)",
      used: "Sidebar and field icons",
    },
    "info-bar-98": {
      value: "rgba(32, 32, 42, 0.98)",
      specimen: false,
    },
    "info-bar-88": {
      value: "rgba(32, 32, 42, 0.88)",
      specimen: false,
    },
    card: {
      value: "linear-gradient(159deg, rgba(45, 45, 58, 1) 0%, rgba(43, 43, 53, 1) 100%)",
      used: "Cards and panels",
    },
    "card-hover": {
      value: "linear-gradient(159deg, rgba(56, 56, 70, 1) 0%, rgba(52, 52, 64, 1) 100%)",
      used: "Featured card hover",
      specimen: false,
    },
    "card-98": {
      value: "linear-gradient(159deg, rgba(45, 45, 58, 0.98) 0%, rgba(43, 43, 53, 0.98) 100%)",
      specimen: false,
    },
    "card-88": {
      value: "linear-gradient(159deg, rgba(45, 45, 58, 0.88) 0%, rgba(43, 43, 53, 0.88) 100%)",
      specimen: false,
    },
    "info-bar-alt": {
      value: "linear-gradient(159deg, rgba(37, 37, 50, 1) 0%, rgba(35, 35, 45, 1) 100%)",
      used: "Form fields",
    },
    "info-bar-alt-98": {
      value: "linear-gradient(159deg, rgba(37, 37, 50, 0.98) 0%, rgba(35, 35, 45, 0.98) 100%)",
      specimen: false,
    },
    "info-bar-alt-88": {
      value: "linear-gradient(159deg, rgba(37, 37, 50, 0.88) 0%, rgba(35, 35, 45, 0.88) 100%)",
      specimen: false,
    },
    "on-accent": {
      value: "#ffffff",
      used: "Text on the accent",
      specimen: false,
    },
  },
  gradient: {
    top: {
      value: "linear-gradient(180deg, rgba(30, 30, 40, 0.93) 0%, rgba(30, 30, 40, 0.96) 70%, rgba(30, 30, 40, 0.99) 80%, rgba(30, 30, 40, 1) 100%)",
      used: "Top background fade",
      specimen: false,
    },
    banner: {
      value: "linear-gradient(90deg, rgba(45, 45, 58, 0.9) 15%, rgba(45, 45, 58, 0.7) 50%, rgba(43, 43, 53, 0.7) 100%)",
      used: "Hero panel",
      specimen: false,
    },
    "banner-side": {
      value: "linear-gradient(90deg, rgba(45, 45, 58, 0.9) 15%, rgba(45, 45, 58, 0.7) 50%, rgba(43, 43, 53, 0) 100%)",
      used: "Hero panel, open on the right",
      specimen: false,
    },
  },
  type: {
    "family-headline": {
      value: "var(--font-headline), sans-serif",
      used: "Familjen Grotesk, for headlines",
    },
    family: {
      value: "var(--font-body), sans-serif",
      used: "Inter, for body copy",
    },
    "family-mono": {
      value: "var(--font-secondary), monospace",
      used: "Courier Prime, for mono accents",
    },
    size: {
      caption: { value: "10px", used: "Text links" },
      label: { value: "11px", used: "Meta labels and chips" },
      sm: { value: "12px", used: "Buttons and small text" },
      body: { value: "13px", used: "Body copy" },
      ui: { value: "14px", used: "Card titles" },
      lg: { value: "16px", used: "Lead text" },
      title: { value: "17px", used: "Section titles" },
      display: { value: "44px", used: "Hero" },
    },
    weight: {
      light: { value: "300", used: "Body" },
      regular: { value: "400", used: "Labels" },
      medium: { value: "500", used: "Status and field labels" },
      semibold: { value: "600", used: "Buttons and section titles" },
      bold: { value: "700", used: "Default headings" },
      black: { value: "800", used: "Hero" },
    },
    tracking: {
      tight: { value: "0.2px", used: "Role line" },
      body: { value: "0.5px", used: "Body" },
      wide: { value: "1.5px", used: "Buttons and text links" },
    },
    leading: {
      tight: { value: "1.2", used: "Compact UI" },
      body: { value: "1.6", used: "Long copy" },
      loose: { value: "1.7", used: "Hero and principles" },
    },
  },
  space: {
    1: { value: "4px", used: "Tight gaps" },
    2: { value: "8px", used: "Chip gap, inline rhythm" },
    3: { value: "12px", used: "Button groups" },
    4: { value: "15px", used: "Sidebar padding" },
    5: { value: "20px", used: "Related items" },
    6: { value: "30px", used: "Card padding and section gaps" },
    7: { value: "60px", used: "Banner padding" },
  },
  radius: {
    sm: { value: "3px", used: "Quotes and status messages" },
    md: { value: "15px", used: "Date pills" },
    pill: { value: "999px", used: "Status pill and skill chips" },
  },
  shadow: {
    sm: { value: "0 1px 4px 0 rgba(15, 15, 20, 0.1)", used: "Buttons and raised rows" },
    md: { value: "0 3px 8px 0 rgba(15, 15, 20, 0.2)", used: "Cards and panels" },
    text: { value: "0 0 3px rgba(250, 250, 252, 0.4)", used: "Link hover glow" },
  },
  motion: {
    fast: { value: "0.2s ease-in-out", used: "Color and small shifts" },
    medium: { value: "0.4s ease-in-out", used: "Buttons, links, cards" },
    slow: { value: "0.55s ease-in-out", used: "Panels and page frames" },
  },
};

function collect(node, trail = []) {
  if (node && typeof node === "object" && typeof node.value === "string") {
    return [
      {
        group: trail[0],
        name: trail.slice(1).join("."),
        cssVar: `--${trail.join("-")}`,
        value: node.value,
        used: node.used || "",
        specimen: node.specimen !== false,
      },
    ];
  }

  return Object.entries(node).flatMap(([key, child]) => collect(child, [...trail, key]));
}

export const tokenList = collect(tokens);

export const cssVars = Object.fromEntries(tokenList.map((token) => [token.cssVar, token.value]));

const lightOverrides = {
  "--color-accent": "#0087c7",
  "--color-accent-10": "rgba(0, 135, 199, 0.1)",
  "--color-accent-12": "rgba(0, 135, 199, 0.12)",
  "--color-accent-20": "rgba(0, 135, 199, 0.2)",
  "--color-accent-22": "rgba(0, 135, 199, 0.22)",
  "--color-accent-35": "rgba(0, 135, 199, 0.35)",
  "--color-success": "#078850",
  "--color-danger": "#de2147",
  "--color-text": "#1a1c24",
  "--color-text-muted": "#4e5160",
  "--color-text-dim": "#6d7180",
  "--color-surface": "#f6f7fb",
  "--color-surface-98": "rgba(246, 247, 251, 0.98)",
  "--color-surface-88": "rgba(246, 247, 251, 0.88)",
  "--color-deep": "#e4e6ee",
  "--color-deep-98": "rgba(228, 230, 238, 0.98)",
  "--color-deep-88": "rgba(228, 230, 238, 0.88)",
  "--color-info-bar": "#ffffff",
  "--color-info-bar-98": "rgba(255, 255, 255, 0.98)",
  "--color-info-bar-88": "rgba(255, 255, 255, 0.88)",
  "--color-card": "linear-gradient(159deg, #ffffff 0%, #eef1f6 100%)",
  "--color-card-hover": "linear-gradient(159deg, #ffffff 0%, #f7f9fc 100%)",
  "--color-card-98": "linear-gradient(159deg, rgba(255, 255, 255, 0.98) 0%, rgba(238, 241, 246, 0.98) 100%)",
  "--color-card-88": "linear-gradient(159deg, rgba(255, 255, 255, 0.88) 0%, rgba(238, 241, 246, 0.88) 100%)",
  "--color-info-bar-alt": "linear-gradient(159deg, #e7ebf3 0%, #e1e6ef 100%)",
  "--color-info-bar-alt-98": "linear-gradient(159deg, rgba(231, 235, 243, 0.98) 0%, rgba(225, 230, 239, 0.98) 100%)",
  "--color-info-bar-alt-88": "linear-gradient(159deg, rgba(231, 235, 243, 0.88) 0%, rgba(225, 230, 239, 0.88) 100%)",
  "--color-on-accent": "#ffffff",
  "--gradient-top": "linear-gradient(180deg, rgba(246, 247, 251, 0.93) 0%, rgba(246, 247, 251, 0.96) 70%, rgba(246, 247, 251, 0.99) 80%, #f6f7fb 100%)",
  "--shadow-sm": "0 1px 4px 0 rgba(20, 24, 40, 0.08)",
  "--shadow-md": "0 8px 24px 0 rgba(20, 24, 40, 0.1)",
  "--shadow-text": "none",
  "--gradient-banner": "linear-gradient(90deg, rgba(246, 247, 251, 0.97) 0%, rgba(246, 247, 251, 0.92) 48%, rgba(246, 247, 251, 0.78) 100%)",
  "--gradient-banner-side": "linear-gradient(90deg, rgba(246, 247, 251, 0.97) 0%, rgba(246, 247, 251, 0.88) 55%, rgba(246, 247, 251, 0) 100%)",
};

export const themeCss = `html{color-scheme:dark}html[data-theme="light"]{color-scheme:light;${Object.entries(lightOverrides)
  .map(([name, value]) => `${name}:${value}!important`)
  .join(";")}}`;

export const themeBoot = `(function(){try{var t=localStorage.getItem("dna-theme");if(t!=="light"&&t!=="dark")t="dark";document.documentElement.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="light"?"#f6f7fb":"#1e1e28");}catch(e){}})();`;

export const groupOrder = ["color", "type", "space", "radius", "shadow", "motion"];

export const groupMeta = {
  color: {
    title: "Color",
    note: "Accent, the included and not-included marks, text, and the surfaces cards and fields sit on.",
  },
  type: {
    title: "Type",
    note: "Familjen Grotesk for headlines. Inter for body copy. Sizes and weights used by headings, buttons, and body copy.",
  },
  space: {
    title: "Space",
    note: "The steps already in the layout: chip gaps, sidebar padding, card padding, banner padding.",
  },
  radius: {
    title: "Radius",
    note: "Sharp panels stay square. Pills are reserved for status and chips.",
  },
  shadow: {
    title: "Shadow",
    note: "Two elevations, plus the glow on a hovered link.",
  },
  motion: {
    title: "Motion",
    note: "One easing. Duration is the only choice: fast, medium, or slow.",
  },
};

export function tokensInGroup(group) {
  return tokenList.filter((token) => token.group === group && token.specimen);
}

export default tokens;

import OfferCompare from "./OfferCompare";
import OfferTable from "./OfferTable";
import TrafficReport from "./TrafficReport";
import OnboardingCards from "./OnboardingCards";
import SignupLanding from "./SignupLanding";
import LeadQuiz from "./LeadQuiz";
import InjuryForm from "./InjuryForm";
import CampaignKit from "./CampaignKit";

const MODULES = {
  pricing: OfferCompare,
  "offer-table": OfferTable,
  traffic: TrafficReport,
  onboarding: OnboardingCards,
  signup: SignupLanding,
  lead: LeadQuiz,
  "injury-form": InjuryForm,
  campaign: CampaignKit,
};

export function LiveModule({ id, preview = false }) {
  const Module = MODULES[id];
  if (!Module) return null;

  return (
    <div className={`ds-live-module${preview ? " ds-live-module--preview" : ""}`}>
      <div className={preview ? "ds-live-module-scale" : "ds-live-module-frame"}>
        <Module />
      </div>
    </div>
  );
}

export default LiveModule;

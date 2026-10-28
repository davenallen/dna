import CampaignDashboard from "@components/system/CampaignDashboard";

export const metadata = {
  title: "Campaign dashboard",
  description: "Landing views, campaign source, and form leads for the lead funnel, disability benefits, and injury evaluation pages.",
};

export default function CampaignsPage() {
  return (
    <div className="container-fluid">
      <div className="row p-30-0">
        <div className="col-lg-12">
          <CampaignDashboard />
        </div>
      </div>
    </div>
  );
}

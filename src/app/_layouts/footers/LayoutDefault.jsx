import Link from "next/link";
import AppData from "@data/app.json";
import ShareList from "@components/ShareList";

const DefaultFooter = () => {
  return (
    <>
        {/* container */}
        <div className="container-fluid">

        {/* footer */}
        <footer className="footer">
            {/* copyright */}
            <div className="dna-copy">
                <Link href="/contact/">Contact</Link>
                <span>{AppData.footer.copy}</span>
            </div>
            <ShareList />

            {/* developer */}
            <div className="dna-build" dangerouslySetInnerHTML={{__html : AppData.footer.developer}} />
        </footer>
        {/* footer end */}

        </div>
        {/* container end */}
    </>
  );
};
export default DefaultFooter;

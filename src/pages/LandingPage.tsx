import { CredentialsBox } from "../components/CredentialsBox/CredentialsBox";
import "./LandingPage.css";
import { ReactComponent as Banner } from "../assets/svgs/landing_page_banner.svg";

export const LandingPage = () => {
	return (
		<div className="landing-page-container">
			<p className="landing-page-title">aio drive</p>
			<Banner />
			<CredentialsBox />
		</div>
	);
};

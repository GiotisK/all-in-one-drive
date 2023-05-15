import { CredentialsBox } from "../components/CredentialsBox/CredentialsBox";
import "./LandingPage.css";
import { ReactComponent as Banner } from "../assets/landing_page_banner.svg";

export const LandingPage = () => {
	return (
		<div>
			<Banner />
			<CredentialsBox />
		</div>
	);
};

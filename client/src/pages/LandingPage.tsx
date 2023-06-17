import styled from 'styled-components';
import { CredentialsBox } from '../components/CredentialsBox';
import { ReactComponent as Banner } from '../assets/svgs/landing_page_banner.svg';

const LandingPageContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	background-color: ${props => props.theme.colors.background};
	height: 100%;
`;

const LandingPageTitle = styled.p`
	position: absolute;
	font-family: 'Arciform';
	font-size: 50px;
	color: white;
	left: 1%;
	top: 1%;
	margin: 0;
	font-size: 32px;
	user-select: none;
`;

export const LandingPage = (): JSX.Element => {
	return (
		<LandingPageContainer>
			<LandingPageTitle>aio drive</LandingPageTitle>
			<Banner />
			<CredentialsBox />
		</LandingPageContainer>
	);
};

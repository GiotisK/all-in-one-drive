import styled from 'styled-components';
import { CredentialsBox } from '../components/CredentialsBox';
import { ReactComponent as Banner } from '../assets/svgs/landing_page_banner.svg';
import { ThemeToggle } from '../components/Toggle/ThemeToggle';
import { useEffect, useState } from 'react';
import { authUser } from '../services/user.service';
import { setEmail, setIsAuthenticated } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { routes } from '../shared/constants/routes';
import { useDispatch } from 'react-redux';

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

const ThemeToggleWrapper = styled.div`
	position: absolute;
	right: 2%;
	top: 2%;
`;

export const LandingPage = (): JSX.Element => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [isAuthRequestPending, setIsAuthRequestPending] = useState(true);

	useEffect(() => {
		(async () => {
			const res = await authUser();
			setIsAuthRequestPending(false);
			dispatch(setEmail(res.email));
			dispatch(setIsAuthenticated(res.fulfilled));

			if (res.fulfilled) {
				navigate(routes.drive);
			}
		})();
	}, [navigate, dispatch]);

	return (
		<LandingPageContainer>
			<LandingPageTitle>aio drive</LandingPageTitle>
			<ThemeToggleWrapper>
				<ThemeToggle />
			</ThemeToggleWrapper>
			<Banner />
			{!isAuthRequestPending && <CredentialsBox />}
		</LandingPageContainer>
	);
};

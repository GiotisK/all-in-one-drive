import styled from 'styled-components';
import { routes } from '../shared/constants/routes';
import { useNavigate } from 'react-router-dom';

const ErrorPageBody = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
`;

const ErrorElementsContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const OopsText = styled.h1`
	font-size: 50px;
	color: black;
`;

const InfoText = styled.h2`
	color: black;
`;

const ErrorCodeText = styled.h3`
	font-size: 13px;
	color: gray;
`;

const GoBackText = styled.div`
	text-decoration: underline;
	color: blue;
	cursor: pointer;
`;

interface ErrorProperties {
	greet: string;
	errorCode: string;
	msg: string;
	buttonType: string;
}

export enum ErrorType {
	NotFound = 'notFound',
	Unauthorized = 'unauthorized',
}

interface ErrorPageProps {
	errorType: ErrorType;
}

const errorProperties: Record<ErrorType, ErrorProperties> = {
	[ErrorType.NotFound]: {
		greet: 'Ooops!',
		errorCode: '404',
		msg: "Seems that this page doesn't exist...",
		buttonType: 'back',
	},
	[ErrorType.Unauthorized]: {
		greet: 'Sorry!',
		errorCode: '401',
		msg: 'You are not authorized to view this page.',
		buttonType: 'to login',
	},
};

export const ErrorPage = (props: ErrorPageProps): JSX.Element => {
	const navigate = useNavigate();

	const { greet, msg, errorCode, buttonType } = errorProperties[props.errorType];

	const redirectToHome = () => {
		navigate(routes.home);
	};

	return (
		<ErrorPageBody>
			<ErrorElementsContainer>
				<OopsText>{greet}</OopsText>
				<InfoText>{msg}</InfoText>
				<ErrorCodeText>(Error Code: {errorCode})</ErrorCodeText>
				<GoBackText onClick={redirectToHome}>Go {buttonType}</GoBackText>
			</ErrorElementsContainer>
		</ErrorPageBody>
	);
};

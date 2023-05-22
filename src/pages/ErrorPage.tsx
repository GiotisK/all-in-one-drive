import styled from "styled-components";
import { TitleBanner } from "../components/TitleBanner";

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

interface ErrorObject {
	greet: string;
	errorCode: string;
	msg: string;
	buttonType: string;
}

interface ErrorPageProps {
	errorType: string;
}

export const ErrorPage = (props: ErrorPageProps): JSX.Element => {
	let errorObj: ErrorObject = {
		greet: "",
		errorCode: "",
		msg: "",
		buttonType: "",
	};

	if (props.errorType === "notFound") {
		errorObj = {
			greet: "Ooops!",
			errorCode: "404",
			msg: "Seems that this page doesn't exist...",
			buttonType: "back",
		};
	} else {
		errorObj = {
			greet: "Sorry!",
			errorCode: "401",
			msg: "You are not authorized to view this page.",
			buttonType: "to login",
		};
	}

	return (
		<ErrorPageBody>
			<TitleBanner virtualDriveEnabled={false} popupMenu={false} />{" "}
			{/*TODO: refactor the props */}
			<ErrorElementsContainer>
				<OopsText>{errorObj.greet}</OopsText>
				<InfoText>{errorObj.msg}</InfoText>
				<ErrorCodeText>
					(Error Code: {errorObj.errorCode})
				</ErrorCodeText>
				<a href="http://localhost:3000">Go {errorObj.buttonType}</a>{" "}
				{/**TODO: refactor href to correct */}
			</ErrorElementsContainer>
		</ErrorPageBody>
	);
};

import styled, { keyframes } from "styled-components";

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface LoaderContainerProps {
	loadingText: boolean;
}
const LoaderContainer = styled.div<LoaderContainerProps>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: ${({ loadingText }) => (loadingText ? "15px" : "0px")};
`;

interface LoaderElementProps {
	size: string;
}
const LoaderElement = styled.div<LoaderElementProps>`
	border: 5px solid lightgray;
	border-top: 5px solid #24a0ed;
	border-radius: 50%;
	margin-bottom: 10px;
	animation: ${spinAnimation} 1s linear infinite;
	${({ size }) => `height: ${size}; width: ${size};`}
`;

const LoadingText = styled.p`
	color: gray;
	font-size: 18px;
	margin: 0;
`;

interface LoaderProps {
	loadingText: boolean;
	size: string;
}

export const Loader = (props: LoaderProps): JSX.Element => {
	return (
		<LoaderContainer loadingText={props.loadingText}>
			<LoaderElement size={props.size} />
			{props.loadingText && <LoadingText>Loading...</LoadingText>}
		</LoaderContainer>
	);
};

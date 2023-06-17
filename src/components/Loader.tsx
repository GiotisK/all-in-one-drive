import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
interface LoaderContainerProps {
	$showLoadingText: boolean;
}

const LoaderContainer = styled.div<LoaderContainerProps>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: ${props => (props.$showLoadingText ? '15px' : '0px')};
`;

interface LoaderElementProps {
	size: number;
}
const LoaderElement = styled.div<LoaderElementProps>`
	border: 5px solid ${({ theme }) => theme.colors.border};
	border-top: 5px solid ${({ theme }) => theme.colors.bluePrimary};
	border-radius: 50%;
	margin-bottom: 10px;
	animation: ${spinAnimation} 1s linear infinite;
	${({ size }) => `height: ${size}px; width: ${size}px;`}
`;

const LoadingText = styled.p`
	color: ${({ theme }) => theme.colors.textPrimary};
	font-size: 18px;
	margin: 0;
`;

interface LoaderProps {
	size: number;
	showLoadingText?: boolean;
}

export const Loader = ({ showLoadingText = false, size }: LoaderProps): JSX.Element => {
	return (
		<LoaderContainer $showLoadingText={showLoadingText}>
			<LoaderElement size={size} />
			{showLoadingText && <LoadingText>Loading...</LoadingText>}
		</LoaderContainer>
	);
};

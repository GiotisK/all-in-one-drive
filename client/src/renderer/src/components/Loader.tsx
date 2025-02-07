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
	$backgroundColor?: string;
	$borderColor?: string;
}
const LoaderElement = styled.div<LoaderElementProps>`
	border: 5px solid ${({ theme, $backgroundColor }) => $backgroundColor ?? theme.colors.border};
	border-top: 5px solid ${({ theme, $borderColor }) => $borderColor ?? theme.colors.bluePrimary};
	border-radius: 50%;
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
	backgroundColor?: string;
	borderColor?: string;
}

export const Loader = ({
	size,
	showLoadingText = false,
	backgroundColor,
	borderColor,
}: LoaderProps): JSX.Element => {
	return (
		<LoaderContainer $showLoadingText={showLoadingText}>
			<LoaderElement
				size={size}
				$backgroundColor={backgroundColor}
				$borderColor={borderColor}
			/>
			{showLoadingText && <LoadingText>Loading...</LoadingText>}
		</LoaderContainer>
	);
};

import { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideInFromBottom = keyframes`
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutToBottom = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(20px);
    opacity: 0;
  }
`;

const LoadingBarContainer = styled.div`
	width: 400px;
	height: 20px;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: 4px;
	position: absolute;
	right: 17px;
	animation-delay: 0s;
	bottom: 0px;
	background-color: ${({ theme }) => theme.colors.background};
	color: ${({ theme }) => theme.colors.textPrimary};

	animation: ${slideInFromBottom} 0.5s ease-in-out forwards;

	&.slide-out {
		animation: ${slideOutToBottom} 0.5s ease-in-out forwards;
	}
`;

const RelativeContainer = styled.div`
	position: relative;
`;

const ProgressBar = styled.div`
	height: 20px;
	border-radius: 4px;
	background-color: ${({ theme }) => theme.colors.green};
	white-space: nowrap;
`;

const ProgressText = styled.p`
	margin: 0;
	margin-left: 10px;
	font-size: 13px;
`;

export const LoadingBar = (): JSX.Element => {
	const uploadState = {
		percentage: 10,
		loaded: 10,
		total: 20,
		totalFilesBeingUploaded: 5,
		currentFileNumBeingUploaded: 3,
	};

	const { percentage, loaded, total, totalFilesBeingUploaded, currentFileNumBeingUploaded } =
		uploadState;

	const [isUploading, setIsUploading] = useState(true);

	return (
		<LoadingBarContainer className={isUploading ? '' : 'slide-out'}>
			<RelativeContainer>
				<ProgressBar style={{ width: (400 * percentage) / 100 }}>
					<ProgressText>
						{percentage}% ({loaded}/{total} MB)
						{totalFilesBeingUploaded > 0
							? ` - ${currentFileNumBeingUploaded}/${totalFilesBeingUploaded} files`
							: null}
					</ProgressText>
				</ProgressBar>
			</RelativeContainer>
		</LoadingBarContainer>
	);
};

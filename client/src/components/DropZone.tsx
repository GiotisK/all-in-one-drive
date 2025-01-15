import { PropsWithChildren } from 'react';
import { styled } from 'styled-components';
import { SvgNames, createSvg } from '../shared/utils/svg-utils';

const Container = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	background-color: ${({ theme }) => theme.colors.background};
`;

const DropIndicator = styled.div`
	z-index: 2;
	position: absolute;
	left: 50%;
	top: 8%;
	pointer-events: none;
`;

const SvgContainer = styled.div`
	padding-left: 25%;
	margin-bottom: 5%;
`;

const TextContainer = styled.div`
	margin-top: 2px;
	background-color: ${({ theme }) => theme.colors.background};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: 5px;
	box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

const Text = styled.p`
	margin: 0;
	padding: 1px;
	font-size: 20px;
	color: ${({ theme }) => theme.colors.textPrimary};
`;

const DropZoneBackdrop = styled.div`
	position: fixed;
	display: flex;
	z-index: 1;
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	pointer-events: none;
`;

interface IProps {
	onDrop?: (DragEvent: React.DragEvent<HTMLDivElement>) => void;
	onDragOver?: (DragEvent: React.DragEvent<HTMLDivElement>) => void;
	onDragEnter?: (DragEvent: React.DragEvent<HTMLDivElement>) => void;
	onDragLeave?: (DragEvent: React.DragEvent<HTMLDivElement>) => void;
}
export const DropZone = ({
	onDrop,
	onDragEnter,
	onDragOver,
	onDragLeave,
	children,
}: PropsWithChildren<IProps>) => {
	const isDragging = false;

	return (
		<Container
			onDrop={onDrop}
			onDragOver={onDragOver}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
			{children}
			{isDragging && (
				<>
					<DropZoneBackdrop />
					<DropIndicator>
						<SvgContainer>{createSvg(SvgNames.HandDown, 50, 'white')}</SvgContainer>
						<TextContainer>
							<Text>Drop file(s)</Text>
						</TextContainer>
					</DropIndicator>
				</>
			)}
		</Container>
	);
};

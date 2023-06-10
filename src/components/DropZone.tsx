import { PropsWithChildren } from "react";
import { styled } from "styled-components";
import { SvgNames, createSvg } from "../Shared/utils/svg-utils";

const Container = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
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
	background-color: white;
	border: 1px solid rgb(230, 229, 229);
	border-radius: 5px;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05), 0 3px 6px rgba(0, 0, 0, 0.05);
`;

const Text = styled.p`
	margin: 0;
	padding: 1px;
	font-size: 20px;
	color: rgb(102, 101, 101);
`;

const DropZoneBackdrop = styled.div`
	position: fixed;
	display: flex;
	z-index: 1;
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.1);
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
						<SvgContainer>
							{createSvg(SvgNames.HandDown, 50)}
						</SvgContainer>
						<TextContainer>
							<Text>Drop file(s)</Text>
						</TextContainer>
					</DropIndicator>
				</>
			)}
		</Container>
	);
};

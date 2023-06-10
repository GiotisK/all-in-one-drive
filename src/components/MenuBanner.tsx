import { styled } from "styled-components";
import { SvgNames } from "../Shared/utils/svg-utils";
import { IconButton } from "./IconButton";

const Container = styled.div`
	display: flex;
	flex: 1;
	align-items: flex-end;
	border-bottom: 0.5px solid #f0f0f0;
`;

const BackButtonContainer = styled.div`
	user-select: none;
	cursor: pointer;
`;

const TabTitle = styled.p`
	margin: 0;
	color: gray;
	font-size: 20px;
	user-select: none;
`;

const tabs = ["Name", "Drive", "Size", "Date"];

interface IProps {
	onBackButtonClick: () => void;
}

export const MenuBanner = (props: IProps) => {
	const isUploading = true;

	const getTabWidth = (tab: string) => {
		switch (tab) {
			case "Name":
				return "40%";
			case "Size":
				return "10%";
			case "Drive":
				return "20%";
			case "Date":
				return "20%";
		}
	};

	return (
		<Container>
			{true && (
				<BackButtonContainer
					onClick={props.onBackButtonClick}
					style={{
						pointerEvents: isUploading ? "none" : "all",
						cursor: isUploading ? "default" : "pointer",
					}}
				>
					<IconButton
						icon={SvgNames.Back}
						size={23}
						onClick={props.onBackButtonClick}
					/>
				</BackButtonContainer>
			)}
			{tabs.map((tab, index) => {
				return (
					<div key={index} style={{ width: getTabWidth(tab) }}>
						<TabTitle>{tab}</TabTitle>
					</div>
				);
			})}
		</Container>
	);
};

import { styled, useTheme } from 'styled-components';
import { SvgNames } from '../shared/utils/svg-utils';
import { IconButton } from './IconButton';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	border-bottom: 0.5px solid ${({ theme }) => theme.colors.border};
`;

const FirstRow = styled.div`
	display: flex;
	flex-direction: row;
`;

const SecondRow = styled.div`
	display: flex;
	flex-direction: row;
`;

const BackButtonContainer = styled.div`
	user-select: none;
	cursor: pointer;
`;

const TabTitle = styled.p`
	margin: 0;
	color: ${({ theme }) => theme.colors.textPrimary};
	font-size: 20px;
	user-select: none;
`;

enum Tab {
	Name = 'Name',
	Drive = 'Drive',
	Size = 'Size',
	Date = 'Date',
}

interface IProps {
	onBackButtonClick: () => void;
}

export const MenuBanner = (props: IProps) => {
	const theme = useTheme();
	const isUploading = false;

	const getTabWidth = (tab: Tab) => {
		switch (tab) {
			case Tab.Name:
				return '40%';
			case Tab.Size:
				return '10%';
			case Tab.Drive:
				return '20%';
			case Tab.Date:
				return '20%';
		}
	};

	return (
		<Container>
			<FirstRow>
				{true && (
					<BackButtonContainer
						onClick={props.onBackButtonClick}
						style={{
							pointerEvents: isUploading ? 'none' : 'all',
							cursor: isUploading ? 'default' : 'pointer',
						}}
					>
						<IconButton
							icon={SvgNames.Back}
							size={23}
							onClick={props.onBackButtonClick}
							color={theme?.colors.textPrimary}
						/>
					</BackButtonContainer>
				)}
			</FirstRow>
			<SecondRow>
				{Object.values(Tab).map((tab, index) => {
					return (
						<div key={index} style={{ width: getTabWidth(tab) }}>
							<TabTitle>{tab}</TabTitle>
						</div>
					);
				})}
			</SecondRow>
		</Container>
	);
};

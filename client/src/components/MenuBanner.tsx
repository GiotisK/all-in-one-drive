import { styled } from 'styled-components';
import { SvgNames } from '../shared/utils/svg-utils';
import { IconButton } from './IconButton';

const Container = styled.div`
	display: flex;
	align-items: flex-end;
	border-bottom: 0.5px solid ${({ theme }) => theme.colors.border};
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

const tabs = ['Name', 'Drive', 'Size', 'Date'];

interface IProps {
	onBackButtonClick: () => void;
}

export const MenuBanner = (props: IProps) => {
	const isUploading = false;

	const getTabWidth = (tab: string) => {
		switch (tab) {
			case 'Name':
				return '40%';
			case 'Size':
				return '10%';
			case 'Drive':
				return '20%';
			case 'Date':
				return '20%';
		}
	};

	return (
		<Container>
			{false && (
				<BackButtonContainer
					onClick={props.onBackButtonClick}
					style={{
						pointerEvents: isUploading ? 'none' : 'all',
						cursor: isUploading ? 'default' : 'pointer',
					}}
				>
					<IconButton icon={SvgNames.Back} size={23} onClick={props.onBackButtonClick} />
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

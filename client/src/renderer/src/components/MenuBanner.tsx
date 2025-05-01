import { styled } from 'styled-components';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	border-bottom: 0.5px solid ${({ theme }) => theme.colors.border};
	margin-bottom: 10px;
`;

const SecondRow = styled.div`
	display: flex;
	flex-direction: row;
`;

const TabTitle = styled.p`
	margin: 0;
	color: ${({ theme }) => theme.colors.textPrimary};
	font-size: 16px;
	user-select: none;
`;

enum Tab {
	Name = 'Name',
	Drive = 'Drive',
	Size = 'Size',
	Date = 'Date',
}

export const MenuBanner = () => {
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

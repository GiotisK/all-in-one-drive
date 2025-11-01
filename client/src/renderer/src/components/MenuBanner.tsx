import { CSSProperties } from 'react';
import { styled } from 'styled-components';

const Container = styled.div`
    position: sticky;
    top: 0;
    background-color: ${({ theme }) => theme.colors.background};
    display: flex;
    flex-direction: column;
    border-bottom: 0.5px solid ${({ theme }) => theme.colors.border};
    margin-bottom: 10px;
    z-index: 1;
`;

const SecondRow = styled.div`
    display: flex;
    flex-direction: row;
`;

const TabTitle = styled.p`
    margin: 0;
    margin-left: 5%;
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
    const getStyles = (tab: Tab): CSSProperties => {
        switch (tab) {
            case Tab.Name:
                return { flex: 1, maxWidth: 300 };
            case Tab.Size:
                return { flex: 0.5, textAlign: 'center' };
            case Tab.Drive:
                return { flex: 0.5 };
            case Tab.Date:
                return { flex: 0.5 };
        }
    };

    return (
        <Container>
            <SecondRow>
                {Object.values(Tab).map((tab, index) => {
                    return (
                        <div key={index} style={getStyles(tab)}>
                            <TabTitle>{tab}</TabTitle>
                        </div>
                    );
                })}
            </SecondRow>
        </Container>
    );
};

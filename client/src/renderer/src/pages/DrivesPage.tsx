import { useRef, useState } from 'react';
import { DropZone } from '../components/DropZone';
import { SideMenu } from '../components/SideMenu';
import { TitleBanner } from '../components/TitleBanner';
import { FloatingButtonsContainer } from '../components/FloatingButtons/FloatingButtonsContainer';
import { LoadingBar } from '../components/LoadingBar';
import { styled } from 'styled-components';
import { ModalContainer } from '../components/Modals/ModalContainer';
import { Navigate, Outlet } from 'react-router-dom';
import { routes } from '../shared/constants/routes';
import { useAppSelector } from '../redux/store/store';
import { useRestoreScrollPosition } from '../hooks/useRestoreScrollPosition';
import { useHandleAuthCodeFromUrl } from '../hooks/useHandleAuthCodeFromUrl';
import { useServerSideEvents } from '../hooks/useServerSideEvents';

const OuterContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: auto;
`;

const RowsScrollview = styled.div`
    overflow: auto;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const DrivesPage = (): JSX.Element => {
    const scrollViewRef = useRef<HTMLDivElement>(null);
    const isUserAuthenticated = useAppSelector(state => state.user.isAuthenticated);
    const isSideMenuVisible =
        localStorage.getItem('sideMenuVisible') === null
            ? true
            : localStorage.getItem('sideMenuVisible') === 'true';
    const [sideMenuVisible, setSideMenuVisible] = useState(isSideMenuVisible);

    useHandleAuthCodeFromUrl();
    useServerSideEvents();
    useRestoreScrollPosition(scrollViewRef);

    const toggleSideMenu = () => {
        setSideMenuVisible(prev => !prev);
    };

    return isUserAuthenticated ? (
        <OuterContainer>
            <TitleBanner onBurgerMenuClick={toggleSideMenu} />
            <InnerContainer>
                {sideMenuVisible && <SideMenu />}
                <DropZone>
                    <RowsScrollview ref={scrollViewRef}>
                        <LoadingBar />
                        <Outlet />
                        <FloatingButtonsContainer />
                    </RowsScrollview>
                </DropZone>
            </InnerContainer>
            <ModalContainer />
        </OuterContainer>
    ) : (
        <Navigate to={routes.login} />
    );
};

import { MultimediaModalState } from '../../redux/slices/modal/types';
import { BaseModal } from './BaseModal';
import { styled } from 'styled-components';

const SoundContent = styled.div`
    display: flex;
    z-index: 2;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: max-content;
    height: 100px;
    border-radius: 5px;
`;

const Video = styled.video`
    z-index: 3;
    max-width: 900px;
    max-height: 800px;
`;

const Image = styled.img`
    max-width: 900px;
    max-height: 800px;
`;

interface IProps {
    state: MultimediaModalState;
}

export const MultimediaModal = ({ state }: IProps): JSX.Element => {
    const { mimeType, url } = state;

    const multiMediaType = mimeType.split('/')[0];

    return (
        <BaseModal>
            {multiMediaType === 'audio' && (
                <SoundContent>
                    <audio controls src={url} />
                </SoundContent>
            )}
            {multiMediaType === 'video' && <Video controls src={url} />}
            {multiMediaType === 'image' && <Image src={url} />}
        </BaseModal>
    );
};

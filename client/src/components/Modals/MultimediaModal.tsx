import { BaseModal, BaseModalProps } from './BaseModal';
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

type MultimediaType = 'audio' | 'video' | 'image';

interface IProps extends BaseModalProps {
	multimediaType: MultimediaType;
}

export const MultimediaModal = ({ multimediaType, visible, closeModal }: IProps): JSX.Element => {
	return (
		<BaseModal closeModal={closeModal} visible={visible} showHeader={false}>
			<>
				{multimediaType === 'audio' && (
					<SoundContent>
						<audio
							controls={true}
							/* src={props.openFileLink.src}
							type={mimeTypes[props.openFileLink.extension]} */
						/>
					</SoundContent>
				)}
				{multimediaType === 'video' && (
					<Video
						controls={true}
						/* 	src={props.openFileLink.src}
						type={mimeTypes[props.openFileLink.extension]} */
					/>
				)}
				{multimediaType === 'image' && (
					<Image
					/* src={props.openFileLink.src} */
					/>
				)}
			</>
		</BaseModal>
	);
};

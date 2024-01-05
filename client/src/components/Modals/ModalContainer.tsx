import { useSelector } from 'react-redux';
import { ModalKind, RootState } from '../../redux/types';
import { AddDriveModal } from './AddDriveModal';
import { DeleteModal } from './DeleteModal';
import { ExportFormatModal } from './ExportFormatModal';
import { MultimediaModal } from './MultimediaModal';
import { RenameModal } from './RenameModal';
import { UploadModal } from './UploadModal';

export const ModalContainer = (): JSX.Element | null => {
	const { modal } = useSelector((state: RootState) => state.modal);

	return (
		modal && (
			<>
				{modal.kind === ModalKind.AddDrive && <AddDriveModal />}
				{modal.kind === ModalKind.Delete && <DeleteModal state={modal.state} />}
				{modal.kind === ModalKind.ExportFormat && <ExportFormatModal state={modal.state} />}
				{modal.kind === ModalKind.MultiMedia && <MultimediaModal state={modal.state} />}
				{modal.kind === ModalKind.Rename && <RenameModal />}
				{modal.kind === ModalKind.Upload && <UploadModal state={modal.state} />}
			</>
		)
	);
};

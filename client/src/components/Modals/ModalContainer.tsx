import { AddDriveModal } from './AddDriveModal';
import { DeleteModal } from './DeleteModal';
import { ExportFormatModal } from './ExportFormatModal';
import { MultimediaModal } from './MultimediaModal';
import { RenameModal } from './RenameModal';
import { UploadModal } from './UploadModal';
import { ModalKind } from '../../redux/slices/modal/types';
import { Nullable } from '../../shared/types/global.types';
import { useAppSelector } from '../../redux/store/store';

export const ModalContainer = (): Nullable<JSX.Element> => {
	const { modal } = useAppSelector(state => state.modal);

	return (
		modal && (
			<>
				{modal.kind === ModalKind.AddDrive && <AddDriveModal />}
				{modal.kind === ModalKind.Delete && <DeleteModal state={modal.state} />}
				{modal.kind === ModalKind.ExportFormat && <ExportFormatModal state={modal.state} />}
				{modal.kind === ModalKind.MultiMedia && <MultimediaModal state={modal.state} />}
				{modal.kind === ModalKind.Rename && <RenameModal state={modal.state} />}
				{modal.kind === ModalKind.Upload && <UploadModal state={modal.state} />}
			</>
		)
	);
};

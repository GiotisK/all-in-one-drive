import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	DriveChanges,
	DriveEntity,
	DriveType,
	FileEntity,
	FileType,
	WatchChangesChannel,
} from '../../shared/types/global.types';

export const driveApi = createApi({
	reducerPath: 'driveApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/drives', credentials: 'include' }),
	endpoints: builder => ({
		getDriveRootFiles: builder.query<FileEntity[], void>({
			query: () => ({ url: '/files' }),
			providesTags: ['Files'],
		}),
		getDriveFolderFiles: builder.query<FileEntity[], { driveId?: string; folderId?: string }>({
			query: ({ driveId, folderId }) => ({
				url: `${driveId}/folders/${folderId}/files`,
			}),
			providesTags: ['Files'],
		}),
		deleteFile: builder.mutation<void, { driveId: string; fileId: string }>({
			query: ({ driveId, fileId }) => ({
				url: `${driveId}/files/${fileId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Files'],
		}),
		getDrives: builder.query<DriveEntity[], void>({
			query: () => ({ url: '' }),
			providesTags: ['Drives'],
		}),
		deleteDrive: builder.mutation<void, { driveId: string }>({
			query: ({ driveId }) => ({ url: `/${driveId}`, method: 'DELETE' }),
			invalidatesTags: ['Drives'],
		}),
		getGoogleDriveFileExportFormats: builder.query<
			string[],
			{ driveId: string; fileId: string }
		>({
			query: ({ driveId, fileId }) => ({
				url: `googledrive/${driveId}/files/${fileId}/export/formats`,
			}),
		}),
		shareDriveFile: builder.mutation<
			string,
			{ driveId: string; fileId: string; share: boolean }
		>({
			query: ({ driveId, fileId, share }) => ({
				url: `${driveId}/files/${fileId}`,
				method: 'PATCH',
				body: { share },
			}),
			invalidatesTags: ['Files'],
		}),
		renameDriveFile: builder.mutation<void, { driveId: string; fileId: string; name: string }>({
			query: ({ driveId, fileId, name }) => ({
				url: `${driveId}/files/${fileId}`,
				method: 'PATCH',
				body: { name },
			}),
			invalidatesTags: ['Files'],
		}),
		uploadDriveFile: builder.mutation<
			FileEntity,
			{ driveId: string; file: File; parentFolderId?: string }
		>({
			query: ({ driveId, file, parentFolderId }) => {
				const formData = new FormData();
				formData.append('file', file);
				const queryParam = parentFolderId ? `?parentFolderId=${parentFolderId}` : '';
				return {
					url: `${driveId}/files/upload${queryParam}`,
					method: 'POST',
					body: formData,
					formData: true,
				};
			},
			invalidatesTags: ['Files'],
		}),
		downloadDriveFile: builder.mutation<void, { driveId: string; fileId: string }>({
			query: ({ driveId, fileId }) => ({
				url: `${driveId}/files/${fileId}/download`,
				method: 'GET',
			}),
		}),
		openDriveFile: builder.query<void, { driveId: string; fileId: string }>({
			query: ({ driveId, fileId }) => ({
				url: `${driveId}/files/${fileId}/open`,
				method: 'GET',
			}),
		}),
		createDriveFile: builder.mutation<
			FileEntity,
			{ driveId: string; fileType: FileType; parentFolderId?: string }
		>({
			query: ({ driveId, fileType, parentFolderId }) => ({
				url: `${driveId}/folders`,
				method: 'POST',
				body: { parentFolderId, type: fileType },
			}),
			invalidatesTags: ['Files'],
		}),
		exportGoogleDriveFile: builder.mutation<
			void,
			{ driveId: string; fileId: string; mimeType: string }
		>({
			query: ({ driveId, fileId, mimeType }) => ({
				url: `googledrive/${driveId}/files/${fileId}/export?mimeType=${mimeType}`,
				method: 'GET',
			}),
		}),
		getAuthLink: builder.query<string, { drive?: DriveType }>({
			query: ({ drive }) => ({
				url: `${drive}/authlink`,
				method: 'GET',
				responseHandler: res => res.text(),
			}),
		}),
		connectDrive: builder.mutation<boolean, { authCode: string; drive: DriveType }>({
			query: ({ authCode, drive }) => ({
				url: `${drive}/connect`,
				method: 'POST',
				body: { authCode },
			}),
			invalidatesTags: ['Files', 'Drives'],
		}),
		watchDriveChanges: builder.query<WatchChangesChannel[], { driveIds: string[] }>({
			query: ({ driveIds }) => ({
				url: '/watch',
				method: 'POST',
				body: { driveIds },
			}),
		}),
		getDriveChanges: builder.query<DriveChanges, { driveId: string; startPageToken: string }>({
			query: ({ driveId, startPageToken }) => ({
				url: `/${driveId}/changes?startPageToken=${startPageToken}`,
			}),
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				try {
					const { driveId } = args;
					const { data } = await queryFulfilled;
					dispatch(
						driveApi.util.updateQueryData('getDriveRootFiles', undefined, draft => {
							data.changes.forEach(changedFileEntity => {
								const index = draft.findIndex(
									fileEntity => fileEntity.id === changedFileEntity.id
								);
								if (index !== -1) {
									if (changedFileEntity.removed) {
										draft.splice(index, 1);
									} else {
										draft[index].name = changedFileEntity.name;
										draft[index] = {
											...draft[index],
											name: changedFileEntity.name,
											sharedLink: changedFileEntity.sharedLink,
											date: changedFileEntity.date,
										};
									}
								}
							});
						})
					);

					dispatch(
						driveApi.util.updateQueryData(
							'watchDriveChanges',
							{ driveIds: [driveId] },
							draft => {
								const index = draft.findIndex(
									channel => channel.driveId === driveId
								);

								if (index !== -1) {
									draft[index].startPageToken = data.startPageToken;
								}
							}
						)
					);
				} catch (e) {
					console.error('Error updating the files', e);
				}
			},
		}),
	}),
	tagTypes: ['Drives', 'Files'],
});

export const {
	useGetDriveRootFilesQuery,
	useGetDriveFolderFilesQuery,
	useGetDrivesQuery,
	useLazyGetDrivesQuery,
	useDeleteDriveMutation,
	useDeleteFileMutation,
	useGetGoogleDriveFileExportFormatsQuery,
	useShareDriveFileMutation,
	useRenameDriveFileMutation,
	useUploadDriveFileMutation,
	useDownloadDriveFileMutation,
	useLazyOpenDriveFileQuery,
	useCreateDriveFileMutation,
	useExportGoogleDriveFileMutation,
	useConnectDriveMutation,
	useGetAuthLinkQuery,
	useWatchDriveChangesQuery,
	useGetDriveChangesQuery,
} = driveApi;

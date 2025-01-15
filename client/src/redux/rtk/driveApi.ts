import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { DriveEntity, FileEntity } from '../../shared/types/global.types';

export const driveApi = createApi({
	reducerPath: 'driveApi',
	baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/drives', credentials: 'include' }),
	endpoints: builder => ({
		getDriveRootFiles: builder.query<FileEntity[], void>({
			query: () => ({ url: '/files' }),
			providesTags: ['Files', 'Drives'],
		}),
		getDriveFolderFiles: builder.query<FileEntity[], { driveId?: string; folderId?: string }>({
			query: ({ driveId, folderId }) => ({
				url: `${driveId}/folders/${folderId}/files`,
			}),
			providesTags: ['Drives', 'Files'],
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
		}),
		downloadDriveFile: builder.mutation<void, { driveId: string; fileId: string }>({
			query: ({ driveId, fileId }) => ({
				url: `${driveId}/files/${fileId}/download`,
				method: 'GET',
			}),
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
} = driveApi;

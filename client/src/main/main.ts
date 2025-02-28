import { app, BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 600,
	});

	// Vite dev server URL
	mainWindow.loadURL('http://localhost:5173');
	mainWindow.on('closed', () => (mainWindow = null));
}

app.whenReady().then(() => {
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow == null) {
		createWindow();
	}
});

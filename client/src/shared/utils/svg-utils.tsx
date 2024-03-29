import { ReactComponent as AddFile } from '../../assets/svgs/add-file.svg';
import { ReactComponent as AddFolder } from '../../assets/svgs/add-folder.svg';
import { ReactComponent as Burger } from '../../assets/svgs/burger.svg';
import { ReactComponent as Close } from '../../assets/svgs/close.svg';
import { ReactComponent as Plus } from '../../assets/svgs/plus.svg';
import { ReactComponent as Trashcan } from '../../assets/svgs/trashcan.svg';
import { ReactComponent as OneDrive } from '../../assets/svgs/onedrive.svg';
import { ReactComponent as GoogleDrive } from '../../assets/svgs/googledrive.svg';
import { ReactComponent as Dropbox } from '../../assets/svgs/dropbox.svg';
import { ReactComponent as Link } from '../../assets/svgs/link.svg';
import { ReactComponent as Dots } from '../../assets/svgs/dots.svg';
import { ReactComponent as HandDown } from '../../assets/svgs/hand-down.svg';
import { ReactComponent as Back } from '../../assets/svgs/back.svg';
import { ReactComponent as Sun } from '../../assets/svgs/sun.svg';
import { ReactComponent as Moon } from '../../assets/svgs/moon.svg';
import { Nullable } from '../types/global.types';

export enum SvgNames {
	AddFile = 'add-file',
	AddFolder = 'add-folder',
	Burger = 'burger',
	Close = 'close',
	Plus = 'plus',
	Trashcan = 'trashcan',
	OneDrive = 'onedrive',
	GoogleDrive = 'googledrive',
	Dropbox = 'dropbox',
	Link = 'link',
	Dots = 'dots',
	HandDown = 'hand-down',
	Back = 'back',
	Sun = 'sun',
	Moon = 'moon',
}

export const createSvg = (name: SvgNames, size = 24, color = 'black'): Nullable<JSX.Element> => {
	switch (name) {
		case SvgNames.AddFile:
			return <AddFile color={color} width={size} height={size} />;
		case SvgNames.AddFolder:
			return <AddFolder color={color} width={size} height={size} />;
		case SvgNames.Burger:
			return <Burger color={color} width={size} height={size} />;
		case SvgNames.Close:
			return <Close color={color} width={size} height={size} />;
		case SvgNames.Plus:
			return <Plus color={color} width={size} height={size} />;
		case SvgNames.Trashcan:
			return <Trashcan color={color} width={size} height={size} />;
		case SvgNames.OneDrive:
			return <OneDrive color={color} width={size} height={size} />;
		case SvgNames.GoogleDrive:
			return <GoogleDrive color={color} width={size} height={size} />;
		case SvgNames.Dropbox:
			return <Dropbox color={color} width={size} height={size} />;
		case SvgNames.Link:
			return <Link color={color} width={size} height={size} />;
		case SvgNames.Dots:
			return <Dots color={color} width={size} height={size} />;
		case SvgNames.HandDown:
			return <HandDown color={color} width={size} height={size} />;
		case SvgNames.Back:
			return <Back color={color} width={size} height={size} />;
		case SvgNames.Sun:
			return <Sun color={color} width={size} height={size} />;
		case SvgNames.Moon:
			return <Moon color={color} width={size} height={size} />;
		default:
			return null;
	}
};

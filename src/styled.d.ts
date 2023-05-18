// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
	export interface DefaultTheme {
		colors: {
			bluePrimary: string;
			blueSecondary: string;
			textPrimary: string;
		};
	}
}

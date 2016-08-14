import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import './public/icons.scss'
import './public/utils.scss'
import './public/main.scss'
import './public/hacks.scss'

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch(err => console.error(err))

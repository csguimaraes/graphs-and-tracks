import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'

import '../public/styles/icons.scss'
import '../public/styles/utils.scss'
import '../public/styles/main.scss'
import '../public/styles/hacks.scss'

platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch(err => console.error(err))

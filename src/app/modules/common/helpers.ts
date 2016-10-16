import * as lodash from 'lodash'

export type ExportType = 'module' | 'component' | 'serice' | 'directive' | 'pipe' | 'model'

export function filterExports(exports: Object, forType: ExportType, warn = false) {
	let results = []
	let prefix = lodash.upperFirst(forType)
	for (let exportName in exports) {
		if (exports.hasOwnProperty(exportName)) {
			if (lodash.endsWith(exportName, prefix) === false) {
				if (warn) {
					console.warn(`Skipping export ${exportName} from autoloading as it seems to not be a ${forType}`)
				}
			} else {
				results.push(exports[exportName])
			}
		}
	}

	return results
}

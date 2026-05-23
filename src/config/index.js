const configuredFileBaseUrl = import.meta.env.VITE_FILE_BASE_URL?.trim() || ''

export const fileBaseUrl = configuredFileBaseUrl

export const resolveFileUrl = (filePath, fallback = '') => {
	if (!filePath) {
		return fallback
	}

	if (/^https?:\/\//i.test(filePath)) {
		return filePath.replace(/^http:\/\/159\.75\.169\.224:1235/i, '')
	}

	if (configuredFileBaseUrl) {
		return `${configuredFileBaseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`
	}

	return filePath.startsWith('/') ? filePath : `/${filePath}`
}
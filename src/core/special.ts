/**
 * Special module - structures related to process names that have special meaning in
 * certain environments.
 * @module special
 */

interface ProcessMeta {
	name: string;
	msgs: Msg[];
}

export interface Msg {
	provider: string;
	docUrl: string;
	text: string;
}

/**
 * Process names with special meaning in certain environments.
 * @todo How do we enforce unique name properties for these items?
 */
export const PROCESS_NAMES: ProcessMeta[] = [
	{
		name: 'cmd',
		msgs: [
			{
				provider: 'Deis',
				docUrl: 'https://pythonhosted.org/deis/using_deis/process-types/',
				text: 'The `cmd` process type is special as only it and the `web` process types will receive HTTP traffic from Deis’s routers.',
			},
		],
	},
	{
		name: 'release',
		msgs: [
			{
				provider: 'Heroku',
				docUrl:
					'https://devcenter.heroku.com/articles/procfile#the-release-process-type',
				text: 'The `release` process type is used to specify the command to run during your app’s release phase.',
			},
		],
	},
	{
		name: 'web',
		msgs: [
			{
				provider: 'Deis',
				docUrl: 'https://pythonhosted.org/deis/using_deis/process-types/',
				text: 'The `web` process type is special as only it and the `cmd` process types will receive HTTP traffic from Deis’s routers.',
			},
			{
				provider: 'Heroku',
				docUrl: 'https://devcenter.heroku.com/articles/procfile#the-web-process-type',
				text: 'A Heroku app’s `web` process type is special: it’s the only process type that can receive external HTTP traffic from Heroku’s routers. If your app includes a web server, you should declare it as your app’s web process.',
			},
		],
	},
];

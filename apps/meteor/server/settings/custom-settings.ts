import { settingsRegistry } from '../../app/settings/server';

export const createCustomSettings = () =>
	settingsRegistry.addGroup('CustomSettings', async function () {
		await this.add('Default_Invitation_link', '0', {
			type: 'select',
			values: [
				{
					key: '0',
					i18nLabel: 'Бесконечная',
				},
				{
					key: '1',
					i18nLabel: '1 день',
				},
				{
					key: '7',
					i18nLabel: '7 дней',
				},
				{
					key: '15',
					i18nLabel: '15 дней',
				},
				{
					key: '30',
					i18nLabel: '30 дней',
				},
			],
			public: true,
		});
		
	});

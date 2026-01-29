
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';

// Mock the router before importing the component so navigation calls can be asserted.
const push = vi.fn(() => Promise.resolve());
vi.mock('vue-router', () => ({ useRouter: () => ({ push }) }));

import TheWelcome from '@/components/TheWelcome.vue'

describe('TheWelcome', () => {
	beforeEach(() => {
		push.mockClear();
	});

	it('renders headline, features and footer year', () => {
		const wrapper = mount(TheWelcome, {
			global: {
				// Stub the heroicon components used in the template to avoid extra noise in tests
				stubs: ['CalendarDaysIcon', 'TagIcon', 'ChartBarIcon', 'ArrowPathIcon', 'FlagIcon', 'LockClosedIcon'],
			},
		});

		// Headline
		expect(wrapper.text()).toContain('Your finances, planned like a calendar.');

		// A feature title from the features array
		expect(wrapper.text()).toContain('Cash-flow calendar');

		// Footer year
		const year = new Date().getFullYear().toString();
		expect(wrapper.text()).toContain(year);
	});

	it('navigates to calendar and about when buttons clicked', async () => {
		const wrapper = mount(TheWelcome, {
			global: {
				stubs: ['CalendarDaysIcon', 'TagIcon', 'ChartBarIcon', 'ArrowPathIcon', 'FlagIcon', 'LockClosedIcon'],
			},
		});

		const startBtn = wrapper.findAll('button').find((b) => b.text().includes('Start now'));
		await startBtn?.trigger('click');
		expect(push).toHaveBeenCalledWith({ path: '/calendar' });

		const learnBtn = wrapper.findAll('button').find((b) => b.text().includes('Learn more'));
		await learnBtn?.trigger('click');
		expect(push).toHaveBeenCalledWith({ path: '/about' });
	});
});


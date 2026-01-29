import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TheAboutContainer from '@/components/TheAboutContainer.vue';
import { CalendarDaysIcon } from '@/ui/icons';

describe('TheAboutContainer (props-driven)', () => {
  it('renders provided content and calls callbacks', async () => {
    const onGoToApp = vi.fn();
    const onGoToHome = vi.fn();


    const props = {
      year: 2026,
      mission: 'Test mission statement',
      principles: [
        { title: 'Planning-first', desc: 'desc', icon: CalendarDaysIcon },
      ],
      roadmap: [
        { title: 'Calendar cash flow', items: ['one', 'two'], icon: CalendarDaysIcon },
      ],
      faqs: [{ q: 'Q?', a: 'A.' }],
      onGoToApp,
      onGoToHome,
    };

    const wrapper = mount(TheAboutContainer, {
      props,
      global: {},
    });

    // Check main heading and mission
    expect(wrapper.text()).toContain('Plan money with clarity.');
    expect(wrapper.text()).toContain(props.mission);

    // Principle and roadmap titles
    expect(wrapper.text()).toContain('Planning-first');
    expect(wrapper.text()).toContain('Calendar cash flow');

    // Footer year
    expect(wrapper.text()).toContain('2026');

    // Buttons call the passed callbacks
    const back = wrapper.findAll('button').find((b) => b.text().includes('Back to home'));
    await back?.trigger('click');
    expect(onGoToHome).toHaveBeenCalled();

    const openApp = wrapper.findAll('button').find((b) => b.text().includes('Open app'));
    await openApp?.trigger('click');
    expect(onGoToApp).toHaveBeenCalled();

    const homeBtn = wrapper.findAll('button').find((b) => b.text().trim() === 'Home');
    await homeBtn?.trigger('click');
    expect(onGoToHome).toHaveBeenCalledTimes(2);
  });
});

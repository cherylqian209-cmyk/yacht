import { Project } from '@/types/project';

const uid = () => Math.random().toString(36).slice(2, 10);

export function generateWaitlistPage(goal: string): Project {
  const projectId = uid();
  const heroId = uid();
  const headlineId = uid();
  const subtextId = uid();
  const formId = uid();
  const inputId = uid();
  const buttonId = uid();

  const cleanGoal = goal.trim() || 'your product';

  return {
    id: projectId,
    goal: cleanGoal,
    status: 'generated',
    actions: ['Goal received', 'Generated waitlist page from template'],
    systemMessages: ['Build engine created an initial hero + signup flow.'],
    components: [
      {
        id: heroId,
        type: 'hero',
        props: {
          styleClass:
            'mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm text-center space-y-5'
        },
        children: [
          {
            id: headlineId,
            type: 'headline',
            props: {
              text: `Launch ${cleanGoal} faster with Yacht`,
              styleClass: 'text-4xl font-bold tracking-tight text-slate-900'
            }
          },
          {
            id: subtextId,
            type: 'subtext',
            props: {
              text: `We generated this waitlist page for ${cleanGoal}. Collect qualified leads before you ship.`,
              styleClass: 'text-lg text-slate-600'
            }
          },
          {
            id: formId,
            type: 'form',
            props: {
              styleClass: 'mx-auto mt-4 flex max-w-md flex-col gap-3 sm:flex-row'
            },
            children: [
              {
                id: inputId,
                type: 'input',
                props: {
                  placeholder: 'Enter your email',
                  styleClass:
                    'h-11 flex-1 rounded-lg border border-slate-300 px-4 text-slate-900 outline-none focus:border-slate-500'
                }
              },
              {
                id: buttonId,
                type: 'button',
                props: {
                  text: 'Join Waitlist',
                  submittedText: 'You are on the list!',
                  styleClass:
                    'h-11 rounded-lg bg-slate-900 px-5 font-medium text-white transition hover:bg-slate-700'
                }
              }
            ]
          }
        ]
      }
    ]
  };
}

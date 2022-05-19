import { IDetailQuestion } from '@/api/types/question'

export const question: IDetailQuestion = {
  id: 1,
  title: 'title',
  label: 'label',
  isPublic: true,
  config: {},
  keywords: [
    ['1', '2', '3', '4'],
    ['2', '3', '4']
  ],
  answer: {
    id: 1,
    text: 'text',
    config: {}
  }
}

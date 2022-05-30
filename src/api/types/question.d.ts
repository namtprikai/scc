export interface IDetailQuestion {
    id: number
    title: string
    label: string
    isPublic: boolean
    config: null | object
    keywords: Array<Array<string>>
    answer: {
      id: number
      text: string
      config: null | object
    }
  }

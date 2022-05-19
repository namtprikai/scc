interface ICategories {
    id: number
    text: string
    questions: {
      id: number
      text: string
      products: number[]
    }[]
    products?: number[]
  }

export interface ICategoriesQuestion {
    id: number
    text: string
    products: number[]
    categories: ICategories[]
  }

import request from '@/utils/request'

export const getDetailQuestions = (idQuestion: number) =>
  request({
    url: `/question/${idQuestion}/details`,
    method: 'get'
  })

export const isValidUsername = (str: string) => true; // str.trim()//['admin', 'editor'].indexOf(str.trim()) >= 0;

export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path);

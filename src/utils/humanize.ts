export const humanize = (str:string) =>
  str
    .replace(/\./g, ' ')                                          // replace '.' with ' '
    .replace(/_/g, ' ')                                           // replace '_' with ' '
    .replace(/([a-z])([A-Z])/g, '$1 $2')                          // camelCase -> camel Case
    .toLowerCase()                                                // Lowercase everything
    .replace(/^./, str => str.toUpperCase())    // uppercase first letter

export const humanizeOptions = (options:Record<string, string>) =>
  Object
    .entries(options)
    .reduce((acc, [key, val]) => ({ ...acc, [key]: humanize(val) }), {})

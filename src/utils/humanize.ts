export const humanize = (str:string) =>
  str
    .replace(/\./g, ' ')                                          // replace '.' with ' '
    .replace(/_/g, ' ')                                           // replace '_' with ' '
    .replace(/([A-Z])/g, ' $1')                                   // camelCase -> Camel Case
    .toLowerCase()                                                // Lowercase everything
    .replace(/^./, function(str){ return str.toUpperCase(); })    // uppercase first letter

export const humanizeOptions = (options:Record<string, string>) =>
  Object
    .entries(options)
    .reduce((acc, [key, val]) => ({ ...acc, [key]: humanize(val) }), {})

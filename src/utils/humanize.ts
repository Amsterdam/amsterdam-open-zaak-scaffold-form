export const humanize = (str:string) =>
  str
    .replace(/\./g, ' ')                                          // replace '.' with ' '
    .replace(/([A-Z])/g, ' $1')                                   // camelCase -> Camel Case
    .replace(/^./, function(str){ return str.toUpperCase(); })    // uppercase first letter

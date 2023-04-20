// minimum type declaration for `python-format-js`
declare module 'python-format-js' {
  function format(
    template: string,
    parameters: TemplateParameters,
  ): string;

  type TemplateParameters = { [key: string]: string };

  export = format;
}

module.exports = function (plop) {
  plop.setGenerator("component", {
    description: "Create a React component with Storybook story",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.jsx",
        templateFile: "plop-templates/Component.jsx.hbs",
      },
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.stories.jsx",
        templateFile: "plop-templates/Story.jsx.hbs",
      },
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/{{pascalCase name}}.css",
        templateFile: "plop-templates/Style.css.hbs",
      },
      {
        type: "add",
        path: "src/components/{{pascalCase name}}/index.js",
        template: `export * from './{{pascalCase name}}';`,
      },
    ],
  });
};

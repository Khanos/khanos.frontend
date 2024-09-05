import * as prettier from "prettier/standalone";
import * as babelParser from "prettier/parser-babel";
import * as htmlParser from "prettier/parser-html";
import * as prettierPluginEstree from "prettier/plugins/estree";

const DEFAULT_SIZE = 24;

const isValidSVG = (svg: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  return doc.documentElement.tagName === 'svg';
}

const replaceForReact = (svg: string) => {
  return svg.replace(/width=".*?"/, `width={${DEFAULT_SIZE}}`)
    .replace(/height=".*?"/, `height={${DEFAULT_SIZE}}`)
    .replace(/<svg/, `<svg className={\`\${className} icon\`\} style={{ width: \`\${size}px\`, height: \`\${size}px\`, ...style }}`)
    .replace(/class=".*?"/, '');
}

const replaceForVue = (svg: string) => {
  return svg.replace(/width=".*?"/, `:width="size"`)
    .replace(/height=".*?"/, `:height="size"`)
    .replace(/<svg/, `<svg :style="{ width: \`\${size}px\`, height: \`\${size}px\` }"`)
    .replace(/class=".*?"/, '');
}

const replaceForAngular = (svg: string) => {
  return svg.replace(/width=".*?"/, `width="{{ size }}"`)
    .replace(/height=".*?"/, `height="{{ size }}"`)
    .replace(/<svg/, `<svg style="width: {{ size }}px; height: {{ size }}px; color: {{ color }}; {{ style }} stroke-width: {{ stroke }}"`)
    .replace(/class=".*?"/, '');
}

const replaceForSvelte = (svg: string) => {
  return svg.replace(/width=".*?"/, `width={size}`)
    .replace(/height=".*?"/, `height={size}`)
    .replace(/<svg/, `<svg class={className} style="width: {size}px; height: {size}px; {style}"`)
    .replace(/class=".*?"/, '');
}

export const svgToReactComponent = async (svg: string) => {
  const isValid = isValidSVG(svg);
  if (!isValid) {
    return 'Invalid SVG';
  }
  const svgElement = replaceForReact(svg);

  const code = `
    import * as React from "react";

    const Icon = ({ size = 24, style = {}, className }) => {
      return (
        ${svgElement}
      );
    };

    export default Icon;
  `;

  return await prettier.format(code, {
    semi: true,
    bracketSpacing: true,
    vueIndentScriptAndStyle: true,
    parser: "babel",
    plugins: [babelParser, prettierPluginEstree],
  });
};

export const svgToVueComponent = async (svg: string) => {
  const isValid = isValidSVG(svg);
  if (!isValid) {
    return 'Invalid SVG';
  }
  
  const svgElement = replaceForVue(svg);
  const code = `
    <template>
      ${svgElement}
    </template>

    <script>
    export default {
      name: 'Icon',
      props: {
        size: {
          type: Number,
          default: 24
        }
      }
    }
    </script>
  `;

  return await prettier.format(code, {
    semi: true,
    bracketSpacing: true,
    parser: "vue",
    plugins: [htmlParser],
  });
};

export const svgToAngularComponent = async (svg: string) => {
  const isValid = isValidSVG(svg);
  if (!isValid) {
    return 'Invalid SVG';
  }
  const svgElement = replaceForAngular(svg);
  const code = `
    import { Component, Input } from "@angular/core";

    @Component({
      selector: "icon",
      template: \`${svgElement}\`,
    })
    export class IconComponent {
      @Input() style: string = "";
      @Input() size: number | string = 24;
      @Input() stroke: number | string = 24;
      @Input() color: string = "";

      constructor() {}
    }
  `;

  return await prettier.format(code, {
    parser: "html",
    plugins: [htmlParser, prettierPluginEstree],
  });
};

export const svgToSvelteComponent = async (svg: string) => {
  const isValid = isValidSVG(svg);
  if (!isValid) {
    return 'Invalid SVG';
  }
  const svgElement = replaceForSvelte(svg);
  const code = `
    <script>
      export let size = 24;
      export let className = '';
      export let style = '';
    </script>

    <svg {size} {className} {style}>
      ${svgElement}
    </svg>
  `;

  return await prettier.format(code, {
    semi: true,
    bracketSpacing: true,
    parser: "html",
    plugins: [htmlParser, prettierPluginEstree],
  });
};
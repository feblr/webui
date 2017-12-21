import * as request from 'request';
import * as fs from 'fs';
import * as path from 'path';

interface Property {
  type?: string;
  enum?: string[];
  items?: Property;
  format?: string;
  description?: string;
  $ref?: string;
}

interface Definition {
  properties: {[name: string]: Property};
}

interface Tag {
  name: string;
  description: string;
}

interface Response {
  description: string;
  schema: {
    $ref?: string;
    type: string;
  };
}

interface PathConfig {
  operationId: string;
  tags: string[];
  parameters: ApiParam[];
  responses: {[status: string]: Response};
}

interface Path {
  post: PathConfig;
  get: PathConfig;
}

interface SwaggerData {
  basePath: string;
  definitions: {[name: string]: Definition};
  tags: Tag[];
  paths: {[name: string]: Path};
}

type ApiMethod = 'post' | 'get';

interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  schema?: {
    type: string;
    $ref: string;
  };
}

interface ApiEndpoint {
  operationId: string;
  method: ApiMethod;
  baseUri: string;
  path: string;
  params: ApiParam[];
  responses: {[status: string]: Response};
}

interface Model {
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
}


let writeContentTypeFile = function(swagger: SwaggerData, output: string) {
  if (!swagger.definitions) {
    return '';
  }

  let definitionNames = Object.keys(swagger.definitions);
  let content = definitionNames.map((definitionName) => {
    let definition = swagger.definitions[definitionName];

    if ('CLientResultBean«object»' == definitionName) {
      return '';
    }

    if (/Collection«.*»/.test(definitionName)) {
      return '';
    }

    if (/Map«.*»/.test(definitionName)) {
      return '';
    }

    if (/ActionValueVo«.*»/.test(definitionName)) {
      return '';
    }

    if (definition.properties) {
      let propertyNames = Object.keys(definition.properties);
      let properties = propertyNames.map((propertyName) => {
        let property = definition.properties[propertyName];
        let propertyType: string;
        if (property.$ref) {
          let parts = property.$ref.split('/');
          propertyType = parts[parts.length - 1];
        } else {
          propertyType = property.type;
        }

        return ['  ', propertyName, ': ', propertyType, ';'].join('');
      }).join('\n');

      let tmpl = `
export interface ${definitionName} {
${properties}
}
`;

      return tmpl;
    } else {
      return '';
    }
  }).join('\n');

  let typeAlias = `export type object = Object;
export type file = File;
export type array = any[];
export type long = number;
export type int = number;
export type integer = number;
export type float = number;
export type double = number;
export type int64 = number;
export type Collection<T> = Array<T>;
export type List<T> = Array<T>;
export interface ActionValueVo<T> {
  value: T;
}
`;

  let filePath = path.join(output, 'content.ts');
  fs.writeFileSync(filePath, typeAlias + content);
};

let tagToModel = function(tag: Tag) {
  let parts = tag.name.split('-');
  let name = parts.slice(0, parts.length - 1).map((part) => {
    return part.toUpperCase().slice(0, 1) + part.slice(1);
  }).join('');

  return {
    name: name,
    description: tag.description,
    endpoints: [] as ApiEndpoint[]
  };
};

let parse = function(data: SwaggerData): Map<string, Model> {
  let models: Map<string, Model> = new Map<string, Model>();
  data.tags.forEach(function(tag) {
    let model = tagToModel(tag);

    models.set(tag.name, model);
  });

  let paths = Object.keys(data.paths);

  paths.forEach((path) => {
    let endpoint = data.paths[path];
    let methods = Object.keys(endpoint);

    methods.forEach((method) => {
      let config: PathConfig = endpoint[method];
      let tag = config.tags[0];
      let model = models.get(tag);

      if (model && model.endpoints) {
        model.endpoints.push({
          operationId: config.operationId,
          method: <ApiMethod>method,
          baseUri: data.basePath,
          path: path,
          params: config.parameters,
          responses: config.responses
        });
      }
    });
  });

  return models;
};

let generateClass = function(model: Model, paramInterface: string, memeberFunc: string) {
  let headerTpl =
`
import { Response, Http } from '../request';
import { file, array, long, integer, int, float, double, int64, object } from './content';
import * as content from './content';
/*
 * name: ${model.name}
 * description: ${model.description}
 */

${paramInterface}

export class ${model.name} {
  constructor(private http: Http) {
  }
${memeberFunc}
}
`;

  return headerTpl;
};

let generateTypes = function(model: Model, endpoint: ApiEndpoint): string {
  let paramsType = endpoint.operationId.toUpperCase().slice(0, 1) + endpoint.operationId.slice(1, endpoint.operationId.length) + 'Params';

  let params: string;
  if (endpoint.params) {
    params = endpoint.params.map((params) => {
      let name: string;
      let type: string;

      if (params.name === 'userId') {
        name = 'userId?';
      } else if (params.required) {
        name = params.name;
      } else {
        name = params.name + '?';
      }

      if (params.schema) {
        if (params.schema.type) {
          type = params.schema.type;
        } else if (params.schema.$ref) {
          let parts = params.schema.$ref.split('/');
          if (parts[parts.length - 1] === 'RedirectAttributes' || parts[parts.length - 1] === 'MultipartHttpServletRequest') {
            type = 'void';
          } else {
            type = 'content.' + parts[parts.length - 1];
          }
        } else {
          type = 'void';
        }
      } else if (params.type) {
        type = params.type;
      } else {
        type = 'void';
      }

      return ['  ' + name, ': ', type, ';'].join('');
    }).join('\n');
  } else {
    params = '';
  }

  let interfaceTpl =
`export interface ${paramsType} {
${params}
}
`;

  return interfaceTpl;
};

let generateMemberFunc = function(model: Model, endpoint: ApiEndpoint): string {
  let paramsType = endpoint.operationId.toUpperCase().slice(0, 1) + endpoint.operationId.slice(1, endpoint.operationId.length) + 'Params';

  let response = endpoint.responses[200];
  let contentType = 'void';
  if (response.schema) {
    if (response.schema.$ref) {
      let parts = response.schema.$ref.split('/');
      if (parts[parts.length - 1].indexOf('CLientResultBean') !== -1) {
        contentType = 'any';
      } else {
        contentType = 'content.' + parts[parts.length - 1];
      }
    } else if (response.schema.type) {
      contentType = response.schema.type;
    } else {
      contentType = 'void';
    }
  }

  contentType = contentType.replace(/»/g, '>').replace(/«/g, '<');

  let segments: string[] = [];

  let path = endpoint.baseUri + endpoint.path.replace(/{(.*?)}/g, (match, param) => {
    segments.push(param + ': string');
    return '\' + ' + param + ' + \'';
  });

  segments.push(`params: ${paramsType}`); 

  let funcTpl =
`
  ${endpoint.operationId}(${segments.join(', ')}) {
    return this.http.${endpoint.method}<${paramsType}, ${contentType}>(
      '${path}',
      params
    );
  }
`;

  return funcTpl;
};

let writeModelFile = function(output: string, model: Model, name: string) {
  let types = model.endpoints.map((endpoint) => {
    return generateTypes(model, endpoint);
  }).join('\n');

  let memberFunc = model.endpoints.map((endpoint) => {
    return generateMemberFunc(model, endpoint);
  }).join('');

  let cls = generateClass(model, types, memberFunc);
  let parts = name.split('-');
  let filename = parts.slice(0, parts.length - 1).join('-');
  let filePath = path.join(output, filename + '.ts');
  fs.writeFileSync(filePath, cls);
};

let generate = function(models: Map<string, Model>, output: string) {
  models.forEach((model, name) => writeModelFile(output, model, name));
};

const API_DOC_URI = process.env.npm_config_endpoint;
const OUTPUT_DIR = process.env.npm_config_output;
const qs = {
  group: 'all'
};

const option = {
  method: 'GET',
  uri: API_DOC_URI,
  qs: qs
};

request(option, (err: Error, response: any, body: string) => {
  if (!err) {
    let data = <SwaggerData>JSON.parse(body);

    let models = parse(data);

    writeContentTypeFile(data, OUTPUT_DIR);

    generate(models, OUTPUT_DIR);
  }
});

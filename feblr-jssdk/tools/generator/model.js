"use strict";
const request = require("request");
const fs = require("fs");
const path = require("path");
let writeContentTypeFile = function (swagger, output) {
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
                let propertyType;
                if (property.$ref) {
                    let parts = property.$ref.split('/');
                    propertyType = parts[parts.length - 1];
                }
                else {
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
        }
        else {
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
let tagToModel = function (tag) {
    let parts = tag.name.split('-');
    let name = parts.slice(0, parts.length - 1).map((part) => {
        return part.toUpperCase().slice(0, 1) + part.slice(1);
    }).join('');
    return {
        name: name,
        description: tag.description,
        endpoints: []
    };
};
let parse = function (data) {
    let models = new Map();
    data.tags.forEach(function (tag) {
        let model = tagToModel(tag);
        models.set(tag.name, model);
    });
    let paths = Object.keys(data.paths);
    paths.forEach((path) => {
        let endpoint = data.paths[path];
        let methods = Object.keys(endpoint);
        methods.forEach((method) => {
            let config = endpoint[method];
            let tag = config.tags[0];
            let model = models.get(tag);
            if (model && model.endpoints) {
                model.endpoints.push({
                    operationId: config.operationId,
                    method: method,
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
let generateClass = function (model, paramInterface, memeberFunc) {
    let headerTpl = `
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
let generateTypes = function (model, endpoint) {
    let paramsType = endpoint.operationId.toUpperCase().slice(0, 1) + endpoint.operationId.slice(1, endpoint.operationId.length) + 'Params';
    let params;
    if (endpoint.params) {
        params = endpoint.params.map((params) => {
            let name;
            let type;
            if (params.name === 'userId') {
                name = 'userId?';
            }
            else if (params.required) {
                name = params.name;
            }
            else {
                name = params.name + '?';
            }
            if (params.schema) {
                if (params.schema.type) {
                    type = params.schema.type;
                }
                else if (params.schema.$ref) {
                    let parts = params.schema.$ref.split('/');
                    if (parts[parts.length - 1] === 'RedirectAttributes' || parts[parts.length - 1] === 'MultipartHttpServletRequest') {
                        type = 'void';
                    }
                    else {
                        type = 'content.' + parts[parts.length - 1];
                    }
                }
                else {
                    type = 'void';
                }
            }
            else if (params.type) {
                type = params.type;
            }
            else {
                type = 'void';
            }
            return ['  ' + name, ': ', type, ';'].join('');
        }).join('\n');
    }
    else {
        params = '';
    }
    let interfaceTpl = `export interface ${paramsType} {
${params}
}
`;
    return interfaceTpl;
};
let generateMemberFunc = function (model, endpoint) {
    let paramsType = endpoint.operationId.toUpperCase().slice(0, 1) + endpoint.operationId.slice(1, endpoint.operationId.length) + 'Params';
    let response = endpoint.responses[200];
    let contentType = 'void';
    if (response.schema) {
        if (response.schema.$ref) {
            let parts = response.schema.$ref.split('/');
            if (parts[parts.length - 1].indexOf('CLientResultBean') !== -1) {
                contentType = 'any';
            }
            else {
                contentType = 'content.' + parts[parts.length - 1];
            }
        }
        else if (response.schema.type) {
            contentType = response.schema.type;
        }
        else {
            contentType = 'void';
        }
    }
    contentType = contentType.replace(/»/g, '>').replace(/«/g, '<');
    let segments = [];
    let path = endpoint.baseUri + endpoint.path.replace(/{(.*?)}/g, (match, param) => {
        segments.push(param + ': string');
        return '\' + ' + param + ' + \'';
    });
    segments.push(`params: ${paramsType}`);
    let funcTpl = `
  ${endpoint.operationId}(${segments.join(', ')}) {
    return this.http.${endpoint.method}<${paramsType}, ${contentType}>(
      '${path}',
      params
    );
  }
`;
    return funcTpl;
};
let writeModelFile = function (output, model, name) {
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
let generate = function (models, output) {
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
request(option, (err, response, body) => {
    if (!err) {
        let data = JSON.parse(body);
        let models = parse(data);
        writeContentTypeFile(data, OUTPUT_DIR);
        generate(models, OUTPUT_DIR);
    }
});
//# sourceMappingURL=model.js.map
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  MusicAnalysisPlugin: () => MusicAnalysisPlugin,
  default: () => MusicAnalysisPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/sha256.ts
async function sha256(buffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// node_modules/yaml/browser/dist/nodes/identity.js
var ALIAS = Symbol.for("yaml.alias");
var DOC = Symbol.for("yaml.document");
var MAP = Symbol.for("yaml.map");
var PAIR = Symbol.for("yaml.pair");
var SCALAR = Symbol.for("yaml.scalar");
var SEQ = Symbol.for("yaml.seq");
var NODE_TYPE = Symbol.for("yaml.node.type");
var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
function isCollection(node) {
  if (node && typeof node === "object")
    switch (node[NODE_TYPE]) {
      case MAP:
      case SEQ:
        return true;
    }
  return false;
}
function isNode(node) {
  if (node && typeof node === "object")
    switch (node[NODE_TYPE]) {
      case ALIAS:
      case MAP:
      case SCALAR:
      case SEQ:
        return true;
    }
  return false;
}
var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;

// node_modules/yaml/browser/dist/visit.js
var BREAK = Symbol("break visit");
var SKIP = Symbol("skip children");
var REMOVE = Symbol("remove node");
function visit(node, visitor) {
  const visitor_ = initVisitor(visitor);
  if (isDocument(node)) {
    const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
    if (cd === REMOVE)
      node.contents = null;
  } else
    visit_(null, node, visitor_, Object.freeze([]));
}
visit.BREAK = BREAK;
visit.SKIP = SKIP;
visit.REMOVE = REMOVE;
function visit_(key, node, visitor, path) {
  const ctrl = callVisitor(key, node, visitor, path);
  if (isNode(ctrl) || isPair(ctrl)) {
    replaceNode(key, path, ctrl);
    return visit_(key, ctrl, visitor, path);
  }
  if (typeof ctrl !== "symbol") {
    if (isCollection(node)) {
      path = Object.freeze(path.concat(node));
      for (let i = 0; i < node.items.length; ++i) {
        const ci = visit_(i, node.items[i], visitor, path);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK)
          return BREAK;
        else if (ci === REMOVE) {
          node.items.splice(i, 1);
          i -= 1;
        }
      }
    } else if (isPair(node)) {
      path = Object.freeze(path.concat(node));
      const ck = visit_("key", node.key, visitor, path);
      if (ck === BREAK)
        return BREAK;
      else if (ck === REMOVE)
        node.key = null;
      const cv = visit_("value", node.value, visitor, path);
      if (cv === BREAK)
        return BREAK;
      else if (cv === REMOVE)
        node.value = null;
    }
  }
  return ctrl;
}
async function visitAsync(node, visitor) {
  const visitor_ = initVisitor(visitor);
  if (isDocument(node)) {
    const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
    if (cd === REMOVE)
      node.contents = null;
  } else
    await visitAsync_(null, node, visitor_, Object.freeze([]));
}
visitAsync.BREAK = BREAK;
visitAsync.SKIP = SKIP;
visitAsync.REMOVE = REMOVE;
async function visitAsync_(key, node, visitor, path) {
  const ctrl = await callVisitor(key, node, visitor, path);
  if (isNode(ctrl) || isPair(ctrl)) {
    replaceNode(key, path, ctrl);
    return visitAsync_(key, ctrl, visitor, path);
  }
  if (typeof ctrl !== "symbol") {
    if (isCollection(node)) {
      path = Object.freeze(path.concat(node));
      for (let i = 0; i < node.items.length; ++i) {
        const ci = await visitAsync_(i, node.items[i], visitor, path);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK)
          return BREAK;
        else if (ci === REMOVE) {
          node.items.splice(i, 1);
          i -= 1;
        }
      }
    } else if (isPair(node)) {
      path = Object.freeze(path.concat(node));
      const ck = await visitAsync_("key", node.key, visitor, path);
      if (ck === BREAK)
        return BREAK;
      else if (ck === REMOVE)
        node.key = null;
      const cv = await visitAsync_("value", node.value, visitor, path);
      if (cv === BREAK)
        return BREAK;
      else if (cv === REMOVE)
        node.value = null;
    }
  }
  return ctrl;
}
function initVisitor(visitor) {
  if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
    return Object.assign({
      Alias: visitor.Node,
      Map: visitor.Node,
      Scalar: visitor.Node,
      Seq: visitor.Node
    }, visitor.Value && {
      Map: visitor.Value,
      Scalar: visitor.Value,
      Seq: visitor.Value
    }, visitor.Collection && {
      Map: visitor.Collection,
      Seq: visitor.Collection
    }, visitor);
  }
  return visitor;
}
function callVisitor(key, node, visitor, path) {
  if (typeof visitor === "function")
    return visitor(key, node, path);
  if (isMap(node))
    return visitor.Map?.(key, node, path);
  if (isSeq(node))
    return visitor.Seq?.(key, node, path);
  if (isPair(node))
    return visitor.Pair?.(key, node, path);
  if (isScalar(node))
    return visitor.Scalar?.(key, node, path);
  if (isAlias(node))
    return visitor.Alias?.(key, node, path);
  return void 0;
}
function replaceNode(key, path, node) {
  const parent = path[path.length - 1];
  if (isCollection(parent)) {
    parent.items[key] = node;
  } else if (isPair(parent)) {
    if (key === "key")
      parent.key = node;
    else
      parent.value = node;
  } else if (isDocument(parent)) {
    parent.contents = node;
  } else {
    const pt = isAlias(parent) ? "alias" : "scalar";
    throw new Error(`Cannot replace node with ${pt} parent`);
  }
}

// node_modules/yaml/browser/dist/doc/directives.js
var escapeChars = {
  "!": "%21",
  ",": "%2C",
  "[": "%5B",
  "]": "%5D",
  "{": "%7B",
  "}": "%7D"
};
var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
var Directives = class _Directives {
  constructor(yaml, tags) {
    this.docStart = null;
    this.docEnd = false;
    this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
    this.tags = Object.assign({}, _Directives.defaultTags, tags);
  }
  clone() {
    const copy = new _Directives(this.yaml, this.tags);
    copy.docStart = this.docStart;
    return copy;
  }
  /**
   * During parsing, get a Directives instance for the current document and
   * update the stream state according to the current version's spec.
   */
  atDocument() {
    const res = new _Directives(this.yaml, this.tags);
    switch (this.yaml.version) {
      case "1.1":
        this.atNextDocument = true;
        break;
      case "1.2":
        this.atNextDocument = false;
        this.yaml = {
          explicit: _Directives.defaultYaml.explicit,
          version: "1.2"
        };
        this.tags = Object.assign({}, _Directives.defaultTags);
        break;
    }
    return res;
  }
  /**
   * @param onError - May be called even if the action was successful
   * @returns `true` on success
   */
  add(line, onError) {
    if (this.atNextDocument) {
      this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
      this.tags = Object.assign({}, _Directives.defaultTags);
      this.atNextDocument = false;
    }
    const parts = line.trim().split(/[ \t]+/);
    const name = parts.shift();
    switch (name) {
      case "%TAG": {
        if (parts.length !== 2) {
          onError(0, "%TAG directive should contain exactly two parts");
          if (parts.length < 2)
            return false;
        }
        const [handle, prefix] = parts;
        this.tags[handle] = prefix;
        return true;
      }
      case "%YAML": {
        this.yaml.explicit = true;
        if (parts.length !== 1) {
          onError(0, "%YAML directive should contain exactly one part");
          return false;
        }
        const [version] = parts;
        if (version === "1.1" || version === "1.2") {
          this.yaml.version = version;
          return true;
        } else {
          const isValid = /^\d+\.\d+$/.test(version);
          onError(6, `Unsupported YAML version ${version}`, isValid);
          return false;
        }
      }
      default:
        onError(0, `Unknown directive ${name}`, true);
        return false;
    }
  }
  /**
   * Resolves a tag, matching handles to those defined in %TAG directives.
   *
   * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
   *   `'!local'` tag, or `null` if unresolvable.
   */
  tagName(source, onError) {
    if (source === "!")
      return "!";
    if (source[0] !== "!") {
      onError(`Not a valid tag: ${source}`);
      return null;
    }
    if (source[1] === "<") {
      const verbatim = source.slice(2, -1);
      if (verbatim === "!" || verbatim === "!!") {
        onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
        return null;
      }
      if (source[source.length - 1] !== ">")
        onError("Verbatim tags must end with a >");
      return verbatim;
    }
    const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
    if (!suffix)
      onError(`The ${source} tag has no suffix`);
    const prefix = this.tags[handle];
    if (prefix) {
      try {
        return prefix + decodeURIComponent(suffix);
      } catch (error) {
        onError(String(error));
        return null;
      }
    }
    if (handle === "!")
      return source;
    onError(`Could not resolve tag: ${source}`);
    return null;
  }
  /**
   * Given a fully resolved tag, returns its printable string form,
   * taking into account current tag prefixes and defaults.
   */
  tagString(tag) {
    for (const [handle, prefix] of Object.entries(this.tags)) {
      if (tag.startsWith(prefix))
        return handle + escapeTagName(tag.substring(prefix.length));
    }
    return tag[0] === "!" ? tag : `!<${tag}>`;
  }
  toString(doc) {
    const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
    const tagEntries = Object.entries(this.tags);
    let tagNames;
    if (doc && tagEntries.length > 0 && isNode(doc.contents)) {
      const tags = {};
      visit(doc.contents, (_key, node) => {
        if (isNode(node) && node.tag)
          tags[node.tag] = true;
      });
      tagNames = Object.keys(tags);
    } else
      tagNames = [];
    for (const [handle, prefix] of tagEntries) {
      if (handle === "!!" && prefix === "tag:yaml.org,2002:")
        continue;
      if (!doc || tagNames.some((tn) => tn.startsWith(prefix)))
        lines.push(`%TAG ${handle} ${prefix}`);
    }
    return lines.join("\n");
  }
};
Directives.defaultYaml = { explicit: false, version: "1.2" };
Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };

// node_modules/yaml/browser/dist/doc/anchors.js
function anchorIsValid(anchor) {
  if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
    const sa = JSON.stringify(anchor);
    const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
    throw new Error(msg);
  }
  return true;
}
function anchorNames(root) {
  const anchors = /* @__PURE__ */ new Set();
  visit(root, {
    Value(_key, node) {
      if (node.anchor)
        anchors.add(node.anchor);
    }
  });
  return anchors;
}
function findNewAnchor(prefix, exclude) {
  for (let i = 1; true; ++i) {
    const name = `${prefix}${i}`;
    if (!exclude.has(name))
      return name;
  }
}
function createNodeAnchors(doc, prefix) {
  const aliasObjects = [];
  const sourceObjects = /* @__PURE__ */ new Map();
  let prevAnchors = null;
  return {
    onAnchor: (source) => {
      aliasObjects.push(source);
      prevAnchors ?? (prevAnchors = anchorNames(doc));
      const anchor = findNewAnchor(prefix, prevAnchors);
      prevAnchors.add(anchor);
      return anchor;
    },
    /**
     * With circular references, the source node is only resolved after all
     * of its child nodes are. This is why anchors are set only after all of
     * the nodes have been created.
     */
    setAnchors: () => {
      for (const source of aliasObjects) {
        const ref = sourceObjects.get(source);
        if (typeof ref === "object" && ref.anchor && (isScalar(ref.node) || isCollection(ref.node))) {
          ref.node.anchor = ref.anchor;
        } else {
          const error = new Error("Failed to resolve repeated object (this should not happen)");
          error.source = source;
          throw error;
        }
      }
    },
    sourceObjects
  };
}

// node_modules/yaml/browser/dist/doc/applyReviver.js
function applyReviver(reviver, obj, key, val) {
  if (val && typeof val === "object") {
    if (Array.isArray(val)) {
      for (let i = 0, len = val.length; i < len; ++i) {
        const v0 = val[i];
        const v1 = applyReviver(reviver, val, String(i), v0);
        if (v1 === void 0)
          delete val[i];
        else if (v1 !== v0)
          val[i] = v1;
      }
    } else if (val instanceof Map) {
      for (const k of Array.from(val.keys())) {
        const v0 = val.get(k);
        const v1 = applyReviver(reviver, val, k, v0);
        if (v1 === void 0)
          val.delete(k);
        else if (v1 !== v0)
          val.set(k, v1);
      }
    } else if (val instanceof Set) {
      for (const v0 of Array.from(val)) {
        const v1 = applyReviver(reviver, val, v0, v0);
        if (v1 === void 0)
          val.delete(v0);
        else if (v1 !== v0) {
          val.delete(v0);
          val.add(v1);
        }
      }
    } else {
      for (const [k, v0] of Object.entries(val)) {
        const v1 = applyReviver(reviver, val, k, v0);
        if (v1 === void 0)
          delete val[k];
        else if (v1 !== v0)
          val[k] = v1;
      }
    }
  }
  return reviver.call(obj, key, val);
}

// node_modules/yaml/browser/dist/nodes/toJS.js
function toJS(value, arg, ctx) {
  if (Array.isArray(value))
    return value.map((v, i) => toJS(v, String(i), ctx));
  if (value && typeof value.toJSON === "function") {
    if (!ctx || !hasAnchor(value))
      return value.toJSON(arg, ctx);
    const data = { aliasCount: 0, count: 1, res: void 0 };
    ctx.anchors.set(value, data);
    ctx.onCreate = (res2) => {
      data.res = res2;
      delete ctx.onCreate;
    };
    const res = value.toJSON(arg, ctx);
    if (ctx.onCreate)
      ctx.onCreate(res);
    return res;
  }
  if (typeof value === "bigint" && !ctx?.keep)
    return Number(value);
  return value;
}

// node_modules/yaml/browser/dist/nodes/Node.js
var NodeBase = class {
  constructor(type) {
    Object.defineProperty(this, NODE_TYPE, { value: type });
  }
  /** Create a copy of this node.  */
  clone() {
    const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /** A plain JavaScript representation of this node. */
  toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
    if (!isDocument(doc))
      throw new TypeError("A document argument is required");
    const ctx = {
      anchors: /* @__PURE__ */ new Map(),
      doc,
      keep: true,
      mapAsMap: mapAsMap === true,
      mapKeyWarned: false,
      maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
    };
    const res = toJS(this, "", ctx);
    if (typeof onAnchor === "function")
      for (const { count, res: res2 } of ctx.anchors.values())
        onAnchor(res2, count);
    return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
  }
};

// node_modules/yaml/browser/dist/nodes/Alias.js
var Alias = class extends NodeBase {
  constructor(source) {
    super(ALIAS);
    this.source = source;
    Object.defineProperty(this, "tag", {
      set() {
        throw new Error("Alias nodes cannot have tags");
      }
    });
  }
  /**
   * Resolve the value of this alias within `doc`, finding the last
   * instance of the `source` anchor before this node.
   */
  resolve(doc, ctx) {
    if (ctx?.maxAliasCount === 0)
      throw new ReferenceError("Alias resolution is disabled");
    let nodes;
    if (ctx?.aliasResolveCache) {
      nodes = ctx.aliasResolveCache;
    } else {
      nodes = [];
      visit(doc, {
        Node: (_key, node) => {
          if (isAlias(node) || hasAnchor(node))
            nodes.push(node);
        }
      });
      if (ctx)
        ctx.aliasResolveCache = nodes;
    }
    let found = void 0;
    for (const node of nodes) {
      if (node === this)
        break;
      if (node.anchor === this.source)
        found = node;
    }
    return found;
  }
  toJSON(_arg, ctx) {
    if (!ctx)
      return { source: this.source };
    const { anchors, doc, maxAliasCount } = ctx;
    const source = this.resolve(doc, ctx);
    if (!source) {
      const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
      throw new ReferenceError(msg);
    }
    let data = anchors.get(source);
    if (!data) {
      toJS(source, null, ctx);
      data = anchors.get(source);
    }
    if (data?.res === void 0) {
      const msg = "This should not happen: Alias anchor was not resolved?";
      throw new ReferenceError(msg);
    }
    if (maxAliasCount >= 0) {
      data.count += 1;
      if (data.aliasCount === 0)
        data.aliasCount = getAliasCount(doc, source, anchors);
      if (data.count * data.aliasCount > maxAliasCount) {
        const msg = "Excessive alias count indicates a resource exhaustion attack";
        throw new ReferenceError(msg);
      }
    }
    return data.res;
  }
  toString(ctx, _onComment, _onChompKeep) {
    const src = `*${this.source}`;
    if (ctx) {
      anchorIsValid(this.source);
      if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
        const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
        throw new Error(msg);
      }
      if (ctx.implicitKey)
        return `${src} `;
    }
    return src;
  }
};
function getAliasCount(doc, node, anchors) {
  if (isAlias(node)) {
    const source = node.resolve(doc);
    const anchor = anchors && source && anchors.get(source);
    return anchor ? anchor.count * anchor.aliasCount : 0;
  } else if (isCollection(node)) {
    let count = 0;
    for (const item of node.items) {
      const c = getAliasCount(doc, item, anchors);
      if (c > count)
        count = c;
    }
    return count;
  } else if (isPair(node)) {
    const kc = getAliasCount(doc, node.key, anchors);
    const vc = getAliasCount(doc, node.value, anchors);
    return Math.max(kc, vc);
  }
  return 1;
}

// node_modules/yaml/browser/dist/nodes/Scalar.js
var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
var Scalar = class extends NodeBase {
  constructor(value) {
    super(SCALAR);
    this.value = value;
  }
  toJSON(arg, ctx) {
    return ctx?.keep ? this.value : toJS(this.value, arg, ctx);
  }
  toString() {
    return String(this.value);
  }
};
Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
Scalar.PLAIN = "PLAIN";
Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";

// node_modules/yaml/browser/dist/doc/createNode.js
var defaultTagPrefix = "tag:yaml.org,2002:";
function findTagObject(value, tagName, tags) {
  if (tagName) {
    const match = tags.filter((t) => t.tag === tagName);
    const tagObj = match.find((t) => !t.format) ?? match[0];
    if (!tagObj)
      throw new Error(`Tag ${tagName} not found`);
    return tagObj;
  }
  return tags.find((t) => t.identify?.(value) && !t.format);
}
function createNode(value, tagName, ctx) {
  if (isDocument(value))
    value = value.contents;
  if (isNode(value))
    return value;
  if (isPair(value)) {
    const map2 = ctx.schema[MAP].createNode?.(ctx.schema, null, ctx);
    map2.items.push(value);
    return map2;
  }
  if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
    value = value.valueOf();
  }
  const { aliasDuplicateObjects, onAnchor, onTagObj, schema: schema4, sourceObjects } = ctx;
  let ref = void 0;
  if (aliasDuplicateObjects && value && typeof value === "object") {
    ref = sourceObjects.get(value);
    if (ref) {
      ref.anchor ?? (ref.anchor = onAnchor(value));
      return new Alias(ref.anchor);
    } else {
      ref = { anchor: null, node: null };
      sourceObjects.set(value, ref);
    }
  }
  if (tagName?.startsWith("!!"))
    tagName = defaultTagPrefix + tagName.slice(2);
  let tagObj = findTagObject(value, tagName, schema4.tags);
  if (!tagObj) {
    if (value && typeof value.toJSON === "function") {
      value = value.toJSON();
    }
    if (!value || typeof value !== "object") {
      const node2 = new Scalar(value);
      if (ref)
        ref.node = node2;
      return node2;
    }
    tagObj = value instanceof Map ? schema4[MAP] : Symbol.iterator in Object(value) ? schema4[SEQ] : schema4[MAP];
  }
  if (onTagObj) {
    onTagObj(tagObj);
    delete ctx.onTagObj;
  }
  const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar(value);
  if (tagName)
    node.tag = tagName;
  else if (!tagObj.default)
    node.tag = tagObj.tag;
  if (ref)
    ref.node = node;
  return node;
}

// node_modules/yaml/browser/dist/nodes/Collection.js
function collectionFromPath(schema4, path, value) {
  let v = value;
  for (let i = path.length - 1; i >= 0; --i) {
    const k = path[i];
    if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
      const a = [];
      a[k] = v;
      v = a;
    } else {
      v = /* @__PURE__ */ new Map([[k, v]]);
    }
  }
  return createNode(v, void 0, {
    aliasDuplicateObjects: false,
    keepUndefined: false,
    onAnchor: () => {
      throw new Error("This should not happen, please report a bug.");
    },
    schema: schema4,
    sourceObjects: /* @__PURE__ */ new Map()
  });
}
var isEmptyPath = (path) => path == null || typeof path === "object" && !!path[Symbol.iterator]().next().done;
var Collection = class extends NodeBase {
  constructor(type, schema4) {
    super(type);
    Object.defineProperty(this, "schema", {
      value: schema4,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  /**
   * Create a copy of this collection.
   *
   * @param schema - If defined, overwrites the original's schema
   */
  clone(schema4) {
    const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    if (schema4)
      copy.schema = schema4;
    copy.items = copy.items.map((it) => isNode(it) || isPair(it) ? it.clone(schema4) : it);
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /**
   * Adds a value to the collection. For `!!map` and `!!omap` the value must
   * be a Pair instance or a `{ key, value }` object, which may not have a key
   * that already exists in the map.
   */
  addIn(path, value) {
    if (isEmptyPath(path))
      this.add(value);
    else {
      const [key, ...rest] = path;
      const node = this.get(key, true);
      if (isCollection(node))
        node.addIn(rest, value);
      else if (node === void 0 && this.schema)
        this.set(key, collectionFromPath(this.schema, rest, value));
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }
  /**
   * Removes a value from the collection.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(path) {
    const [key, ...rest] = path;
    if (rest.length === 0)
      return this.delete(key);
    const node = this.get(key, true);
    if (isCollection(node))
      return node.deleteIn(rest);
    else
      throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(path, keepScalar) {
    const [key, ...rest] = path;
    const node = this.get(key, true);
    if (rest.length === 0)
      return !keepScalar && isScalar(node) ? node.value : node;
    else
      return isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
  }
  hasAllNullValues(allowScalar) {
    return this.items.every((node) => {
      if (!isPair(node))
        return false;
      const n = node.value;
      return n == null || allowScalar && isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   */
  hasIn(path) {
    const [key, ...rest] = path;
    if (rest.length === 0)
      return this.has(key);
    const node = this.get(key, true);
    return isCollection(node) ? node.hasIn(rest) : false;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(path, value) {
    const [key, ...rest] = path;
    if (rest.length === 0) {
      this.set(key, value);
    } else {
      const node = this.get(key, true);
      if (isCollection(node))
        node.setIn(rest, value);
      else if (node === void 0 && this.schema)
        this.set(key, collectionFromPath(this.schema, rest, value));
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyComment.js
var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
function indentComment(comment, indent) {
  if (/^\n+$/.test(comment))
    return comment.substring(1);
  return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
}
var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;

// node_modules/yaml/browser/dist/stringify/foldFlowLines.js
var FOLD_FLOW = "flow";
var FOLD_BLOCK = "block";
var FOLD_QUOTED = "quoted";
function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
  if (!lineWidth || lineWidth < 0)
    return text;
  if (lineWidth < minContentWidth)
    minContentWidth = 0;
  const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
  if (text.length <= endStep)
    return text;
  const folds = [];
  const escapedFolds = {};
  let end = lineWidth - indent.length;
  if (typeof indentAtStart === "number") {
    if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
      folds.push(0);
    else
      end = lineWidth - indentAtStart;
  }
  let split = void 0;
  let prev = void 0;
  let overflow = false;
  let i = -1;
  let escStart = -1;
  let escEnd = -1;
  if (mode === FOLD_BLOCK) {
    i = consumeMoreIndentedLines(text, i, indent.length);
    if (i !== -1)
      end = i + endStep;
  }
  for (let ch; ch = text[i += 1]; ) {
    if (mode === FOLD_QUOTED && ch === "\\") {
      escStart = i;
      switch (text[i + 1]) {
        case "x":
          i += 3;
          break;
        case "u":
          i += 5;
          break;
        case "U":
          i += 9;
          break;
        default:
          i += 1;
      }
      escEnd = i;
    }
    if (ch === "\n") {
      if (mode === FOLD_BLOCK)
        i = consumeMoreIndentedLines(text, i, indent.length);
      end = i + indent.length + endStep;
      split = void 0;
    } else {
      if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
        const next = text[i + 1];
        if (next && next !== " " && next !== "\n" && next !== "	")
          split = i;
      }
      if (i >= end) {
        if (split) {
          folds.push(split);
          end = split + endStep;
          split = void 0;
        } else if (mode === FOLD_QUOTED) {
          while (prev === " " || prev === "	") {
            prev = ch;
            ch = text[i += 1];
            overflow = true;
          }
          const j = i > escEnd + 1 ? i - 2 : escStart - 1;
          if (escapedFolds[j])
            return text;
          folds.push(j);
          escapedFolds[j] = true;
          end = j + endStep;
          split = void 0;
        } else {
          overflow = true;
        }
      }
    }
    prev = ch;
  }
  if (overflow && onOverflow)
    onOverflow();
  if (folds.length === 0)
    return text;
  if (onFold)
    onFold();
  let res = text.slice(0, folds[0]);
  for (let i2 = 0; i2 < folds.length; ++i2) {
    const fold = folds[i2];
    const end2 = folds[i2 + 1] || text.length;
    if (fold === 0)
      res = `
${indent}${text.slice(0, end2)}`;
    else {
      if (mode === FOLD_QUOTED && escapedFolds[fold])
        res += `${text[fold]}\\`;
      res += `
${indent}${text.slice(fold + 1, end2)}`;
    }
  }
  return res;
}
function consumeMoreIndentedLines(text, i, indent) {
  let end = i;
  let start = i + 1;
  let ch = text[start];
  while (ch === " " || ch === "	") {
    if (i < start + indent) {
      ch = text[++i];
    } else {
      do {
        ch = text[++i];
      } while (ch && ch !== "\n");
      end = i;
      start = i + 1;
      ch = text[start];
    }
  }
  return end;
}

// node_modules/yaml/browser/dist/stringify/stringifyString.js
var getFoldOptions = (ctx, isBlock2) => ({
  indentAtStart: isBlock2 ? ctx.indent.length : ctx.indentAtStart,
  lineWidth: ctx.options.lineWidth,
  minContentWidth: ctx.options.minContentWidth
});
var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
function lineLengthOverLimit(str, lineWidth, indentLength) {
  if (!lineWidth || lineWidth < 0)
    return false;
  const limit = lineWidth - indentLength;
  const strLen = str.length;
  if (strLen <= limit)
    return false;
  for (let i = 0, start = 0; i < strLen; ++i) {
    if (str[i] === "\n") {
      if (i - start > limit)
        return true;
      start = i + 1;
      if (strLen - start <= limit)
        return false;
    }
  }
  return true;
}
function doubleQuotedString(value, ctx) {
  const json = JSON.stringify(value);
  if (ctx.options.doubleQuotedAsJSON)
    return json;
  const { implicitKey } = ctx;
  const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
  const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
  let str = "";
  let start = 0;
  for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
    if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
      str += json.slice(start, i) + "\\ ";
      i += 1;
      start = i;
      ch = "\\";
    }
    if (ch === "\\")
      switch (json[i + 1]) {
        case "u":
          {
            str += json.slice(start, i);
            const code = json.substr(i + 2, 4);
            switch (code) {
              case "0000":
                str += "\\0";
                break;
              case "0007":
                str += "\\a";
                break;
              case "000b":
                str += "\\v";
                break;
              case "001b":
                str += "\\e";
                break;
              case "0085":
                str += "\\N";
                break;
              case "00a0":
                str += "\\_";
                break;
              case "2028":
                str += "\\L";
                break;
              case "2029":
                str += "\\P";
                break;
              default:
                if (code.substr(0, 2) === "00")
                  str += "\\x" + code.substr(2);
                else
                  str += json.substr(i, 6);
            }
            i += 5;
            start = i + 1;
          }
          break;
        case "n":
          if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
            i += 1;
          } else {
            str += json.slice(start, i) + "\n\n";
            while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
              str += "\n";
              i += 2;
            }
            str += indent;
            if (json[i + 2] === " ")
              str += "\\";
            i += 1;
            start = i + 1;
          }
          break;
        default:
          i += 1;
      }
  }
  str = start ? str + json.slice(start) : json;
  return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx, false));
}
function singleQuotedString(value, ctx) {
  if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
    return doubleQuotedString(value, ctx);
  const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
  const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
  return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
function quotedString(value, ctx) {
  const { singleQuote } = ctx.options;
  let qs;
  if (singleQuote === false)
    qs = doubleQuotedString;
  else {
    const hasDouble = value.includes('"');
    const hasSingle = value.includes("'");
    if (hasDouble && !hasSingle)
      qs = singleQuotedString;
    else if (hasSingle && !hasDouble)
      qs = doubleQuotedString;
    else
      qs = singleQuote ? singleQuotedString : doubleQuotedString;
  }
  return qs(value, ctx);
}
var blockEndNewlines;
try {
  blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
} catch {
  blockEndNewlines = /\n+(?!\n|$)/g;
}
function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
  const { blockQuote, commentString, lineWidth } = ctx.options;
  if (!blockQuote || /\n[\t ]+$/.test(value)) {
    return quotedString(value, ctx);
  }
  const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
  const literal = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.BLOCK_FOLDED ? false : type === Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
  if (!value)
    return literal ? "|\n" : ">\n";
  let chomp;
  let endStart;
  for (endStart = value.length; endStart > 0; --endStart) {
    const ch = value[endStart - 1];
    if (ch !== "\n" && ch !== "	" && ch !== " ")
      break;
  }
  let end = value.substring(endStart);
  const endNlPos = end.indexOf("\n");
  if (endNlPos === -1) {
    chomp = "-";
  } else if (value === end || endNlPos !== end.length - 1) {
    chomp = "+";
    if (onChompKeep)
      onChompKeep();
  } else {
    chomp = "";
  }
  if (end) {
    value = value.slice(0, -end.length);
    if (end[end.length - 1] === "\n")
      end = end.slice(0, -1);
    end = end.replace(blockEndNewlines, `$&${indent}`);
  }
  let startWithSpace = false;
  let startEnd;
  let startNlPos = -1;
  for (startEnd = 0; startEnd < value.length; ++startEnd) {
    const ch = value[startEnd];
    if (ch === " ")
      startWithSpace = true;
    else if (ch === "\n")
      startNlPos = startEnd;
    else
      break;
  }
  let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
  if (start) {
    value = value.substring(start.length);
    start = start.replace(/\n+/g, `$&${indent}`);
  }
  const indentSize = indent ? "2" : "1";
  let header = (startWithSpace ? indentSize : "") + chomp;
  if (comment) {
    header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
    if (onComment)
      onComment();
  }
  if (!literal) {
    const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
    let literalFallback = false;
    const foldOptions = getFoldOptions(ctx, true);
    if (blockQuote !== "folded" && type !== Scalar.BLOCK_FOLDED) {
      foldOptions.onOverflow = () => {
        literalFallback = true;
      };
    }
    const body = foldFlowLines(`${start}${foldedValue}${end}`, indent, FOLD_BLOCK, foldOptions);
    if (!literalFallback)
      return `>${header}
${indent}${body}`;
  }
  value = value.replace(/\n+/g, `$&${indent}`);
  return `|${header}
${indent}${start}${value}${end}`;
}
function plainString(item, ctx, onComment, onChompKeep) {
  const { type, value } = item;
  const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
  if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
    return quotedString(value, ctx);
  }
  if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
    return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
  }
  if (!implicitKey && !inFlow && type !== Scalar.PLAIN && value.includes("\n")) {
    return blockString(item, ctx, onComment, onChompKeep);
  }
  if (containsDocumentMarker(value)) {
    if (indent === "") {
      ctx.forceBlockIndent = true;
      return blockString(item, ctx, onComment, onChompKeep);
    } else if (implicitKey && indent === indentStep) {
      return quotedString(value, ctx);
    }
  }
  const str = value.replace(/\n+/g, `$&
${indent}`);
  if (actualString) {
    const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
    const { compat, tags } = ctx.doc.schema;
    if (tags.some(test) || compat?.some(test))
      return quotedString(value, ctx);
  }
  return implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx, false));
}
function stringifyString(item, ctx, onComment, onChompKeep) {
  const { implicitKey, inFlow } = ctx;
  const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
  let { type } = item;
  if (type !== Scalar.QUOTE_DOUBLE) {
    if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
      type = Scalar.QUOTE_DOUBLE;
  }
  const _stringify = (_type) => {
    switch (_type) {
      case Scalar.BLOCK_FOLDED:
      case Scalar.BLOCK_LITERAL:
        return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
      case Scalar.QUOTE_DOUBLE:
        return doubleQuotedString(ss.value, ctx);
      case Scalar.QUOTE_SINGLE:
        return singleQuotedString(ss.value, ctx);
      case Scalar.PLAIN:
        return plainString(ss, ctx, onComment, onChompKeep);
      default:
        return null;
    }
  };
  let res = _stringify(type);
  if (res === null) {
    const { defaultKeyType, defaultStringType } = ctx.options;
    const t = implicitKey && defaultKeyType || defaultStringType;
    res = _stringify(t);
    if (res === null)
      throw new Error(`Unsupported default string type ${t}`);
  }
  return res;
}

// node_modules/yaml/browser/dist/stringify/stringify.js
function createStringifyContext(doc, options) {
  const opt = Object.assign({
    blockQuote: true,
    commentString: stringifyComment,
    defaultKeyType: null,
    defaultStringType: "PLAIN",
    directives: null,
    doubleQuotedAsJSON: false,
    doubleQuotedMinMultiLineLength: 40,
    falseStr: "false",
    flowCollectionPadding: true,
    indentSeq: true,
    lineWidth: 80,
    minContentWidth: 20,
    nullStr: "null",
    simpleKeys: false,
    singleQuote: null,
    trailingComma: false,
    trueStr: "true",
    verifyAliasOrder: true
  }, doc.schema.toStringOptions, options);
  let inFlow;
  switch (opt.collectionStyle) {
    case "block":
      inFlow = false;
      break;
    case "flow":
      inFlow = true;
      break;
    default:
      inFlow = null;
  }
  return {
    anchors: /* @__PURE__ */ new Set(),
    doc,
    flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
    indent: "",
    indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
    inFlow,
    options: opt
  };
}
function getTagObject(tags, item) {
  if (item.tag) {
    const match = tags.filter((t) => t.tag === item.tag);
    if (match.length > 0)
      return match.find((t) => t.format === item.format) ?? match[0];
  }
  let tagObj = void 0;
  let obj;
  if (isScalar(item)) {
    obj = item.value;
    let match = tags.filter((t) => t.identify?.(obj));
    if (match.length > 1) {
      const testMatch = match.filter((t) => t.test);
      if (testMatch.length > 0)
        match = testMatch;
    }
    tagObj = match.find((t) => t.format === item.format) ?? match.find((t) => !t.format);
  } else {
    obj = item;
    tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
  }
  if (!tagObj) {
    const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
    throw new Error(`Tag not resolved for ${name} value`);
  }
  return tagObj;
}
function stringifyProps(node, tagObj, { anchors, doc }) {
  if (!doc.directives)
    return "";
  const props = [];
  const anchor = (isScalar(node) || isCollection(node)) && node.anchor;
  if (anchor && anchorIsValid(anchor)) {
    anchors.add(anchor);
    props.push(`&${anchor}`);
  }
  const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
  if (tag)
    props.push(doc.directives.tagString(tag));
  return props.join(" ");
}
function stringify(item, ctx, onComment, onChompKeep) {
  if (isPair(item))
    return item.toString(ctx, onComment, onChompKeep);
  if (isAlias(item)) {
    if (ctx.doc.directives)
      return item.toString(ctx);
    if (ctx.resolvedAliases?.has(item)) {
      throw new TypeError(`Cannot stringify circular structure without alias nodes`);
    } else {
      if (ctx.resolvedAliases)
        ctx.resolvedAliases.add(item);
      else
        ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
      item = item.resolve(ctx.doc);
    }
  }
  let tagObj = void 0;
  const node = isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
  tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
  const props = stringifyProps(node, tagObj, ctx);
  if (props.length > 0)
    ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
  const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : isScalar(node) ? stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
  if (!props)
    return str;
  return isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
}

// node_modules/yaml/browser/dist/stringify/stringifyPair.js
function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
  const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
  let keyComment = isNode(key) && key.comment || null;
  if (simpleKeys) {
    if (keyComment) {
      throw new Error("With simple keys, key nodes cannot have comments");
    }
    if (isCollection(key) || !isNode(key) && typeof key === "object") {
      const msg = "With simple keys, collection cannot be used as a key value";
      throw new Error(msg);
    }
  }
  let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || isCollection(key) || (isScalar(key) ? key.type === Scalar.BLOCK_FOLDED || key.type === Scalar.BLOCK_LITERAL : typeof key === "object"));
  ctx = Object.assign({}, ctx, {
    allNullValues: false,
    implicitKey: !explicitKey && (simpleKeys || !allNullValues),
    indent: indent + indentStep
  });
  let keyCommentDone = false;
  let chompKeep = false;
  let str = stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
  if (!explicitKey && !ctx.inFlow && str.length > 1024) {
    if (simpleKeys)
      throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
    explicitKey = true;
  }
  if (ctx.inFlow) {
    if (allNullValues || value == null) {
      if (keyCommentDone && onComment)
        onComment();
      return str === "" ? "?" : explicitKey ? `? ${str}` : str;
    }
  } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
    str = `? ${str}`;
    if (keyComment && !keyCommentDone) {
      str += lineComment(str, ctx.indent, commentString(keyComment));
    } else if (chompKeep && onChompKeep)
      onChompKeep();
    return str;
  }
  if (keyCommentDone)
    keyComment = null;
  if (explicitKey) {
    if (keyComment)
      str += lineComment(str, ctx.indent, commentString(keyComment));
    str = `? ${str}
${indent}:`;
  } else {
    str = `${str}:`;
    if (keyComment)
      str += lineComment(str, ctx.indent, commentString(keyComment));
  }
  let vsb, vcb, valueComment;
  if (isNode(value)) {
    vsb = !!value.spaceBefore;
    vcb = value.commentBefore;
    valueComment = value.comment;
  } else {
    vsb = false;
    vcb = null;
    valueComment = null;
    if (value && typeof value === "object")
      value = doc.createNode(value);
  }
  ctx.implicitKey = false;
  if (!explicitKey && !keyComment && isScalar(value))
    ctx.indentAtStart = str.length + 1;
  chompKeep = false;
  if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && isSeq(value) && !value.flow && !value.tag && !value.anchor) {
    ctx.indent = ctx.indent.substring(2);
  }
  let valueCommentDone = false;
  const valueStr = stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
  let ws = " ";
  if (keyComment || vsb || vcb) {
    ws = vsb ? "\n" : "";
    if (vcb) {
      const cs = commentString(vcb);
      ws += `
${indentComment(cs, ctx.indent)}`;
    }
    if (valueStr === "" && !ctx.inFlow) {
      if (ws === "\n" && valueComment)
        ws = "\n\n";
    } else {
      ws += `
${ctx.indent}`;
    }
  } else if (!explicitKey && isCollection(value)) {
    const vs0 = valueStr[0];
    const nl0 = valueStr.indexOf("\n");
    const hasNewline = nl0 !== -1;
    const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
    if (hasNewline || !flow) {
      let hasPropsLine = false;
      if (hasNewline && (vs0 === "&" || vs0 === "!")) {
        let sp0 = valueStr.indexOf(" ");
        if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
          sp0 = valueStr.indexOf(" ", sp0 + 1);
        }
        if (sp0 === -1 || nl0 < sp0)
          hasPropsLine = true;
      }
      if (!hasPropsLine)
        ws = `
${ctx.indent}`;
    }
  } else if (valueStr === "" || valueStr[0] === "\n") {
    ws = "";
  }
  str += ws + valueStr;
  if (ctx.inFlow) {
    if (valueCommentDone && onComment)
      onComment();
  } else if (valueComment && !valueCommentDone) {
    str += lineComment(str, ctx.indent, commentString(valueComment));
  } else if (chompKeep && onChompKeep) {
    onChompKeep();
  }
  return str;
}

// node_modules/yaml/browser/dist/log.js
function warn(logLevel, warning) {
  if (logLevel === "debug" || logLevel === "warn") {
    console.warn(warning);
  }
}

// node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
var MERGE_KEY = "<<";
var merge = {
  identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
  default: "key",
  tag: "tag:yaml.org,2002:merge",
  test: /^<<$/,
  resolve: () => Object.assign(new Scalar(Symbol(MERGE_KEY)), {
    addToJSMap: addMergeToJSMap
  }),
  stringify: () => MERGE_KEY
};
var isMergeKey = (ctx, key) => (merge.identify(key) || isScalar(key) && (!key.type || key.type === Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
function addMergeToJSMap(ctx, map2, value) {
  const source = resolveAliasValue(ctx, value);
  if (isSeq(source))
    for (const it of source.items)
      mergeValue(ctx, map2, it);
  else if (Array.isArray(source))
    for (const it of source)
      mergeValue(ctx, map2, it);
  else
    mergeValue(ctx, map2, source);
}
function mergeValue(ctx, map2, value) {
  const source = resolveAliasValue(ctx, value);
  if (!isMap(source))
    throw new Error("Merge sources must be maps or map aliases");
  const srcMap = source.toJSON(null, ctx, Map);
  for (const [key, value2] of srcMap) {
    if (map2 instanceof Map) {
      if (!map2.has(key))
        map2.set(key, value2);
    } else if (map2 instanceof Set) {
      map2.add(key);
    } else if (!Object.prototype.hasOwnProperty.call(map2, key)) {
      Object.defineProperty(map2, key, {
        value: value2,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
  }
  return map2;
}
function resolveAliasValue(ctx, value) {
  return ctx && isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
}

// node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
function addPairToJSMap(ctx, map2, { key, value }) {
  if (isNode(key) && key.addToJSMap)
    key.addToJSMap(ctx, map2, value);
  else if (isMergeKey(ctx, key))
    addMergeToJSMap(ctx, map2, value);
  else {
    const jsKey = toJS(key, "", ctx);
    if (map2 instanceof Map) {
      map2.set(jsKey, toJS(value, jsKey, ctx));
    } else if (map2 instanceof Set) {
      map2.add(jsKey);
    } else {
      const stringKey = stringifyKey(key, jsKey, ctx);
      const jsValue = toJS(value, stringKey, ctx);
      if (stringKey in map2)
        Object.defineProperty(map2, stringKey, {
          value: jsValue,
          writable: true,
          enumerable: true,
          configurable: true
        });
      else
        map2[stringKey] = jsValue;
    }
  }
  return map2;
}
function stringifyKey(key, jsKey, ctx) {
  if (jsKey === null)
    return "";
  if (typeof jsKey !== "object")
    return String(jsKey);
  if (isNode(key) && ctx?.doc) {
    const strCtx = createStringifyContext(ctx.doc, {});
    strCtx.anchors = /* @__PURE__ */ new Set();
    for (const node of ctx.anchors.keys())
      strCtx.anchors.add(node.anchor);
    strCtx.inFlow = true;
    strCtx.inStringifyKey = true;
    const strKey = key.toString(strCtx);
    if (!ctx.mapKeyWarned) {
      let jsonStr = JSON.stringify(strKey);
      if (jsonStr.length > 40)
        jsonStr = jsonStr.substring(0, 36) + '..."';
      warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
      ctx.mapKeyWarned = true;
    }
    return strKey;
  }
  return JSON.stringify(jsKey);
}

// node_modules/yaml/browser/dist/nodes/Pair.js
function createPair(key, value, ctx) {
  const k = createNode(key, void 0, ctx);
  const v = createNode(value, void 0, ctx);
  return new Pair(k, v);
}
var Pair = class _Pair {
  constructor(key, value = null) {
    Object.defineProperty(this, NODE_TYPE, { value: PAIR });
    this.key = key;
    this.value = value;
  }
  clone(schema4) {
    let { key, value } = this;
    if (isNode(key))
      key = key.clone(schema4);
    if (isNode(value))
      value = value.clone(schema4);
    return new _Pair(key, value);
  }
  toJSON(_, ctx) {
    const pair = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    return addPairToJSMap(ctx, pair, this);
  }
  toString(ctx, onComment, onChompKeep) {
    return ctx?.doc ? stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyCollection.js
function stringifyCollection(collection, ctx, options) {
  const flow = ctx.inFlow ?? collection.flow;
  const stringify4 = flow ? stringifyFlowCollection : stringifyBlockCollection;
  return stringify4(collection, ctx, options);
}
function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
  const { indent, options: { commentString } } = ctx;
  const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
  let chompKeep = false;
  const lines = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    let comment2 = null;
    if (isNode(item)) {
      if (!chompKeep && item.spaceBefore)
        lines.push("");
      addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
      if (item.comment)
        comment2 = item.comment;
    } else if (isPair(item)) {
      const ik = isNode(item.key) ? item.key : null;
      if (ik) {
        if (!chompKeep && ik.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
      }
    }
    chompKeep = false;
    let str2 = stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
    if (comment2)
      str2 += lineComment(str2, itemIndent, commentString(comment2));
    if (chompKeep && comment2)
      chompKeep = false;
    lines.push(blockItemPrefix + str2);
  }
  let str;
  if (lines.length === 0) {
    str = flowChars.start + flowChars.end;
  } else {
    str = lines[0];
    for (let i = 1; i < lines.length; ++i) {
      const line = lines[i];
      str += line ? `
${indent}${line}` : "\n";
    }
  }
  if (comment) {
    str += "\n" + indentComment(commentString(comment), indent);
    if (onComment)
      onComment();
  } else if (chompKeep && onChompKeep)
    onChompKeep();
  return str;
}
function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
  const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
  itemIndent += indentStep;
  const itemCtx = Object.assign({}, ctx, {
    indent: itemIndent,
    inFlow: true,
    type: null
  });
  let reqNewline = false;
  let linesAtValue = 0;
  const lines = [];
  for (let i = 0; i < items.length; ++i) {
    const item = items[i];
    let comment = null;
    if (isNode(item)) {
      if (item.spaceBefore)
        lines.push("");
      addCommentBefore(ctx, lines, item.commentBefore, false);
      if (item.comment)
        comment = item.comment;
    } else if (isPair(item)) {
      const ik = isNode(item.key) ? item.key : null;
      if (ik) {
        if (ik.spaceBefore)
          lines.push("");
        addCommentBefore(ctx, lines, ik.commentBefore, false);
        if (ik.comment)
          reqNewline = true;
      }
      const iv = isNode(item.value) ? item.value : null;
      if (iv) {
        if (iv.comment)
          comment = iv.comment;
        if (iv.commentBefore)
          reqNewline = true;
      } else if (item.value == null && ik?.comment) {
        comment = ik.comment;
      }
    }
    if (comment)
      reqNewline = true;
    let str = stringify(item, itemCtx, () => comment = null);
    reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
    if (i < items.length - 1) {
      str += ",";
    } else if (ctx.options.trailingComma) {
      if (ctx.options.lineWidth > 0) {
        reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
      }
      if (reqNewline) {
        str += ",";
      }
    }
    if (comment)
      str += lineComment(str, itemIndent, commentString(comment));
    lines.push(str);
    linesAtValue = lines.length;
  }
  const { start, end } = flowChars;
  if (lines.length === 0) {
    return start + end;
  } else {
    if (!reqNewline) {
      const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
      reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
    }
    if (reqNewline) {
      let str = start;
      for (const line of lines)
        str += line ? `
${indentStep}${indent}${line}` : "\n";
      return `${str}
${indent}${end}`;
    } else {
      return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
    }
  }
}
function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
  if (comment && chompKeep)
    comment = comment.replace(/^\n+/, "");
  if (comment) {
    const ic = indentComment(commentString(comment), indent);
    lines.push(ic.trimStart());
  }
}

// node_modules/yaml/browser/dist/nodes/YAMLMap.js
function findPair(items, key) {
  const k = isScalar(key) ? key.value : key;
  for (const it of items) {
    if (isPair(it)) {
      if (it.key === key || it.key === k)
        return it;
      if (isScalar(it.key) && it.key.value === k)
        return it;
    }
  }
  return void 0;
}
var YAMLMap = class extends Collection {
  static get tagName() {
    return "tag:yaml.org,2002:map";
  }
  constructor(schema4) {
    super(MAP, schema4);
    this.items = [];
  }
  /**
   * A generic collection parsing method that can be extended
   * to other node classes that inherit from YAMLMap
   */
  static from(schema4, obj, ctx) {
    const { keepUndefined, replacer } = ctx;
    const map2 = new this(schema4);
    const add = (key, value) => {
      if (typeof replacer === "function")
        value = replacer.call(obj, key, value);
      else if (Array.isArray(replacer) && !replacer.includes(key))
        return;
      if (value !== void 0 || keepUndefined)
        map2.items.push(createPair(key, value, ctx));
    };
    if (obj instanceof Map) {
      for (const [key, value] of obj)
        add(key, value);
    } else if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj))
        add(key, obj[key]);
    }
    if (typeof schema4.sortMapEntries === "function") {
      map2.items.sort(schema4.sortMapEntries);
    }
    return map2;
  }
  /**
   * Adds a value to the collection.
   *
   * @param overwrite - If not set `true`, using a key that is already in the
   *   collection will throw. Otherwise, overwrites the previous value.
   */
  add(pair, overwrite) {
    let _pair;
    if (isPair(pair))
      _pair = pair;
    else if (!pair || typeof pair !== "object" || !("key" in pair)) {
      _pair = new Pair(pair, pair?.value);
    } else
      _pair = new Pair(pair.key, pair.value);
    const prev = findPair(this.items, _pair.key);
    const sortEntries = this.schema?.sortMapEntries;
    if (prev) {
      if (!overwrite)
        throw new Error(`Key ${_pair.key} already set`);
      if (isScalar(prev.value) && isScalarValue(_pair.value))
        prev.value.value = _pair.value;
      else
        prev.value = _pair.value;
    } else if (sortEntries) {
      const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
      if (i === -1)
        this.items.push(_pair);
      else
        this.items.splice(i, 0, _pair);
    } else {
      this.items.push(_pair);
    }
  }
  delete(key) {
    const it = findPair(this.items, key);
    if (!it)
      return false;
    const del = this.items.splice(this.items.indexOf(it), 1);
    return del.length > 0;
  }
  get(key, keepScalar) {
    const it = findPair(this.items, key);
    const node = it?.value;
    return (!keepScalar && isScalar(node) ? node.value : node) ?? void 0;
  }
  has(key) {
    return !!findPair(this.items, key);
  }
  set(key, value) {
    this.add(new Pair(key, value), true);
  }
  /**
   * @param ctx - Conversion context, originally set in Document#toJS()
   * @param {Class} Type - If set, forces the returned collection type
   * @returns Instance of Type, Map, or Object
   */
  toJSON(_, ctx, Type) {
    const map2 = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
    if (ctx?.onCreate)
      ctx.onCreate(map2);
    for (const item of this.items)
      addPairToJSMap(ctx, map2, item);
    return map2;
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    for (const item of this.items) {
      if (!isPair(item))
        throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
    }
    if (!ctx.allNullValues && this.hasAllNullValues(false))
      ctx = Object.assign({}, ctx, { allNullValues: true });
    return stringifyCollection(this, ctx, {
      blockItemPrefix: "",
      flowChars: { start: "{", end: "}" },
      itemIndent: ctx.indent || "",
      onChompKeep,
      onComment
    });
  }
};

// node_modules/yaml/browser/dist/schema/common/map.js
var map = {
  collection: "map",
  default: true,
  nodeClass: YAMLMap,
  tag: "tag:yaml.org,2002:map",
  resolve(map2, onError) {
    if (!isMap(map2))
      onError("Expected a mapping for this tag");
    return map2;
  },
  createNode: (schema4, obj, ctx) => YAMLMap.from(schema4, obj, ctx)
};

// node_modules/yaml/browser/dist/nodes/YAMLSeq.js
var YAMLSeq = class extends Collection {
  static get tagName() {
    return "tag:yaml.org,2002:seq";
  }
  constructor(schema4) {
    super(SEQ, schema4);
    this.items = [];
  }
  add(value) {
    this.items.push(value);
  }
  /**
   * Removes a value from the collection.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   *
   * @returns `true` if the item was found and removed.
   */
  delete(key) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      return false;
    const del = this.items.splice(idx, 1);
    return del.length > 0;
  }
  get(key, keepScalar) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      return void 0;
    const it = this.items[idx];
    return !keepScalar && isScalar(it) ? it.value : it;
  }
  /**
   * Checks if the collection includes a value with the key `key`.
   *
   * `key` must contain a representation of an integer for this to succeed.
   * It may be wrapped in a `Scalar`.
   */
  has(key) {
    const idx = asItemIndex(key);
    return typeof idx === "number" && idx < this.items.length;
  }
  /**
   * Sets a value in this collection. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   *
   * If `key` does not contain a representation of an integer, this will throw.
   * It may be wrapped in a `Scalar`.
   */
  set(key, value) {
    const idx = asItemIndex(key);
    if (typeof idx !== "number")
      throw new Error(`Expected a valid index, not ${key}.`);
    const prev = this.items[idx];
    if (isScalar(prev) && isScalarValue(value))
      prev.value = value;
    else
      this.items[idx] = value;
  }
  toJSON(_, ctx) {
    const seq2 = [];
    if (ctx?.onCreate)
      ctx.onCreate(seq2);
    let i = 0;
    for (const item of this.items)
      seq2.push(toJS(item, String(i++), ctx));
    return seq2;
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    return stringifyCollection(this, ctx, {
      blockItemPrefix: "- ",
      flowChars: { start: "[", end: "]" },
      itemIndent: (ctx.indent || "") + "  ",
      onChompKeep,
      onComment
    });
  }
  static from(schema4, obj, ctx) {
    const { replacer } = ctx;
    const seq2 = new this(schema4);
    if (obj && Symbol.iterator in Object(obj)) {
      let i = 0;
      for (let it of obj) {
        if (typeof replacer === "function") {
          const key = obj instanceof Set ? it : String(i++);
          it = replacer.call(obj, key, it);
        }
        seq2.items.push(createNode(it, void 0, ctx));
      }
    }
    return seq2;
  }
};
function asItemIndex(key) {
  let idx = isScalar(key) ? key.value : key;
  if (idx && typeof idx === "string")
    idx = Number(idx);
  return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
}

// node_modules/yaml/browser/dist/schema/common/seq.js
var seq = {
  collection: "seq",
  default: true,
  nodeClass: YAMLSeq,
  tag: "tag:yaml.org,2002:seq",
  resolve(seq2, onError) {
    if (!isSeq(seq2))
      onError("Expected a sequence for this tag");
    return seq2;
  },
  createNode: (schema4, obj, ctx) => YAMLSeq.from(schema4, obj, ctx)
};

// node_modules/yaml/browser/dist/schema/common/string.js
var string = {
  identify: (value) => typeof value === "string",
  default: true,
  tag: "tag:yaml.org,2002:str",
  resolve: (str) => str,
  stringify(item, ctx, onComment, onChompKeep) {
    ctx = Object.assign({ actualString: true }, ctx);
    return stringifyString(item, ctx, onComment, onChompKeep);
  }
};

// node_modules/yaml/browser/dist/schema/common/null.js
var nullTag = {
  identify: (value) => value == null,
  createNode: () => new Scalar(null),
  default: true,
  tag: "tag:yaml.org,2002:null",
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => new Scalar(null),
  stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
};

// node_modules/yaml/browser/dist/schema/core/bool.js
var boolTag = {
  identify: (value) => typeof value === "boolean",
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: (str) => new Scalar(str[0] === "t" || str[0] === "T"),
  stringify({ source, value }, ctx) {
    if (source && boolTag.test.test(source)) {
      const sv = source[0] === "t" || source[0] === "T";
      if (value === sv)
        return source;
    }
    return value ? ctx.options.trueStr : ctx.options.falseStr;
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyNumber.js
function stringifyNumber({ format, minFractionDigits, tag, value }) {
  if (typeof value === "bigint")
    return String(value);
  const num = typeof value === "number" ? value : Number(value);
  if (!isFinite(num))
    return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
  let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
  if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
    let i = n.indexOf(".");
    if (i < 0) {
      i = n.length;
      n += ".";
    }
    let d = minFractionDigits - (n.length - i - 1);
    while (d-- > 0)
      n += "0";
  }
  return n;
}

// node_modules/yaml/browser/dist/schema/core/float.js
var floatNaN = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: stringifyNumber
};
var floatExp = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
  resolve: (str) => parseFloat(str),
  stringify(node) {
    const num = Number(node.value);
    return isFinite(num) ? num.toExponential() : stringifyNumber(node);
  }
};
var float = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
  resolve(str) {
    const node = new Scalar(parseFloat(str));
    const dot = str.indexOf(".");
    if (dot !== -1 && str[str.length - 1] === "0")
      node.minFractionDigits = str.length - dot - 1;
    return node;
  },
  stringify: stringifyNumber
};

// node_modules/yaml/browser/dist/schema/core/int.js
var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
function intStringify(node, radix, prefix) {
  const { value } = node;
  if (intIdentify(value) && value >= 0)
    return prefix + value.toString(radix);
  return stringifyNumber(node);
}
var intOct = {
  identify: (value) => intIdentify(value) && value >= 0,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^0o[0-7]+$/,
  resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
  stringify: (node) => intStringify(node, 8, "0o")
};
var int = {
  identify: intIdentify,
  default: true,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9]+$/,
  resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
  stringify: stringifyNumber
};
var intHex = {
  identify: (value) => intIdentify(value) && value >= 0,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^0x[0-9a-fA-F]+$/,
  resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
  stringify: (node) => intStringify(node, 16, "0x")
};

// node_modules/yaml/browser/dist/schema/core/schema.js
var schema = [
  map,
  seq,
  string,
  nullTag,
  boolTag,
  intOct,
  int,
  intHex,
  floatNaN,
  floatExp,
  float
];

// node_modules/yaml/browser/dist/schema/json/schema.js
function intIdentify2(value) {
  return typeof value === "bigint" || Number.isInteger(value);
}
var stringifyJSON = ({ value }) => JSON.stringify(value);
var jsonScalars = [
  {
    identify: (value) => typeof value === "string",
    default: true,
    tag: "tag:yaml.org,2002:str",
    resolve: (str) => str,
    stringify: stringifyJSON
  },
  {
    identify: (value) => value == null,
    createNode: () => new Scalar(null),
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: stringifyJSON
  },
  {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^true$|^false$/,
    resolve: (str) => str === "true",
    stringify: stringifyJSON
  },
  {
    identify: intIdentify2,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
    stringify: ({ value }) => intIdentify2(value) ? value.toString() : JSON.stringify(value)
  },
  {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (str) => parseFloat(str),
    stringify: stringifyJSON
  }
];
var jsonError = {
  default: true,
  tag: "",
  test: /^/,
  resolve(str, onError) {
    onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
    return str;
  }
};
var schema2 = [map, seq].concat(jsonScalars, jsonError);

// node_modules/yaml/browser/dist/schema/yaml-1.1/binary.js
var binary = {
  identify: (value) => value instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: false,
  tag: "tag:yaml.org,2002:binary",
  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve(src, onError) {
    if (typeof atob === "function") {
      const str = atob(src.replace(/[\n\r]/g, ""));
      const buffer = new Uint8Array(str.length);
      for (let i = 0; i < str.length; ++i)
        buffer[i] = str.charCodeAt(i);
      return buffer;
    } else {
      onError("This environment does not support reading binary tags; either Buffer or atob is required");
      return src;
    }
  },
  stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
    if (!value)
      return "";
    const buf = value;
    let str;
    if (typeof btoa === "function") {
      let s = "";
      for (let i = 0; i < buf.length; ++i)
        s += String.fromCharCode(buf[i]);
      str = btoa(s);
    } else {
      throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
    }
    type ?? (type = Scalar.BLOCK_LITERAL);
    if (type !== Scalar.QUOTE_DOUBLE) {
      const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
      const n = Math.ceil(str.length / lineWidth);
      const lines = new Array(n);
      for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
        lines[i] = str.substr(o, lineWidth);
      }
      str = lines.join(type === Scalar.BLOCK_LITERAL ? "\n" : " ");
    }
    return stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
  }
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
function resolvePairs(seq2, onError) {
  if (isSeq(seq2)) {
    for (let i = 0; i < seq2.items.length; ++i) {
      let item = seq2.items[i];
      if (isPair(item))
        continue;
      else if (isMap(item)) {
        if (item.items.length > 1)
          onError("Each pair must have its own sequence indicator");
        const pair = item.items[0] || new Pair(new Scalar(null));
        if (item.commentBefore)
          pair.key.commentBefore = pair.key.commentBefore ? `${item.commentBefore}
${pair.key.commentBefore}` : item.commentBefore;
        if (item.comment) {
          const cn = pair.value ?? pair.key;
          cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
        }
        item = pair;
      }
      seq2.items[i] = isPair(item) ? item : new Pair(item);
    }
  } else
    onError("Expected a sequence for this tag");
  return seq2;
}
function createPairs(schema4, iterable, ctx) {
  const { replacer } = ctx;
  const pairs2 = new YAMLSeq(schema4);
  pairs2.tag = "tag:yaml.org,2002:pairs";
  let i = 0;
  if (iterable && Symbol.iterator in Object(iterable))
    for (let it of iterable) {
      if (typeof replacer === "function")
        it = replacer.call(iterable, String(i++), it);
      let key, value;
      if (Array.isArray(it)) {
        if (it.length === 2) {
          key = it[0];
          value = it[1];
        } else
          throw new TypeError(`Expected [key, value] tuple: ${it}`);
      } else if (it && it instanceof Object) {
        const keys = Object.keys(it);
        if (keys.length === 1) {
          key = keys[0];
          value = it[key];
        } else {
          throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
        }
      } else {
        key = it;
      }
      pairs2.items.push(createPair(key, value, ctx));
    }
  return pairs2;
}
var pairs = {
  collection: "seq",
  default: false,
  tag: "tag:yaml.org,2002:pairs",
  resolve: resolvePairs,
  createNode: createPairs
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/omap.js
var YAMLOMap = class _YAMLOMap extends YAMLSeq {
  constructor() {
    super();
    this.add = YAMLMap.prototype.add.bind(this);
    this.delete = YAMLMap.prototype.delete.bind(this);
    this.get = YAMLMap.prototype.get.bind(this);
    this.has = YAMLMap.prototype.has.bind(this);
    this.set = YAMLMap.prototype.set.bind(this);
    this.tag = _YAMLOMap.tag;
  }
  /**
   * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
   * but TypeScript won't allow widening the signature of a child method.
   */
  toJSON(_, ctx) {
    if (!ctx)
      return super.toJSON(_);
    const map2 = /* @__PURE__ */ new Map();
    if (ctx?.onCreate)
      ctx.onCreate(map2);
    for (const pair of this.items) {
      let key, value;
      if (isPair(pair)) {
        key = toJS(pair.key, "", ctx);
        value = toJS(pair.value, key, ctx);
      } else {
        key = toJS(pair, "", ctx);
      }
      if (map2.has(key))
        throw new Error("Ordered maps must not include duplicate keys");
      map2.set(key, value);
    }
    return map2;
  }
  static from(schema4, iterable, ctx) {
    const pairs2 = createPairs(schema4, iterable, ctx);
    const omap2 = new this();
    omap2.items = pairs2.items;
    return omap2;
  }
};
YAMLOMap.tag = "tag:yaml.org,2002:omap";
var omap = {
  collection: "seq",
  identify: (value) => value instanceof Map,
  nodeClass: YAMLOMap,
  default: false,
  tag: "tag:yaml.org,2002:omap",
  resolve(seq2, onError) {
    const pairs2 = resolvePairs(seq2, onError);
    const seenKeys = [];
    for (const { key } of pairs2.items) {
      if (isScalar(key)) {
        if (seenKeys.includes(key.value)) {
          onError(`Ordered maps must not include duplicate keys: ${key.value}`);
        } else {
          seenKeys.push(key.value);
        }
      }
    }
    return Object.assign(new YAMLOMap(), pairs2);
  },
  createNode: (schema4, iterable, ctx) => YAMLOMap.from(schema4, iterable, ctx)
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
function boolStringify({ value, source }, ctx) {
  const boolObj = value ? trueTag : falseTag;
  if (source && boolObj.test.test(source))
    return source;
  return value ? ctx.options.trueStr : ctx.options.falseStr;
}
var trueTag = {
  identify: (value) => value === true,
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => new Scalar(true),
  stringify: boolStringify
};
var falseTag = {
  identify: (value) => value === false,
  default: true,
  tag: "tag:yaml.org,2002:bool",
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
  resolve: () => new Scalar(false),
  stringify: boolStringify
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/float.js
var floatNaN2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
  resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: stringifyNumber
};
var floatExp2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "EXP",
  test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: (str) => parseFloat(str.replace(/_/g, "")),
  stringify(node) {
    const num = Number(node.value);
    return isFinite(num) ? num.toExponential() : stringifyNumber(node);
  }
};
var float2 = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
  resolve(str) {
    const node = new Scalar(parseFloat(str.replace(/_/g, "")));
    const dot = str.indexOf(".");
    if (dot !== -1) {
      const f = str.substring(dot + 1).replace(/_/g, "");
      if (f[f.length - 1] === "0")
        node.minFractionDigits = f.length;
    }
    return node;
  },
  stringify: stringifyNumber
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/int.js
var intIdentify3 = (value) => typeof value === "bigint" || Number.isInteger(value);
function intResolve2(str, offset, radix, { intAsBigInt }) {
  const sign = str[0];
  if (sign === "-" || sign === "+")
    offset += 1;
  str = str.substring(offset).replace(/_/g, "");
  if (intAsBigInt) {
    switch (radix) {
      case 2:
        str = `0b${str}`;
        break;
      case 8:
        str = `0o${str}`;
        break;
      case 16:
        str = `0x${str}`;
        break;
    }
    const n2 = BigInt(str);
    return sign === "-" ? BigInt(-1) * n2 : n2;
  }
  const n = parseInt(str, radix);
  return sign === "-" ? -1 * n : n;
}
function intStringify2(node, radix, prefix) {
  const { value } = node;
  if (intIdentify3(value)) {
    const str = value.toString(radix);
    return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
  }
  return stringifyNumber(node);
}
var intBin = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "BIN",
  test: /^[-+]?0b[0-1_]+$/,
  resolve: (str, _onError, opt) => intResolve2(str, 2, 2, opt),
  stringify: (node) => intStringify2(node, 2, "0b")
};
var intOct2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "OCT",
  test: /^[-+]?0[0-7_]+$/,
  resolve: (str, _onError, opt) => intResolve2(str, 1, 8, opt),
  stringify: (node) => intStringify2(node, 8, "0")
};
var int2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: (str, _onError, opt) => intResolve2(str, 0, 10, opt),
  stringify: stringifyNumber
};
var intHex2 = {
  identify: intIdentify3,
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "HEX",
  test: /^[-+]?0x[0-9a-fA-F_]+$/,
  resolve: (str, _onError, opt) => intResolve2(str, 2, 16, opt),
  stringify: (node) => intStringify2(node, 16, "0x")
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/set.js
var YAMLSet = class _YAMLSet extends YAMLMap {
  constructor(schema4) {
    super(schema4);
    this.tag = _YAMLSet.tag;
  }
  add(key) {
    let pair;
    if (isPair(key))
      pair = key;
    else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
      pair = new Pair(key.key, null);
    else
      pair = new Pair(key, null);
    const prev = findPair(this.items, pair.key);
    if (!prev)
      this.items.push(pair);
  }
  /**
   * If `keepPair` is `true`, returns the Pair matching `key`.
   * Otherwise, returns the value of that Pair's key.
   */
  get(key, keepPair) {
    const pair = findPair(this.items, key);
    return !keepPair && isPair(pair) ? isScalar(pair.key) ? pair.key.value : pair.key : pair;
  }
  set(key, value) {
    if (typeof value !== "boolean")
      throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
    const prev = findPair(this.items, key);
    if (prev && !value) {
      this.items.splice(this.items.indexOf(prev), 1);
    } else if (!prev && value) {
      this.items.push(new Pair(key));
    }
  }
  toJSON(_, ctx) {
    return super.toJSON(_, ctx, Set);
  }
  toString(ctx, onComment, onChompKeep) {
    if (!ctx)
      return JSON.stringify(this);
    if (this.hasAllNullValues(true))
      return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
    else
      throw new Error("Set items must all have null values");
  }
  static from(schema4, iterable, ctx) {
    const { replacer } = ctx;
    const set2 = new this(schema4);
    if (iterable && Symbol.iterator in Object(iterable))
      for (let value of iterable) {
        if (typeof replacer === "function")
          value = replacer.call(iterable, value, value);
        set2.items.push(createPair(value, null, ctx));
      }
    return set2;
  }
};
YAMLSet.tag = "tag:yaml.org,2002:set";
var set = {
  collection: "map",
  identify: (value) => value instanceof Set,
  nodeClass: YAMLSet,
  default: false,
  tag: "tag:yaml.org,2002:set",
  createNode: (schema4, iterable, ctx) => YAMLSet.from(schema4, iterable, ctx),
  resolve(map2, onError) {
    if (isMap(map2)) {
      if (map2.hasAllNullValues(true))
        return Object.assign(new YAMLSet(), map2);
      else
        onError("Set items must all have null values");
    } else
      onError("Expected a mapping for this tag");
    return map2;
  }
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
function parseSexagesimal(str, asBigInt) {
  const sign = str[0];
  const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
  const num = (n) => asBigInt ? BigInt(n) : Number(n);
  const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
  return sign === "-" ? num(-1) * res : res;
}
function stringifySexagesimal(node) {
  let { value } = node;
  let num = (n) => n;
  if (typeof value === "bigint")
    num = (n) => BigInt(n);
  else if (isNaN(value) || !isFinite(value))
    return stringifyNumber(node);
  let sign = "";
  if (value < 0) {
    sign = "-";
    value *= num(-1);
  }
  const _60 = num(60);
  const parts = [value % _60];
  if (value < 60) {
    parts.unshift(0);
  } else {
    value = (value - parts[0]) / _60;
    parts.unshift(value % _60);
    if (value >= 60) {
      value = (value - parts[0]) / _60;
      parts.unshift(value);
    }
  }
  return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
var intTime = {
  identify: (value) => typeof value === "bigint" || Number.isInteger(value),
  default: true,
  tag: "tag:yaml.org,2002:int",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
  resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
  stringify: stringifySexagesimal
};
var floatTime = {
  identify: (value) => typeof value === "number",
  default: true,
  tag: "tag:yaml.org,2002:float",
  format: "TIME",
  test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
  resolve: (str) => parseSexagesimal(str, false),
  stringify: stringifySexagesimal
};
var timestamp = {
  identify: (value) => value instanceof Date,
  default: true,
  tag: "tag:yaml.org,2002:timestamp",
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
  resolve(str) {
    const match = str.match(timestamp.test);
    if (!match)
      throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
    const [, year, month, day, hour, minute, second] = match.map(Number);
    const millisec = match[7] ? Number((match[7] + "00").substr(1, 3)) : 0;
    let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
    const tz = match[8];
    if (tz && tz !== "Z") {
      let d = parseSexagesimal(tz, false);
      if (Math.abs(d) < 30)
        d *= 60;
      date -= 6e4 * d;
    }
    return new Date(date);
  },
  stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
};

// node_modules/yaml/browser/dist/schema/yaml-1.1/schema.js
var schema3 = [
  map,
  seq,
  string,
  nullTag,
  trueTag,
  falseTag,
  intBin,
  intOct2,
  int2,
  intHex2,
  floatNaN2,
  floatExp2,
  float2,
  binary,
  merge,
  omap,
  pairs,
  set,
  intTime,
  floatTime,
  timestamp
];

// node_modules/yaml/browser/dist/schema/tags.js
var schemas = /* @__PURE__ */ new Map([
  ["core", schema],
  ["failsafe", [map, seq, string]],
  ["json", schema2],
  ["yaml11", schema3],
  ["yaml-1.1", schema3]
]);
var tagsByName = {
  binary,
  bool: boolTag,
  float,
  floatExp,
  floatNaN,
  floatTime,
  int,
  intHex,
  intOct,
  intTime,
  map,
  merge,
  null: nullTag,
  omap,
  pairs,
  seq,
  set,
  timestamp
};
var coreKnownTags = {
  "tag:yaml.org,2002:binary": binary,
  "tag:yaml.org,2002:merge": merge,
  "tag:yaml.org,2002:omap": omap,
  "tag:yaml.org,2002:pairs": pairs,
  "tag:yaml.org,2002:set": set,
  "tag:yaml.org,2002:timestamp": timestamp
};
function getTags(customTags, schemaName, addMergeTag) {
  const schemaTags = schemas.get(schemaName);
  if (schemaTags && !customTags) {
    return addMergeTag && !schemaTags.includes(merge) ? schemaTags.concat(merge) : schemaTags.slice();
  }
  let tags = schemaTags;
  if (!tags) {
    if (Array.isArray(customTags))
      tags = [];
    else {
      const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
    }
  }
  if (Array.isArray(customTags)) {
    for (const tag of customTags)
      tags = tags.concat(tag);
  } else if (typeof customTags === "function") {
    tags = customTags(tags.slice());
  }
  if (addMergeTag)
    tags = tags.concat(merge);
  return tags.reduce((tags2, tag) => {
    const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
    if (!tagObj) {
      const tagName = JSON.stringify(tag);
      const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
    }
    if (!tags2.includes(tagObj))
      tags2.push(tagObj);
    return tags2;
  }, []);
}

// node_modules/yaml/browser/dist/schema/Schema.js
var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
var Schema = class _Schema {
  constructor({ compat, customTags, merge: merge2, resolveKnownTags, schema: schema4, sortMapEntries, toStringDefaults }) {
    this.compat = Array.isArray(compat) ? getTags(compat, "compat") : compat ? getTags(null, compat) : null;
    this.name = typeof schema4 === "string" && schema4 || "core";
    this.knownTags = resolveKnownTags ? coreKnownTags : {};
    this.tags = getTags(customTags, this.name, merge2);
    this.toStringOptions = toStringDefaults ?? null;
    Object.defineProperty(this, MAP, { value: map });
    Object.defineProperty(this, SCALAR, { value: string });
    Object.defineProperty(this, SEQ, { value: seq });
    this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
  }
  clone() {
    const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
    copy.tags = this.tags.slice();
    return copy;
  }
};

// node_modules/yaml/browser/dist/stringify/stringifyDocument.js
function stringifyDocument(doc, options) {
  const lines = [];
  let hasDirectives = options.directives === true;
  if (options.directives !== false && doc.directives) {
    const dir = doc.directives.toString(doc);
    if (dir) {
      lines.push(dir);
      hasDirectives = true;
    } else if (doc.directives.docStart)
      hasDirectives = true;
  }
  if (hasDirectives)
    lines.push("---");
  const ctx = createStringifyContext(doc, options);
  const { commentString } = ctx.options;
  if (doc.commentBefore) {
    if (lines.length !== 1)
      lines.unshift("");
    const cs = commentString(doc.commentBefore);
    lines.unshift(indentComment(cs, ""));
  }
  let chompKeep = false;
  let contentComment = null;
  if (doc.contents) {
    if (isNode(doc.contents)) {
      if (doc.contents.spaceBefore && hasDirectives)
        lines.push("");
      if (doc.contents.commentBefore) {
        const cs = commentString(doc.contents.commentBefore);
        lines.push(indentComment(cs, ""));
      }
      ctx.forceBlockIndent = !!doc.comment;
      contentComment = doc.contents.comment;
    }
    const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
    let body = stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
    if (contentComment)
      body += lineComment(body, "", commentString(contentComment));
    if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
      lines[lines.length - 1] = `--- ${body}`;
    } else
      lines.push(body);
  } else {
    lines.push(stringify(doc.contents, ctx));
  }
  if (doc.directives?.docEnd) {
    if (doc.comment) {
      const cs = commentString(doc.comment);
      if (cs.includes("\n")) {
        lines.push("...");
        lines.push(indentComment(cs, ""));
      } else {
        lines.push(`... ${cs}`);
      }
    } else {
      lines.push("...");
    }
  } else {
    let dc = doc.comment;
    if (dc && chompKeep)
      dc = dc.replace(/^\n+/, "");
    if (dc) {
      if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
        lines.push("");
      lines.push(indentComment(commentString(dc), ""));
    }
  }
  return lines.join("\n") + "\n";
}

// node_modules/yaml/browser/dist/doc/Document.js
var Document = class _Document {
  constructor(value, replacer, options) {
    this.commentBefore = null;
    this.comment = null;
    this.errors = [];
    this.warnings = [];
    Object.defineProperty(this, NODE_TYPE, { value: DOC });
    let _replacer = null;
    if (typeof replacer === "function" || Array.isArray(replacer)) {
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
      replacer = void 0;
    }
    const opt = Object.assign({
      intAsBigInt: false,
      keepSourceTokens: false,
      logLevel: "warn",
      prettyErrors: true,
      strict: true,
      stringKeys: false,
      uniqueKeys: true,
      version: "1.2"
    }, options);
    this.options = opt;
    let { version } = opt;
    if (options?._directives) {
      this.directives = options._directives.atDocument();
      if (this.directives.yaml.explicit)
        version = this.directives.yaml.version;
    } else
      this.directives = new Directives({ version });
    this.setSchema(version, options);
    this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
  }
  /**
   * Create a deep copy of this Document and its contents.
   *
   * Custom Node values that inherit from `Object` still refer to their original instances.
   */
  clone() {
    const copy = Object.create(_Document.prototype, {
      [NODE_TYPE]: { value: DOC }
    });
    copy.commentBefore = this.commentBefore;
    copy.comment = this.comment;
    copy.errors = this.errors.slice();
    copy.warnings = this.warnings.slice();
    copy.options = Object.assign({}, this.options);
    if (this.directives)
      copy.directives = this.directives.clone();
    copy.schema = this.schema.clone();
    copy.contents = isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
    if (this.range)
      copy.range = this.range.slice();
    return copy;
  }
  /** Adds a value to the document. */
  add(value) {
    if (assertCollection(this.contents))
      this.contents.add(value);
  }
  /** Adds a value to the document. */
  addIn(path, value) {
    if (assertCollection(this.contents))
      this.contents.addIn(path, value);
  }
  /**
   * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
   *
   * If `node` already has an anchor, `name` is ignored.
   * Otherwise, the `node.anchor` value will be set to `name`,
   * or if an anchor with that name is already present in the document,
   * `name` will be used as a prefix for a new unique anchor.
   * If `name` is undefined, the generated anchor will use 'a' as a prefix.
   */
  createAlias(node, name) {
    if (!node.anchor) {
      const prev = anchorNames(this);
      node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      !name || prev.has(name) ? findNewAnchor(name || "a", prev) : name;
    }
    return new Alias(node.anchor);
  }
  createNode(value, replacer, options) {
    let _replacer = void 0;
    if (typeof replacer === "function") {
      value = replacer.call({ "": value }, "", value);
      _replacer = replacer;
    } else if (Array.isArray(replacer)) {
      const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
      const asStr = replacer.filter(keyToStr).map(String);
      if (asStr.length > 0)
        replacer = replacer.concat(asStr);
      _replacer = replacer;
    } else if (options === void 0 && replacer) {
      options = replacer;
      replacer = void 0;
    }
    const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
    const { onAnchor, setAnchors, sourceObjects } = createNodeAnchors(
      this,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      anchorPrefix || "a"
    );
    const ctx = {
      aliasDuplicateObjects: aliasDuplicateObjects ?? true,
      keepUndefined: keepUndefined ?? false,
      onAnchor,
      onTagObj,
      replacer: _replacer,
      schema: this.schema,
      sourceObjects
    };
    const node = createNode(value, tag, ctx);
    if (flow && isCollection(node))
      node.flow = true;
    setAnchors();
    return node;
  }
  /**
   * Convert a key and a value into a `Pair` using the current schema,
   * recursively wrapping all values as `Scalar` or `Collection` nodes.
   */
  createPair(key, value, options = {}) {
    const k = this.createNode(key, null, options);
    const v = this.createNode(value, null, options);
    return new Pair(k, v);
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  delete(key) {
    return assertCollection(this.contents) ? this.contents.delete(key) : false;
  }
  /**
   * Removes a value from the document.
   * @returns `true` if the item was found and removed.
   */
  deleteIn(path) {
    if (isEmptyPath(path)) {
      if (this.contents == null)
        return false;
      this.contents = null;
      return true;
    }
    return assertCollection(this.contents) ? this.contents.deleteIn(path) : false;
  }
  /**
   * Returns item at `key`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  get(key, keepScalar) {
    return isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
  }
  /**
   * Returns item at `path`, or `undefined` if not found. By default unwraps
   * scalar values from their surrounding node; to disable set `keepScalar` to
   * `true` (collections are always returned intact).
   */
  getIn(path, keepScalar) {
    if (isEmptyPath(path))
      return !keepScalar && isScalar(this.contents) ? this.contents.value : this.contents;
    return isCollection(this.contents) ? this.contents.getIn(path, keepScalar) : void 0;
  }
  /**
   * Checks if the document includes a value with the key `key`.
   */
  has(key) {
    return isCollection(this.contents) ? this.contents.has(key) : false;
  }
  /**
   * Checks if the document includes a value at `path`.
   */
  hasIn(path) {
    if (isEmptyPath(path))
      return this.contents !== void 0;
    return isCollection(this.contents) ? this.contents.hasIn(path) : false;
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  set(key, value) {
    if (this.contents == null) {
      this.contents = collectionFromPath(this.schema, [key], value);
    } else if (assertCollection(this.contents)) {
      this.contents.set(key, value);
    }
  }
  /**
   * Sets a value in this document. For `!!set`, `value` needs to be a
   * boolean to add/remove the item from the set.
   */
  setIn(path, value) {
    if (isEmptyPath(path)) {
      this.contents = value;
    } else if (this.contents == null) {
      this.contents = collectionFromPath(this.schema, Array.from(path), value);
    } else if (assertCollection(this.contents)) {
      this.contents.setIn(path, value);
    }
  }
  /**
   * Change the YAML version and schema used by the document.
   * A `null` version disables support for directives, explicit tags, anchors, and aliases.
   * It also requires the `schema` option to be given as a `Schema` instance value.
   *
   * Overrides all previously set schema options.
   */
  setSchema(version, options = {}) {
    if (typeof version === "number")
      version = String(version);
    let opt;
    switch (version) {
      case "1.1":
        if (this.directives)
          this.directives.yaml.version = "1.1";
        else
          this.directives = new Directives({ version: "1.1" });
        opt = { resolveKnownTags: false, schema: "yaml-1.1" };
        break;
      case "1.2":
      case "next":
        if (this.directives)
          this.directives.yaml.version = version;
        else
          this.directives = new Directives({ version });
        opt = { resolveKnownTags: true, schema: "core" };
        break;
      case null:
        if (this.directives)
          delete this.directives;
        opt = null;
        break;
      default: {
        const sv = JSON.stringify(version);
        throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
      }
    }
    if (options.schema instanceof Object)
      this.schema = options.schema;
    else if (opt)
      this.schema = new Schema(Object.assign(opt, options));
    else
      throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
  }
  // json & jsonArg are only used from toJSON()
  toJS({ json, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
    const ctx = {
      anchors: /* @__PURE__ */ new Map(),
      doc: this,
      keep: !json,
      mapAsMap: mapAsMap === true,
      mapKeyWarned: false,
      maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
    };
    const res = toJS(this.contents, jsonArg ?? "", ctx);
    if (typeof onAnchor === "function")
      for (const { count, res: res2 } of ctx.anchors.values())
        onAnchor(res2, count);
    return typeof reviver === "function" ? applyReviver(reviver, { "": res }, "", res) : res;
  }
  /**
   * A JSON representation of the document `contents`.
   *
   * @param jsonArg Used by `JSON.stringify` to indicate the array index or
   *   property name.
   */
  toJSON(jsonArg, onAnchor) {
    return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
  }
  /** A YAML representation of the document. */
  toString(options = {}) {
    if (this.errors.length > 0)
      throw new Error("Document with errors cannot be stringified");
    if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
      const s = JSON.stringify(options.indent);
      throw new Error(`"indent" option must be a positive integer, not ${s}`);
    }
    return stringifyDocument(this, options);
  }
};
function assertCollection(contents) {
  if (isCollection(contents))
    return true;
  throw new Error("Expected a YAML collection as document contents");
}

// node_modules/yaml/browser/dist/errors.js
var YAMLError = class extends Error {
  constructor(name, pos, code, message) {
    super();
    this.name = name;
    this.code = code;
    this.message = message;
    this.pos = pos;
  }
};
var YAMLParseError = class extends YAMLError {
  constructor(pos, code, message) {
    super("YAMLParseError", pos, code, message);
  }
};
var YAMLWarning = class extends YAMLError {
  constructor(pos, code, message) {
    super("YAMLWarning", pos, code, message);
  }
};
var prettifyError = (src, lc) => (error) => {
  if (error.pos[0] === -1)
    return;
  error.linePos = error.pos.map((pos) => lc.linePos(pos));
  const { line, col } = error.linePos[0];
  error.message += ` at line ${line}, column ${col}`;
  let ci = col - 1;
  let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
  if (ci >= 60 && lineStr.length > 80) {
    const trimStart = Math.min(ci - 39, lineStr.length - 79);
    lineStr = "\u2026" + lineStr.substring(trimStart);
    ci -= trimStart - 1;
  }
  if (lineStr.length > 80)
    lineStr = lineStr.substring(0, 79) + "\u2026";
  if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
    let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
    if (prev.length > 80)
      prev = prev.substring(0, 79) + "\u2026\n";
    lineStr = prev + lineStr;
  }
  if (/[^ ]/.test(lineStr)) {
    let count = 1;
    const end = error.linePos[1];
    if (end?.line === line && end.col > col) {
      count = Math.max(1, Math.min(end.col - col, 80 - ci));
    }
    const pointer = " ".repeat(ci) + "^".repeat(count);
    error.message += `:

${lineStr}
${pointer}
`;
  }
};

// node_modules/yaml/browser/dist/compose/resolve-props.js
function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
  let spaceBefore = false;
  let atNewline = startOnNewline;
  let hasSpace = startOnNewline;
  let comment = "";
  let commentSep = "";
  let hasNewline = false;
  let reqSpace = false;
  let tab = null;
  let anchor = null;
  let tag = null;
  let newlineAfterProp = null;
  let comma = null;
  let found = null;
  let start = null;
  for (const token of tokens) {
    if (reqSpace) {
      if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
        onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      reqSpace = false;
    }
    if (tab) {
      if (atNewline && token.type !== "comment" && token.type !== "newline") {
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      }
      tab = null;
    }
    switch (token.type) {
      case "space":
        if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
          tab = token;
        }
        hasSpace = true;
        break;
      case "comment": {
        if (!hasSpace)
          onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
        const cb = token.source.substring(1) || " ";
        if (!comment)
          comment = cb;
        else
          comment += commentSep + cb;
        commentSep = "";
        atNewline = false;
        break;
      }
      case "newline":
        if (atNewline) {
          if (comment)
            comment += token.source;
          else if (!found || indicator !== "seq-item-ind")
            spaceBefore = true;
        } else
          commentSep += token.source;
        atNewline = true;
        hasNewline = true;
        if (anchor || tag)
          newlineAfterProp = token;
        hasSpace = true;
        break;
      case "anchor":
        if (anchor)
          onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
        if (token.source.endsWith(":"))
          onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
        anchor = token;
        start ?? (start = token.offset);
        atNewline = false;
        hasSpace = false;
        reqSpace = true;
        break;
      case "tag": {
        if (tag)
          onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
        tag = token;
        start ?? (start = token.offset);
        atNewline = false;
        hasSpace = false;
        reqSpace = true;
        break;
      }
      case indicator:
        if (anchor || tag)
          onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
        if (found)
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
        found = token;
        atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
        hasSpace = false;
        break;
      case "comma":
        if (flow) {
          if (comma)
            onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
          comma = token;
          atNewline = false;
          hasSpace = false;
          break;
        }
      default:
        onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
        atNewline = false;
        hasSpace = false;
    }
  }
  const last = tokens[tokens.length - 1];
  const end = last ? last.offset + last.source.length : offset;
  if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
    onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
  }
  if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
    onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
  return {
    comma,
    found,
    spaceBefore,
    comment,
    hasNewline,
    anchor,
    tag,
    newlineAfterProp,
    end,
    start: start ?? end
  };
}

// node_modules/yaml/browser/dist/compose/util-contains-newline.js
function containsNewline(key) {
  if (!key)
    return null;
  switch (key.type) {
    case "alias":
    case "scalar":
    case "double-quoted-scalar":
    case "single-quoted-scalar":
      if (key.source.includes("\n"))
        return true;
      if (key.end) {
        for (const st of key.end)
          if (st.type === "newline")
            return true;
      }
      return false;
    case "flow-collection":
      for (const it of key.items) {
        for (const st of it.start)
          if (st.type === "newline")
            return true;
        if (it.sep) {
          for (const st of it.sep)
            if (st.type === "newline")
              return true;
        }
        if (containsNewline(it.key) || containsNewline(it.value))
          return true;
      }
      return false;
    default:
      return true;
  }
}

// node_modules/yaml/browser/dist/compose/util-flow-indent-check.js
function flowIndentCheck(indent, fc, onError) {
  if (fc?.type === "flow-collection") {
    const end = fc.end[0];
    if (end.indent === indent && (end.source === "]" || end.source === "}") && containsNewline(fc)) {
      const msg = "Flow end indicator should be more indented than parent";
      onError(end, "BAD_INDENT", msg, true);
    }
  }
}

// node_modules/yaml/browser/dist/compose/util-map-includes.js
function mapIncludes(ctx, items, search) {
  const { uniqueKeys } = ctx.options;
  if (uniqueKeys === false)
    return false;
  const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || isScalar(a) && isScalar(b) && a.value === b.value;
  return items.some((pair) => isEqual(pair.key, search));
}

// node_modules/yaml/browser/dist/compose/resolve-block-map.js
var startColMsg = "All mapping items must start at the same column";
function resolveBlockMap({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bm, onError, tag) {
  const NodeClass = tag?.nodeClass ?? YAMLMap;
  const map2 = new NodeClass(ctx.schema);
  if (ctx.atRoot)
    ctx.atRoot = false;
  let offset = bm.offset;
  let commentEnd = null;
  for (const collItem of bm.items) {
    const { start, key, sep, value } = collItem;
    const keyProps = resolveProps(start, {
      indicator: "explicit-key-ind",
      next: key ?? sep?.[0],
      offset,
      onError,
      parentIndent: bm.indent,
      startOnNewline: true
    });
    const implicitKey = !keyProps.found;
    if (implicitKey) {
      if (key) {
        if (key.type === "block-seq")
          onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
        else if ("indent" in key && key.indent !== bm.indent)
          onError(offset, "BAD_INDENT", startColMsg);
      }
      if (!keyProps.anchor && !keyProps.tag && !sep) {
        commentEnd = keyProps.end;
        if (keyProps.comment) {
          if (map2.comment)
            map2.comment += "\n" + keyProps.comment;
          else
            map2.comment = keyProps.comment;
        }
        continue;
      }
      if (keyProps.newlineAfterProp || containsNewline(key)) {
        onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
      }
    } else if (keyProps.found?.indent !== bm.indent) {
      onError(offset, "BAD_INDENT", startColMsg);
    }
    ctx.atKey = true;
    const keyStart = keyProps.end;
    const keyNode = key ? composeNode2(ctx, key, keyProps, onError) : composeEmptyNode2(ctx, keyStart, start, null, keyProps, onError);
    if (ctx.schema.compat)
      flowIndentCheck(bm.indent, key, onError);
    ctx.atKey = false;
    if (mapIncludes(ctx, map2.items, keyNode))
      onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
    const valueProps = resolveProps(sep ?? [], {
      indicator: "map-value-ind",
      next: value,
      offset: keyNode.range[2],
      onError,
      parentIndent: bm.indent,
      startOnNewline: !key || key.type === "block-scalar"
    });
    offset = valueProps.end;
    if (valueProps.found) {
      if (implicitKey) {
        if (value?.type === "block-map" && !valueProps.hasNewline)
          onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
        if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
          onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
      }
      const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : composeEmptyNode2(ctx, offset, sep, null, valueProps, onError);
      if (ctx.schema.compat)
        flowIndentCheck(bm.indent, value, onError);
      offset = valueNode.range[2];
      const pair = new Pair(keyNode, valueNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      map2.items.push(pair);
    } else {
      if (implicitKey)
        onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
      if (valueProps.comment) {
        if (keyNode.comment)
          keyNode.comment += "\n" + valueProps.comment;
        else
          keyNode.comment = valueProps.comment;
      }
      const pair = new Pair(keyNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      map2.items.push(pair);
    }
  }
  if (commentEnd && commentEnd < offset)
    onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
  map2.range = [bm.offset, offset, commentEnd ?? offset];
  return map2;
}

// node_modules/yaml/browser/dist/compose/resolve-block-seq.js
function resolveBlockSeq({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, bs, onError, tag) {
  const NodeClass = tag?.nodeClass ?? YAMLSeq;
  const seq2 = new NodeClass(ctx.schema);
  if (ctx.atRoot)
    ctx.atRoot = false;
  if (ctx.atKey)
    ctx.atKey = false;
  let offset = bs.offset;
  let commentEnd = null;
  for (const { start, value } of bs.items) {
    const props = resolveProps(start, {
      indicator: "seq-item-ind",
      next: value,
      offset,
      onError,
      parentIndent: bs.indent,
      startOnNewline: true
    });
    if (!props.found) {
      if (props.anchor || props.tag || value) {
        if (value?.type === "block-seq")
          onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
        else
          onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
      } else {
        commentEnd = props.end;
        if (props.comment)
          seq2.comment = props.comment;
        continue;
      }
    }
    const node = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, start, null, props, onError);
    if (ctx.schema.compat)
      flowIndentCheck(bs.indent, value, onError);
    offset = node.range[2];
    seq2.items.push(node);
  }
  seq2.range = [bs.offset, offset, commentEnd ?? offset];
  return seq2;
}

// node_modules/yaml/browser/dist/compose/resolve-end.js
function resolveEnd(end, offset, reqSpace, onError) {
  let comment = "";
  if (end) {
    let hasSpace = false;
    let sep = "";
    for (const token of end) {
      const { source, type } = token;
      switch (type) {
        case "space":
          hasSpace = true;
          break;
        case "comment": {
          if (reqSpace && !hasSpace)
            onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
          const cb = source.substring(1) || " ";
          if (!comment)
            comment = cb;
          else
            comment += sep + cb;
          sep = "";
          break;
        }
        case "newline":
          if (comment)
            sep += source;
          hasSpace = true;
          break;
        default:
          onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
      }
      offset += source.length;
    }
  }
  return { comment, offset };
}

// node_modules/yaml/browser/dist/compose/resolve-flow-collection.js
var blockMsg = "Block collections are not allowed within flow collections";
var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
function resolveFlowCollection({ composeNode: composeNode2, composeEmptyNode: composeEmptyNode2 }, ctx, fc, onError, tag) {
  const isMap2 = fc.start.source === "{";
  const fcName = isMap2 ? "flow map" : "flow sequence";
  const NodeClass = tag?.nodeClass ?? (isMap2 ? YAMLMap : YAMLSeq);
  const coll = new NodeClass(ctx.schema);
  coll.flow = true;
  const atRoot = ctx.atRoot;
  if (atRoot)
    ctx.atRoot = false;
  if (ctx.atKey)
    ctx.atKey = false;
  let offset = fc.offset + fc.start.source.length;
  for (let i = 0; i < fc.items.length; ++i) {
    const collItem = fc.items[i];
    const { start, key, sep, value } = collItem;
    const props = resolveProps(start, {
      flow: fcName,
      indicator: "explicit-key-ind",
      next: key ?? sep?.[0],
      offset,
      onError,
      parentIndent: fc.indent,
      startOnNewline: false
    });
    if (!props.found) {
      if (!props.anchor && !props.tag && !sep && !value) {
        if (i === 0 && props.comma)
          onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        else if (i < fc.items.length - 1)
          onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
        if (props.comment) {
          if (coll.comment)
            coll.comment += "\n" + props.comment;
          else
            coll.comment = props.comment;
        }
        offset = props.end;
        continue;
      }
      if (!isMap2 && ctx.options.strict && containsNewline(key))
        onError(
          key,
          // checked by containsNewline()
          "MULTILINE_IMPLICIT_KEY",
          "Implicit keys of flow sequence pairs need to be on a single line"
        );
    }
    if (i === 0) {
      if (props.comma)
        onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
    } else {
      if (!props.comma)
        onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
      if (props.comment) {
        let prevItemComment = "";
        loop: for (const st of start) {
          switch (st.type) {
            case "comma":
            case "space":
              break;
            case "comment":
              prevItemComment = st.source.substring(1);
              break loop;
            default:
              break loop;
          }
        }
        if (prevItemComment) {
          let prev = coll.items[coll.items.length - 1];
          if (isPair(prev))
            prev = prev.value ?? prev.key;
          if (prev.comment)
            prev.comment += "\n" + prevItemComment;
          else
            prev.comment = prevItemComment;
          props.comment = props.comment.substring(prevItemComment.length + 1);
        }
      }
    }
    if (!isMap2 && !sep && !props.found) {
      const valueNode = value ? composeNode2(ctx, value, props, onError) : composeEmptyNode2(ctx, props.end, sep, null, props, onError);
      coll.items.push(valueNode);
      offset = valueNode.range[2];
      if (isBlock(value))
        onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
    } else {
      ctx.atKey = true;
      const keyStart = props.end;
      const keyNode = key ? composeNode2(ctx, key, props, onError) : composeEmptyNode2(ctx, keyStart, start, null, props, onError);
      if (isBlock(key))
        onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
      ctx.atKey = false;
      const valueProps = resolveProps(sep ?? [], {
        flow: fcName,
        indicator: "map-value-ind",
        next: value,
        offset: keyNode.range[2],
        onError,
        parentIndent: fc.indent,
        startOnNewline: false
      });
      if (valueProps.found) {
        if (!isMap2 && !props.found && ctx.options.strict) {
          if (sep)
            for (const st of sep) {
              if (st === valueProps.found)
                break;
              if (st.type === "newline") {
                onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                break;
              }
            }
          if (props.start < valueProps.found.offset - 1024)
            onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
        }
      } else if (value) {
        if ("source" in value && value.source?.[0] === ":")
          onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
        else
          onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
      }
      const valueNode = value ? composeNode2(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode2(ctx, valueProps.end, sep, null, valueProps, onError) : null;
      if (valueNode) {
        if (isBlock(value))
          onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
      } else if (valueProps.comment) {
        if (keyNode.comment)
          keyNode.comment += "\n" + valueProps.comment;
        else
          keyNode.comment = valueProps.comment;
      }
      const pair = new Pair(keyNode, valueNode);
      if (ctx.options.keepSourceTokens)
        pair.srcToken = collItem;
      if (isMap2) {
        const map2 = coll;
        if (mapIncludes(ctx, map2.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        map2.items.push(pair);
      } else {
        const map2 = new YAMLMap(ctx.schema);
        map2.flow = true;
        map2.items.push(pair);
        const endRange = (valueNode ?? keyNode).range;
        map2.range = [keyNode.range[0], endRange[1], endRange[2]];
        coll.items.push(map2);
      }
      offset = valueNode ? valueNode.range[2] : valueProps.end;
    }
  }
  const expectedEnd = isMap2 ? "}" : "]";
  const [ce, ...ee] = fc.end;
  let cePos = offset;
  if (ce?.source === expectedEnd)
    cePos = ce.offset + ce.source.length;
  else {
    const name = fcName[0].toUpperCase() + fcName.substring(1);
    const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
    onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
    if (ce && ce.source.length !== 1)
      ee.unshift(ce);
  }
  if (ee.length > 0) {
    const end = resolveEnd(ee, cePos, ctx.options.strict, onError);
    if (end.comment) {
      if (coll.comment)
        coll.comment += "\n" + end.comment;
      else
        coll.comment = end.comment;
    }
    coll.range = [fc.offset, cePos, end.offset];
  } else {
    coll.range = [fc.offset, cePos, cePos];
  }
  return coll;
}

// node_modules/yaml/browser/dist/compose/compose-collection.js
function resolveCollection(CN2, ctx, token, onError, tagName, tag) {
  const coll = token.type === "block-map" ? resolveBlockMap(CN2, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq(CN2, ctx, token, onError, tag) : resolveFlowCollection(CN2, ctx, token, onError, tag);
  const Coll = coll.constructor;
  if (tagName === "!" || tagName === Coll.tagName) {
    coll.tag = Coll.tagName;
    return coll;
  }
  if (tagName)
    coll.tag = tagName;
  return coll;
}
function composeCollection(CN2, ctx, token, props, onError) {
  const tagToken = props.tag;
  const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
  if (token.type === "block-seq") {
    const { anchor, newlineAfterProp: nl } = props;
    const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
    if (lastProp && (!nl || nl.offset < lastProp.offset)) {
      const message = "Missing newline after block sequence props";
      onError(lastProp, "MISSING_CHAR", message);
    }
  }
  const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
  if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.tagName && expType === "seq") {
    return resolveCollection(CN2, ctx, token, onError, tagName);
  }
  let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
  if (!tag) {
    const kt = ctx.schema.knownTags[tagName];
    if (kt?.collection === expType) {
      ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
      tag = kt;
    } else {
      if (kt) {
        onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
      } else {
        onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
      }
      return resolveCollection(CN2, ctx, token, onError, tagName);
    }
  }
  const coll = resolveCollection(CN2, ctx, token, onError, tagName, tag);
  const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
  const node = isNode(res) ? res : new Scalar(res);
  node.range = coll.range;
  node.tag = tagName;
  if (tag?.format)
    node.format = tag.format;
  return node;
}

// node_modules/yaml/browser/dist/compose/resolve-block-scalar.js
function resolveBlockScalar(ctx, scalar, onError) {
  const start = scalar.offset;
  const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
  if (!header)
    return { value: "", type: null, comment: "", range: [start, start, start] };
  const type = header.mode === ">" ? Scalar.BLOCK_FOLDED : Scalar.BLOCK_LITERAL;
  const lines = scalar.source ? splitLines(scalar.source) : [];
  let chompStart = lines.length;
  for (let i = lines.length - 1; i >= 0; --i) {
    const content = lines[i][1];
    if (content === "" || content === "\r")
      chompStart = i;
    else
      break;
  }
  if (chompStart === 0) {
    const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
    let end2 = start + header.length;
    if (scalar.source)
      end2 += scalar.source.length;
    return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
  }
  let trimIndent = scalar.indent + header.indent;
  let offset = scalar.offset + header.length;
  let contentStart = 0;
  for (let i = 0; i < chompStart; ++i) {
    const [indent, content] = lines[i];
    if (content === "" || content === "\r") {
      if (header.indent === 0 && indent.length > trimIndent)
        trimIndent = indent.length;
    } else {
      if (indent.length < trimIndent) {
        const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
        onError(offset + indent.length, "MISSING_CHAR", message);
      }
      if (header.indent === 0)
        trimIndent = indent.length;
      contentStart = i;
      if (trimIndent === 0 && !ctx.atRoot) {
        const message = "Block scalar values in collections must be indented";
        onError(offset, "BAD_INDENT", message);
      }
      break;
    }
    offset += indent.length + content.length + 1;
  }
  for (let i = lines.length - 1; i >= chompStart; --i) {
    if (lines[i][0].length > trimIndent)
      chompStart = i + 1;
  }
  let value = "";
  let sep = "";
  let prevMoreIndented = false;
  for (let i = 0; i < contentStart; ++i)
    value += lines[i][0].slice(trimIndent) + "\n";
  for (let i = contentStart; i < chompStart; ++i) {
    let [indent, content] = lines[i];
    offset += indent.length + content.length + 1;
    const crlf = content[content.length - 1] === "\r";
    if (crlf)
      content = content.slice(0, -1);
    if (content && indent.length < trimIndent) {
      const src = header.indent ? "explicit indentation indicator" : "first line";
      const message = `Block scalar lines must not be less indented than their ${src}`;
      onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
      indent = "";
    }
    if (type === Scalar.BLOCK_LITERAL) {
      value += sep + indent.slice(trimIndent) + content;
      sep = "\n";
    } else if (indent.length > trimIndent || content[0] === "	") {
      if (sep === " ")
        sep = "\n";
      else if (!prevMoreIndented && sep === "\n")
        sep = "\n\n";
      value += sep + indent.slice(trimIndent) + content;
      sep = "\n";
      prevMoreIndented = true;
    } else if (content === "") {
      if (sep === "\n")
        value += "\n";
      else
        sep = "\n";
    } else {
      value += sep + content;
      sep = " ";
      prevMoreIndented = false;
    }
  }
  switch (header.chomp) {
    case "-":
      break;
    case "+":
      for (let i = chompStart; i < lines.length; ++i)
        value += "\n" + lines[i][0].slice(trimIndent);
      if (value[value.length - 1] !== "\n")
        value += "\n";
      break;
    default:
      value += "\n";
  }
  const end = start + header.length + scalar.source.length;
  return { value, type, comment: header.comment, range: [start, end, end] };
}
function parseBlockScalarHeader({ offset, props }, strict, onError) {
  if (props[0].type !== "block-scalar-header") {
    onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
    return null;
  }
  const { source } = props[0];
  const mode = source[0];
  let indent = 0;
  let chomp = "";
  let error = -1;
  for (let i = 1; i < source.length; ++i) {
    const ch = source[i];
    if (!chomp && (ch === "-" || ch === "+"))
      chomp = ch;
    else {
      const n = Number(ch);
      if (!indent && n)
        indent = n;
      else if (error === -1)
        error = offset + i;
    }
  }
  if (error !== -1)
    onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
  let hasSpace = false;
  let comment = "";
  let length = source.length;
  for (let i = 1; i < props.length; ++i) {
    const token = props[i];
    switch (token.type) {
      case "space":
        hasSpace = true;
      case "newline":
        length += token.source.length;
        break;
      case "comment":
        if (strict && !hasSpace) {
          const message = "Comments must be separated from other tokens by white space characters";
          onError(token, "MISSING_CHAR", message);
        }
        length += token.source.length;
        comment = token.source.substring(1);
        break;
      case "error":
        onError(token, "UNEXPECTED_TOKEN", token.message);
        length += token.source.length;
        break;
      default: {
        const message = `Unexpected token in block scalar header: ${token.type}`;
        onError(token, "UNEXPECTED_TOKEN", message);
        const ts = token.source;
        if (ts && typeof ts === "string")
          length += ts.length;
      }
    }
  }
  return { mode, indent, chomp, comment, length };
}
function splitLines(source) {
  const split = source.split(/\n( *)/);
  const first = split[0];
  const m = first.match(/^( *)/);
  const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
  const lines = [line0];
  for (let i = 1; i < split.length; i += 2)
    lines.push([split[i], split[i + 1]]);
  return lines;
}

// node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js
function resolveFlowScalar(scalar, strict, onError) {
  const { offset, type, source, end } = scalar;
  let _type;
  let value;
  const _onError = (rel, code, msg) => onError(offset + rel, code, msg);
  switch (type) {
    case "scalar":
      _type = Scalar.PLAIN;
      value = plainValue(source, _onError);
      break;
    case "single-quoted-scalar":
      _type = Scalar.QUOTE_SINGLE;
      value = singleQuotedValue(source, _onError);
      break;
    case "double-quoted-scalar":
      _type = Scalar.QUOTE_DOUBLE;
      value = doubleQuotedValue(source, _onError);
      break;
    default:
      onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
      return {
        value: "",
        type: null,
        comment: "",
        range: [offset, offset + source.length, offset + source.length]
      };
  }
  const valueEnd = offset + source.length;
  const re = resolveEnd(end, valueEnd, strict, onError);
  return {
    value,
    type: _type,
    comment: re.comment,
    range: [offset, valueEnd, re.offset]
  };
}
function plainValue(source, onError) {
  let badChar = "";
  switch (source[0]) {
    case "	":
      badChar = "a tab character";
      break;
    case ",":
      badChar = "flow indicator character ,";
      break;
    case "%":
      badChar = "directive indicator character %";
      break;
    case "|":
    case ">": {
      badChar = `block scalar indicator ${source[0]}`;
      break;
    }
    case "@":
    case "`": {
      badChar = `reserved character ${source[0]}`;
      break;
    }
  }
  if (badChar)
    onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
  return foldLines(source);
}
function singleQuotedValue(source, onError) {
  if (source[source.length - 1] !== "'" || source.length === 1)
    onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
  return foldLines(source.slice(1, -1)).replace(/''/g, "'");
}
function foldLines(source) {
  let first, line;
  try {
    first = new RegExp("(.*?)(?<![ 	])[ 	]*\r?\n", "sy");
    line = new RegExp("[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?\n", "sy");
  } catch {
    first = /(.*?)[ \t]*\r?\n/sy;
    line = /[ \t]*(.*?)[ \t]*\r?\n/sy;
  }
  let match = first.exec(source);
  if (!match)
    return source;
  let res = match[1];
  let sep = " ";
  let pos = first.lastIndex;
  line.lastIndex = pos;
  while (match = line.exec(source)) {
    if (match[1] === "") {
      if (sep === "\n")
        res += sep;
      else
        sep = "\n";
    } else {
      res += sep + match[1];
      sep = " ";
    }
    pos = line.lastIndex;
  }
  const last = /[ \t]*(.*)/sy;
  last.lastIndex = pos;
  match = last.exec(source);
  return res + sep + (match?.[1] ?? "");
}
function doubleQuotedValue(source, onError) {
  let res = "";
  for (let i = 1; i < source.length - 1; ++i) {
    const ch = source[i];
    if (ch === "\r" && source[i + 1] === "\n")
      continue;
    if (ch === "\n") {
      const { fold, offset } = foldNewline(source, i);
      res += fold;
      i = offset;
    } else if (ch === "\\") {
      let next = source[++i];
      const cc = escapeCodes[next];
      if (cc)
        res += cc;
      else if (next === "\n") {
        next = source[i + 1];
        while (next === " " || next === "	")
          next = source[++i + 1];
      } else if (next === "\r" && source[i + 1] === "\n") {
        next = source[++i + 1];
        while (next === " " || next === "	")
          next = source[++i + 1];
      } else if (next === "x" || next === "u" || next === "U") {
        const length = next === "x" ? 2 : next === "u" ? 4 : 8;
        res += parseCharCode(source, i + 1, length, onError);
        i += length;
      } else {
        const raw = source.substr(i - 1, 2);
        onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        res += raw;
      }
    } else if (ch === " " || ch === "	") {
      const wsStart = i;
      let next = source[i + 1];
      while (next === " " || next === "	")
        next = source[++i + 1];
      if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
        res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
    } else {
      res += ch;
    }
  }
  if (source[source.length - 1] !== '"' || source.length === 1)
    onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
  return res;
}
function foldNewline(source, offset) {
  let fold = "";
  let ch = source[offset + 1];
  while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
    if (ch === "\r" && source[offset + 2] !== "\n")
      break;
    if (ch === "\n")
      fold += "\n";
    offset += 1;
    ch = source[offset + 1];
  }
  if (!fold)
    fold = " ";
  return { fold, offset };
}
var escapeCodes = {
  "0": "\0",
  // null character
  a: "\x07",
  // bell character
  b: "\b",
  // backspace
  e: "\x1B",
  // escape character
  f: "\f",
  // form feed
  n: "\n",
  // line feed
  r: "\r",
  // carriage return
  t: "	",
  // horizontal tab
  v: "\v",
  // vertical tab
  N: "\x85",
  // Unicode next line
  _: "\xA0",
  // Unicode non-breaking space
  L: "\u2028",
  // Unicode line separator
  P: "\u2029",
  // Unicode paragraph separator
  " ": " ",
  '"': '"',
  "/": "/",
  "\\": "\\",
  "	": "	"
};
function parseCharCode(source, offset, length, onError) {
  const cc = source.substr(offset, length);
  const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
  const code = ok ? parseInt(cc, 16) : NaN;
  try {
    return String.fromCodePoint(code);
  } catch {
    const raw = source.substr(offset - 2, length + 2);
    onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
    return raw;
  }
}

// node_modules/yaml/browser/dist/compose/compose-scalar.js
function composeScalar(ctx, token, tagToken, onError) {
  const { value, type, comment, range } = token.type === "block-scalar" ? resolveBlockScalar(ctx, token, onError) : resolveFlowScalar(token, ctx.options.strict, onError);
  const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
  let tag;
  if (ctx.options.stringKeys && ctx.atKey) {
    tag = ctx.schema[SCALAR];
  } else if (tagName)
    tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
  else if (token.type === "scalar")
    tag = findScalarTagByTest(ctx, value, token, onError);
  else
    tag = ctx.schema[SCALAR];
  let scalar;
  try {
    const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
    scalar = isScalar(res) ? res : new Scalar(res);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
    scalar = new Scalar(value);
  }
  scalar.range = range;
  scalar.source = value;
  if (type)
    scalar.type = type;
  if (tagName)
    scalar.tag = tagName;
  if (tag.format)
    scalar.format = tag.format;
  if (comment)
    scalar.comment = comment;
  return scalar;
}
function findScalarTagByName(schema4, value, tagName, tagToken, onError) {
  if (tagName === "!")
    return schema4[SCALAR];
  const matchWithTest = [];
  for (const tag of schema4.tags) {
    if (!tag.collection && tag.tag === tagName) {
      if (tag.default && tag.test)
        matchWithTest.push(tag);
      else
        return tag;
    }
  }
  for (const tag of matchWithTest)
    if (tag.test?.test(value))
      return tag;
  const kt = schema4.knownTags[tagName];
  if (kt && !kt.collection) {
    schema4.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
    return kt;
  }
  onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
  return schema4[SCALAR];
}
function findScalarTagByTest({ atKey, directives, schema: schema4 }, value, token, onError) {
  const tag = schema4.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema4[SCALAR];
  if (schema4.compat) {
    const compat = schema4.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema4[SCALAR];
    if (tag.tag !== compat.tag) {
      const ts = directives.tagString(tag.tag);
      const cs = directives.tagString(compat.tag);
      const msg = `Value may be parsed as either ${ts} or ${cs}`;
      onError(token, "TAG_RESOLVE_FAILED", msg, true);
    }
  }
  return tag;
}

// node_modules/yaml/browser/dist/compose/util-empty-scalar-position.js
function emptyScalarPosition(offset, before, pos) {
  if (before) {
    pos ?? (pos = before.length);
    for (let i = pos - 1; i >= 0; --i) {
      let st = before[i];
      switch (st.type) {
        case "space":
        case "comment":
        case "newline":
          offset -= st.source.length;
          continue;
      }
      st = before[++i];
      while (st?.type === "space") {
        offset += st.source.length;
        st = before[++i];
      }
      break;
    }
  }
  return offset;
}

// node_modules/yaml/browser/dist/compose/compose-node.js
var CN = { composeNode, composeEmptyNode };
function composeNode(ctx, token, props, onError) {
  const atKey = ctx.atKey;
  const { spaceBefore, comment, anchor, tag } = props;
  let node;
  let isSrcToken = true;
  switch (token.type) {
    case "alias":
      node = composeAlias(ctx, token, onError);
      if (anchor || tag)
        onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
      break;
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "block-scalar":
      node = composeScalar(ctx, token, tag, onError);
      if (anchor)
        node.anchor = anchor.source.substring(1);
      break;
    case "block-map":
    case "block-seq":
    case "flow-collection":
      try {
        node = composeCollection(CN, ctx, token, props, onError);
        if (anchor)
          node.anchor = anchor.source.substring(1);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        onError(token, "RESOURCE_EXHAUSTION", message);
      }
      break;
    default: {
      const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
      onError(token, "UNEXPECTED_TOKEN", message);
      isSrcToken = false;
    }
  }
  node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
  if (anchor && node.anchor === "")
    onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
  if (atKey && ctx.options.stringKeys && (!isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
    const msg = "With stringKeys, all keys must be strings";
    onError(tag ?? token, "NON_STRING_KEY", msg);
  }
  if (spaceBefore)
    node.spaceBefore = true;
  if (comment) {
    if (token.type === "scalar" && token.source === "")
      node.comment = comment;
    else
      node.commentBefore = comment;
  }
  if (ctx.options.keepSourceTokens && isSrcToken)
    node.srcToken = token;
  return node;
}
function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
  const token = {
    type: "scalar",
    offset: emptyScalarPosition(offset, before, pos),
    indent: -1,
    source: ""
  };
  const node = composeScalar(ctx, token, tag, onError);
  if (anchor) {
    node.anchor = anchor.source.substring(1);
    if (node.anchor === "")
      onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
  }
  if (spaceBefore)
    node.spaceBefore = true;
  if (comment) {
    node.comment = comment;
    node.range[2] = end;
  }
  return node;
}
function composeAlias({ options }, { offset, source, end }, onError) {
  const alias = new Alias(source.substring(1));
  if (alias.source === "")
    onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
  if (alias.source.endsWith(":"))
    onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
  const valueEnd = offset + source.length;
  const re = resolveEnd(end, valueEnd, options.strict, onError);
  alias.range = [offset, valueEnd, re.offset];
  if (re.comment)
    alias.comment = re.comment;
  return alias;
}

// node_modules/yaml/browser/dist/compose/compose-doc.js
function composeDoc(options, directives, { offset, start, value, end }, onError) {
  const opts = Object.assign({ _directives: directives }, options);
  const doc = new Document(void 0, opts);
  const ctx = {
    atKey: false,
    atRoot: true,
    directives: doc.directives,
    options: doc.options,
    schema: doc.schema
  };
  const props = resolveProps(start, {
    indicator: "doc-start",
    next: value ?? end?.[0],
    offset,
    onError,
    parentIndent: 0,
    startOnNewline: true
  });
  if (props.found) {
    doc.directives.docStart = true;
    if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
      onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
  }
  doc.contents = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
  const contentEnd = doc.contents.range[2];
  const re = resolveEnd(end, contentEnd, false, onError);
  if (re.comment)
    doc.comment = re.comment;
  doc.range = [offset, contentEnd, re.offset];
  return doc;
}

// node_modules/yaml/browser/dist/compose/composer.js
function getErrorPos(src) {
  if (typeof src === "number")
    return [src, src + 1];
  if (Array.isArray(src))
    return src.length === 2 ? src : [src[0], src[1]];
  const { offset, source } = src;
  return [offset, offset + (typeof source === "string" ? source.length : 1)];
}
function parsePrelude(prelude) {
  let comment = "";
  let atComment = false;
  let afterEmptyLine = false;
  for (let i = 0; i < prelude.length; ++i) {
    const source = prelude[i];
    switch (source[0]) {
      case "#":
        comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
        atComment = true;
        afterEmptyLine = false;
        break;
      case "%":
        if (prelude[i + 1]?.[0] !== "#")
          i += 1;
        atComment = false;
        break;
      default:
        if (!atComment)
          afterEmptyLine = true;
        atComment = false;
    }
  }
  return { comment, afterEmptyLine };
}
var Composer = class {
  constructor(options = {}) {
    this.doc = null;
    this.atDirectives = false;
    this.prelude = [];
    this.errors = [];
    this.warnings = [];
    this.onError = (source, code, message, warning) => {
      const pos = getErrorPos(source);
      if (warning)
        this.warnings.push(new YAMLWarning(pos, code, message));
      else
        this.errors.push(new YAMLParseError(pos, code, message));
    };
    this.directives = new Directives({ version: options.version || "1.2" });
    this.options = options;
  }
  decorate(doc, afterDoc) {
    const { comment, afterEmptyLine } = parsePrelude(this.prelude);
    if (comment) {
      const dc = doc.contents;
      if (afterDoc) {
        doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
      } else if (afterEmptyLine || doc.directives.docStart || !dc) {
        doc.commentBefore = comment;
      } else if (isCollection(dc) && !dc.flow && dc.items.length > 0) {
        let it = dc.items[0];
        if (isPair(it))
          it = it.key;
        const cb = it.commentBefore;
        it.commentBefore = cb ? `${comment}
${cb}` : comment;
      } else {
        const cb = dc.commentBefore;
        dc.commentBefore = cb ? `${comment}
${cb}` : comment;
      }
    }
    if (afterDoc) {
      for (let i = 0; i < this.errors.length; ++i)
        doc.errors.push(this.errors[i]);
      for (let i = 0; i < this.warnings.length; ++i)
        doc.warnings.push(this.warnings[i]);
    } else {
      doc.errors = this.errors;
      doc.warnings = this.warnings;
    }
    this.prelude = [];
    this.errors = [];
    this.warnings = [];
  }
  /**
   * Current stream status information.
   *
   * Mostly useful at the end of input for an empty stream.
   */
  streamInfo() {
    return {
      comment: parsePrelude(this.prelude).comment,
      directives: this.directives,
      errors: this.errors,
      warnings: this.warnings
    };
  }
  /**
   * Compose tokens into documents.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *compose(tokens, forceDoc = false, endOffset = -1) {
    for (const token of tokens)
      yield* this.next(token);
    yield* this.end(forceDoc, endOffset);
  }
  /** Advance the composer by one CST token. */
  *next(token) {
    switch (token.type) {
      case "directive":
        this.directives.add(token.source, (offset, message, warning) => {
          const pos = getErrorPos(token);
          pos[0] += offset;
          this.onError(pos, "BAD_DIRECTIVE", message, warning);
        });
        this.prelude.push(token.source);
        this.atDirectives = true;
        break;
      case "document": {
        const doc = composeDoc(this.options, this.directives, token, this.onError);
        if (this.atDirectives && !doc.directives.docStart)
          this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
        this.decorate(doc, false);
        if (this.doc)
          yield this.doc;
        this.doc = doc;
        this.atDirectives = false;
        break;
      }
      case "byte-order-mark":
      case "space":
        break;
      case "comment":
      case "newline":
        this.prelude.push(token.source);
        break;
      case "error": {
        const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
        const error = new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
        if (this.atDirectives || !this.doc)
          this.errors.push(error);
        else
          this.doc.errors.push(error);
        break;
      }
      case "doc-end": {
        if (!this.doc) {
          const msg = "Unexpected doc-end without preceding document";
          this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
          break;
        }
        this.doc.directives.docEnd = true;
        const end = resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
        this.decorate(this.doc, true);
        if (end.comment) {
          const dc = this.doc.comment;
          this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
        }
        this.doc.range[2] = end.offset;
        break;
      }
      default:
        this.errors.push(new YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
    }
  }
  /**
   * Call at end of input to yield any remaining document.
   *
   * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
   * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
   */
  *end(forceDoc = false, endOffset = -1) {
    if (this.doc) {
      this.decorate(this.doc, true);
      yield this.doc;
      this.doc = null;
    } else if (forceDoc) {
      const opts = Object.assign({ _directives: this.directives }, this.options);
      const doc = new Document(void 0, opts);
      if (this.atDirectives)
        this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
      doc.range = [0, endOffset, endOffset];
      this.decorate(doc, false);
      yield doc;
    }
  }
};

// node_modules/yaml/browser/dist/parse/cst-visit.js
var BREAK2 = Symbol("break visit");
var SKIP2 = Symbol("skip children");
var REMOVE2 = Symbol("remove item");
function visit2(cst, visitor) {
  if ("type" in cst && cst.type === "document")
    cst = { start: cst.start, value: cst.value };
  _visit(Object.freeze([]), cst, visitor);
}
visit2.BREAK = BREAK2;
visit2.SKIP = SKIP2;
visit2.REMOVE = REMOVE2;
visit2.itemAtPath = (cst, path) => {
  let item = cst;
  for (const [field, index] of path) {
    const tok = item?.[field];
    if (tok && "items" in tok) {
      item = tok.items[index];
    } else
      return void 0;
  }
  return item;
};
visit2.parentCollection = (cst, path) => {
  const parent = visit2.itemAtPath(cst, path.slice(0, -1));
  const field = path[path.length - 1][0];
  const coll = parent?.[field];
  if (coll && "items" in coll)
    return coll;
  throw new Error("Parent collection not found");
};
function _visit(path, item, visitor) {
  let ctrl = visitor(item, path);
  if (typeof ctrl === "symbol")
    return ctrl;
  for (const field of ["key", "value"]) {
    const token = item[field];
    if (token && "items" in token) {
      for (let i = 0; i < token.items.length; ++i) {
        const ci = _visit(Object.freeze(path.concat([[field, i]])), token.items[i], visitor);
        if (typeof ci === "number")
          i = ci - 1;
        else if (ci === BREAK2)
          return BREAK2;
        else if (ci === REMOVE2) {
          token.items.splice(i, 1);
          i -= 1;
        }
      }
      if (typeof ctrl === "function" && field === "key")
        ctrl = ctrl(item, path);
    }
  }
  return typeof ctrl === "function" ? ctrl(item, path) : ctrl;
}

// node_modules/yaml/browser/dist/parse/cst.js
var BOM = "\uFEFF";
var DOCUMENT = "";
var FLOW_END = "";
var SCALAR2 = "";
function tokenType(source) {
  switch (source) {
    case BOM:
      return "byte-order-mark";
    case DOCUMENT:
      return "doc-mode";
    case FLOW_END:
      return "flow-error-end";
    case SCALAR2:
      return "scalar";
    case "---":
      return "doc-start";
    case "...":
      return "doc-end";
    case "":
    case "\n":
    case "\r\n":
      return "newline";
    case "-":
      return "seq-item-ind";
    case "?":
      return "explicit-key-ind";
    case ":":
      return "map-value-ind";
    case "{":
      return "flow-map-start";
    case "}":
      return "flow-map-end";
    case "[":
      return "flow-seq-start";
    case "]":
      return "flow-seq-end";
    case ",":
      return "comma";
  }
  switch (source[0]) {
    case " ":
    case "	":
      return "space";
    case "#":
      return "comment";
    case "%":
      return "directive-line";
    case "*":
      return "alias";
    case "&":
      return "anchor";
    case "!":
      return "tag";
    case "'":
      return "single-quoted-scalar";
    case '"':
      return "double-quoted-scalar";
    case "|":
    case ">":
      return "block-scalar-header";
  }
  return null;
}

// node_modules/yaml/browser/dist/parse/lexer.js
function isEmpty(ch) {
  switch (ch) {
    case void 0:
    case " ":
    case "\n":
    case "\r":
    case "	":
      return true;
    default:
      return false;
  }
}
var hexDigits = new Set("0123456789ABCDEFabcdef");
var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
var flowIndicatorChars = new Set(",[]{}");
var invalidAnchorChars = new Set(" ,[]{}\n\r	");
var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
var Lexer = class {
  constructor() {
    this.atEnd = false;
    this.blockScalarIndent = -1;
    this.blockScalarKeep = false;
    this.buffer = "";
    this.flowKey = false;
    this.flowLevel = 0;
    this.indentNext = 0;
    this.indentValue = 0;
    this.lineEndPos = null;
    this.next = null;
    this.pos = 0;
  }
  /**
   * Generate YAML tokens from the `source` string. If `incomplete`,
   * a part of the last line may be left as a buffer for the next call.
   *
   * @returns A generator of lexical tokens
   */
  *lex(source, incomplete = false) {
    if (source) {
      if (typeof source !== "string")
        throw TypeError("source is not a string");
      this.buffer = this.buffer ? this.buffer + source : source;
      this.lineEndPos = null;
    }
    this.atEnd = !incomplete;
    let next = this.next ?? "stream";
    while (next && (incomplete || this.hasChars(1)))
      next = yield* this.parseNext(next);
  }
  atLineEnd() {
    let i = this.pos;
    let ch = this.buffer[i];
    while (ch === " " || ch === "	")
      ch = this.buffer[++i];
    if (!ch || ch === "#" || ch === "\n")
      return true;
    if (ch === "\r")
      return this.buffer[i + 1] === "\n";
    return false;
  }
  charAt(n) {
    return this.buffer[this.pos + n];
  }
  continueScalar(offset) {
    let ch = this.buffer[offset];
    if (this.indentNext > 0) {
      let indent = 0;
      while (ch === " ")
        ch = this.buffer[++indent + offset];
      if (ch === "\r") {
        const next = this.buffer[indent + offset + 1];
        if (next === "\n" || !next && !this.atEnd)
          return offset + indent + 1;
      }
      return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
    }
    if (ch === "-" || ch === ".") {
      const dt = this.buffer.substr(offset, 3);
      if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
        return -1;
    }
    return offset;
  }
  getLine() {
    let end = this.lineEndPos;
    if (typeof end !== "number" || end !== -1 && end < this.pos) {
      end = this.buffer.indexOf("\n", this.pos);
      this.lineEndPos = end;
    }
    if (end === -1)
      return this.atEnd ? this.buffer.substring(this.pos) : null;
    if (this.buffer[end - 1] === "\r")
      end -= 1;
    return this.buffer.substring(this.pos, end);
  }
  hasChars(n) {
    return this.pos + n <= this.buffer.length;
  }
  setNext(state) {
    this.buffer = this.buffer.substring(this.pos);
    this.pos = 0;
    this.lineEndPos = null;
    this.next = state;
    return null;
  }
  peek(n) {
    return this.buffer.substr(this.pos, n);
  }
  *parseNext(next) {
    switch (next) {
      case "stream":
        return yield* this.parseStream();
      case "line-start":
        return yield* this.parseLineStart();
      case "block-start":
        return yield* this.parseBlockStart();
      case "doc":
        return yield* this.parseDocument();
      case "flow":
        return yield* this.parseFlowCollection();
      case "quoted-scalar":
        return yield* this.parseQuotedScalar();
      case "block-scalar":
        return yield* this.parseBlockScalar();
      case "plain-scalar":
        return yield* this.parsePlainScalar();
    }
  }
  *parseStream() {
    let line = this.getLine();
    if (line === null)
      return this.setNext("stream");
    if (line[0] === BOM) {
      yield* this.pushCount(1);
      line = line.substring(1);
    }
    if (line[0] === "%") {
      let dirEnd = line.length;
      let cs = line.indexOf("#");
      while (cs !== -1) {
        const ch = line[cs - 1];
        if (ch === " " || ch === "	") {
          dirEnd = cs - 1;
          break;
        } else {
          cs = line.indexOf("#", cs + 1);
        }
      }
      while (true) {
        const ch = line[dirEnd - 1];
        if (ch === " " || ch === "	")
          dirEnd -= 1;
        else
          break;
      }
      const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
      yield* this.pushCount(line.length - n);
      this.pushNewline();
      return "stream";
    }
    if (this.atLineEnd()) {
      const sp = yield* this.pushSpaces(true);
      yield* this.pushCount(line.length - sp);
      yield* this.pushNewline();
      return "stream";
    }
    yield DOCUMENT;
    return yield* this.parseLineStart();
  }
  *parseLineStart() {
    const ch = this.charAt(0);
    if (!ch && !this.atEnd)
      return this.setNext("line-start");
    if (ch === "-" || ch === ".") {
      if (!this.atEnd && !this.hasChars(4))
        return this.setNext("line-start");
      const s = this.peek(3);
      if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
        yield* this.pushCount(3);
        this.indentValue = 0;
        this.indentNext = 0;
        return s === "---" ? "doc" : "stream";
      }
    }
    this.indentValue = yield* this.pushSpaces(false);
    if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
      this.indentNext = this.indentValue;
    return yield* this.parseBlockStart();
  }
  *parseBlockStart() {
    const [ch0, ch1] = this.peek(2);
    if (!ch1 && !this.atEnd)
      return this.setNext("block-start");
    if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
      const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
      this.indentNext = this.indentValue + 1;
      this.indentValue += n;
      return "block-start";
    }
    return "doc";
  }
  *parseDocument() {
    yield* this.pushSpaces(true);
    const line = this.getLine();
    if (line === null)
      return this.setNext("doc");
    let n = yield* this.pushIndicators();
    switch (line[n]) {
      case "#":
        yield* this.pushCount(line.length - n);
      case void 0:
        yield* this.pushNewline();
        return yield* this.parseLineStart();
      case "{":
      case "[":
        yield* this.pushCount(1);
        this.flowKey = false;
        this.flowLevel = 1;
        return "flow";
      case "}":
      case "]":
        yield* this.pushCount(1);
        return "doc";
      case "*":
        yield* this.pushUntil(isNotAnchorChar);
        return "doc";
      case '"':
      case "'":
        return yield* this.parseQuotedScalar();
      case "|":
      case ">":
        n += yield* this.parseBlockScalarHeader();
        n += yield* this.pushSpaces(true);
        yield* this.pushCount(line.length - n);
        yield* this.pushNewline();
        return yield* this.parseBlockScalar();
      default:
        return yield* this.parsePlainScalar();
    }
  }
  *parseFlowCollection() {
    let nl, sp;
    let indent = -1;
    do {
      nl = yield* this.pushNewline();
      if (nl > 0) {
        sp = yield* this.pushSpaces(false);
        this.indentValue = indent = sp;
      } else {
        sp = 0;
      }
      sp += yield* this.pushSpaces(true);
    } while (nl + sp > 0);
    const line = this.getLine();
    if (line === null)
      return this.setNext("flow");
    if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
      const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
      if (!atFlowEndMarker) {
        this.flowLevel = 0;
        yield FLOW_END;
        return yield* this.parseLineStart();
      }
    }
    let n = 0;
    while (line[n] === ",") {
      n += yield* this.pushCount(1);
      n += yield* this.pushSpaces(true);
      this.flowKey = false;
    }
    n += yield* this.pushIndicators();
    switch (line[n]) {
      case void 0:
        return "flow";
      case "#":
        yield* this.pushCount(line.length - n);
        return "flow";
      case "{":
      case "[":
        yield* this.pushCount(1);
        this.flowKey = false;
        this.flowLevel += 1;
        return "flow";
      case "}":
      case "]":
        yield* this.pushCount(1);
        this.flowKey = true;
        this.flowLevel -= 1;
        return this.flowLevel ? "flow" : "doc";
      case "*":
        yield* this.pushUntil(isNotAnchorChar);
        return "flow";
      case '"':
      case "'":
        this.flowKey = true;
        return yield* this.parseQuotedScalar();
      case ":": {
        const next = this.charAt(1);
        if (this.flowKey || isEmpty(next) || next === ",") {
          this.flowKey = false;
          yield* this.pushCount(1);
          yield* this.pushSpaces(true);
          return "flow";
        }
      }
      default:
        this.flowKey = false;
        return yield* this.parsePlainScalar();
    }
  }
  *parseQuotedScalar() {
    const quote = this.charAt(0);
    let end = this.buffer.indexOf(quote, this.pos + 1);
    if (quote === "'") {
      while (end !== -1 && this.buffer[end + 1] === "'")
        end = this.buffer.indexOf("'", end + 2);
    } else {
      while (end !== -1) {
        let n = 0;
        while (this.buffer[end - 1 - n] === "\\")
          n += 1;
        if (n % 2 === 0)
          break;
        end = this.buffer.indexOf('"', end + 1);
      }
    }
    const qb = this.buffer.substring(0, end);
    let nl = qb.indexOf("\n", this.pos);
    if (nl !== -1) {
      while (nl !== -1) {
        const cs = this.continueScalar(nl + 1);
        if (cs === -1)
          break;
        nl = qb.indexOf("\n", cs);
      }
      if (nl !== -1) {
        end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
      }
    }
    if (end === -1) {
      if (!this.atEnd)
        return this.setNext("quoted-scalar");
      end = this.buffer.length;
    }
    yield* this.pushToIndex(end + 1, false);
    return this.flowLevel ? "flow" : "doc";
  }
  *parseBlockScalarHeader() {
    this.blockScalarIndent = -1;
    this.blockScalarKeep = false;
    let i = this.pos;
    while (true) {
      const ch = this.buffer[++i];
      if (ch === "+")
        this.blockScalarKeep = true;
      else if (ch > "0" && ch <= "9")
        this.blockScalarIndent = Number(ch) - 1;
      else if (ch !== "-")
        break;
    }
    return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
  }
  *parseBlockScalar() {
    let nl = this.pos - 1;
    let indent = 0;
    let ch;
    loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
      switch (ch) {
        case " ":
          indent += 1;
          break;
        case "\n":
          nl = i2;
          indent = 0;
          break;
        case "\r": {
          const next = this.buffer[i2 + 1];
          if (!next && !this.atEnd)
            return this.setNext("block-scalar");
          if (next === "\n")
            break;
        }
        default:
          break loop;
      }
    }
    if (!ch && !this.atEnd)
      return this.setNext("block-scalar");
    if (indent >= this.indentNext) {
      if (this.blockScalarIndent === -1)
        this.indentNext = indent;
      else {
        this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
      }
      do {
        const cs = this.continueScalar(nl + 1);
        if (cs === -1)
          break;
        nl = this.buffer.indexOf("\n", cs);
      } while (nl !== -1);
      if (nl === -1) {
        if (!this.atEnd)
          return this.setNext("block-scalar");
        nl = this.buffer.length;
      }
    }
    let i = nl + 1;
    ch = this.buffer[i];
    while (ch === " ")
      ch = this.buffer[++i];
    if (ch === "	") {
      while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
        ch = this.buffer[++i];
      nl = i - 1;
    } else if (!this.blockScalarKeep) {
      do {
        let i2 = nl - 1;
        let ch2 = this.buffer[i2];
        if (ch2 === "\r")
          ch2 = this.buffer[--i2];
        const lastChar = i2;
        while (ch2 === " ")
          ch2 = this.buffer[--i2];
        if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
          nl = i2;
        else
          break;
      } while (true);
    }
    yield SCALAR2;
    yield* this.pushToIndex(nl + 1, true);
    return yield* this.parseLineStart();
  }
  *parsePlainScalar() {
    const inFlow = this.flowLevel > 0;
    let end = this.pos - 1;
    let i = this.pos - 1;
    let ch;
    while (ch = this.buffer[++i]) {
      if (ch === ":") {
        const next = this.buffer[i + 1];
        if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
          break;
        end = i;
      } else if (isEmpty(ch)) {
        let next = this.buffer[i + 1];
        if (ch === "\r") {
          if (next === "\n") {
            i += 1;
            ch = "\n";
            next = this.buffer[i + 1];
          } else
            end = i;
        }
        if (next === "#" || inFlow && flowIndicatorChars.has(next))
          break;
        if (ch === "\n") {
          const cs = this.continueScalar(i + 1);
          if (cs === -1)
            break;
          i = Math.max(i, cs - 2);
        }
      } else {
        if (inFlow && flowIndicatorChars.has(ch))
          break;
        end = i;
      }
    }
    if (!ch && !this.atEnd)
      return this.setNext("plain-scalar");
    yield SCALAR2;
    yield* this.pushToIndex(end + 1, true);
    return inFlow ? "flow" : "doc";
  }
  *pushCount(n) {
    if (n > 0) {
      yield this.buffer.substr(this.pos, n);
      this.pos += n;
      return n;
    }
    return 0;
  }
  *pushToIndex(i, allowEmpty) {
    const s = this.buffer.slice(this.pos, i);
    if (s) {
      yield s;
      this.pos += s.length;
      return s.length;
    } else if (allowEmpty)
      yield "";
    return 0;
  }
  *pushIndicators() {
    let n = 0;
    loop: while (true) {
      switch (this.charAt(0)) {
        case "!":
          n += yield* this.pushTag();
          n += yield* this.pushSpaces(true);
          continue loop;
        case "&":
          n += yield* this.pushUntil(isNotAnchorChar);
          n += yield* this.pushSpaces(true);
          continue loop;
        case "-":
        case "?":
        case ":": {
          const inFlow = this.flowLevel > 0;
          const ch1 = this.charAt(1);
          if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
            if (!inFlow)
              this.indentNext = this.indentValue + 1;
            else if (this.flowKey)
              this.flowKey = false;
            n += yield* this.pushCount(1);
            n += yield* this.pushSpaces(true);
            continue loop;
          }
        }
      }
      break loop;
    }
    return n;
  }
  *pushTag() {
    if (this.charAt(1) === "<") {
      let i = this.pos + 2;
      let ch = this.buffer[i];
      while (!isEmpty(ch) && ch !== ">")
        ch = this.buffer[++i];
      return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
    } else {
      let i = this.pos + 1;
      let ch = this.buffer[i];
      while (ch) {
        if (tagChars.has(ch))
          ch = this.buffer[++i];
        else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
          ch = this.buffer[i += 3];
        } else
          break;
      }
      return yield* this.pushToIndex(i, false);
    }
  }
  *pushNewline() {
    const ch = this.buffer[this.pos];
    if (ch === "\n")
      return yield* this.pushCount(1);
    else if (ch === "\r" && this.charAt(1) === "\n")
      return yield* this.pushCount(2);
    else
      return 0;
  }
  *pushSpaces(allowTabs) {
    let i = this.pos - 1;
    let ch;
    do {
      ch = this.buffer[++i];
    } while (ch === " " || allowTabs && ch === "	");
    const n = i - this.pos;
    if (n > 0) {
      yield this.buffer.substr(this.pos, n);
      this.pos = i;
    }
    return n;
  }
  *pushUntil(test) {
    let i = this.pos;
    let ch = this.buffer[i];
    while (!test(ch))
      ch = this.buffer[++i];
    return yield* this.pushToIndex(i, false);
  }
};

// node_modules/yaml/browser/dist/parse/line-counter.js
var LineCounter = class {
  constructor() {
    this.lineStarts = [];
    this.addNewLine = (offset) => this.lineStarts.push(offset);
    this.linePos = (offset) => {
      let low = 0;
      let high = this.lineStarts.length;
      while (low < high) {
        const mid = low + high >> 1;
        if (this.lineStarts[mid] < offset)
          low = mid + 1;
        else
          high = mid;
      }
      if (this.lineStarts[low] === offset)
        return { line: low + 1, col: 1 };
      if (low === 0)
        return { line: 0, col: offset };
      const start = this.lineStarts[low - 1];
      return { line: low, col: offset - start + 1 };
    };
  }
};

// node_modules/yaml/browser/dist/parse/parser.js
function includesToken(list, type) {
  for (let i = 0; i < list.length; ++i)
    if (list[i].type === type)
      return true;
  return false;
}
function findNonEmptyIndex(list) {
  for (let i = 0; i < list.length; ++i) {
    switch (list[i].type) {
      case "space":
      case "comment":
      case "newline":
        break;
      default:
        return i;
    }
  }
  return -1;
}
function isFlowToken(token) {
  switch (token?.type) {
    case "alias":
    case "scalar":
    case "single-quoted-scalar":
    case "double-quoted-scalar":
    case "flow-collection":
      return true;
    default:
      return false;
  }
}
function getPrevProps(parent) {
  switch (parent.type) {
    case "document":
      return parent.start;
    case "block-map": {
      const it = parent.items[parent.items.length - 1];
      return it.sep ?? it.start;
    }
    case "block-seq":
      return parent.items[parent.items.length - 1].start;
    default:
      return [];
  }
}
function getFirstKeyStartProps(prev) {
  if (prev.length === 0)
    return [];
  let i = prev.length;
  loop: while (--i >= 0) {
    switch (prev[i].type) {
      case "doc-start":
      case "explicit-key-ind":
      case "map-value-ind":
      case "seq-item-ind":
      case "newline":
        break loop;
    }
  }
  while (prev[++i]?.type === "space") {
  }
  return prev.splice(i, prev.length);
}
function arrayPushArray(target, source) {
  if (source.length < 1e5)
    Array.prototype.push.apply(target, source);
  else
    for (let i = 0; i < source.length; ++i)
      target.push(source[i]);
}
function fixFlowSeqItems(fc) {
  if (fc.start.type === "flow-seq-start") {
    for (const it of fc.items) {
      if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
        if (it.key)
          it.value = it.key;
        delete it.key;
        if (isFlowToken(it.value)) {
          if (it.value.end)
            arrayPushArray(it.value.end, it.sep);
          else
            it.value.end = it.sep;
        } else
          arrayPushArray(it.start, it.sep);
        delete it.sep;
      }
    }
  }
}
var Parser = class {
  /**
   * @param onNewLine - If defined, called separately with the start position of
   *   each new line (in `parse()`, including the start of input).
   */
  constructor(onNewLine) {
    this.atNewLine = true;
    this.atScalar = false;
    this.indent = 0;
    this.offset = 0;
    this.onKeyLine = false;
    this.stack = [];
    this.source = "";
    this.type = "";
    this.lexer = new Lexer();
    this.onNewLine = onNewLine;
  }
  /**
   * Parse `source` as a YAML stream.
   * If `incomplete`, a part of the last line may be left as a buffer for the next call.
   *
   * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
   *
   * @returns A generator of tokens representing each directive, document, and other structure.
   */
  *parse(source, incomplete = false) {
    if (this.onNewLine && this.offset === 0)
      this.onNewLine(0);
    for (const lexeme of this.lexer.lex(source, incomplete))
      yield* this.next(lexeme);
    if (!incomplete)
      yield* this.end();
  }
  /**
   * Advance the parser by the `source` of one lexical token.
   */
  *next(source) {
    this.source = source;
    if (this.atScalar) {
      this.atScalar = false;
      yield* this.step();
      this.offset += source.length;
      return;
    }
    const type = tokenType(source);
    if (!type) {
      const message = `Not a YAML token: ${source}`;
      yield* this.pop({ type: "error", offset: this.offset, message, source });
      this.offset += source.length;
    } else if (type === "scalar") {
      this.atNewLine = false;
      this.atScalar = true;
      this.type = "scalar";
    } else {
      this.type = type;
      yield* this.step();
      switch (type) {
        case "newline":
          this.atNewLine = true;
          this.indent = 0;
          if (this.onNewLine)
            this.onNewLine(this.offset + source.length);
          break;
        case "space":
          if (this.atNewLine && source[0] === " ")
            this.indent += source.length;
          break;
        case "explicit-key-ind":
        case "map-value-ind":
        case "seq-item-ind":
          if (this.atNewLine)
            this.indent += source.length;
          break;
        case "doc-mode":
        case "flow-error-end":
          return;
        default:
          this.atNewLine = false;
      }
      this.offset += source.length;
    }
  }
  /** Call at end of input to push out any remaining constructions */
  *end() {
    while (this.stack.length > 0)
      yield* this.pop();
  }
  get sourceToken() {
    const st = {
      type: this.type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
    return st;
  }
  *step() {
    const top = this.peek(1);
    if (this.type === "doc-end" && top?.type !== "doc-end") {
      while (this.stack.length > 0)
        yield* this.pop();
      this.stack.push({
        type: "doc-end",
        offset: this.offset,
        source: this.source
      });
      return;
    }
    if (!top)
      return yield* this.stream();
    switch (top.type) {
      case "document":
        return yield* this.document(top);
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return yield* this.scalar(top);
      case "block-scalar":
        return yield* this.blockScalar(top);
      case "block-map":
        return yield* this.blockMap(top);
      case "block-seq":
        return yield* this.blockSequence(top);
      case "flow-collection":
        return yield* this.flowCollection(top);
      case "doc-end":
        return yield* this.documentEnd(top);
    }
    yield* this.pop();
  }
  peek(n) {
    return this.stack[this.stack.length - n];
  }
  *pop(error) {
    const token = error ?? this.stack.pop();
    if (!token) {
      const message = "Tried to pop an empty stack";
      yield { type: "error", offset: this.offset, source: "", message };
    } else if (this.stack.length === 0) {
      yield token;
    } else {
      const top = this.peek(1);
      if (token.type === "block-scalar") {
        token.indent = "indent" in top ? top.indent : 0;
      } else if (token.type === "flow-collection" && top.type === "document") {
        token.indent = 0;
      }
      if (token.type === "flow-collection")
        fixFlowSeqItems(token);
      switch (top.type) {
        case "document":
          top.value = token;
          break;
        case "block-scalar":
          top.props.push(token);
          break;
        case "block-map": {
          const it = top.items[top.items.length - 1];
          if (it.value) {
            top.items.push({ start: [], key: token, sep: [] });
            this.onKeyLine = true;
            return;
          } else if (it.sep) {
            it.value = token;
          } else {
            Object.assign(it, { key: token, sep: [] });
            this.onKeyLine = !it.explicitKey;
            return;
          }
          break;
        }
        case "block-seq": {
          const it = top.items[top.items.length - 1];
          if (it.value)
            top.items.push({ start: [], value: token });
          else
            it.value = token;
          break;
        }
        case "flow-collection": {
          const it = top.items[top.items.length - 1];
          if (!it || it.value)
            top.items.push({ start: [], key: token, sep: [] });
          else if (it.sep)
            it.value = token;
          else
            Object.assign(it, { key: token, sep: [] });
          return;
        }
        default:
          yield* this.pop();
          yield* this.pop(token);
      }
      if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
        const last = token.items[token.items.length - 1];
        if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
          if (top.type === "document")
            top.end = last.start;
          else
            top.items.push({ start: last.start });
          token.items.splice(-1, 1);
        }
      }
    }
  }
  *stream() {
    switch (this.type) {
      case "directive-line":
        yield { type: "directive", offset: this.offset, source: this.source };
        return;
      case "byte-order-mark":
      case "space":
      case "comment":
      case "newline":
        yield this.sourceToken;
        return;
      case "doc-mode":
      case "doc-start": {
        const doc = {
          type: "document",
          offset: this.offset,
          start: []
        };
        if (this.type === "doc-start")
          doc.start.push(this.sourceToken);
        this.stack.push(doc);
        return;
      }
    }
    yield {
      type: "error",
      offset: this.offset,
      message: `Unexpected ${this.type} token in YAML stream`,
      source: this.source
    };
  }
  *document(doc) {
    if (doc.value)
      return yield* this.lineEnd(doc);
    switch (this.type) {
      case "doc-start": {
        if (findNonEmptyIndex(doc.start) !== -1) {
          yield* this.pop();
          yield* this.step();
        } else
          doc.start.push(this.sourceToken);
        return;
      }
      case "anchor":
      case "tag":
      case "space":
      case "comment":
      case "newline":
        doc.start.push(this.sourceToken);
        return;
    }
    const bv = this.startBlockValue(doc);
    if (bv)
      this.stack.push(bv);
    else {
      yield {
        type: "error",
        offset: this.offset,
        message: `Unexpected ${this.type} token in YAML document`,
        source: this.source
      };
    }
  }
  *scalar(scalar) {
    if (this.type === "map-value-ind") {
      const prev = getPrevProps(this.peek(2));
      const start = getFirstKeyStartProps(prev);
      let sep;
      if (scalar.end) {
        sep = scalar.end;
        sep.push(this.sourceToken);
        delete scalar.end;
      } else
        sep = [this.sourceToken];
      const map2 = {
        type: "block-map",
        offset: scalar.offset,
        indent: scalar.indent,
        items: [{ start, key: scalar, sep }]
      };
      this.onKeyLine = true;
      this.stack[this.stack.length - 1] = map2;
    } else
      yield* this.lineEnd(scalar);
  }
  *blockScalar(scalar) {
    switch (this.type) {
      case "space":
      case "comment":
      case "newline":
        scalar.props.push(this.sourceToken);
        return;
      case "scalar":
        scalar.source = this.source;
        this.atNewLine = true;
        this.indent = 0;
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        yield* this.pop();
        break;
      default:
        yield* this.pop();
        yield* this.step();
    }
  }
  *blockMap(map2) {
    const it = map2.items[map2.items.length - 1];
    switch (this.type) {
      case "newline":
        this.onKeyLine = false;
        if (it.value) {
          const end = "end" in it.value ? it.value.end : void 0;
          const last = Array.isArray(end) ? end[end.length - 1] : void 0;
          if (last?.type === "comment")
            end?.push(this.sourceToken);
          else
            map2.items.push({ start: [this.sourceToken] });
        } else if (it.sep) {
          it.sep.push(this.sourceToken);
        } else {
          it.start.push(this.sourceToken);
        }
        return;
      case "space":
      case "comment":
        if (it.value) {
          map2.items.push({ start: [this.sourceToken] });
        } else if (it.sep) {
          it.sep.push(this.sourceToken);
        } else {
          if (this.atIndentedComment(it.start, map2.indent)) {
            const prev = map2.items[map2.items.length - 2];
            const end = prev?.value?.end;
            if (Array.isArray(end)) {
              arrayPushArray(end, it.start);
              end.push(this.sourceToken);
              map2.items.pop();
              return;
            }
          }
          it.start.push(this.sourceToken);
        }
        return;
    }
    if (this.indent >= map2.indent) {
      const atMapIndent = !this.onKeyLine && this.indent === map2.indent;
      const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
      let start = [];
      if (atNextItem && it.sep && !it.value) {
        const nl = [];
        for (let i = 0; i < it.sep.length; ++i) {
          const st = it.sep[i];
          switch (st.type) {
            case "newline":
              nl.push(i);
              break;
            case "space":
              break;
            case "comment":
              if (st.indent > map2.indent)
                nl.length = 0;
              break;
            default:
              nl.length = 0;
          }
        }
        if (nl.length >= 2)
          start = it.sep.splice(nl[1]);
      }
      switch (this.type) {
        case "anchor":
        case "tag":
          if (atNextItem || it.value) {
            start.push(this.sourceToken);
            map2.items.push({ start });
            this.onKeyLine = true;
          } else if (it.sep) {
            it.sep.push(this.sourceToken);
          } else {
            it.start.push(this.sourceToken);
          }
          return;
        case "explicit-key-ind":
          if (!it.sep && !it.explicitKey) {
            it.start.push(this.sourceToken);
            it.explicitKey = true;
          } else if (atNextItem || it.value) {
            start.push(this.sourceToken);
            map2.items.push({ start, explicitKey: true });
          } else {
            this.stack.push({
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken], explicitKey: true }]
            });
          }
          this.onKeyLine = true;
          return;
        case "map-value-ind":
          if (it.explicitKey) {
            if (!it.sep) {
              if (includesToken(it.start, "newline")) {
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              } else {
                const start2 = getFirstKeyStartProps(it.start);
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                });
              }
            } else if (it.value) {
              map2.items.push({ start: [], key: null, sep: [this.sourceToken] });
            } else if (includesToken(it.sep, "map-value-ind")) {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start, key: null, sep: [this.sourceToken] }]
              });
            } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
              const start2 = getFirstKeyStartProps(it.start);
              const key = it.key;
              const sep = it.sep;
              sep.push(this.sourceToken);
              delete it.key;
              delete it.sep;
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: start2, key, sep }]
              });
            } else if (start.length > 0) {
              it.sep = it.sep.concat(start, this.sourceToken);
            } else {
              it.sep.push(this.sourceToken);
            }
          } else {
            if (!it.sep) {
              Object.assign(it, { key: null, sep: [this.sourceToken] });
            } else if (it.value || atNextItem) {
              map2.items.push({ start, key: null, sep: [this.sourceToken] });
            } else if (includesToken(it.sep, "map-value-ind")) {
              this.stack.push({
                type: "block-map",
                offset: this.offset,
                indent: this.indent,
                items: [{ start: [], key: null, sep: [this.sourceToken] }]
              });
            } else {
              it.sep.push(this.sourceToken);
            }
          }
          this.onKeyLine = true;
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const fs = this.flowScalar(this.type);
          if (atNextItem || it.value) {
            map2.items.push({ start, key: fs, sep: [] });
            this.onKeyLine = true;
          } else if (it.sep) {
            this.stack.push(fs);
          } else {
            Object.assign(it, { key: fs, sep: [] });
            this.onKeyLine = true;
          }
          return;
        }
        default: {
          const bv = this.startBlockValue(map2);
          if (bv) {
            if (bv.type === "block-seq") {
              if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                yield* this.pop({
                  type: "error",
                  offset: this.offset,
                  message: "Unexpected block-seq-ind on same line with key",
                  source: this.source
                });
                return;
              }
            } else if (atMapIndent) {
              map2.items.push({ start });
            }
            this.stack.push(bv);
            return;
          }
        }
      }
    }
    yield* this.pop();
    yield* this.step();
  }
  *blockSequence(seq2) {
    const it = seq2.items[seq2.items.length - 1];
    switch (this.type) {
      case "newline":
        if (it.value) {
          const end = "end" in it.value ? it.value.end : void 0;
          const last = Array.isArray(end) ? end[end.length - 1] : void 0;
          if (last?.type === "comment")
            end?.push(this.sourceToken);
          else
            seq2.items.push({ start: [this.sourceToken] });
        } else
          it.start.push(this.sourceToken);
        return;
      case "space":
      case "comment":
        if (it.value)
          seq2.items.push({ start: [this.sourceToken] });
        else {
          if (this.atIndentedComment(it.start, seq2.indent)) {
            const prev = seq2.items[seq2.items.length - 2];
            const end = prev?.value?.end;
            if (Array.isArray(end)) {
              arrayPushArray(end, it.start);
              end.push(this.sourceToken);
              seq2.items.pop();
              return;
            }
          }
          it.start.push(this.sourceToken);
        }
        return;
      case "anchor":
      case "tag":
        if (it.value || this.indent <= seq2.indent)
          break;
        it.start.push(this.sourceToken);
        return;
      case "seq-item-ind":
        if (this.indent !== seq2.indent)
          break;
        if (it.value || includesToken(it.start, "seq-item-ind"))
          seq2.items.push({ start: [this.sourceToken] });
        else
          it.start.push(this.sourceToken);
        return;
    }
    if (this.indent > seq2.indent) {
      const bv = this.startBlockValue(seq2);
      if (bv) {
        this.stack.push(bv);
        return;
      }
    }
    yield* this.pop();
    yield* this.step();
  }
  *flowCollection(fc) {
    const it = fc.items[fc.items.length - 1];
    if (this.type === "flow-error-end") {
      let top;
      do {
        yield* this.pop();
        top = this.peek(1);
      } while (top?.type === "flow-collection");
    } else if (fc.end.length === 0) {
      switch (this.type) {
        case "comma":
        case "explicit-key-ind":
          if (!it || it.sep)
            fc.items.push({ start: [this.sourceToken] });
          else
            it.start.push(this.sourceToken);
          return;
        case "map-value-ind":
          if (!it || it.value)
            fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
          else if (it.sep)
            it.sep.push(this.sourceToken);
          else
            Object.assign(it, { key: null, sep: [this.sourceToken] });
          return;
        case "space":
        case "comment":
        case "newline":
        case "anchor":
        case "tag":
          if (!it || it.value)
            fc.items.push({ start: [this.sourceToken] });
          else if (it.sep)
            it.sep.push(this.sourceToken);
          else
            it.start.push(this.sourceToken);
          return;
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar": {
          const fs = this.flowScalar(this.type);
          if (!it || it.value)
            fc.items.push({ start: [], key: fs, sep: [] });
          else if (it.sep)
            this.stack.push(fs);
          else
            Object.assign(it, { key: fs, sep: [] });
          return;
        }
        case "flow-map-end":
        case "flow-seq-end":
          fc.end.push(this.sourceToken);
          return;
      }
      const bv = this.startBlockValue(fc);
      if (bv)
        this.stack.push(bv);
      else {
        yield* this.pop();
        yield* this.step();
      }
    } else {
      const parent = this.peek(2);
      if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
        yield* this.pop();
        yield* this.step();
      } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        fixFlowSeqItems(fc);
        const sep = fc.end.splice(1, fc.end.length);
        sep.push(this.sourceToken);
        const map2 = {
          type: "block-map",
          offset: fc.offset,
          indent: fc.indent,
          items: [{ start, key: fc, sep }]
        };
        this.onKeyLine = true;
        this.stack[this.stack.length - 1] = map2;
      } else {
        yield* this.lineEnd(fc);
      }
    }
  }
  flowScalar(type) {
    if (this.onNewLine) {
      let nl = this.source.indexOf("\n") + 1;
      while (nl !== 0) {
        this.onNewLine(this.offset + nl);
        nl = this.source.indexOf("\n", nl) + 1;
      }
    }
    return {
      type,
      offset: this.offset,
      indent: this.indent,
      source: this.source
    };
  }
  startBlockValue(parent) {
    switch (this.type) {
      case "alias":
      case "scalar":
      case "single-quoted-scalar":
      case "double-quoted-scalar":
        return this.flowScalar(this.type);
      case "block-scalar-header":
        return {
          type: "block-scalar",
          offset: this.offset,
          indent: this.indent,
          props: [this.sourceToken],
          source: ""
        };
      case "flow-map-start":
      case "flow-seq-start":
        return {
          type: "flow-collection",
          offset: this.offset,
          indent: this.indent,
          start: this.sourceToken,
          items: [],
          end: []
        };
      case "seq-item-ind":
        return {
          type: "block-seq",
          offset: this.offset,
          indent: this.indent,
          items: [{ start: [this.sourceToken] }]
        };
      case "explicit-key-ind": {
        this.onKeyLine = true;
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        start.push(this.sourceToken);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start, explicitKey: true }]
        };
      }
      case "map-value-ind": {
        this.onKeyLine = true;
        const prev = getPrevProps(parent);
        const start = getFirstKeyStartProps(prev);
        return {
          type: "block-map",
          offset: this.offset,
          indent: this.indent,
          items: [{ start, key: null, sep: [this.sourceToken] }]
        };
      }
    }
    return null;
  }
  atIndentedComment(start, indent) {
    if (this.type !== "comment")
      return false;
    if (this.indent <= indent)
      return false;
    return start.every((st) => st.type === "newline" || st.type === "space");
  }
  *documentEnd(docEnd) {
    if (this.type !== "doc-mode") {
      if (docEnd.end)
        docEnd.end.push(this.sourceToken);
      else
        docEnd.end = [this.sourceToken];
      if (this.type === "newline")
        yield* this.pop();
    }
  }
  *lineEnd(token) {
    switch (this.type) {
      case "comma":
      case "doc-start":
      case "doc-end":
      case "flow-seq-end":
      case "flow-map-end":
      case "map-value-ind":
        yield* this.pop();
        yield* this.step();
        break;
      case "newline":
        this.onKeyLine = false;
      case "space":
      case "comment":
      default:
        if (token.end)
          token.end.push(this.sourceToken);
        else
          token.end = [this.sourceToken];
        if (this.type === "newline")
          yield* this.pop();
    }
  }
};

// node_modules/yaml/browser/dist/public-api.js
function parseOptions(options) {
  const prettyErrors = options.prettyErrors !== false;
  const lineCounter = options.lineCounter || prettyErrors && new LineCounter() || null;
  return { lineCounter, prettyErrors };
}
function parseDocument(source, options = {}) {
  const { lineCounter, prettyErrors } = parseOptions(options);
  const parser = new Parser(lineCounter?.addNewLine);
  const composer = new Composer(options);
  let doc = null;
  for (const _doc of composer.compose(parser.parse(source), true, source.length)) {
    if (!doc)
      doc = _doc;
    else if (doc.options.logLevel !== "silent") {
      doc.errors.push(new YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
      break;
    }
  }
  if (prettyErrors && lineCounter) {
    doc.errors.forEach(prettifyError(source, lineCounter));
    doc.warnings.forEach(prettifyError(source, lineCounter));
  }
  return doc;
}
function parse(src, reviver, options) {
  let _reviver = void 0;
  if (typeof reviver === "function") {
    _reviver = reviver;
  } else if (options === void 0 && reviver && typeof reviver === "object") {
    options = reviver;
  }
  const doc = parseDocument(src, options);
  if (!doc)
    return null;
  doc.warnings.forEach((warning) => warn(doc.options.logLevel, warning));
  if (doc.errors.length > 0) {
    if (doc.options.logLevel !== "silent")
      throw doc.errors[0];
    else
      doc.errors = [];
  }
  return doc.toJS(Object.assign({ reviver: _reviver }, options));
}

// src/yaml-injector.ts
function serializeValue(val, indent = 0) {
  if (val === null || val === void 0) return "";
  if (typeof val === "boolean") return String(val);
  if (typeof val === "number") return String(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    if (val.every((v) => v !== null && typeof v === "object" && !Array.isArray(v))) {
      const pad = "  ".repeat(indent);
      return "\n" + val.map((item) => {
        const entries = Object.entries(item).map(([k2, v2]) => `${pad}    ${k2}: ${serializeValue(v2, indent + 2)}`).join("\n");
        return `${pad}  -
${entries}`;
      }).join("\n");
    }
    const items = val.map((v) => serializeScalar(v));
    return `[${items.join(", ")}]`;
  }
  if (typeof val === "object") {
    const pad = "  ".repeat(indent);
    const entries = Object.entries(val).map(([k2, v2]) => `${pad}  ${k2}: ${serializeValue(v2, indent + 1)}`);
    return "\n" + entries.join("\n");
  }
  return serializeScalar(val);
}
function serializeScalar(val) {
  if (val === null || val === void 0) return "";
  if (typeof val === "boolean" || typeof val === "number") return String(val);
  const str = String(val);
  const needsQuotes = str === "" || str.includes(":") || str.includes("#") || str.includes("\n") || str.includes('"') || str.startsWith("-") || str.startsWith("[") || str.startsWith("{") || str === "true" || str === "false" || str === "null" || str === "~";
  if (needsQuotes) {
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str;
}
var FRONTMATTER_DELIMITER = /^---\s*\n([\s\S]*?)\n---\s*\n?/;
function injectFrontmatter(content, metadata) {
  const match = FRONTMATTER_DELIMITER.exec(content);
  let existing = {};
  let body = content;
  if (match) {
    const yamlBlock = match[1];
    try {
      existing = parse(yamlBlock) || {};
    } catch {
      existing = {};
    }
    body = content.slice(match[0].length);
  }
  const merged = cleanUndefined({ ...existing, ...metadata });
  const lines = Object.entries(merged).map(([k, v]) => `${k}: ${serializeValue(v)}`);
  if (lines.length === 0) return content;
  const newFront = `---
${lines.join("\n")}
---
`;
  return newFront + body;
}
function cleanUndefined(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== void 0) out[k] = v;
  }
  return out;
}
function parseFrontmatter(raw) {
  const match = FRONTMATTER_DELIMITER.exec(raw);
  if (!match) return {};
  try {
    return parse(match[1]) || {};
  } catch {
    return {};
  }
}

// src/components/confirm-modal.ts
var import_obsidian = require("obsidian");

// src/components/tap-tempo.ts
var TapTempoController = class {
  constructor(opts = {}) {
    this.times = [];
    this.maxTaps = opts.maxTaps ?? 8;
  }
  /** Call on every tap. Returns the current estimated BPM or null if not enough data. */
  tap() {
    const now = performance.now();
    this.times.push(now);
    if (this.times.length > this.maxTaps) {
      this.times.shift();
    }
    if (this.times.length < 2) return null;
    const intervals = [];
    for (let i = 1; i < this.times.length; i++) {
      intervals.push(this.times[i] - this.times[i - 1]);
    }
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    if (avg <= 0) return null;
    const bpm = Math.round(6e4 / avg);
    if (bpm < MIN_SANE || bpm > MAX_SANE) return null;
    return bpm;
  }
  reset() {
    this.times = [];
  }
};
var MIN_SANE = 60;
var MAX_SANE = 200;

// src/components/bpm-control.ts
var BpmControl = class {
  constructor(parent, initial, callbacks = {}) {
    this.state = { ...initial };
    this.callbacks = callbacks;
    this.tapController = new TapTempoController({ maxTaps: 8 });
    this.container = this.build(parent);
  }
  build(parent) {
    const root = parent.createDiv({ cls: "bpm-control" });
    const valueRow = root.createDiv({ cls: "bpm-value-row" });
    this.renderValue(valueRow);
    if (this.state.alternateBpm) {
      const alt = root.createDiv({ cls: "bpm-alternate-row" });
      const altBtn = alt.createEl("button", {
        cls: "bpm-alternate",
        text: `or ${this.state.alternateBpm}?`
      });
      altBtn.addEventListener("click", () => this.acceptAlternate());
    }
    const actions = root.createDiv({ cls: "bpm-actions" });
    const btnHalve = actions.createEl("button", { cls: "bpm-btn-halve", text: "\xBD" });
    btnHalve.addEventListener("click", () => this.setBpm(Math.round(this.state.bpm / 2)));
    const btnDouble = actions.createEl("button", { cls: "bpm-btn-double", text: "\xD72" });
    btnDouble.addEventListener("click", () => this.setBpm(this.state.bpm * 2));
    const btnTap = actions.createEl("button", { cls: "bpm-btn-tap", text: "Tap tempo" });
    btnTap.addEventListener("click", () => this.onTap(btnTap));
    const confirmRow = root.createDiv({ cls: "bpm-confirm-row" });
    const confirmCb = confirmRow.createEl("input", { type: "checkbox" });
    confirmCb.checked = this.state.confirmed;
    confirmCb.addEventListener("change", () => {
      this.state.confirmed = confirmCb.checked;
      this.refreshConfirmedState(root);
      this.callbacks.onConfirmed?.(this.state.confirmed);
    });
    confirmRow.createSpan({ text: " Tempo confirmed" });
    this.refreshConfirmedState(root);
    return root;
  }
  renderValue(container) {
    container.empty();
    const display = container.createSpan({ cls: "bpm-value", text: String(this.state.bpm) });
    display.addEventListener("click", () => this.startInlineEdit(display));
    container.createSpan({ cls: "bpm-raw", text: ` (raw ${this.state.rawBpm})` });
  }
  startInlineEdit(el) {
    const input = document.createElement("input");
    input.type = "number";
    input.value = String(this.state.bpm);
    input.className = "bpm-input";
    input.min = "40";
    input.max = "300";
    el.replaceWith(input);
    input.focus();
    input.select();
    const commit = () => {
      const val = parseInt(input.value, 10);
      if (!isNaN(val) && val >= 40 && val <= 300) {
        this.setBpm(val);
      }
      this.refreshValue();
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") commit();
      if (e.key === "Escape") this.refreshValue();
    });
  }
  refreshValue() {
    const row = this.container.querySelector(".bpm-value-row");
    if (row) this.renderValue(row);
  }
  setBpm(bpm) {
    this.state.bpm = bpm;
    const doubled = bpm * 2;
    const halved = Math.round(bpm / 2);
    if (doubled <= 200 && doubled !== bpm) {
      this.state.alternateBpm = doubled;
    } else if (halved >= 60 && halved !== bpm) {
      this.state.alternateBpm = halved;
    } else {
      this.state.alternateBpm = void 0;
    }
    this.refreshValue();
    this.refreshAlternate();
    this.callbacks.onChange?.(this.state.bpm);
  }
  acceptAlternate() {
    if (this.state.alternateBpm) {
      this.setBpm(this.state.alternateBpm);
    }
  }
  refreshAlternate() {
    const existing = this.container.querySelector(".bpm-alternate-row");
    if (existing) existing.remove();
    if (this.state.alternateBpm) {
      const actions = this.container.querySelector(".bpm-actions");
      const alt = this.container.createDiv({ cls: "bpm-alternate-row" });
      if (actions) this.container.insertBefore(alt, actions);
      else this.container.appendChild(alt);
      const btn = alt.createEl("button", {
        cls: "bpm-alternate",
        text: `or ${this.state.alternateBpm}?`
      });
      btn.addEventListener("click", () => this.acceptAlternate());
    }
  }
  onTap(btn) {
    const bpm = this.tapController.tap();
    btn.classList.add("bpm-btn-tap-active");
    clearTimeout(this.tapFlashTimeout);
    this.tapFlashTimeout = setTimeout(() => btn.classList.remove("bpm-btn-tap-active"), 150);
    if (bpm !== null) {
      this.setBpm(bpm);
    }
  }
  refreshConfirmedState(root) {
    root.classList.toggle("bpm-confirmed", this.state.confirmed);
    root.classList.toggle("bpm-unconfirmed", !this.state.confirmed);
  }
  getState() {
    return { ...this.state };
  }
  mount(parent) {
    parent.appendChild(this.container);
  }
  destroy() {
    this.container.remove();
    clearTimeout(this.tapFlashTimeout);
  }
};

// src/components/key-control.ts
var CHROMATIC = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var RELATIVE_MAJOR = {
  Am: "C",
  Em: "G",
  Bm: "D",
  "F#m": "A",
  "C#m": "E",
  "G#m": "B",
  "D#m": "F#",
  "A#m": "C#",
  Dm: "F",
  Gm: "Bb",
  Cm: "Eb",
  Fm: "Ab"
};
var RELATIVE_MINOR = Object.fromEntries(
  Object.entries(RELATIVE_MAJOR).map(([k, v]) => [v, k])
);
var KeyControl = class {
  constructor(parent, initial, callbacks = {}) {
    this.state = { ...initial };
    this.callbacks = callbacks;
    this.container = this.build(parent);
  }
  build(parent) {
    const root = parent.createDiv({ cls: "key-control" });
    const valueRow = root.createDiv({ cls: "key-value-row" });
    this.renderValue(valueRow);
    this.renderRelative(root);
    const actions = root.createDiv({ cls: "key-actions" });
    const btnDown = actions.createEl("button", { cls: "key-btn-semitone-down", text: "\u266D" });
    btnDown.addEventListener("click", () => this.shiftSemitone(-1));
    const btnUp = actions.createEl("button", { cls: "key-btn-semitone-up", text: "\u266F" });
    btnUp.addEventListener("click", () => this.shiftSemitone(1));
    const btnMode = actions.createEl("button", {
      cls: "key-btn-mode-toggle",
      text: this.state.scale === "minor" ? "major" : "minor"
    });
    btnMode.addEventListener("click", () => this.toggleMode());
    const btnRelative = actions.createEl("button", {
      cls: "key-btn-relative",
      text: "Relative"
    });
    btnRelative.addEventListener("click", () => this.jumpToRelative());
    const confirmRow = root.createDiv({ cls: "key-confirm-row" });
    const confirmCb = confirmRow.createEl("input", { type: "checkbox" });
    confirmCb.checked = this.state.confirmed;
    confirmCb.addEventListener("change", () => {
      this.state.confirmed = confirmCb.checked;
      this.refreshConfirmedState(root);
      this.callbacks.onConfirmed?.(this.state.confirmed);
    });
    confirmRow.createSpan({ text: " Key confirmed" });
    this.refreshConfirmedState(root);
    return root;
  }
  renderValue(container) {
    container.empty();
    const displayKey = this.formatKeyDisplay(this.state.key, this.state.scale);
    const el = container.createSpan({ cls: "key-value", text: displayKey });
    el.addEventListener("click", () => this.startInlineEdit(el));
  }
  renderRelative(root) {
    const existing = root.querySelector(".key-relative-row");
    if (existing) existing.remove();
    const relative = this.computeRelative();
    if (!relative) return;
    const row = root.createDiv({ cls: "key-relative-row" });
    const actions = root.querySelector(".key-actions");
    if (actions) root.insertBefore(row, actions);
    else root.appendChild(row);
    row.createSpan({ cls: "key-relative", text: `Relative: ${relative}` });
  }
  formatKeyDisplay(key, scale) {
    return scale === "minor" ? `${key}m` : key;
  }
  parseKeyDisplay(display) {
    if (display.endsWith("m")) {
      return { key: display.slice(0, -1), scale: "minor" };
    }
    return { key: display, scale: "major" };
  }
  startInlineEdit(el) {
    const input = document.createElement("input");
    input.value = this.formatKeyDisplay(this.state.key, this.state.scale);
    input.className = "key-input";
    el.replaceWith(input);
    input.focus();
    input.select();
    const commit = () => {
      const parsed = this.parseKeyDisplay(input.value.trim());
      if (CHROMATIC.includes(parsed.key)) {
        this.state.key = parsed.key;
        this.state.scale = parsed.scale;
        this.refresh();
        this.callbacks.onChange?.(this.state.key, this.state.scale);
      }
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        commit();
        input.blur();
      }
      if (e.key === "Escape") this.refresh();
    });
  }
  shiftSemitone(delta) {
    const idx = CHROMATIC.indexOf(this.state.key);
    if (idx === -1) return;
    const newIdx = (idx + delta + 12) % 12;
    this.state.key = CHROMATIC[newIdx];
    this.refresh();
    this.callbacks.onChange?.(this.state.key, this.state.scale);
  }
  toggleMode() {
    this.state.scale = this.state.scale === "minor" ? "major" : "minor";
    this.refresh();
    this.callbacks.onChange?.(this.state.key, this.state.scale);
  }
  jumpToRelative() {
    const relative = this.computeRelative(true);
    if (relative) {
      const parsed = this.parseKeyDisplay(relative);
      this.state.key = parsed.key;
      this.state.scale = parsed.scale;
      this.refresh();
      this.callbacks.onChange?.(this.state.key, this.state.scale);
    }
  }
  computeRelative(forJump = false) {
    const display = this.formatKeyDisplay(this.state.key, this.state.scale);
    if (this.state.scale === "minor") {
      const rel = RELATIVE_MAJOR[display];
      return rel || void 0;
    } else {
      const rel = RELATIVE_MINOR[display];
      return rel || void 0;
    }
  }
  refresh() {
    const valRow = this.container.querySelector(".key-value-row");
    if (valRow) this.renderValue(valRow);
    this.renderRelative(this.container);
    const modeBtn = this.container.querySelector(".key-btn-mode-toggle");
    if (modeBtn) modeBtn.textContent = this.state.scale === "minor" ? "major" : "minor";
  }
  refreshConfirmedState(root) {
    root.classList.toggle("key-confirmed", this.state.confirmed);
    root.classList.toggle("key-unconfirmed", !this.state.confirmed);
  }
  getState() {
    return { ...this.state };
  }
  mount(parent) {
    parent.appendChild(this.container);
  }
  destroy() {
    this.container.remove();
  }
};

// src/components/confirm-modal.ts
var AnalysisConfirmModal = class extends import_obsidian.Modal {
  constructor(app, data, callbacks) {
    super(app);
    this.data = data;
    this.callbacks = callbacks;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.addClass("mam-confirm-modal");
    const header = contentEl.createDiv({ cls: "mam-modal-header" });
    header.createEl("h2", { text: `Confirm analysis: ${this.data.fileName}` });
    header.createEl("p", {
      text: "Tap or edit values below. Mark confirmed only when they match your ears.",
      cls: "setting-item-description"
    });
    const body = contentEl.createDiv({ cls: "mam-modal-body" });
    const bpmSection = body.createDiv({ cls: "mam-modal-section" });
    bpmSection.createEl("h3", { cls: "mam-modal-section-label", text: "Tempo" });
    this.bpmControl = new BpmControl(bpmSection, this.data.bpm, {
      onChange: (bpm) => {
      },
      onConfirmed: () => {
      }
    });
    const keySection = body.createDiv({ cls: "mam-modal-section" });
    keySection.createEl("h3", { cls: "mam-modal-section-label", text: "Key" });
    this.keyControl = new KeyControl(keySection, this.data.key, {
      onChange: (key, scale) => {
      }
    });
    const footer = contentEl.createDiv({ cls: "mam-modal-footer" });
    const btnSave = footer.createEl("button", { cls: "mam-btn-save mod-cta", text: "Save" });
    btnSave.addEventListener("click", () => {
      if (this.bpmControl && this.keyControl) {
        this.callbacks.onSave({
          bpm: this.bpmControl.getState(),
          key: this.keyControl.getState()
        });
      }
      this.close();
    });
    const btnCancel = footer.createEl("button", { cls: "mam-btn-cancel", text: "Cancel" });
    btnCancel.addEventListener("click", () => {
      this.callbacks.onCancel?.();
      this.close();
    });
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
};

// src/components/structure-timeline.ts
var StructureTimeline = class {
  constructor(parent, segments, bpm, offsetBars = 0) {
    this.trackEl = null;
    this.tooltipEl = null;
    this.container = parent.createDiv({ cls: "mam-timeline" });
    this.segments = segments;
    this.bpm = bpm;
    this.offsetBars = offsetBars;
  }
  mount() {
    this.container.empty();
    if (this.segments.length === 0) {
      this.container.createDiv({
        cls: "mam-timeline-empty",
        text: "No structure defined. Add segments to frontmatter: structure: [...]"
      });
      this.buildOffsetRow();
      return;
    }
    const totalBars = Math.max(...this.segments.map((s) => s.endBar));
    const effectiveTotal = totalBars + this.offsetBars;
    this.trackEl = this.container.createDiv({ cls: "mam-timeline-track" });
    this.segments.forEach((seg) => {
      const leftPct = (seg.startBar + this.offsetBars) / effectiveTotal * 100;
      const widthPct = (seg.endBar - seg.startBar) / effectiveTotal * 100;
      const bar = this.trackEl.createDiv({ cls: "mam-timeline-segment" });
      bar.style.left = `${leftPct}%`;
      bar.style.width = `${widthPct}%`;
      bar.style.backgroundColor = seg.color;
      bar.style.setProperty("--mam-segment-color", seg.color);
      bar.createSpan({
        cls: "mam-timeline-segment-label",
        text: seg.label
      });
      bar.addEventListener("mouseenter", () => this.showTooltip(seg, bar));
      bar.addEventListener("mouseleave", () => this.hideTooltip());
    });
    this.buildOffsetRow();
  }
  buildOffsetRow() {
    const row = this.container.createDiv({ cls: "mam-timeline-offset-row" });
    row.createSpan({
      cls: "mam-timeline-offset-label",
      text: `Trim lead-in: ${this.offsetBars} bar${this.offsetBars === 1 ? "" : "s"}`
    });
    const slider = row.createEl("input", { type: "range" });
    slider.className = "mam-timeline-slider";
    slider.min = "0";
    slider.max = String(Math.ceil(this.offsetBars + 4));
    slider.value = String(this.offsetBars);
    slider.step = "1";
    slider.addEventListener("input", () => {
      const val = parseInt(slider.value, 10);
      this.offsetBars = val;
      const label = row.querySelector(".mam-timeline-offset-label");
      if (label) {
        label.textContent = `Trim lead-in: ${val} bar${val === 1 ? "" : "s"}`;
      }
      this.onOffsetChange?.(val);
      this.mount();
    });
  }
  showTooltip(seg, anchor) {
    if (!this.trackEl) return;
    this.tooltipEl = this.trackEl.createDiv({ cls: "mam-timeline-tooltip" });
    const beatLen = 60 / this.bpm;
    const startTime = seg.startBar * 4 * beatLen;
    const startStr = this.formatTime(startTime);
    const endTime = seg.endBar * 4 * beatLen;
    const endStr = this.formatTime(endTime);
    this.tooltipEl.innerHTML = `
      <strong>${seg.label}</strong><br/>
      Bars ${seg.startBar} \u2013 ${seg.endBar}<br/>
      ${startStr} \u2013 ${endStr}
    `;
    const trackRect = this.trackEl.getBoundingClientRect();
    const barRect = anchor.getBoundingClientRect();
    const left = barRect.left - trackRect.left + barRect.width / 2 - 60;
    const top = -40;
    this.tooltipEl.style.left = `${left}px`;
    this.tooltipEl.style.top = `${top}px`;
  }
  hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
  }
  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor(sec % 1 * 100);
    return `${m}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  }
  destroy() {
    this.container.remove();
  }
};

// src/components/tuner-needle.ts
var CHROMATIC_ORDER = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B"
];
var TunerNeedle = class {
  constructor(parent, initial) {
    this.needleEl = null;
    this.state = { ...initial };
    this.container = parent.createDiv({ cls: "mam-tuner" });
  }
  mount() {
    this.container.empty();
    const dial = this.container.createDiv({ cls: "mam-tuner-dial" });
    CHROMATIC_ORDER.forEach((note, i) => {
      const angle = i / 12 * 360;
      const tick = dial.createDiv({ cls: "mam-tuner-tick" });
      tick.setAttribute("data-note", note);
      tick.style.transform = `rotate(${angle}deg) translateY(-45px)`;
    });
    this.needleEl = dial.createDiv({
      cls: `mam-tuner-needle ${this.state.confirmed ? "mam-tuner-needle-confirmed" : "mam-tuner-needle-unconfirmed"}`
    });
    this.setNeedleAngle(this.state.key);
    const label = this.container.createDiv({
      cls: `mam-tuner-label ${this.state.confirmed ? "mam-tuner-label-confirmed" : "mam-tuner-label-unconfirmed"}`,
      text: this.formatKeyDisplay()
    });
  }
  update(state) {
    this.state = { ...state };
    this.setNeedleAngle(this.state.key);
    if (this.needleEl) {
      this.needleEl.className = `mam-tuner-needle ${this.state.confirmed ? "mam-tuner-needle-confirmed" : "mam-tuner-needle-unconfirmed"}`;
    }
    const label = this.container.querySelector(".mam-tuner-label");
    if (label) {
      label.className = `mam-tuner-label ${this.state.confirmed ? "mam-tuner-label-confirmed" : "mam-tuner-label-unconfirmed"}`;
      label.textContent = this.formatKeyDisplay();
    }
  }
  setNeedleAngle(key) {
    const idx = CHROMATIC_ORDER.indexOf(key);
    if (idx === -1) return;
    const angle = idx / 12 * 360;
    if (this.needleEl) {
      this.needleEl.style.transform = `rotate(${angle}deg)`;
    }
  }
  formatKeyDisplay() {
    return this.state.scale === "minor" ? `${this.state.key}m` : this.state.key;
  }
  destroy() {
    this.container.remove();
  }
};

// src/components/camelot-wheel.ts
var MAJOR_KEYS = [
  "1B",
  "2B",
  "3B",
  "4B",
  "5B",
  "6B",
  "7B",
  "8B",
  "9B",
  "10B",
  "11B",
  "12B"
];
var MINOR_KEYS = [
  "1A",
  "2A",
  "3A",
  "4A",
  "5A",
  "6A",
  "7A",
  "8A",
  "9A",
  "10A",
  "11A",
  "12A"
];
var SHARP_TO_NAME = {
  C: "C",
  "C#": "Csharp",
  Db: "Db",
  D: "D",
  "D#": "Dsharp",
  Eb: "Eb",
  E: "E",
  F: "F",
  "F#": "Fsharp",
  Gb: "Gb",
  G: "G",
  "G#": "Gsharp",
  Ab: "Ab",
  A: "A",
  "A#": "Asharp",
  Bb: "Bb",
  B: "B"
};
function keyNameToCamelot(key, scale) {
  const raw = key.endsWith("m") && key.length > 1 ? key.slice(0, -1) : key;
  const name = SHARP_TO_NAME[raw];
  if (!name) return void 0;
  const isMinor = scale === "minor";
  if (isMinor) {
    const minorMap = {
      Csharp: "12A",
      Db: "12A",
      Dsharp: "2A",
      Eb: "2A",
      Fsharp: "11A",
      Gb: "11A",
      Gsharp: "1A",
      Ab: "1A",
      Asharp: "3A",
      Bb: "3A",
      F: "4A",
      C: "5A",
      G: "6A",
      D: "7A",
      A: "8A",
      E: "9A",
      B: "10A"
    };
    return minorMap[name];
  }
  const majorMap = {
    B: "1B",
    Fsharp: "2B",
    Gb: "2B",
    Csharp: "3B",
    Db: "3B",
    Gsharp: "4B",
    Ab: "4B",
    Dsharp: "5B",
    Eb: "5B",
    Asharp: "6B",
    Bb: "6B",
    F: "7B",
    C: "8B",
    G: "9B",
    D: "10B",
    A: "11B",
    E: "12B"
  };
  return majorMap[name];
}
function camelotToKeyName(camelot) {
  const map2 = {
    "1B": { key: "B", scale: "major" },
    "2B": { key: "F# / Gb", scale: "major" },
    "3B": { key: "C# / Db", scale: "major" },
    "4B": { key: "G# / Ab", scale: "major" },
    "5B": { key: "D# / Eb", scale: "major" },
    "6B": { key: "A# / Bb", scale: "major" },
    "7B": { key: "F", scale: "major" },
    "8B": { key: "C", scale: "major" },
    "9B": { key: "G", scale: "major" },
    "10B": { key: "D", scale: "major" },
    "11B": { key: "A", scale: "major" },
    "12B": { key: "E", scale: "major" },
    "1A": { key: "G# / Abm", scale: "minor" },
    "2A": { key: "D# / Ebm", scale: "minor" },
    "3A": { key: "A# / Bbm", scale: "minor" },
    "4A": { key: "Fm", scale: "minor" },
    "5A": { key: "Cm", scale: "minor" },
    "6A": { key: "Gm", scale: "minor" },
    "7A": { key: "Dm", scale: "minor" },
    "8A": { key: "Am", scale: "minor" },
    "9A": { key: "Em", scale: "minor" },
    "10A": { key: "Bm", scale: "minor" },
    "11A": { key: "F# / Gbm", scale: "minor" },
    "12A": { key: "C# / Dbm", scale: "minor" }
  };
  return map2[camelot];
}
function getCompatibleKeys(current) {
  const num = parseInt(current.slice(0, -1), 10);
  const letter = current.slice(-1);
  const compatible = [];
  compatible.push(`${num}${letter === "A" ? "B" : "A"}`);
  const prev = num === 1 ? 12 : num - 1;
  const next = num === 12 ? 1 : num + 1;
  compatible.push(`${prev}${letter}`, `${next}${letter}`);
  compatible.push(`${prev}${letter === "A" ? "B" : "A"}`);
  compatible.push(`${next}${letter === "A" ? "B" : "A"}`);
  return compatible;
}
var CamelotWheel = class {
  constructor(parent, config) {
    this.config = config;
    this.container = parent.createDiv({ cls: "mam-camelot" });
  }
  mount() {
    this.container.empty();
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 260 260");
    svg.setAttribute("class", "mam-camelot-wheel");
    this.container.appendChild(svg);
    const cx = 130;
    const cy = 130;
    const outerR = 100;
    const innerR = 60;
    for (let i = 0; i < 12; i++) {
      const angle = i * 30 - 90;
      const angleRad = angle * Math.PI / 180;
      const majorKey = MAJOR_KEYS[i];
      const minorKey = MINOR_KEYS[i];
      this.renderKey(svg, cx, cy, outerR, angleRad, majorKey, "major");
      this.renderKey(svg, cx, cy, innerR, angleRad, minorKey, "minor");
    }
    const legend = this.container.createDiv({ cls: "mam-camelot-legend" });
    legend.createSpan({ cls: "mam-camelot-current", text: "\u25CF current " });
    legend.createSpan({ cls: "mam-camelot-compatible", text: "\u25E6 compatible " });
  }
  renderKey(svg, cx, cy, radius, angleRad, key, type) {
    const ns = "http://www.w3.org/2000/svg";
    const x = cx + radius * Math.cos(angleRad);
    const y = cy + radius * Math.sin(angleRad);
    const g = document.createElementNS(ns, "g");
    g.setAttribute("class", `mam-camelot-key mam-camelot-key-${type}`);
    g.setAttribute("data-camelot", key);
    const compatible = this.config.current ? getCompatibleKeys(this.config.current) : [];
    if (this.config.current === key) {
      g.classList.add("mam-camelot-current");
    } else if (compatible.includes(key)) {
      g.classList.add("mam-camelot-compatible");
    }
    const text = document.createElementNS(ns, "text");
    text.setAttribute("class", "mam-camelot-label");
    text.setAttribute("x", String(x));
    text.setAttribute("y", String(y));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = key;
    g.appendChild(text);
    svg.appendChild(g);
    g.addEventListener("click", () => {
      const match = camelotToKeyName(key);
      if (!match) return;
      const dvKey = match.key.split(" / ")[0];
      const dvQuery = `\`\`\`dataview
LIST
FROM #music
WHERE key = "${dvKey}"
SORT tempo ASC
\`\`\``;
      this.config.onKeyClick(key, dvQuery);
    });
  }
  destroy() {
    this.container.remove();
  }
};

// src/components/dashboard-processor.ts
var MusicDashboardProcessor = class {
  constructor(vaultActions) {
    this.vaultActions = vaultActions;
  }
  async process(source, el, ctx) {
    const container = el.createDiv({ cls: "mam-dashboard" });
    const filePath = ctx.sourcePath;
    let fm;
    try {
      const raw = await this.vaultActions.readFile(filePath);
      fm = this.parseFrontmatter(raw, filePath);
    } catch {
      container.createEl("p", {
        cls: "mam-dashboard-empty",
        text: "No music analysis data found in this note. Run \u201CAnalyze audio\u201D first."
      });
      return;
    }
    const header = container.createDiv({ cls: "mam-dashboard-header" });
    header.createEl("h3", { text: fm.sourceFile.split("/").pop() || "Untitled" });
    if (fm.duration) {
      header.createSpan({ cls: "mam-dashboard-duration", text: fm.duration });
    }
    const meta = container.createDiv({ cls: "mam-dashboard-meta" });
    const bpmEl = meta.createSpan({
      cls: fm.tempo_confirmed ? "mam-meta-confirmed" : "mam-meta-unconfirmed"
    });
    bpmEl.setText(`${fm.tempo} BPM`);
    if (fm.alternate_tempo) {
      bpmEl.setText(`${fm.tempo} BPM (or ${fm.alternate_tempo}?)`);
    }
    meta.createSpan({ text: " \u2022 " });
    const keyEl = meta.createSpan({
      cls: fm.key_confirmed ? "mam-meta-confirmed" : "mam-meta-unconfirmed"
    });
    keyEl.setText(fm.key);
    const controlsSection = container.createDiv({ cls: "mam-dashboard-section" });
    controlsSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Controls" });
    const controlsArea = controlsSection.createDiv({ cls: "mam-dashboard-controls" });
    const isMinor = fm.key.endsWith("m");
    const baseKey = isMinor ? fm.key.slice(0, -1) : fm.key;
    const bpmState = {
      bpm: fm.tempo,
      rawBpm: fm.raw_tempo ?? fm.tempo,
      alternateBpm: fm.alternate_tempo,
      confirmed: fm.tempo_confirmed
    };
    const keyState = {
      key: baseKey,
      scale: isMinor ? "minor" : "major",
      relativeKey: void 0,
      confirmed: fm.key_confirmed
    };
    const saveToFm = async (partial) => {
      try {
        const raw = await this.vaultActions.readFile(filePath);
        const updated = injectFrontmatter(raw, partial);
        await this.vaultActions.modifyFile(filePath, updated);
      } catch (e) {
        console.warn("[MAM] Dashboard save failed:", e);
      }
    };
    const bpmControl = new BpmControl(controlsArea, bpmState, {
      onChange: async (bpm) => {
        await saveToFm({ tempo: bpm, tempo_confirmed: true });
      },
      onConfirmed: async (confirmed) => {
        await saveToFm({ tempo_confirmed: confirmed });
      }
    });
    bpmControl.mount(controlsArea);
    const keyControl = new KeyControl(controlsArea, keyState, {
      onChange: async (key, scale) => {
        const display = scale === "minor" ? `${key}m` : key;
        await saveToFm({ key: display, key_confirmed: true });
      },
      onConfirmed: async (confirmed) => {
        await saveToFm({ key_confirmed: confirmed });
      }
    });
    keyControl.mount(controlsArea);
    const timelineSection = container.createDiv({ cls: "mam-dashboard-section" });
    timelineSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Structure" });
    const segments = (fm.structure || []).map((s) => ({
      id: s.segment,
      label: s.segment,
      startBar: s.bars[0],
      endBar: s.bars[1],
      color: this.colorForSegment(s.segment)
    }));
    const timeline = new StructureTimeline(
      timelineSection,
      segments,
      fm.tempo,
      fm.audio_start_offset ?? 0
    );
    timeline.onOffsetChange = async (offset) => {
      await saveToFm({ audio_start_offset: offset });
    };
    timeline.mount();
    const tunerSection = container.createDiv({ cls: "mam-dashboard-section" });
    tunerSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Tuner" });
    const tunerContainer = tunerSection.createDiv({ cls: "mam-dashboard-tuner" });
    const tuner = new TunerNeedle(tunerContainer, {
      key: baseKey,
      scale: isMinor ? "minor" : "major",
      confirmed: fm.key_confirmed
    });
    tuner.mount();
    const camelotSection = container.createDiv({ cls: "mam-dashboard-section" });
    camelotSection.createEl("h4", { cls: "mam-dashboard-section-label", text: "Camelot" });
    const camelotContainer = camelotSection.createDiv({ cls: "mam-dashboard-camelot" });
    const camelot = new CamelotWheel(camelotContainer, {
      current: keyNameToCamelot(baseKey, isMinor ? "minor" : "major"),
      onKeyClick: (_camelotKey, dvQuery) => this.handleCamelotClick(dvQuery)
    });
    camelot.mount();
  }
  parseFrontmatter(raw, sourcePath) {
    const fm = parseFrontmatter(raw);
    if (!fm.tempo && !fm.key) {
      throw new Error("No analysis data in frontmatter");
    }
    let structure = void 0;
    if (Array.isArray(fm.structure)) {
      structure = fm.structure;
    }
    return {
      sourceFile: sourcePath,
      tempo: Number(fm.tempo ?? 0),
      raw_tempo: fm.raw_tempo ? Number(fm.raw_tempo) : void 0,
      alternate_tempo: fm.alternate_tempo ? Number(fm.alternate_tempo) : void 0,
      tempo_confirmed: !!fm.tempo_confirmed,
      key: String(fm.key ?? ""),
      key_confirmed: !!fm.key_confirmed,
      duration: fm.duration ? String(fm.duration) : void 0,
      audio_start_offset: Number(fm.audio_start_offset ?? 0),
      structure
    };
  }
  colorForSegment(name) {
    const colors = {
      Intro: "var(--color-accent)",
      Verse: "var(--interactive-accent)",
      Chorus: "var(--color-green)",
      Bridge: "var(--color-yellow)",
      "Pre-chorus": "var(--color-orange)",
      Hook: "var(--color-red)",
      Outro: "var(--color-purple)",
      Breakdown: "var(--color-cyan)"
    };
    return colors[name] || "var(--text-muted)";
  }
  handleCamelotClick(dvQuery) {
    navigator.clipboard?.writeText(dvQuery).catch(() => {
    });
    console.log("[MAM] Camelot key clicked \u2014 Dataview query copied to clipboard");
  }
};

// src/main.ts
var analysisCache = /* @__PURE__ */ new Map();
var MusicAnalysisPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.worker = null;
  }
  async onload() {
    console.log("[MusicAnalysis] Slice 3 loaded");
    this.addCommand({
      id: "analyze-audio",
      name: "Analyze audio (tempo, key, duration)",
      callback: () => this.runAnalysis()
    });
    this.addCommand({
      id: "confirm-analysis",
      name: "Confirm analysis (open correction modal)",
      callback: () => this.openConfirmModal()
    });
    const dashboardProcessor = new MusicDashboardProcessor({
      readFile: async (path) => {
        const f = this.app.vault.getFileByPath(path);
        if (!f) throw new Error("File not found: " + path);
        return await this.app.vault.read(f);
      },
      modifyFile: async (path, content) => {
        const f = this.app.vault.getFileByPath(path);
        if (!f) throw new Error("File not found: " + path);
        await this.app.vault.modify(f, content);
      },
      getFileByPath: (path) => {
        const f = this.app.vault.getFileByPath(path);
        return f ? { path: f.path } : null;
      }
    });
    this.registerMarkdownCodeBlockProcessor(
      "music-dashboard",
      (source, el, ctx) => dashboardProcessor.process(source, el, ctx)
    );
    this.registerEvent(
      this.app.workspace.on(
        "file-menu",
        (menu, file) => {
          if (!(file instanceof import_obsidian2.TFile)) return;
          if (!this.isAudioFile(file)) return;
          menu.addItem(
            (item) => item.setTitle("Analyze audio").setIcon("music").onClick(() => this.runAnalysisForFile(file))
          );
        }
      )
    );
  }
  onunload() {
    this.worker?.terminate();
    this.worker = null;
  }
  async runAnalysis() {
    const file = this.app.workspace.getActiveFile();
    if (!file || !this.isAudioFile(file)) {
      new import_obsidian2.Notice("Select an audio file (mp3/wav/flac)");
      return;
    }
    await this.runAnalysisForFile(file);
  }
  /**
   * Core analysis for a specific audio file.
   * Creates / updates the companion .md note and opens it.
   */
  async runAnalysisForFile(file) {
    try {
      const arrayBuf = await this.app.vault.readBinary(file);
      const hash = await sha256(arrayBuf);
      const notePath = `${file.path}.md`;
      const cachedNoteFile = this.app.vault.getAbstractFileByPath(notePath);
      const cacheKey = cachedNoteFile ? notePath : file.path;
      const cached = analysisCache.get(cacheKey);
      if (cached && cached.hash === hash) {
        new import_obsidian2.Notice(`Cache hit: ${cached.result.tempo} BPM, ${cached.result.key}`);
        await this.writeNote(notePath, cached.result, file.name);
        await this.openNote(notePath);
        return;
      }
      new import_obsidian2.Notice("Analyzing audio...");
      const result = await this.analyzeInWorker(arrayBuf, file.name);
      if (result.error) {
        new import_obsidian2.Notice(`Analysis failed: ${result.error}`);
        return;
      }
      analysisCache.set(cacheKey, { hash, result, timestamp: Date.now() });
      new import_obsidian2.Notice(
        `Done: ${result.tempo} BPM${result.alternateTempo ? " (or " + result.alternateTempo + "?)" : ""}, ${result.key}`
      );
      await this.writeNote(notePath, result, file.name);
      await this.openNote(notePath);
    } catch (err) {
      const message = err?.message || String(err);
      console.error("[MusicAnalysis] runAnalysisForFile error:", err);
      new import_obsidian2.Notice(`Analysis error: ${message}`);
    }
  }
  async openNote(notePath) {
    const noteFile = this.app.vault.getFileByPath(notePath);
    if (!noteFile) {
      console.warn("[MAM] Could not open note \u2014 file not found:", notePath);
      return;
    }
    const leaf = this.app.workspace.getLeaf();
    await leaf.openFile(noteFile);
  }
  /**
   * Open the confirm modal for the currently open analysis note.
   * Parses existing frontmatter and lets the user edit tempo/key.
   */
  openConfirmModal() {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView);
    if (!view) {
      new import_obsidian2.Notice("Open an analysis note first");
      return;
    }
    const file = view.file;
    if (!file) {
      new import_obsidian2.Notice("No file open");
      return;
    }
    const cache = this.app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter || {};
    if (!fm.tempo && !fm.key) {
      new import_obsidian2.Notice("No analysis data found in this note");
      return;
    }
    const bpmState = {
      bpm: fm.tempo ?? 0,
      rawBpm: fm.raw_tempo ?? fm.tempo ?? 0,
      alternateBpm: fm.alternate_tempo,
      confirmed: fm.tempo_confirmed ?? false
    };
    const keyParts = String(fm.key || "").split(" / ");
    const keyName = keyParts[0] || "";
    const isMinor = keyName.endsWith("m");
    const baseKey = isMinor ? keyName.slice(0, -1) : keyName;
    const keyState = {
      key: baseKey,
      scale: isMinor ? "minor" : "major",
      relativeKey: keyParts[1],
      confirmed: fm.key_confirmed ?? false
    };
    new AnalysisConfirmModal(
      this.app,
      {
        fileName: file.basename,
        bpm: bpmState,
        key: keyState
      },
      {
        onSave: async (data) => {
          const keyDisplay = data.key.scale === "minor" ? `${data.key.key}m` : data.key.key;
          const updated = injectFrontmatter(await this.app.vault.read(file), {
            tempo: data.bpm.bpm,
            raw_tempo: data.bpm.rawBpm,
            alternate_tempo: data.bpm.alternateBpm,
            tempo_confirmed: data.bpm.confirmed,
            key: keyDisplay,
            key_confirmed: data.key.confirmed
          });
          await this.app.vault.modify(file, updated);
          new import_obsidian2.Notice("Analysis updated");
        }
      }
    ).open();
  }
  isAudioFile(file) {
    return /^(mp3|wav|flac|aif|ogg|m4a)$/i.test(file.extension);
  }
  async analyzeInWorker(audioBuffer, fileName) {
    if (!this.worker) {
      const workerPath = `${this.manifest.dir}/dist/worker.js`;
      const workerSource = await this.app.vault.adapter.read(workerPath);
      const blob = new Blob([workerSource], { type: "application/javascript" });
      const blobUrl = URL.createObjectURL(blob);
      try {
        this.worker = new Worker(blobUrl);
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    }
    return new Promise((resolve, reject) => {
      const id = `${fileName}-${Date.now()}`;
      const handler = (e) => {
        if (e.data.id !== id) return;
        this.worker.removeEventListener("message", handler);
        if (e.data.type === "error") reject(new Error(e.data.error));
        else resolve(e.data.result);
      };
      this.worker.addEventListener("message", handler);
      this.worker.postMessage({ id, type: "analyze", audioBuffer });
    });
  }
  async writeNote(path, result, sourceFile) {
    const durationStr = this.formatDuration(result.duration);
    const keyDisplay = result.relativeKey ? `${result.key} / ${result.relativeKey}` : result.key;
    const body = "\n```music-dashboard\n```\n";
    const content = injectFrontmatter(body, {
      audio_source: sourceFile,
      key: keyDisplay,
      key_confirmed: false,
      tempo: result.tempo,
      raw_tempo: result.rawTempo,
      alternate_tempo: result.alternateTempo,
      tempo_confirmed: false,
      duration: durationStr
    });
    const existing = this.app.vault.getFileByPath(path);
    if (existing) {
      await this.app.vault.modify(existing, content);
    } else {
      await this.app.vault.create(path, content);
    }
  }
  formatDuration(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL21haW4udHMiLCAiLi4vc3JjL3NoYTI1Ni50cyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvbm9kZXMvaWRlbnRpdHkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3Zpc2l0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9kb2MvZGlyZWN0aXZlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvZG9jL2FuY2hvcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2RvYy9hcHBseVJldml2ZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L25vZGVzL3RvSlMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L25vZGVzL05vZGUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L25vZGVzL0FsaWFzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9ub2Rlcy9TY2FsYXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2RvYy9jcmVhdGVOb2RlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9ub2Rlcy9Db2xsZWN0aW9uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zdHJpbmdpZnkvc3RyaW5naWZ5Q29tbWVudC5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc3RyaW5naWZ5L2ZvbGRGbG93TGluZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9zdHJpbmdpZnlTdHJpbmcuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9zdHJpbmdpZnkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9zdHJpbmdpZnlQYWlyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9sb2cuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS95YW1sLTEuMS9tZXJnZS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvbm9kZXMvYWRkUGFpclRvSlNNYXAuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L25vZGVzL1BhaXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9zdHJpbmdpZnlDb2xsZWN0aW9uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9ub2Rlcy9ZQU1MTWFwLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvY29tbW9uL21hcC5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvbm9kZXMvWUFNTFNlcS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL2NvbW1vbi9zZXEuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS9jb21tb24vc3RyaW5nLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvY29tbW9uL251bGwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS9jb3JlL2Jvb2wuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9zdHJpbmdpZnlOdW1iZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS9jb3JlL2Zsb2F0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvY29yZS9pbnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS9jb3JlL3NjaGVtYS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL2pzb24vc2NoZW1hLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvYmluYXJ5LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvcGFpcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS95YW1sLTEuMS9vbWFwLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvYm9vbC5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL3lhbWwtMS4xL2Zsb2F0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvaW50LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvc2V0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvdGltZXN0YW1wLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvc2NoZW1hLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvdGFncy5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL1NjaGVtYS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc3RyaW5naWZ5L3N0cmluZ2lmeURvY3VtZW50LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9kb2MvRG9jdW1lbnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2Vycm9ycy5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9yZXNvbHZlLXByb3BzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3V0aWwtY29udGFpbnMtbmV3bGluZS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS91dGlsLWZsb3ctaW5kZW50LWNoZWNrLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3V0aWwtbWFwLWluY2x1ZGVzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3Jlc29sdmUtYmxvY2stbWFwLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3Jlc29sdmUtYmxvY2stc2VxLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3Jlc29sdmUtZW5kLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3Jlc29sdmUtZmxvdy1jb2xsZWN0aW9uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL2NvbXBvc2UtY29sbGVjdGlvbi5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9yZXNvbHZlLWJsb2NrLXNjYWxhci5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9yZXNvbHZlLWZsb3ctc2NhbGFyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL2NvbXBvc2Utc2NhbGFyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3V0aWwtZW1wdHktc2NhbGFyLXBvc2l0aW9uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL2NvbXBvc2Utbm9kZS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9jb21wb3NlLWRvYy5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9jb21wb3Nlci5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvcGFyc2UvY3N0LXZpc2l0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9wYXJzZS9jc3QuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3BhcnNlL2xleGVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9wYXJzZS9saW5lLWNvdW50ZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3BhcnNlL3BhcnNlci5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvcHVibGljLWFwaS5qcyIsICIuLi9zcmMveWFtbC1pbmplY3Rvci50cyIsICIuLi9zcmMvY29tcG9uZW50cy9jb25maXJtLW1vZGFsLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3RhcC10ZW1wby50cyIsICIuLi9zcmMvY29tcG9uZW50cy9icG0tY29udHJvbC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9rZXktY29udHJvbC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9zdHJ1Y3R1cmUtdGltZWxpbmUudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvdHVuZXItbmVlZGxlLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2NhbWVsb3Qtd2hlZWwudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvZGFzaGJvYXJkLXByb2Nlc3Nvci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gbWFpbi50cyBcdTIwMTQgT2JzaWRpYW4gcGx1Z2luIGVudHJ5IHBvaW50IChTbGljZSAyOiBjb25maXJtLWZpcnN0IFVYKVxuaW1wb3J0IHsgUGx1Z2luLCBOb3RpY2UsIFRGaWxlLCBUQWJzdHJhY3RGaWxlLCBNYXJrZG93blZpZXcsIE1lbnUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IHNoYTI1NiB9IGZyb20gXCIuL3NoYTI1NlwiO1xuaW1wb3J0IHsgaW5qZWN0RnJvbnRtYXR0ZXIgfSBmcm9tIFwiLi95YW1sLWluamVjdG9yXCI7XG5pbXBvcnQgeyBBbmFseXNpc1Jlc3VsdCB9IGZyb20gXCIuL2FuYWx5c2lzLWVuZ2luZVwiO1xuaW1wb3J0IHsgQW5hbHlzaXNDb25maXJtTW9kYWwgfSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbmZpcm0tbW9kYWxcIjtcbmltcG9ydCB7IEJwbUNvbnRyb2xTdGF0ZSB9IGZyb20gXCIuL2NvbXBvbmVudHMvYnBtLWNvbnRyb2xcIjtcbmltcG9ydCB7IEtleUNvbnRyb2xTdGF0ZSB9IGZyb20gXCIuL2NvbXBvbmVudHMva2V5LWNvbnRyb2xcIjtcbmltcG9ydCB7IE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yIH0gZnJvbSBcIi4vY29tcG9uZW50cy9kYXNoYm9hcmQtcHJvY2Vzc29yXCI7XG5cbmludGVyZmFjZSBBbmFseXNpc0NhY2hlRW50cnkge1xuICBoYXNoOiBzdHJpbmc7XG4gIHJlc3VsdDogQW5hbHlzaXNSZXN1bHQ7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xufVxuXG4vLyBJbi1tZW1vcnkgY2FjaGUgZm9yIGN1cnJlbnQgc2Vzc2lvbiAodmF1bHQtYm91bmQpXG5jb25zdCBhbmFseXNpc0NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIEFuYWx5c2lzQ2FjaGVFbnRyeT4oKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVzaWNBbmFseXNpc1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIHByaXZhdGUgd29ya2VyOiBXb3JrZXIgfCBudWxsID0gbnVsbDtcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgY29uc29sZS5sb2coXCJbTXVzaWNBbmFseXNpc10gU2xpY2UgMyBsb2FkZWRcIik7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiYW5hbHl6ZS1hdWRpb1wiLFxuICAgICAgbmFtZTogXCJBbmFseXplIGF1ZGlvICh0ZW1wbywga2V5LCBkdXJhdGlvbilcIixcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnJ1bkFuYWx5c2lzKCksXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiY29uZmlybS1hbmFseXNpc1wiLFxuICAgICAgbmFtZTogXCJDb25maXJtIGFuYWx5c2lzIChvcGVuIGNvcnJlY3Rpb24gbW9kYWwpXCIsXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuQ29uZmlybU1vZGFsKCksXG4gICAgfSk7XG5cbiAgICAvLyBSZWdpc3RlciBgbXVzaWMtZGFzaGJvYXJkYCBjb2RlLWJsb2NrIHJlbmRlcmVyXG4gICAgY29uc3QgZGFzaGJvYXJkUHJvY2Vzc29yID0gbmV3IE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yKHtcbiAgICAgIHJlYWRGaWxlOiBhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgICBpZiAoIWYpIHRocm93IG5ldyBFcnJvcihcIkZpbGUgbm90IGZvdW5kOiBcIiArIHBhdGgpO1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmKTtcbiAgICAgIH0sXG4gICAgICBtb2RpZnlGaWxlOiBhc3luYyAocGF0aDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVCeVBhdGgocGF0aCk7XG4gICAgICAgIGlmICghZikgdGhyb3cgbmV3IEVycm9yKFwiRmlsZSBub3QgZm91bmQ6IFwiICsgcGF0aCk7XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmLCBjb250ZW50KTtcbiAgICAgIH0sXG4gICAgICBnZXRGaWxlQnlQYXRoOiAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgICByZXR1cm4gZiA/IHsgcGF0aDogZi5wYXRoIH0gOiBudWxsO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJNYXJrZG93bkNvZGVCbG9ja1Byb2Nlc3NvcihcbiAgICAgIFwibXVzaWMtZGFzaGJvYXJkXCIsXG4gICAgICAoc291cmNlLCBlbCwgY3R4KSA9PiBkYXNoYm9hcmRQcm9jZXNzb3IucHJvY2Vzcyhzb3VyY2UsIGVsLCBjdHgpXG4gICAgKTtcblxuICAgIC8vIFJpZ2h0LWNsaWNrIG9uIGF1ZGlvIGZpbGVzIGluIGZpbGUgZXhwbG9yZXIgXHUyMTkyIFwiQW5hbHl6ZSBhdWRpb1wiXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFxuICAgICAgICBcImZpbGUtbWVudVwiLFxuICAgICAgICAobWVudTogTWVudSwgZmlsZTogVEFic3RyYWN0RmlsZSkgPT4ge1xuICAgICAgICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHJldHVybjtcbiAgICAgICAgICBpZiAoIXRoaXMuaXNBdWRpb0ZpbGUoZmlsZSkpIHJldHVybjtcblxuICAgICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT5cbiAgICAgICAgICAgIGl0ZW1cbiAgICAgICAgICAgICAgLnNldFRpdGxlKFwiQW5hbHl6ZSBhdWRpb1wiKVxuICAgICAgICAgICAgICAuc2V0SWNvbihcIm11c2ljXCIpXG4gICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHRoaXMucnVuQW5hbHlzaXNGb3JGaWxlKGZpbGUpKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgb251bmxvYWQoKSB7XG4gICAgdGhpcy53b3JrZXI/LnRlcm1pbmF0ZSgpO1xuICAgIHRoaXMud29ya2VyID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcnVuQW5hbHlzaXMoKSB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlIHx8ICF0aGlzLmlzQXVkaW9GaWxlKGZpbGUpKSB7XG4gICAgICBuZXcgTm90aWNlKFwiU2VsZWN0IGFuIGF1ZGlvIGZpbGUgKG1wMy93YXYvZmxhYylcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMucnVuQW5hbHlzaXNGb3JGaWxlKGZpbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcmUgYW5hbHlzaXMgZm9yIGEgc3BlY2lmaWMgYXVkaW8gZmlsZS5cbiAgICogQ3JlYXRlcyAvIHVwZGF0ZXMgdGhlIGNvbXBhbmlvbiAubWQgbm90ZSBhbmQgb3BlbnMgaXQuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIHJ1bkFuYWx5c2lzRm9yRmlsZShmaWxlOiBURmlsZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBhcnJheUJ1ZiA9IGF3YWl0IHRoaXMuYXBwLnZhdWx0LnJlYWRCaW5hcnkoZmlsZSk7XG4gICAgICBjb25zdCBoYXNoID0gYXdhaXQgc2hhMjU2KGFycmF5QnVmKTtcblxuICAgICAgY29uc3Qgbm90ZVBhdGggPSBgJHtmaWxlLnBhdGh9Lm1kYDtcbiAgICAgIGNvbnN0IGNhY2hlZE5vdGVGaWxlID0gdGhpcy5hcHAudmF1bHQuZ2V0QWJzdHJhY3RGaWxlQnlQYXRoKG5vdGVQYXRoKTtcbiAgICAgIGNvbnN0IGNhY2hlS2V5ID0gY2FjaGVkTm90ZUZpbGUgPyBub3RlUGF0aCA6IGZpbGUucGF0aDtcblxuICAgICAgY29uc3QgY2FjaGVkID0gYW5hbHlzaXNDYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgICAgaWYgKGNhY2hlZCAmJiBjYWNoZWQuaGFzaCA9PT0gaGFzaCkge1xuICAgICAgICBuZXcgTm90aWNlKGBDYWNoZSBoaXQ6ICR7Y2FjaGVkLnJlc3VsdC50ZW1wb30gQlBNLCAke2NhY2hlZC5yZXN1bHQua2V5fWApO1xuICAgICAgICBhd2FpdCB0aGlzLndyaXRlTm90ZShub3RlUGF0aCwgY2FjaGVkLnJlc3VsdCwgZmlsZS5uYW1lKTtcbiAgICAgICAgYXdhaXQgdGhpcy5vcGVuTm90ZShub3RlUGF0aCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbmV3IE5vdGljZShcIkFuYWx5emluZyBhdWRpby4uLlwiKTtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5hbmFseXplSW5Xb3JrZXIoYXJyYXlCdWYsIGZpbGUubmFtZSk7XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICAgIG5ldyBOb3RpY2UoYEFuYWx5c2lzIGZhaWxlZDogJHtyZXN1bHQuZXJyb3J9YCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYW5hbHlzaXNDYWNoZS5zZXQoY2FjaGVLZXksIHsgaGFzaCwgcmVzdWx0LCB0aW1lc3RhbXA6IERhdGUubm93KCkgfSk7XG5cbiAgICAgIG5ldyBOb3RpY2UoXG4gICAgICAgIGBEb25lOiAke3Jlc3VsdC50ZW1wb30gQlBNJHtyZXN1bHQuYWx0ZXJuYXRlVGVtcG8gPyBcIiAob3IgXCIgKyByZXN1bHQuYWx0ZXJuYXRlVGVtcG8gKyBcIj8pXCIgOiBcIlwifSwgJHtyZXN1bHQua2V5fWBcbiAgICAgICk7XG4gICAgICBhd2FpdCB0aGlzLndyaXRlTm90ZShub3RlUGF0aCwgcmVzdWx0LCBmaWxlLm5hbWUpO1xuICAgICAgYXdhaXQgdGhpcy5vcGVuTm90ZShub3RlUGF0aCk7XG4gICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnI/Lm1lc3NhZ2UgfHwgU3RyaW5nKGVycik7XG4gICAgICBjb25zb2xlLmVycm9yKFwiW011c2ljQW5hbHlzaXNdIHJ1bkFuYWx5c2lzRm9yRmlsZSBlcnJvcjpcIiwgZXJyKTtcbiAgICAgIG5ldyBOb3RpY2UoYEFuYWx5c2lzIGVycm9yOiAke21lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBvcGVuTm90ZShub3RlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3Qgbm90ZUZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKG5vdGVQYXRoKTtcbiAgICBpZiAoIW5vdGVGaWxlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbTUFNXSBDb3VsZCBub3Qgb3BlbiBub3RlIFx1MjAxNCBmaWxlIG5vdCBmb3VuZDpcIiwgbm90ZVBhdGgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKG5vdGVGaWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVuIHRoZSBjb25maXJtIG1vZGFsIGZvciB0aGUgY3VycmVudGx5IG9wZW4gYW5hbHlzaXMgbm90ZS5cbiAgICogUGFyc2VzIGV4aXN0aW5nIGZyb250bWF0dGVyIGFuZCBsZXRzIHRoZSB1c2VyIGVkaXQgdGVtcG8va2V5LlxuICAgKi9cbiAgcHJpdmF0ZSBvcGVuQ29uZmlybU1vZGFsKCkge1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICghdmlldykge1xuICAgICAgbmV3IE5vdGljZShcIk9wZW4gYW4gYW5hbHlzaXMgbm90ZSBmaXJzdFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlID0gdmlldy5maWxlO1xuICAgIGlmICghZmlsZSkge1xuICAgICAgbmV3IE5vdGljZShcIk5vIGZpbGUgb3BlblwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICAgIGNvbnN0IGZtID0gY2FjaGU/LmZyb250bWF0dGVyIHx8IHt9O1xuXG4gICAgaWYgKCFmbS50ZW1wbyAmJiAhZm0ua2V5KSB7XG4gICAgICBuZXcgTm90aWNlKFwiTm8gYW5hbHlzaXMgZGF0YSBmb3VuZCBpbiB0aGlzIG5vdGVcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYnBtU3RhdGU6IEJwbUNvbnRyb2xTdGF0ZSA9IHtcbiAgICAgIGJwbTogZm0udGVtcG8gPz8gMCxcbiAgICAgIHJhd0JwbTogZm0ucmF3X3RlbXBvID8/IGZtLnRlbXBvID8/IDAsXG4gICAgICBhbHRlcm5hdGVCcG06IGZtLmFsdGVybmF0ZV90ZW1wbyxcbiAgICAgIGNvbmZpcm1lZDogZm0udGVtcG9fY29uZmlybWVkID8/IGZhbHNlLFxuICAgIH07XG5cbiAgICBjb25zdCBrZXlQYXJ0cyA9IFN0cmluZyhmbS5rZXkgfHwgXCJcIikuc3BsaXQoXCIgLyBcIik7XG4gICAgY29uc3Qga2V5TmFtZSA9IGtleVBhcnRzWzBdIHx8IFwiXCI7XG4gICAgY29uc3QgaXNNaW5vciA9IGtleU5hbWUuZW5kc1dpdGgoXCJtXCIpO1xuICAgIGNvbnN0IGJhc2VLZXkgPSBpc01pbm9yID8ga2V5TmFtZS5zbGljZSgwLCAtMSkgOiBrZXlOYW1lO1xuXG4gICAgY29uc3Qga2V5U3RhdGU6IEtleUNvbnRyb2xTdGF0ZSA9IHtcbiAgICAgIGtleTogYmFzZUtleSxcbiAgICAgIHNjYWxlOiBpc01pbm9yID8gXCJtaW5vclwiIDogXCJtYWpvclwiLFxuICAgICAgcmVsYXRpdmVLZXk6IGtleVBhcnRzWzFdLFxuICAgICAgY29uZmlybWVkOiBmbS5rZXlfY29uZmlybWVkID8/IGZhbHNlLFxuICAgIH07XG5cbiAgICBuZXcgQW5hbHlzaXNDb25maXJtTW9kYWwoXG4gICAgICB0aGlzLmFwcCxcbiAgICAgIHtcbiAgICAgICAgZmlsZU5hbWU6IGZpbGUuYmFzZW5hbWUsXG4gICAgICAgIGJwbTogYnBtU3RhdGUsXG4gICAgICAgIGtleToga2V5U3RhdGUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvblNhdmU6IGFzeW5jIChkYXRhKSA9PiB7XG4gICAgICAgICAgY29uc3Qga2V5RGlzcGxheSA9IGRhdGEua2V5LnNjYWxlID09PSBcIm1pbm9yXCJcbiAgICAgICAgICAgID8gYCR7ZGF0YS5rZXkua2V5fW1gXG4gICAgICAgICAgICA6IGRhdGEua2V5LmtleTtcblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBpbmplY3RGcm9udG1hdHRlcihhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpLCB7XG4gICAgICAgICAgICB0ZW1wbzogZGF0YS5icG0uYnBtLFxuICAgICAgICAgICAgcmF3X3RlbXBvOiBkYXRhLmJwbS5yYXdCcG0sXG4gICAgICAgICAgICBhbHRlcm5hdGVfdGVtcG86IGRhdGEuYnBtLmFsdGVybmF0ZUJwbSxcbiAgICAgICAgICAgIHRlbXBvX2NvbmZpcm1lZDogZGF0YS5icG0uY29uZmlybWVkLFxuICAgICAgICAgICAga2V5OiBrZXlEaXNwbGF5LFxuICAgICAgICAgICAga2V5X2NvbmZpcm1lZDogZGF0YS5rZXkuY29uZmlybWVkLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIHVwZGF0ZWQpO1xuICAgICAgICAgIG5ldyBOb3RpY2UoXCJBbmFseXNpcyB1cGRhdGVkXCIpO1xuICAgICAgICB9LFxuICAgICAgfVxuICAgICkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0F1ZGlvRmlsZShmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAvXihtcDN8d2F2fGZsYWN8YWlmfG9nZ3xtNGEpJC9pLnRlc3QoZmlsZS5leHRlbnNpb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBhbmFseXplSW5Xb3JrZXIoXG4gICAgYXVkaW9CdWZmZXI6IEFycmF5QnVmZmVyLFxuICAgIGZpbGVOYW1lOiBzdHJpbmcsXG4gICk6IFByb21pc2U8QW5hbHlzaXNSZXN1bHQ+IHtcbiAgICBpZiAoIXRoaXMud29ya2VyKSB7XG4gICAgICAvLyBSZWFkIGJ1bmRsZWQgd29ya2VyIHNvdXJjZSBhbmQgaW5zdGFudGlhdGUgZnJvbSBhIGJsb2IgVVJMLlxuICAgICAgLy8gT2JzaWRpYW4ncyByZW5kZXJlciBibG9ja3MgYG5ldyBXb3JrZXIoZmlsZVBhdGgpYCBiZWNhdXNlIHRoZVxuICAgICAgLy8gYXBwOi8vPGhhc2g+LyBwYXRoIGlzIGNyb3NzLW9yaWdpbiBmcm9tIGFwcDovL29ic2lkaWFuLm1kLlxuICAgICAgLy8gQSBibG9iOiBVUkwgaXMgc2FtZS1vcmlnaW4sIGJ5cGFzc2luZyB0aGUgU2VjdXJpdHlFcnJvci5cbiAgICAgIGNvbnN0IHdvcmtlclBhdGggPSBgJHt0aGlzLm1hbmlmZXN0LmRpcn0vZGlzdC93b3JrZXIuanNgO1xuICAgICAgY29uc3Qgd29ya2VyU291cmNlID0gYXdhaXQgdGhpcy5hcHAudmF1bHQuYWRhcHRlci5yZWFkKHdvcmtlclBhdGgpO1xuICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFt3b3JrZXJTb3VyY2VdLCB7IHR5cGU6IFwiYXBwbGljYXRpb24vamF2YXNjcmlwdFwiIH0pO1xuICAgICAgY29uc3QgYmxvYlVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLndvcmtlciA9IG5ldyBXb3JrZXIoYmxvYlVybCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICAvLyBSZXZva2UgaW1tZWRpYXRlbHkgXHUyMDE0IHRoZSBXb3JrZXIga2VlcHMgYW4gaW50ZXJuYWwgcmVmZXJlbmNlLlxuICAgICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKGJsb2JVcmwpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBpZCA9IGAke2ZpbGVOYW1lfS0ke0RhdGUubm93KCl9YDtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSAoZTogTWVzc2FnZUV2ZW50KSA9PiB7XG4gICAgICAgIGlmIChlLmRhdGEuaWQgIT09IGlkKSByZXR1cm47XG4gICAgICAgIHRoaXMud29ya2VyIS5yZW1vdmVFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBoYW5kbGVyKTtcbiAgICAgICAgaWYgKGUuZGF0YS50eXBlID09PSBcImVycm9yXCIpIHJlamVjdChuZXcgRXJyb3IoZS5kYXRhLmVycm9yKSk7XG4gICAgICAgIGVsc2UgcmVzb2x2ZShlLmRhdGEucmVzdWx0KTtcbiAgICAgIH07XG4gICAgICB0aGlzLndvcmtlciEuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgaGFuZGxlcik7XG4gICAgICB0aGlzLndvcmtlciEucG9zdE1lc3NhZ2UoeyBpZCwgdHlwZTogXCJhbmFseXplXCIsIGF1ZGlvQnVmZmVyIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyB3cml0ZU5vdGUocGF0aDogc3RyaW5nLCByZXN1bHQ6IEFuYWx5c2lzUmVzdWx0LCBzb3VyY2VGaWxlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkdXJhdGlvblN0ciA9IHRoaXMuZm9ybWF0RHVyYXRpb24ocmVzdWx0LmR1cmF0aW9uKTtcbiAgICBjb25zdCBrZXlEaXNwbGF5ID0gcmVzdWx0LnJlbGF0aXZlS2V5ID8gYCR7cmVzdWx0LmtleX0gLyAke3Jlc3VsdC5yZWxhdGl2ZUtleX1gIDogcmVzdWx0LmtleTtcblxuICAgIC8vIEJvZHk6IGF1dG8taW5qZWN0IG11c2ljLWRhc2hib2FyZCBjb2RlIGJsb2NrIHNvIHRoZSBkYXNoYm9hcmQgcmVuZGVycyBpbW1lZGlhdGVseVxuICAgIGNvbnN0IGJvZHkgPSBcIlxcbmBgYG11c2ljLWRhc2hib2FyZFxcbmBgYFxcblwiO1xuXG4gICAgY29uc3QgY29udGVudCA9IGluamVjdEZyb250bWF0dGVyKGJvZHksIHtcbiAgICAgIGF1ZGlvX3NvdXJjZTogc291cmNlRmlsZSxcbiAgICAgIGtleToga2V5RGlzcGxheSxcbiAgICAgIGtleV9jb25maXJtZWQ6IGZhbHNlLFxuICAgICAgdGVtcG86IHJlc3VsdC50ZW1wbyxcbiAgICAgIHJhd190ZW1wbzogcmVzdWx0LnJhd1RlbXBvLFxuICAgICAgYWx0ZXJuYXRlX3RlbXBvOiByZXN1bHQuYWx0ZXJuYXRlVGVtcG8sXG4gICAgICB0ZW1wb19jb25maXJtZWQ6IGZhbHNlLFxuICAgICAgZHVyYXRpb246IGR1cmF0aW9uU3RyLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHBhdGgpO1xuICAgIGlmIChleGlzdGluZykge1xuICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGV4aXN0aW5nLCBjb250ZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuY3JlYXRlKHBhdGgsIGNvbnRlbnQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZm9ybWF0RHVyYXRpb24oc2VjOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGNvbnN0IG0gPSBNYXRoLmZsb29yKHNlYyAvIDYwKTtcbiAgICBjb25zdCBzID0gTWF0aC5mbG9vcihzZWMgJSA2MCk7XG4gICAgcmV0dXJuIGAke219OiR7cy50b1N0cmluZygpLnBhZFN0YXJ0KDIsIFwiMFwiKX1gO1xuICB9XG59XG5cbi8vIFNpZGUtbm90ZTogZXhwb3NlIGZvciB0eXBlLWNoZWNraW5nIGluIHRlc3RzXG5leHBvcnQgeyBNdXNpY0FuYWx5c2lzUGx1Z2luIH07XG4iLCAiLyoqXG4gKiBTSEEtMjU2IGhhc2ggdXRpbGl0eSBcdTIwMTQgcnVucyBvZmZsaW5lLCB6ZXJvIG5ldHdvcmsuXG4gKi9cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNoYTI1NihidWZmZXI6IEFycmF5QnVmZmVyKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgaGFzaEJ1ZmZlciA9IGF3YWl0IGNyeXB0by5zdWJ0bGUuZGlnZXN0KFwiU0hBLTI1NlwiLCBidWZmZXIpO1xuICBjb25zdCBoYXNoQXJyYXkgPSBBcnJheS5mcm9tKG5ldyBVaW50OEFycmF5KGhhc2hCdWZmZXIpKTtcbiAgcmV0dXJuIGhhc2hBcnJheS5tYXAoKGIpID0+IGIudG9TdHJpbmcoMTYpLnBhZFN0YXJ0KDIsIFwiMFwiKSkuam9pbihcIlwiKTtcbn1cbiIsICJjb25zdCBBTElBUyA9IFN5bWJvbC5mb3IoJ3lhbWwuYWxpYXMnKTtcbmNvbnN0IERPQyA9IFN5bWJvbC5mb3IoJ3lhbWwuZG9jdW1lbnQnKTtcbmNvbnN0IE1BUCA9IFN5bWJvbC5mb3IoJ3lhbWwubWFwJyk7XG5jb25zdCBQQUlSID0gU3ltYm9sLmZvcigneWFtbC5wYWlyJyk7XG5jb25zdCBTQ0FMQVIgPSBTeW1ib2wuZm9yKCd5YW1sLnNjYWxhcicpO1xuY29uc3QgU0VRID0gU3ltYm9sLmZvcigneWFtbC5zZXEnKTtcbmNvbnN0IE5PREVfVFlQRSA9IFN5bWJvbC5mb3IoJ3lhbWwubm9kZS50eXBlJyk7XG5jb25zdCBpc0FsaWFzID0gKG5vZGUpID0+ICEhbm9kZSAmJiB0eXBlb2Ygbm9kZSA9PT0gJ29iamVjdCcgJiYgbm9kZVtOT0RFX1RZUEVdID09PSBBTElBUztcbmNvbnN0IGlzRG9jdW1lbnQgPSAobm9kZSkgPT4gISFub2RlICYmIHR5cGVvZiBub2RlID09PSAnb2JqZWN0JyAmJiBub2RlW05PREVfVFlQRV0gPT09IERPQztcbmNvbnN0IGlzTWFwID0gKG5vZGUpID0+ICEhbm9kZSAmJiB0eXBlb2Ygbm9kZSA9PT0gJ29iamVjdCcgJiYgbm9kZVtOT0RFX1RZUEVdID09PSBNQVA7XG5jb25zdCBpc1BhaXIgPSAobm9kZSkgPT4gISFub2RlICYmIHR5cGVvZiBub2RlID09PSAnb2JqZWN0JyAmJiBub2RlW05PREVfVFlQRV0gPT09IFBBSVI7XG5jb25zdCBpc1NjYWxhciA9IChub2RlKSA9PiAhIW5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmIG5vZGVbTk9ERV9UWVBFXSA9PT0gU0NBTEFSO1xuY29uc3QgaXNTZXEgPSAobm9kZSkgPT4gISFub2RlICYmIHR5cGVvZiBub2RlID09PSAnb2JqZWN0JyAmJiBub2RlW05PREVfVFlQRV0gPT09IFNFUTtcbmZ1bmN0aW9uIGlzQ29sbGVjdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnKVxuICAgICAgICBzd2l0Y2ggKG5vZGVbTk9ERV9UWVBFXSkge1xuICAgICAgICAgICAgY2FzZSBNQVA6XG4gICAgICAgICAgICBjYXNlIFNFUTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGlzTm9kZShub2RlKSB7XG4gICAgaWYgKG5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnKVxuICAgICAgICBzd2l0Y2ggKG5vZGVbTk9ERV9UWVBFXSkge1xuICAgICAgICAgICAgY2FzZSBBTElBUzpcbiAgICAgICAgICAgIGNhc2UgTUFQOlxuICAgICAgICAgICAgY2FzZSBTQ0FMQVI6XG4gICAgICAgICAgICBjYXNlIFNFUTpcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmNvbnN0IGhhc0FuY2hvciA9IChub2RlKSA9PiAoaXNTY2FsYXIobm9kZSkgfHwgaXNDb2xsZWN0aW9uKG5vZGUpKSAmJiAhIW5vZGUuYW5jaG9yO1xuXG5leHBvcnQgeyBBTElBUywgRE9DLCBNQVAsIE5PREVfVFlQRSwgUEFJUiwgU0NBTEFSLCBTRVEsIGhhc0FuY2hvciwgaXNBbGlhcywgaXNDb2xsZWN0aW9uLCBpc0RvY3VtZW50LCBpc01hcCwgaXNOb2RlLCBpc1BhaXIsIGlzU2NhbGFyLCBpc1NlcSB9O1xuIiwgImltcG9ydCB7IGlzRG9jdW1lbnQsIGlzTm9kZSwgaXNQYWlyLCBpc0NvbGxlY3Rpb24sIGlzTWFwLCBpc1NlcSwgaXNTY2FsYXIsIGlzQWxpYXMgfSBmcm9tICcuL25vZGVzL2lkZW50aXR5LmpzJztcblxuY29uc3QgQlJFQUsgPSBTeW1ib2woJ2JyZWFrIHZpc2l0Jyk7XG5jb25zdCBTS0lQID0gU3ltYm9sKCdza2lwIGNoaWxkcmVuJyk7XG5jb25zdCBSRU1PVkUgPSBTeW1ib2woJ3JlbW92ZSBub2RlJyk7XG4vKipcbiAqIEFwcGx5IGEgdmlzaXRvciB0byBhbiBBU1Qgbm9kZSBvciBkb2N1bWVudC5cbiAqXG4gKiBXYWxrcyB0aHJvdWdoIHRoZSB0cmVlIChkZXB0aC1maXJzdCkgc3RhcnRpbmcgZnJvbSBgbm9kZWAsIGNhbGxpbmcgYVxuICogYHZpc2l0b3JgIGZ1bmN0aW9uIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICogICAtIGBrZXlgOiBGb3Igc2VxdWVuY2UgdmFsdWVzIGFuZCBtYXAgYFBhaXJgLCB0aGUgbm9kZSdzIGluZGV4IGluIHRoZVxuICogICAgIGNvbGxlY3Rpb24uIFdpdGhpbiBhIGBQYWlyYCwgYCdrZXknYCBvciBgJ3ZhbHVlJ2AsIGNvcnJlc3BvbmRpbmdseS5cbiAqICAgICBgbnVsbGAgZm9yIHRoZSByb290IG5vZGUuXG4gKiAgIC0gYG5vZGVgOiBUaGUgY3VycmVudCBub2RlLlxuICogICAtIGBwYXRoYDogVGhlIGFuY2VzdHJ5IG9mIHRoZSBjdXJyZW50IG5vZGUuXG4gKlxuICogVGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgdmlzaXRvciBtYXkgYmUgdXNlZCB0byBjb250cm9sIHRoZSB0cmF2ZXJzYWw6XG4gKiAgIC0gYHVuZGVmaW5lZGAgKGRlZmF1bHQpOiBEbyBub3RoaW5nIGFuZCBjb250aW51ZVxuICogICAtIGB2aXNpdC5TS0lQYDogRG8gbm90IHZpc2l0IHRoZSBjaGlsZHJlbiBvZiB0aGlzIG5vZGUsIGNvbnRpbnVlIHdpdGggbmV4dFxuICogICAgIHNpYmxpbmdcbiAqICAgLSBgdmlzaXQuQlJFQUtgOiBUZXJtaW5hdGUgdHJhdmVyc2FsIGNvbXBsZXRlbHlcbiAqICAgLSBgdmlzaXQuUkVNT1ZFYDogUmVtb3ZlIHRoZSBjdXJyZW50IG5vZGUsIHRoZW4gY29udGludWUgd2l0aCB0aGUgbmV4dCBvbmVcbiAqICAgLSBgTm9kZWA6IFJlcGxhY2UgdGhlIGN1cnJlbnQgbm9kZSwgdGhlbiBjb250aW51ZSBieSB2aXNpdGluZyBpdFxuICogICAtIGBudW1iZXJgOiBXaGlsZSBpdGVyYXRpbmcgdGhlIGl0ZW1zIG9mIGEgc2VxdWVuY2Ugb3IgbWFwLCBzZXQgdGhlIGluZGV4XG4gKiAgICAgb2YgdGhlIG5leHQgc3RlcC4gVGhpcyBpcyB1c2VmdWwgZXNwZWNpYWxseSBpZiB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnRcbiAqICAgICBub2RlIGhhcyBjaGFuZ2VkLlxuICpcbiAqIElmIGB2aXNpdG9yYCBpcyBhIHNpbmdsZSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCBhbGwgdmFsdWVzXG4gKiBlbmNvdW50ZXJlZCBpbiB0aGUgdHJlZSwgaW5jbHVkaW5nIGUuZy4gYG51bGxgIHZhbHVlcy4gQWx0ZXJuYXRpdmVseSxcbiAqIHNlcGFyYXRlIHZpc2l0b3IgZnVuY3Rpb25zIG1heSBiZSBkZWZpbmVkIGZvciBlYWNoIGBNYXBgLCBgUGFpcmAsIGBTZXFgLFxuICogYEFsaWFzYCBhbmQgYFNjYWxhcmAgbm9kZS4gVG8gZGVmaW5lIHRoZSBzYW1lIHZpc2l0b3IgZnVuY3Rpb24gZm9yIG1vcmUgdGhhblxuICogb25lIG5vZGUgdHlwZSwgdXNlIHRoZSBgQ29sbGVjdGlvbmAgKG1hcCBhbmQgc2VxKSwgYFZhbHVlYCAobWFwLCBzZXEgJiBzY2FsYXIpXG4gKiBhbmQgYE5vZGVgIChhbGlhcywgbWFwLCBzZXEgJiBzY2FsYXIpIHRhcmdldHMuIE9mIGFsbCB0aGVzZSwgb25seSB0aGUgbW9zdFxuICogc3BlY2lmaWMgZGVmaW5lZCBvbmUgd2lsbCBiZSB1c2VkIGZvciBlYWNoIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIHZpc2l0KG5vZGUsIHZpc2l0b3IpIHtcbiAgICBjb25zdCB2aXNpdG9yXyA9IGluaXRWaXNpdG9yKHZpc2l0b3IpO1xuICAgIGlmIChpc0RvY3VtZW50KG5vZGUpKSB7XG4gICAgICAgIGNvbnN0IGNkID0gdmlzaXRfKG51bGwsIG5vZGUuY29udGVudHMsIHZpc2l0b3JfLCBPYmplY3QuZnJlZXplKFtub2RlXSkpO1xuICAgICAgICBpZiAoY2QgPT09IFJFTU9WRSlcbiAgICAgICAgICAgIG5vZGUuY29udGVudHMgPSBudWxsO1xuICAgIH1cbiAgICBlbHNlXG4gICAgICAgIHZpc2l0XyhudWxsLCBub2RlLCB2aXNpdG9yXywgT2JqZWN0LmZyZWV6ZShbXSkpO1xufVxuLy8gV2l0aG91dCB0aGUgYGFzIHN5bWJvbGAgY2FzdHMsIFRTIGRlY2xhcmVzIHRoZXNlIGluIHRoZSBgdmlzaXRgXG4vLyBuYW1lc3BhY2UgdXNpbmcgYHZhcmAsIGJ1dCB0aGVuIGNvbXBsYWlucyBhYm91dCB0aGF0IGJlY2F1c2Vcbi8vIGB1bmlxdWUgc3ltYm9sYCBtdXN0IGJlIGBjb25zdGAuXG4vKiogVGVybWluYXRlIHZpc2l0IHRyYXZlcnNhbCBjb21wbGV0ZWx5ICovXG52aXNpdC5CUkVBSyA9IEJSRUFLO1xuLyoqIERvIG5vdCB2aXNpdCB0aGUgY2hpbGRyZW4gb2YgdGhlIGN1cnJlbnQgbm9kZSAqL1xudmlzaXQuU0tJUCA9IFNLSVA7XG4vKiogUmVtb3ZlIHRoZSBjdXJyZW50IG5vZGUgKi9cbnZpc2l0LlJFTU9WRSA9IFJFTU9WRTtcbmZ1bmN0aW9uIHZpc2l0XyhrZXksIG5vZGUsIHZpc2l0b3IsIHBhdGgpIHtcbiAgICBjb25zdCBjdHJsID0gY2FsbFZpc2l0b3Ioa2V5LCBub2RlLCB2aXNpdG9yLCBwYXRoKTtcbiAgICBpZiAoaXNOb2RlKGN0cmwpIHx8IGlzUGFpcihjdHJsKSkge1xuICAgICAgICByZXBsYWNlTm9kZShrZXksIHBhdGgsIGN0cmwpO1xuICAgICAgICByZXR1cm4gdmlzaXRfKGtleSwgY3RybCwgdmlzaXRvciwgcGF0aCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY3RybCAhPT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgaWYgKGlzQ29sbGVjdGlvbihub2RlKSkge1xuICAgICAgICAgICAgcGF0aCA9IE9iamVjdC5mcmVlemUocGF0aC5jb25jYXQobm9kZSkpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLml0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2kgPSB2aXNpdF8oaSwgbm9kZS5pdGVtc1tpXSwgdmlzaXRvciwgcGF0aCk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjaSA9PT0gJ251bWJlcicpXG4gICAgICAgICAgICAgICAgICAgIGkgPSBjaSAtIDE7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2kgPT09IEJSRUFLKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQlJFQUs7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2kgPT09IFJFTU9WRSkge1xuICAgICAgICAgICAgICAgICAgICBub2RlLml0ZW1zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1BhaXIobm9kZSkpIHtcbiAgICAgICAgICAgIHBhdGggPSBPYmplY3QuZnJlZXplKHBhdGguY29uY2F0KG5vZGUpKTtcbiAgICAgICAgICAgIGNvbnN0IGNrID0gdmlzaXRfKCdrZXknLCBub2RlLmtleSwgdmlzaXRvciwgcGF0aCk7XG4gICAgICAgICAgICBpZiAoY2sgPT09IEJSRUFLKVxuICAgICAgICAgICAgICAgIHJldHVybiBCUkVBSztcbiAgICAgICAgICAgIGVsc2UgaWYgKGNrID09PSBSRU1PVkUpXG4gICAgICAgICAgICAgICAgbm9kZS5rZXkgPSBudWxsO1xuICAgICAgICAgICAgY29uc3QgY3YgPSB2aXNpdF8oJ3ZhbHVlJywgbm9kZS52YWx1ZSwgdmlzaXRvciwgcGF0aCk7XG4gICAgICAgICAgICBpZiAoY3YgPT09IEJSRUFLKVxuICAgICAgICAgICAgICAgIHJldHVybiBCUkVBSztcbiAgICAgICAgICAgIGVsc2UgaWYgKGN2ID09PSBSRU1PVkUpXG4gICAgICAgICAgICAgICAgbm9kZS52YWx1ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGN0cmw7XG59XG4vKipcbiAqIEFwcGx5IGFuIGFzeW5jIHZpc2l0b3IgdG8gYW4gQVNUIG5vZGUgb3IgZG9jdW1lbnQuXG4gKlxuICogV2Fsa3MgdGhyb3VnaCB0aGUgdHJlZSAoZGVwdGgtZmlyc3QpIHN0YXJ0aW5nIGZyb20gYG5vZGVgLCBjYWxsaW5nIGFcbiAqIGB2aXNpdG9yYCBmdW5jdGlvbiB3aXRoIHRocmVlIGFyZ3VtZW50czpcbiAqICAgLSBga2V5YDogRm9yIHNlcXVlbmNlIHZhbHVlcyBhbmQgbWFwIGBQYWlyYCwgdGhlIG5vZGUncyBpbmRleCBpbiB0aGVcbiAqICAgICBjb2xsZWN0aW9uLiBXaXRoaW4gYSBgUGFpcmAsIGAna2V5J2Agb3IgYCd2YWx1ZSdgLCBjb3JyZXNwb25kaW5nbHkuXG4gKiAgICAgYG51bGxgIGZvciB0aGUgcm9vdCBub2RlLlxuICogICAtIGBub2RlYDogVGhlIGN1cnJlbnQgbm9kZS5cbiAqICAgLSBgcGF0aGA6IFRoZSBhbmNlc3RyeSBvZiB0aGUgY3VycmVudCBub2RlLlxuICpcbiAqIFRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIHZpc2l0b3IgbWF5IGJlIHVzZWQgdG8gY29udHJvbCB0aGUgdHJhdmVyc2FsOlxuICogICAtIGBQcm9taXNlYDogTXVzdCByZXNvbHZlIHRvIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlc1xuICogICAtIGB1bmRlZmluZWRgIChkZWZhdWx0KTogRG8gbm90aGluZyBhbmQgY29udGludWVcbiAqICAgLSBgdmlzaXQuU0tJUGA6IERvIG5vdCB2aXNpdCB0aGUgY2hpbGRyZW4gb2YgdGhpcyBub2RlLCBjb250aW51ZSB3aXRoIG5leHRcbiAqICAgICBzaWJsaW5nXG4gKiAgIC0gYHZpc2l0LkJSRUFLYDogVGVybWluYXRlIHRyYXZlcnNhbCBjb21wbGV0ZWx5XG4gKiAgIC0gYHZpc2l0LlJFTU9WRWA6IFJlbW92ZSB0aGUgY3VycmVudCBub2RlLCB0aGVuIGNvbnRpbnVlIHdpdGggdGhlIG5leHQgb25lXG4gKiAgIC0gYE5vZGVgOiBSZXBsYWNlIHRoZSBjdXJyZW50IG5vZGUsIHRoZW4gY29udGludWUgYnkgdmlzaXRpbmcgaXRcbiAqICAgLSBgbnVtYmVyYDogV2hpbGUgaXRlcmF0aW5nIHRoZSBpdGVtcyBvZiBhIHNlcXVlbmNlIG9yIG1hcCwgc2V0IHRoZSBpbmRleFxuICogICAgIG9mIHRoZSBuZXh0IHN0ZXAuIFRoaXMgaXMgdXNlZnVsIGVzcGVjaWFsbHkgaWYgdGhlIGluZGV4IG9mIHRoZSBjdXJyZW50XG4gKiAgICAgbm9kZSBoYXMgY2hhbmdlZC5cbiAqXG4gKiBJZiBgdmlzaXRvcmAgaXMgYSBzaW5nbGUgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggYWxsIHZhbHVlc1xuICogZW5jb3VudGVyZWQgaW4gdGhlIHRyZWUsIGluY2x1ZGluZyBlLmcuIGBudWxsYCB2YWx1ZXMuIEFsdGVybmF0aXZlbHksXG4gKiBzZXBhcmF0ZSB2aXNpdG9yIGZ1bmN0aW9ucyBtYXkgYmUgZGVmaW5lZCBmb3IgZWFjaCBgTWFwYCwgYFBhaXJgLCBgU2VxYCxcbiAqIGBBbGlhc2AgYW5kIGBTY2FsYXJgIG5vZGUuIFRvIGRlZmluZSB0aGUgc2FtZSB2aXNpdG9yIGZ1bmN0aW9uIGZvciBtb3JlIHRoYW5cbiAqIG9uZSBub2RlIHR5cGUsIHVzZSB0aGUgYENvbGxlY3Rpb25gIChtYXAgYW5kIHNlcSksIGBWYWx1ZWAgKG1hcCwgc2VxICYgc2NhbGFyKVxuICogYW5kIGBOb2RlYCAoYWxpYXMsIG1hcCwgc2VxICYgc2NhbGFyKSB0YXJnZXRzLiBPZiBhbGwgdGhlc2UsIG9ubHkgdGhlIG1vc3RcbiAqIHNwZWNpZmljIGRlZmluZWQgb25lIHdpbGwgYmUgdXNlZCBmb3IgZWFjaCBub2RlLlxuICovXG5hc3luYyBmdW5jdGlvbiB2aXNpdEFzeW5jKG5vZGUsIHZpc2l0b3IpIHtcbiAgICBjb25zdCB2aXNpdG9yXyA9IGluaXRWaXNpdG9yKHZpc2l0b3IpO1xuICAgIGlmIChpc0RvY3VtZW50KG5vZGUpKSB7XG4gICAgICAgIGNvbnN0IGNkID0gYXdhaXQgdmlzaXRBc3luY18obnVsbCwgbm9kZS5jb250ZW50cywgdmlzaXRvcl8sIE9iamVjdC5mcmVlemUoW25vZGVdKSk7XG4gICAgICAgIGlmIChjZCA9PT0gUkVNT1ZFKVxuICAgICAgICAgICAgbm9kZS5jb250ZW50cyA9IG51bGw7XG4gICAgfVxuICAgIGVsc2VcbiAgICAgICAgYXdhaXQgdmlzaXRBc3luY18obnVsbCwgbm9kZSwgdmlzaXRvcl8sIE9iamVjdC5mcmVlemUoW10pKTtcbn1cbi8vIFdpdGhvdXQgdGhlIGBhcyBzeW1ib2xgIGNhc3RzLCBUUyBkZWNsYXJlcyB0aGVzZSBpbiB0aGUgYHZpc2l0YFxuLy8gbmFtZXNwYWNlIHVzaW5nIGB2YXJgLCBidXQgdGhlbiBjb21wbGFpbnMgYWJvdXQgdGhhdCBiZWNhdXNlXG4vLyBgdW5pcXVlIHN5bWJvbGAgbXVzdCBiZSBgY29uc3RgLlxuLyoqIFRlcm1pbmF0ZSB2aXNpdCB0cmF2ZXJzYWwgY29tcGxldGVseSAqL1xudmlzaXRBc3luYy5CUkVBSyA9IEJSRUFLO1xuLyoqIERvIG5vdCB2aXNpdCB0aGUgY2hpbGRyZW4gb2YgdGhlIGN1cnJlbnQgbm9kZSAqL1xudmlzaXRBc3luYy5TS0lQID0gU0tJUDtcbi8qKiBSZW1vdmUgdGhlIGN1cnJlbnQgbm9kZSAqL1xudmlzaXRBc3luYy5SRU1PVkUgPSBSRU1PVkU7XG5hc3luYyBmdW5jdGlvbiB2aXNpdEFzeW5jXyhrZXksIG5vZGUsIHZpc2l0b3IsIHBhdGgpIHtcbiAgICBjb25zdCBjdHJsID0gYXdhaXQgY2FsbFZpc2l0b3Ioa2V5LCBub2RlLCB2aXNpdG9yLCBwYXRoKTtcbiAgICBpZiAoaXNOb2RlKGN0cmwpIHx8IGlzUGFpcihjdHJsKSkge1xuICAgICAgICByZXBsYWNlTm9kZShrZXksIHBhdGgsIGN0cmwpO1xuICAgICAgICByZXR1cm4gdmlzaXRBc3luY18oa2V5LCBjdHJsLCB2aXNpdG9yLCBwYXRoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjdHJsICE9PSAnc3ltYm9sJykge1xuICAgICAgICBpZiAoaXNDb2xsZWN0aW9uKG5vZGUpKSB7XG4gICAgICAgICAgICBwYXRoID0gT2JqZWN0LmZyZWV6ZShwYXRoLmNvbmNhdChub2RlKSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuaXRlbXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaSA9IGF3YWl0IHZpc2l0QXN5bmNfKGksIG5vZGUuaXRlbXNbaV0sIHZpc2l0b3IsIHBhdGgpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2kgPT09ICdudW1iZXInKVxuICAgICAgICAgICAgICAgICAgICBpID0gY2kgLSAxO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNpID09PSBCUkVBSylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEJSRUFLO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNpID09PSBSRU1PVkUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5pdGVtcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNQYWlyKG5vZGUpKSB7XG4gICAgICAgICAgICBwYXRoID0gT2JqZWN0LmZyZWV6ZShwYXRoLmNvbmNhdChub2RlKSk7XG4gICAgICAgICAgICBjb25zdCBjayA9IGF3YWl0IHZpc2l0QXN5bmNfKCdrZXknLCBub2RlLmtleSwgdmlzaXRvciwgcGF0aCk7XG4gICAgICAgICAgICBpZiAoY2sgPT09IEJSRUFLKVxuICAgICAgICAgICAgICAgIHJldHVybiBCUkVBSztcbiAgICAgICAgICAgIGVsc2UgaWYgKGNrID09PSBSRU1PVkUpXG4gICAgICAgICAgICAgICAgbm9kZS5rZXkgPSBudWxsO1xuICAgICAgICAgICAgY29uc3QgY3YgPSBhd2FpdCB2aXNpdEFzeW5jXygndmFsdWUnLCBub2RlLnZhbHVlLCB2aXNpdG9yLCBwYXRoKTtcbiAgICAgICAgICAgIGlmIChjdiA9PT0gQlJFQUspXG4gICAgICAgICAgICAgICAgcmV0dXJuIEJSRUFLO1xuICAgICAgICAgICAgZWxzZSBpZiAoY3YgPT09IFJFTU9WRSlcbiAgICAgICAgICAgICAgICBub2RlLnZhbHVlID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY3RybDtcbn1cbmZ1bmN0aW9uIGluaXRWaXNpdG9yKHZpc2l0b3IpIHtcbiAgICBpZiAodHlwZW9mIHZpc2l0b3IgPT09ICdvYmplY3QnICYmXG4gICAgICAgICh2aXNpdG9yLkNvbGxlY3Rpb24gfHwgdmlzaXRvci5Ob2RlIHx8IHZpc2l0b3IuVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIEFsaWFzOiB2aXNpdG9yLk5vZGUsXG4gICAgICAgICAgICBNYXA6IHZpc2l0b3IuTm9kZSxcbiAgICAgICAgICAgIFNjYWxhcjogdmlzaXRvci5Ob2RlLFxuICAgICAgICAgICAgU2VxOiB2aXNpdG9yLk5vZGVcbiAgICAgICAgfSwgdmlzaXRvci5WYWx1ZSAmJiB7XG4gICAgICAgICAgICBNYXA6IHZpc2l0b3IuVmFsdWUsXG4gICAgICAgICAgICBTY2FsYXI6IHZpc2l0b3IuVmFsdWUsXG4gICAgICAgICAgICBTZXE6IHZpc2l0b3IuVmFsdWVcbiAgICAgICAgfSwgdmlzaXRvci5Db2xsZWN0aW9uICYmIHtcbiAgICAgICAgICAgIE1hcDogdmlzaXRvci5Db2xsZWN0aW9uLFxuICAgICAgICAgICAgU2VxOiB2aXNpdG9yLkNvbGxlY3Rpb25cbiAgICAgICAgfSwgdmlzaXRvcik7XG4gICAgfVxuICAgIHJldHVybiB2aXNpdG9yO1xufVxuZnVuY3Rpb24gY2FsbFZpc2l0b3Ioa2V5LCBub2RlLCB2aXNpdG9yLCBwYXRoKSB7XG4gICAgaWYgKHR5cGVvZiB2aXNpdG9yID09PSAnZnVuY3Rpb24nKVxuICAgICAgICByZXR1cm4gdmlzaXRvcihrZXksIG5vZGUsIHBhdGgpO1xuICAgIGlmIChpc01hcChub2RlKSlcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IuTWFwPy4oa2V5LCBub2RlLCBwYXRoKTtcbiAgICBpZiAoaXNTZXEobm9kZSkpXG4gICAgICAgIHJldHVybiB2aXNpdG9yLlNlcT8uKGtleSwgbm9kZSwgcGF0aCk7XG4gICAgaWYgKGlzUGFpcihub2RlKSlcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IuUGFpcj8uKGtleSwgbm9kZSwgcGF0aCk7XG4gICAgaWYgKGlzU2NhbGFyKG5vZGUpKVxuICAgICAgICByZXR1cm4gdmlzaXRvci5TY2FsYXI/LihrZXksIG5vZGUsIHBhdGgpO1xuICAgIGlmIChpc0FsaWFzKG5vZGUpKVxuICAgICAgICByZXR1cm4gdmlzaXRvci5BbGlhcz8uKGtleSwgbm9kZSwgcGF0aCk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbmZ1bmN0aW9uIHJlcGxhY2VOb2RlKGtleSwgcGF0aCwgbm9kZSkge1xuICAgIGNvbnN0IHBhcmVudCA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXTtcbiAgICBpZiAoaXNDb2xsZWN0aW9uKHBhcmVudCkpIHtcbiAgICAgICAgcGFyZW50Lml0ZW1zW2tleV0gPSBub2RlO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1BhaXIocGFyZW50KSkge1xuICAgICAgICBpZiAoa2V5ID09PSAna2V5JylcbiAgICAgICAgICAgIHBhcmVudC5rZXkgPSBub2RlO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYXJlbnQudmFsdWUgPSBub2RlO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0RvY3VtZW50KHBhcmVudCkpIHtcbiAgICAgICAgcGFyZW50LmNvbnRlbnRzID0gbm9kZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IHB0ID0gaXNBbGlhcyhwYXJlbnQpID8gJ2FsaWFzJyA6ICdzY2FsYXInO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZXBsYWNlIG5vZGUgd2l0aCAke3B0fSBwYXJlbnRgKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IHZpc2l0LCB2aXNpdEFzeW5jIH07XG4iLCAiaW1wb3J0IHsgaXNOb2RlIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgdmlzaXQgfSBmcm9tICcuLi92aXNpdC5qcyc7XG5cbmNvbnN0IGVzY2FwZUNoYXJzID0ge1xuICAgICchJzogJyUyMScsXG4gICAgJywnOiAnJTJDJyxcbiAgICAnWyc6ICclNUInLFxuICAgICddJzogJyU1RCcsXG4gICAgJ3snOiAnJTdCJyxcbiAgICAnfSc6ICclN0QnXG59O1xuY29uc3QgZXNjYXBlVGFnTmFtZSA9ICh0bikgPT4gdG4ucmVwbGFjZSgvWyEsW1xcXXt9XS9nLCBjaCA9PiBlc2NhcGVDaGFyc1tjaF0pO1xuY2xhc3MgRGlyZWN0aXZlcyB7XG4gICAgY29uc3RydWN0b3IoeWFtbCwgdGFncykge1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGRpcmVjdGl2ZXMtZW5kL2RvYy1zdGFydCBtYXJrZXIgYC0tLWAuIElmIGBudWxsYCwgYSBtYXJrZXIgbWF5IHN0aWxsIGJlXG4gICAgICAgICAqIGluY2x1ZGVkIGluIHRoZSBkb2N1bWVudCdzIHN0cmluZ2lmaWVkIHJlcHJlc2VudGF0aW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5kb2NTdGFydCA9IG51bGw7XG4gICAgICAgIC8qKiBUaGUgZG9jLWVuZCBtYXJrZXIgYC4uLmAuICAqL1xuICAgICAgICB0aGlzLmRvY0VuZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnlhbWwgPSBPYmplY3QuYXNzaWduKHt9LCBEaXJlY3RpdmVzLmRlZmF1bHRZYW1sLCB5YW1sKTtcbiAgICAgICAgdGhpcy50YWdzID0gT2JqZWN0LmFzc2lnbih7fSwgRGlyZWN0aXZlcy5kZWZhdWx0VGFncywgdGFncyk7XG4gICAgfVxuICAgIGNsb25lKCkge1xuICAgICAgICBjb25zdCBjb3B5ID0gbmV3IERpcmVjdGl2ZXModGhpcy55YW1sLCB0aGlzLnRhZ3MpO1xuICAgICAgICBjb3B5LmRvY1N0YXJ0ID0gdGhpcy5kb2NTdGFydDtcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIER1cmluZyBwYXJzaW5nLCBnZXQgYSBEaXJlY3RpdmVzIGluc3RhbmNlIGZvciB0aGUgY3VycmVudCBkb2N1bWVudCBhbmRcbiAgICAgKiB1cGRhdGUgdGhlIHN0cmVhbSBzdGF0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgdmVyc2lvbidzIHNwZWMuXG4gICAgICovXG4gICAgYXREb2N1bWVudCgpIHtcbiAgICAgICAgY29uc3QgcmVzID0gbmV3IERpcmVjdGl2ZXModGhpcy55YW1sLCB0aGlzLnRhZ3MpO1xuICAgICAgICBzd2l0Y2ggKHRoaXMueWFtbC52ZXJzaW9uKSB7XG4gICAgICAgICAgICBjYXNlICcxLjEnOlxuICAgICAgICAgICAgICAgIHRoaXMuYXROZXh0RG9jdW1lbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnMS4yJzpcbiAgICAgICAgICAgICAgICB0aGlzLmF0TmV4dERvY3VtZW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy55YW1sID0ge1xuICAgICAgICAgICAgICAgICAgICBleHBsaWNpdDogRGlyZWN0aXZlcy5kZWZhdWx0WWFtbC5leHBsaWNpdCxcbiAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogJzEuMidcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMudGFncyA9IE9iamVjdC5hc3NpZ24oe30sIERpcmVjdGl2ZXMuZGVmYXVsdFRhZ3MpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBvbkVycm9yIC0gTWF5IGJlIGNhbGxlZCBldmVuIGlmIHRoZSBhY3Rpb24gd2FzIHN1Y2Nlc3NmdWxcbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgb24gc3VjY2Vzc1xuICAgICAqL1xuICAgIGFkZChsaW5lLCBvbkVycm9yKSB7XG4gICAgICAgIGlmICh0aGlzLmF0TmV4dERvY3VtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnlhbWwgPSB7IGV4cGxpY2l0OiBEaXJlY3RpdmVzLmRlZmF1bHRZYW1sLmV4cGxpY2l0LCB2ZXJzaW9uOiAnMS4xJyB9O1xuICAgICAgICAgICAgdGhpcy50YWdzID0gT2JqZWN0LmFzc2lnbih7fSwgRGlyZWN0aXZlcy5kZWZhdWx0VGFncyk7XG4gICAgICAgICAgICB0aGlzLmF0TmV4dERvY3VtZW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFydHMgPSBsaW5lLnRyaW0oKS5zcGxpdCgvWyBcXHRdKy8pO1xuICAgICAgICBjb25zdCBuYW1lID0gcGFydHMuc2hpZnQoKTtcbiAgICAgICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICAgICAgICBjYXNlICclVEFHJzoge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggIT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcigwLCAnJVRBRyBkaXJlY3RpdmUgc2hvdWxkIGNvbnRhaW4gZXhhY3RseSB0d28gcGFydHMnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA8IDIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IFtoYW5kbGUsIHByZWZpeF0gPSBwYXJ0cztcbiAgICAgICAgICAgICAgICB0aGlzLnRhZ3NbaGFuZGxlXSA9IHByZWZpeDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJyVZQU1MJzoge1xuICAgICAgICAgICAgICAgIHRoaXMueWFtbC5leHBsaWNpdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKDAsICclWUFNTCBkaXJlY3RpdmUgc2hvdWxkIGNvbnRhaW4gZXhhY3RseSBvbmUgcGFydCcpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IFt2ZXJzaW9uXSA9IHBhcnRzO1xuICAgICAgICAgICAgICAgIGlmICh2ZXJzaW9uID09PSAnMS4xJyB8fCB2ZXJzaW9uID09PSAnMS4yJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnlhbWwudmVyc2lvbiA9IHZlcnNpb247XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNWYWxpZCA9IC9eXFxkK1xcLlxcZCskLy50ZXN0KHZlcnNpb24pO1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKDYsIGBVbnN1cHBvcnRlZCBZQU1MIHZlcnNpb24gJHt2ZXJzaW9ufWAsIGlzVmFsaWQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBvbkVycm9yKDAsIGBVbmtub3duIGRpcmVjdGl2ZSAke25hbWV9YCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlc29sdmVzIGEgdGFnLCBtYXRjaGluZyBoYW5kbGVzIHRvIHRob3NlIGRlZmluZWQgaW4gJVRBRyBkaXJlY3RpdmVzLlxuICAgICAqXG4gICAgICogQHJldHVybnMgUmVzb2x2ZWQgdGFnLCB3aGljaCBtYXkgYWxzbyBiZSB0aGUgbm9uLXNwZWNpZmljIHRhZyBgJyEnYCBvciBhXG4gICAgICogICBgJyFsb2NhbCdgIHRhZywgb3IgYG51bGxgIGlmIHVucmVzb2x2YWJsZS5cbiAgICAgKi9cbiAgICB0YWdOYW1lKHNvdXJjZSwgb25FcnJvcikge1xuICAgICAgICBpZiAoc291cmNlID09PSAnIScpXG4gICAgICAgICAgICByZXR1cm4gJyEnOyAvLyBub24tc3BlY2lmaWMgdGFnXG4gICAgICAgIGlmIChzb3VyY2VbMF0gIT09ICchJykge1xuICAgICAgICAgICAgb25FcnJvcihgTm90IGEgdmFsaWQgdGFnOiAke3NvdXJjZX1gKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzb3VyY2VbMV0gPT09ICc8Jykge1xuICAgICAgICAgICAgY29uc3QgdmVyYmF0aW0gPSBzb3VyY2Uuc2xpY2UoMiwgLTEpO1xuICAgICAgICAgICAgaWYgKHZlcmJhdGltID09PSAnIScgfHwgdmVyYmF0aW0gPT09ICchIScpIHtcbiAgICAgICAgICAgICAgICBvbkVycm9yKGBWZXJiYXRpbSB0YWdzIGFyZW4ndCByZXNvbHZlZCwgc28gJHtzb3VyY2V9IGlzIGludmFsaWQuYCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc291cmNlW3NvdXJjZS5sZW5ndGggLSAxXSAhPT0gJz4nKVxuICAgICAgICAgICAgICAgIG9uRXJyb3IoJ1ZlcmJhdGltIHRhZ3MgbXVzdCBlbmQgd2l0aCBhID4nKTtcbiAgICAgICAgICAgIHJldHVybiB2ZXJiYXRpbTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBbLCBoYW5kbGUsIHN1ZmZpeF0gPSBzb3VyY2UubWF0Y2goL14oLiohKShbXiFdKikkL3MpO1xuICAgICAgICBpZiAoIXN1ZmZpeClcbiAgICAgICAgICAgIG9uRXJyb3IoYFRoZSAke3NvdXJjZX0gdGFnIGhhcyBubyBzdWZmaXhgKTtcbiAgICAgICAgY29uc3QgcHJlZml4ID0gdGhpcy50YWdzW2hhbmRsZV07XG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArIGRlY29kZVVSSUNvbXBvbmVudChzdWZmaXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgb25FcnJvcihTdHJpbmcoZXJyb3IpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFuZGxlID09PSAnIScpXG4gICAgICAgICAgICByZXR1cm4gc291cmNlOyAvLyBsb2NhbCB0YWdcbiAgICAgICAgb25FcnJvcihgQ291bGQgbm90IHJlc29sdmUgdGFnOiAke3NvdXJjZX1gKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgZnVsbHkgcmVzb2x2ZWQgdGFnLCByZXR1cm5zIGl0cyBwcmludGFibGUgc3RyaW5nIGZvcm0sXG4gICAgICogdGFraW5nIGludG8gYWNjb3VudCBjdXJyZW50IHRhZyBwcmVmaXhlcyBhbmQgZGVmYXVsdHMuXG4gICAgICovXG4gICAgdGFnU3RyaW5nKHRhZykge1xuICAgICAgICBmb3IgKGNvbnN0IFtoYW5kbGUsIHByZWZpeF0gb2YgT2JqZWN0LmVudHJpZXModGhpcy50YWdzKSkge1xuICAgICAgICAgICAgaWYgKHRhZy5zdGFydHNXaXRoKHByZWZpeCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZSArIGVzY2FwZVRhZ05hbWUodGFnLnN1YnN0cmluZyhwcmVmaXgubGVuZ3RoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhZ1swXSA9PT0gJyEnID8gdGFnIDogYCE8JHt0YWd9PmA7XG4gICAgfVxuICAgIHRvU3RyaW5nKGRvYykge1xuICAgICAgICBjb25zdCBsaW5lcyA9IHRoaXMueWFtbC5leHBsaWNpdFxuICAgICAgICAgICAgPyBbYCVZQU1MICR7dGhpcy55YW1sLnZlcnNpb24gfHwgJzEuMid9YF1cbiAgICAgICAgICAgIDogW107XG4gICAgICAgIGNvbnN0IHRhZ0VudHJpZXMgPSBPYmplY3QuZW50cmllcyh0aGlzLnRhZ3MpO1xuICAgICAgICBsZXQgdGFnTmFtZXM7XG4gICAgICAgIGlmIChkb2MgJiYgdGFnRW50cmllcy5sZW5ndGggPiAwICYmIGlzTm9kZShkb2MuY29udGVudHMpKSB7XG4gICAgICAgICAgICBjb25zdCB0YWdzID0ge307XG4gICAgICAgICAgICB2aXNpdChkb2MuY29udGVudHMsIChfa2V5LCBub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGlzTm9kZShub2RlKSAmJiBub2RlLnRhZylcbiAgICAgICAgICAgICAgICAgICAgdGFnc1tub2RlLnRhZ10gPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0YWdOYW1lcyA9IE9iamVjdC5rZXlzKHRhZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRhZ05hbWVzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgW2hhbmRsZSwgcHJlZml4XSBvZiB0YWdFbnRyaWVzKSB7XG4gICAgICAgICAgICBpZiAoaGFuZGxlID09PSAnISEnICYmIHByZWZpeCA9PT0gJ3RhZzp5YW1sLm9yZywyMDAyOicpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBpZiAoIWRvYyB8fCB0YWdOYW1lcy5zb21lKHRuID0+IHRuLnN0YXJ0c1dpdGgocHJlZml4KSkpXG4gICAgICAgICAgICAgICAgbGluZXMucHVzaChgJVRBRyAke2hhbmRsZX0gJHtwcmVmaXh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgIH1cbn1cbkRpcmVjdGl2ZXMuZGVmYXVsdFlhbWwgPSB7IGV4cGxpY2l0OiBmYWxzZSwgdmVyc2lvbjogJzEuMicgfTtcbkRpcmVjdGl2ZXMuZGVmYXVsdFRhZ3MgPSB7ICchISc6ICd0YWc6eWFtbC5vcmcsMjAwMjonIH07XG5cbmV4cG9ydCB7IERpcmVjdGl2ZXMgfTtcbiIsICJpbXBvcnQgeyBpc1NjYWxhciwgaXNDb2xsZWN0aW9uIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgdmlzaXQgfSBmcm9tICcuLi92aXNpdC5qcyc7XG5cbi8qKlxuICogVmVyaWZ5IHRoYXQgdGhlIGlucHV0IHN0cmluZyBpcyBhIHZhbGlkIGFuY2hvci5cbiAqXG4gKiBXaWxsIHRocm93IG9uIGVycm9ycy5cbiAqL1xuZnVuY3Rpb24gYW5jaG9ySXNWYWxpZChhbmNob3IpIHtcbiAgICBpZiAoL1tcXHgwMC1cXHgxOVxccyxbXFxde31dLy50ZXN0KGFuY2hvcikpIHtcbiAgICAgICAgY29uc3Qgc2EgPSBKU09OLnN0cmluZ2lmeShhbmNob3IpO1xuICAgICAgICBjb25zdCBtc2cgPSBgQW5jaG9yIG11c3Qgbm90IGNvbnRhaW4gd2hpdGVzcGFjZSBvciBjb250cm9sIGNoYXJhY3RlcnM6ICR7c2F9YDtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gYW5jaG9yTmFtZXMocm9vdCkge1xuICAgIGNvbnN0IGFuY2hvcnMgPSBuZXcgU2V0KCk7XG4gICAgdmlzaXQocm9vdCwge1xuICAgICAgICBWYWx1ZShfa2V5LCBub2RlKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5hbmNob3IpXG4gICAgICAgICAgICAgICAgYW5jaG9ycy5hZGQobm9kZS5hbmNob3IpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGFuY2hvcnM7XG59XG4vKiogRmluZCBhIG5ldyBhbmNob3IgbmFtZSB3aXRoIHRoZSBnaXZlbiBgcHJlZml4YCBhbmQgYSBvbmUtaW5kZXhlZCBzdWZmaXguICovXG5mdW5jdGlvbiBmaW5kTmV3QW5jaG9yKHByZWZpeCwgZXhjbHVkZSkge1xuICAgIGZvciAobGV0IGkgPSAxOyB0cnVlOyArK2kpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGAke3ByZWZpeH0ke2l9YDtcbiAgICAgICAgaWYgKCFleGNsdWRlLmhhcyhuYW1lKSlcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGNyZWF0ZU5vZGVBbmNob3JzKGRvYywgcHJlZml4KSB7XG4gICAgY29uc3QgYWxpYXNPYmplY3RzID0gW107XG4gICAgY29uc3Qgc291cmNlT2JqZWN0cyA9IG5ldyBNYXAoKTtcbiAgICBsZXQgcHJldkFuY2hvcnMgPSBudWxsO1xuICAgIHJldHVybiB7XG4gICAgICAgIG9uQW5jaG9yOiAoc291cmNlKSA9PiB7XG4gICAgICAgICAgICBhbGlhc09iamVjdHMucHVzaChzb3VyY2UpO1xuICAgICAgICAgICAgcHJldkFuY2hvcnMgPz8gKHByZXZBbmNob3JzID0gYW5jaG9yTmFtZXMoZG9jKSk7XG4gICAgICAgICAgICBjb25zdCBhbmNob3IgPSBmaW5kTmV3QW5jaG9yKHByZWZpeCwgcHJldkFuY2hvcnMpO1xuICAgICAgICAgICAgcHJldkFuY2hvcnMuYWRkKGFuY2hvcik7XG4gICAgICAgICAgICByZXR1cm4gYW5jaG9yO1xuICAgICAgICB9LFxuICAgICAgICAvKipcbiAgICAgICAgICogV2l0aCBjaXJjdWxhciByZWZlcmVuY2VzLCB0aGUgc291cmNlIG5vZGUgaXMgb25seSByZXNvbHZlZCBhZnRlciBhbGxcbiAgICAgICAgICogb2YgaXRzIGNoaWxkIG5vZGVzIGFyZS4gVGhpcyBpcyB3aHkgYW5jaG9ycyBhcmUgc2V0IG9ubHkgYWZ0ZXIgYWxsIG9mXG4gICAgICAgICAqIHRoZSBub2RlcyBoYXZlIGJlZW4gY3JlYXRlZC5cbiAgICAgICAgICovXG4gICAgICAgIHNldEFuY2hvcnM6ICgpID0+IHtcbiAgICAgICAgICAgIGZvciAoY29uc3Qgc291cmNlIG9mIGFsaWFzT2JqZWN0cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlZiA9IHNvdXJjZU9iamVjdHMuZ2V0KHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByZWYgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAgICAgICAgIHJlZi5hbmNob3IgJiZcbiAgICAgICAgICAgICAgICAgICAgKGlzU2NhbGFyKHJlZi5ub2RlKSB8fCBpc0NvbGxlY3Rpb24ocmVmLm5vZGUpKSkge1xuICAgICAgICAgICAgICAgICAgICByZWYubm9kZS5hbmNob3IgPSByZWYuYW5jaG9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ0ZhaWxlZCB0byByZXNvbHZlIHJlcGVhdGVkIG9iamVjdCAodGhpcyBzaG91bGQgbm90IGhhcHBlbiknKTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3Iuc291cmNlID0gc291cmNlO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHNvdXJjZU9iamVjdHNcbiAgICB9O1xufVxuXG5leHBvcnQgeyBhbmNob3JJc1ZhbGlkLCBhbmNob3JOYW1lcywgY3JlYXRlTm9kZUFuY2hvcnMsIGZpbmROZXdBbmNob3IgfTtcbiIsICIvKipcbiAqIEFwcGxpZXMgdGhlIEpTT04ucGFyc2UgcmV2aXZlciBhbGdvcml0aG0gYXMgZGVmaW5lZCBpbiB0aGUgRUNNQS0yNjIgc3BlYyxcbiAqIGluIHNlY3Rpb24gMjQuNS4xLjEgXCJSdW50aW1lIFNlbWFudGljczogSW50ZXJuYWxpemVKU09OUHJvcGVydHlcIiBvZiB0aGVcbiAqIDIwMjEgZWRpdGlvbjogaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1qc29uLnBhcnNlXG4gKlxuICogSW5jbHVkZXMgZXh0ZW5zaW9ucyBmb3IgaGFuZGxpbmcgTWFwIGFuZCBTZXQgb2JqZWN0cy5cbiAqL1xuZnVuY3Rpb24gYXBwbHlSZXZpdmVyKHJldml2ZXIsIG9iaiwga2V5LCB2YWwpIHtcbiAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB2YWwubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2MCA9IHZhbFtpXTtcbiAgICAgICAgICAgICAgICBjb25zdCB2MSA9IGFwcGx5UmV2aXZlcihyZXZpdmVyLCB2YWwsIFN0cmluZyhpKSwgdjApO1xuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tYXJyYXktZGVsZXRlXG4gICAgICAgICAgICAgICAgaWYgKHYxID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWxbaV07XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodjEgIT09IHYwKVxuICAgICAgICAgICAgICAgICAgICB2YWxbaV0gPSB2MTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWwgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgayBvZiBBcnJheS5mcm9tKHZhbC5rZXlzKCkpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdjAgPSB2YWwuZ2V0KGspO1xuICAgICAgICAgICAgICAgIGNvbnN0IHYxID0gYXBwbHlSZXZpdmVyKHJldml2ZXIsIHZhbCwgaywgdjApO1xuICAgICAgICAgICAgICAgIGlmICh2MSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICB2YWwuZGVsZXRlKGspO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHYxICE9PSB2MClcbiAgICAgICAgICAgICAgICAgICAgdmFsLnNldChrLCB2MSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHYwIG9mIEFycmF5LmZyb20odmFsKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYxID0gYXBwbHlSZXZpdmVyKHJldml2ZXIsIHZhbCwgdjAsIHYwKTtcbiAgICAgICAgICAgICAgICBpZiAodjEgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgdmFsLmRlbGV0ZSh2MCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodjEgIT09IHYwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbC5kZWxldGUodjApO1xuICAgICAgICAgICAgICAgICAgICB2YWwuYWRkKHYxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtrLCB2MF0gb2YgT2JqZWN0LmVudHJpZXModmFsKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYxID0gYXBwbHlSZXZpdmVyKHJldml2ZXIsIHZhbCwgaywgdjApO1xuICAgICAgICAgICAgICAgIGlmICh2MSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsW2tdO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHYxICE9PSB2MClcbiAgICAgICAgICAgICAgICAgICAgdmFsW2tdID0gdjE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldml2ZXIuY2FsbChvYmosIGtleSwgdmFsKTtcbn1cblxuZXhwb3J0IHsgYXBwbHlSZXZpdmVyIH07XG4iLCAiaW1wb3J0IHsgaGFzQW5jaG9yIH0gZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgY29udmVydCBhbnkgbm9kZSBvciBpdHMgY29udGVudHMgdG8gbmF0aXZlIEphdmFTY3JpcHRcbiAqXG4gKiBAcGFyYW0gdmFsdWUgLSBUaGUgaW5wdXQgdmFsdWVcbiAqIEBwYXJhbSBhcmcgLSBJZiBgdmFsdWVgIGRlZmluZXMgYSBgdG9KU09OKClgIG1ldGhvZCwgdXNlIHRoaXNcbiAqICAgYXMgaXRzIGZpcnN0IGFyZ3VtZW50XG4gKiBAcGFyYW0gY3R4IC0gQ29udmVyc2lvbiBjb250ZXh0LCBvcmlnaW5hbGx5IHNldCBpbiBEb2N1bWVudCN0b0pTKCkuIElmXG4gKiAgIGB7IGtlZXA6IHRydWUgfWAgaXMgbm90IHNldCwgb3V0cHV0IHNob3VsZCBiZSBzdWl0YWJsZSBmb3IgSlNPTlxuICogICBzdHJpbmdpZmljYXRpb24uXG4gKi9cbmZ1bmN0aW9uIHRvSlModmFsdWUsIGFyZywgY3R4KSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtcmV0dXJuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKVxuICAgICAgICByZXR1cm4gdmFsdWUubWFwKCh2LCBpKSA9PiB0b0pTKHYsIFN0cmluZyhpKSwgY3R4KSk7XG4gICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtY2FsbFxuICAgICAgICBpZiAoIWN0eCB8fCAhaGFzQW5jaG9yKHZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS50b0pTT04oYXJnLCBjdHgpO1xuICAgICAgICBjb25zdCBkYXRhID0geyBhbGlhc0NvdW50OiAwLCBjb3VudDogMSwgcmVzOiB1bmRlZmluZWQgfTtcbiAgICAgICAgY3R4LmFuY2hvcnMuc2V0KHZhbHVlLCBkYXRhKTtcbiAgICAgICAgY3R4Lm9uQ3JlYXRlID0gcmVzID0+IHtcbiAgICAgICAgICAgIGRhdGEucmVzID0gcmVzO1xuICAgICAgICAgICAgZGVsZXRlIGN0eC5vbkNyZWF0ZTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVzID0gdmFsdWUudG9KU09OKGFyZywgY3R4KTtcbiAgICAgICAgaWYgKGN0eC5vbkNyZWF0ZSlcbiAgICAgICAgICAgIGN0eC5vbkNyZWF0ZShyZXMpO1xuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnYmlnaW50JyAmJiAhY3R4Py5rZWVwKVxuICAgICAgICByZXR1cm4gTnVtYmVyKHZhbHVlKTtcbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCB7IHRvSlMgfTtcbiIsICJpbXBvcnQgeyBhcHBseVJldml2ZXIgfSBmcm9tICcuLi9kb2MvYXBwbHlSZXZpdmVyLmpzJztcbmltcG9ydCB7IE5PREVfVFlQRSwgaXNEb2N1bWVudCB9IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgdG9KUyB9IGZyb20gJy4vdG9KUy5qcyc7XG5cbmNsYXNzIE5vZGVCYXNlIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBOT0RFX1RZUEUsIHsgdmFsdWU6IHR5cGUgfSk7XG4gICAgfVxuICAgIC8qKiBDcmVhdGUgYSBjb3B5IG9mIHRoaXMgbm9kZS4gICovXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnModGhpcykpO1xuICAgICAgICBpZiAodGhpcy5yYW5nZSlcbiAgICAgICAgICAgIGNvcHkucmFuZ2UgPSB0aGlzLnJhbmdlLnNsaWNlKCk7XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbiAgICAvKiogQSBwbGFpbiBKYXZhU2NyaXB0IHJlcHJlc2VudGF0aW9uIG9mIHRoaXMgbm9kZS4gKi9cbiAgICB0b0pTKGRvYywgeyBtYXBBc01hcCwgbWF4QWxpYXNDb3VudCwgb25BbmNob3IsIHJldml2ZXIgfSA9IHt9KSB7XG4gICAgICAgIGlmICghaXNEb2N1bWVudChkb2MpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQSBkb2N1bWVudCBhcmd1bWVudCBpcyByZXF1aXJlZCcpO1xuICAgICAgICBjb25zdCBjdHggPSB7XG4gICAgICAgICAgICBhbmNob3JzOiBuZXcgTWFwKCksXG4gICAgICAgICAgICBkb2MsXG4gICAgICAgICAgICBrZWVwOiB0cnVlLFxuICAgICAgICAgICAgbWFwQXNNYXA6IG1hcEFzTWFwID09PSB0cnVlLFxuICAgICAgICAgICAgbWFwS2V5V2FybmVkOiBmYWxzZSxcbiAgICAgICAgICAgIG1heEFsaWFzQ291bnQ6IHR5cGVvZiBtYXhBbGlhc0NvdW50ID09PSAnbnVtYmVyJyA/IG1heEFsaWFzQ291bnQgOiAxMDBcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVzID0gdG9KUyh0aGlzLCAnJywgY3R4KTtcbiAgICAgICAgaWYgKHR5cGVvZiBvbkFuY2hvciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIGZvciAoY29uc3QgeyBjb3VudCwgcmVzIH0gb2YgY3R4LmFuY2hvcnMudmFsdWVzKCkpXG4gICAgICAgICAgICAgICAgb25BbmNob3IocmVzLCBjb3VudCk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgPyBhcHBseVJldml2ZXIocmV2aXZlciwgeyAnJzogcmVzIH0sICcnLCByZXMpXG4gICAgICAgICAgICA6IHJlcztcbiAgICB9XG59XG5cbmV4cG9ydCB7IE5vZGVCYXNlIH07XG4iLCAiaW1wb3J0IHsgYW5jaG9ySXNWYWxpZCB9IGZyb20gJy4uL2RvYy9hbmNob3JzLmpzJztcbmltcG9ydCB7IHZpc2l0IH0gZnJvbSAnLi4vdmlzaXQuanMnO1xuaW1wb3J0IHsgQUxJQVMsIGlzQWxpYXMsIGlzQ29sbGVjdGlvbiwgaXNQYWlyLCBoYXNBbmNob3IgfSBmcm9tICcuL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IE5vZGVCYXNlIH0gZnJvbSAnLi9Ob2RlLmpzJztcbmltcG9ydCB7IHRvSlMgfSBmcm9tICcuL3RvSlMuanMnO1xuXG5jbGFzcyBBbGlhcyBleHRlbmRzIE5vZGVCYXNlIHtcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcbiAgICAgICAgc3VwZXIoQUxJQVMpO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICd0YWcnLCB7XG4gICAgICAgICAgICBzZXQoKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbGlhcyBub2RlcyBjYW5ub3QgaGF2ZSB0YWdzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlIHRoZSB2YWx1ZSBvZiB0aGlzIGFsaWFzIHdpdGhpbiBgZG9jYCwgZmluZGluZyB0aGUgbGFzdFxuICAgICAqIGluc3RhbmNlIG9mIHRoZSBgc291cmNlYCBhbmNob3IgYmVmb3JlIHRoaXMgbm9kZS5cbiAgICAgKi9cbiAgICByZXNvbHZlKGRvYywgY3R4KSB7XG4gICAgICAgIGlmIChjdHg/Lm1heEFsaWFzQ291bnQgPT09IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0FsaWFzIHJlc29sdXRpb24gaXMgZGlzYWJsZWQnKTtcbiAgICAgICAgbGV0IG5vZGVzO1xuICAgICAgICBpZiAoY3R4Py5hbGlhc1Jlc29sdmVDYWNoZSkge1xuICAgICAgICAgICAgbm9kZXMgPSBjdHguYWxpYXNSZXNvbHZlQ2FjaGU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBub2RlcyA9IFtdO1xuICAgICAgICAgICAgdmlzaXQoZG9jLCB7XG4gICAgICAgICAgICAgICAgTm9kZTogKF9rZXksIG5vZGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQWxpYXMobm9kZSkgfHwgaGFzQW5jaG9yKG5vZGUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZXMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChjdHgpXG4gICAgICAgICAgICAgICAgY3R4LmFsaWFzUmVzb2x2ZUNhY2hlID0gbm9kZXM7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZvdW5kID0gdW5kZWZpbmVkO1xuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChub2RlID09PSB0aGlzKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgaWYgKG5vZGUuYW5jaG9yID09PSB0aGlzLnNvdXJjZSlcbiAgICAgICAgICAgICAgICBmb3VuZCA9IG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH1cbiAgICB0b0pTT04oX2FyZywgY3R4KSB7XG4gICAgICAgIGlmICghY3R4KVxuICAgICAgICAgICAgcmV0dXJuIHsgc291cmNlOiB0aGlzLnNvdXJjZSB9O1xuICAgICAgICBjb25zdCB7IGFuY2hvcnMsIGRvYywgbWF4QWxpYXNDb3VudCB9ID0gY3R4O1xuICAgICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLnJlc29sdmUoZG9jLCBjdHgpO1xuICAgICAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgICAgICAgY29uc3QgbXNnID0gYFVucmVzb2x2ZWQgYWxpYXMgKHRoZSBhbmNob3IgbXVzdCBiZSBzZXQgYmVmb3JlIHRoZSBhbGlhcyk6ICR7dGhpcy5zb3VyY2V9YDtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhID0gYW5jaG9ycy5nZXQoc291cmNlKTtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAvLyBSZXNvbHZlIGFuY2hvcnMgZm9yIE5vZGUucHJvdG90eXBlLnRvSlMoKVxuICAgICAgICAgICAgdG9KUyhzb3VyY2UsIG51bGwsIGN0eCk7XG4gICAgICAgICAgICBkYXRhID0gYW5jaG9ycy5nZXQoc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICAgICAgaWYgKGRhdGE/LnJlcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb25zdCBtc2cgPSAnVGhpcyBzaG91bGQgbm90IGhhcHBlbjogQWxpYXMgYW5jaG9yIHdhcyBub3QgcmVzb2x2ZWQ/JztcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihtc2cpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXhBbGlhc0NvdW50ID49IDApIHtcbiAgICAgICAgICAgIGRhdGEuY291bnQgKz0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLmFsaWFzQ291bnQgPT09IDApXG4gICAgICAgICAgICAgICAgZGF0YS5hbGlhc0NvdW50ID0gZ2V0QWxpYXNDb3VudChkb2MsIHNvdXJjZSwgYW5jaG9ycyk7XG4gICAgICAgICAgICBpZiAoZGF0YS5jb3VudCAqIGRhdGEuYWxpYXNDb3VudCA+IG1heEFsaWFzQ291bnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSAnRXhjZXNzaXZlIGFsaWFzIGNvdW50IGluZGljYXRlcyBhIHJlc291cmNlIGV4aGF1c3Rpb24gYXR0YWNrJztcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IobXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGF0YS5yZXM7XG4gICAgfVxuICAgIHRvU3RyaW5nKGN0eCwgX29uQ29tbWVudCwgX29uQ2hvbXBLZWVwKSB7XG4gICAgICAgIGNvbnN0IHNyYyA9IGAqJHt0aGlzLnNvdXJjZX1gO1xuICAgICAgICBpZiAoY3R4KSB7XG4gICAgICAgICAgICBhbmNob3JJc1ZhbGlkKHRoaXMuc291cmNlKTtcbiAgICAgICAgICAgIGlmIChjdHgub3B0aW9ucy52ZXJpZnlBbGlhc09yZGVyICYmICFjdHguYW5jaG9ycy5oYXModGhpcy5zb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gYFVucmVzb2x2ZWQgYWxpYXMgKHRoZSBhbmNob3IgbXVzdCBiZSBzZXQgYmVmb3JlIHRoZSBhbGlhcyk6ICR7dGhpcy5zb3VyY2V9YDtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjdHguaW1wbGljaXRLZXkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke3NyY30gYDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3JjO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldEFsaWFzQ291bnQoZG9jLCBub2RlLCBhbmNob3JzKSB7XG4gICAgaWYgKGlzQWxpYXMobm9kZSkpIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gbm9kZS5yZXNvbHZlKGRvYyk7XG4gICAgICAgIGNvbnN0IGFuY2hvciA9IGFuY2hvcnMgJiYgc291cmNlICYmIGFuY2hvcnMuZ2V0KHNvdXJjZSk7XG4gICAgICAgIHJldHVybiBhbmNob3IgPyBhbmNob3IuY291bnQgKiBhbmNob3IuYWxpYXNDb3VudCA6IDA7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQ29sbGVjdGlvbihub2RlKSkge1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2Ygbm9kZS5pdGVtcykge1xuICAgICAgICAgICAgY29uc3QgYyA9IGdldEFsaWFzQ291bnQoZG9jLCBpdGVtLCBhbmNob3JzKTtcbiAgICAgICAgICAgIGlmIChjID4gY291bnQpXG4gICAgICAgICAgICAgICAgY291bnQgPSBjO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQYWlyKG5vZGUpKSB7XG4gICAgICAgIGNvbnN0IGtjID0gZ2V0QWxpYXNDb3VudChkb2MsIG5vZGUua2V5LCBhbmNob3JzKTtcbiAgICAgICAgY29uc3QgdmMgPSBnZXRBbGlhc0NvdW50KGRvYywgbm9kZS52YWx1ZSwgYW5jaG9ycyk7XG4gICAgICAgIHJldHVybiBNYXRoLm1heChrYywgdmMpO1xuICAgIH1cbiAgICByZXR1cm4gMTtcbn1cblxuZXhwb3J0IHsgQWxpYXMgfTtcbiIsICJpbXBvcnQgeyBTQ0FMQVIgfSBmcm9tICcuL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IE5vZGVCYXNlIH0gZnJvbSAnLi9Ob2RlLmpzJztcbmltcG9ydCB7IHRvSlMgfSBmcm9tICcuL3RvSlMuanMnO1xuXG5jb25zdCBpc1NjYWxhclZhbHVlID0gKHZhbHVlKSA9PiAhdmFsdWUgfHwgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKTtcbmNsYXNzIFNjYWxhciBleHRlbmRzIE5vZGVCYXNlIHtcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgICAgICBzdXBlcihTQ0FMQVIpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIHRvSlNPTihhcmcsIGN0eCkge1xuICAgICAgICByZXR1cm4gY3R4Py5rZWVwID8gdGhpcy52YWx1ZSA6IHRvSlModGhpcy52YWx1ZSwgYXJnLCBjdHgpO1xuICAgIH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZyh0aGlzLnZhbHVlKTtcbiAgICB9XG59XG5TY2FsYXIuQkxPQ0tfRk9MREVEID0gJ0JMT0NLX0ZPTERFRCc7XG5TY2FsYXIuQkxPQ0tfTElURVJBTCA9ICdCTE9DS19MSVRFUkFMJztcblNjYWxhci5QTEFJTiA9ICdQTEFJTic7XG5TY2FsYXIuUVVPVEVfRE9VQkxFID0gJ1FVT1RFX0RPVUJMRSc7XG5TY2FsYXIuUVVPVEVfU0lOR0xFID0gJ1FVT1RFX1NJTkdMRSc7XG5cbmV4cG9ydCB7IFNjYWxhciwgaXNTY2FsYXJWYWx1ZSB9O1xuIiwgImltcG9ydCB7IEFsaWFzIH0gZnJvbSAnLi4vbm9kZXMvQWxpYXMuanMnO1xuaW1wb3J0IHsgaXNOb2RlLCBpc1BhaXIsIE1BUCwgU0VRLCBpc0RvY3VtZW50IH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vbm9kZXMvU2NhbGFyLmpzJztcblxuY29uc3QgZGVmYXVsdFRhZ1ByZWZpeCA9ICd0YWc6eWFtbC5vcmcsMjAwMjonO1xuZnVuY3Rpb24gZmluZFRhZ09iamVjdCh2YWx1ZSwgdGFnTmFtZSwgdGFncykge1xuICAgIGlmICh0YWdOYW1lKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gdGFncy5maWx0ZXIodCA9PiB0LnRhZyA9PT0gdGFnTmFtZSk7XG4gICAgICAgIGNvbnN0IHRhZ09iaiA9IG1hdGNoLmZpbmQodCA9PiAhdC5mb3JtYXQpID8/IG1hdGNoWzBdO1xuICAgICAgICBpZiAoIXRhZ09iailcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGFnICR7dGFnTmFtZX0gbm90IGZvdW5kYCk7XG4gICAgICAgIHJldHVybiB0YWdPYmo7XG4gICAgfVxuICAgIHJldHVybiB0YWdzLmZpbmQodCA9PiB0LmlkZW50aWZ5Py4odmFsdWUpICYmICF0LmZvcm1hdCk7XG59XG5mdW5jdGlvbiBjcmVhdGVOb2RlKHZhbHVlLCB0YWdOYW1lLCBjdHgpIHtcbiAgICBpZiAoaXNEb2N1bWVudCh2YWx1ZSkpXG4gICAgICAgIHZhbHVlID0gdmFsdWUuY29udGVudHM7XG4gICAgaWYgKGlzTm9kZSh2YWx1ZSkpXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICBpZiAoaXNQYWlyKHZhbHVlKSkge1xuICAgICAgICBjb25zdCBtYXAgPSBjdHguc2NoZW1hW01BUF0uY3JlYXRlTm9kZT8uKGN0eC5zY2hlbWEsIG51bGwsIGN0eCk7XG4gICAgICAgIG1hcC5pdGVtcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nIHx8XG4gICAgICAgIHZhbHVlIGluc3RhbmNlb2YgTnVtYmVyIHx8XG4gICAgICAgIHZhbHVlIGluc3RhbmNlb2YgQm9vbGVhbiB8fFxuICAgICAgICAodHlwZW9mIEJpZ0ludCAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBCaWdJbnQpIC8vIG5vdCBzdXBwb3J0ZWQgZXZlcnl3aGVyZVxuICAgICkge1xuICAgICAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNlcmlhbGl6ZWpzb25wcm9wZXJ0eVxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgY29uc3QgeyBhbGlhc0R1cGxpY2F0ZU9iamVjdHMsIG9uQW5jaG9yLCBvblRhZ09iaiwgc2NoZW1hLCBzb3VyY2VPYmplY3RzIH0gPSBjdHg7XG4gICAgLy8gRGV0ZWN0IGR1cGxpY2F0ZSByZWZlcmVuY2VzIHRvIHRoZSBzYW1lIG9iamVjdCAmIHVzZSBBbGlhcyBub2RlcyBmb3IgYWxsXG4gICAgLy8gYWZ0ZXIgZmlyc3QuIFRoZSBgcmVmYCB3cmFwcGVyIGFsbG93cyBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcyB0byByZXNvbHZlLlxuICAgIGxldCByZWYgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGFsaWFzRHVwbGljYXRlT2JqZWN0cyAmJiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJlZiA9IHNvdXJjZU9iamVjdHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgaWYgKHJlZikge1xuICAgICAgICAgICAgcmVmLmFuY2hvciA/PyAocmVmLmFuY2hvciA9IG9uQW5jaG9yKHZhbHVlKSk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IEFsaWFzKHJlZi5hbmNob3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVmID0geyBhbmNob3I6IG51bGwsIG5vZGU6IG51bGwgfTtcbiAgICAgICAgICAgIHNvdXJjZU9iamVjdHMuc2V0KHZhbHVlLCByZWYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0YWdOYW1lPy5zdGFydHNXaXRoKCchIScpKVxuICAgICAgICB0YWdOYW1lID0gZGVmYXVsdFRhZ1ByZWZpeCArIHRhZ05hbWUuc2xpY2UoMik7XG4gICAgbGV0IHRhZ09iaiA9IGZpbmRUYWdPYmplY3QodmFsdWUsIHRhZ05hbWUsIHNjaGVtYS50YWdzKTtcbiAgICBpZiAoIXRhZ09iaikge1xuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtY2FsbFxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgU2NhbGFyKHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChyZWYpXG4gICAgICAgICAgICAgICAgcmVmLm5vZGUgPSBub2RlO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICAgICAgdGFnT2JqID1cbiAgICAgICAgICAgIHZhbHVlIGluc3RhbmNlb2YgTWFwXG4gICAgICAgICAgICAgICAgPyBzY2hlbWFbTUFQXVxuICAgICAgICAgICAgICAgIDogU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdCh2YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgPyBzY2hlbWFbU0VRXVxuICAgICAgICAgICAgICAgICAgICA6IHNjaGVtYVtNQVBdO1xuICAgIH1cbiAgICBpZiAob25UYWdPYmopIHtcbiAgICAgICAgb25UYWdPYmoodGFnT2JqKTtcbiAgICAgICAgZGVsZXRlIGN0eC5vblRhZ09iajtcbiAgICB9XG4gICAgY29uc3Qgbm9kZSA9IHRhZ09iaj8uY3JlYXRlTm9kZVxuICAgICAgICA/IHRhZ09iai5jcmVhdGVOb2RlKGN0eC5zY2hlbWEsIHZhbHVlLCBjdHgpXG4gICAgICAgIDogdHlwZW9mIHRhZ09iaj8ubm9kZUNsYXNzPy5mcm9tID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICA/IHRhZ09iai5ub2RlQ2xhc3MuZnJvbShjdHguc2NoZW1hLCB2YWx1ZSwgY3R4KVxuICAgICAgICAgICAgOiBuZXcgU2NhbGFyKHZhbHVlKTtcbiAgICBpZiAodGFnTmFtZSlcbiAgICAgICAgbm9kZS50YWcgPSB0YWdOYW1lO1xuICAgIGVsc2UgaWYgKCF0YWdPYmouZGVmYXVsdClcbiAgICAgICAgbm9kZS50YWcgPSB0YWdPYmoudGFnO1xuICAgIGlmIChyZWYpXG4gICAgICAgIHJlZi5ub2RlID0gbm9kZTtcbiAgICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IHsgY3JlYXRlTm9kZSB9O1xuIiwgImltcG9ydCB7IGNyZWF0ZU5vZGUgfSBmcm9tICcuLi9kb2MvY3JlYXRlTm9kZS5qcyc7XG5pbXBvcnQgeyBpc05vZGUsIGlzUGFpciwgaXNDb2xsZWN0aW9uLCBpc1NjYWxhciB9IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgTm9kZUJhc2UgfSBmcm9tICcuL05vZGUuanMnO1xuXG5mdW5jdGlvbiBjb2xsZWN0aW9uRnJvbVBhdGgoc2NoZW1hLCBwYXRoLCB2YWx1ZSkge1xuICAgIGxldCB2ID0gdmFsdWU7XG4gICAgZm9yIChsZXQgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgY29uc3QgayA9IHBhdGhbaV07XG4gICAgICAgIGlmICh0eXBlb2YgayA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzSW50ZWdlcihrKSAmJiBrID49IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGEgPSBbXTtcbiAgICAgICAgICAgIGFba10gPSB2O1xuICAgICAgICAgICAgdiA9IGE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2ID0gbmV3IE1hcChbW2ssIHZdXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZU5vZGUodiwgdW5kZWZpbmVkLCB7XG4gICAgICAgIGFsaWFzRHVwbGljYXRlT2JqZWN0czogZmFsc2UsXG4gICAgICAgIGtlZXBVbmRlZmluZWQ6IGZhbHNlLFxuICAgICAgICBvbkFuY2hvcjogKCkgPT4ge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIHNob3VsZCBub3QgaGFwcGVuLCBwbGVhc2UgcmVwb3J0IGEgYnVnLicpO1xuICAgICAgICB9LFxuICAgICAgICBzY2hlbWEsXG4gICAgICAgIHNvdXJjZU9iamVjdHM6IG5ldyBNYXAoKVxuICAgIH0pO1xufVxuLy8gVHlwZSBndWFyZCBpcyBpbnRlbnRpb25hbGx5IGEgbGl0dGxlIHdyb25nIHNvIGFzIHRvIGJlIG1vcmUgdXNlZnVsLFxuLy8gYXMgaXQgZG9lcyBub3QgY292ZXIgdW50eXBhYmxlIGVtcHR5IG5vbi1zdHJpbmcgaXRlcmFibGVzIChlLmcuIFtdKS5cbmNvbnN0IGlzRW1wdHlQYXRoID0gKHBhdGgpID0+IHBhdGggPT0gbnVsbCB8fFxuICAgICh0eXBlb2YgcGF0aCA9PT0gJ29iamVjdCcgJiYgISFwYXRoW1N5bWJvbC5pdGVyYXRvcl0oKS5uZXh0KCkuZG9uZSk7XG5jbGFzcyBDb2xsZWN0aW9uIGV4dGVuZHMgTm9kZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKHR5cGUsIHNjaGVtYSkge1xuICAgICAgICBzdXBlcih0eXBlKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzY2hlbWEnLCB7XG4gICAgICAgICAgICB2YWx1ZTogc2NoZW1hLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgY29weSBvZiB0aGlzIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2NoZW1hIC0gSWYgZGVmaW5lZCwgb3ZlcndyaXRlcyB0aGUgb3JpZ2luYWwncyBzY2hlbWFcbiAgICAgKi9cbiAgICBjbG9uZShzY2hlbWEpIHtcbiAgICAgICAgY29uc3QgY29weSA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh0aGlzKSk7XG4gICAgICAgIGlmIChzY2hlbWEpXG4gICAgICAgICAgICBjb3B5LnNjaGVtYSA9IHNjaGVtYTtcbiAgICAgICAgY29weS5pdGVtcyA9IGNvcHkuaXRlbXMubWFwKGl0ID0+IGlzTm9kZShpdCkgfHwgaXNQYWlyKGl0KSA/IGl0LmNsb25lKHNjaGVtYSkgOiBpdCk7XG4gICAgICAgIGlmICh0aGlzLnJhbmdlKVxuICAgICAgICAgICAgY29weS5yYW5nZSA9IHRoaXMucmFuZ2Uuc2xpY2UoKTtcbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgYSB2YWx1ZSB0byB0aGUgY29sbGVjdGlvbi4gRm9yIGAhIW1hcGAgYW5kIGAhIW9tYXBgIHRoZSB2YWx1ZSBtdXN0XG4gICAgICogYmUgYSBQYWlyIGluc3RhbmNlIG9yIGEgYHsga2V5LCB2YWx1ZSB9YCBvYmplY3QsIHdoaWNoIG1heSBub3QgaGF2ZSBhIGtleVxuICAgICAqIHRoYXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIG1hcC5cbiAgICAgKi9cbiAgICBhZGRJbihwYXRoLCB2YWx1ZSkge1xuICAgICAgICBpZiAoaXNFbXB0eVBhdGgocGF0aCkpXG4gICAgICAgICAgICB0aGlzLmFkZCh2YWx1ZSk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgW2tleSwgLi4ucmVzdF0gPSBwYXRoO1xuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0KGtleSwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoaXNDb2xsZWN0aW9uKG5vZGUpKVxuICAgICAgICAgICAgICAgIG5vZGUuYWRkSW4ocmVzdCwgdmFsdWUpO1xuICAgICAgICAgICAgZWxzZSBpZiAobm9kZSA9PT0gdW5kZWZpbmVkICYmIHRoaXMuc2NoZW1hKVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgY29sbGVjdGlvbkZyb21QYXRoKHRoaXMuc2NoZW1hLCByZXN0LCB2YWx1ZSkpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgWUFNTCBjb2xsZWN0aW9uIGF0ICR7a2V5fS4gUmVtYWluaW5nIHBhdGg6ICR7cmVzdH1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgdmFsdWUgZnJvbSB0aGUgY29sbGVjdGlvbi5cbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGl0ZW0gd2FzIGZvdW5kIGFuZCByZW1vdmVkLlxuICAgICAqL1xuICAgIGRlbGV0ZUluKHBhdGgpIHtcbiAgICAgICAgY29uc3QgW2tleSwgLi4ucmVzdF0gPSBwYXRoO1xuICAgICAgICBpZiAocmVzdC5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kZWxldGUoa2V5KTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0KGtleSwgdHJ1ZSk7XG4gICAgICAgIGlmIChpc0NvbGxlY3Rpb24obm9kZSkpXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5kZWxldGVJbihyZXN0KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBZQU1MIGNvbGxlY3Rpb24gYXQgJHtrZXl9LiBSZW1haW5pbmcgcGF0aDogJHtyZXN0fWApO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGl0ZW0gYXQgYGtleWAsIG9yIGB1bmRlZmluZWRgIGlmIG5vdCBmb3VuZC4gQnkgZGVmYXVsdCB1bndyYXBzXG4gICAgICogc2NhbGFyIHZhbHVlcyBmcm9tIHRoZWlyIHN1cnJvdW5kaW5nIG5vZGU7IHRvIGRpc2FibGUgc2V0IGBrZWVwU2NhbGFyYCB0b1xuICAgICAqIGB0cnVlYCAoY29sbGVjdGlvbnMgYXJlIGFsd2F5cyByZXR1cm5lZCBpbnRhY3QpLlxuICAgICAqL1xuICAgIGdldEluKHBhdGgsIGtlZXBTY2FsYXIpIHtcbiAgICAgICAgY29uc3QgW2tleSwgLi4ucmVzdF0gPSBwYXRoO1xuICAgICAgICBjb25zdCBub2RlID0gdGhpcy5nZXQoa2V5LCB0cnVlKTtcbiAgICAgICAgaWYgKHJlc3QubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuICFrZWVwU2NhbGFyICYmIGlzU2NhbGFyKG5vZGUpID8gbm9kZS52YWx1ZSA6IG5vZGU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBpc0NvbGxlY3Rpb24obm9kZSkgPyBub2RlLmdldEluKHJlc3QsIGtlZXBTY2FsYXIpIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBoYXNBbGxOdWxsVmFsdWVzKGFsbG93U2NhbGFyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zLmV2ZXJ5KG5vZGUgPT4ge1xuICAgICAgICAgICAgaWYgKCFpc1BhaXIobm9kZSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgbiA9IG5vZGUudmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gKG4gPT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgIChhbGxvd1NjYWxhciAmJlxuICAgICAgICAgICAgICAgICAgICBpc1NjYWxhcihuKSAmJlxuICAgICAgICAgICAgICAgICAgICBuLnZhbHVlID09IG51bGwgJiZcbiAgICAgICAgICAgICAgICAgICAgIW4uY29tbWVudEJlZm9yZSAmJlxuICAgICAgICAgICAgICAgICAgICAhbi5jb21tZW50ICYmXG4gICAgICAgICAgICAgICAgICAgICFuLnRhZykpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBjb2xsZWN0aW9uIGluY2x1ZGVzIGEgdmFsdWUgd2l0aCB0aGUga2V5IGBrZXlgLlxuICAgICAqL1xuICAgIGhhc0luKHBhdGgpIHtcbiAgICAgICAgY29uc3QgW2tleSwgLi4ucmVzdF0gPSBwYXRoO1xuICAgICAgICBpZiAocmVzdC5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oYXMoa2V5KTtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0KGtleSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBpc0NvbGxlY3Rpb24obm9kZSkgPyBub2RlLmhhc0luKHJlc3QpIDogZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSB2YWx1ZSBpbiB0aGlzIGNvbGxlY3Rpb24uIEZvciBgISFzZXRgLCBgdmFsdWVgIG5lZWRzIHRvIGJlIGFcbiAgICAgKiBib29sZWFuIHRvIGFkZC9yZW1vdmUgdGhlIGl0ZW0gZnJvbSB0aGUgc2V0LlxuICAgICAqL1xuICAgIHNldEluKHBhdGgsIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IFtrZXksIC4uLnJlc3RdID0gcGF0aDtcbiAgICAgICAgaWYgKHJlc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldChrZXksIHRydWUpO1xuICAgICAgICAgICAgaWYgKGlzQ29sbGVjdGlvbihub2RlKSlcbiAgICAgICAgICAgICAgICBub2RlLnNldEluKHJlc3QsIHZhbHVlKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnNjaGVtYSlcbiAgICAgICAgICAgICAgICB0aGlzLnNldChrZXksIGNvbGxlY3Rpb25Gcm9tUGF0aCh0aGlzLnNjaGVtYSwgcmVzdCwgdmFsdWUpKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIFlBTUwgY29sbGVjdGlvbiBhdCAke2tleX0uIFJlbWFpbmluZyBwYXRoOiAke3Jlc3R9YCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IENvbGxlY3Rpb24sIGNvbGxlY3Rpb25Gcm9tUGF0aCwgaXNFbXB0eVBhdGggfTtcbiIsICIvKipcbiAqIFN0cmluZ2lmaWVzIGEgY29tbWVudC5cbiAqXG4gKiBFbXB0eSBjb21tZW50IGxpbmVzIGFyZSBsZWZ0IGVtcHR5LFxuICogbGluZXMgY29uc2lzdGluZyBvZiBhIHNpbmdsZSBzcGFjZSBhcmUgcmVwbGFjZWQgYnkgYCNgLFxuICogYW5kIGFsbCBvdGhlciBsaW5lcyBhcmUgcHJlZml4ZWQgd2l0aCBhIGAjYC5cbiAqL1xuY29uc3Qgc3RyaW5naWZ5Q29tbWVudCA9IChzdHIpID0+IHN0ci5yZXBsYWNlKC9eKD8hJCkoPzogJCk/L2dtLCAnIycpO1xuZnVuY3Rpb24gaW5kZW50Q29tbWVudChjb21tZW50LCBpbmRlbnQpIHtcbiAgICBpZiAoL15cXG4rJC8udGVzdChjb21tZW50KSlcbiAgICAgICAgcmV0dXJuIGNvbW1lbnQuc3Vic3RyaW5nKDEpO1xuICAgIHJldHVybiBpbmRlbnQgPyBjb21tZW50LnJlcGxhY2UoL14oPyEgKiQpL2dtLCBpbmRlbnQpIDogY29tbWVudDtcbn1cbmNvbnN0IGxpbmVDb21tZW50ID0gKHN0ciwgaW5kZW50LCBjb21tZW50KSA9PiBzdHIuZW5kc1dpdGgoJ1xcbicpXG4gICAgPyBpbmRlbnRDb21tZW50KGNvbW1lbnQsIGluZGVudClcbiAgICA6IGNvbW1lbnQuaW5jbHVkZXMoJ1xcbicpXG4gICAgICAgID8gJ1xcbicgKyBpbmRlbnRDb21tZW50KGNvbW1lbnQsIGluZGVudClcbiAgICAgICAgOiAoc3RyLmVuZHNXaXRoKCcgJykgPyAnJyA6ICcgJykgKyBjb21tZW50O1xuXG5leHBvcnQgeyBpbmRlbnRDb21tZW50LCBsaW5lQ29tbWVudCwgc3RyaW5naWZ5Q29tbWVudCB9O1xuIiwgImNvbnN0IEZPTERfRkxPVyA9ICdmbG93JztcbmNvbnN0IEZPTERfQkxPQ0sgPSAnYmxvY2snO1xuY29uc3QgRk9MRF9RVU9URUQgPSAncXVvdGVkJztcbi8qKlxuICogVHJpZXMgdG8ga2VlcCBpbnB1dCBhdCB1cCB0byBgbGluZVdpZHRoYCBjaGFyYWN0ZXJzLCBzcGxpdHRpbmcgb25seSBvbiBzcGFjZXNcbiAqIG5vdCBmb2xsb3dlZCBieSBuZXdsaW5lcyBvciBzcGFjZXMgdW5sZXNzIGBtb2RlYCBpcyBgJ3F1b3RlZCdgLiBMaW5lcyBhcmVcbiAqIHRlcm1pbmF0ZWQgd2l0aCBgXFxuYCBhbmQgc3RhcnRlZCB3aXRoIGBpbmRlbnRgLlxuICovXG5mdW5jdGlvbiBmb2xkRmxvd0xpbmVzKHRleHQsIGluZGVudCwgbW9kZSA9ICdmbG93JywgeyBpbmRlbnRBdFN0YXJ0LCBsaW5lV2lkdGggPSA4MCwgbWluQ29udGVudFdpZHRoID0gMjAsIG9uRm9sZCwgb25PdmVyZmxvdyB9ID0ge30pIHtcbiAgICBpZiAoIWxpbmVXaWR0aCB8fCBsaW5lV2lkdGggPCAwKVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICBpZiAobGluZVdpZHRoIDwgbWluQ29udGVudFdpZHRoKVxuICAgICAgICBtaW5Db250ZW50V2lkdGggPSAwO1xuICAgIGNvbnN0IGVuZFN0ZXAgPSBNYXRoLm1heCgxICsgbWluQ29udGVudFdpZHRoLCAxICsgbGluZVdpZHRoIC0gaW5kZW50Lmxlbmd0aCk7XG4gICAgaWYgKHRleHQubGVuZ3RoIDw9IGVuZFN0ZXApXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIGNvbnN0IGZvbGRzID0gW107XG4gICAgY29uc3QgZXNjYXBlZEZvbGRzID0ge307XG4gICAgbGV0IGVuZCA9IGxpbmVXaWR0aCAtIGluZGVudC5sZW5ndGg7XG4gICAgaWYgKHR5cGVvZiBpbmRlbnRBdFN0YXJ0ID09PSAnbnVtYmVyJykge1xuICAgICAgICBpZiAoaW5kZW50QXRTdGFydCA+IGxpbmVXaWR0aCAtIE1hdGgubWF4KDIsIG1pbkNvbnRlbnRXaWR0aCkpXG4gICAgICAgICAgICBmb2xkcy5wdXNoKDApO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBlbmQgPSBsaW5lV2lkdGggLSBpbmRlbnRBdFN0YXJ0O1xuICAgIH1cbiAgICBsZXQgc3BsaXQgPSB1bmRlZmluZWQ7XG4gICAgbGV0IHByZXYgPSB1bmRlZmluZWQ7XG4gICAgbGV0IG92ZXJmbG93ID0gZmFsc2U7XG4gICAgbGV0IGkgPSAtMTtcbiAgICBsZXQgZXNjU3RhcnQgPSAtMTtcbiAgICBsZXQgZXNjRW5kID0gLTE7XG4gICAgaWYgKG1vZGUgPT09IEZPTERfQkxPQ0spIHtcbiAgICAgICAgaSA9IGNvbnN1bWVNb3JlSW5kZW50ZWRMaW5lcyh0ZXh0LCBpLCBpbmRlbnQubGVuZ3RoKTtcbiAgICAgICAgaWYgKGkgIT09IC0xKVxuICAgICAgICAgICAgZW5kID0gaSArIGVuZFN0ZXA7XG4gICAgfVxuICAgIGZvciAobGV0IGNoOyAoY2ggPSB0ZXh0WyhpICs9IDEpXSk7KSB7XG4gICAgICAgIGlmIChtb2RlID09PSBGT0xEX1FVT1RFRCAmJiBjaCA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICBlc2NTdGFydCA9IGk7XG4gICAgICAgICAgICBzd2l0Y2ggKHRleHRbaSArIDFdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndSc6XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gNTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnVSc6XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gOTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXNjRW5kID0gaTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2ggPT09ICdcXG4nKSB7XG4gICAgICAgICAgICBpZiAobW9kZSA9PT0gRk9MRF9CTE9DSylcbiAgICAgICAgICAgICAgICBpID0gY29uc3VtZU1vcmVJbmRlbnRlZExpbmVzKHRleHQsIGksIGluZGVudC5sZW5ndGgpO1xuICAgICAgICAgICAgZW5kID0gaSArIGluZGVudC5sZW5ndGggKyBlbmRTdGVwO1xuICAgICAgICAgICAgc3BsaXQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2ggPT09ICcgJyAmJlxuICAgICAgICAgICAgICAgIHByZXYgJiZcbiAgICAgICAgICAgICAgICBwcmV2ICE9PSAnICcgJiZcbiAgICAgICAgICAgICAgICBwcmV2ICE9PSAnXFxuJyAmJlxuICAgICAgICAgICAgICAgIHByZXYgIT09ICdcXHQnKSB7XG4gICAgICAgICAgICAgICAgLy8gc3BhY2Ugc3Vycm91bmRlZCBieSBub24tc3BhY2UgY2FuIGJlIHJlcGxhY2VkIHdpdGggbmV3bGluZSArIGluZGVudFxuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB0ZXh0W2kgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCAmJiBuZXh0ICE9PSAnICcgJiYgbmV4dCAhPT0gJ1xcbicgJiYgbmV4dCAhPT0gJ1xcdCcpXG4gICAgICAgICAgICAgICAgICAgIHNwbGl0ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpID49IGVuZCkge1xuICAgICAgICAgICAgICAgIGlmIChzcGxpdCkge1xuICAgICAgICAgICAgICAgICAgICBmb2xkcy5wdXNoKHNwbGl0KTtcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gc3BsaXQgKyBlbmRTdGVwO1xuICAgICAgICAgICAgICAgICAgICBzcGxpdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobW9kZSA9PT0gRk9MRF9RVU9URUQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hpdGUtc3BhY2UgY29sbGVjdGVkIGF0IGVuZCBtYXkgc3RyZXRjaCBwYXN0IGxpbmVXaWR0aFxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAocHJldiA9PT0gJyAnIHx8IHByZXYgPT09ICdcXHQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2ID0gY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9IHRleHRbKGkgKz0gMSldO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIEFjY291bnQgZm9yIG5ld2xpbmUgZXNjYXBlLCBidXQgZG9uJ3QgYnJlYWsgcHJlY2VkaW5nIGVzY2FwZVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBqID0gaSA+IGVzY0VuZCArIDEgPyBpIC0gMiA6IGVzY1N0YXJ0IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQmFpbCBvdXQgaWYgbGluZVdpZHRoICYgbWluQ29udGVudFdpZHRoIGFyZSBzaG9ydGVyIHRoYW4gYW4gZXNjYXBlIHN0cmluZ1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXNjYXBlZEZvbGRzW2pdKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgICAgICAgICAgICAgIGZvbGRzLnB1c2goaik7XG4gICAgICAgICAgICAgICAgICAgIGVzY2FwZWRGb2xkc1tqXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IGogKyBlbmRTdGVwO1xuICAgICAgICAgICAgICAgICAgICBzcGxpdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJldiA9IGNoO1xuICAgIH1cbiAgICBpZiAob3ZlcmZsb3cgJiYgb25PdmVyZmxvdylcbiAgICAgICAgb25PdmVyZmxvdygpO1xuICAgIGlmIChmb2xkcy5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIGlmIChvbkZvbGQpXG4gICAgICAgIG9uRm9sZCgpO1xuICAgIGxldCByZXMgPSB0ZXh0LnNsaWNlKDAsIGZvbGRzWzBdKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZvbGRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IGZvbGQgPSBmb2xkc1tpXTtcbiAgICAgICAgY29uc3QgZW5kID0gZm9sZHNbaSArIDFdIHx8IHRleHQubGVuZ3RoO1xuICAgICAgICBpZiAoZm9sZCA9PT0gMClcbiAgICAgICAgICAgIHJlcyA9IGBcXG4ke2luZGVudH0ke3RleHQuc2xpY2UoMCwgZW5kKX1gO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtb2RlID09PSBGT0xEX1FVT1RFRCAmJiBlc2NhcGVkRm9sZHNbZm9sZF0pXG4gICAgICAgICAgICAgICAgcmVzICs9IGAke3RleHRbZm9sZF19XFxcXGA7XG4gICAgICAgICAgICByZXMgKz0gYFxcbiR7aW5kZW50fSR7dGV4dC5zbGljZShmb2xkICsgMSwgZW5kKX1gO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXM7XG59XG4vKipcbiAqIFByZXN1bWVzIGBpICsgMWAgaXMgYXQgdGhlIHN0YXJ0IG9mIGEgbGluZVxuICogQHJldHVybnMgaW5kZXggb2YgbGFzdCBuZXdsaW5lIGluIG1vcmUtaW5kZW50ZWQgYmxvY2tcbiAqL1xuZnVuY3Rpb24gY29uc3VtZU1vcmVJbmRlbnRlZExpbmVzKHRleHQsIGksIGluZGVudCkge1xuICAgIGxldCBlbmQgPSBpO1xuICAgIGxldCBzdGFydCA9IGkgKyAxO1xuICAgIGxldCBjaCA9IHRleHRbc3RhcnRdO1xuICAgIHdoaWxlIChjaCA9PT0gJyAnIHx8IGNoID09PSAnXFx0Jykge1xuICAgICAgICBpZiAoaSA8IHN0YXJ0ICsgaW5kZW50KSB7XG4gICAgICAgICAgICBjaCA9IHRleHRbKytpXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBjaCA9IHRleHRbKytpXTtcbiAgICAgICAgICAgIH0gd2hpbGUgKGNoICYmIGNoICE9PSAnXFxuJyk7XG4gICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGNoID0gdGV4dFtzdGFydF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVuZDtcbn1cblxuZXhwb3J0IHsgRk9MRF9CTE9DSywgRk9MRF9GTE9XLCBGT0xEX1FVT1RFRCwgZm9sZEZsb3dMaW5lcyB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uL25vZGVzL1NjYWxhci5qcyc7XG5pbXBvcnQgeyBmb2xkRmxvd0xpbmVzLCBGT0xEX0ZMT1csIEZPTERfUVVPVEVELCBGT0xEX0JMT0NLIH0gZnJvbSAnLi9mb2xkRmxvd0xpbmVzLmpzJztcblxuY29uc3QgZ2V0Rm9sZE9wdGlvbnMgPSAoY3R4LCBpc0Jsb2NrKSA9PiAoe1xuICAgIGluZGVudEF0U3RhcnQ6IGlzQmxvY2sgPyBjdHguaW5kZW50Lmxlbmd0aCA6IGN0eC5pbmRlbnRBdFN0YXJ0LFxuICAgIGxpbmVXaWR0aDogY3R4Lm9wdGlvbnMubGluZVdpZHRoLFxuICAgIG1pbkNvbnRlbnRXaWR0aDogY3R4Lm9wdGlvbnMubWluQ29udGVudFdpZHRoXG59KTtcbi8vIEFsc28gY2hlY2tzIGZvciBsaW5lcyBzdGFydGluZyB3aXRoICUsIGFzIHBhcnNpbmcgdGhlIG91dHB1dCBhcyBZQU1MIDEuMSB3aWxsXG4vLyBwcmVzdW1lIHRoYXQncyBzdGFydGluZyBhIG5ldyBkb2N1bWVudC5cbmNvbnN0IGNvbnRhaW5zRG9jdW1lbnRNYXJrZXIgPSAoc3RyKSA9PiAvXiglfC0tLXxcXC5cXC5cXC4pL20udGVzdChzdHIpO1xuZnVuY3Rpb24gbGluZUxlbmd0aE92ZXJMaW1pdChzdHIsIGxpbmVXaWR0aCwgaW5kZW50TGVuZ3RoKSB7XG4gICAgaWYgKCFsaW5lV2lkdGggfHwgbGluZVdpZHRoIDwgMClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGxpbWl0ID0gbGluZVdpZHRoIC0gaW5kZW50TGVuZ3RoO1xuICAgIGNvbnN0IHN0ckxlbiA9IHN0ci5sZW5ndGg7XG4gICAgaWYgKHN0ckxlbiA8PSBsaW1pdClcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwLCBzdGFydCA9IDA7IGkgPCBzdHJMZW47ICsraSkge1xuICAgICAgICBpZiAoc3RyW2ldID09PSAnXFxuJykge1xuICAgICAgICAgICAgaWYgKGkgLSBzdGFydCA+IGxpbWl0KVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgIGlmIChzdHJMZW4gLSBzdGFydCA8PSBsaW1pdClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiBkb3VibGVRdW90ZWRTdHJpbmcodmFsdWUsIGN0eCkge1xuICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgaWYgKGN0eC5vcHRpb25zLmRvdWJsZVF1b3RlZEFzSlNPTilcbiAgICAgICAgcmV0dXJuIGpzb247XG4gICAgY29uc3QgeyBpbXBsaWNpdEtleSB9ID0gY3R4O1xuICAgIGNvbnN0IG1pbk11bHRpTGluZUxlbmd0aCA9IGN0eC5vcHRpb25zLmRvdWJsZVF1b3RlZE1pbk11bHRpTGluZUxlbmd0aDtcbiAgICBjb25zdCBpbmRlbnQgPSBjdHguaW5kZW50IHx8IChjb250YWluc0RvY3VtZW50TWFya2VyKHZhbHVlKSA/ICcgICcgOiAnJyk7XG4gICAgbGV0IHN0ciA9ICcnO1xuICAgIGxldCBzdGFydCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDAsIGNoID0ganNvbltpXTsgY2g7IGNoID0ganNvblsrK2ldKSB7XG4gICAgICAgIGlmIChjaCA9PT0gJyAnICYmIGpzb25baSArIDFdID09PSAnXFxcXCcgJiYganNvbltpICsgMl0gPT09ICduJykge1xuICAgICAgICAgICAgLy8gc3BhY2UgYmVmb3JlIG5ld2xpbmUgbmVlZHMgdG8gYmUgZXNjYXBlZCB0byBub3QgYmUgZm9sZGVkXG4gICAgICAgICAgICBzdHIgKz0ganNvbi5zbGljZShzdGFydCwgaSkgKyAnXFxcXCAnO1xuICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgc3RhcnQgPSBpO1xuICAgICAgICAgICAgY2ggPSAnXFxcXCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoID09PSAnXFxcXCcpXG4gICAgICAgICAgICBzd2l0Y2ggKGpzb25baSArIDFdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndSc6XG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBqc29uLnNsaWNlKHN0YXJ0LCBpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBqc29uLnN1YnN0cihpICsgMiwgNCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGNvZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcwMDAwJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxcMCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJzAwMDcnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFxhJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnMDAwYic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxcXHYnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcwMDFiJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxcZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJzAwODUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFxOJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnMDBhMCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxcXF8nO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcyMDI4JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxcTCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJzIwMjknOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFxQJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUuc3Vic3RyKDAsIDIpID09PSAnMDAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxceCcgKyBjb2RlLnN1YnN0cigyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGpzb24uc3Vic3RyKGksIDYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaSArPSA1O1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICduJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGltcGxpY2l0S2V5IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uW2kgKyAyXSA9PT0gJ1wiJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAganNvbi5sZW5ndGggPCBtaW5NdWx0aUxpbmVMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZvbGRpbmcgd2lsbCBlYXQgZmlyc3QgbmV3bGluZVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGpzb24uc2xpY2Uoc3RhcnQsIGkpICsgJ1xcblxcbic7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoanNvbltpICsgMl0gPT09ICdcXFxcJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpzb25baSArIDNdID09PSAnbicgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uW2kgKyA0XSAhPT0gJ1wiJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxuJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gaW5kZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3BhY2UgYWZ0ZXIgbmV3bGluZSBuZWVkcyB0byBiZSBlc2NhcGVkIHRvIG5vdCBiZSBmb2xkZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChqc29uW2kgKyAyXSA9PT0gJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxcXCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICB9XG4gICAgc3RyID0gc3RhcnQgPyBzdHIgKyBqc29uLnNsaWNlKHN0YXJ0KSA6IGpzb247XG4gICAgcmV0dXJuIGltcGxpY2l0S2V5XG4gICAgICAgID8gc3RyXG4gICAgICAgIDogZm9sZEZsb3dMaW5lcyhzdHIsIGluZGVudCwgRk9MRF9RVU9URUQsIGdldEZvbGRPcHRpb25zKGN0eCwgZmFsc2UpKTtcbn1cbmZ1bmN0aW9uIHNpbmdsZVF1b3RlZFN0cmluZyh2YWx1ZSwgY3R4KSB7XG4gICAgaWYgKGN0eC5vcHRpb25zLnNpbmdsZVF1b3RlID09PSBmYWxzZSB8fFxuICAgICAgICAoY3R4LmltcGxpY2l0S2V5ICYmIHZhbHVlLmluY2x1ZGVzKCdcXG4nKSkgfHxcbiAgICAgICAgL1sgXFx0XVxcbnxcXG5bIFxcdF0vLnRlc3QodmFsdWUpIC8vIHNpbmdsZSBxdW90ZWQgc3RyaW5nIGNhbid0IGhhdmUgbGVhZGluZyBvciB0cmFpbGluZyB3aGl0ZXNwYWNlIGFyb3VuZCBuZXdsaW5lXG4gICAgKVxuICAgICAgICByZXR1cm4gZG91YmxlUXVvdGVkU3RyaW5nKHZhbHVlLCBjdHgpO1xuICAgIGNvbnN0IGluZGVudCA9IGN0eC5pbmRlbnQgfHwgKGNvbnRhaW5zRG9jdW1lbnRNYXJrZXIodmFsdWUpID8gJyAgJyA6ICcnKTtcbiAgICBjb25zdCByZXMgPSBcIidcIiArIHZhbHVlLnJlcGxhY2UoLycvZywgXCInJ1wiKS5yZXBsYWNlKC9cXG4rL2csIGAkJlxcbiR7aW5kZW50fWApICsgXCInXCI7XG4gICAgcmV0dXJuIGN0eC5pbXBsaWNpdEtleVxuICAgICAgICA/IHJlc1xuICAgICAgICA6IGZvbGRGbG93TGluZXMocmVzLCBpbmRlbnQsIEZPTERfRkxPVywgZ2V0Rm9sZE9wdGlvbnMoY3R4LCBmYWxzZSkpO1xufVxuZnVuY3Rpb24gcXVvdGVkU3RyaW5nKHZhbHVlLCBjdHgpIHtcbiAgICBjb25zdCB7IHNpbmdsZVF1b3RlIH0gPSBjdHgub3B0aW9ucztcbiAgICBsZXQgcXM7XG4gICAgaWYgKHNpbmdsZVF1b3RlID09PSBmYWxzZSlcbiAgICAgICAgcXMgPSBkb3VibGVRdW90ZWRTdHJpbmc7XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IGhhc0RvdWJsZSA9IHZhbHVlLmluY2x1ZGVzKCdcIicpO1xuICAgICAgICBjb25zdCBoYXNTaW5nbGUgPSB2YWx1ZS5pbmNsdWRlcyhcIidcIik7XG4gICAgICAgIGlmIChoYXNEb3VibGUgJiYgIWhhc1NpbmdsZSlcbiAgICAgICAgICAgIHFzID0gc2luZ2xlUXVvdGVkU3RyaW5nO1xuICAgICAgICBlbHNlIGlmIChoYXNTaW5nbGUgJiYgIWhhc0RvdWJsZSlcbiAgICAgICAgICAgIHFzID0gZG91YmxlUXVvdGVkU3RyaW5nO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBxcyA9IHNpbmdsZVF1b3RlID8gc2luZ2xlUXVvdGVkU3RyaW5nIDogZG91YmxlUXVvdGVkU3RyaW5nO1xuICAgIH1cbiAgICByZXR1cm4gcXModmFsdWUsIGN0eCk7XG59XG4vLyBUaGUgbmVnYXRpdmUgbG9va2JlaGluZCBhdm9pZHMgYSBwb2x5bm9taWFsIHNlYXJjaCxcbi8vIGJ1dCBpc24ndCBzdXBwb3J0ZWQgeWV0IG9uIFNhZmFyaTogaHR0cHM6Ly9jYW5pdXNlLmNvbS9qcy1yZWdleHAtbG9va2JlaGluZFxubGV0IGJsb2NrRW5kTmV3bGluZXM7XG50cnkge1xuICAgIGJsb2NrRW5kTmV3bGluZXMgPSBuZXcgUmVnRXhwKCcoXnwoPzwhXFxuKSlcXG4rKD8hXFxufCQpJywgJ2cnKTtcbn1cbmNhdGNoIHtcbiAgICBibG9ja0VuZE5ld2xpbmVzID0gL1xcbisoPyFcXG58JCkvZztcbn1cbmZ1bmN0aW9uIGJsb2NrU3RyaW5nKHsgY29tbWVudCwgdHlwZSwgdmFsdWUgfSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgY29uc3QgeyBibG9ja1F1b3RlLCBjb21tZW50U3RyaW5nLCBsaW5lV2lkdGggfSA9IGN0eC5vcHRpb25zO1xuICAgIC8vIDEuIEJsb2NrIGNhbid0IGVuZCBpbiB3aGl0ZXNwYWNlIHVubGVzcyB0aGUgbGFzdCBsaW5lIGlzIG5vbi1lbXB0eS5cbiAgICAvLyAyLiBTdHJpbmdzIGNvbnNpc3Rpbmcgb2Ygb25seSB3aGl0ZXNwYWNlIGFyZSBiZXN0IHJlbmRlcmVkIGV4cGxpY2l0bHkuXG4gICAgaWYgKCFibG9ja1F1b3RlIHx8IC9cXG5bXFx0IF0rJC8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHF1b3RlZFN0cmluZyh2YWx1ZSwgY3R4KTtcbiAgICB9XG4gICAgY29uc3QgaW5kZW50ID0gY3R4LmluZGVudCB8fFxuICAgICAgICAoY3R4LmZvcmNlQmxvY2tJbmRlbnQgfHwgY29udGFpbnNEb2N1bWVudE1hcmtlcih2YWx1ZSkgPyAnICAnIDogJycpO1xuICAgIGNvbnN0IGxpdGVyYWwgPSBibG9ja1F1b3RlID09PSAnbGl0ZXJhbCdcbiAgICAgICAgPyB0cnVlXG4gICAgICAgIDogYmxvY2tRdW90ZSA9PT0gJ2ZvbGRlZCcgfHwgdHlwZSA9PT0gU2NhbGFyLkJMT0NLX0ZPTERFRFxuICAgICAgICAgICAgPyBmYWxzZVxuICAgICAgICAgICAgOiB0eXBlID09PSBTY2FsYXIuQkxPQ0tfTElURVJBTFxuICAgICAgICAgICAgICAgID8gdHJ1ZVxuICAgICAgICAgICAgICAgIDogIWxpbmVMZW5ndGhPdmVyTGltaXQodmFsdWUsIGxpbmVXaWR0aCwgaW5kZW50Lmxlbmd0aCk7XG4gICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgcmV0dXJuIGxpdGVyYWwgPyAnfFxcbicgOiAnPlxcbic7XG4gICAgLy8gZGV0ZXJtaW5lIGNob21waW5nIGZyb20gd2hpdGVzcGFjZSBhdCB2YWx1ZSBlbmRcbiAgICBsZXQgY2hvbXA7XG4gICAgbGV0IGVuZFN0YXJ0O1xuICAgIGZvciAoZW5kU3RhcnQgPSB2YWx1ZS5sZW5ndGg7IGVuZFN0YXJ0ID4gMDsgLS1lbmRTdGFydCkge1xuICAgICAgICBjb25zdCBjaCA9IHZhbHVlW2VuZFN0YXJ0IC0gMV07XG4gICAgICAgIGlmIChjaCAhPT0gJ1xcbicgJiYgY2ggIT09ICdcXHQnICYmIGNoICE9PSAnICcpXG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgbGV0IGVuZCA9IHZhbHVlLnN1YnN0cmluZyhlbmRTdGFydCk7XG4gICAgY29uc3QgZW5kTmxQb3MgPSBlbmQuaW5kZXhPZignXFxuJyk7XG4gICAgaWYgKGVuZE5sUG9zID09PSAtMSkge1xuICAgICAgICBjaG9tcCA9ICctJzsgLy8gc3RyaXBcbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWUgPT09IGVuZCB8fCBlbmRObFBvcyAhPT0gZW5kLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgY2hvbXAgPSAnKyc7IC8vIGtlZXBcbiAgICAgICAgaWYgKG9uQ2hvbXBLZWVwKVxuICAgICAgICAgICAgb25DaG9tcEtlZXAoKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNob21wID0gJyc7IC8vIGNsaXBcbiAgICB9XG4gICAgaWYgKGVuZCkge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIC1lbmQubGVuZ3RoKTtcbiAgICAgICAgaWYgKGVuZFtlbmQubGVuZ3RoIC0gMV0gPT09ICdcXG4nKVxuICAgICAgICAgICAgZW5kID0gZW5kLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgZW5kID0gZW5kLnJlcGxhY2UoYmxvY2tFbmROZXdsaW5lcywgYCQmJHtpbmRlbnR9YCk7XG4gICAgfVxuICAgIC8vIGRldGVybWluZSBpbmRlbnQgaW5kaWNhdG9yIGZyb20gd2hpdGVzcGFjZSBhdCB2YWx1ZSBzdGFydFxuICAgIGxldCBzdGFydFdpdGhTcGFjZSA9IGZhbHNlO1xuICAgIGxldCBzdGFydEVuZDtcbiAgICBsZXQgc3RhcnRObFBvcyA9IC0xO1xuICAgIGZvciAoc3RhcnRFbmQgPSAwOyBzdGFydEVuZCA8IHZhbHVlLmxlbmd0aDsgKytzdGFydEVuZCkge1xuICAgICAgICBjb25zdCBjaCA9IHZhbHVlW3N0YXJ0RW5kXTtcbiAgICAgICAgaWYgKGNoID09PSAnICcpXG4gICAgICAgICAgICBzdGFydFdpdGhTcGFjZSA9IHRydWU7XG4gICAgICAgIGVsc2UgaWYgKGNoID09PSAnXFxuJylcbiAgICAgICAgICAgIHN0YXJ0TmxQb3MgPSBzdGFydEVuZDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxldCBzdGFydCA9IHZhbHVlLnN1YnN0cmluZygwLCBzdGFydE5sUG9zIDwgc3RhcnRFbmQgPyBzdGFydE5sUG9zICsgMSA6IHN0YXJ0RW5kKTtcbiAgICBpZiAoc3RhcnQpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zdWJzdHJpbmcoc3RhcnQubGVuZ3RoKTtcbiAgICAgICAgc3RhcnQgPSBzdGFydC5yZXBsYWNlKC9cXG4rL2csIGAkJiR7aW5kZW50fWApO1xuICAgIH1cbiAgICBjb25zdCBpbmRlbnRTaXplID0gaW5kZW50ID8gJzInIDogJzEnOyAvLyByb290IGlzIGF0IC0xXG4gICAgLy8gTGVhZGluZyB8IG9yID4gaXMgYWRkZWQgbGF0ZXJcbiAgICBsZXQgaGVhZGVyID0gKHN0YXJ0V2l0aFNwYWNlID8gaW5kZW50U2l6ZSA6ICcnKSArIGNob21wO1xuICAgIGlmIChjb21tZW50KSB7XG4gICAgICAgIGhlYWRlciArPSAnICcgKyBjb21tZW50U3RyaW5nKGNvbW1lbnQucmVwbGFjZSgvID9bXFxyXFxuXSsvZywgJyAnKSk7XG4gICAgICAgIGlmIChvbkNvbW1lbnQpXG4gICAgICAgICAgICBvbkNvbW1lbnQoKTtcbiAgICB9XG4gICAgaWYgKCFsaXRlcmFsKSB7XG4gICAgICAgIGNvbnN0IGZvbGRlZFZhbHVlID0gdmFsdWVcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXG4rL2csICdcXG4kJicpXG4gICAgICAgICAgICAucmVwbGFjZSgvKD86XnxcXG4pKFtcXHQgXS4qKSg/OihbXFxuXFx0IF0qKVxcbig/IVtcXG5cXHQgXSkpPy9nLCAnJDEkMicpIC8vIG1vcmUtaW5kZW50ZWQgbGluZXMgYXJlbid0IGZvbGRlZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgXiBtb3JlLWluZC4gXiBlbXB0eSAgICAgXiBjYXB0dXJlIG5leHQgZW1wdHkgbGluZXMgb25seSBhdCBlbmQgb2YgaW5kZW50XG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuKy9nLCBgJCYke2luZGVudH1gKTtcbiAgICAgICAgbGV0IGxpdGVyYWxGYWxsYmFjayA9IGZhbHNlO1xuICAgICAgICBjb25zdCBmb2xkT3B0aW9ucyA9IGdldEZvbGRPcHRpb25zKGN0eCwgdHJ1ZSk7XG4gICAgICAgIGlmIChibG9ja1F1b3RlICE9PSAnZm9sZGVkJyAmJiB0eXBlICE9PSBTY2FsYXIuQkxPQ0tfRk9MREVEKSB7XG4gICAgICAgICAgICBmb2xkT3B0aW9ucy5vbk92ZXJmbG93ID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxpdGVyYWxGYWxsYmFjayA9IHRydWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJvZHkgPSBmb2xkRmxvd0xpbmVzKGAke3N0YXJ0fSR7Zm9sZGVkVmFsdWV9JHtlbmR9YCwgaW5kZW50LCBGT0xEX0JMT0NLLCBmb2xkT3B0aW9ucyk7XG4gICAgICAgIGlmICghbGl0ZXJhbEZhbGxiYWNrKVxuICAgICAgICAgICAgcmV0dXJuIGA+JHtoZWFkZXJ9XFxuJHtpbmRlbnR9JHtib2R5fWA7XG4gICAgfVxuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxuKy9nLCBgJCYke2luZGVudH1gKTtcbiAgICByZXR1cm4gYHwke2hlYWRlcn1cXG4ke2luZGVudH0ke3N0YXJ0fSR7dmFsdWV9JHtlbmR9YDtcbn1cbmZ1bmN0aW9uIHBsYWluU3RyaW5nKGl0ZW0sIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCkge1xuICAgIGNvbnN0IHsgdHlwZSwgdmFsdWUgfSA9IGl0ZW07XG4gICAgY29uc3QgeyBhY3R1YWxTdHJpbmcsIGltcGxpY2l0S2V5LCBpbmRlbnQsIGluZGVudFN0ZXAsIGluRmxvdyB9ID0gY3R4O1xuICAgIGlmICgoaW1wbGljaXRLZXkgJiYgdmFsdWUuaW5jbHVkZXMoJ1xcbicpKSB8fFxuICAgICAgICAoaW5GbG93ICYmIC9bW1xcXXt9LF0vLnRlc3QodmFsdWUpKSkge1xuICAgICAgICByZXR1cm4gcXVvdGVkU3RyaW5nKHZhbHVlLCBjdHgpO1xuICAgIH1cbiAgICBpZiAoL15bXFxuXFx0ICxbXFxde30jJiohfD4nXCIlQGBdfF5bPy1dJHxeWz8tXVsgXFx0XXxbXFxuOl1bIFxcdF18WyBcXHRdXFxufFtcXG5cXHQgXSN8W1xcblxcdCA6XSQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIC8vIG5vdCBhbGxvd2VkOlxuICAgICAgICAvLyAtICctJyBvciAnPydcbiAgICAgICAgLy8gLSBzdGFydCB3aXRoIGFuIGluZGljYXRvciBjaGFyYWN0ZXIgKGV4Y2VwdCBbPzotXSkgb3IgL1s/LV0gL1xuICAgICAgICAvLyAtICdcXG4gJywgJzogJyBvciAnIFxcbicgYW55d2hlcmVcbiAgICAgICAgLy8gLSAnIycgbm90IHByZWNlZGVkIGJ5IGEgbm9uLXNwYWNlIGNoYXJcbiAgICAgICAgLy8gLSBlbmQgd2l0aCAnICcgb3IgJzonXG4gICAgICAgIHJldHVybiBpbXBsaWNpdEtleSB8fCBpbkZsb3cgfHwgIXZhbHVlLmluY2x1ZGVzKCdcXG4nKVxuICAgICAgICAgICAgPyBxdW90ZWRTdHJpbmcodmFsdWUsIGN0eClcbiAgICAgICAgICAgIDogYmxvY2tTdHJpbmcoaXRlbSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKTtcbiAgICB9XG4gICAgaWYgKCFpbXBsaWNpdEtleSAmJlxuICAgICAgICAhaW5GbG93ICYmXG4gICAgICAgIHR5cGUgIT09IFNjYWxhci5QTEFJTiAmJlxuICAgICAgICB2YWx1ZS5pbmNsdWRlcygnXFxuJykpIHtcbiAgICAgICAgLy8gV2hlcmUgYWxsb3dlZCAmIHR5cGUgbm90IHNldCBleHBsaWNpdGx5LCBwcmVmZXIgYmxvY2sgc3R5bGUgZm9yIG11bHRpbGluZSBzdHJpbmdzXG4gICAgICAgIHJldHVybiBibG9ja1N0cmluZyhpdGVtLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApO1xuICAgIH1cbiAgICBpZiAoY29udGFpbnNEb2N1bWVudE1hcmtlcih2YWx1ZSkpIHtcbiAgICAgICAgaWYgKGluZGVudCA9PT0gJycpIHtcbiAgICAgICAgICAgIGN0eC5mb3JjZUJsb2NrSW5kZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBibG9ja1N0cmluZyhpdGVtLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGltcGxpY2l0S2V5ICYmIGluZGVudCA9PT0gaW5kZW50U3RlcCkge1xuICAgICAgICAgICAgcmV0dXJuIHF1b3RlZFN0cmluZyh2YWx1ZSwgY3R4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBzdHIgPSB2YWx1ZS5yZXBsYWNlKC9cXG4rL2csIGAkJlxcbiR7aW5kZW50fWApO1xuICAgIC8vIFZlcmlmeSB0aGF0IG91dHB1dCB3aWxsIGJlIHBhcnNlZCBhcyBhIHN0cmluZywgYXMgZS5nLiBwbGFpbiBudW1iZXJzIGFuZFxuICAgIC8vIGJvb2xlYW5zIGdldCBwYXJzZWQgd2l0aCB0aG9zZSB0eXBlcyBpbiB2MS4yIChlLmcuICc0MicsICd0cnVlJyAmICcwLjllLTMnKSxcbiAgICAvLyBhbmQgb3RoZXJzIGluIHYxLjEuXG4gICAgaWYgKGFjdHVhbFN0cmluZykge1xuICAgICAgICBjb25zdCB0ZXN0ID0gKHRhZykgPT4gdGFnLmRlZmF1bHQgJiYgdGFnLnRhZyAhPT0gJ3RhZzp5YW1sLm9yZywyMDAyOnN0cicgJiYgdGFnLnRlc3Q/LnRlc3Qoc3RyKTtcbiAgICAgICAgY29uc3QgeyBjb21wYXQsIHRhZ3MgfSA9IGN0eC5kb2Muc2NoZW1hO1xuICAgICAgICBpZiAodGFncy5zb21lKHRlc3QpIHx8IGNvbXBhdD8uc29tZSh0ZXN0KSlcbiAgICAgICAgICAgIHJldHVybiBxdW90ZWRTdHJpbmcodmFsdWUsIGN0eCk7XG4gICAgfVxuICAgIHJldHVybiBpbXBsaWNpdEtleVxuICAgICAgICA/IHN0clxuICAgICAgICA6IGZvbGRGbG93TGluZXMoc3RyLCBpbmRlbnQsIEZPTERfRkxPVywgZ2V0Rm9sZE9wdGlvbnMoY3R4LCBmYWxzZSkpO1xufVxuZnVuY3Rpb24gc3RyaW5naWZ5U3RyaW5nKGl0ZW0sIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCkge1xuICAgIGNvbnN0IHsgaW1wbGljaXRLZXksIGluRmxvdyB9ID0gY3R4O1xuICAgIGNvbnN0IHNzID0gdHlwZW9mIGl0ZW0udmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICAgID8gaXRlbVxuICAgICAgICA6IE9iamVjdC5hc3NpZ24oe30sIGl0ZW0sIHsgdmFsdWU6IFN0cmluZyhpdGVtLnZhbHVlKSB9KTtcbiAgICBsZXQgeyB0eXBlIH0gPSBpdGVtO1xuICAgIGlmICh0eXBlICE9PSBTY2FsYXIuUVVPVEVfRE9VQkxFKSB7XG4gICAgICAgIC8vIGZvcmNlIGRvdWJsZSBxdW90ZXMgb24gY29udHJvbCBjaGFyYWN0ZXJzICYgdW5wYWlyZWQgc3Vycm9nYXRlc1xuICAgICAgICBpZiAoL1tcXHgwMC1cXHgwOFxceDBiLVxceDFmXFx4N2YtXFx4OWZcXHV7RDgwMH0tXFx1e0RGRkZ9XS91LnRlc3Qoc3MudmFsdWUpKVxuICAgICAgICAgICAgdHlwZSA9IFNjYWxhci5RVU9URV9ET1VCTEU7XG4gICAgfVxuICAgIGNvbnN0IF9zdHJpbmdpZnkgPSAoX3R5cGUpID0+IHtcbiAgICAgICAgc3dpdGNoIChfdHlwZSkge1xuICAgICAgICAgICAgY2FzZSBTY2FsYXIuQkxPQ0tfRk9MREVEOlxuICAgICAgICAgICAgY2FzZSBTY2FsYXIuQkxPQ0tfTElURVJBTDpcbiAgICAgICAgICAgICAgICByZXR1cm4gaW1wbGljaXRLZXkgfHwgaW5GbG93XG4gICAgICAgICAgICAgICAgICAgID8gcXVvdGVkU3RyaW5nKHNzLnZhbHVlLCBjdHgpIC8vIGJsb2NrcyBhcmUgbm90IHZhbGlkIGluc2lkZSBmbG93IGNvbnRhaW5lcnNcbiAgICAgICAgICAgICAgICAgICAgOiBibG9ja1N0cmluZyhzcywgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKTtcbiAgICAgICAgICAgIGNhc2UgU2NhbGFyLlFVT1RFX0RPVUJMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gZG91YmxlUXVvdGVkU3RyaW5nKHNzLnZhbHVlLCBjdHgpO1xuICAgICAgICAgICAgY2FzZSBTY2FsYXIuUVVPVEVfU0lOR0xFOlxuICAgICAgICAgICAgICAgIHJldHVybiBzaW5nbGVRdW90ZWRTdHJpbmcoc3MudmFsdWUsIGN0eCk7XG4gICAgICAgICAgICBjYXNlIFNjYWxhci5QTEFJTjpcbiAgICAgICAgICAgICAgICByZXR1cm4gcGxhaW5TdHJpbmcoc3MsIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBsZXQgcmVzID0gX3N0cmluZ2lmeSh0eXBlKTtcbiAgICBpZiAocmVzID09PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IHsgZGVmYXVsdEtleVR5cGUsIGRlZmF1bHRTdHJpbmdUeXBlIH0gPSBjdHgub3B0aW9ucztcbiAgICAgICAgY29uc3QgdCA9IChpbXBsaWNpdEtleSAmJiBkZWZhdWx0S2V5VHlwZSkgfHwgZGVmYXVsdFN0cmluZ1R5cGU7XG4gICAgICAgIHJlcyA9IF9zdHJpbmdpZnkodCk7XG4gICAgICAgIGlmIChyZXMgPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIGRlZmF1bHQgc3RyaW5nIHR5cGUgJHt0fWApO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgeyBzdHJpbmdpZnlTdHJpbmcgfTtcbiIsICJpbXBvcnQgeyBhbmNob3JJc1ZhbGlkIH0gZnJvbSAnLi4vZG9jL2FuY2hvcnMuanMnO1xuaW1wb3J0IHsgaXNQYWlyLCBpc0FsaWFzLCBpc05vZGUsIGlzU2NhbGFyLCBpc0NvbGxlY3Rpb24gfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnlDb21tZW50IH0gZnJvbSAnLi9zdHJpbmdpZnlDb21tZW50LmpzJztcbmltcG9ydCB7IHN0cmluZ2lmeVN0cmluZyB9IGZyb20gJy4vc3RyaW5naWZ5U3RyaW5nLmpzJztcblxuZnVuY3Rpb24gY3JlYXRlU3RyaW5naWZ5Q29udGV4dChkb2MsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBvcHQgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgYmxvY2tRdW90ZTogdHJ1ZSxcbiAgICAgICAgY29tbWVudFN0cmluZzogc3RyaW5naWZ5Q29tbWVudCxcbiAgICAgICAgZGVmYXVsdEtleVR5cGU6IG51bGwsXG4gICAgICAgIGRlZmF1bHRTdHJpbmdUeXBlOiAnUExBSU4nLFxuICAgICAgICBkaXJlY3RpdmVzOiBudWxsLFxuICAgICAgICBkb3VibGVRdW90ZWRBc0pTT046IGZhbHNlLFxuICAgICAgICBkb3VibGVRdW90ZWRNaW5NdWx0aUxpbmVMZW5ndGg6IDQwLFxuICAgICAgICBmYWxzZVN0cjogJ2ZhbHNlJyxcbiAgICAgICAgZmxvd0NvbGxlY3Rpb25QYWRkaW5nOiB0cnVlLFxuICAgICAgICBpbmRlbnRTZXE6IHRydWUsXG4gICAgICAgIGxpbmVXaWR0aDogODAsXG4gICAgICAgIG1pbkNvbnRlbnRXaWR0aDogMjAsXG4gICAgICAgIG51bGxTdHI6ICdudWxsJyxcbiAgICAgICAgc2ltcGxlS2V5czogZmFsc2UsXG4gICAgICAgIHNpbmdsZVF1b3RlOiBudWxsLFxuICAgICAgICB0cmFpbGluZ0NvbW1hOiBmYWxzZSxcbiAgICAgICAgdHJ1ZVN0cjogJ3RydWUnLFxuICAgICAgICB2ZXJpZnlBbGlhc09yZGVyOiB0cnVlXG4gICAgfSwgZG9jLnNjaGVtYS50b1N0cmluZ09wdGlvbnMsIG9wdGlvbnMpO1xuICAgIGxldCBpbkZsb3c7XG4gICAgc3dpdGNoIChvcHQuY29sbGVjdGlvblN0eWxlKSB7XG4gICAgICAgIGNhc2UgJ2Jsb2NrJzpcbiAgICAgICAgICAgIGluRmxvdyA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Zsb3cnOlxuICAgICAgICAgICAgaW5GbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaW5GbG93ID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYW5jaG9yczogbmV3IFNldCgpLFxuICAgICAgICBkb2MsXG4gICAgICAgIGZsb3dDb2xsZWN0aW9uUGFkZGluZzogb3B0LmZsb3dDb2xsZWN0aW9uUGFkZGluZyA/ICcgJyA6ICcnLFxuICAgICAgICBpbmRlbnQ6ICcnLFxuICAgICAgICBpbmRlbnRTdGVwOiB0eXBlb2Ygb3B0LmluZGVudCA9PT0gJ251bWJlcicgPyAnICcucmVwZWF0KG9wdC5pbmRlbnQpIDogJyAgJyxcbiAgICAgICAgaW5GbG93LFxuICAgICAgICBvcHRpb25zOiBvcHRcbiAgICB9O1xufVxuZnVuY3Rpb24gZ2V0VGFnT2JqZWN0KHRhZ3MsIGl0ZW0pIHtcbiAgICBpZiAoaXRlbS50YWcpIHtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB0YWdzLmZpbHRlcih0ID0+IHQudGFnID09PSBpdGVtLnRhZyk7XG4gICAgICAgIGlmIChtYXRjaC5sZW5ndGggPiAwKVxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoLmZpbmQodCA9PiB0LmZvcm1hdCA9PT0gaXRlbS5mb3JtYXQpID8/IG1hdGNoWzBdO1xuICAgIH1cbiAgICBsZXQgdGFnT2JqID0gdW5kZWZpbmVkO1xuICAgIGxldCBvYmo7XG4gICAgaWYgKGlzU2NhbGFyKGl0ZW0pKSB7XG4gICAgICAgIG9iaiA9IGl0ZW0udmFsdWU7XG4gICAgICAgIGxldCBtYXRjaCA9IHRhZ3MuZmlsdGVyKHQgPT4gdC5pZGVudGlmeT8uKG9iaikpO1xuICAgICAgICBpZiAobWF0Y2gubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgY29uc3QgdGVzdE1hdGNoID0gbWF0Y2guZmlsdGVyKHQgPT4gdC50ZXN0KTtcbiAgICAgICAgICAgIGlmICh0ZXN0TWF0Y2gubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICBtYXRjaCA9IHRlc3RNYXRjaDtcbiAgICAgICAgfVxuICAgICAgICB0YWdPYmogPVxuICAgICAgICAgICAgbWF0Y2guZmluZCh0ID0+IHQuZm9ybWF0ID09PSBpdGVtLmZvcm1hdCkgPz8gbWF0Y2guZmluZCh0ID0+ICF0LmZvcm1hdCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvYmogPSBpdGVtO1xuICAgICAgICB0YWdPYmogPSB0YWdzLmZpbmQodCA9PiB0Lm5vZGVDbGFzcyAmJiBvYmogaW5zdGFuY2VvZiB0Lm5vZGVDbGFzcyk7XG4gICAgfVxuICAgIGlmICghdGFnT2JqKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBvYmo/LmNvbnN0cnVjdG9yPy5uYW1lID8/IChvYmogPT09IG51bGwgPyAnbnVsbCcgOiB0eXBlb2Ygb2JqKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUYWcgbm90IHJlc29sdmVkIGZvciAke25hbWV9IHZhbHVlYCk7XG4gICAgfVxuICAgIHJldHVybiB0YWdPYmo7XG59XG4vLyBuZWVkcyB0byBiZSBjYWxsZWQgYmVmb3JlIHZhbHVlIHN0cmluZ2lmaWVyIHRvIGFsbG93IGZvciBjaXJjdWxhciBhbmNob3IgcmVmc1xuZnVuY3Rpb24gc3RyaW5naWZ5UHJvcHMobm9kZSwgdGFnT2JqLCB7IGFuY2hvcnMsIGRvYyB9KSB7XG4gICAgaWYgKCFkb2MuZGlyZWN0aXZlcylcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIGNvbnN0IHByb3BzID0gW107XG4gICAgY29uc3QgYW5jaG9yID0gKGlzU2NhbGFyKG5vZGUpIHx8IGlzQ29sbGVjdGlvbihub2RlKSkgJiYgbm9kZS5hbmNob3I7XG4gICAgaWYgKGFuY2hvciAmJiBhbmNob3JJc1ZhbGlkKGFuY2hvcikpIHtcbiAgICAgICAgYW5jaG9ycy5hZGQoYW5jaG9yKTtcbiAgICAgICAgcHJvcHMucHVzaChgJiR7YW5jaG9yfWApO1xuICAgIH1cbiAgICBjb25zdCB0YWcgPSBub2RlLnRhZyA/PyAodGFnT2JqLmRlZmF1bHQgPyBudWxsIDogdGFnT2JqLnRhZyk7XG4gICAgaWYgKHRhZylcbiAgICAgICAgcHJvcHMucHVzaChkb2MuZGlyZWN0aXZlcy50YWdTdHJpbmcodGFnKSk7XG4gICAgcmV0dXJuIHByb3BzLmpvaW4oJyAnKTtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeShpdGVtLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApIHtcbiAgICBpZiAoaXNQYWlyKGl0ZW0pKVxuICAgICAgICByZXR1cm4gaXRlbS50b1N0cmluZyhjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApO1xuICAgIGlmIChpc0FsaWFzKGl0ZW0pKSB7XG4gICAgICAgIGlmIChjdHguZG9jLmRpcmVjdGl2ZXMpXG4gICAgICAgICAgICByZXR1cm4gaXRlbS50b1N0cmluZyhjdHgpO1xuICAgICAgICBpZiAoY3R4LnJlc29sdmVkQWxpYXNlcz8uaGFzKGl0ZW0pKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBDYW5ub3Qgc3RyaW5naWZ5IGNpcmN1bGFyIHN0cnVjdHVyZSB3aXRob3V0IGFsaWFzIG5vZGVzYCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoY3R4LnJlc29sdmVkQWxpYXNlcylcbiAgICAgICAgICAgICAgICBjdHgucmVzb2x2ZWRBbGlhc2VzLmFkZChpdGVtKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjdHgucmVzb2x2ZWRBbGlhc2VzID0gbmV3IFNldChbaXRlbV0pO1xuICAgICAgICAgICAgaXRlbSA9IGl0ZW0ucmVzb2x2ZShjdHguZG9jKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgdGFnT2JqID0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IG5vZGUgPSBpc05vZGUoaXRlbSlcbiAgICAgICAgPyBpdGVtXG4gICAgICAgIDogY3R4LmRvYy5jcmVhdGVOb2RlKGl0ZW0sIHsgb25UYWdPYmo6IG8gPT4gKHRhZ09iaiA9IG8pIH0pO1xuICAgIHRhZ09iaiA/PyAodGFnT2JqID0gZ2V0VGFnT2JqZWN0KGN0eC5kb2Muc2NoZW1hLnRhZ3MsIG5vZGUpKTtcbiAgICBjb25zdCBwcm9wcyA9IHN0cmluZ2lmeVByb3BzKG5vZGUsIHRhZ09iaiwgY3R4KTtcbiAgICBpZiAocHJvcHMubGVuZ3RoID4gMClcbiAgICAgICAgY3R4LmluZGVudEF0U3RhcnQgPSAoY3R4LmluZGVudEF0U3RhcnQgPz8gMCkgKyBwcm9wcy5sZW5ndGggKyAxO1xuICAgIGNvbnN0IHN0ciA9IHR5cGVvZiB0YWdPYmouc3RyaW5naWZ5ID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gdGFnT2JqLnN0cmluZ2lmeShub2RlLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApXG4gICAgICAgIDogaXNTY2FsYXIobm9kZSlcbiAgICAgICAgICAgID8gc3RyaW5naWZ5U3RyaW5nKG5vZGUsIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcClcbiAgICAgICAgICAgIDogbm9kZS50b1N0cmluZyhjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApO1xuICAgIGlmICghcHJvcHMpXG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgcmV0dXJuIGlzU2NhbGFyKG5vZGUpIHx8IHN0clswXSA9PT0gJ3snIHx8IHN0clswXSA9PT0gJ1snXG4gICAgICAgID8gYCR7cHJvcHN9ICR7c3RyfWBcbiAgICAgICAgOiBgJHtwcm9wc31cXG4ke2N0eC5pbmRlbnR9JHtzdHJ9YDtcbn1cblxuZXhwb3J0IHsgY3JlYXRlU3RyaW5naWZ5Q29udGV4dCwgc3RyaW5naWZ5IH07XG4iLCAiaW1wb3J0IHsgaXNDb2xsZWN0aW9uLCBpc05vZGUsIGlzU2NhbGFyLCBpc1NlcSB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uL25vZGVzL1NjYWxhci5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5pbXBvcnQgeyBsaW5lQ29tbWVudCwgaW5kZW50Q29tbWVudCB9IGZyb20gJy4vc3RyaW5naWZ5Q29tbWVudC5qcyc7XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVBhaXIoeyBrZXksIHZhbHVlIH0sIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCkge1xuICAgIGNvbnN0IHsgYWxsTnVsbFZhbHVlcywgZG9jLCBpbmRlbnQsIGluZGVudFN0ZXAsIG9wdGlvbnM6IHsgY29tbWVudFN0cmluZywgaW5kZW50U2VxLCBzaW1wbGVLZXlzIH0gfSA9IGN0eDtcbiAgICBsZXQga2V5Q29tbWVudCA9IChpc05vZGUoa2V5KSAmJiBrZXkuY29tbWVudCkgfHwgbnVsbDtcbiAgICBpZiAoc2ltcGxlS2V5cykge1xuICAgICAgICBpZiAoa2V5Q29tbWVudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXaXRoIHNpbXBsZSBrZXlzLCBrZXkgbm9kZXMgY2Fubm90IGhhdmUgY29tbWVudHMnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNDb2xsZWN0aW9uKGtleSkgfHwgKCFpc05vZGUoa2V5KSAmJiB0eXBlb2Yga2V5ID09PSAnb2JqZWN0JykpIHtcbiAgICAgICAgICAgIGNvbnN0IG1zZyA9ICdXaXRoIHNpbXBsZSBrZXlzLCBjb2xsZWN0aW9uIGNhbm5vdCBiZSB1c2VkIGFzIGEga2V5IHZhbHVlJztcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBleHBsaWNpdEtleSA9ICFzaW1wbGVLZXlzICYmXG4gICAgICAgICgha2V5IHx8XG4gICAgICAgICAgICAoa2V5Q29tbWVudCAmJiB2YWx1ZSA9PSBudWxsICYmICFjdHguaW5GbG93KSB8fFxuICAgICAgICAgICAgaXNDb2xsZWN0aW9uKGtleSkgfHxcbiAgICAgICAgICAgIChpc1NjYWxhcihrZXkpXG4gICAgICAgICAgICAgICAgPyBrZXkudHlwZSA9PT0gU2NhbGFyLkJMT0NLX0ZPTERFRCB8fCBrZXkudHlwZSA9PT0gU2NhbGFyLkJMT0NLX0xJVEVSQUxcbiAgICAgICAgICAgICAgICA6IHR5cGVvZiBrZXkgPT09ICdvYmplY3QnKSk7XG4gICAgY3R4ID0gT2JqZWN0LmFzc2lnbih7fSwgY3R4LCB7XG4gICAgICAgIGFsbE51bGxWYWx1ZXM6IGZhbHNlLFxuICAgICAgICBpbXBsaWNpdEtleTogIWV4cGxpY2l0S2V5ICYmIChzaW1wbGVLZXlzIHx8ICFhbGxOdWxsVmFsdWVzKSxcbiAgICAgICAgaW5kZW50OiBpbmRlbnQgKyBpbmRlbnRTdGVwXG4gICAgfSk7XG4gICAgbGV0IGtleUNvbW1lbnREb25lID0gZmFsc2U7XG4gICAgbGV0IGNob21wS2VlcCA9IGZhbHNlO1xuICAgIGxldCBzdHIgPSBzdHJpbmdpZnkoa2V5LCBjdHgsICgpID0+IChrZXlDb21tZW50RG9uZSA9IHRydWUpLCAoKSA9PiAoY2hvbXBLZWVwID0gdHJ1ZSkpO1xuICAgIGlmICghZXhwbGljaXRLZXkgJiYgIWN0eC5pbkZsb3cgJiYgc3RyLmxlbmd0aCA+IDEwMjQpIHtcbiAgICAgICAgaWYgKHNpbXBsZUtleXMpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dpdGggc2ltcGxlIGtleXMsIHNpbmdsZSBsaW5lIHNjYWxhciBtdXN0IG5vdCBzcGFuIG1vcmUgdGhhbiAxMDI0IGNoYXJhY3RlcnMnKTtcbiAgICAgICAgZXhwbGljaXRLZXkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoY3R4LmluRmxvdykge1xuICAgICAgICBpZiAoYWxsTnVsbFZhbHVlcyB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoa2V5Q29tbWVudERvbmUgJiYgb25Db21tZW50KVxuICAgICAgICAgICAgICAgIG9uQ29tbWVudCgpO1xuICAgICAgICAgICAgcmV0dXJuIHN0ciA9PT0gJycgPyAnPycgOiBleHBsaWNpdEtleSA/IGA/ICR7c3RyfWAgOiBzdHI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoKGFsbE51bGxWYWx1ZXMgJiYgIXNpbXBsZUtleXMpIHx8ICh2YWx1ZSA9PSBudWxsICYmIGV4cGxpY2l0S2V5KSkge1xuICAgICAgICBzdHIgPSBgPyAke3N0cn1gO1xuICAgICAgICBpZiAoa2V5Q29tbWVudCAmJiAha2V5Q29tbWVudERvbmUpIHtcbiAgICAgICAgICAgIHN0ciArPSBsaW5lQ29tbWVudChzdHIsIGN0eC5pbmRlbnQsIGNvbW1lbnRTdHJpbmcoa2V5Q29tbWVudCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNob21wS2VlcCAmJiBvbkNob21wS2VlcClcbiAgICAgICAgICAgIG9uQ2hvbXBLZWVwKCk7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIGlmIChrZXlDb21tZW50RG9uZSlcbiAgICAgICAga2V5Q29tbWVudCA9IG51bGw7XG4gICAgaWYgKGV4cGxpY2l0S2V5KSB7XG4gICAgICAgIGlmIChrZXlDb21tZW50KVxuICAgICAgICAgICAgc3RyICs9IGxpbmVDb21tZW50KHN0ciwgY3R4LmluZGVudCwgY29tbWVudFN0cmluZyhrZXlDb21tZW50KSk7XG4gICAgICAgIHN0ciA9IGA/ICR7c3RyfVxcbiR7aW5kZW50fTpgO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RyID0gYCR7c3RyfTpgO1xuICAgICAgICBpZiAoa2V5Q29tbWVudClcbiAgICAgICAgICAgIHN0ciArPSBsaW5lQ29tbWVudChzdHIsIGN0eC5pbmRlbnQsIGNvbW1lbnRTdHJpbmcoa2V5Q29tbWVudCkpO1xuICAgIH1cbiAgICBsZXQgdnNiLCB2Y2IsIHZhbHVlQ29tbWVudDtcbiAgICBpZiAoaXNOb2RlKHZhbHVlKSkge1xuICAgICAgICB2c2IgPSAhIXZhbHVlLnNwYWNlQmVmb3JlO1xuICAgICAgICB2Y2IgPSB2YWx1ZS5jb21tZW50QmVmb3JlO1xuICAgICAgICB2YWx1ZUNvbW1lbnQgPSB2YWx1ZS5jb21tZW50O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdnNiID0gZmFsc2U7XG4gICAgICAgIHZjYiA9IG51bGw7XG4gICAgICAgIHZhbHVlQ29tbWVudCA9IG51bGw7XG4gICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKVxuICAgICAgICAgICAgdmFsdWUgPSBkb2MuY3JlYXRlTm9kZSh2YWx1ZSk7XG4gICAgfVxuICAgIGN0eC5pbXBsaWNpdEtleSA9IGZhbHNlO1xuICAgIGlmICghZXhwbGljaXRLZXkgJiYgIWtleUNvbW1lbnQgJiYgaXNTY2FsYXIodmFsdWUpKVxuICAgICAgICBjdHguaW5kZW50QXRTdGFydCA9IHN0ci5sZW5ndGggKyAxO1xuICAgIGNob21wS2VlcCA9IGZhbHNlO1xuICAgIGlmICghaW5kZW50U2VxICYmXG4gICAgICAgIGluZGVudFN0ZXAubGVuZ3RoID49IDIgJiZcbiAgICAgICAgIWN0eC5pbkZsb3cgJiZcbiAgICAgICAgIWV4cGxpY2l0S2V5ICYmXG4gICAgICAgIGlzU2VxKHZhbHVlKSAmJlxuICAgICAgICAhdmFsdWUuZmxvdyAmJlxuICAgICAgICAhdmFsdWUudGFnICYmXG4gICAgICAgICF2YWx1ZS5hbmNob3IpIHtcbiAgICAgICAgLy8gSWYgaW5kZW50U2VxID09PSBmYWxzZSwgY29uc2lkZXIgJy0gJyBhcyBwYXJ0IG9mIGluZGVudGF0aW9uIHdoZXJlIHBvc3NpYmxlXG4gICAgICAgIGN0eC5pbmRlbnQgPSBjdHguaW5kZW50LnN1YnN0cmluZygyKTtcbiAgICB9XG4gICAgbGV0IHZhbHVlQ29tbWVudERvbmUgPSBmYWxzZTtcbiAgICBjb25zdCB2YWx1ZVN0ciA9IHN0cmluZ2lmeSh2YWx1ZSwgY3R4LCAoKSA9PiAodmFsdWVDb21tZW50RG9uZSA9IHRydWUpLCAoKSA9PiAoY2hvbXBLZWVwID0gdHJ1ZSkpO1xuICAgIGxldCB3cyA9ICcgJztcbiAgICBpZiAoa2V5Q29tbWVudCB8fCB2c2IgfHwgdmNiKSB7XG4gICAgICAgIHdzID0gdnNiID8gJ1xcbicgOiAnJztcbiAgICAgICAgaWYgKHZjYikge1xuICAgICAgICAgICAgY29uc3QgY3MgPSBjb21tZW50U3RyaW5nKHZjYik7XG4gICAgICAgICAgICB3cyArPSBgXFxuJHtpbmRlbnRDb21tZW50KGNzLCBjdHguaW5kZW50KX1gO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZVN0ciA9PT0gJycgJiYgIWN0eC5pbkZsb3cpIHtcbiAgICAgICAgICAgIGlmICh3cyA9PT0gJ1xcbicgJiYgdmFsdWVDb21tZW50KVxuICAgICAgICAgICAgICAgIHdzID0gJ1xcblxcbic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB3cyArPSBgXFxuJHtjdHguaW5kZW50fWA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoIWV4cGxpY2l0S2V5ICYmIGlzQ29sbGVjdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgY29uc3QgdnMwID0gdmFsdWVTdHJbMF07XG4gICAgICAgIGNvbnN0IG5sMCA9IHZhbHVlU3RyLmluZGV4T2YoJ1xcbicpO1xuICAgICAgICBjb25zdCBoYXNOZXdsaW5lID0gbmwwICE9PSAtMTtcbiAgICAgICAgY29uc3QgZmxvdyA9IGN0eC5pbkZsb3cgPz8gdmFsdWUuZmxvdyA/PyB2YWx1ZS5pdGVtcy5sZW5ndGggPT09IDA7XG4gICAgICAgIGlmIChoYXNOZXdsaW5lIHx8ICFmbG93KSB7XG4gICAgICAgICAgICBsZXQgaGFzUHJvcHNMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoaGFzTmV3bGluZSAmJiAodnMwID09PSAnJicgfHwgdnMwID09PSAnIScpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNwMCA9IHZhbHVlU3RyLmluZGV4T2YoJyAnKTtcbiAgICAgICAgICAgICAgICBpZiAodnMwID09PSAnJicgJiZcbiAgICAgICAgICAgICAgICAgICAgc3AwICE9PSAtMSAmJlxuICAgICAgICAgICAgICAgICAgICBzcDAgPCBubDAgJiZcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVTdHJbc3AwICsgMV0gPT09ICchJykge1xuICAgICAgICAgICAgICAgICAgICBzcDAgPSB2YWx1ZVN0ci5pbmRleE9mKCcgJywgc3AwICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzcDAgPT09IC0xIHx8IG5sMCA8IHNwMClcbiAgICAgICAgICAgICAgICAgICAgaGFzUHJvcHNMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaGFzUHJvcHNMaW5lKVxuICAgICAgICAgICAgICAgIHdzID0gYFxcbiR7Y3R4LmluZGVudH1gO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhbHVlU3RyID09PSAnJyB8fCB2YWx1ZVN0clswXSA9PT0gJ1xcbicpIHtcbiAgICAgICAgd3MgPSAnJztcbiAgICB9XG4gICAgc3RyICs9IHdzICsgdmFsdWVTdHI7XG4gICAgaWYgKGN0eC5pbkZsb3cpIHtcbiAgICAgICAgaWYgKHZhbHVlQ29tbWVudERvbmUgJiYgb25Db21tZW50KVxuICAgICAgICAgICAgb25Db21tZW50KCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhbHVlQ29tbWVudCAmJiAhdmFsdWVDb21tZW50RG9uZSkge1xuICAgICAgICBzdHIgKz0gbGluZUNvbW1lbnQoc3RyLCBjdHguaW5kZW50LCBjb21tZW50U3RyaW5nKHZhbHVlQ29tbWVudCkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjaG9tcEtlZXAgJiYgb25DaG9tcEtlZXApIHtcbiAgICAgICAgb25DaG9tcEtlZXAoKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn1cblxuZXhwb3J0IHsgc3RyaW5naWZ5UGFpciB9O1xuIiwgImZ1bmN0aW9uIGRlYnVnKGxvZ0xldmVsLCAuLi5tZXNzYWdlcykge1xuICAgIGlmIChsb2dMZXZlbCA9PT0gJ2RlYnVnJylcbiAgICAgICAgY29uc29sZS5sb2coLi4ubWVzc2FnZXMpO1xufVxuZnVuY3Rpb24gd2Fybihsb2dMZXZlbCwgd2FybmluZykge1xuICAgIGlmIChsb2dMZXZlbCA9PT0gJ2RlYnVnJyB8fCBsb2dMZXZlbCA9PT0gJ3dhcm4nKSB7XG4gICAgICAgIGNvbnNvbGUud2Fybih3YXJuaW5nKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGRlYnVnLCB3YXJuIH07XG4iLCAiaW1wb3J0IHsgaXNTY2FsYXIsIGlzU2VxLCBpc0FsaWFzLCBpc01hcCB9IGZyb20gJy4uLy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL1NjYWxhci5qcyc7XG5cbi8vIElmIHRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggYSBtZXJnZSBrZXkgaXMgYSBzaW5nbGUgbWFwcGluZyBub2RlLCBlYWNoIG9mXG4vLyBpdHMga2V5L3ZhbHVlIHBhaXJzIGlzIGluc2VydGVkIGludG8gdGhlIGN1cnJlbnQgbWFwcGluZywgdW5sZXNzIHRoZSBrZXlcbi8vIGFscmVhZHkgZXhpc3RzIGluIGl0LiBJZiB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBtZXJnZSBrZXkgaXMgYVxuLy8gc2VxdWVuY2UsIHRoZW4gdGhpcyBzZXF1ZW5jZSBpcyBleHBlY3RlZCB0byBjb250YWluIG1hcHBpbmcgbm9kZXMgYW5kIGVhY2hcbi8vIG9mIHRoZXNlIG5vZGVzIGlzIG1lcmdlZCBpbiB0dXJuIGFjY29yZGluZyB0byBpdHMgb3JkZXIgaW4gdGhlIHNlcXVlbmNlLlxuLy8gS2V5cyBpbiBtYXBwaW5nIG5vZGVzIGVhcmxpZXIgaW4gdGhlIHNlcXVlbmNlIG92ZXJyaWRlIGtleXMgc3BlY2lmaWVkIGluXG4vLyBsYXRlciBtYXBwaW5nIG5vZGVzLiAtLSBodHRwOi8veWFtbC5vcmcvdHlwZS9tZXJnZS5odG1sXG5jb25zdCBNRVJHRV9LRVkgPSAnPDwnO1xuY29uc3QgbWVyZ2UgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHZhbHVlID09PSBNRVJHRV9LRVkgfHxcbiAgICAgICAgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcgJiYgdmFsdWUuZGVzY3JpcHRpb24gPT09IE1FUkdFX0tFWSksXG4gICAgZGVmYXVsdDogJ2tleScsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6bWVyZ2UnLFxuICAgIHRlc3Q6IC9ePDwkLyxcbiAgICByZXNvbHZlOiAoKSA9PiBPYmplY3QuYXNzaWduKG5ldyBTY2FsYXIoU3ltYm9sKE1FUkdFX0tFWSkpLCB7XG4gICAgICAgIGFkZFRvSlNNYXA6IGFkZE1lcmdlVG9KU01hcFxuICAgIH0pLFxuICAgIHN0cmluZ2lmeTogKCkgPT4gTUVSR0VfS0VZXG59O1xuY29uc3QgaXNNZXJnZUtleSA9IChjdHgsIGtleSkgPT4gKG1lcmdlLmlkZW50aWZ5KGtleSkgfHxcbiAgICAoaXNTY2FsYXIoa2V5KSAmJlxuICAgICAgICAoIWtleS50eXBlIHx8IGtleS50eXBlID09PSBTY2FsYXIuUExBSU4pICYmXG4gICAgICAgIG1lcmdlLmlkZW50aWZ5KGtleS52YWx1ZSkpKSAmJlxuICAgIGN0eD8uZG9jLnNjaGVtYS50YWdzLnNvbWUodGFnID0+IHRhZy50YWcgPT09IG1lcmdlLnRhZyAmJiB0YWcuZGVmYXVsdCk7XG5mdW5jdGlvbiBhZGRNZXJnZVRvSlNNYXAoY3R4LCBtYXAsIHZhbHVlKSB7XG4gICAgY29uc3Qgc291cmNlID0gcmVzb2x2ZUFsaWFzVmFsdWUoY3R4LCB2YWx1ZSk7XG4gICAgaWYgKGlzU2VxKHNvdXJjZSkpXG4gICAgICAgIGZvciAoY29uc3QgaXQgb2Ygc291cmNlLml0ZW1zKVxuICAgICAgICAgICAgbWVyZ2VWYWx1ZShjdHgsIG1hcCwgaXQpO1xuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlKSlcbiAgICAgICAgZm9yIChjb25zdCBpdCBvZiBzb3VyY2UpXG4gICAgICAgICAgICBtZXJnZVZhbHVlKGN0eCwgbWFwLCBpdCk7XG4gICAgZWxzZVxuICAgICAgICBtZXJnZVZhbHVlKGN0eCwgbWFwLCBzb3VyY2UpO1xufVxuZnVuY3Rpb24gbWVyZ2VWYWx1ZShjdHgsIG1hcCwgdmFsdWUpIHtcbiAgICBjb25zdCBzb3VyY2UgPSByZXNvbHZlQWxpYXNWYWx1ZShjdHgsIHZhbHVlKTtcbiAgICBpZiAoIWlzTWFwKHNvdXJjZSkpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWVyZ2Ugc291cmNlcyBtdXN0IGJlIG1hcHMgb3IgbWFwIGFsaWFzZXMnKTtcbiAgICBjb25zdCBzcmNNYXAgPSBzb3VyY2UudG9KU09OKG51bGwsIGN0eCwgTWFwKTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBzcmNNYXApIHtcbiAgICAgICAgaWYgKG1hcCBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICAgICAgaWYgKCFtYXAuaGFzKGtleSkpXG4gICAgICAgICAgICAgICAgbWFwLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtYXAgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgICAgIG1hcC5hZGQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1hcCwga2V5KSkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1hcCwga2V5LCB7XG4gICAgICAgICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXA7XG59XG5mdW5jdGlvbiByZXNvbHZlQWxpYXNWYWx1ZShjdHgsIHZhbHVlKSB7XG4gICAgcmV0dXJuIGN0eCAmJiBpc0FsaWFzKHZhbHVlKSA/IHZhbHVlLnJlc29sdmUoY3R4LmRvYywgY3R4KSA6IHZhbHVlO1xufVxuXG5leHBvcnQgeyBhZGRNZXJnZVRvSlNNYXAsIGlzTWVyZ2VLZXksIG1lcmdlIH07XG4iLCAiaW1wb3J0IHsgd2FybiB9IGZyb20gJy4uL2xvZy5qcyc7XG5pbXBvcnQgeyBpc01lcmdlS2V5LCBhZGRNZXJnZVRvSlNNYXAgfSBmcm9tICcuLi9zY2hlbWEveWFtbC0xLjEvbWVyZ2UuanMnO1xuaW1wb3J0IHsgY3JlYXRlU3RyaW5naWZ5Q29udGV4dCB9IGZyb20gJy4uL3N0cmluZ2lmeS9zdHJpbmdpZnkuanMnO1xuaW1wb3J0IHsgaXNOb2RlIH0gZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyB0b0pTIH0gZnJvbSAnLi90b0pTLmpzJztcblxuZnVuY3Rpb24gYWRkUGFpclRvSlNNYXAoY3R4LCBtYXAsIHsga2V5LCB2YWx1ZSB9KSB7XG4gICAgaWYgKGlzTm9kZShrZXkpICYmIGtleS5hZGRUb0pTTWFwKVxuICAgICAgICBrZXkuYWRkVG9KU01hcChjdHgsIG1hcCwgdmFsdWUpO1xuICAgIC8vIFRPRE86IFNob3VsZCBkcm9wIHRoaXMgc3BlY2lhbCBjYXNlIGZvciBiYXJlIDw8IGhhbmRsaW5nXG4gICAgZWxzZSBpZiAoaXNNZXJnZUtleShjdHgsIGtleSkpXG4gICAgICAgIGFkZE1lcmdlVG9KU01hcChjdHgsIG1hcCwgdmFsdWUpO1xuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBqc0tleSA9IHRvSlMoa2V5LCAnJywgY3R4KTtcbiAgICAgICAgaWYgKG1hcCBpbnN0YW5jZW9mIE1hcCkge1xuICAgICAgICAgICAgbWFwLnNldChqc0tleSwgdG9KUyh2YWx1ZSwganNLZXksIGN0eCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1hcCBpbnN0YW5jZW9mIFNldCkge1xuICAgICAgICAgICAgbWFwLmFkZChqc0tleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzdHJpbmdLZXkgPSBzdHJpbmdpZnlLZXkoa2V5LCBqc0tleSwgY3R4KTtcbiAgICAgICAgICAgIGNvbnN0IGpzVmFsdWUgPSB0b0pTKHZhbHVlLCBzdHJpbmdLZXksIGN0eCk7XG4gICAgICAgICAgICBpZiAoc3RyaW5nS2V5IGluIG1hcClcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobWFwLCBzdHJpbmdLZXksIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGpzVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBtYXBbc3RyaW5nS2V5XSA9IGpzVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcDtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeUtleShrZXksIGpzS2V5LCBjdHgpIHtcbiAgICBpZiAoanNLZXkgPT09IG51bGwpXG4gICAgICAgIHJldHVybiAnJztcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWJhc2UtdG8tc3RyaW5nXG4gICAgaWYgKHR5cGVvZiBqc0tleSAhPT0gJ29iamVjdCcpXG4gICAgICAgIHJldHVybiBTdHJpbmcoanNLZXkpO1xuICAgIGlmIChpc05vZGUoa2V5KSAmJiBjdHg/LmRvYykge1xuICAgICAgICBjb25zdCBzdHJDdHggPSBjcmVhdGVTdHJpbmdpZnlDb250ZXh0KGN0eC5kb2MsIHt9KTtcbiAgICAgICAgc3RyQ3R4LmFuY2hvcnMgPSBuZXcgU2V0KCk7XG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBjdHguYW5jaG9ycy5rZXlzKCkpXG4gICAgICAgICAgICBzdHJDdHguYW5jaG9ycy5hZGQobm9kZS5hbmNob3IpO1xuICAgICAgICBzdHJDdHguaW5GbG93ID0gdHJ1ZTtcbiAgICAgICAgc3RyQ3R4LmluU3RyaW5naWZ5S2V5ID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgc3RyS2V5ID0ga2V5LnRvU3RyaW5nKHN0ckN0eCk7XG4gICAgICAgIGlmICghY3R4Lm1hcEtleVdhcm5lZCkge1xuICAgICAgICAgICAgbGV0IGpzb25TdHIgPSBKU09OLnN0cmluZ2lmeShzdHJLZXkpO1xuICAgICAgICAgICAgaWYgKGpzb25TdHIubGVuZ3RoID4gNDApXG4gICAgICAgICAgICAgICAganNvblN0ciA9IGpzb25TdHIuc3Vic3RyaW5nKDAsIDM2KSArICcuLi5cIic7XG4gICAgICAgICAgICB3YXJuKGN0eC5kb2Mub3B0aW9ucy5sb2dMZXZlbCwgYEtleXMgd2l0aCBjb2xsZWN0aW9uIHZhbHVlcyB3aWxsIGJlIHN0cmluZ2lmaWVkIGR1ZSB0byBKUyBPYmplY3QgcmVzdHJpY3Rpb25zOiAke2pzb25TdHJ9LiBTZXQgbWFwQXNNYXA6IHRydWUgdG8gdXNlIG9iamVjdCBrZXlzLmApO1xuICAgICAgICAgICAgY3R4Lm1hcEtleVdhcm5lZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cktleTtcbiAgICB9XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGpzS2V5KTtcbn1cblxuZXhwb3J0IHsgYWRkUGFpclRvSlNNYXAgfTtcbiIsICJpbXBvcnQgeyBjcmVhdGVOb2RlIH0gZnJvbSAnLi4vZG9jL2NyZWF0ZU5vZGUuanMnO1xuaW1wb3J0IHsgc3RyaW5naWZ5UGFpciB9IGZyb20gJy4uL3N0cmluZ2lmeS9zdHJpbmdpZnlQYWlyLmpzJztcbmltcG9ydCB7IGFkZFBhaXJUb0pTTWFwIH0gZnJvbSAnLi9hZGRQYWlyVG9KU01hcC5qcyc7XG5pbXBvcnQgeyBOT0RFX1RZUEUsIFBBSVIsIGlzTm9kZSB9IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuXG5mdW5jdGlvbiBjcmVhdGVQYWlyKGtleSwgdmFsdWUsIGN0eCkge1xuICAgIGNvbnN0IGsgPSBjcmVhdGVOb2RlKGtleSwgdW5kZWZpbmVkLCBjdHgpO1xuICAgIGNvbnN0IHYgPSBjcmVhdGVOb2RlKHZhbHVlLCB1bmRlZmluZWQsIGN0eCk7XG4gICAgcmV0dXJuIG5ldyBQYWlyKGssIHYpO1xufVxuY2xhc3MgUGFpciB7XG4gICAgY29uc3RydWN0b3Ioa2V5LCB2YWx1ZSA9IG51bGwpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIE5PREVfVFlQRSwgeyB2YWx1ZTogUEFJUiB9KTtcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB9XG4gICAgY2xvbmUoc2NoZW1hKSB7XG4gICAgICAgIGxldCB7IGtleSwgdmFsdWUgfSA9IHRoaXM7XG4gICAgICAgIGlmIChpc05vZGUoa2V5KSlcbiAgICAgICAgICAgIGtleSA9IGtleS5jbG9uZShzY2hlbWEpO1xuICAgICAgICBpZiAoaXNOb2RlKHZhbHVlKSlcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuY2xvbmUoc2NoZW1hKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQYWlyKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICB0b0pTT04oXywgY3R4KSB7XG4gICAgICAgIGNvbnN0IHBhaXIgPSBjdHg/Lm1hcEFzTWFwID8gbmV3IE1hcCgpIDoge307XG4gICAgICAgIHJldHVybiBhZGRQYWlyVG9KU01hcChjdHgsIHBhaXIsIHRoaXMpO1xuICAgIH1cbiAgICB0b1N0cmluZyhjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApIHtcbiAgICAgICAgcmV0dXJuIGN0eD8uZG9jXG4gICAgICAgICAgICA/IHN0cmluZ2lmeVBhaXIodGhpcywgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKVxuICAgICAgICAgICAgOiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFBhaXIsIGNyZWF0ZVBhaXIgfTtcbiIsICJpbXBvcnQgeyBpc05vZGUsIGlzUGFpciB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmltcG9ydCB7IGxpbmVDb21tZW50LCBpbmRlbnRDb21tZW50IH0gZnJvbSAnLi9zdHJpbmdpZnlDb21tZW50LmpzJztcblxuZnVuY3Rpb24gc3RyaW5naWZ5Q29sbGVjdGlvbihjb2xsZWN0aW9uLCBjdHgsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBmbG93ID0gY3R4LmluRmxvdyA/PyBjb2xsZWN0aW9uLmZsb3c7XG4gICAgY29uc3Qgc3RyaW5naWZ5ID0gZmxvdyA/IHN0cmluZ2lmeUZsb3dDb2xsZWN0aW9uIDogc3RyaW5naWZ5QmxvY2tDb2xsZWN0aW9uO1xuICAgIHJldHVybiBzdHJpbmdpZnkoY29sbGVjdGlvbiwgY3R4LCBvcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeUJsb2NrQ29sbGVjdGlvbih7IGNvbW1lbnQsIGl0ZW1zIH0sIGN0eCwgeyBibG9ja0l0ZW1QcmVmaXgsIGZsb3dDaGFycywgaXRlbUluZGVudCwgb25DaG9tcEtlZXAsIG9uQ29tbWVudCB9KSB7XG4gICAgY29uc3QgeyBpbmRlbnQsIG9wdGlvbnM6IHsgY29tbWVudFN0cmluZyB9IH0gPSBjdHg7XG4gICAgY29uc3QgaXRlbUN0eCA9IE9iamVjdC5hc3NpZ24oe30sIGN0eCwgeyBpbmRlbnQ6IGl0ZW1JbmRlbnQsIHR5cGU6IG51bGwgfSk7XG4gICAgbGV0IGNob21wS2VlcCA9IGZhbHNlOyAvLyBmbGFnIGZvciB0aGUgcHJlY2VkaW5nIG5vZGUncyBzdGF0dXNcbiAgICBjb25zdCBsaW5lcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGl0ZW1zW2ldO1xuICAgICAgICBsZXQgY29tbWVudCA9IG51bGw7XG4gICAgICAgIGlmIChpc05vZGUoaXRlbSkpIHtcbiAgICAgICAgICAgIGlmICghY2hvbXBLZWVwICYmIGl0ZW0uc3BhY2VCZWZvcmUpXG4gICAgICAgICAgICAgICAgbGluZXMucHVzaCgnJyk7XG4gICAgICAgICAgICBhZGRDb21tZW50QmVmb3JlKGN0eCwgbGluZXMsIGl0ZW0uY29tbWVudEJlZm9yZSwgY2hvbXBLZWVwKTtcbiAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQpXG4gICAgICAgICAgICAgICAgY29tbWVudCA9IGl0ZW0uY29tbWVudDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1BhaXIoaXRlbSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGlrID0gaXNOb2RlKGl0ZW0ua2V5KSA/IGl0ZW0ua2V5IDogbnVsbDtcbiAgICAgICAgICAgIGlmIChpaykge1xuICAgICAgICAgICAgICAgIGlmICghY2hvbXBLZWVwICYmIGlrLnNwYWNlQmVmb3JlKVxuICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKCcnKTtcbiAgICAgICAgICAgICAgICBhZGRDb21tZW50QmVmb3JlKGN0eCwgbGluZXMsIGlrLmNvbW1lbnRCZWZvcmUsIGNob21wS2VlcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2hvbXBLZWVwID0gZmFsc2U7XG4gICAgICAgIGxldCBzdHIgPSBzdHJpbmdpZnkoaXRlbSwgaXRlbUN0eCwgKCkgPT4gKGNvbW1lbnQgPSBudWxsKSwgKCkgPT4gKGNob21wS2VlcCA9IHRydWUpKTtcbiAgICAgICAgaWYgKGNvbW1lbnQpXG4gICAgICAgICAgICBzdHIgKz0gbGluZUNvbW1lbnQoc3RyLCBpdGVtSW5kZW50LCBjb21tZW50U3RyaW5nKGNvbW1lbnQpKTtcbiAgICAgICAgaWYgKGNob21wS2VlcCAmJiBjb21tZW50KVxuICAgICAgICAgICAgY2hvbXBLZWVwID0gZmFsc2U7XG4gICAgICAgIGxpbmVzLnB1c2goYmxvY2tJdGVtUHJlZml4ICsgc3RyKTtcbiAgICB9XG4gICAgbGV0IHN0cjtcbiAgICBpZiAobGluZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHN0ciA9IGZsb3dDaGFycy5zdGFydCArIGZsb3dDaGFycy5lbmQ7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdHIgPSBsaW5lc1swXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IGxpbmVzW2ldO1xuICAgICAgICAgICAgc3RyICs9IGxpbmUgPyBgXFxuJHtpbmRlbnR9JHtsaW5lfWAgOiAnXFxuJztcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY29tbWVudCkge1xuICAgICAgICBzdHIgKz0gJ1xcbicgKyBpbmRlbnRDb21tZW50KGNvbW1lbnRTdHJpbmcoY29tbWVudCksIGluZGVudCk7XG4gICAgICAgIGlmIChvbkNvbW1lbnQpXG4gICAgICAgICAgICBvbkNvbW1lbnQoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY2hvbXBLZWVwICYmIG9uQ2hvbXBLZWVwKVxuICAgICAgICBvbkNob21wS2VlcCgpO1xuICAgIHJldHVybiBzdHI7XG59XG5mdW5jdGlvbiBzdHJpbmdpZnlGbG93Q29sbGVjdGlvbih7IGl0ZW1zIH0sIGN0eCwgeyBmbG93Q2hhcnMsIGl0ZW1JbmRlbnQgfSkge1xuICAgIGNvbnN0IHsgaW5kZW50LCBpbmRlbnRTdGVwLCBmbG93Q29sbGVjdGlvblBhZGRpbmc6IGZjUGFkZGluZywgb3B0aW9uczogeyBjb21tZW50U3RyaW5nIH0gfSA9IGN0eDtcbiAgICBpdGVtSW5kZW50ICs9IGluZGVudFN0ZXA7XG4gICAgY29uc3QgaXRlbUN0eCA9IE9iamVjdC5hc3NpZ24oe30sIGN0eCwge1xuICAgICAgICBpbmRlbnQ6IGl0ZW1JbmRlbnQsXG4gICAgICAgIGluRmxvdzogdHJ1ZSxcbiAgICAgICAgdHlwZTogbnVsbFxuICAgIH0pO1xuICAgIGxldCByZXFOZXdsaW5lID0gZmFsc2U7XG4gICAgbGV0IGxpbmVzQXRWYWx1ZSA9IDA7XG4gICAgY29uc3QgbGluZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1tpXTtcbiAgICAgICAgbGV0IGNvbW1lbnQgPSBudWxsO1xuICAgICAgICBpZiAoaXNOb2RlKGl0ZW0pKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5zcGFjZUJlZm9yZSlcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKCcnKTtcbiAgICAgICAgICAgIGFkZENvbW1lbnRCZWZvcmUoY3R4LCBsaW5lcywgaXRlbS5jb21tZW50QmVmb3JlLCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50KVxuICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBpdGVtLmNvbW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNQYWlyKGl0ZW0pKSB7XG4gICAgICAgICAgICBjb25zdCBpayA9IGlzTm9kZShpdGVtLmtleSkgPyBpdGVtLmtleSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoaWspIHtcbiAgICAgICAgICAgICAgICBpZiAoaWsuc3BhY2VCZWZvcmUpXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goJycpO1xuICAgICAgICAgICAgICAgIGFkZENvbW1lbnRCZWZvcmUoY3R4LCBsaW5lcywgaWsuY29tbWVudEJlZm9yZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmIChpay5jb21tZW50KVxuICAgICAgICAgICAgICAgICAgICByZXFOZXdsaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGl2ID0gaXNOb2RlKGl0ZW0udmFsdWUpID8gaXRlbS52YWx1ZSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoaXYpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXYuY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudCA9IGl2LmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgaWYgKGl2LmNvbW1lbnRCZWZvcmUpXG4gICAgICAgICAgICAgICAgICAgIHJlcU5ld2xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXRlbS52YWx1ZSA9PSBudWxsICYmIGlrPy5jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgY29tbWVudCA9IGlrLmNvbW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbW1lbnQpXG4gICAgICAgICAgICByZXFOZXdsaW5lID0gdHJ1ZTtcbiAgICAgICAgbGV0IHN0ciA9IHN0cmluZ2lmeShpdGVtLCBpdGVtQ3R4LCAoKSA9PiAoY29tbWVudCA9IG51bGwpKTtcbiAgICAgICAgcmVxTmV3bGluZSB8fCAocmVxTmV3bGluZSA9IGxpbmVzLmxlbmd0aCA+IGxpbmVzQXRWYWx1ZSB8fCBzdHIuaW5jbHVkZXMoJ1xcbicpKTtcbiAgICAgICAgaWYgKGkgPCBpdGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICBzdHIgKz0gJywnO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGN0eC5vcHRpb25zLnRyYWlsaW5nQ29tbWEpIHtcbiAgICAgICAgICAgIGlmIChjdHgub3B0aW9ucy5saW5lV2lkdGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmVxTmV3bGluZSB8fCAocmVxTmV3bGluZSA9IGxpbmVzLnJlZHVjZSgoc3VtLCBsaW5lKSA9PiBzdW0gKyBsaW5lLmxlbmd0aCArIDIsIDIpICtcbiAgICAgICAgICAgICAgICAgICAgKHN0ci5sZW5ndGggKyAyKSA+XG4gICAgICAgICAgICAgICAgICAgIGN0eC5vcHRpb25zLmxpbmVXaWR0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocmVxTmV3bGluZSkge1xuICAgICAgICAgICAgICAgIHN0ciArPSAnLCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbW1lbnQpXG4gICAgICAgICAgICBzdHIgKz0gbGluZUNvbW1lbnQoc3RyLCBpdGVtSW5kZW50LCBjb21tZW50U3RyaW5nKGNvbW1lbnQpKTtcbiAgICAgICAgbGluZXMucHVzaChzdHIpO1xuICAgICAgICBsaW5lc0F0VmFsdWUgPSBsaW5lcy5sZW5ndGg7XG4gICAgfVxuICAgIGNvbnN0IHsgc3RhcnQsIGVuZCB9ID0gZmxvd0NoYXJzO1xuICAgIGlmIChsaW5lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHN0YXJ0ICsgZW5kO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKCFyZXFOZXdsaW5lKSB7XG4gICAgICAgICAgICBjb25zdCBsZW4gPSBsaW5lcy5yZWR1Y2UoKHN1bSwgbGluZSkgPT4gc3VtICsgbGluZS5sZW5ndGggKyAyLCAyKTtcbiAgICAgICAgICAgIHJlcU5ld2xpbmUgPSBjdHgub3B0aW9ucy5saW5lV2lkdGggPiAwICYmIGxlbiA+IGN0eC5vcHRpb25zLmxpbmVXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVxTmV3bGluZSkge1xuICAgICAgICAgICAgbGV0IHN0ciA9IHN0YXJ0O1xuICAgICAgICAgICAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKVxuICAgICAgICAgICAgICAgIHN0ciArPSBsaW5lID8gYFxcbiR7aW5kZW50U3RlcH0ke2luZGVudH0ke2xpbmV9YCA6ICdcXG4nO1xuICAgICAgICAgICAgcmV0dXJuIGAke3N0cn1cXG4ke2luZGVudH0ke2VuZH1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGAke3N0YXJ0fSR7ZmNQYWRkaW5nfSR7bGluZXMuam9pbignICcpfSR7ZmNQYWRkaW5nfSR7ZW5kfWA7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBhZGRDb21tZW50QmVmb3JlKHsgaW5kZW50LCBvcHRpb25zOiB7IGNvbW1lbnRTdHJpbmcgfSB9LCBsaW5lcywgY29tbWVudCwgY2hvbXBLZWVwKSB7XG4gICAgaWYgKGNvbW1lbnQgJiYgY2hvbXBLZWVwKVxuICAgICAgICBjb21tZW50ID0gY29tbWVudC5yZXBsYWNlKC9eXFxuKy8sICcnKTtcbiAgICBpZiAoY29tbWVudCkge1xuICAgICAgICBjb25zdCBpYyA9IGluZGVudENvbW1lbnQoY29tbWVudFN0cmluZyhjb21tZW50KSwgaW5kZW50KTtcbiAgICAgICAgbGluZXMucHVzaChpYy50cmltU3RhcnQoKSk7IC8vIEF2b2lkIGRvdWJsZSBpbmRlbnQgb24gZmlyc3QgbGluZVxuICAgIH1cbn1cblxuZXhwb3J0IHsgc3RyaW5naWZ5Q29sbGVjdGlvbiB9O1xuIiwgImltcG9ydCB7IHN0cmluZ2lmeUNvbGxlY3Rpb24gfSBmcm9tICcuLi9zdHJpbmdpZnkvc3RyaW5naWZ5Q29sbGVjdGlvbi5qcyc7XG5pbXBvcnQgeyBhZGRQYWlyVG9KU01hcCB9IGZyb20gJy4vYWRkUGFpclRvSlNNYXAuanMnO1xuaW1wb3J0IHsgQ29sbGVjdGlvbiB9IGZyb20gJy4vQ29sbGVjdGlvbi5qcyc7XG5pbXBvcnQgeyBNQVAsIGlzUGFpciwgaXNTY2FsYXIgfSBmcm9tICcuL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IFBhaXIsIGNyZWF0ZVBhaXIgfSBmcm9tICcuL1BhaXIuanMnO1xuaW1wb3J0IHsgaXNTY2FsYXJWYWx1ZSB9IGZyb20gJy4vU2NhbGFyLmpzJztcblxuZnVuY3Rpb24gZmluZFBhaXIoaXRlbXMsIGtleSkge1xuICAgIGNvbnN0IGsgPSBpc1NjYWxhcihrZXkpID8ga2V5LnZhbHVlIDoga2V5O1xuICAgIGZvciAoY29uc3QgaXQgb2YgaXRlbXMpIHtcbiAgICAgICAgaWYgKGlzUGFpcihpdCkpIHtcbiAgICAgICAgICAgIGlmIChpdC5rZXkgPT09IGtleSB8fCBpdC5rZXkgPT09IGspXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0O1xuICAgICAgICAgICAgaWYgKGlzU2NhbGFyKGl0LmtleSkgJiYgaXQua2V5LnZhbHVlID09PSBrKVxuICAgICAgICAgICAgICAgIHJldHVybiBpdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuY2xhc3MgWUFNTE1hcCBleHRlbmRzIENvbGxlY3Rpb24ge1xuICAgIHN0YXRpYyBnZXQgdGFnTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuICd0YWc6eWFtbC5vcmcsMjAwMjptYXAnO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcbiAgICAgICAgc3VwZXIoTUFQLCBzY2hlbWEpO1xuICAgICAgICB0aGlzLml0ZW1zID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgZ2VuZXJpYyBjb2xsZWN0aW9uIHBhcnNpbmcgbWV0aG9kIHRoYXQgY2FuIGJlIGV4dGVuZGVkXG4gICAgICogdG8gb3RoZXIgbm9kZSBjbGFzc2VzIHRoYXQgaW5oZXJpdCBmcm9tIFlBTUxNYXBcbiAgICAgKi9cbiAgICBzdGF0aWMgZnJvbShzY2hlbWEsIG9iaiwgY3R4KSB7XG4gICAgICAgIGNvbnN0IHsga2VlcFVuZGVmaW5lZCwgcmVwbGFjZXIgfSA9IGN0eDtcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IHRoaXMoc2NoZW1hKTtcbiAgICAgICAgY29uc3QgYWRkID0gKGtleSwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZXBsYWNlci5jYWxsKG9iaiwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJlcGxhY2VyKSAmJiAhcmVwbGFjZXIuaW5jbHVkZXMoa2V5KSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCB8fCBrZWVwVW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKGNyZWF0ZVBhaXIoa2V5LCB2YWx1ZSwgY3R4KSk7XG4gICAgICAgIH07XG4gICAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIG9iailcbiAgICAgICAgICAgICAgICBhZGQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob2JqICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKVxuICAgICAgICAgICAgICAgIGFkZChrZXksIG9ialtrZXldKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHNjaGVtYS5zb3J0TWFwRW50cmllcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbWFwLml0ZW1zLnNvcnQoc2NoZW1hLnNvcnRNYXBFbnRyaWVzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3ZlcndyaXRlIC0gSWYgbm90IHNldCBgdHJ1ZWAsIHVzaW5nIGEga2V5IHRoYXQgaXMgYWxyZWFkeSBpbiB0aGVcbiAgICAgKiAgIGNvbGxlY3Rpb24gd2lsbCB0aHJvdy4gT3RoZXJ3aXNlLCBvdmVyd3JpdGVzIHRoZSBwcmV2aW91cyB2YWx1ZS5cbiAgICAgKi9cbiAgICBhZGQocGFpciwgb3ZlcndyaXRlKSB7XG4gICAgICAgIGxldCBfcGFpcjtcbiAgICAgICAgaWYgKGlzUGFpcihwYWlyKSlcbiAgICAgICAgICAgIF9wYWlyID0gcGFpcjtcbiAgICAgICAgZWxzZSBpZiAoIXBhaXIgfHwgdHlwZW9mIHBhaXIgIT09ICdvYmplY3QnIHx8ICEoJ2tleScgaW4gcGFpcikpIHtcbiAgICAgICAgICAgIC8vIEluIFR5cGVTY3JpcHQsIHRoaXMgbmV2ZXIgaGFwcGVucy5cbiAgICAgICAgICAgIF9wYWlyID0gbmV3IFBhaXIocGFpciwgcGFpcj8udmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIF9wYWlyID0gbmV3IFBhaXIocGFpci5rZXksIHBhaXIudmFsdWUpO1xuICAgICAgICBjb25zdCBwcmV2ID0gZmluZFBhaXIodGhpcy5pdGVtcywgX3BhaXIua2V5KTtcbiAgICAgICAgY29uc3Qgc29ydEVudHJpZXMgPSB0aGlzLnNjaGVtYT8uc29ydE1hcEVudHJpZXM7XG4gICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgICBpZiAoIW92ZXJ3cml0ZSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEtleSAke19wYWlyLmtleX0gYWxyZWFkeSBzZXRgKTtcbiAgICAgICAgICAgIC8vIEZvciBzY2FsYXJzLCBrZWVwIHRoZSBvbGQgbm9kZSAmIGl0cyBjb21tZW50cyBhbmQgYW5jaG9yc1xuICAgICAgICAgICAgaWYgKGlzU2NhbGFyKHByZXYudmFsdWUpICYmIGlzU2NhbGFyVmFsdWUoX3BhaXIudmFsdWUpKVxuICAgICAgICAgICAgICAgIHByZXYudmFsdWUudmFsdWUgPSBfcGFpci52YWx1ZTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBwcmV2LnZhbHVlID0gX3BhaXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc29ydEVudHJpZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLml0ZW1zLmZpbmRJbmRleChpdGVtID0+IHNvcnRFbnRyaWVzKF9wYWlyLCBpdGVtKSA8IDApO1xuICAgICAgICAgICAgaWYgKGkgPT09IC0xKVxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChfcGFpcik7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtcy5zcGxpY2UoaSwgMCwgX3BhaXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoKF9wYWlyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBkZWxldGUoa2V5KSB7XG4gICAgICAgIGNvbnN0IGl0ID0gZmluZFBhaXIodGhpcy5pdGVtcywga2V5KTtcbiAgICAgICAgaWYgKCFpdClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgY29uc3QgZGVsID0gdGhpcy5pdGVtcy5zcGxpY2UodGhpcy5pdGVtcy5pbmRleE9mKGl0KSwgMSk7XG4gICAgICAgIHJldHVybiBkZWwubGVuZ3RoID4gMDtcbiAgICB9XG4gICAgZ2V0KGtleSwga2VlcFNjYWxhcikge1xuICAgICAgICBjb25zdCBpdCA9IGZpbmRQYWlyKHRoaXMuaXRlbXMsIGtleSk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBpdD8udmFsdWU7XG4gICAgICAgIHJldHVybiAoIWtlZXBTY2FsYXIgJiYgaXNTY2FsYXIobm9kZSkgPyBub2RlLnZhbHVlIDogbm9kZSkgPz8gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiAhIWZpbmRQYWlyKHRoaXMuaXRlbXMsIGtleSk7XG4gICAgfVxuICAgIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuYWRkKG5ldyBQYWlyKGtleSwgdmFsdWUpLCB0cnVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGN0eCAtIENvbnZlcnNpb24gY29udGV4dCwgb3JpZ2luYWxseSBzZXQgaW4gRG9jdW1lbnQjdG9KUygpXG4gICAgICogQHBhcmFtIHtDbGFzc30gVHlwZSAtIElmIHNldCwgZm9yY2VzIHRoZSByZXR1cm5lZCBjb2xsZWN0aW9uIHR5cGVcbiAgICAgKiBAcmV0dXJucyBJbnN0YW5jZSBvZiBUeXBlLCBNYXAsIG9yIE9iamVjdFxuICAgICAqL1xuICAgIHRvSlNPTihfLCBjdHgsIFR5cGUpIHtcbiAgICAgICAgY29uc3QgbWFwID0gVHlwZSA/IG5ldyBUeXBlKCkgOiBjdHg/Lm1hcEFzTWFwID8gbmV3IE1hcCgpIDoge307XG4gICAgICAgIGlmIChjdHg/Lm9uQ3JlYXRlKVxuICAgICAgICAgICAgY3R4Lm9uQ3JlYXRlKG1hcCk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKVxuICAgICAgICAgICAgYWRkUGFpclRvSlNNYXAoY3R4LCBtYXAsIGl0ZW0pO1xuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cbiAgICB0b1N0cmluZyhjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApIHtcbiAgICAgICAgaWYgKCFjdHgpXG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKSB7XG4gICAgICAgICAgICBpZiAoIWlzUGFpcihpdGVtKSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcCBpdGVtcyBtdXN0IGFsbCBiZSBwYWlyczsgZm91bmQgJHtKU09OLnN0cmluZ2lmeShpdGVtKX0gaW5zdGVhZGApO1xuICAgICAgICB9XG4gICAgICAgIGlmICghY3R4LmFsbE51bGxWYWx1ZXMgJiYgdGhpcy5oYXNBbGxOdWxsVmFsdWVzKGZhbHNlKSlcbiAgICAgICAgICAgIGN0eCA9IE9iamVjdC5hc3NpZ24oe30sIGN0eCwgeyBhbGxOdWxsVmFsdWVzOiB0cnVlIH0pO1xuICAgICAgICByZXR1cm4gc3RyaW5naWZ5Q29sbGVjdGlvbih0aGlzLCBjdHgsIHtcbiAgICAgICAgICAgIGJsb2NrSXRlbVByZWZpeDogJycsXG4gICAgICAgICAgICBmbG93Q2hhcnM6IHsgc3RhcnQ6ICd7JywgZW5kOiAnfScgfSxcbiAgICAgICAgICAgIGl0ZW1JbmRlbnQ6IGN0eC5pbmRlbnQgfHwgJycsXG4gICAgICAgICAgICBvbkNob21wS2VlcCxcbiAgICAgICAgICAgIG9uQ29tbWVudFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFlBTUxNYXAsIGZpbmRQYWlyIH07XG4iLCAiaW1wb3J0IHsgaXNNYXAgfSBmcm9tICcuLi8uLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBZQU1MTWFwIH0gZnJvbSAnLi4vLi4vbm9kZXMvWUFNTE1hcC5qcyc7XG5cbmNvbnN0IG1hcCA9IHtcbiAgICBjb2xsZWN0aW9uOiAnbWFwJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG5vZGVDbGFzczogWUFNTE1hcCxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjptYXAnLFxuICAgIHJlc29sdmUobWFwLCBvbkVycm9yKSB7XG4gICAgICAgIGlmICghaXNNYXAobWFwKSlcbiAgICAgICAgICAgIG9uRXJyb3IoJ0V4cGVjdGVkIGEgbWFwcGluZyBmb3IgdGhpcyB0YWcnKTtcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9LFxuICAgIGNyZWF0ZU5vZGU6IChzY2hlbWEsIG9iaiwgY3R4KSA9PiBZQU1MTWFwLmZyb20oc2NoZW1hLCBvYmosIGN0eClcbn07XG5cbmV4cG9ydCB7IG1hcCB9O1xuIiwgImltcG9ydCB7IGNyZWF0ZU5vZGUgfSBmcm9tICcuLi9kb2MvY3JlYXRlTm9kZS5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnlDb2xsZWN0aW9uIH0gZnJvbSAnLi4vc3RyaW5naWZ5L3N0cmluZ2lmeUNvbGxlY3Rpb24uanMnO1xuaW1wb3J0IHsgQ29sbGVjdGlvbiB9IGZyb20gJy4vQ29sbGVjdGlvbi5qcyc7XG5pbXBvcnQgeyBTRVEsIGlzU2NhbGFyIH0gZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBpc1NjYWxhclZhbHVlIH0gZnJvbSAnLi9TY2FsYXIuanMnO1xuaW1wb3J0IHsgdG9KUyB9IGZyb20gJy4vdG9KUy5qcyc7XG5cbmNsYXNzIFlBTUxTZXEgZXh0ZW5kcyBDb2xsZWN0aW9uIHtcbiAgICBzdGF0aWMgZ2V0IHRhZ05hbWUoKSB7XG4gICAgICAgIHJldHVybiAndGFnOnlhbWwub3JnLDIwMDI6c2VxJztcbiAgICB9XG4gICAgY29uc3RydWN0b3Ioc2NoZW1hKSB7XG4gICAgICAgIHN1cGVyKFNFUSwgc2NoZW1hKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIH1cbiAgICBhZGQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5pdGVtcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIHZhbHVlIGZyb20gdGhlIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBga2V5YCBtdXN0IGNvbnRhaW4gYSByZXByZXNlbnRhdGlvbiBvZiBhbiBpbnRlZ2VyIGZvciB0aGlzIHRvIHN1Y2NlZWQuXG4gICAgICogSXQgbWF5IGJlIHdyYXBwZWQgaW4gYSBgU2NhbGFyYC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgaXRlbSB3YXMgZm91bmQgYW5kIHJlbW92ZWQuXG4gICAgICovXG4gICAgZGVsZXRlKGtleSkge1xuICAgICAgICBjb25zdCBpZHggPSBhc0l0ZW1JbmRleChrZXkpO1xuICAgICAgICBpZiAodHlwZW9mIGlkeCAhPT0gJ251bWJlcicpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IGRlbCA9IHRoaXMuaXRlbXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgIHJldHVybiBkZWwubGVuZ3RoID4gMDtcbiAgICB9XG4gICAgZ2V0KGtleSwga2VlcFNjYWxhcikge1xuICAgICAgICBjb25zdCBpZHggPSBhc0l0ZW1JbmRleChrZXkpO1xuICAgICAgICBpZiAodHlwZW9mIGlkeCAhPT0gJ251bWJlcicpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBpdCA9IHRoaXMuaXRlbXNbaWR4XTtcbiAgICAgICAgcmV0dXJuICFrZWVwU2NhbGFyICYmIGlzU2NhbGFyKGl0KSA/IGl0LnZhbHVlIDogaXQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgY29sbGVjdGlvbiBpbmNsdWRlcyBhIHZhbHVlIHdpdGggdGhlIGtleSBga2V5YC5cbiAgICAgKlxuICAgICAqIGBrZXlgIG11c3QgY29udGFpbiBhIHJlcHJlc2VudGF0aW9uIG9mIGFuIGludGVnZXIgZm9yIHRoaXMgdG8gc3VjY2VlZC5cbiAgICAgKiBJdCBtYXkgYmUgd3JhcHBlZCBpbiBhIGBTY2FsYXJgLlxuICAgICAqL1xuICAgIGhhcyhrZXkpIHtcbiAgICAgICAgY29uc3QgaWR4ID0gYXNJdGVtSW5kZXgoa2V5KTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpZHggPT09ICdudW1iZXInICYmIGlkeCA8IHRoaXMuaXRlbXMubGVuZ3RoO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgdmFsdWUgaW4gdGhpcyBjb2xsZWN0aW9uLiBGb3IgYCEhc2V0YCwgYHZhbHVlYCBuZWVkcyB0byBiZSBhXG4gICAgICogYm9vbGVhbiB0byBhZGQvcmVtb3ZlIHRoZSBpdGVtIGZyb20gdGhlIHNldC5cbiAgICAgKlxuICAgICAqIElmIGBrZXlgIGRvZXMgbm90IGNvbnRhaW4gYSByZXByZXNlbnRhdGlvbiBvZiBhbiBpbnRlZ2VyLCB0aGlzIHdpbGwgdGhyb3cuXG4gICAgICogSXQgbWF5IGJlIHdyYXBwZWQgaW4gYSBgU2NhbGFyYC5cbiAgICAgKi9cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBpZHggPSBhc0l0ZW1JbmRleChrZXkpO1xuICAgICAgICBpZiAodHlwZW9mIGlkeCAhPT0gJ251bWJlcicpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGEgdmFsaWQgaW5kZXgsIG5vdCAke2tleX0uYCk7XG4gICAgICAgIGNvbnN0IHByZXYgPSB0aGlzLml0ZW1zW2lkeF07XG4gICAgICAgIGlmIChpc1NjYWxhcihwcmV2KSAmJiBpc1NjYWxhclZhbHVlKHZhbHVlKSlcbiAgICAgICAgICAgIHByZXYudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5pdGVtc1tpZHhdID0gdmFsdWU7XG4gICAgfVxuICAgIHRvSlNPTihfLCBjdHgpIHtcbiAgICAgICAgY29uc3Qgc2VxID0gW107XG4gICAgICAgIGlmIChjdHg/Lm9uQ3JlYXRlKVxuICAgICAgICAgICAgY3R4Lm9uQ3JlYXRlKHNlcSk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlbXMpXG4gICAgICAgICAgICBzZXEucHVzaCh0b0pTKGl0ZW0sIFN0cmluZyhpKyspLCBjdHgpKTtcbiAgICAgICAgcmV0dXJuIHNlcTtcbiAgICB9XG4gICAgdG9TdHJpbmcoY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgICAgIGlmICghY3R4KVxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgICAgICByZXR1cm4gc3RyaW5naWZ5Q29sbGVjdGlvbih0aGlzLCBjdHgsIHtcbiAgICAgICAgICAgIGJsb2NrSXRlbVByZWZpeDogJy0gJyxcbiAgICAgICAgICAgIGZsb3dDaGFyczogeyBzdGFydDogJ1snLCBlbmQ6ICddJyB9LFxuICAgICAgICAgICAgaXRlbUluZGVudDogKGN0eC5pbmRlbnQgfHwgJycpICsgJyAgJyxcbiAgICAgICAgICAgIG9uQ2hvbXBLZWVwLFxuICAgICAgICAgICAgb25Db21tZW50XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbShzY2hlbWEsIG9iaiwgY3R4KSB7XG4gICAgICAgIGNvbnN0IHsgcmVwbGFjZXIgfSA9IGN0eDtcbiAgICAgICAgY29uc3Qgc2VxID0gbmV3IHRoaXMoc2NoZW1hKTtcbiAgICAgICAgaWYgKG9iaiAmJiBTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KG9iaikpIHtcbiAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGl0IG9mIG9iaikge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gb2JqIGluc3RhbmNlb2YgU2V0ID8gaXQgOiBTdHJpbmcoaSsrKTtcbiAgICAgICAgICAgICAgICAgICAgaXQgPSByZXBsYWNlci5jYWxsKG9iaiwga2V5LCBpdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlcS5pdGVtcy5wdXNoKGNyZWF0ZU5vZGUoaXQsIHVuZGVmaW5lZCwgY3R4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNlcTtcbiAgICB9XG59XG5mdW5jdGlvbiBhc0l0ZW1JbmRleChrZXkpIHtcbiAgICBsZXQgaWR4ID0gaXNTY2FsYXIoa2V5KSA/IGtleS52YWx1ZSA6IGtleTtcbiAgICBpZiAoaWR4ICYmIHR5cGVvZiBpZHggPT09ICdzdHJpbmcnKVxuICAgICAgICBpZHggPSBOdW1iZXIoaWR4KTtcbiAgICByZXR1cm4gdHlwZW9mIGlkeCA9PT0gJ251bWJlcicgJiYgTnVtYmVyLmlzSW50ZWdlcihpZHgpICYmIGlkeCA+PSAwXG4gICAgICAgID8gaWR4XG4gICAgICAgIDogbnVsbDtcbn1cblxuZXhwb3J0IHsgWUFNTFNlcSB9O1xuIiwgImltcG9ydCB7IGlzU2VxIH0gZnJvbSAnLi4vLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgWUFNTFNlcSB9IGZyb20gJy4uLy4uL25vZGVzL1lBTUxTZXEuanMnO1xuXG5jb25zdCBzZXEgPSB7XG4gICAgY29sbGVjdGlvbjogJ3NlcScsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBub2RlQ2xhc3M6IFlBTUxTZXEsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6c2VxJyxcbiAgICByZXNvbHZlKHNlcSwgb25FcnJvcikge1xuICAgICAgICBpZiAoIWlzU2VxKHNlcSkpXG4gICAgICAgICAgICBvbkVycm9yKCdFeHBlY3RlZCBhIHNlcXVlbmNlIGZvciB0aGlzIHRhZycpO1xuICAgICAgICByZXR1cm4gc2VxO1xuICAgIH0sXG4gICAgY3JlYXRlTm9kZTogKHNjaGVtYSwgb2JqLCBjdHgpID0+IFlBTUxTZXEuZnJvbShzY2hlbWEsIG9iaiwgY3R4KVxufTtcblxuZXhwb3J0IHsgc2VxIH07XG4iLCAiaW1wb3J0IHsgc3RyaW5naWZ5U3RyaW5nIH0gZnJvbSAnLi4vLi4vc3RyaW5naWZ5L3N0cmluZ2lmeVN0cmluZy5qcyc7XG5cbmNvbnN0IHN0cmluZyA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOnN0cicsXG4gICAgcmVzb2x2ZTogc3RyID0+IHN0cixcbiAgICBzdHJpbmdpZnkoaXRlbSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgICAgIGN0eCA9IE9iamVjdC5hc3NpZ24oeyBhY3R1YWxTdHJpbmc6IHRydWUgfSwgY3R4KTtcbiAgICAgICAgcmV0dXJuIHN0cmluZ2lmeVN0cmluZyhpdGVtLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IHN0cmluZyB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL1NjYWxhci5qcyc7XG5cbmNvbnN0IG51bGxUYWcgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHZhbHVlID09IG51bGwsXG4gICAgY3JlYXRlTm9kZTogKCkgPT4gbmV3IFNjYWxhcihudWxsKSxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOm51bGwnLFxuICAgIHRlc3Q6IC9eKD86fnxbTm5ddWxsfE5VTEwpPyQvLFxuICAgIHJlc29sdmU6ICgpID0+IG5ldyBTY2FsYXIobnVsbCksXG4gICAgc3RyaW5naWZ5OiAoeyBzb3VyY2UgfSwgY3R4KSA9PiB0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJyAmJiBudWxsVGFnLnRlc3QudGVzdChzb3VyY2UpXG4gICAgICAgID8gc291cmNlXG4gICAgICAgIDogY3R4Lm9wdGlvbnMubnVsbFN0clxufTtcblxuZXhwb3J0IHsgbnVsbFRhZyB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL1NjYWxhci5qcyc7XG5cbmNvbnN0IGJvb2xUYWcgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6Ym9vbCcsXG4gICAgdGVzdDogL14oPzpbVHRdcnVlfFRSVUV8W0ZmXWFsc2V8RkFMU0UpJC8sXG4gICAgcmVzb2x2ZTogc3RyID0+IG5ldyBTY2FsYXIoc3RyWzBdID09PSAndCcgfHwgc3RyWzBdID09PSAnVCcpLFxuICAgIHN0cmluZ2lmeSh7IHNvdXJjZSwgdmFsdWUgfSwgY3R4KSB7XG4gICAgICAgIGlmIChzb3VyY2UgJiYgYm9vbFRhZy50ZXN0LnRlc3Qoc291cmNlKSkge1xuICAgICAgICAgICAgY29uc3Qgc3YgPSBzb3VyY2VbMF0gPT09ICd0JyB8fCBzb3VyY2VbMF0gPT09ICdUJztcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gc3YpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWUgPyBjdHgub3B0aW9ucy50cnVlU3RyIDogY3R4Lm9wdGlvbnMuZmFsc2VTdHI7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgYm9vbFRhZyB9O1xuIiwgImZ1bmN0aW9uIHN0cmluZ2lmeU51bWJlcih7IGZvcm1hdCwgbWluRnJhY3Rpb25EaWdpdHMsIHRhZywgdmFsdWUgfSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdiaWdpbnQnKVxuICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICBjb25zdCBudW0gPSB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInID8gdmFsdWUgOiBOdW1iZXIodmFsdWUpO1xuICAgIGlmICghaXNGaW5pdGUobnVtKSlcbiAgICAgICAgcmV0dXJuIGlzTmFOKG51bSkgPyAnLm5hbicgOiBudW0gPCAwID8gJy0uaW5mJyA6ICcuaW5mJztcbiAgICBsZXQgbiA9IE9iamVjdC5pcyh2YWx1ZSwgLTApID8gJy0wJyA6IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICBpZiAoIWZvcm1hdCAmJlxuICAgICAgICBtaW5GcmFjdGlvbkRpZ2l0cyAmJlxuICAgICAgICAoIXRhZyB8fCB0YWcgPT09ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCcpICYmXG4gICAgICAgIC9eLT9cXGQvLnRlc3QobikgJiZcbiAgICAgICAgIW4uaW5jbHVkZXMoJ2UnKSkge1xuICAgICAgICBsZXQgaSA9IG4uaW5kZXhPZignLicpO1xuICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICAgIGkgPSBuLmxlbmd0aDtcbiAgICAgICAgICAgIG4gKz0gJy4nO1xuICAgICAgICB9XG4gICAgICAgIGxldCBkID0gbWluRnJhY3Rpb25EaWdpdHMgLSAobi5sZW5ndGggLSBpIC0gMSk7XG4gICAgICAgIHdoaWxlIChkLS0gPiAwKVxuICAgICAgICAgICAgbiArPSAnMCc7XG4gICAgfVxuICAgIHJldHVybiBuO1xufVxuXG5leHBvcnQgeyBzdHJpbmdpZnlOdW1iZXIgfTtcbiIsICJpbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9TY2FsYXIuanMnO1xuaW1wb3J0IHsgc3RyaW5naWZ5TnVtYmVyIH0gZnJvbSAnLi4vLi4vc3RyaW5naWZ5L3N0cmluZ2lmeU51bWJlci5qcyc7XG5cbmNvbnN0IGZsb2F0TmFOID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnLFxuICAgIHRlc3Q6IC9eKD86Wy0rXT9cXC4oPzppbmZ8SW5mfElORil8XFwubmFufFxcLk5hTnxcXC5OQU4pJC8sXG4gICAgcmVzb2x2ZTogc3RyID0+IHN0ci5zbGljZSgtMykudG9Mb3dlckNhc2UoKSA9PT0gJ25hbidcbiAgICAgICAgPyBOYU5cbiAgICAgICAgOiBzdHJbMF0gPT09ICctJ1xuICAgICAgICAgICAgPyBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFlcbiAgICAgICAgICAgIDogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5TnVtYmVyXG59O1xuY29uc3QgZmxvYXRFeHAgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCcsXG4gICAgZm9ybWF0OiAnRVhQJyxcbiAgICB0ZXN0OiAvXlstK10/KD86XFwuWzAtOV0rfFswLTldKyg/OlxcLlswLTldKik/KVtlRV1bLStdP1swLTldKyQvLFxuICAgIHJlc29sdmU6IHN0ciA9PiBwYXJzZUZsb2F0KHN0ciksXG4gICAgc3RyaW5naWZ5KG5vZGUpIHtcbiAgICAgICAgY29uc3QgbnVtID0gTnVtYmVyKG5vZGUudmFsdWUpO1xuICAgICAgICByZXR1cm4gaXNGaW5pdGUobnVtKSA/IG51bS50b0V4cG9uZW50aWFsKCkgOiBzdHJpbmdpZnlOdW1iZXIobm9kZSk7XG4gICAgfVxufTtcbmNvbnN0IGZsb2F0ID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnLFxuICAgIHRlc3Q6IC9eWy0rXT8oPzpcXC5bMC05XSt8WzAtOV0rXFwuWzAtOV0qKSQvLFxuICAgIHJlc29sdmUoc3RyKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgU2NhbGFyKHBhcnNlRmxvYXQoc3RyKSk7XG4gICAgICAgIGNvbnN0IGRvdCA9IHN0ci5pbmRleE9mKCcuJyk7XG4gICAgICAgIGlmIChkb3QgIT09IC0xICYmIHN0cltzdHIubGVuZ3RoIC0gMV0gPT09ICcwJylcbiAgICAgICAgICAgIG5vZGUubWluRnJhY3Rpb25EaWdpdHMgPSBzdHIubGVuZ3RoIC0gZG90IC0gMTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfSxcbiAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeU51bWJlclxufTtcblxuZXhwb3J0IHsgZmxvYXQsIGZsb2F0RXhwLCBmbG9hdE5hTiB9O1xuIiwgImltcG9ydCB7IHN0cmluZ2lmeU51bWJlciB9IGZyb20gJy4uLy4uL3N0cmluZ2lmeS9zdHJpbmdpZnlOdW1iZXIuanMnO1xuXG5jb25zdCBpbnRJZGVudGlmeSA9ICh2YWx1ZSkgPT4gdHlwZW9mIHZhbHVlID09PSAnYmlnaW50JyB8fCBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbmNvbnN0IGludFJlc29sdmUgPSAoc3RyLCBvZmZzZXQsIHJhZGl4LCB7IGludEFzQmlnSW50IH0pID0+IChpbnRBc0JpZ0ludCA/IEJpZ0ludChzdHIpIDogcGFyc2VJbnQoc3RyLnN1YnN0cmluZyhvZmZzZXQpLCByYWRpeCkpO1xuZnVuY3Rpb24gaW50U3RyaW5naWZ5KG5vZGUsIHJhZGl4LCBwcmVmaXgpIHtcbiAgICBjb25zdCB7IHZhbHVlIH0gPSBub2RlO1xuICAgIGlmIChpbnRJZGVudGlmeSh2YWx1ZSkgJiYgdmFsdWUgPj0gMClcbiAgICAgICAgcmV0dXJuIHByZWZpeCArIHZhbHVlLnRvU3RyaW5nKHJhZGl4KTtcbiAgICByZXR1cm4gc3RyaW5naWZ5TnVtYmVyKG5vZGUpO1xufVxuY29uc3QgaW50T2N0ID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiBpbnRJZGVudGlmeSh2YWx1ZSkgJiYgdmFsdWUgPj0gMCxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmludCcsXG4gICAgZm9ybWF0OiAnT0NUJyxcbiAgICB0ZXN0OiAvXjBvWzAtN10rJC8sXG4gICAgcmVzb2x2ZTogKHN0ciwgX29uRXJyb3IsIG9wdCkgPT4gaW50UmVzb2x2ZShzdHIsIDIsIDgsIG9wdCksXG4gICAgc3RyaW5naWZ5OiBub2RlID0+IGludFN0cmluZ2lmeShub2RlLCA4LCAnMG8nKVxufTtcbmNvbnN0IGludCA9IHtcbiAgICBpZGVudGlmeTogaW50SWRlbnRpZnksXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjppbnQnLFxuICAgIHRlc3Q6IC9eWy0rXT9bMC05XSskLyxcbiAgICByZXNvbHZlOiAoc3RyLCBfb25FcnJvciwgb3B0KSA9PiBpbnRSZXNvbHZlKHN0ciwgMCwgMTAsIG9wdCksXG4gICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlOdW1iZXJcbn07XG5jb25zdCBpbnRIZXggPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IGludElkZW50aWZ5KHZhbHVlKSAmJiB2YWx1ZSA+PSAwLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6aW50JyxcbiAgICBmb3JtYXQ6ICdIRVgnLFxuICAgIHRlc3Q6IC9eMHhbMC05YS1mQS1GXSskLyxcbiAgICByZXNvbHZlOiAoc3RyLCBfb25FcnJvciwgb3B0KSA9PiBpbnRSZXNvbHZlKHN0ciwgMiwgMTYsIG9wdCksXG4gICAgc3RyaW5naWZ5OiBub2RlID0+IGludFN0cmluZ2lmeShub2RlLCAxNiwgJzB4Jylcbn07XG5cbmV4cG9ydCB7IGludCwgaW50SGV4LCBpbnRPY3QgfTtcbiIsICJpbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9jb21tb24vbWFwLmpzJztcbmltcG9ydCB7IG51bGxUYWcgfSBmcm9tICcuLi9jb21tb24vbnVsbC5qcyc7XG5pbXBvcnQgeyBzZXEgfSBmcm9tICcuLi9jb21tb24vc2VxLmpzJztcbmltcG9ydCB7IHN0cmluZyB9IGZyb20gJy4uL2NvbW1vbi9zdHJpbmcuanMnO1xuaW1wb3J0IHsgYm9vbFRhZyB9IGZyb20gJy4vYm9vbC5qcyc7XG5pbXBvcnQgeyBmbG9hdE5hTiwgZmxvYXRFeHAsIGZsb2F0IH0gZnJvbSAnLi9mbG9hdC5qcyc7XG5pbXBvcnQgeyBpbnRPY3QsIGludCwgaW50SGV4IH0gZnJvbSAnLi9pbnQuanMnO1xuXG5jb25zdCBzY2hlbWEgPSBbXG4gICAgbWFwLFxuICAgIHNlcSxcbiAgICBzdHJpbmcsXG4gICAgbnVsbFRhZyxcbiAgICBib29sVGFnLFxuICAgIGludE9jdCxcbiAgICBpbnQsXG4gICAgaW50SGV4LFxuICAgIGZsb2F0TmFOLFxuICAgIGZsb2F0RXhwLFxuICAgIGZsb2F0XG5dO1xuXG5leHBvcnQgeyBzY2hlbWEgfTtcbiIsICJpbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9TY2FsYXIuanMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vY29tbW9uL21hcC5qcyc7XG5pbXBvcnQgeyBzZXEgfSBmcm9tICcuLi9jb21tb24vc2VxLmpzJztcblxuZnVuY3Rpb24gaW50SWRlbnRpZnkodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnYmlnaW50JyB8fCBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbn1cbmNvbnN0IHN0cmluZ2lmeUpTT04gPSAoeyB2YWx1ZSB9KSA9PiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5jb25zdCBqc29uU2NhbGFycyA9IFtcbiAgICB7XG4gICAgICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnLFxuICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpzdHInLFxuICAgICAgICByZXNvbHZlOiBzdHIgPT4gc3RyLFxuICAgICAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeUpTT05cbiAgICB9LFxuICAgIHtcbiAgICAgICAgaWRlbnRpZnk6IHZhbHVlID0+IHZhbHVlID09IG51bGwsXG4gICAgICAgIGNyZWF0ZU5vZGU6ICgpID0+IG5ldyBTY2FsYXIobnVsbCksXG4gICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOm51bGwnLFxuICAgICAgICB0ZXN0OiAvXm51bGwkLyxcbiAgICAgICAgcmVzb2x2ZTogKCkgPT4gbnVsbCxcbiAgICAgICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlKU09OXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyxcbiAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6Ym9vbCcsXG4gICAgICAgIHRlc3Q6IC9edHJ1ZSR8XmZhbHNlJC8sXG4gICAgICAgIHJlc29sdmU6IHN0ciA9PiBzdHIgPT09ICd0cnVlJyxcbiAgICAgICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlKU09OXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkZW50aWZ5OiBpbnRJZGVudGlmeSxcbiAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6aW50JyxcbiAgICAgICAgdGVzdDogL14tPyg/OjB8WzEtOV1bMC05XSopJC8sXG4gICAgICAgIHJlc29sdmU6IChzdHIsIF9vbkVycm9yLCB7IGludEFzQmlnSW50IH0pID0+IGludEFzQmlnSW50ID8gQmlnSW50KHN0cikgOiBwYXJzZUludChzdHIsIDEwKSxcbiAgICAgICAgc3RyaW5naWZ5OiAoeyB2YWx1ZSB9KSA9PiBpbnRJZGVudGlmeSh2YWx1ZSkgPyB2YWx1ZS50b1N0cmluZygpIDogSlNPTi5zdHJpbmdpZnkodmFsdWUpXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLFxuICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCcsXG4gICAgICAgIHRlc3Q6IC9eLT8oPzowfFsxLTldWzAtOV0qKSg/OlxcLlswLTldKik/KD86W2VFXVstK10/WzAtOV0rKT8kLyxcbiAgICAgICAgcmVzb2x2ZTogc3RyID0+IHBhcnNlRmxvYXQoc3RyKSxcbiAgICAgICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlKU09OXG4gICAgfVxuXTtcbmNvbnN0IGpzb25FcnJvciA9IHtcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJycsXG4gICAgdGVzdDogL14vLFxuICAgIHJlc29sdmUoc3RyLCBvbkVycm9yKSB7XG4gICAgICAgIG9uRXJyb3IoYFVucmVzb2x2ZWQgcGxhaW4gc2NhbGFyICR7SlNPTi5zdHJpbmdpZnkoc3RyKX1gKTtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG59O1xuY29uc3Qgc2NoZW1hID0gW21hcCwgc2VxXS5jb25jYXQoanNvblNjYWxhcnMsIGpzb25FcnJvcik7XG5cbmV4cG9ydCB7IHNjaGVtYSB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL1NjYWxhci5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnlTdHJpbmcgfSBmcm9tICcuLi8uLi9zdHJpbmdpZnkvc3RyaW5naWZ5U3RyaW5nLmpzJztcblxuY29uc3QgYmluYXJ5ID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB2YWx1ZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXksIC8vIEJ1ZmZlciBpbmhlcml0cyBmcm9tIFVpbnQ4QXJyYXlcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpiaW5hcnknLFxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBCdWZmZXIgaW4gbm9kZSBhbmQgYW4gVWludDhBcnJheSBpbiBicm93c2Vyc1xuICAgICAqXG4gICAgICogVG8gdXNlIHRoZSByZXN1bHRpbmcgYnVmZmVyIGFzIGFuIGltYWdlLCB5b3UnbGwgd2FudCB0byBkbyBzb21ldGhpbmcgbGlrZTpcbiAgICAgKlxuICAgICAqICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFtidWZmZXJdLCB7IHR5cGU6ICdpbWFnZS9qcGVnJyB9KVxuICAgICAqICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Bob3RvJykuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKVxuICAgICAqL1xuICAgIHJlc29sdmUoc3JjLCBvbkVycm9yKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXRvYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgLy8gT24gSUUgMTEsIGF0b2IoKSBjYW4ndCBoYW5kbGUgbmV3bGluZXNcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9IGF0b2Ioc3JjLnJlcGxhY2UoL1tcXG5cXHJdL2csICcnKSk7XG4gICAgICAgICAgICBjb25zdCBidWZmZXIgPSBuZXcgVWludDhBcnJheShzdHIubGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgIGJ1ZmZlcltpXSA9IHN0ci5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG9uRXJyb3IoJ1RoaXMgZW52aXJvbm1lbnQgZG9lcyBub3Qgc3VwcG9ydCByZWFkaW5nIGJpbmFyeSB0YWdzOyBlaXRoZXIgQnVmZmVyIG9yIGF0b2IgaXMgcmVxdWlyZWQnKTtcbiAgICAgICAgICAgIHJldHVybiBzcmM7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHN0cmluZ2lmeSh7IGNvbW1lbnQsIHR5cGUsIHZhbHVlIH0sIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCkge1xuICAgICAgICBpZiAoIXZhbHVlKVxuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICBjb25zdCBidWYgPSB2YWx1ZTsgLy8gY2hlY2tlZCBlYXJsaWVyIGJ5IGJpbmFyeS5pZGVudGlmeSgpXG4gICAgICAgIGxldCBzdHI7XG4gICAgICAgIGlmICh0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbGV0IHMgPSAnJztcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgIHMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pO1xuICAgICAgICAgICAgc3RyID0gYnRvYShzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBlbnZpcm9ubWVudCBkb2VzIG5vdCBzdXBwb3J0IHdyaXRpbmcgYmluYXJ5IHRhZ3M7IGVpdGhlciBCdWZmZXIgb3IgYnRvYSBpcyByZXF1aXJlZCcpO1xuICAgICAgICB9XG4gICAgICAgIHR5cGUgPz8gKHR5cGUgPSBTY2FsYXIuQkxPQ0tfTElURVJBTCk7XG4gICAgICAgIGlmICh0eXBlICE9PSBTY2FsYXIuUVVPVEVfRE9VQkxFKSB7XG4gICAgICAgICAgICBjb25zdCBsaW5lV2lkdGggPSBNYXRoLm1heChjdHgub3B0aW9ucy5saW5lV2lkdGggLSBjdHguaW5kZW50Lmxlbmd0aCwgY3R4Lm9wdGlvbnMubWluQ29udGVudFdpZHRoKTtcbiAgICAgICAgICAgIGNvbnN0IG4gPSBNYXRoLmNlaWwoc3RyLmxlbmd0aCAvIGxpbmVXaWR0aCk7XG4gICAgICAgICAgICBjb25zdCBsaW5lcyA9IG5ldyBBcnJheShuKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBvID0gMDsgaSA8IG47ICsraSwgbyArPSBsaW5lV2lkdGgpIHtcbiAgICAgICAgICAgICAgICBsaW5lc1tpXSA9IHN0ci5zdWJzdHIobywgbGluZVdpZHRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0ciA9IGxpbmVzLmpvaW4odHlwZSA9PT0gU2NhbGFyLkJMT0NLX0xJVEVSQUwgPyAnXFxuJyA6ICcgJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cmluZ2lmeVN0cmluZyh7IGNvbW1lbnQsIHR5cGUsIHZhbHVlOiBzdHIgfSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBiaW5hcnkgfTtcbiIsICJpbXBvcnQgeyBpc1NlcSwgaXNQYWlyLCBpc01hcCB9IGZyb20gJy4uLy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IGNyZWF0ZVBhaXIsIFBhaXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9QYWlyLmpzJztcbmltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL1NjYWxhci5qcyc7XG5pbXBvcnQgeyBZQU1MU2VxIH0gZnJvbSAnLi4vLi4vbm9kZXMvWUFNTFNlcS5qcyc7XG5cbmZ1bmN0aW9uIHJlc29sdmVQYWlycyhzZXEsIG9uRXJyb3IpIHtcbiAgICBpZiAoaXNTZXEoc2VxKSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlcS5pdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSBzZXEuaXRlbXNbaV07XG4gICAgICAgICAgICBpZiAoaXNQYWlyKGl0ZW0pKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgZWxzZSBpZiAoaXNNYXAoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5pdGVtcy5sZW5ndGggPiAxKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKCdFYWNoIHBhaXIgbXVzdCBoYXZlIGl0cyBvd24gc2VxdWVuY2UgaW5kaWNhdG9yJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFpciA9IGl0ZW0uaXRlbXNbMF0gfHwgbmV3IFBhaXIobmV3IFNjYWxhcihudWxsKSk7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudEJlZm9yZSlcbiAgICAgICAgICAgICAgICAgICAgcGFpci5rZXkuY29tbWVudEJlZm9yZSA9IHBhaXIua2V5LmNvbW1lbnRCZWZvcmVcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYCR7aXRlbS5jb21tZW50QmVmb3JlfVxcbiR7cGFpci5rZXkuY29tbWVudEJlZm9yZX1gXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGl0ZW0uY29tbWVudEJlZm9yZTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNuID0gcGFpci52YWx1ZSA/PyBwYWlyLmtleTtcbiAgICAgICAgICAgICAgICAgICAgY24uY29tbWVudCA9IGNuLmNvbW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gYCR7aXRlbS5jb21tZW50fVxcbiR7Y24uY29tbWVudH1gXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGl0ZW0uY29tbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaXRlbSA9IHBhaXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXEuaXRlbXNbaV0gPSBpc1BhaXIoaXRlbSkgPyBpdGVtIDogbmV3IFBhaXIoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZVxuICAgICAgICBvbkVycm9yKCdFeHBlY3RlZCBhIHNlcXVlbmNlIGZvciB0aGlzIHRhZycpO1xuICAgIHJldHVybiBzZXE7XG59XG5mdW5jdGlvbiBjcmVhdGVQYWlycyhzY2hlbWEsIGl0ZXJhYmxlLCBjdHgpIHtcbiAgICBjb25zdCB7IHJlcGxhY2VyIH0gPSBjdHg7XG4gICAgY29uc3QgcGFpcnMgPSBuZXcgWUFNTFNlcShzY2hlbWEpO1xuICAgIHBhaXJzLnRhZyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpwYWlycyc7XG4gICAgbGV0IGkgPSAwO1xuICAgIGlmIChpdGVyYWJsZSAmJiBTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXJhYmxlKSlcbiAgICAgICAgZm9yIChsZXQgaXQgb2YgaXRlcmFibGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgaXQgPSByZXBsYWNlci5jYWxsKGl0ZXJhYmxlLCBTdHJpbmcoaSsrKSwgaXQpO1xuICAgICAgICAgICAgbGV0IGtleSwgdmFsdWU7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShpdCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXQubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IGl0WzBdO1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGl0WzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIFtrZXksIHZhbHVlXSB0dXBsZTogJHtpdH1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGl0ICYmIGl0IGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGl0KTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5ID0ga2V5c1swXTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBpdFtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgRXhwZWN0ZWQgdHVwbGUgd2l0aCBvbmUga2V5LCBub3QgJHtrZXlzLmxlbmd0aH0ga2V5c2ApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGtleSA9IGl0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFpcnMuaXRlbXMucHVzaChjcmVhdGVQYWlyKGtleSwgdmFsdWUsIGN0eCkpO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHBhaXJzO1xufVxuY29uc3QgcGFpcnMgPSB7XG4gICAgY29sbGVjdGlvbjogJ3NlcScsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6cGFpcnMnLFxuICAgIHJlc29sdmU6IHJlc29sdmVQYWlycyxcbiAgICBjcmVhdGVOb2RlOiBjcmVhdGVQYWlyc1xufTtcblxuZXhwb3J0IHsgY3JlYXRlUGFpcnMsIHBhaXJzLCByZXNvbHZlUGFpcnMgfTtcbiIsICJpbXBvcnQgeyBpc1NjYWxhciwgaXNQYWlyIH0gZnJvbSAnLi4vLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgdG9KUyB9IGZyb20gJy4uLy4uL25vZGVzL3RvSlMuanMnO1xuaW1wb3J0IHsgWUFNTE1hcCB9IGZyb20gJy4uLy4uL25vZGVzL1lBTUxNYXAuanMnO1xuaW1wb3J0IHsgWUFNTFNlcSB9IGZyb20gJy4uLy4uL25vZGVzL1lBTUxTZXEuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZVBhaXJzLCBjcmVhdGVQYWlycyB9IGZyb20gJy4vcGFpcnMuanMnO1xuXG5jbGFzcyBZQU1MT01hcCBleHRlbmRzIFlBTUxTZXEge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmFkZCA9IFlBTUxNYXAucHJvdG90eXBlLmFkZC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmRlbGV0ZSA9IFlBTUxNYXAucHJvdG90eXBlLmRlbGV0ZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmdldCA9IFlBTUxNYXAucHJvdG90eXBlLmdldC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmhhcyA9IFlBTUxNYXAucHJvdG90eXBlLmhhcy5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnNldCA9IFlBTUxNYXAucHJvdG90eXBlLnNldC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnRhZyA9IFlBTUxPTWFwLnRhZztcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgYGN0eGAgaXMgZ2l2ZW4sIHRoZSByZXR1cm4gdHlwZSBpcyBhY3R1YWxseSBgTWFwPHVua25vd24sIHVua25vd24+YCxcbiAgICAgKiBidXQgVHlwZVNjcmlwdCB3b24ndCBhbGxvdyB3aWRlbmluZyB0aGUgc2lnbmF0dXJlIG9mIGEgY2hpbGQgbWV0aG9kLlxuICAgICAqL1xuICAgIHRvSlNPTihfLCBjdHgpIHtcbiAgICAgICAgaWYgKCFjdHgpXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIudG9KU09OKF8pO1xuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGlmIChjdHg/Lm9uQ3JlYXRlKVxuICAgICAgICAgICAgY3R4Lm9uQ3JlYXRlKG1hcCk7XG4gICAgICAgIGZvciAoY29uc3QgcGFpciBvZiB0aGlzLml0ZW1zKSB7XG4gICAgICAgICAgICBsZXQga2V5LCB2YWx1ZTtcbiAgICAgICAgICAgIGlmIChpc1BhaXIocGFpcikpIHtcbiAgICAgICAgICAgICAgICBrZXkgPSB0b0pTKHBhaXIua2V5LCAnJywgY3R4KTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRvSlMocGFpci52YWx1ZSwga2V5LCBjdHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAga2V5ID0gdG9KUyhwYWlyLCAnJywgY3R4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXAuaGFzKGtleSkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPcmRlcmVkIG1hcHMgbXVzdCBub3QgaW5jbHVkZSBkdXBsaWNhdGUga2V5cycpO1xuICAgICAgICAgICAgbWFwLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbShzY2hlbWEsIGl0ZXJhYmxlLCBjdHgpIHtcbiAgICAgICAgY29uc3QgcGFpcnMgPSBjcmVhdGVQYWlycyhzY2hlbWEsIGl0ZXJhYmxlLCBjdHgpO1xuICAgICAgICBjb25zdCBvbWFwID0gbmV3IHRoaXMoKTtcbiAgICAgICAgb21hcC5pdGVtcyA9IHBhaXJzLml0ZW1zO1xuICAgICAgICByZXR1cm4gb21hcDtcbiAgICB9XG59XG5ZQU1MT01hcC50YWcgPSAndGFnOnlhbWwub3JnLDIwMDI6b21hcCc7XG5jb25zdCBvbWFwID0ge1xuICAgIGNvbGxlY3Rpb246ICdzZXEnLFxuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB2YWx1ZSBpbnN0YW5jZW9mIE1hcCxcbiAgICBub2RlQ2xhc3M6IFlBTUxPTWFwLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOm9tYXAnLFxuICAgIHJlc29sdmUoc2VxLCBvbkVycm9yKSB7XG4gICAgICAgIGNvbnN0IHBhaXJzID0gcmVzb2x2ZVBhaXJzKHNlcSwgb25FcnJvcik7XG4gICAgICAgIGNvbnN0IHNlZW5LZXlzID0gW107XG4gICAgICAgIGZvciAoY29uc3QgeyBrZXkgfSBvZiBwYWlycy5pdGVtcykge1xuICAgICAgICAgICAgaWYgKGlzU2NhbGFyKGtleSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VlbktleXMuaW5jbHVkZXMoa2V5LnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKGBPcmRlcmVkIG1hcHMgbXVzdCBub3QgaW5jbHVkZSBkdXBsaWNhdGUga2V5czogJHtrZXkudmFsdWV9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWVuS2V5cy5wdXNoKGtleS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyBZQU1MT01hcCgpLCBwYWlycyk7XG4gICAgfSxcbiAgICBjcmVhdGVOb2RlOiAoc2NoZW1hLCBpdGVyYWJsZSwgY3R4KSA9PiBZQU1MT01hcC5mcm9tKHNjaGVtYSwgaXRlcmFibGUsIGN0eClcbn07XG5cbmV4cG9ydCB7IFlBTUxPTWFwLCBvbWFwIH07XG4iLCAiaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vLi4vbm9kZXMvU2NhbGFyLmpzJztcblxuZnVuY3Rpb24gYm9vbFN0cmluZ2lmeSh7IHZhbHVlLCBzb3VyY2UgfSwgY3R4KSB7XG4gICAgY29uc3QgYm9vbE9iaiA9IHZhbHVlID8gdHJ1ZVRhZyA6IGZhbHNlVGFnO1xuICAgIGlmIChzb3VyY2UgJiYgYm9vbE9iai50ZXN0LnRlc3Qoc291cmNlKSlcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICByZXR1cm4gdmFsdWUgPyBjdHgub3B0aW9ucy50cnVlU3RyIDogY3R4Lm9wdGlvbnMuZmFsc2VTdHI7XG59XG5jb25zdCB0cnVlVGFnID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB2YWx1ZSA9PT0gdHJ1ZSxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmJvb2wnLFxuICAgIHRlc3Q6IC9eKD86WXx5fFtZeV1lc3xZRVN8W1R0XXJ1ZXxUUlVFfFtPb11ufE9OKSQvLFxuICAgIHJlc29sdmU6ICgpID0+IG5ldyBTY2FsYXIodHJ1ZSksXG4gICAgc3RyaW5naWZ5OiBib29sU3RyaW5naWZ5XG59O1xuY29uc3QgZmFsc2VUYWcgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHZhbHVlID09PSBmYWxzZSxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmJvb2wnLFxuICAgIHRlc3Q6IC9eKD86TnxufFtObl1vfE5PfFtGZl1hbHNlfEZBTFNFfFtPb11mZnxPRkYpJC8sXG4gICAgcmVzb2x2ZTogKCkgPT4gbmV3IFNjYWxhcihmYWxzZSksXG4gICAgc3RyaW5naWZ5OiBib29sU3RyaW5naWZ5XG59O1xuXG5leHBvcnQgeyBmYWxzZVRhZywgdHJ1ZVRhZyB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL1NjYWxhci5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnlOdW1iZXIgfSBmcm9tICcuLi8uLi9zdHJpbmdpZnkvc3RyaW5naWZ5TnVtYmVyLmpzJztcblxuY29uc3QgZmxvYXROYU4gPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCcsXG4gICAgdGVzdDogL14oPzpbLStdP1xcLig/OmluZnxJbmZ8SU5GKXxcXC5uYW58XFwuTmFOfFxcLk5BTikkLyxcbiAgICByZXNvbHZlOiAoc3RyKSA9PiBzdHIuc2xpY2UoLTMpLnRvTG93ZXJDYXNlKCkgPT09ICduYW4nXG4gICAgICAgID8gTmFOXG4gICAgICAgIDogc3RyWzBdID09PSAnLSdcbiAgICAgICAgICAgID8gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZXG4gICAgICAgICAgICA6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeU51bWJlclxufTtcbmNvbnN0IGZsb2F0RXhwID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnLFxuICAgIGZvcm1hdDogJ0VYUCcsXG4gICAgdGVzdDogL15bLStdPyg/OlswLTldWzAtOV9dKik/KD86XFwuWzAtOV9dKik/W2VFXVstK10/WzAtOV0rJC8sXG4gICAgcmVzb2x2ZTogKHN0cikgPT4gcGFyc2VGbG9hdChzdHIucmVwbGFjZSgvXy9nLCAnJykpLFxuICAgIHN0cmluZ2lmeShub2RlKSB7XG4gICAgICAgIGNvbnN0IG51bSA9IE51bWJlcihub2RlLnZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGlzRmluaXRlKG51bSkgPyBudW0udG9FeHBvbmVudGlhbCgpIDogc3RyaW5naWZ5TnVtYmVyKG5vZGUpO1xuICAgIH1cbn07XG5jb25zdCBmbG9hdCA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0JyxcbiAgICB0ZXN0OiAvXlstK10/KD86WzAtOV1bMC05X10qKT9cXC5bMC05X10qJC8sXG4gICAgcmVzb2x2ZShzdHIpIHtcbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBTY2FsYXIocGFyc2VGbG9hdChzdHIucmVwbGFjZSgvXy9nLCAnJykpKTtcbiAgICAgICAgY29uc3QgZG90ID0gc3RyLmluZGV4T2YoJy4nKTtcbiAgICAgICAgaWYgKGRvdCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnN0IGYgPSBzdHIuc3Vic3RyaW5nKGRvdCArIDEpLnJlcGxhY2UoL18vZywgJycpO1xuICAgICAgICAgICAgaWYgKGZbZi5sZW5ndGggLSAxXSA9PT0gJzAnKVxuICAgICAgICAgICAgICAgIG5vZGUubWluRnJhY3Rpb25EaWdpdHMgPSBmLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9LFxuICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5TnVtYmVyXG59O1xuXG5leHBvcnQgeyBmbG9hdCwgZmxvYXRFeHAsIGZsb2F0TmFOIH07XG4iLCAiaW1wb3J0IHsgc3RyaW5naWZ5TnVtYmVyIH0gZnJvbSAnLi4vLi4vc3RyaW5naWZ5L3N0cmluZ2lmeU51bWJlci5qcyc7XG5cbmNvbnN0IGludElkZW50aWZ5ID0gKHZhbHVlKSA9PiB0eXBlb2YgdmFsdWUgPT09ICdiaWdpbnQnIHx8IE51bWJlci5pc0ludGVnZXIodmFsdWUpO1xuZnVuY3Rpb24gaW50UmVzb2x2ZShzdHIsIG9mZnNldCwgcmFkaXgsIHsgaW50QXNCaWdJbnQgfSkge1xuICAgIGNvbnN0IHNpZ24gPSBzdHJbMF07XG4gICAgaWYgKHNpZ24gPT09ICctJyB8fCBzaWduID09PSAnKycpXG4gICAgICAgIG9mZnNldCArPSAxO1xuICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcob2Zmc2V0KS5yZXBsYWNlKC9fL2csICcnKTtcbiAgICBpZiAoaW50QXNCaWdJbnQpIHtcbiAgICAgICAgc3dpdGNoIChyYWRpeCkge1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIHN0ciA9IGAwYiR7c3RyfWA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgc3RyID0gYDBvJHtzdHJ9YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTY6XG4gICAgICAgICAgICAgICAgc3RyID0gYDB4JHtzdHJ9YDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBuID0gQmlnSW50KHN0cik7XG4gICAgICAgIHJldHVybiBzaWduID09PSAnLScgPyBCaWdJbnQoLTEpICogbiA6IG47XG4gICAgfVxuICAgIGNvbnN0IG4gPSBwYXJzZUludChzdHIsIHJhZGl4KTtcbiAgICByZXR1cm4gc2lnbiA9PT0gJy0nID8gLTEgKiBuIDogbjtcbn1cbmZ1bmN0aW9uIGludFN0cmluZ2lmeShub2RlLCByYWRpeCwgcHJlZml4KSB7XG4gICAgY29uc3QgeyB2YWx1ZSB9ID0gbm9kZTtcbiAgICBpZiAoaW50SWRlbnRpZnkodmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IHN0ciA9IHZhbHVlLnRvU3RyaW5nKHJhZGl4KTtcbiAgICAgICAgcmV0dXJuIHZhbHVlIDwgMCA/ICctJyArIHByZWZpeCArIHN0ci5zdWJzdHIoMSkgOiBwcmVmaXggKyBzdHI7XG4gICAgfVxuICAgIHJldHVybiBzdHJpbmdpZnlOdW1iZXIobm9kZSk7XG59XG5jb25zdCBpbnRCaW4gPSB7XG4gICAgaWRlbnRpZnk6IGludElkZW50aWZ5LFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6aW50JyxcbiAgICBmb3JtYXQ6ICdCSU4nLFxuICAgIHRlc3Q6IC9eWy0rXT8wYlswLTFfXSskLyxcbiAgICByZXNvbHZlOiAoc3RyLCBfb25FcnJvciwgb3B0KSA9PiBpbnRSZXNvbHZlKHN0ciwgMiwgMiwgb3B0KSxcbiAgICBzdHJpbmdpZnk6IG5vZGUgPT4gaW50U3RyaW5naWZ5KG5vZGUsIDIsICcwYicpXG59O1xuY29uc3QgaW50T2N0ID0ge1xuICAgIGlkZW50aWZ5OiBpbnRJZGVudGlmeSxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmludCcsXG4gICAgZm9ybWF0OiAnT0NUJyxcbiAgICB0ZXN0OiAvXlstK10/MFswLTdfXSskLyxcbiAgICByZXNvbHZlOiAoc3RyLCBfb25FcnJvciwgb3B0KSA9PiBpbnRSZXNvbHZlKHN0ciwgMSwgOCwgb3B0KSxcbiAgICBzdHJpbmdpZnk6IG5vZGUgPT4gaW50U3RyaW5naWZ5KG5vZGUsIDgsICcwJylcbn07XG5jb25zdCBpbnQgPSB7XG4gICAgaWRlbnRpZnk6IGludElkZW50aWZ5LFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6aW50JyxcbiAgICB0ZXN0OiAvXlstK10/WzAtOV1bMC05X10qJC8sXG4gICAgcmVzb2x2ZTogKHN0ciwgX29uRXJyb3IsIG9wdCkgPT4gaW50UmVzb2x2ZShzdHIsIDAsIDEwLCBvcHQpLFxuICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5TnVtYmVyXG59O1xuY29uc3QgaW50SGV4ID0ge1xuICAgIGlkZW50aWZ5OiBpbnRJZGVudGlmeSxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmludCcsXG4gICAgZm9ybWF0OiAnSEVYJyxcbiAgICB0ZXN0OiAvXlstK10/MHhbMC05YS1mQS1GX10rJC8sXG4gICAgcmVzb2x2ZTogKHN0ciwgX29uRXJyb3IsIG9wdCkgPT4gaW50UmVzb2x2ZShzdHIsIDIsIDE2LCBvcHQpLFxuICAgIHN0cmluZ2lmeTogbm9kZSA9PiBpbnRTdHJpbmdpZnkobm9kZSwgMTYsICcweCcpXG59O1xuXG5leHBvcnQgeyBpbnQsIGludEJpbiwgaW50SGV4LCBpbnRPY3QgfTtcbiIsICJpbXBvcnQgeyBpc01hcCwgaXNQYWlyLCBpc1NjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IFBhaXIsIGNyZWF0ZVBhaXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9QYWlyLmpzJztcbmltcG9ydCB7IFlBTUxNYXAsIGZpbmRQYWlyIH0gZnJvbSAnLi4vLi4vbm9kZXMvWUFNTE1hcC5qcyc7XG5cbmNsYXNzIFlBTUxTZXQgZXh0ZW5kcyBZQU1MTWFwIHtcbiAgICBjb25zdHJ1Y3RvcihzY2hlbWEpIHtcbiAgICAgICAgc3VwZXIoc2NoZW1hKTtcbiAgICAgICAgdGhpcy50YWcgPSBZQU1MU2V0LnRhZztcbiAgICB9XG4gICAgYWRkKGtleSkge1xuICAgICAgICBsZXQgcGFpcjtcbiAgICAgICAgaWYgKGlzUGFpcihrZXkpKVxuICAgICAgICAgICAgcGFpciA9IGtleTtcbiAgICAgICAgZWxzZSBpZiAoa2V5ICYmXG4gICAgICAgICAgICB0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgJ2tleScgaW4ga2V5ICYmXG4gICAgICAgICAgICAndmFsdWUnIGluIGtleSAmJlxuICAgICAgICAgICAga2V5LnZhbHVlID09PSBudWxsKVxuICAgICAgICAgICAgcGFpciA9IG5ldyBQYWlyKGtleS5rZXksIG51bGwpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBwYWlyID0gbmV3IFBhaXIoa2V5LCBudWxsKTtcbiAgICAgICAgY29uc3QgcHJldiA9IGZpbmRQYWlyKHRoaXMuaXRlbXMsIHBhaXIua2V5KTtcbiAgICAgICAgaWYgKCFwcmV2KVxuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoKHBhaXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJZiBga2VlcFBhaXJgIGlzIGB0cnVlYCwgcmV0dXJucyB0aGUgUGFpciBtYXRjaGluZyBga2V5YC5cbiAgICAgKiBPdGhlcndpc2UsIHJldHVybnMgdGhlIHZhbHVlIG9mIHRoYXQgUGFpcidzIGtleS5cbiAgICAgKi9cbiAgICBnZXQoa2V5LCBrZWVwUGFpcikge1xuICAgICAgICBjb25zdCBwYWlyID0gZmluZFBhaXIodGhpcy5pdGVtcywga2V5KTtcbiAgICAgICAgcmV0dXJuICFrZWVwUGFpciAmJiBpc1BhaXIocGFpcilcbiAgICAgICAgICAgID8gaXNTY2FsYXIocGFpci5rZXkpXG4gICAgICAgICAgICAgICAgPyBwYWlyLmtleS52YWx1ZVxuICAgICAgICAgICAgICAgIDogcGFpci5rZXlcbiAgICAgICAgICAgIDogcGFpcjtcbiAgICB9XG4gICAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Jvb2xlYW4nKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBib29sZWFuIHZhbHVlIGZvciBzZXQoa2V5LCB2YWx1ZSkgaW4gYSBZQU1MIHNldCwgbm90ICR7dHlwZW9mIHZhbHVlfWApO1xuICAgICAgICBjb25zdCBwcmV2ID0gZmluZFBhaXIodGhpcy5pdGVtcywga2V5KTtcbiAgICAgICAgaWYgKHByZXYgJiYgIXZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zLnNwbGljZSh0aGlzLml0ZW1zLmluZGV4T2YocHJldiksIDEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCFwcmV2ICYmIHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2gobmV3IFBhaXIoa2V5KSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdG9KU09OKF8sIGN0eCkge1xuICAgICAgICByZXR1cm4gc3VwZXIudG9KU09OKF8sIGN0eCwgU2V0KTtcbiAgICB9XG4gICAgdG9TdHJpbmcoY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgICAgIGlmICghY3R4KVxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgICAgICBpZiAodGhpcy5oYXNBbGxOdWxsVmFsdWVzKHRydWUpKVxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnRvU3RyaW5nKE9iamVjdC5hc3NpZ24oe30sIGN0eCwgeyBhbGxOdWxsVmFsdWVzOiB0cnVlIH0pLCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXQgaXRlbXMgbXVzdCBhbGwgaGF2ZSBudWxsIHZhbHVlcycpO1xuICAgIH1cbiAgICBzdGF0aWMgZnJvbShzY2hlbWEsIGl0ZXJhYmxlLCBjdHgpIHtcbiAgICAgICAgY29uc3QgeyByZXBsYWNlciB9ID0gY3R4O1xuICAgICAgICBjb25zdCBzZXQgPSBuZXcgdGhpcyhzY2hlbWEpO1xuICAgICAgICBpZiAoaXRlcmFibGUgJiYgU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyYWJsZSkpXG4gICAgICAgICAgICBmb3IgKGxldCB2YWx1ZSBvZiBpdGVyYWJsZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZXIgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcmVwbGFjZXIuY2FsbChpdGVyYWJsZSwgdmFsdWUsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICBzZXQuaXRlbXMucHVzaChjcmVhdGVQYWlyKHZhbHVlLCBudWxsLCBjdHgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNldDtcbiAgICB9XG59XG5ZQU1MU2V0LnRhZyA9ICd0YWc6eWFtbC5vcmcsMjAwMjpzZXQnO1xuY29uc3Qgc2V0ID0ge1xuICAgIGNvbGxlY3Rpb246ICdtYXAnLFxuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB2YWx1ZSBpbnN0YW5jZW9mIFNldCxcbiAgICBub2RlQ2xhc3M6IFlBTUxTZXQsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6c2V0JyxcbiAgICBjcmVhdGVOb2RlOiAoc2NoZW1hLCBpdGVyYWJsZSwgY3R4KSA9PiBZQU1MU2V0LmZyb20oc2NoZW1hLCBpdGVyYWJsZSwgY3R4KSxcbiAgICByZXNvbHZlKG1hcCwgb25FcnJvcikge1xuICAgICAgICBpZiAoaXNNYXAobWFwKSkge1xuICAgICAgICAgICAgaWYgKG1hcC5oYXNBbGxOdWxsVmFsdWVzKHRydWUpKVxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyBZQU1MU2V0KCksIG1hcCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgb25FcnJvcignU2V0IGl0ZW1zIG11c3QgYWxsIGhhdmUgbnVsbCB2YWx1ZXMnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBvbkVycm9yKCdFeHBlY3RlZCBhIG1hcHBpbmcgZm9yIHRoaXMgdGFnJyk7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgWUFNTFNldCwgc2V0IH07XG4iLCAiaW1wb3J0IHsgc3RyaW5naWZ5TnVtYmVyIH0gZnJvbSAnLi4vLi4vc3RyaW5naWZ5L3N0cmluZ2lmeU51bWJlci5qcyc7XG5cbi8qKiBJbnRlcm5hbCB0eXBlcyBoYW5kbGUgYmlnaW50IGFzIG51bWJlciwgYmVjYXVzZSBUUyBjYW4ndCBmaWd1cmUgaXQgb3V0LiAqL1xuZnVuY3Rpb24gcGFyc2VTZXhhZ2VzaW1hbChzdHIsIGFzQmlnSW50KSB7XG4gICAgY29uc3Qgc2lnbiA9IHN0clswXTtcbiAgICBjb25zdCBwYXJ0cyA9IHNpZ24gPT09ICctJyB8fCBzaWduID09PSAnKycgPyBzdHIuc3Vic3RyaW5nKDEpIDogc3RyO1xuICAgIGNvbnN0IG51bSA9IChuKSA9PiBhc0JpZ0ludCA/IEJpZ0ludChuKSA6IE51bWJlcihuKTtcbiAgICBjb25zdCByZXMgPSBwYXJ0c1xuICAgICAgICAucmVwbGFjZSgvXy9nLCAnJylcbiAgICAgICAgLnNwbGl0KCc6JylcbiAgICAgICAgLnJlZHVjZSgocmVzLCBwKSA9PiByZXMgKiBudW0oNjApICsgbnVtKHApLCBudW0oMCkpO1xuICAgIHJldHVybiAoc2lnbiA9PT0gJy0nID8gbnVtKC0xKSAqIHJlcyA6IHJlcyk7XG59XG4vKipcbiAqIGhoaGg6bW06c3Muc3NzXG4gKlxuICogSW50ZXJuYWwgdHlwZXMgaGFuZGxlIGJpZ2ludCBhcyBudW1iZXIsIGJlY2F1c2UgVFMgY2FuJ3QgZmlndXJlIGl0IG91dC5cbiAqL1xuZnVuY3Rpb24gc3RyaW5naWZ5U2V4YWdlc2ltYWwobm9kZSkge1xuICAgIGxldCB7IHZhbHVlIH0gPSBub2RlO1xuICAgIGxldCBudW0gPSAobikgPT4gbjtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnYmlnaW50JylcbiAgICAgICAgbnVtID0gbiA9PiBCaWdJbnQobik7XG4gICAgZWxzZSBpZiAoaXNOYU4odmFsdWUpIHx8ICFpc0Zpbml0ZSh2YWx1ZSkpXG4gICAgICAgIHJldHVybiBzdHJpbmdpZnlOdW1iZXIobm9kZSk7XG4gICAgbGV0IHNpZ24gPSAnJztcbiAgICBpZiAodmFsdWUgPCAwKSB7XG4gICAgICAgIHNpZ24gPSAnLSc7XG4gICAgICAgIHZhbHVlICo9IG51bSgtMSk7XG4gICAgfVxuICAgIGNvbnN0IF82MCA9IG51bSg2MCk7XG4gICAgY29uc3QgcGFydHMgPSBbdmFsdWUgJSBfNjBdOyAvLyBzZWNvbmRzLCBpbmNsdWRpbmcgbXNcbiAgICBpZiAodmFsdWUgPCA2MCkge1xuICAgICAgICBwYXJ0cy51bnNoaWZ0KDApOyAvLyBhdCBsZWFzdCBvbmUgOiBpcyByZXF1aXJlZFxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSAodmFsdWUgLSBwYXJ0c1swXSkgLyBfNjA7XG4gICAgICAgIHBhcnRzLnVuc2hpZnQodmFsdWUgJSBfNjApOyAvLyBtaW51dGVzXG4gICAgICAgIGlmICh2YWx1ZSA+PSA2MCkge1xuICAgICAgICAgICAgdmFsdWUgPSAodmFsdWUgLSBwYXJ0c1swXSkgLyBfNjA7XG4gICAgICAgICAgICBwYXJ0cy51bnNoaWZ0KHZhbHVlKTsgLy8gaG91cnNcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKHNpZ24gK1xuICAgICAgICBwYXJ0c1xuICAgICAgICAgICAgLm1hcChuID0+IFN0cmluZyhuKS5wYWRTdGFydCgyLCAnMCcpKVxuICAgICAgICAgICAgLmpvaW4oJzonKVxuICAgICAgICAgICAgLnJlcGxhY2UoLzAwMDAwMFxcZCokLywgJycpIC8vICUgNjAgbWF5IGludHJvZHVjZSBlcnJvclxuICAgICk7XG59XG5jb25zdCBpbnRUaW1lID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdiaWdpbnQnIHx8IE51bWJlci5pc0ludGVnZXIodmFsdWUpLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6aW50JyxcbiAgICBmb3JtYXQ6ICdUSU1FJyxcbiAgICB0ZXN0OiAvXlstK10/WzAtOV1bMC05X10qKD86OlswLTVdP1swLTldKSskLyxcbiAgICByZXNvbHZlOiAoc3RyLCBfb25FcnJvciwgeyBpbnRBc0JpZ0ludCB9KSA9PiBwYXJzZVNleGFnZXNpbWFsKHN0ciwgaW50QXNCaWdJbnQpLFxuICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5U2V4YWdlc2ltYWxcbn07XG5jb25zdCBmbG9hdFRpbWUgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCcsXG4gICAgZm9ybWF0OiAnVElNRScsXG4gICAgdGVzdDogL15bLStdP1swLTldWzAtOV9dKig/OjpbMC01XT9bMC05XSkrXFwuWzAtOV9dKiQvLFxuICAgIHJlc29sdmU6IHN0ciA9PiBwYXJzZVNleGFnZXNpbWFsKHN0ciwgZmFsc2UpLFxuICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5U2V4YWdlc2ltYWxcbn07XG5jb25zdCB0aW1lc3RhbXAgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHZhbHVlIGluc3RhbmNlb2YgRGF0ZSxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOnRpbWVzdGFtcCcsXG4gICAgLy8gSWYgdGhlIHRpbWUgem9uZSBpcyBvbWl0dGVkLCB0aGUgdGltZXN0YW1wIGlzIGFzc3VtZWQgdG8gYmUgc3BlY2lmaWVkIGluIFVUQy4gVGhlIHRpbWUgcGFydFxuICAgIC8vIG1heSBiZSBvbWl0dGVkIGFsdG9nZXRoZXIsIHJlc3VsdGluZyBpbiBhIGRhdGUgZm9ybWF0LiBJbiBzdWNoIGEgY2FzZSwgdGhlIHRpbWUgcGFydCBpc1xuICAgIC8vIGFzc3VtZWQgdG8gYmUgMDA6MDA6MDBaIChzdGFydCBvZiBkYXksIFVUQykuXG4gICAgdGVzdDogUmVnRXhwKCdeKFswLTldezR9KS0oWzAtOV17MSwyfSktKFswLTldezEsMn0pJyArIC8vIFlZWVktTW0tRGRcbiAgICAgICAgJyg/OicgKyAvLyB0aW1lIGlzIG9wdGlvbmFsXG4gICAgICAgICcoPzp0fFR8WyBcXFxcdF0rKScgKyAvLyB0IHwgVCB8IHdoaXRlc3BhY2VcbiAgICAgICAgJyhbMC05XXsxLDJ9KTooWzAtOV17MSwyfSk6KFswLTldezEsMn0oXFxcXC5bMC05XSspPyknICsgLy8gSGg6TW06U3MoLnNzKT9cbiAgICAgICAgJyg/OlsgXFxcXHRdKihafFstK11bMDEyXT9bMC05XSg/OjpbMC05XXsyfSk/KSk/JyArIC8vIFogfCArNSB8IC0wMzozMFxuICAgICAgICAnKT8kJyksXG4gICAgcmVzb2x2ZShzdHIpIHtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSBzdHIubWF0Y2godGltZXN0YW1wLnRlc3QpO1xuICAgICAgICBpZiAoIW1hdGNoKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCchIXRpbWVzdGFtcCBleHBlY3RzIGEgZGF0ZSwgc3RhcnRpbmcgd2l0aCB5eXl5LW1tLWRkJyk7XG4gICAgICAgIGNvbnN0IFssIHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kXSA9IG1hdGNoLm1hcChOdW1iZXIpO1xuICAgICAgICBjb25zdCBtaWxsaXNlYyA9IG1hdGNoWzddID8gTnVtYmVyKChtYXRjaFs3XSArICcwMCcpLnN1YnN0cigxLCAzKSkgOiAwO1xuICAgICAgICBsZXQgZGF0ZSA9IERhdGUuVVRDKHllYXIsIG1vbnRoIC0gMSwgZGF5LCBob3VyIHx8IDAsIG1pbnV0ZSB8fCAwLCBzZWNvbmQgfHwgMCwgbWlsbGlzZWMpO1xuICAgICAgICBjb25zdCB0eiA9IG1hdGNoWzhdO1xuICAgICAgICBpZiAodHogJiYgdHogIT09ICdaJykge1xuICAgICAgICAgICAgbGV0IGQgPSBwYXJzZVNleGFnZXNpbWFsKHR6LCBmYWxzZSk7XG4gICAgICAgICAgICBpZiAoTWF0aC5hYnMoZCkgPCAzMClcbiAgICAgICAgICAgICAgICBkICo9IDYwO1xuICAgICAgICAgICAgZGF0ZSAtPSA2MDAwMCAqIGQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGUpO1xuICAgIH0sXG4gICAgc3RyaW5naWZ5OiAoeyB2YWx1ZSB9KSA9PiB2YWx1ZT8udG9JU09TdHJpbmcoKS5yZXBsYWNlKC8oVDAwOjAwOjAwKT9cXC4wMDBaJC8sICcnKSA/PyAnJ1xufTtcblxuZXhwb3J0IHsgZmxvYXRUaW1lLCBpbnRUaW1lLCB0aW1lc3RhbXAgfTtcbiIsICJpbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9jb21tb24vbWFwLmpzJztcbmltcG9ydCB7IG51bGxUYWcgfSBmcm9tICcuLi9jb21tb24vbnVsbC5qcyc7XG5pbXBvcnQgeyBzZXEgfSBmcm9tICcuLi9jb21tb24vc2VxLmpzJztcbmltcG9ydCB7IHN0cmluZyB9IGZyb20gJy4uL2NvbW1vbi9zdHJpbmcuanMnO1xuaW1wb3J0IHsgYmluYXJ5IH0gZnJvbSAnLi9iaW5hcnkuanMnO1xuaW1wb3J0IHsgdHJ1ZVRhZywgZmFsc2VUYWcgfSBmcm9tICcuL2Jvb2wuanMnO1xuaW1wb3J0IHsgZmxvYXROYU4sIGZsb2F0RXhwLCBmbG9hdCB9IGZyb20gJy4vZmxvYXQuanMnO1xuaW1wb3J0IHsgaW50QmluLCBpbnRPY3QsIGludCwgaW50SGV4IH0gZnJvbSAnLi9pbnQuanMnO1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICcuL21lcmdlLmpzJztcbmltcG9ydCB7IG9tYXAgfSBmcm9tICcuL29tYXAuanMnO1xuaW1wb3J0IHsgcGFpcnMgfSBmcm9tICcuL3BhaXJzLmpzJztcbmltcG9ydCB7IHNldCB9IGZyb20gJy4vc2V0LmpzJztcbmltcG9ydCB7IGludFRpbWUsIGZsb2F0VGltZSwgdGltZXN0YW1wIH0gZnJvbSAnLi90aW1lc3RhbXAuanMnO1xuXG5jb25zdCBzY2hlbWEgPSBbXG4gICAgbWFwLFxuICAgIHNlcSxcbiAgICBzdHJpbmcsXG4gICAgbnVsbFRhZyxcbiAgICB0cnVlVGFnLFxuICAgIGZhbHNlVGFnLFxuICAgIGludEJpbixcbiAgICBpbnRPY3QsXG4gICAgaW50LFxuICAgIGludEhleCxcbiAgICBmbG9hdE5hTixcbiAgICBmbG9hdEV4cCxcbiAgICBmbG9hdCxcbiAgICBiaW5hcnksXG4gICAgbWVyZ2UsXG4gICAgb21hcCxcbiAgICBwYWlycyxcbiAgICBzZXQsXG4gICAgaW50VGltZSxcbiAgICBmbG9hdFRpbWUsXG4gICAgdGltZXN0YW1wXG5dO1xuXG5leHBvcnQgeyBzY2hlbWEgfTtcbiIsICJpbXBvcnQgeyBtYXAgfSBmcm9tICcuL2NvbW1vbi9tYXAuanMnO1xuaW1wb3J0IHsgbnVsbFRhZyB9IGZyb20gJy4vY29tbW9uL251bGwuanMnO1xuaW1wb3J0IHsgc2VxIH0gZnJvbSAnLi9jb21tb24vc2VxLmpzJztcbmltcG9ydCB7IHN0cmluZyB9IGZyb20gJy4vY29tbW9uL3N0cmluZy5qcyc7XG5pbXBvcnQgeyBib29sVGFnIH0gZnJvbSAnLi9jb3JlL2Jvb2wuanMnO1xuaW1wb3J0IHsgZmxvYXROYU4sIGZsb2F0RXhwLCBmbG9hdCB9IGZyb20gJy4vY29yZS9mbG9hdC5qcyc7XG5pbXBvcnQgeyBpbnRPY3QsIGludEhleCwgaW50IH0gZnJvbSAnLi9jb3JlL2ludC5qcyc7XG5pbXBvcnQgeyBzY2hlbWEgfSBmcm9tICcuL2NvcmUvc2NoZW1hLmpzJztcbmltcG9ydCB7IHNjaGVtYSBhcyBzY2hlbWEkMSB9IGZyb20gJy4vanNvbi9zY2hlbWEuanMnO1xuaW1wb3J0IHsgYmluYXJ5IH0gZnJvbSAnLi95YW1sLTEuMS9iaW5hcnkuanMnO1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICcuL3lhbWwtMS4xL21lcmdlLmpzJztcbmltcG9ydCB7IG9tYXAgfSBmcm9tICcuL3lhbWwtMS4xL29tYXAuanMnO1xuaW1wb3J0IHsgcGFpcnMgfSBmcm9tICcuL3lhbWwtMS4xL3BhaXJzLmpzJztcbmltcG9ydCB7IHNjaGVtYSBhcyBzY2hlbWEkMiB9IGZyb20gJy4veWFtbC0xLjEvc2NoZW1hLmpzJztcbmltcG9ydCB7IHNldCB9IGZyb20gJy4veWFtbC0xLjEvc2V0LmpzJztcbmltcG9ydCB7IHRpbWVzdGFtcCwgaW50VGltZSwgZmxvYXRUaW1lIH0gZnJvbSAnLi95YW1sLTEuMS90aW1lc3RhbXAuanMnO1xuXG5jb25zdCBzY2hlbWFzID0gbmV3IE1hcChbXG4gICAgWydjb3JlJywgc2NoZW1hXSxcbiAgICBbJ2ZhaWxzYWZlJywgW21hcCwgc2VxLCBzdHJpbmddXSxcbiAgICBbJ2pzb24nLCBzY2hlbWEkMV0sXG4gICAgWyd5YW1sMTEnLCBzY2hlbWEkMl0sXG4gICAgWyd5YW1sLTEuMScsIHNjaGVtYSQyXVxuXSk7XG5jb25zdCB0YWdzQnlOYW1lID0ge1xuICAgIGJpbmFyeSxcbiAgICBib29sOiBib29sVGFnLFxuICAgIGZsb2F0LFxuICAgIGZsb2F0RXhwLFxuICAgIGZsb2F0TmFOLFxuICAgIGZsb2F0VGltZSxcbiAgICBpbnQsXG4gICAgaW50SGV4LFxuICAgIGludE9jdCxcbiAgICBpbnRUaW1lLFxuICAgIG1hcCxcbiAgICBtZXJnZSxcbiAgICBudWxsOiBudWxsVGFnLFxuICAgIG9tYXAsXG4gICAgcGFpcnMsXG4gICAgc2VxLFxuICAgIHNldCxcbiAgICB0aW1lc3RhbXBcbn07XG5jb25zdCBjb3JlS25vd25UYWdzID0ge1xuICAgICd0YWc6eWFtbC5vcmcsMjAwMjpiaW5hcnknOiBiaW5hcnksXG4gICAgJ3RhZzp5YW1sLm9yZywyMDAyOm1lcmdlJzogbWVyZ2UsXG4gICAgJ3RhZzp5YW1sLm9yZywyMDAyOm9tYXAnOiBvbWFwLFxuICAgICd0YWc6eWFtbC5vcmcsMjAwMjpwYWlycyc6IHBhaXJzLFxuICAgICd0YWc6eWFtbC5vcmcsMjAwMjpzZXQnOiBzZXQsXG4gICAgJ3RhZzp5YW1sLm9yZywyMDAyOnRpbWVzdGFtcCc6IHRpbWVzdGFtcFxufTtcbmZ1bmN0aW9uIGdldFRhZ3MoY3VzdG9tVGFncywgc2NoZW1hTmFtZSwgYWRkTWVyZ2VUYWcpIHtcbiAgICBjb25zdCBzY2hlbWFUYWdzID0gc2NoZW1hcy5nZXQoc2NoZW1hTmFtZSk7XG4gICAgaWYgKHNjaGVtYVRhZ3MgJiYgIWN1c3RvbVRhZ3MpIHtcbiAgICAgICAgcmV0dXJuIGFkZE1lcmdlVGFnICYmICFzY2hlbWFUYWdzLmluY2x1ZGVzKG1lcmdlKVxuICAgICAgICAgICAgPyBzY2hlbWFUYWdzLmNvbmNhdChtZXJnZSlcbiAgICAgICAgICAgIDogc2NoZW1hVGFncy5zbGljZSgpO1xuICAgIH1cbiAgICBsZXQgdGFncyA9IHNjaGVtYVRhZ3M7XG4gICAgaWYgKCF0YWdzKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGN1c3RvbVRhZ3MpKVxuICAgICAgICAgICAgdGFncyA9IFtdO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGtleXMgPSBBcnJheS5mcm9tKHNjaGVtYXMua2V5cygpKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoa2V5ID0+IGtleSAhPT0gJ3lhbWwxMScpXG4gICAgICAgICAgICAgICAgLm1hcChrZXkgPT4gSlNPTi5zdHJpbmdpZnkoa2V5KSlcbiAgICAgICAgICAgICAgICAuam9pbignLCAnKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBzY2hlbWEgXCIke3NjaGVtYU5hbWV9XCI7IHVzZSBvbmUgb2YgJHtrZXlzfSBvciBkZWZpbmUgY3VzdG9tVGFncyBhcnJheWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KGN1c3RvbVRhZ3MpKSB7XG4gICAgICAgIGZvciAoY29uc3QgdGFnIG9mIGN1c3RvbVRhZ3MpXG4gICAgICAgICAgICB0YWdzID0gdGFncy5jb25jYXQodGFnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGN1c3RvbVRhZ3MgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGFncyA9IGN1c3RvbVRhZ3ModGFncy5zbGljZSgpKTtcbiAgICB9XG4gICAgaWYgKGFkZE1lcmdlVGFnKVxuICAgICAgICB0YWdzID0gdGFncy5jb25jYXQobWVyZ2UpO1xuICAgIHJldHVybiB0YWdzLnJlZHVjZSgodGFncywgdGFnKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhZ09iaiA9IHR5cGVvZiB0YWcgPT09ICdzdHJpbmcnID8gdGFnc0J5TmFtZVt0YWddIDogdGFnO1xuICAgICAgICBpZiAoIXRhZ09iaikge1xuICAgICAgICAgICAgY29uc3QgdGFnTmFtZSA9IEpTT04uc3RyaW5naWZ5KHRhZyk7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGFnc0J5TmFtZSlcbiAgICAgICAgICAgICAgICAubWFwKGtleSA9PiBKU09OLnN0cmluZ2lmeShrZXkpKVxuICAgICAgICAgICAgICAgIC5qb2luKCcsICcpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGN1c3RvbSB0YWcgJHt0YWdOYW1lfTsgdXNlIG9uZSBvZiAke2tleXN9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0YWdzLmluY2x1ZGVzKHRhZ09iaikpXG4gICAgICAgICAgICB0YWdzLnB1c2godGFnT2JqKTtcbiAgICAgICAgcmV0dXJuIHRhZ3M7XG4gICAgfSwgW10pO1xufVxuXG5leHBvcnQgeyBjb3JlS25vd25UYWdzLCBnZXRUYWdzIH07XG4iLCAiaW1wb3J0IHsgTUFQLCBTQ0FMQVIsIFNFUSB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4vY29tbW9uL21hcC5qcyc7XG5pbXBvcnQgeyBzZXEgfSBmcm9tICcuL2NvbW1vbi9zZXEuanMnO1xuaW1wb3J0IHsgc3RyaW5nIH0gZnJvbSAnLi9jb21tb24vc3RyaW5nLmpzJztcbmltcG9ydCB7IGdldFRhZ3MsIGNvcmVLbm93blRhZ3MgfSBmcm9tICcuL3RhZ3MuanMnO1xuXG5jb25zdCBzb3J0TWFwRW50cmllc0J5S2V5ID0gKGEsIGIpID0+IGEua2V5IDwgYi5rZXkgPyAtMSA6IGEua2V5ID4gYi5rZXkgPyAxIDogMDtcbmNsYXNzIFNjaGVtYSB7XG4gICAgY29uc3RydWN0b3IoeyBjb21wYXQsIGN1c3RvbVRhZ3MsIG1lcmdlLCByZXNvbHZlS25vd25UYWdzLCBzY2hlbWEsIHNvcnRNYXBFbnRyaWVzLCB0b1N0cmluZ0RlZmF1bHRzIH0pIHtcbiAgICAgICAgdGhpcy5jb21wYXQgPSBBcnJheS5pc0FycmF5KGNvbXBhdClcbiAgICAgICAgICAgID8gZ2V0VGFncyhjb21wYXQsICdjb21wYXQnKVxuICAgICAgICAgICAgOiBjb21wYXRcbiAgICAgICAgICAgICAgICA/IGdldFRhZ3MobnVsbCwgY29tcGF0KVxuICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgdGhpcy5uYW1lID0gKHR5cGVvZiBzY2hlbWEgPT09ICdzdHJpbmcnICYmIHNjaGVtYSkgfHwgJ2NvcmUnO1xuICAgICAgICB0aGlzLmtub3duVGFncyA9IHJlc29sdmVLbm93blRhZ3MgPyBjb3JlS25vd25UYWdzIDoge307XG4gICAgICAgIHRoaXMudGFncyA9IGdldFRhZ3MoY3VzdG9tVGFncywgdGhpcy5uYW1lLCBtZXJnZSk7XG4gICAgICAgIHRoaXMudG9TdHJpbmdPcHRpb25zID0gdG9TdHJpbmdEZWZhdWx0cyA/PyBudWxsO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgTUFQLCB7IHZhbHVlOiBtYXAgfSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBTQ0FMQVIsIHsgdmFsdWU6IHN0cmluZyB9KTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFNFUSwgeyB2YWx1ZTogc2VxIH0pO1xuICAgICAgICAvLyBVc2VkIGJ5IGNyZWF0ZU1hcCgpXG4gICAgICAgIHRoaXMuc29ydE1hcEVudHJpZXMgPVxuICAgICAgICAgICAgdHlwZW9mIHNvcnRNYXBFbnRyaWVzID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICAgICAgPyBzb3J0TWFwRW50cmllc1xuICAgICAgICAgICAgICAgIDogc29ydE1hcEVudHJpZXMgPT09IHRydWVcbiAgICAgICAgICAgICAgICAgICAgPyBzb3J0TWFwRW50cmllc0J5S2V5XG4gICAgICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICB9XG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBPYmplY3QuY3JlYXRlKFNjaGVtYS5wcm90b3R5cGUsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHRoaXMpKTtcbiAgICAgICAgY29weS50YWdzID0gdGhpcy50YWdzLnNsaWNlKCk7XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbn1cblxuZXhwb3J0IHsgU2NoZW1hIH07XG4iLCAiaW1wb3J0IHsgaXNOb2RlIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgY3JlYXRlU3RyaW5naWZ5Q29udGV4dCwgc3RyaW5naWZ5IH0gZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuaW1wb3J0IHsgaW5kZW50Q29tbWVudCwgbGluZUNvbW1lbnQgfSBmcm9tICcuL3N0cmluZ2lmeUNvbW1lbnQuanMnO1xuXG5mdW5jdGlvbiBzdHJpbmdpZnlEb2N1bWVudChkb2MsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBsaW5lcyA9IFtdO1xuICAgIGxldCBoYXNEaXJlY3RpdmVzID0gb3B0aW9ucy5kaXJlY3RpdmVzID09PSB0cnVlO1xuICAgIGlmIChvcHRpb25zLmRpcmVjdGl2ZXMgIT09IGZhbHNlICYmIGRvYy5kaXJlY3RpdmVzKSB7XG4gICAgICAgIGNvbnN0IGRpciA9IGRvYy5kaXJlY3RpdmVzLnRvU3RyaW5nKGRvYyk7XG4gICAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goZGlyKTtcbiAgICAgICAgICAgIGhhc0RpcmVjdGl2ZXMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGRvYy5kaXJlY3RpdmVzLmRvY1N0YXJ0KVxuICAgICAgICAgICAgaGFzRGlyZWN0aXZlcyA9IHRydWU7XG4gICAgfVxuICAgIGlmIChoYXNEaXJlY3RpdmVzKVxuICAgICAgICBsaW5lcy5wdXNoKCctLS0nKTtcbiAgICBjb25zdCBjdHggPSBjcmVhdGVTdHJpbmdpZnlDb250ZXh0KGRvYywgb3B0aW9ucyk7XG4gICAgY29uc3QgeyBjb21tZW50U3RyaW5nIH0gPSBjdHgub3B0aW9ucztcbiAgICBpZiAoZG9jLmNvbW1lbnRCZWZvcmUpIHtcbiAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCAhPT0gMSlcbiAgICAgICAgICAgIGxpbmVzLnVuc2hpZnQoJycpO1xuICAgICAgICBjb25zdCBjcyA9IGNvbW1lbnRTdHJpbmcoZG9jLmNvbW1lbnRCZWZvcmUpO1xuICAgICAgICBsaW5lcy51bnNoaWZ0KGluZGVudENvbW1lbnQoY3MsICcnKSk7XG4gICAgfVxuICAgIGxldCBjaG9tcEtlZXAgPSBmYWxzZTtcbiAgICBsZXQgY29udGVudENvbW1lbnQgPSBudWxsO1xuICAgIGlmIChkb2MuY29udGVudHMpIHtcbiAgICAgICAgaWYgKGlzTm9kZShkb2MuY29udGVudHMpKSB7XG4gICAgICAgICAgICBpZiAoZG9jLmNvbnRlbnRzLnNwYWNlQmVmb3JlICYmIGhhc0RpcmVjdGl2ZXMpXG4gICAgICAgICAgICAgICAgbGluZXMucHVzaCgnJyk7XG4gICAgICAgICAgICBpZiAoZG9jLmNvbnRlbnRzLmNvbW1lbnRCZWZvcmUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjcyA9IGNvbW1lbnRTdHJpbmcoZG9jLmNvbnRlbnRzLmNvbW1lbnRCZWZvcmUpO1xuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goaW5kZW50Q29tbWVudChjcywgJycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRvcC1sZXZlbCBibG9jayBzY2FsYXJzIG5lZWQgdG8gYmUgaW5kZW50ZWQgaWYgZm9sbG93ZWQgYnkgYSBjb21tZW50XG4gICAgICAgICAgICBjdHguZm9yY2VCbG9ja0luZGVudCA9ICEhZG9jLmNvbW1lbnQ7XG4gICAgICAgICAgICBjb250ZW50Q29tbWVudCA9IGRvYy5jb250ZW50cy5jb21tZW50O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9uQ2hvbXBLZWVwID0gY29udGVudENvbW1lbnQgPyB1bmRlZmluZWQgOiAoKSA9PiAoY2hvbXBLZWVwID0gdHJ1ZSk7XG4gICAgICAgIGxldCBib2R5ID0gc3RyaW5naWZ5KGRvYy5jb250ZW50cywgY3R4LCAoKSA9PiAoY29udGVudENvbW1lbnQgPSBudWxsKSwgb25DaG9tcEtlZXApO1xuICAgICAgICBpZiAoY29udGVudENvbW1lbnQpXG4gICAgICAgICAgICBib2R5ICs9IGxpbmVDb21tZW50KGJvZHksICcnLCBjb21tZW50U3RyaW5nKGNvbnRlbnRDb21tZW50KSk7XG4gICAgICAgIGlmICgoYm9keVswXSA9PT0gJ3wnIHx8IGJvZHlbMF0gPT09ICc+JykgJiZcbiAgICAgICAgICAgIGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdID09PSAnLS0tJykge1xuICAgICAgICAgICAgLy8gVG9wLWxldmVsIGJsb2NrIHNjYWxhcnMgd2l0aCBhIHByZWNlZGluZyBkb2MgbWFya2VyIG91Z2h0IHRvIHVzZSB0aGVcbiAgICAgICAgICAgIC8vIHNhbWUgbGluZSBmb3IgdGhlaXIgaGVhZGVyLlxuICAgICAgICAgICAgbGluZXNbbGluZXMubGVuZ3RoIC0gMV0gPSBgLS0tICR7Ym9keX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGxpbmVzLnB1c2goYm9keSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsaW5lcy5wdXNoKHN0cmluZ2lmeShkb2MuY29udGVudHMsIGN0eCkpO1xuICAgIH1cbiAgICBpZiAoZG9jLmRpcmVjdGl2ZXM/LmRvY0VuZCkge1xuICAgICAgICBpZiAoZG9jLmNvbW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNzID0gY29tbWVudFN0cmluZyhkb2MuY29tbWVudCk7XG4gICAgICAgICAgICBpZiAoY3MuaW5jbHVkZXMoJ1xcbicpKSB7XG4gICAgICAgICAgICAgICAgbGluZXMucHVzaCgnLi4uJyk7XG4gICAgICAgICAgICAgICAgbGluZXMucHVzaChpbmRlbnRDb21tZW50KGNzLCAnJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGluZXMucHVzaChgLi4uICR7Y3N9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKCcuLi4nKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbGV0IGRjID0gZG9jLmNvbW1lbnQ7XG4gICAgICAgIGlmIChkYyAmJiBjaG9tcEtlZXApXG4gICAgICAgICAgICBkYyA9IGRjLnJlcGxhY2UoL15cXG4rLywgJycpO1xuICAgICAgICBpZiAoZGMpIHtcbiAgICAgICAgICAgIGlmICgoIWNob21wS2VlcCB8fCBjb250ZW50Q29tbWVudCkgJiYgbGluZXNbbGluZXMubGVuZ3RoIC0gMV0gIT09ICcnKVxuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goJycpO1xuICAgICAgICAgICAgbGluZXMucHVzaChpbmRlbnRDb21tZW50KGNvbW1lbnRTdHJpbmcoZGMpLCAnJykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKSArICdcXG4nO1xufVxuXG5leHBvcnQgeyBzdHJpbmdpZnlEb2N1bWVudCB9O1xuIiwgImltcG9ydCB7IEFsaWFzIH0gZnJvbSAnLi4vbm9kZXMvQWxpYXMuanMnO1xuaW1wb3J0IHsgaXNFbXB0eVBhdGgsIGNvbGxlY3Rpb25Gcm9tUGF0aCB9IGZyb20gJy4uL25vZGVzL0NvbGxlY3Rpb24uanMnO1xuaW1wb3J0IHsgTk9ERV9UWVBFLCBET0MsIGlzTm9kZSwgaXNDb2xsZWN0aW9uLCBpc1NjYWxhciB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IFBhaXIgfSBmcm9tICcuLi9ub2Rlcy9QYWlyLmpzJztcbmltcG9ydCB7IHRvSlMgfSBmcm9tICcuLi9ub2Rlcy90b0pTLmpzJztcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gJy4uL3NjaGVtYS9TY2hlbWEuanMnO1xuaW1wb3J0IHsgc3RyaW5naWZ5RG9jdW1lbnQgfSBmcm9tICcuLi9zdHJpbmdpZnkvc3RyaW5naWZ5RG9jdW1lbnQuanMnO1xuaW1wb3J0IHsgYW5jaG9yTmFtZXMsIGZpbmROZXdBbmNob3IsIGNyZWF0ZU5vZGVBbmNob3JzIH0gZnJvbSAnLi9hbmNob3JzLmpzJztcbmltcG9ydCB7IGFwcGx5UmV2aXZlciB9IGZyb20gJy4vYXBwbHlSZXZpdmVyLmpzJztcbmltcG9ydCB7IGNyZWF0ZU5vZGUgfSBmcm9tICcuL2NyZWF0ZU5vZGUuanMnO1xuaW1wb3J0IHsgRGlyZWN0aXZlcyB9IGZyb20gJy4vZGlyZWN0aXZlcy5qcyc7XG5cbmNsYXNzIERvY3VtZW50IHtcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSwgcmVwbGFjZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgLyoqIEEgY29tbWVudCBiZWZvcmUgdGhpcyBEb2N1bWVudCAqL1xuICAgICAgICB0aGlzLmNvbW1lbnRCZWZvcmUgPSBudWxsO1xuICAgICAgICAvKiogQSBjb21tZW50IGltbWVkaWF0ZWx5IGFmdGVyIHRoaXMgRG9jdW1lbnQgKi9cbiAgICAgICAgdGhpcy5jb21tZW50ID0gbnVsbDtcbiAgICAgICAgLyoqIEVycm9ycyBlbmNvdW50ZXJlZCBkdXJpbmcgcGFyc2luZy4gKi9cbiAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICAgICAgLyoqIFdhcm5pbmdzIGVuY291bnRlcmVkIGR1cmluZyBwYXJzaW5nLiAqL1xuICAgICAgICB0aGlzLndhcm5pbmdzID0gW107XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBOT0RFX1RZUEUsIHsgdmFsdWU6IERPQyB9KTtcbiAgICAgICAgbGV0IF9yZXBsYWNlciA9IG51bGw7XG4gICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZXIgPT09ICdmdW5jdGlvbicgfHwgQXJyYXkuaXNBcnJheShyZXBsYWNlcikpIHtcbiAgICAgICAgICAgIF9yZXBsYWNlciA9IHJlcGxhY2VyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCAmJiByZXBsYWNlcikge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHJlcGxhY2VyO1xuICAgICAgICAgICAgcmVwbGFjZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICBpbnRBc0JpZ0ludDogZmFsc2UsXG4gICAgICAgICAgICBrZWVwU291cmNlVG9rZW5zOiBmYWxzZSxcbiAgICAgICAgICAgIGxvZ0xldmVsOiAnd2FybicsXG4gICAgICAgICAgICBwcmV0dHlFcnJvcnM6IHRydWUsXG4gICAgICAgICAgICBzdHJpY3Q6IHRydWUsXG4gICAgICAgICAgICBzdHJpbmdLZXlzOiBmYWxzZSxcbiAgICAgICAgICAgIHVuaXF1ZUtleXM6IHRydWUsXG4gICAgICAgICAgICB2ZXJzaW9uOiAnMS4yJ1xuICAgICAgICB9LCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0O1xuICAgICAgICBsZXQgeyB2ZXJzaW9uIH0gPSBvcHQ7XG4gICAgICAgIGlmIChvcHRpb25zPy5fZGlyZWN0aXZlcykge1xuICAgICAgICAgICAgdGhpcy5kaXJlY3RpdmVzID0gb3B0aW9ucy5fZGlyZWN0aXZlcy5hdERvY3VtZW50KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXJlY3RpdmVzLnlhbWwuZXhwbGljaXQpXG4gICAgICAgICAgICAgICAgdmVyc2lvbiA9IHRoaXMuZGlyZWN0aXZlcy55YW1sLnZlcnNpb247XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5kaXJlY3RpdmVzID0gbmV3IERpcmVjdGl2ZXMoeyB2ZXJzaW9uIH0pO1xuICAgICAgICB0aGlzLnNldFNjaGVtYSh2ZXJzaW9uLCBvcHRpb25zKTtcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBXZSBjYW4ndCByZWFsbHkga25vdyB0aGF0IHRoaXMgbWF0Y2hlcyBDb250ZW50cy5cbiAgICAgICAgdGhpcy5jb250ZW50cyA9XG4gICAgICAgICAgICB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHRoaXMuY3JlYXRlTm9kZSh2YWx1ZSwgX3JlcGxhY2VyLCBvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgZGVlcCBjb3B5IG9mIHRoaXMgRG9jdW1lbnQgYW5kIGl0cyBjb250ZW50cy5cbiAgICAgKlxuICAgICAqIEN1c3RvbSBOb2RlIHZhbHVlcyB0aGF0IGluaGVyaXQgZnJvbSBgT2JqZWN0YCBzdGlsbCByZWZlciB0byB0aGVpciBvcmlnaW5hbCBpbnN0YW5jZXMuXG4gICAgICovXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBPYmplY3QuY3JlYXRlKERvY3VtZW50LnByb3RvdHlwZSwge1xuICAgICAgICAgICAgW05PREVfVFlQRV06IHsgdmFsdWU6IERPQyB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb3B5LmNvbW1lbnRCZWZvcmUgPSB0aGlzLmNvbW1lbnRCZWZvcmU7XG4gICAgICAgIGNvcHkuY29tbWVudCA9IHRoaXMuY29tbWVudDtcbiAgICAgICAgY29weS5lcnJvcnMgPSB0aGlzLmVycm9ycy5zbGljZSgpO1xuICAgICAgICBjb3B5Lndhcm5pbmdzID0gdGhpcy53YXJuaW5ncy5zbGljZSgpO1xuICAgICAgICBjb3B5Lm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICBpZiAodGhpcy5kaXJlY3RpdmVzKVxuICAgICAgICAgICAgY29weS5kaXJlY3RpdmVzID0gdGhpcy5kaXJlY3RpdmVzLmNsb25lKCk7XG4gICAgICAgIGNvcHkuc2NoZW1hID0gdGhpcy5zY2hlbWEuY2xvbmUoKTtcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBXZSBjYW4ndCByZWFsbHkga25vdyB0aGF0IHRoaXMgbWF0Y2hlcyBDb250ZW50cy5cbiAgICAgICAgY29weS5jb250ZW50cyA9IGlzTm9kZSh0aGlzLmNvbnRlbnRzKVxuICAgICAgICAgICAgPyB0aGlzLmNvbnRlbnRzLmNsb25lKGNvcHkuc2NoZW1hKVxuICAgICAgICAgICAgOiB0aGlzLmNvbnRlbnRzO1xuICAgICAgICBpZiAodGhpcy5yYW5nZSlcbiAgICAgICAgICAgIGNvcHkucmFuZ2UgPSB0aGlzLnJhbmdlLnNsaWNlKCk7XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbiAgICAvKiogQWRkcyBhIHZhbHVlIHRvIHRoZSBkb2N1bWVudC4gKi9cbiAgICBhZGQodmFsdWUpIHtcbiAgICAgICAgaWYgKGFzc2VydENvbGxlY3Rpb24odGhpcy5jb250ZW50cykpXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzLmFkZCh2YWx1ZSk7XG4gICAgfVxuICAgIC8qKiBBZGRzIGEgdmFsdWUgdG8gdGhlIGRvY3VtZW50LiAqL1xuICAgIGFkZEluKHBhdGgsIHZhbHVlKSB7XG4gICAgICAgIGlmIChhc3NlcnRDb2xsZWN0aW9uKHRoaXMuY29udGVudHMpKVxuICAgICAgICAgICAgdGhpcy5jb250ZW50cy5hZGRJbihwYXRoLCB2YWx1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBgQWxpYXNgIG5vZGUsIGVuc3VyaW5nIHRoYXQgdGhlIHRhcmdldCBgbm9kZWAgaGFzIHRoZSByZXF1aXJlZCBhbmNob3IuXG4gICAgICpcbiAgICAgKiBJZiBgbm9kZWAgYWxyZWFkeSBoYXMgYW4gYW5jaG9yLCBgbmFtZWAgaXMgaWdub3JlZC5cbiAgICAgKiBPdGhlcndpc2UsIHRoZSBgbm9kZS5hbmNob3JgIHZhbHVlIHdpbGwgYmUgc2V0IHRvIGBuYW1lYCxcbiAgICAgKiBvciBpZiBhbiBhbmNob3Igd2l0aCB0aGF0IG5hbWUgaXMgYWxyZWFkeSBwcmVzZW50IGluIHRoZSBkb2N1bWVudCxcbiAgICAgKiBgbmFtZWAgd2lsbCBiZSB1c2VkIGFzIGEgcHJlZml4IGZvciBhIG5ldyB1bmlxdWUgYW5jaG9yLlxuICAgICAqIElmIGBuYW1lYCBpcyB1bmRlZmluZWQsIHRoZSBnZW5lcmF0ZWQgYW5jaG9yIHdpbGwgdXNlICdhJyBhcyBhIHByZWZpeC5cbiAgICAgKi9cbiAgICBjcmVhdGVBbGlhcyhub2RlLCBuYW1lKSB7XG4gICAgICAgIGlmICghbm9kZS5hbmNob3IpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZXYgPSBhbmNob3JOYW1lcyh0aGlzKTtcbiAgICAgICAgICAgIG5vZGUuYW5jaG9yID1cbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3ByZWZlci1udWxsaXNoLWNvYWxlc2NpbmdcbiAgICAgICAgICAgICAgICAhbmFtZSB8fCBwcmV2LmhhcyhuYW1lKSA/IGZpbmROZXdBbmNob3IobmFtZSB8fCAnYScsIHByZXYpIDogbmFtZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEFsaWFzKG5vZGUuYW5jaG9yKTtcbiAgICB9XG4gICAgY3JlYXRlTm9kZSh2YWx1ZSwgcmVwbGFjZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IF9yZXBsYWNlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKHR5cGVvZiByZXBsYWNlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFsdWUgPSByZXBsYWNlci5jYWxsKHsgJyc6IHZhbHVlIH0sICcnLCB2YWx1ZSk7XG4gICAgICAgICAgICBfcmVwbGFjZXIgPSByZXBsYWNlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHJlcGxhY2VyKSkge1xuICAgICAgICAgICAgY29uc3Qga2V5VG9TdHIgPSAodikgPT4gdHlwZW9mIHYgPT09ICdudW1iZXInIHx8IHYgaW5zdGFuY2VvZiBTdHJpbmcgfHwgdiBpbnN0YW5jZW9mIE51bWJlcjtcbiAgICAgICAgICAgIGNvbnN0IGFzU3RyID0gcmVwbGFjZXIuZmlsdGVyKGtleVRvU3RyKS5tYXAoU3RyaW5nKTtcbiAgICAgICAgICAgIGlmIChhc1N0ci5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgIHJlcGxhY2VyID0gcmVwbGFjZXIuY29uY2F0KGFzU3RyKTtcbiAgICAgICAgICAgIF9yZXBsYWNlciA9IHJlcGxhY2VyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCAmJiByZXBsYWNlcikge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHJlcGxhY2VyO1xuICAgICAgICAgICAgcmVwbGFjZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgeyBhbGlhc0R1cGxpY2F0ZU9iamVjdHMsIGFuY2hvclByZWZpeCwgZmxvdywga2VlcFVuZGVmaW5lZCwgb25UYWdPYmosIHRhZyB9ID0gb3B0aW9ucyA/PyB7fTtcbiAgICAgICAgY29uc3QgeyBvbkFuY2hvciwgc2V0QW5jaG9ycywgc291cmNlT2JqZWN0cyB9ID0gY3JlYXRlTm9kZUFuY2hvcnModGhpcywgXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJlZmVyLW51bGxpc2gtY29hbGVzY2luZ1xuICAgICAgICBhbmNob3JQcmVmaXggfHwgJ2EnKTtcbiAgICAgICAgY29uc3QgY3R4ID0ge1xuICAgICAgICAgICAgYWxpYXNEdXBsaWNhdGVPYmplY3RzOiBhbGlhc0R1cGxpY2F0ZU9iamVjdHMgPz8gdHJ1ZSxcbiAgICAgICAgICAgIGtlZXBVbmRlZmluZWQ6IGtlZXBVbmRlZmluZWQgPz8gZmFsc2UsXG4gICAgICAgICAgICBvbkFuY2hvcixcbiAgICAgICAgICAgIG9uVGFnT2JqLFxuICAgICAgICAgICAgcmVwbGFjZXI6IF9yZXBsYWNlcixcbiAgICAgICAgICAgIHNjaGVtYTogdGhpcy5zY2hlbWEsXG4gICAgICAgICAgICBzb3VyY2VPYmplY3RzXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjcmVhdGVOb2RlKHZhbHVlLCB0YWcsIGN0eCk7XG4gICAgICAgIGlmIChmbG93ICYmIGlzQ29sbGVjdGlvbihub2RlKSlcbiAgICAgICAgICAgIG5vZGUuZmxvdyA9IHRydWU7XG4gICAgICAgIHNldEFuY2hvcnMoKTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgYSBrZXkgYW5kIGEgdmFsdWUgaW50byBhIGBQYWlyYCB1c2luZyB0aGUgY3VycmVudCBzY2hlbWEsXG4gICAgICogcmVjdXJzaXZlbHkgd3JhcHBpbmcgYWxsIHZhbHVlcyBhcyBgU2NhbGFyYCBvciBgQ29sbGVjdGlvbmAgbm9kZXMuXG4gICAgICovXG4gICAgY3JlYXRlUGFpcihrZXksIHZhbHVlLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgY29uc3QgayA9IHRoaXMuY3JlYXRlTm9kZShrZXksIG51bGwsIG9wdGlvbnMpO1xuICAgICAgICBjb25zdCB2ID0gdGhpcy5jcmVhdGVOb2RlKHZhbHVlLCBudWxsLCBvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIG5ldyBQYWlyKGssIHYpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgdmFsdWUgZnJvbSB0aGUgZG9jdW1lbnQuXG4gICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBpdGVtIHdhcyBmb3VuZCBhbmQgcmVtb3ZlZC5cbiAgICAgKi9cbiAgICBkZWxldGUoa2V5KSB7XG4gICAgICAgIHJldHVybiBhc3NlcnRDb2xsZWN0aW9uKHRoaXMuY29udGVudHMpID8gdGhpcy5jb250ZW50cy5kZWxldGUoa2V5KSA6IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgdmFsdWUgZnJvbSB0aGUgZG9jdW1lbnQuXG4gICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBpdGVtIHdhcyBmb3VuZCBhbmQgcmVtb3ZlZC5cbiAgICAgKi9cbiAgICBkZWxldGVJbihwYXRoKSB7XG4gICAgICAgIGlmIChpc0VtcHR5UGF0aChwYXRoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudHMgPT0gbnVsbClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFByZXN1bWVkIGltcG9zc2libGUgaWYgU3RyaWN0IGV4dGVuZHMgZmFsc2VcbiAgICAgICAgICAgIHRoaXMuY29udGVudHMgPSBudWxsO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFzc2VydENvbGxlY3Rpb24odGhpcy5jb250ZW50cylcbiAgICAgICAgICAgID8gdGhpcy5jb250ZW50cy5kZWxldGVJbihwYXRoKVxuICAgICAgICAgICAgOiBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBpdGVtIGF0IGBrZXlgLCBvciBgdW5kZWZpbmVkYCBpZiBub3QgZm91bmQuIEJ5IGRlZmF1bHQgdW53cmFwc1xuICAgICAqIHNjYWxhciB2YWx1ZXMgZnJvbSB0aGVpciBzdXJyb3VuZGluZyBub2RlOyB0byBkaXNhYmxlIHNldCBga2VlcFNjYWxhcmAgdG9cbiAgICAgKiBgdHJ1ZWAgKGNvbGxlY3Rpb25zIGFyZSBhbHdheXMgcmV0dXJuZWQgaW50YWN0KS5cbiAgICAgKi9cbiAgICBnZXQoa2V5LCBrZWVwU2NhbGFyKSB7XG4gICAgICAgIHJldHVybiBpc0NvbGxlY3Rpb24odGhpcy5jb250ZW50cylcbiAgICAgICAgICAgID8gdGhpcy5jb250ZW50cy5nZXQoa2V5LCBrZWVwU2NhbGFyKVxuICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaXRlbSBhdCBgcGF0aGAsIG9yIGB1bmRlZmluZWRgIGlmIG5vdCBmb3VuZC4gQnkgZGVmYXVsdCB1bndyYXBzXG4gICAgICogc2NhbGFyIHZhbHVlcyBmcm9tIHRoZWlyIHN1cnJvdW5kaW5nIG5vZGU7IHRvIGRpc2FibGUgc2V0IGBrZWVwU2NhbGFyYCB0b1xuICAgICAqIGB0cnVlYCAoY29sbGVjdGlvbnMgYXJlIGFsd2F5cyByZXR1cm5lZCBpbnRhY3QpLlxuICAgICAqL1xuICAgIGdldEluKHBhdGgsIGtlZXBTY2FsYXIpIHtcbiAgICAgICAgaWYgKGlzRW1wdHlQYXRoKHBhdGgpKVxuICAgICAgICAgICAgcmV0dXJuICFrZWVwU2NhbGFyICYmIGlzU2NhbGFyKHRoaXMuY29udGVudHMpXG4gICAgICAgICAgICAgICAgPyB0aGlzLmNvbnRlbnRzLnZhbHVlXG4gICAgICAgICAgICAgICAgOiB0aGlzLmNvbnRlbnRzO1xuICAgICAgICByZXR1cm4gaXNDb2xsZWN0aW9uKHRoaXMuY29udGVudHMpXG4gICAgICAgICAgICA/IHRoaXMuY29udGVudHMuZ2V0SW4ocGF0aCwga2VlcFNjYWxhcilcbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGRvY3VtZW50IGluY2x1ZGVzIGEgdmFsdWUgd2l0aCB0aGUga2V5IGBrZXlgLlxuICAgICAqL1xuICAgIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuIGlzQ29sbGVjdGlvbih0aGlzLmNvbnRlbnRzKSA/IHRoaXMuY29udGVudHMuaGFzKGtleSkgOiBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBkb2N1bWVudCBpbmNsdWRlcyBhIHZhbHVlIGF0IGBwYXRoYC5cbiAgICAgKi9cbiAgICBoYXNJbihwYXRoKSB7XG4gICAgICAgIGlmIChpc0VtcHR5UGF0aChwYXRoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnRlbnRzICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBpc0NvbGxlY3Rpb24odGhpcy5jb250ZW50cykgPyB0aGlzLmNvbnRlbnRzLmhhc0luKHBhdGgpIDogZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgYSB2YWx1ZSBpbiB0aGlzIGRvY3VtZW50LiBGb3IgYCEhc2V0YCwgYHZhbHVlYCBuZWVkcyB0byBiZSBhXG4gICAgICogYm9vbGVhbiB0byBhZGQvcmVtb3ZlIHRoZSBpdGVtIGZyb20gdGhlIHNldC5cbiAgICAgKi9cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5jb250ZW50cyA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFdlIGNhbid0IHJlYWxseSBrbm93IHRoYXQgdGhpcyBtYXRjaGVzIENvbnRlbnRzLlxuICAgICAgICAgICAgdGhpcy5jb250ZW50cyA9IGNvbGxlY3Rpb25Gcm9tUGF0aCh0aGlzLnNjaGVtYSwgW2tleV0sIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhc3NlcnRDb2xsZWN0aW9uKHRoaXMuY29udGVudHMpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzLnNldChrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgdmFsdWUgaW4gdGhpcyBkb2N1bWVudC4gRm9yIGAhIXNldGAsIGB2YWx1ZWAgbmVlZHMgdG8gYmUgYVxuICAgICAqIGJvb2xlYW4gdG8gYWRkL3JlbW92ZSB0aGUgaXRlbSBmcm9tIHRoZSBzZXQuXG4gICAgICovXG4gICAgc2V0SW4ocGF0aCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGlzRW1wdHlQYXRoKHBhdGgpKSB7XG4gICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFdlIGNhbid0IHJlYWxseSBrbm93IHRoYXQgdGhpcyBtYXRjaGVzIENvbnRlbnRzLlxuICAgICAgICAgICAgdGhpcy5jb250ZW50cyA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuY29udGVudHMgPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBXZSBjYW4ndCByZWFsbHkga25vdyB0aGF0IHRoaXMgbWF0Y2hlcyBDb250ZW50cy5cbiAgICAgICAgICAgIHRoaXMuY29udGVudHMgPSBjb2xsZWN0aW9uRnJvbVBhdGgodGhpcy5zY2hlbWEsIEFycmF5LmZyb20ocGF0aCksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhc3NlcnRDb2xsZWN0aW9uKHRoaXMuY29udGVudHMpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzLnNldEluKHBhdGgsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIFlBTUwgdmVyc2lvbiBhbmQgc2NoZW1hIHVzZWQgYnkgdGhlIGRvY3VtZW50LlxuICAgICAqIEEgYG51bGxgIHZlcnNpb24gZGlzYWJsZXMgc3VwcG9ydCBmb3IgZGlyZWN0aXZlcywgZXhwbGljaXQgdGFncywgYW5jaG9ycywgYW5kIGFsaWFzZXMuXG4gICAgICogSXQgYWxzbyByZXF1aXJlcyB0aGUgYHNjaGVtYWAgb3B0aW9uIHRvIGJlIGdpdmVuIGFzIGEgYFNjaGVtYWAgaW5zdGFuY2UgdmFsdWUuXG4gICAgICpcbiAgICAgKiBPdmVycmlkZXMgYWxsIHByZXZpb3VzbHkgc2V0IHNjaGVtYSBvcHRpb25zLlxuICAgICAqL1xuICAgIHNldFNjaGVtYSh2ZXJzaW9uLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2ZXJzaW9uID09PSAnbnVtYmVyJylcbiAgICAgICAgICAgIHZlcnNpb24gPSBTdHJpbmcodmVyc2lvbik7XG4gICAgICAgIGxldCBvcHQ7XG4gICAgICAgIHN3aXRjaCAodmVyc2lvbikge1xuICAgICAgICAgICAgY2FzZSAnMS4xJzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJlY3RpdmVzKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZXMueWFtbC52ZXJzaW9uID0gJzEuMSc7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZXMgPSBuZXcgRGlyZWN0aXZlcyh7IHZlcnNpb246ICcxLjEnIH0pO1xuICAgICAgICAgICAgICAgIG9wdCA9IHsgcmVzb2x2ZUtub3duVGFnczogZmFsc2UsIHNjaGVtYTogJ3lhbWwtMS4xJyB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnMS4yJzpcbiAgICAgICAgICAgIGNhc2UgJ25leHQnOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGl2ZXMpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aXZlcy55YW1sLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3RpdmVzID0gbmV3IERpcmVjdGl2ZXMoeyB2ZXJzaW9uIH0pO1xuICAgICAgICAgICAgICAgIG9wdCA9IHsgcmVzb2x2ZUtub3duVGFnczogdHJ1ZSwgc2NoZW1hOiAnY29yZScgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgbnVsbDpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJlY3RpdmVzKVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5kaXJlY3RpdmVzO1xuICAgICAgICAgICAgICAgIG9wdCA9IG51bGw7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3YgPSBKU09OLnN0cmluZ2lmeSh2ZXJzaW9uKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkICcxLjEnLCAnMS4yJyBvciBudWxsIGFzIGZpcnN0IGFyZ3VtZW50LCBidXQgZm91bmQ6ICR7c3Z9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gTm90IHVzaW5nIGBpbnN0YW5jZW9mIFNjaGVtYWAgdG8gYWxsb3cgZm9yIGR1Y2sgdHlwaW5nXG4gICAgICAgIGlmIChvcHRpb25zLnNjaGVtYSBpbnN0YW5jZW9mIE9iamVjdClcbiAgICAgICAgICAgIHRoaXMuc2NoZW1hID0gb3B0aW9ucy5zY2hlbWE7XG4gICAgICAgIGVsc2UgaWYgKG9wdClcbiAgICAgICAgICAgIHRoaXMuc2NoZW1hID0gbmV3IFNjaGVtYShPYmplY3QuYXNzaWduKG9wdCwgb3B0aW9ucykpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdpdGggYSBudWxsIFlBTUwgdmVyc2lvbiwgdGhlIHsgc2NoZW1hOiBTY2hlbWEgfSBvcHRpb24gaXMgcmVxdWlyZWRgKTtcbiAgICB9XG4gICAgLy8ganNvbiAmIGpzb25BcmcgYXJlIG9ubHkgdXNlZCBmcm9tIHRvSlNPTigpXG4gICAgdG9KUyh7IGpzb24sIGpzb25BcmcsIG1hcEFzTWFwLCBtYXhBbGlhc0NvdW50LCBvbkFuY2hvciwgcmV2aXZlciB9ID0ge30pIHtcbiAgICAgICAgY29uc3QgY3R4ID0ge1xuICAgICAgICAgICAgYW5jaG9yczogbmV3IE1hcCgpLFxuICAgICAgICAgICAgZG9jOiB0aGlzLFxuICAgICAgICAgICAga2VlcDogIWpzb24sXG4gICAgICAgICAgICBtYXBBc01hcDogbWFwQXNNYXAgPT09IHRydWUsXG4gICAgICAgICAgICBtYXBLZXlXYXJuZWQ6IGZhbHNlLFxuICAgICAgICAgICAgbWF4QWxpYXNDb3VudDogdHlwZW9mIG1heEFsaWFzQ291bnQgPT09ICdudW1iZXInID8gbWF4QWxpYXNDb3VudCA6IDEwMFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCByZXMgPSB0b0pTKHRoaXMuY29udGVudHMsIGpzb25BcmcgPz8gJycsIGN0eCk7XG4gICAgICAgIGlmICh0eXBlb2Ygb25BbmNob3IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHsgY291bnQsIHJlcyB9IG9mIGN0eC5hbmNob3JzLnZhbHVlcygpKVxuICAgICAgICAgICAgICAgIG9uQW5jaG9yKHJlcywgY291bnQpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIHJldml2ZXIgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgID8gYXBwbHlSZXZpdmVyKHJldml2ZXIsIHsgJyc6IHJlcyB9LCAnJywgcmVzKVxuICAgICAgICAgICAgOiByZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZG9jdW1lbnQgYGNvbnRlbnRzYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBqc29uQXJnIFVzZWQgYnkgYEpTT04uc3RyaW5naWZ5YCB0byBpbmRpY2F0ZSB0aGUgYXJyYXkgaW5kZXggb3JcbiAgICAgKiAgIHByb3BlcnR5IG5hbWUuXG4gICAgICovXG4gICAgdG9KU09OKGpzb25BcmcsIG9uQW5jaG9yKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvSlMoeyBqc29uOiB0cnVlLCBqc29uQXJnLCBtYXBBc01hcDogZmFsc2UsIG9uQW5jaG9yIH0pO1xuICAgIH1cbiAgICAvKiogQSBZQU1MIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkb2N1bWVudC4gKi9cbiAgICB0b1N0cmluZyhvcHRpb25zID0ge30pIHtcbiAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RvY3VtZW50IHdpdGggZXJyb3JzIGNhbm5vdCBiZSBzdHJpbmdpZmllZCcpO1xuICAgICAgICBpZiAoJ2luZGVudCcgaW4gb3B0aW9ucyAmJlxuICAgICAgICAgICAgKCFOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnMuaW5kZW50KSB8fCBOdW1iZXIob3B0aW9ucy5pbmRlbnQpIDw9IDApKSB7XG4gICAgICAgICAgICBjb25zdCBzID0gSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5pbmRlbnQpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcImluZGVudFwiIG9wdGlvbiBtdXN0IGJlIGEgcG9zaXRpdmUgaW50ZWdlciwgbm90ICR7c31gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RyaW5naWZ5RG9jdW1lbnQodGhpcywgb3B0aW9ucyk7XG4gICAgfVxufVxuZnVuY3Rpb24gYXNzZXJ0Q29sbGVjdGlvbihjb250ZW50cykge1xuICAgIGlmIChpc0NvbGxlY3Rpb24oY29udGVudHMpKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGEgWUFNTCBjb2xsZWN0aW9uIGFzIGRvY3VtZW50IGNvbnRlbnRzJyk7XG59XG5cbmV4cG9ydCB7IERvY3VtZW50IH07XG4iLCAiY2xhc3MgWUFNTEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHBvcywgY29kZSwgbWVzc2FnZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICB0aGlzLnBvcyA9IHBvcztcbiAgICB9XG59XG5jbGFzcyBZQU1MUGFyc2VFcnJvciBleHRlbmRzIFlBTUxFcnJvciB7XG4gICAgY29uc3RydWN0b3IocG9zLCBjb2RlLCBtZXNzYWdlKSB7XG4gICAgICAgIHN1cGVyKCdZQU1MUGFyc2VFcnJvcicsIHBvcywgY29kZSwgbWVzc2FnZSk7XG4gICAgfVxufVxuY2xhc3MgWUFNTFdhcm5pbmcgZXh0ZW5kcyBZQU1MRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKHBvcywgY29kZSwgbWVzc2FnZSkge1xuICAgICAgICBzdXBlcignWUFNTFdhcm5pbmcnLCBwb3MsIGNvZGUsIG1lc3NhZ2UpO1xuICAgIH1cbn1cbmNvbnN0IHByZXR0aWZ5RXJyb3IgPSAoc3JjLCBsYykgPT4gKGVycm9yKSA9PiB7XG4gICAgaWYgKGVycm9yLnBvc1swXSA9PT0gLTEpXG4gICAgICAgIHJldHVybjtcbiAgICBlcnJvci5saW5lUG9zID0gZXJyb3IucG9zLm1hcChwb3MgPT4gbGMubGluZVBvcyhwb3MpKTtcbiAgICBjb25zdCB7IGxpbmUsIGNvbCB9ID0gZXJyb3IubGluZVBvc1swXTtcbiAgICBlcnJvci5tZXNzYWdlICs9IGAgYXQgbGluZSAke2xpbmV9LCBjb2x1bW4gJHtjb2x9YDtcbiAgICBsZXQgY2kgPSBjb2wgLSAxO1xuICAgIGxldCBsaW5lU3RyID0gc3JjXG4gICAgICAgIC5zdWJzdHJpbmcobGMubGluZVN0YXJ0c1tsaW5lIC0gMV0sIGxjLmxpbmVTdGFydHNbbGluZV0pXG4gICAgICAgIC5yZXBsYWNlKC9bXFxuXFxyXSskLywgJycpO1xuICAgIC8vIFRyaW0gdG8gbWF4IDgwIGNoYXJzLCBrZWVwaW5nIGNvbCBwb3NpdGlvbiBuZWFyIHRoZSBtaWRkbGVcbiAgICBpZiAoY2kgPj0gNjAgJiYgbGluZVN0ci5sZW5ndGggPiA4MCkge1xuICAgICAgICBjb25zdCB0cmltU3RhcnQgPSBNYXRoLm1pbihjaSAtIDM5LCBsaW5lU3RyLmxlbmd0aCAtIDc5KTtcbiAgICAgICAgbGluZVN0ciA9ICdcdTIwMjYnICsgbGluZVN0ci5zdWJzdHJpbmcodHJpbVN0YXJ0KTtcbiAgICAgICAgY2kgLT0gdHJpbVN0YXJ0IC0gMTtcbiAgICB9XG4gICAgaWYgKGxpbmVTdHIubGVuZ3RoID4gODApXG4gICAgICAgIGxpbmVTdHIgPSBsaW5lU3RyLnN1YnN0cmluZygwLCA3OSkgKyAnXHUyMDI2JztcbiAgICAvLyBJbmNsdWRlIHByZXZpb3VzIGxpbmUgaW4gY29udGV4dCBpZiBwb2ludGluZyBhdCBsaW5lIHN0YXJ0XG4gICAgaWYgKGxpbmUgPiAxICYmIC9eICokLy50ZXN0KGxpbmVTdHIuc3Vic3RyaW5nKDAsIGNpKSkpIHtcbiAgICAgICAgLy8gUmVnZXhwIHdvbid0IG1hdGNoIGlmIHN0YXJ0IGlzIHRyaW1tZWRcbiAgICAgICAgbGV0IHByZXYgPSBzcmMuc3Vic3RyaW5nKGxjLmxpbmVTdGFydHNbbGluZSAtIDJdLCBsYy5saW5lU3RhcnRzW2xpbmUgLSAxXSk7XG4gICAgICAgIGlmIChwcmV2Lmxlbmd0aCA+IDgwKVxuICAgICAgICAgICAgcHJldiA9IHByZXYuc3Vic3RyaW5nKDAsIDc5KSArICdcdTIwMjZcXG4nO1xuICAgICAgICBsaW5lU3RyID0gcHJldiArIGxpbmVTdHI7XG4gICAgfVxuICAgIGlmICgvW14gXS8udGVzdChsaW5lU3RyKSkge1xuICAgICAgICBsZXQgY291bnQgPSAxO1xuICAgICAgICBjb25zdCBlbmQgPSBlcnJvci5saW5lUG9zWzFdO1xuICAgICAgICBpZiAoZW5kPy5saW5lID09PSBsaW5lICYmIGVuZC5jb2wgPiBjb2wpIHtcbiAgICAgICAgICAgIGNvdW50ID0gTWF0aC5tYXgoMSwgTWF0aC5taW4oZW5kLmNvbCAtIGNvbCwgODAgLSBjaSkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvaW50ZXIgPSAnICcucmVwZWF0KGNpKSArICdeJy5yZXBlYXQoY291bnQpO1xuICAgICAgICBlcnJvci5tZXNzYWdlICs9IGA6XFxuXFxuJHtsaW5lU3RyfVxcbiR7cG9pbnRlcn1cXG5gO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IFlBTUxFcnJvciwgWUFNTFBhcnNlRXJyb3IsIFlBTUxXYXJuaW5nLCBwcmV0dGlmeUVycm9yIH07XG4iLCAiZnVuY3Rpb24gcmVzb2x2ZVByb3BzKHRva2VucywgeyBmbG93LCBpbmRpY2F0b3IsIG5leHQsIG9mZnNldCwgb25FcnJvciwgcGFyZW50SW5kZW50LCBzdGFydE9uTmV3bGluZSB9KSB7XG4gICAgbGV0IHNwYWNlQmVmb3JlID0gZmFsc2U7XG4gICAgbGV0IGF0TmV3bGluZSA9IHN0YXJ0T25OZXdsaW5lO1xuICAgIGxldCBoYXNTcGFjZSA9IHN0YXJ0T25OZXdsaW5lO1xuICAgIGxldCBjb21tZW50ID0gJyc7XG4gICAgbGV0IGNvbW1lbnRTZXAgPSAnJztcbiAgICBsZXQgaGFzTmV3bGluZSA9IGZhbHNlO1xuICAgIGxldCByZXFTcGFjZSA9IGZhbHNlO1xuICAgIGxldCB0YWIgPSBudWxsO1xuICAgIGxldCBhbmNob3IgPSBudWxsO1xuICAgIGxldCB0YWcgPSBudWxsO1xuICAgIGxldCBuZXdsaW5lQWZ0ZXJQcm9wID0gbnVsbDtcbiAgICBsZXQgY29tbWEgPSBudWxsO1xuICAgIGxldCBmb3VuZCA9IG51bGw7XG4gICAgbGV0IHN0YXJ0ID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRva2Vucykge1xuICAgICAgICBpZiAocmVxU3BhY2UpIHtcbiAgICAgICAgICAgIGlmICh0b2tlbi50eXBlICE9PSAnc3BhY2UnICYmXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSAhPT0gJ25ld2xpbmUnICYmXG4gICAgICAgICAgICAgICAgdG9rZW4udHlwZSAhPT0gJ2NvbW1hJylcbiAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLm9mZnNldCwgJ01JU1NJTkdfQ0hBUicsICdUYWdzIGFuZCBhbmNob3JzIG11c3QgYmUgc2VwYXJhdGVkIGZyb20gdGhlIG5leHQgdG9rZW4gYnkgd2hpdGUgc3BhY2UnKTtcbiAgICAgICAgICAgIHJlcVNwYWNlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhYikge1xuICAgICAgICAgICAgaWYgKGF0TmV3bGluZSAmJiB0b2tlbi50eXBlICE9PSAnY29tbWVudCcgJiYgdG9rZW4udHlwZSAhPT0gJ25ld2xpbmUnKSB7XG4gICAgICAgICAgICAgICAgb25FcnJvcih0YWIsICdUQUJfQVNfSU5ERU5UJywgJ1RhYnMgYXJlIG5vdCBhbGxvd2VkIGFzIGluZGVudGF0aW9uJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YWIgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgIC8vIEF0IHRoZSBkb2MgbGV2ZWwsIHRhYnMgYXQgbGluZSBzdGFydCBtYXkgYmUgcGFyc2VkXG4gICAgICAgICAgICAgICAgLy8gYXMgbGVhZGluZyB3aGl0ZSBzcGFjZSByYXRoZXIgdGhhbiBpbmRlbnRhdGlvbi5cbiAgICAgICAgICAgICAgICAvLyBJbiBhIGZsb3cgY29sbGVjdGlvbiwgb25seSB0aGUgcGFyc2VyIGhhbmRsZXMgaW5kZW50LlxuICAgICAgICAgICAgICAgIGlmICghZmxvdyAmJlxuICAgICAgICAgICAgICAgICAgICAoaW5kaWNhdG9yICE9PSAnZG9jLXN0YXJ0JyB8fCBuZXh0Py50eXBlICE9PSAnZmxvdy1jb2xsZWN0aW9uJykgJiZcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4uc291cmNlLmluY2x1ZGVzKCdcXHQnKSkge1xuICAgICAgICAgICAgICAgICAgICB0YWIgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaGFzU3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6IHtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc1NwYWNlKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnTUlTU0lOR19DSEFSJywgJ0NvbW1lbnRzIG11c3QgYmUgc2VwYXJhdGVkIGZyb20gb3RoZXIgdG9rZW5zIGJ5IHdoaXRlIHNwYWNlIGNoYXJhY3RlcnMnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYiA9IHRva2VuLnNvdXJjZS5zdWJzdHJpbmcoMSkgfHwgJyAnO1xuICAgICAgICAgICAgICAgIGlmICghY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudCA9IGNiO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudCArPSBjb21tZW50U2VwICsgY2I7XG4gICAgICAgICAgICAgICAgY29tbWVudFNlcCA9ICcnO1xuICAgICAgICAgICAgICAgIGF0TmV3bGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgaWYgKGF0TmV3bGluZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgKz0gdG9rZW4uc291cmNlO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghZm91bmQgfHwgaW5kaWNhdG9yICE9PSAnc2VxLWl0ZW0taW5kJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlQmVmb3JlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjb21tZW50U2VwICs9IHRva2VuLnNvdXJjZTtcbiAgICAgICAgICAgICAgICBhdE5ld2xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGhhc05ld2xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChhbmNob3IgfHwgdGFnKVxuICAgICAgICAgICAgICAgICAgICBuZXdsaW5lQWZ0ZXJQcm9wID0gdG9rZW47XG4gICAgICAgICAgICAgICAgaGFzU3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnYW5jaG9yJzpcbiAgICAgICAgICAgICAgICBpZiAoYW5jaG9yKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnTVVMVElQTEVfQU5DSE9SUycsICdBIG5vZGUgY2FuIGhhdmUgYXQgbW9zdCBvbmUgYW5jaG9yJyk7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLnNvdXJjZS5lbmRzV2l0aCgnOicpKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLm9mZnNldCArIHRva2VuLnNvdXJjZS5sZW5ndGggLSAxLCAnQkFEX0FMSUFTJywgJ0FuY2hvciBlbmRpbmcgaW4gOiBpcyBhbWJpZ3VvdXMnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBhbmNob3IgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICBzdGFydCA/PyAoc3RhcnQgPSB0b2tlbi5vZmZzZXQpO1xuICAgICAgICAgICAgICAgIGF0TmV3bGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGhhc1NwYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVxU3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAndGFnJzoge1xuICAgICAgICAgICAgICAgIGlmICh0YWcpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdNVUxUSVBMRV9UQUdTJywgJ0Egbm9kZSBjYW4gaGF2ZSBhdCBtb3N0IG9uZSB0YWcnKTtcbiAgICAgICAgICAgICAgICB0YWcgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICBzdGFydCA/PyAoc3RhcnQgPSB0b2tlbi5vZmZzZXQpO1xuICAgICAgICAgICAgICAgIGF0TmV3bGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGhhc1NwYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVxU3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBpbmRpY2F0b3I6XG4gICAgICAgICAgICAgICAgLy8gQ291bGQgaGVyZSBoYW5kbGUgcHJlY2VkaW5nIGNvbW1lbnRzIGRpZmZlcmVudGx5XG4gICAgICAgICAgICAgICAgaWYgKGFuY2hvciB8fCB0YWcpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdCQURfUFJPUF9PUkRFUicsIGBBbmNob3JzIGFuZCB0YWdzIG11c3QgYmUgYWZ0ZXIgdGhlICR7dG9rZW4uc291cmNlfSBpbmRpY2F0b3JgKTtcbiAgICAgICAgICAgICAgICBpZiAoZm91bmQpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdVTkVYUEVDVEVEX1RPS0VOJywgYFVuZXhwZWN0ZWQgJHt0b2tlbi5zb3VyY2V9IGluICR7ZmxvdyA/PyAnY29sbGVjdGlvbid9YCk7XG4gICAgICAgICAgICAgICAgZm91bmQgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICBhdE5ld2xpbmUgPVxuICAgICAgICAgICAgICAgICAgICBpbmRpY2F0b3IgPT09ICdzZXEtaXRlbS1pbmQnIHx8IGluZGljYXRvciA9PT0gJ2V4cGxpY2l0LWtleS1pbmQnO1xuICAgICAgICAgICAgICAgIGhhc1NwYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb21tYSc6XG4gICAgICAgICAgICAgICAgaWYgKGZsb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1hKVxuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ1VORVhQRUNURURfVE9LRU4nLCBgVW5leHBlY3RlZCAsIGluICR7Zmxvd31gKTtcbiAgICAgICAgICAgICAgICAgICAgY29tbWEgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgYXROZXdsaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGhhc1NwYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGVsc2UgZmFsbHRocm91Z2hcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ1VORVhQRUNURURfVE9LRU4nLCBgVW5leHBlY3RlZCAke3Rva2VuLnR5cGV9IHRva2VuYCk7XG4gICAgICAgICAgICAgICAgYXROZXdsaW5lID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaGFzU3BhY2UgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBsYXN0ID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBlbmQgPSBsYXN0ID8gbGFzdC5vZmZzZXQgKyBsYXN0LnNvdXJjZS5sZW5ndGggOiBvZmZzZXQ7XG4gICAgaWYgKHJlcVNwYWNlICYmXG4gICAgICAgIG5leHQgJiZcbiAgICAgICAgbmV4dC50eXBlICE9PSAnc3BhY2UnICYmXG4gICAgICAgIG5leHQudHlwZSAhPT0gJ25ld2xpbmUnICYmXG4gICAgICAgIG5leHQudHlwZSAhPT0gJ2NvbW1hJyAmJlxuICAgICAgICAobmV4dC50eXBlICE9PSAnc2NhbGFyJyB8fCBuZXh0LnNvdXJjZSAhPT0gJycpKSB7XG4gICAgICAgIG9uRXJyb3IobmV4dC5vZmZzZXQsICdNSVNTSU5HX0NIQVInLCAnVGFncyBhbmQgYW5jaG9ycyBtdXN0IGJlIHNlcGFyYXRlZCBmcm9tIHRoZSBuZXh0IHRva2VuIGJ5IHdoaXRlIHNwYWNlJyk7XG4gICAgfVxuICAgIGlmICh0YWIgJiZcbiAgICAgICAgKChhdE5ld2xpbmUgJiYgdGFiLmluZGVudCA8PSBwYXJlbnRJbmRlbnQpIHx8XG4gICAgICAgICAgICBuZXh0Py50eXBlID09PSAnYmxvY2stbWFwJyB8fFxuICAgICAgICAgICAgbmV4dD8udHlwZSA9PT0gJ2Jsb2NrLXNlcScpKVxuICAgICAgICBvbkVycm9yKHRhYiwgJ1RBQl9BU19JTkRFTlQnLCAnVGFicyBhcmUgbm90IGFsbG93ZWQgYXMgaW5kZW50YXRpb24nKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb21tYSxcbiAgICAgICAgZm91bmQsXG4gICAgICAgIHNwYWNlQmVmb3JlLFxuICAgICAgICBjb21tZW50LFxuICAgICAgICBoYXNOZXdsaW5lLFxuICAgICAgICBhbmNob3IsXG4gICAgICAgIHRhZyxcbiAgICAgICAgbmV3bGluZUFmdGVyUHJvcCxcbiAgICAgICAgZW5kLFxuICAgICAgICBzdGFydDogc3RhcnQgPz8gZW5kXG4gICAgfTtcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZVByb3BzIH07XG4iLCAiZnVuY3Rpb24gY29udGFpbnNOZXdsaW5lKGtleSkge1xuICAgIGlmICgha2V5KVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBzd2l0Y2ggKGtleS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2FsaWFzJzpcbiAgICAgICAgY2FzZSAnc2NhbGFyJzpcbiAgICAgICAgY2FzZSAnZG91YmxlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICBjYXNlICdzaW5nbGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICBpZiAoa2V5LnNvdXJjZS5pbmNsdWRlcygnXFxuJykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBpZiAoa2V5LmVuZClcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN0IG9mIGtleS5lbmQpXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdC50eXBlID09PSAnbmV3bGluZScpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgY2FzZSAnZmxvdy1jb2xsZWN0aW9uJzpcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXQgb2Yga2V5Lml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzdCBvZiBpdC5zdGFydClcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0LnR5cGUgPT09ICduZXdsaW5lJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChpdC5zZXApXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc3Qgb2YgaXQuc2VwKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0LnR5cGUgPT09ICduZXdsaW5lJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoY29udGFpbnNOZXdsaW5lKGl0LmtleSkgfHwgY29udGFpbnNOZXdsaW5lKGl0LnZhbHVlKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IGNvbnRhaW5zTmV3bGluZSB9O1xuIiwgImltcG9ydCB7IGNvbnRhaW5zTmV3bGluZSB9IGZyb20gJy4vdXRpbC1jb250YWlucy1uZXdsaW5lLmpzJztcblxuZnVuY3Rpb24gZmxvd0luZGVudENoZWNrKGluZGVudCwgZmMsIG9uRXJyb3IpIHtcbiAgICBpZiAoZmM/LnR5cGUgPT09ICdmbG93LWNvbGxlY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IGVuZCA9IGZjLmVuZFswXTtcbiAgICAgICAgaWYgKGVuZC5pbmRlbnQgPT09IGluZGVudCAmJlxuICAgICAgICAgICAgKGVuZC5zb3VyY2UgPT09ICddJyB8fCBlbmQuc291cmNlID09PSAnfScpICYmXG4gICAgICAgICAgICBjb250YWluc05ld2xpbmUoZmMpKSB7XG4gICAgICAgICAgICBjb25zdCBtc2cgPSAnRmxvdyBlbmQgaW5kaWNhdG9yIHNob3VsZCBiZSBtb3JlIGluZGVudGVkIHRoYW4gcGFyZW50JztcbiAgICAgICAgICAgIG9uRXJyb3IoZW5kLCAnQkFEX0lOREVOVCcsIG1zZywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7IGZsb3dJbmRlbnRDaGVjayB9O1xuIiwgImltcG9ydCB7IGlzU2NhbGFyIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuXG5mdW5jdGlvbiBtYXBJbmNsdWRlcyhjdHgsIGl0ZW1zLCBzZWFyY2gpIHtcbiAgICBjb25zdCB7IHVuaXF1ZUtleXMgfSA9IGN0eC5vcHRpb25zO1xuICAgIGlmICh1bmlxdWVLZXlzID09PSBmYWxzZSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGlzRXF1YWwgPSB0eXBlb2YgdW5pcXVlS2V5cyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IHVuaXF1ZUtleXNcbiAgICAgICAgOiAoYSwgYikgPT4gYSA9PT0gYiB8fCAoaXNTY2FsYXIoYSkgJiYgaXNTY2FsYXIoYikgJiYgYS52YWx1ZSA9PT0gYi52YWx1ZSk7XG4gICAgcmV0dXJuIGl0ZW1zLnNvbWUocGFpciA9PiBpc0VxdWFsKHBhaXIua2V5LCBzZWFyY2gpKTtcbn1cblxuZXhwb3J0IHsgbWFwSW5jbHVkZXMgfTtcbiIsICJpbXBvcnQgeyBQYWlyIH0gZnJvbSAnLi4vbm9kZXMvUGFpci5qcyc7XG5pbXBvcnQgeyBZQU1MTWFwIH0gZnJvbSAnLi4vbm9kZXMvWUFNTE1hcC5qcyc7XG5pbXBvcnQgeyByZXNvbHZlUHJvcHMgfSBmcm9tICcuL3Jlc29sdmUtcHJvcHMuanMnO1xuaW1wb3J0IHsgY29udGFpbnNOZXdsaW5lIH0gZnJvbSAnLi91dGlsLWNvbnRhaW5zLW5ld2xpbmUuanMnO1xuaW1wb3J0IHsgZmxvd0luZGVudENoZWNrIH0gZnJvbSAnLi91dGlsLWZsb3ctaW5kZW50LWNoZWNrLmpzJztcbmltcG9ydCB7IG1hcEluY2x1ZGVzIH0gZnJvbSAnLi91dGlsLW1hcC1pbmNsdWRlcy5qcyc7XG5cbmNvbnN0IHN0YXJ0Q29sTXNnID0gJ0FsbCBtYXBwaW5nIGl0ZW1zIG11c3Qgc3RhcnQgYXQgdGhlIHNhbWUgY29sdW1uJztcbmZ1bmN0aW9uIHJlc29sdmVCbG9ja01hcCh7IGNvbXBvc2VOb2RlLCBjb21wb3NlRW1wdHlOb2RlIH0sIGN0eCwgYm0sIG9uRXJyb3IsIHRhZykge1xuICAgIGNvbnN0IE5vZGVDbGFzcyA9IHRhZz8ubm9kZUNsYXNzID8/IFlBTUxNYXA7XG4gICAgY29uc3QgbWFwID0gbmV3IE5vZGVDbGFzcyhjdHguc2NoZW1hKTtcbiAgICBpZiAoY3R4LmF0Um9vdClcbiAgICAgICAgY3R4LmF0Um9vdCA9IGZhbHNlO1xuICAgIGxldCBvZmZzZXQgPSBibS5vZmZzZXQ7XG4gICAgbGV0IGNvbW1lbnRFbmQgPSBudWxsO1xuICAgIGZvciAoY29uc3QgY29sbEl0ZW0gb2YgYm0uaXRlbXMpIHtcbiAgICAgICAgY29uc3QgeyBzdGFydCwga2V5LCBzZXAsIHZhbHVlIH0gPSBjb2xsSXRlbTtcbiAgICAgICAgLy8ga2V5IHByb3BlcnRpZXNcbiAgICAgICAgY29uc3Qga2V5UHJvcHMgPSByZXNvbHZlUHJvcHMoc3RhcnQsIHtcbiAgICAgICAgICAgIGluZGljYXRvcjogJ2V4cGxpY2l0LWtleS1pbmQnLFxuICAgICAgICAgICAgbmV4dDoga2V5ID8/IHNlcD8uWzBdLFxuICAgICAgICAgICAgb2Zmc2V0LFxuICAgICAgICAgICAgb25FcnJvcixcbiAgICAgICAgICAgIHBhcmVudEluZGVudDogYm0uaW5kZW50LFxuICAgICAgICAgICAgc3RhcnRPbk5ld2xpbmU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGltcGxpY2l0S2V5ID0gIWtleVByb3BzLmZvdW5kO1xuICAgICAgICBpZiAoaW1wbGljaXRLZXkpIHtcbiAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5LnR5cGUgPT09ICdibG9jay1zZXEnKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKG9mZnNldCwgJ0JMT0NLX0FTX0lNUExJQ0lUX0tFWScsICdBIGJsb2NrIHNlcXVlbmNlIG1heSBub3QgYmUgdXNlZCBhcyBhbiBpbXBsaWNpdCBtYXAga2V5Jyk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoJ2luZGVudCcgaW4ga2V5ICYmIGtleS5pbmRlbnQgIT09IGJtLmluZGVudClcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihvZmZzZXQsICdCQURfSU5ERU5UJywgc3RhcnRDb2xNc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFrZXlQcm9wcy5hbmNob3IgJiYgIWtleVByb3BzLnRhZyAmJiAhc2VwKSB7XG4gICAgICAgICAgICAgICAgY29tbWVudEVuZCA9IGtleVByb3BzLmVuZDtcbiAgICAgICAgICAgICAgICBpZiAoa2V5UHJvcHMuY29tbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobWFwLmNvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAuY29tbWVudCArPSAnXFxuJyArIGtleVByb3BzLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5jb21tZW50ID0ga2V5UHJvcHMuY29tbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa2V5UHJvcHMubmV3bGluZUFmdGVyUHJvcCB8fCBjb250YWluc05ld2xpbmUoa2V5KSkge1xuICAgICAgICAgICAgICAgIG9uRXJyb3Ioa2V5ID8/IHN0YXJ0W3N0YXJ0Lmxlbmd0aCAtIDFdLCAnTVVMVElMSU5FX0lNUExJQ0lUX0tFWScsICdJbXBsaWNpdCBrZXlzIG5lZWQgdG8gYmUgb24gYSBzaW5nbGUgbGluZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGtleVByb3BzLmZvdW5kPy5pbmRlbnQgIT09IGJtLmluZGVudCkge1xuICAgICAgICAgICAgb25FcnJvcihvZmZzZXQsICdCQURfSU5ERU5UJywgc3RhcnRDb2xNc2cpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGtleSB2YWx1ZVxuICAgICAgICBjdHguYXRLZXkgPSB0cnVlO1xuICAgICAgICBjb25zdCBrZXlTdGFydCA9IGtleVByb3BzLmVuZDtcbiAgICAgICAgY29uc3Qga2V5Tm9kZSA9IGtleVxuICAgICAgICAgICAgPyBjb21wb3NlTm9kZShjdHgsIGtleSwga2V5UHJvcHMsIG9uRXJyb3IpXG4gICAgICAgICAgICA6IGNvbXBvc2VFbXB0eU5vZGUoY3R4LCBrZXlTdGFydCwgc3RhcnQsIG51bGwsIGtleVByb3BzLCBvbkVycm9yKTtcbiAgICAgICAgaWYgKGN0eC5zY2hlbWEuY29tcGF0KVxuICAgICAgICAgICAgZmxvd0luZGVudENoZWNrKGJtLmluZGVudCwga2V5LCBvbkVycm9yKTtcbiAgICAgICAgY3R4LmF0S2V5ID0gZmFsc2U7XG4gICAgICAgIGlmIChtYXBJbmNsdWRlcyhjdHgsIG1hcC5pdGVtcywga2V5Tm9kZSkpXG4gICAgICAgICAgICBvbkVycm9yKGtleVN0YXJ0LCAnRFVQTElDQVRFX0tFWScsICdNYXAga2V5cyBtdXN0IGJlIHVuaXF1ZScpO1xuICAgICAgICAvLyB2YWx1ZSBwcm9wZXJ0aWVzXG4gICAgICAgIGNvbnN0IHZhbHVlUHJvcHMgPSByZXNvbHZlUHJvcHMoc2VwID8/IFtdLCB7XG4gICAgICAgICAgICBpbmRpY2F0b3I6ICdtYXAtdmFsdWUtaW5kJyxcbiAgICAgICAgICAgIG5leHQ6IHZhbHVlLFxuICAgICAgICAgICAgb2Zmc2V0OiBrZXlOb2RlLnJhbmdlWzJdLFxuICAgICAgICAgICAgb25FcnJvcixcbiAgICAgICAgICAgIHBhcmVudEluZGVudDogYm0uaW5kZW50LFxuICAgICAgICAgICAgc3RhcnRPbk5ld2xpbmU6ICFrZXkgfHwga2V5LnR5cGUgPT09ICdibG9jay1zY2FsYXInXG4gICAgICAgIH0pO1xuICAgICAgICBvZmZzZXQgPSB2YWx1ZVByb3BzLmVuZDtcbiAgICAgICAgaWYgKHZhbHVlUHJvcHMuZm91bmQpIHtcbiAgICAgICAgICAgIGlmIChpbXBsaWNpdEtleSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gJ2Jsb2NrLW1hcCcgJiYgIXZhbHVlUHJvcHMuaGFzTmV3bGluZSlcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihvZmZzZXQsICdCTE9DS19BU19JTVBMSUNJVF9LRVknLCAnTmVzdGVkIG1hcHBpbmdzIGFyZSBub3QgYWxsb3dlZCBpbiBjb21wYWN0IG1hcHBpbmdzJyk7XG4gICAgICAgICAgICAgICAgaWYgKGN0eC5vcHRpb25zLnN0cmljdCAmJlxuICAgICAgICAgICAgICAgICAgICBrZXlQcm9wcy5zdGFydCA8IHZhbHVlUHJvcHMuZm91bmQub2Zmc2V0IC0gMTAyNClcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihrZXlOb2RlLnJhbmdlLCAnS0VZX09WRVJfMTAyNF9DSEFSUycsICdUaGUgOiBpbmRpY2F0b3IgbXVzdCBiZSBhdCBtb3N0IDEwMjQgY2hhcnMgYWZ0ZXIgdGhlIHN0YXJ0IG9mIGFuIGltcGxpY2l0IGJsb2NrIG1hcHBpbmcga2V5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB2YWx1ZSB2YWx1ZVxuICAgICAgICAgICAgY29uc3QgdmFsdWVOb2RlID0gdmFsdWVcbiAgICAgICAgICAgICAgICA/IGNvbXBvc2VOb2RlKGN0eCwgdmFsdWUsIHZhbHVlUHJvcHMsIG9uRXJyb3IpXG4gICAgICAgICAgICAgICAgOiBjb21wb3NlRW1wdHlOb2RlKGN0eCwgb2Zmc2V0LCBzZXAsIG51bGwsIHZhbHVlUHJvcHMsIG9uRXJyb3IpO1xuICAgICAgICAgICAgaWYgKGN0eC5zY2hlbWEuY29tcGF0KVxuICAgICAgICAgICAgICAgIGZsb3dJbmRlbnRDaGVjayhibS5pbmRlbnQsIHZhbHVlLCBvbkVycm9yKTtcbiAgICAgICAgICAgIG9mZnNldCA9IHZhbHVlTm9kZS5yYW5nZVsyXTtcbiAgICAgICAgICAgIGNvbnN0IHBhaXIgPSBuZXcgUGFpcihrZXlOb2RlLCB2YWx1ZU5vZGUpO1xuICAgICAgICAgICAgaWYgKGN0eC5vcHRpb25zLmtlZXBTb3VyY2VUb2tlbnMpXG4gICAgICAgICAgICAgICAgcGFpci5zcmNUb2tlbiA9IGNvbGxJdGVtO1xuICAgICAgICAgICAgbWFwLml0ZW1zLnB1c2gocGFpcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBrZXkgd2l0aCBubyB2YWx1ZVxuICAgICAgICAgICAgaWYgKGltcGxpY2l0S2V5KVxuICAgICAgICAgICAgICAgIG9uRXJyb3Ioa2V5Tm9kZS5yYW5nZSwgJ01JU1NJTkdfQ0hBUicsICdJbXBsaWNpdCBtYXAga2V5cyBuZWVkIHRvIGJlIGZvbGxvd2VkIGJ5IG1hcCB2YWx1ZXMnKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZVByb3BzLmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5Tm9kZS5jb21tZW50KVxuICAgICAgICAgICAgICAgICAgICBrZXlOb2RlLmNvbW1lbnQgKz0gJ1xcbicgKyB2YWx1ZVByb3BzLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBrZXlOb2RlLmNvbW1lbnQgPSB2YWx1ZVByb3BzLmNvbW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwYWlyID0gbmV3IFBhaXIoa2V5Tm9kZSk7XG4gICAgICAgICAgICBpZiAoY3R4Lm9wdGlvbnMua2VlcFNvdXJjZVRva2VucylcbiAgICAgICAgICAgICAgICBwYWlyLnNyY1Rva2VuID0gY29sbEl0ZW07XG4gICAgICAgICAgICBtYXAuaXRlbXMucHVzaChwYWlyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY29tbWVudEVuZCAmJiBjb21tZW50RW5kIDwgb2Zmc2V0KVxuICAgICAgICBvbkVycm9yKGNvbW1lbnRFbmQsICdJTVBPU1NJQkxFJywgJ01hcCBjb21tZW50IHdpdGggdHJhaWxpbmcgY29udGVudCcpO1xuICAgIG1hcC5yYW5nZSA9IFtibS5vZmZzZXQsIG9mZnNldCwgY29tbWVudEVuZCA/PyBvZmZzZXRdO1xuICAgIHJldHVybiBtYXA7XG59XG5cbmV4cG9ydCB7IHJlc29sdmVCbG9ja01hcCB9O1xuIiwgImltcG9ydCB7IFlBTUxTZXEgfSBmcm9tICcuLi9ub2Rlcy9ZQU1MU2VxLmpzJztcbmltcG9ydCB7IHJlc29sdmVQcm9wcyB9IGZyb20gJy4vcmVzb2x2ZS1wcm9wcy5qcyc7XG5pbXBvcnQgeyBmbG93SW5kZW50Q2hlY2sgfSBmcm9tICcuL3V0aWwtZmxvdy1pbmRlbnQtY2hlY2suanMnO1xuXG5mdW5jdGlvbiByZXNvbHZlQmxvY2tTZXEoeyBjb21wb3NlTm9kZSwgY29tcG9zZUVtcHR5Tm9kZSB9LCBjdHgsIGJzLCBvbkVycm9yLCB0YWcpIHtcbiAgICBjb25zdCBOb2RlQ2xhc3MgPSB0YWc/Lm5vZGVDbGFzcyA/PyBZQU1MU2VxO1xuICAgIGNvbnN0IHNlcSA9IG5ldyBOb2RlQ2xhc3MoY3R4LnNjaGVtYSk7XG4gICAgaWYgKGN0eC5hdFJvb3QpXG4gICAgICAgIGN0eC5hdFJvb3QgPSBmYWxzZTtcbiAgICBpZiAoY3R4LmF0S2V5KVxuICAgICAgICBjdHguYXRLZXkgPSBmYWxzZTtcbiAgICBsZXQgb2Zmc2V0ID0gYnMub2Zmc2V0O1xuICAgIGxldCBjb21tZW50RW5kID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IHsgc3RhcnQsIHZhbHVlIH0gb2YgYnMuaXRlbXMpIHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSByZXNvbHZlUHJvcHMoc3RhcnQsIHtcbiAgICAgICAgICAgIGluZGljYXRvcjogJ3NlcS1pdGVtLWluZCcsXG4gICAgICAgICAgICBuZXh0OiB2YWx1ZSxcbiAgICAgICAgICAgIG9mZnNldCxcbiAgICAgICAgICAgIG9uRXJyb3IsXG4gICAgICAgICAgICBwYXJlbnRJbmRlbnQ6IGJzLmluZGVudCxcbiAgICAgICAgICAgIHN0YXJ0T25OZXdsaW5lOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXByb3BzLmZvdW5kKSB7XG4gICAgICAgICAgICBpZiAocHJvcHMuYW5jaG9yIHx8IHByb3BzLnRhZyB8fCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZT8udHlwZSA9PT0gJ2Jsb2NrLXNlcScpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IocHJvcHMuZW5kLCAnQkFEX0lOREVOVCcsICdBbGwgc2VxdWVuY2UgaXRlbXMgbXVzdCBzdGFydCBhdCB0aGUgc2FtZSBjb2x1bW4nKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3Iob2Zmc2V0LCAnTUlTU0lOR19DSEFSJywgJ1NlcXVlbmNlIGl0ZW0gd2l0aG91dCAtIGluZGljYXRvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tbWVudEVuZCA9IHByb3BzLmVuZDtcbiAgICAgICAgICAgICAgICBpZiAocHJvcHMuY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgc2VxLmNvbW1lbnQgPSBwcm9wcy5jb21tZW50O1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5vZGUgPSB2YWx1ZVxuICAgICAgICAgICAgPyBjb21wb3NlTm9kZShjdHgsIHZhbHVlLCBwcm9wcywgb25FcnJvcilcbiAgICAgICAgICAgIDogY29tcG9zZUVtcHR5Tm9kZShjdHgsIHByb3BzLmVuZCwgc3RhcnQsIG51bGwsIHByb3BzLCBvbkVycm9yKTtcbiAgICAgICAgaWYgKGN0eC5zY2hlbWEuY29tcGF0KVxuICAgICAgICAgICAgZmxvd0luZGVudENoZWNrKGJzLmluZGVudCwgdmFsdWUsIG9uRXJyb3IpO1xuICAgICAgICBvZmZzZXQgPSBub2RlLnJhbmdlWzJdO1xuICAgICAgICBzZXEuaXRlbXMucHVzaChub2RlKTtcbiAgICB9XG4gICAgc2VxLnJhbmdlID0gW2JzLm9mZnNldCwgb2Zmc2V0LCBjb21tZW50RW5kID8/IG9mZnNldF07XG4gICAgcmV0dXJuIHNlcTtcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZUJsb2NrU2VxIH07XG4iLCAiZnVuY3Rpb24gcmVzb2x2ZUVuZChlbmQsIG9mZnNldCwgcmVxU3BhY2UsIG9uRXJyb3IpIHtcbiAgICBsZXQgY29tbWVudCA9ICcnO1xuICAgIGlmIChlbmQpIHtcbiAgICAgICAgbGV0IGhhc1NwYWNlID0gZmFsc2U7XG4gICAgICAgIGxldCBzZXAgPSAnJztcbiAgICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiBlbmQpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgc291cmNlLCB0eXBlIH0gPSB0b2tlbjtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgaGFzU3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdjb21tZW50Jzoge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVxU3BhY2UgJiYgIWhhc1NwYWNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ01JU1NJTkdfQ0hBUicsICdDb21tZW50cyBtdXN0IGJlIHNlcGFyYXRlZCBmcm9tIG90aGVyIHRva2VucyBieSB3aGl0ZSBzcGFjZSBjaGFyYWN0ZXJzJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNiID0gc291cmNlLnN1YnN0cmluZygxKSB8fCAnICc7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBjYjtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudCArPSBzZXAgKyBjYjtcbiAgICAgICAgICAgICAgICAgICAgc2VwID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXAgKz0gc291cmNlO1xuICAgICAgICAgICAgICAgICAgICBoYXNTcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdVTkVYUEVDVEVEX1RPS0VOJywgYFVuZXhwZWN0ZWQgJHt0eXBlfSBhdCBub2RlIGVuZGApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2Zmc2V0ICs9IHNvdXJjZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgY29tbWVudCwgb2Zmc2V0IH07XG59XG5cbmV4cG9ydCB7IHJlc29sdmVFbmQgfTtcbiIsICJpbXBvcnQgeyBpc1BhaXIgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBQYWlyIH0gZnJvbSAnLi4vbm9kZXMvUGFpci5qcyc7XG5pbXBvcnQgeyBZQU1MTWFwIH0gZnJvbSAnLi4vbm9kZXMvWUFNTE1hcC5qcyc7XG5pbXBvcnQgeyBZQU1MU2VxIH0gZnJvbSAnLi4vbm9kZXMvWUFNTFNlcS5qcyc7XG5pbXBvcnQgeyByZXNvbHZlRW5kIH0gZnJvbSAnLi9yZXNvbHZlLWVuZC5qcyc7XG5pbXBvcnQgeyByZXNvbHZlUHJvcHMgfSBmcm9tICcuL3Jlc29sdmUtcHJvcHMuanMnO1xuaW1wb3J0IHsgY29udGFpbnNOZXdsaW5lIH0gZnJvbSAnLi91dGlsLWNvbnRhaW5zLW5ld2xpbmUuanMnO1xuaW1wb3J0IHsgbWFwSW5jbHVkZXMgfSBmcm9tICcuL3V0aWwtbWFwLWluY2x1ZGVzLmpzJztcblxuY29uc3QgYmxvY2tNc2cgPSAnQmxvY2sgY29sbGVjdGlvbnMgYXJlIG5vdCBhbGxvd2VkIHdpdGhpbiBmbG93IGNvbGxlY3Rpb25zJztcbmNvbnN0IGlzQmxvY2sgPSAodG9rZW4pID0+IHRva2VuICYmICh0b2tlbi50eXBlID09PSAnYmxvY2stbWFwJyB8fCB0b2tlbi50eXBlID09PSAnYmxvY2stc2VxJyk7XG5mdW5jdGlvbiByZXNvbHZlRmxvd0NvbGxlY3Rpb24oeyBjb21wb3NlTm9kZSwgY29tcG9zZUVtcHR5Tm9kZSB9LCBjdHgsIGZjLCBvbkVycm9yLCB0YWcpIHtcbiAgICBjb25zdCBpc01hcCA9IGZjLnN0YXJ0LnNvdXJjZSA9PT0gJ3snO1xuICAgIGNvbnN0IGZjTmFtZSA9IGlzTWFwID8gJ2Zsb3cgbWFwJyA6ICdmbG93IHNlcXVlbmNlJztcbiAgICBjb25zdCBOb2RlQ2xhc3MgPSAodGFnPy5ub2RlQ2xhc3MgPz8gKGlzTWFwID8gWUFNTE1hcCA6IFlBTUxTZXEpKTtcbiAgICBjb25zdCBjb2xsID0gbmV3IE5vZGVDbGFzcyhjdHguc2NoZW1hKTtcbiAgICBjb2xsLmZsb3cgPSB0cnVlO1xuICAgIGNvbnN0IGF0Um9vdCA9IGN0eC5hdFJvb3Q7XG4gICAgaWYgKGF0Um9vdClcbiAgICAgICAgY3R4LmF0Um9vdCA9IGZhbHNlO1xuICAgIGlmIChjdHguYXRLZXkpXG4gICAgICAgIGN0eC5hdEtleSA9IGZhbHNlO1xuICAgIGxldCBvZmZzZXQgPSBmYy5vZmZzZXQgKyBmYy5zdGFydC5zb3VyY2UubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmMuaXRlbXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgY29sbEl0ZW0gPSBmYy5pdGVtc1tpXTtcbiAgICAgICAgY29uc3QgeyBzdGFydCwga2V5LCBzZXAsIHZhbHVlIH0gPSBjb2xsSXRlbTtcbiAgICAgICAgY29uc3QgcHJvcHMgPSByZXNvbHZlUHJvcHMoc3RhcnQsIHtcbiAgICAgICAgICAgIGZsb3c6IGZjTmFtZSxcbiAgICAgICAgICAgIGluZGljYXRvcjogJ2V4cGxpY2l0LWtleS1pbmQnLFxuICAgICAgICAgICAgbmV4dDoga2V5ID8/IHNlcD8uWzBdLFxuICAgICAgICAgICAgb2Zmc2V0LFxuICAgICAgICAgICAgb25FcnJvcixcbiAgICAgICAgICAgIHBhcmVudEluZGVudDogZmMuaW5kZW50LFxuICAgICAgICAgICAgc3RhcnRPbk5ld2xpbmU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXByb3BzLmZvdW5kKSB7XG4gICAgICAgICAgICBpZiAoIXByb3BzLmFuY2hvciAmJiAhcHJvcHMudGFnICYmICFzZXAgJiYgIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IDAgJiYgcHJvcHMuY29tbWEpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IocHJvcHMuY29tbWEsICdVTkVYUEVDVEVEX1RPS0VOJywgYFVuZXhwZWN0ZWQgLCBpbiAke2ZjTmFtZX1gKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChpIDwgZmMuaXRlbXMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihwcm9wcy5zdGFydCwgJ1VORVhQRUNURURfVE9LRU4nLCBgVW5leHBlY3RlZCBlbXB0eSBpdGVtIGluICR7ZmNOYW1lfWApO1xuICAgICAgICAgICAgICAgIGlmIChwcm9wcy5jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2xsLmNvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsLmNvbW1lbnQgKz0gJ1xcbicgKyBwcm9wcy5jb21tZW50O1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsLmNvbW1lbnQgPSBwcm9wcy5jb21tZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBwcm9wcy5lbmQ7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzTWFwICYmIGN0eC5vcHRpb25zLnN0cmljdCAmJiBjb250YWluc05ld2xpbmUoa2V5KSlcbiAgICAgICAgICAgICAgICBvbkVycm9yKGtleSwgLy8gY2hlY2tlZCBieSBjb250YWluc05ld2xpbmUoKVxuICAgICAgICAgICAgICAgICdNVUxUSUxJTkVfSU1QTElDSVRfS0VZJywgJ0ltcGxpY2l0IGtleXMgb2YgZmxvdyBzZXF1ZW5jZSBwYWlycyBuZWVkIHRvIGJlIG9uIGEgc2luZ2xlIGxpbmUnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKHByb3BzLmNvbW1hKVxuICAgICAgICAgICAgICAgIG9uRXJyb3IocHJvcHMuY29tbWEsICdVTkVYUEVDVEVEX1RPS0VOJywgYFVuZXhwZWN0ZWQgLCBpbiAke2ZjTmFtZX1gKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICghcHJvcHMuY29tbWEpXG4gICAgICAgICAgICAgICAgb25FcnJvcihwcm9wcy5zdGFydCwgJ01JU1NJTkdfQ0hBUicsIGBNaXNzaW5nICwgYmV0d2VlbiAke2ZjTmFtZX0gaXRlbXNgKTtcbiAgICAgICAgICAgIGlmIChwcm9wcy5jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IHByZXZJdGVtQ29tbWVudCA9ICcnO1xuICAgICAgICAgICAgICAgIGxvb3A6IGZvciAoY29uc3Qgc3Qgb2Ygc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzdC50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjb21tYSc6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2SXRlbUNvbW1lbnQgPSBzdC5zb3VyY2Uuc3Vic3RyaW5nKDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIGxvb3A7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrIGxvb3A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHByZXZJdGVtQ29tbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcHJldiA9IGNvbGwuaXRlbXNbY29sbC5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzUGFpcihwcmV2KSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXYgPSBwcmV2LnZhbHVlID8/IHByZXYua2V5O1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJldi5jb21tZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldi5jb21tZW50ICs9ICdcXG4nICsgcHJldkl0ZW1Db21tZW50O1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2LmNvbW1lbnQgPSBwcmV2SXRlbUNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHByb3BzLmNvbW1lbnQgPSBwcm9wcy5jb21tZW50LnN1YnN0cmluZyhwcmV2SXRlbUNvbW1lbnQubGVuZ3RoICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghaXNNYXAgJiYgIXNlcCAmJiAhcHJvcHMuZm91bmQpIHtcbiAgICAgICAgICAgIC8vIGl0ZW0gaXMgYSB2YWx1ZSBpbiBhIHNlcVxuICAgICAgICAgICAgLy8gXHUyMTkyIGtleSAmIHNlcCBhcmUgZW1wdHksIHN0YXJ0IGRvZXMgbm90IGluY2x1ZGUgPyBvciA6XG4gICAgICAgICAgICBjb25zdCB2YWx1ZU5vZGUgPSB2YWx1ZVxuICAgICAgICAgICAgICAgID8gY29tcG9zZU5vZGUoY3R4LCB2YWx1ZSwgcHJvcHMsIG9uRXJyb3IpXG4gICAgICAgICAgICAgICAgOiBjb21wb3NlRW1wdHlOb2RlKGN0eCwgcHJvcHMuZW5kLCBzZXAsIG51bGwsIHByb3BzLCBvbkVycm9yKTtcbiAgICAgICAgICAgIGNvbGwuaXRlbXMucHVzaCh2YWx1ZU5vZGUpO1xuICAgICAgICAgICAgb2Zmc2V0ID0gdmFsdWVOb2RlLnJhbmdlWzJdO1xuICAgICAgICAgICAgaWYgKGlzQmxvY2sodmFsdWUpKVxuICAgICAgICAgICAgICAgIG9uRXJyb3IodmFsdWVOb2RlLnJhbmdlLCAnQkxPQ0tfSU5fRkxPVycsIGJsb2NrTXNnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGl0ZW0gaXMgYSBrZXkrdmFsdWUgcGFpclxuICAgICAgICAgICAgLy8ga2V5IHZhbHVlXG4gICAgICAgICAgICBjdHguYXRLZXkgPSB0cnVlO1xuICAgICAgICAgICAgY29uc3Qga2V5U3RhcnQgPSBwcm9wcy5lbmQ7XG4gICAgICAgICAgICBjb25zdCBrZXlOb2RlID0ga2V5XG4gICAgICAgICAgICAgICAgPyBjb21wb3NlTm9kZShjdHgsIGtleSwgcHJvcHMsIG9uRXJyb3IpXG4gICAgICAgICAgICAgICAgOiBjb21wb3NlRW1wdHlOb2RlKGN0eCwga2V5U3RhcnQsIHN0YXJ0LCBudWxsLCBwcm9wcywgb25FcnJvcik7XG4gICAgICAgICAgICBpZiAoaXNCbG9jayhrZXkpKVxuICAgICAgICAgICAgICAgIG9uRXJyb3Ioa2V5Tm9kZS5yYW5nZSwgJ0JMT0NLX0lOX0ZMT1cnLCBibG9ja01zZyk7XG4gICAgICAgICAgICBjdHguYXRLZXkgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIHZhbHVlIHByb3BlcnRpZXNcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlUHJvcHMgPSByZXNvbHZlUHJvcHMoc2VwID8/IFtdLCB7XG4gICAgICAgICAgICAgICAgZmxvdzogZmNOYW1lLFxuICAgICAgICAgICAgICAgIGluZGljYXRvcjogJ21hcC12YWx1ZS1pbmQnLFxuICAgICAgICAgICAgICAgIG5leHQ6IHZhbHVlLFxuICAgICAgICAgICAgICAgIG9mZnNldDoga2V5Tm9kZS5yYW5nZVsyXSxcbiAgICAgICAgICAgICAgICBvbkVycm9yLFxuICAgICAgICAgICAgICAgIHBhcmVudEluZGVudDogZmMuaW5kZW50LFxuICAgICAgICAgICAgICAgIHN0YXJ0T25OZXdsaW5lOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodmFsdWVQcm9wcy5mb3VuZCkge1xuICAgICAgICAgICAgICAgIGlmICghaXNNYXAgJiYgIXByb3BzLmZvdW5kICYmIGN0eC5vcHRpb25zLnN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VwKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBzdCBvZiBzZXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3QgPT09IHZhbHVlUHJvcHMuZm91bmQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdC50eXBlID09PSAnbmV3bGluZScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcihzdCwgJ01VTFRJTElORV9JTVBMSUNJVF9LRVknLCAnSW1wbGljaXQga2V5cyBvZiBmbG93IHNlcXVlbmNlIHBhaXJzIG5lZWQgdG8gYmUgb24gYSBzaW5nbGUgbGluZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wcy5zdGFydCA8IHZhbHVlUHJvcHMuZm91bmQub2Zmc2V0IC0gMTAyNClcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodmFsdWVQcm9wcy5mb3VuZCwgJ0tFWV9PVkVSXzEwMjRfQ0hBUlMnLCAnVGhlIDogaW5kaWNhdG9yIG11c3QgYmUgYXQgbW9zdCAxMDI0IGNoYXJzIGFmdGVyIHRoZSBzdGFydCBvZiBhbiBpbXBsaWNpdCBmbG93IHNlcXVlbmNlIGtleScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCdzb3VyY2UnIGluIHZhbHVlICYmIHZhbHVlLnNvdXJjZT8uWzBdID09PSAnOicpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodmFsdWUsICdNSVNTSU5HX0NIQVInLCBgTWlzc2luZyBzcGFjZSBhZnRlciA6IGluICR7ZmNOYW1lfWApO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcih2YWx1ZVByb3BzLnN0YXJ0LCAnTUlTU0lOR19DSEFSJywgYE1pc3NpbmcgLCBvciA6IGJldHdlZW4gJHtmY05hbWV9IGl0ZW1zYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB2YWx1ZSB2YWx1ZVxuICAgICAgICAgICAgY29uc3QgdmFsdWVOb2RlID0gdmFsdWVcbiAgICAgICAgICAgICAgICA/IGNvbXBvc2VOb2RlKGN0eCwgdmFsdWUsIHZhbHVlUHJvcHMsIG9uRXJyb3IpXG4gICAgICAgICAgICAgICAgOiB2YWx1ZVByb3BzLmZvdW5kXG4gICAgICAgICAgICAgICAgICAgID8gY29tcG9zZUVtcHR5Tm9kZShjdHgsIHZhbHVlUHJvcHMuZW5kLCBzZXAsIG51bGwsIHZhbHVlUHJvcHMsIG9uRXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgICAgIGlmICh2YWx1ZU5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNCbG9jayh2YWx1ZSkpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodmFsdWVOb2RlLnJhbmdlLCAnQkxPQ0tfSU5fRkxPVycsIGJsb2NrTXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlUHJvcHMuY29tbWVudCkge1xuICAgICAgICAgICAgICAgIGlmIChrZXlOb2RlLmNvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIGtleU5vZGUuY29tbWVudCArPSAnXFxuJyArIHZhbHVlUHJvcHMuY29tbWVudDtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGtleU5vZGUuY29tbWVudCA9IHZhbHVlUHJvcHMuY29tbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhaXIgPSBuZXcgUGFpcihrZXlOb2RlLCB2YWx1ZU5vZGUpO1xuICAgICAgICAgICAgaWYgKGN0eC5vcHRpb25zLmtlZXBTb3VyY2VUb2tlbnMpXG4gICAgICAgICAgICAgICAgcGFpci5zcmNUb2tlbiA9IGNvbGxJdGVtO1xuICAgICAgICAgICAgaWYgKGlzTWFwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gY29sbDtcbiAgICAgICAgICAgICAgICBpZiAobWFwSW5jbHVkZXMoY3R4LCBtYXAuaXRlbXMsIGtleU5vZGUpKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKGtleVN0YXJ0LCAnRFVQTElDQVRFX0tFWScsICdNYXAga2V5cyBtdXN0IGJlIHVuaXF1ZScpO1xuICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHBhaXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWFwID0gbmV3IFlBTUxNYXAoY3R4LnNjaGVtYSk7XG4gICAgICAgICAgICAgICAgbWFwLmZsb3cgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHBhaXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZFJhbmdlID0gKHZhbHVlTm9kZSA/PyBrZXlOb2RlKS5yYW5nZTtcbiAgICAgICAgICAgICAgICBtYXAucmFuZ2UgPSBba2V5Tm9kZS5yYW5nZVswXSwgZW5kUmFuZ2VbMV0sIGVuZFJhbmdlWzJdXTtcbiAgICAgICAgICAgICAgICBjb2xsLml0ZW1zLnB1c2gobWFwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9mZnNldCA9IHZhbHVlTm9kZSA/IHZhbHVlTm9kZS5yYW5nZVsyXSA6IHZhbHVlUHJvcHMuZW5kO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGV4cGVjdGVkRW5kID0gaXNNYXAgPyAnfScgOiAnXSc7XG4gICAgY29uc3QgW2NlLCAuLi5lZV0gPSBmYy5lbmQ7XG4gICAgbGV0IGNlUG9zID0gb2Zmc2V0O1xuICAgIGlmIChjZT8uc291cmNlID09PSBleHBlY3RlZEVuZClcbiAgICAgICAgY2VQb3MgPSBjZS5vZmZzZXQgKyBjZS5zb3VyY2UubGVuZ3RoO1xuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBuYW1lID0gZmNOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBmY05hbWUuc3Vic3RyaW5nKDEpO1xuICAgICAgICBjb25zdCBtc2cgPSBhdFJvb3RcbiAgICAgICAgICAgID8gYCR7bmFtZX0gbXVzdCBlbmQgd2l0aCBhICR7ZXhwZWN0ZWRFbmR9YFxuICAgICAgICAgICAgOiBgJHtuYW1lfSBpbiBibG9jayBjb2xsZWN0aW9uIG11c3QgYmUgc3VmZmljaWVudGx5IGluZGVudGVkIGFuZCBlbmQgd2l0aCBhICR7ZXhwZWN0ZWRFbmR9YDtcbiAgICAgICAgb25FcnJvcihvZmZzZXQsIGF0Um9vdCA/ICdNSVNTSU5HX0NIQVInIDogJ0JBRF9JTkRFTlQnLCBtc2cpO1xuICAgICAgICBpZiAoY2UgJiYgY2Uuc291cmNlLmxlbmd0aCAhPT0gMSlcbiAgICAgICAgICAgIGVlLnVuc2hpZnQoY2UpO1xuICAgIH1cbiAgICBpZiAoZWUubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBlbmQgPSByZXNvbHZlRW5kKGVlLCBjZVBvcywgY3R4Lm9wdGlvbnMuc3RyaWN0LCBvbkVycm9yKTtcbiAgICAgICAgaWYgKGVuZC5jb21tZW50KSB7XG4gICAgICAgICAgICBpZiAoY29sbC5jb21tZW50KVxuICAgICAgICAgICAgICAgIGNvbGwuY29tbWVudCArPSAnXFxuJyArIGVuZC5jb21tZW50O1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGNvbGwuY29tbWVudCA9IGVuZC5jb21tZW50O1xuICAgICAgICB9XG4gICAgICAgIGNvbGwucmFuZ2UgPSBbZmMub2Zmc2V0LCBjZVBvcywgZW5kLm9mZnNldF07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb2xsLnJhbmdlID0gW2ZjLm9mZnNldCwgY2VQb3MsIGNlUG9zXTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbGw7XG59XG5cbmV4cG9ydCB7IHJlc29sdmVGbG93Q29sbGVjdGlvbiB9O1xuIiwgImltcG9ydCB7IGlzTm9kZSB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uL25vZGVzL1NjYWxhci5qcyc7XG5pbXBvcnQgeyBZQU1MTWFwIH0gZnJvbSAnLi4vbm9kZXMvWUFNTE1hcC5qcyc7XG5pbXBvcnQgeyBZQU1MU2VxIH0gZnJvbSAnLi4vbm9kZXMvWUFNTFNlcS5qcyc7XG5pbXBvcnQgeyByZXNvbHZlQmxvY2tNYXAgfSBmcm9tICcuL3Jlc29sdmUtYmxvY2stbWFwLmpzJztcbmltcG9ydCB7IHJlc29sdmVCbG9ja1NlcSB9IGZyb20gJy4vcmVzb2x2ZS1ibG9jay1zZXEuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZUZsb3dDb2xsZWN0aW9uIH0gZnJvbSAnLi9yZXNvbHZlLWZsb3ctY29sbGVjdGlvbi5qcyc7XG5cbmZ1bmN0aW9uIHJlc29sdmVDb2xsZWN0aW9uKENOLCBjdHgsIHRva2VuLCBvbkVycm9yLCB0YWdOYW1lLCB0YWcpIHtcbiAgICBjb25zdCBjb2xsID0gdG9rZW4udHlwZSA9PT0gJ2Jsb2NrLW1hcCdcbiAgICAgICAgPyByZXNvbHZlQmxvY2tNYXAoQ04sIGN0eCwgdG9rZW4sIG9uRXJyb3IsIHRhZylcbiAgICAgICAgOiB0b2tlbi50eXBlID09PSAnYmxvY2stc2VxJ1xuICAgICAgICAgICAgPyByZXNvbHZlQmxvY2tTZXEoQ04sIGN0eCwgdG9rZW4sIG9uRXJyb3IsIHRhZylcbiAgICAgICAgICAgIDogcmVzb2x2ZUZsb3dDb2xsZWN0aW9uKENOLCBjdHgsIHRva2VuLCBvbkVycm9yLCB0YWcpO1xuICAgIGNvbnN0IENvbGwgPSBjb2xsLmNvbnN0cnVjdG9yO1xuICAgIC8vIElmIHdlIGdvdCBhIHRhZ05hbWUgbWF0Y2hpbmcgdGhlIGNsYXNzLCBvciB0aGUgdGFnIG5hbWUgaXMgJyEnLFxuICAgIC8vIHRoZW4gdXNlIHRoZSB0YWdOYW1lIGZyb20gdGhlIG5vZGUgY2xhc3MgdXNlZCB0byBjcmVhdGUgaXQuXG4gICAgaWYgKHRhZ05hbWUgPT09ICchJyB8fCB0YWdOYW1lID09PSBDb2xsLnRhZ05hbWUpIHtcbiAgICAgICAgY29sbC50YWcgPSBDb2xsLnRhZ05hbWU7XG4gICAgICAgIHJldHVybiBjb2xsO1xuICAgIH1cbiAgICBpZiAodGFnTmFtZSlcbiAgICAgICAgY29sbC50YWcgPSB0YWdOYW1lO1xuICAgIHJldHVybiBjb2xsO1xufVxuZnVuY3Rpb24gY29tcG9zZUNvbGxlY3Rpb24oQ04sIGN0eCwgdG9rZW4sIHByb3BzLCBvbkVycm9yKSB7XG4gICAgY29uc3QgdGFnVG9rZW4gPSBwcm9wcy50YWc7XG4gICAgY29uc3QgdGFnTmFtZSA9ICF0YWdUb2tlblxuICAgICAgICA/IG51bGxcbiAgICAgICAgOiBjdHguZGlyZWN0aXZlcy50YWdOYW1lKHRhZ1Rva2VuLnNvdXJjZSwgbXNnID0+IG9uRXJyb3IodGFnVG9rZW4sICdUQUdfUkVTT0xWRV9GQUlMRUQnLCBtc2cpKTtcbiAgICBpZiAodG9rZW4udHlwZSA9PT0gJ2Jsb2NrLXNlcScpIHtcbiAgICAgICAgY29uc3QgeyBhbmNob3IsIG5ld2xpbmVBZnRlclByb3A6IG5sIH0gPSBwcm9wcztcbiAgICAgICAgY29uc3QgbGFzdFByb3AgPSBhbmNob3IgJiYgdGFnVG9rZW5cbiAgICAgICAgICAgID8gYW5jaG9yLm9mZnNldCA+IHRhZ1Rva2VuLm9mZnNldFxuICAgICAgICAgICAgICAgID8gYW5jaG9yXG4gICAgICAgICAgICAgICAgOiB0YWdUb2tlblxuICAgICAgICAgICAgOiAoYW5jaG9yID8/IHRhZ1Rva2VuKTtcbiAgICAgICAgaWYgKGxhc3RQcm9wICYmICghbmwgfHwgbmwub2Zmc2V0IDwgbGFzdFByb3Aub2Zmc2V0KSkge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdNaXNzaW5nIG5ld2xpbmUgYWZ0ZXIgYmxvY2sgc2VxdWVuY2UgcHJvcHMnO1xuICAgICAgICAgICAgb25FcnJvcihsYXN0UHJvcCwgJ01JU1NJTkdfQ0hBUicsIG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGV4cFR5cGUgPSB0b2tlbi50eXBlID09PSAnYmxvY2stbWFwJ1xuICAgICAgICA/ICdtYXAnXG4gICAgICAgIDogdG9rZW4udHlwZSA9PT0gJ2Jsb2NrLXNlcSdcbiAgICAgICAgICAgID8gJ3NlcSdcbiAgICAgICAgICAgIDogdG9rZW4uc3RhcnQuc291cmNlID09PSAneydcbiAgICAgICAgICAgICAgICA/ICdtYXAnXG4gICAgICAgICAgICAgICAgOiAnc2VxJztcbiAgICAvLyBzaG9ydGN1dDogY2hlY2sgaWYgaXQncyBhIGdlbmVyaWMgWUFNTE1hcCBvciBZQU1MU2VxXG4gICAgLy8gYmVmb3JlIGp1bXBpbmcgaW50byB0aGUgY3VzdG9tIHRhZyBsb2dpYy5cbiAgICBpZiAoIXRhZ1Rva2VuIHx8XG4gICAgICAgICF0YWdOYW1lIHx8XG4gICAgICAgIHRhZ05hbWUgPT09ICchJyB8fFxuICAgICAgICAodGFnTmFtZSA9PT0gWUFNTE1hcC50YWdOYW1lICYmIGV4cFR5cGUgPT09ICdtYXAnKSB8fFxuICAgICAgICAodGFnTmFtZSA9PT0gWUFNTFNlcS50YWdOYW1lICYmIGV4cFR5cGUgPT09ICdzZXEnKSkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZUNvbGxlY3Rpb24oQ04sIGN0eCwgdG9rZW4sIG9uRXJyb3IsIHRhZ05hbWUpO1xuICAgIH1cbiAgICBsZXQgdGFnID0gY3R4LnNjaGVtYS50YWdzLmZpbmQodCA9PiB0LnRhZyA9PT0gdGFnTmFtZSAmJiB0LmNvbGxlY3Rpb24gPT09IGV4cFR5cGUpO1xuICAgIGlmICghdGFnKSB7XG4gICAgICAgIGNvbnN0IGt0ID0gY3R4LnNjaGVtYS5rbm93blRhZ3NbdGFnTmFtZV07XG4gICAgICAgIGlmIChrdD8uY29sbGVjdGlvbiA9PT0gZXhwVHlwZSkge1xuICAgICAgICAgICAgY3R4LnNjaGVtYS50YWdzLnB1c2goT2JqZWN0LmFzc2lnbih7fSwga3QsIHsgZGVmYXVsdDogZmFsc2UgfSkpO1xuICAgICAgICAgICAgdGFnID0ga3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoa3QpIHtcbiAgICAgICAgICAgICAgICBvbkVycm9yKHRhZ1Rva2VuLCAnQkFEX0NPTExFQ1RJT05fVFlQRScsIGAke2t0LnRhZ30gdXNlZCBmb3IgJHtleHBUeXBlfSBjb2xsZWN0aW9uLCBidXQgZXhwZWN0cyAke2t0LmNvbGxlY3Rpb24gPz8gJ3NjYWxhcid9YCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBvbkVycm9yKHRhZ1Rva2VuLCAnVEFHX1JFU09MVkVfRkFJTEVEJywgYFVucmVzb2x2ZWQgdGFnOiAke3RhZ05hbWV9YCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZUNvbGxlY3Rpb24oQ04sIGN0eCwgdG9rZW4sIG9uRXJyb3IsIHRhZ05hbWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGNvbGwgPSByZXNvbHZlQ29sbGVjdGlvbihDTiwgY3R4LCB0b2tlbiwgb25FcnJvciwgdGFnTmFtZSwgdGFnKTtcbiAgICBjb25zdCByZXMgPSB0YWcucmVzb2x2ZT8uKGNvbGwsIG1zZyA9PiBvbkVycm9yKHRhZ1Rva2VuLCAnVEFHX1JFU09MVkVfRkFJTEVEJywgbXNnKSwgY3R4Lm9wdGlvbnMpID8/IGNvbGw7XG4gICAgY29uc3Qgbm9kZSA9IGlzTm9kZShyZXMpXG4gICAgICAgID8gcmVzXG4gICAgICAgIDogbmV3IFNjYWxhcihyZXMpO1xuICAgIG5vZGUucmFuZ2UgPSBjb2xsLnJhbmdlO1xuICAgIG5vZGUudGFnID0gdGFnTmFtZTtcbiAgICBpZiAodGFnPy5mb3JtYXQpXG4gICAgICAgIG5vZGUuZm9ybWF0ID0gdGFnLmZvcm1hdDtcbiAgICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IHsgY29tcG9zZUNvbGxlY3Rpb24gfTtcbiIsICJpbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi9ub2Rlcy9TY2FsYXIuanMnO1xuXG5mdW5jdGlvbiByZXNvbHZlQmxvY2tTY2FsYXIoY3R4LCBzY2FsYXIsIG9uRXJyb3IpIHtcbiAgICBjb25zdCBzdGFydCA9IHNjYWxhci5vZmZzZXQ7XG4gICAgY29uc3QgaGVhZGVyID0gcGFyc2VCbG9ja1NjYWxhckhlYWRlcihzY2FsYXIsIGN0eC5vcHRpb25zLnN0cmljdCwgb25FcnJvcik7XG4gICAgaWYgKCFoZWFkZXIpXG4gICAgICAgIHJldHVybiB7IHZhbHVlOiAnJywgdHlwZTogbnVsbCwgY29tbWVudDogJycsIHJhbmdlOiBbc3RhcnQsIHN0YXJ0LCBzdGFydF0gfTtcbiAgICBjb25zdCB0eXBlID0gaGVhZGVyLm1vZGUgPT09ICc+JyA/IFNjYWxhci5CTE9DS19GT0xERUQgOiBTY2FsYXIuQkxPQ0tfTElURVJBTDtcbiAgICBjb25zdCBsaW5lcyA9IHNjYWxhci5zb3VyY2UgPyBzcGxpdExpbmVzKHNjYWxhci5zb3VyY2UpIDogW107XG4gICAgLy8gZGV0ZXJtaW5lIHRoZSBlbmQgb2YgY29udGVudCAmIHN0YXJ0IG9mIGNob21waW5nXG4gICAgbGV0IGNob21wU3RhcnQgPSBsaW5lcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IGxpbmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBsaW5lc1tpXVsxXTtcbiAgICAgICAgaWYgKGNvbnRlbnQgPT09ICcnIHx8IGNvbnRlbnQgPT09ICdcXHInKVxuICAgICAgICAgICAgY2hvbXBTdGFydCA9IGk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAvLyBzaG9ydGN1dCBmb3IgZW1wdHkgY29udGVudHNcbiAgICBpZiAoY2hvbXBTdGFydCA9PT0gMCkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGhlYWRlci5jaG9tcCA9PT0gJysnICYmIGxpbmVzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgID8gJ1xcbicucmVwZWF0KE1hdGgubWF4KDEsIGxpbmVzLmxlbmd0aCAtIDEpKVxuICAgICAgICAgICAgOiAnJztcbiAgICAgICAgbGV0IGVuZCA9IHN0YXJ0ICsgaGVhZGVyLmxlbmd0aDtcbiAgICAgICAgaWYgKHNjYWxhci5zb3VyY2UpXG4gICAgICAgICAgICBlbmQgKz0gc2NhbGFyLnNvdXJjZS5sZW5ndGg7XG4gICAgICAgIHJldHVybiB7IHZhbHVlLCB0eXBlLCBjb21tZW50OiBoZWFkZXIuY29tbWVudCwgcmFuZ2U6IFtzdGFydCwgZW5kLCBlbmRdIH07XG4gICAgfVxuICAgIC8vIGZpbmQgdGhlIGluZGVudGF0aW9uIGxldmVsIHRvIHRyaW0gZnJvbSBzdGFydFxuICAgIGxldCB0cmltSW5kZW50ID0gc2NhbGFyLmluZGVudCArIGhlYWRlci5pbmRlbnQ7XG4gICAgbGV0IG9mZnNldCA9IHNjYWxhci5vZmZzZXQgKyBoZWFkZXIubGVuZ3RoO1xuICAgIGxldCBjb250ZW50U3RhcnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hvbXBTdGFydDsgKytpKSB7XG4gICAgICAgIGNvbnN0IFtpbmRlbnQsIGNvbnRlbnRdID0gbGluZXNbaV07XG4gICAgICAgIGlmIChjb250ZW50ID09PSAnJyB8fCBjb250ZW50ID09PSAnXFxyJykge1xuICAgICAgICAgICAgaWYgKGhlYWRlci5pbmRlbnQgPT09IDAgJiYgaW5kZW50Lmxlbmd0aCA+IHRyaW1JbmRlbnQpXG4gICAgICAgICAgICAgICAgdHJpbUluZGVudCA9IGluZGVudC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoaW5kZW50Lmxlbmd0aCA8IHRyaW1JbmRlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJ0Jsb2NrIHNjYWxhcnMgd2l0aCBtb3JlLWluZGVudGVkIGxlYWRpbmcgZW1wdHkgbGluZXMgbXVzdCB1c2UgYW4gZXhwbGljaXQgaW5kZW50YXRpb24gaW5kaWNhdG9yJztcbiAgICAgICAgICAgICAgICBvbkVycm9yKG9mZnNldCArIGluZGVudC5sZW5ndGgsICdNSVNTSU5HX0NIQVInLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoZWFkZXIuaW5kZW50ID09PSAwKVxuICAgICAgICAgICAgICAgIHRyaW1JbmRlbnQgPSBpbmRlbnQubGVuZ3RoO1xuICAgICAgICAgICAgY29udGVudFN0YXJ0ID0gaTtcbiAgICAgICAgICAgIGlmICh0cmltSW5kZW50ID09PSAwICYmICFjdHguYXRSb290KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdCbG9jayBzY2FsYXIgdmFsdWVzIGluIGNvbGxlY3Rpb25zIG11c3QgYmUgaW5kZW50ZWQnO1xuICAgICAgICAgICAgICAgIG9uRXJyb3Iob2Zmc2V0LCAnQkFEX0lOREVOVCcsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgb2Zmc2V0ICs9IGluZGVudC5sZW5ndGggKyBjb250ZW50Lmxlbmd0aCArIDE7XG4gICAgfVxuICAgIC8vIGluY2x1ZGUgdHJhaWxpbmcgbW9yZS1pbmRlbnRlZCBlbXB0eSBsaW5lcyBpbiBjb250ZW50XG4gICAgZm9yIChsZXQgaSA9IGxpbmVzLmxlbmd0aCAtIDE7IGkgPj0gY2hvbXBTdGFydDsgLS1pKSB7XG4gICAgICAgIGlmIChsaW5lc1tpXVswXS5sZW5ndGggPiB0cmltSW5kZW50KVxuICAgICAgICAgICAgY2hvbXBTdGFydCA9IGkgKyAxO1xuICAgIH1cbiAgICBsZXQgdmFsdWUgPSAnJztcbiAgICBsZXQgc2VwID0gJyc7XG4gICAgbGV0IHByZXZNb3JlSW5kZW50ZWQgPSBmYWxzZTtcbiAgICAvLyBsZWFkaW5nIHdoaXRlc3BhY2UgaXMga2VwdCBpbnRhY3RcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRlbnRTdGFydDsgKytpKVxuICAgICAgICB2YWx1ZSArPSBsaW5lc1tpXVswXS5zbGljZSh0cmltSW5kZW50KSArICdcXG4nO1xuICAgIGZvciAobGV0IGkgPSBjb250ZW50U3RhcnQ7IGkgPCBjaG9tcFN0YXJ0OyArK2kpIHtcbiAgICAgICAgbGV0IFtpbmRlbnQsIGNvbnRlbnRdID0gbGluZXNbaV07XG4gICAgICAgIG9mZnNldCArPSBpbmRlbnQubGVuZ3RoICsgY29udGVudC5sZW5ndGggKyAxO1xuICAgICAgICBjb25zdCBjcmxmID0gY29udGVudFtjb250ZW50Lmxlbmd0aCAtIDFdID09PSAnXFxyJztcbiAgICAgICAgaWYgKGNybGYpXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5zbGljZSgwLCAtMSk7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiBhbHJlYWR5IGNhdWdodCBpbiBsZXhlciAqL1xuICAgICAgICBpZiAoY29udGVudCAmJiBpbmRlbnQubGVuZ3RoIDwgdHJpbUluZGVudCkge1xuICAgICAgICAgICAgY29uc3Qgc3JjID0gaGVhZGVyLmluZGVudFxuICAgICAgICAgICAgICAgID8gJ2V4cGxpY2l0IGluZGVudGF0aW9uIGluZGljYXRvcidcbiAgICAgICAgICAgICAgICA6ICdmaXJzdCBsaW5lJztcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgQmxvY2sgc2NhbGFyIGxpbmVzIG11c3Qgbm90IGJlIGxlc3MgaW5kZW50ZWQgdGhhbiB0aGVpciAke3NyY31gO1xuICAgICAgICAgICAgb25FcnJvcihvZmZzZXQgLSBjb250ZW50Lmxlbmd0aCAtIChjcmxmID8gMiA6IDEpLCAnQkFEX0lOREVOVCcsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgaW5kZW50ID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgPT09IFNjYWxhci5CTE9DS19MSVRFUkFMKSB7XG4gICAgICAgICAgICB2YWx1ZSArPSBzZXAgKyBpbmRlbnQuc2xpY2UodHJpbUluZGVudCkgKyBjb250ZW50O1xuICAgICAgICAgICAgc2VwID0gJ1xcbic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaW5kZW50Lmxlbmd0aCA+IHRyaW1JbmRlbnQgfHwgY29udGVudFswXSA9PT0gJ1xcdCcpIHtcbiAgICAgICAgICAgIC8vIG1vcmUtaW5kZW50ZWQgY29udGVudCB3aXRoaW4gYSBmb2xkZWQgYmxvY2tcbiAgICAgICAgICAgIGlmIChzZXAgPT09ICcgJylcbiAgICAgICAgICAgICAgICBzZXAgPSAnXFxuJztcbiAgICAgICAgICAgIGVsc2UgaWYgKCFwcmV2TW9yZUluZGVudGVkICYmIHNlcCA9PT0gJ1xcbicpXG4gICAgICAgICAgICAgICAgc2VwID0gJ1xcblxcbic7XG4gICAgICAgICAgICB2YWx1ZSArPSBzZXAgKyBpbmRlbnQuc2xpY2UodHJpbUluZGVudCkgKyBjb250ZW50O1xuICAgICAgICAgICAgc2VwID0gJ1xcbic7XG4gICAgICAgICAgICBwcmV2TW9yZUluZGVudGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb250ZW50ID09PSAnJykge1xuICAgICAgICAgICAgLy8gZW1wdHkgbGluZVxuICAgICAgICAgICAgaWYgKHNlcCA9PT0gJ1xcbicpXG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gJ1xcbic7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2VwID0gJ1xcbic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSArPSBzZXAgKyBjb250ZW50O1xuICAgICAgICAgICAgc2VwID0gJyAnO1xuICAgICAgICAgICAgcHJldk1vcmVJbmRlbnRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN3aXRjaCAoaGVhZGVyLmNob21wKSB7XG4gICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJysnOlxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IGNob21wU3RhcnQ7IGkgPCBsaW5lcy5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSAnXFxuJyArIGxpbmVzW2ldWzBdLnNsaWNlKHRyaW1JbmRlbnQpO1xuICAgICAgICAgICAgaWYgKHZhbHVlW3ZhbHVlLmxlbmd0aCAtIDFdICE9PSAnXFxuJylcbiAgICAgICAgICAgICAgICB2YWx1ZSArPSAnXFxuJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFsdWUgKz0gJ1xcbic7XG4gICAgfVxuICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgaGVhZGVyLmxlbmd0aCArIHNjYWxhci5zb3VyY2UubGVuZ3RoO1xuICAgIHJldHVybiB7IHZhbHVlLCB0eXBlLCBjb21tZW50OiBoZWFkZXIuY29tbWVudCwgcmFuZ2U6IFtzdGFydCwgZW5kLCBlbmRdIH07XG59XG5mdW5jdGlvbiBwYXJzZUJsb2NrU2NhbGFySGVhZGVyKHsgb2Zmc2V0LCBwcm9wcyB9LCBzdHJpY3QsIG9uRXJyb3IpIHtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgc2hvdWxkIG5vdCBoYXBwZW4gKi9cbiAgICBpZiAocHJvcHNbMF0udHlwZSAhPT0gJ2Jsb2NrLXNjYWxhci1oZWFkZXInKSB7XG4gICAgICAgIG9uRXJyb3IocHJvcHNbMF0sICdJTVBPU1NJQkxFJywgJ0Jsb2NrIHNjYWxhciBoZWFkZXIgbm90IGZvdW5kJyk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB7IHNvdXJjZSB9ID0gcHJvcHNbMF07XG4gICAgY29uc3QgbW9kZSA9IHNvdXJjZVswXTtcbiAgICBsZXQgaW5kZW50ID0gMDtcbiAgICBsZXQgY2hvbXAgPSAnJztcbiAgICBsZXQgZXJyb3IgPSAtMTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNvdXJjZS5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBjaCA9IHNvdXJjZVtpXTtcbiAgICAgICAgaWYgKCFjaG9tcCAmJiAoY2ggPT09ICctJyB8fCBjaCA9PT0gJysnKSlcbiAgICAgICAgICAgIGNob21wID0gY2g7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbiA9IE51bWJlcihjaCk7XG4gICAgICAgICAgICBpZiAoIWluZGVudCAmJiBuKVxuICAgICAgICAgICAgICAgIGluZGVudCA9IG47XG4gICAgICAgICAgICBlbHNlIGlmIChlcnJvciA9PT0gLTEpXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBvZmZzZXQgKyBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChlcnJvciAhPT0gLTEpXG4gICAgICAgIG9uRXJyb3IoZXJyb3IsICdVTkVYUEVDVEVEX1RPS0VOJywgYEJsb2NrIHNjYWxhciBoZWFkZXIgaW5jbHVkZXMgZXh0cmEgY2hhcmFjdGVyczogJHtzb3VyY2V9YCk7XG4gICAgbGV0IGhhc1NwYWNlID0gZmFsc2U7XG4gICAgbGV0IGNvbW1lbnQgPSAnJztcbiAgICBsZXQgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHByb3BzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gcHJvcHNbaV07XG4gICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgIGhhc1NwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIGZhbGx0aHJvdWdoXG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICBsZW5ndGggKz0gdG9rZW4uc291cmNlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgICAgIGlmIChzdHJpY3QgJiYgIWhhc1NwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnQ29tbWVudHMgbXVzdCBiZSBzZXBhcmF0ZWQgZnJvbSBvdGhlciB0b2tlbnMgYnkgd2hpdGUgc3BhY2UgY2hhcmFjdGVycyc7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdNSVNTSU5HX0NIQVInLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGVuZ3RoICs9IHRva2VuLnNvdXJjZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgY29tbWVudCA9IHRva2VuLnNvdXJjZS5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ1VORVhQRUNURURfVE9LRU4nLCB0b2tlbi5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBsZW5ndGggKz0gdG9rZW4uc291cmNlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IHNob3VsZCBub3QgaGFwcGVuICovXG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGBVbmV4cGVjdGVkIHRva2VuIGluIGJsb2NrIHNjYWxhciBoZWFkZXI6ICR7dG9rZW4udHlwZX1gO1xuICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdVTkVYUEVDVEVEX1RPS0VOJywgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgdHMgPSB0b2tlbi5zb3VyY2U7XG4gICAgICAgICAgICAgICAgaWYgKHRzICYmIHR5cGVvZiB0cyA9PT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgICAgIGxlbmd0aCArPSB0cy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgbW9kZSwgaW5kZW50LCBjaG9tcCwgY29tbWVudCwgbGVuZ3RoIH07XG59XG4vKiogQHJldHVybnMgQXJyYXkgb2YgbGluZXMgc3BsaXQgdXAgYXMgYFtpbmRlbnQsIGNvbnRlbnRdYCAqL1xuZnVuY3Rpb24gc3BsaXRMaW5lcyhzb3VyY2UpIHtcbiAgICBjb25zdCBzcGxpdCA9IHNvdXJjZS5zcGxpdCgvXFxuKCAqKS8pO1xuICAgIGNvbnN0IGZpcnN0ID0gc3BsaXRbMF07XG4gICAgY29uc3QgbSA9IGZpcnN0Lm1hdGNoKC9eKCAqKS8pO1xuICAgIGNvbnN0IGxpbmUwID0gbT8uWzFdXG4gICAgICAgID8gW21bMV0sIGZpcnN0LnNsaWNlKG1bMV0ubGVuZ3RoKV1cbiAgICAgICAgOiBbJycsIGZpcnN0XTtcbiAgICBjb25zdCBsaW5lcyA9IFtsaW5lMF07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzcGxpdC5sZW5ndGg7IGkgKz0gMilcbiAgICAgICAgbGluZXMucHVzaChbc3BsaXRbaV0sIHNwbGl0W2kgKyAxXV0pO1xuICAgIHJldHVybiBsaW5lcztcbn1cblxuZXhwb3J0IHsgcmVzb2x2ZUJsb2NrU2NhbGFyIH07XG4iLCAiaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vbm9kZXMvU2NhbGFyLmpzJztcbmltcG9ydCB7IHJlc29sdmVFbmQgfSBmcm9tICcuL3Jlc29sdmUtZW5kLmpzJztcblxuZnVuY3Rpb24gcmVzb2x2ZUZsb3dTY2FsYXIoc2NhbGFyLCBzdHJpY3QsIG9uRXJyb3IpIHtcbiAgICBjb25zdCB7IG9mZnNldCwgdHlwZSwgc291cmNlLCBlbmQgfSA9IHNjYWxhcjtcbiAgICBsZXQgX3R5cGU7XG4gICAgbGV0IHZhbHVlO1xuICAgIGNvbnN0IF9vbkVycm9yID0gKHJlbCwgY29kZSwgbXNnKSA9PiBvbkVycm9yKG9mZnNldCArIHJlbCwgY29kZSwgbXNnKTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSAnc2NhbGFyJzpcbiAgICAgICAgICAgIF90eXBlID0gU2NhbGFyLlBMQUlOO1xuICAgICAgICAgICAgdmFsdWUgPSBwbGFpblZhbHVlKHNvdXJjZSwgX29uRXJyb3IpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3NpbmdsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgICAgIF90eXBlID0gU2NhbGFyLlFVT1RFX1NJTkdMRTtcbiAgICAgICAgICAgIHZhbHVlID0gc2luZ2xlUXVvdGVkVmFsdWUoc291cmNlLCBfb25FcnJvcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZG91YmxlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICAgICAgX3R5cGUgPSBTY2FsYXIuUVVPVEVfRE9VQkxFO1xuICAgICAgICAgICAgdmFsdWUgPSBkb3VibGVRdW90ZWRWYWx1ZShzb3VyY2UsIF9vbkVycm9yKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCBzaG91bGQgbm90IGhhcHBlbiAqL1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgb25FcnJvcihzY2FsYXIsICdVTkVYUEVDVEVEX1RPS0VOJywgYEV4cGVjdGVkIGEgZmxvdyBzY2FsYXIgdmFsdWUsIGJ1dCBmb3VuZDogJHt0eXBlfWApO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgICAgICAgICBjb21tZW50OiAnJyxcbiAgICAgICAgICAgICAgICByYW5nZTogW29mZnNldCwgb2Zmc2V0ICsgc291cmNlLmxlbmd0aCwgb2Zmc2V0ICsgc291cmNlLmxlbmd0aF1cbiAgICAgICAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IHZhbHVlRW5kID0gb2Zmc2V0ICsgc291cmNlLmxlbmd0aDtcbiAgICBjb25zdCByZSA9IHJlc29sdmVFbmQoZW5kLCB2YWx1ZUVuZCwgc3RyaWN0LCBvbkVycm9yKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZSxcbiAgICAgICAgdHlwZTogX3R5cGUsXG4gICAgICAgIGNvbW1lbnQ6IHJlLmNvbW1lbnQsXG4gICAgICAgIHJhbmdlOiBbb2Zmc2V0LCB2YWx1ZUVuZCwgcmUub2Zmc2V0XVxuICAgIH07XG59XG5mdW5jdGlvbiBwbGFpblZhbHVlKHNvdXJjZSwgb25FcnJvcikge1xuICAgIGxldCBiYWRDaGFyID0gJyc7XG4gICAgc3dpdGNoIChzb3VyY2VbMF0pIHtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgc2hvdWxkIG5vdCBoYXBwZW4gKi9cbiAgICAgICAgY2FzZSAnXFx0JzpcbiAgICAgICAgICAgIGJhZENoYXIgPSAnYSB0YWIgY2hhcmFjdGVyJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcsJzpcbiAgICAgICAgICAgIGJhZENoYXIgPSAnZmxvdyBpbmRpY2F0b3IgY2hhcmFjdGVyICwnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJyUnOlxuICAgICAgICAgICAgYmFkQ2hhciA9ICdkaXJlY3RpdmUgaW5kaWNhdG9yIGNoYXJhY3RlciAlJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgY2FzZSAnPic6IHtcbiAgICAgICAgICAgIGJhZENoYXIgPSBgYmxvY2sgc2NhbGFyIGluZGljYXRvciAke3NvdXJjZVswXX1gO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnQCc6XG4gICAgICAgIGNhc2UgJ2AnOiB7XG4gICAgICAgICAgICBiYWRDaGFyID0gYHJlc2VydmVkIGNoYXJhY3RlciAke3NvdXJjZVswXX1gO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGJhZENoYXIpXG4gICAgICAgIG9uRXJyb3IoMCwgJ0JBRF9TQ0FMQVJfU1RBUlQnLCBgUGxhaW4gdmFsdWUgY2Fubm90IHN0YXJ0IHdpdGggJHtiYWRDaGFyfWApO1xuICAgIHJldHVybiBmb2xkTGluZXMoc291cmNlKTtcbn1cbmZ1bmN0aW9uIHNpbmdsZVF1b3RlZFZhbHVlKHNvdXJjZSwgb25FcnJvcikge1xuICAgIGlmIChzb3VyY2Vbc291cmNlLmxlbmd0aCAtIDFdICE9PSBcIidcIiB8fCBzb3VyY2UubGVuZ3RoID09PSAxKVxuICAgICAgICBvbkVycm9yKHNvdXJjZS5sZW5ndGgsICdNSVNTSU5HX0NIQVInLCBcIk1pc3NpbmcgY2xvc2luZyAncXVvdGVcIik7XG4gICAgcmV0dXJuIGZvbGRMaW5lcyhzb3VyY2Uuc2xpY2UoMSwgLTEpKS5yZXBsYWNlKC8nJy9nLCBcIidcIik7XG59XG5mdW5jdGlvbiBmb2xkTGluZXMoc291cmNlKSB7XG4gICAgLyoqXG4gICAgICogVGhlIG5lZ2F0aXZlIGxvb2tiZWhpbmQgaGVyZSBhbmQgaW4gdGhlIGByZWAgUmVnRXhwIGlzIHRvXG4gICAgICogcHJldmVudCBjYXVzaW5nIGEgcG9seW5vbWlhbCBzZWFyY2ggdGltZSBpbiBjZXJ0YWluIGNhc2VzLlxuICAgICAqXG4gICAgICogVGhlIHRyeS1jYXRjaCBpcyBmb3IgU2FmYXJpLCB3aGljaCBkb2Vzbid0IHN1cHBvcnQgdGhpcyB5ZXQ6XG4gICAgICogaHR0cHM6Ly9jYW5pdXNlLmNvbS9qcy1yZWdleHAtbG9va2JlaGluZFxuICAgICAqL1xuICAgIGxldCBmaXJzdCwgbGluZTtcbiAgICB0cnkge1xuICAgICAgICBmaXJzdCA9IG5ldyBSZWdFeHAoJyguKj8pKD88IVsgXFx0XSlbIFxcdF0qXFxyP1xcbicsICdzeScpO1xuICAgICAgICBsaW5lID0gbmV3IFJlZ0V4cCgnWyBcXHRdKiguKj8pKD86KD88IVsgXFx0XSlbIFxcdF0qKT9cXHI/XFxuJywgJ3N5Jyk7XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgICAgZmlyc3QgPSAvKC4qPylbIFxcdF0qXFxyP1xcbi9zeTtcbiAgICAgICAgbGluZSA9IC9bIFxcdF0qKC4qPylbIFxcdF0qXFxyP1xcbi9zeTtcbiAgICB9XG4gICAgbGV0IG1hdGNoID0gZmlyc3QuZXhlYyhzb3VyY2UpO1xuICAgIGlmICghbWF0Y2gpXG4gICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgbGV0IHJlcyA9IG1hdGNoWzFdO1xuICAgIGxldCBzZXAgPSAnICc7XG4gICAgbGV0IHBvcyA9IGZpcnN0Lmxhc3RJbmRleDtcbiAgICBsaW5lLmxhc3RJbmRleCA9IHBvcztcbiAgICB3aGlsZSAoKG1hdGNoID0gbGluZS5leGVjKHNvdXJjZSkpKSB7XG4gICAgICAgIGlmIChtYXRjaFsxXSA9PT0gJycpIHtcbiAgICAgICAgICAgIGlmIChzZXAgPT09ICdcXG4nKVxuICAgICAgICAgICAgICAgIHJlcyArPSBzZXA7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2VwID0gJ1xcbic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXMgKz0gc2VwICsgbWF0Y2hbMV07XG4gICAgICAgICAgICBzZXAgPSAnICc7XG4gICAgICAgIH1cbiAgICAgICAgcG9zID0gbGluZS5sYXN0SW5kZXg7XG4gICAgfVxuICAgIGNvbnN0IGxhc3QgPSAvWyBcXHRdKiguKikvc3k7XG4gICAgbGFzdC5sYXN0SW5kZXggPSBwb3M7XG4gICAgbWF0Y2ggPSBsYXN0LmV4ZWMoc291cmNlKTtcbiAgICByZXR1cm4gcmVzICsgc2VwICsgKG1hdGNoPy5bMV0gPz8gJycpO1xufVxuZnVuY3Rpb24gZG91YmxlUXVvdGVkVmFsdWUoc291cmNlLCBvbkVycm9yKSB7XG4gICAgbGV0IHJlcyA9ICcnO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc291cmNlLmxlbmd0aCAtIDE7ICsraSkge1xuICAgICAgICBjb25zdCBjaCA9IHNvdXJjZVtpXTtcbiAgICAgICAgaWYgKGNoID09PSAnXFxyJyAmJiBzb3VyY2VbaSArIDFdID09PSAnXFxuJylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBpZiAoY2ggPT09ICdcXG4nKSB7XG4gICAgICAgICAgICBjb25zdCB7IGZvbGQsIG9mZnNldCB9ID0gZm9sZE5ld2xpbmUoc291cmNlLCBpKTtcbiAgICAgICAgICAgIHJlcyArPSBmb2xkO1xuICAgICAgICAgICAgaSA9IG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjaCA9PT0gJ1xcXFwnKSB7XG4gICAgICAgICAgICBsZXQgbmV4dCA9IHNvdXJjZVsrK2ldO1xuICAgICAgICAgICAgY29uc3QgY2MgPSBlc2NhcGVDb2Rlc1tuZXh0XTtcbiAgICAgICAgICAgIGlmIChjYylcbiAgICAgICAgICAgICAgICByZXMgKz0gY2M7XG4gICAgICAgICAgICBlbHNlIGlmIChuZXh0ID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIC8vIHNraXAgZXNjYXBlZCBuZXdsaW5lcywgYnV0IHN0aWxsIHRyaW0gdGhlIGZvbGxvd2luZyBsaW5lXG4gICAgICAgICAgICAgICAgbmV4dCA9IHNvdXJjZVtpICsgMV07XG4gICAgICAgICAgICAgICAgd2hpbGUgKG5leHQgPT09ICcgJyB8fCBuZXh0ID09PSAnXFx0JylcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IHNvdXJjZVsrK2kgKyAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5leHQgPT09ICdcXHInICYmIHNvdXJjZVtpICsgMV0gPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgLy8gc2tpcCBlc2NhcGVkIENSTEYgbmV3bGluZXMsIGJ1dCBzdGlsbCB0cmltIHRoZSBmb2xsb3dpbmcgbGluZVxuICAgICAgICAgICAgICAgIG5leHQgPSBzb3VyY2VbKytpICsgMV07XG4gICAgICAgICAgICAgICAgd2hpbGUgKG5leHQgPT09ICcgJyB8fCBuZXh0ID09PSAnXFx0JylcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IHNvdXJjZVsrK2kgKyAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG5leHQgPT09ICd4JyB8fCBuZXh0ID09PSAndScgfHwgbmV4dCA9PT0gJ1UnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gbmV4dCA9PT0gJ3gnID8gMiA6IG5leHQgPT09ICd1JyA/IDQgOiA4O1xuICAgICAgICAgICAgICAgIHJlcyArPSBwYXJzZUNoYXJDb2RlKHNvdXJjZSwgaSArIDEsIGxlbmd0aCwgb25FcnJvcik7XG4gICAgICAgICAgICAgICAgaSArPSBsZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCByYXcgPSBzb3VyY2Uuc3Vic3RyKGkgLSAxLCAyKTtcbiAgICAgICAgICAgICAgICBvbkVycm9yKGkgLSAxLCAnQkFEX0RRX0VTQ0FQRScsIGBJbnZhbGlkIGVzY2FwZSBzZXF1ZW5jZSAke3Jhd31gKTtcbiAgICAgICAgICAgICAgICByZXMgKz0gcmF3O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNoID09PSAnICcgfHwgY2ggPT09ICdcXHQnKSB7XG4gICAgICAgICAgICAvLyB0cmltIHRyYWlsaW5nIHdoaXRlc3BhY2VcbiAgICAgICAgICAgIGNvbnN0IHdzU3RhcnQgPSBpO1xuICAgICAgICAgICAgbGV0IG5leHQgPSBzb3VyY2VbaSArIDFdO1xuICAgICAgICAgICAgd2hpbGUgKG5leHQgPT09ICcgJyB8fCBuZXh0ID09PSAnXFx0JylcbiAgICAgICAgICAgICAgICBuZXh0ID0gc291cmNlWysraSArIDFdO1xuICAgICAgICAgICAgaWYgKG5leHQgIT09ICdcXG4nICYmICEobmV4dCA9PT0gJ1xccicgJiYgc291cmNlW2kgKyAyXSA9PT0gJ1xcbicpKVxuICAgICAgICAgICAgICAgIHJlcyArPSBpID4gd3NTdGFydCA/IHNvdXJjZS5zbGljZSh3c1N0YXJ0LCBpICsgMSkgOiBjaDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcyArPSBjaDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoc291cmNlW3NvdXJjZS5sZW5ndGggLSAxXSAhPT0gJ1wiJyB8fCBzb3VyY2UubGVuZ3RoID09PSAxKVxuICAgICAgICBvbkVycm9yKHNvdXJjZS5sZW5ndGgsICdNSVNTSU5HX0NIQVInLCAnTWlzc2luZyBjbG9zaW5nIFwicXVvdGUnKTtcbiAgICByZXR1cm4gcmVzO1xufVxuLyoqXG4gKiBGb2xkIGEgc2luZ2xlIG5ld2xpbmUgaW50byBhIHNwYWNlLCBtdWx0aXBsZSBuZXdsaW5lcyB0byBOIC0gMSBuZXdsaW5lcy5cbiAqIFByZXN1bWVzIGBzb3VyY2Vbb2Zmc2V0XSA9PT0gJ1xcbidgXG4gKi9cbmZ1bmN0aW9uIGZvbGROZXdsaW5lKHNvdXJjZSwgb2Zmc2V0KSB7XG4gICAgbGV0IGZvbGQgPSAnJztcbiAgICBsZXQgY2ggPSBzb3VyY2Vbb2Zmc2V0ICsgMV07XG4gICAgd2hpbGUgKGNoID09PSAnICcgfHwgY2ggPT09ICdcXHQnIHx8IGNoID09PSAnXFxuJyB8fCBjaCA9PT0gJ1xccicpIHtcbiAgICAgICAgaWYgKGNoID09PSAnXFxyJyAmJiBzb3VyY2Vbb2Zmc2V0ICsgMl0gIT09ICdcXG4nKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGlmIChjaCA9PT0gJ1xcbicpXG4gICAgICAgICAgICBmb2xkICs9ICdcXG4nO1xuICAgICAgICBvZmZzZXQgKz0gMTtcbiAgICAgICAgY2ggPSBzb3VyY2Vbb2Zmc2V0ICsgMV07XG4gICAgfVxuICAgIGlmICghZm9sZClcbiAgICAgICAgZm9sZCA9ICcgJztcbiAgICByZXR1cm4geyBmb2xkLCBvZmZzZXQgfTtcbn1cbmNvbnN0IGVzY2FwZUNvZGVzID0ge1xuICAgICcwJzogJ1xcMCcsIC8vIG51bGwgY2hhcmFjdGVyXG4gICAgYTogJ1xceDA3JywgLy8gYmVsbCBjaGFyYWN0ZXJcbiAgICBiOiAnXFxiJywgLy8gYmFja3NwYWNlXG4gICAgZTogJ1xceDFiJywgLy8gZXNjYXBlIGNoYXJhY3RlclxuICAgIGY6ICdcXGYnLCAvLyBmb3JtIGZlZWRcbiAgICBuOiAnXFxuJywgLy8gbGluZSBmZWVkXG4gICAgcjogJ1xccicsIC8vIGNhcnJpYWdlIHJldHVyblxuICAgIHQ6ICdcXHQnLCAvLyBob3Jpem9udGFsIHRhYlxuICAgIHY6ICdcXHYnLCAvLyB2ZXJ0aWNhbCB0YWJcbiAgICBOOiAnXFx1MDA4NScsIC8vIFVuaWNvZGUgbmV4dCBsaW5lXG4gICAgXzogJ1xcdTAwYTAnLCAvLyBVbmljb2RlIG5vbi1icmVha2luZyBzcGFjZVxuICAgIEw6ICdcXHUyMDI4JywgLy8gVW5pY29kZSBsaW5lIHNlcGFyYXRvclxuICAgIFA6ICdcXHUyMDI5JywgLy8gVW5pY29kZSBwYXJhZ3JhcGggc2VwYXJhdG9yXG4gICAgJyAnOiAnICcsXG4gICAgJ1wiJzogJ1wiJyxcbiAgICAnLyc6ICcvJyxcbiAgICAnXFxcXCc6ICdcXFxcJyxcbiAgICAnXFx0JzogJ1xcdCdcbn07XG5mdW5jdGlvbiBwYXJzZUNoYXJDb2RlKHNvdXJjZSwgb2Zmc2V0LCBsZW5ndGgsIG9uRXJyb3IpIHtcbiAgICBjb25zdCBjYyA9IHNvdXJjZS5zdWJzdHIob2Zmc2V0LCBsZW5ndGgpO1xuICAgIGNvbnN0IG9rID0gY2MubGVuZ3RoID09PSBsZW5ndGggJiYgL15bMC05YS1mQS1GXSskLy50ZXN0KGNjKTtcbiAgICBjb25zdCBjb2RlID0gb2sgPyBwYXJzZUludChjYywgMTYpIDogTmFOO1xuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNvZGVQb2ludChjb2RlKTtcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgICBjb25zdCByYXcgPSBzb3VyY2Uuc3Vic3RyKG9mZnNldCAtIDIsIGxlbmd0aCArIDIpO1xuICAgICAgICBvbkVycm9yKG9mZnNldCAtIDIsICdCQURfRFFfRVNDQVBFJywgYEludmFsaWQgZXNjYXBlIHNlcXVlbmNlICR7cmF3fWApO1xuICAgICAgICByZXR1cm4gcmF3O1xuICAgIH1cbn1cblxuZXhwb3J0IHsgcmVzb2x2ZUZsb3dTY2FsYXIgfTtcbiIsICJpbXBvcnQgeyBpc1NjYWxhciwgU0NBTEFSIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vbm9kZXMvU2NhbGFyLmpzJztcbmltcG9ydCB7IHJlc29sdmVCbG9ja1NjYWxhciB9IGZyb20gJy4vcmVzb2x2ZS1ibG9jay1zY2FsYXIuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZUZsb3dTY2FsYXIgfSBmcm9tICcuL3Jlc29sdmUtZmxvdy1zY2FsYXIuanMnO1xuXG5mdW5jdGlvbiBjb21wb3NlU2NhbGFyKGN0eCwgdG9rZW4sIHRhZ1Rva2VuLCBvbkVycm9yKSB7XG4gICAgY29uc3QgeyB2YWx1ZSwgdHlwZSwgY29tbWVudCwgcmFuZ2UgfSA9IHRva2VuLnR5cGUgPT09ICdibG9jay1zY2FsYXInXG4gICAgICAgID8gcmVzb2x2ZUJsb2NrU2NhbGFyKGN0eCwgdG9rZW4sIG9uRXJyb3IpXG4gICAgICAgIDogcmVzb2x2ZUZsb3dTY2FsYXIodG9rZW4sIGN0eC5vcHRpb25zLnN0cmljdCwgb25FcnJvcik7XG4gICAgY29uc3QgdGFnTmFtZSA9IHRhZ1Rva2VuXG4gICAgICAgID8gY3R4LmRpcmVjdGl2ZXMudGFnTmFtZSh0YWdUb2tlbi5zb3VyY2UsIG1zZyA9PiBvbkVycm9yKHRhZ1Rva2VuLCAnVEFHX1JFU09MVkVfRkFJTEVEJywgbXNnKSlcbiAgICAgICAgOiBudWxsO1xuICAgIGxldCB0YWc7XG4gICAgaWYgKGN0eC5vcHRpb25zLnN0cmluZ0tleXMgJiYgY3R4LmF0S2V5KSB7XG4gICAgICAgIHRhZyA9IGN0eC5zY2hlbWFbU0NBTEFSXTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGFnTmFtZSlcbiAgICAgICAgdGFnID0gZmluZFNjYWxhclRhZ0J5TmFtZShjdHguc2NoZW1hLCB2YWx1ZSwgdGFnTmFtZSwgdGFnVG9rZW4sIG9uRXJyb3IpO1xuICAgIGVsc2UgaWYgKHRva2VuLnR5cGUgPT09ICdzY2FsYXInKVxuICAgICAgICB0YWcgPSBmaW5kU2NhbGFyVGFnQnlUZXN0KGN0eCwgdmFsdWUsIHRva2VuLCBvbkVycm9yKTtcbiAgICBlbHNlXG4gICAgICAgIHRhZyA9IGN0eC5zY2hlbWFbU0NBTEFSXTtcbiAgICBsZXQgc2NhbGFyO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IHRhZy5yZXNvbHZlKHZhbHVlLCBtc2cgPT4gb25FcnJvcih0YWdUb2tlbiA/PyB0b2tlbiwgJ1RBR19SRVNPTFZFX0ZBSUxFRCcsIG1zZyksIGN0eC5vcHRpb25zKTtcbiAgICAgICAgc2NhbGFyID0gaXNTY2FsYXIocmVzKSA/IHJlcyA6IG5ldyBTY2FsYXIocmVzKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKTtcbiAgICAgICAgb25FcnJvcih0YWdUb2tlbiA/PyB0b2tlbiwgJ1RBR19SRVNPTFZFX0ZBSUxFRCcsIG1zZyk7XG4gICAgICAgIHNjYWxhciA9IG5ldyBTY2FsYXIodmFsdWUpO1xuICAgIH1cbiAgICBzY2FsYXIucmFuZ2UgPSByYW5nZTtcbiAgICBzY2FsYXIuc291cmNlID0gdmFsdWU7XG4gICAgaWYgKHR5cGUpXG4gICAgICAgIHNjYWxhci50eXBlID0gdHlwZTtcbiAgICBpZiAodGFnTmFtZSlcbiAgICAgICAgc2NhbGFyLnRhZyA9IHRhZ05hbWU7XG4gICAgaWYgKHRhZy5mb3JtYXQpXG4gICAgICAgIHNjYWxhci5mb3JtYXQgPSB0YWcuZm9ybWF0O1xuICAgIGlmIChjb21tZW50KVxuICAgICAgICBzY2FsYXIuY29tbWVudCA9IGNvbW1lbnQ7XG4gICAgcmV0dXJuIHNjYWxhcjtcbn1cbmZ1bmN0aW9uIGZpbmRTY2FsYXJUYWdCeU5hbWUoc2NoZW1hLCB2YWx1ZSwgdGFnTmFtZSwgdGFnVG9rZW4sIG9uRXJyb3IpIHtcbiAgICBpZiAodGFnTmFtZSA9PT0gJyEnKVxuICAgICAgICByZXR1cm4gc2NoZW1hW1NDQUxBUl07IC8vIG5vbi1zcGVjaWZpYyB0YWdcbiAgICBjb25zdCBtYXRjaFdpdGhUZXN0ID0gW107XG4gICAgZm9yIChjb25zdCB0YWcgb2Ygc2NoZW1hLnRhZ3MpIHtcbiAgICAgICAgaWYgKCF0YWcuY29sbGVjdGlvbiAmJiB0YWcudGFnID09PSB0YWdOYW1lKSB7XG4gICAgICAgICAgICBpZiAodGFnLmRlZmF1bHQgJiYgdGFnLnRlc3QpXG4gICAgICAgICAgICAgICAgbWF0Y2hXaXRoVGVzdC5wdXNoKHRhZyk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhZztcbiAgICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IHRhZyBvZiBtYXRjaFdpdGhUZXN0KVxuICAgICAgICBpZiAodGFnLnRlc3Q/LnRlc3QodmFsdWUpKVxuICAgICAgICAgICAgcmV0dXJuIHRhZztcbiAgICBjb25zdCBrdCA9IHNjaGVtYS5rbm93blRhZ3NbdGFnTmFtZV07XG4gICAgaWYgKGt0ICYmICFrdC5jb2xsZWN0aW9uKSB7XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBrbm93biB0YWcgaXMgYXZhaWxhYmxlIGZvciBzdHJpbmdpZnlpbmcsXG4gICAgICAgIC8vIGJ1dCBkb2VzIG5vdCBnZXQgdXNlZCBieSBkZWZhdWx0LlxuICAgICAgICBzY2hlbWEudGFncy5wdXNoKE9iamVjdC5hc3NpZ24oe30sIGt0LCB7IGRlZmF1bHQ6IGZhbHNlLCB0ZXN0OiB1bmRlZmluZWQgfSkpO1xuICAgICAgICByZXR1cm4ga3Q7XG4gICAgfVxuICAgIG9uRXJyb3IodGFnVG9rZW4sICdUQUdfUkVTT0xWRV9GQUlMRUQnLCBgVW5yZXNvbHZlZCB0YWc6ICR7dGFnTmFtZX1gLCB0YWdOYW1lICE9PSAndGFnOnlhbWwub3JnLDIwMDI6c3RyJyk7XG4gICAgcmV0dXJuIHNjaGVtYVtTQ0FMQVJdO1xufVxuZnVuY3Rpb24gZmluZFNjYWxhclRhZ0J5VGVzdCh7IGF0S2V5LCBkaXJlY3RpdmVzLCBzY2hlbWEgfSwgdmFsdWUsIHRva2VuLCBvbkVycm9yKSB7XG4gICAgY29uc3QgdGFnID0gc2NoZW1hLnRhZ3MuZmluZCh0YWcgPT4gKHRhZy5kZWZhdWx0ID09PSB0cnVlIHx8IChhdEtleSAmJiB0YWcuZGVmYXVsdCA9PT0gJ2tleScpKSAmJlxuICAgICAgICB0YWcudGVzdD8udGVzdCh2YWx1ZSkpIHx8IHNjaGVtYVtTQ0FMQVJdO1xuICAgIGlmIChzY2hlbWEuY29tcGF0KSB7XG4gICAgICAgIGNvbnN0IGNvbXBhdCA9IHNjaGVtYS5jb21wYXQuZmluZCh0YWcgPT4gdGFnLmRlZmF1bHQgJiYgdGFnLnRlc3Q/LnRlc3QodmFsdWUpKSA/P1xuICAgICAgICAgICAgc2NoZW1hW1NDQUxBUl07XG4gICAgICAgIGlmICh0YWcudGFnICE9PSBjb21wYXQudGFnKSB7XG4gICAgICAgICAgICBjb25zdCB0cyA9IGRpcmVjdGl2ZXMudGFnU3RyaW5nKHRhZy50YWcpO1xuICAgICAgICAgICAgY29uc3QgY3MgPSBkaXJlY3RpdmVzLnRhZ1N0cmluZyhjb21wYXQudGFnKTtcbiAgICAgICAgICAgIGNvbnN0IG1zZyA9IGBWYWx1ZSBtYXkgYmUgcGFyc2VkIGFzIGVpdGhlciAke3RzfSBvciAke2NzfWA7XG4gICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnVEFHX1JFU09MVkVfRkFJTEVEJywgbXNnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFnO1xufVxuXG5leHBvcnQgeyBjb21wb3NlU2NhbGFyIH07XG4iLCAiZnVuY3Rpb24gZW1wdHlTY2FsYXJQb3NpdGlvbihvZmZzZXQsIGJlZm9yZSwgcG9zKSB7XG4gICAgaWYgKGJlZm9yZSkge1xuICAgICAgICBwb3MgPz8gKHBvcyA9IGJlZm9yZS5sZW5ndGgpO1xuICAgICAgICBmb3IgKGxldCBpID0gcG9zIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgIGxldCBzdCA9IGJlZm9yZVtpXTtcbiAgICAgICAgICAgIHN3aXRjaCAoc3QudHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0IC09IHN0LnNvdXJjZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVGVjaG5pY2FsbHksIGFuIGVtcHR5IHNjYWxhciBpcyBpbW1lZGlhdGVseSBhZnRlciB0aGUgbGFzdCBub24tZW1wdHlcbiAgICAgICAgICAgIC8vIG5vZGUsIGJ1dCBpdCdzIG1vcmUgdXNlZnVsIHRvIHBsYWNlIGl0IGFmdGVyIGFueSB3aGl0ZXNwYWNlLlxuICAgICAgICAgICAgc3QgPSBiZWZvcmVbKytpXTtcbiAgICAgICAgICAgIHdoaWxlIChzdD8udHlwZSA9PT0gJ3NwYWNlJykge1xuICAgICAgICAgICAgICAgIG9mZnNldCArPSBzdC5zb3VyY2UubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHN0ID0gYmVmb3JlWysraV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2Zmc2V0O1xufVxuXG5leHBvcnQgeyBlbXB0eVNjYWxhclBvc2l0aW9uIH07XG4iLCAiaW1wb3J0IHsgQWxpYXMgfSBmcm9tICcuLi9ub2Rlcy9BbGlhcy5qcyc7XG5pbXBvcnQgeyBpc1NjYWxhciB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IGNvbXBvc2VDb2xsZWN0aW9uIH0gZnJvbSAnLi9jb21wb3NlLWNvbGxlY3Rpb24uanMnO1xuaW1wb3J0IHsgY29tcG9zZVNjYWxhciB9IGZyb20gJy4vY29tcG9zZS1zY2FsYXIuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZUVuZCB9IGZyb20gJy4vcmVzb2x2ZS1lbmQuanMnO1xuaW1wb3J0IHsgZW1wdHlTY2FsYXJQb3NpdGlvbiB9IGZyb20gJy4vdXRpbC1lbXB0eS1zY2FsYXItcG9zaXRpb24uanMnO1xuXG5jb25zdCBDTiA9IHsgY29tcG9zZU5vZGUsIGNvbXBvc2VFbXB0eU5vZGUgfTtcbmZ1bmN0aW9uIGNvbXBvc2VOb2RlKGN0eCwgdG9rZW4sIHByb3BzLCBvbkVycm9yKSB7XG4gICAgY29uc3QgYXRLZXkgPSBjdHguYXRLZXk7XG4gICAgY29uc3QgeyBzcGFjZUJlZm9yZSwgY29tbWVudCwgYW5jaG9yLCB0YWcgfSA9IHByb3BzO1xuICAgIGxldCBub2RlO1xuICAgIGxldCBpc1NyY1Rva2VuID0gdHJ1ZTtcbiAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnYWxpYXMnOlxuICAgICAgICAgICAgbm9kZSA9IGNvbXBvc2VBbGlhcyhjdHgsIHRva2VuLCBvbkVycm9yKTtcbiAgICAgICAgICAgIGlmIChhbmNob3IgfHwgdGFnKVxuICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdBTElBU19QUk9QUycsICdBbiBhbGlhcyBub2RlIG11c3Qgbm90IHNwZWNpZnkgYW55IHByb3BlcnRpZXMnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICBjYXNlICdzaW5nbGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgIGNhc2UgJ2RvdWJsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgY2FzZSAnYmxvY2stc2NhbGFyJzpcbiAgICAgICAgICAgIG5vZGUgPSBjb21wb3NlU2NhbGFyKGN0eCwgdG9rZW4sIHRhZywgb25FcnJvcik7XG4gICAgICAgICAgICBpZiAoYW5jaG9yKVxuICAgICAgICAgICAgICAgIG5vZGUuYW5jaG9yID0gYW5jaG9yLnNvdXJjZS5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnYmxvY2stbWFwJzpcbiAgICAgICAgY2FzZSAnYmxvY2stc2VxJzpcbiAgICAgICAgY2FzZSAnZmxvdy1jb2xsZWN0aW9uJzpcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IGNvbXBvc2VDb2xsZWN0aW9uKENOLCBjdHgsIHRva2VuLCBwcm9wcywgb25FcnJvcik7XG4gICAgICAgICAgICAgICAgaWYgKGFuY2hvcilcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5hbmNob3IgPSBhbmNob3Iuc291cmNlLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIC8vIEFsbW9zdCBjZXJ0YWlubHkgaGVyZSBkdWUgdG8gYSBzdGFjayBvdmVyZmxvd1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ1JFU09VUkNFX0VYSEFVU1RJT04nLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gdG9rZW4udHlwZSA9PT0gJ2Vycm9yJ1xuICAgICAgICAgICAgICAgID8gdG9rZW4ubWVzc2FnZVxuICAgICAgICAgICAgICAgIDogYFVuc3VwcG9ydGVkIHRva2VuICh0eXBlOiAke3Rva2VuLnR5cGV9KWA7XG4gICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnVU5FWFBFQ1RFRF9UT0tFTicsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgaXNTcmNUb2tlbiA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5vZGUgPz8gKG5vZGUgPSBjb21wb3NlRW1wdHlOb2RlKGN0eCwgdG9rZW4ub2Zmc2V0LCB1bmRlZmluZWQsIG51bGwsIHByb3BzLCBvbkVycm9yKSk7XG4gICAgaWYgKGFuY2hvciAmJiBub2RlLmFuY2hvciA9PT0gJycpXG4gICAgICAgIG9uRXJyb3IoYW5jaG9yLCAnQkFEX0FMSUFTJywgJ0FuY2hvciBjYW5ub3QgYmUgYW4gZW1wdHkgc3RyaW5nJyk7XG4gICAgaWYgKGF0S2V5ICYmXG4gICAgICAgIGN0eC5vcHRpb25zLnN0cmluZ0tleXMgJiZcbiAgICAgICAgKCFpc1NjYWxhcihub2RlKSB8fFxuICAgICAgICAgICAgdHlwZW9mIG5vZGUudmFsdWUgIT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICAobm9kZS50YWcgJiYgbm9kZS50YWcgIT09ICd0YWc6eWFtbC5vcmcsMjAwMjpzdHInKSkpIHtcbiAgICAgICAgY29uc3QgbXNnID0gJ1dpdGggc3RyaW5nS2V5cywgYWxsIGtleXMgbXVzdCBiZSBzdHJpbmdzJztcbiAgICAgICAgb25FcnJvcih0YWcgPz8gdG9rZW4sICdOT05fU1RSSU5HX0tFWScsIG1zZyk7XG4gICAgfVxuICAgIGlmIChzcGFjZUJlZm9yZSlcbiAgICAgICAgbm9kZS5zcGFjZUJlZm9yZSA9IHRydWU7XG4gICAgaWYgKGNvbW1lbnQpIHtcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09ICdzY2FsYXInICYmIHRva2VuLnNvdXJjZSA9PT0gJycpXG4gICAgICAgICAgICBub2RlLmNvbW1lbnQgPSBjb21tZW50O1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBub2RlLmNvbW1lbnRCZWZvcmUgPSBjb21tZW50O1xuICAgIH1cbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFR5cGUgY2hlY2tpbmcgbWlzc2VzIG1lYW5pbmcgb2YgaXNTcmNUb2tlblxuICAgIGlmIChjdHgub3B0aW9ucy5rZWVwU291cmNlVG9rZW5zICYmIGlzU3JjVG9rZW4pXG4gICAgICAgIG5vZGUuc3JjVG9rZW4gPSB0b2tlbjtcbiAgICByZXR1cm4gbm9kZTtcbn1cbmZ1bmN0aW9uIGNvbXBvc2VFbXB0eU5vZGUoY3R4LCBvZmZzZXQsIGJlZm9yZSwgcG9zLCB7IHNwYWNlQmVmb3JlLCBjb21tZW50LCBhbmNob3IsIHRhZywgZW5kIH0sIG9uRXJyb3IpIHtcbiAgICBjb25zdCB0b2tlbiA9IHtcbiAgICAgICAgdHlwZTogJ3NjYWxhcicsXG4gICAgICAgIG9mZnNldDogZW1wdHlTY2FsYXJQb3NpdGlvbihvZmZzZXQsIGJlZm9yZSwgcG9zKSxcbiAgICAgICAgaW5kZW50OiAtMSxcbiAgICAgICAgc291cmNlOiAnJ1xuICAgIH07XG4gICAgY29uc3Qgbm9kZSA9IGNvbXBvc2VTY2FsYXIoY3R4LCB0b2tlbiwgdGFnLCBvbkVycm9yKTtcbiAgICBpZiAoYW5jaG9yKSB7XG4gICAgICAgIG5vZGUuYW5jaG9yID0gYW5jaG9yLnNvdXJjZS5zdWJzdHJpbmcoMSk7XG4gICAgICAgIGlmIChub2RlLmFuY2hvciA9PT0gJycpXG4gICAgICAgICAgICBvbkVycm9yKGFuY2hvciwgJ0JBRF9BTElBUycsICdBbmNob3IgY2Fubm90IGJlIGFuIGVtcHR5IHN0cmluZycpO1xuICAgIH1cbiAgICBpZiAoc3BhY2VCZWZvcmUpXG4gICAgICAgIG5vZGUuc3BhY2VCZWZvcmUgPSB0cnVlO1xuICAgIGlmIChjb21tZW50KSB7XG4gICAgICAgIG5vZGUuY29tbWVudCA9IGNvbW1lbnQ7XG4gICAgICAgIG5vZGUucmFuZ2VbMl0gPSBlbmQ7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xufVxuZnVuY3Rpb24gY29tcG9zZUFsaWFzKHsgb3B0aW9ucyB9LCB7IG9mZnNldCwgc291cmNlLCBlbmQgfSwgb25FcnJvcikge1xuICAgIGNvbnN0IGFsaWFzID0gbmV3IEFsaWFzKHNvdXJjZS5zdWJzdHJpbmcoMSkpO1xuICAgIGlmIChhbGlhcy5zb3VyY2UgPT09ICcnKVxuICAgICAgICBvbkVycm9yKG9mZnNldCwgJ0JBRF9BTElBUycsICdBbGlhcyBjYW5ub3QgYmUgYW4gZW1wdHkgc3RyaW5nJyk7XG4gICAgaWYgKGFsaWFzLnNvdXJjZS5lbmRzV2l0aCgnOicpKVxuICAgICAgICBvbkVycm9yKG9mZnNldCArIHNvdXJjZS5sZW5ndGggLSAxLCAnQkFEX0FMSUFTJywgJ0FsaWFzIGVuZGluZyBpbiA6IGlzIGFtYmlndW91cycsIHRydWUpO1xuICAgIGNvbnN0IHZhbHVlRW5kID0gb2Zmc2V0ICsgc291cmNlLmxlbmd0aDtcbiAgICBjb25zdCByZSA9IHJlc29sdmVFbmQoZW5kLCB2YWx1ZUVuZCwgb3B0aW9ucy5zdHJpY3QsIG9uRXJyb3IpO1xuICAgIGFsaWFzLnJhbmdlID0gW29mZnNldCwgdmFsdWVFbmQsIHJlLm9mZnNldF07XG4gICAgaWYgKHJlLmNvbW1lbnQpXG4gICAgICAgIGFsaWFzLmNvbW1lbnQgPSByZS5jb21tZW50O1xuICAgIHJldHVybiBhbGlhcztcbn1cblxuZXhwb3J0IHsgY29tcG9zZUVtcHR5Tm9kZSwgY29tcG9zZU5vZGUgfTtcbiIsICJpbXBvcnQgeyBEb2N1bWVudCB9IGZyb20gJy4uL2RvYy9Eb2N1bWVudC5qcyc7XG5pbXBvcnQgeyBjb21wb3NlTm9kZSwgY29tcG9zZUVtcHR5Tm9kZSB9IGZyb20gJy4vY29tcG9zZS1ub2RlLmpzJztcbmltcG9ydCB7IHJlc29sdmVFbmQgfSBmcm9tICcuL3Jlc29sdmUtZW5kLmpzJztcbmltcG9ydCB7IHJlc29sdmVQcm9wcyB9IGZyb20gJy4vcmVzb2x2ZS1wcm9wcy5qcyc7XG5cbmZ1bmN0aW9uIGNvbXBvc2VEb2Mob3B0aW9ucywgZGlyZWN0aXZlcywgeyBvZmZzZXQsIHN0YXJ0LCB2YWx1ZSwgZW5kIH0sIG9uRXJyb3IpIHtcbiAgICBjb25zdCBvcHRzID0gT2JqZWN0LmFzc2lnbih7IF9kaXJlY3RpdmVzOiBkaXJlY3RpdmVzIH0sIG9wdGlvbnMpO1xuICAgIGNvbnN0IGRvYyA9IG5ldyBEb2N1bWVudCh1bmRlZmluZWQsIG9wdHMpO1xuICAgIGNvbnN0IGN0eCA9IHtcbiAgICAgICAgYXRLZXk6IGZhbHNlLFxuICAgICAgICBhdFJvb3Q6IHRydWUsXG4gICAgICAgIGRpcmVjdGl2ZXM6IGRvYy5kaXJlY3RpdmVzLFxuICAgICAgICBvcHRpb25zOiBkb2Mub3B0aW9ucyxcbiAgICAgICAgc2NoZW1hOiBkb2Muc2NoZW1hXG4gICAgfTtcbiAgICBjb25zdCBwcm9wcyA9IHJlc29sdmVQcm9wcyhzdGFydCwge1xuICAgICAgICBpbmRpY2F0b3I6ICdkb2Mtc3RhcnQnLFxuICAgICAgICBuZXh0OiB2YWx1ZSA/PyBlbmQ/LlswXSxcbiAgICAgICAgb2Zmc2V0LFxuICAgICAgICBvbkVycm9yLFxuICAgICAgICBwYXJlbnRJbmRlbnQ6IDAsXG4gICAgICAgIHN0YXJ0T25OZXdsaW5lOiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKHByb3BzLmZvdW5kKSB7XG4gICAgICAgIGRvYy5kaXJlY3RpdmVzLmRvY1N0YXJ0ID0gdHJ1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICAodmFsdWUudHlwZSA9PT0gJ2Jsb2NrLW1hcCcgfHwgdmFsdWUudHlwZSA9PT0gJ2Jsb2NrLXNlcScpICYmXG4gICAgICAgICAgICAhcHJvcHMuaGFzTmV3bGluZSlcbiAgICAgICAgICAgIG9uRXJyb3IocHJvcHMuZW5kLCAnTUlTU0lOR19DSEFSJywgJ0Jsb2NrIGNvbGxlY3Rpb24gY2Fubm90IHN0YXJ0IG9uIHNhbWUgbGluZSB3aXRoIGRpcmVjdGl2ZXMtZW5kIG1hcmtlcicpO1xuICAgIH1cbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIElmIENvbnRlbnRzIGlzIHNldCwgbGV0J3MgdHJ1c3QgdGhlIHVzZXJcbiAgICBkb2MuY29udGVudHMgPSB2YWx1ZVxuICAgICAgICA/IGNvbXBvc2VOb2RlKGN0eCwgdmFsdWUsIHByb3BzLCBvbkVycm9yKVxuICAgICAgICA6IGNvbXBvc2VFbXB0eU5vZGUoY3R4LCBwcm9wcy5lbmQsIHN0YXJ0LCBudWxsLCBwcm9wcywgb25FcnJvcik7XG4gICAgY29uc3QgY29udGVudEVuZCA9IGRvYy5jb250ZW50cy5yYW5nZVsyXTtcbiAgICBjb25zdCByZSA9IHJlc29sdmVFbmQoZW5kLCBjb250ZW50RW5kLCBmYWxzZSwgb25FcnJvcik7XG4gICAgaWYgKHJlLmNvbW1lbnQpXG4gICAgICAgIGRvYy5jb21tZW50ID0gcmUuY29tbWVudDtcbiAgICBkb2MucmFuZ2UgPSBbb2Zmc2V0LCBjb250ZW50RW5kLCByZS5vZmZzZXRdO1xuICAgIHJldHVybiBkb2M7XG59XG5cbmV4cG9ydCB7IGNvbXBvc2VEb2MgfTtcbiIsICJpbXBvcnQgeyBEaXJlY3RpdmVzIH0gZnJvbSAnLi4vZG9jL2RpcmVjdGl2ZXMuanMnO1xuaW1wb3J0IHsgRG9jdW1lbnQgfSBmcm9tICcuLi9kb2MvRG9jdW1lbnQuanMnO1xuaW1wb3J0IHsgWUFNTFdhcm5pbmcsIFlBTUxQYXJzZUVycm9yIH0gZnJvbSAnLi4vZXJyb3JzLmpzJztcbmltcG9ydCB7IGlzQ29sbGVjdGlvbiwgaXNQYWlyIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgY29tcG9zZURvYyB9IGZyb20gJy4vY29tcG9zZS1kb2MuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZUVuZCB9IGZyb20gJy4vcmVzb2x2ZS1lbmQuanMnO1xuXG5mdW5jdGlvbiBnZXRFcnJvclBvcyhzcmMpIHtcbiAgICBpZiAodHlwZW9mIHNyYyA9PT0gJ251bWJlcicpXG4gICAgICAgIHJldHVybiBbc3JjLCBzcmMgKyAxXTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzcmMpKVxuICAgICAgICByZXR1cm4gc3JjLmxlbmd0aCA9PT0gMiA/IHNyYyA6IFtzcmNbMF0sIHNyY1sxXV07XG4gICAgY29uc3QgeyBvZmZzZXQsIHNvdXJjZSB9ID0gc3JjO1xuICAgIHJldHVybiBbb2Zmc2V0LCBvZmZzZXQgKyAodHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycgPyBzb3VyY2UubGVuZ3RoIDogMSldO1xufVxuZnVuY3Rpb24gcGFyc2VQcmVsdWRlKHByZWx1ZGUpIHtcbiAgICBsZXQgY29tbWVudCA9ICcnO1xuICAgIGxldCBhdENvbW1lbnQgPSBmYWxzZTtcbiAgICBsZXQgYWZ0ZXJFbXB0eUxpbmUgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZWx1ZGUubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gcHJlbHVkZVtpXTtcbiAgICAgICAgc3dpdGNoIChzb3VyY2VbMF0pIHtcbiAgICAgICAgICAgIGNhc2UgJyMnOlxuICAgICAgICAgICAgICAgIGNvbW1lbnQgKz1cbiAgICAgICAgICAgICAgICAgICAgKGNvbW1lbnQgPT09ICcnID8gJycgOiBhZnRlckVtcHR5TGluZSA/ICdcXG5cXG4nIDogJ1xcbicpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIChzb3VyY2Uuc3Vic3RyaW5nKDEpIHx8ICcgJyk7XG4gICAgICAgICAgICAgICAgYXRDb21tZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhZnRlckVtcHR5TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnJSc6XG4gICAgICAgICAgICAgICAgaWYgKHByZWx1ZGVbaSArIDFdPy5bMF0gIT09ICcjJylcbiAgICAgICAgICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgICAgIGF0Q29tbWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAvLyBUaGlzIG1heSBiZSB3cm9uZyBhZnRlciBkb2MtZW5kLCBidXQgaW4gdGhhdCBjYXNlIGl0IGRvZXNuJ3QgbWF0dGVyXG4gICAgICAgICAgICAgICAgaWYgKCFhdENvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIGFmdGVyRW1wdHlMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBhdENvbW1lbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBjb21tZW50LCBhZnRlckVtcHR5TGluZSB9O1xufVxuLyoqXG4gKiBDb21wb3NlIGEgc3RyZWFtIG9mIENTVCBub2RlcyBpbnRvIGEgc3RyZWFtIG9mIFlBTUwgRG9jdW1lbnRzLlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBDb21wb3NlciwgUGFyc2VyIH0gZnJvbSAneWFtbCdcbiAqXG4gKiBjb25zdCBzcmM6IHN0cmluZyA9IC4uLlxuICogY29uc3QgdG9rZW5zID0gbmV3IFBhcnNlcigpLnBhcnNlKHNyYylcbiAqIGNvbnN0IGRvY3MgPSBuZXcgQ29tcG9zZXIoKS5jb21wb3NlKHRva2VucylcbiAqIGBgYFxuICovXG5jbGFzcyBDb21wb3NlciB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuZG9jID0gbnVsbDtcbiAgICAgICAgdGhpcy5hdERpcmVjdGl2ZXMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wcmVsdWRlID0gW107XG4gICAgICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgICAgIHRoaXMud2FybmluZ3MgPSBbXTtcbiAgICAgICAgdGhpcy5vbkVycm9yID0gKHNvdXJjZSwgY29kZSwgbWVzc2FnZSwgd2FybmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zID0gZ2V0RXJyb3JQb3Moc291cmNlKTtcbiAgICAgICAgICAgIGlmICh3YXJuaW5nKVxuICAgICAgICAgICAgICAgIHRoaXMud2FybmluZ3MucHVzaChuZXcgWUFNTFdhcm5pbmcocG9zLCBjb2RlLCBtZXNzYWdlKSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgWUFNTFBhcnNlRXJyb3IocG9zLCBjb2RlLCBtZXNzYWdlKSk7XG4gICAgICAgIH07XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJlZmVyLW51bGxpc2gtY29hbGVzY2luZ1xuICAgICAgICB0aGlzLmRpcmVjdGl2ZXMgPSBuZXcgRGlyZWN0aXZlcyh7IHZlcnNpb246IG9wdGlvbnMudmVyc2lvbiB8fCAnMS4yJyB9KTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB9XG4gICAgZGVjb3JhdGUoZG9jLCBhZnRlckRvYykge1xuICAgICAgICBjb25zdCB7IGNvbW1lbnQsIGFmdGVyRW1wdHlMaW5lIH0gPSBwYXJzZVByZWx1ZGUodGhpcy5wcmVsdWRlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh7IGRjOiBkb2MuY29tbWVudCwgcHJlbHVkZSwgY29tbWVudCB9KVxuICAgICAgICBpZiAoY29tbWVudCkge1xuICAgICAgICAgICAgY29uc3QgZGMgPSBkb2MuY29udGVudHM7XG4gICAgICAgICAgICBpZiAoYWZ0ZXJEb2MpIHtcbiAgICAgICAgICAgICAgICBkb2MuY29tbWVudCA9IGRvYy5jb21tZW50ID8gYCR7ZG9jLmNvbW1lbnR9XFxuJHtjb21tZW50fWAgOiBjb21tZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoYWZ0ZXJFbXB0eUxpbmUgfHwgZG9jLmRpcmVjdGl2ZXMuZG9jU3RhcnQgfHwgIWRjKSB7XG4gICAgICAgICAgICAgICAgZG9jLmNvbW1lbnRCZWZvcmUgPSBjb21tZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNDb2xsZWN0aW9uKGRjKSAmJiAhZGMuZmxvdyAmJiBkYy5pdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGl0ID0gZGMuaXRlbXNbMF07XG4gICAgICAgICAgICAgICAgaWYgKGlzUGFpcihpdCkpXG4gICAgICAgICAgICAgICAgICAgIGl0ID0gaXQua2V5O1xuICAgICAgICAgICAgICAgIGNvbnN0IGNiID0gaXQuY29tbWVudEJlZm9yZTtcbiAgICAgICAgICAgICAgICBpdC5jb21tZW50QmVmb3JlID0gY2IgPyBgJHtjb21tZW50fVxcbiR7Y2J9YCA6IGNvbW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYiA9IGRjLmNvbW1lbnRCZWZvcmU7XG4gICAgICAgICAgICAgICAgZGMuY29tbWVudEJlZm9yZSA9IGNiID8gYCR7Y29tbWVudH1cXG4ke2NifWAgOiBjb21tZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChhZnRlckRvYykge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVycm9ycy5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICBkb2MuZXJyb3JzLnB1c2godGhpcy5lcnJvcnNbaV0pO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndhcm5pbmdzLmxlbmd0aDsgKytpKVxuICAgICAgICAgICAgICAgIGRvYy53YXJuaW5ncy5wdXNoKHRoaXMud2FybmluZ3NbaV0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZG9jLmVycm9ycyA9IHRoaXMuZXJyb3JzO1xuICAgICAgICAgICAgZG9jLndhcm5pbmdzID0gdGhpcy53YXJuaW5ncztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZWx1ZGUgPSBbXTtcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICAgICAgdGhpcy53YXJuaW5ncyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDdXJyZW50IHN0cmVhbSBzdGF0dXMgaW5mb3JtYXRpb24uXG4gICAgICpcbiAgICAgKiBNb3N0bHkgdXNlZnVsIGF0IHRoZSBlbmQgb2YgaW5wdXQgZm9yIGFuIGVtcHR5IHN0cmVhbS5cbiAgICAgKi9cbiAgICBzdHJlYW1JbmZvKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgY29tbWVudDogcGFyc2VQcmVsdWRlKHRoaXMucHJlbHVkZSkuY29tbWVudCxcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IHRoaXMuZGlyZWN0aXZlcyxcbiAgICAgICAgICAgIGVycm9yczogdGhpcy5lcnJvcnMsXG4gICAgICAgICAgICB3YXJuaW5nczogdGhpcy53YXJuaW5nc1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wb3NlIHRva2VucyBpbnRvIGRvY3VtZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JjZURvYyAtIElmIHRoZSBzdHJlYW0gY29udGFpbnMgbm8gZG9jdW1lbnQsIHN0aWxsIGVtaXQgYSBmaW5hbCBkb2N1bWVudCBpbmNsdWRpbmcgYW55IGNvbW1lbnRzIGFuZCBkaXJlY3RpdmVzIHRoYXQgd291bGQgYmUgYXBwbGllZCB0byBhIHN1YnNlcXVlbnQgZG9jdW1lbnQuXG4gICAgICogQHBhcmFtIGVuZE9mZnNldCAtIFNob3VsZCBiZSBzZXQgaWYgYGZvcmNlRG9jYCBpcyBhbHNvIHNldCwgdG8gc2V0IHRoZSBkb2N1bWVudCByYW5nZSBlbmQgYW5kIHRvIGluZGljYXRlIGVycm9ycyBjb3JyZWN0bHkuXG4gICAgICovXG4gICAgKmNvbXBvc2UodG9rZW5zLCBmb3JjZURvYyA9IGZhbHNlLCBlbmRPZmZzZXQgPSAtMSkge1xuICAgICAgICBmb3IgKGNvbnN0IHRva2VuIG9mIHRva2VucylcbiAgICAgICAgICAgIHlpZWxkKiB0aGlzLm5leHQodG9rZW4pO1xuICAgICAgICB5aWVsZCogdGhpcy5lbmQoZm9yY2VEb2MsIGVuZE9mZnNldCk7XG4gICAgfVxuICAgIC8qKiBBZHZhbmNlIHRoZSBjb21wb3NlciBieSBvbmUgQ1NUIHRva2VuLiAqL1xuICAgICpuZXh0KHRva2VuKSB7XG4gICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aXZlJzpcbiAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZXMuYWRkKHRva2VuLnNvdXJjZSwgKG9mZnNldCwgbWVzc2FnZSwgd2FybmluZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSBnZXRFcnJvclBvcyh0b2tlbik7XG4gICAgICAgICAgICAgICAgICAgIHBvc1swXSArPSBvZmZzZXQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FcnJvcihwb3MsICdCQURfRElSRUNUSVZFJywgbWVzc2FnZSwgd2FybmluZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmVsdWRlLnB1c2godG9rZW4uc291cmNlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmF0RGlyZWN0aXZlcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdkb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkb2MgPSBjb21wb3NlRG9jKHRoaXMub3B0aW9ucywgdGhpcy5kaXJlY3RpdmVzLCB0b2tlbiwgdGhpcy5vbkVycm9yKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdERpcmVjdGl2ZXMgJiYgIWRvYy5kaXJlY3RpdmVzLmRvY1N0YXJ0KVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3IodG9rZW4sICdNSVNTSU5HX0NIQVInLCAnTWlzc2luZyBkaXJlY3RpdmVzLWVuZC9kb2Mtc3RhcnQgaW5kaWNhdG9yIGxpbmUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY29yYXRlKGRvYywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvYylcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdGhpcy5kb2M7XG4gICAgICAgICAgICAgICAgdGhpcy5kb2MgPSBkb2M7XG4gICAgICAgICAgICAgICAgdGhpcy5hdERpcmVjdGl2ZXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ2J5dGUtb3JkZXItbWFyayc6XG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgIHRoaXMucHJlbHVkZS5wdXNoKHRva2VuLnNvdXJjZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlcnJvcic6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSB0b2tlbi5zb3VyY2VcbiAgICAgICAgICAgICAgICAgICAgPyBgJHt0b2tlbi5tZXNzYWdlfTogJHtKU09OLnN0cmluZ2lmeSh0b2tlbi5zb3VyY2UpfWBcbiAgICAgICAgICAgICAgICAgICAgOiB0b2tlbi5tZXNzYWdlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IFlBTUxQYXJzZUVycm9yKGdldEVycm9yUG9zKHRva2VuKSwgJ1VORVhQRUNURURfVE9LRU4nLCBtc2cpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0RGlyZWN0aXZlcyB8fCAhdGhpcy5kb2MpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb2MuZXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnZG9jLWVuZCc6IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZG9jKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9ICdVbmV4cGVjdGVkIGRvYy1lbmQgd2l0aG91dCBwcmVjZWRpbmcgZG9jdW1lbnQnO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKG5ldyBZQU1MUGFyc2VFcnJvcihnZXRFcnJvclBvcyh0b2tlbiksICdVTkVYUEVDVEVEX1RPS0VOJywgbXNnKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRvYy5kaXJlY3RpdmVzLmRvY0VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc3QgZW5kID0gcmVzb2x2ZUVuZCh0b2tlbi5lbmQsIHRva2VuLm9mZnNldCArIHRva2VuLnNvdXJjZS5sZW5ndGgsIHRoaXMuZG9jLm9wdGlvbnMuc3RyaWN0LCB0aGlzLm9uRXJyb3IpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGVjb3JhdGUodGhpcy5kb2MsIHRydWUpO1xuICAgICAgICAgICAgICAgIGlmIChlbmQuY29tbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYyA9IHRoaXMuZG9jLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG9jLmNvbW1lbnQgPSBkYyA/IGAke2RjfVxcbiR7ZW5kLmNvbW1lbnR9YCA6IGVuZC5jb21tZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRvYy5yYW5nZVsyXSA9IGVuZC5vZmZzZXQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IFlBTUxQYXJzZUVycm9yKGdldEVycm9yUG9zKHRva2VuKSwgJ1VORVhQRUNURURfVE9LRU4nLCBgVW5zdXBwb3J0ZWQgdG9rZW4gJHt0b2tlbi50eXBlfWApKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDYWxsIGF0IGVuZCBvZiBpbnB1dCB0byB5aWVsZCBhbnkgcmVtYWluaW5nIGRvY3VtZW50LlxuICAgICAqXG4gICAgICogQHBhcmFtIGZvcmNlRG9jIC0gSWYgdGhlIHN0cmVhbSBjb250YWlucyBubyBkb2N1bWVudCwgc3RpbGwgZW1pdCBhIGZpbmFsIGRvY3VtZW50IGluY2x1ZGluZyBhbnkgY29tbWVudHMgYW5kIGRpcmVjdGl2ZXMgdGhhdCB3b3VsZCBiZSBhcHBsaWVkIHRvIGEgc3Vic2VxdWVudCBkb2N1bWVudC5cbiAgICAgKiBAcGFyYW0gZW5kT2Zmc2V0IC0gU2hvdWxkIGJlIHNldCBpZiBgZm9yY2VEb2NgIGlzIGFsc28gc2V0LCB0byBzZXQgdGhlIGRvY3VtZW50IHJhbmdlIGVuZCBhbmQgdG8gaW5kaWNhdGUgZXJyb3JzIGNvcnJlY3RseS5cbiAgICAgKi9cbiAgICAqZW5kKGZvcmNlRG9jID0gZmFsc2UsIGVuZE9mZnNldCA9IC0xKSB7XG4gICAgICAgIGlmICh0aGlzLmRvYykge1xuICAgICAgICAgICAgdGhpcy5kZWNvcmF0ZSh0aGlzLmRvYywgdHJ1ZSk7XG4gICAgICAgICAgICB5aWVsZCB0aGlzLmRvYztcbiAgICAgICAgICAgIHRoaXMuZG9jID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmb3JjZURvYykge1xuICAgICAgICAgICAgY29uc3Qgb3B0cyA9IE9iamVjdC5hc3NpZ24oeyBfZGlyZWN0aXZlczogdGhpcy5kaXJlY3RpdmVzIH0sIHRoaXMub3B0aW9ucyk7XG4gICAgICAgICAgICBjb25zdCBkb2MgPSBuZXcgRG9jdW1lbnQodW5kZWZpbmVkLCBvcHRzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmF0RGlyZWN0aXZlcylcbiAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3IoZW5kT2Zmc2V0LCAnTUlTU0lOR19DSEFSJywgJ01pc3NpbmcgZGlyZWN0aXZlcy1lbmQgaW5kaWNhdG9yIGxpbmUnKTtcbiAgICAgICAgICAgIGRvYy5yYW5nZSA9IFswLCBlbmRPZmZzZXQsIGVuZE9mZnNldF07XG4gICAgICAgICAgICB0aGlzLmRlY29yYXRlKGRvYywgZmFsc2UpO1xuICAgICAgICAgICAgeWllbGQgZG9jO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBDb21wb3NlciB9O1xuIiwgImNvbnN0IEJSRUFLID0gU3ltYm9sKCdicmVhayB2aXNpdCcpO1xuY29uc3QgU0tJUCA9IFN5bWJvbCgnc2tpcCBjaGlsZHJlbicpO1xuY29uc3QgUkVNT1ZFID0gU3ltYm9sKCdyZW1vdmUgaXRlbScpO1xuLyoqXG4gKiBBcHBseSBhIHZpc2l0b3IgdG8gYSBDU1QgZG9jdW1lbnQgb3IgaXRlbS5cbiAqXG4gKiBXYWxrcyB0aHJvdWdoIHRoZSB0cmVlIChkZXB0aC1maXJzdCkgc3RhcnRpbmcgZnJvbSB0aGUgcm9vdCwgY2FsbGluZyBhXG4gKiBgdmlzaXRvcmAgZnVuY3Rpb24gd2l0aCB0d28gYXJndW1lbnRzIHdoZW4gZW50ZXJpbmcgZWFjaCBpdGVtOlxuICogICAtIGBpdGVtYDogVGhlIGN1cnJlbnQgaXRlbSwgd2hpY2ggaW5jbHVkZWQgdGhlIGZvbGxvd2luZyBtZW1iZXJzOlxuICogICAgIC0gYHN0YXJ0OiBTb3VyY2VUb2tlbltdYCBcdTIwMTMgU291cmNlIHRva2VucyBiZWZvcmUgdGhlIGtleSBvciB2YWx1ZSxcbiAqICAgICAgIHBvc3NpYmx5IGluY2x1ZGluZyBpdHMgYW5jaG9yIG9yIHRhZy5cbiAqICAgICAtIGBrZXk/OiBUb2tlbiB8IG51bGxgIFx1MjAxMyBTZXQgZm9yIHBhaXIgdmFsdWVzLiBNYXkgdGhlbiBiZSBgbnVsbGAsIGlmXG4gKiAgICAgICB0aGUga2V5IGJlZm9yZSB0aGUgYDpgIHNlcGFyYXRvciBpcyBlbXB0eS5cbiAqICAgICAtIGBzZXA/OiBTb3VyY2VUb2tlbltdYCBcdTIwMTMgU291cmNlIHRva2VucyBiZXR3ZWVuIHRoZSBrZXkgYW5kIHRoZSB2YWx1ZSxcbiAqICAgICAgIHdoaWNoIHNob3VsZCBpbmNsdWRlIHRoZSBgOmAgbWFwIHZhbHVlIGluZGljYXRvciBpZiBgdmFsdWVgIGlzIHNldC5cbiAqICAgICAtIGB2YWx1ZT86IFRva2VuYCBcdTIwMTMgVGhlIHZhbHVlIG9mIGEgc2VxdWVuY2UgaXRlbSwgb3Igb2YgYSBtYXAgcGFpci5cbiAqICAgLSBgcGF0aGA6IFRoZSBzdGVwcyBmcm9tIHRoZSByb290IHRvIHRoZSBjdXJyZW50IG5vZGUsIGFzIGFuIGFycmF5IG9mXG4gKiAgICAgYFsna2V5JyB8ICd2YWx1ZScsIG51bWJlcl1gIHR1cGxlcy5cbiAqXG4gKiBUaGUgcmV0dXJuIHZhbHVlIG9mIHRoZSB2aXNpdG9yIG1heSBiZSB1c2VkIHRvIGNvbnRyb2wgdGhlIHRyYXZlcnNhbDpcbiAqICAgLSBgdW5kZWZpbmVkYCAoZGVmYXVsdCk6IERvIG5vdGhpbmcgYW5kIGNvbnRpbnVlXG4gKiAgIC0gYHZpc2l0LlNLSVBgOiBEbyBub3QgdmlzaXQgdGhlIGNoaWxkcmVuIG9mIHRoaXMgdG9rZW4sIGNvbnRpbnVlIHdpdGhcbiAqICAgICAgbmV4dCBzaWJsaW5nXG4gKiAgIC0gYHZpc2l0LkJSRUFLYDogVGVybWluYXRlIHRyYXZlcnNhbCBjb21wbGV0ZWx5XG4gKiAgIC0gYHZpc2l0LlJFTU9WRWA6IFJlbW92ZSB0aGUgY3VycmVudCBpdGVtLCB0aGVuIGNvbnRpbnVlIHdpdGggdGhlIG5leHQgb25lXG4gKiAgIC0gYG51bWJlcmA6IFNldCB0aGUgaW5kZXggb2YgdGhlIG5leHQgc3RlcC4gVGhpcyBpcyB1c2VmdWwgZXNwZWNpYWxseSBpZlxuICogICAgIHRoZSBpbmRleCBvZiB0aGUgY3VycmVudCB0b2tlbiBoYXMgY2hhbmdlZC5cbiAqICAgLSBgZnVuY3Rpb25gOiBEZWZpbmUgdGhlIG5leHQgdmlzaXRvciBmb3IgdGhpcyBpdGVtLiBBZnRlciB0aGUgb3JpZ2luYWxcbiAqICAgICB2aXNpdG9yIGlzIGNhbGxlZCBvbiBpdGVtIGVudHJ5LCBuZXh0IHZpc2l0b3JzIGFyZSBjYWxsZWQgYWZ0ZXIgaGFuZGxpbmdcbiAqICAgICBhIG5vbi1lbXB0eSBga2V5YCBhbmQgd2hlbiBleGl0aW5nIHRoZSBpdGVtLlxuICovXG5mdW5jdGlvbiB2aXNpdChjc3QsIHZpc2l0b3IpIHtcbiAgICBpZiAoJ3R5cGUnIGluIGNzdCAmJiBjc3QudHlwZSA9PT0gJ2RvY3VtZW50JylcbiAgICAgICAgY3N0ID0geyBzdGFydDogY3N0LnN0YXJ0LCB2YWx1ZTogY3N0LnZhbHVlIH07XG4gICAgX3Zpc2l0KE9iamVjdC5mcmVlemUoW10pLCBjc3QsIHZpc2l0b3IpO1xufVxuLy8gV2l0aG91dCB0aGUgYGFzIHN5bWJvbGAgY2FzdHMsIFRTIGRlY2xhcmVzIHRoZXNlIGluIHRoZSBgdmlzaXRgXG4vLyBuYW1lc3BhY2UgdXNpbmcgYHZhcmAsIGJ1dCB0aGVuIGNvbXBsYWlucyBhYm91dCB0aGF0IGJlY2F1c2Vcbi8vIGB1bmlxdWUgc3ltYm9sYCBtdXN0IGJlIGBjb25zdGAuXG4vKiogVGVybWluYXRlIHZpc2l0IHRyYXZlcnNhbCBjb21wbGV0ZWx5ICovXG52aXNpdC5CUkVBSyA9IEJSRUFLO1xuLyoqIERvIG5vdCB2aXNpdCB0aGUgY2hpbGRyZW4gb2YgdGhlIGN1cnJlbnQgaXRlbSAqL1xudmlzaXQuU0tJUCA9IFNLSVA7XG4vKiogUmVtb3ZlIHRoZSBjdXJyZW50IGl0ZW0gKi9cbnZpc2l0LlJFTU9WRSA9IFJFTU9WRTtcbi8qKiBGaW5kIHRoZSBpdGVtIGF0IGBwYXRoYCBmcm9tIGBjc3RgIGFzIHRoZSByb290ICovXG52aXNpdC5pdGVtQXRQYXRoID0gKGNzdCwgcGF0aCkgPT4ge1xuICAgIGxldCBpdGVtID0gY3N0O1xuICAgIGZvciAoY29uc3QgW2ZpZWxkLCBpbmRleF0gb2YgcGF0aCkge1xuICAgICAgICBjb25zdCB0b2sgPSBpdGVtPy5bZmllbGRdO1xuICAgICAgICBpZiAodG9rICYmICdpdGVtcycgaW4gdG9rKSB7XG4gICAgICAgICAgICBpdGVtID0gdG9rLml0ZW1zW2luZGV4XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gaXRlbTtcbn07XG4vKipcbiAqIEdldCB0aGUgaW1tZWRpYXRlIHBhcmVudCBjb2xsZWN0aW9uIG9mIHRoZSBpdGVtIGF0IGBwYXRoYCBmcm9tIGBjc3RgIGFzIHRoZSByb290LlxuICpcbiAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgY29sbGVjdGlvbiBpcyBub3QgZm91bmQsIHdoaWNoIHNob3VsZCBuZXZlciBoYXBwZW4gaWYgdGhlIGl0ZW0gaXRzZWxmIGV4aXN0cy5cbiAqL1xudmlzaXQucGFyZW50Q29sbGVjdGlvbiA9IChjc3QsIHBhdGgpID0+IHtcbiAgICBjb25zdCBwYXJlbnQgPSB2aXNpdC5pdGVtQXRQYXRoKGNzdCwgcGF0aC5zbGljZSgwLCAtMSkpO1xuICAgIGNvbnN0IGZpZWxkID0gcGF0aFtwYXRoLmxlbmd0aCAtIDFdWzBdO1xuICAgIGNvbnN0IGNvbGwgPSBwYXJlbnQ/LltmaWVsZF07XG4gICAgaWYgKGNvbGwgJiYgJ2l0ZW1zJyBpbiBjb2xsKVxuICAgICAgICByZXR1cm4gY29sbDtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmVudCBjb2xsZWN0aW9uIG5vdCBmb3VuZCcpO1xufTtcbmZ1bmN0aW9uIF92aXNpdChwYXRoLCBpdGVtLCB2aXNpdG9yKSB7XG4gICAgbGV0IGN0cmwgPSB2aXNpdG9yKGl0ZW0sIHBhdGgpO1xuICAgIGlmICh0eXBlb2YgY3RybCA9PT0gJ3N5bWJvbCcpXG4gICAgICAgIHJldHVybiBjdHJsO1xuICAgIGZvciAoY29uc3QgZmllbGQgb2YgWydrZXknLCAndmFsdWUnXSkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IGl0ZW1bZmllbGRdO1xuICAgICAgICBpZiAodG9rZW4gJiYgJ2l0ZW1zJyBpbiB0b2tlbikge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbi5pdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNpID0gX3Zpc2l0KE9iamVjdC5mcmVlemUocGF0aC5jb25jYXQoW1tmaWVsZCwgaV1dKSksIHRva2VuLml0ZW1zW2ldLCB2aXNpdG9yKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNpID09PSAnbnVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgaSA9IGNpIC0gMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaSA9PT0gQlJFQUspXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCUkVBSztcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaSA9PT0gUkVNT1ZFKSB7XG4gICAgICAgICAgICAgICAgICAgIHRva2VuLml0ZW1zLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgaSAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3RybCA9PT0gJ2Z1bmN0aW9uJyAmJiBmaWVsZCA9PT0gJ2tleScpXG4gICAgICAgICAgICAgICAgY3RybCA9IGN0cmwoaXRlbSwgcGF0aCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiBjdHJsID09PSAnZnVuY3Rpb24nID8gY3RybChpdGVtLCBwYXRoKSA6IGN0cmw7XG59XG5cbmV4cG9ydCB7IHZpc2l0IH07XG4iLCAiZXhwb3J0IHsgY3JlYXRlU2NhbGFyVG9rZW4sIHJlc29sdmVBc1NjYWxhciwgc2V0U2NhbGFyVmFsdWUgfSBmcm9tICcuL2NzdC1zY2FsYXIuanMnO1xuZXhwb3J0IHsgc3RyaW5naWZ5IH0gZnJvbSAnLi9jc3Qtc3RyaW5naWZ5LmpzJztcbmV4cG9ydCB7IHZpc2l0IH0gZnJvbSAnLi9jc3QtdmlzaXQuanMnO1xuXG4vKiogVGhlIGJ5dGUgb3JkZXIgbWFyayAqL1xuY29uc3QgQk9NID0gJ1xcdXtGRUZGfSc7XG4vKiogU3RhcnQgb2YgZG9jLW1vZGUgKi9cbmNvbnN0IERPQ1VNRU5UID0gJ1xceDAyJzsgLy8gQzA6IFN0YXJ0IG9mIFRleHRcbi8qKiBVbmV4cGVjdGVkIGVuZCBvZiBmbG93LW1vZGUgKi9cbmNvbnN0IEZMT1dfRU5EID0gJ1xceDE4JzsgLy8gQzA6IENhbmNlbFxuLyoqIE5leHQgdG9rZW4gaXMgYSBzY2FsYXIgdmFsdWUgKi9cbmNvbnN0IFNDQUxBUiA9ICdcXHgxZic7IC8vIEMwOiBVbml0IFNlcGFyYXRvclxuLyoqIEByZXR1cm5zIGB0cnVlYCBpZiBgdG9rZW5gIGlzIGEgZmxvdyBvciBibG9jayBjb2xsZWN0aW9uICovXG5jb25zdCBpc0NvbGxlY3Rpb24gPSAodG9rZW4pID0+ICEhdG9rZW4gJiYgJ2l0ZW1zJyBpbiB0b2tlbjtcbi8qKiBAcmV0dXJucyBgdHJ1ZWAgaWYgYHRva2VuYCBpcyBhIGZsb3cgb3IgYmxvY2sgc2NhbGFyOyBub3QgYW4gYWxpYXMgKi9cbmNvbnN0IGlzU2NhbGFyID0gKHRva2VuKSA9PiAhIXRva2VuICYmXG4gICAgKHRva2VuLnR5cGUgPT09ICdzY2FsYXInIHx8XG4gICAgICAgIHRva2VuLnR5cGUgPT09ICdzaW5nbGUtcXVvdGVkLXNjYWxhcicgfHxcbiAgICAgICAgdG9rZW4udHlwZSA9PT0gJ2RvdWJsZS1xdW90ZWQtc2NhbGFyJyB8fFxuICAgICAgICB0b2tlbi50eXBlID09PSAnYmxvY2stc2NhbGFyJyk7XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuLyoqIEdldCBhIHByaW50YWJsZSByZXByZXNlbnRhdGlvbiBvZiBhIGxleGVyIHRva2VuICovXG5mdW5jdGlvbiBwcmV0dHlUb2tlbih0b2tlbikge1xuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgICAgY2FzZSBCT006XG4gICAgICAgICAgICByZXR1cm4gJzxCT00+JztcbiAgICAgICAgY2FzZSBET0NVTUVOVDpcbiAgICAgICAgICAgIHJldHVybiAnPERPQz4nO1xuICAgICAgICBjYXNlIEZMT1dfRU5EOlxuICAgICAgICAgICAgcmV0dXJuICc8RkxPV19FTkQ+JztcbiAgICAgICAgY2FzZSBTQ0FMQVI6XG4gICAgICAgICAgICByZXR1cm4gJzxTQ0FMQVI+JztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0b2tlbik7XG4gICAgfVxufVxuLyoqIElkZW50aWZ5IHRoZSB0eXBlIG9mIGEgbGV4ZXIgdG9rZW4uIE1heSByZXR1cm4gYG51bGxgIGZvciB1bmtub3duIHRva2Vucy4gKi9cbmZ1bmN0aW9uIHRva2VuVHlwZShzb3VyY2UpIHtcbiAgICBzd2l0Y2ggKHNvdXJjZSkge1xuICAgICAgICBjYXNlIEJPTTpcbiAgICAgICAgICAgIHJldHVybiAnYnl0ZS1vcmRlci1tYXJrJztcbiAgICAgICAgY2FzZSBET0NVTUVOVDpcbiAgICAgICAgICAgIHJldHVybiAnZG9jLW1vZGUnO1xuICAgICAgICBjYXNlIEZMT1dfRU5EOlxuICAgICAgICAgICAgcmV0dXJuICdmbG93LWVycm9yLWVuZCc7XG4gICAgICAgIGNhc2UgU0NBTEFSOlxuICAgICAgICAgICAgcmV0dXJuICdzY2FsYXInO1xuICAgICAgICBjYXNlICctLS0nOlxuICAgICAgICAgICAgcmV0dXJuICdkb2Mtc3RhcnQnO1xuICAgICAgICBjYXNlICcuLi4nOlxuICAgICAgICAgICAgcmV0dXJuICdkb2MtZW5kJztcbiAgICAgICAgY2FzZSAnJzpcbiAgICAgICAgY2FzZSAnXFxuJzpcbiAgICAgICAgY2FzZSAnXFxyXFxuJzpcbiAgICAgICAgICAgIHJldHVybiAnbmV3bGluZSc7XG4gICAgICAgIGNhc2UgJy0nOlxuICAgICAgICAgICAgcmV0dXJuICdzZXEtaXRlbS1pbmQnO1xuICAgICAgICBjYXNlICc/JzpcbiAgICAgICAgICAgIHJldHVybiAnZXhwbGljaXQta2V5LWluZCc7XG4gICAgICAgIGNhc2UgJzonOlxuICAgICAgICAgICAgcmV0dXJuICdtYXAtdmFsdWUtaW5kJztcbiAgICAgICAgY2FzZSAneyc6XG4gICAgICAgICAgICByZXR1cm4gJ2Zsb3ctbWFwLXN0YXJ0JztcbiAgICAgICAgY2FzZSAnfSc6XG4gICAgICAgICAgICByZXR1cm4gJ2Zsb3ctbWFwLWVuZCc7XG4gICAgICAgIGNhc2UgJ1snOlxuICAgICAgICAgICAgcmV0dXJuICdmbG93LXNlcS1zdGFydCc7XG4gICAgICAgIGNhc2UgJ10nOlxuICAgICAgICAgICAgcmV0dXJuICdmbG93LXNlcS1lbmQnO1xuICAgICAgICBjYXNlICcsJzpcbiAgICAgICAgICAgIHJldHVybiAnY29tbWEnO1xuICAgIH1cbiAgICBzd2l0Y2ggKHNvdXJjZVswXSkge1xuICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgY2FzZSAnXFx0JzpcbiAgICAgICAgICAgIHJldHVybiAnc3BhY2UnO1xuICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgICAgIHJldHVybiAnY29tbWVudCc7XG4gICAgICAgIGNhc2UgJyUnOlxuICAgICAgICAgICAgcmV0dXJuICdkaXJlY3RpdmUtbGluZSc7XG4gICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgcmV0dXJuICdhbGlhcyc7XG4gICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgcmV0dXJuICdhbmNob3InO1xuICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICAgIHJldHVybiAndGFnJztcbiAgICAgICAgY2FzZSBcIidcIjpcbiAgICAgICAgICAgIHJldHVybiAnc2luZ2xlLXF1b3RlZC1zY2FsYXInO1xuICAgICAgICBjYXNlICdcIic6XG4gICAgICAgICAgICByZXR1cm4gJ2RvdWJsZS1xdW90ZWQtc2NhbGFyJztcbiAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgIGNhc2UgJz4nOlxuICAgICAgICAgICAgcmV0dXJuICdibG9jay1zY2FsYXItaGVhZGVyJztcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCB7IEJPTSwgRE9DVU1FTlQsIEZMT1dfRU5ELCBTQ0FMQVIsIGlzQ29sbGVjdGlvbiwgaXNTY2FsYXIsIHByZXR0eVRva2VuLCB0b2tlblR5cGUgfTtcbiIsICJpbXBvcnQgeyBCT00sIERPQ1VNRU5ULCBGTE9XX0VORCwgU0NBTEFSIH0gZnJvbSAnLi9jc3QuanMnO1xuXG4vKlxuU1RBUlQgLT4gc3RyZWFtXG5cbnN0cmVhbVxuICBkaXJlY3RpdmUgLT4gbGluZS1lbmQgLT4gc3RyZWFtXG4gIGluZGVudCArIGxpbmUtZW5kIC0+IHN0cmVhbVxuICBbZWxzZV0gLT4gbGluZS1zdGFydFxuXG5saW5lLWVuZFxuICBjb21tZW50IC0+IGxpbmUtZW5kXG4gIG5ld2xpbmUgLT4gLlxuICBpbnB1dC1lbmQgLT4gRU5EXG5cbmxpbmUtc3RhcnRcbiAgZG9jLXN0YXJ0IC0+IGRvY1xuICBkb2MtZW5kIC0+IHN0cmVhbVxuICBbZWxzZV0gLT4gaW5kZW50IC0+IGJsb2NrLXN0YXJ0XG5cbmJsb2NrLXN0YXJ0XG4gIHNlcS1pdGVtLXN0YXJ0IC0+IGJsb2NrLXN0YXJ0XG4gIGV4cGxpY2l0LWtleS1zdGFydCAtPiBibG9jay1zdGFydFxuICBtYXAtdmFsdWUtc3RhcnQgLT4gYmxvY2stc3RhcnRcbiAgW2Vsc2VdIC0+IGRvY1xuXG5kb2NcbiAgbGluZS1lbmQgLT4gbGluZS1zdGFydFxuICBzcGFjZXMgLT4gZG9jXG4gIGFuY2hvciAtPiBkb2NcbiAgdGFnIC0+IGRvY1xuICBmbG93LXN0YXJ0IC0+IGZsb3cgLT4gZG9jXG4gIGZsb3ctZW5kIC0+IGVycm9yIC0+IGRvY1xuICBzZXEtaXRlbS1zdGFydCAtPiBlcnJvciAtPiBkb2NcbiAgZXhwbGljaXQta2V5LXN0YXJ0IC0+IGVycm9yIC0+IGRvY1xuICBtYXAtdmFsdWUtc3RhcnQgLT4gZG9jXG4gIGFsaWFzIC0+IGRvY1xuICBxdW90ZS1zdGFydCAtPiBxdW90ZWQtc2NhbGFyIC0+IGRvY1xuICBibG9jay1zY2FsYXItaGVhZGVyIC0+IGxpbmUtZW5kIC0+IGJsb2NrLXNjYWxhcihtaW4pIC0+IGxpbmUtc3RhcnRcbiAgW2Vsc2VdIC0+IHBsYWluLXNjYWxhcihmYWxzZSwgbWluKSAtPiBkb2NcblxuZmxvd1xuICBsaW5lLWVuZCAtPiBmbG93XG4gIHNwYWNlcyAtPiBmbG93XG4gIGFuY2hvciAtPiBmbG93XG4gIHRhZyAtPiBmbG93XG4gIGZsb3ctc3RhcnQgLT4gZmxvdyAtPiBmbG93XG4gIGZsb3ctZW5kIC0+IC5cbiAgc2VxLWl0ZW0tc3RhcnQgLT4gZXJyb3IgLT4gZmxvd1xuICBleHBsaWNpdC1rZXktc3RhcnQgLT4gZmxvd1xuICBtYXAtdmFsdWUtc3RhcnQgLT4gZmxvd1xuICBhbGlhcyAtPiBmbG93XG4gIHF1b3RlLXN0YXJ0IC0+IHF1b3RlZC1zY2FsYXIgLT4gZmxvd1xuICBjb21tYSAtPiBmbG93XG4gIFtlbHNlXSAtPiBwbGFpbi1zY2FsYXIodHJ1ZSwgMCkgLT4gZmxvd1xuXG5xdW90ZWQtc2NhbGFyXG4gIHF1b3RlLWVuZCAtPiAuXG4gIFtlbHNlXSAtPiBxdW90ZWQtc2NhbGFyXG5cbmJsb2NrLXNjYWxhcihtaW4pXG4gIG5ld2xpbmUgKyBwZWVrKGluZGVudCA8IG1pbikgLT4gLlxuICBbZWxzZV0gLT4gYmxvY2stc2NhbGFyKG1pbilcblxucGxhaW4tc2NhbGFyKGlzLWZsb3csIG1pbilcbiAgc2NhbGFyLWVuZChpcy1mbG93KSAtPiAuXG4gIHBlZWsobmV3bGluZSArIChpbmRlbnQgPCBtaW4pKSAtPiAuXG4gIFtlbHNlXSAtPiBwbGFpbi1zY2FsYXIobWluKVxuKi9cbmZ1bmN0aW9uIGlzRW1wdHkoY2gpIHtcbiAgICBzd2l0Y2ggKGNoKSB7XG4gICAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgY2FzZSAnXFxuJzpcbiAgICAgICAgY2FzZSAnXFxyJzpcbiAgICAgICAgY2FzZSAnXFx0JzpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmNvbnN0IGhleERpZ2l0cyA9IG5ldyBTZXQoJzAxMjM0NTY3ODlBQkNERUZhYmNkZWYnKTtcbmNvbnN0IHRhZ0NoYXJzID0gbmV3IFNldChcIjAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6LSM7Lz86QCY9KyRfLiF+KicoKVwiKTtcbmNvbnN0IGZsb3dJbmRpY2F0b3JDaGFycyA9IG5ldyBTZXQoJyxbXXt9Jyk7XG5jb25zdCBpbnZhbGlkQW5jaG9yQ2hhcnMgPSBuZXcgU2V0KCcgLFtde31cXG5cXHJcXHQnKTtcbmNvbnN0IGlzTm90QW5jaG9yQ2hhciA9IChjaCkgPT4gIWNoIHx8IGludmFsaWRBbmNob3JDaGFycy5oYXMoY2gpO1xuLyoqXG4gKiBTcGxpdHMgYW4gaW5wdXQgc3RyaW5nIGludG8gbGV4aWNhbCB0b2tlbnMsIGkuZS4gc21hbGxlciBzdHJpbmdzIHRoYXQgYXJlXG4gKiBlYXNpbHkgaWRlbnRpZmlhYmxlIGJ5IGB0b2tlbnMudG9rZW5UeXBlKClgLlxuICpcbiAqIExleGluZyBzdGFydHMgYWx3YXlzIGluIGEgXCJzdHJlYW1cIiBjb250ZXh0LiBJbmNvbXBsZXRlIGlucHV0IG1heSBiZSBidWZmZXJlZFxuICogdW50aWwgYSBjb21wbGV0ZSB0b2tlbiBjYW4gYmUgZW1pdHRlZC5cbiAqXG4gKiBJbiBhZGRpdGlvbiB0byBzbGljZXMgb2YgdGhlIG9yaWdpbmFsIGlucHV0LCB0aGUgZm9sbG93aW5nIGNvbnRyb2wgY2hhcmFjdGVyc1xuICogbWF5IGFsc28gYmUgZW1pdHRlZDpcbiAqXG4gKiAtIGBcXHgwMmAgKFN0YXJ0IG9mIFRleHQpOiBBIGRvY3VtZW50IHN0YXJ0cyB3aXRoIHRoZSBuZXh0IHRva2VuXG4gKiAtIGBcXHgxOGAgKENhbmNlbCk6IFVuZXhwZWN0ZWQgZW5kIG9mIGZsb3ctbW9kZSAoaW5kaWNhdGVzIGFuIGVycm9yKVxuICogLSBgXFx4MWZgIChVbml0IFNlcGFyYXRvcik6IE5leHQgdG9rZW4gaXMgYSBzY2FsYXIgdmFsdWVcbiAqIC0gYFxcdXtGRUZGfWAgKEJ5dGUgb3JkZXIgbWFyayk6IEVtaXR0ZWQgc2VwYXJhdGVseSBvdXRzaWRlIGRvY3VtZW50c1xuICovXG5jbGFzcyBMZXhlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBGbGFnIGluZGljYXRpbmcgd2hldGhlciB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IGJ1ZmZlciBtYXJrcyB0aGUgZW5kIG9mXG4gICAgICAgICAqIGFsbCBpbnB1dFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5hdEVuZCA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogRXhwbGljaXQgaW5kZW50IHNldCBpbiBibG9jayBzY2FsYXIgaGVhZGVyLCBhcyBhbiBvZmZzZXQgZnJvbSB0aGUgY3VycmVudFxuICAgICAgICAgKiBtaW5pbXVtIGluZGVudCwgc28gZS5nLiBzZXQgdG8gMSBmcm9tIGEgaGVhZGVyIGB8MitgLiBTZXQgdG8gLTEgaWYgbm90XG4gICAgICAgICAqIGV4cGxpY2l0bHkgc2V0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ibG9ja1NjYWxhckluZGVudCA9IC0xO1xuICAgICAgICAvKipcbiAgICAgICAgICogQmxvY2sgc2NhbGFycyB0aGF0IGluY2x1ZGUgYSArIChrZWVwKSBjaG9tcGluZyBpbmRpY2F0b3IgaW4gdGhlaXIgaGVhZGVyXG4gICAgICAgICAqIGluY2x1ZGUgdHJhaWxpbmcgZW1wdHkgbGluZXMsIHdoaWNoIGFyZSBvdGhlcndpc2UgZXhjbHVkZWQgZnJvbSB0aGVcbiAgICAgICAgICogc2NhbGFyJ3MgY29udGVudHMuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmJsb2NrU2NhbGFyS2VlcCA9IGZhbHNlO1xuICAgICAgICAvKiogQ3VycmVudCBpbnB1dCAqL1xuICAgICAgICB0aGlzLmJ1ZmZlciA9ICcnO1xuICAgICAgICAvKipcbiAgICAgICAgICogRmxhZyBub3Rpbmcgd2hldGhlciB0aGUgbWFwIHZhbHVlIGluZGljYXRvciA6IGNhbiBpbW1lZGlhdGVseSBmb2xsb3cgdGhpc1xuICAgICAgICAgKiBub2RlIHdpdGhpbiBhIGZsb3cgY29udGV4dC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZmxvd0tleSA9IGZhbHNlO1xuICAgICAgICAvKiogQ291bnQgb2Ygc3Vycm91bmRpbmcgZmxvdyBjb2xsZWN0aW9uIGxldmVscy4gKi9cbiAgICAgICAgdGhpcy5mbG93TGV2ZWwgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogTWluaW11bSBsZXZlbCBvZiBpbmRlbnRhdGlvbiByZXF1aXJlZCBmb3IgbmV4dCBsaW5lcyB0byBiZSBwYXJzZWQgYXMgYVxuICAgICAgICAgKiBwYXJ0IG9mIHRoZSBjdXJyZW50IHNjYWxhciB2YWx1ZS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuaW5kZW50TmV4dCA9IDA7XG4gICAgICAgIC8qKiBJbmRlbnRhdGlvbiBsZXZlbCBvZiB0aGUgY3VycmVudCBsaW5lLiAqL1xuICAgICAgICB0aGlzLmluZGVudFZhbHVlID0gMDtcbiAgICAgICAgLyoqIFBvc2l0aW9uIG9mIHRoZSBuZXh0IFxcbiBjaGFyYWN0ZXIuICovXG4gICAgICAgIHRoaXMubGluZUVuZFBvcyA9IG51bGw7XG4gICAgICAgIC8qKiBTdG9yZXMgdGhlIHN0YXRlIG9mIHRoZSBsZXhlciBpZiByZWFjaGluZyB0aGUgZW5kIG9mIGluY3BvbXBsZXRlIGlucHV0ICovXG4gICAgICAgIHRoaXMubmV4dCA9IG51bGw7XG4gICAgICAgIC8qKiBBIHBvaW50ZXIgdG8gYGJ1ZmZlcmA7IHRoZSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBsZXhlci4gKi9cbiAgICAgICAgdGhpcy5wb3MgPSAwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZW5lcmF0ZSBZQU1MIHRva2VucyBmcm9tIHRoZSBgc291cmNlYCBzdHJpbmcuIElmIGBpbmNvbXBsZXRlYCxcbiAgICAgKiBhIHBhcnQgb2YgdGhlIGxhc3QgbGluZSBtYXkgYmUgbGVmdCBhcyBhIGJ1ZmZlciBmb3IgdGhlIG5leHQgY2FsbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEEgZ2VuZXJhdG9yIG9mIGxleGljYWwgdG9rZW5zXG4gICAgICovXG4gICAgKmxleChzb3VyY2UsIGluY29tcGxldGUgPSBmYWxzZSkge1xuICAgICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ3N0cmluZycpXG4gICAgICAgICAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdzb3VyY2UgaXMgbm90IGEgc3RyaW5nJyk7XG4gICAgICAgICAgICB0aGlzLmJ1ZmZlciA9IHRoaXMuYnVmZmVyID8gdGhpcy5idWZmZXIgKyBzb3VyY2UgOiBzb3VyY2U7XG4gICAgICAgICAgICB0aGlzLmxpbmVFbmRQb3MgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYXRFbmQgPSAhaW5jb21wbGV0ZTtcbiAgICAgICAgbGV0IG5leHQgPSB0aGlzLm5leHQgPz8gJ3N0cmVhbSc7XG4gICAgICAgIHdoaWxlIChuZXh0ICYmIChpbmNvbXBsZXRlIHx8IHRoaXMuaGFzQ2hhcnMoMSkpKVxuICAgICAgICAgICAgbmV4dCA9IHlpZWxkKiB0aGlzLnBhcnNlTmV4dChuZXh0KTtcbiAgICB9XG4gICAgYXRMaW5lRW5kKCkge1xuICAgICAgICBsZXQgaSA9IHRoaXMucG9zO1xuICAgICAgICBsZXQgY2ggPSB0aGlzLmJ1ZmZlcltpXTtcbiAgICAgICAgd2hpbGUgKGNoID09PSAnICcgfHwgY2ggPT09ICdcXHQnKVxuICAgICAgICAgICAgY2ggPSB0aGlzLmJ1ZmZlclsrK2ldO1xuICAgICAgICBpZiAoIWNoIHx8IGNoID09PSAnIycgfHwgY2ggPT09ICdcXG4nKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGlmIChjaCA9PT0gJ1xccicpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5idWZmZXJbaSArIDFdID09PSAnXFxuJztcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjaGFyQXQobikge1xuICAgICAgICByZXR1cm4gdGhpcy5idWZmZXJbdGhpcy5wb3MgKyBuXTtcbiAgICB9XG4gICAgY29udGludWVTY2FsYXIob2Zmc2V0KSB7XG4gICAgICAgIGxldCBjaCA9IHRoaXMuYnVmZmVyW29mZnNldF07XG4gICAgICAgIGlmICh0aGlzLmluZGVudE5leHQgPiAwKSB7XG4gICAgICAgICAgICBsZXQgaW5kZW50ID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChjaCA9PT0gJyAnKVxuICAgICAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbKytpbmRlbnQgKyBvZmZzZXRdO1xuICAgICAgICAgICAgaWYgKGNoID09PSAnXFxyJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB0aGlzLmJ1ZmZlcltpbmRlbnQgKyBvZmZzZXQgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dCA9PT0gJ1xcbicgfHwgKCFuZXh0ICYmICF0aGlzLmF0RW5kKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldCArIGluZGVudCArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2ggPT09ICdcXG4nIHx8IGluZGVudCA+PSB0aGlzLmluZGVudE5leHQgfHwgKCFjaCAmJiAhdGhpcy5hdEVuZClcbiAgICAgICAgICAgICAgICA/IG9mZnNldCArIGluZGVudFxuICAgICAgICAgICAgICAgIDogLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoID09PSAnLScgfHwgY2ggPT09ICcuJykge1xuICAgICAgICAgICAgY29uc3QgZHQgPSB0aGlzLmJ1ZmZlci5zdWJzdHIob2Zmc2V0LCAzKTtcbiAgICAgICAgICAgIGlmICgoZHQgPT09ICctLS0nIHx8IGR0ID09PSAnLi4uJykgJiYgaXNFbXB0eSh0aGlzLmJ1ZmZlcltvZmZzZXQgKyAzXSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvZmZzZXQ7XG4gICAgfVxuICAgIGdldExpbmUoKSB7XG4gICAgICAgIGxldCBlbmQgPSB0aGlzLmxpbmVFbmRQb3M7XG4gICAgICAgIGlmICh0eXBlb2YgZW5kICE9PSAnbnVtYmVyJyB8fCAoZW5kICE9PSAtMSAmJiBlbmQgPCB0aGlzLnBvcykpIHtcbiAgICAgICAgICAgIGVuZCA9IHRoaXMuYnVmZmVyLmluZGV4T2YoJ1xcbicsIHRoaXMucG9zKTtcbiAgICAgICAgICAgIHRoaXMubGluZUVuZFBvcyA9IGVuZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW5kID09PSAtMSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmF0RW5kID8gdGhpcy5idWZmZXIuc3Vic3RyaW5nKHRoaXMucG9zKSA6IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmJ1ZmZlcltlbmQgLSAxXSA9PT0gJ1xccicpXG4gICAgICAgICAgICBlbmQgLT0gMTtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyLnN1YnN0cmluZyh0aGlzLnBvcywgZW5kKTtcbiAgICB9XG4gICAgaGFzQ2hhcnMobikge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3MgKyBuIDw9IHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgICB9XG4gICAgc2V0TmV4dChzdGF0ZSkge1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IHRoaXMuYnVmZmVyLnN1YnN0cmluZyh0aGlzLnBvcyk7XG4gICAgICAgIHRoaXMucG9zID0gMDtcbiAgICAgICAgdGhpcy5saW5lRW5kUG9zID0gbnVsbDtcbiAgICAgICAgdGhpcy5uZXh0ID0gc3RhdGU7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBwZWVrKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyLnN1YnN0cih0aGlzLnBvcywgbik7XG4gICAgfVxuICAgICpwYXJzZU5leHQobmV4dCkge1xuICAgICAgICBzd2l0Y2ggKG5leHQpIHtcbiAgICAgICAgICAgIGNhc2UgJ3N0cmVhbSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlU3RyZWFtKCk7XG4gICAgICAgICAgICBjYXNlICdsaW5lLXN0YXJ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VMaW5lU3RhcnQoKTtcbiAgICAgICAgICAgIGNhc2UgJ2Jsb2NrLXN0YXJ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VCbG9ja1N0YXJ0KCk7XG4gICAgICAgICAgICBjYXNlICdkb2MnOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZURvY3VtZW50KCk7XG4gICAgICAgICAgICBjYXNlICdmbG93JzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VGbG93Q29sbGVjdGlvbigpO1xuICAgICAgICAgICAgY2FzZSAncXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlUXVvdGVkU2NhbGFyKCk7XG4gICAgICAgICAgICBjYXNlICdibG9jay1zY2FsYXInOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZUJsb2NrU2NhbGFyKCk7XG4gICAgICAgICAgICBjYXNlICdwbGFpbi1zY2FsYXInOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZVBsYWluU2NhbGFyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgKnBhcnNlU3RyZWFtKCkge1xuICAgICAgICBsZXQgbGluZSA9IHRoaXMuZ2V0TGluZSgpO1xuICAgICAgICBpZiAobGluZSA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldE5leHQoJ3N0cmVhbScpO1xuICAgICAgICBpZiAobGluZVswXSA9PT0gQk9NKSB7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQoMSk7XG4gICAgICAgICAgICBsaW5lID0gbGluZS5zdWJzdHJpbmcoMSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbmVbMF0gPT09ICclJykge1xuICAgICAgICAgICAgbGV0IGRpckVuZCA9IGxpbmUubGVuZ3RoO1xuICAgICAgICAgICAgbGV0IGNzID0gbGluZS5pbmRleE9mKCcjJyk7XG4gICAgICAgICAgICB3aGlsZSAoY3MgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2ggPSBsaW5lW2NzIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAnICcgfHwgY2ggPT09ICdcXHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpckVuZCA9IGNzIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjcyA9IGxpbmUuaW5kZXhPZignIycsIGNzICsgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaCA9IGxpbmVbZGlyRW5kIC0gMV07XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAnICcgfHwgY2ggPT09ICdcXHQnKVxuICAgICAgICAgICAgICAgICAgICBkaXJFbmQgLT0gMTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbiA9ICh5aWVsZCogdGhpcy5wdXNoQ291bnQoZGlyRW5kKSkgKyAoeWllbGQqIHRoaXMucHVzaFNwYWNlcyh0cnVlKSk7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQobGluZS5sZW5ndGggLSBuKTsgLy8gcG9zc2libGUgY29tbWVudFxuICAgICAgICAgICAgdGhpcy5wdXNoTmV3bGluZSgpO1xuICAgICAgICAgICAgcmV0dXJuICdzdHJlYW0nO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmF0TGluZUVuZCgpKSB7XG4gICAgICAgICAgICBjb25zdCBzcCA9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSk7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQobGluZS5sZW5ndGggLSBzcCk7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoTmV3bGluZSgpO1xuICAgICAgICAgICAgcmV0dXJuICdzdHJlYW0nO1xuICAgICAgICB9XG4gICAgICAgIHlpZWxkIERPQ1VNRU5UO1xuICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VMaW5lU3RhcnQoKTtcbiAgICB9XG4gICAgKnBhcnNlTGluZVN0YXJ0KCkge1xuICAgICAgICBjb25zdCBjaCA9IHRoaXMuY2hhckF0KDApO1xuICAgICAgICBpZiAoIWNoICYmICF0aGlzLmF0RW5kKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgnbGluZS1zdGFydCcpO1xuICAgICAgICBpZiAoY2ggPT09ICctJyB8fCBjaCA9PT0gJy4nKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYXRFbmQgJiYgIXRoaXMuaGFzQ2hhcnMoNCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgnbGluZS1zdGFydCcpO1xuICAgICAgICAgICAgY29uc3QgcyA9IHRoaXMucGVlaygzKTtcbiAgICAgICAgICAgIGlmICgocyA9PT0gJy0tLScgfHwgcyA9PT0gJy4uLicpICYmIGlzRW1wdHkodGhpcy5jaGFyQXQoMykpKSB7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaENvdW50KDMpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50VmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50TmV4dCA9IDA7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHMgPT09ICctLS0nID8gJ2RvYycgOiAnc3RyZWFtJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluZGVudFZhbHVlID0geWllbGQqIHRoaXMucHVzaFNwYWNlcyhmYWxzZSk7XG4gICAgICAgIGlmICh0aGlzLmluZGVudE5leHQgPiB0aGlzLmluZGVudFZhbHVlICYmICFpc0VtcHR5KHRoaXMuY2hhckF0KDEpKSlcbiAgICAgICAgICAgIHRoaXMuaW5kZW50TmV4dCA9IHRoaXMuaW5kZW50VmFsdWU7XG4gICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZUJsb2NrU3RhcnQoKTtcbiAgICB9XG4gICAgKnBhcnNlQmxvY2tTdGFydCgpIHtcbiAgICAgICAgY29uc3QgW2NoMCwgY2gxXSA9IHRoaXMucGVlaygyKTtcbiAgICAgICAgaWYgKCFjaDEgJiYgIXRoaXMuYXRFbmQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXROZXh0KCdibG9jay1zdGFydCcpO1xuICAgICAgICBpZiAoKGNoMCA9PT0gJy0nIHx8IGNoMCA9PT0gJz8nIHx8IGNoMCA9PT0gJzonKSAmJiBpc0VtcHR5KGNoMSkpIHtcbiAgICAgICAgICAgIGNvbnN0IG4gPSAoeWllbGQqIHRoaXMucHVzaENvdW50KDEpKSArICh5aWVsZCogdGhpcy5wdXNoU3BhY2VzKHRydWUpKTtcbiAgICAgICAgICAgIHRoaXMuaW5kZW50TmV4dCA9IHRoaXMuaW5kZW50VmFsdWUgKyAxO1xuICAgICAgICAgICAgdGhpcy5pbmRlbnRWYWx1ZSArPSBuO1xuICAgICAgICAgICAgcmV0dXJuICdibG9jay1zdGFydCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICdkb2MnO1xuICAgIH1cbiAgICAqcGFyc2VEb2N1bWVudCgpIHtcbiAgICAgICAgeWllbGQqIHRoaXMucHVzaFNwYWNlcyh0cnVlKTtcbiAgICAgICAgY29uc3QgbGluZSA9IHRoaXMuZ2V0TGluZSgpO1xuICAgICAgICBpZiAobGluZSA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldE5leHQoJ2RvYycpO1xuICAgICAgICBsZXQgbiA9IHlpZWxkKiB0aGlzLnB1c2hJbmRpY2F0b3JzKCk7XG4gICAgICAgIHN3aXRjaCAobGluZVtuXSkge1xuICAgICAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaENvdW50KGxpbmUubGVuZ3RoIC0gbik7XG4gICAgICAgICAgICAvLyBmYWxsdGhyb3VnaFxuICAgICAgICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaE5ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VMaW5lU3RhcnQoKTtcbiAgICAgICAgICAgIGNhc2UgJ3snOlxuICAgICAgICAgICAgY2FzZSAnWyc6XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaENvdW50KDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuZmxvd0tleSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuZmxvd0xldmVsID0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2Zsb3cnO1xuICAgICAgICAgICAgY2FzZSAnfSc6XG4gICAgICAgICAgICBjYXNlICddJzpcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGFuIGVycm9yXG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaENvdW50KDEpO1xuICAgICAgICAgICAgICAgIHJldHVybiAnZG9jJztcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hVbnRpbChpc05vdEFuY2hvckNoYXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiAnZG9jJztcbiAgICAgICAgICAgIGNhc2UgJ1wiJzpcbiAgICAgICAgICAgIGNhc2UgXCInXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlUXVvdGVkU2NhbGFyKCk7XG4gICAgICAgICAgICBjYXNlICd8JzpcbiAgICAgICAgICAgIGNhc2UgJz4nOlxuICAgICAgICAgICAgICAgIG4gKz0geWllbGQqIHRoaXMucGFyc2VCbG9ja1NjYWxhckhlYWRlcigpO1xuICAgICAgICAgICAgICAgIG4gKz0geWllbGQqIHRoaXMucHVzaFNwYWNlcyh0cnVlKTtcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQobGluZS5sZW5ndGggLSBuKTtcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoTmV3bGluZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZUJsb2NrU2NhbGFyKCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZVBsYWluU2NhbGFyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgKnBhcnNlRmxvd0NvbGxlY3Rpb24oKSB7XG4gICAgICAgIGxldCBubCwgc3A7XG4gICAgICAgIGxldCBpbmRlbnQgPSAtMTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgbmwgPSB5aWVsZCogdGhpcy5wdXNoTmV3bGluZSgpO1xuICAgICAgICAgICAgaWYgKG5sID4gMCkge1xuICAgICAgICAgICAgICAgIHNwID0geWllbGQqIHRoaXMucHVzaFNwYWNlcyhmYWxzZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRWYWx1ZSA9IGluZGVudCA9IHNwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3AgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3AgKz0geWllbGQqIHRoaXMucHVzaFNwYWNlcyh0cnVlKTtcbiAgICAgICAgfSB3aGlsZSAobmwgKyBzcCA+IDApO1xuICAgICAgICBjb25zdCBsaW5lID0gdGhpcy5nZXRMaW5lKCk7XG4gICAgICAgIGlmIChsaW5lID09PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgnZmxvdycpO1xuICAgICAgICBpZiAoKGluZGVudCAhPT0gLTEgJiYgaW5kZW50IDwgdGhpcy5pbmRlbnROZXh0ICYmIGxpbmVbMF0gIT09ICcjJykgfHxcbiAgICAgICAgICAgIChpbmRlbnQgPT09IDAgJiZcbiAgICAgICAgICAgICAgICAobGluZS5zdGFydHNXaXRoKCctLS0nKSB8fCBsaW5lLnN0YXJ0c1dpdGgoJy4uLicpKSAmJlxuICAgICAgICAgICAgICAgIGlzRW1wdHkobGluZVszXSkpKSB7XG4gICAgICAgICAgICAvLyBBbGxvd2luZyBmb3IgdGhlIHRlcm1pbmFsIF0gb3IgfSBhdCB0aGUgc2FtZSAocmF0aGVyIHRoYW4gZ3JlYXRlcilcbiAgICAgICAgICAgIC8vIGluZGVudCBsZXZlbCBhcyB0aGUgaW5pdGlhbCBbIG9yIHsgaXMgdGVjaG5pY2FsbHkgaW52YWxpZCwgYnV0XG4gICAgICAgICAgICAvLyBmYWlsaW5nIGhlcmUgd291bGQgYmUgc3VycHJpc2luZyB0byB1c2Vycy5cbiAgICAgICAgICAgIGNvbnN0IGF0Rmxvd0VuZE1hcmtlciA9IGluZGVudCA9PT0gdGhpcy5pbmRlbnROZXh0IC0gMSAmJlxuICAgICAgICAgICAgICAgIHRoaXMuZmxvd0xldmVsID09PSAxICYmXG4gICAgICAgICAgICAgICAgKGxpbmVbMF0gPT09ICddJyB8fCBsaW5lWzBdID09PSAnfScpO1xuICAgICAgICAgICAgaWYgKCFhdEZsb3dFbmRNYXJrZXIpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGFuIGVycm9yXG4gICAgICAgICAgICAgICAgdGhpcy5mbG93TGV2ZWwgPSAwO1xuICAgICAgICAgICAgICAgIHlpZWxkIEZMT1dfRU5EO1xuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZUxpbmVTdGFydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgd2hpbGUgKGxpbmVbbl0gPT09ICcsJykge1xuICAgICAgICAgICAgbiArPSB5aWVsZCogdGhpcy5wdXNoQ291bnQoMSk7XG4gICAgICAgICAgICBuICs9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLmZsb3dLZXkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBuICs9IHlpZWxkKiB0aGlzLnB1c2hJbmRpY2F0b3JzKCk7XG4gICAgICAgIHN3aXRjaCAobGluZVtuXSkge1xuICAgICAgICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdmbG93JztcbiAgICAgICAgICAgIGNhc2UgJyMnOlxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudChsaW5lLmxlbmd0aCAtIG4pO1xuICAgICAgICAgICAgICAgIHJldHVybiAnZmxvdyc7XG4gICAgICAgICAgICBjYXNlICd7JzpcbiAgICAgICAgICAgIGNhc2UgJ1snOlxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudCgxKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dLZXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dMZXZlbCArPSAxO1xuICAgICAgICAgICAgICAgIHJldHVybiAnZmxvdyc7XG4gICAgICAgICAgICBjYXNlICd9JzpcbiAgICAgICAgICAgIGNhc2UgJ10nOlxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudCgxKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dLZXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuZmxvd0xldmVsIC09IDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmxvd0xldmVsID8gJ2Zsb3cnIDogJ2RvYyc7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoVW50aWwoaXNOb3RBbmNob3JDaGFyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2Zsb3cnO1xuICAgICAgICAgICAgY2FzZSAnXCInOlxuICAgICAgICAgICAgY2FzZSBcIidcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dLZXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZVF1b3RlZFNjYWxhcigpO1xuICAgICAgICAgICAgY2FzZSAnOic6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gdGhpcy5jaGFyQXQoMSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmxvd0tleSB8fCBpc0VtcHR5KG5leHQpIHx8IG5leHQgPT09ICcsJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZsb3dLZXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaENvdW50KDEpO1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoU3BhY2VzKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2Zsb3cnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGZhbGx0aHJvdWdoXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRoaXMuZmxvd0tleSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZVBsYWluU2NhbGFyKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgKnBhcnNlUXVvdGVkU2NhbGFyKCkge1xuICAgICAgICBjb25zdCBxdW90ZSA9IHRoaXMuY2hhckF0KDApO1xuICAgICAgICBsZXQgZW5kID0gdGhpcy5idWZmZXIuaW5kZXhPZihxdW90ZSwgdGhpcy5wb3MgKyAxKTtcbiAgICAgICAgaWYgKHF1b3RlID09PSBcIidcIikge1xuICAgICAgICAgICAgd2hpbGUgKGVuZCAhPT0gLTEgJiYgdGhpcy5idWZmZXJbZW5kICsgMV0gPT09IFwiJ1wiKVxuICAgICAgICAgICAgICAgIGVuZCA9IHRoaXMuYnVmZmVyLmluZGV4T2YoXCInXCIsIGVuZCArIDIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZG91YmxlLXF1b3RlXG4gICAgICAgICAgICB3aGlsZSAoZW5kICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5idWZmZXJbZW5kIC0gMSAtIG5dID09PSAnXFxcXCcpXG4gICAgICAgICAgICAgICAgICAgIG4gKz0gMTtcbiAgICAgICAgICAgICAgICBpZiAobiAlIDIgPT09IDApXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGVuZCA9IHRoaXMuYnVmZmVyLmluZGV4T2YoJ1wiJywgZW5kICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gT25seSBsb29raW5nIGZvciBuZXdsaW5lcyB3aXRoaW4gdGhlIHF1b3Rlc1xuICAgICAgICBjb25zdCBxYiA9IHRoaXMuYnVmZmVyLnN1YnN0cmluZygwLCBlbmQpO1xuICAgICAgICBsZXQgbmwgPSBxYi5pbmRleE9mKCdcXG4nLCB0aGlzLnBvcyk7XG4gICAgICAgIGlmIChubCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHdoaWxlIChubCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjcyA9IHRoaXMuY29udGludWVTY2FsYXIobmwgKyAxKTtcbiAgICAgICAgICAgICAgICBpZiAoY3MgPT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBubCA9IHFiLmluZGV4T2YoJ1xcbicsIGNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChubCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIGFuIGVycm9yIGNhdXNlZCBieSBhbiB1bmV4cGVjdGVkIHVuaW5kZW50XG4gICAgICAgICAgICAgICAgZW5kID0gbmwgLSAocWJbbmwgLSAxXSA9PT0gJ1xccicgPyAyIDogMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5hdEVuZClcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXROZXh0KCdxdW90ZWQtc2NhbGFyJyk7XG4gICAgICAgICAgICBlbmQgPSB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgeWllbGQqIHRoaXMucHVzaFRvSW5kZXgoZW5kICsgMSwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gdGhpcy5mbG93TGV2ZWwgPyAnZmxvdycgOiAnZG9jJztcbiAgICB9XG4gICAgKnBhcnNlQmxvY2tTY2FsYXJIZWFkZXIoKSB7XG4gICAgICAgIHRoaXMuYmxvY2tTY2FsYXJJbmRlbnQgPSAtMTtcbiAgICAgICAgdGhpcy5ibG9ja1NjYWxhcktlZXAgPSBmYWxzZTtcbiAgICAgICAgbGV0IGkgPSB0aGlzLnBvcztcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNoID0gdGhpcy5idWZmZXJbKytpXTtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJysnKVxuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tTY2FsYXJLZWVwID0gdHJ1ZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoID4gJzAnICYmIGNoIDw9ICc5JylcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrU2NhbGFySW5kZW50ID0gTnVtYmVyKGNoKSAtIDE7XG4gICAgICAgICAgICBlbHNlIGlmIChjaCAhPT0gJy0nKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wdXNoVW50aWwoY2ggPT4gaXNFbXB0eShjaCkgfHwgY2ggPT09ICcjJyk7XG4gICAgfVxuICAgICpwYXJzZUJsb2NrU2NhbGFyKCkge1xuICAgICAgICBsZXQgbmwgPSB0aGlzLnBvcyAtIDE7IC8vIG1heSBiZSAtMSBpZiB0aGlzLnBvcyA9PT0gMFxuICAgICAgICBsZXQgaW5kZW50ID0gMDtcbiAgICAgICAgbGV0IGNoO1xuICAgICAgICBsb29wOiBmb3IgKGxldCBpID0gdGhpcy5wb3M7IChjaCA9IHRoaXMuYnVmZmVyW2ldKTsgKytpKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGNoKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnICc6XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdcXG4nOlxuICAgICAgICAgICAgICAgICAgICBubCA9IGk7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1xccic6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHRoaXMuYnVmZmVyW2kgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXh0ICYmICF0aGlzLmF0RW5kKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgnYmxvY2stc2NhbGFyJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0ID09PSAnXFxuJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gLy8gZmFsbHRocm91Z2hcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghY2ggJiYgIXRoaXMuYXRFbmQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXROZXh0KCdibG9jay1zY2FsYXInKTtcbiAgICAgICAgaWYgKGluZGVudCA+PSB0aGlzLmluZGVudE5leHQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJsb2NrU2NhbGFySW5kZW50ID09PSAtMSlcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudE5leHQgPSBpbmRlbnQ7XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudE5leHQgPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsb2NrU2NhbGFySW5kZW50ICsgKHRoaXMuaW5kZW50TmV4dCA9PT0gMCA/IDEgOiB0aGlzLmluZGVudE5leHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNzID0gdGhpcy5jb250aW51ZVNjYWxhcihubCArIDEpO1xuICAgICAgICAgICAgICAgIGlmIChjcyA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIG5sID0gdGhpcy5idWZmZXIuaW5kZXhPZignXFxuJywgY3MpO1xuICAgICAgICAgICAgfSB3aGlsZSAobmwgIT09IC0xKTtcbiAgICAgICAgICAgIGlmIChubCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuYXRFbmQpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNldE5leHQoJ2Jsb2NrLXNjYWxhcicpO1xuICAgICAgICAgICAgICAgIG5sID0gdGhpcy5idWZmZXIubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRyYWlsaW5nIGluc3VmZmljaWVudGx5IGluZGVudGVkIHRhYnMgYXJlIGludmFsaWQuXG4gICAgICAgIC8vIFRvIGNhdGNoIHRoYXQgZHVyaW5nIHBhcnNpbmcsIHdlIGluY2x1ZGUgdGhlbSBpbiB0aGUgYmxvY2sgc2NhbGFyIHZhbHVlLlxuICAgICAgICBsZXQgaSA9IG5sICsgMTtcbiAgICAgICAgY2ggPSB0aGlzLmJ1ZmZlcltpXTtcbiAgICAgICAgd2hpbGUgKGNoID09PSAnICcpXG4gICAgICAgICAgICBjaCA9IHRoaXMuYnVmZmVyWysraV07XG4gICAgICAgIGlmIChjaCA9PT0gJ1xcdCcpIHtcbiAgICAgICAgICAgIHdoaWxlIChjaCA9PT0gJ1xcdCcgfHwgY2ggPT09ICcgJyB8fCBjaCA9PT0gJ1xccicgfHwgY2ggPT09ICdcXG4nKVxuICAgICAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbKytpXTtcbiAgICAgICAgICAgIG5sID0gaSAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRoaXMuYmxvY2tTY2FsYXJLZWVwKSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgbGV0IGkgPSBubCAtIDE7XG4gICAgICAgICAgICAgICAgbGV0IGNoID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgICAgICAgICAgaWYgKGNoID09PSAnXFxyJylcbiAgICAgICAgICAgICAgICAgICAgY2ggPSB0aGlzLmJ1ZmZlclstLWldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RDaGFyID0gaTsgLy8gRHJvcCB0aGUgbGluZSBpZiBsYXN0IGNoYXIgbm90IG1vcmUgaW5kZW50ZWRcbiAgICAgICAgICAgICAgICB3aGlsZSAoY2ggPT09ICcgJylcbiAgICAgICAgICAgICAgICAgICAgY2ggPSB0aGlzLmJ1ZmZlclstLWldO1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xcbicgJiYgaSA+PSB0aGlzLnBvcyAmJiBpICsgMSArIGluZGVudCA+IGxhc3RDaGFyKVxuICAgICAgICAgICAgICAgICAgICBubCA9IGk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHlpZWxkIFNDQUxBUjtcbiAgICAgICAgeWllbGQqIHRoaXMucHVzaFRvSW5kZXgobmwgKyAxLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlTGluZVN0YXJ0KCk7XG4gICAgfVxuICAgICpwYXJzZVBsYWluU2NhbGFyKCkge1xuICAgICAgICBjb25zdCBpbkZsb3cgPSB0aGlzLmZsb3dMZXZlbCA+IDA7XG4gICAgICAgIGxldCBlbmQgPSB0aGlzLnBvcyAtIDE7XG4gICAgICAgIGxldCBpID0gdGhpcy5wb3MgLSAxO1xuICAgICAgICBsZXQgY2g7XG4gICAgICAgIHdoaWxlICgoY2ggPSB0aGlzLmJ1ZmZlclsrK2ldKSkge1xuICAgICAgICAgICAgaWYgKGNoID09PSAnOicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gdGhpcy5idWZmZXJbaSArIDFdO1xuICAgICAgICAgICAgICAgIGlmIChpc0VtcHR5KG5leHQpIHx8IChpbkZsb3cgJiYgZmxvd0luZGljYXRvckNoYXJzLmhhcyhuZXh0KSkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGVuZCA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpc0VtcHR5KGNoKSkge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0ID0gdGhpcy5idWZmZXJbaSArIDFdO1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xccicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHQgPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9ICdcXG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCA9IHRoaXMuYnVmZmVyW2kgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV4dCA9PT0gJyMnIHx8IChpbkZsb3cgJiYgZmxvd0luZGljYXRvckNoYXJzLmhhcyhuZXh0KSkpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3MgPSB0aGlzLmNvbnRpbnVlU2NhbGFyKGkgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNzID09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBpID0gTWF0aC5tYXgoaSwgY3MgLSAyKTsgLy8gdG8gYWR2YW5jZSwgYnV0IHN0aWxsIGFjY291bnQgZm9yICcgIydcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5GbG93ICYmIGZsb3dJbmRpY2F0b3JDaGFycy5oYXMoY2gpKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghY2ggJiYgIXRoaXMuYXRFbmQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXROZXh0KCdwbGFpbi1zY2FsYXInKTtcbiAgICAgICAgeWllbGQgU0NBTEFSO1xuICAgICAgICB5aWVsZCogdGhpcy5wdXNoVG9JbmRleChlbmQgKyAxLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIGluRmxvdyA/ICdmbG93JyA6ICdkb2MnO1xuICAgIH1cbiAgICAqcHVzaENvdW50KG4pIHtcbiAgICAgICAgaWYgKG4gPiAwKSB7XG4gICAgICAgICAgICB5aWVsZCB0aGlzLmJ1ZmZlci5zdWJzdHIodGhpcy5wb3MsIG4pO1xuICAgICAgICAgICAgdGhpcy5wb3MgKz0gbjtcbiAgICAgICAgICAgIHJldHVybiBuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICAqcHVzaFRvSW5kZXgoaSwgYWxsb3dFbXB0eSkge1xuICAgICAgICBjb25zdCBzID0gdGhpcy5idWZmZXIuc2xpY2UodGhpcy5wb3MsIGkpO1xuICAgICAgICBpZiAocykge1xuICAgICAgICAgICAgeWllbGQgcztcbiAgICAgICAgICAgIHRoaXMucG9zICs9IHMubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuIHMubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFsbG93RW1wdHkpXG4gICAgICAgICAgICB5aWVsZCAnJztcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgICpwdXNoSW5kaWNhdG9ycygpIHtcbiAgICAgICAgbGV0IG4gPSAwO1xuICAgICAgICBsb29wOiB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLmNoYXJBdCgwKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgICAgICAgICBuICs9IHlpZWxkKiB0aGlzLnB1c2hUYWcoKTtcbiAgICAgICAgICAgICAgICAgICAgbiArPSB5aWVsZCogdGhpcy5wdXNoU3BhY2VzKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBsb29wO1xuICAgICAgICAgICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgICAgICAgICAgICBuICs9IHlpZWxkKiB0aGlzLnB1c2hVbnRpbChpc05vdEFuY2hvckNoYXIpO1xuICAgICAgICAgICAgICAgICAgICBuICs9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGxvb3A7XG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6IC8vIHRoaXMgaXMgYW4gZXJyb3JcbiAgICAgICAgICAgICAgICBjYXNlICc/JzogLy8gdGhpcyBpcyBhbiBlcnJvciBvdXRzaWRlIGZsb3cgY29sbGVjdGlvbnNcbiAgICAgICAgICAgICAgICBjYXNlICc6Jzoge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbkZsb3cgPSB0aGlzLmZsb3dMZXZlbCA+IDA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoMSA9IHRoaXMuY2hhckF0KDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eShjaDEpIHx8IChpbkZsb3cgJiYgZmxvd0luZGljYXRvckNoYXJzLmhhcyhjaDEpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpbkZsb3cpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnROZXh0ID0gdGhpcy5pbmRlbnRWYWx1ZSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0aGlzLmZsb3dLZXkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93S2V5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBuICs9IHlpZWxkKiB0aGlzLnB1c2hDb3VudCgxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG4gKz0geWllbGQqIHRoaXMucHVzaFNwYWNlcyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlIGxvb3A7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAgIH1cbiAgICAqcHVzaFRhZygpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hhckF0KDEpID09PSAnPCcpIHtcbiAgICAgICAgICAgIGxldCBpID0gdGhpcy5wb3MgKyAyO1xuICAgICAgICAgICAgbGV0IGNoID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgICAgICB3aGlsZSAoIWlzRW1wdHkoY2gpICYmIGNoICE9PSAnPicpXG4gICAgICAgICAgICAgICAgY2ggPSB0aGlzLmJ1ZmZlclsrK2ldO1xuICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnB1c2hUb0luZGV4KGNoID09PSAnPicgPyBpICsgMSA6IGksIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpID0gdGhpcy5wb3MgKyAxO1xuICAgICAgICAgICAgbGV0IGNoID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgICAgICB3aGlsZSAoY2gpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFnQ2hhcnMuaGFzKGNoKSlcbiAgICAgICAgICAgICAgICAgICAgY2ggPSB0aGlzLmJ1ZmZlclsrK2ldO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSAnJScgJiZcbiAgICAgICAgICAgICAgICAgICAgaGV4RGlnaXRzLmhhcyh0aGlzLmJ1ZmZlcltpICsgMV0pICYmXG4gICAgICAgICAgICAgICAgICAgIGhleERpZ2l0cy5oYXModGhpcy5idWZmZXJbaSArIDJdKSkge1xuICAgICAgICAgICAgICAgICAgICBjaCA9IHRoaXMuYnVmZmVyWyhpICs9IDMpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wdXNoVG9JbmRleChpLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgKnB1c2hOZXdsaW5lKCkge1xuICAgICAgICBjb25zdCBjaCA9IHRoaXMuYnVmZmVyW3RoaXMucG9zXTtcbiAgICAgICAgaWYgKGNoID09PSAnXFxuJylcbiAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wdXNoQ291bnQoMSk7XG4gICAgICAgIGVsc2UgaWYgKGNoID09PSAnXFxyJyAmJiB0aGlzLmNoYXJBdCgxKSA9PT0gJ1xcbicpXG4gICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucHVzaENvdW50KDIpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgKnB1c2hTcGFjZXMoYWxsb3dUYWJzKSB7XG4gICAgICAgIGxldCBpID0gdGhpcy5wb3MgLSAxO1xuICAgICAgICBsZXQgY2g7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbKytpXTtcbiAgICAgICAgfSB3aGlsZSAoY2ggPT09ICcgJyB8fCAoYWxsb3dUYWJzICYmIGNoID09PSAnXFx0JykpO1xuICAgICAgICBjb25zdCBuID0gaSAtIHRoaXMucG9zO1xuICAgICAgICBpZiAobiA+IDApIHtcbiAgICAgICAgICAgIHlpZWxkIHRoaXMuYnVmZmVyLnN1YnN0cih0aGlzLnBvcywgbik7XG4gICAgICAgICAgICB0aGlzLnBvcyA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG47XG4gICAgfVxuICAgICpwdXNoVW50aWwodGVzdCkge1xuICAgICAgICBsZXQgaSA9IHRoaXMucG9zO1xuICAgICAgICBsZXQgY2ggPSB0aGlzLmJ1ZmZlcltpXTtcbiAgICAgICAgd2hpbGUgKCF0ZXN0KGNoKSlcbiAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbKytpXTtcbiAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnB1c2hUb0luZGV4KGksIGZhbHNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IExleGVyIH07XG4iLCAiLyoqXG4gKiBUcmFja3MgbmV3bGluZXMgZHVyaW5nIHBhcnNpbmcgaW4gb3JkZXIgdG8gcHJvdmlkZSBhbiBlZmZpY2llbnQgQVBJIGZvclxuICogZGV0ZXJtaW5pbmcgdGhlIG9uZS1pbmRleGVkIGB7IGxpbmUsIGNvbCB9YCBwb3NpdGlvbiBmb3IgYW55IG9mZnNldFxuICogd2l0aGluIHRoZSBpbnB1dC5cbiAqL1xuY2xhc3MgTGluZUNvdW50ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmxpbmVTdGFydHMgPSBbXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNob3VsZCBiZSBjYWxsZWQgaW4gYXNjZW5kaW5nIG9yZGVyLiBPdGhlcndpc2UsIGNhbGxcbiAgICAgICAgICogYGxpbmVDb3VudGVyLmxpbmVTdGFydHMuc29ydCgpYCBiZWZvcmUgY2FsbGluZyBgbGluZVBvcygpYC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYWRkTmV3TGluZSA9IChvZmZzZXQpID0+IHRoaXMubGluZVN0YXJ0cy5wdXNoKG9mZnNldCk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQZXJmb3JtcyBhIGJpbmFyeSBzZWFyY2ggYW5kIHJldHVybnMgdGhlIDEtaW5kZXhlZCB7IGxpbmUsIGNvbCB9XG4gICAgICAgICAqIHBvc2l0aW9uIG9mIGBvZmZzZXRgLiBJZiBgbGluZSA9PT0gMGAsIGBhZGROZXdMaW5lYCBoYXMgbmV2ZXIgYmVlblxuICAgICAgICAgKiBjYWxsZWQgb3IgYG9mZnNldGAgaXMgYmVmb3JlIHRoZSBmaXJzdCBrbm93biBuZXdsaW5lLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5saW5lUG9zID0gKG9mZnNldCkgPT4ge1xuICAgICAgICAgICAgbGV0IGxvdyA9IDA7XG4gICAgICAgICAgICBsZXQgaGlnaCA9IHRoaXMubGluZVN0YXJ0cy5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1pZCA9IChsb3cgKyBoaWdoKSA+PiAxOyAvLyBNYXRoLmZsb29yKChsb3cgKyBoaWdoKSAvIDIpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGluZVN0YXJ0c1ttaWRdIDwgb2Zmc2V0KVxuICAgICAgICAgICAgICAgICAgICBsb3cgPSBtaWQgKyAxO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgaGlnaCA9IG1pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmVTdGFydHNbbG93XSA9PT0gb2Zmc2V0KVxuICAgICAgICAgICAgICAgIHJldHVybiB7IGxpbmU6IGxvdyArIDEsIGNvbDogMSB9O1xuICAgICAgICAgICAgaWYgKGxvdyA9PT0gMClcbiAgICAgICAgICAgICAgICByZXR1cm4geyBsaW5lOiAwLCBjb2w6IG9mZnNldCB9O1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLmxpbmVTdGFydHNbbG93IC0gMV07XG4gICAgICAgICAgICByZXR1cm4geyBsaW5lOiBsb3csIGNvbDogb2Zmc2V0IC0gc3RhcnQgKyAxIH07XG4gICAgICAgIH07XG4gICAgfVxufVxuXG5leHBvcnQgeyBMaW5lQ291bnRlciB9O1xuIiwgImltcG9ydCB7IHRva2VuVHlwZSB9IGZyb20gJy4vY3N0LmpzJztcbmltcG9ydCB7IExleGVyIH0gZnJvbSAnLi9sZXhlci5qcyc7XG5cbmZ1bmN0aW9uIGluY2x1ZGVzVG9rZW4obGlzdCwgdHlwZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSlcbiAgICAgICAgaWYgKGxpc3RbaV0udHlwZSA9PT0gdHlwZSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbn1cbmZ1bmN0aW9uIGZpbmROb25FbXB0eUluZGV4KGxpc3QpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3dpdGNoIChsaXN0W2ldLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbn1cbmZ1bmN0aW9uIGlzRmxvd1Rva2VuKHRva2VuKSB7XG4gICAgc3dpdGNoICh0b2tlbj8udHlwZSkge1xuICAgICAgICBjYXNlICdhbGlhcyc6XG4gICAgICAgIGNhc2UgJ3NjYWxhcic6XG4gICAgICAgIGNhc2UgJ3NpbmdsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgY2FzZSAnZG91YmxlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICBjYXNlICdmbG93LWNvbGxlY3Rpb24nOlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0UHJldlByb3BzKHBhcmVudCkge1xuICAgIHN3aXRjaCAocGFyZW50LnR5cGUpIHtcbiAgICAgICAgY2FzZSAnZG9jdW1lbnQnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5zdGFydDtcbiAgICAgICAgY2FzZSAnYmxvY2stbWFwJzoge1xuICAgICAgICAgICAgY29uc3QgaXQgPSBwYXJlbnQuaXRlbXNbcGFyZW50Lml0ZW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuIGl0LnNlcCA/PyBpdC5zdGFydDtcbiAgICAgICAgfVxuICAgICAgICBjYXNlICdibG9jay1zZXEnOlxuICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5pdGVtc1twYXJlbnQuaXRlbXMubGVuZ3RoIC0gMV0uc3RhcnQ7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IHNob3VsZCBub3QgaGFwcGVuICovXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgfVxufVxuLyoqIE5vdGU6IE1heSBtb2RpZnkgaW5wdXQgYXJyYXkgKi9cbmZ1bmN0aW9uIGdldEZpcnN0S2V5U3RhcnRQcm9wcyhwcmV2KSB7XG4gICAgaWYgKHByZXYubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm4gW107XG4gICAgbGV0IGkgPSBwcmV2Lmxlbmd0aDtcbiAgICBsb29wOiB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgc3dpdGNoIChwcmV2W2ldLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2RvYy1zdGFydCc6XG4gICAgICAgICAgICBjYXNlICdleHBsaWNpdC1rZXktaW5kJzpcbiAgICAgICAgICAgIGNhc2UgJ21hcC12YWx1ZS1pbmQnOlxuICAgICAgICAgICAgY2FzZSAnc2VxLWl0ZW0taW5kJzpcbiAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgIGJyZWFrIGxvb3A7XG4gICAgICAgIH1cbiAgICB9XG4gICAgd2hpbGUgKHByZXZbKytpXT8udHlwZSA9PT0gJ3NwYWNlJykge1xuICAgICAgICAvKiBsb29wICovXG4gICAgfVxuICAgIHJldHVybiBwcmV2LnNwbGljZShpLCBwcmV2Lmxlbmd0aCk7XG59XG5mdW5jdGlvbiBhcnJheVB1c2hBcnJheSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIC8vIE1heSBleGhhdXN0IGNhbGwgc3RhY2sgd2l0aCBsYXJnZSBgc291cmNlYCBhcnJheVxuICAgIGlmIChzb3VyY2UubGVuZ3RoIDwgMWU1KVxuICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0YXJnZXQsIHNvdXJjZSk7XG4gICAgZWxzZVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgIHRhcmdldC5wdXNoKHNvdXJjZVtpXSk7XG59XG5mdW5jdGlvbiBmaXhGbG93U2VxSXRlbXMoZmMpIHtcbiAgICBpZiAoZmMuc3RhcnQudHlwZSA9PT0gJ2Zsb3ctc2VxLXN0YXJ0Jykge1xuICAgICAgICBmb3IgKGNvbnN0IGl0IG9mIGZjLml0ZW1zKSB7XG4gICAgICAgICAgICBpZiAoaXQuc2VwICYmXG4gICAgICAgICAgICAgICAgIWl0LnZhbHVlICYmXG4gICAgICAgICAgICAgICAgIWluY2x1ZGVzVG9rZW4oaXQuc3RhcnQsICdleHBsaWNpdC1rZXktaW5kJykgJiZcbiAgICAgICAgICAgICAgICAhaW5jbHVkZXNUb2tlbihpdC5zZXAsICdtYXAtdmFsdWUtaW5kJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXQua2V5KVxuICAgICAgICAgICAgICAgICAgICBpdC52YWx1ZSA9IGl0LmtleTtcbiAgICAgICAgICAgICAgICBkZWxldGUgaXQua2V5O1xuICAgICAgICAgICAgICAgIGlmIChpc0Zsb3dUb2tlbihpdC52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlLmVuZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5UHVzaEFycmF5KGl0LnZhbHVlLmVuZCwgaXQuc2VwKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaXQudmFsdWUuZW5kID0gaXQuc2VwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGFycmF5UHVzaEFycmF5KGl0LnN0YXJ0LCBpdC5zZXApO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBpdC5zZXA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIEEgWUFNTCBjb25jcmV0ZSBzeW50YXggdHJlZSAoQ1NUKSBwYXJzZXJcbiAqXG4gKiBgYGB0c1xuICogY29uc3Qgc3JjOiBzdHJpbmcgPSAuLi5cbiAqIGZvciAoY29uc3QgdG9rZW4gb2YgbmV3IFBhcnNlcigpLnBhcnNlKHNyYykpIHtcbiAqICAgLy8gdG9rZW46IFRva2VuXG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBUbyB1c2UgdGhlIHBhcnNlciB3aXRoIGEgdXNlci1wcm92aWRlZCBsZXhlcjpcbiAqXG4gKiBgYGB0c1xuICogZnVuY3Rpb24qIHBhcnNlKHNvdXJjZTogc3RyaW5nLCBsZXhlcjogTGV4ZXIpIHtcbiAqICAgY29uc3QgcGFyc2VyID0gbmV3IFBhcnNlcigpXG4gKiAgIGZvciAoY29uc3QgbGV4ZW1lIG9mIGxleGVyLmxleChzb3VyY2UpKVxuICogICAgIHlpZWxkKiBwYXJzZXIubmV4dChsZXhlbWUpXG4gKiAgIHlpZWxkKiBwYXJzZXIuZW5kKClcbiAqIH1cbiAqXG4gKiBjb25zdCBzcmM6IHN0cmluZyA9IC4uLlxuICogY29uc3QgbGV4ZXIgPSBuZXcgTGV4ZXIoKVxuICogZm9yIChjb25zdCB0b2tlbiBvZiBwYXJzZShzcmMsIGxleGVyKSkge1xuICogICAvLyB0b2tlbjogVG9rZW5cbiAqIH1cbiAqIGBgYFxuICovXG5jbGFzcyBQYXJzZXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBvbk5ld0xpbmUgLSBJZiBkZWZpbmVkLCBjYWxsZWQgc2VwYXJhdGVseSB3aXRoIHRoZSBzdGFydCBwb3NpdGlvbiBvZlxuICAgICAqICAgZWFjaCBuZXcgbGluZSAoaW4gYHBhcnNlKClgLCBpbmNsdWRpbmcgdGhlIHN0YXJ0IG9mIGlucHV0KS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihvbk5ld0xpbmUpIHtcbiAgICAgICAgLyoqIElmIHRydWUsIHNwYWNlIGFuZCBzZXF1ZW5jZSBpbmRpY2F0b3JzIGNvdW50IGFzIGluZGVudGF0aW9uICovXG4gICAgICAgIHRoaXMuYXROZXdMaW5lID0gdHJ1ZTtcbiAgICAgICAgLyoqIElmIHRydWUsIG5leHQgdG9rZW4gaXMgYSBzY2FsYXIgdmFsdWUgKi9cbiAgICAgICAgdGhpcy5hdFNjYWxhciA9IGZhbHNlO1xuICAgICAgICAvKiogQ3VycmVudCBpbmRlbnRhdGlvbiBsZXZlbCAqL1xuICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgIC8qKiBDdXJyZW50IG9mZnNldCBzaW5jZSB0aGUgc3RhcnQgb2YgcGFyc2luZyAqL1xuICAgICAgICB0aGlzLm9mZnNldCA9IDA7XG4gICAgICAgIC8qKiBPbiB0aGUgc2FtZSBsaW5lIHdpdGggYSBibG9jayBtYXAga2V5ICovXG4gICAgICAgIHRoaXMub25LZXlMaW5lID0gZmFsc2U7XG4gICAgICAgIC8qKiBUb3AgaW5kaWNhdGVzIHRoZSBub2RlIHRoYXQncyBjdXJyZW50bHkgYmVpbmcgYnVpbHQgKi9cbiAgICAgICAgdGhpcy5zdGFjayA9IFtdO1xuICAgICAgICAvKiogVGhlIHNvdXJjZSBvZiB0aGUgY3VycmVudCB0b2tlbiwgc2V0IGluIHBhcnNlKCkgKi9cbiAgICAgICAgdGhpcy5zb3VyY2UgPSAnJztcbiAgICAgICAgLyoqIFRoZSB0eXBlIG9mIHRoZSBjdXJyZW50IHRva2VuLCBzZXQgaW4gcGFyc2UoKSAqL1xuICAgICAgICB0aGlzLnR5cGUgPSAnJztcbiAgICAgICAgLy8gTXVzdCBiZSBkZWZpbmVkIGFmdGVyIGBuZXh0KClgXG4gICAgICAgIHRoaXMubGV4ZXIgPSBuZXcgTGV4ZXIoKTtcbiAgICAgICAgdGhpcy5vbk5ld0xpbmUgPSBvbk5ld0xpbmU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBhcnNlIGBzb3VyY2VgIGFzIGEgWUFNTCBzdHJlYW0uXG4gICAgICogSWYgYGluY29tcGxldGVgLCBhIHBhcnQgb2YgdGhlIGxhc3QgbGluZSBtYXkgYmUgbGVmdCBhcyBhIGJ1ZmZlciBmb3IgdGhlIG5leHQgY2FsbC5cbiAgICAgKlxuICAgICAqIEVycm9ycyBhcmUgbm90IHRocm93biwgYnV0IHlpZWxkZWQgYXMgYHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZSB9YCB0b2tlbnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIGdlbmVyYXRvciBvZiB0b2tlbnMgcmVwcmVzZW50aW5nIGVhY2ggZGlyZWN0aXZlLCBkb2N1bWVudCwgYW5kIG90aGVyIHN0cnVjdHVyZS5cbiAgICAgKi9cbiAgICAqcGFyc2Uoc291cmNlLCBpbmNvbXBsZXRlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHRoaXMub25OZXdMaW5lICYmIHRoaXMub2Zmc2V0ID09PSAwKVxuICAgICAgICAgICAgdGhpcy5vbk5ld0xpbmUoMCk7XG4gICAgICAgIGZvciAoY29uc3QgbGV4ZW1lIG9mIHRoaXMubGV4ZXIubGV4KHNvdXJjZSwgaW5jb21wbGV0ZSkpXG4gICAgICAgICAgICB5aWVsZCogdGhpcy5uZXh0KGxleGVtZSk7XG4gICAgICAgIGlmICghaW5jb21wbGV0ZSlcbiAgICAgICAgICAgIHlpZWxkKiB0aGlzLmVuZCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZHZhbmNlIHRoZSBwYXJzZXIgYnkgdGhlIGBzb3VyY2VgIG9mIG9uZSBsZXhpY2FsIHRva2VuLlxuICAgICAqL1xuICAgICpuZXh0KHNvdXJjZSkge1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgaWYgKHRoaXMuYXRTY2FsYXIpIHtcbiAgICAgICAgICAgIHRoaXMuYXRTY2FsYXIgPSBmYWxzZTtcbiAgICAgICAgICAgIHlpZWxkKiB0aGlzLnN0ZXAoKTtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ICs9IHNvdXJjZS5sZW5ndGg7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdHlwZSA9IHRva2VuVHlwZShzb3VyY2UpO1xuICAgICAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgTm90IGEgWUFNTCB0b2tlbjogJHtzb3VyY2V9YDtcbiAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCh7IHR5cGU6ICdlcnJvcicsIG9mZnNldDogdGhpcy5vZmZzZXQsIG1lc3NhZ2UsIHNvdXJjZSB9KTtcbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ICs9IHNvdXJjZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ3NjYWxhcicpIHtcbiAgICAgICAgICAgIHRoaXMuYXROZXdMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmF0U2NhbGFyID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9ICdzY2FsYXInO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgICAgIHlpZWxkKiB0aGlzLnN0ZXAoKTtcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmF0TmV3TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub25OZXdMaW5lKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk5ld0xpbmUodGhpcy5vZmZzZXQgKyBzb3VyY2UubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5hdE5ld0xpbmUgJiYgc291cmNlWzBdID09PSAnICcpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudCArPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdleHBsaWNpdC1rZXktaW5kJzpcbiAgICAgICAgICAgICAgICBjYXNlICdtYXAtdmFsdWUtaW5kJzpcbiAgICAgICAgICAgICAgICBjYXNlICdzZXEtaXRlbS1pbmQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5hdE5ld0xpbmUpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudCArPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdkb2MtbW9kZSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnZmxvdy1lcnJvci1lbmQnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdE5ld0xpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub2Zmc2V0ICs9IHNvdXJjZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqIENhbGwgYXQgZW5kIG9mIGlucHV0IHRvIHB1c2ggb3V0IGFueSByZW1haW5pbmcgY29uc3RydWN0aW9ucyAqL1xuICAgICplbmQoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLnN0YWNrLmxlbmd0aCA+IDApXG4gICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICB9XG4gICAgZ2V0IHNvdXJjZVRva2VuKCkge1xuICAgICAgICBjb25zdCBzdCA9IHtcbiAgICAgICAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICBpbmRlbnQ6IHRoaXMuaW5kZW50LFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gc3Q7XG4gICAgfVxuICAgICpzdGVwKCkge1xuICAgICAgICBjb25zdCB0b3AgPSB0aGlzLnBlZWsoMSk7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdkb2MtZW5kJyAmJiB0b3A/LnR5cGUgIT09ICdkb2MtZW5kJykge1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuc3RhY2subGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2RvYy1lbmQnLFxuICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0b3ApXG4gICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMuc3RyZWFtKCk7XG4gICAgICAgIHN3aXRjaCAodG9wLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2RvY3VtZW50JzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMuZG9jdW1lbnQodG9wKTtcbiAgICAgICAgICAgIGNhc2UgJ2FsaWFzJzpcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxhcic6XG4gICAgICAgICAgICBjYXNlICdzaW5nbGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICBjYXNlICdkb3VibGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnNjYWxhcih0b3ApO1xuICAgICAgICAgICAgY2FzZSAnYmxvY2stc2NhbGFyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMuYmxvY2tTY2FsYXIodG9wKTtcbiAgICAgICAgICAgIGNhc2UgJ2Jsb2NrLW1hcCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLmJsb2NrTWFwKHRvcCk7XG4gICAgICAgICAgICBjYXNlICdibG9jay1zZXEnOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5ibG9ja1NlcXVlbmNlKHRvcCk7XG4gICAgICAgICAgICBjYXNlICdmbG93LWNvbGxlY3Rpb24nOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5mbG93Q29sbGVjdGlvbih0b3ApO1xuICAgICAgICAgICAgY2FzZSAnZG9jLWVuZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLmRvY3VtZW50RW5kKHRvcCk7XG4gICAgICAgIH1cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgc2hvdWxkIG5vdCBoYXBwZW4gKi9cbiAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgfVxuICAgIHBlZWsobikge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIG5dO1xuICAgIH1cbiAgICAqcG9wKGVycm9yKSB7XG4gICAgICAgIGNvbnN0IHRva2VuID0gZXJyb3IgPz8gdGhpcy5zdGFjay5wb3AoKTtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmIHNob3VsZCBub3QgaGFwcGVuICovXG4gICAgICAgIGlmICghdG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnVHJpZWQgdG8gcG9wIGFuIGVtcHR5IHN0YWNrJztcbiAgICAgICAgICAgIHlpZWxkIHsgdHlwZTogJ2Vycm9yJywgb2Zmc2V0OiB0aGlzLm9mZnNldCwgc291cmNlOiAnJywgbWVzc2FnZSB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhY2subGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB5aWVsZCB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHRvcCA9IHRoaXMucGVlaygxKTtcbiAgICAgICAgICAgIGlmICh0b2tlbi50eXBlID09PSAnYmxvY2stc2NhbGFyJykge1xuICAgICAgICAgICAgICAgIC8vIEJsb2NrIHNjYWxhcnMgdXNlIHRoZWlyIHBhcmVudCByYXRoZXIgdGhhbiBoZWFkZXIgaW5kZW50XG4gICAgICAgICAgICAgICAgdG9rZW4uaW5kZW50ID0gJ2luZGVudCcgaW4gdG9wID8gdG9wLmluZGVudCA6IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0b2tlbi50eXBlID09PSAnZmxvdy1jb2xsZWN0aW9uJyAmJiB0b3AudHlwZSA9PT0gJ2RvY3VtZW50Jykge1xuICAgICAgICAgICAgICAgIC8vIElnbm9yZSBhbGwgaW5kZW50IGZvciB0b3AtbGV2ZWwgZmxvdyBjb2xsZWN0aW9uc1xuICAgICAgICAgICAgICAgIHRva2VuLmluZGVudCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gJ2Zsb3ctY29sbGVjdGlvbicpXG4gICAgICAgICAgICAgICAgZml4Rmxvd1NlcUl0ZW1zKHRva2VuKTtcbiAgICAgICAgICAgIHN3aXRjaCAodG9wLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdkb2N1bWVudCc6XG4gICAgICAgICAgICAgICAgICAgIHRvcC52YWx1ZSA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdibG9jay1zY2FsYXInOlxuICAgICAgICAgICAgICAgICAgICB0b3AucHJvcHMucHVzaCh0b2tlbik7IC8vIGVycm9yXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2Jsb2NrLW1hcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXQgPSB0b3AuaXRlbXNbdG9wLml0ZW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcC5pdGVtcy5wdXNoKHsgc3RhcnQ6IFtdLCBrZXk6IHRva2VuLCBzZXA6IFtdIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXQudmFsdWUgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oaXQsIHsga2V5OiB0b2tlbiwgc2VwOiBbXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25LZXlMaW5lID0gIWl0LmV4cGxpY2l0S2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdibG9jay1zZXEnOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ID0gdG9wLml0ZW1zW3RvcC5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wLml0ZW1zLnB1c2goeyBzdGFydDogW10sIHZhbHVlOiB0b2tlbiB9KTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaXQudmFsdWUgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zsb3ctY29sbGVjdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXQgPSB0b3AuaXRlbXNbdG9wLml0ZW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0IHx8IGl0LnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wLml0ZW1zLnB1c2goeyBzdGFydDogW10sIGtleTogdG9rZW4sIHNlcDogW10gfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcClcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnZhbHVlID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oaXQsIHsga2V5OiB0b2tlbiwgc2VwOiBbXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCBzaG91bGQgbm90IGhhcHBlbiAqL1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AodG9rZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCh0b3AudHlwZSA9PT0gJ2RvY3VtZW50JyB8fFxuICAgICAgICAgICAgICAgIHRvcC50eXBlID09PSAnYmxvY2stbWFwJyB8fFxuICAgICAgICAgICAgICAgIHRvcC50eXBlID09PSAnYmxvY2stc2VxJykgJiZcbiAgICAgICAgICAgICAgICAodG9rZW4udHlwZSA9PT0gJ2Jsb2NrLW1hcCcgfHwgdG9rZW4udHlwZSA9PT0gJ2Jsb2NrLXNlcScpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdCA9IHRva2VuLml0ZW1zW3Rva2VuLml0ZW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgIGlmIChsYXN0ICYmXG4gICAgICAgICAgICAgICAgICAgICFsYXN0LnNlcCAmJlxuICAgICAgICAgICAgICAgICAgICAhbGFzdC52YWx1ZSAmJlxuICAgICAgICAgICAgICAgICAgICBsYXN0LnN0YXJ0Lmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICAgICAgZmluZE5vbkVtcHR5SW5kZXgobGFzdC5zdGFydCkgPT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICh0b2tlbi5pbmRlbnQgPT09IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3Quc3RhcnQuZXZlcnkoc3QgPT4gc3QudHlwZSAhPT0gJ2NvbW1lbnQnIHx8IHN0LmluZGVudCA8IHRva2VuLmluZGVudCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3AudHlwZSA9PT0gJ2RvY3VtZW50JylcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcC5lbmQgPSBsYXN0LnN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AuaXRlbXMucHVzaCh7IHN0YXJ0OiBsYXN0LnN0YXJ0IH0pO1xuICAgICAgICAgICAgICAgICAgICB0b2tlbi5pdGVtcy5zcGxpY2UoLTEsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAqc3RyZWFtKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnZGlyZWN0aXZlLWxpbmUnOlxuICAgICAgICAgICAgICAgIHlpZWxkIHsgdHlwZTogJ2RpcmVjdGl2ZScsIG9mZnNldDogdGhpcy5vZmZzZXQsIHNvdXJjZTogdGhpcy5zb3VyY2UgfTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlICdieXRlLW9yZGVyLW1hcmsnOlxuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLnNvdXJjZVRva2VuO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgJ2RvYy1tb2RlJzpcbiAgICAgICAgICAgIGNhc2UgJ2RvYy1zdGFydCc6IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkb2MgPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkb2N1bWVudCcsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBbXVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ2RvYy1zdGFydCcpXG4gICAgICAgICAgICAgICAgICAgIGRvYy5zdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaChkb2MpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB5aWVsZCB7XG4gICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgIG1lc3NhZ2U6IGBVbmV4cGVjdGVkICR7dGhpcy50eXBlfSB0b2tlbiBpbiBZQU1MIHN0cmVhbWAsXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlXG4gICAgICAgIH07XG4gICAgfVxuICAgICpkb2N1bWVudChkb2MpIHtcbiAgICAgICAgaWYgKGRvYy52YWx1ZSlcbiAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5saW5lRW5kKGRvYyk7XG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdkb2Mtc3RhcnQnOiB7XG4gICAgICAgICAgICAgICAgaWYgKGZpbmROb25FbXB0eUluZGV4KGRvYy5zdGFydCkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5zdGVwKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgZG9jLnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnYW5jaG9yJzpcbiAgICAgICAgICAgIGNhc2UgJ3RhZyc6XG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgIGRvYy5zdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBidiA9IHRoaXMuc3RhcnRCbG9ja1ZhbHVlKGRvYyk7XG4gICAgICAgIGlmIChidilcbiAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaChidik7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeWllbGQge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBgVW5leHBlY3RlZCAke3RoaXMudHlwZX0gdG9rZW4gaW4gWUFNTCBkb2N1bWVudGAsXG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAqc2NhbGFyKHNjYWxhcikge1xuICAgICAgICBpZiAodGhpcy50eXBlID09PSAnbWFwLXZhbHVlLWluZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZXYgPSBnZXRQcmV2UHJvcHModGhpcy5wZWVrKDIpKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gZ2V0Rmlyc3RLZXlTdGFydFByb3BzKHByZXYpO1xuICAgICAgICAgICAgbGV0IHNlcDtcbiAgICAgICAgICAgIGlmIChzY2FsYXIuZW5kKSB7XG4gICAgICAgICAgICAgICAgc2VwID0gc2NhbGFyLmVuZDtcbiAgICAgICAgICAgICAgICBzZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgc2NhbGFyLmVuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBzZXAgPSBbdGhpcy5zb3VyY2VUb2tlbl07XG4gICAgICAgICAgICBjb25zdCBtYXAgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLW1hcCcsXG4gICAgICAgICAgICAgICAgb2Zmc2V0OiBzY2FsYXIub2Zmc2V0LFxuICAgICAgICAgICAgICAgIGluZGVudDogc2NhbGFyLmluZGVudCxcbiAgICAgICAgICAgICAgICBpdGVtczogW3sgc3RhcnQsIGtleTogc2NhbGFyLCBzZXAgfV1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV0gPSBtYXA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgeWllbGQqIHRoaXMubGluZUVuZChzY2FsYXIpO1xuICAgIH1cbiAgICAqYmxvY2tTY2FsYXIoc2NhbGFyKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgIHNjYWxhci5wcm9wcy5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxhcic6XG4gICAgICAgICAgICAgICAgc2NhbGFyLnNvdXJjZSA9IHRoaXMuc291cmNlO1xuICAgICAgICAgICAgICAgIC8vIGJsb2NrLXNjYWxhciBzb3VyY2UgaW5jbHVkZXMgdHJhaWxpbmcgbmV3bGluZVxuICAgICAgICAgICAgICAgIHRoaXMuYXROZXdMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25OZXdMaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBubCA9IHRoaXMuc291cmNlLmluZGV4T2YoJ1xcbicpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKG5sICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTmV3TGluZSh0aGlzLm9mZnNldCArIG5sKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5sID0gdGhpcy5zb3VyY2UuaW5kZXhPZignXFxuJywgbmwpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IHNob3VsZCBub3QgaGFwcGVuICovXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnN0ZXAoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAqYmxvY2tNYXAobWFwKSB7XG4gICAgICAgIGNvbnN0IGl0ID0gbWFwLml0ZW1zW21hcC5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgLy8gaXQuc2VwIGlzIHRydWUtaXNoIGlmIHBhaXIgYWxyZWFkeSBoYXMga2V5IG9yIDogc2VwYXJhdG9yXG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChpdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSAnZW5kJyBpbiBpdC52YWx1ZSA/IGl0LnZhbHVlLmVuZCA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdCA9IEFycmF5LmlzQXJyYXkoZW5kKSA/IGVuZFtlbmQubGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYXN0Py50eXBlID09PSAnY29tbWVudCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmQ/LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHsgc3RhcnQ6IFt0aGlzLnNvdXJjZVRva2VuXSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXQuc2VwKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0LnNlcC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHsgc3RhcnQ6IFt0aGlzLnNvdXJjZVRva2VuXSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaXQuc2VwKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0LnNlcC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYXRJbmRlbnRlZENvbW1lbnQoaXQuc3RhcnQsIG1hcC5pbmRlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmV2ID0gbWFwLml0ZW1zW21hcC5pdGVtcy5sZW5ndGggLSAyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZCA9IHByZXY/LnZhbHVlPy5lbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbmQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlQdXNoQXJyYXkoZW5kLCBpdC5zdGFydCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kLnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwLml0ZW1zLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpdC5zdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaW5kZW50ID49IG1hcC5pbmRlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGF0TWFwSW5kZW50ID0gIXRoaXMub25LZXlMaW5lICYmIHRoaXMuaW5kZW50ID09PSBtYXAuaW5kZW50O1xuICAgICAgICAgICAgY29uc3QgYXROZXh0SXRlbSA9IGF0TWFwSW5kZW50ICYmXG4gICAgICAgICAgICAgICAgKGl0LnNlcCB8fCBpdC5leHBsaWNpdEtleSkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLnR5cGUgIT09ICdzZXEtaXRlbS1pbmQnO1xuICAgICAgICAgICAgLy8gRm9yIGVtcHR5IG5vZGVzLCBhc3NpZ24gbmV3bGluZS1zZXBhcmF0ZWQgbm90IGluZGVudGVkIGVtcHR5IHRva2VucyB0byBmb2xsb3dpbmcgbm9kZVxuICAgICAgICAgICAgbGV0IHN0YXJ0ID0gW107XG4gICAgICAgICAgICBpZiAoYXROZXh0SXRlbSAmJiBpdC5zZXAgJiYgIWl0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmwgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0LnNlcC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdCA9IGl0LnNlcFtpXTtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzdC50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBubC5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0LmluZGVudCA+IG1hcC5pbmRlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5sLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5sLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5sLmxlbmd0aCA+PSAyKVxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGl0LnNlcC5zcGxpY2UobmxbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdhbmNob3InOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3RhZyc6XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdE5leHRJdGVtIHx8IGl0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFwLml0ZW1zLnB1c2goeyBzdGFydCB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25LZXlMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpdC5zZXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnNlcC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY2FzZSAnZXhwbGljaXQta2V5LWluZCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXQuc2VwICYmICFpdC5leHBsaWNpdEtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LmV4cGxpY2l0S2V5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChhdE5leHRJdGVtIHx8IGl0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWFwLml0ZW1zLnB1c2goeyBzdGFydCwgZXhwbGljaXRLZXk6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50OiB0aGlzLmluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW3sgc3RhcnQ6IFt0aGlzLnNvdXJjZVRva2VuXSwgZXhwbGljaXRLZXk6IHRydWUgfV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25LZXlMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNhc2UgJ21hcC12YWx1ZS1pbmQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXQuZXhwbGljaXRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXQuc2VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluY2x1ZGVzVG9rZW4oaXQuc3RhcnQsICduZXdsaW5lJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihpdCwgeyBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBnZXRGaXJzdEtleVN0YXJ0UHJvcHMoaXQuc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLW1hcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50OiB0aGlzLmluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyBzdGFydCwga2V5OiBudWxsLCBzZXA6IFt0aGlzLnNvdXJjZVRva2VuXSB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHsgc3RhcnQ6IFtdLCBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaW5jbHVkZXNUb2tlbihpdC5zZXAsICdtYXAtdmFsdWUtaW5kJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYmxvY2stbWFwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50OiB0aGlzLmluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7IHN0YXJ0LCBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpc0Zsb3dUb2tlbihpdC5rZXkpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIWluY2x1ZGVzVG9rZW4oaXQuc2VwLCAnbmV3bGluZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBnZXRGaXJzdEtleVN0YXJ0UHJvcHMoaXQuc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGl0LmtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZXAgPSBpdC5zZXA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VwLnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciB0eXBlIGd1YXJkIGlzIHdyb25nIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgaXQua2V5O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgdHlwZSBndWFyZCBpcyB3cm9uZyBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGl0LnNlcDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYmxvY2stbWFwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50OiB0aGlzLmluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7IHN0YXJ0LCBrZXksIHNlcCB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoc3RhcnQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdCBhY3R1YWxseSBhdCBuZXh0IGl0ZW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAgPSBpdC5zZXAuY29uY2F0KHN0YXJ0LCB0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0LnNlcC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdC5zZXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGl0LCB7IGtleTogbnVsbCwgc2VwOiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpdC52YWx1ZSB8fCBhdE5leHRJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwLml0ZW1zLnB1c2goeyBzdGFydCwga2V5OiBudWxsLCBzZXA6IFt0aGlzLnNvdXJjZVRva2VuXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGluY2x1ZGVzVG9rZW4oaXQuc2VwLCAnbWFwLXZhbHVlLWluZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLW1hcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyBzdGFydDogW10sIGtleTogbnVsbCwgc2VwOiBbdGhpcy5zb3VyY2VUb2tlbl0gfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0LnNlcC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25LZXlMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FsaWFzJzpcbiAgICAgICAgICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3NpbmdsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgICAgICAgICBjYXNlICdkb3VibGUtcXVvdGVkLXNjYWxhcic6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZnMgPSB0aGlzLmZsb3dTY2FsYXIodGhpcy50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0TmV4dEl0ZW0gfHwgaXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHsgc3RhcnQsIGtleTogZnMsIHNlcDogW10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaXQuc2VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goZnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihpdCwgeyBrZXk6IGZzLCBzZXA6IFtdIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBidiA9IHRoaXMuc3RhcnRCbG9ja1ZhbHVlKG1hcCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChidikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJ2LnR5cGUgPT09ICdibG9jay1zZXEnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpdC5leHBsaWNpdEtleSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIWluY2x1ZGVzVG9rZW4oaXQuc2VwLCAnbmV3bGluZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6ICdVbmV4cGVjdGVkIGJsb2NrLXNlcS1pbmQgb24gc2FtZSBsaW5lIHdpdGgga2V5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChhdE1hcEluZGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHsgc3RhcnQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goYnYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICB5aWVsZCogdGhpcy5zdGVwKCk7XG4gICAgfVxuICAgICpibG9ja1NlcXVlbmNlKHNlcSkge1xuICAgICAgICBjb25zdCBpdCA9IHNlcS5pdGVtc1tzZXEuaXRlbXMubGVuZ3RoIC0gMV07XG4gICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICBpZiAoaXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kID0gJ2VuZCcgaW4gaXQudmFsdWUgPyBpdC52YWx1ZS5lbmQgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBBcnJheS5pc0FycmF5KGVuZCkgPyBlbmRbZW5kLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdD8udHlwZSA9PT0gJ2NvbW1lbnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kPy5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXEuaXRlbXMucHVzaCh7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgICAgICBpZiAoaXQudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIHNlcS5pdGVtcy5wdXNoKHsgc3RhcnQ6IFt0aGlzLnNvdXJjZVRva2VuXSB9KTtcbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYXRJbmRlbnRlZENvbW1lbnQoaXQuc3RhcnQsIHNlcS5pbmRlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwcmV2ID0gc2VxLml0ZW1zW3NlcS5pdGVtcy5sZW5ndGggLSAyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZCA9IHByZXY/LnZhbHVlPy5lbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShlbmQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXlQdXNoQXJyYXkoZW5kLCBpdC5zdGFydCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kLnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VxLml0ZW1zLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpdC5zdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlICdhbmNob3InOlxuICAgICAgICAgICAgY2FzZSAndGFnJzpcbiAgICAgICAgICAgICAgICBpZiAoaXQudmFsdWUgfHwgdGhpcy5pbmRlbnQgPD0gc2VxLmluZGVudClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlICdzZXEtaXRlbS1pbmQnOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmluZGVudCAhPT0gc2VxLmluZGVudClcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlIHx8IGluY2x1ZGVzVG9rZW4oaXQuc3RhcnQsICdzZXEtaXRlbS1pbmQnKSlcbiAgICAgICAgICAgICAgICAgICAgc2VxLml0ZW1zLnB1c2goeyBzdGFydDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaW5kZW50ID4gc2VxLmluZGVudCkge1xuICAgICAgICAgICAgY29uc3QgYnYgPSB0aGlzLnN0YXJ0QmxvY2tWYWx1ZShzZXEpO1xuICAgICAgICAgICAgaWYgKGJ2KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKGJ2KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgIHlpZWxkKiB0aGlzLnN0ZXAoKTtcbiAgICB9XG4gICAgKmZsb3dDb2xsZWN0aW9uKGZjKSB7XG4gICAgICAgIGNvbnN0IGl0ID0gZmMuaXRlbXNbZmMuaXRlbXMubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdmbG93LWVycm9yLWVuZCcpIHtcbiAgICAgICAgICAgIGxldCB0b3A7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgICAgICAgICAgdG9wID0gdGhpcy5wZWVrKDEpO1xuICAgICAgICAgICAgfSB3aGlsZSAodG9wPy50eXBlID09PSAnZmxvdy1jb2xsZWN0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZmMuZW5kLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdjb21tYSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnZXhwbGljaXQta2V5LWluZCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXQgfHwgaXQuc2VwKVxuICAgICAgICAgICAgICAgICAgICAgICAgZmMuaXRlbXMucHVzaCh7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBjYXNlICdtYXAtdmFsdWUtaW5kJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdCB8fCBpdC52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGZjLml0ZW1zLnB1c2goeyBzdGFydDogW10sIGtleTogbnVsbCwgc2VwOiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcClcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnNlcC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGl0LCB7IGtleTogbnVsbCwgc2VwOiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnYW5jaG9yJzpcbiAgICAgICAgICAgICAgICBjYXNlICd0YWcnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0IHx8IGl0LnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgZmMuaXRlbXMucHVzaCh7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcClcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnNlcC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5zdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY2FzZSAnYWxpYXMnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3NjYWxhcic6XG4gICAgICAgICAgICAgICAgY2FzZSAnc2luZ2xlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2RvdWJsZS1xdW90ZWQtc2NhbGFyJzoge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcyA9IHRoaXMuZmxvd1NjYWxhcih0aGlzLnR5cGUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0IHx8IGl0LnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICAgICAgZmMuaXRlbXMucHVzaCh7IHN0YXJ0OiBbXSwga2V5OiBmcywgc2VwOiBbXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaXQuc2VwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKGZzKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihpdCwgeyBrZXk6IGZzLCBzZXA6IFtdIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zsb3ctbWFwLWVuZCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnZmxvdy1zZXEtZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgZmMuZW5kLnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGJ2ID0gdGhpcy5zdGFydEJsb2NrVmFsdWUoZmMpO1xuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2Ugc2hvdWxkIG5vdCBoYXBwZW4gKi9cbiAgICAgICAgICAgIGlmIChidilcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goYnYpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMuc3RlcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5wZWVrKDIpO1xuICAgICAgICAgICAgaWYgKHBhcmVudC50eXBlID09PSAnYmxvY2stbWFwJyAmJlxuICAgICAgICAgICAgICAgICgodGhpcy50eXBlID09PSAnbWFwLXZhbHVlLWluZCcgJiYgcGFyZW50LmluZGVudCA9PT0gZmMuaW5kZW50KSB8fFxuICAgICAgICAgICAgICAgICAgICAodGhpcy50eXBlID09PSAnbmV3bGluZScgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFwYXJlbnQuaXRlbXNbcGFyZW50Lml0ZW1zLmxlbmd0aCAtIDFdLnNlcCkpKSB7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMuc3RlcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy50eXBlID09PSAnbWFwLXZhbHVlLWluZCcgJiZcbiAgICAgICAgICAgICAgICBwYXJlbnQudHlwZSAhPT0gJ2Zsb3ctY29sbGVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2ID0gZ2V0UHJldlByb3BzKHBhcmVudCk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBnZXRGaXJzdEtleVN0YXJ0UHJvcHMocHJldik7XG4gICAgICAgICAgICAgICAgZml4Rmxvd1NlcUl0ZW1zKGZjKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZXAgPSBmYy5lbmQuc3BsaWNlKDEsIGZjLmVuZC5sZW5ndGgpO1xuICAgICAgICAgICAgICAgIHNlcC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLW1hcCcsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogZmMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQ6IGZjLmluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7IHN0YXJ0LCBrZXk6IGZjLCBzZXAgfV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMub25LZXlMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV0gPSBtYXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5saW5lRW5kKGZjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmbG93U2NhbGFyKHR5cGUpIHtcbiAgICAgICAgaWYgKHRoaXMub25OZXdMaW5lKSB7XG4gICAgICAgICAgICBsZXQgbmwgPSB0aGlzLnNvdXJjZS5pbmRleE9mKCdcXG4nKSArIDE7XG4gICAgICAgICAgICB3aGlsZSAobmwgIT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTmV3TGluZSh0aGlzLm9mZnNldCArIG5sKTtcbiAgICAgICAgICAgICAgICBubCA9IHRoaXMuc291cmNlLmluZGV4T2YoJ1xcbicsIG5sKSArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgaW5kZW50OiB0aGlzLmluZGVudCxcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2VcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3RhcnRCbG9ja1ZhbHVlKHBhcmVudCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnYWxpYXMnOlxuICAgICAgICAgICAgY2FzZSAnc2NhbGFyJzpcbiAgICAgICAgICAgIGNhc2UgJ3NpbmdsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgICAgIGNhc2UgJ2RvdWJsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5mbG93U2NhbGFyKHRoaXMudHlwZSk7XG4gICAgICAgICAgICBjYXNlICdibG9jay1zY2FsYXItaGVhZGVyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYmxvY2stc2NhbGFyJyxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50OiB0aGlzLmluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgcHJvcHM6IFt0aGlzLnNvdXJjZVRva2VuXSxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiAnJ1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjYXNlICdmbG93LW1hcC1zdGFydCc6XG4gICAgICAgICAgICBjYXNlICdmbG93LXNlcS1zdGFydCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Zsb3ctY29sbGVjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB0aGlzLnNvdXJjZVRva2VuLFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW10sXG4gICAgICAgICAgICAgICAgICAgIGVuZDogW11cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2FzZSAnc2VxLWl0ZW0taW5kJzpcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYmxvY2stc2VxJyxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50OiB0aGlzLmluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0gfV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2FzZSAnZXhwbGljaXQta2V5LWluZCc6IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IGdldFByZXZQcm9wcyhwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gZ2V0Rmlyc3RLZXlTdGFydFByb3BzKHByZXYpO1xuICAgICAgICAgICAgICAgIHN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLW1hcCcsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyBzdGFydCwgZXhwbGljaXRLZXk6IHRydWUgfV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnbWFwLXZhbHVlLWluZCc6IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IGdldFByZXZQcm9wcyhwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gZ2V0Rmlyc3RLZXlTdGFydFByb3BzKHByZXYpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQ6IHRoaXMuaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW3sgc3RhcnQsIGtleTogbnVsbCwgc2VwOiBbdGhpcy5zb3VyY2VUb2tlbl0gfV1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBhdEluZGVudGVkQ29tbWVudChzdGFydCwgaW5kZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgIT09ICdjb21tZW50JylcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuaW5kZW50IDw9IGluZGVudClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHN0YXJ0LmV2ZXJ5KHN0ID0+IHN0LnR5cGUgPT09ICduZXdsaW5lJyB8fCBzdC50eXBlID09PSAnc3BhY2UnKTtcbiAgICB9XG4gICAgKmRvY3VtZW50RW5kKGRvY0VuZCkge1xuICAgICAgICBpZiAodGhpcy50eXBlICE9PSAnZG9jLW1vZGUnKSB7XG4gICAgICAgICAgICBpZiAoZG9jRW5kLmVuZClcbiAgICAgICAgICAgICAgICBkb2NFbmQuZW5kLnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgZG9jRW5kLmVuZCA9IFt0aGlzLnNvdXJjZVRva2VuXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICduZXdsaW5lJylcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAqbGluZUVuZCh0b2tlbikge1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnY29tbWEnOlxuICAgICAgICAgICAgY2FzZSAnZG9jLXN0YXJ0JzpcbiAgICAgICAgICAgIGNhc2UgJ2RvYy1lbmQnOlxuICAgICAgICAgICAgY2FzZSAnZmxvdy1zZXEtZW5kJzpcbiAgICAgICAgICAgIGNhc2UgJ2Zsb3ctbWFwLWVuZCc6XG4gICAgICAgICAgICBjYXNlICdtYXAtdmFsdWUtaW5kJzpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5zdGVwKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gZmFsbHRocm91Z2hcbiAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAvLyBhbGwgb3RoZXIgdmFsdWVzIGFyZSBlcnJvcnNcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4uZW5kKVxuICAgICAgICAgICAgICAgICAgICB0b2tlbi5lbmQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRva2VuLmVuZCA9IFt0aGlzLnNvdXJjZVRva2VuXTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnbmV3bGluZScpXG4gICAgICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBQYXJzZXIgfTtcbiIsICJpbXBvcnQgeyBDb21wb3NlciB9IGZyb20gJy4vY29tcG9zZS9jb21wb3Nlci5qcyc7XG5pbXBvcnQgeyBEb2N1bWVudCB9IGZyb20gJy4vZG9jL0RvY3VtZW50LmpzJztcbmltcG9ydCB7IHByZXR0aWZ5RXJyb3IsIFlBTUxQYXJzZUVycm9yIH0gZnJvbSAnLi9lcnJvcnMuanMnO1xuaW1wb3J0IHsgd2FybiB9IGZyb20gJy4vbG9nLmpzJztcbmltcG9ydCB7IGlzRG9jdW1lbnQgfSBmcm9tICcuL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IExpbmVDb3VudGVyIH0gZnJvbSAnLi9wYXJzZS9saW5lLWNvdW50ZXIuanMnO1xuaW1wb3J0IHsgUGFyc2VyIH0gZnJvbSAnLi9wYXJzZS9wYXJzZXIuanMnO1xuXG5mdW5jdGlvbiBwYXJzZU9wdGlvbnMob3B0aW9ucykge1xuICAgIGNvbnN0IHByZXR0eUVycm9ycyA9IG9wdGlvbnMucHJldHR5RXJyb3JzICE9PSBmYWxzZTtcbiAgICBjb25zdCBsaW5lQ291bnRlciA9IG9wdGlvbnMubGluZUNvdW50ZXIgfHwgKHByZXR0eUVycm9ycyAmJiBuZXcgTGluZUNvdW50ZXIoKSkgfHwgbnVsbDtcbiAgICByZXR1cm4geyBsaW5lQ291bnRlciwgcHJldHR5RXJyb3JzIH07XG59XG4vKipcbiAqIFBhcnNlIHRoZSBpbnB1dCBhcyBhIHN0cmVhbSBvZiBZQU1MIGRvY3VtZW50cy5cbiAqXG4gKiBEb2N1bWVudHMgc2hvdWxkIGJlIHNlcGFyYXRlZCBmcm9tIGVhY2ggb3RoZXIgYnkgYC4uLmAgb3IgYC0tLWAgbWFya2VyIGxpbmVzLlxuICpcbiAqIEByZXR1cm5zIElmIGFuIGVtcHR5IGBkb2NzYCBhcnJheSBpcyByZXR1cm5lZCwgaXQgd2lsbCBiZSBvZiB0eXBlXG4gKiAgIEVtcHR5U3RyZWFtIGFuZCBjb250YWluIGFkZGl0aW9uYWwgc3RyZWFtIGluZm9ybWF0aW9uLiBJblxuICogICBUeXBlU2NyaXB0LCB5b3Ugc2hvdWxkIHVzZSBgJ2VtcHR5JyBpbiBkb2NzYCBhcyBhIHR5cGUgZ3VhcmQgZm9yIGl0LlxuICovXG5mdW5jdGlvbiBwYXJzZUFsbERvY3VtZW50cyhzb3VyY2UsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgbGluZUNvdW50ZXIsIHByZXR0eUVycm9ycyB9ID0gcGFyc2VPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIobGluZUNvdW50ZXI/LmFkZE5ld0xpbmUpO1xuICAgIGNvbnN0IGNvbXBvc2VyID0gbmV3IENvbXBvc2VyKG9wdGlvbnMpO1xuICAgIGNvbnN0IGRvY3MgPSBBcnJheS5mcm9tKGNvbXBvc2VyLmNvbXBvc2UocGFyc2VyLnBhcnNlKHNvdXJjZSkpKTtcbiAgICBpZiAocHJldHR5RXJyb3JzICYmIGxpbmVDb3VudGVyKVxuICAgICAgICBmb3IgKGNvbnN0IGRvYyBvZiBkb2NzKSB7XG4gICAgICAgICAgICBkb2MuZXJyb3JzLmZvckVhY2gocHJldHRpZnlFcnJvcihzb3VyY2UsIGxpbmVDb3VudGVyKSk7XG4gICAgICAgICAgICBkb2Mud2FybmluZ3MuZm9yRWFjaChwcmV0dGlmeUVycm9yKHNvdXJjZSwgbGluZUNvdW50ZXIpKTtcbiAgICAgICAgfVxuICAgIGlmIChkb2NzLmxlbmd0aCA+IDApXG4gICAgICAgIHJldHVybiBkb2NzO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKFtdLCB7IGVtcHR5OiB0cnVlIH0sIGNvbXBvc2VyLnN0cmVhbUluZm8oKSk7XG59XG4vKiogUGFyc2UgYW4gaW5wdXQgc3RyaW5nIGludG8gYSBzaW5nbGUgWUFNTC5Eb2N1bWVudCAqL1xuZnVuY3Rpb24gcGFyc2VEb2N1bWVudChzb3VyY2UsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHsgbGluZUNvdW50ZXIsIHByZXR0eUVycm9ycyB9ID0gcGFyc2VPcHRpb25zKG9wdGlvbnMpO1xuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIobGluZUNvdW50ZXI/LmFkZE5ld0xpbmUpO1xuICAgIGNvbnN0IGNvbXBvc2VyID0gbmV3IENvbXBvc2VyKG9wdGlvbnMpO1xuICAgIC8vIGBkb2NgIGlzIGFsd2F5cyBzZXQgYnkgY29tcG9zZS5lbmQodHJ1ZSkgYXQgdGhlIHZlcnkgbGF0ZXN0XG4gICAgbGV0IGRvYyA9IG51bGw7XG4gICAgZm9yIChjb25zdCBfZG9jIG9mIGNvbXBvc2VyLmNvbXBvc2UocGFyc2VyLnBhcnNlKHNvdXJjZSksIHRydWUsIHNvdXJjZS5sZW5ndGgpKSB7XG4gICAgICAgIGlmICghZG9jKVxuICAgICAgICAgICAgZG9jID0gX2RvYztcbiAgICAgICAgZWxzZSBpZiAoZG9jLm9wdGlvbnMubG9nTGV2ZWwgIT09ICdzaWxlbnQnKSB7XG4gICAgICAgICAgICBkb2MuZXJyb3JzLnB1c2gobmV3IFlBTUxQYXJzZUVycm9yKF9kb2MucmFuZ2Uuc2xpY2UoMCwgMiksICdNVUxUSVBMRV9ET0NTJywgJ1NvdXJjZSBjb250YWlucyBtdWx0aXBsZSBkb2N1bWVudHM7IHBsZWFzZSB1c2UgWUFNTC5wYXJzZUFsbERvY3VtZW50cygpJykpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByZXR0eUVycm9ycyAmJiBsaW5lQ291bnRlcikge1xuICAgICAgICBkb2MuZXJyb3JzLmZvckVhY2gocHJldHRpZnlFcnJvcihzb3VyY2UsIGxpbmVDb3VudGVyKSk7XG4gICAgICAgIGRvYy53YXJuaW5ncy5mb3JFYWNoKHByZXR0aWZ5RXJyb3Ioc291cmNlLCBsaW5lQ291bnRlcikpO1xuICAgIH1cbiAgICByZXR1cm4gZG9jO1xufVxuZnVuY3Rpb24gcGFyc2Uoc3JjLCByZXZpdmVyLCBvcHRpb25zKSB7XG4gICAgbGV0IF9yZXZpdmVyID0gdW5kZWZpbmVkO1xuICAgIGlmICh0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBfcmV2aXZlciA9IHJldml2ZXI7XG4gICAgfVxuICAgIGVsc2UgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCAmJiByZXZpdmVyICYmIHR5cGVvZiByZXZpdmVyID09PSAnb2JqZWN0Jykge1xuICAgICAgICBvcHRpb25zID0gcmV2aXZlcjtcbiAgICB9XG4gICAgY29uc3QgZG9jID0gcGFyc2VEb2N1bWVudChzcmMsIG9wdGlvbnMpO1xuICAgIGlmICghZG9jKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICBkb2Mud2FybmluZ3MuZm9yRWFjaCh3YXJuaW5nID0+IHdhcm4oZG9jLm9wdGlvbnMubG9nTGV2ZWwsIHdhcm5pbmcpKTtcbiAgICBpZiAoZG9jLmVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChkb2Mub3B0aW9ucy5sb2dMZXZlbCAhPT0gJ3NpbGVudCcpXG4gICAgICAgICAgICB0aHJvdyBkb2MuZXJyb3JzWzBdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBkb2MuZXJyb3JzID0gW107XG4gICAgfVxuICAgIHJldHVybiBkb2MudG9KUyhPYmplY3QuYXNzaWduKHsgcmV2aXZlcjogX3Jldml2ZXIgfSwgb3B0aW9ucykpO1xufVxuZnVuY3Rpb24gc3RyaW5naWZ5KHZhbHVlLCByZXBsYWNlciwgb3B0aW9ucykge1xuICAgIGxldCBfcmVwbGFjZXIgPSBudWxsO1xuICAgIGlmICh0eXBlb2YgcmVwbGFjZXIgPT09ICdmdW5jdGlvbicgfHwgQXJyYXkuaXNBcnJheShyZXBsYWNlcikpIHtcbiAgICAgICAgX3JlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgfVxuICAgIGVsc2UgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCAmJiByZXBsYWNlcikge1xuICAgICAgICBvcHRpb25zID0gcmVwbGFjZXI7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zLmxlbmd0aDtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbnN0IGluZGVudCA9IE1hdGgucm91bmQob3B0aW9ucyk7XG4gICAgICAgIG9wdGlvbnMgPSBpbmRlbnQgPCAxID8gdW5kZWZpbmVkIDogaW5kZW50ID4gOCA/IHsgaW5kZW50OiA4IH0gOiB7IGluZGVudCB9O1xuICAgIH1cbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCB7IGtlZXBVbmRlZmluZWQgfSA9IG9wdGlvbnMgPz8gcmVwbGFjZXIgPz8ge307XG4gICAgICAgIGlmICgha2VlcFVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmIChpc0RvY3VtZW50KHZhbHVlKSAmJiAhX3JlcGxhY2VyKVxuICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcob3B0aW9ucyk7XG4gICAgcmV0dXJuIG5ldyBEb2N1bWVudCh2YWx1ZSwgX3JlcGxhY2VyLCBvcHRpb25zKS50b1N0cmluZyhvcHRpb25zKTtcbn1cblxuZXhwb3J0IHsgcGFyc2UsIHBhcnNlQWxsRG9jdW1lbnRzLCBwYXJzZURvY3VtZW50LCBzdHJpbmdpZnkgfTtcbiIsICIvKipcbiAqIFlBTUwgZnJvbnRtYXR0ZXIgaW5qZWN0aW9uIHV0aWxpdHkuXG4gKiBOb24tZGVzdHJ1Y3RpdmU6IHByZXNlcnZlcyBleGlzdGluZyBmcm9udG1hdHRlciBhbmQgYm9keSB0ZXh0LlxuICogQURSLTAwMzogSHlicmlkIEFzc2V0IE5vdGVzXG4gKi9cblxuaW1wb3J0IHsgcGFyc2UgYXMgcGFyc2VZYW1sIH0gZnJvbSBcInlhbWxcIjtcblxuZXhwb3J0IGludGVyZmFjZSBBdWRpb01ldGFkYXRhIHtcbiAgYXVkaW9fc291cmNlPzogc3RyaW5nO1xuICBrZXk/OiBzdHJpbmc7XG4gIGtleV9jb25maXJtZWQ/OiBib29sZWFuO1xuICB0ZW1wbz86IG51bWJlcjtcbiAgdGVtcG9fY29uZmlybWVkPzogYm9vbGVhbjtcbiAgcmF3X3RlbXBvPzogbnVtYmVyO1xuICBhbHRlcm5hdGVfdGVtcG8/OiBudW1iZXI7XG4gIHRpbWVfc2lnbmF0dXJlPzogc3RyaW5nO1xuICBkdXJhdGlvbj86IHN0cmluZztcbiAgdG90YWxfYmFycz86IG51bWJlcjtcbiAgYXVkaW9fc3RhcnRfb2Zmc2V0PzogbnVtYmVyO1xuICBhbmFseXNpc19jb25maWRlbmNlPzogbnVtYmVyOyAvLyBERVBSRUNBVEVEIFx1MjAxNCBkbyBub3QgZGlzcGxheSBhcyB0cnVzdCBtZXRyaWNcbiAgc3RydWN0dXJlPzogQXJyYXk8e1xuICAgIHNlZ21lbnQ6IHN0cmluZztcbiAgICBiYXJzOiBbbnVtYmVyLCBudW1iZXJdO1xuICAgIHRpbWU6IFtzdHJpbmcsIHN0cmluZ107XG4gIH0+O1xuICBhcnRpc3Q/OiBzdHJpbmdbXTtcbiAgcHJvZHVjZXI/OiBzdHJpbmdbXTtcbiAgbWl4ZXI/OiBzdHJpbmdbXTtcbiAgZW5naW5lZXI/OiBzdHJpbmdbXTtcbiAgbXVzaWNpYW5zPzogc3RyaW5nW107XG4gIHByb2R1Y2VyX2luc3RhZ3JhbT86IHN0cmluZ1tdO1xuICBzb3VyY2VfdXJsPzogc3RyaW5nO1xuICBsaWNlbnNlX3N0YXR1cz86IHN0cmluZztcbn1cblxuLyoqIFNlcmlhbGl6ZSBhbnkgdmFsdWUgdG8gWUFNTCBzdHJpbmcuICovXG5mdW5jdGlvbiBzZXJpYWxpemVWYWx1ZSh2YWw6IHVua25vd24sIGluZGVudCA9IDApOiBzdHJpbmcge1xuICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgaWYgKHR5cGVvZiB2YWwgPT09IFwiYm9vbGVhblwiKSByZXR1cm4gU3RyaW5nKHZhbCk7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcIm51bWJlclwiKSByZXR1cm4gU3RyaW5nKHZhbCk7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSByZXR1cm4gXCJbXVwiO1xuXG4gICAgLy8gQXJyYXkgb2Ygb2JqZWN0czogYmxvY2sgZm9ybSAoc3RydWN0dXJlIHNlZ21lbnRzKVxuICAgIGlmICh2YWwuZXZlcnkoKHYpID0+IHYgIT09IG51bGwgJiYgdHlwZW9mIHYgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkodikpKSB7XG4gICAgICBjb25zdCBwYWQgPSBcIiAgXCIucmVwZWF0KGluZGVudCk7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBcIlxcblwiICtcbiAgICAgICAgdmFsXG4gICAgICAgICAgLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKGl0ZW0gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pXG4gICAgICAgICAgICAgIC5tYXAoKFtrMiwgdjJdKSA9PiBgJHtwYWR9ICAgICR7azJ9OiAke3NlcmlhbGl6ZVZhbHVlKHYyLCBpbmRlbnQgKyAyKX1gKVxuICAgICAgICAgICAgICAuam9pbihcIlxcblwiKTtcbiAgICAgICAgICAgIHJldHVybiBgJHtwYWR9ICAtXFxuJHtlbnRyaWVzfWA7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuam9pbihcIlxcblwiKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBQcmltaXRpdmUgYXJyYXk6IGNvbXBhY3QgaW5saW5lIGZvcm1cbiAgICBjb25zdCBpdGVtcyA9IHZhbC5tYXAoKHYpID0+IHNlcmlhbGl6ZVNjYWxhcih2KSk7XG4gICAgcmV0dXJuIGBbJHtpdGVtcy5qb2luKFwiLCBcIil9XWA7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIikge1xuICAgIGNvbnN0IHBhZCA9IFwiICBcIi5yZXBlYXQoaW5kZW50KTtcbiAgICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXModmFsIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVxuICAgICAgLm1hcCgoW2syLCB2Ml0pID0+IGAke3BhZH0gICR7azJ9OiAke3NlcmlhbGl6ZVZhbHVlKHYyLCBpbmRlbnQgKyAxKX1gKTtcbiAgICByZXR1cm4gXCJcXG5cIiArIGVudHJpZXMuam9pbihcIlxcblwiKTtcbiAgfVxuXG4gIHJldHVybiBzZXJpYWxpemVTY2FsYXIodmFsKTtcbn1cblxuLyoqIFF1b3RlIGEgc2NhbGFyIGlmIGl0IGNvbnRhaW5zIFlBTUwtc3BlY2lhbCBjaGFyYWN0ZXJzLiAqL1xuZnVuY3Rpb24gc2VyaWFsaXplU2NhbGFyKHZhbDogdW5rbm93bik6IHN0cmluZyB7XG4gIGlmICh2YWwgPT09IG51bGwgfHwgdmFsID09PSB1bmRlZmluZWQpIHJldHVybiBcIlwiO1xuICBpZiAodHlwZW9mIHZhbCA9PT0gXCJib29sZWFuXCIgfHwgdHlwZW9mIHZhbCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIFN0cmluZyh2YWwpO1xuXG4gIGNvbnN0IHN0ciA9IFN0cmluZyh2YWwpO1xuXG4gIGNvbnN0IG5lZWRzUXVvdGVzID1cbiAgICBzdHIgPT09IFwiXCIgfHxcbiAgICBzdHIuaW5jbHVkZXMoXCI6XCIpIHx8XG4gICAgc3RyLmluY2x1ZGVzKFwiI1wiKSB8fFxuICAgIHN0ci5pbmNsdWRlcyhcIlxcblwiKSB8fFxuICAgIHN0ci5pbmNsdWRlcygnXCInKSB8fFxuICAgIHN0ci5zdGFydHNXaXRoKFwiLVwiKSB8fFxuICAgIHN0ci5zdGFydHNXaXRoKFwiW1wiKSB8fFxuICAgIHN0ci5zdGFydHNXaXRoKFwie1wiKSB8fFxuICAgIHN0ciA9PT0gXCJ0cnVlXCIgfHxcbiAgICBzdHIgPT09IFwiZmFsc2VcIiB8fFxuICAgIHN0ciA9PT0gXCJudWxsXCIgfHxcbiAgICBzdHIgPT09IFwiflwiO1xuXG4gIGlmIChuZWVkc1F1b3Rlcykge1xuICAgIHJldHVybiBgXCIke3N0ci5yZXBsYWNlKC9cXFxcL2csIFwiXFxcXFxcXFxcIikucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpfVwiYDtcbiAgfVxuICByZXR1cm4gc3RyO1xufVxuXG5jb25zdCBGUk9OVE1BVFRFUl9ERUxJTUlURVIgPSAvXi0tLVxccypcXG4oW1xcc1xcU10qPylcXG4tLS1cXHMqXFxuPy87XG5cbmV4cG9ydCBmdW5jdGlvbiBpbmplY3RGcm9udG1hdHRlcihcbiAgY29udGVudDogc3RyaW5nLFxuICBtZXRhZGF0YTogQXVkaW9NZXRhZGF0YSxcbik6IHN0cmluZyB7XG4gIGNvbnN0IG1hdGNoID0gRlJPTlRNQVRURVJfREVMSU1JVEVSLmV4ZWMoY29udGVudCk7XG5cbiAgbGV0IGV4aXN0aW5nOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICBsZXQgYm9keSA9IGNvbnRlbnQ7XG5cbiAgaWYgKG1hdGNoKSB7XG4gICAgY29uc3QgeWFtbEJsb2NrID0gbWF0Y2hbMV07XG4gICAgdHJ5IHtcbiAgICAgIGV4aXN0aW5nID0gcGFyc2VZYW1sKHlhbWxCbG9jaykgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfHwge307XG4gICAgfSBjYXRjaCB7XG4gICAgICBleGlzdGluZyA9IHt9O1xuICAgIH1cbiAgICBib2R5ID0gY29udGVudC5zbGljZShtYXRjaFswXS5sZW5ndGgpO1xuICB9XG5cbiAgLy8gTWVyZ2U6IG1ldGFkYXRhIHdpbnMgb3ZlciBleGlzdGluZyBmb3Igb3VyIGtleXNcbiAgY29uc3QgbWVyZ2VkID0gY2xlYW5VbmRlZmluZWQoeyAuLi5leGlzdGluZywgLi4ubWV0YWRhdGEgfSk7XG5cbiAgY29uc3QgbGluZXMgPSBPYmplY3QuZW50cmllcyhtZXJnZWQpXG4gICAgLm1hcCgoW2ssIHZdKSA9PiBgJHtrfTogJHtzZXJpYWxpemVWYWx1ZSh2KX1gKTtcblxuICBpZiAobGluZXMubGVuZ3RoID09PSAwKSByZXR1cm4gY29udGVudDtcblxuICBjb25zdCBuZXdGcm9udCA9IGAtLS1cXG4ke2xpbmVzLmpvaW4oXCJcXG5cIil9XFxuLS0tXFxuYDtcbiAgcmV0dXJuIG5ld0Zyb250ICsgYm9keTtcbn1cblxuLyoqIFN0cmlwIHVuZGVmaW5lZCB2YWx1ZXMgc28gdGhleSBkb24ndCBzZXJpYWxpemUuICovXG5mdW5jdGlvbiBjbGVhblVuZGVmaW5lZChvYmo6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG4gIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKG9iaikpIHtcbiAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSBvdXRba10gPSB2O1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG5cbi8qKiBQYXJzZSBmcm9udG1hdHRlciBmcm9tIHJhdyBub3RlIGNvbnRlbnQgdXNlZCBieSBkYXNoYm9hcmQtcHJvY2Vzc29yLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRnJvbnRtYXR0ZXIocmF3OiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IG1hdGNoID0gRlJPTlRNQVRURVJfREVMSU1JVEVSLmV4ZWMocmF3KTtcbiAgaWYgKCFtYXRjaCkgcmV0dXJuIHt9O1xuICB0cnkge1xuICAgIHJldHVybiBwYXJzZVlhbWwobWF0Y2hbMV0pIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+IHx8IHt9O1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4ge307XG4gIH1cbn1cbiIsICIvLyBBbmFseXNpc0NvbmZpcm1Nb2RhbCBcdTIwMTQgb3BlbnMgb24tZGVtYW5kIHdoZW4gdXNlciBjbGlja3MgYW4gdW5jb25maXJtZWQgdmFsdWUuXG4vLyBVc2VzIEJwbUNvbnRyb2wgKyBLZXlDb250cm9sIChyZXVzYWJsZSBpbiBkYXNoYm9hcmQgbGF0ZXIpLlxuLy9cbi8vIENTUyBjbGFzcyBob29rczpcbi8vICAubWFtLWNvbmZpcm0tbW9kYWwgICAgICAgXHUyMDE0IE1vZGFsIHJvb3Rcbi8vICAubWFtLW1vZGFsLWhlYWRlciAgICAgICAgXHUyMDE0IFRpdGxlIGFyZWFcbi8vICAubWFtLW1vZGFsLWJvZHkgICAgICAgICAgXHUyMDE0IENvbnRyb2xzIGNvbnRhaW5lclxuLy8gIC5tYW0tbW9kYWwtc2VjdGlvbiAgICAgICBcdTIwMTQgQlBNIC8gS2V5IHNlY3Rpb24gd3JhcHBlclxuLy8gIC5tYW0tbW9kYWwtc2VjdGlvbi1sYWJlbCBcdTIwMTQgXCJUZW1wb1wiIC8gXCJLZXlcIiBsYWJlbFxuLy8gIC5tYW0tbW9kYWwtZm9vdGVyICAgICAgICBcdTIwMTQgU2F2ZSAvIENhbmNlbCBhY3Rpb25zXG4vLyAgLm1hbS1idG4tc2F2ZSAgICAgICAgICAgIFx1MjAxNCBDb21taXQgY2hhbmdlc1xuLy8gIC5tYW0tYnRuLWNhbmNlbCAgICAgICAgICBcdTIwMTQgRGlzY2FyZCBjaGFuZ2VzXG5cbmltcG9ydCB7IE1vZGFsLCBBcHAgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IEJwbUNvbnRyb2wsIEJwbUNvbnRyb2xTdGF0ZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL2JwbS1jb250cm9sXCI7XG5pbXBvcnQgeyBLZXlDb250cm9sLCBLZXlDb250cm9sU3RhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9rZXktY29udHJvbFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpcm1Nb2RhbERhdGEge1xuICBmaWxlTmFtZTogc3RyaW5nO1xuICBicG06IEJwbUNvbnRyb2xTdGF0ZTtcbiAga2V5OiBLZXlDb250cm9sU3RhdGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlybU1vZGFsQ2FsbGJhY2tzIHtcbiAgb25TYXZlOiAoZGF0YTogeyBicG06IEJwbUNvbnRyb2xTdGF0ZTsga2V5OiBLZXlDb250cm9sU3RhdGUgfSkgPT4gdm9pZDtcbiAgb25DYW5jZWw/OiAoKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgQW5hbHlzaXNDb25maXJtTW9kYWwgZXh0ZW5kcyBNb2RhbCB7XG4gIHByaXZhdGUgZGF0YTogQ29uZmlybU1vZGFsRGF0YTtcbiAgcHJpdmF0ZSBjYWxsYmFja3M6IENvbmZpcm1Nb2RhbENhbGxiYWNrcztcbiAgcHJpdmF0ZSBicG1Db250cm9sPzogQnBtQ29udHJvbDtcbiAgcHJpdmF0ZSBrZXlDb250cm9sPzogS2V5Q29udHJvbDtcblxuICBjb25zdHJ1Y3RvcihhcHA6IEFwcCwgZGF0YTogQ29uZmlybU1vZGFsRGF0YSwgY2FsbGJhY2tzOiBDb25maXJtTW9kYWxDYWxsYmFja3MpIHtcbiAgICBzdXBlcihhcHApO1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5jYWxsYmFja3MgPSBjYWxsYmFja3M7XG4gIH1cblxuICBvbk9wZW4oKSB7XG4gICAgY29uc3QgeyBjb250ZW50RWwgfSA9IHRoaXM7XG4gICAgY29udGVudEVsLmFkZENsYXNzKFwibWFtLWNvbmZpcm0tbW9kYWxcIik7XG5cbiAgICAvLyBIZWFkZXJcbiAgICBjb25zdCBoZWFkZXIgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1tb2RhbC1oZWFkZXJcIiB9KTtcbiAgICBoZWFkZXIuY3JlYXRlRWwoXCJoMlwiLCB7IHRleHQ6IGBDb25maXJtIGFuYWx5c2lzOiAke3RoaXMuZGF0YS5maWxlTmFtZX1gIH0pO1xuICAgIGhlYWRlci5jcmVhdGVFbChcInBcIiwge1xuICAgICAgdGV4dDogXCJUYXAgb3IgZWRpdCB2YWx1ZXMgYmVsb3cuIE1hcmsgY29uZmlybWVkIG9ubHkgd2hlbiB0aGV5IG1hdGNoIHlvdXIgZWFycy5cIixcbiAgICAgIGNsczogXCJzZXR0aW5nLWl0ZW0tZGVzY3JpcHRpb25cIixcbiAgICB9KTtcblxuICAgIGNvbnN0IGJvZHkgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1tb2RhbC1ib2R5XCIgfSk7XG5cbiAgICAvLyBCUE0gc2VjdGlvblxuICAgIGNvbnN0IGJwbVNlY3Rpb24gPSBib2R5LmNyZWF0ZURpdih7IGNsczogXCJtYW0tbW9kYWwtc2VjdGlvblwiIH0pO1xuICAgIGJwbVNlY3Rpb24uY3JlYXRlRWwoXCJoM1wiLCB7IGNsczogXCJtYW0tbW9kYWwtc2VjdGlvbi1sYWJlbFwiLCB0ZXh0OiBcIlRlbXBvXCIgfSk7XG4gICAgdGhpcy5icG1Db250cm9sID0gbmV3IEJwbUNvbnRyb2woYnBtU2VjdGlvbiwgdGhpcy5kYXRhLmJwbSwge1xuICAgICAgb25DaGFuZ2U6IChicG0pID0+IHtcbiAgICAgICAgLy8gTGl2ZSB1cGRhdGUgaWYgbmVlZGVkIChlLmcuLCBzeW5jIHdpdGggbm90ZSBwcmV2aWV3KVxuICAgICAgfSxcbiAgICAgIG9uQ29uZmlybWVkOiAoKSA9PiB7XG4gICAgICAgIC8vIE9wdGlvbmFsOiBhdXRvLWVuYWJsZSBrZXkgY29uZmlybSB3aGVuIGJvdGggYXJlIGNsb3NlXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gS2V5IHNlY3Rpb25cbiAgICBjb25zdCBrZXlTZWN0aW9uID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLW1vZGFsLXNlY3Rpb25cIiB9KTtcbiAgICBrZXlTZWN0aW9uLmNyZWF0ZUVsKFwiaDNcIiwgeyBjbHM6IFwibWFtLW1vZGFsLXNlY3Rpb24tbGFiZWxcIiwgdGV4dDogXCJLZXlcIiB9KTtcbiAgICB0aGlzLmtleUNvbnRyb2wgPSBuZXcgS2V5Q29udHJvbChrZXlTZWN0aW9uLCB0aGlzLmRhdGEua2V5LCB7XG4gICAgICBvbkNoYW5nZTogKGtleSwgc2NhbGUpID0+IHtcbiAgICAgICAgLy8gTGl2ZSB1cGRhdGVcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBGb290ZXI6IFNhdmUgLyBDYW5jZWxcbiAgICBjb25zdCBmb290ZXIgPSBjb250ZW50RWwuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1tb2RhbC1mb290ZXJcIiB9KTtcblxuICAgIGNvbnN0IGJ0blNhdmUgPSBmb290ZXIuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwibWFtLWJ0bi1zYXZlIG1vZC1jdGFcIiwgdGV4dDogXCJTYXZlXCIgfSk7XG4gICAgYnRuU2F2ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuYnBtQ29udHJvbCAmJiB0aGlzLmtleUNvbnRyb2wpIHtcbiAgICAgICAgdGhpcy5jYWxsYmFja3Mub25TYXZlKHtcbiAgICAgICAgICBicG06IHRoaXMuYnBtQ29udHJvbC5nZXRTdGF0ZSgpLFxuICAgICAgICAgIGtleTogdGhpcy5rZXlDb250cm9sLmdldFN0YXRlKCksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYnRuQ2FuY2VsID0gZm9vdGVyLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIm1hbS1idG4tY2FuY2VsXCIsIHRleHQ6IFwiQ2FuY2VsXCIgfSk7XG4gICAgYnRuQ2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICB0aGlzLmNhbGxiYWNrcy5vbkNhbmNlbD8uKCk7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSk7XG4gIH1cblxuICBvbkNsb3NlKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5lbXB0eSgpO1xuICB9XG59XG4iLCAiLy8gVGFwLXRlbXBvIGNvbnRyb2xsZXIgXHUyMDE0IGF2ZXJhZ2VzIHRoZSBsYXN0IE4gaW50ZXItdGFwIGludGVydmFscy5cbi8vIFVzZWQgYnkgQlBNQ29udHJvbCAobW9kYWwgKyBkYXNoYm9hcmQpLlxuXG5leHBvcnQgaW50ZXJmYWNlIFRhcFRlbXBvQ2FsbGJhY2tzIHtcbiAgb25CcG1DaGFuZ2U/OiAoYnBtOiBudW1iZXIpID0+IHZvaWQ7XG4gIG9uVGFwPzogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFRhcFRlbXBvQ29udHJvbGxlciB7XG4gIHByaXZhdGUgdGltZXM6IG51bWJlcltdID0gW107XG4gIHByaXZhdGUgbWF4VGFwczogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IHsgbWF4VGFwcz86IG51bWJlciB9ID0ge30pIHtcbiAgICB0aGlzLm1heFRhcHMgPSBvcHRzLm1heFRhcHMgPz8gODtcbiAgfVxuXG4gIC8qKiBDYWxsIG9uIGV2ZXJ5IHRhcC4gUmV0dXJucyB0aGUgY3VycmVudCBlc3RpbWF0ZWQgQlBNIG9yIG51bGwgaWYgbm90IGVub3VnaCBkYXRhLiAqL1xuICB0YXAoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgdGhpcy50aW1lcy5wdXNoKG5vdyk7XG5cbiAgICBpZiAodGhpcy50aW1lcy5sZW5ndGggPiB0aGlzLm1heFRhcHMpIHtcbiAgICAgIHRoaXMudGltZXMuc2hpZnQoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50aW1lcy5sZW5ndGggPCAyKSByZXR1cm4gbnVsbDtcblxuICAgIC8vIFVzZSB0aGUgbGFzdCB1cC10by0obWF4VGFwcy0xKSBpbnRlcnZhbHNcbiAgICBjb25zdCBpbnRlcnZhbHM6IG51bWJlcltdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnRpbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpbnRlcnZhbHMucHVzaCh0aGlzLnRpbWVzW2ldIC0gdGhpcy50aW1lc1tpIC0gMV0pO1xuICAgIH1cblxuICAgIGNvbnN0IGF2ZyA9IGludGVydmFscy5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKSAvIGludGVydmFscy5sZW5ndGg7XG4gICAgaWYgKGF2ZyA8PSAwKSByZXR1cm4gbnVsbDtcblxuICAgIGNvbnN0IGJwbSA9IE1hdGgucm91bmQoNjAwMDAgLyBhdmcpO1xuICAgIC8vIFNhbml0eSBjbGFtcFxuICAgIGlmIChicG0gPCBNSU5fU0FORSB8fCBicG0gPiBNQVhfU0FORSkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGJwbTtcbiAgfVxuXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMudGltZXMgPSBbXTtcbiAgfVxufVxuXG5jb25zdCBNSU5fU0FORSA9IDYwO1xuY29uc3QgTUFYX1NBTkUgPSAyMDA7XG4iLCAiLy8gQlBNQ29udHJvbCBcdTIwMTQgcmV1c2FibGUgdGVtcG8gd2lkZ2V0IGZvciBtb2RhbCArIGRhc2hib2FyZC5cbi8vIENTUyBjbGFzcyBob29rcyAoZm9yIHRoZW1pbmcgYnkgdXNlcik6XG4vLyAgLmJwbS1jb250cm9sICAgICAgICAgIFx1MjAxNCByb290IGNvbnRhaW5lclxuLy8gIC5icG0tdmFsdWUgICAgICAgICAgICBcdTIwMTQgY3VycmVudCBkaXNwbGF5ZWQgQlBNXG4vLyAgLmJwbS1yYXcgICAgICAgICAgICAgIFx1MjAxNCByYXcgZGV0ZWN0IChzbWFsbCwgbXV0ZWQpXG4vLyAgLmJwbS1hbHRlcm5hdGUgICAgICAgIFx1MjAxNCBoYWxmL2RvdWJsZSBhbHRlcm5hdGUgdmFsdWVcbi8vICAuYnBtLWJ0bi1oYWx2ZSAgICAgICAgXHUyMDE0IGhhbHZlIGJ1dHRvblxuLy8gIC5icG0tYnRuLWRvdWJsZSAgICAgICBcdTIwMTQgZG91YmxlIGJ1dHRvblxuLy8gIC5icG0tYnRuLXRhcCAgICAgICAgICBcdTIwMTQgdGFwLXRlbXBvIGJ1dHRvblxuLy8gIC5icG0tYnRuLXRhcC1hY3RpdmUgICBcdTIwMTQgdGFwcGVkIHJlY2VudGx5IChicmllZiBmbGFzaClcbi8vICAuYnBtLWlucHV0ICAgICAgICAgICAgXHUyMDE0IG1hbnVhbCBCUE0gaW5wdXQgKGlubGluZSBlZGl0KVxuLy8gIC5icG0tY29uZmlybWVkICAgICAgICBcdTIwMTQgY29uZmlybWVkIHN0YXRlIGZsYWdcbi8vICAuYnBtLXVuY29uZmlybWVkICAgICAgXHUyMDE0IHVuY29uZmlybWVkIHN0YXRlIGZsYWdcblxuaW1wb3J0IHsgVGFwVGVtcG9Db250cm9sbGVyIH0gZnJvbSBcIi4vdGFwLXRlbXBvXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnBtQ29udHJvbENhbGxiYWNrcyB7XG4gIG9uQ2hhbmdlPzogKGJwbTogbnVtYmVyKSA9PiB2b2lkO1xuICBvbkNvbmZpcm1lZD86IChjb25maXJtZWQ6IGJvb2xlYW4pID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQnBtQ29udHJvbFN0YXRlIHtcbiAgYnBtOiBudW1iZXI7XG4gIHJhd0JwbTogbnVtYmVyO1xuICBhbHRlcm5hdGVCcG0/OiBudW1iZXI7XG4gIGNvbmZpcm1lZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEJwbUNvbnRyb2wge1xuICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgc3RhdGU6IEJwbUNvbnRyb2xTdGF0ZTtcbiAgcHJpdmF0ZSBjYWxsYmFja3M6IEJwbUNvbnRyb2xDYWxsYmFja3M7XG4gIHByaXZhdGUgdGFwQ29udHJvbGxlcjogVGFwVGVtcG9Db250cm9sbGVyO1xuICBwcml2YXRlIHRhcEZsYXNoVGltZW91dD86IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHBhcmVudDogSFRNTEVsZW1lbnQsXG4gICAgaW5pdGlhbDogQnBtQ29udHJvbFN0YXRlLFxuICAgIGNhbGxiYWNrczogQnBtQ29udHJvbENhbGxiYWNrcyA9IHt9LFxuICApIHtcbiAgICB0aGlzLnN0YXRlID0geyAuLi5pbml0aWFsIH07XG4gICAgdGhpcy5jYWxsYmFja3MgPSBjYWxsYmFja3M7XG4gICAgdGhpcy50YXBDb250cm9sbGVyID0gbmV3IFRhcFRlbXBvQ29udHJvbGxlcih7IG1heFRhcHM6IDggfSk7XG4gICAgdGhpcy5jb250YWluZXIgPSB0aGlzLmJ1aWxkKHBhcmVudCk7XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkKHBhcmVudDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qgcm9vdCA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwiYnBtLWNvbnRyb2xcIiB9KTtcblxuICAgIC8vIFZhbHVlIHJvdzogY3VycmVudCBCUE0gKyByYXcgQlBNXG4gICAgY29uc3QgdmFsdWVSb3cgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJicG0tdmFsdWUtcm93XCIgfSk7XG4gICAgdGhpcy5yZW5kZXJWYWx1ZSh2YWx1ZVJvdyk7XG5cbiAgICAvLyBBbHRlcm5hdGUgc3VnZ2VzdGlvblxuICAgIGlmICh0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbSkge1xuICAgICAgY29uc3QgYWx0ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwiYnBtLWFsdGVybmF0ZS1yb3dcIiB9KTtcbiAgICAgIGNvbnN0IGFsdEJ0biA9IGFsdC5jcmVhdGVFbChcImJ1dHRvblwiLCB7XG4gICAgICAgIGNsczogXCJicG0tYWx0ZXJuYXRlXCIsXG4gICAgICAgIHRleHQ6IGBvciAke3RoaXMuc3RhdGUuYWx0ZXJuYXRlQnBtfT9gLFxuICAgICAgfSk7XG4gICAgICBhbHRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuYWNjZXB0QWx0ZXJuYXRlKCkpO1xuICAgIH1cblxuICAgIC8vIEFjdGlvbiByb3c6IGhhbHZlIHwgZG91YmxlIHwgdGFwXG4gICAgY29uc3QgYWN0aW9ucyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImJwbS1hY3Rpb25zXCIgfSk7XG5cbiAgICBjb25zdCBidG5IYWx2ZSA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwiYnBtLWJ0bi1oYWx2ZVwiLCB0ZXh0OiBcIlx1MDBCRFwiIH0pO1xuICAgIGJ0bkhhbHZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNldEJwbShNYXRoLnJvdW5kKHRoaXMuc3RhdGUuYnBtIC8gMikpKTtcblxuICAgIGNvbnN0IGJ0bkRvdWJsZSA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwiYnBtLWJ0bi1kb3VibGVcIiwgdGV4dDogXCJcdTAwRDcyXCIgfSk7XG4gICAgYnRuRG91YmxlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNldEJwbSh0aGlzLnN0YXRlLmJwbSAqIDIpKTtcblxuICAgIGNvbnN0IGJ0blRhcCA9IGFjdGlvbnMuY3JlYXRlRWwoXCJidXR0b25cIiwgeyBjbHM6IFwiYnBtLWJ0bi10YXBcIiwgdGV4dDogXCJUYXAgdGVtcG9cIiB9KTtcbiAgICBidG5UYXAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMub25UYXAoYnRuVGFwKSk7XG5cbiAgICAvLyBDb25maXJtIHRvZ2dsZVxuICAgIGNvbnN0IGNvbmZpcm1Sb3cgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJicG0tY29uZmlybS1yb3dcIiB9KTtcbiAgICBjb25zdCBjb25maXJtQ2IgPSBjb25maXJtUm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyB0eXBlOiBcImNoZWNrYm94XCIgfSk7XG4gICAgY29uZmlybUNiLmNoZWNrZWQgPSB0aGlzLnN0YXRlLmNvbmZpcm1lZDtcbiAgICBjb25maXJtQ2IuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlLmNvbmZpcm1lZCA9IGNvbmZpcm1DYi5jaGVja2VkO1xuICAgICAgdGhpcy5yZWZyZXNoQ29uZmlybWVkU3RhdGUocm9vdCk7XG4gICAgICB0aGlzLmNhbGxiYWNrcy5vbkNvbmZpcm1lZD8uKHRoaXMuc3RhdGUuY29uZmlybWVkKTtcbiAgICB9KTtcbiAgICBjb25maXJtUm93LmNyZWF0ZVNwYW4oeyB0ZXh0OiBcIiBUZW1wbyBjb25maXJtZWRcIiB9KTtcbiAgICB0aGlzLnJlZnJlc2hDb25maXJtZWRTdGF0ZShyb290KTtcblxuICAgIHJldHVybiByb290O1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJWYWx1ZShjb250YWluZXI6IEhUTUxFbGVtZW50KSB7XG4gICAgY29udGFpbmVyLmVtcHR5KCk7XG4gICAgY29uc3QgZGlzcGxheSA9IGNvbnRhaW5lci5jcmVhdGVTcGFuKHsgY2xzOiBcImJwbS12YWx1ZVwiLCB0ZXh0OiBTdHJpbmcodGhpcy5zdGF0ZS5icG0pIH0pO1xuICAgIGRpc3BsYXkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuc3RhcnRJbmxpbmVFZGl0KGRpc3BsYXkpKTtcblxuICAgIGNvbnRhaW5lci5jcmVhdGVTcGFuKHsgY2xzOiBcImJwbS1yYXdcIiwgdGV4dDogYCAocmF3ICR7dGhpcy5zdGF0ZS5yYXdCcG19KWAgfSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXJ0SW5saW5lRWRpdChlbDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICBpbnB1dC50eXBlID0gXCJudW1iZXJcIjtcbiAgICBpbnB1dC52YWx1ZSA9IFN0cmluZyh0aGlzLnN0YXRlLmJwbSk7XG4gICAgaW5wdXQuY2xhc3NOYW1lID0gXCJicG0taW5wdXRcIjtcbiAgICBpbnB1dC5taW4gPSBcIjQwXCI7XG4gICAgaW5wdXQubWF4ID0gXCIzMDBcIjtcblxuICAgIGVsLnJlcGxhY2VXaXRoKGlucHV0KTtcbiAgICBpbnB1dC5mb2N1cygpO1xuICAgIGlucHV0LnNlbGVjdCgpO1xuXG4gICAgY29uc3QgY29tbWl0ID0gKCkgPT4ge1xuICAgICAgY29uc3QgdmFsID0gcGFyc2VJbnQoaW5wdXQudmFsdWUsIDEwKTtcbiAgICAgIGlmICghaXNOYU4odmFsKSAmJiB2YWwgPj0gNDAgJiYgdmFsIDw9IDMwMCkge1xuICAgICAgICB0aGlzLnNldEJwbSh2YWwpO1xuICAgICAgfVxuICAgICAgdGhpcy5yZWZyZXNoVmFsdWUoKTtcbiAgICB9O1xuXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgY29tbWl0KTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIGNvbW1pdCgpO1xuICAgICAgaWYgKGUua2V5ID09PSBcIkVzY2FwZVwiKSB0aGlzLnJlZnJlc2hWYWx1ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoVmFsdWUoKSB7XG4gICAgY29uc3Qgcm93ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5icG0tdmFsdWUtcm93XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmIChyb3cpIHRoaXMucmVuZGVyVmFsdWUocm93KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0QnBtKGJwbTogbnVtYmVyKSB7XG4gICAgdGhpcy5zdGF0ZS5icG0gPSBicG07XG4gICAgLy8gUmVjb21wdXRlIGFsdGVybmF0ZSBmcm9tIG5ldyBkaXNwbGF5ZWQgdmFsdWVcbiAgICBjb25zdCBkb3VibGVkID0gYnBtICogMjtcbiAgICBjb25zdCBoYWx2ZWQgPSBNYXRoLnJvdW5kKGJwbSAvIDIpO1xuICAgIGlmIChkb3VibGVkIDw9IDIwMCAmJiBkb3VibGVkICE9PSBicG0pIHtcbiAgICAgIHRoaXMuc3RhdGUuYWx0ZXJuYXRlQnBtID0gZG91YmxlZDtcbiAgICB9IGVsc2UgaWYgKGhhbHZlZCA+PSA2MCAmJiBoYWx2ZWQgIT09IGJwbSkge1xuICAgICAgdGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG0gPSBoYWx2ZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RhdGUuYWx0ZXJuYXRlQnBtID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLnJlZnJlc2hWYWx1ZSgpO1xuICAgIHRoaXMucmVmcmVzaEFsdGVybmF0ZSgpO1xuICAgIHRoaXMuY2FsbGJhY2tzLm9uQ2hhbmdlPy4odGhpcy5zdGF0ZS5icG0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhY2NlcHRBbHRlcm5hdGUoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuYWx0ZXJuYXRlQnBtKSB7XG4gICAgICB0aGlzLnNldEJwbSh0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoQWx0ZXJuYXRlKCkge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5icG0tYWx0ZXJuYXRlLXJvd1wiKTtcbiAgICBpZiAoZXhpc3RpbmcpIGV4aXN0aW5nLnJlbW92ZSgpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuYWx0ZXJuYXRlQnBtKSB7XG4gICAgICBjb25zdCBhY3Rpb25zID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5icG0tYWN0aW9uc1wiKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGNvbnN0IGFsdCA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJicG0tYWx0ZXJuYXRlLXJvd1wiIH0pO1xuICAgICAgaWYgKGFjdGlvbnMpIHRoaXMuY29udGFpbmVyLmluc2VydEJlZm9yZShhbHQsIGFjdGlvbnMpO1xuICAgICAgZWxzZSB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChhbHQpO1xuXG4gICAgICBjb25zdCBidG4gPSBhbHQuY3JlYXRlRWwoXCJidXR0b25cIiwge1xuICAgICAgICBjbHM6IFwiYnBtLWFsdGVybmF0ZVwiLFxuICAgICAgICB0ZXh0OiBgb3IgJHt0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbX0/YCxcbiAgICAgIH0pO1xuICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmFjY2VwdEFsdGVybmF0ZSgpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uVGFwKGJ0bjogSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICBjb25zdCBicG0gPSB0aGlzLnRhcENvbnRyb2xsZXIudGFwKCk7XG5cbiAgICAvLyBGbGFzaCB0aGUgYnV0dG9uXG4gICAgYnRuLmNsYXNzTGlzdC5hZGQoXCJicG0tYnRuLXRhcC1hY3RpdmVcIik7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGFwRmxhc2hUaW1lb3V0KTtcbiAgICB0aGlzLnRhcEZsYXNoVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4gYnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJicG0tYnRuLXRhcC1hY3RpdmVcIiksIDE1MCk7XG5cbiAgICBpZiAoYnBtICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNldEJwbShicG0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaENvbmZpcm1lZFN0YXRlKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5jbGFzc0xpc3QudG9nZ2xlKFwiYnBtLWNvbmZpcm1lZFwiLCB0aGlzLnN0YXRlLmNvbmZpcm1lZCk7XG4gICAgcm9vdC5jbGFzc0xpc3QudG9nZ2xlKFwiYnBtLXVuY29uZmlybWVkXCIsICF0aGlzLnN0YXRlLmNvbmZpcm1lZCk7XG4gIH1cblxuICBnZXRTdGF0ZSgpOiBCcG1Db250cm9sU3RhdGUge1xuICAgIHJldHVybiB7IC4uLnRoaXMuc3RhdGUgfTtcbiAgfVxuXG4gIG1vdW50KHBhcmVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50YXBGbGFzaFRpbWVvdXQpO1xuICB9XG59XG4iLCAiLy8gS2V5Q29udHJvbCBcdTIwMTQgcmV1c2FibGUga2V5IHdpZGdldCBmb3IgbW9kYWwgKyBkYXNoYm9hcmQuXG4vLyBDU1MgY2xhc3MgaG9va3MgKGZvciB0aGVtaW5nIGJ5IHVzZXIpOlxuLy8gIC5rZXktY29udHJvbCAgICAgICAgICAgIFx1MjAxNCByb290IGNvbnRhaW5lclxuLy8gIC5rZXktdmFsdWUgICAgICAgICAgICAgIFx1MjAxNCBjdXJyZW50IGRpc3BsYXllZCBrZXkgKGUuZy4gXCJDIyBtaW5vclwiKVxuLy8gIC5rZXktcmVsYXRpdmUgICAgICAgICAgIFx1MjAxNCByZWxhdGl2ZSBtYWpvci9taW5vciBkaXNwbGF5XG4vLyAgLmtleS1idG4tc2VtaXRvbmUtdXAgICAgXHUyMDE0ICsxIHNlbWl0b25lIGJ1dHRvblxuLy8gIC5rZXktYnRuLXNlbWl0b25lLWRvd24gIFx1MjAxNCAtMSBzZW1pdG9uZSBidXR0b25cbi8vICAua2V5LWJ0bi1tb2RlLXRvZ2dsZSAgICBcdTIwMTQgbWFqb3IvbWlub3IgdG9nZ2xlXG4vLyAgLmtleS1idG4tcmVsYXRpdmUgICAgICAgXHUyMDE0IGp1bXAgdG8gcmVsYXRpdmUga2V5XG4vLyAgLmtleS1jb25maXJtZWQgICAgICAgICAgXHUyMDE0IGNvbmZpcm1lZCBzdGF0ZSBmbGFnXG4vLyAgLmtleS11bmNvbmZpcm1lZCAgICAgICAgXHUyMDE0IHVuY29uZmlybWVkIHN0YXRlIGZsYWdcblxuY29uc3QgQ0hST01BVElDID0gW1wiQ1wiLCBcIkMjXCIsIFwiRFwiLCBcIkQjXCIsIFwiRVwiLCBcIkZcIiwgXCJGI1wiLCBcIkdcIiwgXCJHI1wiLCBcIkFcIiwgXCJBI1wiLCBcIkJcIl07XG5cbi8vIE1pbm9yIFx1MjE5MiByZWxhdGl2ZSBtYWpvclxuY29uc3QgUkVMQVRJVkVfTUFKT1I6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIEFtOiBcIkNcIiwgRW06IFwiR1wiLCBCbTogXCJEXCIsIFwiRiNtXCI6IFwiQVwiLCBcIkMjbVwiOiBcIkVcIixcbiAgXCJHI21cIjogXCJCXCIsIFwiRCNtXCI6IFwiRiNcIiwgXCJBI21cIjogXCJDI1wiLCBEbTogXCJGXCIsXG4gIEdtOiBcIkJiXCIsIENtOiBcIkViXCIsIEZtOiBcIkFiXCIsXG59O1xuXG4vLyBNYWpvciBcdTIxOTIgcmVsYXRpdmUgbWlub3JcbmNvbnN0IFJFTEFUSVZFX01JTk9SOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICBPYmplY3QuZW50cmllcyhSRUxBVElWRV9NQUpPUikubWFwKChbaywgdl0pID0+IFt2LCBrXSksXG4pO1xuXG5leHBvcnQgaW50ZXJmYWNlIEtleUNvbnRyb2xDYWxsYmFja3Mge1xuICBvbkNoYW5nZT86IChrZXk6IHN0cmluZywgc2NhbGU6IHN0cmluZykgPT4gdm9pZDtcbiAgb25Db25maXJtZWQ/OiAoY29uZmlybWVkOiBib29sZWFuKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtleUNvbnRyb2xTdGF0ZSB7XG4gIGtleTogc3RyaW5nOyAgICAvLyBlLmcuIFwiQyNcIiAod2l0aG91dCBtIHN1ZmZpeClcbiAgc2NhbGU6IHN0cmluZzsgIC8vIFwibWlub3JcIiB8IFwibWFqb3JcIlxuICByZWxhdGl2ZUtleT86IHN0cmluZztcbiAgY29uZmlybWVkOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgS2V5Q29udHJvbCB7XG4gIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBzdGF0ZTogS2V5Q29udHJvbFN0YXRlO1xuICBwcml2YXRlIGNhbGxiYWNrczogS2V5Q29udHJvbENhbGxiYWNrcztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwYXJlbnQ6IEhUTUxFbGVtZW50LFxuICAgIGluaXRpYWw6IEtleUNvbnRyb2xTdGF0ZSxcbiAgICBjYWxsYmFja3M6IEtleUNvbnRyb2xDYWxsYmFja3MgPSB7fSxcbiAgKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHsgLi4uaW5pdGlhbCB9O1xuICAgIHRoaXMuY2FsbGJhY2tzID0gY2FsbGJhY2tzO1xuICAgIHRoaXMuY29udGFpbmVyID0gdGhpcy5idWlsZChwYXJlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZChwYXJlbnQ6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IHJvb3QgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcImtleS1jb250cm9sXCIgfSk7XG5cbiAgICAvLyBWYWx1ZSByb3dcbiAgICBjb25zdCB2YWx1ZVJvdyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImtleS12YWx1ZS1yb3dcIiB9KTtcbiAgICB0aGlzLnJlbmRlclZhbHVlKHZhbHVlUm93KTtcblxuICAgIC8vIFJlbGF0aXZlIGtleSBoaW50XG4gICAgdGhpcy5yZW5kZXJSZWxhdGl2ZShyb290KTtcblxuICAgIC8vIEFjdGlvbiByb3c6IFx1MjY2RCB8IFx1MjY2RiB8IG1vZGUgdG9nZ2xlIHwgcmVsYXRpdmVcbiAgICBjb25zdCBhY3Rpb25zID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwia2V5LWFjdGlvbnNcIiB9KTtcblxuICAgIGNvbnN0IGJ0bkRvd24gPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcImtleS1idG4tc2VtaXRvbmUtZG93blwiLCB0ZXh0OiBcIlx1MjY2RFwiIH0pO1xuICAgIGJ0bkRvd24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuc2hpZnRTZW1pdG9uZSgtMSkpO1xuXG4gICAgY29uc3QgYnRuVXAgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcImtleS1idG4tc2VtaXRvbmUtdXBcIiwgdGV4dDogXCJcdTI2NkZcIiB9KTtcbiAgICBidG5VcC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zaGlmdFNlbWl0b25lKDEpKTtcblxuICAgIGNvbnN0IGJ0bk1vZGUgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtcbiAgICAgIGNsczogXCJrZXktYnRuLW1vZGUtdG9nZ2xlXCIsXG4gICAgICB0ZXh0OiB0aGlzLnN0YXRlLnNjYWxlID09PSBcIm1pbm9yXCIgPyBcIm1ham9yXCIgOiBcIm1pbm9yXCIsXG4gICAgfSk7XG4gICAgYnRuTW9kZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy50b2dnbGVNb2RlKCkpO1xuXG4gICAgY29uc3QgYnRuUmVsYXRpdmUgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtcbiAgICAgIGNsczogXCJrZXktYnRuLXJlbGF0aXZlXCIsXG4gICAgICB0ZXh0OiBcIlJlbGF0aXZlXCIsXG4gICAgfSk7XG4gICAgYnRuUmVsYXRpdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuanVtcFRvUmVsYXRpdmUoKSk7XG5cbiAgICAvLyBDb25maXJtIHRvZ2dsZVxuICAgIGNvbnN0IGNvbmZpcm1Sb3cgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJrZXktY29uZmlybS1yb3dcIiB9KTtcbiAgICBjb25zdCBjb25maXJtQ2IgPSBjb25maXJtUm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyB0eXBlOiBcImNoZWNrYm94XCIgfSk7XG4gICAgY29uZmlybUNiLmNoZWNrZWQgPSB0aGlzLnN0YXRlLmNvbmZpcm1lZDtcbiAgICBjb25maXJtQ2IuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlLmNvbmZpcm1lZCA9IGNvbmZpcm1DYi5jaGVja2VkO1xuICAgICAgdGhpcy5yZWZyZXNoQ29uZmlybWVkU3RhdGUocm9vdCk7XG4gICAgICB0aGlzLmNhbGxiYWNrcy5vbkNvbmZpcm1lZD8uKHRoaXMuc3RhdGUuY29uZmlybWVkKTtcbiAgICB9KTtcbiAgICBjb25maXJtUm93LmNyZWF0ZVNwYW4oeyB0ZXh0OiBcIiBLZXkgY29uZmlybWVkXCIgfSk7XG4gICAgdGhpcy5yZWZyZXNoQ29uZmlybWVkU3RhdGUocm9vdCk7XG5cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyVmFsdWUoY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnRhaW5lci5lbXB0eSgpO1xuICAgIGNvbnN0IGRpc3BsYXlLZXkgPSB0aGlzLmZvcm1hdEtleURpc3BsYXkodGhpcy5zdGF0ZS5rZXksIHRoaXMuc3RhdGUuc2NhbGUpO1xuICAgIGNvbnN0IGVsID0gY29udGFpbmVyLmNyZWF0ZVNwYW4oeyBjbHM6IFwia2V5LXZhbHVlXCIsIHRleHQ6IGRpc3BsYXlLZXkgfSk7XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuc3RhcnRJbmxpbmVFZGl0KGVsKSk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclJlbGF0aXZlKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgZXhpc3RpbmcgPSByb290LnF1ZXJ5U2VsZWN0b3IoXCIua2V5LXJlbGF0aXZlLXJvd1wiKTtcbiAgICBpZiAoZXhpc3RpbmcpIGV4aXN0aW5nLnJlbW92ZSgpO1xuXG4gICAgY29uc3QgcmVsYXRpdmUgPSB0aGlzLmNvbXB1dGVSZWxhdGl2ZSgpO1xuICAgIGlmICghcmVsYXRpdmUpIHJldHVybjtcblxuICAgIGNvbnN0IHJvdyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImtleS1yZWxhdGl2ZS1yb3dcIiB9KTtcbiAgICAvLyBJbnNlcnQgYmVmb3JlIGFjdGlvbnNcbiAgICBjb25zdCBhY3Rpb25zID0gcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmtleS1hY3Rpb25zXCIpO1xuICAgIGlmIChhY3Rpb25zKSByb290Lmluc2VydEJlZm9yZShyb3csIGFjdGlvbnMpO1xuICAgIGVsc2Ugcm9vdC5hcHBlbmRDaGlsZChyb3cpO1xuXG4gICAgcm93LmNyZWF0ZVNwYW4oeyBjbHM6IFwia2V5LXJlbGF0aXZlXCIsIHRleHQ6IGBSZWxhdGl2ZTogJHtyZWxhdGl2ZX1gIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBmb3JtYXRLZXlEaXNwbGF5KGtleTogc3RyaW5nLCBzY2FsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc2NhbGUgPT09IFwibWlub3JcIiA/IGAke2tleX1tYCA6IGtleTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VLZXlEaXNwbGF5KGRpc3BsYXk6IHN0cmluZyk6IHsga2V5OiBzdHJpbmc7IHNjYWxlOiBzdHJpbmcgfSB7XG4gICAgaWYgKGRpc3BsYXkuZW5kc1dpdGgoXCJtXCIpKSB7XG4gICAgICByZXR1cm4geyBrZXk6IGRpc3BsYXkuc2xpY2UoMCwgLTEpLCBzY2FsZTogXCJtaW5vclwiIH07XG4gICAgfVxuICAgIHJldHVybiB7IGtleTogZGlzcGxheSwgc2NhbGU6IFwibWFqb3JcIiB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydElubGluZUVkaXQoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgaW5wdXQudmFsdWUgPSB0aGlzLmZvcm1hdEtleURpc3BsYXkodGhpcy5zdGF0ZS5rZXksIHRoaXMuc3RhdGUuc2NhbGUpO1xuICAgIGlucHV0LmNsYXNzTmFtZSA9IFwia2V5LWlucHV0XCI7XG5cbiAgICBlbC5yZXBsYWNlV2l0aChpbnB1dCk7XG4gICAgaW5wdXQuZm9jdXMoKTtcbiAgICBpbnB1dC5zZWxlY3QoKTtcblxuICAgIGNvbnN0IGNvbW1pdCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHRoaXMucGFyc2VLZXlEaXNwbGF5KGlucHV0LnZhbHVlLnRyaW0oKSk7XG4gICAgICBpZiAoQ0hST01BVElDLmluY2x1ZGVzKHBhcnNlZC5rZXkpKSB7XG4gICAgICAgIHRoaXMuc3RhdGUua2V5ID0gcGFyc2VkLmtleTtcbiAgICAgICAgdGhpcy5zdGF0ZS5zY2FsZSA9IHBhcnNlZC5zY2FsZTtcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLm9uQ2hhbmdlPy4odGhpcy5zdGF0ZS5rZXksIHRoaXMuc3RhdGUuc2NhbGUpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBjb21taXQpO1xuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIikge1xuICAgICAgICBjb21taXQoKTtcbiAgICAgICAgaW5wdXQuYmx1cigpO1xuICAgICAgfVxuICAgICAgaWYgKGUua2V5ID09PSBcIkVzY2FwZVwiKSB0aGlzLnJlZnJlc2goKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2hpZnRTZW1pdG9uZShkZWx0YTogbnVtYmVyKSB7XG4gICAgY29uc3QgaWR4ID0gQ0hST01BVElDLmluZGV4T2YodGhpcy5zdGF0ZS5rZXkpO1xuICAgIGlmIChpZHggPT09IC0xKSByZXR1cm47XG4gICAgY29uc3QgbmV3SWR4ID0gKGlkeCArIGRlbHRhICsgMTIpICUgMTI7XG4gICAgdGhpcy5zdGF0ZS5rZXkgPSBDSFJPTUFUSUNbbmV3SWR4XTtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB0aGlzLmNhbGxiYWNrcy5vbkNoYW5nZT8uKHRoaXMuc3RhdGUua2V5LCB0aGlzLnN0YXRlLnNjYWxlKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9nZ2xlTW9kZSgpIHtcbiAgICB0aGlzLnN0YXRlLnNjYWxlID0gdGhpcy5zdGF0ZS5zY2FsZSA9PT0gXCJtaW5vclwiID8gXCJtYWpvclwiIDogXCJtaW5vclwiO1xuICAgIHRoaXMucmVmcmVzaCgpO1xuICAgIHRoaXMuY2FsbGJhY2tzLm9uQ2hhbmdlPy4odGhpcy5zdGF0ZS5rZXksIHRoaXMuc3RhdGUuc2NhbGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBqdW1wVG9SZWxhdGl2ZSgpIHtcbiAgICBjb25zdCByZWxhdGl2ZSA9IHRoaXMuY29tcHV0ZVJlbGF0aXZlKHRydWUpO1xuICAgIGlmIChyZWxhdGl2ZSkge1xuICAgICAgY29uc3QgcGFyc2VkID0gdGhpcy5wYXJzZUtleURpc3BsYXkocmVsYXRpdmUpO1xuICAgICAgdGhpcy5zdGF0ZS5rZXkgPSBwYXJzZWQua2V5O1xuICAgICAgdGhpcy5zdGF0ZS5zY2FsZSA9IHBhcnNlZC5zY2FsZTtcbiAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgdGhpcy5jYWxsYmFja3Mub25DaGFuZ2U/Lih0aGlzLnN0YXRlLmtleSwgdGhpcy5zdGF0ZS5zY2FsZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb21wdXRlUmVsYXRpdmUoZm9ySnVtcCA9IGZhbHNlKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBkaXNwbGF5ID0gdGhpcy5mb3JtYXRLZXlEaXNwbGF5KHRoaXMuc3RhdGUua2V5LCB0aGlzLnN0YXRlLnNjYWxlKTtcbiAgICBpZiAodGhpcy5zdGF0ZS5zY2FsZSA9PT0gXCJtaW5vclwiKSB7XG4gICAgICBjb25zdCByZWwgPSBSRUxBVElWRV9NQUpPUltkaXNwbGF5XTtcbiAgICAgIHJldHVybiByZWwgfHwgdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCByZWwgPSBSRUxBVElWRV9NSU5PUltkaXNwbGF5XTtcbiAgICAgIHJldHVybiByZWwgfHwgdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaCgpIHtcbiAgICBjb25zdCB2YWxSb3cgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmtleS12YWx1ZS1yb3dcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKHZhbFJvdykgdGhpcy5yZW5kZXJWYWx1ZSh2YWxSb3cpO1xuICAgIHRoaXMucmVuZGVyUmVsYXRpdmUodGhpcy5jb250YWluZXIpO1xuXG4gICAgY29uc3QgbW9kZUJ0biA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIua2V5LWJ0bi1tb2RlLXRvZ2dsZVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAobW9kZUJ0bikgbW9kZUJ0bi50ZXh0Q29udGVudCA9IHRoaXMuc3RhdGUuc2NhbGUgPT09IFwibWlub3JcIiA/IFwibWFqb3JcIiA6IFwibWlub3JcIjtcbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaENvbmZpcm1lZFN0YXRlKHJvb3Q6IEhUTUxFbGVtZW50KSB7XG4gICAgcm9vdC5jbGFzc0xpc3QudG9nZ2xlKFwia2V5LWNvbmZpcm1lZFwiLCB0aGlzLnN0YXRlLmNvbmZpcm1lZCk7XG4gICAgcm9vdC5jbGFzc0xpc3QudG9nZ2xlKFwia2V5LXVuY29uZmlybWVkXCIsICF0aGlzLnN0YXRlLmNvbmZpcm1lZCk7XG4gIH1cblxuICBnZXRTdGF0ZSgpOiBLZXlDb250cm9sU3RhdGUge1xuICAgIHJldHVybiB7IC4uLnRoaXMuc3RhdGUgfTtcbiAgfVxuXG4gIG1vdW50KHBhcmVudDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcbiAgfVxufVxuIiwgIi8vIFN0cnVjdHVyZVRpbWVsaW5lIFx1MjAxNCBtYW51YWwgc2VnbWVudCBiYXJzIHdpdGggaG92ZXIgdG9vbHRpcCBhbmQgb2Zmc2V0IHNsaWRlci5cbi8vXG4vLyBDU1MgY2xhc3MgaG9va3MgKGZvciB0aGVtaW5nIGJ5IHVzZXIpOlxuLy8gIC5tYW0tdGltZWxpbmUgICAgICAgICAgICAgIFx1MjAxNCByb290IGNvbnRhaW5lclxuLy8gIC5tYW0tdGltZWxpbmUtdHJhY2sgICAgICAgIFx1MjAxNCBob3Jpem9udGFsIGJhciB0cmFja1xuLy8gIC5tYW0tdGltZWxpbmUtc2VnbWVudCAgICAgIFx1MjAxNCBpbmRpdmlkdWFsIGNvbG9yZWQgYmFyXG4vLyAgLm1hbS10aW1lbGluZS1zZWdtZW50LWxhYmVsXG4vLyAgLm1hbS10aW1lbGluZS1vZmZzZXQtcm93ICAgXHUyMDE0IHNsaWRlciArIGxhYmVsIHdyYXBwZXJcbi8vICAubWFtLXRpbWVsaW5lLW9mZnNldC1sYWJlbFxuLy8gIC5tYW0tdGltZWxpbmUtc2xpZGVyICAgICAgIFx1MjAxNCBIVE1MIHJhbmdlIGlucHV0XG4vLyAgLm1hbS10aW1lbGluZS10b29sdGlwICAgICAgXHUyMDE0IGZsb2F0aW5nIGhvdmVyIHRvb2x0aXAgKGFicyBwb3NpdGlvbmVkKVxuLy8gIC5tYW0tdGltZWxpbmUtZW1wdHkgICAgICAgIFx1MjAxNCBuby1zZWdtZW50cyBzdGF0ZVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0cnVjdHVyZVNlZ21lbnQge1xuICBpZDogc3RyaW5nO1xuICBsYWJlbDogc3RyaW5nO1xuICBzdGFydEJhcjogbnVtYmVyO1xuICBlbmRCYXI6IG51bWJlcjtcbiAgY29sb3I6IHN0cmluZzsgLy8gQ1NTIGNvbG9yIHZhbHVlIChPYnNpZGlhbiB2YXIgb3IgbGl0ZXJhbClcbn1cblxuZXhwb3J0IGNsYXNzIFN0cnVjdHVyZVRpbWVsaW5lIHtcbiAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIHNlZ21lbnRzOiBTdHJ1Y3R1cmVTZWdtZW50W107XG4gIHByaXZhdGUgYnBtOiBudW1iZXI7XG4gIHByaXZhdGUgb2Zmc2V0QmFyczogbnVtYmVyO1xuICBwcml2YXRlIHRyYWNrRWw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgdG9vbHRpcEVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIG9uT2Zmc2V0Q2hhbmdlPzogKG9mZnNldEJhcnM6IG51bWJlcikgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwYXJlbnQ6IEhUTUxFbGVtZW50LFxuICAgIHNlZ21lbnRzOiBTdHJ1Y3R1cmVTZWdtZW50W10sXG4gICAgYnBtOiBudW1iZXIsXG4gICAgb2Zmc2V0QmFycyA9IDAsXG4gICkge1xuICAgIHRoaXMuY29udGFpbmVyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJtYW0tdGltZWxpbmVcIiB9KTtcbiAgICB0aGlzLnNlZ21lbnRzID0gc2VnbWVudHM7XG4gICAgdGhpcy5icG0gPSBicG07XG4gICAgdGhpcy5vZmZzZXRCYXJzID0gb2Zmc2V0QmFycztcbiAgfVxuXG4gIG1vdW50KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLmVtcHR5KCk7XG5cbiAgICBpZiAodGhpcy5zZWdtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7XG4gICAgICAgIGNsczogXCJtYW0tdGltZWxpbmUtZW1wdHlcIixcbiAgICAgICAgdGV4dDogXCJObyBzdHJ1Y3R1cmUgZGVmaW5lZC4gQWRkIHNlZ21lbnRzIHRvIGZyb250bWF0dGVyOiBzdHJ1Y3R1cmU6IFsuLi5dXCIsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuYnVpbGRPZmZzZXRSb3coKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDb21wdXRlIHRvdGFsIHNwYW4gKGFjY291bnRpbmcgZm9yIG9mZnNldCBsZWFkLWluKVxuICAgIGNvbnN0IHRvdGFsQmFycyA9IE1hdGgubWF4KC4uLnRoaXMuc2VnbWVudHMubWFwKChzKSA9PiBzLmVuZEJhcikpO1xuICAgIGNvbnN0IGVmZmVjdGl2ZVRvdGFsID0gdG90YWxCYXJzICsgdGhpcy5vZmZzZXRCYXJzO1xuXG4gICAgLy8gVHJhY2sgY29udGFpbmVyXG4gICAgdGhpcy50cmFja0VsID0gdGhpcy5jb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS10aW1lbGluZS10cmFja1wiIH0pO1xuXG4gICAgLy8gUmVuZGVyIGVhY2ggc2VnbWVudCBhcyBhbiBhYnNvbHV0ZWx5LXBvc2l0aW9uZWQgcHJvcG9ydGlvbmFsIGJhclxuICAgIHRoaXMuc2VnbWVudHMuZm9yRWFjaCgoc2VnKSA9PiB7XG4gICAgICBjb25zdCBsZWZ0UGN0ID0gKChzZWcuc3RhcnRCYXIgKyB0aGlzLm9mZnNldEJhcnMpIC8gZWZmZWN0aXZlVG90YWwpICogMTAwO1xuICAgICAgY29uc3Qgd2lkdGhQY3QgPSAoKHNlZy5lbmRCYXIgLSBzZWcuc3RhcnRCYXIpIC8gZWZmZWN0aXZlVG90YWwpICogMTAwO1xuXG4gICAgICBjb25zdCBiYXIgPSB0aGlzLnRyYWNrRWwhLmNyZWF0ZURpdih7IGNsczogXCJtYW0tdGltZWxpbmUtc2VnbWVudFwiIH0pO1xuICAgICAgYmFyLnN0eWxlLmxlZnQgPSBgJHtsZWZ0UGN0fSVgO1xuICAgICAgYmFyLnN0eWxlLndpZHRoID0gYCR7d2lkdGhQY3R9JWA7XG4gICAgICBiYXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gc2VnLmNvbG9yO1xuICAgICAgYmFyLnN0eWxlLnNldFByb3BlcnR5KFwiLS1tYW0tc2VnbWVudC1jb2xvclwiLCBzZWcuY29sb3IpO1xuXG4gICAgICBiYXIuY3JlYXRlU3Bhbih7XG4gICAgICAgIGNsczogXCJtYW0tdGltZWxpbmUtc2VnbWVudC1sYWJlbFwiLFxuICAgICAgICB0ZXh0OiBzZWcubGFiZWwsXG4gICAgICB9KTtcblxuICAgICAgYmFyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWVudGVyXCIsICgpID0+IHRoaXMuc2hvd1Rvb2x0aXAoc2VnLCBiYXIpKTtcbiAgICAgIGJhci5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB0aGlzLmhpZGVUb29sdGlwKCkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5idWlsZE9mZnNldFJvdygpO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZE9mZnNldFJvdygpOiB2b2lkIHtcbiAgICBjb25zdCByb3cgPSB0aGlzLmNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLXRpbWVsaW5lLW9mZnNldC1yb3dcIiB9KTtcbiAgICByb3cuY3JlYXRlU3Bhbih7XG4gICAgICBjbHM6IFwibWFtLXRpbWVsaW5lLW9mZnNldC1sYWJlbFwiLFxuICAgICAgdGV4dDogYFRyaW0gbGVhZC1pbjogJHt0aGlzLm9mZnNldEJhcnN9IGJhciR7dGhpcy5vZmZzZXRCYXJzID09PSAxID8gXCJcIiA6IFwic1wifWAsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzbGlkZXIgPSByb3cuY3JlYXRlRWwoXCJpbnB1dFwiLCB7IHR5cGU6IFwicmFuZ2VcIiB9KTtcbiAgICBzbGlkZXIuY2xhc3NOYW1lID0gXCJtYW0tdGltZWxpbmUtc2xpZGVyXCI7XG4gICAgc2xpZGVyLm1pbiA9IFwiMFwiO1xuICAgIHNsaWRlci5tYXggPSBTdHJpbmcoTWF0aC5jZWlsKHRoaXMub2Zmc2V0QmFycyArIDQpKTtcbiAgICBzbGlkZXIudmFsdWUgPSBTdHJpbmcodGhpcy5vZmZzZXRCYXJzKTtcbiAgICBzbGlkZXIuc3RlcCA9IFwiMVwiO1xuXG4gICAgc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgICBjb25zdCB2YWwgPSBwYXJzZUludChzbGlkZXIudmFsdWUsIDEwKTtcbiAgICAgIHRoaXMub2Zmc2V0QmFycyA9IHZhbDtcbiAgICAgIC8vIFVwZGF0ZSBsYWJlbFxuICAgICAgY29uc3QgbGFiZWwgPSByb3cucXVlcnlTZWxlY3RvcihcIi5tYW0tdGltZWxpbmUtb2Zmc2V0LWxhYmVsXCIpO1xuICAgICAgaWYgKGxhYmVsKSB7XG4gICAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gYFRyaW0gbGVhZC1pbjogJHt2YWx9IGJhciR7dmFsID09PSAxID8gXCJcIiA6IFwic1wifWA7XG4gICAgICB9XG4gICAgICB0aGlzLm9uT2Zmc2V0Q2hhbmdlPy4odmFsKTtcbiAgICAgIC8vIFJlLXJlbmRlciB3aXRoIG5ldyBvZmZzZXRcbiAgICAgIHRoaXMubW91bnQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvd1Rvb2x0aXAoc2VnOiBTdHJ1Y3R1cmVTZWdtZW50LCBhbmNob3I6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnRyYWNrRWwpIHJldHVybjtcblxuICAgIHRoaXMudG9vbHRpcEVsID0gdGhpcy50cmFja0VsLmNyZWF0ZURpdih7IGNsczogXCJtYW0tdGltZWxpbmUtdG9vbHRpcFwiIH0pO1xuICAgIGNvbnN0IGJlYXRMZW4gPSA2MCAvIHRoaXMuYnBtO1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHNlZy5zdGFydEJhciAqIDQgKiBiZWF0TGVuO1xuICAgIGNvbnN0IHN0YXJ0U3RyID0gdGhpcy5mb3JtYXRUaW1lKHN0YXJ0VGltZSk7XG4gICAgY29uc3QgZW5kVGltZSA9IHNlZy5lbmRCYXIgKiA0ICogYmVhdExlbjtcbiAgICBjb25zdCBlbmRTdHIgPSB0aGlzLmZvcm1hdFRpbWUoZW5kVGltZSk7XG5cbiAgICB0aGlzLnRvb2x0aXBFbC5pbm5lckhUTUwgPSBgXG4gICAgICA8c3Ryb25nPiR7c2VnLmxhYmVsfTwvc3Ryb25nPjxici8+XG4gICAgICBCYXJzICR7c2VnLnN0YXJ0QmFyfSBcXHUyMDEzICR7c2VnLmVuZEJhcn08YnIvPlxuICAgICAgJHtzdGFydFN0cn0gXFx1MjAxMyAke2VuZFN0cn1cbiAgICBgO1xuXG4gICAgLy8gUG9zaXRpb24gdG9vbHRpcCBhYm92ZSB0aGUgaG92ZXJlZCBiYXIsIGNlbnRlcmVkXG4gICAgY29uc3QgdHJhY2tSZWN0ID0gdGhpcy50cmFja0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGJhclJlY3QgPSBhbmNob3IuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgbGVmdCA9IGJhclJlY3QubGVmdCAtIHRyYWNrUmVjdC5sZWZ0ICsgYmFyUmVjdC53aWR0aCAvIDIgLSA2MDtcbiAgICBjb25zdCB0b3AgPSAtNDA7XG4gICAgdGhpcy50b29sdGlwRWwuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICAgIHRoaXMudG9vbHRpcEVsLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gIH1cblxuICBwcml2YXRlIGhpZGVUb29sdGlwKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRvb2x0aXBFbCkge1xuICAgICAgdGhpcy50b29sdGlwRWwucmVtb3ZlKCk7XG4gICAgICB0aGlzLnRvb2x0aXBFbCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBmb3JtYXRUaW1lKHNlYzogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBjb25zdCBtID0gTWF0aC5mbG9vcihzZWMgLyA2MCk7XG4gICAgY29uc3QgcyA9IE1hdGguZmxvb3Ioc2VjICUgNjApO1xuICAgIGNvbnN0IG1zID0gTWF0aC5mbG9vcigoc2VjICUgMSkgKiAxMDApO1xuICAgIHJldHVybiBgJHttfToke3MudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIil9LiR7bXMudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluZXIucmVtb3ZlKCk7XG4gIH1cbn1cbiIsICIvLyBUdW5lck5lZWRsZSBcdTIwMTQga2V5LXBvc2l0aW9uIGdhdWdlLiBTdHlsZWQgYnkgY29uZmlybWVkIHN0YXRlLCBOT1QgY29uZmlkZW5jZS5cbi8vXG4vLyBDU1MgY2xhc3MgaG9va3MgKGZvciB0aGVtaW5nIGJ5IHVzZXIpOlxuLy8gIC5tYW0tdHVuZXIgICAgICAgICAgICAgXHUyMDE0IHJvb3QgY29udGFpbmVyXG4vLyAgLm1hbS10dW5lci1kaWFsICAgICAgICBcdTIwMTQgY2lyY3VsYXIgYmFja2dyb3VuZFxuLy8gIC5tYW0tdHVuZXItdGljayAgICAgICAgXHUyMDE0IG1ham9yL21pbm9yIHBvc2l0aW9uIG1hcmtzXG4vLyAgLm1hbS10dW5lci1uZWVkbGUgICAgICBcdTIwMTQgYW5pbWF0ZWQgcG9pbnRlclxuLy8gIC5tYW0tdHVuZXItbmVlZGxlLWNvbmZpcm1lZCAgIFx1MjAxNCBjb25maXJtZWQgc3R5bGVcbi8vICAubWFtLXR1bmVyLW5lZWRsZS11bmNvbmZpcm1lZCBcdTIwMTQgdW5jb25maXJtZWQgc3R5bGVcbi8vICAubWFtLXR1bmVyLWxhYmVsICAgICAgIFx1MjAxNCBrZXkgZGlzcGxheSBiZWxvdyBkaWFsXG4vLyAgLm1hbS10dW5lci1sYWJlbC1jb25maXJtZWRcbi8vICAubWFtLXR1bmVyLWxhYmVsLXVuY29uZmlybWVkXG5cbmNvbnN0IENIUk9NQVRJQ19PUkRFUiA9IFtcbiAgXCJDXCIsIFwiQyNcIiwgXCJEXCIsIFwiRCNcIiwgXCJFXCIsIFwiRlwiLCBcIkYjXCIsIFwiR1wiLCBcIkcjXCIsIFwiQVwiLCBcIkEjXCIsIFwiQlwiLFxuXTtcblxuZXhwb3J0IGludGVyZmFjZSBUdW5lck5lZWRsZVN0YXRlIHtcbiAga2V5OiBzdHJpbmc7ICAgICAgLy8gZS5nLiBcIkMjXCJcbiAgc2NhbGU6IHN0cmluZzsgICAgLy8gXCJtaW5vclwiIHwgXCJtYWpvclwiXG4gIGNvbmZpcm1lZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIFR1bmVyTmVlZGxlIHtcbiAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIHN0YXRlOiBUdW5lck5lZWRsZVN0YXRlO1xuICBwcml2YXRlIG5lZWRsZUVsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogSFRNTEVsZW1lbnQsIGluaXRpYWw6IFR1bmVyTmVlZGxlU3RhdGUpIHtcbiAgICB0aGlzLnN0YXRlID0geyAuLi5pbml0aWFsIH07XG4gICAgdGhpcy5jb250YWluZXIgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS10dW5lclwiIH0pO1xuICB9XG5cbiAgbW91bnQoKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluZXIuZW1wdHkoKTtcblxuICAgIGNvbnN0IGRpYWwgPSB0aGlzLmNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLXR1bmVyLWRpYWxcIiB9KTtcblxuICAgIC8vIFJlbmRlciBwb3NpdGlvbiB0aWNrcyBmb3IgZWFjaCBjaHJvbWF0aWMgbm90ZVxuICAgIENIUk9NQVRJQ19PUkRFUi5mb3JFYWNoKChub3RlLCBpKSA9PiB7XG4gICAgICBjb25zdCBhbmdsZSA9IChpIC8gMTIpICogMzYwO1xuICAgICAgY29uc3QgdGljayA9IGRpYWwuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS10dW5lci10aWNrXCIgfSk7XG4gICAgICAvLyBDU1MgdHJhbnNmb3JtIGhhbmRsZXMgcG9zaXRpb25pbmcgdmlhIHRyYW5zZm9ybTogcm90YXRlKGFuZ2xlKSB0cmFuc2xhdGVZKHJhZGl1cylcbiAgICAgIHRpY2suc2V0QXR0cmlidXRlKFwiZGF0YS1ub3RlXCIsIG5vdGUpO1xuICAgICAgdGljay5zdHlsZS50cmFuc2Zvcm0gPSBgcm90YXRlKCR7YW5nbGV9ZGVnKSB0cmFuc2xhdGVZKC00NXB4KWA7XG4gICAgfSk7XG5cbiAgICAvLyBOZWVkbGVcbiAgICB0aGlzLm5lZWRsZUVsID0gZGlhbC5jcmVhdGVEaXYoe1xuICAgICAgY2xzOiBgbWFtLXR1bmVyLW5lZWRsZSAke1xuICAgICAgICB0aGlzLnN0YXRlLmNvbmZpcm1lZFxuICAgICAgICAgID8gXCJtYW0tdHVuZXItbmVlZGxlLWNvbmZpcm1lZFwiXG4gICAgICAgICAgOiBcIm1hbS10dW5lci1uZWVkbGUtdW5jb25maXJtZWRcIlxuICAgICAgfWAsXG4gICAgfSk7XG4gICAgdGhpcy5zZXROZWVkbGVBbmdsZSh0aGlzLnN0YXRlLmtleSk7XG5cbiAgICAvLyBMYWJlbFxuICAgIGNvbnN0IGxhYmVsID0gdGhpcy5jb250YWluZXIuY3JlYXRlRGl2KHtcbiAgICAgIGNsczogYG1hbS10dW5lci1sYWJlbCAke1xuICAgICAgICB0aGlzLnN0YXRlLmNvbmZpcm1lZFxuICAgICAgICAgID8gXCJtYW0tdHVuZXItbGFiZWwtY29uZmlybWVkXCJcbiAgICAgICAgICA6IFwibWFtLXR1bmVyLWxhYmVsLXVuY29uZmlybWVkXCJcbiAgICAgIH1gLFxuICAgICAgdGV4dDogdGhpcy5mb3JtYXRLZXlEaXNwbGF5KCksXG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGUoc3RhdGU6IFR1bmVyTmVlZGxlU3RhdGUpOiB2b2lkIHtcbiAgICB0aGlzLnN0YXRlID0geyAuLi5zdGF0ZSB9O1xuICAgIHRoaXMuc2V0TmVlZGxlQW5nbGUodGhpcy5zdGF0ZS5rZXkpO1xuICAgIGlmICh0aGlzLm5lZWRsZUVsKSB7XG4gICAgICB0aGlzLm5lZWRsZUVsLmNsYXNzTmFtZSA9IGBtYW0tdHVuZXItbmVlZGxlICR7XG4gICAgICAgIHRoaXMuc3RhdGUuY29uZmlybWVkXG4gICAgICAgICAgPyBcIm1hbS10dW5lci1uZWVkbGUtY29uZmlybWVkXCJcbiAgICAgICAgICA6IFwibWFtLXR1bmVyLW5lZWRsZS11bmNvbmZpcm1lZFwiXG4gICAgICB9YDtcbiAgICB9XG4gICAgY29uc3QgbGFiZWwgPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLm1hbS10dW5lci1sYWJlbFwiKTtcbiAgICBpZiAobGFiZWwpIHtcbiAgICAgIGxhYmVsLmNsYXNzTmFtZSA9IGBtYW0tdHVuZXItbGFiZWwgJHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb25maXJtZWRcbiAgICAgICAgICA/IFwibWFtLXR1bmVyLWxhYmVsLWNvbmZpcm1lZFwiXG4gICAgICAgICAgOiBcIm1hbS10dW5lci1sYWJlbC11bmNvbmZpcm1lZFwiXG4gICAgICB9YDtcbiAgICAgIGxhYmVsLnRleHRDb250ZW50ID0gdGhpcy5mb3JtYXRLZXlEaXNwbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXROZWVkbGVBbmdsZShrZXk6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IGlkeCA9IENIUk9NQVRJQ19PUkRFUi5pbmRleE9mKGtleSk7XG4gICAgaWYgKGlkeCA9PT0gLTEpIHJldHVybjtcbiAgICBjb25zdCBhbmdsZSA9IChpZHggLyAxMikgKiAzNjA7XG4gICAgaWYgKHRoaXMubmVlZGxlRWwpIHtcbiAgICAgIHRoaXMubmVlZGxlRWwuc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZylgO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZm9ybWF0S2V5RGlzcGxheSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnNjYWxlID09PSBcIm1pbm9yXCJcbiAgICAgID8gYCR7dGhpcy5zdGF0ZS5rZXl9bWBcbiAgICAgIDogdGhpcy5zdGF0ZS5rZXk7XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xuICB9XG59XG4iLCAiLy8gQ2FtZWxvdFdoZWVsIFx1MjAxNCBpbnRlcmFjdGl2ZSBoYXJtb25pYy1taXhpbmcgZ3VpZGUuXG4vLyBDbGljayBhbnkga2V5IFx1MjE5MiBjbGlwYm9hcmQgZ2V0cyBhIERhdGF2aWV3IHF1ZXJ5IGZvciB0aGF0IGtleS5cbi8vXG4vLyBDU1MgY2xhc3MgaG9va3MgKGZvciB0aGVtaW5nIGJ5IHVzZXIpOlxuLy8gIC5tYW0tY2FtZWxvdCAgICAgICAgICAgICAgXHUyMDE0IHJvb3QgY29udGFpbmVyXG4vLyAgLm1hbS1jYW1lbG90LXdoZWVsICAgICAgICBcdTIwMTQgc2VsZi1jb250YWluZWQgU1ZHXG4vLyAgLm1hbS1jYW1lbG90LWlubmVyICAgICAgICBcdTIwMTQgaW5uZXIgcmluZyAobWlub3IpXG4vLyAgLm1hbS1jYW1lbG90LWtleSAgICAgICAgICBcdTIwMTQgZXZlcnkga2V5IHNsb3QgKGdyb3VwIGVsZW1lbnQpXG4vLyAgLm1hbS1jYW1lbG90LWtleS1tYWpvciAgICBcdTIwMTQgb3V0ZXItcmluZyBrZXlzXG4vLyAgLm1hbS1jYW1lbG90LWtleS1taW5vciAgICBcdTIwMTQgaW5uZXItcmluZyBrZXlzXG4vLyAgLm1hbS1jYW1lbG90LWN1cnJlbnQgICAgICBcdTIwMTQgdGhlIGN1cnJlbnRseSBkZXRlY3RlZC9jb25maXJtZWQga2V5XG4vLyAgLm1hbS1jYW1lbG90LWNvbXBhdGlibGUgICBcdTIwMTQgaGFybW9uaWNhbGx5IGNvbXBhdGlibGUgbmVpZ2hib3JzXG4vLyAgLm1hbS1jYW1lbG90LWxhYmVsICAgICAgICBcdTIwMTQgdGV4dCBpbnNpZGUgZWFjaCBzbG90XG4vLyAgLm1hbS1jYW1lbG90LWxlZ2VuZCAgICAgICBcdTIwMTQgYm90dG9tIGxlZ2VuZCBsaW5lXG5cbmV4cG9ydCB0eXBlIENhbWVsb3RLZXkgPSBzdHJpbmc7IC8vIGUuZy4gXCIxQVwiLCBcIjhCXCJcblxuY29uc3QgTUFKT1JfS0VZUzogQ2FtZWxvdEtleVtdID0gW1xuICBcIjFCXCIsIFwiMkJcIiwgXCIzQlwiLCBcIjRCXCIsIFwiNUJcIiwgXCI2QlwiLCBcIjdCXCIsIFwiOEJcIiwgXCI5QlwiLCBcIjEwQlwiLCBcIjExQlwiLCBcIjEyQlwiLFxuXTtcbmNvbnN0IE1JTk9SX0tFWVM6IENhbWVsb3RLZXlbXSA9IFtcbiAgXCIxQVwiLCBcIjJBXCIsIFwiM0FcIiwgXCI0QVwiLCBcIjVBXCIsIFwiNkFcIiwgXCI3QVwiLCBcIjhBXCIsIFwiOUFcIiwgXCIxMEFcIiwgXCIxMUFcIiwgXCIxMkFcIixcbl07XG5cbmNvbnN0IFNIQVJQX1RPX05BTUU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIEM6IFwiQ1wiLCBcIkMjXCI6IFwiQ3NoYXJwXCIsIERiOiBcIkRiXCIsXG4gIEQ6IFwiRFwiLCBcIkQjXCI6IFwiRHNoYXJwXCIsIEViOiBcIkViXCIsXG4gIEU6IFwiRVwiLCBGOiBcIkZcIiwgXCJGI1wiOiBcIkZzaGFycFwiLCBHYjogXCJHYlwiLFxuICBHOiBcIkdcIiwgXCJHI1wiOiBcIkdzaGFycFwiLCBBYjogXCJBYlwiLFxuICBBOiBcIkFcIiwgXCJBI1wiOiBcIkFzaGFycFwiLCBCYjogXCJCYlwiLFxuICBCOiBcIkJcIixcbn07XG5cbi8qKiBNYXAgYSBzdGFuZGFyZCBrZXkgbmFtZSB0byBDYW1lbG90IG5vdGF0aW9uLlxuICogIElucHV0IGtleSBjYW4gaGF2ZSBhIHRyYWlsaW5nIFwibVwiIGZvciBtaW5vciAoZS5nLiBcIkMjbVwiKS5cbiAqICBCYXJlIGtleSBuYW1lcyBtdXN0IG1hdGNoIGV4YWN0bHkgKHNoYXJwcyB3aXRoICMsIGZsYXRzIHdpdGggYiBzdWZmaXgpLlxuICovXG5leHBvcnQgZnVuY3Rpb24ga2V5TmFtZVRvQ2FtZWxvdChrZXk6IHN0cmluZywgc2NhbGU6IHN0cmluZyk6IENhbWVsb3RLZXkgfCB1bmRlZmluZWQge1xuICAvLyBTdHJpcCB0cmFpbGluZyBcIm1cIiAobWlub3IgbWFya2VyKSBvbmx5OyBkbyBOT1Qgc3RyaXAgdHJhaWxpbmcgXCJiXCIgKGZsYXQgc2lnbikuXG4gIGNvbnN0IHJhdyA9IGtleS5lbmRzV2l0aChcIm1cIikgJiYga2V5Lmxlbmd0aCA+IDEgPyBrZXkuc2xpY2UoMCwgLTEpIDoga2V5O1xuICBjb25zdCBuYW1lID0gU0hBUlBfVE9fTkFNRVtyYXddO1xuICBpZiAoIW5hbWUpIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgY29uc3QgaXNNaW5vciA9IHNjYWxlID09PSBcIm1pbm9yXCI7XG4gIGlmIChpc01pbm9yKSB7XG4gICAgY29uc3QgbWlub3JNYXA6IFJlY29yZDxzdHJpbmcsIENhbWVsb3RLZXk+ID0ge1xuICAgICAgQ3NoYXJwOiBcIjEyQVwiLCBEYjogXCIxMkFcIixcbiAgICAgIERzaGFycDogXCIyQVwiLCAgRWI6IFwiMkFcIixcbiAgICAgIEZzaGFycDogXCIxMUFcIiwgR2I6IFwiMTFBXCIsXG4gICAgICBHc2hhcnA6IFwiMUFcIiwgIEFiOiBcIjFBXCIsXG4gICAgICBBc2hhcnA6IFwiM0FcIiwgIEJiOiBcIjNBXCIsXG4gICAgICBGOiBcIjRBXCIsXG4gICAgICBDOiBcIjVBXCIsXG4gICAgICBHOiBcIjZBXCIsXG4gICAgICBEOiBcIjdBXCIsXG4gICAgICBBOiBcIjhBXCIsXG4gICAgICBFOiBcIjlBXCIsXG4gICAgICBCOiBcIjEwQVwiLFxuICAgIH07XG4gICAgcmV0dXJuIG1pbm9yTWFwW25hbWVdO1xuICB9XG4gIGNvbnN0IG1ham9yTWFwOiBSZWNvcmQ8c3RyaW5nLCBDYW1lbG90S2V5PiA9IHtcbiAgICBCOiBcIjFCXCIsXG4gICAgRnNoYXJwOiBcIjJCXCIsIEdiOiBcIjJCXCIsXG4gICAgQ3NoYXJwOiBcIjNCXCIsIERiOiBcIjNCXCIsXG4gICAgR3NoYXJwOiBcIjRCXCIsIEFiOiBcIjRCXCIsXG4gICAgRHNoYXJwOiBcIjVCXCIsIEViOiBcIjVCXCIsXG4gICAgQXNoYXJwOiBcIjZCXCIsIEJiOiBcIjZCXCIsXG4gICAgRjogXCI3QlwiLFxuICAgIEM6IFwiOEJcIixcbiAgICBHOiBcIjlCXCIsXG4gICAgRDogXCIxMEJcIixcbiAgICBBOiBcIjExQlwiLFxuICAgIEU6IFwiMTJCXCIsXG4gIH07XG4gIHJldHVybiBtYWpvck1hcFtuYW1lXTtcbn1cblxuLyoqIENvbnZlcnQgQ2FtZWxvdCBiYWNrIHRvIGEgRGF0YXZpZXctZnJpZW5kbHkga2V5IG5hbWUuICovXG5leHBvcnQgZnVuY3Rpb24gY2FtZWxvdFRvS2V5TmFtZShjYW1lbG90OiBDYW1lbG90S2V5KTogeyBrZXk6IHN0cmluZzsgc2NhbGU6IHN0cmluZyB9IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgbWFwOiBSZWNvcmQ8Q2FtZWxvdEtleSwgeyBrZXk6IHN0cmluZzsgc2NhbGU6IHN0cmluZyB9PiA9IHtcbiAgICBcIjFCXCI6IHsga2V5OiBcIkJcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiMkJcIjogeyBrZXk6IFwiRiMgLyBHYlwiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCIzQlwiOiB7IGtleTogXCJDIyAvIERiXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjRCXCI6IHsga2V5OiBcIkcjIC8gQWJcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiNUJcIjogeyBrZXk6IFwiRCMgLyBFYlwiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCI2QlwiOiB7IGtleTogXCJBIyAvIEJiXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjdCXCI6IHsga2V5OiBcIkZcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiOEJcIjogeyBrZXk6IFwiQ1wiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCI5QlwiOiB7IGtleTogXCJHXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjEwQlwiOiB7IGtleTogXCJEXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjExQlwiOiB7IGtleTogXCJBXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjEyQlwiOiB7IGtleTogXCJFXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjFBXCI6IHsga2V5OiBcIkcjIC8gQWJtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjJBXCI6IHsga2V5OiBcIkQjIC8gRWJtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjNBXCI6IHsga2V5OiBcIkEjIC8gQmJtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjRBXCI6IHsga2V5OiBcIkZtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjVBXCI6IHsga2V5OiBcIkNtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjZBXCI6IHsga2V5OiBcIkdtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjdBXCI6IHsga2V5OiBcIkRtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjhBXCI6IHsga2V5OiBcIkFtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjlBXCI6IHsga2V5OiBcIkVtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjEwQVwiOiB7IGtleTogXCJCbVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCIxMUFcIjogeyBrZXk6IFwiRiMgLyBHYm1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiMTJBXCI6IHsga2V5OiBcIkMjIC8gRGJtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgfTtcbiAgcmV0dXJuIG1hcFtjYW1lbG90XTtcbn1cblxuLyoqIFJldHVybiB0aGUgc2V0IG9mIGhhcm1vbmljYWxseSBjb21wYXRpYmxlIENhbWVsb3Qga2V5cy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wYXRpYmxlS2V5cyhjdXJyZW50OiBDYW1lbG90S2V5KTogQ2FtZWxvdEtleVtdIHtcbiAgY29uc3QgbnVtID0gcGFyc2VJbnQoY3VycmVudC5zbGljZSgwLCAtMSksIDEwKTsgLy8gXCI2QVwiIFx1MjE5MiA2XG4gIGNvbnN0IGxldHRlciA9IGN1cnJlbnQuc2xpY2UoLTEpOyAvLyBcIjZBXCIgXHUyMTkyIFwiQVwiXG4gIGNvbnN0IGNvbXBhdGlibGU6IENhbWVsb3RLZXlbXSA9IFtdO1xuXG4gIC8vIFNhbWUgbnVtYmVyLCBvcHBvc2l0ZSBsZXR0ZXIgKG1ham9yIFx1MjE5NCBtaW5vciByZWxhdGl2ZSlcbiAgY29tcGF0aWJsZS5wdXNoKGAke251bX0ke2xldHRlciA9PT0gXCJBXCIgPyBcIkJcIiA6IFwiQVwifWAgYXMgQ2FtZWxvdEtleSk7XG5cbiAgLy8gU2FtZSBsZXR0ZXIsIFx1MDBCMTEgbnVtYmVyICh3aXRoIHdyYXApXG4gIGNvbnN0IHByZXYgPSBudW0gPT09IDEgPyAxMiA6IG51bSAtIDE7XG4gIGNvbnN0IG5leHQgPSBudW0gPT09IDEyID8gMSA6IG51bSArIDE7XG4gIGNvbXBhdGlibGUucHVzaChgJHtwcmV2fSR7bGV0dGVyfWAgYXMgQ2FtZWxvdEtleSwgYCR7bmV4dH0ke2xldHRlcn1gIGFzIENhbWVsb3RLZXkpO1xuXG4gIC8vIENyb3NzLWxldHRlciBcdTAwQjExIChlbmVyZ3kgYm9vc3QvZHJvcClcbiAgY29tcGF0aWJsZS5wdXNoKGAke3ByZXZ9JHtsZXR0ZXIgPT09IFwiQVwiID8gXCJCXCIgOiBcIkFcIn1gIGFzIENhbWVsb3RLZXkpO1xuICBjb21wYXRpYmxlLnB1c2goYCR7bmV4dH0ke2xldHRlciA9PT0gXCJBXCIgPyBcIkJcIiA6IFwiQVwifWAgYXMgQ2FtZWxvdEtleSk7XG5cbiAgcmV0dXJuIGNvbXBhdGlibGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2FtZWxvdFdoZWVsQ29uZmlnIHtcbiAgY3VycmVudDogQ2FtZWxvdEtleSB8IHVuZGVmaW5lZDtcbiAgb25LZXlDbGljazogKGNhbWVsb3Q6IENhbWVsb3RLZXksIGR2UXVlcnk6IHN0cmluZykgPT4gdm9pZDtcbn1cblxuLyoqIFNlbGYtY29udGFpbmVkIFNWRyByZW5kZXJpbmcgb2YgdGhlIENhbWVsb3Qgd2hlZWwuXG4gKiAgTm9kZXMgYXJlIHBvc2l0aW9uZWQgcHJlY2lzZWx5IHZpYSB0cmlnIGluc2lkZSBhIGZpeGVkIHZpZXdCb3guXG4gKiAgVGhlIGNhbGxlciBqdXN0IG5lZWRzIGEgY29udGFpbmVyIChibG9jayBvciBmbGV4KSB0byBkcm9wIGl0IGluLlxuICovXG5leHBvcnQgY2xhc3MgQ2FtZWxvdFdoZWVsIHtcbiAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIGNvbmZpZzogQ2FtZWxvdFdoZWVsQ29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogSFRNTEVsZW1lbnQsIGNvbmZpZzogQ2FtZWxvdFdoZWVsQ29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5jb250YWluZXIgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1jYW1lbG90XCIgfSk7XG4gIH1cblxuICBtb3VudCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lci5lbXB0eSgpO1xuXG4gICAgLy8gU1ZHIGNhbnZhcyBcdTIwMTQgMjYwXHUwMEQ3MjYwIHZpZXdCb3ggZ2l2ZXMgY2xlYW4gY29vcmRpbmF0ZXMuXG4gICAgLy8gVGhlIENTUyBjb25zdW1lciBjYW4gc2V0IHdpZHRoL2hlaWdodCBvbiAubWFtLWNhbWVsb3RcbiAgICBjb25zdCBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIFwic3ZnXCIpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoXCJ2aWV3Qm94XCIsIFwiMCAwIDI2MCAyNjBcIik7XG4gICAgc3ZnLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibWFtLWNhbWVsb3Qtd2hlZWxcIik7XG4gICAgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoc3ZnKTtcblxuICAgIGNvbnN0IGN4ID0gMTMwO1xuICAgIGNvbnN0IGN5ID0gMTMwO1xuICAgIGNvbnN0IG91dGVyUiA9IDEwMDtcbiAgICBjb25zdCBpbm5lclIgPSA2MDtcblxuICAgIC8vIERyYXcgYWxsIDEyIHBvc2l0aW9ucyBhcm91bmQgdGhlIGNsb2NrXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMjsgaSsrKSB7XG4gICAgICAvLyBTdGFydCBhdCAxMiBvJ2Nsb2NrIGFuZCBnbyBjbG9ja3dpc2VcbiAgICAgIGNvbnN0IGFuZ2xlID0gaSAqIDMwIC0gOTA7IC8vIGRlZ3JlZXNcbiAgICAgIGNvbnN0IGFuZ2xlUmFkID0gKGFuZ2xlICogTWF0aC5QSSkgLyAxODA7XG5cbiAgICAgIGNvbnN0IG1ham9yS2V5ID0gTUFKT1JfS0VZU1tpXTtcbiAgICAgIGNvbnN0IG1pbm9yS2V5ID0gTUlOT1JfS0VZU1tpXTtcblxuICAgICAgLy8gTWFqb3IgKG91dGVyIHJpbmcpXG4gICAgICB0aGlzLnJlbmRlcktleShzdmcsIGN4LCBjeSwgb3V0ZXJSLCBhbmdsZVJhZCwgbWFqb3JLZXksIFwibWFqb3JcIik7XG4gICAgICAvLyBNaW5vciAoaW5uZXIgcmluZylcbiAgICAgIHRoaXMucmVuZGVyS2V5KHN2ZywgY3gsIGN5LCBpbm5lclIsIGFuZ2xlUmFkLCBtaW5vcktleSwgXCJtaW5vclwiKTtcbiAgICB9XG5cbiAgICAvLyBMZWdlbmQgKEhUTUwgYmVsb3cgU1ZHLCBub3QgaW5zaWRlIGl0KVxuICAgIGNvbnN0IGxlZ2VuZCA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tY2FtZWxvdC1sZWdlbmRcIiB9KTtcbiAgICBsZWdlbmQuY3JlYXRlU3Bhbih7IGNsczogXCJtYW0tY2FtZWxvdC1jdXJyZW50XCIsIHRleHQ6IFwiXHUyNUNGIGN1cnJlbnQgXCIgfSk7XG4gICAgbGVnZW5kLmNyZWF0ZVNwYW4oeyBjbHM6IFwibWFtLWNhbWVsb3QtY29tcGF0aWJsZVwiLCB0ZXh0OiBcIlx1MjVFNiBjb21wYXRpYmxlIFwiIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJLZXkoXG4gICAgc3ZnOiBTVkdTVkdFbGVtZW50LFxuICAgIGN4OiBudW1iZXIsXG4gICAgY3k6IG51bWJlcixcbiAgICByYWRpdXM6IG51bWJlcixcbiAgICBhbmdsZVJhZDogbnVtYmVyLFxuICAgIGtleTogQ2FtZWxvdEtleSxcbiAgICB0eXBlOiBcIm1ham9yXCIgfCBcIm1pbm9yXCIsXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IG5zID0gXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiO1xuXG4gICAgY29uc3QgeCA9IGN4ICsgcmFkaXVzICogTWF0aC5jb3MoYW5nbGVSYWQpO1xuICAgIGNvbnN0IHkgPSBjeSArIHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlUmFkKTtcblxuICAgIGNvbnN0IGcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIFwiZ1wiKTtcbiAgICBnLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGBtYW0tY2FtZWxvdC1rZXkgbWFtLWNhbWVsb3Qta2V5LSR7dHlwZX1gKTtcbiAgICBnLnNldEF0dHJpYnV0ZShcImRhdGEtY2FtZWxvdFwiLCBrZXkpO1xuXG4gICAgLy8gSGlnaGxpZ2h0aW5nXG4gICAgY29uc3QgY29tcGF0aWJsZSA9IHRoaXMuY29uZmlnLmN1cnJlbnQgPyBnZXRDb21wYXRpYmxlS2V5cyh0aGlzLmNvbmZpZy5jdXJyZW50KSA6IFtdO1xuICAgIGlmICh0aGlzLmNvbmZpZy5jdXJyZW50ID09PSBrZXkpIHtcbiAgICAgIGcuY2xhc3NMaXN0LmFkZChcIm1hbS1jYW1lbG90LWN1cnJlbnRcIik7XG4gICAgfSBlbHNlIGlmIChjb21wYXRpYmxlLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgIGcuY2xhc3NMaXN0LmFkZChcIm1hbS1jYW1lbG90LWNvbXBhdGlibGVcIik7XG4gICAgfVxuXG4gICAgLy8gVGV4dCBsYWJlbCAoU1ZHIHRleHQsIGNlbnRlcmVkIG9uIHRoZSBjaXJjbGUgcG9pbnQpXG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgXCJ0ZXh0XCIpO1xuICAgIHRleHQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtYW0tY2FtZWxvdC1sYWJlbFwiKTtcbiAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInhcIiwgU3RyaW5nKHgpKTtcbiAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInlcIiwgU3RyaW5nKHkpKTtcbiAgICB0ZXh0LnNldEF0dHJpYnV0ZShcInRleHQtYW5jaG9yXCIsIFwibWlkZGxlXCIpO1xuICAgIHRleHQuc2V0QXR0cmlidXRlKFwiZG9taW5hbnQtYmFzZWxpbmVcIiwgXCJtaWRkbGVcIik7XG4gICAgdGV4dC50ZXh0Q29udGVudCA9IGtleTtcblxuICAgIGcuYXBwZW5kQ2hpbGQodGV4dCk7XG4gICAgc3ZnLmFwcGVuZENoaWxkKGcpO1xuXG4gICAgLy8gQ2xpY2sgaGFuZGxlclxuICAgIGcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGNvbnN0IG1hdGNoID0gY2FtZWxvdFRvS2V5TmFtZShrZXkpO1xuICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuO1xuICAgICAgLy8gUHJlZmVyIHRoZSBzaGFycCBzcGVsbGluZyBmb3IgRGF0YXZpZXcgY29uc2lzdGVuY3lcbiAgICAgIGNvbnN0IGR2S2V5ID0gbWF0Y2gua2V5LnNwbGl0KFwiIC8gXCIpWzBdO1xuICAgICAgY29uc3QgZHZRdWVyeSA9IGBcXGBcXGBcXGBkYXRhdmlld1xcbkxJU1RcXG5GUk9NICNtdXNpY1xcbldIRVJFIGtleSA9IFwiJHtkdktleX1cIlxcblNPUlQgdGVtcG8gQVNDXFxuXFxgXFxgXFxgYDtcbiAgICAgIHRoaXMuY29uZmlnLm9uS2V5Q2xpY2soa2V5LCBkdlF1ZXJ5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluZXIucmVtb3ZlKCk7XG4gIH1cbn1cbiIsICIvLyBNdXNpY0Rhc2hib2FyZFByb2Nlc3NvciBcdTIwMTQgT2JzaWRpYW4gY29kZS1ibG9jayByZW5kZXJlciBmb3IgYG11c2ljLWRhc2hib2FyZGBcbi8vIERyaXZlbiBlbnRpcmVseSBieSBmcm9udG1hdHRlciAoemVybyBhbmFseXNpcyBhdCByZW5kZXIgdGltZSkuXG4vL1xuLy8gQ1NTIGNsYXNzIGhvb2tzIChmb3IgdGhlbWluZyBieSB1c2VyKTpcbi8vICAubWFtLWRhc2hib2FyZCAgICAgICAgICAgICBcdTIwMTQgcm9vdCBjb250YWluZXJcbi8vICAubWFtLWRhc2hib2FyZC1oZWFkZXIgICAgICBcdTIwMTQgdG9wIHRpdGxlIGJhclxuLy8gIC5tYW0tZGFzaGJvYXJkLW1ldGEgICAgICAgIFx1MjAxNCBCUE0gKyBrZXkgcm93XG4vLyAgLm1hbS1kYXNoYm9hcmQtc2VjdGlvbiAgICAgXHUyMDE0IHN1Yi1zdXJmYWNlIHdyYXBwZXJcbi8vICAubWFtLWRhc2hib2FyZC1zZWN0aW9uLWxhYmVsXG4vLyAgLm1hbS1kYXNoYm9hcmQtY29udHJvbHMgICAgXHUyMDE0IEJQTSArIGtleSByZXVzYWJsZSBjb250cm9scyBhcmVhXG4vLyAgLm1hbS1kYXNoYm9hcmQtdGltZWxpbmUgICAgXHUyMDE0IHN0cnVjdHVyZSB0aW1lbGluZSBjb250YWluZXJcbi8vICAubWFtLWRhc2hib2FyZC10dW5lciAgICAgICBcdTIwMTQgdHVuZXIgZ2F1Z2UgY29udGFpbmVyXG4vLyAgLm1hbS1kYXNoYm9hcmQtY2FtZWxvdCAgICAgXHUyMDE0IENhbWVsb3Qgd2hlZWwgY29udGFpbmVyXG5cbmltcG9ydCB7IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IEJwbUNvbnRyb2wsIEJwbUNvbnRyb2xTdGF0ZSwgQnBtQ29udHJvbENhbGxiYWNrcyB9IGZyb20gXCIuL2JwbS1jb250cm9sXCI7XG5pbXBvcnQgeyBLZXlDb250cm9sLCBLZXlDb250cm9sU3RhdGUsIEtleUNvbnRyb2xDYWxsYmFja3MgfSBmcm9tIFwiLi9rZXktY29udHJvbFwiO1xuaW1wb3J0IHsgU3RydWN0dXJlVGltZWxpbmUsIFN0cnVjdHVyZVNlZ21lbnQgfSBmcm9tIFwiLi9zdHJ1Y3R1cmUtdGltZWxpbmVcIjtcbmltcG9ydCB7IFR1bmVyTmVlZGxlIH0gZnJvbSBcIi4vdHVuZXItbmVlZGxlXCI7XG5pbXBvcnQgeyBDYW1lbG90V2hlZWwsIGtleU5hbWVUb0NhbWVsb3QgfSBmcm9tIFwiLi9jYW1lbG90LXdoZWVsXCI7XG5pbXBvcnQgeyBpbmplY3RGcm9udG1hdHRlciwgcGFyc2VGcm9udG1hdHRlciB9IGZyb20gXCIuLi95YW1sLWluamVjdG9yXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGFzaGJvYXJkRnJvbnRtYXR0ZXIge1xuICBzb3VyY2VGaWxlOiBzdHJpbmc7ICAgICAgICAgIC8vIGFjdGl2ZSBmaWxlIHBhdGhcbiAgdGVtcG86IG51bWJlcjtcbiAgcmF3X3RlbXBvPzogbnVtYmVyO1xuICBhbHRlcm5hdGVfdGVtcG8/OiBudW1iZXI7XG4gIHRlbXBvX2NvbmZpcm1lZDogYm9vbGVhbjtcbiAga2V5OiBzdHJpbmc7XG4gIGtleV9jb25maXJtZWQ6IGJvb2xlYW47XG4gIGR1cmF0aW9uPzogc3RyaW5nOyAgICAgICAgICAgLy8gXCIyOjM0XCJcbiAgYXVkaW9fc3RhcnRfb2Zmc2V0PzogbnVtYmVyOyAvLyBiYXJzIHRvIHRyaW0gbGVhZC1pblxuICBzdHJ1Y3R1cmU/OiBBcnJheTx7XG4gICAgc2VnbWVudDogc3RyaW5nO1xuICAgIGJhcnM6IFtudW1iZXIsIG51bWJlcl07XG4gICAgdGltZT86IFtzdHJpbmcsIHN0cmluZ107XG4gIH0+O1xufVxuXG5leHBvcnQgY2xhc3MgTXVzaWNEYXNoYm9hcmRQcm9jZXNzb3Ige1xuICBwcml2YXRlIHZhdWx0QWN0aW9uczoge1xuICAgIHJlYWRGaWxlOiAocGF0aDogc3RyaW5nKSA9PiBQcm9taXNlPHN0cmluZz47XG4gICAgbW9kaWZ5RmlsZTogKHBhdGg6IHN0cmluZywgY29udGVudDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xuICAgIGdldEZpbGVCeVBhdGg6IChwYXRoOiBzdHJpbmcpID0+IHsgcGF0aDogc3RyaW5nIH0gfCBudWxsO1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHZhdWx0QWN0aW9uczogTXVzaWNEYXNoYm9hcmRQcm9jZXNzb3JbXCJ2YXVsdEFjdGlvbnNcIl0pIHtcbiAgICB0aGlzLnZhdWx0QWN0aW9ucyA9IHZhdWx0QWN0aW9ucztcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3MoXG4gICAgc291cmNlOiBzdHJpbmcsXG4gICAgZWw6IEhUTUxFbGVtZW50LFxuICAgIGN0eDogTWFya2Rvd25Qb3N0UHJvY2Vzc29yQ29udGV4dCxcbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gc291cmNlIGlzIGlnbm9yZWQgXHUyMDE0IHRoZSBwcm9jZXNzb3IgcmVhZHMgdGhlIHBhcmVudCBub3RlJ3MgZnJvbnRtYXR0ZXJcbiAgICBjb25zdCBjb250YWluZXIgPSBlbC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWRhc2hib2FyZFwiIH0pO1xuXG4gICAgLy8gUmVzb2x2ZSB0aGUgc291cmNlIGZpbGVcbiAgICBjb25zdCBmaWxlUGF0aCA9IGN0eC5zb3VyY2VQYXRoO1xuXG4gICAgLy8gUmVhZCBmcm9udG1hdHRlciBmcm9tIHRoZSB2YXVsdFxuICAgIGxldCBmbTogRGFzaGJvYXJkRnJvbnRtYXR0ZXI7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJhdyA9IGF3YWl0IHRoaXMudmF1bHRBY3Rpb25zLnJlYWRGaWxlKGZpbGVQYXRoKTtcbiAgICAgIGZtID0gdGhpcy5wYXJzZUZyb250bWF0dGVyKHJhdywgZmlsZVBhdGgpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgY29udGFpbmVyLmNyZWF0ZUVsKFwicFwiLCB7XG4gICAgICAgIGNsczogXCJtYW0tZGFzaGJvYXJkLWVtcHR5XCIsXG4gICAgICAgIHRleHQ6IFwiTm8gbXVzaWMgYW5hbHlzaXMgZGF0YSBmb3VuZCBpbiB0aGlzIG5vdGUuIFJ1biBcXHUyMDFjQW5hbHl6ZSBhdWRpb1xcdTIwMWQgZmlyc3QuXCIsXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgSGVhZGVyIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGhlYWRlciA9IGNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWRhc2hib2FyZC1oZWFkZXJcIiB9KTtcbiAgICBoZWFkZXIuY3JlYXRlRWwoXCJoM1wiLCB7IHRleHQ6IGZtLnNvdXJjZUZpbGUuc3BsaXQoXCIvXCIpLnBvcCgpIHx8IFwiVW50aXRsZWRcIiB9KTtcbiAgICBpZiAoZm0uZHVyYXRpb24pIHtcbiAgICAgIGhlYWRlci5jcmVhdGVTcGFuKHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtZHVyYXRpb25cIiwgdGV4dDogZm0uZHVyYXRpb24gfSk7XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIE1ldGEgcm93IChCUE0gKyBrZXksIGNvbXBhY3QpIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IG1ldGEgPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtbWV0YVwiIH0pO1xuICAgIGNvbnN0IGJwbUVsID0gbWV0YS5jcmVhdGVTcGFuKHtcbiAgICAgIGNsczogZm0udGVtcG9fY29uZmlybWVkID8gXCJtYW0tbWV0YS1jb25maXJtZWRcIiA6IFwibWFtLW1ldGEtdW5jb25maXJtZWRcIixcbiAgICB9KTtcbiAgICBicG1FbC5zZXRUZXh0KGAke2ZtLnRlbXBvfSBCUE1gKTtcbiAgICBpZiAoZm0uYWx0ZXJuYXRlX3RlbXBvKSB7XG4gICAgICBicG1FbC5zZXRUZXh0KGAke2ZtLnRlbXBvfSBCUE0gKG9yICR7Zm0uYWx0ZXJuYXRlX3RlbXBvfT8pYCk7XG4gICAgfVxuICAgIG1ldGEuY3JlYXRlU3Bhbih7IHRleHQ6IFwiIFxcdTIwMjIgXCIgfSk7XG4gICAgY29uc3Qga2V5RWwgPSBtZXRhLmNyZWF0ZVNwYW4oe1xuICAgICAgY2xzOiBmbS5rZXlfY29uZmlybWVkID8gXCJtYW0tbWV0YS1jb25maXJtZWRcIiA6IFwibWFtLW1ldGEtdW5jb25maXJtZWRcIixcbiAgICB9KTtcbiAgICBrZXlFbC5zZXRUZXh0KGZtLmtleSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgQ29udHJvbHMgKHJldXNhYmxlIEJQTSArIEtleSkgXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgY29udHJvbHNTZWN0aW9uID0gY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkLXNlY3Rpb25cIiB9KTtcbiAgICBjb250cm9sc1NlY3Rpb24uY3JlYXRlRWwoXCJoNFwiLCB7IGNsczogXCJtYW0tZGFzaGJvYXJkLXNlY3Rpb24tbGFiZWxcIiwgdGV4dDogXCJDb250cm9sc1wiIH0pO1xuICAgIGNvbnN0IGNvbnRyb2xzQXJlYSA9IGNvbnRyb2xzU2VjdGlvbi5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWRhc2hib2FyZC1jb250cm9sc1wiIH0pO1xuXG4gICAgY29uc3QgaXNNaW5vciA9IGZtLmtleS5lbmRzV2l0aChcIm1cIik7XG4gICAgY29uc3QgYmFzZUtleSA9IGlzTWlub3IgPyBmbS5rZXkuc2xpY2UoMCwgLTEpIDogZm0ua2V5O1xuXG4gICAgY29uc3QgYnBtU3RhdGU6IEJwbUNvbnRyb2xTdGF0ZSA9IHtcbiAgICAgIGJwbTogZm0udGVtcG8sXG4gICAgICByYXdCcG06IGZtLnJhd190ZW1wbyA/PyBmbS50ZW1wbyxcbiAgICAgIGFsdGVybmF0ZUJwbTogZm0uYWx0ZXJuYXRlX3RlbXBvLFxuICAgICAgY29uZmlybWVkOiBmbS50ZW1wb19jb25maXJtZWQsXG4gICAgfTtcbiAgICBjb25zdCBrZXlTdGF0ZTogS2V5Q29udHJvbFN0YXRlID0ge1xuICAgICAga2V5OiBiYXNlS2V5LFxuICAgICAgc2NhbGU6IGlzTWlub3IgPyBcIm1pbm9yXCIgOiBcIm1ham9yXCIsXG4gICAgICByZWxhdGl2ZUtleTogdW5kZWZpbmVkLFxuICAgICAgY29uZmlybWVkOiBmbS5rZXlfY29uZmlybWVkLFxuICAgIH07XG5cbiAgICBjb25zdCBzYXZlVG9GbSA9IGFzeW5jIChwYXJ0aWFsOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmF3ID0gYXdhaXQgdGhpcy52YXVsdEFjdGlvbnMucmVhZEZpbGUoZmlsZVBhdGgpO1xuICAgICAgICBjb25zdCB1cGRhdGVkID0gaW5qZWN0RnJvbnRtYXR0ZXIocmF3LCBwYXJ0aWFsIGFzIGFueSk7XG4gICAgICAgIGF3YWl0IHRoaXMudmF1bHRBY3Rpb25zLm1vZGlmeUZpbGUoZmlsZVBhdGgsIHVwZGF0ZWQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBTaWxlbnQgZmFpbCBcdTIwMTQgdmF1bHQgd3JpdGVzIGFyZSBiZXN0LWVmZm9ydCBpbiBkYXNoYm9hcmRcbiAgICAgICAgY29uc29sZS53YXJuKFwiW01BTV0gRGFzaGJvYXJkIHNhdmUgZmFpbGVkOlwiLCBlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgYnBtQ29udHJvbCA9IG5ldyBCcG1Db250cm9sKGNvbnRyb2xzQXJlYSwgYnBtU3RhdGUsIHtcbiAgICAgIG9uQ2hhbmdlOiBhc3luYyAoYnBtKSA9PiB7XG4gICAgICAgIGF3YWl0IHNhdmVUb0ZtKHsgdGVtcG86IGJwbSwgdGVtcG9fY29uZmlybWVkOiB0cnVlIH0pO1xuICAgICAgfSxcbiAgICAgIG9uQ29uZmlybWVkOiBhc3luYyAoY29uZmlybWVkKSA9PiB7XG4gICAgICAgIGF3YWl0IHNhdmVUb0ZtKHsgdGVtcG9fY29uZmlybWVkOiBjb25maXJtZWQgfSk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIGJwbUNvbnRyb2wubW91bnQoY29udHJvbHNBcmVhKTtcblxuICAgIGNvbnN0IGtleUNvbnRyb2wgPSBuZXcgS2V5Q29udHJvbChjb250cm9sc0FyZWEsIGtleVN0YXRlLCB7XG4gICAgICBvbkNoYW5nZTogYXN5bmMgKGtleSwgc2NhbGUpID0+IHtcbiAgICAgICAgY29uc3QgZGlzcGxheSA9IHNjYWxlID09PSBcIm1pbm9yXCIgPyBgJHtrZXl9bWAgOiBrZXk7XG4gICAgICAgIGF3YWl0IHNhdmVUb0ZtKHsga2V5OiBkaXNwbGF5LCBrZXlfY29uZmlybWVkOiB0cnVlIH0pO1xuICAgICAgfSxcbiAgICAgIG9uQ29uZmlybWVkOiBhc3luYyAoY29uZmlybWVkKSA9PiB7XG4gICAgICAgIGF3YWl0IHNhdmVUb0ZtKHsga2V5X2NvbmZpcm1lZDogY29uZmlybWVkIH0pO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBrZXlDb250cm9sLm1vdW50KGNvbnRyb2xzQXJlYSk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgU3RydWN0dXJlIHRpbWVsaW5lIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHRpbWVsaW5lU2VjdGlvbiA9IGNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWRhc2hib2FyZC1zZWN0aW9uXCIgfSk7XG4gICAgdGltZWxpbmVTZWN0aW9uLmNyZWF0ZUVsKFwiaDRcIiwgeyBjbHM6IFwibWFtLWRhc2hib2FyZC1zZWN0aW9uLWxhYmVsXCIsIHRleHQ6IFwiU3RydWN0dXJlXCIgfSk7XG5cbiAgICBjb25zdCBzZWdtZW50czogU3RydWN0dXJlU2VnbWVudFtdID0gKGZtLnN0cnVjdHVyZSB8fCBbXSkubWFwKChzKSA9PiAoe1xuICAgICAgaWQ6IHMuc2VnbWVudCxcbiAgICAgIGxhYmVsOiBzLnNlZ21lbnQsXG4gICAgICBzdGFydEJhcjogcy5iYXJzWzBdLFxuICAgICAgZW5kQmFyOiBzLmJhcnNbMV0sXG4gICAgICBjb2xvcjogdGhpcy5jb2xvckZvclNlZ21lbnQocy5zZWdtZW50KSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCB0aW1lbGluZSA9IG5ldyBTdHJ1Y3R1cmVUaW1lbGluZShcbiAgICAgIHRpbWVsaW5lU2VjdGlvbixcbiAgICAgIHNlZ21lbnRzLFxuICAgICAgZm0udGVtcG8sXG4gICAgICBmbS5hdWRpb19zdGFydF9vZmZzZXQgPz8gMCxcbiAgICApO1xuICAgIHRpbWVsaW5lLm9uT2Zmc2V0Q2hhbmdlID0gYXN5bmMgKG9mZnNldCkgPT4ge1xuICAgICAgYXdhaXQgc2F2ZVRvRm0oeyBhdWRpb19zdGFydF9vZmZzZXQ6IG9mZnNldCB9KTtcbiAgICB9O1xuICAgIHRpbWVsaW5lLm1vdW50KCk7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgVHVuZXIgbmVlZGxlIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IHR1bmVyU2VjdGlvbiA9IGNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWRhc2hib2FyZC1zZWN0aW9uXCIgfSk7XG4gICAgdHVuZXJTZWN0aW9uLmNyZWF0ZUVsKFwiaDRcIiwgeyBjbHM6IFwibWFtLWRhc2hib2FyZC1zZWN0aW9uLWxhYmVsXCIsIHRleHQ6IFwiVHVuZXJcIiB9KTtcbiAgICBjb25zdCB0dW5lckNvbnRhaW5lciA9IHR1bmVyU2VjdGlvbi5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWRhc2hib2FyZC10dW5lclwiIH0pO1xuICAgIGNvbnN0IHR1bmVyID0gbmV3IFR1bmVyTmVlZGxlKHR1bmVyQ29udGFpbmVyLCB7XG4gICAgICBrZXk6IGJhc2VLZXksXG4gICAgICBzY2FsZTogaXNNaW5vciA/IFwibWlub3JcIiA6IFwibWFqb3JcIixcbiAgICAgIGNvbmZpcm1lZDogZm0ua2V5X2NvbmZpcm1lZCxcbiAgICB9KTtcbiAgICB0dW5lci5tb3VudCgpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIENhbWVsb3Qgd2hlZWwgXHUyNTAwXHUyNTAwXG4gICAgY29uc3QgY2FtZWxvdFNlY3Rpb24gPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvblwiIH0pO1xuICAgIGNhbWVsb3RTZWN0aW9uLmNyZWF0ZUVsKFwiaDRcIiwgeyBjbHM6IFwibWFtLWRhc2hib2FyZC1zZWN0aW9uLWxhYmVsXCIsIHRleHQ6IFwiQ2FtZWxvdFwiIH0pO1xuICAgIGNvbnN0IGNhbWVsb3RDb250YWluZXIgPSBjYW1lbG90U2VjdGlvbi5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWRhc2hib2FyZC1jYW1lbG90XCIgfSk7XG4gICAgY29uc3QgY2FtZWxvdCA9IG5ldyBDYW1lbG90V2hlZWwoY2FtZWxvdENvbnRhaW5lciwge1xuICAgICAgY3VycmVudDoga2V5TmFtZVRvQ2FtZWxvdChiYXNlS2V5LCBpc01pbm9yID8gXCJtaW5vclwiIDogXCJtYWpvclwiKSxcbiAgICAgIG9uS2V5Q2xpY2s6IChfY2FtZWxvdEtleSwgZHZRdWVyeSkgPT4gdGhpcy5oYW5kbGVDYW1lbG90Q2xpY2soZHZRdWVyeSksXG4gICAgfSk7XG4gICAgY2FtZWxvdC5tb3VudCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZUZyb250bWF0dGVyKHJhdzogc3RyaW5nLCBzb3VyY2VQYXRoOiBzdHJpbmcpOiBEYXNoYm9hcmRGcm9udG1hdHRlciB7XG4gICAgY29uc3QgZm0gPSBwYXJzZUZyb250bWF0dGVyKHJhdyk7XG5cbiAgICBpZiAoIWZtLnRlbXBvICYmICFmbS5rZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGFuYWx5c2lzIGRhdGEgaW4gZnJvbnRtYXR0ZXJcIik7XG4gICAgfVxuXG4gICAgbGV0IHN0cnVjdHVyZTogRGFzaGJvYXJkRnJvbnRtYXR0ZXJbXCJzdHJ1Y3R1cmVcIl0gPSB1bmRlZmluZWQ7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZm0uc3RydWN0dXJlKSkge1xuICAgICAgc3RydWN0dXJlID0gZm0uc3RydWN0dXJlIGFzIGFueTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc291cmNlRmlsZTogc291cmNlUGF0aCxcbiAgICAgIHRlbXBvOiBOdW1iZXIoZm0udGVtcG8gPz8gMCksXG4gICAgICByYXdfdGVtcG86IGZtLnJhd190ZW1wbyA/IE51bWJlcihmbS5yYXdfdGVtcG8pIDogdW5kZWZpbmVkLFxuICAgICAgYWx0ZXJuYXRlX3RlbXBvOiBmbS5hbHRlcm5hdGVfdGVtcG8gPyBOdW1iZXIoZm0uYWx0ZXJuYXRlX3RlbXBvKSA6IHVuZGVmaW5lZCxcbiAgICAgIHRlbXBvX2NvbmZpcm1lZDogISFmbS50ZW1wb19jb25maXJtZWQsXG4gICAgICBrZXk6IFN0cmluZyhmbS5rZXkgPz8gXCJcIiksXG4gICAgICBrZXlfY29uZmlybWVkOiAhIWZtLmtleV9jb25maXJtZWQsXG4gICAgICBkdXJhdGlvbjogZm0uZHVyYXRpb24gPyBTdHJpbmcoZm0uZHVyYXRpb24pIDogdW5kZWZpbmVkLFxuICAgICAgYXVkaW9fc3RhcnRfb2Zmc2V0OiBOdW1iZXIoZm0uYXVkaW9fc3RhcnRfb2Zmc2V0ID8/IDApLFxuICAgICAgc3RydWN0dXJlLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGNvbG9yRm9yU2VnbWVudChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IGNvbG9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAgIEludHJvOiBcInZhcigtLWNvbG9yLWFjY2VudClcIiAsXG4gICAgICBWZXJzZTogXCJ2YXIoLS1pbnRlcmFjdGl2ZS1hY2NlbnQpXCIsXG4gICAgICBDaG9ydXM6IFwidmFyKC0tY29sb3ItZ3JlZW4pXCIgLFxuICAgICAgQnJpZGdlOiBcInZhcigtLWNvbG9yLXllbGxvdylcIiAsXG4gICAgICBcIlByZS1jaG9ydXNcIjogXCJ2YXIoLS1jb2xvci1vcmFuZ2UpXCIgLFxuICAgICAgSG9vazogXCJ2YXIoLS1jb2xvci1yZWQpXCIgLFxuICAgICAgT3V0cm86IFwidmFyKC0tY29sb3ItcHVycGxlKVwiICxcbiAgICAgIEJyZWFrZG93bjogXCJ2YXIoLS1jb2xvci1jeWFuKVwiICxcbiAgICB9O1xuICAgIHJldHVybiBjb2xvcnNbbmFtZV0gfHwgXCJ2YXIoLS10ZXh0LW11dGVkKVwiO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVDYW1lbG90Q2xpY2soZHZRdWVyeTogc3RyaW5nKTogdm9pZCB7XG4gICAgbmF2aWdhdG9yLmNsaXBib2FyZD8ud3JpdGVUZXh0KGR2UXVlcnkpLmNhdGNoKCgpID0+IHsgLyogbm8tb3AgKi8gfSk7XG4gICAgY29uc29sZS5sb2coXCJbTUFNXSBDYW1lbG90IGtleSBjbGlja2VkIFx1MjAxNCBEYXRhdmlldyBxdWVyeSBjb3BpZWQgdG8gY2xpcGJvYXJkXCIpO1xuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBLElBQUFBLG1CQUF5RTs7O0FDR3pFLGVBQXNCLE9BQU8sUUFBc0M7QUFDakUsUUFBTSxhQUFhLE1BQU0sT0FBTyxPQUFPLE9BQU8sV0FBVyxNQUFNO0FBQy9ELFFBQU0sWUFBWSxNQUFNLEtBQUssSUFBSSxXQUFXLFVBQVUsQ0FBQztBQUN2RCxTQUFPLFVBQVUsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRSxTQUFTLEdBQUcsR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFO0FBQ3RFOzs7QUNSQSxJQUFNLFFBQVEsT0FBTyxJQUFJLFlBQVk7QUFDckMsSUFBTSxNQUFNLE9BQU8sSUFBSSxlQUFlO0FBQ3RDLElBQU0sTUFBTSxPQUFPLElBQUksVUFBVTtBQUNqQyxJQUFNLE9BQU8sT0FBTyxJQUFJLFdBQVc7QUFDbkMsSUFBTSxTQUFTLE9BQU8sSUFBSSxhQUFhO0FBQ3ZDLElBQU0sTUFBTSxPQUFPLElBQUksVUFBVTtBQUNqQyxJQUFNLFlBQVksT0FBTyxJQUFJLGdCQUFnQjtBQUM3QyxJQUFNLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLE9BQU8sU0FBUyxZQUFZLEtBQUssU0FBUyxNQUFNO0FBQ3BGLElBQU0sYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsT0FB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RCxRQUFJLFVBQVU7QUFDWixZQUFNLEtBQUssSUFBSSxNQUFNLE9BQU8sVUFBVSxPQUFPO0FBQUEsSUFDL0MsT0FBTztBQUNMLFlBQU0sS0FBSyxJQUFJLE1BQU0sT0FBTyxNQUFNLE9BQU87QUFBQSxJQUMzQztBQUFBLEVBQ0Y7QUFBQSxFQUVRLGVBQWUsS0FBcUI7QUFDMUMsVUFBTSxJQUFJLEtBQUssTUFBTSxNQUFNLEVBQUU7QUFDN0IsVUFBTSxJQUFJLEtBQUssTUFBTSxNQUFNLEVBQUU7QUFDN0IsV0FBTyxHQUFHLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQUEsRUFDOUM7QUFDRjsiLAogICJuYW1lcyI6IFsiaW1wb3J0X29ic2lkaWFuIiwgInJlcyIsICJyZXMiLCAibWFwIiwgInNjaGVtYSIsICJub2RlIiwgInNjaGVtYSIsICJpIiwgImVuZCIsICJpc0Jsb2NrIiwgIm1hcCIsICJ2YWx1ZSIsICJtYXAiLCAic2NoZW1hIiwgInN0cmluZ2lmeSIsICJjb21tZW50IiwgInN0ciIsICJzY2hlbWEiLCAibWFwIiwgIm1hcCIsICJzY2hlbWEiLCAic2NoZW1hIiwgInNlcSIsICJzZXEiLCAic2NoZW1hIiwgImludElkZW50aWZ5IiwgInNjaGVtYSIsICJzZXEiLCAic2NoZW1hIiwgInBhaXJzIiwgIm1hcCIsICJzY2hlbWEiLCAicGFpcnMiLCAib21hcCIsICJzZXEiLCAiZmxvYXROYU4iLCAiZmxvYXRFeHAiLCAiZmxvYXQiLCAiaW50SWRlbnRpZnkiLCAiaW50UmVzb2x2ZSIsICJuIiwgImludFN0cmluZ2lmeSIsICJpbnRPY3QiLCAiaW50IiwgImludEhleCIsICJzY2hlbWEiLCAic2V0IiwgIm1hcCIsICJyZXMiLCAic2NoZW1hIiwgImludE9jdCIsICJpbnQiLCAiaW50SGV4IiwgImZsb2F0TmFOIiwgImZsb2F0RXhwIiwgImZsb2F0IiwgInNjaGVtYSIsICJ0YWdzIiwgIm1lcmdlIiwgInNjaGVtYSIsICJyZXMiLCAiY29tcG9zZU5vZGUiLCAiY29tcG9zZUVtcHR5Tm9kZSIsICJtYXAiLCAiY29tcG9zZU5vZGUiLCAiY29tcG9zZUVtcHR5Tm9kZSIsICJzZXEiLCAiY29tcG9zZU5vZGUiLCAiY29tcG9zZUVtcHR5Tm9kZSIsICJpc01hcCIsICJtYXAiLCAiQ04iLCAidmFsdWUiLCAiZW5kIiwgInNjaGVtYSIsICJ0YWciLCAiQlJFQUsiLCAiU0tJUCIsICJSRU1PVkUiLCAidmlzaXQiLCAiU0NBTEFSIiwgIlNDQUxBUiIsICJpIiwgImNoIiwgIlNDQUxBUiIsICJtYXAiLCAic3RhcnQiLCAic2VxIiwgIm1hcCJdCn0K

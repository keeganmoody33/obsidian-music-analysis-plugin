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
      const workerPath = this.app.vault.adapter.getResourcePath(
        `${this.manifest.dir}/dist/worker.js`
      );
      this.worker = new Worker(workerPath);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL21haW4udHMiLCAiLi4vc3JjL3NoYTI1Ni50cyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvbm9kZXMvaWRlbnRpdHkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3Zpc2l0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9kb2MvZGlyZWN0aXZlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvZG9jL2FuY2hvcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2RvYy9hcHBseVJldml2ZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L25vZGVzL3RvSlMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L25vZGVzL05vZGUuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L25vZGVzL0FsaWFzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9ub2Rlcy9TY2FsYXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2RvYy9jcmVhdGVOb2RlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9ub2Rlcy9Db2xsZWN0aW9uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zdHJpbmdpZnkvc3RyaW5naWZ5Q29tbWVudC5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc3RyaW5naWZ5L2ZvbGRGbG93TGluZXMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9zdHJpbmdpZnlTdHJpbmcuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9zdHJpbmdpZnkuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9zdHJpbmdpZnlQYWlyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9sb2cuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS95YW1sLTEuMS9tZXJnZS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvbm9kZXMvYWRkUGFpclRvSlNNYXAuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L25vZGVzL1BhaXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9zdHJpbmdpZnlDb2xsZWN0aW9uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9ub2Rlcy9ZQU1MTWFwLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvY29tbW9uL21hcC5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvbm9kZXMvWUFNTFNlcS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL2NvbW1vbi9zZXEuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS9jb21tb24vc3RyaW5nLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvY29tbW9uL251bGwuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS9jb3JlL2Jvb2wuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3N0cmluZ2lmeS9zdHJpbmdpZnlOdW1iZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS9jb3JlL2Zsb2F0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvY29yZS9pbnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS9jb3JlL3NjaGVtYS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL2pzb24vc2NoZW1hLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvYmluYXJ5LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvcGFpcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3NjaGVtYS95YW1sLTEuMS9vbWFwLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvYm9vbC5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL3lhbWwtMS4xL2Zsb2F0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvaW50LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvc2V0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvdGltZXN0YW1wLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEveWFtbC0xLjEvc2NoZW1hLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9zY2hlbWEvdGFncy5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc2NoZW1hL1NjaGVtYS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3Qvc3RyaW5naWZ5L3N0cmluZ2lmeURvY3VtZW50LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9kb2MvRG9jdW1lbnQuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L2Vycm9ycy5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9yZXNvbHZlLXByb3BzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3V0aWwtY29udGFpbnMtbmV3bGluZS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS91dGlsLWZsb3ctaW5kZW50LWNoZWNrLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3V0aWwtbWFwLWluY2x1ZGVzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3Jlc29sdmUtYmxvY2stbWFwLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3Jlc29sdmUtYmxvY2stc2VxLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3Jlc29sdmUtZW5kLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3Jlc29sdmUtZmxvdy1jb2xsZWN0aW9uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL2NvbXBvc2UtY29sbGVjdGlvbi5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9yZXNvbHZlLWJsb2NrLXNjYWxhci5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9yZXNvbHZlLWZsb3ctc2NhbGFyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL2NvbXBvc2Utc2NhbGFyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL3V0aWwtZW1wdHktc2NhbGFyLXBvc2l0aW9uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9jb21wb3NlL2NvbXBvc2Utbm9kZS5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9jb21wb3NlLWRvYy5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvY29tcG9zZS9jb21wb3Nlci5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvcGFyc2UvY3N0LXZpc2l0LmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9wYXJzZS9jc3QuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3BhcnNlL2xleGVyLmpzIiwgIi4uL25vZGVfbW9kdWxlcy95YW1sL2Jyb3dzZXIvZGlzdC9wYXJzZS9saW5lLWNvdW50ZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzL3lhbWwvYnJvd3Nlci9kaXN0L3BhcnNlL3BhcnNlci5qcyIsICIuLi9ub2RlX21vZHVsZXMveWFtbC9icm93c2VyL2Rpc3QvcHVibGljLWFwaS5qcyIsICIuLi9zcmMveWFtbC1pbmplY3Rvci50cyIsICIuLi9zcmMvY29tcG9uZW50cy9jb25maXJtLW1vZGFsLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL3RhcC10ZW1wby50cyIsICIuLi9zcmMvY29tcG9uZW50cy9icG0tY29udHJvbC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9rZXktY29udHJvbC50cyIsICIuLi9zcmMvY29tcG9uZW50cy9zdHJ1Y3R1cmUtdGltZWxpbmUudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvdHVuZXItbmVlZGxlLnRzIiwgIi4uL3NyYy9jb21wb25lbnRzL2NhbWVsb3Qtd2hlZWwudHMiLCAiLi4vc3JjL2NvbXBvbmVudHMvZGFzaGJvYXJkLXByb2Nlc3Nvci50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gbWFpbi50cyBcdTIwMTQgT2JzaWRpYW4gcGx1Z2luIGVudHJ5IHBvaW50IChTbGljZSAyOiBjb25maXJtLWZpcnN0IFVYKVxuaW1wb3J0IHsgUGx1Z2luLCBOb3RpY2UsIFRGaWxlLCBUQWJzdHJhY3RGaWxlLCBNYXJrZG93blZpZXcsIE1lbnUgfSBmcm9tIFwib2JzaWRpYW5cIjtcbmltcG9ydCB7IHNoYTI1NiB9IGZyb20gXCIuL3NoYTI1NlwiO1xuaW1wb3J0IHsgaW5qZWN0RnJvbnRtYXR0ZXIgfSBmcm9tIFwiLi95YW1sLWluamVjdG9yXCI7XG5pbXBvcnQgeyBBbmFseXNpc1Jlc3VsdCB9IGZyb20gXCIuL2FuYWx5c2lzLWVuZ2luZVwiO1xuaW1wb3J0IHsgQW5hbHlzaXNDb25maXJtTW9kYWwgfSBmcm9tIFwiLi9jb21wb25lbnRzL2NvbmZpcm0tbW9kYWxcIjtcbmltcG9ydCB7IEJwbUNvbnRyb2xTdGF0ZSB9IGZyb20gXCIuL2NvbXBvbmVudHMvYnBtLWNvbnRyb2xcIjtcbmltcG9ydCB7IEtleUNvbnRyb2xTdGF0ZSB9IGZyb20gXCIuL2NvbXBvbmVudHMva2V5LWNvbnRyb2xcIjtcbmltcG9ydCB7IE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yIH0gZnJvbSBcIi4vY29tcG9uZW50cy9kYXNoYm9hcmQtcHJvY2Vzc29yXCI7XG5cbmludGVyZmFjZSBBbmFseXNpc0NhY2hlRW50cnkge1xuICBoYXNoOiBzdHJpbmc7XG4gIHJlc3VsdDogQW5hbHlzaXNSZXN1bHQ7XG4gIHRpbWVzdGFtcDogbnVtYmVyO1xufVxuXG4vLyBJbi1tZW1vcnkgY2FjaGUgZm9yIGN1cnJlbnQgc2Vzc2lvbiAodmF1bHQtYm91bmQpXG5jb25zdCBhbmFseXNpc0NhY2hlID0gbmV3IE1hcDxzdHJpbmcsIEFuYWx5c2lzQ2FjaGVFbnRyeT4oKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVzaWNBbmFseXNpc1BsdWdpbiBleHRlbmRzIFBsdWdpbiB7XG4gIHByaXZhdGUgd29ya2VyOiBXb3JrZXIgfCBudWxsID0gbnVsbDtcblxuICBhc3luYyBvbmxvYWQoKSB7XG4gICAgY29uc29sZS5sb2coXCJbTXVzaWNBbmFseXNpc10gU2xpY2UgMyBsb2FkZWRcIik7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiYW5hbHl6ZS1hdWRpb1wiLFxuICAgICAgbmFtZTogXCJBbmFseXplIGF1ZGlvICh0ZW1wbywga2V5LCBkdXJhdGlvbilcIixcbiAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnJ1bkFuYWx5c2lzKCksXG4gICAgfSk7XG5cbiAgICB0aGlzLmFkZENvbW1hbmQoe1xuICAgICAgaWQ6IFwiY29uZmlybS1hbmFseXNpc1wiLFxuICAgICAgbmFtZTogXCJDb25maXJtIGFuYWx5c2lzIChvcGVuIGNvcnJlY3Rpb24gbW9kYWwpXCIsXG4gICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5vcGVuQ29uZmlybU1vZGFsKCksXG4gICAgfSk7XG5cbiAgICAvLyBSZWdpc3RlciBgbXVzaWMtZGFzaGJvYXJkYCBjb2RlLWJsb2NrIHJlbmRlcmVyXG4gICAgY29uc3QgZGFzaGJvYXJkUHJvY2Vzc29yID0gbmV3IE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yKHtcbiAgICAgIHJlYWRGaWxlOiBhc3luYyAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgICBpZiAoIWYpIHRocm93IG5ldyBFcnJvcihcIkZpbGUgbm90IGZvdW5kOiBcIiArIHBhdGgpO1xuICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmKTtcbiAgICAgIH0sXG4gICAgICBtb2RpZnlGaWxlOiBhc3luYyAocGF0aDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgZiA9IHRoaXMuYXBwLnZhdWx0LmdldEZpbGVCeVBhdGgocGF0aCk7XG4gICAgICAgIGlmICghZikgdGhyb3cgbmV3IEVycm9yKFwiRmlsZSBub3QgZm91bmQ6IFwiICsgcGF0aCk7XG4gICAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShmLCBjb250ZW50KTtcbiAgICAgIH0sXG4gICAgICBnZXRGaWxlQnlQYXRoOiAocGF0aDogc3RyaW5nKSA9PiB7XG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKHBhdGgpO1xuICAgICAgICByZXR1cm4gZiA/IHsgcGF0aDogZi5wYXRoIH0gOiBudWxsO1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMucmVnaXN0ZXJNYXJrZG93bkNvZGVCbG9ja1Byb2Nlc3NvcihcbiAgICAgIFwibXVzaWMtZGFzaGJvYXJkXCIsXG4gICAgICAoc291cmNlLCBlbCwgY3R4KSA9PiBkYXNoYm9hcmRQcm9jZXNzb3IucHJvY2Vzcyhzb3VyY2UsIGVsLCBjdHgpXG4gICAgKTtcblxuICAgIC8vIFJpZ2h0LWNsaWNrIG9uIGF1ZGlvIGZpbGVzIGluIGZpbGUgZXhwbG9yZXIgXHUyMTkyIFwiQW5hbHl6ZSBhdWRpb1wiXG4gICAgdGhpcy5yZWdpc3RlckV2ZW50KFxuICAgICAgdGhpcy5hcHAud29ya3NwYWNlLm9uKFxuICAgICAgICBcImZpbGUtbWVudVwiLFxuICAgICAgICAobWVudTogTWVudSwgZmlsZTogVEFic3RyYWN0RmlsZSkgPT4ge1xuICAgICAgICAgIGlmICghKGZpbGUgaW5zdGFuY2VvZiBURmlsZSkpIHJldHVybjtcbiAgICAgICAgICBpZiAoIXRoaXMuaXNBdWRpb0ZpbGUoZmlsZSkpIHJldHVybjtcblxuICAgICAgICAgIG1lbnUuYWRkSXRlbSgoaXRlbSkgPT5cbiAgICAgICAgICAgIGl0ZW1cbiAgICAgICAgICAgICAgLnNldFRpdGxlKFwiQW5hbHl6ZSBhdWRpb1wiKVxuICAgICAgICAgICAgICAuc2V0SWNvbihcIm11c2ljXCIpXG4gICAgICAgICAgICAgIC5vbkNsaWNrKCgpID0+IHRoaXMucnVuQW5hbHlzaXNGb3JGaWxlKGZpbGUpKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIClcbiAgICApO1xuICB9XG5cbiAgb251bmxvYWQoKSB7XG4gICAgdGhpcy53b3JrZXI/LnRlcm1pbmF0ZSgpO1xuICAgIHRoaXMud29ya2VyID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcnVuQW5hbHlzaXMoKSB7XG4gICAgY29uc3QgZmlsZSA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVGaWxlKCk7XG4gICAgaWYgKCFmaWxlIHx8ICF0aGlzLmlzQXVkaW9GaWxlKGZpbGUpKSB7XG4gICAgICBuZXcgTm90aWNlKFwiU2VsZWN0IGFuIGF1ZGlvIGZpbGUgKG1wMy93YXYvZmxhYylcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGF3YWl0IHRoaXMucnVuQW5hbHlzaXNGb3JGaWxlKGZpbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvcmUgYW5hbHlzaXMgZm9yIGEgc3BlY2lmaWMgYXVkaW8gZmlsZS5cbiAgICogQ3JlYXRlcyAvIHVwZGF0ZXMgdGhlIGNvbXBhbmlvbiAubWQgbm90ZSBhbmQgb3BlbnMgaXQuXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIHJ1bkFuYWx5c2lzRm9yRmlsZShmaWxlOiBURmlsZSkge1xuICAgIGNvbnN0IGFycmF5QnVmID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZEJpbmFyeShmaWxlKTtcbiAgICBjb25zdCBoYXNoID0gYXdhaXQgc2hhMjU2KGFycmF5QnVmKTtcblxuICAgIGNvbnN0IG5vdGVQYXRoID0gYCR7ZmlsZS5wYXRofS5tZGA7XG4gICAgY29uc3QgY2FjaGVkTm90ZUZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgobm90ZVBhdGgpO1xuICAgIGNvbnN0IGNhY2hlS2V5ID0gY2FjaGVkTm90ZUZpbGUgPyBub3RlUGF0aCA6IGZpbGUucGF0aDtcblxuICAgIGNvbnN0IGNhY2hlZCA9IGFuYWx5c2lzQ2FjaGUuZ2V0KGNhY2hlS2V5KTtcbiAgICBpZiAoY2FjaGVkICYmIGNhY2hlZC5oYXNoID09PSBoYXNoKSB7XG4gICAgICBuZXcgTm90aWNlKGBDYWNoZSBoaXQ6ICR7Y2FjaGVkLnJlc3VsdC50ZW1wb30gQlBNLCAke2NhY2hlZC5yZXN1bHQua2V5fWApO1xuICAgICAgYXdhaXQgdGhpcy53cml0ZU5vdGUobm90ZVBhdGgsIGNhY2hlZC5yZXN1bHQsIGZpbGUubmFtZSk7XG4gICAgICBhd2FpdCB0aGlzLm9wZW5Ob3RlKG5vdGVQYXRoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBuZXcgTm90aWNlKFwiQW5hbHl6aW5nIGF1ZGlvLi4uXCIpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5hbmFseXplSW5Xb3JrZXIoYXJyYXlCdWYsIGZpbGUubmFtZSk7XG4gICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgbmV3IE5vdGljZShgQW5hbHlzaXMgZmFpbGVkOiAke3Jlc3VsdC5lcnJvcn1gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhbmFseXNpc0NhY2hlLnNldChjYWNoZUtleSwgeyBoYXNoLCByZXN1bHQsIHRpbWVzdGFtcDogRGF0ZS5ub3coKSB9KTtcblxuICAgIG5ldyBOb3RpY2UoXG4gICAgICBgRG9uZTogJHtyZXN1bHQudGVtcG99IEJQTSR7cmVzdWx0LmFsdGVybmF0ZVRlbXBvID8gXCIgKG9yIFwiICsgcmVzdWx0LmFsdGVybmF0ZVRlbXBvICsgXCI/KVwiIDogXCJcIn0sICR7cmVzdWx0LmtleX1gXG4gICAgKTtcbiAgICBhd2FpdCB0aGlzLndyaXRlTm90ZShub3RlUGF0aCwgcmVzdWx0LCBmaWxlLm5hbWUpO1xuICAgIGF3YWl0IHRoaXMub3Blbk5vdGUobm90ZVBhdGgpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBvcGVuTm90ZShub3RlUGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3Qgbm90ZUZpbGUgPSB0aGlzLmFwcC52YXVsdC5nZXRGaWxlQnlQYXRoKG5vdGVQYXRoKTtcbiAgICBpZiAoIW5vdGVGaWxlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbTUFNXSBDb3VsZCBub3Qgb3BlbiBub3RlIFx1MjAxNCBmaWxlIG5vdCBmb3VuZDpcIiwgbm90ZVBhdGgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBsZWFmID0gdGhpcy5hcHAud29ya3NwYWNlLmdldExlYWYoKTtcbiAgICBhd2FpdCBsZWFmLm9wZW5GaWxlKG5vdGVGaWxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcGVuIHRoZSBjb25maXJtIG1vZGFsIGZvciB0aGUgY3VycmVudGx5IG9wZW4gYW5hbHlzaXMgbm90ZS5cbiAgICogUGFyc2VzIGV4aXN0aW5nIGZyb250bWF0dGVyIGFuZCBsZXRzIHRoZSB1c2VyIGVkaXQgdGVtcG8va2V5LlxuICAgKi9cbiAgcHJpdmF0ZSBvcGVuQ29uZmlybU1vZGFsKCkge1xuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC53b3Jrc3BhY2UuZ2V0QWN0aXZlVmlld09mVHlwZShNYXJrZG93blZpZXcpO1xuICAgIGlmICghdmlldykge1xuICAgICAgbmV3IE5vdGljZShcIk9wZW4gYW4gYW5hbHlzaXMgbm90ZSBmaXJzdFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlID0gdmlldy5maWxlO1xuICAgIGlmICghZmlsZSkge1xuICAgICAgbmV3IE5vdGljZShcIk5vIGZpbGUgb3BlblwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjYWNoZSA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGZpbGUpO1xuICAgIGNvbnN0IGZtID0gY2FjaGU/LmZyb250bWF0dGVyIHx8IHt9O1xuXG4gICAgaWYgKCFmbS50ZW1wbyAmJiAhZm0ua2V5KSB7XG4gICAgICBuZXcgTm90aWNlKFwiTm8gYW5hbHlzaXMgZGF0YSBmb3VuZCBpbiB0aGlzIG5vdGVcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYnBtU3RhdGU6IEJwbUNvbnRyb2xTdGF0ZSA9IHtcbiAgICAgIGJwbTogZm0udGVtcG8gPz8gMCxcbiAgICAgIHJhd0JwbTogZm0ucmF3X3RlbXBvID8/IGZtLnRlbXBvID8/IDAsXG4gICAgICBhbHRlcm5hdGVCcG06IGZtLmFsdGVybmF0ZV90ZW1wbyxcbiAgICAgIGNvbmZpcm1lZDogZm0udGVtcG9fY29uZmlybWVkID8/IGZhbHNlLFxuICAgIH07XG5cbiAgICBjb25zdCBrZXlQYXJ0cyA9IFN0cmluZyhmbS5rZXkgfHwgXCJcIikuc3BsaXQoXCIgLyBcIik7XG4gICAgY29uc3Qga2V5TmFtZSA9IGtleVBhcnRzWzBdIHx8IFwiXCI7XG4gICAgY29uc3QgaXNNaW5vciA9IGtleU5hbWUuZW5kc1dpdGgoXCJtXCIpO1xuICAgIGNvbnN0IGJhc2VLZXkgPSBpc01pbm9yID8ga2V5TmFtZS5zbGljZSgwLCAtMSkgOiBrZXlOYW1lO1xuXG4gICAgY29uc3Qga2V5U3RhdGU6IEtleUNvbnRyb2xTdGF0ZSA9IHtcbiAgICAgIGtleTogYmFzZUtleSxcbiAgICAgIHNjYWxlOiBpc01pbm9yID8gXCJtaW5vclwiIDogXCJtYWpvclwiLFxuICAgICAgcmVsYXRpdmVLZXk6IGtleVBhcnRzWzFdLFxuICAgICAgY29uZmlybWVkOiBmbS5rZXlfY29uZmlybWVkID8/IGZhbHNlLFxuICAgIH07XG5cbiAgICBuZXcgQW5hbHlzaXNDb25maXJtTW9kYWwoXG4gICAgICB0aGlzLmFwcCxcbiAgICAgIHtcbiAgICAgICAgZmlsZU5hbWU6IGZpbGUuYmFzZW5hbWUsXG4gICAgICAgIGJwbTogYnBtU3RhdGUsXG4gICAgICAgIGtleToga2V5U3RhdGUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvblNhdmU6IGFzeW5jIChkYXRhKSA9PiB7XG4gICAgICAgICAgY29uc3Qga2V5RGlzcGxheSA9IGRhdGEua2V5LnNjYWxlID09PSBcIm1pbm9yXCJcbiAgICAgICAgICAgID8gYCR7ZGF0YS5rZXkua2V5fW1gXG4gICAgICAgICAgICA6IGRhdGEua2V5LmtleTtcblxuICAgICAgICAgIGNvbnN0IHVwZGF0ZWQgPSBpbmplY3RGcm9udG1hdHRlcihhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGZpbGUpLCB7XG4gICAgICAgICAgICB0ZW1wbzogZGF0YS5icG0uYnBtLFxuICAgICAgICAgICAgcmF3X3RlbXBvOiBkYXRhLmJwbS5yYXdCcG0sXG4gICAgICAgICAgICBhbHRlcm5hdGVfdGVtcG86IGRhdGEuYnBtLmFsdGVybmF0ZUJwbSxcbiAgICAgICAgICAgIHRlbXBvX2NvbmZpcm1lZDogZGF0YS5icG0uY29uZmlybWVkLFxuICAgICAgICAgICAga2V5OiBrZXlEaXNwbGF5LFxuICAgICAgICAgICAga2V5X2NvbmZpcm1lZDogZGF0YS5rZXkuY29uZmlybWVkLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgYXdhaXQgdGhpcy5hcHAudmF1bHQubW9kaWZ5KGZpbGUsIHVwZGF0ZWQpO1xuICAgICAgICAgIG5ldyBOb3RpY2UoXCJBbmFseXNpcyB1cGRhdGVkXCIpO1xuICAgICAgICB9LFxuICAgICAgfVxuICAgICkub3BlbigpO1xuICB9XG5cbiAgcHJpdmF0ZSBpc0F1ZGlvRmlsZShmaWxlOiBURmlsZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAvXihtcDN8d2F2fGZsYWN8YWlmfG9nZ3xtNGEpJC9pLnRlc3QoZmlsZS5leHRlbnNpb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBhbmFseXplSW5Xb3JrZXIoXG4gICAgYXVkaW9CdWZmZXI6IEFycmF5QnVmZmVyLFxuICAgIGZpbGVOYW1lOiBzdHJpbmcsXG4gICk6IFByb21pc2U8QW5hbHlzaXNSZXN1bHQ+IHtcbiAgICBpZiAoIXRoaXMud29ya2VyKSB7XG4gICAgICAvLyBUaGUgd29ya2VyIEpTIGlzIGJ1bmRsZWQgdG8gZGlzdC93b3JrZXIuanMgYnkgZXNidWlsZFxuICAgICAgY29uc3Qgd29ya2VyUGF0aCA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0UmVzb3VyY2VQYXRoKFxuICAgICAgICBgJHt0aGlzLm1hbmlmZXN0LmRpcn0vZGlzdC93b3JrZXIuanNgLFxuICAgICAgKTtcbiAgICAgIHRoaXMud29ya2VyID0gbmV3IFdvcmtlcih3b3JrZXJQYXRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgaWQgPSBgJHtmaWxlTmFtZX0tJHtEYXRlLm5vdygpfWA7XG4gICAgICBjb25zdCBoYW5kbGVyID0gKGU6IE1lc3NhZ2VFdmVudCkgPT4ge1xuICAgICAgICBpZiAoZS5kYXRhLmlkICE9PSBpZCkgcmV0dXJuO1xuICAgICAgICB0aGlzLndvcmtlciEucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgaGFuZGxlcik7XG4gICAgICAgIGlmIChlLmRhdGEudHlwZSA9PT0gXCJlcnJvclwiKSByZWplY3QobmV3IEVycm9yKGUuZGF0YS5lcnJvcikpO1xuICAgICAgICBlbHNlIHJlc29sdmUoZS5kYXRhLnJlc3VsdCk7XG4gICAgICB9O1xuICAgICAgdGhpcy53b3JrZXIhLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGhhbmRsZXIpO1xuICAgICAgdGhpcy53b3JrZXIhLnBvc3RNZXNzYWdlKHsgaWQsIHR5cGU6IFwiYW5hbHl6ZVwiLCBhdWRpb0J1ZmZlciB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgd3JpdGVOb3RlKHBhdGg6IHN0cmluZywgcmVzdWx0OiBBbmFseXNpc1Jlc3VsdCwgc291cmNlRmlsZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZHVyYXRpb25TdHIgPSB0aGlzLmZvcm1hdER1cmF0aW9uKHJlc3VsdC5kdXJhdGlvbik7XG4gICAgY29uc3Qga2V5RGlzcGxheSA9IHJlc3VsdC5yZWxhdGl2ZUtleSA/IGAke3Jlc3VsdC5rZXl9IC8gJHtyZXN1bHQucmVsYXRpdmVLZXl9YCA6IHJlc3VsdC5rZXk7XG5cbiAgICAvLyBCb2R5OiBhdXRvLWluamVjdCBtdXNpYy1kYXNoYm9hcmQgY29kZSBibG9jayBzbyB0aGUgZGFzaGJvYXJkIHJlbmRlcnMgaW1tZWRpYXRlbHlcbiAgICBjb25zdCBib2R5ID0gXCJcXG5gYGBtdXNpYy1kYXNoYm9hcmRcXG5gYGBcXG5cIjtcblxuICAgIGNvbnN0IGNvbnRlbnQgPSBpbmplY3RGcm9udG1hdHRlcihib2R5LCB7XG4gICAgICBhdWRpb19zb3VyY2U6IHNvdXJjZUZpbGUsXG4gICAgICBrZXk6IGtleURpc3BsYXksXG4gICAgICBrZXlfY29uZmlybWVkOiBmYWxzZSxcbiAgICAgIHRlbXBvOiByZXN1bHQudGVtcG8sXG4gICAgICByYXdfdGVtcG86IHJlc3VsdC5yYXdUZW1wbyxcbiAgICAgIGFsdGVybmF0ZV90ZW1wbzogcmVzdWx0LmFsdGVybmF0ZVRlbXBvLFxuICAgICAgdGVtcG9fY29uZmlybWVkOiBmYWxzZSxcbiAgICAgIGR1cmF0aW9uOiBkdXJhdGlvblN0cixcbiAgICB9KTtcblxuICAgIGNvbnN0IGV4aXN0aW5nID0gdGhpcy5hcHAudmF1bHQuZ2V0RmlsZUJ5UGF0aChwYXRoKTtcbiAgICBpZiAoZXhpc3RpbmcpIHtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0Lm1vZGlmeShleGlzdGluZywgY29udGVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHRoaXMuYXBwLnZhdWx0LmNyZWF0ZShwYXRoLCBjb250ZW50KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZvcm1hdER1cmF0aW9uKHNlYzogbnVtYmVyKTogc3RyaW5nIHtcbiAgICBjb25zdCBtID0gTWF0aC5mbG9vcihzZWMgLyA2MCk7XG4gICAgY29uc3QgcyA9IE1hdGguZmxvb3Ioc2VjICUgNjApO1xuICAgIHJldHVybiBgJHttfToke3MudG9TdHJpbmcoKS5wYWRTdGFydCgyLCBcIjBcIil9YDtcbiAgfVxufVxuXG4vLyBTaWRlLW5vdGU6IGV4cG9zZSBmb3IgdHlwZS1jaGVja2luZyBpbiB0ZXN0c1xuZXhwb3J0IHsgTXVzaWNBbmFseXNpc1BsdWdpbiB9O1xuIiwgIi8qKlxuICogU0hBLTI1NiBoYXNoIHV0aWxpdHkgXHUyMDE0IHJ1bnMgb2ZmbGluZSwgemVybyBuZXR3b3JrLlxuICovXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaGEyNTYoYnVmZmVyOiBBcnJheUJ1ZmZlcik6IFByb21pc2U8c3RyaW5nPiB7XG4gIGNvbnN0IGhhc2hCdWZmZXIgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdChcIlNIQS0yNTZcIiwgYnVmZmVyKTtcbiAgY29uc3QgaGFzaEFycmF5ID0gQXJyYXkuZnJvbShuZXcgVWludDhBcnJheShoYXNoQnVmZmVyKSk7XG4gIHJldHVybiBoYXNoQXJyYXkubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikpLmpvaW4oXCJcIik7XG59XG4iLCAiY29uc3QgQUxJQVMgPSBTeW1ib2wuZm9yKCd5YW1sLmFsaWFzJyk7XG5jb25zdCBET0MgPSBTeW1ib2wuZm9yKCd5YW1sLmRvY3VtZW50Jyk7XG5jb25zdCBNQVAgPSBTeW1ib2wuZm9yKCd5YW1sLm1hcCcpO1xuY29uc3QgUEFJUiA9IFN5bWJvbC5mb3IoJ3lhbWwucGFpcicpO1xuY29uc3QgU0NBTEFSID0gU3ltYm9sLmZvcigneWFtbC5zY2FsYXInKTtcbmNvbnN0IFNFUSA9IFN5bWJvbC5mb3IoJ3lhbWwuc2VxJyk7XG5jb25zdCBOT0RFX1RZUEUgPSBTeW1ib2wuZm9yKCd5YW1sLm5vZGUudHlwZScpO1xuY29uc3QgaXNBbGlhcyA9IChub2RlKSA9PiAhIW5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmIG5vZGVbTk9ERV9UWVBFXSA9PT0gQUxJQVM7XG5jb25zdCBpc0RvY3VtZW50ID0gKG5vZGUpID0+ICEhbm9kZSAmJiB0eXBlb2Ygbm9kZSA9PT0gJ29iamVjdCcgJiYgbm9kZVtOT0RFX1RZUEVdID09PSBET0M7XG5jb25zdCBpc01hcCA9IChub2RlKSA9PiAhIW5vZGUgJiYgdHlwZW9mIG5vZGUgPT09ICdvYmplY3QnICYmIG5vZGVbTk9ERV9UWVBFXSA9PT0gTUFQO1xuY29uc3QgaXNQYWlyID0gKG5vZGUpID0+ICEhbm9kZSAmJiB0eXBlb2Ygbm9kZSA9PT0gJ29iamVjdCcgJiYgbm9kZVtOT0RFX1RZUEVdID09PSBQQUlSO1xuY29uc3QgaXNTY2FsYXIgPSAobm9kZSkgPT4gISFub2RlICYmIHR5cGVvZiBub2RlID09PSAnb2JqZWN0JyAmJiBub2RlW05PREVfVFlQRV0gPT09IFNDQUxBUjtcbmNvbnN0IGlzU2VxID0gKG5vZGUpID0+ICEhbm9kZSAmJiB0eXBlb2Ygbm9kZSA9PT0gJ29iamVjdCcgJiYgbm9kZVtOT0RFX1RZUEVdID09PSBTRVE7XG5mdW5jdGlvbiBpc0NvbGxlY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlICYmIHR5cGVvZiBub2RlID09PSAnb2JqZWN0JylcbiAgICAgICAgc3dpdGNoIChub2RlW05PREVfVFlQRV0pIHtcbiAgICAgICAgICAgIGNhc2UgTUFQOlxuICAgICAgICAgICAgY2FzZSBTRVE6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBpc05vZGUobm9kZSkge1xuICAgIGlmIChub2RlICYmIHR5cGVvZiBub2RlID09PSAnb2JqZWN0JylcbiAgICAgICAgc3dpdGNoIChub2RlW05PREVfVFlQRV0pIHtcbiAgICAgICAgICAgIGNhc2UgQUxJQVM6XG4gICAgICAgICAgICBjYXNlIE1BUDpcbiAgICAgICAgICAgIGNhc2UgU0NBTEFSOlxuICAgICAgICAgICAgY2FzZSBTRVE6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5jb25zdCBoYXNBbmNob3IgPSAobm9kZSkgPT4gKGlzU2NhbGFyKG5vZGUpIHx8IGlzQ29sbGVjdGlvbihub2RlKSkgJiYgISFub2RlLmFuY2hvcjtcblxuZXhwb3J0IHsgQUxJQVMsIERPQywgTUFQLCBOT0RFX1RZUEUsIFBBSVIsIFNDQUxBUiwgU0VRLCBoYXNBbmNob3IsIGlzQWxpYXMsIGlzQ29sbGVjdGlvbiwgaXNEb2N1bWVudCwgaXNNYXAsIGlzTm9kZSwgaXNQYWlyLCBpc1NjYWxhciwgaXNTZXEgfTtcbiIsICJpbXBvcnQgeyBpc0RvY3VtZW50LCBpc05vZGUsIGlzUGFpciwgaXNDb2xsZWN0aW9uLCBpc01hcCwgaXNTZXEsIGlzU2NhbGFyLCBpc0FsaWFzIH0gZnJvbSAnLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5cbmNvbnN0IEJSRUFLID0gU3ltYm9sKCdicmVhayB2aXNpdCcpO1xuY29uc3QgU0tJUCA9IFN5bWJvbCgnc2tpcCBjaGlsZHJlbicpO1xuY29uc3QgUkVNT1ZFID0gU3ltYm9sKCdyZW1vdmUgbm9kZScpO1xuLyoqXG4gKiBBcHBseSBhIHZpc2l0b3IgdG8gYW4gQVNUIG5vZGUgb3IgZG9jdW1lbnQuXG4gKlxuICogV2Fsa3MgdGhyb3VnaCB0aGUgdHJlZSAoZGVwdGgtZmlyc3QpIHN0YXJ0aW5nIGZyb20gYG5vZGVgLCBjYWxsaW5nIGFcbiAqIGB2aXNpdG9yYCBmdW5jdGlvbiB3aXRoIHRocmVlIGFyZ3VtZW50czpcbiAqICAgLSBga2V5YDogRm9yIHNlcXVlbmNlIHZhbHVlcyBhbmQgbWFwIGBQYWlyYCwgdGhlIG5vZGUncyBpbmRleCBpbiB0aGVcbiAqICAgICBjb2xsZWN0aW9uLiBXaXRoaW4gYSBgUGFpcmAsIGAna2V5J2Agb3IgYCd2YWx1ZSdgLCBjb3JyZXNwb25kaW5nbHkuXG4gKiAgICAgYG51bGxgIGZvciB0aGUgcm9vdCBub2RlLlxuICogICAtIGBub2RlYDogVGhlIGN1cnJlbnQgbm9kZS5cbiAqICAgLSBgcGF0aGA6IFRoZSBhbmNlc3RyeSBvZiB0aGUgY3VycmVudCBub2RlLlxuICpcbiAqIFRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIHZpc2l0b3IgbWF5IGJlIHVzZWQgdG8gY29udHJvbCB0aGUgdHJhdmVyc2FsOlxuICogICAtIGB1bmRlZmluZWRgIChkZWZhdWx0KTogRG8gbm90aGluZyBhbmQgY29udGludWVcbiAqICAgLSBgdmlzaXQuU0tJUGA6IERvIG5vdCB2aXNpdCB0aGUgY2hpbGRyZW4gb2YgdGhpcyBub2RlLCBjb250aW51ZSB3aXRoIG5leHRcbiAqICAgICBzaWJsaW5nXG4gKiAgIC0gYHZpc2l0LkJSRUFLYDogVGVybWluYXRlIHRyYXZlcnNhbCBjb21wbGV0ZWx5XG4gKiAgIC0gYHZpc2l0LlJFTU9WRWA6IFJlbW92ZSB0aGUgY3VycmVudCBub2RlLCB0aGVuIGNvbnRpbnVlIHdpdGggdGhlIG5leHQgb25lXG4gKiAgIC0gYE5vZGVgOiBSZXBsYWNlIHRoZSBjdXJyZW50IG5vZGUsIHRoZW4gY29udGludWUgYnkgdmlzaXRpbmcgaXRcbiAqICAgLSBgbnVtYmVyYDogV2hpbGUgaXRlcmF0aW5nIHRoZSBpdGVtcyBvZiBhIHNlcXVlbmNlIG9yIG1hcCwgc2V0IHRoZSBpbmRleFxuICogICAgIG9mIHRoZSBuZXh0IHN0ZXAuIFRoaXMgaXMgdXNlZnVsIGVzcGVjaWFsbHkgaWYgdGhlIGluZGV4IG9mIHRoZSBjdXJyZW50XG4gKiAgICAgbm9kZSBoYXMgY2hhbmdlZC5cbiAqXG4gKiBJZiBgdmlzaXRvcmAgaXMgYSBzaW5nbGUgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggYWxsIHZhbHVlc1xuICogZW5jb3VudGVyZWQgaW4gdGhlIHRyZWUsIGluY2x1ZGluZyBlLmcuIGBudWxsYCB2YWx1ZXMuIEFsdGVybmF0aXZlbHksXG4gKiBzZXBhcmF0ZSB2aXNpdG9yIGZ1bmN0aW9ucyBtYXkgYmUgZGVmaW5lZCBmb3IgZWFjaCBgTWFwYCwgYFBhaXJgLCBgU2VxYCxcbiAqIGBBbGlhc2AgYW5kIGBTY2FsYXJgIG5vZGUuIFRvIGRlZmluZSB0aGUgc2FtZSB2aXNpdG9yIGZ1bmN0aW9uIGZvciBtb3JlIHRoYW5cbiAqIG9uZSBub2RlIHR5cGUsIHVzZSB0aGUgYENvbGxlY3Rpb25gIChtYXAgYW5kIHNlcSksIGBWYWx1ZWAgKG1hcCwgc2VxICYgc2NhbGFyKVxuICogYW5kIGBOb2RlYCAoYWxpYXMsIG1hcCwgc2VxICYgc2NhbGFyKSB0YXJnZXRzLiBPZiBhbGwgdGhlc2UsIG9ubHkgdGhlIG1vc3RcbiAqIHNwZWNpZmljIGRlZmluZWQgb25lIHdpbGwgYmUgdXNlZCBmb3IgZWFjaCBub2RlLlxuICovXG5mdW5jdGlvbiB2aXNpdChub2RlLCB2aXNpdG9yKSB7XG4gICAgY29uc3QgdmlzaXRvcl8gPSBpbml0VmlzaXRvcih2aXNpdG9yKTtcbiAgICBpZiAoaXNEb2N1bWVudChub2RlKSkge1xuICAgICAgICBjb25zdCBjZCA9IHZpc2l0XyhudWxsLCBub2RlLmNvbnRlbnRzLCB2aXNpdG9yXywgT2JqZWN0LmZyZWV6ZShbbm9kZV0pKTtcbiAgICAgICAgaWYgKGNkID09PSBSRU1PVkUpXG4gICAgICAgICAgICBub2RlLmNvbnRlbnRzID0gbnVsbDtcbiAgICB9XG4gICAgZWxzZVxuICAgICAgICB2aXNpdF8obnVsbCwgbm9kZSwgdmlzaXRvcl8sIE9iamVjdC5mcmVlemUoW10pKTtcbn1cbi8vIFdpdGhvdXQgdGhlIGBhcyBzeW1ib2xgIGNhc3RzLCBUUyBkZWNsYXJlcyB0aGVzZSBpbiB0aGUgYHZpc2l0YFxuLy8gbmFtZXNwYWNlIHVzaW5nIGB2YXJgLCBidXQgdGhlbiBjb21wbGFpbnMgYWJvdXQgdGhhdCBiZWNhdXNlXG4vLyBgdW5pcXVlIHN5bWJvbGAgbXVzdCBiZSBgY29uc3RgLlxuLyoqIFRlcm1pbmF0ZSB2aXNpdCB0cmF2ZXJzYWwgY29tcGxldGVseSAqL1xudmlzaXQuQlJFQUsgPSBCUkVBSztcbi8qKiBEbyBub3QgdmlzaXQgdGhlIGNoaWxkcmVuIG9mIHRoZSBjdXJyZW50IG5vZGUgKi9cbnZpc2l0LlNLSVAgPSBTS0lQO1xuLyoqIFJlbW92ZSB0aGUgY3VycmVudCBub2RlICovXG52aXNpdC5SRU1PVkUgPSBSRU1PVkU7XG5mdW5jdGlvbiB2aXNpdF8oa2V5LCBub2RlLCB2aXNpdG9yLCBwYXRoKSB7XG4gICAgY29uc3QgY3RybCA9IGNhbGxWaXNpdG9yKGtleSwgbm9kZSwgdmlzaXRvciwgcGF0aCk7XG4gICAgaWYgKGlzTm9kZShjdHJsKSB8fCBpc1BhaXIoY3RybCkpIHtcbiAgICAgICAgcmVwbGFjZU5vZGUoa2V5LCBwYXRoLCBjdHJsKTtcbiAgICAgICAgcmV0dXJuIHZpc2l0XyhrZXksIGN0cmwsIHZpc2l0b3IsIHBhdGgpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGN0cmwgIT09ICdzeW1ib2wnKSB7XG4gICAgICAgIGlmIChpc0NvbGxlY3Rpb24obm9kZSkpIHtcbiAgICAgICAgICAgIHBhdGggPSBPYmplY3QuZnJlZXplKHBhdGguY29uY2F0KG5vZGUpKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5pdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNpID0gdmlzaXRfKGksIG5vZGUuaXRlbXNbaV0sIHZpc2l0b3IsIHBhdGgpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY2kgPT09ICdudW1iZXInKVxuICAgICAgICAgICAgICAgICAgICBpID0gY2kgLSAxO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNpID09PSBCUkVBSylcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEJSRUFLO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNpID09PSBSRU1PVkUpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5pdGVtcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNQYWlyKG5vZGUpKSB7XG4gICAgICAgICAgICBwYXRoID0gT2JqZWN0LmZyZWV6ZShwYXRoLmNvbmNhdChub2RlKSk7XG4gICAgICAgICAgICBjb25zdCBjayA9IHZpc2l0Xygna2V5Jywgbm9kZS5rZXksIHZpc2l0b3IsIHBhdGgpO1xuICAgICAgICAgICAgaWYgKGNrID09PSBCUkVBSylcbiAgICAgICAgICAgICAgICByZXR1cm4gQlJFQUs7XG4gICAgICAgICAgICBlbHNlIGlmIChjayA9PT0gUkVNT1ZFKVxuICAgICAgICAgICAgICAgIG5vZGUua2V5ID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IGN2ID0gdmlzaXRfKCd2YWx1ZScsIG5vZGUudmFsdWUsIHZpc2l0b3IsIHBhdGgpO1xuICAgICAgICAgICAgaWYgKGN2ID09PSBCUkVBSylcbiAgICAgICAgICAgICAgICByZXR1cm4gQlJFQUs7XG4gICAgICAgICAgICBlbHNlIGlmIChjdiA9PT0gUkVNT1ZFKVxuICAgICAgICAgICAgICAgIG5vZGUudmFsdWUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjdHJsO1xufVxuLyoqXG4gKiBBcHBseSBhbiBhc3luYyB2aXNpdG9yIHRvIGFuIEFTVCBub2RlIG9yIGRvY3VtZW50LlxuICpcbiAqIFdhbGtzIHRocm91Z2ggdGhlIHRyZWUgKGRlcHRoLWZpcnN0KSBzdGFydGluZyBmcm9tIGBub2RlYCwgY2FsbGluZyBhXG4gKiBgdmlzaXRvcmAgZnVuY3Rpb24gd2l0aCB0aHJlZSBhcmd1bWVudHM6XG4gKiAgIC0gYGtleWA6IEZvciBzZXF1ZW5jZSB2YWx1ZXMgYW5kIG1hcCBgUGFpcmAsIHRoZSBub2RlJ3MgaW5kZXggaW4gdGhlXG4gKiAgICAgY29sbGVjdGlvbi4gV2l0aGluIGEgYFBhaXJgLCBgJ2tleSdgIG9yIGAndmFsdWUnYCwgY29ycmVzcG9uZGluZ2x5LlxuICogICAgIGBudWxsYCBmb3IgdGhlIHJvb3Qgbm9kZS5cbiAqICAgLSBgbm9kZWA6IFRoZSBjdXJyZW50IG5vZGUuXG4gKiAgIC0gYHBhdGhgOiBUaGUgYW5jZXN0cnkgb2YgdGhlIGN1cnJlbnQgbm9kZS5cbiAqXG4gKiBUaGUgcmV0dXJuIHZhbHVlIG9mIHRoZSB2aXNpdG9yIG1heSBiZSB1c2VkIHRvIGNvbnRyb2wgdGhlIHRyYXZlcnNhbDpcbiAqICAgLSBgUHJvbWlzZWA6IE11c3QgcmVzb2x2ZSB0byBvbmUgb2YgdGhlIGZvbGxvd2luZyB2YWx1ZXNcbiAqICAgLSBgdW5kZWZpbmVkYCAoZGVmYXVsdCk6IERvIG5vdGhpbmcgYW5kIGNvbnRpbnVlXG4gKiAgIC0gYHZpc2l0LlNLSVBgOiBEbyBub3QgdmlzaXQgdGhlIGNoaWxkcmVuIG9mIHRoaXMgbm9kZSwgY29udGludWUgd2l0aCBuZXh0XG4gKiAgICAgc2libGluZ1xuICogICAtIGB2aXNpdC5CUkVBS2A6IFRlcm1pbmF0ZSB0cmF2ZXJzYWwgY29tcGxldGVseVxuICogICAtIGB2aXNpdC5SRU1PVkVgOiBSZW1vdmUgdGhlIGN1cnJlbnQgbm9kZSwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBuZXh0IG9uZVxuICogICAtIGBOb2RlYDogUmVwbGFjZSB0aGUgY3VycmVudCBub2RlLCB0aGVuIGNvbnRpbnVlIGJ5IHZpc2l0aW5nIGl0XG4gKiAgIC0gYG51bWJlcmA6IFdoaWxlIGl0ZXJhdGluZyB0aGUgaXRlbXMgb2YgYSBzZXF1ZW5jZSBvciBtYXAsIHNldCB0aGUgaW5kZXhcbiAqICAgICBvZiB0aGUgbmV4dCBzdGVwLiBUaGlzIGlzIHVzZWZ1bCBlc3BlY2lhbGx5IGlmIHRoZSBpbmRleCBvZiB0aGUgY3VycmVudFxuICogICAgIG5vZGUgaGFzIGNoYW5nZWQuXG4gKlxuICogSWYgYHZpc2l0b3JgIGlzIGEgc2luZ2xlIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIGFsbCB2YWx1ZXNcbiAqIGVuY291bnRlcmVkIGluIHRoZSB0cmVlLCBpbmNsdWRpbmcgZS5nLiBgbnVsbGAgdmFsdWVzLiBBbHRlcm5hdGl2ZWx5LFxuICogc2VwYXJhdGUgdmlzaXRvciBmdW5jdGlvbnMgbWF5IGJlIGRlZmluZWQgZm9yIGVhY2ggYE1hcGAsIGBQYWlyYCwgYFNlcWAsXG4gKiBgQWxpYXNgIGFuZCBgU2NhbGFyYCBub2RlLiBUbyBkZWZpbmUgdGhlIHNhbWUgdmlzaXRvciBmdW5jdGlvbiBmb3IgbW9yZSB0aGFuXG4gKiBvbmUgbm9kZSB0eXBlLCB1c2UgdGhlIGBDb2xsZWN0aW9uYCAobWFwIGFuZCBzZXEpLCBgVmFsdWVgIChtYXAsIHNlcSAmIHNjYWxhcilcbiAqIGFuZCBgTm9kZWAgKGFsaWFzLCBtYXAsIHNlcSAmIHNjYWxhcikgdGFyZ2V0cy4gT2YgYWxsIHRoZXNlLCBvbmx5IHRoZSBtb3N0XG4gKiBzcGVjaWZpYyBkZWZpbmVkIG9uZSB3aWxsIGJlIHVzZWQgZm9yIGVhY2ggbm9kZS5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gdmlzaXRBc3luYyhub2RlLCB2aXNpdG9yKSB7XG4gICAgY29uc3QgdmlzaXRvcl8gPSBpbml0VmlzaXRvcih2aXNpdG9yKTtcbiAgICBpZiAoaXNEb2N1bWVudChub2RlKSkge1xuICAgICAgICBjb25zdCBjZCA9IGF3YWl0IHZpc2l0QXN5bmNfKG51bGwsIG5vZGUuY29udGVudHMsIHZpc2l0b3JfLCBPYmplY3QuZnJlZXplKFtub2RlXSkpO1xuICAgICAgICBpZiAoY2QgPT09IFJFTU9WRSlcbiAgICAgICAgICAgIG5vZGUuY29udGVudHMgPSBudWxsO1xuICAgIH1cbiAgICBlbHNlXG4gICAgICAgIGF3YWl0IHZpc2l0QXN5bmNfKG51bGwsIG5vZGUsIHZpc2l0b3JfLCBPYmplY3QuZnJlZXplKFtdKSk7XG59XG4vLyBXaXRob3V0IHRoZSBgYXMgc3ltYm9sYCBjYXN0cywgVFMgZGVjbGFyZXMgdGhlc2UgaW4gdGhlIGB2aXNpdGBcbi8vIG5hbWVzcGFjZSB1c2luZyBgdmFyYCwgYnV0IHRoZW4gY29tcGxhaW5zIGFib3V0IHRoYXQgYmVjYXVzZVxuLy8gYHVuaXF1ZSBzeW1ib2xgIG11c3QgYmUgYGNvbnN0YC5cbi8qKiBUZXJtaW5hdGUgdmlzaXQgdHJhdmVyc2FsIGNvbXBsZXRlbHkgKi9cbnZpc2l0QXN5bmMuQlJFQUsgPSBCUkVBSztcbi8qKiBEbyBub3QgdmlzaXQgdGhlIGNoaWxkcmVuIG9mIHRoZSBjdXJyZW50IG5vZGUgKi9cbnZpc2l0QXN5bmMuU0tJUCA9IFNLSVA7XG4vKiogUmVtb3ZlIHRoZSBjdXJyZW50IG5vZGUgKi9cbnZpc2l0QXN5bmMuUkVNT1ZFID0gUkVNT1ZFO1xuYXN5bmMgZnVuY3Rpb24gdmlzaXRBc3luY18oa2V5LCBub2RlLCB2aXNpdG9yLCBwYXRoKSB7XG4gICAgY29uc3QgY3RybCA9IGF3YWl0IGNhbGxWaXNpdG9yKGtleSwgbm9kZSwgdmlzaXRvciwgcGF0aCk7XG4gICAgaWYgKGlzTm9kZShjdHJsKSB8fCBpc1BhaXIoY3RybCkpIHtcbiAgICAgICAgcmVwbGFjZU5vZGUoa2V5LCBwYXRoLCBjdHJsKTtcbiAgICAgICAgcmV0dXJuIHZpc2l0QXN5bmNfKGtleSwgY3RybCwgdmlzaXRvciwgcGF0aCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY3RybCAhPT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgaWYgKGlzQ29sbGVjdGlvbihub2RlKSkge1xuICAgICAgICAgICAgcGF0aCA9IE9iamVjdC5mcmVlemUocGF0aC5jb25jYXQobm9kZSkpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLml0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2kgPSBhd2FpdCB2aXNpdEFzeW5jXyhpLCBub2RlLml0ZW1zW2ldLCB2aXNpdG9yLCBwYXRoKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNpID09PSAnbnVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgaSA9IGNpIC0gMTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaSA9PT0gQlJFQUspXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBCUkVBSztcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaSA9PT0gUkVNT1ZFKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuaXRlbXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICBpIC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzUGFpcihub2RlKSkge1xuICAgICAgICAgICAgcGF0aCA9IE9iamVjdC5mcmVlemUocGF0aC5jb25jYXQobm9kZSkpO1xuICAgICAgICAgICAgY29uc3QgY2sgPSBhd2FpdCB2aXNpdEFzeW5jXygna2V5Jywgbm9kZS5rZXksIHZpc2l0b3IsIHBhdGgpO1xuICAgICAgICAgICAgaWYgKGNrID09PSBCUkVBSylcbiAgICAgICAgICAgICAgICByZXR1cm4gQlJFQUs7XG4gICAgICAgICAgICBlbHNlIGlmIChjayA9PT0gUkVNT1ZFKVxuICAgICAgICAgICAgICAgIG5vZGUua2V5ID0gbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IGN2ID0gYXdhaXQgdmlzaXRBc3luY18oJ3ZhbHVlJywgbm9kZS52YWx1ZSwgdmlzaXRvciwgcGF0aCk7XG4gICAgICAgICAgICBpZiAoY3YgPT09IEJSRUFLKVxuICAgICAgICAgICAgICAgIHJldHVybiBCUkVBSztcbiAgICAgICAgICAgIGVsc2UgaWYgKGN2ID09PSBSRU1PVkUpXG4gICAgICAgICAgICAgICAgbm9kZS52YWx1ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGN0cmw7XG59XG5mdW5jdGlvbiBpbml0VmlzaXRvcih2aXNpdG9yKSB7XG4gICAgaWYgKHR5cGVvZiB2aXNpdG9yID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAodmlzaXRvci5Db2xsZWN0aW9uIHx8IHZpc2l0b3IuTm9kZSB8fCB2aXNpdG9yLlZhbHVlKSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICBBbGlhczogdmlzaXRvci5Ob2RlLFxuICAgICAgICAgICAgTWFwOiB2aXNpdG9yLk5vZGUsXG4gICAgICAgICAgICBTY2FsYXI6IHZpc2l0b3IuTm9kZSxcbiAgICAgICAgICAgIFNlcTogdmlzaXRvci5Ob2RlXG4gICAgICAgIH0sIHZpc2l0b3IuVmFsdWUgJiYge1xuICAgICAgICAgICAgTWFwOiB2aXNpdG9yLlZhbHVlLFxuICAgICAgICAgICAgU2NhbGFyOiB2aXNpdG9yLlZhbHVlLFxuICAgICAgICAgICAgU2VxOiB2aXNpdG9yLlZhbHVlXG4gICAgICAgIH0sIHZpc2l0b3IuQ29sbGVjdGlvbiAmJiB7XG4gICAgICAgICAgICBNYXA6IHZpc2l0b3IuQ29sbGVjdGlvbixcbiAgICAgICAgICAgIFNlcTogdmlzaXRvci5Db2xsZWN0aW9uXG4gICAgICAgIH0sIHZpc2l0b3IpO1xuICAgIH1cbiAgICByZXR1cm4gdmlzaXRvcjtcbn1cbmZ1bmN0aW9uIGNhbGxWaXNpdG9yKGtleSwgbm9kZSwgdmlzaXRvciwgcGF0aCkge1xuICAgIGlmICh0eXBlb2YgdmlzaXRvciA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgcmV0dXJuIHZpc2l0b3Ioa2V5LCBub2RlLCBwYXRoKTtcbiAgICBpZiAoaXNNYXAobm9kZSkpXG4gICAgICAgIHJldHVybiB2aXNpdG9yLk1hcD8uKGtleSwgbm9kZSwgcGF0aCk7XG4gICAgaWYgKGlzU2VxKG5vZGUpKVxuICAgICAgICByZXR1cm4gdmlzaXRvci5TZXE/LihrZXksIG5vZGUsIHBhdGgpO1xuICAgIGlmIChpc1BhaXIobm9kZSkpXG4gICAgICAgIHJldHVybiB2aXNpdG9yLlBhaXI/LihrZXksIG5vZGUsIHBhdGgpO1xuICAgIGlmIChpc1NjYWxhcihub2RlKSlcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IuU2NhbGFyPy4oa2V5LCBub2RlLCBwYXRoKTtcbiAgICBpZiAoaXNBbGlhcyhub2RlKSlcbiAgICAgICAgcmV0dXJuIHZpc2l0b3IuQWxpYXM/LihrZXksIG5vZGUsIHBhdGgpO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5mdW5jdGlvbiByZXBsYWNlTm9kZShrZXksIHBhdGgsIG5vZGUpIHtcbiAgICBjb25zdCBwYXJlbnQgPSBwYXRoW3BhdGgubGVuZ3RoIC0gMV07XG4gICAgaWYgKGlzQ29sbGVjdGlvbihwYXJlbnQpKSB7XG4gICAgICAgIHBhcmVudC5pdGVtc1trZXldID0gbm9kZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNQYWlyKHBhcmVudCkpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ2tleScpXG4gICAgICAgICAgICBwYXJlbnQua2V5ID0gbm9kZTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcGFyZW50LnZhbHVlID0gbm9kZTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNEb2N1bWVudChwYXJlbnQpKSB7XG4gICAgICAgIHBhcmVudC5jb250ZW50cyA9IG5vZGU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBwdCA9IGlzQWxpYXMocGFyZW50KSA/ICdhbGlhcycgOiAnc2NhbGFyJztcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcmVwbGFjZSBub2RlIHdpdGggJHtwdH0gcGFyZW50YCk7XG4gICAgfVxufVxuXG5leHBvcnQgeyB2aXNpdCwgdmlzaXRBc3luYyB9O1xuIiwgImltcG9ydCB7IGlzTm9kZSB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IHZpc2l0IH0gZnJvbSAnLi4vdmlzaXQuanMnO1xuXG5jb25zdCBlc2NhcGVDaGFycyA9IHtcbiAgICAnISc6ICclMjEnLFxuICAgICcsJzogJyUyQycsXG4gICAgJ1snOiAnJTVCJyxcbiAgICAnXSc6ICclNUQnLFxuICAgICd7JzogJyU3QicsXG4gICAgJ30nOiAnJTdEJ1xufTtcbmNvbnN0IGVzY2FwZVRhZ05hbWUgPSAodG4pID0+IHRuLnJlcGxhY2UoL1shLFtcXF17fV0vZywgY2ggPT4gZXNjYXBlQ2hhcnNbY2hdKTtcbmNsYXNzIERpcmVjdGl2ZXMge1xuICAgIGNvbnN0cnVjdG9yKHlhbWwsIHRhZ3MpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBkaXJlY3RpdmVzLWVuZC9kb2Mtc3RhcnQgbWFya2VyIGAtLS1gLiBJZiBgbnVsbGAsIGEgbWFya2VyIG1heSBzdGlsbCBiZVxuICAgICAgICAgKiBpbmNsdWRlZCBpbiB0aGUgZG9jdW1lbnQncyBzdHJpbmdpZmllZCByZXByZXNlbnRhdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZG9jU3RhcnQgPSBudWxsO1xuICAgICAgICAvKiogVGhlIGRvYy1lbmQgbWFya2VyIGAuLi5gLiAgKi9cbiAgICAgICAgdGhpcy5kb2NFbmQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy55YW1sID0gT2JqZWN0LmFzc2lnbih7fSwgRGlyZWN0aXZlcy5kZWZhdWx0WWFtbCwgeWFtbCk7XG4gICAgICAgIHRoaXMudGFncyA9IE9iamVjdC5hc3NpZ24oe30sIERpcmVjdGl2ZXMuZGVmYXVsdFRhZ3MsIHRhZ3MpO1xuICAgIH1cbiAgICBjbG9uZSgpIHtcbiAgICAgICAgY29uc3QgY29weSA9IG5ldyBEaXJlY3RpdmVzKHRoaXMueWFtbCwgdGhpcy50YWdzKTtcbiAgICAgICAgY29weS5kb2NTdGFydCA9IHRoaXMuZG9jU3RhcnQ7XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEdXJpbmcgcGFyc2luZywgZ2V0IGEgRGlyZWN0aXZlcyBpbnN0YW5jZSBmb3IgdGhlIGN1cnJlbnQgZG9jdW1lbnQgYW5kXG4gICAgICogdXBkYXRlIHRoZSBzdHJlYW0gc3RhdGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHZlcnNpb24ncyBzcGVjLlxuICAgICAqL1xuICAgIGF0RG9jdW1lbnQoKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IG5ldyBEaXJlY3RpdmVzKHRoaXMueWFtbCwgdGhpcy50YWdzKTtcbiAgICAgICAgc3dpdGNoICh0aGlzLnlhbWwudmVyc2lvbikge1xuICAgICAgICAgICAgY2FzZSAnMS4xJzpcbiAgICAgICAgICAgICAgICB0aGlzLmF0TmV4dERvY3VtZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJzEuMic6XG4gICAgICAgICAgICAgICAgdGhpcy5hdE5leHREb2N1bWVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMueWFtbCA9IHtcbiAgICAgICAgICAgICAgICAgICAgZXhwbGljaXQ6IERpcmVjdGl2ZXMuZGVmYXVsdFlhbWwuZXhwbGljaXQsXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246ICcxLjInXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLnRhZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBEaXJlY3RpdmVzLmRlZmF1bHRUYWdzKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb25FcnJvciAtIE1heSBiZSBjYWxsZWQgZXZlbiBpZiB0aGUgYWN0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICogQHJldHVybnMgYHRydWVgIG9uIHN1Y2Nlc3NcbiAgICAgKi9cbiAgICBhZGQobGluZSwgb25FcnJvcikge1xuICAgICAgICBpZiAodGhpcy5hdE5leHREb2N1bWVudCkge1xuICAgICAgICAgICAgdGhpcy55YW1sID0geyBleHBsaWNpdDogRGlyZWN0aXZlcy5kZWZhdWx0WWFtbC5leHBsaWNpdCwgdmVyc2lvbjogJzEuMScgfTtcbiAgICAgICAgICAgIHRoaXMudGFncyA9IE9iamVjdC5hc3NpZ24oe30sIERpcmVjdGl2ZXMuZGVmYXVsdFRhZ3MpO1xuICAgICAgICAgICAgdGhpcy5hdE5leHREb2N1bWVudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBhcnRzID0gbGluZS50cmltKCkuc3BsaXQoL1sgXFx0XSsvKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgICAgICAgY2FzZSAnJVRBRyc6IHtcbiAgICAgICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoICE9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoMCwgJyVUQUcgZGlyZWN0aXZlIHNob3VsZCBjb250YWluIGV4YWN0bHkgdHdvIHBhcnRzJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPCAyKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBbaGFuZGxlLCBwcmVmaXhdID0gcGFydHM7XG4gICAgICAgICAgICAgICAgdGhpcy50YWdzW2hhbmRsZV0gPSBwcmVmaXg7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICclWUFNTCc6IHtcbiAgICAgICAgICAgICAgICB0aGlzLnlhbWwuZXhwbGljaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcigwLCAnJVlBTUwgZGlyZWN0aXZlIHNob3VsZCBjb250YWluIGV4YWN0bHkgb25lIHBhcnQnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBbdmVyc2lvbl0gPSBwYXJ0cztcbiAgICAgICAgICAgICAgICBpZiAodmVyc2lvbiA9PT0gJzEuMScgfHwgdmVyc2lvbiA9PT0gJzEuMicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy55YW1sLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSAvXlxcZCtcXC5cXGQrJC8udGVzdCh2ZXJzaW9uKTtcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcig2LCBgVW5zdXBwb3J0ZWQgWUFNTCB2ZXJzaW9uICR7dmVyc2lvbn1gLCBpc1ZhbGlkKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgb25FcnJvcigwLCBgVW5rbm93biBkaXJlY3RpdmUgJHtuYW1lfWAsIHRydWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlcyBhIHRhZywgbWF0Y2hpbmcgaGFuZGxlcyB0byB0aG9zZSBkZWZpbmVkIGluICVUQUcgZGlyZWN0aXZlcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFJlc29sdmVkIHRhZywgd2hpY2ggbWF5IGFsc28gYmUgdGhlIG5vbi1zcGVjaWZpYyB0YWcgYCchJ2Agb3IgYVxuICAgICAqICAgYCchbG9jYWwnYCB0YWcsIG9yIGBudWxsYCBpZiB1bnJlc29sdmFibGUuXG4gICAgICovXG4gICAgdGFnTmFtZShzb3VyY2UsIG9uRXJyb3IpIHtcbiAgICAgICAgaWYgKHNvdXJjZSA9PT0gJyEnKVxuICAgICAgICAgICAgcmV0dXJuICchJzsgLy8gbm9uLXNwZWNpZmljIHRhZ1xuICAgICAgICBpZiAoc291cmNlWzBdICE9PSAnIScpIHtcbiAgICAgICAgICAgIG9uRXJyb3IoYE5vdCBhIHZhbGlkIHRhZzogJHtzb3VyY2V9YCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc291cmNlWzFdID09PSAnPCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHZlcmJhdGltID0gc291cmNlLnNsaWNlKDIsIC0xKTtcbiAgICAgICAgICAgIGlmICh2ZXJiYXRpbSA9PT0gJyEnIHx8IHZlcmJhdGltID09PSAnISEnKSB7XG4gICAgICAgICAgICAgICAgb25FcnJvcihgVmVyYmF0aW0gdGFncyBhcmVuJ3QgcmVzb2x2ZWQsIHNvICR7c291cmNlfSBpcyBpbnZhbGlkLmApO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNvdXJjZVtzb3VyY2UubGVuZ3RoIC0gMV0gIT09ICc+JylcbiAgICAgICAgICAgICAgICBvbkVycm9yKCdWZXJiYXRpbSB0YWdzIG11c3QgZW5kIHdpdGggYSA+Jyk7XG4gICAgICAgICAgICByZXR1cm4gdmVyYmF0aW07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgWywgaGFuZGxlLCBzdWZmaXhdID0gc291cmNlLm1hdGNoKC9eKC4qISkoW14hXSopJC9zKTtcbiAgICAgICAgaWYgKCFzdWZmaXgpXG4gICAgICAgICAgICBvbkVycm9yKGBUaGUgJHtzb3VyY2V9IHRhZyBoYXMgbm8gc3VmZml4YCk7XG4gICAgICAgIGNvbnN0IHByZWZpeCA9IHRoaXMudGFnc1toYW5kbGVdO1xuICAgICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVmaXggKyBkZWNvZGVVUklDb21wb25lbnQoc3VmZml4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIG9uRXJyb3IoU3RyaW5nKGVycm9yKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGhhbmRsZSA9PT0gJyEnKVxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTsgLy8gbG9jYWwgdGFnXG4gICAgICAgIG9uRXJyb3IoYENvdWxkIG5vdCByZXNvbHZlIHRhZzogJHtzb3VyY2V9YCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIGZ1bGx5IHJlc29sdmVkIHRhZywgcmV0dXJucyBpdHMgcHJpbnRhYmxlIHN0cmluZyBmb3JtLFxuICAgICAqIHRha2luZyBpbnRvIGFjY291bnQgY3VycmVudCB0YWcgcHJlZml4ZXMgYW5kIGRlZmF1bHRzLlxuICAgICAqL1xuICAgIHRhZ1N0cmluZyh0YWcpIHtcbiAgICAgICAgZm9yIChjb25zdCBbaGFuZGxlLCBwcmVmaXhdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMudGFncykpIHtcbiAgICAgICAgICAgIGlmICh0YWcuc3RhcnRzV2l0aChwcmVmaXgpKVxuICAgICAgICAgICAgICAgIHJldHVybiBoYW5kbGUgKyBlc2NhcGVUYWdOYW1lKHRhZy5zdWJzdHJpbmcocHJlZml4Lmxlbmd0aCkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YWdbMF0gPT09ICchJyA/IHRhZyA6IGAhPCR7dGFnfT5gO1xuICAgIH1cbiAgICB0b1N0cmluZyhkb2MpIHtcbiAgICAgICAgY29uc3QgbGluZXMgPSB0aGlzLnlhbWwuZXhwbGljaXRcbiAgICAgICAgICAgID8gW2AlWUFNTCAke3RoaXMueWFtbC52ZXJzaW9uIHx8ICcxLjInfWBdXG4gICAgICAgICAgICA6IFtdO1xuICAgICAgICBjb25zdCB0YWdFbnRyaWVzID0gT2JqZWN0LmVudHJpZXModGhpcy50YWdzKTtcbiAgICAgICAgbGV0IHRhZ05hbWVzO1xuICAgICAgICBpZiAoZG9jICYmIHRhZ0VudHJpZXMubGVuZ3RoID4gMCAmJiBpc05vZGUoZG9jLmNvbnRlbnRzKSkge1xuICAgICAgICAgICAgY29uc3QgdGFncyA9IHt9O1xuICAgICAgICAgICAgdmlzaXQoZG9jLmNvbnRlbnRzLCAoX2tleSwgbm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpc05vZGUobm9kZSkgJiYgbm9kZS50YWcpXG4gICAgICAgICAgICAgICAgICAgIHRhZ3Nbbm9kZS50YWddID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGFnTmFtZXMgPSBPYmplY3Qua2V5cyh0YWdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0YWdOYW1lcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IFtoYW5kbGUsIHByZWZpeF0gb2YgdGFnRW50cmllcykge1xuICAgICAgICAgICAgaWYgKGhhbmRsZSA9PT0gJyEhJyAmJiBwcmVmaXggPT09ICd0YWc6eWFtbC5vcmcsMjAwMjonKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKCFkb2MgfHwgdGFnTmFtZXMuc29tZSh0biA9PiB0bi5zdGFydHNXaXRoKHByZWZpeCkpKVxuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goYCVUQUcgJHtoYW5kbGV9ICR7cHJlZml4fWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbiAgICB9XG59XG5EaXJlY3RpdmVzLmRlZmF1bHRZYW1sID0geyBleHBsaWNpdDogZmFsc2UsIHZlcnNpb246ICcxLjInIH07XG5EaXJlY3RpdmVzLmRlZmF1bHRUYWdzID0geyAnISEnOiAndGFnOnlhbWwub3JnLDIwMDI6JyB9O1xuXG5leHBvcnQgeyBEaXJlY3RpdmVzIH07XG4iLCAiaW1wb3J0IHsgaXNTY2FsYXIsIGlzQ29sbGVjdGlvbiB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IHZpc2l0IH0gZnJvbSAnLi4vdmlzaXQuanMnO1xuXG4vKipcbiAqIFZlcmlmeSB0aGF0IHRoZSBpbnB1dCBzdHJpbmcgaXMgYSB2YWxpZCBhbmNob3IuXG4gKlxuICogV2lsbCB0aHJvdyBvbiBlcnJvcnMuXG4gKi9cbmZ1bmN0aW9uIGFuY2hvcklzVmFsaWQoYW5jaG9yKSB7XG4gICAgaWYgKC9bXFx4MDAtXFx4MTlcXHMsW1xcXXt9XS8udGVzdChhbmNob3IpKSB7XG4gICAgICAgIGNvbnN0IHNhID0gSlNPTi5zdHJpbmdpZnkoYW5jaG9yKTtcbiAgICAgICAgY29uc3QgbXNnID0gYEFuY2hvciBtdXN0IG5vdCBjb250YWluIHdoaXRlc3BhY2Ugb3IgY29udHJvbCBjaGFyYWN0ZXJzOiAke3NhfWA7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn1cbmZ1bmN0aW9uIGFuY2hvck5hbWVzKHJvb3QpIHtcbiAgICBjb25zdCBhbmNob3JzID0gbmV3IFNldCgpO1xuICAgIHZpc2l0KHJvb3QsIHtcbiAgICAgICAgVmFsdWUoX2tleSwgbm9kZSkge1xuICAgICAgICAgICAgaWYgKG5vZGUuYW5jaG9yKVxuICAgICAgICAgICAgICAgIGFuY2hvcnMuYWRkKG5vZGUuYW5jaG9yKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBhbmNob3JzO1xufVxuLyoqIEZpbmQgYSBuZXcgYW5jaG9yIG5hbWUgd2l0aCB0aGUgZ2l2ZW4gYHByZWZpeGAgYW5kIGEgb25lLWluZGV4ZWQgc3VmZml4LiAqL1xuZnVuY3Rpb24gZmluZE5ld0FuY2hvcihwcmVmaXgsIGV4Y2x1ZGUpIHtcbiAgICBmb3IgKGxldCBpID0gMTsgdHJ1ZTsgKytpKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBgJHtwcmVmaXh9JHtpfWA7XG4gICAgICAgIGlmICghZXhjbHVkZS5oYXMobmFtZSkpXG4gICAgICAgICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG59XG5mdW5jdGlvbiBjcmVhdGVOb2RlQW5jaG9ycyhkb2MsIHByZWZpeCkge1xuICAgIGNvbnN0IGFsaWFzT2JqZWN0cyA9IFtdO1xuICAgIGNvbnN0IHNvdXJjZU9iamVjdHMgPSBuZXcgTWFwKCk7XG4gICAgbGV0IHByZXZBbmNob3JzID0gbnVsbDtcbiAgICByZXR1cm4ge1xuICAgICAgICBvbkFuY2hvcjogKHNvdXJjZSkgPT4ge1xuICAgICAgICAgICAgYWxpYXNPYmplY3RzLnB1c2goc291cmNlKTtcbiAgICAgICAgICAgIHByZXZBbmNob3JzID8/IChwcmV2QW5jaG9ycyA9IGFuY2hvck5hbWVzKGRvYykpO1xuICAgICAgICAgICAgY29uc3QgYW5jaG9yID0gZmluZE5ld0FuY2hvcihwcmVmaXgsIHByZXZBbmNob3JzKTtcbiAgICAgICAgICAgIHByZXZBbmNob3JzLmFkZChhbmNob3IpO1xuICAgICAgICAgICAgcmV0dXJuIGFuY2hvcjtcbiAgICAgICAgfSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdpdGggY2lyY3VsYXIgcmVmZXJlbmNlcywgdGhlIHNvdXJjZSBub2RlIGlzIG9ubHkgcmVzb2x2ZWQgYWZ0ZXIgYWxsXG4gICAgICAgICAqIG9mIGl0cyBjaGlsZCBub2RlcyBhcmUuIFRoaXMgaXMgd2h5IGFuY2hvcnMgYXJlIHNldCBvbmx5IGFmdGVyIGFsbCBvZlxuICAgICAgICAgKiB0aGUgbm9kZXMgaGF2ZSBiZWVuIGNyZWF0ZWQuXG4gICAgICAgICAqL1xuICAgICAgICBzZXRBbmNob3JzOiAoKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHNvdXJjZSBvZiBhbGlhc09iamVjdHMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWYgPSBzb3VyY2VPYmplY3RzLmdldChzb3VyY2UpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcmVmID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgICAgICAgICByZWYuYW5jaG9yICYmXG4gICAgICAgICAgICAgICAgICAgIChpc1NjYWxhcihyZWYubm9kZSkgfHwgaXNDb2xsZWN0aW9uKHJlZi5ub2RlKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVmLm5vZGUuYW5jaG9yID0gcmVmLmFuY2hvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdGYWlsZWQgdG8gcmVzb2x2ZSByZXBlYXRlZCBvYmplY3QgKHRoaXMgc2hvdWxkIG5vdCBoYXBwZW4pJyk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzb3VyY2VPYmplY3RzXG4gICAgfTtcbn1cblxuZXhwb3J0IHsgYW5jaG9ySXNWYWxpZCwgYW5jaG9yTmFtZXMsIGNyZWF0ZU5vZGVBbmNob3JzLCBmaW5kTmV3QW5jaG9yIH07XG4iLCAiLyoqXG4gKiBBcHBsaWVzIHRoZSBKU09OLnBhcnNlIHJldml2ZXIgYWxnb3JpdGhtIGFzIGRlZmluZWQgaW4gdGhlIEVDTUEtMjYyIHNwZWMsXG4gKiBpbiBzZWN0aW9uIDI0LjUuMS4xIFwiUnVudGltZSBTZW1hbnRpY3M6IEludGVybmFsaXplSlNPTlByb3BlcnR5XCIgb2YgdGhlXG4gKiAyMDIxIGVkaXRpb246IGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtanNvbi5wYXJzZVxuICpcbiAqIEluY2x1ZGVzIGV4dGVuc2lvbnMgZm9yIGhhbmRsaW5nIE1hcCBhbmQgU2V0IG9iamVjdHMuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5UmV2aXZlcihyZXZpdmVyLCBvYmosIGtleSwgdmFsKSB7XG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdmFsLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdjAgPSB2YWxbaV07XG4gICAgICAgICAgICAgICAgY29uc3QgdjEgPSBhcHBseVJldml2ZXIocmV2aXZlciwgdmFsLCBTdHJpbmcoaSksIHYwKTtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWFycmF5LWRlbGV0ZVxuICAgICAgICAgICAgICAgIGlmICh2MSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsW2ldO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHYxICE9PSB2MClcbiAgICAgICAgICAgICAgICAgICAgdmFsW2ldID0gdjE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGsgb2YgQXJyYXkuZnJvbSh2YWwua2V5cygpKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYwID0gdmFsLmdldChrKTtcbiAgICAgICAgICAgICAgICBjb25zdCB2MSA9IGFwcGx5UmV2aXZlcihyZXZpdmVyLCB2YWwsIGssIHYwKTtcbiAgICAgICAgICAgICAgICBpZiAodjEgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgdmFsLmRlbGV0ZShrKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2MSAhPT0gdjApXG4gICAgICAgICAgICAgICAgICAgIHZhbC5zZXQoaywgdjEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHZhbCBpbnN0YW5jZW9mIFNldCkge1xuICAgICAgICAgICAgZm9yIChjb25zdCB2MCBvZiBBcnJheS5mcm9tKHZhbCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2MSA9IGFwcGx5UmV2aXZlcihyZXZpdmVyLCB2YWwsIHYwLCB2MCk7XG4gICAgICAgICAgICAgICAgaWYgKHYxID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIHZhbC5kZWxldGUodjApO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHYxICE9PSB2MCkge1xuICAgICAgICAgICAgICAgICAgICB2YWwuZGVsZXRlKHYwKTtcbiAgICAgICAgICAgICAgICAgICAgdmFsLmFkZCh2MSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaywgdjBdIG9mIE9iamVjdC5lbnRyaWVzKHZhbCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2MSA9IGFwcGx5UmV2aXZlcihyZXZpdmVyLCB2YWwsIGssIHYwKTtcbiAgICAgICAgICAgICAgICBpZiAodjEgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbFtrXTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh2MSAhPT0gdjApXG4gICAgICAgICAgICAgICAgICAgIHZhbFtrXSA9IHYxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXZpdmVyLmNhbGwob2JqLCBrZXksIHZhbCk7XG59XG5cbmV4cG9ydCB7IGFwcGx5UmV2aXZlciB9O1xuIiwgImltcG9ydCB7IGhhc0FuY2hvciB9IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IGNvbnZlcnQgYW55IG5vZGUgb3IgaXRzIGNvbnRlbnRzIHRvIG5hdGl2ZSBKYXZhU2NyaXB0XG4gKlxuICogQHBhcmFtIHZhbHVlIC0gVGhlIGlucHV0IHZhbHVlXG4gKiBAcGFyYW0gYXJnIC0gSWYgYHZhbHVlYCBkZWZpbmVzIGEgYHRvSlNPTigpYCBtZXRob2QsIHVzZSB0aGlzXG4gKiAgIGFzIGl0cyBmaXJzdCBhcmd1bWVudFxuICogQHBhcmFtIGN0eCAtIENvbnZlcnNpb24gY29udGV4dCwgb3JpZ2luYWxseSBzZXQgaW4gRG9jdW1lbnQjdG9KUygpLiBJZlxuICogICBgeyBrZWVwOiB0cnVlIH1gIGlzIG5vdCBzZXQsIG91dHB1dCBzaG91bGQgYmUgc3VpdGFibGUgZm9yIEpTT05cbiAqICAgc3RyaW5naWZpY2F0aW9uLlxuICovXG5mdW5jdGlvbiB0b0pTKHZhbHVlLCBhcmcsIGN0eCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLXJldHVyblxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIHZhbHVlLm1hcCgodiwgaSkgPT4gdG9KUyh2LCBTdHJpbmcoaSksIGN0eCkpO1xuICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudG9KU09OID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWNhbGxcbiAgICAgICAgaWYgKCFjdHggfHwgIWhhc0FuY2hvcih2YWx1ZSkpXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUudG9KU09OKGFyZywgY3R4KTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHsgYWxpYXNDb3VudDogMCwgY291bnQ6IDEsIHJlczogdW5kZWZpbmVkIH07XG4gICAgICAgIGN0eC5hbmNob3JzLnNldCh2YWx1ZSwgZGF0YSk7XG4gICAgICAgIGN0eC5vbkNyZWF0ZSA9IHJlcyA9PiB7XG4gICAgICAgICAgICBkYXRhLnJlcyA9IHJlcztcbiAgICAgICAgICAgIGRlbGV0ZSBjdHgub25DcmVhdGU7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlcyA9IHZhbHVlLnRvSlNPTihhcmcsIGN0eCk7XG4gICAgICAgIGlmIChjdHgub25DcmVhdGUpXG4gICAgICAgICAgICBjdHgub25DcmVhdGUocmVzKTtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2JpZ2ludCcgJiYgIWN0eD8ua2VlcClcbiAgICAgICAgcmV0dXJuIE51bWJlcih2YWx1ZSk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG5leHBvcnQgeyB0b0pTIH07XG4iLCAiaW1wb3J0IHsgYXBwbHlSZXZpdmVyIH0gZnJvbSAnLi4vZG9jL2FwcGx5UmV2aXZlci5qcyc7XG5pbXBvcnQgeyBOT0RFX1RZUEUsIGlzRG9jdW1lbnQgfSBmcm9tICcuL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IHRvSlMgfSBmcm9tICcuL3RvSlMuanMnO1xuXG5jbGFzcyBOb2RlQmFzZSB7XG4gICAgY29uc3RydWN0b3IodHlwZSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgTk9ERV9UWVBFLCB7IHZhbHVlOiB0eXBlIH0pO1xuICAgIH1cbiAgICAvKiogQ3JlYXRlIGEgY29weSBvZiB0aGlzIG5vZGUuICAqL1xuICAgIGNsb25lKCkge1xuICAgICAgICBjb25zdCBjb3B5ID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcyksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKHRoaXMpKTtcbiAgICAgICAgaWYgKHRoaXMucmFuZ2UpXG4gICAgICAgICAgICBjb3B5LnJhbmdlID0gdGhpcy5yYW5nZS5zbGljZSgpO1xuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG4gICAgLyoqIEEgcGxhaW4gSmF2YVNjcmlwdCByZXByZXNlbnRhdGlvbiBvZiB0aGlzIG5vZGUuICovXG4gICAgdG9KUyhkb2MsIHsgbWFwQXNNYXAsIG1heEFsaWFzQ291bnQsIG9uQW5jaG9yLCByZXZpdmVyIH0gPSB7fSkge1xuICAgICAgICBpZiAoIWlzRG9jdW1lbnQoZG9jKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0EgZG9jdW1lbnQgYXJndW1lbnQgaXMgcmVxdWlyZWQnKTtcbiAgICAgICAgY29uc3QgY3R4ID0ge1xuICAgICAgICAgICAgYW5jaG9yczogbmV3IE1hcCgpLFxuICAgICAgICAgICAgZG9jLFxuICAgICAgICAgICAga2VlcDogdHJ1ZSxcbiAgICAgICAgICAgIG1hcEFzTWFwOiBtYXBBc01hcCA9PT0gdHJ1ZSxcbiAgICAgICAgICAgIG1hcEtleVdhcm5lZDogZmFsc2UsXG4gICAgICAgICAgICBtYXhBbGlhc0NvdW50OiB0eXBlb2YgbWF4QWxpYXNDb3VudCA9PT0gJ251bWJlcicgPyBtYXhBbGlhc0NvdW50IDogMTAwXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlcyA9IHRvSlModGhpcywgJycsIGN0eCk7XG4gICAgICAgIGlmICh0eXBlb2Ygb25BbmNob3IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHsgY291bnQsIHJlcyB9IG9mIGN0eC5hbmNob3JzLnZhbHVlcygpKVxuICAgICAgICAgICAgICAgIG9uQW5jaG9yKHJlcywgY291bnQpO1xuICAgICAgICByZXR1cm4gdHlwZW9mIHJldml2ZXIgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgID8gYXBwbHlSZXZpdmVyKHJldml2ZXIsIHsgJyc6IHJlcyB9LCAnJywgcmVzKVxuICAgICAgICAgICAgOiByZXM7XG4gICAgfVxufVxuXG5leHBvcnQgeyBOb2RlQmFzZSB9O1xuIiwgImltcG9ydCB7IGFuY2hvcklzVmFsaWQgfSBmcm9tICcuLi9kb2MvYW5jaG9ycy5qcyc7XG5pbXBvcnQgeyB2aXNpdCB9IGZyb20gJy4uL3Zpc2l0LmpzJztcbmltcG9ydCB7IEFMSUFTLCBpc0FsaWFzLCBpc0NvbGxlY3Rpb24sIGlzUGFpciwgaGFzQW5jaG9yIH0gZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBOb2RlQmFzZSB9IGZyb20gJy4vTm9kZS5qcyc7XG5pbXBvcnQgeyB0b0pTIH0gZnJvbSAnLi90b0pTLmpzJztcblxuY2xhc3MgQWxpYXMgZXh0ZW5kcyBOb2RlQmFzZSB7XG4gICAgY29uc3RydWN0b3Ioc291cmNlKSB7XG4gICAgICAgIHN1cGVyKEFMSUFTKTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndGFnJywge1xuICAgICAgICAgICAgc2V0KCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQWxpYXMgbm9kZXMgY2Fubm90IGhhdmUgdGFncycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVzb2x2ZSB0aGUgdmFsdWUgb2YgdGhpcyBhbGlhcyB3aXRoaW4gYGRvY2AsIGZpbmRpbmcgdGhlIGxhc3RcbiAgICAgKiBpbnN0YW5jZSBvZiB0aGUgYHNvdXJjZWAgYW5jaG9yIGJlZm9yZSB0aGlzIG5vZGUuXG4gICAgICovXG4gICAgcmVzb2x2ZShkb2MsIGN0eCkge1xuICAgICAgICBpZiAoY3R4Py5tYXhBbGlhc0NvdW50ID09PSAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdBbGlhcyByZXNvbHV0aW9uIGlzIGRpc2FibGVkJyk7XG4gICAgICAgIGxldCBub2RlcztcbiAgICAgICAgaWYgKGN0eD8uYWxpYXNSZXNvbHZlQ2FjaGUpIHtcbiAgICAgICAgICAgIG5vZGVzID0gY3R4LmFsaWFzUmVzb2x2ZUNhY2hlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbm9kZXMgPSBbXTtcbiAgICAgICAgICAgIHZpc2l0KGRvYywge1xuICAgICAgICAgICAgICAgIE5vZGU6IChfa2V5LCBub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FsaWFzKG5vZGUpIHx8IGhhc0FuY2hvcihub2RlKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoY3R4KVxuICAgICAgICAgICAgICAgIGN0eC5hbGlhc1Jlc29sdmVDYWNoZSA9IG5vZGVzO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb3VuZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAobm9kZSA9PT0gdGhpcylcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGlmIChub2RlLmFuY2hvciA9PT0gdGhpcy5zb3VyY2UpXG4gICAgICAgICAgICAgICAgZm91bmQgPSBub2RlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9XG4gICAgdG9KU09OKF9hcmcsIGN0eCkge1xuICAgICAgICBpZiAoIWN0eClcbiAgICAgICAgICAgIHJldHVybiB7IHNvdXJjZTogdGhpcy5zb3VyY2UgfTtcbiAgICAgICAgY29uc3QgeyBhbmNob3JzLCBkb2MsIG1heEFsaWFzQ291bnQgfSA9IGN0eDtcbiAgICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5yZXNvbHZlKGRvYywgY3R4KTtcbiAgICAgICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IG1zZyA9IGBVbnJlc29sdmVkIGFsaWFzICh0aGUgYW5jaG9yIG11c3QgYmUgc2V0IGJlZm9yZSB0aGUgYWxpYXMpOiAke3RoaXMuc291cmNlfWA7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IobXNnKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZGF0YSA9IGFuY2hvcnMuZ2V0KHNvdXJjZSk7XG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgLy8gUmVzb2x2ZSBhbmNob3JzIGZvciBOb2RlLnByb3RvdHlwZS50b0pTKClcbiAgICAgICAgICAgIHRvSlMoc291cmNlLCBudWxsLCBjdHgpO1xuICAgICAgICAgICAgZGF0YSA9IGFuY2hvcnMuZ2V0KHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgICAgIGlmIChkYXRhPy5yZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgbXNnID0gJ1RoaXMgc2hvdWxkIG5vdCBoYXBwZW46IEFsaWFzIGFuY2hvciB3YXMgbm90IHJlc29sdmVkPyc7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IobXNnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF4QWxpYXNDb3VudCA+PSAwKSB7XG4gICAgICAgICAgICBkYXRhLmNvdW50ICs9IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5hbGlhc0NvdW50ID09PSAwKVxuICAgICAgICAgICAgICAgIGRhdGEuYWxpYXNDb3VudCA9IGdldEFsaWFzQ291bnQoZG9jLCBzb3VyY2UsIGFuY2hvcnMpO1xuICAgICAgICAgICAgaWYgKGRhdGEuY291bnQgKiBkYXRhLmFsaWFzQ291bnQgPiBtYXhBbGlhc0NvdW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gJ0V4Y2Vzc2l2ZSBhbGlhcyBjb3VudCBpbmRpY2F0ZXMgYSByZXNvdXJjZSBleGhhdXN0aW9uIGF0dGFjayc7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGEucmVzO1xuICAgIH1cbiAgICB0b1N0cmluZyhjdHgsIF9vbkNvbW1lbnQsIF9vbkNob21wS2VlcCkge1xuICAgICAgICBjb25zdCBzcmMgPSBgKiR7dGhpcy5zb3VyY2V9YDtcbiAgICAgICAgaWYgKGN0eCkge1xuICAgICAgICAgICAgYW5jaG9ySXNWYWxpZCh0aGlzLnNvdXJjZSk7XG4gICAgICAgICAgICBpZiAoY3R4Lm9wdGlvbnMudmVyaWZ5QWxpYXNPcmRlciAmJiAhY3R4LmFuY2hvcnMuaGFzKHRoaXMuc291cmNlKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IGBVbnJlc29sdmVkIGFsaWFzICh0aGUgYW5jaG9yIG11c3QgYmUgc2V0IGJlZm9yZSB0aGUgYWxpYXMpOiAke3RoaXMuc291cmNlfWA7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY3R4LmltcGxpY2l0S2V5KVxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtzcmN9IGA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNyYztcbiAgICB9XG59XG5mdW5jdGlvbiBnZXRBbGlhc0NvdW50KGRvYywgbm9kZSwgYW5jaG9ycykge1xuICAgIGlmIChpc0FsaWFzKG5vZGUpKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IG5vZGUucmVzb2x2ZShkb2MpO1xuICAgICAgICBjb25zdCBhbmNob3IgPSBhbmNob3JzICYmIHNvdXJjZSAmJiBhbmNob3JzLmdldChzb3VyY2UpO1xuICAgICAgICByZXR1cm4gYW5jaG9yID8gYW5jaG9yLmNvdW50ICogYW5jaG9yLmFsaWFzQ291bnQgOiAwO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0NvbGxlY3Rpb24obm9kZSkpIHtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIG5vZGUuaXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGMgPSBnZXRBbGlhc0NvdW50KGRvYywgaXRlbSwgYW5jaG9ycyk7XG4gICAgICAgICAgICBpZiAoYyA+IGNvdW50KVxuICAgICAgICAgICAgICAgIGNvdW50ID0gYztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUGFpcihub2RlKSkge1xuICAgICAgICBjb25zdCBrYyA9IGdldEFsaWFzQ291bnQoZG9jLCBub2RlLmtleSwgYW5jaG9ycyk7XG4gICAgICAgIGNvbnN0IHZjID0gZ2V0QWxpYXNDb3VudChkb2MsIG5vZGUudmFsdWUsIGFuY2hvcnMpO1xuICAgICAgICByZXR1cm4gTWF0aC5tYXgoa2MsIHZjKTtcbiAgICB9XG4gICAgcmV0dXJuIDE7XG59XG5cbmV4cG9ydCB7IEFsaWFzIH07XG4iLCAiaW1wb3J0IHsgU0NBTEFSIH0gZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBOb2RlQmFzZSB9IGZyb20gJy4vTm9kZS5qcyc7XG5pbXBvcnQgeyB0b0pTIH0gZnJvbSAnLi90b0pTLmpzJztcblxuY29uc3QgaXNTY2FsYXJWYWx1ZSA9ICh2YWx1ZSkgPT4gIXZhbHVlIHx8ICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jyk7XG5jbGFzcyBTY2FsYXIgZXh0ZW5kcyBOb2RlQmFzZSB7XG4gICAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICAgICAgc3VwZXIoU0NBTEFSKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICB0b0pTT04oYXJnLCBjdHgpIHtcbiAgICAgICAgcmV0dXJuIGN0eD8ua2VlcCA/IHRoaXMudmFsdWUgOiB0b0pTKHRoaXMudmFsdWUsIGFyZywgY3R4KTtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcodGhpcy52YWx1ZSk7XG4gICAgfVxufVxuU2NhbGFyLkJMT0NLX0ZPTERFRCA9ICdCTE9DS19GT0xERUQnO1xuU2NhbGFyLkJMT0NLX0xJVEVSQUwgPSAnQkxPQ0tfTElURVJBTCc7XG5TY2FsYXIuUExBSU4gPSAnUExBSU4nO1xuU2NhbGFyLlFVT1RFX0RPVUJMRSA9ICdRVU9URV9ET1VCTEUnO1xuU2NhbGFyLlFVT1RFX1NJTkdMRSA9ICdRVU9URV9TSU5HTEUnO1xuXG5leHBvcnQgeyBTY2FsYXIsIGlzU2NhbGFyVmFsdWUgfTtcbiIsICJpbXBvcnQgeyBBbGlhcyB9IGZyb20gJy4uL25vZGVzL0FsaWFzLmpzJztcbmltcG9ydCB7IGlzTm9kZSwgaXNQYWlyLCBNQVAsIFNFUSwgaXNEb2N1bWVudCB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uL25vZGVzL1NjYWxhci5qcyc7XG5cbmNvbnN0IGRlZmF1bHRUYWdQcmVmaXggPSAndGFnOnlhbWwub3JnLDIwMDI6JztcbmZ1bmN0aW9uIGZpbmRUYWdPYmplY3QodmFsdWUsIHRhZ05hbWUsIHRhZ3MpIHtcbiAgICBpZiAodGFnTmFtZSkge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHRhZ3MuZmlsdGVyKHQgPT4gdC50YWcgPT09IHRhZ05hbWUpO1xuICAgICAgICBjb25zdCB0YWdPYmogPSBtYXRjaC5maW5kKHQgPT4gIXQuZm9ybWF0KSA/PyBtYXRjaFswXTtcbiAgICAgICAgaWYgKCF0YWdPYmopXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRhZyAke3RhZ05hbWV9IG5vdCBmb3VuZGApO1xuICAgICAgICByZXR1cm4gdGFnT2JqO1xuICAgIH1cbiAgICByZXR1cm4gdGFncy5maW5kKHQgPT4gdC5pZGVudGlmeT8uKHZhbHVlKSAmJiAhdC5mb3JtYXQpO1xufVxuZnVuY3Rpb24gY3JlYXRlTm9kZSh2YWx1ZSwgdGFnTmFtZSwgY3R4KSB7XG4gICAgaWYgKGlzRG9jdW1lbnQodmFsdWUpKVxuICAgICAgICB2YWx1ZSA9IHZhbHVlLmNvbnRlbnRzO1xuICAgIGlmIChpc05vZGUodmFsdWUpKVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgaWYgKGlzUGFpcih2YWx1ZSkpIHtcbiAgICAgICAgY29uc3QgbWFwID0gY3R4LnNjaGVtYVtNQVBdLmNyZWF0ZU5vZGU/LihjdHguc2NoZW1hLCBudWxsLCBjdHgpO1xuICAgICAgICBtYXAuaXRlbXMucHVzaCh2YWx1ZSk7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfVxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZyB8fFxuICAgICAgICB2YWx1ZSBpbnN0YW5jZW9mIE51bWJlciB8fFxuICAgICAgICB2YWx1ZSBpbnN0YW5jZW9mIEJvb2xlYW4gfHxcbiAgICAgICAgKHR5cGVvZiBCaWdJbnQgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlIGluc3RhbmNlb2YgQmlnSW50KSAvLyBub3Qgc3VwcG9ydGVkIGV2ZXJ5d2hlcmVcbiAgICApIHtcbiAgICAgICAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zZXJpYWxpemVqc29ucHJvcGVydHlcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS52YWx1ZU9mKCk7XG4gICAgfVxuICAgIGNvbnN0IHsgYWxpYXNEdXBsaWNhdGVPYmplY3RzLCBvbkFuY2hvciwgb25UYWdPYmosIHNjaGVtYSwgc291cmNlT2JqZWN0cyB9ID0gY3R4O1xuICAgIC8vIERldGVjdCBkdXBsaWNhdGUgcmVmZXJlbmNlcyB0byB0aGUgc2FtZSBvYmplY3QgJiB1c2UgQWxpYXMgbm9kZXMgZm9yIGFsbFxuICAgIC8vIGFmdGVyIGZpcnN0LiBUaGUgYHJlZmAgd3JhcHBlciBhbGxvd3MgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgdG8gcmVzb2x2ZS5cbiAgICBsZXQgcmVmID0gdW5kZWZpbmVkO1xuICAgIGlmIChhbGlhc0R1cGxpY2F0ZU9iamVjdHMgJiYgdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZWYgPSBzb3VyY2VPYmplY3RzLmdldCh2YWx1ZSk7XG4gICAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgICAgIHJlZi5hbmNob3IgPz8gKHJlZi5hbmNob3IgPSBvbkFuY2hvcih2YWx1ZSkpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbGlhcyhyZWYuYW5jaG9yKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlZiA9IHsgYW5jaG9yOiBudWxsLCBub2RlOiBudWxsIH07XG4gICAgICAgICAgICBzb3VyY2VPYmplY3RzLnNldCh2YWx1ZSwgcmVmKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodGFnTmFtZT8uc3RhcnRzV2l0aCgnISEnKSlcbiAgICAgICAgdGFnTmFtZSA9IGRlZmF1bHRUYWdQcmVmaXggKyB0YWdOYW1lLnNsaWNlKDIpO1xuICAgIGxldCB0YWdPYmogPSBmaW5kVGFnT2JqZWN0KHZhbHVlLCB0YWdOYW1lLCBzY2hlbWEudGFncyk7XG4gICAgaWYgKCF0YWdPYmopIHtcbiAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWNhbGxcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9KU09OKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gbmV3IFNjYWxhcih2YWx1ZSk7XG4gICAgICAgICAgICBpZiAocmVmKVxuICAgICAgICAgICAgICAgIHJlZi5ub2RlID0gbm9kZTtcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG4gICAgICAgIHRhZ09iaiA9XG4gICAgICAgICAgICB2YWx1ZSBpbnN0YW5jZW9mIE1hcFxuICAgICAgICAgICAgICAgID8gc2NoZW1hW01BUF1cbiAgICAgICAgICAgICAgICA6IFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QodmFsdWUpXG4gICAgICAgICAgICAgICAgICAgID8gc2NoZW1hW1NFUV1cbiAgICAgICAgICAgICAgICAgICAgOiBzY2hlbWFbTUFQXTtcbiAgICB9XG4gICAgaWYgKG9uVGFnT2JqKSB7XG4gICAgICAgIG9uVGFnT2JqKHRhZ09iaik7XG4gICAgICAgIGRlbGV0ZSBjdHgub25UYWdPYmo7XG4gICAgfVxuICAgIGNvbnN0IG5vZGUgPSB0YWdPYmo/LmNyZWF0ZU5vZGVcbiAgICAgICAgPyB0YWdPYmouY3JlYXRlTm9kZShjdHguc2NoZW1hLCB2YWx1ZSwgY3R4KVxuICAgICAgICA6IHR5cGVvZiB0YWdPYmo/Lm5vZGVDbGFzcz8uZnJvbSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgPyB0YWdPYmoubm9kZUNsYXNzLmZyb20oY3R4LnNjaGVtYSwgdmFsdWUsIGN0eClcbiAgICAgICAgICAgIDogbmV3IFNjYWxhcih2YWx1ZSk7XG4gICAgaWYgKHRhZ05hbWUpXG4gICAgICAgIG5vZGUudGFnID0gdGFnTmFtZTtcbiAgICBlbHNlIGlmICghdGFnT2JqLmRlZmF1bHQpXG4gICAgICAgIG5vZGUudGFnID0gdGFnT2JqLnRhZztcbiAgICBpZiAocmVmKVxuICAgICAgICByZWYubm9kZSA9IG5vZGU7XG4gICAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZU5vZGUgfTtcbiIsICJpbXBvcnQgeyBjcmVhdGVOb2RlIH0gZnJvbSAnLi4vZG9jL2NyZWF0ZU5vZGUuanMnO1xuaW1wb3J0IHsgaXNOb2RlLCBpc1BhaXIsIGlzQ29sbGVjdGlvbiwgaXNTY2FsYXIgfSBmcm9tICcuL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IE5vZGVCYXNlIH0gZnJvbSAnLi9Ob2RlLmpzJztcblxuZnVuY3Rpb24gY29sbGVjdGlvbkZyb21QYXRoKHNjaGVtYSwgcGF0aCwgdmFsdWUpIHtcbiAgICBsZXQgdiA9IHZhbHVlO1xuICAgIGZvciAobGV0IGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIGNvbnN0IGsgPSBwYXRoW2ldO1xuICAgICAgICBpZiAodHlwZW9mIGsgPT09ICdudW1iZXInICYmIE51bWJlci5pc0ludGVnZXIoaykgJiYgayA+PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBhID0gW107XG4gICAgICAgICAgICBhW2tdID0gdjtcbiAgICAgICAgICAgIHYgPSBhO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdiA9IG5ldyBNYXAoW1trLCB2XV0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVOb2RlKHYsIHVuZGVmaW5lZCwge1xuICAgICAgICBhbGlhc0R1cGxpY2F0ZU9iamVjdHM6IGZhbHNlLFxuICAgICAgICBrZWVwVW5kZWZpbmVkOiBmYWxzZSxcbiAgICAgICAgb25BbmNob3I6ICgpID0+IHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBzaG91bGQgbm90IGhhcHBlbiwgcGxlYXNlIHJlcG9ydCBhIGJ1Zy4nKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2NoZW1hLFxuICAgICAgICBzb3VyY2VPYmplY3RzOiBuZXcgTWFwKClcbiAgICB9KTtcbn1cbi8vIFR5cGUgZ3VhcmQgaXMgaW50ZW50aW9uYWxseSBhIGxpdHRsZSB3cm9uZyBzbyBhcyB0byBiZSBtb3JlIHVzZWZ1bCxcbi8vIGFzIGl0IGRvZXMgbm90IGNvdmVyIHVudHlwYWJsZSBlbXB0eSBub24tc3RyaW5nIGl0ZXJhYmxlcyAoZS5nLiBbXSkuXG5jb25zdCBpc0VtcHR5UGF0aCA9IChwYXRoKSA9PiBwYXRoID09IG51bGwgfHxcbiAgICAodHlwZW9mIHBhdGggPT09ICdvYmplY3QnICYmICEhcGF0aFtTeW1ib2wuaXRlcmF0b3JdKCkubmV4dCgpLmRvbmUpO1xuY2xhc3MgQ29sbGVjdGlvbiBleHRlbmRzIE5vZGVCYXNlIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBzY2hlbWEpIHtcbiAgICAgICAgc3VwZXIodHlwZSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2NoZW1hJywge1xuICAgICAgICAgICAgdmFsdWU6IHNjaGVtYSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGNvcHkgb2YgdGhpcyBjb2xsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHNjaGVtYSAtIElmIGRlZmluZWQsIG92ZXJ3cml0ZXMgdGhlIG9yaWdpbmFsJ3Mgc2NoZW1hXG4gICAgICovXG4gICAgY2xvbmUoc2NoZW1hKSB7XG4gICAgICAgIGNvbnN0IGNvcHkgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnModGhpcykpO1xuICAgICAgICBpZiAoc2NoZW1hKVxuICAgICAgICAgICAgY29weS5zY2hlbWEgPSBzY2hlbWE7XG4gICAgICAgIGNvcHkuaXRlbXMgPSBjb3B5Lml0ZW1zLm1hcChpdCA9PiBpc05vZGUoaXQpIHx8IGlzUGFpcihpdCkgPyBpdC5jbG9uZShzY2hlbWEpIDogaXQpO1xuICAgICAgICBpZiAodGhpcy5yYW5nZSlcbiAgICAgICAgICAgIGNvcHkucmFuZ2UgPSB0aGlzLnJhbmdlLnNsaWNlKCk7XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgdmFsdWUgdG8gdGhlIGNvbGxlY3Rpb24uIEZvciBgISFtYXBgIGFuZCBgISFvbWFwYCB0aGUgdmFsdWUgbXVzdFxuICAgICAqIGJlIGEgUGFpciBpbnN0YW5jZSBvciBhIGB7IGtleSwgdmFsdWUgfWAgb2JqZWN0LCB3aGljaCBtYXkgbm90IGhhdmUgYSBrZXlcbiAgICAgKiB0aGF0IGFscmVhZHkgZXhpc3RzIGluIHRoZSBtYXAuXG4gICAgICovXG4gICAgYWRkSW4ocGF0aCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGlzRW1wdHlQYXRoKHBhdGgpKVxuICAgICAgICAgICAgdGhpcy5hZGQodmFsdWUpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IFtrZXksIC4uLnJlc3RdID0gcGF0aDtcbiAgICAgICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldChrZXksIHRydWUpO1xuICAgICAgICAgICAgaWYgKGlzQ29sbGVjdGlvbihub2RlKSlcbiAgICAgICAgICAgICAgICBub2RlLmFkZEluKHJlc3QsIHZhbHVlKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUgPT09IHVuZGVmaW5lZCAmJiB0aGlzLnNjaGVtYSlcbiAgICAgICAgICAgICAgICB0aGlzLnNldChrZXksIGNvbGxlY3Rpb25Gcm9tUGF0aCh0aGlzLnNjaGVtYSwgcmVzdCwgdmFsdWUpKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIFlBTUwgY29sbGVjdGlvbiBhdCAke2tleX0uIFJlbWFpbmluZyBwYXRoOiAke3Jlc3R9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIHZhbHVlIGZyb20gdGhlIGNvbGxlY3Rpb24uXG4gICAgICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBpdGVtIHdhcyBmb3VuZCBhbmQgcmVtb3ZlZC5cbiAgICAgKi9cbiAgICBkZWxldGVJbihwYXRoKSB7XG4gICAgICAgIGNvbnN0IFtrZXksIC4uLnJlc3RdID0gcGF0aDtcbiAgICAgICAgaWYgKHJlc3QubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGVsZXRlKGtleSk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldChrZXksIHRydWUpO1xuICAgICAgICBpZiAoaXNDb2xsZWN0aW9uKG5vZGUpKVxuICAgICAgICAgICAgcmV0dXJuIG5vZGUuZGVsZXRlSW4ocmVzdCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgWUFNTCBjb2xsZWN0aW9uIGF0ICR7a2V5fS4gUmVtYWluaW5nIHBhdGg6ICR7cmVzdH1gKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBpdGVtIGF0IGBrZXlgLCBvciBgdW5kZWZpbmVkYCBpZiBub3QgZm91bmQuIEJ5IGRlZmF1bHQgdW53cmFwc1xuICAgICAqIHNjYWxhciB2YWx1ZXMgZnJvbSB0aGVpciBzdXJyb3VuZGluZyBub2RlOyB0byBkaXNhYmxlIHNldCBga2VlcFNjYWxhcmAgdG9cbiAgICAgKiBgdHJ1ZWAgKGNvbGxlY3Rpb25zIGFyZSBhbHdheXMgcmV0dXJuZWQgaW50YWN0KS5cbiAgICAgKi9cbiAgICBnZXRJbihwYXRoLCBrZWVwU2NhbGFyKSB7XG4gICAgICAgIGNvbnN0IFtrZXksIC4uLnJlc3RdID0gcGF0aDtcbiAgICAgICAgY29uc3Qgbm9kZSA9IHRoaXMuZ2V0KGtleSwgdHJ1ZSk7XG4gICAgICAgIGlmIChyZXN0Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgIHJldHVybiAha2VlcFNjYWxhciAmJiBpc1NjYWxhcihub2RlKSA/IG5vZGUudmFsdWUgOiBub2RlO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gaXNDb2xsZWN0aW9uKG5vZGUpID8gbm9kZS5nZXRJbihyZXN0LCBrZWVwU2NhbGFyKSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaGFzQWxsTnVsbFZhbHVlcyhhbGxvd1NjYWxhcikge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5ldmVyeShub2RlID0+IHtcbiAgICAgICAgICAgIGlmICghaXNQYWlyKG5vZGUpKVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGNvbnN0IG4gPSBub2RlLnZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIChuID09IG51bGwgfHxcbiAgICAgICAgICAgICAgICAoYWxsb3dTY2FsYXIgJiZcbiAgICAgICAgICAgICAgICAgICAgaXNTY2FsYXIobikgJiZcbiAgICAgICAgICAgICAgICAgICAgbi52YWx1ZSA9PSBudWxsICYmXG4gICAgICAgICAgICAgICAgICAgICFuLmNvbW1lbnRCZWZvcmUgJiZcbiAgICAgICAgICAgICAgICAgICAgIW4uY29tbWVudCAmJlxuICAgICAgICAgICAgICAgICAgICAhbi50YWcpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgY29sbGVjdGlvbiBpbmNsdWRlcyBhIHZhbHVlIHdpdGggdGhlIGtleSBga2V5YC5cbiAgICAgKi9cbiAgICBoYXNJbihwYXRoKSB7XG4gICAgICAgIGNvbnN0IFtrZXksIC4uLnJlc3RdID0gcGF0aDtcbiAgICAgICAgaWYgKHJlc3QubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFzKGtleSk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLmdldChrZXksIHRydWUpO1xuICAgICAgICByZXR1cm4gaXNDb2xsZWN0aW9uKG5vZGUpID8gbm9kZS5oYXNJbihyZXN0KSA6IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgdmFsdWUgaW4gdGhpcyBjb2xsZWN0aW9uLiBGb3IgYCEhc2V0YCwgYHZhbHVlYCBuZWVkcyB0byBiZSBhXG4gICAgICogYm9vbGVhbiB0byBhZGQvcmVtb3ZlIHRoZSBpdGVtIGZyb20gdGhlIHNldC5cbiAgICAgKi9cbiAgICBzZXRJbihwYXRoLCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBba2V5LCAuLi5yZXN0XSA9IHBhdGg7XG4gICAgICAgIGlmIChyZXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGhpcy5nZXQoa2V5LCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChpc0NvbGxlY3Rpb24obm9kZSkpXG4gICAgICAgICAgICAgICAgbm9kZS5zZXRJbihyZXN0LCB2YWx1ZSk7XG4gICAgICAgICAgICBlbHNlIGlmIChub2RlID09PSB1bmRlZmluZWQgJiYgdGhpcy5zY2hlbWEpXG4gICAgICAgICAgICAgICAgdGhpcy5zZXQoa2V5LCBjb2xsZWN0aW9uRnJvbVBhdGgodGhpcy5zY2hlbWEsIHJlc3QsIHZhbHVlKSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBZQU1MIGNvbGxlY3Rpb24gYXQgJHtrZXl9LiBSZW1haW5pbmcgcGF0aDogJHtyZXN0fWApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBDb2xsZWN0aW9uLCBjb2xsZWN0aW9uRnJvbVBhdGgsIGlzRW1wdHlQYXRoIH07XG4iLCAiLyoqXG4gKiBTdHJpbmdpZmllcyBhIGNvbW1lbnQuXG4gKlxuICogRW1wdHkgY29tbWVudCBsaW5lcyBhcmUgbGVmdCBlbXB0eSxcbiAqIGxpbmVzIGNvbnNpc3Rpbmcgb2YgYSBzaW5nbGUgc3BhY2UgYXJlIHJlcGxhY2VkIGJ5IGAjYCxcbiAqIGFuZCBhbGwgb3RoZXIgbGluZXMgYXJlIHByZWZpeGVkIHdpdGggYSBgI2AuXG4gKi9cbmNvbnN0IHN0cmluZ2lmeUNvbW1lbnQgPSAoc3RyKSA9PiBzdHIucmVwbGFjZSgvXig/ISQpKD86ICQpPy9nbSwgJyMnKTtcbmZ1bmN0aW9uIGluZGVudENvbW1lbnQoY29tbWVudCwgaW5kZW50KSB7XG4gICAgaWYgKC9eXFxuKyQvLnRlc3QoY29tbWVudCkpXG4gICAgICAgIHJldHVybiBjb21tZW50LnN1YnN0cmluZygxKTtcbiAgICByZXR1cm4gaW5kZW50ID8gY29tbWVudC5yZXBsYWNlKC9eKD8hICokKS9nbSwgaW5kZW50KSA6IGNvbW1lbnQ7XG59XG5jb25zdCBsaW5lQ29tbWVudCA9IChzdHIsIGluZGVudCwgY29tbWVudCkgPT4gc3RyLmVuZHNXaXRoKCdcXG4nKVxuICAgID8gaW5kZW50Q29tbWVudChjb21tZW50LCBpbmRlbnQpXG4gICAgOiBjb21tZW50LmluY2x1ZGVzKCdcXG4nKVxuICAgICAgICA/ICdcXG4nICsgaW5kZW50Q29tbWVudChjb21tZW50LCBpbmRlbnQpXG4gICAgICAgIDogKHN0ci5lbmRzV2l0aCgnICcpID8gJycgOiAnICcpICsgY29tbWVudDtcblxuZXhwb3J0IHsgaW5kZW50Q29tbWVudCwgbGluZUNvbW1lbnQsIHN0cmluZ2lmeUNvbW1lbnQgfTtcbiIsICJjb25zdCBGT0xEX0ZMT1cgPSAnZmxvdyc7XG5jb25zdCBGT0xEX0JMT0NLID0gJ2Jsb2NrJztcbmNvbnN0IEZPTERfUVVPVEVEID0gJ3F1b3RlZCc7XG4vKipcbiAqIFRyaWVzIHRvIGtlZXAgaW5wdXQgYXQgdXAgdG8gYGxpbmVXaWR0aGAgY2hhcmFjdGVycywgc3BsaXR0aW5nIG9ubHkgb24gc3BhY2VzXG4gKiBub3QgZm9sbG93ZWQgYnkgbmV3bGluZXMgb3Igc3BhY2VzIHVubGVzcyBgbW9kZWAgaXMgYCdxdW90ZWQnYC4gTGluZXMgYXJlXG4gKiB0ZXJtaW5hdGVkIHdpdGggYFxcbmAgYW5kIHN0YXJ0ZWQgd2l0aCBgaW5kZW50YC5cbiAqL1xuZnVuY3Rpb24gZm9sZEZsb3dMaW5lcyh0ZXh0LCBpbmRlbnQsIG1vZGUgPSAnZmxvdycsIHsgaW5kZW50QXRTdGFydCwgbGluZVdpZHRoID0gODAsIG1pbkNvbnRlbnRXaWR0aCA9IDIwLCBvbkZvbGQsIG9uT3ZlcmZsb3cgfSA9IHt9KSB7XG4gICAgaWYgKCFsaW5lV2lkdGggfHwgbGluZVdpZHRoIDwgMClcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgaWYgKGxpbmVXaWR0aCA8IG1pbkNvbnRlbnRXaWR0aClcbiAgICAgICAgbWluQ29udGVudFdpZHRoID0gMDtcbiAgICBjb25zdCBlbmRTdGVwID0gTWF0aC5tYXgoMSArIG1pbkNvbnRlbnRXaWR0aCwgMSArIGxpbmVXaWR0aCAtIGluZGVudC5sZW5ndGgpO1xuICAgIGlmICh0ZXh0Lmxlbmd0aCA8PSBlbmRTdGVwKVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICBjb25zdCBmb2xkcyA9IFtdO1xuICAgIGNvbnN0IGVzY2FwZWRGb2xkcyA9IHt9O1xuICAgIGxldCBlbmQgPSBsaW5lV2lkdGggLSBpbmRlbnQubGVuZ3RoO1xuICAgIGlmICh0eXBlb2YgaW5kZW50QXRTdGFydCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKGluZGVudEF0U3RhcnQgPiBsaW5lV2lkdGggLSBNYXRoLm1heCgyLCBtaW5Db250ZW50V2lkdGgpKVxuICAgICAgICAgICAgZm9sZHMucHVzaCgwKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZW5kID0gbGluZVdpZHRoIC0gaW5kZW50QXRTdGFydDtcbiAgICB9XG4gICAgbGV0IHNwbGl0ID0gdW5kZWZpbmVkO1xuICAgIGxldCBwcmV2ID0gdW5kZWZpbmVkO1xuICAgIGxldCBvdmVyZmxvdyA9IGZhbHNlO1xuICAgIGxldCBpID0gLTE7XG4gICAgbGV0IGVzY1N0YXJ0ID0gLTE7XG4gICAgbGV0IGVzY0VuZCA9IC0xO1xuICAgIGlmIChtb2RlID09PSBGT0xEX0JMT0NLKSB7XG4gICAgICAgIGkgPSBjb25zdW1lTW9yZUluZGVudGVkTGluZXModGV4dCwgaSwgaW5kZW50Lmxlbmd0aCk7XG4gICAgICAgIGlmIChpICE9PSAtMSlcbiAgICAgICAgICAgIGVuZCA9IGkgKyBlbmRTdGVwO1xuICAgIH1cbiAgICBmb3IgKGxldCBjaDsgKGNoID0gdGV4dFsoaSArPSAxKV0pOykge1xuICAgICAgICBpZiAobW9kZSA9PT0gRk9MRF9RVU9URUQgJiYgY2ggPT09ICdcXFxcJykge1xuICAgICAgICAgICAgZXNjU3RhcnQgPSBpO1xuICAgICAgICAgICAgc3dpdGNoICh0ZXh0W2kgKyAxXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgICAgICAgICBpICs9IDM7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3UnOlxuICAgICAgICAgICAgICAgICAgICBpICs9IDU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1UnOlxuICAgICAgICAgICAgICAgICAgICBpICs9IDk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVzY0VuZCA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoID09PSAnXFxuJykge1xuICAgICAgICAgICAgaWYgKG1vZGUgPT09IEZPTERfQkxPQ0spXG4gICAgICAgICAgICAgICAgaSA9IGNvbnN1bWVNb3JlSW5kZW50ZWRMaW5lcyh0ZXh0LCBpLCBpbmRlbnQubGVuZ3RoKTtcbiAgICAgICAgICAgIGVuZCA9IGkgKyBpbmRlbnQubGVuZ3RoICsgZW5kU3RlcDtcbiAgICAgICAgICAgIHNwbGl0ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGNoID09PSAnICcgJiZcbiAgICAgICAgICAgICAgICBwcmV2ICYmXG4gICAgICAgICAgICAgICAgcHJldiAhPT0gJyAnICYmXG4gICAgICAgICAgICAgICAgcHJldiAhPT0gJ1xcbicgJiZcbiAgICAgICAgICAgICAgICBwcmV2ICE9PSAnXFx0Jykge1xuICAgICAgICAgICAgICAgIC8vIHNwYWNlIHN1cnJvdW5kZWQgYnkgbm9uLXNwYWNlIGNhbiBiZSByZXBsYWNlZCB3aXRoIG5ld2xpbmUgKyBpbmRlbnRcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gdGV4dFtpICsgMV07XG4gICAgICAgICAgICAgICAgaWYgKG5leHQgJiYgbmV4dCAhPT0gJyAnICYmIG5leHQgIT09ICdcXG4nICYmIG5leHQgIT09ICdcXHQnKVxuICAgICAgICAgICAgICAgICAgICBzcGxpdCA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaSA+PSBlbmQpIHtcbiAgICAgICAgICAgICAgICBpZiAoc3BsaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9sZHMucHVzaChzcGxpdCk7XG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IHNwbGl0ICsgZW5kU3RlcDtcbiAgICAgICAgICAgICAgICAgICAgc3BsaXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1vZGUgPT09IEZPTERfUVVPVEVEKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdoaXRlLXNwYWNlIGNvbGxlY3RlZCBhdCBlbmQgbWF5IHN0cmV0Y2ggcGFzdCBsaW5lV2lkdGhcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHByZXYgPT09ICcgJyB8fCBwcmV2ID09PSAnXFx0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJldiA9IGNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSB0ZXh0WyhpICs9IDEpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBBY2NvdW50IGZvciBuZXdsaW5lIGVzY2FwZSwgYnV0IGRvbid0IGJyZWFrIHByZWNlZGluZyBlc2NhcGVcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaiA9IGkgPiBlc2NFbmQgKyAxID8gaSAtIDIgOiBlc2NTdGFydCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIC8vIEJhaWwgb3V0IGlmIGxpbmVXaWR0aCAmIG1pbkNvbnRlbnRXaWR0aCBhcmUgc2hvcnRlciB0aGFuIGFuIGVzY2FwZSBzdHJpbmdcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVzY2FwZWRGb2xkc1tqXSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgICAgICAgICBmb2xkcy5wdXNoKGopO1xuICAgICAgICAgICAgICAgICAgICBlc2NhcGVkRm9sZHNbal0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBlbmQgPSBqICsgZW5kU3RlcDtcbiAgICAgICAgICAgICAgICAgICAgc3BsaXQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByZXYgPSBjaDtcbiAgICB9XG4gICAgaWYgKG92ZXJmbG93ICYmIG9uT3ZlcmZsb3cpXG4gICAgICAgIG9uT3ZlcmZsb3coKTtcbiAgICBpZiAoZm9sZHMubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICBpZiAob25Gb2xkKVxuICAgICAgICBvbkZvbGQoKTtcbiAgICBsZXQgcmVzID0gdGV4dC5zbGljZSgwLCBmb2xkc1swXSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmb2xkcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBmb2xkID0gZm9sZHNbaV07XG4gICAgICAgIGNvbnN0IGVuZCA9IGZvbGRzW2kgKyAxXSB8fCB0ZXh0Lmxlbmd0aDtcbiAgICAgICAgaWYgKGZvbGQgPT09IDApXG4gICAgICAgICAgICByZXMgPSBgXFxuJHtpbmRlbnR9JHt0ZXh0LnNsaWNlKDAsIGVuZCl9YDtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAobW9kZSA9PT0gRk9MRF9RVU9URUQgJiYgZXNjYXBlZEZvbGRzW2ZvbGRdKVxuICAgICAgICAgICAgICAgIHJlcyArPSBgJHt0ZXh0W2ZvbGRdfVxcXFxgO1xuICAgICAgICAgICAgcmVzICs9IGBcXG4ke2luZGVudH0ke3RleHQuc2xpY2UoZm9sZCArIDEsIGVuZCl9YDtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufVxuLyoqXG4gKiBQcmVzdW1lcyBgaSArIDFgIGlzIGF0IHRoZSBzdGFydCBvZiBhIGxpbmVcbiAqIEByZXR1cm5zIGluZGV4IG9mIGxhc3QgbmV3bGluZSBpbiBtb3JlLWluZGVudGVkIGJsb2NrXG4gKi9cbmZ1bmN0aW9uIGNvbnN1bWVNb3JlSW5kZW50ZWRMaW5lcyh0ZXh0LCBpLCBpbmRlbnQpIHtcbiAgICBsZXQgZW5kID0gaTtcbiAgICBsZXQgc3RhcnQgPSBpICsgMTtcbiAgICBsZXQgY2ggPSB0ZXh0W3N0YXJ0XTtcbiAgICB3aGlsZSAoY2ggPT09ICcgJyB8fCBjaCA9PT0gJ1xcdCcpIHtcbiAgICAgICAgaWYgKGkgPCBzdGFydCArIGluZGVudCkge1xuICAgICAgICAgICAgY2ggPSB0ZXh0WysraV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgY2ggPSB0ZXh0WysraV07XG4gICAgICAgICAgICB9IHdoaWxlIChjaCAmJiBjaCAhPT0gJ1xcbicpO1xuICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgICBjaCA9IHRleHRbc3RhcnRdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbmQ7XG59XG5cbmV4cG9ydCB7IEZPTERfQkxPQ0ssIEZPTERfRkxPVywgRk9MRF9RVU9URUQsIGZvbGRGbG93TGluZXMgfTtcbiIsICJpbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi9ub2Rlcy9TY2FsYXIuanMnO1xuaW1wb3J0IHsgZm9sZEZsb3dMaW5lcywgRk9MRF9GTE9XLCBGT0xEX1FVT1RFRCwgRk9MRF9CTE9DSyB9IGZyb20gJy4vZm9sZEZsb3dMaW5lcy5qcyc7XG5cbmNvbnN0IGdldEZvbGRPcHRpb25zID0gKGN0eCwgaXNCbG9jaykgPT4gKHtcbiAgICBpbmRlbnRBdFN0YXJ0OiBpc0Jsb2NrID8gY3R4LmluZGVudC5sZW5ndGggOiBjdHguaW5kZW50QXRTdGFydCxcbiAgICBsaW5lV2lkdGg6IGN0eC5vcHRpb25zLmxpbmVXaWR0aCxcbiAgICBtaW5Db250ZW50V2lkdGg6IGN0eC5vcHRpb25zLm1pbkNvbnRlbnRXaWR0aFxufSk7XG4vLyBBbHNvIGNoZWNrcyBmb3IgbGluZXMgc3RhcnRpbmcgd2l0aCAlLCBhcyBwYXJzaW5nIHRoZSBvdXRwdXQgYXMgWUFNTCAxLjEgd2lsbFxuLy8gcHJlc3VtZSB0aGF0J3Mgc3RhcnRpbmcgYSBuZXcgZG9jdW1lbnQuXG5jb25zdCBjb250YWluc0RvY3VtZW50TWFya2VyID0gKHN0cikgPT4gL14oJXwtLS18XFwuXFwuXFwuKS9tLnRlc3Qoc3RyKTtcbmZ1bmN0aW9uIGxpbmVMZW5ndGhPdmVyTGltaXQoc3RyLCBsaW5lV2lkdGgsIGluZGVudExlbmd0aCkge1xuICAgIGlmICghbGluZVdpZHRoIHx8IGxpbmVXaWR0aCA8IDApXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBsaW1pdCA9IGxpbmVXaWR0aCAtIGluZGVudExlbmd0aDtcbiAgICBjb25zdCBzdHJMZW4gPSBzdHIubGVuZ3RoO1xuICAgIGlmIChzdHJMZW4gPD0gbGltaXQpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMCwgc3RhcnQgPSAwOyBpIDwgc3RyTGVuOyArK2kpIHtcbiAgICAgICAgaWYgKHN0cltpXSA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgIGlmIChpIC0gc3RhcnQgPiBsaW1pdClcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgICBpZiAoc3RyTGVuIC0gc3RhcnQgPD0gbGltaXQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gZG91YmxlUXVvdGVkU3RyaW5nKHZhbHVlLCBjdHgpIHtcbiAgICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgIGlmIChjdHgub3B0aW9ucy5kb3VibGVRdW90ZWRBc0pTT04pXG4gICAgICAgIHJldHVybiBqc29uO1xuICAgIGNvbnN0IHsgaW1wbGljaXRLZXkgfSA9IGN0eDtcbiAgICBjb25zdCBtaW5NdWx0aUxpbmVMZW5ndGggPSBjdHgub3B0aW9ucy5kb3VibGVRdW90ZWRNaW5NdWx0aUxpbmVMZW5ndGg7XG4gICAgY29uc3QgaW5kZW50ID0gY3R4LmluZGVudCB8fCAoY29udGFpbnNEb2N1bWVudE1hcmtlcih2YWx1ZSkgPyAnICAnIDogJycpO1xuICAgIGxldCBzdHIgPSAnJztcbiAgICBsZXQgc3RhcnQgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwLCBjaCA9IGpzb25baV07IGNoOyBjaCA9IGpzb25bKytpXSkge1xuICAgICAgICBpZiAoY2ggPT09ICcgJyAmJiBqc29uW2kgKyAxXSA9PT0gJ1xcXFwnICYmIGpzb25baSArIDJdID09PSAnbicpIHtcbiAgICAgICAgICAgIC8vIHNwYWNlIGJlZm9yZSBuZXdsaW5lIG5lZWRzIHRvIGJlIGVzY2FwZWQgdG8gbm90IGJlIGZvbGRlZFxuICAgICAgICAgICAgc3RyICs9IGpzb24uc2xpY2Uoc3RhcnQsIGkpICsgJ1xcXFwgJztcbiAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgIHN0YXJ0ID0gaTtcbiAgICAgICAgICAgIGNoID0gJ1xcXFwnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaCA9PT0gJ1xcXFwnKVxuICAgICAgICAgICAgc3dpdGNoIChqc29uW2kgKyAxXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3UnOlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0ganNvbi5zbGljZShzdGFydCwgaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2RlID0ganNvbi5zdWJzdHIoaSArIDIsIDQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChjb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnMDAwMCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxcXDAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcwMDA3JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxcYSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJzAwMGInOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFx2JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnMDAxYic6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxcXGUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcwMDg1JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxcTic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJzAwYTAnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFxfJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnMjAyOCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxcXEwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICcyMDI5JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9ICdcXFxcUCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2RlLnN1YnN0cigwLCAyKSA9PT0gJzAwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSAnXFxcXHgnICsgY29kZS5zdWJzdHIoMik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBqc29uLnN1YnN0cihpLCA2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkgKz0gNTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbic6XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbXBsaWNpdEtleSB8fFxuICAgICAgICAgICAgICAgICAgICAgICAganNvbltpICsgMl0gPT09ICdcIicgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb24ubGVuZ3RoIDwgbWluTXVsdGlMaW5lTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmb2xkaW5nIHdpbGwgZWF0IGZpcnN0IG5ld2xpbmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSBqc29uLnNsaWNlKHN0YXJ0LCBpKSArICdcXG5cXG4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGpzb25baSArIDJdID09PSAnXFxcXCcgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBqc29uW2kgKyAzXSA9PT0gJ24nICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganNvbltpICsgNF0gIT09ICdcIicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcbic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSArPSAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyICs9IGluZGVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNwYWNlIGFmdGVyIG5ld2xpbmUgbmVlZHMgdG8gYmUgZXNjYXBlZCB0byBub3QgYmUgZm9sZGVkXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoanNvbltpICsgMl0gPT09ICcgJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gJ1xcXFwnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgfVxuICAgIHN0ciA9IHN0YXJ0ID8gc3RyICsganNvbi5zbGljZShzdGFydCkgOiBqc29uO1xuICAgIHJldHVybiBpbXBsaWNpdEtleVxuICAgICAgICA/IHN0clxuICAgICAgICA6IGZvbGRGbG93TGluZXMoc3RyLCBpbmRlbnQsIEZPTERfUVVPVEVELCBnZXRGb2xkT3B0aW9ucyhjdHgsIGZhbHNlKSk7XG59XG5mdW5jdGlvbiBzaW5nbGVRdW90ZWRTdHJpbmcodmFsdWUsIGN0eCkge1xuICAgIGlmIChjdHgub3B0aW9ucy5zaW5nbGVRdW90ZSA9PT0gZmFsc2UgfHxcbiAgICAgICAgKGN0eC5pbXBsaWNpdEtleSAmJiB2YWx1ZS5pbmNsdWRlcygnXFxuJykpIHx8XG4gICAgICAgIC9bIFxcdF1cXG58XFxuWyBcXHRdLy50ZXN0KHZhbHVlKSAvLyBzaW5nbGUgcXVvdGVkIHN0cmluZyBjYW4ndCBoYXZlIGxlYWRpbmcgb3IgdHJhaWxpbmcgd2hpdGVzcGFjZSBhcm91bmQgbmV3bGluZVxuICAgIClcbiAgICAgICAgcmV0dXJuIGRvdWJsZVF1b3RlZFN0cmluZyh2YWx1ZSwgY3R4KTtcbiAgICBjb25zdCBpbmRlbnQgPSBjdHguaW5kZW50IHx8IChjb250YWluc0RvY3VtZW50TWFya2VyKHZhbHVlKSA/ICcgICcgOiAnJyk7XG4gICAgY29uc3QgcmVzID0gXCInXCIgKyB2YWx1ZS5yZXBsYWNlKC8nL2csIFwiJydcIikucmVwbGFjZSgvXFxuKy9nLCBgJCZcXG4ke2luZGVudH1gKSArIFwiJ1wiO1xuICAgIHJldHVybiBjdHguaW1wbGljaXRLZXlcbiAgICAgICAgPyByZXNcbiAgICAgICAgOiBmb2xkRmxvd0xpbmVzKHJlcywgaW5kZW50LCBGT0xEX0ZMT1csIGdldEZvbGRPcHRpb25zKGN0eCwgZmFsc2UpKTtcbn1cbmZ1bmN0aW9uIHF1b3RlZFN0cmluZyh2YWx1ZSwgY3R4KSB7XG4gICAgY29uc3QgeyBzaW5nbGVRdW90ZSB9ID0gY3R4Lm9wdGlvbnM7XG4gICAgbGV0IHFzO1xuICAgIGlmIChzaW5nbGVRdW90ZSA9PT0gZmFsc2UpXG4gICAgICAgIHFzID0gZG91YmxlUXVvdGVkU3RyaW5nO1xuICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBoYXNEb3VibGUgPSB2YWx1ZS5pbmNsdWRlcygnXCInKTtcbiAgICAgICAgY29uc3QgaGFzU2luZ2xlID0gdmFsdWUuaW5jbHVkZXMoXCInXCIpO1xuICAgICAgICBpZiAoaGFzRG91YmxlICYmICFoYXNTaW5nbGUpXG4gICAgICAgICAgICBxcyA9IHNpbmdsZVF1b3RlZFN0cmluZztcbiAgICAgICAgZWxzZSBpZiAoaGFzU2luZ2xlICYmICFoYXNEb3VibGUpXG4gICAgICAgICAgICBxcyA9IGRvdWJsZVF1b3RlZFN0cmluZztcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcXMgPSBzaW5nbGVRdW90ZSA/IHNpbmdsZVF1b3RlZFN0cmluZyA6IGRvdWJsZVF1b3RlZFN0cmluZztcbiAgICB9XG4gICAgcmV0dXJuIHFzKHZhbHVlLCBjdHgpO1xufVxuLy8gVGhlIG5lZ2F0aXZlIGxvb2tiZWhpbmQgYXZvaWRzIGEgcG9seW5vbWlhbCBzZWFyY2gsXG4vLyBidXQgaXNuJ3Qgc3VwcG9ydGVkIHlldCBvbiBTYWZhcmk6IGh0dHBzOi8vY2FuaXVzZS5jb20vanMtcmVnZXhwLWxvb2tiZWhpbmRcbmxldCBibG9ja0VuZE5ld2xpbmVzO1xudHJ5IHtcbiAgICBibG9ja0VuZE5ld2xpbmVzID0gbmV3IFJlZ0V4cCgnKF58KD88IVxcbikpXFxuKyg/IVxcbnwkKScsICdnJyk7XG59XG5jYXRjaCB7XG4gICAgYmxvY2tFbmROZXdsaW5lcyA9IC9cXG4rKD8hXFxufCQpL2c7XG59XG5mdW5jdGlvbiBibG9ja1N0cmluZyh7IGNvbW1lbnQsIHR5cGUsIHZhbHVlIH0sIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCkge1xuICAgIGNvbnN0IHsgYmxvY2tRdW90ZSwgY29tbWVudFN0cmluZywgbGluZVdpZHRoIH0gPSBjdHgub3B0aW9ucztcbiAgICAvLyAxLiBCbG9jayBjYW4ndCBlbmQgaW4gd2hpdGVzcGFjZSB1bmxlc3MgdGhlIGxhc3QgbGluZSBpcyBub24tZW1wdHkuXG4gICAgLy8gMi4gU3RyaW5ncyBjb25zaXN0aW5nIG9mIG9ubHkgd2hpdGVzcGFjZSBhcmUgYmVzdCByZW5kZXJlZCBleHBsaWNpdGx5LlxuICAgIGlmICghYmxvY2tRdW90ZSB8fCAvXFxuW1xcdCBdKyQvLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBxdW90ZWRTdHJpbmcodmFsdWUsIGN0eCk7XG4gICAgfVxuICAgIGNvbnN0IGluZGVudCA9IGN0eC5pbmRlbnQgfHxcbiAgICAgICAgKGN0eC5mb3JjZUJsb2NrSW5kZW50IHx8IGNvbnRhaW5zRG9jdW1lbnRNYXJrZXIodmFsdWUpID8gJyAgJyA6ICcnKTtcbiAgICBjb25zdCBsaXRlcmFsID0gYmxvY2tRdW90ZSA9PT0gJ2xpdGVyYWwnXG4gICAgICAgID8gdHJ1ZVxuICAgICAgICA6IGJsb2NrUXVvdGUgPT09ICdmb2xkZWQnIHx8IHR5cGUgPT09IFNjYWxhci5CTE9DS19GT0xERURcbiAgICAgICAgICAgID8gZmFsc2VcbiAgICAgICAgICAgIDogdHlwZSA9PT0gU2NhbGFyLkJMT0NLX0xJVEVSQUxcbiAgICAgICAgICAgICAgICA/IHRydWVcbiAgICAgICAgICAgICAgICA6ICFsaW5lTGVuZ3RoT3ZlckxpbWl0KHZhbHVlLCBsaW5lV2lkdGgsIGluZGVudC5sZW5ndGgpO1xuICAgIGlmICghdmFsdWUpXG4gICAgICAgIHJldHVybiBsaXRlcmFsID8gJ3xcXG4nIDogJz5cXG4nO1xuICAgIC8vIGRldGVybWluZSBjaG9tcGluZyBmcm9tIHdoaXRlc3BhY2UgYXQgdmFsdWUgZW5kXG4gICAgbGV0IGNob21wO1xuICAgIGxldCBlbmRTdGFydDtcbiAgICBmb3IgKGVuZFN0YXJ0ID0gdmFsdWUubGVuZ3RoOyBlbmRTdGFydCA+IDA7IC0tZW5kU3RhcnQpIHtcbiAgICAgICAgY29uc3QgY2ggPSB2YWx1ZVtlbmRTdGFydCAtIDFdO1xuICAgICAgICBpZiAoY2ggIT09ICdcXG4nICYmIGNoICE9PSAnXFx0JyAmJiBjaCAhPT0gJyAnKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxldCBlbmQgPSB2YWx1ZS5zdWJzdHJpbmcoZW5kU3RhcnQpO1xuICAgIGNvbnN0IGVuZE5sUG9zID0gZW5kLmluZGV4T2YoJ1xcbicpO1xuICAgIGlmIChlbmRObFBvcyA9PT0gLTEpIHtcbiAgICAgICAgY2hvbXAgPSAnLSc7IC8vIHN0cmlwXG4gICAgfVxuICAgIGVsc2UgaWYgKHZhbHVlID09PSBlbmQgfHwgZW5kTmxQb3MgIT09IGVuZC5sZW5ndGggLSAxKSB7XG4gICAgICAgIGNob21wID0gJysnOyAvLyBrZWVwXG4gICAgICAgIGlmIChvbkNob21wS2VlcClcbiAgICAgICAgICAgIG9uQ2hvbXBLZWVwKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjaG9tcCA9ICcnOyAvLyBjbGlwXG4gICAgfVxuICAgIGlmIChlbmQpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgwLCAtZW5kLmxlbmd0aCk7XG4gICAgICAgIGlmIChlbmRbZW5kLmxlbmd0aCAtIDFdID09PSAnXFxuJylcbiAgICAgICAgICAgIGVuZCA9IGVuZC5zbGljZSgwLCAtMSk7XG4gICAgICAgIGVuZCA9IGVuZC5yZXBsYWNlKGJsb2NrRW5kTmV3bGluZXMsIGAkJiR7aW5kZW50fWApO1xuICAgIH1cbiAgICAvLyBkZXRlcm1pbmUgaW5kZW50IGluZGljYXRvciBmcm9tIHdoaXRlc3BhY2UgYXQgdmFsdWUgc3RhcnRcbiAgICBsZXQgc3RhcnRXaXRoU3BhY2UgPSBmYWxzZTtcbiAgICBsZXQgc3RhcnRFbmQ7XG4gICAgbGV0IHN0YXJ0TmxQb3MgPSAtMTtcbiAgICBmb3IgKHN0YXJ0RW5kID0gMDsgc3RhcnRFbmQgPCB2YWx1ZS5sZW5ndGg7ICsrc3RhcnRFbmQpIHtcbiAgICAgICAgY29uc3QgY2ggPSB2YWx1ZVtzdGFydEVuZF07XG4gICAgICAgIGlmIChjaCA9PT0gJyAnKVxuICAgICAgICAgICAgc3RhcnRXaXRoU3BhY2UgPSB0cnVlO1xuICAgICAgICBlbHNlIGlmIChjaCA9PT0gJ1xcbicpXG4gICAgICAgICAgICBzdGFydE5sUG9zID0gc3RhcnRFbmQ7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBsZXQgc3RhcnQgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgc3RhcnRObFBvcyA8IHN0YXJ0RW5kID8gc3RhcnRObFBvcyArIDEgOiBzdGFydEVuZCk7XG4gICAgaWYgKHN0YXJ0KSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKHN0YXJ0Lmxlbmd0aCk7XG4gICAgICAgIHN0YXJ0ID0gc3RhcnQucmVwbGFjZSgvXFxuKy9nLCBgJCYke2luZGVudH1gKTtcbiAgICB9XG4gICAgY29uc3QgaW5kZW50U2l6ZSA9IGluZGVudCA/ICcyJyA6ICcxJzsgLy8gcm9vdCBpcyBhdCAtMVxuICAgIC8vIExlYWRpbmcgfCBvciA+IGlzIGFkZGVkIGxhdGVyXG4gICAgbGV0IGhlYWRlciA9IChzdGFydFdpdGhTcGFjZSA/IGluZGVudFNpemUgOiAnJykgKyBjaG9tcDtcbiAgICBpZiAoY29tbWVudCkge1xuICAgICAgICBoZWFkZXIgKz0gJyAnICsgY29tbWVudFN0cmluZyhjb21tZW50LnJlcGxhY2UoLyA/W1xcclxcbl0rL2csICcgJykpO1xuICAgICAgICBpZiAob25Db21tZW50KVxuICAgICAgICAgICAgb25Db21tZW50KCk7XG4gICAgfVxuICAgIGlmICghbGl0ZXJhbCkge1xuICAgICAgICBjb25zdCBmb2xkZWRWYWx1ZSA9IHZhbHVlXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuKy9nLCAnXFxuJCYnKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyg/Ol58XFxuKShbXFx0IF0uKikoPzooW1xcblxcdCBdKilcXG4oPyFbXFxuXFx0IF0pKT8vZywgJyQxJDInKSAvLyBtb3JlLWluZGVudGVkIGxpbmVzIGFyZW4ndCBmb2xkZWRcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIF4gbW9yZS1pbmQuIF4gZW1wdHkgICAgIF4gY2FwdHVyZSBuZXh0IGVtcHR5IGxpbmVzIG9ubHkgYXQgZW5kIG9mIGluZGVudFxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcbisvZywgYCQmJHtpbmRlbnR9YCk7XG4gICAgICAgIGxldCBsaXRlcmFsRmFsbGJhY2sgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgZm9sZE9wdGlvbnMgPSBnZXRGb2xkT3B0aW9ucyhjdHgsIHRydWUpO1xuICAgICAgICBpZiAoYmxvY2tRdW90ZSAhPT0gJ2ZvbGRlZCcgJiYgdHlwZSAhPT0gU2NhbGFyLkJMT0NLX0ZPTERFRCkge1xuICAgICAgICAgICAgZm9sZE9wdGlvbnMub25PdmVyZmxvdyA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBsaXRlcmFsRmFsbGJhY2sgPSB0cnVlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBib2R5ID0gZm9sZEZsb3dMaW5lcyhgJHtzdGFydH0ke2ZvbGRlZFZhbHVlfSR7ZW5kfWAsIGluZGVudCwgRk9MRF9CTE9DSywgZm9sZE9wdGlvbnMpO1xuICAgICAgICBpZiAoIWxpdGVyYWxGYWxsYmFjaylcbiAgICAgICAgICAgIHJldHVybiBgPiR7aGVhZGVyfVxcbiR7aW5kZW50fSR7Ym9keX1gO1xuICAgIH1cbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcbisvZywgYCQmJHtpbmRlbnR9YCk7XG4gICAgcmV0dXJuIGB8JHtoZWFkZXJ9XFxuJHtpbmRlbnR9JHtzdGFydH0ke3ZhbHVlfSR7ZW5kfWA7XG59XG5mdW5jdGlvbiBwbGFpblN0cmluZyhpdGVtLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApIHtcbiAgICBjb25zdCB7IHR5cGUsIHZhbHVlIH0gPSBpdGVtO1xuICAgIGNvbnN0IHsgYWN0dWFsU3RyaW5nLCBpbXBsaWNpdEtleSwgaW5kZW50LCBpbmRlbnRTdGVwLCBpbkZsb3cgfSA9IGN0eDtcbiAgICBpZiAoKGltcGxpY2l0S2V5ICYmIHZhbHVlLmluY2x1ZGVzKCdcXG4nKSkgfHxcbiAgICAgICAgKGluRmxvdyAmJiAvW1tcXF17fSxdLy50ZXN0KHZhbHVlKSkpIHtcbiAgICAgICAgcmV0dXJuIHF1b3RlZFN0cmluZyh2YWx1ZSwgY3R4KTtcbiAgICB9XG4gICAgaWYgKC9eW1xcblxcdCAsW1xcXXt9IyYqIXw+J1wiJUBgXXxeWz8tXSR8Xls/LV1bIFxcdF18W1xcbjpdWyBcXHRdfFsgXFx0XVxcbnxbXFxuXFx0IF0jfFtcXG5cXHQgOl0kLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICAvLyBub3QgYWxsb3dlZDpcbiAgICAgICAgLy8gLSAnLScgb3IgJz8nXG4gICAgICAgIC8vIC0gc3RhcnQgd2l0aCBhbiBpbmRpY2F0b3IgY2hhcmFjdGVyIChleGNlcHQgWz86LV0pIG9yIC9bPy1dIC9cbiAgICAgICAgLy8gLSAnXFxuICcsICc6ICcgb3IgJyBcXG4nIGFueXdoZXJlXG4gICAgICAgIC8vIC0gJyMnIG5vdCBwcmVjZWRlZCBieSBhIG5vbi1zcGFjZSBjaGFyXG4gICAgICAgIC8vIC0gZW5kIHdpdGggJyAnIG9yICc6J1xuICAgICAgICByZXR1cm4gaW1wbGljaXRLZXkgfHwgaW5GbG93IHx8ICF2YWx1ZS5pbmNsdWRlcygnXFxuJylcbiAgICAgICAgICAgID8gcXVvdGVkU3RyaW5nKHZhbHVlLCBjdHgpXG4gICAgICAgICAgICA6IGJsb2NrU3RyaW5nKGl0ZW0sIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCk7XG4gICAgfVxuICAgIGlmICghaW1wbGljaXRLZXkgJiZcbiAgICAgICAgIWluRmxvdyAmJlxuICAgICAgICB0eXBlICE9PSBTY2FsYXIuUExBSU4gJiZcbiAgICAgICAgdmFsdWUuaW5jbHVkZXMoJ1xcbicpKSB7XG4gICAgICAgIC8vIFdoZXJlIGFsbG93ZWQgJiB0eXBlIG5vdCBzZXQgZXhwbGljaXRseSwgcHJlZmVyIGJsb2NrIHN0eWxlIGZvciBtdWx0aWxpbmUgc3RyaW5nc1xuICAgICAgICByZXR1cm4gYmxvY2tTdHJpbmcoaXRlbSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKTtcbiAgICB9XG4gICAgaWYgKGNvbnRhaW5zRG9jdW1lbnRNYXJrZXIodmFsdWUpKSB7XG4gICAgICAgIGlmIChpbmRlbnQgPT09ICcnKSB7XG4gICAgICAgICAgICBjdHguZm9yY2VCbG9ja0luZGVudCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gYmxvY2tTdHJpbmcoaXRlbSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpbXBsaWNpdEtleSAmJiBpbmRlbnQgPT09IGluZGVudFN0ZXApIHtcbiAgICAgICAgICAgIHJldHVybiBxdW90ZWRTdHJpbmcodmFsdWUsIGN0eCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgc3RyID0gdmFsdWUucmVwbGFjZSgvXFxuKy9nLCBgJCZcXG4ke2luZGVudH1gKTtcbiAgICAvLyBWZXJpZnkgdGhhdCBvdXRwdXQgd2lsbCBiZSBwYXJzZWQgYXMgYSBzdHJpbmcsIGFzIGUuZy4gcGxhaW4gbnVtYmVycyBhbmRcbiAgICAvLyBib29sZWFucyBnZXQgcGFyc2VkIHdpdGggdGhvc2UgdHlwZXMgaW4gdjEuMiAoZS5nLiAnNDInLCAndHJ1ZScgJiAnMC45ZS0zJyksXG4gICAgLy8gYW5kIG90aGVycyBpbiB2MS4xLlxuICAgIGlmIChhY3R1YWxTdHJpbmcpIHtcbiAgICAgICAgY29uc3QgdGVzdCA9ICh0YWcpID0+IHRhZy5kZWZhdWx0ICYmIHRhZy50YWcgIT09ICd0YWc6eWFtbC5vcmcsMjAwMjpzdHInICYmIHRhZy50ZXN0Py50ZXN0KHN0cik7XG4gICAgICAgIGNvbnN0IHsgY29tcGF0LCB0YWdzIH0gPSBjdHguZG9jLnNjaGVtYTtcbiAgICAgICAgaWYgKHRhZ3Muc29tZSh0ZXN0KSB8fCBjb21wYXQ/LnNvbWUodGVzdCkpXG4gICAgICAgICAgICByZXR1cm4gcXVvdGVkU3RyaW5nKHZhbHVlLCBjdHgpO1xuICAgIH1cbiAgICByZXR1cm4gaW1wbGljaXRLZXlcbiAgICAgICAgPyBzdHJcbiAgICAgICAgOiBmb2xkRmxvd0xpbmVzKHN0ciwgaW5kZW50LCBGT0xEX0ZMT1csIGdldEZvbGRPcHRpb25zKGN0eCwgZmFsc2UpKTtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeVN0cmluZyhpdGVtLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApIHtcbiAgICBjb25zdCB7IGltcGxpY2l0S2V5LCBpbkZsb3cgfSA9IGN0eDtcbiAgICBjb25zdCBzcyA9IHR5cGVvZiBpdGVtLnZhbHVlID09PSAnc3RyaW5nJ1xuICAgICAgICA/IGl0ZW1cbiAgICAgICAgOiBPYmplY3QuYXNzaWduKHt9LCBpdGVtLCB7IHZhbHVlOiBTdHJpbmcoaXRlbS52YWx1ZSkgfSk7XG4gICAgbGV0IHsgdHlwZSB9ID0gaXRlbTtcbiAgICBpZiAodHlwZSAhPT0gU2NhbGFyLlFVT1RFX0RPVUJMRSkge1xuICAgICAgICAvLyBmb3JjZSBkb3VibGUgcXVvdGVzIG9uIGNvbnRyb2wgY2hhcmFjdGVycyAmIHVucGFpcmVkIHN1cnJvZ2F0ZXNcbiAgICAgICAgaWYgKC9bXFx4MDAtXFx4MDhcXHgwYi1cXHgxZlxceDdmLVxceDlmXFx1e0Q4MDB9LVxcdXtERkZGfV0vdS50ZXN0KHNzLnZhbHVlKSlcbiAgICAgICAgICAgIHR5cGUgPSBTY2FsYXIuUVVPVEVfRE9VQkxFO1xuICAgIH1cbiAgICBjb25zdCBfc3RyaW5naWZ5ID0gKF90eXBlKSA9PiB7XG4gICAgICAgIHN3aXRjaCAoX3R5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgU2NhbGFyLkJMT0NLX0ZPTERFRDpcbiAgICAgICAgICAgIGNhc2UgU2NhbGFyLkJMT0NLX0xJVEVSQUw6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGltcGxpY2l0S2V5IHx8IGluRmxvd1xuICAgICAgICAgICAgICAgICAgICA/IHF1b3RlZFN0cmluZyhzcy52YWx1ZSwgY3R4KSAvLyBibG9ja3MgYXJlIG5vdCB2YWxpZCBpbnNpZGUgZmxvdyBjb250YWluZXJzXG4gICAgICAgICAgICAgICAgICAgIDogYmxvY2tTdHJpbmcoc3MsIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCk7XG4gICAgICAgICAgICBjYXNlIFNjYWxhci5RVU9URV9ET1VCTEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvdWJsZVF1b3RlZFN0cmluZyhzcy52YWx1ZSwgY3R4KTtcbiAgICAgICAgICAgIGNhc2UgU2NhbGFyLlFVT1RFX1NJTkdMRTpcbiAgICAgICAgICAgICAgICByZXR1cm4gc2luZ2xlUXVvdGVkU3RyaW5nKHNzLnZhbHVlLCBjdHgpO1xuICAgICAgICAgICAgY2FzZSBTY2FsYXIuUExBSU46XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBsYWluU3RyaW5nKHNzLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgbGV0IHJlcyA9IF9zdHJpbmdpZnkodHlwZSk7XG4gICAgaWYgKHJlcyA9PT0gbnVsbCkge1xuICAgICAgICBjb25zdCB7IGRlZmF1bHRLZXlUeXBlLCBkZWZhdWx0U3RyaW5nVHlwZSB9ID0gY3R4Lm9wdGlvbnM7XG4gICAgICAgIGNvbnN0IHQgPSAoaW1wbGljaXRLZXkgJiYgZGVmYXVsdEtleVR5cGUpIHx8IGRlZmF1bHRTdHJpbmdUeXBlO1xuICAgICAgICByZXMgPSBfc3RyaW5naWZ5KHQpO1xuICAgICAgICBpZiAocmVzID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBkZWZhdWx0IHN0cmluZyB0eXBlICR7dH1gKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IHsgc3RyaW5naWZ5U3RyaW5nIH07XG4iLCAiaW1wb3J0IHsgYW5jaG9ySXNWYWxpZCB9IGZyb20gJy4uL2RvYy9hbmNob3JzLmpzJztcbmltcG9ydCB7IGlzUGFpciwgaXNBbGlhcywgaXNOb2RlLCBpc1NjYWxhciwgaXNDb2xsZWN0aW9uIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgc3RyaW5naWZ5Q29tbWVudCB9IGZyb20gJy4vc3RyaW5naWZ5Q29tbWVudC5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnlTdHJpbmcgfSBmcm9tICcuL3N0cmluZ2lmeVN0cmluZy5qcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0cmluZ2lmeUNvbnRleHQoZG9jLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgb3B0ID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgIGJsb2NrUXVvdGU6IHRydWUsXG4gICAgICAgIGNvbW1lbnRTdHJpbmc6IHN0cmluZ2lmeUNvbW1lbnQsXG4gICAgICAgIGRlZmF1bHRLZXlUeXBlOiBudWxsLFxuICAgICAgICBkZWZhdWx0U3RyaW5nVHlwZTogJ1BMQUlOJyxcbiAgICAgICAgZGlyZWN0aXZlczogbnVsbCxcbiAgICAgICAgZG91YmxlUXVvdGVkQXNKU09OOiBmYWxzZSxcbiAgICAgICAgZG91YmxlUXVvdGVkTWluTXVsdGlMaW5lTGVuZ3RoOiA0MCxcbiAgICAgICAgZmFsc2VTdHI6ICdmYWxzZScsXG4gICAgICAgIGZsb3dDb2xsZWN0aW9uUGFkZGluZzogdHJ1ZSxcbiAgICAgICAgaW5kZW50U2VxOiB0cnVlLFxuICAgICAgICBsaW5lV2lkdGg6IDgwLFxuICAgICAgICBtaW5Db250ZW50V2lkdGg6IDIwLFxuICAgICAgICBudWxsU3RyOiAnbnVsbCcsXG4gICAgICAgIHNpbXBsZUtleXM6IGZhbHNlLFxuICAgICAgICBzaW5nbGVRdW90ZTogbnVsbCxcbiAgICAgICAgdHJhaWxpbmdDb21tYTogZmFsc2UsXG4gICAgICAgIHRydWVTdHI6ICd0cnVlJyxcbiAgICAgICAgdmVyaWZ5QWxpYXNPcmRlcjogdHJ1ZVxuICAgIH0sIGRvYy5zY2hlbWEudG9TdHJpbmdPcHRpb25zLCBvcHRpb25zKTtcbiAgICBsZXQgaW5GbG93O1xuICAgIHN3aXRjaCAob3B0LmNvbGxlY3Rpb25TdHlsZSkge1xuICAgICAgICBjYXNlICdibG9jayc6XG4gICAgICAgICAgICBpbkZsb3cgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmbG93JzpcbiAgICAgICAgICAgIGluRmxvdyA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGluRmxvdyA9IG51bGw7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAgIGFuY2hvcnM6IG5ldyBTZXQoKSxcbiAgICAgICAgZG9jLFxuICAgICAgICBmbG93Q29sbGVjdGlvblBhZGRpbmc6IG9wdC5mbG93Q29sbGVjdGlvblBhZGRpbmcgPyAnICcgOiAnJyxcbiAgICAgICAgaW5kZW50OiAnJyxcbiAgICAgICAgaW5kZW50U3RlcDogdHlwZW9mIG9wdC5pbmRlbnQgPT09ICdudW1iZXInID8gJyAnLnJlcGVhdChvcHQuaW5kZW50KSA6ICcgICcsXG4gICAgICAgIGluRmxvdyxcbiAgICAgICAgb3B0aW9uczogb3B0XG4gICAgfTtcbn1cbmZ1bmN0aW9uIGdldFRhZ09iamVjdCh0YWdzLCBpdGVtKSB7XG4gICAgaWYgKGl0ZW0udGFnKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gdGFncy5maWx0ZXIodCA9PiB0LnRhZyA9PT0gaXRlbS50YWcpO1xuICAgICAgICBpZiAobWF0Y2gubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHJldHVybiBtYXRjaC5maW5kKHQgPT4gdC5mb3JtYXQgPT09IGl0ZW0uZm9ybWF0KSA/PyBtYXRjaFswXTtcbiAgICB9XG4gICAgbGV0IHRhZ09iaiA9IHVuZGVmaW5lZDtcbiAgICBsZXQgb2JqO1xuICAgIGlmIChpc1NjYWxhcihpdGVtKSkge1xuICAgICAgICBvYmogPSBpdGVtLnZhbHVlO1xuICAgICAgICBsZXQgbWF0Y2ggPSB0YWdzLmZpbHRlcih0ID0+IHQuaWRlbnRpZnk/LihvYmopKTtcbiAgICAgICAgaWYgKG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHRlc3RNYXRjaCA9IG1hdGNoLmZpbHRlcih0ID0+IHQudGVzdCk7XG4gICAgICAgICAgICBpZiAodGVzdE1hdGNoLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgbWF0Y2ggPSB0ZXN0TWF0Y2g7XG4gICAgICAgIH1cbiAgICAgICAgdGFnT2JqID1cbiAgICAgICAgICAgIG1hdGNoLmZpbmQodCA9PiB0LmZvcm1hdCA9PT0gaXRlbS5mb3JtYXQpID8/IG1hdGNoLmZpbmQodCA9PiAhdC5mb3JtYXQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgb2JqID0gaXRlbTtcbiAgICAgICAgdGFnT2JqID0gdGFncy5maW5kKHQgPT4gdC5ub2RlQ2xhc3MgJiYgb2JqIGluc3RhbmNlb2YgdC5ub2RlQ2xhc3MpO1xuICAgIH1cbiAgICBpZiAoIXRhZ09iaikge1xuICAgICAgICBjb25zdCBuYW1lID0gb2JqPy5jb25zdHJ1Y3Rvcj8ubmFtZSA/PyAob2JqID09PSBudWxsID8gJ251bGwnIDogdHlwZW9mIG9iaik7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVGFnIG5vdCByZXNvbHZlZCBmb3IgJHtuYW1lfSB2YWx1ZWApO1xuICAgIH1cbiAgICByZXR1cm4gdGFnT2JqO1xufVxuLy8gbmVlZHMgdG8gYmUgY2FsbGVkIGJlZm9yZSB2YWx1ZSBzdHJpbmdpZmllciB0byBhbGxvdyBmb3IgY2lyY3VsYXIgYW5jaG9yIHJlZnNcbmZ1bmN0aW9uIHN0cmluZ2lmeVByb3BzKG5vZGUsIHRhZ09iaiwgeyBhbmNob3JzLCBkb2MgfSkge1xuICAgIGlmICghZG9jLmRpcmVjdGl2ZXMpXG4gICAgICAgIHJldHVybiAnJztcbiAgICBjb25zdCBwcm9wcyA9IFtdO1xuICAgIGNvbnN0IGFuY2hvciA9IChpc1NjYWxhcihub2RlKSB8fCBpc0NvbGxlY3Rpb24obm9kZSkpICYmIG5vZGUuYW5jaG9yO1xuICAgIGlmIChhbmNob3IgJiYgYW5jaG9ySXNWYWxpZChhbmNob3IpKSB7XG4gICAgICAgIGFuY2hvcnMuYWRkKGFuY2hvcik7XG4gICAgICAgIHByb3BzLnB1c2goYCYke2FuY2hvcn1gKTtcbiAgICB9XG4gICAgY29uc3QgdGFnID0gbm9kZS50YWcgPz8gKHRhZ09iai5kZWZhdWx0ID8gbnVsbCA6IHRhZ09iai50YWcpO1xuICAgIGlmICh0YWcpXG4gICAgICAgIHByb3BzLnB1c2goZG9jLmRpcmVjdGl2ZXMudGFnU3RyaW5nKHRhZykpO1xuICAgIHJldHVybiBwcm9wcy5qb2luKCcgJyk7XG59XG5mdW5jdGlvbiBzdHJpbmdpZnkoaXRlbSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgaWYgKGlzUGFpcihpdGVtKSlcbiAgICAgICAgcmV0dXJuIGl0ZW0udG9TdHJpbmcoY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKTtcbiAgICBpZiAoaXNBbGlhcyhpdGVtKSkge1xuICAgICAgICBpZiAoY3R4LmRvYy5kaXJlY3RpdmVzKVxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0udG9TdHJpbmcoY3R4KTtcbiAgICAgICAgaWYgKGN0eC5yZXNvbHZlZEFsaWFzZXM/LmhhcyhpdGVtKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgQ2Fubm90IHN0cmluZ2lmeSBjaXJjdWxhciBzdHJ1Y3R1cmUgd2l0aG91dCBhbGlhcyBub2Rlc2ApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGN0eC5yZXNvbHZlZEFsaWFzZXMpXG4gICAgICAgICAgICAgICAgY3R4LnJlc29sdmVkQWxpYXNlcy5hZGQoaXRlbSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgY3R4LnJlc29sdmVkQWxpYXNlcyA9IG5ldyBTZXQoW2l0ZW1dKTtcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtLnJlc29sdmUoY3R4LmRvYyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHRhZ09iaiA9IHVuZGVmaW5lZDtcbiAgICBjb25zdCBub2RlID0gaXNOb2RlKGl0ZW0pXG4gICAgICAgID8gaXRlbVxuICAgICAgICA6IGN0eC5kb2MuY3JlYXRlTm9kZShpdGVtLCB7IG9uVGFnT2JqOiBvID0+ICh0YWdPYmogPSBvKSB9KTtcbiAgICB0YWdPYmogPz8gKHRhZ09iaiA9IGdldFRhZ09iamVjdChjdHguZG9jLnNjaGVtYS50YWdzLCBub2RlKSk7XG4gICAgY29uc3QgcHJvcHMgPSBzdHJpbmdpZnlQcm9wcyhub2RlLCB0YWdPYmosIGN0eCk7XG4gICAgaWYgKHByb3BzLmxlbmd0aCA+IDApXG4gICAgICAgIGN0eC5pbmRlbnRBdFN0YXJ0ID0gKGN0eC5pbmRlbnRBdFN0YXJ0ID8/IDApICsgcHJvcHMubGVuZ3RoICsgMTtcbiAgICBjb25zdCBzdHIgPSB0eXBlb2YgdGFnT2JqLnN0cmluZ2lmeSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IHRhZ09iai5zdHJpbmdpZnkobm9kZSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKVxuICAgICAgICA6IGlzU2NhbGFyKG5vZGUpXG4gICAgICAgICAgICA/IHN0cmluZ2lmeVN0cmluZyhub2RlLCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApXG4gICAgICAgICAgICA6IG5vZGUudG9TdHJpbmcoY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKTtcbiAgICBpZiAoIXByb3BzKVxuICAgICAgICByZXR1cm4gc3RyO1xuICAgIHJldHVybiBpc1NjYWxhcihub2RlKSB8fCBzdHJbMF0gPT09ICd7JyB8fCBzdHJbMF0gPT09ICdbJ1xuICAgICAgICA/IGAke3Byb3BzfSAke3N0cn1gXG4gICAgICAgIDogYCR7cHJvcHN9XFxuJHtjdHguaW5kZW50fSR7c3RyfWA7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVN0cmluZ2lmeUNvbnRleHQsIHN0cmluZ2lmeSB9O1xuIiwgImltcG9ydCB7IGlzQ29sbGVjdGlvbiwgaXNOb2RlLCBpc1NjYWxhciwgaXNTZXEgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi9ub2Rlcy9TY2FsYXIuanMnO1xuaW1wb3J0IHsgc3RyaW5naWZ5IH0gZnJvbSAnLi9zdHJpbmdpZnkuanMnO1xuaW1wb3J0IHsgbGluZUNvbW1lbnQsIGluZGVudENvbW1lbnQgfSBmcm9tICcuL3N0cmluZ2lmeUNvbW1lbnQuanMnO1xuXG5mdW5jdGlvbiBzdHJpbmdpZnlQYWlyKHsga2V5LCB2YWx1ZSB9LCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApIHtcbiAgICBjb25zdCB7IGFsbE51bGxWYWx1ZXMsIGRvYywgaW5kZW50LCBpbmRlbnRTdGVwLCBvcHRpb25zOiB7IGNvbW1lbnRTdHJpbmcsIGluZGVudFNlcSwgc2ltcGxlS2V5cyB9IH0gPSBjdHg7XG4gICAgbGV0IGtleUNvbW1lbnQgPSAoaXNOb2RlKGtleSkgJiYga2V5LmNvbW1lbnQpIHx8IG51bGw7XG4gICAgaWYgKHNpbXBsZUtleXMpIHtcbiAgICAgICAgaWYgKGtleUNvbW1lbnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignV2l0aCBzaW1wbGUga2V5cywga2V5IG5vZGVzIGNhbm5vdCBoYXZlIGNvbW1lbnRzJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ29sbGVjdGlvbihrZXkpIHx8ICghaXNOb2RlKGtleSkgJiYgdHlwZW9mIGtleSA9PT0gJ29iamVjdCcpKSB7XG4gICAgICAgICAgICBjb25zdCBtc2cgPSAnV2l0aCBzaW1wbGUga2V5cywgY29sbGVjdGlvbiBjYW5ub3QgYmUgdXNlZCBhcyBhIGtleSB2YWx1ZSc7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgZXhwbGljaXRLZXkgPSAhc2ltcGxlS2V5cyAmJlxuICAgICAgICAoIWtleSB8fFxuICAgICAgICAgICAgKGtleUNvbW1lbnQgJiYgdmFsdWUgPT0gbnVsbCAmJiAhY3R4LmluRmxvdykgfHxcbiAgICAgICAgICAgIGlzQ29sbGVjdGlvbihrZXkpIHx8XG4gICAgICAgICAgICAoaXNTY2FsYXIoa2V5KVxuICAgICAgICAgICAgICAgID8ga2V5LnR5cGUgPT09IFNjYWxhci5CTE9DS19GT0xERUQgfHwga2V5LnR5cGUgPT09IFNjYWxhci5CTE9DS19MSVRFUkFMXG4gICAgICAgICAgICAgICAgOiB0eXBlb2Yga2V5ID09PSAnb2JqZWN0JykpO1xuICAgIGN0eCA9IE9iamVjdC5hc3NpZ24oe30sIGN0eCwge1xuICAgICAgICBhbGxOdWxsVmFsdWVzOiBmYWxzZSxcbiAgICAgICAgaW1wbGljaXRLZXk6ICFleHBsaWNpdEtleSAmJiAoc2ltcGxlS2V5cyB8fCAhYWxsTnVsbFZhbHVlcyksXG4gICAgICAgIGluZGVudDogaW5kZW50ICsgaW5kZW50U3RlcFxuICAgIH0pO1xuICAgIGxldCBrZXlDb21tZW50RG9uZSA9IGZhbHNlO1xuICAgIGxldCBjaG9tcEtlZXAgPSBmYWxzZTtcbiAgICBsZXQgc3RyID0gc3RyaW5naWZ5KGtleSwgY3R4LCAoKSA9PiAoa2V5Q29tbWVudERvbmUgPSB0cnVlKSwgKCkgPT4gKGNob21wS2VlcCA9IHRydWUpKTtcbiAgICBpZiAoIWV4cGxpY2l0S2V5ICYmICFjdHguaW5GbG93ICYmIHN0ci5sZW5ndGggPiAxMDI0KSB7XG4gICAgICAgIGlmIChzaW1wbGVLZXlzKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXaXRoIHNpbXBsZSBrZXlzLCBzaW5nbGUgbGluZSBzY2FsYXIgbXVzdCBub3Qgc3BhbiBtb3JlIHRoYW4gMTAyNCBjaGFyYWN0ZXJzJyk7XG4gICAgICAgIGV4cGxpY2l0S2V5ID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGN0eC5pbkZsb3cpIHtcbiAgICAgICAgaWYgKGFsbE51bGxWYWx1ZXMgfHwgdmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGtleUNvbW1lbnREb25lICYmIG9uQ29tbWVudClcbiAgICAgICAgICAgICAgICBvbkNvbW1lbnQoKTtcbiAgICAgICAgICAgIHJldHVybiBzdHIgPT09ICcnID8gJz8nIDogZXhwbGljaXRLZXkgPyBgPyAke3N0cn1gIDogc3RyO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKChhbGxOdWxsVmFsdWVzICYmICFzaW1wbGVLZXlzKSB8fCAodmFsdWUgPT0gbnVsbCAmJiBleHBsaWNpdEtleSkpIHtcbiAgICAgICAgc3RyID0gYD8gJHtzdHJ9YDtcbiAgICAgICAgaWYgKGtleUNvbW1lbnQgJiYgIWtleUNvbW1lbnREb25lKSB7XG4gICAgICAgICAgICBzdHIgKz0gbGluZUNvbW1lbnQoc3RyLCBjdHguaW5kZW50LCBjb21tZW50U3RyaW5nKGtleUNvbW1lbnQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjaG9tcEtlZXAgJiYgb25DaG9tcEtlZXApXG4gICAgICAgICAgICBvbkNob21wS2VlcCgpO1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBpZiAoa2V5Q29tbWVudERvbmUpXG4gICAgICAgIGtleUNvbW1lbnQgPSBudWxsO1xuICAgIGlmIChleHBsaWNpdEtleSkge1xuICAgICAgICBpZiAoa2V5Q29tbWVudClcbiAgICAgICAgICAgIHN0ciArPSBsaW5lQ29tbWVudChzdHIsIGN0eC5pbmRlbnQsIGNvbW1lbnRTdHJpbmcoa2V5Q29tbWVudCkpO1xuICAgICAgICBzdHIgPSBgPyAke3N0cn1cXG4ke2luZGVudH06YDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0ciA9IGAke3N0cn06YDtcbiAgICAgICAgaWYgKGtleUNvbW1lbnQpXG4gICAgICAgICAgICBzdHIgKz0gbGluZUNvbW1lbnQoc3RyLCBjdHguaW5kZW50LCBjb21tZW50U3RyaW5nKGtleUNvbW1lbnQpKTtcbiAgICB9XG4gICAgbGV0IHZzYiwgdmNiLCB2YWx1ZUNvbW1lbnQ7XG4gICAgaWYgKGlzTm9kZSh2YWx1ZSkpIHtcbiAgICAgICAgdnNiID0gISF2YWx1ZS5zcGFjZUJlZm9yZTtcbiAgICAgICAgdmNiID0gdmFsdWUuY29tbWVudEJlZm9yZTtcbiAgICAgICAgdmFsdWVDb21tZW50ID0gdmFsdWUuY29tbWVudDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZzYiA9IGZhbHNlO1xuICAgICAgICB2Y2IgPSBudWxsO1xuICAgICAgICB2YWx1ZUNvbW1lbnQgPSBudWxsO1xuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JylcbiAgICAgICAgICAgIHZhbHVlID0gZG9jLmNyZWF0ZU5vZGUodmFsdWUpO1xuICAgIH1cbiAgICBjdHguaW1wbGljaXRLZXkgPSBmYWxzZTtcbiAgICBpZiAoIWV4cGxpY2l0S2V5ICYmICFrZXlDb21tZW50ICYmIGlzU2NhbGFyKHZhbHVlKSlcbiAgICAgICAgY3R4LmluZGVudEF0U3RhcnQgPSBzdHIubGVuZ3RoICsgMTtcbiAgICBjaG9tcEtlZXAgPSBmYWxzZTtcbiAgICBpZiAoIWluZGVudFNlcSAmJlxuICAgICAgICBpbmRlbnRTdGVwLmxlbmd0aCA+PSAyICYmXG4gICAgICAgICFjdHguaW5GbG93ICYmXG4gICAgICAgICFleHBsaWNpdEtleSAmJlxuICAgICAgICBpc1NlcSh2YWx1ZSkgJiZcbiAgICAgICAgIXZhbHVlLmZsb3cgJiZcbiAgICAgICAgIXZhbHVlLnRhZyAmJlxuICAgICAgICAhdmFsdWUuYW5jaG9yKSB7XG4gICAgICAgIC8vIElmIGluZGVudFNlcSA9PT0gZmFsc2UsIGNvbnNpZGVyICctICcgYXMgcGFydCBvZiBpbmRlbnRhdGlvbiB3aGVyZSBwb3NzaWJsZVxuICAgICAgICBjdHguaW5kZW50ID0gY3R4LmluZGVudC5zdWJzdHJpbmcoMik7XG4gICAgfVxuICAgIGxldCB2YWx1ZUNvbW1lbnREb25lID0gZmFsc2U7XG4gICAgY29uc3QgdmFsdWVTdHIgPSBzdHJpbmdpZnkodmFsdWUsIGN0eCwgKCkgPT4gKHZhbHVlQ29tbWVudERvbmUgPSB0cnVlKSwgKCkgPT4gKGNob21wS2VlcCA9IHRydWUpKTtcbiAgICBsZXQgd3MgPSAnICc7XG4gICAgaWYgKGtleUNvbW1lbnQgfHwgdnNiIHx8IHZjYikge1xuICAgICAgICB3cyA9IHZzYiA/ICdcXG4nIDogJyc7XG4gICAgICAgIGlmICh2Y2IpIHtcbiAgICAgICAgICAgIGNvbnN0IGNzID0gY29tbWVudFN0cmluZyh2Y2IpO1xuICAgICAgICAgICAgd3MgKz0gYFxcbiR7aW5kZW50Q29tbWVudChjcywgY3R4LmluZGVudCl9YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWVTdHIgPT09ICcnICYmICFjdHguaW5GbG93KSB7XG4gICAgICAgICAgICBpZiAod3MgPT09ICdcXG4nICYmIHZhbHVlQ29tbWVudClcbiAgICAgICAgICAgICAgICB3cyA9ICdcXG5cXG4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgd3MgKz0gYFxcbiR7Y3R4LmluZGVudH1gO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKCFleHBsaWNpdEtleSAmJiBpc0NvbGxlY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIGNvbnN0IHZzMCA9IHZhbHVlU3RyWzBdO1xuICAgICAgICBjb25zdCBubDAgPSB2YWx1ZVN0ci5pbmRleE9mKCdcXG4nKTtcbiAgICAgICAgY29uc3QgaGFzTmV3bGluZSA9IG5sMCAhPT0gLTE7XG4gICAgICAgIGNvbnN0IGZsb3cgPSBjdHguaW5GbG93ID8/IHZhbHVlLmZsb3cgPz8gdmFsdWUuaXRlbXMubGVuZ3RoID09PSAwO1xuICAgICAgICBpZiAoaGFzTmV3bGluZSB8fCAhZmxvdykge1xuICAgICAgICAgICAgbGV0IGhhc1Byb3BzTGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKGhhc05ld2xpbmUgJiYgKHZzMCA9PT0gJyYnIHx8IHZzMCA9PT0gJyEnKSkge1xuICAgICAgICAgICAgICAgIGxldCBzcDAgPSB2YWx1ZVN0ci5pbmRleE9mKCcgJyk7XG4gICAgICAgICAgICAgICAgaWYgKHZzMCA9PT0gJyYnICYmXG4gICAgICAgICAgICAgICAgICAgIHNwMCAhPT0gLTEgJiZcbiAgICAgICAgICAgICAgICAgICAgc3AwIDwgbmwwICYmXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlU3RyW3NwMCArIDFdID09PSAnIScpIHtcbiAgICAgICAgICAgICAgICAgICAgc3AwID0gdmFsdWVTdHIuaW5kZXhPZignICcsIHNwMCArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc3AwID09PSAtMSB8fCBubDAgPCBzcDApXG4gICAgICAgICAgICAgICAgICAgIGhhc1Byb3BzTGluZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWhhc1Byb3BzTGluZSlcbiAgICAgICAgICAgICAgICB3cyA9IGBcXG4ke2N0eC5pbmRlbnR9YDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh2YWx1ZVN0ciA9PT0gJycgfHwgdmFsdWVTdHJbMF0gPT09ICdcXG4nKSB7XG4gICAgICAgIHdzID0gJyc7XG4gICAgfVxuICAgIHN0ciArPSB3cyArIHZhbHVlU3RyO1xuICAgIGlmIChjdHguaW5GbG93KSB7XG4gICAgICAgIGlmICh2YWx1ZUNvbW1lbnREb25lICYmIG9uQ29tbWVudClcbiAgICAgICAgICAgIG9uQ29tbWVudCgpO1xuICAgIH1cbiAgICBlbHNlIGlmICh2YWx1ZUNvbW1lbnQgJiYgIXZhbHVlQ29tbWVudERvbmUpIHtcbiAgICAgICAgc3RyICs9IGxpbmVDb21tZW50KHN0ciwgY3R4LmluZGVudCwgY29tbWVudFN0cmluZyh2YWx1ZUNvbW1lbnQpKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY2hvbXBLZWVwICYmIG9uQ2hvbXBLZWVwKSB7XG4gICAgICAgIG9uQ2hvbXBLZWVwKCk7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG59XG5cbmV4cG9ydCB7IHN0cmluZ2lmeVBhaXIgfTtcbiIsICJmdW5jdGlvbiBkZWJ1Zyhsb2dMZXZlbCwgLi4ubWVzc2FnZXMpIHtcbiAgICBpZiAobG9nTGV2ZWwgPT09ICdkZWJ1ZycpXG4gICAgICAgIGNvbnNvbGUubG9nKC4uLm1lc3NhZ2VzKTtcbn1cbmZ1bmN0aW9uIHdhcm4obG9nTGV2ZWwsIHdhcm5pbmcpIHtcbiAgICBpZiAobG9nTGV2ZWwgPT09ICdkZWJ1ZycgfHwgbG9nTGV2ZWwgPT09ICd3YXJuJykge1xuICAgICAgICBjb25zb2xlLndhcm4od2FybmluZyk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBkZWJ1Zywgd2FybiB9O1xuIiwgImltcG9ydCB7IGlzU2NhbGFyLCBpc1NlcSwgaXNBbGlhcywgaXNNYXAgfSBmcm9tICcuLi8uLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9TY2FsYXIuanMnO1xuXG4vLyBJZiB0aGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIGEgbWVyZ2Uga2V5IGlzIGEgc2luZ2xlIG1hcHBpbmcgbm9kZSwgZWFjaCBvZlxuLy8gaXRzIGtleS92YWx1ZSBwYWlycyBpcyBpbnNlcnRlZCBpbnRvIHRoZSBjdXJyZW50IG1hcHBpbmcsIHVubGVzcyB0aGUga2V5XG4vLyBhbHJlYWR5IGV4aXN0cyBpbiBpdC4gSWYgdGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgbWVyZ2Uga2V5IGlzIGFcbi8vIHNlcXVlbmNlLCB0aGVuIHRoaXMgc2VxdWVuY2UgaXMgZXhwZWN0ZWQgdG8gY29udGFpbiBtYXBwaW5nIG5vZGVzIGFuZCBlYWNoXG4vLyBvZiB0aGVzZSBub2RlcyBpcyBtZXJnZWQgaW4gdHVybiBhY2NvcmRpbmcgdG8gaXRzIG9yZGVyIGluIHRoZSBzZXF1ZW5jZS5cbi8vIEtleXMgaW4gbWFwcGluZyBub2RlcyBlYXJsaWVyIGluIHRoZSBzZXF1ZW5jZSBvdmVycmlkZSBrZXlzIHNwZWNpZmllZCBpblxuLy8gbGF0ZXIgbWFwcGluZyBub2Rlcy4gLS0gaHR0cDovL3lhbWwub3JnL3R5cGUvbWVyZ2UuaHRtbFxuY29uc3QgTUVSR0VfS0VZID0gJzw8JztcbmNvbnN0IG1lcmdlID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB2YWx1ZSA9PT0gTUVSR0VfS0VZIHx8XG4gICAgICAgICh0eXBlb2YgdmFsdWUgPT09ICdzeW1ib2wnICYmIHZhbHVlLmRlc2NyaXB0aW9uID09PSBNRVJHRV9LRVkpLFxuICAgIGRlZmF1bHQ6ICdrZXknLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOm1lcmdlJyxcbiAgICB0ZXN0OiAvXjw8JC8sXG4gICAgcmVzb2x2ZTogKCkgPT4gT2JqZWN0LmFzc2lnbihuZXcgU2NhbGFyKFN5bWJvbChNRVJHRV9LRVkpKSwge1xuICAgICAgICBhZGRUb0pTTWFwOiBhZGRNZXJnZVRvSlNNYXBcbiAgICB9KSxcbiAgICBzdHJpbmdpZnk6ICgpID0+IE1FUkdFX0tFWVxufTtcbmNvbnN0IGlzTWVyZ2VLZXkgPSAoY3R4LCBrZXkpID0+IChtZXJnZS5pZGVudGlmeShrZXkpIHx8XG4gICAgKGlzU2NhbGFyKGtleSkgJiZcbiAgICAgICAgKCFrZXkudHlwZSB8fCBrZXkudHlwZSA9PT0gU2NhbGFyLlBMQUlOKSAmJlxuICAgICAgICBtZXJnZS5pZGVudGlmeShrZXkudmFsdWUpKSkgJiZcbiAgICBjdHg/LmRvYy5zY2hlbWEudGFncy5zb21lKHRhZyA9PiB0YWcudGFnID09PSBtZXJnZS50YWcgJiYgdGFnLmRlZmF1bHQpO1xuZnVuY3Rpb24gYWRkTWVyZ2VUb0pTTWFwKGN0eCwgbWFwLCB2YWx1ZSkge1xuICAgIGNvbnN0IHNvdXJjZSA9IHJlc29sdmVBbGlhc1ZhbHVlKGN0eCwgdmFsdWUpO1xuICAgIGlmIChpc1NlcShzb3VyY2UpKVxuICAgICAgICBmb3IgKGNvbnN0IGl0IG9mIHNvdXJjZS5pdGVtcylcbiAgICAgICAgICAgIG1lcmdlVmFsdWUoY3R4LCBtYXAsIGl0KTtcbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZSkpXG4gICAgICAgIGZvciAoY29uc3QgaXQgb2Ygc291cmNlKVxuICAgICAgICAgICAgbWVyZ2VWYWx1ZShjdHgsIG1hcCwgaXQpO1xuICAgIGVsc2VcbiAgICAgICAgbWVyZ2VWYWx1ZShjdHgsIG1hcCwgc291cmNlKTtcbn1cbmZ1bmN0aW9uIG1lcmdlVmFsdWUoY3R4LCBtYXAsIHZhbHVlKSB7XG4gICAgY29uc3Qgc291cmNlID0gcmVzb2x2ZUFsaWFzVmFsdWUoY3R4LCB2YWx1ZSk7XG4gICAgaWYgKCFpc01hcChzb3VyY2UpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lcmdlIHNvdXJjZXMgbXVzdCBiZSBtYXBzIG9yIG1hcCBhbGlhc2VzJyk7XG4gICAgY29uc3Qgc3JjTWFwID0gc291cmNlLnRvSlNPTihudWxsLCBjdHgsIE1hcCk7XG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2Ygc3JjTWFwKSB7XG4gICAgICAgIGlmIChtYXAgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICAgIGlmICghbWFwLmhhcyhrZXkpKVxuICAgICAgICAgICAgICAgIG1hcC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobWFwIGluc3RhbmNlb2YgU2V0KSB7XG4gICAgICAgICAgICBtYXAuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtYXAsIGtleSkpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtYXAsIGtleSwge1xuICAgICAgICAgICAgICAgIHZhbHVlLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwO1xufVxuZnVuY3Rpb24gcmVzb2x2ZUFsaWFzVmFsdWUoY3R4LCB2YWx1ZSkge1xuICAgIHJldHVybiBjdHggJiYgaXNBbGlhcyh2YWx1ZSkgPyB2YWx1ZS5yZXNvbHZlKGN0eC5kb2MsIGN0eCkgOiB2YWx1ZTtcbn1cblxuZXhwb3J0IHsgYWRkTWVyZ2VUb0pTTWFwLCBpc01lcmdlS2V5LCBtZXJnZSB9O1xuIiwgImltcG9ydCB7IHdhcm4gfSBmcm9tICcuLi9sb2cuanMnO1xuaW1wb3J0IHsgaXNNZXJnZUtleSwgYWRkTWVyZ2VUb0pTTWFwIH0gZnJvbSAnLi4vc2NoZW1hL3lhbWwtMS4xL21lcmdlLmpzJztcbmltcG9ydCB7IGNyZWF0ZVN0cmluZ2lmeUNvbnRleHQgfSBmcm9tICcuLi9zdHJpbmdpZnkvc3RyaW5naWZ5LmpzJztcbmltcG9ydCB7IGlzTm9kZSB9IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgdG9KUyB9IGZyb20gJy4vdG9KUy5qcyc7XG5cbmZ1bmN0aW9uIGFkZFBhaXJUb0pTTWFwKGN0eCwgbWFwLCB7IGtleSwgdmFsdWUgfSkge1xuICAgIGlmIChpc05vZGUoa2V5KSAmJiBrZXkuYWRkVG9KU01hcClcbiAgICAgICAga2V5LmFkZFRvSlNNYXAoY3R4LCBtYXAsIHZhbHVlKTtcbiAgICAvLyBUT0RPOiBTaG91bGQgZHJvcCB0aGlzIHNwZWNpYWwgY2FzZSBmb3IgYmFyZSA8PCBoYW5kbGluZ1xuICAgIGVsc2UgaWYgKGlzTWVyZ2VLZXkoY3R4LCBrZXkpKVxuICAgICAgICBhZGRNZXJnZVRvSlNNYXAoY3R4LCBtYXAsIHZhbHVlKTtcbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QganNLZXkgPSB0b0pTKGtleSwgJycsIGN0eCk7XG4gICAgICAgIGlmIChtYXAgaW5zdGFuY2VvZiBNYXApIHtcbiAgICAgICAgICAgIG1hcC5zZXQoanNLZXksIHRvSlModmFsdWUsIGpzS2V5LCBjdHgpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtYXAgaW5zdGFuY2VvZiBTZXQpIHtcbiAgICAgICAgICAgIG1hcC5hZGQoanNLZXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc3RyaW5nS2V5ID0gc3RyaW5naWZ5S2V5KGtleSwganNLZXksIGN0eCk7XG4gICAgICAgICAgICBjb25zdCBqc1ZhbHVlID0gdG9KUyh2YWx1ZSwgc3RyaW5nS2V5LCBjdHgpO1xuICAgICAgICAgICAgaWYgKHN0cmluZ0tleSBpbiBtYXApXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG1hcCwgc3RyaW5nS2V5LCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBqc1ZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbWFwW3N0cmluZ0tleV0gPSBqc1ZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXA7XG59XG5mdW5jdGlvbiBzdHJpbmdpZnlLZXkoa2V5LCBqc0tleSwgY3R4KSB7XG4gICAgaWYgKGpzS2V5ID09PSBudWxsKVxuICAgICAgICByZXR1cm4gJyc7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1iYXNlLXRvLXN0cmluZ1xuICAgIGlmICh0eXBlb2YganNLZXkgIT09ICdvYmplY3QnKVxuICAgICAgICByZXR1cm4gU3RyaW5nKGpzS2V5KTtcbiAgICBpZiAoaXNOb2RlKGtleSkgJiYgY3R4Py5kb2MpIHtcbiAgICAgICAgY29uc3Qgc3RyQ3R4ID0gY3JlYXRlU3RyaW5naWZ5Q29udGV4dChjdHguZG9jLCB7fSk7XG4gICAgICAgIHN0ckN0eC5hbmNob3JzID0gbmV3IFNldCgpO1xuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgY3R4LmFuY2hvcnMua2V5cygpKVxuICAgICAgICAgICAgc3RyQ3R4LmFuY2hvcnMuYWRkKG5vZGUuYW5jaG9yKTtcbiAgICAgICAgc3RyQ3R4LmluRmxvdyA9IHRydWU7XG4gICAgICAgIHN0ckN0eC5pblN0cmluZ2lmeUtleSA9IHRydWU7XG4gICAgICAgIGNvbnN0IHN0cktleSA9IGtleS50b1N0cmluZyhzdHJDdHgpO1xuICAgICAgICBpZiAoIWN0eC5tYXBLZXlXYXJuZWQpIHtcbiAgICAgICAgICAgIGxldCBqc29uU3RyID0gSlNPTi5zdHJpbmdpZnkoc3RyS2V5KTtcbiAgICAgICAgICAgIGlmIChqc29uU3RyLmxlbmd0aCA+IDQwKVxuICAgICAgICAgICAgICAgIGpzb25TdHIgPSBqc29uU3RyLnN1YnN0cmluZygwLCAzNikgKyAnLi4uXCInO1xuICAgICAgICAgICAgd2FybihjdHguZG9jLm9wdGlvbnMubG9nTGV2ZWwsIGBLZXlzIHdpdGggY29sbGVjdGlvbiB2YWx1ZXMgd2lsbCBiZSBzdHJpbmdpZmllZCBkdWUgdG8gSlMgT2JqZWN0IHJlc3RyaWN0aW9uczogJHtqc29uU3RyfS4gU2V0IG1hcEFzTWFwOiB0cnVlIHRvIHVzZSBvYmplY3Qga2V5cy5gKTtcbiAgICAgICAgICAgIGN0eC5tYXBLZXlXYXJuZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHJLZXk7XG4gICAgfVxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShqc0tleSk7XG59XG5cbmV4cG9ydCB7IGFkZFBhaXJUb0pTTWFwIH07XG4iLCAiaW1wb3J0IHsgY3JlYXRlTm9kZSB9IGZyb20gJy4uL2RvYy9jcmVhdGVOb2RlLmpzJztcbmltcG9ydCB7IHN0cmluZ2lmeVBhaXIgfSBmcm9tICcuLi9zdHJpbmdpZnkvc3RyaW5naWZ5UGFpci5qcyc7XG5pbXBvcnQgeyBhZGRQYWlyVG9KU01hcCB9IGZyb20gJy4vYWRkUGFpclRvSlNNYXAuanMnO1xuaW1wb3J0IHsgTk9ERV9UWVBFLCBQQUlSLCBpc05vZGUgfSBmcm9tICcuL2lkZW50aXR5LmpzJztcblxuZnVuY3Rpb24gY3JlYXRlUGFpcihrZXksIHZhbHVlLCBjdHgpIHtcbiAgICBjb25zdCBrID0gY3JlYXRlTm9kZShrZXksIHVuZGVmaW5lZCwgY3R4KTtcbiAgICBjb25zdCB2ID0gY3JlYXRlTm9kZSh2YWx1ZSwgdW5kZWZpbmVkLCBjdHgpO1xuICAgIHJldHVybiBuZXcgUGFpcihrLCB2KTtcbn1cbmNsYXNzIFBhaXIge1xuICAgIGNvbnN0cnVjdG9yKGtleSwgdmFsdWUgPSBudWxsKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBOT0RFX1RZUEUsIHsgdmFsdWU6IFBBSVIgfSk7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIGNsb25lKHNjaGVtYSkge1xuICAgICAgICBsZXQgeyBrZXksIHZhbHVlIH0gPSB0aGlzO1xuICAgICAgICBpZiAoaXNOb2RlKGtleSkpXG4gICAgICAgICAgICBrZXkgPSBrZXkuY2xvbmUoc2NoZW1hKTtcbiAgICAgICAgaWYgKGlzTm9kZSh2YWx1ZSkpXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmNsb25lKHNjaGVtYSk7XG4gICAgICAgIHJldHVybiBuZXcgUGFpcihrZXksIHZhbHVlKTtcbiAgICB9XG4gICAgdG9KU09OKF8sIGN0eCkge1xuICAgICAgICBjb25zdCBwYWlyID0gY3R4Py5tYXBBc01hcCA/IG5ldyBNYXAoKSA6IHt9O1xuICAgICAgICByZXR1cm4gYWRkUGFpclRvSlNNYXAoY3R4LCBwYWlyLCB0aGlzKTtcbiAgICB9XG4gICAgdG9TdHJpbmcoY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgICAgIHJldHVybiBjdHg/LmRvY1xuICAgICAgICAgICAgPyBzdHJpbmdpZnlQYWlyKHRoaXMsIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcClcbiAgICAgICAgICAgIDogSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBQYWlyLCBjcmVhdGVQYWlyIH07XG4iLCAiaW1wb3J0IHsgaXNOb2RlLCBpc1BhaXIgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBzdHJpbmdpZnkgfSBmcm9tICcuL3N0cmluZ2lmeS5qcyc7XG5pbXBvcnQgeyBsaW5lQ29tbWVudCwgaW5kZW50Q29tbWVudCB9IGZyb20gJy4vc3RyaW5naWZ5Q29tbWVudC5qcyc7XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeUNvbGxlY3Rpb24oY29sbGVjdGlvbiwgY3R4LCBvcHRpb25zKSB7XG4gICAgY29uc3QgZmxvdyA9IGN0eC5pbkZsb3cgPz8gY29sbGVjdGlvbi5mbG93O1xuICAgIGNvbnN0IHN0cmluZ2lmeSA9IGZsb3cgPyBzdHJpbmdpZnlGbG93Q29sbGVjdGlvbiA6IHN0cmluZ2lmeUJsb2NrQ29sbGVjdGlvbjtcbiAgICByZXR1cm4gc3RyaW5naWZ5KGNvbGxlY3Rpb24sIGN0eCwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBzdHJpbmdpZnlCbG9ja0NvbGxlY3Rpb24oeyBjb21tZW50LCBpdGVtcyB9LCBjdHgsIHsgYmxvY2tJdGVtUHJlZml4LCBmbG93Q2hhcnMsIGl0ZW1JbmRlbnQsIG9uQ2hvbXBLZWVwLCBvbkNvbW1lbnQgfSkge1xuICAgIGNvbnN0IHsgaW5kZW50LCBvcHRpb25zOiB7IGNvbW1lbnRTdHJpbmcgfSB9ID0gY3R4O1xuICAgIGNvbnN0IGl0ZW1DdHggPSBPYmplY3QuYXNzaWduKHt9LCBjdHgsIHsgaW5kZW50OiBpdGVtSW5kZW50LCB0eXBlOiBudWxsIH0pO1xuICAgIGxldCBjaG9tcEtlZXAgPSBmYWxzZTsgLy8gZmxhZyBmb3IgdGhlIHByZWNlZGluZyBub2RlJ3Mgc3RhdHVzXG4gICAgY29uc3QgbGluZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1tpXTtcbiAgICAgICAgbGV0IGNvbW1lbnQgPSBudWxsO1xuICAgICAgICBpZiAoaXNOb2RlKGl0ZW0pKSB7XG4gICAgICAgICAgICBpZiAoIWNob21wS2VlcCAmJiBpdGVtLnNwYWNlQmVmb3JlKVxuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goJycpO1xuICAgICAgICAgICAgYWRkQ29tbWVudEJlZm9yZShjdHgsIGxpbmVzLCBpdGVtLmNvbW1lbnRCZWZvcmUsIGNob21wS2VlcCk7XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50KVxuICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBpdGVtLmNvbW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNQYWlyKGl0ZW0pKSB7XG4gICAgICAgICAgICBjb25zdCBpayA9IGlzTm9kZShpdGVtLmtleSkgPyBpdGVtLmtleSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoaWspIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNob21wS2VlcCAmJiBpay5zcGFjZUJlZm9yZSlcbiAgICAgICAgICAgICAgICAgICAgbGluZXMucHVzaCgnJyk7XG4gICAgICAgICAgICAgICAgYWRkQ29tbWVudEJlZm9yZShjdHgsIGxpbmVzLCBpay5jb21tZW50QmVmb3JlLCBjaG9tcEtlZXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNob21wS2VlcCA9IGZhbHNlO1xuICAgICAgICBsZXQgc3RyID0gc3RyaW5naWZ5KGl0ZW0sIGl0ZW1DdHgsICgpID0+IChjb21tZW50ID0gbnVsbCksICgpID0+IChjaG9tcEtlZXAgPSB0cnVlKSk7XG4gICAgICAgIGlmIChjb21tZW50KVxuICAgICAgICAgICAgc3RyICs9IGxpbmVDb21tZW50KHN0ciwgaXRlbUluZGVudCwgY29tbWVudFN0cmluZyhjb21tZW50KSk7XG4gICAgICAgIGlmIChjaG9tcEtlZXAgJiYgY29tbWVudClcbiAgICAgICAgICAgIGNob21wS2VlcCA9IGZhbHNlO1xuICAgICAgICBsaW5lcy5wdXNoKGJsb2NrSXRlbVByZWZpeCArIHN0cik7XG4gICAgfVxuICAgIGxldCBzdHI7XG4gICAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBzdHIgPSBmbG93Q2hhcnMuc3RhcnQgKyBmbG93Q2hhcnMuZW5kO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RyID0gbGluZXNbMF07XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBsaW5lc1tpXTtcbiAgICAgICAgICAgIHN0ciArPSBsaW5lID8gYFxcbiR7aW5kZW50fSR7bGluZX1gIDogJ1xcbic7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbW1lbnQpIHtcbiAgICAgICAgc3RyICs9ICdcXG4nICsgaW5kZW50Q29tbWVudChjb21tZW50U3RyaW5nKGNvbW1lbnQpLCBpbmRlbnQpO1xuICAgICAgICBpZiAob25Db21tZW50KVxuICAgICAgICAgICAgb25Db21tZW50KCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGNob21wS2VlcCAmJiBvbkNob21wS2VlcClcbiAgICAgICAgb25DaG9tcEtlZXAoKTtcbiAgICByZXR1cm4gc3RyO1xufVxuZnVuY3Rpb24gc3RyaW5naWZ5Rmxvd0NvbGxlY3Rpb24oeyBpdGVtcyB9LCBjdHgsIHsgZmxvd0NoYXJzLCBpdGVtSW5kZW50IH0pIHtcbiAgICBjb25zdCB7IGluZGVudCwgaW5kZW50U3RlcCwgZmxvd0NvbGxlY3Rpb25QYWRkaW5nOiBmY1BhZGRpbmcsIG9wdGlvbnM6IHsgY29tbWVudFN0cmluZyB9IH0gPSBjdHg7XG4gICAgaXRlbUluZGVudCArPSBpbmRlbnRTdGVwO1xuICAgIGNvbnN0IGl0ZW1DdHggPSBPYmplY3QuYXNzaWduKHt9LCBjdHgsIHtcbiAgICAgICAgaW5kZW50OiBpdGVtSW5kZW50LFxuICAgICAgICBpbkZsb3c6IHRydWUsXG4gICAgICAgIHR5cGU6IG51bGxcbiAgICB9KTtcbiAgICBsZXQgcmVxTmV3bGluZSA9IGZhbHNlO1xuICAgIGxldCBsaW5lc0F0VmFsdWUgPSAwO1xuICAgIGNvbnN0IGxpbmVzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBpdGVtID0gaXRlbXNbaV07XG4gICAgICAgIGxldCBjb21tZW50ID0gbnVsbDtcbiAgICAgICAgaWYgKGlzTm9kZShpdGVtKSkge1xuICAgICAgICAgICAgaWYgKGl0ZW0uc3BhY2VCZWZvcmUpXG4gICAgICAgICAgICAgICAgbGluZXMucHVzaCgnJyk7XG4gICAgICAgICAgICBhZGRDb21tZW50QmVmb3JlKGN0eCwgbGluZXMsIGl0ZW0uY29tbWVudEJlZm9yZSwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudClcbiAgICAgICAgICAgICAgICBjb21tZW50ID0gaXRlbS5jb21tZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzUGFpcihpdGVtKSkge1xuICAgICAgICAgICAgY29uc3QgaWsgPSBpc05vZGUoaXRlbS5rZXkpID8gaXRlbS5rZXkgOiBudWxsO1xuICAgICAgICAgICAgaWYgKGlrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlrLnNwYWNlQmVmb3JlKVxuICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKCcnKTtcbiAgICAgICAgICAgICAgICBhZGRDb21tZW50QmVmb3JlKGN0eCwgbGluZXMsIGlrLmNvbW1lbnRCZWZvcmUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAoaWsuY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgcmVxTmV3bGluZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpdiA9IGlzTm9kZShpdGVtLnZhbHVlKSA/IGl0ZW0udmFsdWUgOiBudWxsO1xuICAgICAgICAgICAgaWYgKGl2KSB7XG4gICAgICAgICAgICAgICAgaWYgKGl2LmNvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBpdi5jb21tZW50O1xuICAgICAgICAgICAgICAgIGlmIChpdi5jb21tZW50QmVmb3JlKVxuICAgICAgICAgICAgICAgICAgICByZXFOZXdsaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGl0ZW0udmFsdWUgPT0gbnVsbCAmJiBpaz8uY29tbWVudCkge1xuICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBpay5jb21tZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjb21tZW50KVxuICAgICAgICAgICAgcmVxTmV3bGluZSA9IHRydWU7XG4gICAgICAgIGxldCBzdHIgPSBzdHJpbmdpZnkoaXRlbSwgaXRlbUN0eCwgKCkgPT4gKGNvbW1lbnQgPSBudWxsKSk7XG4gICAgICAgIHJlcU5ld2xpbmUgfHwgKHJlcU5ld2xpbmUgPSBsaW5lcy5sZW5ndGggPiBsaW5lc0F0VmFsdWUgfHwgc3RyLmluY2x1ZGVzKCdcXG4nKSk7XG4gICAgICAgIGlmIChpIDwgaXRlbXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgc3RyICs9ICcsJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjdHgub3B0aW9ucy50cmFpbGluZ0NvbW1hKSB7XG4gICAgICAgICAgICBpZiAoY3R4Lm9wdGlvbnMubGluZVdpZHRoID4gMCkge1xuICAgICAgICAgICAgICAgIHJlcU5ld2xpbmUgfHwgKHJlcU5ld2xpbmUgPSBsaW5lcy5yZWR1Y2UoKHN1bSwgbGluZSkgPT4gc3VtICsgbGluZS5sZW5ndGggKyAyLCAyKSArXG4gICAgICAgICAgICAgICAgICAgIChzdHIubGVuZ3RoICsgMikgPlxuICAgICAgICAgICAgICAgICAgICBjdHgub3B0aW9ucy5saW5lV2lkdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHJlcU5ld2xpbmUpIHtcbiAgICAgICAgICAgICAgICBzdHIgKz0gJywnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjb21tZW50KVxuICAgICAgICAgICAgc3RyICs9IGxpbmVDb21tZW50KHN0ciwgaXRlbUluZGVudCwgY29tbWVudFN0cmluZyhjb21tZW50KSk7XG4gICAgICAgIGxpbmVzLnB1c2goc3RyKTtcbiAgICAgICAgbGluZXNBdFZhbHVlID0gbGluZXMubGVuZ3RoO1xuICAgIH1cbiAgICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IGZsb3dDaGFycztcbiAgICBpZiAobGluZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBzdGFydCArIGVuZDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICghcmVxTmV3bGluZSkge1xuICAgICAgICAgICAgY29uc3QgbGVuID0gbGluZXMucmVkdWNlKChzdW0sIGxpbmUpID0+IHN1bSArIGxpbmUubGVuZ3RoICsgMiwgMik7XG4gICAgICAgICAgICByZXFOZXdsaW5lID0gY3R4Lm9wdGlvbnMubGluZVdpZHRoID4gMCAmJiBsZW4gPiBjdHgub3B0aW9ucy5saW5lV2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlcU5ld2xpbmUpIHtcbiAgICAgICAgICAgIGxldCBzdHIgPSBzdGFydDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbGluZSBvZiBsaW5lcylcbiAgICAgICAgICAgICAgICBzdHIgKz0gbGluZSA/IGBcXG4ke2luZGVudFN0ZXB9JHtpbmRlbnR9JHtsaW5lfWAgOiAnXFxuJztcbiAgICAgICAgICAgIHJldHVybiBgJHtzdHJ9XFxuJHtpbmRlbnR9JHtlbmR9YDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBgJHtzdGFydH0ke2ZjUGFkZGluZ30ke2xpbmVzLmpvaW4oJyAnKX0ke2ZjUGFkZGluZ30ke2VuZH1gO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gYWRkQ29tbWVudEJlZm9yZSh7IGluZGVudCwgb3B0aW9uczogeyBjb21tZW50U3RyaW5nIH0gfSwgbGluZXMsIGNvbW1lbnQsIGNob21wS2VlcCkge1xuICAgIGlmIChjb21tZW50ICYmIGNob21wS2VlcClcbiAgICAgICAgY29tbWVudCA9IGNvbW1lbnQucmVwbGFjZSgvXlxcbisvLCAnJyk7XG4gICAgaWYgKGNvbW1lbnQpIHtcbiAgICAgICAgY29uc3QgaWMgPSBpbmRlbnRDb21tZW50KGNvbW1lbnRTdHJpbmcoY29tbWVudCksIGluZGVudCk7XG4gICAgICAgIGxpbmVzLnB1c2goaWMudHJpbVN0YXJ0KCkpOyAvLyBBdm9pZCBkb3VibGUgaW5kZW50IG9uIGZpcnN0IGxpbmVcbiAgICB9XG59XG5cbmV4cG9ydCB7IHN0cmluZ2lmeUNvbGxlY3Rpb24gfTtcbiIsICJpbXBvcnQgeyBzdHJpbmdpZnlDb2xsZWN0aW9uIH0gZnJvbSAnLi4vc3RyaW5naWZ5L3N0cmluZ2lmeUNvbGxlY3Rpb24uanMnO1xuaW1wb3J0IHsgYWRkUGFpclRvSlNNYXAgfSBmcm9tICcuL2FkZFBhaXJUb0pTTWFwLmpzJztcbmltcG9ydCB7IENvbGxlY3Rpb24gfSBmcm9tICcuL0NvbGxlY3Rpb24uanMnO1xuaW1wb3J0IHsgTUFQLCBpc1BhaXIsIGlzU2NhbGFyIH0gZnJvbSAnLi9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBQYWlyLCBjcmVhdGVQYWlyIH0gZnJvbSAnLi9QYWlyLmpzJztcbmltcG9ydCB7IGlzU2NhbGFyVmFsdWUgfSBmcm9tICcuL1NjYWxhci5qcyc7XG5cbmZ1bmN0aW9uIGZpbmRQYWlyKGl0ZW1zLCBrZXkpIHtcbiAgICBjb25zdCBrID0gaXNTY2FsYXIoa2V5KSA/IGtleS52YWx1ZSA6IGtleTtcbiAgICBmb3IgKGNvbnN0IGl0IG9mIGl0ZW1zKSB7XG4gICAgICAgIGlmIChpc1BhaXIoaXQpKSB7XG4gICAgICAgICAgICBpZiAoaXQua2V5ID09PSBrZXkgfHwgaXQua2V5ID09PSBrKVxuICAgICAgICAgICAgICAgIHJldHVybiBpdDtcbiAgICAgICAgICAgIGlmIChpc1NjYWxhcihpdC5rZXkpICYmIGl0LmtleS52YWx1ZSA9PT0gaylcbiAgICAgICAgICAgICAgICByZXR1cm4gaXQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbmNsYXNzIFlBTUxNYXAgZXh0ZW5kcyBDb2xsZWN0aW9uIHtcbiAgICBzdGF0aWMgZ2V0IHRhZ05hbWUoKSB7XG4gICAgICAgIHJldHVybiAndGFnOnlhbWwub3JnLDIwMDI6bWFwJztcbiAgICB9XG4gICAgY29uc3RydWN0b3Ioc2NoZW1hKSB7XG4gICAgICAgIHN1cGVyKE1BUCwgc2NoZW1hKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIGdlbmVyaWMgY29sbGVjdGlvbiBwYXJzaW5nIG1ldGhvZCB0aGF0IGNhbiBiZSBleHRlbmRlZFxuICAgICAqIHRvIG90aGVyIG5vZGUgY2xhc3NlcyB0aGF0IGluaGVyaXQgZnJvbSBZQU1MTWFwXG4gICAgICovXG4gICAgc3RhdGljIGZyb20oc2NoZW1hLCBvYmosIGN0eCkge1xuICAgICAgICBjb25zdCB7IGtlZXBVbmRlZmluZWQsIHJlcGxhY2VyIH0gPSBjdHg7XG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyB0aGlzKHNjaGVtYSk7XG4gICAgICAgIGNvbnN0IGFkZCA9IChrZXksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlcGxhY2VyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIHZhbHVlID0gcmVwbGFjZXIuY2FsbChvYmosIGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyZXBsYWNlcikgJiYgIXJlcGxhY2VyLmluY2x1ZGVzKGtleSkpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgfHwga2VlcFVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaChjcmVhdGVQYWlyKGtleSwgdmFsdWUsIGN0eCkpO1xuICAgICAgICB9O1xuICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgTWFwKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBvYmopXG4gICAgICAgICAgICAgICAgYWRkKGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSlcbiAgICAgICAgICAgICAgICBhZGQoa2V5LCBvYmpba2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiBzY2hlbWEuc29ydE1hcEVudHJpZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG1hcC5pdGVtcy5zb3J0KHNjaGVtYS5zb3J0TWFwRW50cmllcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyBhIHZhbHVlIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIG92ZXJ3cml0ZSAtIElmIG5vdCBzZXQgYHRydWVgLCB1c2luZyBhIGtleSB0aGF0IGlzIGFscmVhZHkgaW4gdGhlXG4gICAgICogICBjb2xsZWN0aW9uIHdpbGwgdGhyb3cuIE90aGVyd2lzZSwgb3ZlcndyaXRlcyB0aGUgcHJldmlvdXMgdmFsdWUuXG4gICAgICovXG4gICAgYWRkKHBhaXIsIG92ZXJ3cml0ZSkge1xuICAgICAgICBsZXQgX3BhaXI7XG4gICAgICAgIGlmIChpc1BhaXIocGFpcikpXG4gICAgICAgICAgICBfcGFpciA9IHBhaXI7XG4gICAgICAgIGVsc2UgaWYgKCFwYWlyIHx8IHR5cGVvZiBwYWlyICE9PSAnb2JqZWN0JyB8fCAhKCdrZXknIGluIHBhaXIpKSB7XG4gICAgICAgICAgICAvLyBJbiBUeXBlU2NyaXB0LCB0aGlzIG5ldmVyIGhhcHBlbnMuXG4gICAgICAgICAgICBfcGFpciA9IG5ldyBQYWlyKHBhaXIsIHBhaXI/LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBfcGFpciA9IG5ldyBQYWlyKHBhaXIua2V5LCBwYWlyLnZhbHVlKTtcbiAgICAgICAgY29uc3QgcHJldiA9IGZpbmRQYWlyKHRoaXMuaXRlbXMsIF9wYWlyLmtleSk7XG4gICAgICAgIGNvbnN0IHNvcnRFbnRyaWVzID0gdGhpcy5zY2hlbWE/LnNvcnRNYXBFbnRyaWVzO1xuICAgICAgICBpZiAocHJldikge1xuICAgICAgICAgICAgaWYgKCFvdmVyd3JpdGUpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBLZXkgJHtfcGFpci5rZXl9IGFscmVhZHkgc2V0YCk7XG4gICAgICAgICAgICAvLyBGb3Igc2NhbGFycywga2VlcCB0aGUgb2xkIG5vZGUgJiBpdHMgY29tbWVudHMgYW5kIGFuY2hvcnNcbiAgICAgICAgICAgIGlmIChpc1NjYWxhcihwcmV2LnZhbHVlKSAmJiBpc1NjYWxhclZhbHVlKF9wYWlyLnZhbHVlKSlcbiAgICAgICAgICAgICAgICBwcmV2LnZhbHVlLnZhbHVlID0gX3BhaXIudmFsdWU7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcHJldi52YWx1ZSA9IF9wYWlyLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNvcnRFbnRyaWVzKSB7XG4gICAgICAgICAgICBjb25zdCBpID0gdGhpcy5pdGVtcy5maW5kSW5kZXgoaXRlbSA9PiBzb3J0RW50cmllcyhfcGFpciwgaXRlbSkgPCAwKTtcbiAgICAgICAgICAgIGlmIChpID09PSAtMSlcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2goX3BhaXIpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKGksIDAsIF9wYWlyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChfcGFpcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZGVsZXRlKGtleSkge1xuICAgICAgICBjb25zdCBpdCA9IGZpbmRQYWlyKHRoaXMuaXRlbXMsIGtleSk7XG4gICAgICAgIGlmICghaXQpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IGRlbCA9IHRoaXMuaXRlbXMuc3BsaWNlKHRoaXMuaXRlbXMuaW5kZXhPZihpdCksIDEpO1xuICAgICAgICByZXR1cm4gZGVsLmxlbmd0aCA+IDA7XG4gICAgfVxuICAgIGdldChrZXksIGtlZXBTY2FsYXIpIHtcbiAgICAgICAgY29uc3QgaXQgPSBmaW5kUGFpcih0aGlzLml0ZW1zLCBrZXkpO1xuICAgICAgICBjb25zdCBub2RlID0gaXQ/LnZhbHVlO1xuICAgICAgICByZXR1cm4gKCFrZWVwU2NhbGFyICYmIGlzU2NhbGFyKG5vZGUpID8gbm9kZS52YWx1ZSA6IG5vZGUpID8/IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gISFmaW5kUGFpcih0aGlzLml0ZW1zLCBrZXkpO1xuICAgIH1cbiAgICBzZXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLmFkZChuZXcgUGFpcihrZXksIHZhbHVlKSwgdHJ1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjdHggLSBDb252ZXJzaW9uIGNvbnRleHQsIG9yaWdpbmFsbHkgc2V0IGluIERvY3VtZW50I3RvSlMoKVxuICAgICAqIEBwYXJhbSB7Q2xhc3N9IFR5cGUgLSBJZiBzZXQsIGZvcmNlcyB0aGUgcmV0dXJuZWQgY29sbGVjdGlvbiB0eXBlXG4gICAgICogQHJldHVybnMgSW5zdGFuY2Ugb2YgVHlwZSwgTWFwLCBvciBPYmplY3RcbiAgICAgKi9cbiAgICB0b0pTT04oXywgY3R4LCBUeXBlKSB7XG4gICAgICAgIGNvbnN0IG1hcCA9IFR5cGUgPyBuZXcgVHlwZSgpIDogY3R4Py5tYXBBc01hcCA/IG5ldyBNYXAoKSA6IHt9O1xuICAgICAgICBpZiAoY3R4Py5vbkNyZWF0ZSlcbiAgICAgICAgICAgIGN0eC5vbkNyZWF0ZShtYXApO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVtcylcbiAgICAgICAgICAgIGFkZFBhaXJUb0pTTWFwKGN0eCwgbWFwLCBpdGVtKTtcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG4gICAgdG9TdHJpbmcoY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKSB7XG4gICAgICAgIGlmICghY3R4KVxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVtcykge1xuICAgICAgICAgICAgaWYgKCFpc1BhaXIoaXRlbSkpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXAgaXRlbXMgbXVzdCBhbGwgYmUgcGFpcnM7IGZvdW5kICR7SlNPTi5zdHJpbmdpZnkoaXRlbSl9IGluc3RlYWRgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWN0eC5hbGxOdWxsVmFsdWVzICYmIHRoaXMuaGFzQWxsTnVsbFZhbHVlcyhmYWxzZSkpXG4gICAgICAgICAgICBjdHggPSBPYmplY3QuYXNzaWduKHt9LCBjdHgsIHsgYWxsTnVsbFZhbHVlczogdHJ1ZSB9KTtcbiAgICAgICAgcmV0dXJuIHN0cmluZ2lmeUNvbGxlY3Rpb24odGhpcywgY3R4LCB7XG4gICAgICAgICAgICBibG9ja0l0ZW1QcmVmaXg6ICcnLFxuICAgICAgICAgICAgZmxvd0NoYXJzOiB7IHN0YXJ0OiAneycsIGVuZDogJ30nIH0sXG4gICAgICAgICAgICBpdGVtSW5kZW50OiBjdHguaW5kZW50IHx8ICcnLFxuICAgICAgICAgICAgb25DaG9tcEtlZXAsXG4gICAgICAgICAgICBvbkNvbW1lbnRcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBZQU1MTWFwLCBmaW5kUGFpciB9O1xuIiwgImltcG9ydCB7IGlzTWFwIH0gZnJvbSAnLi4vLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgWUFNTE1hcCB9IGZyb20gJy4uLy4uL25vZGVzL1lBTUxNYXAuanMnO1xuXG5jb25zdCBtYXAgPSB7XG4gICAgY29sbGVjdGlvbjogJ21hcCcsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBub2RlQ2xhc3M6IFlBTUxNYXAsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6bWFwJyxcbiAgICByZXNvbHZlKG1hcCwgb25FcnJvcikge1xuICAgICAgICBpZiAoIWlzTWFwKG1hcCkpXG4gICAgICAgICAgICBvbkVycm9yKCdFeHBlY3RlZCBhIG1hcHBpbmcgZm9yIHRoaXMgdGFnJyk7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfSxcbiAgICBjcmVhdGVOb2RlOiAoc2NoZW1hLCBvYmosIGN0eCkgPT4gWUFNTE1hcC5mcm9tKHNjaGVtYSwgb2JqLCBjdHgpXG59O1xuXG5leHBvcnQgeyBtYXAgfTtcbiIsICJpbXBvcnQgeyBjcmVhdGVOb2RlIH0gZnJvbSAnLi4vZG9jL2NyZWF0ZU5vZGUuanMnO1xuaW1wb3J0IHsgc3RyaW5naWZ5Q29sbGVjdGlvbiB9IGZyb20gJy4uL3N0cmluZ2lmeS9zdHJpbmdpZnlDb2xsZWN0aW9uLmpzJztcbmltcG9ydCB7IENvbGxlY3Rpb24gfSBmcm9tICcuL0NvbGxlY3Rpb24uanMnO1xuaW1wb3J0IHsgU0VRLCBpc1NjYWxhciB9IGZyb20gJy4vaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgaXNTY2FsYXJWYWx1ZSB9IGZyb20gJy4vU2NhbGFyLmpzJztcbmltcG9ydCB7IHRvSlMgfSBmcm9tICcuL3RvSlMuanMnO1xuXG5jbGFzcyBZQU1MU2VxIGV4dGVuZHMgQ29sbGVjdGlvbiB7XG4gICAgc3RhdGljIGdldCB0YWdOYW1lKCkge1xuICAgICAgICByZXR1cm4gJ3RhZzp5YW1sLm9yZywyMDAyOnNlcSc7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKHNjaGVtYSkge1xuICAgICAgICBzdXBlcihTRVEsIHNjaGVtYSk7XG4gICAgICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB9XG4gICAgYWRkKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuaXRlbXMucHVzaCh2YWx1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYSB2YWx1ZSBmcm9tIHRoZSBjb2xsZWN0aW9uLlxuICAgICAqXG4gICAgICogYGtleWAgbXVzdCBjb250YWluIGEgcmVwcmVzZW50YXRpb24gb2YgYW4gaW50ZWdlciBmb3IgdGhpcyB0byBzdWNjZWVkLlxuICAgICAqIEl0IG1heSBiZSB3cmFwcGVkIGluIGEgYFNjYWxhcmAuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGl0ZW0gd2FzIGZvdW5kIGFuZCByZW1vdmVkLlxuICAgICAqL1xuICAgIGRlbGV0ZShrZXkpIHtcbiAgICAgICAgY29uc3QgaWR4ID0gYXNJdGVtSW5kZXgoa2V5KTtcbiAgICAgICAgaWYgKHR5cGVvZiBpZHggIT09ICdudW1iZXInKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCBkZWwgPSB0aGlzLml0ZW1zLnNwbGljZShpZHgsIDEpO1xuICAgICAgICByZXR1cm4gZGVsLmxlbmd0aCA+IDA7XG4gICAgfVxuICAgIGdldChrZXksIGtlZXBTY2FsYXIpIHtcbiAgICAgICAgY29uc3QgaWR4ID0gYXNJdGVtSW5kZXgoa2V5KTtcbiAgICAgICAgaWYgKHR5cGVvZiBpZHggIT09ICdudW1iZXInKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgaXQgPSB0aGlzLml0ZW1zW2lkeF07XG4gICAgICAgIHJldHVybiAha2VlcFNjYWxhciAmJiBpc1NjYWxhcihpdCkgPyBpdC52YWx1ZSA6IGl0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGNvbGxlY3Rpb24gaW5jbHVkZXMgYSB2YWx1ZSB3aXRoIHRoZSBrZXkgYGtleWAuXG4gICAgICpcbiAgICAgKiBga2V5YCBtdXN0IGNvbnRhaW4gYSByZXByZXNlbnRhdGlvbiBvZiBhbiBpbnRlZ2VyIGZvciB0aGlzIHRvIHN1Y2NlZWQuXG4gICAgICogSXQgbWF5IGJlIHdyYXBwZWQgaW4gYSBgU2NhbGFyYC5cbiAgICAgKi9cbiAgICBoYXMoa2V5KSB7XG4gICAgICAgIGNvbnN0IGlkeCA9IGFzSXRlbUluZGV4KGtleSk7XG4gICAgICAgIHJldHVybiB0eXBlb2YgaWR4ID09PSAnbnVtYmVyJyAmJiBpZHggPCB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIHZhbHVlIGluIHRoaXMgY29sbGVjdGlvbi4gRm9yIGAhIXNldGAsIGB2YWx1ZWAgbmVlZHMgdG8gYmUgYVxuICAgICAqIGJvb2xlYW4gdG8gYWRkL3JlbW92ZSB0aGUgaXRlbSBmcm9tIHRoZSBzZXQuXG4gICAgICpcbiAgICAgKiBJZiBga2V5YCBkb2VzIG5vdCBjb250YWluIGEgcmVwcmVzZW50YXRpb24gb2YgYW4gaW50ZWdlciwgdGhpcyB3aWxsIHRocm93LlxuICAgICAqIEl0IG1heSBiZSB3cmFwcGVkIGluIGEgYFNjYWxhcmAuXG4gICAgICovXG4gICAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgY29uc3QgaWR4ID0gYXNJdGVtSW5kZXgoa2V5KTtcbiAgICAgICAgaWYgKHR5cGVvZiBpZHggIT09ICdudW1iZXInKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhIHZhbGlkIGluZGV4LCBub3QgJHtrZXl9LmApO1xuICAgICAgICBjb25zdCBwcmV2ID0gdGhpcy5pdGVtc1tpZHhdO1xuICAgICAgICBpZiAoaXNTY2FsYXIocHJldikgJiYgaXNTY2FsYXJWYWx1ZSh2YWx1ZSkpXG4gICAgICAgICAgICBwcmV2LnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuaXRlbXNbaWR4XSA9IHZhbHVlO1xuICAgIH1cbiAgICB0b0pTT04oXywgY3R4KSB7XG4gICAgICAgIGNvbnN0IHNlcSA9IFtdO1xuICAgICAgICBpZiAoY3R4Py5vbkNyZWF0ZSlcbiAgICAgICAgICAgIGN0eC5vbkNyZWF0ZShzZXEpO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZW1zKVxuICAgICAgICAgICAgc2VxLnB1c2godG9KUyhpdGVtLCBTdHJpbmcoaSsrKSwgY3R4KSk7XG4gICAgICAgIHJldHVybiBzZXE7XG4gICAgfVxuICAgIHRvU3RyaW5nKGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCkge1xuICAgICAgICBpZiAoIWN0eClcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHN0cmluZ2lmeUNvbGxlY3Rpb24odGhpcywgY3R4LCB7XG4gICAgICAgICAgICBibG9ja0l0ZW1QcmVmaXg6ICctICcsXG4gICAgICAgICAgICBmbG93Q2hhcnM6IHsgc3RhcnQ6ICdbJywgZW5kOiAnXScgfSxcbiAgICAgICAgICAgIGl0ZW1JbmRlbnQ6IChjdHguaW5kZW50IHx8ICcnKSArICcgICcsXG4gICAgICAgICAgICBvbkNob21wS2VlcCxcbiAgICAgICAgICAgIG9uQ29tbWVudFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3RhdGljIGZyb20oc2NoZW1hLCBvYmosIGN0eCkge1xuICAgICAgICBjb25zdCB7IHJlcGxhY2VyIH0gPSBjdHg7XG4gICAgICAgIGNvbnN0IHNlcSA9IG5ldyB0aGlzKHNjaGVtYSk7XG4gICAgICAgIGlmIChvYmogJiYgU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChvYmopKSB7XG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBpdCBvZiBvYmopIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcGxhY2VyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IG9iaiBpbnN0YW5jZW9mIFNldCA/IGl0IDogU3RyaW5nKGkrKyk7XG4gICAgICAgICAgICAgICAgICAgIGl0ID0gcmVwbGFjZXIuY2FsbChvYmosIGtleSwgaXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXEuaXRlbXMucHVzaChjcmVhdGVOb2RlKGl0LCB1bmRlZmluZWQsIGN0eCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXE7XG4gICAgfVxufVxuZnVuY3Rpb24gYXNJdGVtSW5kZXgoa2V5KSB7XG4gICAgbGV0IGlkeCA9IGlzU2NhbGFyKGtleSkgPyBrZXkudmFsdWUgOiBrZXk7XG4gICAgaWYgKGlkeCAmJiB0eXBlb2YgaWR4ID09PSAnc3RyaW5nJylcbiAgICAgICAgaWR4ID0gTnVtYmVyKGlkeCk7XG4gICAgcmV0dXJuIHR5cGVvZiBpZHggPT09ICdudW1iZXInICYmIE51bWJlci5pc0ludGVnZXIoaWR4KSAmJiBpZHggPj0gMFxuICAgICAgICA/IGlkeFxuICAgICAgICA6IG51bGw7XG59XG5cbmV4cG9ydCB7IFlBTUxTZXEgfTtcbiIsICJpbXBvcnQgeyBpc1NlcSB9IGZyb20gJy4uLy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IFlBTUxTZXEgfSBmcm9tICcuLi8uLi9ub2Rlcy9ZQU1MU2VxLmpzJztcblxuY29uc3Qgc2VxID0ge1xuICAgIGNvbGxlY3Rpb246ICdzZXEnLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgbm9kZUNsYXNzOiBZQU1MU2VxLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOnNlcScsXG4gICAgcmVzb2x2ZShzZXEsIG9uRXJyb3IpIHtcbiAgICAgICAgaWYgKCFpc1NlcShzZXEpKVxuICAgICAgICAgICAgb25FcnJvcignRXhwZWN0ZWQgYSBzZXF1ZW5jZSBmb3IgdGhpcyB0YWcnKTtcbiAgICAgICAgcmV0dXJuIHNlcTtcbiAgICB9LFxuICAgIGNyZWF0ZU5vZGU6IChzY2hlbWEsIG9iaiwgY3R4KSA9PiBZQU1MU2VxLmZyb20oc2NoZW1hLCBvYmosIGN0eClcbn07XG5cbmV4cG9ydCB7IHNlcSB9O1xuIiwgImltcG9ydCB7IHN0cmluZ2lmeVN0cmluZyB9IGZyb20gJy4uLy4uL3N0cmluZ2lmeS9zdHJpbmdpZnlTdHJpbmcuanMnO1xuXG5jb25zdCBzdHJpbmcgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpzdHInLFxuICAgIHJlc29sdmU6IHN0ciA9PiBzdHIsXG4gICAgc3RyaW5naWZ5KGl0ZW0sIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCkge1xuICAgICAgICBjdHggPSBPYmplY3QuYXNzaWduKHsgYWN0dWFsU3RyaW5nOiB0cnVlIH0sIGN0eCk7XG4gICAgICAgIHJldHVybiBzdHJpbmdpZnlTdHJpbmcoaXRlbSwgY3R4LCBvbkNvbW1lbnQsIG9uQ2hvbXBLZWVwKTtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBzdHJpbmcgfTtcbiIsICJpbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9TY2FsYXIuanMnO1xuXG5jb25zdCBudWxsVGFnID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB2YWx1ZSA9PSBudWxsLFxuICAgIGNyZWF0ZU5vZGU6ICgpID0+IG5ldyBTY2FsYXIobnVsbCksXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpudWxsJyxcbiAgICB0ZXN0OiAvXig/On58W05uXXVsbHxOVUxMKT8kLyxcbiAgICByZXNvbHZlOiAoKSA9PiBuZXcgU2NhbGFyKG51bGwpLFxuICAgIHN0cmluZ2lmeTogKHsgc291cmNlIH0sIGN0eCkgPT4gdHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycgJiYgbnVsbFRhZy50ZXN0LnRlc3Qoc291cmNlKVxuICAgICAgICA/IHNvdXJjZVxuICAgICAgICA6IGN0eC5vcHRpb25zLm51bGxTdHJcbn07XG5cbmV4cG9ydCB7IG51bGxUYWcgfTtcbiIsICJpbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9TY2FsYXIuanMnO1xuXG5jb25zdCBib29sVGFnID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmJvb2wnLFxuICAgIHRlc3Q6IC9eKD86W1R0XXJ1ZXxUUlVFfFtGZl1hbHNlfEZBTFNFKSQvLFxuICAgIHJlc29sdmU6IHN0ciA9PiBuZXcgU2NhbGFyKHN0clswXSA9PT0gJ3QnIHx8IHN0clswXSA9PT0gJ1QnKSxcbiAgICBzdHJpbmdpZnkoeyBzb3VyY2UsIHZhbHVlIH0sIGN0eCkge1xuICAgICAgICBpZiAoc291cmNlICYmIGJvb2xUYWcudGVzdC50ZXN0KHNvdXJjZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHN2ID0gc291cmNlWzBdID09PSAndCcgfHwgc291cmNlWzBdID09PSAnVCc7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHN2KVxuICAgICAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlID8gY3R4Lm9wdGlvbnMudHJ1ZVN0ciA6IGN0eC5vcHRpb25zLmZhbHNlU3RyO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IGJvb2xUYWcgfTtcbiIsICJmdW5jdGlvbiBzdHJpbmdpZnlOdW1iZXIoeyBmb3JtYXQsIG1pbkZyYWN0aW9uRGlnaXRzLCB0YWcsIHZhbHVlIH0pIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnYmlnaW50JylcbiAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgY29uc3QgbnVtID0gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogTnVtYmVyKHZhbHVlKTtcbiAgICBpZiAoIWlzRmluaXRlKG51bSkpXG4gICAgICAgIHJldHVybiBpc05hTihudW0pID8gJy5uYW4nIDogbnVtIDwgMCA/ICctLmluZicgOiAnLmluZic7XG4gICAgbGV0IG4gPSBPYmplY3QuaXModmFsdWUsIC0wKSA/ICctMCcgOiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgaWYgKCFmb3JtYXQgJiZcbiAgICAgICAgbWluRnJhY3Rpb25EaWdpdHMgJiZcbiAgICAgICAgKCF0YWcgfHwgdGFnID09PSAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnKSAmJlxuICAgICAgICAvXi0/XFxkLy50ZXN0KG4pICYmXG4gICAgICAgICFuLmluY2x1ZGVzKCdlJykpIHtcbiAgICAgICAgbGV0IGkgPSBuLmluZGV4T2YoJy4nKTtcbiAgICAgICAgaWYgKGkgPCAwKSB7XG4gICAgICAgICAgICBpID0gbi5sZW5ndGg7XG4gICAgICAgICAgICBuICs9ICcuJztcbiAgICAgICAgfVxuICAgICAgICBsZXQgZCA9IG1pbkZyYWN0aW9uRGlnaXRzIC0gKG4ubGVuZ3RoIC0gaSAtIDEpO1xuICAgICAgICB3aGlsZSAoZC0tID4gMClcbiAgICAgICAgICAgIG4gKz0gJzAnO1xuICAgIH1cbiAgICByZXR1cm4gbjtcbn1cblxuZXhwb3J0IHsgc3RyaW5naWZ5TnVtYmVyIH07XG4iLCAiaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vLi4vbm9kZXMvU2NhbGFyLmpzJztcbmltcG9ydCB7IHN0cmluZ2lmeU51bWJlciB9IGZyb20gJy4uLy4uL3N0cmluZ2lmeS9zdHJpbmdpZnlOdW1iZXIuanMnO1xuXG5jb25zdCBmbG9hdE5hTiA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0JyxcbiAgICB0ZXN0OiAvXig/OlstK10/XFwuKD86aW5mfEluZnxJTkYpfFxcLm5hbnxcXC5OYU58XFwuTkFOKSQvLFxuICAgIHJlc29sdmU6IHN0ciA9PiBzdHIuc2xpY2UoLTMpLnRvTG93ZXJDYXNlKCkgPT09ICduYW4nXG4gICAgICAgID8gTmFOXG4gICAgICAgIDogc3RyWzBdID09PSAnLSdcbiAgICAgICAgICAgID8gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZXG4gICAgICAgICAgICA6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeU51bWJlclxufTtcbmNvbnN0IGZsb2F0RXhwID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnLFxuICAgIGZvcm1hdDogJ0VYUCcsXG4gICAgdGVzdDogL15bLStdPyg/OlxcLlswLTldK3xbMC05XSsoPzpcXC5bMC05XSopPylbZUVdWy0rXT9bMC05XSskLyxcbiAgICByZXNvbHZlOiBzdHIgPT4gcGFyc2VGbG9hdChzdHIpLFxuICAgIHN0cmluZ2lmeShub2RlKSB7XG4gICAgICAgIGNvbnN0IG51bSA9IE51bWJlcihub2RlLnZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGlzRmluaXRlKG51bSkgPyBudW0udG9FeHBvbmVudGlhbCgpIDogc3RyaW5naWZ5TnVtYmVyKG5vZGUpO1xuICAgIH1cbn07XG5jb25zdCBmbG9hdCA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0JyxcbiAgICB0ZXN0OiAvXlstK10/KD86XFwuWzAtOV0rfFswLTldK1xcLlswLTldKikkLyxcbiAgICByZXNvbHZlKHN0cikge1xuICAgICAgICBjb25zdCBub2RlID0gbmV3IFNjYWxhcihwYXJzZUZsb2F0KHN0cikpO1xuICAgICAgICBjb25zdCBkb3QgPSBzdHIuaW5kZXhPZignLicpO1xuICAgICAgICBpZiAoZG90ICE9PSAtMSAmJiBzdHJbc3RyLmxlbmd0aCAtIDFdID09PSAnMCcpXG4gICAgICAgICAgICBub2RlLm1pbkZyYWN0aW9uRGlnaXRzID0gc3RyLmxlbmd0aCAtIGRvdCAtIDE7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH0sXG4gICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlOdW1iZXJcbn07XG5cbmV4cG9ydCB7IGZsb2F0LCBmbG9hdEV4cCwgZmxvYXROYU4gfTtcbiIsICJpbXBvcnQgeyBzdHJpbmdpZnlOdW1iZXIgfSBmcm9tICcuLi8uLi9zdHJpbmdpZnkvc3RyaW5naWZ5TnVtYmVyLmpzJztcblxuY29uc3QgaW50SWRlbnRpZnkgPSAodmFsdWUpID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ2JpZ2ludCcgfHwgTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSk7XG5jb25zdCBpbnRSZXNvbHZlID0gKHN0ciwgb2Zmc2V0LCByYWRpeCwgeyBpbnRBc0JpZ0ludCB9KSA9PiAoaW50QXNCaWdJbnQgPyBCaWdJbnQoc3RyKSA6IHBhcnNlSW50KHN0ci5zdWJzdHJpbmcob2Zmc2V0KSwgcmFkaXgpKTtcbmZ1bmN0aW9uIGludFN0cmluZ2lmeShub2RlLCByYWRpeCwgcHJlZml4KSB7XG4gICAgY29uc3QgeyB2YWx1ZSB9ID0gbm9kZTtcbiAgICBpZiAoaW50SWRlbnRpZnkodmFsdWUpICYmIHZhbHVlID49IDApXG4gICAgICAgIHJldHVybiBwcmVmaXggKyB2YWx1ZS50b1N0cmluZyhyYWRpeCk7XG4gICAgcmV0dXJuIHN0cmluZ2lmeU51bWJlcihub2RlKTtcbn1cbmNvbnN0IGludE9jdCA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gaW50SWRlbnRpZnkodmFsdWUpICYmIHZhbHVlID49IDAsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjppbnQnLFxuICAgIGZvcm1hdDogJ09DVCcsXG4gICAgdGVzdDogL14wb1swLTddKyQvLFxuICAgIHJlc29sdmU6IChzdHIsIF9vbkVycm9yLCBvcHQpID0+IGludFJlc29sdmUoc3RyLCAyLCA4LCBvcHQpLFxuICAgIHN0cmluZ2lmeTogbm9kZSA9PiBpbnRTdHJpbmdpZnkobm9kZSwgOCwgJzBvJylcbn07XG5jb25zdCBpbnQgPSB7XG4gICAgaWRlbnRpZnk6IGludElkZW50aWZ5LFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6aW50JyxcbiAgICB0ZXN0OiAvXlstK10/WzAtOV0rJC8sXG4gICAgcmVzb2x2ZTogKHN0ciwgX29uRXJyb3IsIG9wdCkgPT4gaW50UmVzb2x2ZShzdHIsIDAsIDEwLCBvcHQpLFxuICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5TnVtYmVyXG59O1xuY29uc3QgaW50SGV4ID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiBpbnRJZGVudGlmeSh2YWx1ZSkgJiYgdmFsdWUgPj0gMCxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmludCcsXG4gICAgZm9ybWF0OiAnSEVYJyxcbiAgICB0ZXN0OiAvXjB4WzAtOWEtZkEtRl0rJC8sXG4gICAgcmVzb2x2ZTogKHN0ciwgX29uRXJyb3IsIG9wdCkgPT4gaW50UmVzb2x2ZShzdHIsIDIsIDE2LCBvcHQpLFxuICAgIHN0cmluZ2lmeTogbm9kZSA9PiBpbnRTdHJpbmdpZnkobm9kZSwgMTYsICcweCcpXG59O1xuXG5leHBvcnQgeyBpbnQsIGludEhleCwgaW50T2N0IH07XG4iLCAiaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vY29tbW9uL21hcC5qcyc7XG5pbXBvcnQgeyBudWxsVGFnIH0gZnJvbSAnLi4vY29tbW9uL251bGwuanMnO1xuaW1wb3J0IHsgc2VxIH0gZnJvbSAnLi4vY29tbW9uL3NlcS5qcyc7XG5pbXBvcnQgeyBzdHJpbmcgfSBmcm9tICcuLi9jb21tb24vc3RyaW5nLmpzJztcbmltcG9ydCB7IGJvb2xUYWcgfSBmcm9tICcuL2Jvb2wuanMnO1xuaW1wb3J0IHsgZmxvYXROYU4sIGZsb2F0RXhwLCBmbG9hdCB9IGZyb20gJy4vZmxvYXQuanMnO1xuaW1wb3J0IHsgaW50T2N0LCBpbnQsIGludEhleCB9IGZyb20gJy4vaW50LmpzJztcblxuY29uc3Qgc2NoZW1hID0gW1xuICAgIG1hcCxcbiAgICBzZXEsXG4gICAgc3RyaW5nLFxuICAgIG51bGxUYWcsXG4gICAgYm9vbFRhZyxcbiAgICBpbnRPY3QsXG4gICAgaW50LFxuICAgIGludEhleCxcbiAgICBmbG9hdE5hTixcbiAgICBmbG9hdEV4cCxcbiAgICBmbG9hdFxuXTtcblxuZXhwb3J0IHsgc2NoZW1hIH07XG4iLCAiaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vLi4vbm9kZXMvU2NhbGFyLmpzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL2NvbW1vbi9tYXAuanMnO1xuaW1wb3J0IHsgc2VxIH0gZnJvbSAnLi4vY29tbW9uL3NlcS5qcyc7XG5cbmZ1bmN0aW9uIGludElkZW50aWZ5KHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2JpZ2ludCcgfHwgTnVtYmVyLmlzSW50ZWdlcih2YWx1ZSk7XG59XG5jb25zdCBzdHJpbmdpZnlKU09OID0gKHsgdmFsdWUgfSkgPT4gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuY29uc3QganNvblNjYWxhcnMgPSBbXG4gICAge1xuICAgICAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyxcbiAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6c3RyJyxcbiAgICAgICAgcmVzb2x2ZTogc3RyID0+IHN0cixcbiAgICAgICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlKU09OXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB2YWx1ZSA9PSBudWxsLFxuICAgICAgICBjcmVhdGVOb2RlOiAoKSA9PiBuZXcgU2NhbGFyKG51bGwpLFxuICAgICAgICBkZWZhdWx0OiB0cnVlLFxuICAgICAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpudWxsJyxcbiAgICAgICAgdGVzdDogL15udWxsJC8sXG4gICAgICAgIHJlc29sdmU6ICgpID0+IG51bGwsXG4gICAgICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5SlNPTlxuICAgIH0sXG4gICAge1xuICAgICAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicsXG4gICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmJvb2wnLFxuICAgICAgICB0ZXN0OiAvXnRydWUkfF5mYWxzZSQvLFxuICAgICAgICByZXNvbHZlOiBzdHIgPT4gc3RyID09PSAndHJ1ZScsXG4gICAgICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5SlNPTlxuICAgIH0sXG4gICAge1xuICAgICAgICBpZGVudGlmeTogaW50SWRlbnRpZnksXG4gICAgICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmludCcsXG4gICAgICAgIHRlc3Q6IC9eLT8oPzowfFsxLTldWzAtOV0qKSQvLFxuICAgICAgICByZXNvbHZlOiAoc3RyLCBfb25FcnJvciwgeyBpbnRBc0JpZ0ludCB9KSA9PiBpbnRBc0JpZ0ludCA/IEJpZ0ludChzdHIpIDogcGFyc2VJbnQoc3RyLCAxMCksXG4gICAgICAgIHN0cmluZ2lmeTogKHsgdmFsdWUgfSkgPT4gaW50SWRlbnRpZnkodmFsdWUpID8gdmFsdWUudG9TdHJpbmcoKSA6IEpTT04uc3RyaW5naWZ5KHZhbHVlKVxuICAgIH0sXG4gICAge1xuICAgICAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyxcbiAgICAgICAgZGVmYXVsdDogdHJ1ZSxcbiAgICAgICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnLFxuICAgICAgICB0ZXN0OiAvXi0/KD86MHxbMS05XVswLTldKikoPzpcXC5bMC05XSopPyg/OltlRV1bLStdP1swLTldKyk/JC8sXG4gICAgICAgIHJlc29sdmU6IHN0ciA9PiBwYXJzZUZsb2F0KHN0ciksXG4gICAgICAgIHN0cmluZ2lmeTogc3RyaW5naWZ5SlNPTlxuICAgIH1cbl07XG5jb25zdCBqc29uRXJyb3IgPSB7XG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICcnLFxuICAgIHRlc3Q6IC9eLyxcbiAgICByZXNvbHZlKHN0ciwgb25FcnJvcikge1xuICAgICAgICBvbkVycm9yKGBVbnJlc29sdmVkIHBsYWluIHNjYWxhciAke0pTT04uc3RyaW5naWZ5KHN0cil9YCk7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfVxufTtcbmNvbnN0IHNjaGVtYSA9IFttYXAsIHNlcV0uY29uY2F0KGpzb25TY2FsYXJzLCBqc29uRXJyb3IpO1xuXG5leHBvcnQgeyBzY2hlbWEgfTtcbiIsICJpbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9TY2FsYXIuanMnO1xuaW1wb3J0IHsgc3RyaW5naWZ5U3RyaW5nIH0gZnJvbSAnLi4vLi4vc3RyaW5naWZ5L3N0cmluZ2lmeVN0cmluZy5qcyc7XG5cbmNvbnN0IGJpbmFyeSA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdmFsdWUgaW5zdGFuY2VvZiBVaW50OEFycmF5LCAvLyBCdWZmZXIgaW5oZXJpdHMgZnJvbSBVaW50OEFycmF5XG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6YmluYXJ5JyxcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgQnVmZmVyIGluIG5vZGUgYW5kIGFuIFVpbnQ4QXJyYXkgaW4gYnJvd3NlcnNcbiAgICAgKlxuICAgICAqIFRvIHVzZSB0aGUgcmVzdWx0aW5nIGJ1ZmZlciBhcyBhbiBpbWFnZSwgeW91J2xsIHdhbnQgdG8gZG8gc29tZXRoaW5nIGxpa2U6XG4gICAgICpcbiAgICAgKiAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihbYnVmZmVyXSwgeyB0eXBlOiAnaW1hZ2UvanBlZycgfSlcbiAgICAgKiAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwaG90bycpLnNyYyA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYilcbiAgICAgKi9cbiAgICByZXNvbHZlKHNyYywgb25FcnJvcikge1xuICAgICAgICBpZiAodHlwZW9mIGF0b2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIE9uIElFIDExLCBhdG9iKCkgY2FuJ3QgaGFuZGxlIG5ld2xpbmVzXG4gICAgICAgICAgICBjb25zdCBzdHIgPSBhdG9iKHNyYy5yZXBsYWNlKC9bXFxuXFxyXS9nLCAnJykpO1xuICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoc3RyLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICBidWZmZXJbaV0gPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvbkVycm9yKCdUaGlzIGVudmlyb25tZW50IGRvZXMgbm90IHN1cHBvcnQgcmVhZGluZyBiaW5hcnkgdGFnczsgZWl0aGVyIEJ1ZmZlciBvciBhdG9iIGlzIHJlcXVpcmVkJyk7XG4gICAgICAgICAgICByZXR1cm4gc3JjO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzdHJpbmdpZnkoeyBjb21tZW50LCB0eXBlLCB2YWx1ZSB9LCBjdHgsIG9uQ29tbWVudCwgb25DaG9tcEtlZXApIHtcbiAgICAgICAgaWYgKCF2YWx1ZSlcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgY29uc3QgYnVmID0gdmFsdWU7IC8vIGNoZWNrZWQgZWFybGllciBieSBiaW5hcnkuaWRlbnRpZnkoKVxuICAgICAgICBsZXQgc3RyO1xuICAgICAgICBpZiAodHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGxldCBzID0gJyc7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1Zi5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICBzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKTtcbiAgICAgICAgICAgIHN0ciA9IGJ0b2Eocyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgZW52aXJvbm1lbnQgZG9lcyBub3Qgc3VwcG9ydCB3cml0aW5nIGJpbmFyeSB0YWdzOyBlaXRoZXIgQnVmZmVyIG9yIGJ0b2EgaXMgcmVxdWlyZWQnKTtcbiAgICAgICAgfVxuICAgICAgICB0eXBlID8/ICh0eXBlID0gU2NhbGFyLkJMT0NLX0xJVEVSQUwpO1xuICAgICAgICBpZiAodHlwZSAhPT0gU2NhbGFyLlFVT1RFX0RPVUJMRSkge1xuICAgICAgICAgICAgY29uc3QgbGluZVdpZHRoID0gTWF0aC5tYXgoY3R4Lm9wdGlvbnMubGluZVdpZHRoIC0gY3R4LmluZGVudC5sZW5ndGgsIGN0eC5vcHRpb25zLm1pbkNvbnRlbnRXaWR0aCk7XG4gICAgICAgICAgICBjb25zdCBuID0gTWF0aC5jZWlsKHN0ci5sZW5ndGggLyBsaW5lV2lkdGgpO1xuICAgICAgICAgICAgY29uc3QgbGluZXMgPSBuZXcgQXJyYXkobik7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbyA9IDA7IGkgPCBuOyArK2ksIG8gKz0gbGluZVdpZHRoKSB7XG4gICAgICAgICAgICAgICAgbGluZXNbaV0gPSBzdHIuc3Vic3RyKG8sIGxpbmVXaWR0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdHIgPSBsaW5lcy5qb2luKHR5cGUgPT09IFNjYWxhci5CTE9DS19MSVRFUkFMID8gJ1xcbicgOiAnICcpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdHJpbmdpZnlTdHJpbmcoeyBjb21tZW50LCB0eXBlLCB2YWx1ZTogc3RyIH0sIGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCk7XG4gICAgfVxufTtcblxuZXhwb3J0IHsgYmluYXJ5IH07XG4iLCAiaW1wb3J0IHsgaXNTZXEsIGlzUGFpciwgaXNNYXAgfSBmcm9tICcuLi8uLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBjcmVhdGVQYWlyLCBQYWlyIH0gZnJvbSAnLi4vLi4vbm9kZXMvUGFpci5qcyc7XG5pbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9TY2FsYXIuanMnO1xuaW1wb3J0IHsgWUFNTFNlcSB9IGZyb20gJy4uLy4uL25vZGVzL1lBTUxTZXEuanMnO1xuXG5mdW5jdGlvbiByZXNvbHZlUGFpcnMoc2VxLCBvbkVycm9yKSB7XG4gICAgaWYgKGlzU2VxKHNlcSkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXEuaXRlbXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gc2VxLml0ZW1zW2ldO1xuICAgICAgICAgICAgaWYgKGlzUGFpcihpdGVtKSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzTWFwKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaXRlbXMubGVuZ3RoID4gMSlcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcignRWFjaCBwYWlyIG11c3QgaGF2ZSBpdHMgb3duIHNlcXVlbmNlIGluZGljYXRvcicpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhaXIgPSBpdGVtLml0ZW1zWzBdIHx8IG5ldyBQYWlyKG5ldyBTY2FsYXIobnVsbCkpO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnRCZWZvcmUpXG4gICAgICAgICAgICAgICAgICAgIHBhaXIua2V5LmNvbW1lbnRCZWZvcmUgPSBwYWlyLmtleS5jb21tZW50QmVmb3JlXG4gICAgICAgICAgICAgICAgICAgICAgICA/IGAke2l0ZW0uY29tbWVudEJlZm9yZX1cXG4ke3BhaXIua2V5LmNvbW1lbnRCZWZvcmV9YFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBpdGVtLmNvbW1lbnRCZWZvcmU7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjbiA9IHBhaXIudmFsdWUgPz8gcGFpci5rZXk7XG4gICAgICAgICAgICAgICAgICAgIGNuLmNvbW1lbnQgPSBjbi5jb21tZW50XG4gICAgICAgICAgICAgICAgICAgICAgICA/IGAke2l0ZW0uY29tbWVudH1cXG4ke2NuLmNvbW1lbnR9YFxuICAgICAgICAgICAgICAgICAgICAgICAgOiBpdGVtLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGl0ZW0gPSBwYWlyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VxLml0ZW1zW2ldID0gaXNQYWlyKGl0ZW0pID8gaXRlbSA6IG5ldyBQYWlyKGl0ZW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2VcbiAgICAgICAgb25FcnJvcignRXhwZWN0ZWQgYSBzZXF1ZW5jZSBmb3IgdGhpcyB0YWcnKTtcbiAgICByZXR1cm4gc2VxO1xufVxuZnVuY3Rpb24gY3JlYXRlUGFpcnMoc2NoZW1hLCBpdGVyYWJsZSwgY3R4KSB7XG4gICAgY29uc3QgeyByZXBsYWNlciB9ID0gY3R4O1xuICAgIGNvbnN0IHBhaXJzID0gbmV3IFlBTUxTZXEoc2NoZW1hKTtcbiAgICBwYWlycy50YWcgPSAndGFnOnlhbWwub3JnLDIwMDI6cGFpcnMnO1xuICAgIGxldCBpID0gMDtcbiAgICBpZiAoaXRlcmFibGUgJiYgU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyYWJsZSkpXG4gICAgICAgIGZvciAobGV0IGl0IG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJlcGxhY2VyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIGl0ID0gcmVwbGFjZXIuY2FsbChpdGVyYWJsZSwgU3RyaW5nKGkrKyksIGl0KTtcbiAgICAgICAgICAgIGxldCBrZXksIHZhbHVlO1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0Lmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBrZXkgPSBpdFswXTtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBpdFsxXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBFeHBlY3RlZCBba2V5LCB2YWx1ZV0gdHVwbGU6ICR7aXR9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpdCAmJiBpdCBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhpdCk7XG4gICAgICAgICAgICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleSA9IGtleXNbMF07XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gaXRba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIHR1cGxlIHdpdGggb25lIGtleSwgbm90ICR7a2V5cy5sZW5ndGh9IGtleXNgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBrZXkgPSBpdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhaXJzLml0ZW1zLnB1c2goY3JlYXRlUGFpcihrZXksIHZhbHVlLCBjdHgpKTtcbiAgICAgICAgfVxuICAgIHJldHVybiBwYWlycztcbn1cbmNvbnN0IHBhaXJzID0ge1xuICAgIGNvbGxlY3Rpb246ICdzZXEnLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOnBhaXJzJyxcbiAgICByZXNvbHZlOiByZXNvbHZlUGFpcnMsXG4gICAgY3JlYXRlTm9kZTogY3JlYXRlUGFpcnNcbn07XG5cbmV4cG9ydCB7IGNyZWF0ZVBhaXJzLCBwYWlycywgcmVzb2x2ZVBhaXJzIH07XG4iLCAiaW1wb3J0IHsgaXNTY2FsYXIsIGlzUGFpciB9IGZyb20gJy4uLy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IHRvSlMgfSBmcm9tICcuLi8uLi9ub2Rlcy90b0pTLmpzJztcbmltcG9ydCB7IFlBTUxNYXAgfSBmcm9tICcuLi8uLi9ub2Rlcy9ZQU1MTWFwLmpzJztcbmltcG9ydCB7IFlBTUxTZXEgfSBmcm9tICcuLi8uLi9ub2Rlcy9ZQU1MU2VxLmpzJztcbmltcG9ydCB7IHJlc29sdmVQYWlycywgY3JlYXRlUGFpcnMgfSBmcm9tICcuL3BhaXJzLmpzJztcblxuY2xhc3MgWUFNTE9NYXAgZXh0ZW5kcyBZQU1MU2VxIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5hZGQgPSBZQU1MTWFwLnByb3RvdHlwZS5hZGQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5kZWxldGUgPSBZQU1MTWFwLnByb3RvdHlwZS5kZWxldGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5nZXQgPSBZQU1MTWFwLnByb3RvdHlwZS5nZXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5oYXMgPSBZQU1MTWFwLnByb3RvdHlwZS5oYXMuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5zZXQgPSBZQU1MTWFwLnByb3RvdHlwZS5zZXQuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy50YWcgPSBZQU1MT01hcC50YWc7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIElmIGBjdHhgIGlzIGdpdmVuLCB0aGUgcmV0dXJuIHR5cGUgaXMgYWN0dWFsbHkgYE1hcDx1bmtub3duLCB1bmtub3duPmAsXG4gICAgICogYnV0IFR5cGVTY3JpcHQgd29uJ3QgYWxsb3cgd2lkZW5pbmcgdGhlIHNpZ25hdHVyZSBvZiBhIGNoaWxkIG1ldGhvZC5cbiAgICAgKi9cbiAgICB0b0pTT04oXywgY3R4KSB7XG4gICAgICAgIGlmICghY3R4KVxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnRvSlNPTihfKTtcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcCgpO1xuICAgICAgICBpZiAoY3R4Py5vbkNyZWF0ZSlcbiAgICAgICAgICAgIGN0eC5vbkNyZWF0ZShtYXApO1xuICAgICAgICBmb3IgKGNvbnN0IHBhaXIgb2YgdGhpcy5pdGVtcykge1xuICAgICAgICAgICAgbGV0IGtleSwgdmFsdWU7XG4gICAgICAgICAgICBpZiAoaXNQYWlyKHBhaXIpKSB7XG4gICAgICAgICAgICAgICAga2V5ID0gdG9KUyhwYWlyLmtleSwgJycsIGN0eCk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0b0pTKHBhaXIudmFsdWUsIGtleSwgY3R4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGtleSA9IHRvSlMocGFpciwgJycsIGN0eCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWFwLmhhcyhrZXkpKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignT3JkZXJlZCBtYXBzIG11c3Qgbm90IGluY2x1ZGUgZHVwbGljYXRlIGtleXMnKTtcbiAgICAgICAgICAgIG1hcC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG4gICAgc3RhdGljIGZyb20oc2NoZW1hLCBpdGVyYWJsZSwgY3R4KSB7XG4gICAgICAgIGNvbnN0IHBhaXJzID0gY3JlYXRlUGFpcnMoc2NoZW1hLCBpdGVyYWJsZSwgY3R4KTtcbiAgICAgICAgY29uc3Qgb21hcCA9IG5ldyB0aGlzKCk7XG4gICAgICAgIG9tYXAuaXRlbXMgPSBwYWlycy5pdGVtcztcbiAgICAgICAgcmV0dXJuIG9tYXA7XG4gICAgfVxufVxuWUFNTE9NYXAudGFnID0gJ3RhZzp5YW1sLm9yZywyMDAyOm9tYXAnO1xuY29uc3Qgb21hcCA9IHtcbiAgICBjb2xsZWN0aW9uOiAnc2VxJyxcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdmFsdWUgaW5zdGFuY2VvZiBNYXAsXG4gICAgbm9kZUNsYXNzOiBZQU1MT01hcCxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpvbWFwJyxcbiAgICByZXNvbHZlKHNlcSwgb25FcnJvcikge1xuICAgICAgICBjb25zdCBwYWlycyA9IHJlc29sdmVQYWlycyhzZXEsIG9uRXJyb3IpO1xuICAgICAgICBjb25zdCBzZWVuS2V5cyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHsga2V5IH0gb2YgcGFpcnMuaXRlbXMpIHtcbiAgICAgICAgICAgIGlmIChpc1NjYWxhcihrZXkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlZW5LZXlzLmluY2x1ZGVzKGtleS52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihgT3JkZXJlZCBtYXBzIG11c3Qgbm90IGluY2x1ZGUgZHVwbGljYXRlIGtleXM6ICR7a2V5LnZhbHVlfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VlbktleXMucHVzaChrZXkudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgWUFNTE9NYXAoKSwgcGFpcnMpO1xuICAgIH0sXG4gICAgY3JlYXRlTm9kZTogKHNjaGVtYSwgaXRlcmFibGUsIGN0eCkgPT4gWUFNTE9NYXAuZnJvbShzY2hlbWEsIGl0ZXJhYmxlLCBjdHgpXG59O1xuXG5leHBvcnQgeyBZQU1MT01hcCwgb21hcCB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uLy4uL25vZGVzL1NjYWxhci5qcyc7XG5cbmZ1bmN0aW9uIGJvb2xTdHJpbmdpZnkoeyB2YWx1ZSwgc291cmNlIH0sIGN0eCkge1xuICAgIGNvbnN0IGJvb2xPYmogPSB2YWx1ZSA/IHRydWVUYWcgOiBmYWxzZVRhZztcbiAgICBpZiAoc291cmNlICYmIGJvb2xPYmoudGVzdC50ZXN0KHNvdXJjZSkpXG4gICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgcmV0dXJuIHZhbHVlID8gY3R4Lm9wdGlvbnMudHJ1ZVN0ciA6IGN0eC5vcHRpb25zLmZhbHNlU3RyO1xufVxuY29uc3QgdHJ1ZVRhZyA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdmFsdWUgPT09IHRydWUsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpib29sJyxcbiAgICB0ZXN0OiAvXig/Oll8eXxbWXldZXN8WUVTfFtUdF1ydWV8VFJVRXxbT29dbnxPTikkLyxcbiAgICByZXNvbHZlOiAoKSA9PiBuZXcgU2NhbGFyKHRydWUpLFxuICAgIHN0cmluZ2lmeTogYm9vbFN0cmluZ2lmeVxufTtcbmNvbnN0IGZhbHNlVGFnID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB2YWx1ZSA9PT0gZmFsc2UsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpib29sJyxcbiAgICB0ZXN0OiAvXig/Ok58bnxbTm5db3xOT3xbRmZdYWxzZXxGQUxTRXxbT29dZmZ8T0ZGKSQvLFxuICAgIHJlc29sdmU6ICgpID0+IG5ldyBTY2FsYXIoZmFsc2UpLFxuICAgIHN0cmluZ2lmeTogYm9vbFN0cmluZ2lmeVxufTtcblxuZXhwb3J0IHsgZmFsc2VUYWcsIHRydWVUYWcgfTtcbiIsICJpbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9TY2FsYXIuanMnO1xuaW1wb3J0IHsgc3RyaW5naWZ5TnVtYmVyIH0gZnJvbSAnLi4vLi4vc3RyaW5naWZ5L3N0cmluZ2lmeU51bWJlci5qcyc7XG5cbmNvbnN0IGZsb2F0TmFOID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnLFxuICAgIHRlc3Q6IC9eKD86Wy0rXT9cXC4oPzppbmZ8SW5mfElORil8XFwubmFufFxcLk5hTnxcXC5OQU4pJC8sXG4gICAgcmVzb2x2ZTogKHN0cikgPT4gc3RyLnNsaWNlKC0zKS50b0xvd2VyQ2FzZSgpID09PSAnbmFuJ1xuICAgICAgICA/IE5hTlxuICAgICAgICA6IHN0clswXSA9PT0gJy0nXG4gICAgICAgICAgICA/IE51bWJlci5ORUdBVElWRV9JTkZJTklUWVxuICAgICAgICAgICAgOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgc3RyaW5naWZ5OiBzdHJpbmdpZnlOdW1iZXJcbn07XG5jb25zdCBmbG9hdEV4cCA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmZsb2F0JyxcbiAgICBmb3JtYXQ6ICdFWFAnLFxuICAgIHRlc3Q6IC9eWy0rXT8oPzpbMC05XVswLTlfXSopPyg/OlxcLlswLTlfXSopP1tlRV1bLStdP1swLTldKyQvLFxuICAgIHJlc29sdmU6IChzdHIpID0+IHBhcnNlRmxvYXQoc3RyLnJlcGxhY2UoL18vZywgJycpKSxcbiAgICBzdHJpbmdpZnkobm9kZSkge1xuICAgICAgICBjb25zdCBudW0gPSBOdW1iZXIobm9kZS52YWx1ZSk7XG4gICAgICAgIHJldHVybiBpc0Zpbml0ZShudW0pID8gbnVtLnRvRXhwb25lbnRpYWwoKSA6IHN0cmluZ2lmeU51bWJlcihub2RlKTtcbiAgICB9XG59O1xuY29uc3QgZmxvYXQgPSB7XG4gICAgaWRlbnRpZnk6IHZhbHVlID0+IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjpmbG9hdCcsXG4gICAgdGVzdDogL15bLStdPyg/OlswLTldWzAtOV9dKik/XFwuWzAtOV9dKiQvLFxuICAgIHJlc29sdmUoc3RyKSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBuZXcgU2NhbGFyKHBhcnNlRmxvYXQoc3RyLnJlcGxhY2UoL18vZywgJycpKSk7XG4gICAgICAgIGNvbnN0IGRvdCA9IHN0ci5pbmRleE9mKCcuJyk7XG4gICAgICAgIGlmIChkb3QgIT09IC0xKSB7XG4gICAgICAgICAgICBjb25zdCBmID0gc3RyLnN1YnN0cmluZyhkb3QgKyAxKS5yZXBsYWNlKC9fL2csICcnKTtcbiAgICAgICAgICAgIGlmIChmW2YubGVuZ3RoIC0gMV0gPT09ICcwJylcbiAgICAgICAgICAgICAgICBub2RlLm1pbkZyYWN0aW9uRGlnaXRzID0gZi5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfSxcbiAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeU51bWJlclxufTtcblxuZXhwb3J0IHsgZmxvYXQsIGZsb2F0RXhwLCBmbG9hdE5hTiB9O1xuIiwgImltcG9ydCB7IHN0cmluZ2lmeU51bWJlciB9IGZyb20gJy4uLy4uL3N0cmluZ2lmeS9zdHJpbmdpZnlOdW1iZXIuanMnO1xuXG5jb25zdCBpbnRJZGVudGlmeSA9ICh2YWx1ZSkgPT4gdHlwZW9mIHZhbHVlID09PSAnYmlnaW50JyB8fCBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbmZ1bmN0aW9uIGludFJlc29sdmUoc3RyLCBvZmZzZXQsIHJhZGl4LCB7IGludEFzQmlnSW50IH0pIHtcbiAgICBjb25zdCBzaWduID0gc3RyWzBdO1xuICAgIGlmIChzaWduID09PSAnLScgfHwgc2lnbiA9PT0gJysnKVxuICAgICAgICBvZmZzZXQgKz0gMTtcbiAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKG9mZnNldCkucmVwbGFjZSgvXy9nLCAnJyk7XG4gICAgaWYgKGludEFzQmlnSW50KSB7XG4gICAgICAgIHN3aXRjaCAocmFkaXgpIHtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBzdHIgPSBgMGIke3N0cn1gO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgIHN0ciA9IGAwbyR7c3RyfWA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE2OlxuICAgICAgICAgICAgICAgIHN0ciA9IGAweCR7c3RyfWA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbiA9IEJpZ0ludChzdHIpO1xuICAgICAgICByZXR1cm4gc2lnbiA9PT0gJy0nID8gQmlnSW50KC0xKSAqIG4gOiBuO1xuICAgIH1cbiAgICBjb25zdCBuID0gcGFyc2VJbnQoc3RyLCByYWRpeCk7XG4gICAgcmV0dXJuIHNpZ24gPT09ICctJyA/IC0xICogbiA6IG47XG59XG5mdW5jdGlvbiBpbnRTdHJpbmdpZnkobm9kZSwgcmFkaXgsIHByZWZpeCkge1xuICAgIGNvbnN0IHsgdmFsdWUgfSA9IG5vZGU7XG4gICAgaWYgKGludElkZW50aWZ5KHZhbHVlKSkge1xuICAgICAgICBjb25zdCBzdHIgPSB2YWx1ZS50b1N0cmluZyhyYWRpeCk7XG4gICAgICAgIHJldHVybiB2YWx1ZSA8IDAgPyAnLScgKyBwcmVmaXggKyBzdHIuc3Vic3RyKDEpIDogcHJlZml4ICsgc3RyO1xuICAgIH1cbiAgICByZXR1cm4gc3RyaW5naWZ5TnVtYmVyKG5vZGUpO1xufVxuY29uc3QgaW50QmluID0ge1xuICAgIGlkZW50aWZ5OiBpbnRJZGVudGlmeSxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmludCcsXG4gICAgZm9ybWF0OiAnQklOJyxcbiAgICB0ZXN0OiAvXlstK10/MGJbMC0xX10rJC8sXG4gICAgcmVzb2x2ZTogKHN0ciwgX29uRXJyb3IsIG9wdCkgPT4gaW50UmVzb2x2ZShzdHIsIDIsIDIsIG9wdCksXG4gICAgc3RyaW5naWZ5OiBub2RlID0+IGludFN0cmluZ2lmeShub2RlLCAyLCAnMGInKVxufTtcbmNvbnN0IGludE9jdCA9IHtcbiAgICBpZGVudGlmeTogaW50SWRlbnRpZnksXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjppbnQnLFxuICAgIGZvcm1hdDogJ09DVCcsXG4gICAgdGVzdDogL15bLStdPzBbMC03X10rJC8sXG4gICAgcmVzb2x2ZTogKHN0ciwgX29uRXJyb3IsIG9wdCkgPT4gaW50UmVzb2x2ZShzdHIsIDEsIDgsIG9wdCksXG4gICAgc3RyaW5naWZ5OiBub2RlID0+IGludFN0cmluZ2lmeShub2RlLCA4LCAnMCcpXG59O1xuY29uc3QgaW50ID0ge1xuICAgIGlkZW50aWZ5OiBpbnRJZGVudGlmeSxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmludCcsXG4gICAgdGVzdDogL15bLStdP1swLTldWzAtOV9dKiQvLFxuICAgIHJlc29sdmU6IChzdHIsIF9vbkVycm9yLCBvcHQpID0+IGludFJlc29sdmUoc3RyLCAwLCAxMCwgb3B0KSxcbiAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeU51bWJlclxufTtcbmNvbnN0IGludEhleCA9IHtcbiAgICBpZGVudGlmeTogaW50SWRlbnRpZnksXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjppbnQnLFxuICAgIGZvcm1hdDogJ0hFWCcsXG4gICAgdGVzdDogL15bLStdPzB4WzAtOWEtZkEtRl9dKyQvLFxuICAgIHJlc29sdmU6IChzdHIsIF9vbkVycm9yLCBvcHQpID0+IGludFJlc29sdmUoc3RyLCAyLCAxNiwgb3B0KSxcbiAgICBzdHJpbmdpZnk6IG5vZGUgPT4gaW50U3RyaW5naWZ5KG5vZGUsIDE2LCAnMHgnKVxufTtcblxuZXhwb3J0IHsgaW50LCBpbnRCaW4sIGludEhleCwgaW50T2N0IH07XG4iLCAiaW1wb3J0IHsgaXNNYXAsIGlzUGFpciwgaXNTY2FsYXIgfSBmcm9tICcuLi8uLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBQYWlyLCBjcmVhdGVQYWlyIH0gZnJvbSAnLi4vLi4vbm9kZXMvUGFpci5qcyc7XG5pbXBvcnQgeyBZQU1MTWFwLCBmaW5kUGFpciB9IGZyb20gJy4uLy4uL25vZGVzL1lBTUxNYXAuanMnO1xuXG5jbGFzcyBZQU1MU2V0IGV4dGVuZHMgWUFNTE1hcCB7XG4gICAgY29uc3RydWN0b3Ioc2NoZW1hKSB7XG4gICAgICAgIHN1cGVyKHNjaGVtYSk7XG4gICAgICAgIHRoaXMudGFnID0gWUFNTFNldC50YWc7XG4gICAgfVxuICAgIGFkZChrZXkpIHtcbiAgICAgICAgbGV0IHBhaXI7XG4gICAgICAgIGlmIChpc1BhaXIoa2V5KSlcbiAgICAgICAgICAgIHBhaXIgPSBrZXk7XG4gICAgICAgIGVsc2UgaWYgKGtleSAmJlxuICAgICAgICAgICAgdHlwZW9mIGtleSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgICdrZXknIGluIGtleSAmJlxuICAgICAgICAgICAgJ3ZhbHVlJyBpbiBrZXkgJiZcbiAgICAgICAgICAgIGtleS52YWx1ZSA9PT0gbnVsbClcbiAgICAgICAgICAgIHBhaXIgPSBuZXcgUGFpcihrZXkua2V5LCBudWxsKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcGFpciA9IG5ldyBQYWlyKGtleSwgbnVsbCk7XG4gICAgICAgIGNvbnN0IHByZXYgPSBmaW5kUGFpcih0aGlzLml0ZW1zLCBwYWlyLmtleSk7XG4gICAgICAgIGlmICghcHJldilcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChwYWlyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgYGtlZXBQYWlyYCBpcyBgdHJ1ZWAsIHJldHVybnMgdGhlIFBhaXIgbWF0Y2hpbmcgYGtleWAuXG4gICAgICogT3RoZXJ3aXNlLCByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGF0IFBhaXIncyBrZXkuXG4gICAgICovXG4gICAgZ2V0KGtleSwga2VlcFBhaXIpIHtcbiAgICAgICAgY29uc3QgcGFpciA9IGZpbmRQYWlyKHRoaXMuaXRlbXMsIGtleSk7XG4gICAgICAgIHJldHVybiAha2VlcFBhaXIgJiYgaXNQYWlyKHBhaXIpXG4gICAgICAgICAgICA/IGlzU2NhbGFyKHBhaXIua2V5KVxuICAgICAgICAgICAgICAgID8gcGFpci5rZXkudmFsdWVcbiAgICAgICAgICAgICAgICA6IHBhaXIua2V5XG4gICAgICAgICAgICA6IHBhaXI7XG4gICAgfVxuICAgIHNldChrZXksIHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYm9vbGVhbiB2YWx1ZSBmb3Igc2V0KGtleSwgdmFsdWUpIGluIGEgWUFNTCBzZXQsIG5vdCAke3R5cGVvZiB2YWx1ZX1gKTtcbiAgICAgICAgY29uc3QgcHJldiA9IGZpbmRQYWlyKHRoaXMuaXRlbXMsIGtleSk7XG4gICAgICAgIGlmIChwcmV2ICYmICF2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtcy5zcGxpY2UodGhpcy5pdGVtcy5pbmRleE9mKHByZXYpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghcHJldiAmJiB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoKG5ldyBQYWlyKGtleSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRvSlNPTihfLCBjdHgpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLnRvSlNPTihfLCBjdHgsIFNldCk7XG4gICAgfVxuICAgIHRvU3RyaW5nKGN0eCwgb25Db21tZW50LCBvbkNob21wS2VlcCkge1xuICAgICAgICBpZiAoIWN0eClcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICAgICAgaWYgKHRoaXMuaGFzQWxsTnVsbFZhbHVlcyh0cnVlKSlcbiAgICAgICAgICAgIHJldHVybiBzdXBlci50b1N0cmluZyhPYmplY3QuYXNzaWduKHt9LCBjdHgsIHsgYWxsTnVsbFZhbHVlczogdHJ1ZSB9KSwgb25Db21tZW50LCBvbkNob21wS2VlcCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2V0IGl0ZW1zIG11c3QgYWxsIGhhdmUgbnVsbCB2YWx1ZXMnKTtcbiAgICB9XG4gICAgc3RhdGljIGZyb20oc2NoZW1hLCBpdGVyYWJsZSwgY3R4KSB7XG4gICAgICAgIGNvbnN0IHsgcmVwbGFjZXIgfSA9IGN0eDtcbiAgICAgICAgY29uc3Qgc2V0ID0gbmV3IHRoaXMoc2NoZW1hKTtcbiAgICAgICAgaWYgKGl0ZXJhYmxlICYmIFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoaXRlcmFibGUpKVxuICAgICAgICAgICAgZm9yIChsZXQgdmFsdWUgb2YgaXRlcmFibGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJlcGxhY2VyID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlcGxhY2VyLmNhbGwoaXRlcmFibGUsIHZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgc2V0Lml0ZW1zLnB1c2goY3JlYXRlUGFpcih2YWx1ZSwgbnVsbCwgY3R4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZXQ7XG4gICAgfVxufVxuWUFNTFNldC50YWcgPSAndGFnOnlhbWwub3JnLDIwMDI6c2V0JztcbmNvbnN0IHNldCA9IHtcbiAgICBjb2xsZWN0aW9uOiAnbWFwJyxcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdmFsdWUgaW5zdGFuY2VvZiBTZXQsXG4gICAgbm9kZUNsYXNzOiBZQU1MU2V0LFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOnNldCcsXG4gICAgY3JlYXRlTm9kZTogKHNjaGVtYSwgaXRlcmFibGUsIGN0eCkgPT4gWUFNTFNldC5mcm9tKHNjaGVtYSwgaXRlcmFibGUsIGN0eCksXG4gICAgcmVzb2x2ZShtYXAsIG9uRXJyb3IpIHtcbiAgICAgICAgaWYgKGlzTWFwKG1hcCkpIHtcbiAgICAgICAgICAgIGlmIChtYXAuaGFzQWxsTnVsbFZhbHVlcyh0cnVlKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgWUFNTFNldCgpLCBtYXApO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIG9uRXJyb3IoJ1NldCBpdGVtcyBtdXN0IGFsbCBoYXZlIG51bGwgdmFsdWVzJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgb25FcnJvcignRXhwZWN0ZWQgYSBtYXBwaW5nIGZvciB0aGlzIHRhZycpO1xuICAgICAgICByZXR1cm4gbWFwO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7IFlBTUxTZXQsIHNldCB9O1xuIiwgImltcG9ydCB7IHN0cmluZ2lmeU51bWJlciB9IGZyb20gJy4uLy4uL3N0cmluZ2lmeS9zdHJpbmdpZnlOdW1iZXIuanMnO1xuXG4vKiogSW50ZXJuYWwgdHlwZXMgaGFuZGxlIGJpZ2ludCBhcyBudW1iZXIsIGJlY2F1c2UgVFMgY2FuJ3QgZmlndXJlIGl0IG91dC4gKi9cbmZ1bmN0aW9uIHBhcnNlU2V4YWdlc2ltYWwoc3RyLCBhc0JpZ0ludCkge1xuICAgIGNvbnN0IHNpZ24gPSBzdHJbMF07XG4gICAgY29uc3QgcGFydHMgPSBzaWduID09PSAnLScgfHwgc2lnbiA9PT0gJysnID8gc3RyLnN1YnN0cmluZygxKSA6IHN0cjtcbiAgICBjb25zdCBudW0gPSAobikgPT4gYXNCaWdJbnQgPyBCaWdJbnQobikgOiBOdW1iZXIobik7XG4gICAgY29uc3QgcmVzID0gcGFydHNcbiAgICAgICAgLnJlcGxhY2UoL18vZywgJycpXG4gICAgICAgIC5zcGxpdCgnOicpXG4gICAgICAgIC5yZWR1Y2UoKHJlcywgcCkgPT4gcmVzICogbnVtKDYwKSArIG51bShwKSwgbnVtKDApKTtcbiAgICByZXR1cm4gKHNpZ24gPT09ICctJyA/IG51bSgtMSkgKiByZXMgOiByZXMpO1xufVxuLyoqXG4gKiBoaGhoOm1tOnNzLnNzc1xuICpcbiAqIEludGVybmFsIHR5cGVzIGhhbmRsZSBiaWdpbnQgYXMgbnVtYmVyLCBiZWNhdXNlIFRTIGNhbid0IGZpZ3VyZSBpdCBvdXQuXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ2lmeVNleGFnZXNpbWFsKG5vZGUpIHtcbiAgICBsZXQgeyB2YWx1ZSB9ID0gbm9kZTtcbiAgICBsZXQgbnVtID0gKG4pID0+IG47XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2JpZ2ludCcpXG4gICAgICAgIG51bSA9IG4gPT4gQmlnSW50KG4pO1xuICAgIGVsc2UgaWYgKGlzTmFOKHZhbHVlKSB8fCAhaXNGaW5pdGUodmFsdWUpKVxuICAgICAgICByZXR1cm4gc3RyaW5naWZ5TnVtYmVyKG5vZGUpO1xuICAgIGxldCBzaWduID0gJyc7XG4gICAgaWYgKHZhbHVlIDwgMCkge1xuICAgICAgICBzaWduID0gJy0nO1xuICAgICAgICB2YWx1ZSAqPSBudW0oLTEpO1xuICAgIH1cbiAgICBjb25zdCBfNjAgPSBudW0oNjApO1xuICAgIGNvbnN0IHBhcnRzID0gW3ZhbHVlICUgXzYwXTsgLy8gc2Vjb25kcywgaW5jbHVkaW5nIG1zXG4gICAgaWYgKHZhbHVlIDwgNjApIHtcbiAgICAgICAgcGFydHMudW5zaGlmdCgwKTsgLy8gYXQgbGVhc3Qgb25lIDogaXMgcmVxdWlyZWRcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhbHVlID0gKHZhbHVlIC0gcGFydHNbMF0pIC8gXzYwO1xuICAgICAgICBwYXJ0cy51bnNoaWZ0KHZhbHVlICUgXzYwKTsgLy8gbWludXRlc1xuICAgICAgICBpZiAodmFsdWUgPj0gNjApIHtcbiAgICAgICAgICAgIHZhbHVlID0gKHZhbHVlIC0gcGFydHNbMF0pIC8gXzYwO1xuICAgICAgICAgICAgcGFydHMudW5zaGlmdCh2YWx1ZSk7IC8vIGhvdXJzXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChzaWduICtcbiAgICAgICAgcGFydHNcbiAgICAgICAgICAgIC5tYXAobiA9PiBTdHJpbmcobikucGFkU3RhcnQoMiwgJzAnKSlcbiAgICAgICAgICAgIC5qb2luKCc6JylcbiAgICAgICAgICAgIC5yZXBsYWNlKC8wMDAwMDBcXGQqJC8sICcnKSAvLyAlIDYwIG1heSBpbnRyb2R1Y2UgZXJyb3JcbiAgICApO1xufVxuY29uc3QgaW50VGltZSA9IHtcbiAgICBpZGVudGlmeTogdmFsdWUgPT4gdHlwZW9mIHZhbHVlID09PSAnYmlnaW50JyB8fCBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIHRhZzogJ3RhZzp5YW1sLm9yZywyMDAyOmludCcsXG4gICAgZm9ybWF0OiAnVElNRScsXG4gICAgdGVzdDogL15bLStdP1swLTldWzAtOV9dKig/OjpbMC01XT9bMC05XSkrJC8sXG4gICAgcmVzb2x2ZTogKHN0ciwgX29uRXJyb3IsIHsgaW50QXNCaWdJbnQgfSkgPT4gcGFyc2VTZXhhZ2VzaW1hbChzdHIsIGludEFzQmlnSW50KSxcbiAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeVNleGFnZXNpbWFsXG59O1xuY29uc3QgZmxvYXRUaW1lID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgdGFnOiAndGFnOnlhbWwub3JnLDIwMDI6ZmxvYXQnLFxuICAgIGZvcm1hdDogJ1RJTUUnLFxuICAgIHRlc3Q6IC9eWy0rXT9bMC05XVswLTlfXSooPzo6WzAtNV0/WzAtOV0pK1xcLlswLTlfXSokLyxcbiAgICByZXNvbHZlOiBzdHIgPT4gcGFyc2VTZXhhZ2VzaW1hbChzdHIsIGZhbHNlKSxcbiAgICBzdHJpbmdpZnk6IHN0cmluZ2lmeVNleGFnZXNpbWFsXG59O1xuY29uc3QgdGltZXN0YW1wID0ge1xuICAgIGlkZW50aWZ5OiB2YWx1ZSA9PiB2YWx1ZSBpbnN0YW5jZW9mIERhdGUsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICB0YWc6ICd0YWc6eWFtbC5vcmcsMjAwMjp0aW1lc3RhbXAnLFxuICAgIC8vIElmIHRoZSB0aW1lIHpvbmUgaXMgb21pdHRlZCwgdGhlIHRpbWVzdGFtcCBpcyBhc3N1bWVkIHRvIGJlIHNwZWNpZmllZCBpbiBVVEMuIFRoZSB0aW1lIHBhcnRcbiAgICAvLyBtYXkgYmUgb21pdHRlZCBhbHRvZ2V0aGVyLCByZXN1bHRpbmcgaW4gYSBkYXRlIGZvcm1hdC4gSW4gc3VjaCBhIGNhc2UsIHRoZSB0aW1lIHBhcnQgaXNcbiAgICAvLyBhc3N1bWVkIHRvIGJlIDAwOjAwOjAwWiAoc3RhcnQgb2YgZGF5LCBVVEMpLlxuICAgIHRlc3Q6IFJlZ0V4cCgnXihbMC05XXs0fSktKFswLTldezEsMn0pLShbMC05XXsxLDJ9KScgKyAvLyBZWVlZLU1tLURkXG4gICAgICAgICcoPzonICsgLy8gdGltZSBpcyBvcHRpb25hbFxuICAgICAgICAnKD86dHxUfFsgXFxcXHRdKyknICsgLy8gdCB8IFQgfCB3aGl0ZXNwYWNlXG4gICAgICAgICcoWzAtOV17MSwyfSk6KFswLTldezEsMn0pOihbMC05XXsxLDJ9KFxcXFwuWzAtOV0rKT8pJyArIC8vIEhoOk1tOlNzKC5zcyk/XG4gICAgICAgICcoPzpbIFxcXFx0XSooWnxbLStdWzAxMl0/WzAtOV0oPzo6WzAtOV17Mn0pPykpPycgKyAvLyBaIHwgKzUgfCAtMDM6MzBcbiAgICAgICAgJyk/JCcpLFxuICAgIHJlc29sdmUoc3RyKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoID0gc3RyLm1hdGNoKHRpbWVzdGFtcC50ZXN0KTtcbiAgICAgICAgaWYgKCFtYXRjaClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignISF0aW1lc3RhbXAgZXhwZWN0cyBhIGRhdGUsIHN0YXJ0aW5nIHdpdGggeXl5eS1tbS1kZCcpO1xuICAgICAgICBjb25zdCBbLCB5ZWFyLCBtb250aCwgZGF5LCBob3VyLCBtaW51dGUsIHNlY29uZF0gPSBtYXRjaC5tYXAoTnVtYmVyKTtcbiAgICAgICAgY29uc3QgbWlsbGlzZWMgPSBtYXRjaFs3XSA/IE51bWJlcigobWF0Y2hbN10gKyAnMDAnKS5zdWJzdHIoMSwgMykpIDogMDtcbiAgICAgICAgbGV0IGRhdGUgPSBEYXRlLlVUQyh5ZWFyLCBtb250aCAtIDEsIGRheSwgaG91ciB8fCAwLCBtaW51dGUgfHwgMCwgc2Vjb25kIHx8IDAsIG1pbGxpc2VjKTtcbiAgICAgICAgY29uc3QgdHogPSBtYXRjaFs4XTtcbiAgICAgICAgaWYgKHR6ICYmIHR6ICE9PSAnWicpIHtcbiAgICAgICAgICAgIGxldCBkID0gcGFyc2VTZXhhZ2VzaW1hbCh0eiwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGQpIDwgMzApXG4gICAgICAgICAgICAgICAgZCAqPSA2MDtcbiAgICAgICAgICAgIGRhdGUgLT0gNjAwMDAgKiBkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlKTtcbiAgICB9LFxuICAgIHN0cmluZ2lmeTogKHsgdmFsdWUgfSkgPT4gdmFsdWU/LnRvSVNPU3RyaW5nKCkucmVwbGFjZSgvKFQwMDowMDowMCk/XFwuMDAwWiQvLCAnJykgPz8gJydcbn07XG5cbmV4cG9ydCB7IGZsb2F0VGltZSwgaW50VGltZSwgdGltZXN0YW1wIH07XG4iLCAiaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vY29tbW9uL21hcC5qcyc7XG5pbXBvcnQgeyBudWxsVGFnIH0gZnJvbSAnLi4vY29tbW9uL251bGwuanMnO1xuaW1wb3J0IHsgc2VxIH0gZnJvbSAnLi4vY29tbW9uL3NlcS5qcyc7XG5pbXBvcnQgeyBzdHJpbmcgfSBmcm9tICcuLi9jb21tb24vc3RyaW5nLmpzJztcbmltcG9ydCB7IGJpbmFyeSB9IGZyb20gJy4vYmluYXJ5LmpzJztcbmltcG9ydCB7IHRydWVUYWcsIGZhbHNlVGFnIH0gZnJvbSAnLi9ib29sLmpzJztcbmltcG9ydCB7IGZsb2F0TmFOLCBmbG9hdEV4cCwgZmxvYXQgfSBmcm9tICcuL2Zsb2F0LmpzJztcbmltcG9ydCB7IGludEJpbiwgaW50T2N0LCBpbnQsIGludEhleCB9IGZyb20gJy4vaW50LmpzJztcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnLi9tZXJnZS5qcyc7XG5pbXBvcnQgeyBvbWFwIH0gZnJvbSAnLi9vbWFwLmpzJztcbmltcG9ydCB7IHBhaXJzIH0gZnJvbSAnLi9wYWlycy5qcyc7XG5pbXBvcnQgeyBzZXQgfSBmcm9tICcuL3NldC5qcyc7XG5pbXBvcnQgeyBpbnRUaW1lLCBmbG9hdFRpbWUsIHRpbWVzdGFtcCB9IGZyb20gJy4vdGltZXN0YW1wLmpzJztcblxuY29uc3Qgc2NoZW1hID0gW1xuICAgIG1hcCxcbiAgICBzZXEsXG4gICAgc3RyaW5nLFxuICAgIG51bGxUYWcsXG4gICAgdHJ1ZVRhZyxcbiAgICBmYWxzZVRhZyxcbiAgICBpbnRCaW4sXG4gICAgaW50T2N0LFxuICAgIGludCxcbiAgICBpbnRIZXgsXG4gICAgZmxvYXROYU4sXG4gICAgZmxvYXRFeHAsXG4gICAgZmxvYXQsXG4gICAgYmluYXJ5LFxuICAgIG1lcmdlLFxuICAgIG9tYXAsXG4gICAgcGFpcnMsXG4gICAgc2V0LFxuICAgIGludFRpbWUsXG4gICAgZmxvYXRUaW1lLFxuICAgIHRpbWVzdGFtcFxuXTtcblxuZXhwb3J0IHsgc2NoZW1hIH07XG4iLCAiaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi9jb21tb24vbWFwLmpzJztcbmltcG9ydCB7IG51bGxUYWcgfSBmcm9tICcuL2NvbW1vbi9udWxsLmpzJztcbmltcG9ydCB7IHNlcSB9IGZyb20gJy4vY29tbW9uL3NlcS5qcyc7XG5pbXBvcnQgeyBzdHJpbmcgfSBmcm9tICcuL2NvbW1vbi9zdHJpbmcuanMnO1xuaW1wb3J0IHsgYm9vbFRhZyB9IGZyb20gJy4vY29yZS9ib29sLmpzJztcbmltcG9ydCB7IGZsb2F0TmFOLCBmbG9hdEV4cCwgZmxvYXQgfSBmcm9tICcuL2NvcmUvZmxvYXQuanMnO1xuaW1wb3J0IHsgaW50T2N0LCBpbnRIZXgsIGludCB9IGZyb20gJy4vY29yZS9pbnQuanMnO1xuaW1wb3J0IHsgc2NoZW1hIH0gZnJvbSAnLi9jb3JlL3NjaGVtYS5qcyc7XG5pbXBvcnQgeyBzY2hlbWEgYXMgc2NoZW1hJDEgfSBmcm9tICcuL2pzb24vc2NoZW1hLmpzJztcbmltcG9ydCB7IGJpbmFyeSB9IGZyb20gJy4veWFtbC0xLjEvYmluYXJ5LmpzJztcbmltcG9ydCB7IG1lcmdlIH0gZnJvbSAnLi95YW1sLTEuMS9tZXJnZS5qcyc7XG5pbXBvcnQgeyBvbWFwIH0gZnJvbSAnLi95YW1sLTEuMS9vbWFwLmpzJztcbmltcG9ydCB7IHBhaXJzIH0gZnJvbSAnLi95YW1sLTEuMS9wYWlycy5qcyc7XG5pbXBvcnQgeyBzY2hlbWEgYXMgc2NoZW1hJDIgfSBmcm9tICcuL3lhbWwtMS4xL3NjaGVtYS5qcyc7XG5pbXBvcnQgeyBzZXQgfSBmcm9tICcuL3lhbWwtMS4xL3NldC5qcyc7XG5pbXBvcnQgeyB0aW1lc3RhbXAsIGludFRpbWUsIGZsb2F0VGltZSB9IGZyb20gJy4veWFtbC0xLjEvdGltZXN0YW1wLmpzJztcblxuY29uc3Qgc2NoZW1hcyA9IG5ldyBNYXAoW1xuICAgIFsnY29yZScsIHNjaGVtYV0sXG4gICAgWydmYWlsc2FmZScsIFttYXAsIHNlcSwgc3RyaW5nXV0sXG4gICAgWydqc29uJywgc2NoZW1hJDFdLFxuICAgIFsneWFtbDExJywgc2NoZW1hJDJdLFxuICAgIFsneWFtbC0xLjEnLCBzY2hlbWEkMl1cbl0pO1xuY29uc3QgdGFnc0J5TmFtZSA9IHtcbiAgICBiaW5hcnksXG4gICAgYm9vbDogYm9vbFRhZyxcbiAgICBmbG9hdCxcbiAgICBmbG9hdEV4cCxcbiAgICBmbG9hdE5hTixcbiAgICBmbG9hdFRpbWUsXG4gICAgaW50LFxuICAgIGludEhleCxcbiAgICBpbnRPY3QsXG4gICAgaW50VGltZSxcbiAgICBtYXAsXG4gICAgbWVyZ2UsXG4gICAgbnVsbDogbnVsbFRhZyxcbiAgICBvbWFwLFxuICAgIHBhaXJzLFxuICAgIHNlcSxcbiAgICBzZXQsXG4gICAgdGltZXN0YW1wXG59O1xuY29uc3QgY29yZUtub3duVGFncyA9IHtcbiAgICAndGFnOnlhbWwub3JnLDIwMDI6YmluYXJ5JzogYmluYXJ5LFxuICAgICd0YWc6eWFtbC5vcmcsMjAwMjptZXJnZSc6IG1lcmdlLFxuICAgICd0YWc6eWFtbC5vcmcsMjAwMjpvbWFwJzogb21hcCxcbiAgICAndGFnOnlhbWwub3JnLDIwMDI6cGFpcnMnOiBwYWlycyxcbiAgICAndGFnOnlhbWwub3JnLDIwMDI6c2V0Jzogc2V0LFxuICAgICd0YWc6eWFtbC5vcmcsMjAwMjp0aW1lc3RhbXAnOiB0aW1lc3RhbXBcbn07XG5mdW5jdGlvbiBnZXRUYWdzKGN1c3RvbVRhZ3MsIHNjaGVtYU5hbWUsIGFkZE1lcmdlVGFnKSB7XG4gICAgY29uc3Qgc2NoZW1hVGFncyA9IHNjaGVtYXMuZ2V0KHNjaGVtYU5hbWUpO1xuICAgIGlmIChzY2hlbWFUYWdzICYmICFjdXN0b21UYWdzKSB7XG4gICAgICAgIHJldHVybiBhZGRNZXJnZVRhZyAmJiAhc2NoZW1hVGFncy5pbmNsdWRlcyhtZXJnZSlcbiAgICAgICAgICAgID8gc2NoZW1hVGFncy5jb25jYXQobWVyZ2UpXG4gICAgICAgICAgICA6IHNjaGVtYVRhZ3Muc2xpY2UoKTtcbiAgICB9XG4gICAgbGV0IHRhZ3MgPSBzY2hlbWFUYWdzO1xuICAgIGlmICghdGFncykge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjdXN0b21UYWdzKSlcbiAgICAgICAgICAgIHRhZ3MgPSBbXTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gQXJyYXkuZnJvbShzY2hlbWFzLmtleXMoKSlcbiAgICAgICAgICAgICAgICAuZmlsdGVyKGtleSA9PiBrZXkgIT09ICd5YW1sMTEnKVxuICAgICAgICAgICAgICAgIC5tYXAoa2V5ID0+IEpTT04uc3RyaW5naWZ5KGtleSkpXG4gICAgICAgICAgICAgICAgLmpvaW4oJywgJyk7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gc2NoZW1hIFwiJHtzY2hlbWFOYW1lfVwiOyB1c2Ugb25lIG9mICR7a2V5c30gb3IgZGVmaW5lIGN1c3RvbVRhZ3MgYXJyYXlgKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShjdXN0b21UYWdzKSkge1xuICAgICAgICBmb3IgKGNvbnN0IHRhZyBvZiBjdXN0b21UYWdzKVxuICAgICAgICAgICAgdGFncyA9IHRhZ3MuY29uY2F0KHRhZyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBjdXN0b21UYWdzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRhZ3MgPSBjdXN0b21UYWdzKHRhZ3Muc2xpY2UoKSk7XG4gICAgfVxuICAgIGlmIChhZGRNZXJnZVRhZylcbiAgICAgICAgdGFncyA9IHRhZ3MuY29uY2F0KG1lcmdlKTtcbiAgICByZXR1cm4gdGFncy5yZWR1Y2UoKHRhZ3MsIHRhZykgPT4ge1xuICAgICAgICBjb25zdCB0YWdPYmogPSB0eXBlb2YgdGFnID09PSAnc3RyaW5nJyA/IHRhZ3NCeU5hbWVbdGFnXSA6IHRhZztcbiAgICAgICAgaWYgKCF0YWdPYmopIHtcbiAgICAgICAgICAgIGNvbnN0IHRhZ05hbWUgPSBKU09OLnN0cmluZ2lmeSh0YWcpO1xuICAgICAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRhZ3NCeU5hbWUpXG4gICAgICAgICAgICAgICAgLm1hcChrZXkgPT4gSlNPTi5zdHJpbmdpZnkoa2V5KSlcbiAgICAgICAgICAgICAgICAuam9pbignLCAnKTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93biBjdXN0b20gdGFnICR7dGFnTmFtZX07IHVzZSBvbmUgb2YgJHtrZXlzfWApO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGFncy5pbmNsdWRlcyh0YWdPYmopKVxuICAgICAgICAgICAgdGFncy5wdXNoKHRhZ09iaik7XG4gICAgICAgIHJldHVybiB0YWdzO1xuICAgIH0sIFtdKTtcbn1cblxuZXhwb3J0IHsgY29yZUtub3duVGFncywgZ2V0VGFncyB9O1xuIiwgImltcG9ydCB7IE1BUCwgU0NBTEFSLCBTRVEgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuL2NvbW1vbi9tYXAuanMnO1xuaW1wb3J0IHsgc2VxIH0gZnJvbSAnLi9jb21tb24vc2VxLmpzJztcbmltcG9ydCB7IHN0cmluZyB9IGZyb20gJy4vY29tbW9uL3N0cmluZy5qcyc7XG5pbXBvcnQgeyBnZXRUYWdzLCBjb3JlS25vd25UYWdzIH0gZnJvbSAnLi90YWdzLmpzJztcblxuY29uc3Qgc29ydE1hcEVudHJpZXNCeUtleSA9IChhLCBiKSA9PiBhLmtleSA8IGIua2V5ID8gLTEgOiBhLmtleSA+IGIua2V5ID8gMSA6IDA7XG5jbGFzcyBTY2hlbWEge1xuICAgIGNvbnN0cnVjdG9yKHsgY29tcGF0LCBjdXN0b21UYWdzLCBtZXJnZSwgcmVzb2x2ZUtub3duVGFncywgc2NoZW1hLCBzb3J0TWFwRW50cmllcywgdG9TdHJpbmdEZWZhdWx0cyB9KSB7XG4gICAgICAgIHRoaXMuY29tcGF0ID0gQXJyYXkuaXNBcnJheShjb21wYXQpXG4gICAgICAgICAgICA/IGdldFRhZ3MoY29tcGF0LCAnY29tcGF0JylcbiAgICAgICAgICAgIDogY29tcGF0XG4gICAgICAgICAgICAgICAgPyBnZXRUYWdzKG51bGwsIGNvbXBhdClcbiAgICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgIHRoaXMubmFtZSA9ICh0eXBlb2Ygc2NoZW1hID09PSAnc3RyaW5nJyAmJiBzY2hlbWEpIHx8ICdjb3JlJztcbiAgICAgICAgdGhpcy5rbm93blRhZ3MgPSByZXNvbHZlS25vd25UYWdzID8gY29yZUtub3duVGFncyA6IHt9O1xuICAgICAgICB0aGlzLnRhZ3MgPSBnZXRUYWdzKGN1c3RvbVRhZ3MsIHRoaXMubmFtZSwgbWVyZ2UpO1xuICAgICAgICB0aGlzLnRvU3RyaW5nT3B0aW9ucyA9IHRvU3RyaW5nRGVmYXVsdHMgPz8gbnVsbDtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIE1BUCwgeyB2YWx1ZTogbWFwIH0pO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgU0NBTEFSLCB7IHZhbHVlOiBzdHJpbmcgfSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBTRVEsIHsgdmFsdWU6IHNlcSB9KTtcbiAgICAgICAgLy8gVXNlZCBieSBjcmVhdGVNYXAoKVxuICAgICAgICB0aGlzLnNvcnRNYXBFbnRyaWVzID1cbiAgICAgICAgICAgIHR5cGVvZiBzb3J0TWFwRW50cmllcyA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgICAgID8gc29ydE1hcEVudHJpZXNcbiAgICAgICAgICAgICAgICA6IHNvcnRNYXBFbnRyaWVzID09PSB0cnVlXG4gICAgICAgICAgICAgICAgICAgID8gc29ydE1hcEVudHJpZXNCeUtleVxuICAgICAgICAgICAgICAgICAgICA6IG51bGw7XG4gICAgfVxuICAgIGNsb25lKCkge1xuICAgICAgICBjb25zdCBjb3B5ID0gT2JqZWN0LmNyZWF0ZShTY2hlbWEucHJvdG90eXBlLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyh0aGlzKSk7XG4gICAgICAgIGNvcHkudGFncyA9IHRoaXMudGFncy5zbGljZSgpO1xuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG59XG5cbmV4cG9ydCB7IFNjaGVtYSB9O1xuIiwgImltcG9ydCB7IGlzTm9kZSB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IGNyZWF0ZVN0cmluZ2lmeUNvbnRleHQsIHN0cmluZ2lmeSB9IGZyb20gJy4vc3RyaW5naWZ5LmpzJztcbmltcG9ydCB7IGluZGVudENvbW1lbnQsIGxpbmVDb21tZW50IH0gZnJvbSAnLi9zdHJpbmdpZnlDb21tZW50LmpzJztcblxuZnVuY3Rpb24gc3RyaW5naWZ5RG9jdW1lbnQoZG9jLCBvcHRpb25zKSB7XG4gICAgY29uc3QgbGluZXMgPSBbXTtcbiAgICBsZXQgaGFzRGlyZWN0aXZlcyA9IG9wdGlvbnMuZGlyZWN0aXZlcyA9PT0gdHJ1ZTtcbiAgICBpZiAob3B0aW9ucy5kaXJlY3RpdmVzICE9PSBmYWxzZSAmJiBkb2MuZGlyZWN0aXZlcykge1xuICAgICAgICBjb25zdCBkaXIgPSBkb2MuZGlyZWN0aXZlcy50b1N0cmluZyhkb2MpO1xuICAgICAgICBpZiAoZGlyKSB7XG4gICAgICAgICAgICBsaW5lcy5wdXNoKGRpcik7XG4gICAgICAgICAgICBoYXNEaXJlY3RpdmVzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChkb2MuZGlyZWN0aXZlcy5kb2NTdGFydClcbiAgICAgICAgICAgIGhhc0RpcmVjdGl2ZXMgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoaGFzRGlyZWN0aXZlcylcbiAgICAgICAgbGluZXMucHVzaCgnLS0tJyk7XG4gICAgY29uc3QgY3R4ID0gY3JlYXRlU3RyaW5naWZ5Q29udGV4dChkb2MsIG9wdGlvbnMpO1xuICAgIGNvbnN0IHsgY29tbWVudFN0cmluZyB9ID0gY3R4Lm9wdGlvbnM7XG4gICAgaWYgKGRvYy5jb21tZW50QmVmb3JlKSB7XG4gICAgICAgIGlmIChsaW5lcy5sZW5ndGggIT09IDEpXG4gICAgICAgICAgICBsaW5lcy51bnNoaWZ0KCcnKTtcbiAgICAgICAgY29uc3QgY3MgPSBjb21tZW50U3RyaW5nKGRvYy5jb21tZW50QmVmb3JlKTtcbiAgICAgICAgbGluZXMudW5zaGlmdChpbmRlbnRDb21tZW50KGNzLCAnJykpO1xuICAgIH1cbiAgICBsZXQgY2hvbXBLZWVwID0gZmFsc2U7XG4gICAgbGV0IGNvbnRlbnRDb21tZW50ID0gbnVsbDtcbiAgICBpZiAoZG9jLmNvbnRlbnRzKSB7XG4gICAgICAgIGlmIChpc05vZGUoZG9jLmNvbnRlbnRzKSkge1xuICAgICAgICAgICAgaWYgKGRvYy5jb250ZW50cy5zcGFjZUJlZm9yZSAmJiBoYXNEaXJlY3RpdmVzKVxuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goJycpO1xuICAgICAgICAgICAgaWYgKGRvYy5jb250ZW50cy5jb21tZW50QmVmb3JlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3MgPSBjb21tZW50U3RyaW5nKGRvYy5jb250ZW50cy5jb21tZW50QmVmb3JlKTtcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKGluZGVudENvbW1lbnQoY3MsICcnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0b3AtbGV2ZWwgYmxvY2sgc2NhbGFycyBuZWVkIHRvIGJlIGluZGVudGVkIGlmIGZvbGxvd2VkIGJ5IGEgY29tbWVudFxuICAgICAgICAgICAgY3R4LmZvcmNlQmxvY2tJbmRlbnQgPSAhIWRvYy5jb21tZW50O1xuICAgICAgICAgICAgY29udGVudENvbW1lbnQgPSBkb2MuY29udGVudHMuY29tbWVudDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbkNob21wS2VlcCA9IGNvbnRlbnRDb21tZW50ID8gdW5kZWZpbmVkIDogKCkgPT4gKGNob21wS2VlcCA9IHRydWUpO1xuICAgICAgICBsZXQgYm9keSA9IHN0cmluZ2lmeShkb2MuY29udGVudHMsIGN0eCwgKCkgPT4gKGNvbnRlbnRDb21tZW50ID0gbnVsbCksIG9uQ2hvbXBLZWVwKTtcbiAgICAgICAgaWYgKGNvbnRlbnRDb21tZW50KVxuICAgICAgICAgICAgYm9keSArPSBsaW5lQ29tbWVudChib2R5LCAnJywgY29tbWVudFN0cmluZyhjb250ZW50Q29tbWVudCkpO1xuICAgICAgICBpZiAoKGJvZHlbMF0gPT09ICd8JyB8fCBib2R5WzBdID09PSAnPicpICYmXG4gICAgICAgICAgICBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXSA9PT0gJy0tLScpIHtcbiAgICAgICAgICAgIC8vIFRvcC1sZXZlbCBibG9jayBzY2FsYXJzIHdpdGggYSBwcmVjZWRpbmcgZG9jIG1hcmtlciBvdWdodCB0byB1c2UgdGhlXG4gICAgICAgICAgICAvLyBzYW1lIGxpbmUgZm9yIHRoZWlyIGhlYWRlci5cbiAgICAgICAgICAgIGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdID0gYC0tLSAke2JvZHl9YDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGJvZHkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbGluZXMucHVzaChzdHJpbmdpZnkoZG9jLmNvbnRlbnRzLCBjdHgpKTtcbiAgICB9XG4gICAgaWYgKGRvYy5kaXJlY3RpdmVzPy5kb2NFbmQpIHtcbiAgICAgICAgaWYgKGRvYy5jb21tZW50KSB7XG4gICAgICAgICAgICBjb25zdCBjcyA9IGNvbW1lbnRTdHJpbmcoZG9jLmNvbW1lbnQpO1xuICAgICAgICAgICAgaWYgKGNzLmluY2x1ZGVzKCdcXG4nKSkge1xuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goJy4uLicpO1xuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goaW5kZW50Q29tbWVudChjcywgJycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goYC4uLiAke2NzfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGluZXMucHVzaCgnLi4uJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxldCBkYyA9IGRvYy5jb21tZW50O1xuICAgICAgICBpZiAoZGMgJiYgY2hvbXBLZWVwKVxuICAgICAgICAgICAgZGMgPSBkYy5yZXBsYWNlKC9eXFxuKy8sICcnKTtcbiAgICAgICAgaWYgKGRjKSB7XG4gICAgICAgICAgICBpZiAoKCFjaG9tcEtlZXAgfHwgY29udGVudENvbW1lbnQpICYmIGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdICE9PSAnJylcbiAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKCcnKTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goaW5kZW50Q29tbWVudChjb21tZW50U3RyaW5nKGRjKSwgJycpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGluZXMuam9pbignXFxuJykgKyAnXFxuJztcbn1cblxuZXhwb3J0IHsgc3RyaW5naWZ5RG9jdW1lbnQgfTtcbiIsICJpbXBvcnQgeyBBbGlhcyB9IGZyb20gJy4uL25vZGVzL0FsaWFzLmpzJztcbmltcG9ydCB7IGlzRW1wdHlQYXRoLCBjb2xsZWN0aW9uRnJvbVBhdGggfSBmcm9tICcuLi9ub2Rlcy9Db2xsZWN0aW9uLmpzJztcbmltcG9ydCB7IE5PREVfVFlQRSwgRE9DLCBpc05vZGUsIGlzQ29sbGVjdGlvbiwgaXNTY2FsYXIgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBQYWlyIH0gZnJvbSAnLi4vbm9kZXMvUGFpci5qcyc7XG5pbXBvcnQgeyB0b0pTIH0gZnJvbSAnLi4vbm9kZXMvdG9KUy5qcyc7XG5pbXBvcnQgeyBTY2hlbWEgfSBmcm9tICcuLi9zY2hlbWEvU2NoZW1hLmpzJztcbmltcG9ydCB7IHN0cmluZ2lmeURvY3VtZW50IH0gZnJvbSAnLi4vc3RyaW5naWZ5L3N0cmluZ2lmeURvY3VtZW50LmpzJztcbmltcG9ydCB7IGFuY2hvck5hbWVzLCBmaW5kTmV3QW5jaG9yLCBjcmVhdGVOb2RlQW5jaG9ycyB9IGZyb20gJy4vYW5jaG9ycy5qcyc7XG5pbXBvcnQgeyBhcHBseVJldml2ZXIgfSBmcm9tICcuL2FwcGx5UmV2aXZlci5qcyc7XG5pbXBvcnQgeyBjcmVhdGVOb2RlIH0gZnJvbSAnLi9jcmVhdGVOb2RlLmpzJztcbmltcG9ydCB7IERpcmVjdGl2ZXMgfSBmcm9tICcuL2RpcmVjdGl2ZXMuanMnO1xuXG5jbGFzcyBEb2N1bWVudCB7XG4gICAgY29uc3RydWN0b3IodmFsdWUsIHJlcGxhY2VyLCBvcHRpb25zKSB7XG4gICAgICAgIC8qKiBBIGNvbW1lbnQgYmVmb3JlIHRoaXMgRG9jdW1lbnQgKi9cbiAgICAgICAgdGhpcy5jb21tZW50QmVmb3JlID0gbnVsbDtcbiAgICAgICAgLyoqIEEgY29tbWVudCBpbW1lZGlhdGVseSBhZnRlciB0aGlzIERvY3VtZW50ICovXG4gICAgICAgIHRoaXMuY29tbWVudCA9IG51bGw7XG4gICAgICAgIC8qKiBFcnJvcnMgZW5jb3VudGVyZWQgZHVyaW5nIHBhcnNpbmcuICovXG4gICAgICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgICAgIC8qKiBXYXJuaW5ncyBlbmNvdW50ZXJlZCBkdXJpbmcgcGFyc2luZy4gKi9cbiAgICAgICAgdGhpcy53YXJuaW5ncyA9IFtdO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgTk9ERV9UWVBFLCB7IHZhbHVlOiBET0MgfSk7XG4gICAgICAgIGxldCBfcmVwbGFjZXIgPSBudWxsO1xuICAgICAgICBpZiAodHlwZW9mIHJlcGxhY2VyID09PSAnZnVuY3Rpb24nIHx8IEFycmF5LmlzQXJyYXkocmVwbGFjZXIpKSB7XG4gICAgICAgICAgICBfcmVwbGFjZXIgPSByZXBsYWNlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgJiYgcmVwbGFjZXIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSByZXBsYWNlcjtcbiAgICAgICAgICAgIHJlcGxhY2VyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9wdCA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgICAgICAgaW50QXNCaWdJbnQ6IGZhbHNlLFxuICAgICAgICAgICAga2VlcFNvdXJjZVRva2VuczogZmFsc2UsXG4gICAgICAgICAgICBsb2dMZXZlbDogJ3dhcm4nLFxuICAgICAgICAgICAgcHJldHR5RXJyb3JzOiB0cnVlLFxuICAgICAgICAgICAgc3RyaWN0OiB0cnVlLFxuICAgICAgICAgICAgc3RyaW5nS2V5czogZmFsc2UsXG4gICAgICAgICAgICB1bmlxdWVLZXlzOiB0cnVlLFxuICAgICAgICAgICAgdmVyc2lvbjogJzEuMidcbiAgICAgICAgfSwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdDtcbiAgICAgICAgbGV0IHsgdmVyc2lvbiB9ID0gb3B0O1xuICAgICAgICBpZiAob3B0aW9ucz8uX2RpcmVjdGl2ZXMpIHtcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aXZlcyA9IG9wdGlvbnMuX2RpcmVjdGl2ZXMuYXREb2N1bWVudCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aXZlcy55YW1sLmV4cGxpY2l0KVxuICAgICAgICAgICAgICAgIHZlcnNpb24gPSB0aGlzLmRpcmVjdGl2ZXMueWFtbC52ZXJzaW9uO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuZGlyZWN0aXZlcyA9IG5ldyBEaXJlY3RpdmVzKHsgdmVyc2lvbiB9KTtcbiAgICAgICAgdGhpcy5zZXRTY2hlbWEodmVyc2lvbiwgb3B0aW9ucyk7XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgV2UgY2FuJ3QgcmVhbGx5IGtub3cgdGhhdCB0aGlzIG1hdGNoZXMgQ29udGVudHMuXG4gICAgICAgIHRoaXMuY29udGVudHMgPVxuICAgICAgICAgICAgdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB0aGlzLmNyZWF0ZU5vZGUodmFsdWUsIF9yZXBsYWNlciwgb3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGRlZXAgY29weSBvZiB0aGlzIERvY3VtZW50IGFuZCBpdHMgY29udGVudHMuXG4gICAgICpcbiAgICAgKiBDdXN0b20gTm9kZSB2YWx1ZXMgdGhhdCBpbmhlcml0IGZyb20gYE9iamVjdGAgc3RpbGwgcmVmZXIgdG8gdGhlaXIgb3JpZ2luYWwgaW5zdGFuY2VzLlxuICAgICAqL1xuICAgIGNsb25lKCkge1xuICAgICAgICBjb25zdCBjb3B5ID0gT2JqZWN0LmNyZWF0ZShEb2N1bWVudC5wcm90b3R5cGUsIHtcbiAgICAgICAgICAgIFtOT0RFX1RZUEVdOiB7IHZhbHVlOiBET0MgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29weS5jb21tZW50QmVmb3JlID0gdGhpcy5jb21tZW50QmVmb3JlO1xuICAgICAgICBjb3B5LmNvbW1lbnQgPSB0aGlzLmNvbW1lbnQ7XG4gICAgICAgIGNvcHkuZXJyb3JzID0gdGhpcy5lcnJvcnMuc2xpY2UoKTtcbiAgICAgICAgY29weS53YXJuaW5ncyA9IHRoaXMud2FybmluZ3Muc2xpY2UoKTtcbiAgICAgICAgY29weS5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5vcHRpb25zKTtcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aXZlcylcbiAgICAgICAgICAgIGNvcHkuZGlyZWN0aXZlcyA9IHRoaXMuZGlyZWN0aXZlcy5jbG9uZSgpO1xuICAgICAgICBjb3B5LnNjaGVtYSA9IHRoaXMuc2NoZW1hLmNsb25lKCk7XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgV2UgY2FuJ3QgcmVhbGx5IGtub3cgdGhhdCB0aGlzIG1hdGNoZXMgQ29udGVudHMuXG4gICAgICAgIGNvcHkuY29udGVudHMgPSBpc05vZGUodGhpcy5jb250ZW50cylcbiAgICAgICAgICAgID8gdGhpcy5jb250ZW50cy5jbG9uZShjb3B5LnNjaGVtYSlcbiAgICAgICAgICAgIDogdGhpcy5jb250ZW50cztcbiAgICAgICAgaWYgKHRoaXMucmFuZ2UpXG4gICAgICAgICAgICBjb3B5LnJhbmdlID0gdGhpcy5yYW5nZS5zbGljZSgpO1xuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9XG4gICAgLyoqIEFkZHMgYSB2YWx1ZSB0byB0aGUgZG9jdW1lbnQuICovXG4gICAgYWRkKHZhbHVlKSB7XG4gICAgICAgIGlmIChhc3NlcnRDb2xsZWN0aW9uKHRoaXMuY29udGVudHMpKVxuICAgICAgICAgICAgdGhpcy5jb250ZW50cy5hZGQodmFsdWUpO1xuICAgIH1cbiAgICAvKiogQWRkcyBhIHZhbHVlIHRvIHRoZSBkb2N1bWVudC4gKi9cbiAgICBhZGRJbihwYXRoLCB2YWx1ZSkge1xuICAgICAgICBpZiAoYXNzZXJ0Q29sbGVjdGlvbih0aGlzLmNvbnRlbnRzKSlcbiAgICAgICAgICAgIHRoaXMuY29udGVudHMuYWRkSW4ocGF0aCwgdmFsdWUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBuZXcgYEFsaWFzYCBub2RlLCBlbnN1cmluZyB0aGF0IHRoZSB0YXJnZXQgYG5vZGVgIGhhcyB0aGUgcmVxdWlyZWQgYW5jaG9yLlxuICAgICAqXG4gICAgICogSWYgYG5vZGVgIGFscmVhZHkgaGFzIGFuIGFuY2hvciwgYG5hbWVgIGlzIGlnbm9yZWQuXG4gICAgICogT3RoZXJ3aXNlLCB0aGUgYG5vZGUuYW5jaG9yYCB2YWx1ZSB3aWxsIGJlIHNldCB0byBgbmFtZWAsXG4gICAgICogb3IgaWYgYW4gYW5jaG9yIHdpdGggdGhhdCBuYW1lIGlzIGFscmVhZHkgcHJlc2VudCBpbiB0aGUgZG9jdW1lbnQsXG4gICAgICogYG5hbWVgIHdpbGwgYmUgdXNlZCBhcyBhIHByZWZpeCBmb3IgYSBuZXcgdW5pcXVlIGFuY2hvci5cbiAgICAgKiBJZiBgbmFtZWAgaXMgdW5kZWZpbmVkLCB0aGUgZ2VuZXJhdGVkIGFuY2hvciB3aWxsIHVzZSAnYScgYXMgYSBwcmVmaXguXG4gICAgICovXG4gICAgY3JlYXRlQWxpYXMobm9kZSwgbmFtZSkge1xuICAgICAgICBpZiAoIW5vZGUuYW5jaG9yKSB7XG4gICAgICAgICAgICBjb25zdCBwcmV2ID0gYW5jaG9yTmFtZXModGhpcyk7XG4gICAgICAgICAgICBub2RlLmFuY2hvciA9XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9wcmVmZXItbnVsbGlzaC1jb2FsZXNjaW5nXG4gICAgICAgICAgICAgICAgIW5hbWUgfHwgcHJldi5oYXMobmFtZSkgPyBmaW5kTmV3QW5jaG9yKG5hbWUgfHwgJ2EnLCBwcmV2KSA6IG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBBbGlhcyhub2RlLmFuY2hvcik7XG4gICAgfVxuICAgIGNyZWF0ZU5vZGUodmFsdWUsIHJlcGxhY2VyLCBvcHRpb25zKSB7XG4gICAgICAgIGxldCBfcmVwbGFjZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIGlmICh0eXBlb2YgcmVwbGFjZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcmVwbGFjZXIuY2FsbCh7ICcnOiB2YWx1ZSB9LCAnJywgdmFsdWUpO1xuICAgICAgICAgICAgX3JlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyZXBsYWNlcikpIHtcbiAgICAgICAgICAgIGNvbnN0IGtleVRvU3RyID0gKHYpID0+IHR5cGVvZiB2ID09PSAnbnVtYmVyJyB8fCB2IGluc3RhbmNlb2YgU3RyaW5nIHx8IHYgaW5zdGFuY2VvZiBOdW1iZXI7XG4gICAgICAgICAgICBjb25zdCBhc1N0ciA9IHJlcGxhY2VyLmZpbHRlcihrZXlUb1N0cikubWFwKFN0cmluZyk7XG4gICAgICAgICAgICBpZiAoYXNTdHIubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICByZXBsYWNlciA9IHJlcGxhY2VyLmNvbmNhdChhc1N0cik7XG4gICAgICAgICAgICBfcmVwbGFjZXIgPSByZXBsYWNlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgJiYgcmVwbGFjZXIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSByZXBsYWNlcjtcbiAgICAgICAgICAgIHJlcGxhY2VyID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHsgYWxpYXNEdXBsaWNhdGVPYmplY3RzLCBhbmNob3JQcmVmaXgsIGZsb3csIGtlZXBVbmRlZmluZWQsIG9uVGFnT2JqLCB0YWcgfSA9IG9wdGlvbnMgPz8ge307XG4gICAgICAgIGNvbnN0IHsgb25BbmNob3IsIHNldEFuY2hvcnMsIHNvdXJjZU9iamVjdHMgfSA9IGNyZWF0ZU5vZGVBbmNob3JzKHRoaXMsIFxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3ByZWZlci1udWxsaXNoLWNvYWxlc2NpbmdcbiAgICAgICAgYW5jaG9yUHJlZml4IHx8ICdhJyk7XG4gICAgICAgIGNvbnN0IGN0eCA9IHtcbiAgICAgICAgICAgIGFsaWFzRHVwbGljYXRlT2JqZWN0czogYWxpYXNEdXBsaWNhdGVPYmplY3RzID8/IHRydWUsXG4gICAgICAgICAgICBrZWVwVW5kZWZpbmVkOiBrZWVwVW5kZWZpbmVkID8/IGZhbHNlLFxuICAgICAgICAgICAgb25BbmNob3IsXG4gICAgICAgICAgICBvblRhZ09iaixcbiAgICAgICAgICAgIHJlcGxhY2VyOiBfcmVwbGFjZXIsXG4gICAgICAgICAgICBzY2hlbWE6IHRoaXMuc2NoZW1hLFxuICAgICAgICAgICAgc291cmNlT2JqZWN0c1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBub2RlID0gY3JlYXRlTm9kZSh2YWx1ZSwgdGFnLCBjdHgpO1xuICAgICAgICBpZiAoZmxvdyAmJiBpc0NvbGxlY3Rpb24obm9kZSkpXG4gICAgICAgICAgICBub2RlLmZsb3cgPSB0cnVlO1xuICAgICAgICBzZXRBbmNob3JzKCk7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IGEga2V5IGFuZCBhIHZhbHVlIGludG8gYSBgUGFpcmAgdXNpbmcgdGhlIGN1cnJlbnQgc2NoZW1hLFxuICAgICAqIHJlY3Vyc2l2ZWx5IHdyYXBwaW5nIGFsbCB2YWx1ZXMgYXMgYFNjYWxhcmAgb3IgYENvbGxlY3Rpb25gIG5vZGVzLlxuICAgICAqL1xuICAgIGNyZWF0ZVBhaXIoa2V5LCB2YWx1ZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGsgPSB0aGlzLmNyZWF0ZU5vZGUoa2V5LCBudWxsLCBvcHRpb25zKTtcbiAgICAgICAgY29uc3QgdiA9IHRoaXMuY3JlYXRlTm9kZSh2YWx1ZSwgbnVsbCwgb3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBuZXcgUGFpcihrLCB2KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIHZhbHVlIGZyb20gdGhlIGRvY3VtZW50LlxuICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgaXRlbSB3YXMgZm91bmQgYW5kIHJlbW92ZWQuXG4gICAgICovXG4gICAgZGVsZXRlKGtleSkge1xuICAgICAgICByZXR1cm4gYXNzZXJ0Q29sbGVjdGlvbih0aGlzLmNvbnRlbnRzKSA/IHRoaXMuY29udGVudHMuZGVsZXRlKGtleSkgOiBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIHZhbHVlIGZyb20gdGhlIGRvY3VtZW50LlxuICAgICAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgaXRlbSB3YXMgZm91bmQgYW5kIHJlbW92ZWQuXG4gICAgICovXG4gICAgZGVsZXRlSW4ocGF0aCkge1xuICAgICAgICBpZiAoaXNFbXB0eVBhdGgocGF0aCkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRzID09IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBQcmVzdW1lZCBpbXBvc3NpYmxlIGlmIFN0cmljdCBleHRlbmRzIGZhbHNlXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhc3NlcnRDb2xsZWN0aW9uKHRoaXMuY29udGVudHMpXG4gICAgICAgICAgICA/IHRoaXMuY29udGVudHMuZGVsZXRlSW4ocGF0aClcbiAgICAgICAgICAgIDogZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgaXRlbSBhdCBga2V5YCwgb3IgYHVuZGVmaW5lZGAgaWYgbm90IGZvdW5kLiBCeSBkZWZhdWx0IHVud3JhcHNcbiAgICAgKiBzY2FsYXIgdmFsdWVzIGZyb20gdGhlaXIgc3Vycm91bmRpbmcgbm9kZTsgdG8gZGlzYWJsZSBzZXQgYGtlZXBTY2FsYXJgIHRvXG4gICAgICogYHRydWVgIChjb2xsZWN0aW9ucyBhcmUgYWx3YXlzIHJldHVybmVkIGludGFjdCkuXG4gICAgICovXG4gICAgZ2V0KGtleSwga2VlcFNjYWxhcikge1xuICAgICAgICByZXR1cm4gaXNDb2xsZWN0aW9uKHRoaXMuY29udGVudHMpXG4gICAgICAgICAgICA/IHRoaXMuY29udGVudHMuZ2V0KGtleSwga2VlcFNjYWxhcilcbiAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGl0ZW0gYXQgYHBhdGhgLCBvciBgdW5kZWZpbmVkYCBpZiBub3QgZm91bmQuIEJ5IGRlZmF1bHQgdW53cmFwc1xuICAgICAqIHNjYWxhciB2YWx1ZXMgZnJvbSB0aGVpciBzdXJyb3VuZGluZyBub2RlOyB0byBkaXNhYmxlIHNldCBga2VlcFNjYWxhcmAgdG9cbiAgICAgKiBgdHJ1ZWAgKGNvbGxlY3Rpb25zIGFyZSBhbHdheXMgcmV0dXJuZWQgaW50YWN0KS5cbiAgICAgKi9cbiAgICBnZXRJbihwYXRoLCBrZWVwU2NhbGFyKSB7XG4gICAgICAgIGlmIChpc0VtcHR5UGF0aChwYXRoKSlcbiAgICAgICAgICAgIHJldHVybiAha2VlcFNjYWxhciAmJiBpc1NjYWxhcih0aGlzLmNvbnRlbnRzKVxuICAgICAgICAgICAgICAgID8gdGhpcy5jb250ZW50cy52YWx1ZVxuICAgICAgICAgICAgICAgIDogdGhpcy5jb250ZW50cztcbiAgICAgICAgcmV0dXJuIGlzQ29sbGVjdGlvbih0aGlzLmNvbnRlbnRzKVxuICAgICAgICAgICAgPyB0aGlzLmNvbnRlbnRzLmdldEluKHBhdGgsIGtlZXBTY2FsYXIpXG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBkb2N1bWVudCBpbmNsdWRlcyBhIHZhbHVlIHdpdGggdGhlIGtleSBga2V5YC5cbiAgICAgKi9cbiAgICBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiBpc0NvbGxlY3Rpb24odGhpcy5jb250ZW50cykgPyB0aGlzLmNvbnRlbnRzLmhhcyhrZXkpIDogZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgZG9jdW1lbnQgaW5jbHVkZXMgYSB2YWx1ZSBhdCBgcGF0aGAuXG4gICAgICovXG4gICAgaGFzSW4ocGF0aCkge1xuICAgICAgICBpZiAoaXNFbXB0eVBhdGgocGF0aCkpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb250ZW50cyAhPT0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gaXNDb2xsZWN0aW9uKHRoaXMuY29udGVudHMpID8gdGhpcy5jb250ZW50cy5oYXNJbihwYXRoKSA6IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXRzIGEgdmFsdWUgaW4gdGhpcyBkb2N1bWVudC4gRm9yIGAhIXNldGAsIGB2YWx1ZWAgbmVlZHMgdG8gYmUgYVxuICAgICAqIGJvb2xlYW4gdG8gYWRkL3JlbW92ZSB0aGUgaXRlbSBmcm9tIHRoZSBzZXQuXG4gICAgICovXG4gICAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudHMgPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBXZSBjYW4ndCByZWFsbHkga25vdyB0aGF0IHRoaXMgbWF0Y2hlcyBDb250ZW50cy5cbiAgICAgICAgICAgIHRoaXMuY29udGVudHMgPSBjb2xsZWN0aW9uRnJvbVBhdGgodGhpcy5zY2hlbWEsIFtrZXldLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXNzZXJ0Q29sbGVjdGlvbih0aGlzLmNvbnRlbnRzKSkge1xuICAgICAgICAgICAgdGhpcy5jb250ZW50cy5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0cyBhIHZhbHVlIGluIHRoaXMgZG9jdW1lbnQuIEZvciBgISFzZXRgLCBgdmFsdWVgIG5lZWRzIHRvIGJlIGFcbiAgICAgKiBib29sZWFuIHRvIGFkZC9yZW1vdmUgdGhlIGl0ZW0gZnJvbSB0aGUgc2V0LlxuICAgICAqL1xuICAgIHNldEluKHBhdGgsIHZhbHVlKSB7XG4gICAgICAgIGlmIChpc0VtcHR5UGF0aChwYXRoKSkge1xuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBXZSBjYW4ndCByZWFsbHkga25vdyB0aGF0IHRoaXMgbWF0Y2hlcyBDb250ZW50cy5cbiAgICAgICAgICAgIHRoaXMuY29udGVudHMgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmNvbnRlbnRzID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgV2UgY2FuJ3QgcmVhbGx5IGtub3cgdGhhdCB0aGlzIG1hdGNoZXMgQ29udGVudHMuXG4gICAgICAgICAgICB0aGlzLmNvbnRlbnRzID0gY29sbGVjdGlvbkZyb21QYXRoKHRoaXMuc2NoZW1hLCBBcnJheS5mcm9tKHBhdGgpLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXNzZXJ0Q29sbGVjdGlvbih0aGlzLmNvbnRlbnRzKSkge1xuICAgICAgICAgICAgdGhpcy5jb250ZW50cy5zZXRJbihwYXRoLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBZQU1MIHZlcnNpb24gYW5kIHNjaGVtYSB1c2VkIGJ5IHRoZSBkb2N1bWVudC5cbiAgICAgKiBBIGBudWxsYCB2ZXJzaW9uIGRpc2FibGVzIHN1cHBvcnQgZm9yIGRpcmVjdGl2ZXMsIGV4cGxpY2l0IHRhZ3MsIGFuY2hvcnMsIGFuZCBhbGlhc2VzLlxuICAgICAqIEl0IGFsc28gcmVxdWlyZXMgdGhlIGBzY2hlbWFgIG9wdGlvbiB0byBiZSBnaXZlbiBhcyBhIGBTY2hlbWFgIGluc3RhbmNlIHZhbHVlLlxuICAgICAqXG4gICAgICogT3ZlcnJpZGVzIGFsbCBwcmV2aW91c2x5IHNldCBzY2hlbWEgb3B0aW9ucy5cbiAgICAgKi9cbiAgICBzZXRTY2hlbWEodmVyc2lvbiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmVyc2lvbiA9PT0gJ251bWJlcicpXG4gICAgICAgICAgICB2ZXJzaW9uID0gU3RyaW5nKHZlcnNpb24pO1xuICAgICAgICBsZXQgb3B0O1xuICAgICAgICBzd2l0Y2ggKHZlcnNpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJzEuMSc6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aXZlcylcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3RpdmVzLnlhbWwudmVyc2lvbiA9ICcxLjEnO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kaXJlY3RpdmVzID0gbmV3IERpcmVjdGl2ZXMoeyB2ZXJzaW9uOiAnMS4xJyB9KTtcbiAgICAgICAgICAgICAgICBvcHQgPSB7IHJlc29sdmVLbm93blRhZ3M6IGZhbHNlLCBzY2hlbWE6ICd5YW1sLTEuMScgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJzEuMic6XG4gICAgICAgICAgICBjYXNlICduZXh0JzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXJlY3RpdmVzKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRpcmVjdGl2ZXMueWFtbC52ZXJzaW9uID0gdmVyc2lvbjtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGlyZWN0aXZlcyA9IG5ldyBEaXJlY3RpdmVzKHsgdmVyc2lvbiB9KTtcbiAgICAgICAgICAgICAgICBvcHQgPSB7IHJlc29sdmVLbm93blRhZ3M6IHRydWUsIHNjaGVtYTogJ2NvcmUnIH07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIG51bGw6XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aXZlcylcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZGlyZWN0aXZlcztcbiAgICAgICAgICAgICAgICBvcHQgPSBudWxsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN2ID0gSlNPTi5zdHJpbmdpZnkodmVyc2lvbik7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCAnMS4xJywgJzEuMicgb3IgbnVsbCBhcyBmaXJzdCBhcmd1bWVudCwgYnV0IGZvdW5kOiAke3N2fWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE5vdCB1c2luZyBgaW5zdGFuY2VvZiBTY2hlbWFgIHRvIGFsbG93IGZvciBkdWNrIHR5cGluZ1xuICAgICAgICBpZiAob3B0aW9ucy5zY2hlbWEgaW5zdGFuY2VvZiBPYmplY3QpXG4gICAgICAgICAgICB0aGlzLnNjaGVtYSA9IG9wdGlvbnMuc2NoZW1hO1xuICAgICAgICBlbHNlIGlmIChvcHQpXG4gICAgICAgICAgICB0aGlzLnNjaGVtYSA9IG5ldyBTY2hlbWEoT2JqZWN0LmFzc2lnbihvcHQsIG9wdGlvbnMpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaXRoIGEgbnVsbCBZQU1MIHZlcnNpb24sIHRoZSB7IHNjaGVtYTogU2NoZW1hIH0gb3B0aW9uIGlzIHJlcXVpcmVkYCk7XG4gICAgfVxuICAgIC8vIGpzb24gJiBqc29uQXJnIGFyZSBvbmx5IHVzZWQgZnJvbSB0b0pTT04oKVxuICAgIHRvSlMoeyBqc29uLCBqc29uQXJnLCBtYXBBc01hcCwgbWF4QWxpYXNDb3VudCwgb25BbmNob3IsIHJldml2ZXIgfSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGN0eCA9IHtcbiAgICAgICAgICAgIGFuY2hvcnM6IG5ldyBNYXAoKSxcbiAgICAgICAgICAgIGRvYzogdGhpcyxcbiAgICAgICAgICAgIGtlZXA6ICFqc29uLFxuICAgICAgICAgICAgbWFwQXNNYXA6IG1hcEFzTWFwID09PSB0cnVlLFxuICAgICAgICAgICAgbWFwS2V5V2FybmVkOiBmYWxzZSxcbiAgICAgICAgICAgIG1heEFsaWFzQ291bnQ6IHR5cGVvZiBtYXhBbGlhc0NvdW50ID09PSAnbnVtYmVyJyA/IG1heEFsaWFzQ291bnQgOiAxMDBcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVzID0gdG9KUyh0aGlzLmNvbnRlbnRzLCBqc29uQXJnID8/ICcnLCBjdHgpO1xuICAgICAgICBpZiAodHlwZW9mIG9uQW5jaG9yID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgZm9yIChjb25zdCB7IGNvdW50LCByZXMgfSBvZiBjdHguYW5jaG9ycy52YWx1ZXMoKSlcbiAgICAgICAgICAgICAgICBvbkFuY2hvcihyZXMsIGNvdW50KTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiByZXZpdmVyID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICA/IGFwcGx5UmV2aXZlcihyZXZpdmVyLCB7ICcnOiByZXMgfSwgJycsIHJlcylcbiAgICAgICAgICAgIDogcmVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGRvY3VtZW50IGBjb250ZW50c2AuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ganNvbkFyZyBVc2VkIGJ5IGBKU09OLnN0cmluZ2lmeWAgdG8gaW5kaWNhdGUgdGhlIGFycmF5IGluZGV4IG9yXG4gICAgICogICBwcm9wZXJ0eSBuYW1lLlxuICAgICAqL1xuICAgIHRvSlNPTihqc29uQXJnLCBvbkFuY2hvcikge1xuICAgICAgICByZXR1cm4gdGhpcy50b0pTKHsganNvbjogdHJ1ZSwganNvbkFyZywgbWFwQXNNYXA6IGZhbHNlLCBvbkFuY2hvciB9KTtcbiAgICB9XG4gICAgLyoqIEEgWUFNTCByZXByZXNlbnRhdGlvbiBvZiB0aGUgZG9jdW1lbnQuICovXG4gICAgdG9TdHJpbmcob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEb2N1bWVudCB3aXRoIGVycm9ycyBjYW5ub3QgYmUgc3RyaW5naWZpZWQnKTtcbiAgICAgICAgaWYgKCdpbmRlbnQnIGluIG9wdGlvbnMgJiZcbiAgICAgICAgICAgICghTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zLmluZGVudCkgfHwgTnVtYmVyKG9wdGlvbnMuaW5kZW50KSA8PSAwKSkge1xuICAgICAgICAgICAgY29uc3QgcyA9IEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuaW5kZW50KTtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgXCJpbmRlbnRcIiBvcHRpb24gbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXIsIG5vdCAke3N9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cmluZ2lmeURvY3VtZW50KHRoaXMsIG9wdGlvbnMpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFzc2VydENvbGxlY3Rpb24oY29udGVudHMpIHtcbiAgICBpZiAoaXNDb2xsZWN0aW9uKGNvbnRlbnRzKSlcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBhIFlBTUwgY29sbGVjdGlvbiBhcyBkb2N1bWVudCBjb250ZW50cycpO1xufVxuXG5leHBvcnQgeyBEb2N1bWVudCB9O1xuIiwgImNsYXNzIFlBTUxFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBwb3MsIGNvZGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgfVxufVxuY2xhc3MgWUFNTFBhcnNlRXJyb3IgZXh0ZW5kcyBZQU1MRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKHBvcywgY29kZSwgbWVzc2FnZSkge1xuICAgICAgICBzdXBlcignWUFNTFBhcnNlRXJyb3InLCBwb3MsIGNvZGUsIG1lc3NhZ2UpO1xuICAgIH1cbn1cbmNsYXNzIFlBTUxXYXJuaW5nIGV4dGVuZHMgWUFNTEVycm9yIHtcbiAgICBjb25zdHJ1Y3Rvcihwb3MsIGNvZGUsIG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIoJ1lBTUxXYXJuaW5nJywgcG9zLCBjb2RlLCBtZXNzYWdlKTtcbiAgICB9XG59XG5jb25zdCBwcmV0dGlmeUVycm9yID0gKHNyYywgbGMpID0+IChlcnJvcikgPT4ge1xuICAgIGlmIChlcnJvci5wb3NbMF0gPT09IC0xKVxuICAgICAgICByZXR1cm47XG4gICAgZXJyb3IubGluZVBvcyA9IGVycm9yLnBvcy5tYXAocG9zID0+IGxjLmxpbmVQb3MocG9zKSk7XG4gICAgY29uc3QgeyBsaW5lLCBjb2wgfSA9IGVycm9yLmxpbmVQb3NbMF07XG4gICAgZXJyb3IubWVzc2FnZSArPSBgIGF0IGxpbmUgJHtsaW5lfSwgY29sdW1uICR7Y29sfWA7XG4gICAgbGV0IGNpID0gY29sIC0gMTtcbiAgICBsZXQgbGluZVN0ciA9IHNyY1xuICAgICAgICAuc3Vic3RyaW5nKGxjLmxpbmVTdGFydHNbbGluZSAtIDFdLCBsYy5saW5lU3RhcnRzW2xpbmVdKVxuICAgICAgICAucmVwbGFjZSgvW1xcblxccl0rJC8sICcnKTtcbiAgICAvLyBUcmltIHRvIG1heCA4MCBjaGFycywga2VlcGluZyBjb2wgcG9zaXRpb24gbmVhciB0aGUgbWlkZGxlXG4gICAgaWYgKGNpID49IDYwICYmIGxpbmVTdHIubGVuZ3RoID4gODApIHtcbiAgICAgICAgY29uc3QgdHJpbVN0YXJ0ID0gTWF0aC5taW4oY2kgLSAzOSwgbGluZVN0ci5sZW5ndGggLSA3OSk7XG4gICAgICAgIGxpbmVTdHIgPSAnXHUyMDI2JyArIGxpbmVTdHIuc3Vic3RyaW5nKHRyaW1TdGFydCk7XG4gICAgICAgIGNpIC09IHRyaW1TdGFydCAtIDE7XG4gICAgfVxuICAgIGlmIChsaW5lU3RyLmxlbmd0aCA+IDgwKVxuICAgICAgICBsaW5lU3RyID0gbGluZVN0ci5zdWJzdHJpbmcoMCwgNzkpICsgJ1x1MjAyNic7XG4gICAgLy8gSW5jbHVkZSBwcmV2aW91cyBsaW5lIGluIGNvbnRleHQgaWYgcG9pbnRpbmcgYXQgbGluZSBzdGFydFxuICAgIGlmIChsaW5lID4gMSAmJiAvXiAqJC8udGVzdChsaW5lU3RyLnN1YnN0cmluZygwLCBjaSkpKSB7XG4gICAgICAgIC8vIFJlZ2V4cCB3b24ndCBtYXRjaCBpZiBzdGFydCBpcyB0cmltbWVkXG4gICAgICAgIGxldCBwcmV2ID0gc3JjLnN1YnN0cmluZyhsYy5saW5lU3RhcnRzW2xpbmUgLSAyXSwgbGMubGluZVN0YXJ0c1tsaW5lIC0gMV0pO1xuICAgICAgICBpZiAocHJldi5sZW5ndGggPiA4MClcbiAgICAgICAgICAgIHByZXYgPSBwcmV2LnN1YnN0cmluZygwLCA3OSkgKyAnXHUyMDI2XFxuJztcbiAgICAgICAgbGluZVN0ciA9IHByZXYgKyBsaW5lU3RyO1xuICAgIH1cbiAgICBpZiAoL1teIF0vLnRlc3QobGluZVN0cikpIHtcbiAgICAgICAgbGV0IGNvdW50ID0gMTtcbiAgICAgICAgY29uc3QgZW5kID0gZXJyb3IubGluZVBvc1sxXTtcbiAgICAgICAgaWYgKGVuZD8ubGluZSA9PT0gbGluZSAmJiBlbmQuY29sID4gY29sKSB7XG4gICAgICAgICAgICBjb3VudCA9IE1hdGgubWF4KDEsIE1hdGgubWluKGVuZC5jb2wgLSBjb2wsIDgwIC0gY2kpKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwb2ludGVyID0gJyAnLnJlcGVhdChjaSkgKyAnXicucmVwZWF0KGNvdW50KTtcbiAgICAgICAgZXJyb3IubWVzc2FnZSArPSBgOlxcblxcbiR7bGluZVN0cn1cXG4ke3BvaW50ZXJ9XFxuYDtcbiAgICB9XG59O1xuXG5leHBvcnQgeyBZQU1MRXJyb3IsIFlBTUxQYXJzZUVycm9yLCBZQU1MV2FybmluZywgcHJldHRpZnlFcnJvciB9O1xuIiwgImZ1bmN0aW9uIHJlc29sdmVQcm9wcyh0b2tlbnMsIHsgZmxvdywgaW5kaWNhdG9yLCBuZXh0LCBvZmZzZXQsIG9uRXJyb3IsIHBhcmVudEluZGVudCwgc3RhcnRPbk5ld2xpbmUgfSkge1xuICAgIGxldCBzcGFjZUJlZm9yZSA9IGZhbHNlO1xuICAgIGxldCBhdE5ld2xpbmUgPSBzdGFydE9uTmV3bGluZTtcbiAgICBsZXQgaGFzU3BhY2UgPSBzdGFydE9uTmV3bGluZTtcbiAgICBsZXQgY29tbWVudCA9ICcnO1xuICAgIGxldCBjb21tZW50U2VwID0gJyc7XG4gICAgbGV0IGhhc05ld2xpbmUgPSBmYWxzZTtcbiAgICBsZXQgcmVxU3BhY2UgPSBmYWxzZTtcbiAgICBsZXQgdGFiID0gbnVsbDtcbiAgICBsZXQgYW5jaG9yID0gbnVsbDtcbiAgICBsZXQgdGFnID0gbnVsbDtcbiAgICBsZXQgbmV3bGluZUFmdGVyUHJvcCA9IG51bGw7XG4gICAgbGV0IGNvbW1hID0gbnVsbDtcbiAgICBsZXQgZm91bmQgPSBudWxsO1xuICAgIGxldCBzdGFydCA9IG51bGw7XG4gICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnMpIHtcbiAgICAgICAgaWYgKHJlcVNwYWNlKSB7XG4gICAgICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gJ3NwYWNlJyAmJlxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgIT09ICduZXdsaW5lJyAmJlxuICAgICAgICAgICAgICAgIHRva2VuLnR5cGUgIT09ICdjb21tYScpXG4gICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbi5vZmZzZXQsICdNSVNTSU5HX0NIQVInLCAnVGFncyBhbmQgYW5jaG9ycyBtdXN0IGJlIHNlcGFyYXRlZCBmcm9tIHRoZSBuZXh0IHRva2VuIGJ5IHdoaXRlIHNwYWNlJyk7XG4gICAgICAgICAgICByZXFTcGFjZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0YWIpIHtcbiAgICAgICAgICAgIGlmIChhdE5ld2xpbmUgJiYgdG9rZW4udHlwZSAhPT0gJ2NvbW1lbnQnICYmIHRva2VuLnR5cGUgIT09ICduZXdsaW5lJykge1xuICAgICAgICAgICAgICAgIG9uRXJyb3IodGFiLCAnVEFCX0FTX0lOREVOVCcsICdUYWJzIGFyZSBub3QgYWxsb3dlZCBhcyBpbmRlbnRhdGlvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFiID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICAvLyBBdCB0aGUgZG9jIGxldmVsLCB0YWJzIGF0IGxpbmUgc3RhcnQgbWF5IGJlIHBhcnNlZFxuICAgICAgICAgICAgICAgIC8vIGFzIGxlYWRpbmcgd2hpdGUgc3BhY2UgcmF0aGVyIHRoYW4gaW5kZW50YXRpb24uXG4gICAgICAgICAgICAgICAgLy8gSW4gYSBmbG93IGNvbGxlY3Rpb24sIG9ubHkgdGhlIHBhcnNlciBoYW5kbGVzIGluZGVudC5cbiAgICAgICAgICAgICAgICBpZiAoIWZsb3cgJiZcbiAgICAgICAgICAgICAgICAgICAgKGluZGljYXRvciAhPT0gJ2RvYy1zdGFydCcgfHwgbmV4dD8udHlwZSAhPT0gJ2Zsb3ctY29sbGVjdGlvbicpICYmXG4gICAgICAgICAgICAgICAgICAgIHRva2VuLnNvdXJjZS5pbmNsdWRlcygnXFx0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFiID0gdG9rZW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGhhc1NwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOiB7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNTcGFjZSlcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ01JU1NJTkdfQ0hBUicsICdDb21tZW50cyBtdXN0IGJlIHNlcGFyYXRlZCBmcm9tIG90aGVyIHRva2VucyBieSB3aGl0ZSBzcGFjZSBjaGFyYWN0ZXJzJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2IgPSB0b2tlbi5zb3VyY2Uuc3Vic3RyaW5nKDEpIHx8ICcgJztcbiAgICAgICAgICAgICAgICBpZiAoIWNvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBjYjtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgKz0gY29tbWVudFNlcCArIGNiO1xuICAgICAgICAgICAgICAgIGNvbW1lbnRTZXAgPSAnJztcbiAgICAgICAgICAgICAgICBhdE5ld2xpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgIGlmIChhdE5ld2xpbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50ICs9IHRva2VuLnNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIWZvdW5kIHx8IGluZGljYXRvciAhPT0gJ3NlcS1pdGVtLWluZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZUJlZm9yZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudFNlcCArPSB0b2tlbi5zb3VyY2U7XG4gICAgICAgICAgICAgICAgYXROZXdsaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBoYXNOZXdsaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoYW5jaG9yIHx8IHRhZylcbiAgICAgICAgICAgICAgICAgICAgbmV3bGluZUFmdGVyUHJvcCA9IHRva2VuO1xuICAgICAgICAgICAgICAgIGhhc1NwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvcic6XG4gICAgICAgICAgICAgICAgaWYgKGFuY2hvcilcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ01VTFRJUExFX0FOQ0hPUlMnLCAnQSBub2RlIGNhbiBoYXZlIGF0IG1vc3Qgb25lIGFuY2hvcicpO1xuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5zb3VyY2UuZW5kc1dpdGgoJzonKSlcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcih0b2tlbi5vZmZzZXQgKyB0b2tlbi5zb3VyY2UubGVuZ3RoIC0gMSwgJ0JBRF9BTElBUycsICdBbmNob3IgZW5kaW5nIGluIDogaXMgYW1iaWd1b3VzJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgYW5jaG9yID0gdG9rZW47XG4gICAgICAgICAgICAgICAgc3RhcnQgPz8gKHN0YXJ0ID0gdG9rZW4ub2Zmc2V0KTtcbiAgICAgICAgICAgICAgICBhdE5ld2xpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBoYXNTcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlcVNwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3RhZyc6IHtcbiAgICAgICAgICAgICAgICBpZiAodGFnKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnTVVMVElQTEVfVEFHUycsICdBIG5vZGUgY2FuIGhhdmUgYXQgbW9zdCBvbmUgdGFnJyk7XG4gICAgICAgICAgICAgICAgdGFnID0gdG9rZW47XG4gICAgICAgICAgICAgICAgc3RhcnQgPz8gKHN0YXJ0ID0gdG9rZW4ub2Zmc2V0KTtcbiAgICAgICAgICAgICAgICBhdE5ld2xpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBoYXNTcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlcVNwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgaW5kaWNhdG9yOlxuICAgICAgICAgICAgICAgIC8vIENvdWxkIGhlcmUgaGFuZGxlIHByZWNlZGluZyBjb21tZW50cyBkaWZmZXJlbnRseVxuICAgICAgICAgICAgICAgIGlmIChhbmNob3IgfHwgdGFnKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnQkFEX1BST1BfT1JERVInLCBgQW5jaG9ycyBhbmQgdGFncyBtdXN0IGJlIGFmdGVyIHRoZSAke3Rva2VuLnNvdXJjZX0gaW5kaWNhdG9yYCk7XG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnVU5FWFBFQ1RFRF9UT0tFTicsIGBVbmV4cGVjdGVkICR7dG9rZW4uc291cmNlfSBpbiAke2Zsb3cgPz8gJ2NvbGxlY3Rpb24nfWApO1xuICAgICAgICAgICAgICAgIGZvdW5kID0gdG9rZW47XG4gICAgICAgICAgICAgICAgYXROZXdsaW5lID1cbiAgICAgICAgICAgICAgICAgICAgaW5kaWNhdG9yID09PSAnc2VxLWl0ZW0taW5kJyB8fCBpbmRpY2F0b3IgPT09ICdleHBsaWNpdC1rZXktaW5kJztcbiAgICAgICAgICAgICAgICBoYXNTcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29tbWEnOlxuICAgICAgICAgICAgICAgIGlmIChmbG93KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tYSlcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdVTkVYUEVDVEVEX1RPS0VOJywgYFVuZXhwZWN0ZWQgLCBpbiAke2Zsb3d9YCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1hID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIGF0TmV3bGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBoYXNTcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBlbHNlIGZhbGx0aHJvdWdoXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdVTkVYUEVDVEVEX1RPS0VOJywgYFVuZXhwZWN0ZWQgJHt0b2tlbi50eXBlfSB0b2tlbmApO1xuICAgICAgICAgICAgICAgIGF0TmV3bGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGhhc1NwYWNlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbGFzdCA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgZW5kID0gbGFzdCA/IGxhc3Qub2Zmc2V0ICsgbGFzdC5zb3VyY2UubGVuZ3RoIDogb2Zmc2V0O1xuICAgIGlmIChyZXFTcGFjZSAmJlxuICAgICAgICBuZXh0ICYmXG4gICAgICAgIG5leHQudHlwZSAhPT0gJ3NwYWNlJyAmJlxuICAgICAgICBuZXh0LnR5cGUgIT09ICduZXdsaW5lJyAmJlxuICAgICAgICBuZXh0LnR5cGUgIT09ICdjb21tYScgJiZcbiAgICAgICAgKG5leHQudHlwZSAhPT0gJ3NjYWxhcicgfHwgbmV4dC5zb3VyY2UgIT09ICcnKSkge1xuICAgICAgICBvbkVycm9yKG5leHQub2Zmc2V0LCAnTUlTU0lOR19DSEFSJywgJ1RhZ3MgYW5kIGFuY2hvcnMgbXVzdCBiZSBzZXBhcmF0ZWQgZnJvbSB0aGUgbmV4dCB0b2tlbiBieSB3aGl0ZSBzcGFjZScpO1xuICAgIH1cbiAgICBpZiAodGFiICYmXG4gICAgICAgICgoYXROZXdsaW5lICYmIHRhYi5pbmRlbnQgPD0gcGFyZW50SW5kZW50KSB8fFxuICAgICAgICAgICAgbmV4dD8udHlwZSA9PT0gJ2Jsb2NrLW1hcCcgfHxcbiAgICAgICAgICAgIG5leHQ/LnR5cGUgPT09ICdibG9jay1zZXEnKSlcbiAgICAgICAgb25FcnJvcih0YWIsICdUQUJfQVNfSU5ERU5UJywgJ1RhYnMgYXJlIG5vdCBhbGxvd2VkIGFzIGluZGVudGF0aW9uJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29tbWEsXG4gICAgICAgIGZvdW5kLFxuICAgICAgICBzcGFjZUJlZm9yZSxcbiAgICAgICAgY29tbWVudCxcbiAgICAgICAgaGFzTmV3bGluZSxcbiAgICAgICAgYW5jaG9yLFxuICAgICAgICB0YWcsXG4gICAgICAgIG5ld2xpbmVBZnRlclByb3AsXG4gICAgICAgIGVuZCxcbiAgICAgICAgc3RhcnQ6IHN0YXJ0ID8/IGVuZFxuICAgIH07XG59XG5cbmV4cG9ydCB7IHJlc29sdmVQcm9wcyB9O1xuIiwgImZ1bmN0aW9uIGNvbnRhaW5zTmV3bGluZShrZXkpIHtcbiAgICBpZiAoIWtleSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgc3dpdGNoIChrZXkudHlwZSkge1xuICAgICAgICBjYXNlICdhbGlhcyc6XG4gICAgICAgIGNhc2UgJ3NjYWxhcic6XG4gICAgICAgIGNhc2UgJ2RvdWJsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgY2FzZSAnc2luZ2xlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICAgICAgaWYgKGtleS5zb3VyY2UuaW5jbHVkZXMoJ1xcbicpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgaWYgKGtleS5lbmQpXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBzdCBvZiBrZXkuZW5kKVxuICAgICAgICAgICAgICAgICAgICBpZiAoc3QudHlwZSA9PT0gJ25ld2xpbmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNhc2UgJ2Zsb3ctY29sbGVjdGlvbic6XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0IG9mIGtleS5pdGVtcykge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc3Qgb2YgaXQuc3RhcnQpXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdC50eXBlID09PSAnbmV3bGluZScpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoaXQuc2VwKVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHN0IG9mIGl0LnNlcClcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdC50eXBlID09PSAnbmV3bGluZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5zTmV3bGluZShpdC5rZXkpIHx8IGNvbnRhaW5zTmV3bGluZShpdC52YWx1ZSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgeyBjb250YWluc05ld2xpbmUgfTtcbiIsICJpbXBvcnQgeyBjb250YWluc05ld2xpbmUgfSBmcm9tICcuL3V0aWwtY29udGFpbnMtbmV3bGluZS5qcyc7XG5cbmZ1bmN0aW9uIGZsb3dJbmRlbnRDaGVjayhpbmRlbnQsIGZjLCBvbkVycm9yKSB7XG4gICAgaWYgKGZjPy50eXBlID09PSAnZmxvdy1jb2xsZWN0aW9uJykge1xuICAgICAgICBjb25zdCBlbmQgPSBmYy5lbmRbMF07XG4gICAgICAgIGlmIChlbmQuaW5kZW50ID09PSBpbmRlbnQgJiZcbiAgICAgICAgICAgIChlbmQuc291cmNlID09PSAnXScgfHwgZW5kLnNvdXJjZSA9PT0gJ30nKSAmJlxuICAgICAgICAgICAgY29udGFpbnNOZXdsaW5lKGZjKSkge1xuICAgICAgICAgICAgY29uc3QgbXNnID0gJ0Zsb3cgZW5kIGluZGljYXRvciBzaG91bGQgYmUgbW9yZSBpbmRlbnRlZCB0aGFuIHBhcmVudCc7XG4gICAgICAgICAgICBvbkVycm9yKGVuZCwgJ0JBRF9JTkRFTlQnLCBtc2csIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgeyBmbG93SW5kZW50Q2hlY2sgfTtcbiIsICJpbXBvcnQgeyBpc1NjYWxhciB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcblxuZnVuY3Rpb24gbWFwSW5jbHVkZXMoY3R4LCBpdGVtcywgc2VhcmNoKSB7XG4gICAgY29uc3QgeyB1bmlxdWVLZXlzIH0gPSBjdHgub3B0aW9ucztcbiAgICBpZiAodW5pcXVlS2V5cyA9PT0gZmFsc2UpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBpc0VxdWFsID0gdHlwZW9mIHVuaXF1ZUtleXMgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyB1bmlxdWVLZXlzXG4gICAgICAgIDogKGEsIGIpID0+IGEgPT09IGIgfHwgKGlzU2NhbGFyKGEpICYmIGlzU2NhbGFyKGIpICYmIGEudmFsdWUgPT09IGIudmFsdWUpO1xuICAgIHJldHVybiBpdGVtcy5zb21lKHBhaXIgPT4gaXNFcXVhbChwYWlyLmtleSwgc2VhcmNoKSk7XG59XG5cbmV4cG9ydCB7IG1hcEluY2x1ZGVzIH07XG4iLCAiaW1wb3J0IHsgUGFpciB9IGZyb20gJy4uL25vZGVzL1BhaXIuanMnO1xuaW1wb3J0IHsgWUFNTE1hcCB9IGZyb20gJy4uL25vZGVzL1lBTUxNYXAuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZVByb3BzIH0gZnJvbSAnLi9yZXNvbHZlLXByb3BzLmpzJztcbmltcG9ydCB7IGNvbnRhaW5zTmV3bGluZSB9IGZyb20gJy4vdXRpbC1jb250YWlucy1uZXdsaW5lLmpzJztcbmltcG9ydCB7IGZsb3dJbmRlbnRDaGVjayB9IGZyb20gJy4vdXRpbC1mbG93LWluZGVudC1jaGVjay5qcyc7XG5pbXBvcnQgeyBtYXBJbmNsdWRlcyB9IGZyb20gJy4vdXRpbC1tYXAtaW5jbHVkZXMuanMnO1xuXG5jb25zdCBzdGFydENvbE1zZyA9ICdBbGwgbWFwcGluZyBpdGVtcyBtdXN0IHN0YXJ0IGF0IHRoZSBzYW1lIGNvbHVtbic7XG5mdW5jdGlvbiByZXNvbHZlQmxvY2tNYXAoeyBjb21wb3NlTm9kZSwgY29tcG9zZUVtcHR5Tm9kZSB9LCBjdHgsIGJtLCBvbkVycm9yLCB0YWcpIHtcbiAgICBjb25zdCBOb2RlQ2xhc3MgPSB0YWc/Lm5vZGVDbGFzcyA/PyBZQU1MTWFwO1xuICAgIGNvbnN0IG1hcCA9IG5ldyBOb2RlQ2xhc3MoY3R4LnNjaGVtYSk7XG4gICAgaWYgKGN0eC5hdFJvb3QpXG4gICAgICAgIGN0eC5hdFJvb3QgPSBmYWxzZTtcbiAgICBsZXQgb2Zmc2V0ID0gYm0ub2Zmc2V0O1xuICAgIGxldCBjb21tZW50RW5kID0gbnVsbDtcbiAgICBmb3IgKGNvbnN0IGNvbGxJdGVtIG9mIGJtLml0ZW1zKSB7XG4gICAgICAgIGNvbnN0IHsgc3RhcnQsIGtleSwgc2VwLCB2YWx1ZSB9ID0gY29sbEl0ZW07XG4gICAgICAgIC8vIGtleSBwcm9wZXJ0aWVzXG4gICAgICAgIGNvbnN0IGtleVByb3BzID0gcmVzb2x2ZVByb3BzKHN0YXJ0LCB7XG4gICAgICAgICAgICBpbmRpY2F0b3I6ICdleHBsaWNpdC1rZXktaW5kJyxcbiAgICAgICAgICAgIG5leHQ6IGtleSA/PyBzZXA/LlswXSxcbiAgICAgICAgICAgIG9mZnNldCxcbiAgICAgICAgICAgIG9uRXJyb3IsXG4gICAgICAgICAgICBwYXJlbnRJbmRlbnQ6IGJtLmluZGVudCxcbiAgICAgICAgICAgIHN0YXJ0T25OZXdsaW5lOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBpbXBsaWNpdEtleSA9ICFrZXlQcm9wcy5mb3VuZDtcbiAgICAgICAgaWYgKGltcGxpY2l0S2V5KSB7XG4gICAgICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleS50eXBlID09PSAnYmxvY2stc2VxJylcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihvZmZzZXQsICdCTE9DS19BU19JTVBMSUNJVF9LRVknLCAnQSBibG9jayBzZXF1ZW5jZSBtYXkgbm90IGJlIHVzZWQgYXMgYW4gaW1wbGljaXQgbWFwIGtleScpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKCdpbmRlbnQnIGluIGtleSAmJiBrZXkuaW5kZW50ICE9PSBibS5pbmRlbnQpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3Iob2Zmc2V0LCAnQkFEX0lOREVOVCcsIHN0YXJ0Q29sTXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgha2V5UHJvcHMuYW5jaG9yICYmICFrZXlQcm9wcy50YWcgJiYgIXNlcCkge1xuICAgICAgICAgICAgICAgIGNvbW1lbnRFbmQgPSBrZXlQcm9wcy5lbmQ7XG4gICAgICAgICAgICAgICAgaWYgKGtleVByb3BzLmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hcC5jb21tZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwLmNvbW1lbnQgKz0gJ1xcbicgKyBrZXlQcm9wcy5jb21tZW50O1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAuY29tbWVudCA9IGtleVByb3BzLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGtleVByb3BzLm5ld2xpbmVBZnRlclByb3AgfHwgY29udGFpbnNOZXdsaW5lKGtleSkpIHtcbiAgICAgICAgICAgICAgICBvbkVycm9yKGtleSA/PyBzdGFydFtzdGFydC5sZW5ndGggLSAxXSwgJ01VTFRJTElORV9JTVBMSUNJVF9LRVknLCAnSW1wbGljaXQga2V5cyBuZWVkIHRvIGJlIG9uIGEgc2luZ2xlIGxpbmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChrZXlQcm9wcy5mb3VuZD8uaW5kZW50ICE9PSBibS5pbmRlbnQpIHtcbiAgICAgICAgICAgIG9uRXJyb3Iob2Zmc2V0LCAnQkFEX0lOREVOVCcsIHN0YXJ0Q29sTXNnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBrZXkgdmFsdWVcbiAgICAgICAgY3R4LmF0S2V5ID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qga2V5U3RhcnQgPSBrZXlQcm9wcy5lbmQ7XG4gICAgICAgIGNvbnN0IGtleU5vZGUgPSBrZXlcbiAgICAgICAgICAgID8gY29tcG9zZU5vZGUoY3R4LCBrZXksIGtleVByb3BzLCBvbkVycm9yKVxuICAgICAgICAgICAgOiBjb21wb3NlRW1wdHlOb2RlKGN0eCwga2V5U3RhcnQsIHN0YXJ0LCBudWxsLCBrZXlQcm9wcywgb25FcnJvcik7XG4gICAgICAgIGlmIChjdHguc2NoZW1hLmNvbXBhdClcbiAgICAgICAgICAgIGZsb3dJbmRlbnRDaGVjayhibS5pbmRlbnQsIGtleSwgb25FcnJvcik7XG4gICAgICAgIGN0eC5hdEtleSA9IGZhbHNlO1xuICAgICAgICBpZiAobWFwSW5jbHVkZXMoY3R4LCBtYXAuaXRlbXMsIGtleU5vZGUpKVxuICAgICAgICAgICAgb25FcnJvcihrZXlTdGFydCwgJ0RVUExJQ0FURV9LRVknLCAnTWFwIGtleXMgbXVzdCBiZSB1bmlxdWUnKTtcbiAgICAgICAgLy8gdmFsdWUgcHJvcGVydGllc1xuICAgICAgICBjb25zdCB2YWx1ZVByb3BzID0gcmVzb2x2ZVByb3BzKHNlcCA/PyBbXSwge1xuICAgICAgICAgICAgaW5kaWNhdG9yOiAnbWFwLXZhbHVlLWluZCcsXG4gICAgICAgICAgICBuZXh0OiB2YWx1ZSxcbiAgICAgICAgICAgIG9mZnNldDoga2V5Tm9kZS5yYW5nZVsyXSxcbiAgICAgICAgICAgIG9uRXJyb3IsXG4gICAgICAgICAgICBwYXJlbnRJbmRlbnQ6IGJtLmluZGVudCxcbiAgICAgICAgICAgIHN0YXJ0T25OZXdsaW5lOiAha2V5IHx8IGtleS50eXBlID09PSAnYmxvY2stc2NhbGFyJ1xuICAgICAgICB9KTtcbiAgICAgICAgb2Zmc2V0ID0gdmFsdWVQcm9wcy5lbmQ7XG4gICAgICAgIGlmICh2YWx1ZVByb3BzLmZvdW5kKSB7XG4gICAgICAgICAgICBpZiAoaW1wbGljaXRLZXkpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWU/LnR5cGUgPT09ICdibG9jay1tYXAnICYmICF2YWx1ZVByb3BzLmhhc05ld2xpbmUpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3Iob2Zmc2V0LCAnQkxPQ0tfQVNfSU1QTElDSVRfS0VZJywgJ05lc3RlZCBtYXBwaW5ncyBhcmUgbm90IGFsbG93ZWQgaW4gY29tcGFjdCBtYXBwaW5ncycpO1xuICAgICAgICAgICAgICAgIGlmIChjdHgub3B0aW9ucy5zdHJpY3QgJiZcbiAgICAgICAgICAgICAgICAgICAga2V5UHJvcHMuc3RhcnQgPCB2YWx1ZVByb3BzLmZvdW5kLm9mZnNldCAtIDEwMjQpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3Ioa2V5Tm9kZS5yYW5nZSwgJ0tFWV9PVkVSXzEwMjRfQ0hBUlMnLCAnVGhlIDogaW5kaWNhdG9yIG11c3QgYmUgYXQgbW9zdCAxMDI0IGNoYXJzIGFmdGVyIHRoZSBzdGFydCBvZiBhbiBpbXBsaWNpdCBibG9jayBtYXBwaW5nIGtleScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdmFsdWUgdmFsdWVcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlTm9kZSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgPyBjb21wb3NlTm9kZShjdHgsIHZhbHVlLCB2YWx1ZVByb3BzLCBvbkVycm9yKVxuICAgICAgICAgICAgICAgIDogY29tcG9zZUVtcHR5Tm9kZShjdHgsIG9mZnNldCwgc2VwLCBudWxsLCB2YWx1ZVByb3BzLCBvbkVycm9yKTtcbiAgICAgICAgICAgIGlmIChjdHguc2NoZW1hLmNvbXBhdClcbiAgICAgICAgICAgICAgICBmbG93SW5kZW50Q2hlY2soYm0uaW5kZW50LCB2YWx1ZSwgb25FcnJvcik7XG4gICAgICAgICAgICBvZmZzZXQgPSB2YWx1ZU5vZGUucmFuZ2VbMl07XG4gICAgICAgICAgICBjb25zdCBwYWlyID0gbmV3IFBhaXIoa2V5Tm9kZSwgdmFsdWVOb2RlKTtcbiAgICAgICAgICAgIGlmIChjdHgub3B0aW9ucy5rZWVwU291cmNlVG9rZW5zKVxuICAgICAgICAgICAgICAgIHBhaXIuc3JjVG9rZW4gPSBjb2xsSXRlbTtcbiAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHBhaXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8ga2V5IHdpdGggbm8gdmFsdWVcbiAgICAgICAgICAgIGlmIChpbXBsaWNpdEtleSlcbiAgICAgICAgICAgICAgICBvbkVycm9yKGtleU5vZGUucmFuZ2UsICdNSVNTSU5HX0NIQVInLCAnSW1wbGljaXQgbWFwIGtleXMgbmVlZCB0byBiZSBmb2xsb3dlZCBieSBtYXAgdmFsdWVzJyk7XG4gICAgICAgICAgICBpZiAodmFsdWVQcm9wcy5jb21tZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGtleU5vZGUuY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAga2V5Tm9kZS5jb21tZW50ICs9ICdcXG4nICsgdmFsdWVQcm9wcy5jb21tZW50O1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAga2V5Tm9kZS5jb21tZW50ID0gdmFsdWVQcm9wcy5jb21tZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcGFpciA9IG5ldyBQYWlyKGtleU5vZGUpO1xuICAgICAgICAgICAgaWYgKGN0eC5vcHRpb25zLmtlZXBTb3VyY2VUb2tlbnMpXG4gICAgICAgICAgICAgICAgcGFpci5zcmNUb2tlbiA9IGNvbGxJdGVtO1xuICAgICAgICAgICAgbWFwLml0ZW1zLnB1c2gocGFpcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNvbW1lbnRFbmQgJiYgY29tbWVudEVuZCA8IG9mZnNldClcbiAgICAgICAgb25FcnJvcihjb21tZW50RW5kLCAnSU1QT1NTSUJMRScsICdNYXAgY29tbWVudCB3aXRoIHRyYWlsaW5nIGNvbnRlbnQnKTtcbiAgICBtYXAucmFuZ2UgPSBbYm0ub2Zmc2V0LCBvZmZzZXQsIGNvbW1lbnRFbmQgPz8gb2Zmc2V0XTtcbiAgICByZXR1cm4gbWFwO1xufVxuXG5leHBvcnQgeyByZXNvbHZlQmxvY2tNYXAgfTtcbiIsICJpbXBvcnQgeyBZQU1MU2VxIH0gZnJvbSAnLi4vbm9kZXMvWUFNTFNlcS5qcyc7XG5pbXBvcnQgeyByZXNvbHZlUHJvcHMgfSBmcm9tICcuL3Jlc29sdmUtcHJvcHMuanMnO1xuaW1wb3J0IHsgZmxvd0luZGVudENoZWNrIH0gZnJvbSAnLi91dGlsLWZsb3ctaW5kZW50LWNoZWNrLmpzJztcblxuZnVuY3Rpb24gcmVzb2x2ZUJsb2NrU2VxKHsgY29tcG9zZU5vZGUsIGNvbXBvc2VFbXB0eU5vZGUgfSwgY3R4LCBicywgb25FcnJvciwgdGFnKSB7XG4gICAgY29uc3QgTm9kZUNsYXNzID0gdGFnPy5ub2RlQ2xhc3MgPz8gWUFNTFNlcTtcbiAgICBjb25zdCBzZXEgPSBuZXcgTm9kZUNsYXNzKGN0eC5zY2hlbWEpO1xuICAgIGlmIChjdHguYXRSb290KVxuICAgICAgICBjdHguYXRSb290ID0gZmFsc2U7XG4gICAgaWYgKGN0eC5hdEtleSlcbiAgICAgICAgY3R4LmF0S2V5ID0gZmFsc2U7XG4gICAgbGV0IG9mZnNldCA9IGJzLm9mZnNldDtcbiAgICBsZXQgY29tbWVudEVuZCA9IG51bGw7XG4gICAgZm9yIChjb25zdCB7IHN0YXJ0LCB2YWx1ZSB9IG9mIGJzLml0ZW1zKSB7XG4gICAgICAgIGNvbnN0IHByb3BzID0gcmVzb2x2ZVByb3BzKHN0YXJ0LCB7XG4gICAgICAgICAgICBpbmRpY2F0b3I6ICdzZXEtaXRlbS1pbmQnLFxuICAgICAgICAgICAgbmV4dDogdmFsdWUsXG4gICAgICAgICAgICBvZmZzZXQsXG4gICAgICAgICAgICBvbkVycm9yLFxuICAgICAgICAgICAgcGFyZW50SW5kZW50OiBicy5pbmRlbnQsXG4gICAgICAgICAgICBzdGFydE9uTmV3bGluZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFwcm9wcy5mb3VuZCkge1xuICAgICAgICAgICAgaWYgKHByb3BzLmFuY2hvciB8fCBwcm9wcy50YWcgfHwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWU/LnR5cGUgPT09ICdibG9jay1zZXEnKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHByb3BzLmVuZCwgJ0JBRF9JTkRFTlQnLCAnQWxsIHNlcXVlbmNlIGl0ZW1zIG11c3Qgc3RhcnQgYXQgdGhlIHNhbWUgY29sdW1uJyk7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKG9mZnNldCwgJ01JU1NJTkdfQ0hBUicsICdTZXF1ZW5jZSBpdGVtIHdpdGhvdXQgLSBpbmRpY2F0b3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbW1lbnRFbmQgPSBwcm9wcy5lbmQ7XG4gICAgICAgICAgICAgICAgaWYgKHByb3BzLmNvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgIHNlcS5jb21tZW50ID0gcHJvcHMuY29tbWVudDtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub2RlID0gdmFsdWVcbiAgICAgICAgICAgID8gY29tcG9zZU5vZGUoY3R4LCB2YWx1ZSwgcHJvcHMsIG9uRXJyb3IpXG4gICAgICAgICAgICA6IGNvbXBvc2VFbXB0eU5vZGUoY3R4LCBwcm9wcy5lbmQsIHN0YXJ0LCBudWxsLCBwcm9wcywgb25FcnJvcik7XG4gICAgICAgIGlmIChjdHguc2NoZW1hLmNvbXBhdClcbiAgICAgICAgICAgIGZsb3dJbmRlbnRDaGVjayhicy5pbmRlbnQsIHZhbHVlLCBvbkVycm9yKTtcbiAgICAgICAgb2Zmc2V0ID0gbm9kZS5yYW5nZVsyXTtcbiAgICAgICAgc2VxLml0ZW1zLnB1c2gobm9kZSk7XG4gICAgfVxuICAgIHNlcS5yYW5nZSA9IFticy5vZmZzZXQsIG9mZnNldCwgY29tbWVudEVuZCA/PyBvZmZzZXRdO1xuICAgIHJldHVybiBzZXE7XG59XG5cbmV4cG9ydCB7IHJlc29sdmVCbG9ja1NlcSB9O1xuIiwgImZ1bmN0aW9uIHJlc29sdmVFbmQoZW5kLCBvZmZzZXQsIHJlcVNwYWNlLCBvbkVycm9yKSB7XG4gICAgbGV0IGNvbW1lbnQgPSAnJztcbiAgICBpZiAoZW5kKSB7XG4gICAgICAgIGxldCBoYXNTcGFjZSA9IGZhbHNlO1xuICAgICAgICBsZXQgc2VwID0gJyc7XG4gICAgICAgIGZvciAoY29uc3QgdG9rZW4gb2YgZW5kKSB7XG4gICAgICAgICAgICBjb25zdCB7IHNvdXJjZSwgdHlwZSB9ID0gdG9rZW47XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICAgICAgICAgIGhhc1NwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcVNwYWNlICYmICFoYXNTcGFjZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdNSVNTSU5HX0NIQVInLCAnQ29tbWVudHMgbXVzdCBiZSBzZXBhcmF0ZWQgZnJvbSBvdGhlciB0b2tlbnMgYnkgd2hpdGUgc3BhY2UgY2hhcmFjdGVycycpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYiA9IHNvdXJjZS5zdWJzdHJpbmcoMSkgfHwgJyAnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50ID0gY2I7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQgKz0gc2VwICsgY2I7XG4gICAgICAgICAgICAgICAgICAgIHNlcCA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21tZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VwICs9IHNvdXJjZTtcbiAgICAgICAgICAgICAgICAgICAgaGFzU3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnVU5FWFBFQ1RFRF9UT0tFTicsIGBVbmV4cGVjdGVkICR7dHlwZX0gYXQgbm9kZSBlbmRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9mZnNldCArPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IGNvbW1lbnQsIG9mZnNldCB9O1xufVxuXG5leHBvcnQgeyByZXNvbHZlRW5kIH07XG4iLCAiaW1wb3J0IHsgaXNQYWlyIH0gZnJvbSAnLi4vbm9kZXMvaWRlbnRpdHkuanMnO1xuaW1wb3J0IHsgUGFpciB9IGZyb20gJy4uL25vZGVzL1BhaXIuanMnO1xuaW1wb3J0IHsgWUFNTE1hcCB9IGZyb20gJy4uL25vZGVzL1lBTUxNYXAuanMnO1xuaW1wb3J0IHsgWUFNTFNlcSB9IGZyb20gJy4uL25vZGVzL1lBTUxTZXEuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZUVuZCB9IGZyb20gJy4vcmVzb2x2ZS1lbmQuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZVByb3BzIH0gZnJvbSAnLi9yZXNvbHZlLXByb3BzLmpzJztcbmltcG9ydCB7IGNvbnRhaW5zTmV3bGluZSB9IGZyb20gJy4vdXRpbC1jb250YWlucy1uZXdsaW5lLmpzJztcbmltcG9ydCB7IG1hcEluY2x1ZGVzIH0gZnJvbSAnLi91dGlsLW1hcC1pbmNsdWRlcy5qcyc7XG5cbmNvbnN0IGJsb2NrTXNnID0gJ0Jsb2NrIGNvbGxlY3Rpb25zIGFyZSBub3QgYWxsb3dlZCB3aXRoaW4gZmxvdyBjb2xsZWN0aW9ucyc7XG5jb25zdCBpc0Jsb2NrID0gKHRva2VuKSA9PiB0b2tlbiAmJiAodG9rZW4udHlwZSA9PT0gJ2Jsb2NrLW1hcCcgfHwgdG9rZW4udHlwZSA9PT0gJ2Jsb2NrLXNlcScpO1xuZnVuY3Rpb24gcmVzb2x2ZUZsb3dDb2xsZWN0aW9uKHsgY29tcG9zZU5vZGUsIGNvbXBvc2VFbXB0eU5vZGUgfSwgY3R4LCBmYywgb25FcnJvciwgdGFnKSB7XG4gICAgY29uc3QgaXNNYXAgPSBmYy5zdGFydC5zb3VyY2UgPT09ICd7JztcbiAgICBjb25zdCBmY05hbWUgPSBpc01hcCA/ICdmbG93IG1hcCcgOiAnZmxvdyBzZXF1ZW5jZSc7XG4gICAgY29uc3QgTm9kZUNsYXNzID0gKHRhZz8ubm9kZUNsYXNzID8/IChpc01hcCA/IFlBTUxNYXAgOiBZQU1MU2VxKSk7XG4gICAgY29uc3QgY29sbCA9IG5ldyBOb2RlQ2xhc3MoY3R4LnNjaGVtYSk7XG4gICAgY29sbC5mbG93ID0gdHJ1ZTtcbiAgICBjb25zdCBhdFJvb3QgPSBjdHguYXRSb290O1xuICAgIGlmIChhdFJvb3QpXG4gICAgICAgIGN0eC5hdFJvb3QgPSBmYWxzZTtcbiAgICBpZiAoY3R4LmF0S2V5KVxuICAgICAgICBjdHguYXRLZXkgPSBmYWxzZTtcbiAgICBsZXQgb2Zmc2V0ID0gZmMub2Zmc2V0ICsgZmMuc3RhcnQuc291cmNlLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZjLml0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IGNvbGxJdGVtID0gZmMuaXRlbXNbaV07XG4gICAgICAgIGNvbnN0IHsgc3RhcnQsIGtleSwgc2VwLCB2YWx1ZSB9ID0gY29sbEl0ZW07XG4gICAgICAgIGNvbnN0IHByb3BzID0gcmVzb2x2ZVByb3BzKHN0YXJ0LCB7XG4gICAgICAgICAgICBmbG93OiBmY05hbWUsXG4gICAgICAgICAgICBpbmRpY2F0b3I6ICdleHBsaWNpdC1rZXktaW5kJyxcbiAgICAgICAgICAgIG5leHQ6IGtleSA/PyBzZXA/LlswXSxcbiAgICAgICAgICAgIG9mZnNldCxcbiAgICAgICAgICAgIG9uRXJyb3IsXG4gICAgICAgICAgICBwYXJlbnRJbmRlbnQ6IGZjLmluZGVudCxcbiAgICAgICAgICAgIHN0YXJ0T25OZXdsaW5lOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFwcm9wcy5mb3VuZCkge1xuICAgICAgICAgICAgaWYgKCFwcm9wcy5hbmNob3IgJiYgIXByb3BzLnRhZyAmJiAhc2VwICYmICF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChpID09PSAwICYmIHByb3BzLmNvbW1hKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHByb3BzLmNvbW1hLCAnVU5FWFBFQ1RFRF9UT0tFTicsIGBVbmV4cGVjdGVkICwgaW4gJHtmY05hbWV9YCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaSA8IGZjLml0ZW1zLmxlbmd0aCAtIDEpXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IocHJvcHMuc3RhcnQsICdVTkVYUEVDVEVEX1RPS0VOJywgYFVuZXhwZWN0ZWQgZW1wdHkgaXRlbSBpbiAke2ZjTmFtZX1gKTtcbiAgICAgICAgICAgICAgICBpZiAocHJvcHMuY29tbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sbC5jb21tZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbC5jb21tZW50ICs9ICdcXG4nICsgcHJvcHMuY29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbC5jb21tZW50ID0gcHJvcHMuY29tbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gcHJvcHMuZW5kO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc01hcCAmJiBjdHgub3B0aW9ucy5zdHJpY3QgJiYgY29udGFpbnNOZXdsaW5lKGtleSkpXG4gICAgICAgICAgICAgICAgb25FcnJvcihrZXksIC8vIGNoZWNrZWQgYnkgY29udGFpbnNOZXdsaW5lKClcbiAgICAgICAgICAgICAgICAnTVVMVElMSU5FX0lNUExJQ0lUX0tFWScsICdJbXBsaWNpdCBrZXlzIG9mIGZsb3cgc2VxdWVuY2UgcGFpcnMgbmVlZCB0byBiZSBvbiBhIHNpbmdsZSBsaW5lJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChwcm9wcy5jb21tYSlcbiAgICAgICAgICAgICAgICBvbkVycm9yKHByb3BzLmNvbW1hLCAnVU5FWFBFQ1RFRF9UT0tFTicsIGBVbmV4cGVjdGVkICwgaW4gJHtmY05hbWV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXByb3BzLmNvbW1hKVxuICAgICAgICAgICAgICAgIG9uRXJyb3IocHJvcHMuc3RhcnQsICdNSVNTSU5HX0NIQVInLCBgTWlzc2luZyAsIGJldHdlZW4gJHtmY05hbWV9IGl0ZW1zYCk7XG4gICAgICAgICAgICBpZiAocHJvcHMuY29tbWVudCkge1xuICAgICAgICAgICAgICAgIGxldCBwcmV2SXRlbUNvbW1lbnQgPSAnJztcbiAgICAgICAgICAgICAgICBsb29wOiBmb3IgKGNvbnN0IHN0IG9mIHN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoc3QudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29tbWEnOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldkl0ZW1Db21tZW50ID0gc3Quc291cmNlLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwcmV2SXRlbUNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHByZXYgPSBjb2xsLml0ZW1zW2NvbGwuaXRlbXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1BhaXIocHJldikpXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2ID0gcHJldi52YWx1ZSA/PyBwcmV2LmtleTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXYuY29tbWVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZXYuY29tbWVudCArPSAnXFxuJyArIHByZXZJdGVtQ29tbWVudDtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcHJldi5jb21tZW50ID0gcHJldkl0ZW1Db21tZW50O1xuICAgICAgICAgICAgICAgICAgICBwcm9wcy5jb21tZW50ID0gcHJvcHMuY29tbWVudC5zdWJzdHJpbmcocHJldkl0ZW1Db21tZW50Lmxlbmd0aCArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzTWFwICYmICFzZXAgJiYgIXByb3BzLmZvdW5kKSB7XG4gICAgICAgICAgICAvLyBpdGVtIGlzIGEgdmFsdWUgaW4gYSBzZXFcbiAgICAgICAgICAgIC8vIFx1MjE5MiBrZXkgJiBzZXAgYXJlIGVtcHR5LCBzdGFydCBkb2VzIG5vdCBpbmNsdWRlID8gb3IgOlxuICAgICAgICAgICAgY29uc3QgdmFsdWVOb2RlID0gdmFsdWVcbiAgICAgICAgICAgICAgICA/IGNvbXBvc2VOb2RlKGN0eCwgdmFsdWUsIHByb3BzLCBvbkVycm9yKVxuICAgICAgICAgICAgICAgIDogY29tcG9zZUVtcHR5Tm9kZShjdHgsIHByb3BzLmVuZCwgc2VwLCBudWxsLCBwcm9wcywgb25FcnJvcik7XG4gICAgICAgICAgICBjb2xsLml0ZW1zLnB1c2godmFsdWVOb2RlKTtcbiAgICAgICAgICAgIG9mZnNldCA9IHZhbHVlTm9kZS5yYW5nZVsyXTtcbiAgICAgICAgICAgIGlmIChpc0Jsb2NrKHZhbHVlKSlcbiAgICAgICAgICAgICAgICBvbkVycm9yKHZhbHVlTm9kZS5yYW5nZSwgJ0JMT0NLX0lOX0ZMT1cnLCBibG9ja01zZyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBpdGVtIGlzIGEga2V5K3ZhbHVlIHBhaXJcbiAgICAgICAgICAgIC8vIGtleSB2YWx1ZVxuICAgICAgICAgICAgY3R4LmF0S2V5ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IGtleVN0YXJ0ID0gcHJvcHMuZW5kO1xuICAgICAgICAgICAgY29uc3Qga2V5Tm9kZSA9IGtleVxuICAgICAgICAgICAgICAgID8gY29tcG9zZU5vZGUoY3R4LCBrZXksIHByb3BzLCBvbkVycm9yKVxuICAgICAgICAgICAgICAgIDogY29tcG9zZUVtcHR5Tm9kZShjdHgsIGtleVN0YXJ0LCBzdGFydCwgbnVsbCwgcHJvcHMsIG9uRXJyb3IpO1xuICAgICAgICAgICAgaWYgKGlzQmxvY2soa2V5KSlcbiAgICAgICAgICAgICAgICBvbkVycm9yKGtleU5vZGUucmFuZ2UsICdCTE9DS19JTl9GTE9XJywgYmxvY2tNc2cpO1xuICAgICAgICAgICAgY3R4LmF0S2V5ID0gZmFsc2U7XG4gICAgICAgICAgICAvLyB2YWx1ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgICBjb25zdCB2YWx1ZVByb3BzID0gcmVzb2x2ZVByb3BzKHNlcCA/PyBbXSwge1xuICAgICAgICAgICAgICAgIGZsb3c6IGZjTmFtZSxcbiAgICAgICAgICAgICAgICBpbmRpY2F0b3I6ICdtYXAtdmFsdWUtaW5kJyxcbiAgICAgICAgICAgICAgICBuZXh0OiB2YWx1ZSxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IGtleU5vZGUucmFuZ2VbMl0sXG4gICAgICAgICAgICAgICAgb25FcnJvcixcbiAgICAgICAgICAgICAgICBwYXJlbnRJbmRlbnQ6IGZjLmluZGVudCxcbiAgICAgICAgICAgICAgICBzdGFydE9uTmV3bGluZTogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHZhbHVlUHJvcHMuZm91bmQpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTWFwICYmICFwcm9wcy5mb3VuZCAmJiBjdHgub3B0aW9ucy5zdHJpY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlcClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3Qgc3Qgb2Ygc2VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0ID09PSB2YWx1ZVByb3BzLmZvdW5kKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3QudHlwZSA9PT0gJ25ld2xpbmUnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uRXJyb3Ioc3QsICdNVUxUSUxJTkVfSU1QTElDSVRfS0VZJywgJ0ltcGxpY2l0IGtleXMgb2YgZmxvdyBzZXF1ZW5jZSBwYWlycyBuZWVkIHRvIGJlIG9uIGEgc2luZ2xlIGxpbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcHMuc3RhcnQgPCB2YWx1ZVByb3BzLmZvdW5kLm9mZnNldCAtIDEwMjQpXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHZhbHVlUHJvcHMuZm91bmQsICdLRVlfT1ZFUl8xMDI0X0NIQVJTJywgJ1RoZSA6IGluZGljYXRvciBtdXN0IGJlIGF0IG1vc3QgMTAyNCBjaGFycyBhZnRlciB0aGUgc3RhcnQgb2YgYW4gaW1wbGljaXQgZmxvdyBzZXF1ZW5jZSBrZXknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICgnc291cmNlJyBpbiB2YWx1ZSAmJiB2YWx1ZS5zb3VyY2U/LlswXSA9PT0gJzonKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHZhbHVlLCAnTUlTU0lOR19DSEFSJywgYE1pc3Npbmcgc3BhY2UgYWZ0ZXIgOiBpbiAke2ZjTmFtZX1gKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IodmFsdWVQcm9wcy5zdGFydCwgJ01JU1NJTkdfQ0hBUicsIGBNaXNzaW5nICwgb3IgOiBiZXR3ZWVuICR7ZmNOYW1lfSBpdGVtc2ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdmFsdWUgdmFsdWVcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlTm9kZSA9IHZhbHVlXG4gICAgICAgICAgICAgICAgPyBjb21wb3NlTm9kZShjdHgsIHZhbHVlLCB2YWx1ZVByb3BzLCBvbkVycm9yKVxuICAgICAgICAgICAgICAgIDogdmFsdWVQcm9wcy5mb3VuZFxuICAgICAgICAgICAgICAgICAgICA/IGNvbXBvc2VFbXB0eU5vZGUoY3R4LCB2YWx1ZVByb3BzLmVuZCwgc2VwLCBudWxsLCB2YWx1ZVByb3BzLCBvbkVycm9yKVxuICAgICAgICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgICAgICBpZiAodmFsdWVOb2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQmxvY2sodmFsdWUpKVxuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHZhbHVlTm9kZS5yYW5nZSwgJ0JMT0NLX0lOX0ZMT1cnLCBibG9ja01zZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWx1ZVByb3BzLmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5Tm9kZS5jb21tZW50KVxuICAgICAgICAgICAgICAgICAgICBrZXlOb2RlLmNvbW1lbnQgKz0gJ1xcbicgKyB2YWx1ZVByb3BzLmNvbW1lbnQ7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBrZXlOb2RlLmNvbW1lbnQgPSB2YWx1ZVByb3BzLmNvbW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBwYWlyID0gbmV3IFBhaXIoa2V5Tm9kZSwgdmFsdWVOb2RlKTtcbiAgICAgICAgICAgIGlmIChjdHgub3B0aW9ucy5rZWVwU291cmNlVG9rZW5zKVxuICAgICAgICAgICAgICAgIHBhaXIuc3JjVG9rZW4gPSBjb2xsSXRlbTtcbiAgICAgICAgICAgIGlmIChpc01hcCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IGNvbGw7XG4gICAgICAgICAgICAgICAgaWYgKG1hcEluY2x1ZGVzKGN0eCwgbWFwLml0ZW1zLCBrZXlOb2RlKSlcbiAgICAgICAgICAgICAgICAgICAgb25FcnJvcihrZXlTdGFydCwgJ0RVUExJQ0FURV9LRVknLCAnTWFwIGtleXMgbXVzdCBiZSB1bmlxdWUnKTtcbiAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaChwYWlyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1hcCA9IG5ldyBZQU1MTWFwKGN0eC5zY2hlbWEpO1xuICAgICAgICAgICAgICAgIG1hcC5mbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaChwYWlyKTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRSYW5nZSA9ICh2YWx1ZU5vZGUgPz8ga2V5Tm9kZSkucmFuZ2U7XG4gICAgICAgICAgICAgICAgbWFwLnJhbmdlID0gW2tleU5vZGUucmFuZ2VbMF0sIGVuZFJhbmdlWzFdLCBlbmRSYW5nZVsyXV07XG4gICAgICAgICAgICAgICAgY29sbC5pdGVtcy5wdXNoKG1hcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvZmZzZXQgPSB2YWx1ZU5vZGUgPyB2YWx1ZU5vZGUucmFuZ2VbMl0gOiB2YWx1ZVByb3BzLmVuZDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBleHBlY3RlZEVuZCA9IGlzTWFwID8gJ30nIDogJ10nO1xuICAgIGNvbnN0IFtjZSwgLi4uZWVdID0gZmMuZW5kO1xuICAgIGxldCBjZVBvcyA9IG9mZnNldDtcbiAgICBpZiAoY2U/LnNvdXJjZSA9PT0gZXhwZWN0ZWRFbmQpXG4gICAgICAgIGNlUG9zID0gY2Uub2Zmc2V0ICsgY2Uuc291cmNlLmxlbmd0aDtcbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IGZjTmFtZVswXS50b1VwcGVyQ2FzZSgpICsgZmNOYW1lLnN1YnN0cmluZygxKTtcbiAgICAgICAgY29uc3QgbXNnID0gYXRSb290XG4gICAgICAgICAgICA/IGAke25hbWV9IG11c3QgZW5kIHdpdGggYSAke2V4cGVjdGVkRW5kfWBcbiAgICAgICAgICAgIDogYCR7bmFtZX0gaW4gYmxvY2sgY29sbGVjdGlvbiBtdXN0IGJlIHN1ZmZpY2llbnRseSBpbmRlbnRlZCBhbmQgZW5kIHdpdGggYSAke2V4cGVjdGVkRW5kfWA7XG4gICAgICAgIG9uRXJyb3Iob2Zmc2V0LCBhdFJvb3QgPyAnTUlTU0lOR19DSEFSJyA6ICdCQURfSU5ERU5UJywgbXNnKTtcbiAgICAgICAgaWYgKGNlICYmIGNlLnNvdXJjZS5sZW5ndGggIT09IDEpXG4gICAgICAgICAgICBlZS51bnNoaWZ0KGNlKTtcbiAgICB9XG4gICAgaWYgKGVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgZW5kID0gcmVzb2x2ZUVuZChlZSwgY2VQb3MsIGN0eC5vcHRpb25zLnN0cmljdCwgb25FcnJvcik7XG4gICAgICAgIGlmIChlbmQuY29tbWVudCkge1xuICAgICAgICAgICAgaWYgKGNvbGwuY29tbWVudClcbiAgICAgICAgICAgICAgICBjb2xsLmNvbW1lbnQgKz0gJ1xcbicgKyBlbmQuY29tbWVudDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjb2xsLmNvbW1lbnQgPSBlbmQuY29tbWVudDtcbiAgICAgICAgfVxuICAgICAgICBjb2xsLnJhbmdlID0gW2ZjLm9mZnNldCwgY2VQb3MsIGVuZC5vZmZzZXRdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29sbC5yYW5nZSA9IFtmYy5vZmZzZXQsIGNlUG9zLCBjZVBvc107XG4gICAgfVxuICAgIHJldHVybiBjb2xsO1xufVxuXG5leHBvcnQgeyByZXNvbHZlRmxvd0NvbGxlY3Rpb24gfTtcbiIsICJpbXBvcnQgeyBpc05vZGUgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBTY2FsYXIgfSBmcm9tICcuLi9ub2Rlcy9TY2FsYXIuanMnO1xuaW1wb3J0IHsgWUFNTE1hcCB9IGZyb20gJy4uL25vZGVzL1lBTUxNYXAuanMnO1xuaW1wb3J0IHsgWUFNTFNlcSB9IGZyb20gJy4uL25vZGVzL1lBTUxTZXEuanMnO1xuaW1wb3J0IHsgcmVzb2x2ZUJsb2NrTWFwIH0gZnJvbSAnLi9yZXNvbHZlLWJsb2NrLW1hcC5qcyc7XG5pbXBvcnQgeyByZXNvbHZlQmxvY2tTZXEgfSBmcm9tICcuL3Jlc29sdmUtYmxvY2stc2VxLmpzJztcbmltcG9ydCB7IHJlc29sdmVGbG93Q29sbGVjdGlvbiB9IGZyb20gJy4vcmVzb2x2ZS1mbG93LWNvbGxlY3Rpb24uanMnO1xuXG5mdW5jdGlvbiByZXNvbHZlQ29sbGVjdGlvbihDTiwgY3R4LCB0b2tlbiwgb25FcnJvciwgdGFnTmFtZSwgdGFnKSB7XG4gICAgY29uc3QgY29sbCA9IHRva2VuLnR5cGUgPT09ICdibG9jay1tYXAnXG4gICAgICAgID8gcmVzb2x2ZUJsb2NrTWFwKENOLCBjdHgsIHRva2VuLCBvbkVycm9yLCB0YWcpXG4gICAgICAgIDogdG9rZW4udHlwZSA9PT0gJ2Jsb2NrLXNlcSdcbiAgICAgICAgICAgID8gcmVzb2x2ZUJsb2NrU2VxKENOLCBjdHgsIHRva2VuLCBvbkVycm9yLCB0YWcpXG4gICAgICAgICAgICA6IHJlc29sdmVGbG93Q29sbGVjdGlvbihDTiwgY3R4LCB0b2tlbiwgb25FcnJvciwgdGFnKTtcbiAgICBjb25zdCBDb2xsID0gY29sbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBJZiB3ZSBnb3QgYSB0YWdOYW1lIG1hdGNoaW5nIHRoZSBjbGFzcywgb3IgdGhlIHRhZyBuYW1lIGlzICchJyxcbiAgICAvLyB0aGVuIHVzZSB0aGUgdGFnTmFtZSBmcm9tIHRoZSBub2RlIGNsYXNzIHVzZWQgdG8gY3JlYXRlIGl0LlxuICAgIGlmICh0YWdOYW1lID09PSAnIScgfHwgdGFnTmFtZSA9PT0gQ29sbC50YWdOYW1lKSB7XG4gICAgICAgIGNvbGwudGFnID0gQ29sbC50YWdOYW1lO1xuICAgICAgICByZXR1cm4gY29sbDtcbiAgICB9XG4gICAgaWYgKHRhZ05hbWUpXG4gICAgICAgIGNvbGwudGFnID0gdGFnTmFtZTtcbiAgICByZXR1cm4gY29sbDtcbn1cbmZ1bmN0aW9uIGNvbXBvc2VDb2xsZWN0aW9uKENOLCBjdHgsIHRva2VuLCBwcm9wcywgb25FcnJvcikge1xuICAgIGNvbnN0IHRhZ1Rva2VuID0gcHJvcHMudGFnO1xuICAgIGNvbnN0IHRhZ05hbWUgPSAhdGFnVG9rZW5cbiAgICAgICAgPyBudWxsXG4gICAgICAgIDogY3R4LmRpcmVjdGl2ZXMudGFnTmFtZSh0YWdUb2tlbi5zb3VyY2UsIG1zZyA9PiBvbkVycm9yKHRhZ1Rva2VuLCAnVEFHX1JFU09MVkVfRkFJTEVEJywgbXNnKSk7XG4gICAgaWYgKHRva2VuLnR5cGUgPT09ICdibG9jay1zZXEnKSB7XG4gICAgICAgIGNvbnN0IHsgYW5jaG9yLCBuZXdsaW5lQWZ0ZXJQcm9wOiBubCB9ID0gcHJvcHM7XG4gICAgICAgIGNvbnN0IGxhc3RQcm9wID0gYW5jaG9yICYmIHRhZ1Rva2VuXG4gICAgICAgICAgICA/IGFuY2hvci5vZmZzZXQgPiB0YWdUb2tlbi5vZmZzZXRcbiAgICAgICAgICAgICAgICA/IGFuY2hvclxuICAgICAgICAgICAgICAgIDogdGFnVG9rZW5cbiAgICAgICAgICAgIDogKGFuY2hvciA/PyB0YWdUb2tlbik7XG4gICAgICAgIGlmIChsYXN0UHJvcCAmJiAoIW5sIHx8IG5sLm9mZnNldCA8IGxhc3RQcm9wLm9mZnNldCkpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnTWlzc2luZyBuZXdsaW5lIGFmdGVyIGJsb2NrIHNlcXVlbmNlIHByb3BzJztcbiAgICAgICAgICAgIG9uRXJyb3IobGFzdFByb3AsICdNSVNTSU5HX0NIQVInLCBtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBleHBUeXBlID0gdG9rZW4udHlwZSA9PT0gJ2Jsb2NrLW1hcCdcbiAgICAgICAgPyAnbWFwJ1xuICAgICAgICA6IHRva2VuLnR5cGUgPT09ICdibG9jay1zZXEnXG4gICAgICAgICAgICA/ICdzZXEnXG4gICAgICAgICAgICA6IHRva2VuLnN0YXJ0LnNvdXJjZSA9PT0gJ3snXG4gICAgICAgICAgICAgICAgPyAnbWFwJ1xuICAgICAgICAgICAgICAgIDogJ3NlcSc7XG4gICAgLy8gc2hvcnRjdXQ6IGNoZWNrIGlmIGl0J3MgYSBnZW5lcmljIFlBTUxNYXAgb3IgWUFNTFNlcVxuICAgIC8vIGJlZm9yZSBqdW1waW5nIGludG8gdGhlIGN1c3RvbSB0YWcgbG9naWMuXG4gICAgaWYgKCF0YWdUb2tlbiB8fFxuICAgICAgICAhdGFnTmFtZSB8fFxuICAgICAgICB0YWdOYW1lID09PSAnIScgfHxcbiAgICAgICAgKHRhZ05hbWUgPT09IFlBTUxNYXAudGFnTmFtZSAmJiBleHBUeXBlID09PSAnbWFwJykgfHxcbiAgICAgICAgKHRhZ05hbWUgPT09IFlBTUxTZXEudGFnTmFtZSAmJiBleHBUeXBlID09PSAnc2VxJykpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVDb2xsZWN0aW9uKENOLCBjdHgsIHRva2VuLCBvbkVycm9yLCB0YWdOYW1lKTtcbiAgICB9XG4gICAgbGV0IHRhZyA9IGN0eC5zY2hlbWEudGFncy5maW5kKHQgPT4gdC50YWcgPT09IHRhZ05hbWUgJiYgdC5jb2xsZWN0aW9uID09PSBleHBUeXBlKTtcbiAgICBpZiAoIXRhZykge1xuICAgICAgICBjb25zdCBrdCA9IGN0eC5zY2hlbWEua25vd25UYWdzW3RhZ05hbWVdO1xuICAgICAgICBpZiAoa3Q/LmNvbGxlY3Rpb24gPT09IGV4cFR5cGUpIHtcbiAgICAgICAgICAgIGN0eC5zY2hlbWEudGFncy5wdXNoKE9iamVjdC5hc3NpZ24oe30sIGt0LCB7IGRlZmF1bHQ6IGZhbHNlIH0pKTtcbiAgICAgICAgICAgIHRhZyA9IGt0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGt0KSB7XG4gICAgICAgICAgICAgICAgb25FcnJvcih0YWdUb2tlbiwgJ0JBRF9DT0xMRUNUSU9OX1RZUEUnLCBgJHtrdC50YWd9IHVzZWQgZm9yICR7ZXhwVHlwZX0gY29sbGVjdGlvbiwgYnV0IGV4cGVjdHMgJHtrdC5jb2xsZWN0aW9uID8/ICdzY2FsYXInfWAsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb25FcnJvcih0YWdUb2tlbiwgJ1RBR19SRVNPTFZFX0ZBSUxFRCcsIGBVbnJlc29sdmVkIHRhZzogJHt0YWdOYW1lfWAsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVDb2xsZWN0aW9uKENOLCBjdHgsIHRva2VuLCBvbkVycm9yLCB0YWdOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBjb2xsID0gcmVzb2x2ZUNvbGxlY3Rpb24oQ04sIGN0eCwgdG9rZW4sIG9uRXJyb3IsIHRhZ05hbWUsIHRhZyk7XG4gICAgY29uc3QgcmVzID0gdGFnLnJlc29sdmU/Lihjb2xsLCBtc2cgPT4gb25FcnJvcih0YWdUb2tlbiwgJ1RBR19SRVNPTFZFX0ZBSUxFRCcsIG1zZyksIGN0eC5vcHRpb25zKSA/PyBjb2xsO1xuICAgIGNvbnN0IG5vZGUgPSBpc05vZGUocmVzKVxuICAgICAgICA/IHJlc1xuICAgICAgICA6IG5ldyBTY2FsYXIocmVzKTtcbiAgICBub2RlLnJhbmdlID0gY29sbC5yYW5nZTtcbiAgICBub2RlLnRhZyA9IHRhZ05hbWU7XG4gICAgaWYgKHRhZz8uZm9ybWF0KVxuICAgICAgICBub2RlLmZvcm1hdCA9IHRhZy5mb3JtYXQ7XG4gICAgcmV0dXJuIG5vZGU7XG59XG5cbmV4cG9ydCB7IGNvbXBvc2VDb2xsZWN0aW9uIH07XG4iLCAiaW1wb3J0IHsgU2NhbGFyIH0gZnJvbSAnLi4vbm9kZXMvU2NhbGFyLmpzJztcblxuZnVuY3Rpb24gcmVzb2x2ZUJsb2NrU2NhbGFyKGN0eCwgc2NhbGFyLCBvbkVycm9yKSB7XG4gICAgY29uc3Qgc3RhcnQgPSBzY2FsYXIub2Zmc2V0O1xuICAgIGNvbnN0IGhlYWRlciA9IHBhcnNlQmxvY2tTY2FsYXJIZWFkZXIoc2NhbGFyLCBjdHgub3B0aW9ucy5zdHJpY3QsIG9uRXJyb3IpO1xuICAgIGlmICghaGVhZGVyKVxuICAgICAgICByZXR1cm4geyB2YWx1ZTogJycsIHR5cGU6IG51bGwsIGNvbW1lbnQ6ICcnLCByYW5nZTogW3N0YXJ0LCBzdGFydCwgc3RhcnRdIH07XG4gICAgY29uc3QgdHlwZSA9IGhlYWRlci5tb2RlID09PSAnPicgPyBTY2FsYXIuQkxPQ0tfRk9MREVEIDogU2NhbGFyLkJMT0NLX0xJVEVSQUw7XG4gICAgY29uc3QgbGluZXMgPSBzY2FsYXIuc291cmNlID8gc3BsaXRMaW5lcyhzY2FsYXIuc291cmNlKSA6IFtdO1xuICAgIC8vIGRldGVybWluZSB0aGUgZW5kIG9mIGNvbnRlbnQgJiBzdGFydCBvZiBjaG9tcGluZ1xuICAgIGxldCBjaG9tcFN0YXJ0ID0gbGluZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSBsaW5lcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICBjb25zdCBjb250ZW50ID0gbGluZXNbaV1bMV07XG4gICAgICAgIGlmIChjb250ZW50ID09PSAnJyB8fCBjb250ZW50ID09PSAnXFxyJylcbiAgICAgICAgICAgIGNob21wU3RhcnQgPSBpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgLy8gc2hvcnRjdXQgZm9yIGVtcHR5IGNvbnRlbnRzXG4gICAgaWYgKGNob21wU3RhcnQgPT09IDApIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBoZWFkZXIuY2hvbXAgPT09ICcrJyAmJiBsaW5lcy5sZW5ndGggPiAwXG4gICAgICAgICAgICA/ICdcXG4nLnJlcGVhdChNYXRoLm1heCgxLCBsaW5lcy5sZW5ndGggLSAxKSlcbiAgICAgICAgICAgIDogJyc7XG4gICAgICAgIGxldCBlbmQgPSBzdGFydCArIGhlYWRlci5sZW5ndGg7XG4gICAgICAgIGlmIChzY2FsYXIuc291cmNlKVxuICAgICAgICAgICAgZW5kICs9IHNjYWxhci5zb3VyY2UubGVuZ3RoO1xuICAgICAgICByZXR1cm4geyB2YWx1ZSwgdHlwZSwgY29tbWVudDogaGVhZGVyLmNvbW1lbnQsIHJhbmdlOiBbc3RhcnQsIGVuZCwgZW5kXSB9O1xuICAgIH1cbiAgICAvLyBmaW5kIHRoZSBpbmRlbnRhdGlvbiBsZXZlbCB0byB0cmltIGZyb20gc3RhcnRcbiAgICBsZXQgdHJpbUluZGVudCA9IHNjYWxhci5pbmRlbnQgKyBoZWFkZXIuaW5kZW50O1xuICAgIGxldCBvZmZzZXQgPSBzY2FsYXIub2Zmc2V0ICsgaGVhZGVyLmxlbmd0aDtcbiAgICBsZXQgY29udGVudFN0YXJ0ID0gMDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNob21wU3RhcnQ7ICsraSkge1xuICAgICAgICBjb25zdCBbaW5kZW50LCBjb250ZW50XSA9IGxpbmVzW2ldO1xuICAgICAgICBpZiAoY29udGVudCA9PT0gJycgfHwgY29udGVudCA9PT0gJ1xccicpIHtcbiAgICAgICAgICAgIGlmIChoZWFkZXIuaW5kZW50ID09PSAwICYmIGluZGVudC5sZW5ndGggPiB0cmltSW5kZW50KVxuICAgICAgICAgICAgICAgIHRyaW1JbmRlbnQgPSBpbmRlbnQubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGluZGVudC5sZW5ndGggPCB0cmltSW5kZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdCbG9jayBzY2FsYXJzIHdpdGggbW9yZS1pbmRlbnRlZCBsZWFkaW5nIGVtcHR5IGxpbmVzIG11c3QgdXNlIGFuIGV4cGxpY2l0IGluZGVudGF0aW9uIGluZGljYXRvcic7XG4gICAgICAgICAgICAgICAgb25FcnJvcihvZmZzZXQgKyBpbmRlbnQubGVuZ3RoLCAnTUlTU0lOR19DSEFSJywgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaGVhZGVyLmluZGVudCA9PT0gMClcbiAgICAgICAgICAgICAgICB0cmltSW5kZW50ID0gaW5kZW50Lmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnRlbnRTdGFydCA9IGk7XG4gICAgICAgICAgICBpZiAodHJpbUluZGVudCA9PT0gMCAmJiAhY3R4LmF0Um9vdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSAnQmxvY2sgc2NhbGFyIHZhbHVlcyBpbiBjb2xsZWN0aW9ucyBtdXN0IGJlIGluZGVudGVkJztcbiAgICAgICAgICAgICAgICBvbkVycm9yKG9mZnNldCwgJ0JBRF9JTkRFTlQnLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG9mZnNldCArPSBpbmRlbnQubGVuZ3RoICsgY29udGVudC5sZW5ndGggKyAxO1xuICAgIH1cbiAgICAvLyBpbmNsdWRlIHRyYWlsaW5nIG1vcmUtaW5kZW50ZWQgZW1wdHkgbGluZXMgaW4gY29udGVudFxuICAgIGZvciAobGV0IGkgPSBsaW5lcy5sZW5ndGggLSAxOyBpID49IGNob21wU3RhcnQ7IC0taSkge1xuICAgICAgICBpZiAobGluZXNbaV1bMF0ubGVuZ3RoID4gdHJpbUluZGVudClcbiAgICAgICAgICAgIGNob21wU3RhcnQgPSBpICsgMTtcbiAgICB9XG4gICAgbGV0IHZhbHVlID0gJyc7XG4gICAgbGV0IHNlcCA9ICcnO1xuICAgIGxldCBwcmV2TW9yZUluZGVudGVkID0gZmFsc2U7XG4gICAgLy8gbGVhZGluZyB3aGl0ZXNwYWNlIGlzIGtlcHQgaW50YWN0XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250ZW50U3RhcnQ7ICsraSlcbiAgICAgICAgdmFsdWUgKz0gbGluZXNbaV1bMF0uc2xpY2UodHJpbUluZGVudCkgKyAnXFxuJztcbiAgICBmb3IgKGxldCBpID0gY29udGVudFN0YXJ0OyBpIDwgY2hvbXBTdGFydDsgKytpKSB7XG4gICAgICAgIGxldCBbaW5kZW50LCBjb250ZW50XSA9IGxpbmVzW2ldO1xuICAgICAgICBvZmZzZXQgKz0gaW5kZW50Lmxlbmd0aCArIGNvbnRlbnQubGVuZ3RoICsgMTtcbiAgICAgICAgY29uc3QgY3JsZiA9IGNvbnRlbnRbY29udGVudC5sZW5ndGggLSAxXSA9PT0gJ1xccic7XG4gICAgICAgIGlmIChjcmxmKVxuICAgICAgICAgICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgYWxyZWFkeSBjYXVnaHQgaW4gbGV4ZXIgKi9cbiAgICAgICAgaWYgKGNvbnRlbnQgJiYgaW5kZW50Lmxlbmd0aCA8IHRyaW1JbmRlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHNyYyA9IGhlYWRlci5pbmRlbnRcbiAgICAgICAgICAgICAgICA/ICdleHBsaWNpdCBpbmRlbnRhdGlvbiBpbmRpY2F0b3InXG4gICAgICAgICAgICAgICAgOiAnZmlyc3QgbGluZSc7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYEJsb2NrIHNjYWxhciBsaW5lcyBtdXN0IG5vdCBiZSBsZXNzIGluZGVudGVkIHRoYW4gdGhlaXIgJHtzcmN9YDtcbiAgICAgICAgICAgIG9uRXJyb3Iob2Zmc2V0IC0gY29udGVudC5sZW5ndGggLSAoY3JsZiA/IDIgOiAxKSwgJ0JBRF9JTkRFTlQnLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIGluZGVudCA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSBTY2FsYXIuQkxPQ0tfTElURVJBTCkge1xuICAgICAgICAgICAgdmFsdWUgKz0gc2VwICsgaW5kZW50LnNsaWNlKHRyaW1JbmRlbnQpICsgY29udGVudDtcbiAgICAgICAgICAgIHNlcCA9ICdcXG4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGluZGVudC5sZW5ndGggPiB0cmltSW5kZW50IHx8IGNvbnRlbnRbMF0gPT09ICdcXHQnKSB7XG4gICAgICAgICAgICAvLyBtb3JlLWluZGVudGVkIGNvbnRlbnQgd2l0aGluIGEgZm9sZGVkIGJsb2NrXG4gICAgICAgICAgICBpZiAoc2VwID09PSAnICcpXG4gICAgICAgICAgICAgICAgc2VwID0gJ1xcbic7XG4gICAgICAgICAgICBlbHNlIGlmICghcHJldk1vcmVJbmRlbnRlZCAmJiBzZXAgPT09ICdcXG4nKVxuICAgICAgICAgICAgICAgIHNlcCA9ICdcXG5cXG4nO1xuICAgICAgICAgICAgdmFsdWUgKz0gc2VwICsgaW5kZW50LnNsaWNlKHRyaW1JbmRlbnQpICsgY29udGVudDtcbiAgICAgICAgICAgIHNlcCA9ICdcXG4nO1xuICAgICAgICAgICAgcHJldk1vcmVJbmRlbnRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY29udGVudCA9PT0gJycpIHtcbiAgICAgICAgICAgIC8vIGVtcHR5IGxpbmVcbiAgICAgICAgICAgIGlmIChzZXAgPT09ICdcXG4nKVxuICAgICAgICAgICAgICAgIHZhbHVlICs9ICdcXG4nO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNlcCA9ICdcXG4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgKz0gc2VwICsgY29udGVudDtcbiAgICAgICAgICAgIHNlcCA9ICcgJztcbiAgICAgICAgICAgIHByZXZNb3JlSW5kZW50ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzd2l0Y2ggKGhlYWRlci5jaG9tcCkge1xuICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBjaG9tcFN0YXJ0OyBpIDwgbGluZXMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gJ1xcbicgKyBsaW5lc1tpXVswXS5zbGljZSh0cmltSW5kZW50KTtcbiAgICAgICAgICAgIGlmICh2YWx1ZVt2YWx1ZS5sZW5ndGggLSAxXSAhPT0gJ1xcbicpXG4gICAgICAgICAgICAgICAgdmFsdWUgKz0gJ1xcbic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhbHVlICs9ICdcXG4nO1xuICAgIH1cbiAgICBjb25zdCBlbmQgPSBzdGFydCArIGhlYWRlci5sZW5ndGggKyBzY2FsYXIuc291cmNlLmxlbmd0aDtcbiAgICByZXR1cm4geyB2YWx1ZSwgdHlwZSwgY29tbWVudDogaGVhZGVyLmNvbW1lbnQsIHJhbmdlOiBbc3RhcnQsIGVuZCwgZW5kXSB9O1xufVxuZnVuY3Rpb24gcGFyc2VCbG9ja1NjYWxhckhlYWRlcih7IG9mZnNldCwgcHJvcHMgfSwgc3RyaWN0LCBvbkVycm9yKSB7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmIHNob3VsZCBub3QgaGFwcGVuICovXG4gICAgaWYgKHByb3BzWzBdLnR5cGUgIT09ICdibG9jay1zY2FsYXItaGVhZGVyJykge1xuICAgICAgICBvbkVycm9yKHByb3BzWzBdLCAnSU1QT1NTSUJMRScsICdCbG9jayBzY2FsYXIgaGVhZGVyIG5vdCBmb3VuZCcpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgeyBzb3VyY2UgfSA9IHByb3BzWzBdO1xuICAgIGNvbnN0IG1vZGUgPSBzb3VyY2VbMF07XG4gICAgbGV0IGluZGVudCA9IDA7XG4gICAgbGV0IGNob21wID0gJyc7XG4gICAgbGV0IGVycm9yID0gLTE7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzb3VyY2UubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgY2ggPSBzb3VyY2VbaV07XG4gICAgICAgIGlmICghY2hvbXAgJiYgKGNoID09PSAnLScgfHwgY2ggPT09ICcrJykpXG4gICAgICAgICAgICBjaG9tcCA9IGNoO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG4gPSBOdW1iZXIoY2gpO1xuICAgICAgICAgICAgaWYgKCFpbmRlbnQgJiYgbilcbiAgICAgICAgICAgICAgICBpbmRlbnQgPSBuO1xuICAgICAgICAgICAgZWxzZSBpZiAoZXJyb3IgPT09IC0xKVxuICAgICAgICAgICAgICAgIGVycm9yID0gb2Zmc2V0ICsgaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZXJyb3IgIT09IC0xKVxuICAgICAgICBvbkVycm9yKGVycm9yLCAnVU5FWFBFQ1RFRF9UT0tFTicsIGBCbG9jayBzY2FsYXIgaGVhZGVyIGluY2x1ZGVzIGV4dHJhIGNoYXJhY3RlcnM6ICR7c291cmNlfWApO1xuICAgIGxldCBoYXNTcGFjZSA9IGZhbHNlO1xuICAgIGxldCBjb21tZW50ID0gJyc7XG4gICAgbGV0IGxlbmd0aCA9IHNvdXJjZS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwcm9wcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IHByb3BzW2ldO1xuICAgICAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICBoYXNTcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAvLyBmYWxsdGhyb3VnaFxuICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgbGVuZ3RoICs9IHRva2VuLnNvdXJjZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgICAgICBpZiAoc3RyaWN0ICYmICFoYXNTcGFjZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJ0NvbW1lbnRzIG11c3QgYmUgc2VwYXJhdGVkIGZyb20gb3RoZXIgdG9rZW5zIGJ5IHdoaXRlIHNwYWNlIGNoYXJhY3RlcnMnO1xuICAgICAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnTUlTU0lOR19DSEFSJywgbWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxlbmd0aCArPSB0b2tlbi5zb3VyY2UubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbW1lbnQgPSB0b2tlbi5zb3VyY2Uuc3Vic3RyaW5nKDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdVTkVYUEVDVEVEX1RPS0VOJywgdG9rZW4ubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgbGVuZ3RoICs9IHRva2VuLnNvdXJjZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCBzaG91bGQgbm90IGhhcHBlbiAqL1xuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgVW5leHBlY3RlZCB0b2tlbiBpbiBibG9jayBzY2FsYXIgaGVhZGVyOiAke3Rva2VuLnR5cGV9YDtcbiAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnVU5FWFBFQ1RFRF9UT0tFTicsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRzID0gdG9rZW4uc291cmNlO1xuICAgICAgICAgICAgICAgIGlmICh0cyAmJiB0eXBlb2YgdHMgPT09ICdzdHJpbmcnKVxuICAgICAgICAgICAgICAgICAgICBsZW5ndGggKz0gdHMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IG1vZGUsIGluZGVudCwgY2hvbXAsIGNvbW1lbnQsIGxlbmd0aCB9O1xufVxuLyoqIEByZXR1cm5zIEFycmF5IG9mIGxpbmVzIHNwbGl0IHVwIGFzIGBbaW5kZW50LCBjb250ZW50XWAgKi9cbmZ1bmN0aW9uIHNwbGl0TGluZXMoc291cmNlKSB7XG4gICAgY29uc3Qgc3BsaXQgPSBzb3VyY2Uuc3BsaXQoL1xcbiggKikvKTtcbiAgICBjb25zdCBmaXJzdCA9IHNwbGl0WzBdO1xuICAgIGNvbnN0IG0gPSBmaXJzdC5tYXRjaCgvXiggKikvKTtcbiAgICBjb25zdCBsaW5lMCA9IG0/LlsxXVxuICAgICAgICA/IFttWzFdLCBmaXJzdC5zbGljZShtWzFdLmxlbmd0aCldXG4gICAgICAgIDogWycnLCBmaXJzdF07XG4gICAgY29uc3QgbGluZXMgPSBbbGluZTBdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3BsaXQubGVuZ3RoOyBpICs9IDIpXG4gICAgICAgIGxpbmVzLnB1c2goW3NwbGl0W2ldLCBzcGxpdFtpICsgMV1dKTtcbiAgICByZXR1cm4gbGluZXM7XG59XG5cbmV4cG9ydCB7IHJlc29sdmVCbG9ja1NjYWxhciB9O1xuIiwgImltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uL25vZGVzL1NjYWxhci5qcyc7XG5pbXBvcnQgeyByZXNvbHZlRW5kIH0gZnJvbSAnLi9yZXNvbHZlLWVuZC5qcyc7XG5cbmZ1bmN0aW9uIHJlc29sdmVGbG93U2NhbGFyKHNjYWxhciwgc3RyaWN0LCBvbkVycm9yKSB7XG4gICAgY29uc3QgeyBvZmZzZXQsIHR5cGUsIHNvdXJjZSwgZW5kIH0gPSBzY2FsYXI7XG4gICAgbGV0IF90eXBlO1xuICAgIGxldCB2YWx1ZTtcbiAgICBjb25zdCBfb25FcnJvciA9IChyZWwsIGNvZGUsIG1zZykgPT4gb25FcnJvcihvZmZzZXQgKyByZWwsIGNvZGUsIG1zZyk7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ3NjYWxhcic6XG4gICAgICAgICAgICBfdHlwZSA9IFNjYWxhci5QTEFJTjtcbiAgICAgICAgICAgIHZhbHVlID0gcGxhaW5WYWx1ZShzb3VyY2UsIF9vbkVycm9yKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdzaW5nbGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICBfdHlwZSA9IFNjYWxhci5RVU9URV9TSU5HTEU7XG4gICAgICAgICAgICB2YWx1ZSA9IHNpbmdsZVF1b3RlZFZhbHVlKHNvdXJjZSwgX29uRXJyb3IpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2RvdWJsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgICAgIF90eXBlID0gU2NhbGFyLlFVT1RFX0RPVUJMRTtcbiAgICAgICAgICAgIHZhbHVlID0gZG91YmxlUXVvdGVkVmFsdWUoc291cmNlLCBfb25FcnJvcik7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgc2hvdWxkIG5vdCBoYXBwZW4gKi9cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIG9uRXJyb3Ioc2NhbGFyLCAnVU5FWFBFQ1RFRF9UT0tFTicsIGBFeHBlY3RlZCBhIGZsb3cgc2NhbGFyIHZhbHVlLCBidXQgZm91bmQ6ICR7dHlwZX1gKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAgICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgICAgICAgICAgY29tbWVudDogJycsXG4gICAgICAgICAgICAgICAgcmFuZ2U6IFtvZmZzZXQsIG9mZnNldCArIHNvdXJjZS5sZW5ndGgsIG9mZnNldCArIHNvdXJjZS5sZW5ndGhdXG4gICAgICAgICAgICB9O1xuICAgIH1cbiAgICBjb25zdCB2YWx1ZUVuZCA9IG9mZnNldCArIHNvdXJjZS5sZW5ndGg7XG4gICAgY29uc3QgcmUgPSByZXNvbHZlRW5kKGVuZCwgdmFsdWVFbmQsIHN0cmljdCwgb25FcnJvcik7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHR5cGU6IF90eXBlLFxuICAgICAgICBjb21tZW50OiByZS5jb21tZW50LFxuICAgICAgICByYW5nZTogW29mZnNldCwgdmFsdWVFbmQsIHJlLm9mZnNldF1cbiAgICB9O1xufVxuZnVuY3Rpb24gcGxhaW5WYWx1ZShzb3VyY2UsIG9uRXJyb3IpIHtcbiAgICBsZXQgYmFkQ2hhciA9ICcnO1xuICAgIHN3aXRjaCAoc291cmNlWzBdKSB7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IHNob3VsZCBub3QgaGFwcGVuICovXG4gICAgICAgIGNhc2UgJ1xcdCc6XG4gICAgICAgICAgICBiYWRDaGFyID0gJ2EgdGFiIGNoYXJhY3Rlcic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLCc6XG4gICAgICAgICAgICBiYWRDaGFyID0gJ2Zsb3cgaW5kaWNhdG9yIGNoYXJhY3RlciAsJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICclJzpcbiAgICAgICAgICAgIGJhZENoYXIgPSAnZGlyZWN0aXZlIGluZGljYXRvciBjaGFyYWN0ZXIgJSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgIGNhc2UgJz4nOiB7XG4gICAgICAgICAgICBiYWRDaGFyID0gYGJsb2NrIHNjYWxhciBpbmRpY2F0b3IgJHtzb3VyY2VbMF19YDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ0AnOlxuICAgICAgICBjYXNlICdgJzoge1xuICAgICAgICAgICAgYmFkQ2hhciA9IGByZXNlcnZlZCBjaGFyYWN0ZXIgJHtzb3VyY2VbMF19YDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChiYWRDaGFyKVxuICAgICAgICBvbkVycm9yKDAsICdCQURfU0NBTEFSX1NUQVJUJywgYFBsYWluIHZhbHVlIGNhbm5vdCBzdGFydCB3aXRoICR7YmFkQ2hhcn1gKTtcbiAgICByZXR1cm4gZm9sZExpbmVzKHNvdXJjZSk7XG59XG5mdW5jdGlvbiBzaW5nbGVRdW90ZWRWYWx1ZShzb3VyY2UsIG9uRXJyb3IpIHtcbiAgICBpZiAoc291cmNlW3NvdXJjZS5sZW5ndGggLSAxXSAhPT0gXCInXCIgfHwgc291cmNlLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgb25FcnJvcihzb3VyY2UubGVuZ3RoLCAnTUlTU0lOR19DSEFSJywgXCJNaXNzaW5nIGNsb3NpbmcgJ3F1b3RlXCIpO1xuICAgIHJldHVybiBmb2xkTGluZXMoc291cmNlLnNsaWNlKDEsIC0xKSkucmVwbGFjZSgvJycvZywgXCInXCIpO1xufVxuZnVuY3Rpb24gZm9sZExpbmVzKHNvdXJjZSkge1xuICAgIC8qKlxuICAgICAqIFRoZSBuZWdhdGl2ZSBsb29rYmVoaW5kIGhlcmUgYW5kIGluIHRoZSBgcmVgIFJlZ0V4cCBpcyB0b1xuICAgICAqIHByZXZlbnQgY2F1c2luZyBhIHBvbHlub21pYWwgc2VhcmNoIHRpbWUgaW4gY2VydGFpbiBjYXNlcy5cbiAgICAgKlxuICAgICAqIFRoZSB0cnktY2F0Y2ggaXMgZm9yIFNhZmFyaSwgd2hpY2ggZG9lc24ndCBzdXBwb3J0IHRoaXMgeWV0OlxuICAgICAqIGh0dHBzOi8vY2FuaXVzZS5jb20vanMtcmVnZXhwLWxvb2tiZWhpbmRcbiAgICAgKi9cbiAgICBsZXQgZmlyc3QsIGxpbmU7XG4gICAgdHJ5IHtcbiAgICAgICAgZmlyc3QgPSBuZXcgUmVnRXhwKCcoLio/KSg/PCFbIFxcdF0pWyBcXHRdKlxccj9cXG4nLCAnc3knKTtcbiAgICAgICAgbGluZSA9IG5ldyBSZWdFeHAoJ1sgXFx0XSooLio/KSg/Oig/PCFbIFxcdF0pWyBcXHRdKik/XFxyP1xcbicsICdzeScpO1xuICAgIH1cbiAgICBjYXRjaCB7XG4gICAgICAgIGZpcnN0ID0gLyguKj8pWyBcXHRdKlxccj9cXG4vc3k7XG4gICAgICAgIGxpbmUgPSAvWyBcXHRdKiguKj8pWyBcXHRdKlxccj9cXG4vc3k7XG4gICAgfVxuICAgIGxldCBtYXRjaCA9IGZpcnN0LmV4ZWMoc291cmNlKTtcbiAgICBpZiAoIW1hdGNoKVxuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgIGxldCByZXMgPSBtYXRjaFsxXTtcbiAgICBsZXQgc2VwID0gJyAnO1xuICAgIGxldCBwb3MgPSBmaXJzdC5sYXN0SW5kZXg7XG4gICAgbGluZS5sYXN0SW5kZXggPSBwb3M7XG4gICAgd2hpbGUgKChtYXRjaCA9IGxpbmUuZXhlYyhzb3VyY2UpKSkge1xuICAgICAgICBpZiAobWF0Y2hbMV0gPT09ICcnKSB7XG4gICAgICAgICAgICBpZiAoc2VwID09PSAnXFxuJylcbiAgICAgICAgICAgICAgICByZXMgKz0gc2VwO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNlcCA9ICdcXG4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzICs9IHNlcCArIG1hdGNoWzFdO1xuICAgICAgICAgICAgc2VwID0gJyAnO1xuICAgICAgICB9XG4gICAgICAgIHBvcyA9IGxpbmUubGFzdEluZGV4O1xuICAgIH1cbiAgICBjb25zdCBsYXN0ID0gL1sgXFx0XSooLiopL3N5O1xuICAgIGxhc3QubGFzdEluZGV4ID0gcG9zO1xuICAgIG1hdGNoID0gbGFzdC5leGVjKHNvdXJjZSk7XG4gICAgcmV0dXJuIHJlcyArIHNlcCArIChtYXRjaD8uWzFdID8/ICcnKTtcbn1cbmZ1bmN0aW9uIGRvdWJsZVF1b3RlZFZhbHVlKHNvdXJjZSwgb25FcnJvcikge1xuICAgIGxldCByZXMgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNvdXJjZS5sZW5ndGggLSAxOyArK2kpIHtcbiAgICAgICAgY29uc3QgY2ggPSBzb3VyY2VbaV07XG4gICAgICAgIGlmIChjaCA9PT0gJ1xccicgJiYgc291cmNlW2kgKyAxXSA9PT0gJ1xcbicpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgaWYgKGNoID09PSAnXFxuJykge1xuICAgICAgICAgICAgY29uc3QgeyBmb2xkLCBvZmZzZXQgfSA9IGZvbGROZXdsaW5lKHNvdXJjZSwgaSk7XG4gICAgICAgICAgICByZXMgKz0gZm9sZDtcbiAgICAgICAgICAgIGkgPSBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2ggPT09ICdcXFxcJykge1xuICAgICAgICAgICAgbGV0IG5leHQgPSBzb3VyY2VbKytpXTtcbiAgICAgICAgICAgIGNvbnN0IGNjID0gZXNjYXBlQ29kZXNbbmV4dF07XG4gICAgICAgICAgICBpZiAoY2MpXG4gICAgICAgICAgICAgICAgcmVzICs9IGNjO1xuICAgICAgICAgICAgZWxzZSBpZiAobmV4dCA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgICAgICAvLyBza2lwIGVzY2FwZWQgbmV3bGluZXMsIGJ1dCBzdGlsbCB0cmltIHRoZSBmb2xsb3dpbmcgbGluZVxuICAgICAgICAgICAgICAgIG5leHQgPSBzb3VyY2VbaSArIDFdO1xuICAgICAgICAgICAgICAgIHdoaWxlIChuZXh0ID09PSAnICcgfHwgbmV4dCA9PT0gJ1xcdCcpXG4gICAgICAgICAgICAgICAgICAgIG5leHQgPSBzb3VyY2VbKytpICsgMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuZXh0ID09PSAnXFxyJyAmJiBzb3VyY2VbaSArIDFdID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgIC8vIHNraXAgZXNjYXBlZCBDUkxGIG5ld2xpbmVzLCBidXQgc3RpbGwgdHJpbSB0aGUgZm9sbG93aW5nIGxpbmVcbiAgICAgICAgICAgICAgICBuZXh0ID0gc291cmNlWysraSArIDFdO1xuICAgICAgICAgICAgICAgIHdoaWxlIChuZXh0ID09PSAnICcgfHwgbmV4dCA9PT0gJ1xcdCcpXG4gICAgICAgICAgICAgICAgICAgIG5leHQgPSBzb3VyY2VbKytpICsgMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuZXh0ID09PSAneCcgfHwgbmV4dCA9PT0gJ3UnIHx8IG5leHQgPT09ICdVJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IG5leHQgPT09ICd4JyA/IDIgOiBuZXh0ID09PSAndScgPyA0IDogODtcbiAgICAgICAgICAgICAgICByZXMgKz0gcGFyc2VDaGFyQ29kZShzb3VyY2UsIGkgKyAxLCBsZW5ndGgsIG9uRXJyb3IpO1xuICAgICAgICAgICAgICAgIGkgKz0gbGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmF3ID0gc291cmNlLnN1YnN0cihpIC0gMSwgMik7XG4gICAgICAgICAgICAgICAgb25FcnJvcihpIC0gMSwgJ0JBRF9EUV9FU0NBUEUnLCBgSW52YWxpZCBlc2NhcGUgc2VxdWVuY2UgJHtyYXd9YCk7XG4gICAgICAgICAgICAgICAgcmVzICs9IHJhdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjaCA9PT0gJyAnIHx8IGNoID09PSAnXFx0Jykge1xuICAgICAgICAgICAgLy8gdHJpbSB0cmFpbGluZyB3aGl0ZXNwYWNlXG4gICAgICAgICAgICBjb25zdCB3c1N0YXJ0ID0gaTtcbiAgICAgICAgICAgIGxldCBuZXh0ID0gc291cmNlW2kgKyAxXTtcbiAgICAgICAgICAgIHdoaWxlIChuZXh0ID09PSAnICcgfHwgbmV4dCA9PT0gJ1xcdCcpXG4gICAgICAgICAgICAgICAgbmV4dCA9IHNvdXJjZVsrK2kgKyAxXTtcbiAgICAgICAgICAgIGlmIChuZXh0ICE9PSAnXFxuJyAmJiAhKG5leHQgPT09ICdcXHInICYmIHNvdXJjZVtpICsgMl0gPT09ICdcXG4nKSlcbiAgICAgICAgICAgICAgICByZXMgKz0gaSA+IHdzU3RhcnQgPyBzb3VyY2Uuc2xpY2Uod3NTdGFydCwgaSArIDEpIDogY2g7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXMgKz0gY2g7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNvdXJjZVtzb3VyY2UubGVuZ3RoIC0gMV0gIT09ICdcIicgfHwgc291cmNlLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgb25FcnJvcihzb3VyY2UubGVuZ3RoLCAnTUlTU0lOR19DSEFSJywgJ01pc3NpbmcgY2xvc2luZyBcInF1b3RlJyk7XG4gICAgcmV0dXJuIHJlcztcbn1cbi8qKlxuICogRm9sZCBhIHNpbmdsZSBuZXdsaW5lIGludG8gYSBzcGFjZSwgbXVsdGlwbGUgbmV3bGluZXMgdG8gTiAtIDEgbmV3bGluZXMuXG4gKiBQcmVzdW1lcyBgc291cmNlW29mZnNldF0gPT09ICdcXG4nYFxuICovXG5mdW5jdGlvbiBmb2xkTmV3bGluZShzb3VyY2UsIG9mZnNldCkge1xuICAgIGxldCBmb2xkID0gJyc7XG4gICAgbGV0IGNoID0gc291cmNlW29mZnNldCArIDFdO1xuICAgIHdoaWxlIChjaCA9PT0gJyAnIHx8IGNoID09PSAnXFx0JyB8fCBjaCA9PT0gJ1xcbicgfHwgY2ggPT09ICdcXHInKSB7XG4gICAgICAgIGlmIChjaCA9PT0gJ1xccicgJiYgc291cmNlW29mZnNldCArIDJdICE9PSAnXFxuJylcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBpZiAoY2ggPT09ICdcXG4nKVxuICAgICAgICAgICAgZm9sZCArPSAnXFxuJztcbiAgICAgICAgb2Zmc2V0ICs9IDE7XG4gICAgICAgIGNoID0gc291cmNlW29mZnNldCArIDFdO1xuICAgIH1cbiAgICBpZiAoIWZvbGQpXG4gICAgICAgIGZvbGQgPSAnICc7XG4gICAgcmV0dXJuIHsgZm9sZCwgb2Zmc2V0IH07XG59XG5jb25zdCBlc2NhcGVDb2RlcyA9IHtcbiAgICAnMCc6ICdcXDAnLCAvLyBudWxsIGNoYXJhY3RlclxuICAgIGE6ICdcXHgwNycsIC8vIGJlbGwgY2hhcmFjdGVyXG4gICAgYjogJ1xcYicsIC8vIGJhY2tzcGFjZVxuICAgIGU6ICdcXHgxYicsIC8vIGVzY2FwZSBjaGFyYWN0ZXJcbiAgICBmOiAnXFxmJywgLy8gZm9ybSBmZWVkXG4gICAgbjogJ1xcbicsIC8vIGxpbmUgZmVlZFxuICAgIHI6ICdcXHInLCAvLyBjYXJyaWFnZSByZXR1cm5cbiAgICB0OiAnXFx0JywgLy8gaG9yaXpvbnRhbCB0YWJcbiAgICB2OiAnXFx2JywgLy8gdmVydGljYWwgdGFiXG4gICAgTjogJ1xcdTAwODUnLCAvLyBVbmljb2RlIG5leHQgbGluZVxuICAgIF86ICdcXHUwMGEwJywgLy8gVW5pY29kZSBub24tYnJlYWtpbmcgc3BhY2VcbiAgICBMOiAnXFx1MjAyOCcsIC8vIFVuaWNvZGUgbGluZSBzZXBhcmF0b3JcbiAgICBQOiAnXFx1MjAyOScsIC8vIFVuaWNvZGUgcGFyYWdyYXBoIHNlcGFyYXRvclxuICAgICcgJzogJyAnLFxuICAgICdcIic6ICdcIicsXG4gICAgJy8nOiAnLycsXG4gICAgJ1xcXFwnOiAnXFxcXCcsXG4gICAgJ1xcdCc6ICdcXHQnXG59O1xuZnVuY3Rpb24gcGFyc2VDaGFyQ29kZShzb3VyY2UsIG9mZnNldCwgbGVuZ3RoLCBvbkVycm9yKSB7XG4gICAgY29uc3QgY2MgPSBzb3VyY2Uuc3Vic3RyKG9mZnNldCwgbGVuZ3RoKTtcbiAgICBjb25zdCBvayA9IGNjLmxlbmd0aCA9PT0gbGVuZ3RoICYmIC9eWzAtOWEtZkEtRl0rJC8udGVzdChjYyk7XG4gICAgY29uc3QgY29kZSA9IG9rID8gcGFyc2VJbnQoY2MsIDE2KSA6IE5hTjtcbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21Db2RlUG9pbnQoY29kZSk7XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgICAgY29uc3QgcmF3ID0gc291cmNlLnN1YnN0cihvZmZzZXQgLSAyLCBsZW5ndGggKyAyKTtcbiAgICAgICAgb25FcnJvcihvZmZzZXQgLSAyLCAnQkFEX0RRX0VTQ0FQRScsIGBJbnZhbGlkIGVzY2FwZSBzZXF1ZW5jZSAke3Jhd31gKTtcbiAgICAgICAgcmV0dXJuIHJhdztcbiAgICB9XG59XG5cbmV4cG9ydCB7IHJlc29sdmVGbG93U2NhbGFyIH07XG4iLCAiaW1wb3J0IHsgaXNTY2FsYXIsIFNDQUxBUiB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IFNjYWxhciB9IGZyb20gJy4uL25vZGVzL1NjYWxhci5qcyc7XG5pbXBvcnQgeyByZXNvbHZlQmxvY2tTY2FsYXIgfSBmcm9tICcuL3Jlc29sdmUtYmxvY2stc2NhbGFyLmpzJztcbmltcG9ydCB7IHJlc29sdmVGbG93U2NhbGFyIH0gZnJvbSAnLi9yZXNvbHZlLWZsb3ctc2NhbGFyLmpzJztcblxuZnVuY3Rpb24gY29tcG9zZVNjYWxhcihjdHgsIHRva2VuLCB0YWdUb2tlbiwgb25FcnJvcikge1xuICAgIGNvbnN0IHsgdmFsdWUsIHR5cGUsIGNvbW1lbnQsIHJhbmdlIH0gPSB0b2tlbi50eXBlID09PSAnYmxvY2stc2NhbGFyJ1xuICAgICAgICA/IHJlc29sdmVCbG9ja1NjYWxhcihjdHgsIHRva2VuLCBvbkVycm9yKVxuICAgICAgICA6IHJlc29sdmVGbG93U2NhbGFyKHRva2VuLCBjdHgub3B0aW9ucy5zdHJpY3QsIG9uRXJyb3IpO1xuICAgIGNvbnN0IHRhZ05hbWUgPSB0YWdUb2tlblxuICAgICAgICA/IGN0eC5kaXJlY3RpdmVzLnRhZ05hbWUodGFnVG9rZW4uc291cmNlLCBtc2cgPT4gb25FcnJvcih0YWdUb2tlbiwgJ1RBR19SRVNPTFZFX0ZBSUxFRCcsIG1zZykpXG4gICAgICAgIDogbnVsbDtcbiAgICBsZXQgdGFnO1xuICAgIGlmIChjdHgub3B0aW9ucy5zdHJpbmdLZXlzICYmIGN0eC5hdEtleSkge1xuICAgICAgICB0YWcgPSBjdHguc2NoZW1hW1NDQUxBUl07XG4gICAgfVxuICAgIGVsc2UgaWYgKHRhZ05hbWUpXG4gICAgICAgIHRhZyA9IGZpbmRTY2FsYXJUYWdCeU5hbWUoY3R4LnNjaGVtYSwgdmFsdWUsIHRhZ05hbWUsIHRhZ1Rva2VuLCBvbkVycm9yKTtcbiAgICBlbHNlIGlmICh0b2tlbi50eXBlID09PSAnc2NhbGFyJylcbiAgICAgICAgdGFnID0gZmluZFNjYWxhclRhZ0J5VGVzdChjdHgsIHZhbHVlLCB0b2tlbiwgb25FcnJvcik7XG4gICAgZWxzZVxuICAgICAgICB0YWcgPSBjdHguc2NoZW1hW1NDQUxBUl07XG4gICAgbGV0IHNjYWxhcjtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSB0YWcucmVzb2x2ZSh2YWx1ZSwgbXNnID0+IG9uRXJyb3IodGFnVG9rZW4gPz8gdG9rZW4sICdUQUdfUkVTT0xWRV9GQUlMRUQnLCBtc2cpLCBjdHgub3B0aW9ucyk7XG4gICAgICAgIHNjYWxhciA9IGlzU2NhbGFyKHJlcykgPyByZXMgOiBuZXcgU2NhbGFyKHJlcyk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zdCBtc2cgPSBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcik7XG4gICAgICAgIG9uRXJyb3IodGFnVG9rZW4gPz8gdG9rZW4sICdUQUdfUkVTT0xWRV9GQUlMRUQnLCBtc2cpO1xuICAgICAgICBzY2FsYXIgPSBuZXcgU2NhbGFyKHZhbHVlKTtcbiAgICB9XG4gICAgc2NhbGFyLnJhbmdlID0gcmFuZ2U7XG4gICAgc2NhbGFyLnNvdXJjZSA9IHZhbHVlO1xuICAgIGlmICh0eXBlKVxuICAgICAgICBzY2FsYXIudHlwZSA9IHR5cGU7XG4gICAgaWYgKHRhZ05hbWUpXG4gICAgICAgIHNjYWxhci50YWcgPSB0YWdOYW1lO1xuICAgIGlmICh0YWcuZm9ybWF0KVxuICAgICAgICBzY2FsYXIuZm9ybWF0ID0gdGFnLmZvcm1hdDtcbiAgICBpZiAoY29tbWVudClcbiAgICAgICAgc2NhbGFyLmNvbW1lbnQgPSBjb21tZW50O1xuICAgIHJldHVybiBzY2FsYXI7XG59XG5mdW5jdGlvbiBmaW5kU2NhbGFyVGFnQnlOYW1lKHNjaGVtYSwgdmFsdWUsIHRhZ05hbWUsIHRhZ1Rva2VuLCBvbkVycm9yKSB7XG4gICAgaWYgKHRhZ05hbWUgPT09ICchJylcbiAgICAgICAgcmV0dXJuIHNjaGVtYVtTQ0FMQVJdOyAvLyBub24tc3BlY2lmaWMgdGFnXG4gICAgY29uc3QgbWF0Y2hXaXRoVGVzdCA9IFtdO1xuICAgIGZvciAoY29uc3QgdGFnIG9mIHNjaGVtYS50YWdzKSB7XG4gICAgICAgIGlmICghdGFnLmNvbGxlY3Rpb24gJiYgdGFnLnRhZyA9PT0gdGFnTmFtZSkge1xuICAgICAgICAgICAgaWYgKHRhZy5kZWZhdWx0ICYmIHRhZy50ZXN0KVxuICAgICAgICAgICAgICAgIG1hdGNoV2l0aFRlc3QucHVzaCh0YWcpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiB0YWc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChjb25zdCB0YWcgb2YgbWF0Y2hXaXRoVGVzdClcbiAgICAgICAgaWYgKHRhZy50ZXN0Py50ZXN0KHZhbHVlKSlcbiAgICAgICAgICAgIHJldHVybiB0YWc7XG4gICAgY29uc3Qga3QgPSBzY2hlbWEua25vd25UYWdzW3RhZ05hbWVdO1xuICAgIGlmIChrdCAmJiAha3QuY29sbGVjdGlvbikge1xuICAgICAgICAvLyBFbnN1cmUgdGhhdCB0aGUga25vd24gdGFnIGlzIGF2YWlsYWJsZSBmb3Igc3RyaW5naWZ5aW5nLFxuICAgICAgICAvLyBidXQgZG9lcyBub3QgZ2V0IHVzZWQgYnkgZGVmYXVsdC5cbiAgICAgICAgc2NoZW1hLnRhZ3MucHVzaChPYmplY3QuYXNzaWduKHt9LCBrdCwgeyBkZWZhdWx0OiBmYWxzZSwgdGVzdDogdW5kZWZpbmVkIH0pKTtcbiAgICAgICAgcmV0dXJuIGt0O1xuICAgIH1cbiAgICBvbkVycm9yKHRhZ1Rva2VuLCAnVEFHX1JFU09MVkVfRkFJTEVEJywgYFVucmVzb2x2ZWQgdGFnOiAke3RhZ05hbWV9YCwgdGFnTmFtZSAhPT0gJ3RhZzp5YW1sLm9yZywyMDAyOnN0cicpO1xuICAgIHJldHVybiBzY2hlbWFbU0NBTEFSXTtcbn1cbmZ1bmN0aW9uIGZpbmRTY2FsYXJUYWdCeVRlc3QoeyBhdEtleSwgZGlyZWN0aXZlcywgc2NoZW1hIH0sIHZhbHVlLCB0b2tlbiwgb25FcnJvcikge1xuICAgIGNvbnN0IHRhZyA9IHNjaGVtYS50YWdzLmZpbmQodGFnID0+ICh0YWcuZGVmYXVsdCA9PT0gdHJ1ZSB8fCAoYXRLZXkgJiYgdGFnLmRlZmF1bHQgPT09ICdrZXknKSkgJiZcbiAgICAgICAgdGFnLnRlc3Q/LnRlc3QodmFsdWUpKSB8fCBzY2hlbWFbU0NBTEFSXTtcbiAgICBpZiAoc2NoZW1hLmNvbXBhdCkge1xuICAgICAgICBjb25zdCBjb21wYXQgPSBzY2hlbWEuY29tcGF0LmZpbmQodGFnID0+IHRhZy5kZWZhdWx0ICYmIHRhZy50ZXN0Py50ZXN0KHZhbHVlKSkgPz9cbiAgICAgICAgICAgIHNjaGVtYVtTQ0FMQVJdO1xuICAgICAgICBpZiAodGFnLnRhZyAhPT0gY29tcGF0LnRhZykge1xuICAgICAgICAgICAgY29uc3QgdHMgPSBkaXJlY3RpdmVzLnRhZ1N0cmluZyh0YWcudGFnKTtcbiAgICAgICAgICAgIGNvbnN0IGNzID0gZGlyZWN0aXZlcy50YWdTdHJpbmcoY29tcGF0LnRhZyk7XG4gICAgICAgICAgICBjb25zdCBtc2cgPSBgVmFsdWUgbWF5IGJlIHBhcnNlZCBhcyBlaXRoZXIgJHt0c30gb3IgJHtjc31gO1xuICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ1RBR19SRVNPTFZFX0ZBSUxFRCcsIG1zZywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhZztcbn1cblxuZXhwb3J0IHsgY29tcG9zZVNjYWxhciB9O1xuIiwgImZ1bmN0aW9uIGVtcHR5U2NhbGFyUG9zaXRpb24ob2Zmc2V0LCBiZWZvcmUsIHBvcykge1xuICAgIGlmIChiZWZvcmUpIHtcbiAgICAgICAgcG9zID8/IChwb3MgPSBiZWZvcmUubGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHBvcyAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICBsZXQgc3QgPSBiZWZvcmVbaV07XG4gICAgICAgICAgICBzd2l0Y2ggKHN0LnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgICAgIG9mZnNldCAtPSBzdC5zb3VyY2UubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRlY2huaWNhbGx5LCBhbiBlbXB0eSBzY2FsYXIgaXMgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGxhc3Qgbm9uLWVtcHR5XG4gICAgICAgICAgICAvLyBub2RlLCBidXQgaXQncyBtb3JlIHVzZWZ1bCB0byBwbGFjZSBpdCBhZnRlciBhbnkgd2hpdGVzcGFjZS5cbiAgICAgICAgICAgIHN0ID0gYmVmb3JlWysraV07XG4gICAgICAgICAgICB3aGlsZSAoc3Q/LnR5cGUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gc3Quc291cmNlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBzdCA9IGJlZm9yZVsrK2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9mZnNldDtcbn1cblxuZXhwb3J0IHsgZW1wdHlTY2FsYXJQb3NpdGlvbiB9O1xuIiwgImltcG9ydCB7IEFsaWFzIH0gZnJvbSAnLi4vbm9kZXMvQWxpYXMuanMnO1xuaW1wb3J0IHsgaXNTY2FsYXIgfSBmcm9tICcuLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBjb21wb3NlQ29sbGVjdGlvbiB9IGZyb20gJy4vY29tcG9zZS1jb2xsZWN0aW9uLmpzJztcbmltcG9ydCB7IGNvbXBvc2VTY2FsYXIgfSBmcm9tICcuL2NvbXBvc2Utc2NhbGFyLmpzJztcbmltcG9ydCB7IHJlc29sdmVFbmQgfSBmcm9tICcuL3Jlc29sdmUtZW5kLmpzJztcbmltcG9ydCB7IGVtcHR5U2NhbGFyUG9zaXRpb24gfSBmcm9tICcuL3V0aWwtZW1wdHktc2NhbGFyLXBvc2l0aW9uLmpzJztcblxuY29uc3QgQ04gPSB7IGNvbXBvc2VOb2RlLCBjb21wb3NlRW1wdHlOb2RlIH07XG5mdW5jdGlvbiBjb21wb3NlTm9kZShjdHgsIHRva2VuLCBwcm9wcywgb25FcnJvcikge1xuICAgIGNvbnN0IGF0S2V5ID0gY3R4LmF0S2V5O1xuICAgIGNvbnN0IHsgc3BhY2VCZWZvcmUsIGNvbW1lbnQsIGFuY2hvciwgdGFnIH0gPSBwcm9wcztcbiAgICBsZXQgbm9kZTtcbiAgICBsZXQgaXNTcmNUb2tlbiA9IHRydWU7XG4gICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2FsaWFzJzpcbiAgICAgICAgICAgIG5vZGUgPSBjb21wb3NlQWxpYXMoY3R4LCB0b2tlbiwgb25FcnJvcik7XG4gICAgICAgICAgICBpZiAoYW5jaG9yIHx8IHRhZylcbiAgICAgICAgICAgICAgICBvbkVycm9yKHRva2VuLCAnQUxJQVNfUFJPUFMnLCAnQW4gYWxpYXMgbm9kZSBtdXN0IG5vdCBzcGVjaWZ5IGFueSBwcm9wZXJ0aWVzJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc2NhbGFyJzpcbiAgICAgICAgY2FzZSAnc2luZ2xlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICBjYXNlICdkb3VibGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgIGNhc2UgJ2Jsb2NrLXNjYWxhcic6XG4gICAgICAgICAgICBub2RlID0gY29tcG9zZVNjYWxhcihjdHgsIHRva2VuLCB0YWcsIG9uRXJyb3IpO1xuICAgICAgICAgICAgaWYgKGFuY2hvcilcbiAgICAgICAgICAgICAgICBub2RlLmFuY2hvciA9IGFuY2hvci5zb3VyY2Uuc3Vic3RyaW5nKDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Jsb2NrLW1hcCc6XG4gICAgICAgIGNhc2UgJ2Jsb2NrLXNlcSc6XG4gICAgICAgIGNhc2UgJ2Zsb3ctY29sbGVjdGlvbic6XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5vZGUgPSBjb21wb3NlQ29sbGVjdGlvbihDTiwgY3R4LCB0b2tlbiwgcHJvcHMsIG9uRXJyb3IpO1xuICAgICAgICAgICAgICAgIGlmIChhbmNob3IpXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuYW5jaG9yID0gYW5jaG9yLnNvdXJjZS5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAvLyBBbG1vc3QgY2VydGFpbmx5IGhlcmUgZHVlIHRvIGEgc3RhY2sgb3ZlcmZsb3dcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpO1xuICAgICAgICAgICAgICAgIG9uRXJyb3IodG9rZW4sICdSRVNPVVJDRV9FWEhBVVNUSU9OJywgbWVzc2FnZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IHRva2VuLnR5cGUgPT09ICdlcnJvcidcbiAgICAgICAgICAgICAgICA/IHRva2VuLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICA6IGBVbnN1cHBvcnRlZCB0b2tlbiAodHlwZTogJHt0b2tlbi50eXBlfSlgO1xuICAgICAgICAgICAgb25FcnJvcih0b2tlbiwgJ1VORVhQRUNURURfVE9LRU4nLCBtZXNzYWdlKTtcbiAgICAgICAgICAgIGlzU3JjVG9rZW4gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBub2RlID8/IChub2RlID0gY29tcG9zZUVtcHR5Tm9kZShjdHgsIHRva2VuLm9mZnNldCwgdW5kZWZpbmVkLCBudWxsLCBwcm9wcywgb25FcnJvcikpO1xuICAgIGlmIChhbmNob3IgJiYgbm9kZS5hbmNob3IgPT09ICcnKVxuICAgICAgICBvbkVycm9yKGFuY2hvciwgJ0JBRF9BTElBUycsICdBbmNob3IgY2Fubm90IGJlIGFuIGVtcHR5IHN0cmluZycpO1xuICAgIGlmIChhdEtleSAmJlxuICAgICAgICBjdHgub3B0aW9ucy5zdHJpbmdLZXlzICYmXG4gICAgICAgICghaXNTY2FsYXIobm9kZSkgfHxcbiAgICAgICAgICAgIHR5cGVvZiBub2RlLnZhbHVlICE9PSAnc3RyaW5nJyB8fFxuICAgICAgICAgICAgKG5vZGUudGFnICYmIG5vZGUudGFnICE9PSAndGFnOnlhbWwub3JnLDIwMDI6c3RyJykpKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9ICdXaXRoIHN0cmluZ0tleXMsIGFsbCBrZXlzIG11c3QgYmUgc3RyaW5ncyc7XG4gICAgICAgIG9uRXJyb3IodGFnID8/IHRva2VuLCAnTk9OX1NUUklOR19LRVknLCBtc2cpO1xuICAgIH1cbiAgICBpZiAoc3BhY2VCZWZvcmUpXG4gICAgICAgIG5vZGUuc3BhY2VCZWZvcmUgPSB0cnVlO1xuICAgIGlmIChjb21tZW50KSB7XG4gICAgICAgIGlmICh0b2tlbi50eXBlID09PSAnc2NhbGFyJyAmJiB0b2tlbi5zb3VyY2UgPT09ICcnKVxuICAgICAgICAgICAgbm9kZS5jb21tZW50ID0gY29tbWVudDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbm9kZS5jb21tZW50QmVmb3JlID0gY29tbWVudDtcbiAgICB9XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciBUeXBlIGNoZWNraW5nIG1pc3NlcyBtZWFuaW5nIG9mIGlzU3JjVG9rZW5cbiAgICBpZiAoY3R4Lm9wdGlvbnMua2VlcFNvdXJjZVRva2VucyAmJiBpc1NyY1Rva2VuKVxuICAgICAgICBub2RlLnNyY1Rva2VuID0gdG9rZW47XG4gICAgcmV0dXJuIG5vZGU7XG59XG5mdW5jdGlvbiBjb21wb3NlRW1wdHlOb2RlKGN0eCwgb2Zmc2V0LCBiZWZvcmUsIHBvcywgeyBzcGFjZUJlZm9yZSwgY29tbWVudCwgYW5jaG9yLCB0YWcsIGVuZCB9LCBvbkVycm9yKSB7XG4gICAgY29uc3QgdG9rZW4gPSB7XG4gICAgICAgIHR5cGU6ICdzY2FsYXInLFxuICAgICAgICBvZmZzZXQ6IGVtcHR5U2NhbGFyUG9zaXRpb24ob2Zmc2V0LCBiZWZvcmUsIHBvcyksXG4gICAgICAgIGluZGVudDogLTEsXG4gICAgICAgIHNvdXJjZTogJydcbiAgICB9O1xuICAgIGNvbnN0IG5vZGUgPSBjb21wb3NlU2NhbGFyKGN0eCwgdG9rZW4sIHRhZywgb25FcnJvcik7XG4gICAgaWYgKGFuY2hvcikge1xuICAgICAgICBub2RlLmFuY2hvciA9IGFuY2hvci5zb3VyY2Uuc3Vic3RyaW5nKDEpO1xuICAgICAgICBpZiAobm9kZS5hbmNob3IgPT09ICcnKVxuICAgICAgICAgICAgb25FcnJvcihhbmNob3IsICdCQURfQUxJQVMnLCAnQW5jaG9yIGNhbm5vdCBiZSBhbiBlbXB0eSBzdHJpbmcnKTtcbiAgICB9XG4gICAgaWYgKHNwYWNlQmVmb3JlKVxuICAgICAgICBub2RlLnNwYWNlQmVmb3JlID0gdHJ1ZTtcbiAgICBpZiAoY29tbWVudCkge1xuICAgICAgICBub2RlLmNvbW1lbnQgPSBjb21tZW50O1xuICAgICAgICBub2RlLnJhbmdlWzJdID0gZW5kO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbn1cbmZ1bmN0aW9uIGNvbXBvc2VBbGlhcyh7IG9wdGlvbnMgfSwgeyBvZmZzZXQsIHNvdXJjZSwgZW5kIH0sIG9uRXJyb3IpIHtcbiAgICBjb25zdCBhbGlhcyA9IG5ldyBBbGlhcyhzb3VyY2Uuc3Vic3RyaW5nKDEpKTtcbiAgICBpZiAoYWxpYXMuc291cmNlID09PSAnJylcbiAgICAgICAgb25FcnJvcihvZmZzZXQsICdCQURfQUxJQVMnLCAnQWxpYXMgY2Fubm90IGJlIGFuIGVtcHR5IHN0cmluZycpO1xuICAgIGlmIChhbGlhcy5zb3VyY2UuZW5kc1dpdGgoJzonKSlcbiAgICAgICAgb25FcnJvcihvZmZzZXQgKyBzb3VyY2UubGVuZ3RoIC0gMSwgJ0JBRF9BTElBUycsICdBbGlhcyBlbmRpbmcgaW4gOiBpcyBhbWJpZ3VvdXMnLCB0cnVlKTtcbiAgICBjb25zdCB2YWx1ZUVuZCA9IG9mZnNldCArIHNvdXJjZS5sZW5ndGg7XG4gICAgY29uc3QgcmUgPSByZXNvbHZlRW5kKGVuZCwgdmFsdWVFbmQsIG9wdGlvbnMuc3RyaWN0LCBvbkVycm9yKTtcbiAgICBhbGlhcy5yYW5nZSA9IFtvZmZzZXQsIHZhbHVlRW5kLCByZS5vZmZzZXRdO1xuICAgIGlmIChyZS5jb21tZW50KVxuICAgICAgICBhbGlhcy5jb21tZW50ID0gcmUuY29tbWVudDtcbiAgICByZXR1cm4gYWxpYXM7XG59XG5cbmV4cG9ydCB7IGNvbXBvc2VFbXB0eU5vZGUsIGNvbXBvc2VOb2RlIH07XG4iLCAiaW1wb3J0IHsgRG9jdW1lbnQgfSBmcm9tICcuLi9kb2MvRG9jdW1lbnQuanMnO1xuaW1wb3J0IHsgY29tcG9zZU5vZGUsIGNvbXBvc2VFbXB0eU5vZGUgfSBmcm9tICcuL2NvbXBvc2Utbm9kZS5qcyc7XG5pbXBvcnQgeyByZXNvbHZlRW5kIH0gZnJvbSAnLi9yZXNvbHZlLWVuZC5qcyc7XG5pbXBvcnQgeyByZXNvbHZlUHJvcHMgfSBmcm9tICcuL3Jlc29sdmUtcHJvcHMuanMnO1xuXG5mdW5jdGlvbiBjb21wb3NlRG9jKG9wdGlvbnMsIGRpcmVjdGl2ZXMsIHsgb2Zmc2V0LCBzdGFydCwgdmFsdWUsIGVuZCB9LCBvbkVycm9yKSB7XG4gICAgY29uc3Qgb3B0cyA9IE9iamVjdC5hc3NpZ24oeyBfZGlyZWN0aXZlczogZGlyZWN0aXZlcyB9LCBvcHRpb25zKTtcbiAgICBjb25zdCBkb2MgPSBuZXcgRG9jdW1lbnQodW5kZWZpbmVkLCBvcHRzKTtcbiAgICBjb25zdCBjdHggPSB7XG4gICAgICAgIGF0S2V5OiBmYWxzZSxcbiAgICAgICAgYXRSb290OiB0cnVlLFxuICAgICAgICBkaXJlY3RpdmVzOiBkb2MuZGlyZWN0aXZlcyxcbiAgICAgICAgb3B0aW9uczogZG9jLm9wdGlvbnMsXG4gICAgICAgIHNjaGVtYTogZG9jLnNjaGVtYVxuICAgIH07XG4gICAgY29uc3QgcHJvcHMgPSByZXNvbHZlUHJvcHMoc3RhcnQsIHtcbiAgICAgICAgaW5kaWNhdG9yOiAnZG9jLXN0YXJ0JyxcbiAgICAgICAgbmV4dDogdmFsdWUgPz8gZW5kPy5bMF0sXG4gICAgICAgIG9mZnNldCxcbiAgICAgICAgb25FcnJvcixcbiAgICAgICAgcGFyZW50SW5kZW50OiAwLFxuICAgICAgICBzdGFydE9uTmV3bGluZTogdHJ1ZVxuICAgIH0pO1xuICAgIGlmIChwcm9wcy5mb3VuZCkge1xuICAgICAgICBkb2MuZGlyZWN0aXZlcy5kb2NTdGFydCA9IHRydWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgKHZhbHVlLnR5cGUgPT09ICdibG9jay1tYXAnIHx8IHZhbHVlLnR5cGUgPT09ICdibG9jay1zZXEnKSAmJlxuICAgICAgICAgICAgIXByb3BzLmhhc05ld2xpbmUpXG4gICAgICAgICAgICBvbkVycm9yKHByb3BzLmVuZCwgJ01JU1NJTkdfQ0hBUicsICdCbG9jayBjb2xsZWN0aW9uIGNhbm5vdCBzdGFydCBvbiBzYW1lIGxpbmUgd2l0aCBkaXJlY3RpdmVzLWVuZCBtYXJrZXInKTtcbiAgICB9XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciBJZiBDb250ZW50cyBpcyBzZXQsIGxldCdzIHRydXN0IHRoZSB1c2VyXG4gICAgZG9jLmNvbnRlbnRzID0gdmFsdWVcbiAgICAgICAgPyBjb21wb3NlTm9kZShjdHgsIHZhbHVlLCBwcm9wcywgb25FcnJvcilcbiAgICAgICAgOiBjb21wb3NlRW1wdHlOb2RlKGN0eCwgcHJvcHMuZW5kLCBzdGFydCwgbnVsbCwgcHJvcHMsIG9uRXJyb3IpO1xuICAgIGNvbnN0IGNvbnRlbnRFbmQgPSBkb2MuY29udGVudHMucmFuZ2VbMl07XG4gICAgY29uc3QgcmUgPSByZXNvbHZlRW5kKGVuZCwgY29udGVudEVuZCwgZmFsc2UsIG9uRXJyb3IpO1xuICAgIGlmIChyZS5jb21tZW50KVxuICAgICAgICBkb2MuY29tbWVudCA9IHJlLmNvbW1lbnQ7XG4gICAgZG9jLnJhbmdlID0gW29mZnNldCwgY29udGVudEVuZCwgcmUub2Zmc2V0XTtcbiAgICByZXR1cm4gZG9jO1xufVxuXG5leHBvcnQgeyBjb21wb3NlRG9jIH07XG4iLCAiaW1wb3J0IHsgRGlyZWN0aXZlcyB9IGZyb20gJy4uL2RvYy9kaXJlY3RpdmVzLmpzJztcbmltcG9ydCB7IERvY3VtZW50IH0gZnJvbSAnLi4vZG9jL0RvY3VtZW50LmpzJztcbmltcG9ydCB7IFlBTUxXYXJuaW5nLCBZQU1MUGFyc2VFcnJvciB9IGZyb20gJy4uL2Vycm9ycy5qcyc7XG5pbXBvcnQgeyBpc0NvbGxlY3Rpb24sIGlzUGFpciB9IGZyb20gJy4uL25vZGVzL2lkZW50aXR5LmpzJztcbmltcG9ydCB7IGNvbXBvc2VEb2MgfSBmcm9tICcuL2NvbXBvc2UtZG9jLmpzJztcbmltcG9ydCB7IHJlc29sdmVFbmQgfSBmcm9tICcuL3Jlc29sdmUtZW5kLmpzJztcblxuZnVuY3Rpb24gZ2V0RXJyb3JQb3Moc3JjKSB7XG4gICAgaWYgKHR5cGVvZiBzcmMgPT09ICdudW1iZXInKVxuICAgICAgICByZXR1cm4gW3NyYywgc3JjICsgMV07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc3JjKSlcbiAgICAgICAgcmV0dXJuIHNyYy5sZW5ndGggPT09IDIgPyBzcmMgOiBbc3JjWzBdLCBzcmNbMV1dO1xuICAgIGNvbnN0IHsgb2Zmc2V0LCBzb3VyY2UgfSA9IHNyYztcbiAgICByZXR1cm4gW29mZnNldCwgb2Zmc2V0ICsgKHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnID8gc291cmNlLmxlbmd0aCA6IDEpXTtcbn1cbmZ1bmN0aW9uIHBhcnNlUHJlbHVkZShwcmVsdWRlKSB7XG4gICAgbGV0IGNvbW1lbnQgPSAnJztcbiAgICBsZXQgYXRDb21tZW50ID0gZmFsc2U7XG4gICAgbGV0IGFmdGVyRW1wdHlMaW5lID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmVsdWRlLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IHByZWx1ZGVbaV07XG4gICAgICAgIHN3aXRjaCAoc291cmNlWzBdKSB7XG4gICAgICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgICAgICAgICBjb21tZW50ICs9XG4gICAgICAgICAgICAgICAgICAgIChjb21tZW50ID09PSAnJyA/ICcnIDogYWZ0ZXJFbXB0eUxpbmUgPyAnXFxuXFxuJyA6ICdcXG4nKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAoc291cmNlLnN1YnN0cmluZygxKSB8fCAnICcpO1xuICAgICAgICAgICAgICAgIGF0Q29tbWVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgYWZ0ZXJFbXB0eUxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJyUnOlxuICAgICAgICAgICAgICAgIGlmIChwcmVsdWRlW2kgKyAxXT8uWzBdICE9PSAnIycpXG4gICAgICAgICAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgICAgICAgICBhdENvbW1lbnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBtYXkgYmUgd3JvbmcgYWZ0ZXIgZG9jLWVuZCwgYnV0IGluIHRoYXQgY2FzZSBpdCBkb2Vzbid0IG1hdHRlclxuICAgICAgICAgICAgICAgIGlmICghYXRDb21tZW50KVxuICAgICAgICAgICAgICAgICAgICBhZnRlckVtcHR5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYXRDb21tZW50ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgY29tbWVudCwgYWZ0ZXJFbXB0eUxpbmUgfTtcbn1cbi8qKlxuICogQ29tcG9zZSBhIHN0cmVhbSBvZiBDU1Qgbm9kZXMgaW50byBhIHN0cmVhbSBvZiBZQU1MIERvY3VtZW50cy5cbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgQ29tcG9zZXIsIFBhcnNlciB9IGZyb20gJ3lhbWwnXG4gKlxuICogY29uc3Qgc3JjOiBzdHJpbmcgPSAuLi5cbiAqIGNvbnN0IHRva2VucyA9IG5ldyBQYXJzZXIoKS5wYXJzZShzcmMpXG4gKiBjb25zdCBkb2NzID0gbmV3IENvbXBvc2VyKCkuY29tcG9zZSh0b2tlbnMpXG4gKiBgYGBcbiAqL1xuY2xhc3MgQ29tcG9zZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLmRvYyA9IG51bGw7XG4gICAgICAgIHRoaXMuYXREaXJlY3RpdmVzID0gZmFsc2U7XG4gICAgICAgIHRoaXMucHJlbHVkZSA9IFtdO1xuICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xuICAgICAgICB0aGlzLndhcm5pbmdzID0gW107XG4gICAgICAgIHRoaXMub25FcnJvciA9IChzb3VyY2UsIGNvZGUsIG1lc3NhZ2UsIHdhcm5pbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IGdldEVycm9yUG9zKHNvdXJjZSk7XG4gICAgICAgICAgICBpZiAod2FybmluZylcbiAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmdzLnB1c2gobmV3IFlBTUxXYXJuaW5nKHBvcywgY29kZSwgbWVzc2FnZSkpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IFlBTUxQYXJzZUVycm9yKHBvcywgY29kZSwgbWVzc2FnZSkpO1xuICAgICAgICB9O1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3ByZWZlci1udWxsaXNoLWNvYWxlc2NpbmdcbiAgICAgICAgdGhpcy5kaXJlY3RpdmVzID0gbmV3IERpcmVjdGl2ZXMoeyB2ZXJzaW9uOiBvcHRpb25zLnZlcnNpb24gfHwgJzEuMicgfSk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIGRlY29yYXRlKGRvYywgYWZ0ZXJEb2MpIHtcbiAgICAgICAgY29uc3QgeyBjb21tZW50LCBhZnRlckVtcHR5TGluZSB9ID0gcGFyc2VQcmVsdWRlKHRoaXMucHJlbHVkZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coeyBkYzogZG9jLmNvbW1lbnQsIHByZWx1ZGUsIGNvbW1lbnQgfSlcbiAgICAgICAgaWYgKGNvbW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGRjID0gZG9jLmNvbnRlbnRzO1xuICAgICAgICAgICAgaWYgKGFmdGVyRG9jKSB7XG4gICAgICAgICAgICAgICAgZG9jLmNvbW1lbnQgPSBkb2MuY29tbWVudCA/IGAke2RvYy5jb21tZW50fVxcbiR7Y29tbWVudH1gIDogY29tbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGFmdGVyRW1wdHlMaW5lIHx8IGRvYy5kaXJlY3RpdmVzLmRvY1N0YXJ0IHx8ICFkYykge1xuICAgICAgICAgICAgICAgIGRvYy5jb21tZW50QmVmb3JlID0gY29tbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGlzQ29sbGVjdGlvbihkYykgJiYgIWRjLmZsb3cgJiYgZGMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGxldCBpdCA9IGRjLml0ZW1zWzBdO1xuICAgICAgICAgICAgICAgIGlmIChpc1BhaXIoaXQpKVxuICAgICAgICAgICAgICAgICAgICBpdCA9IGl0LmtleTtcbiAgICAgICAgICAgICAgICBjb25zdCBjYiA9IGl0LmNvbW1lbnRCZWZvcmU7XG4gICAgICAgICAgICAgICAgaXQuY29tbWVudEJlZm9yZSA9IGNiID8gYCR7Y29tbWVudH1cXG4ke2NifWAgOiBjb21tZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2IgPSBkYy5jb21tZW50QmVmb3JlO1xuICAgICAgICAgICAgICAgIGRjLmNvbW1lbnRCZWZvcmUgPSBjYiA/IGAke2NvbW1lbnR9XFxuJHtjYn1gIDogY29tbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYWZ0ZXJEb2MpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lcnJvcnMubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICAgICAgZG9jLmVycm9ycy5wdXNoKHRoaXMuZXJyb3JzW2ldKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53YXJuaW5ncy5sZW5ndGg7ICsraSlcbiAgICAgICAgICAgICAgICBkb2Mud2FybmluZ3MucHVzaCh0aGlzLndhcm5pbmdzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRvYy5lcnJvcnMgPSB0aGlzLmVycm9ycztcbiAgICAgICAgICAgIGRvYy53YXJuaW5ncyA9IHRoaXMud2FybmluZ3M7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmVsdWRlID0gW107XG4gICAgICAgIHRoaXMuZXJyb3JzID0gW107XG4gICAgICAgIHRoaXMud2FybmluZ3MgPSBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3VycmVudCBzdHJlYW0gc3RhdHVzIGluZm9ybWF0aW9uLlxuICAgICAqXG4gICAgICogTW9zdGx5IHVzZWZ1bCBhdCB0aGUgZW5kIG9mIGlucHV0IGZvciBhbiBlbXB0eSBzdHJlYW0uXG4gICAgICovXG4gICAgc3RyZWFtSW5mbygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbW1lbnQ6IHBhcnNlUHJlbHVkZSh0aGlzLnByZWx1ZGUpLmNvbW1lbnQsXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiB0aGlzLmRpcmVjdGl2ZXMsXG4gICAgICAgICAgICBlcnJvcnM6IHRoaXMuZXJyb3JzLFxuICAgICAgICAgICAgd2FybmluZ3M6IHRoaXMud2FybmluZ3NcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcG9zZSB0b2tlbnMgaW50byBkb2N1bWVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZm9yY2VEb2MgLSBJZiB0aGUgc3RyZWFtIGNvbnRhaW5zIG5vIGRvY3VtZW50LCBzdGlsbCBlbWl0IGEgZmluYWwgZG9jdW1lbnQgaW5jbHVkaW5nIGFueSBjb21tZW50cyBhbmQgZGlyZWN0aXZlcyB0aGF0IHdvdWxkIGJlIGFwcGxpZWQgdG8gYSBzdWJzZXF1ZW50IGRvY3VtZW50LlxuICAgICAqIEBwYXJhbSBlbmRPZmZzZXQgLSBTaG91bGQgYmUgc2V0IGlmIGBmb3JjZURvY2AgaXMgYWxzbyBzZXQsIHRvIHNldCB0aGUgZG9jdW1lbnQgcmFuZ2UgZW5kIGFuZCB0byBpbmRpY2F0ZSBlcnJvcnMgY29ycmVjdGx5LlxuICAgICAqL1xuICAgICpjb21wb3NlKHRva2VucywgZm9yY2VEb2MgPSBmYWxzZSwgZW5kT2Zmc2V0ID0gLTEpIHtcbiAgICAgICAgZm9yIChjb25zdCB0b2tlbiBvZiB0b2tlbnMpXG4gICAgICAgICAgICB5aWVsZCogdGhpcy5uZXh0KHRva2VuKTtcbiAgICAgICAgeWllbGQqIHRoaXMuZW5kKGZvcmNlRG9jLCBlbmRPZmZzZXQpO1xuICAgIH1cbiAgICAvKiogQWR2YW5jZSB0aGUgY29tcG9zZXIgYnkgb25lIENTVCB0b2tlbi4gKi9cbiAgICAqbmV4dCh0b2tlbikge1xuICAgICAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGl2ZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5kaXJlY3RpdmVzLmFkZCh0b2tlbi5zb3VyY2UsIChvZmZzZXQsIG1lc3NhZ2UsIHdhcm5pbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zID0gZ2V0RXJyb3JQb3ModG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBwb3NbMF0gKz0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uRXJyb3IocG9zLCAnQkFEX0RJUkVDVElWRScsIG1lc3NhZ2UsIHdhcm5pbmcpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMucHJlbHVkZS5wdXNoKHRva2VuLnNvdXJjZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hdERpcmVjdGl2ZXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZG9jID0gY29tcG9zZURvYyh0aGlzLm9wdGlvbnMsIHRoaXMuZGlyZWN0aXZlcywgdG9rZW4sIHRoaXMub25FcnJvcik7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXREaXJlY3RpdmVzICYmICFkb2MuZGlyZWN0aXZlcy5kb2NTdGFydClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yKHRva2VuLCAnTUlTU0lOR19DSEFSJywgJ01pc3NpbmcgZGlyZWN0aXZlcy1lbmQvZG9jLXN0YXJ0IGluZGljYXRvciBsaW5lJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWNvcmF0ZShkb2MsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kb2MpXG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMuZG9jO1xuICAgICAgICAgICAgICAgIHRoaXMuZG9jID0gZG9jO1xuICAgICAgICAgICAgICAgIHRoaXMuYXREaXJlY3RpdmVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdieXRlLW9yZGVyLW1hcmsnOlxuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICB0aGlzLnByZWx1ZGUucHVzaCh0b2tlbi5zb3VyY2UpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnZXJyb3InOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gdG9rZW4uc291cmNlXG4gICAgICAgICAgICAgICAgICAgID8gYCR7dG9rZW4ubWVzc2FnZX06ICR7SlNPTi5zdHJpbmdpZnkodG9rZW4uc291cmNlKX1gXG4gICAgICAgICAgICAgICAgICAgIDogdG9rZW4ubWVzc2FnZTtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBZQU1MUGFyc2VFcnJvcihnZXRFcnJvclBvcyh0b2tlbiksICdVTkVYUEVDVEVEX1RPS0VOJywgbXNnKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdERpcmVjdGl2ZXMgfHwgIXRoaXMuZG9jKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG9jLmVycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ2RvYy1lbmQnOiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRvYykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSAnVW5leHBlY3RlZCBkb2MtZW5kIHdpdGhvdXQgcHJlY2VkaW5nIGRvY3VtZW50JztcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgWUFNTFBhcnNlRXJyb3IoZ2V0RXJyb3JQb3ModG9rZW4pLCAnVU5FWFBFQ1RFRF9UT0tFTicsIG1zZykpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kb2MuZGlyZWN0aXZlcy5kb2NFbmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVuZCA9IHJlc29sdmVFbmQodG9rZW4uZW5kLCB0b2tlbi5vZmZzZXQgKyB0b2tlbi5zb3VyY2UubGVuZ3RoLCB0aGlzLmRvYy5vcHRpb25zLnN0cmljdCwgdGhpcy5vbkVycm9yKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY29yYXRlKHRoaXMuZG9jLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBpZiAoZW5kLmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGMgPSB0aGlzLmRvYy5jb21tZW50O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvYy5jb21tZW50ID0gZGMgPyBgJHtkY31cXG4ke2VuZC5jb21tZW50fWAgOiBlbmQuY29tbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kb2MucmFuZ2VbMl0gPSBlbmQub2Zmc2V0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKG5ldyBZQU1MUGFyc2VFcnJvcihnZXRFcnJvclBvcyh0b2tlbiksICdVTkVYUEVDVEVEX1RPS0VOJywgYFVuc3VwcG9ydGVkIHRva2VuICR7dG9rZW4udHlwZX1gKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2FsbCBhdCBlbmQgb2YgaW5wdXQgdG8geWllbGQgYW55IHJlbWFpbmluZyBkb2N1bWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmb3JjZURvYyAtIElmIHRoZSBzdHJlYW0gY29udGFpbnMgbm8gZG9jdW1lbnQsIHN0aWxsIGVtaXQgYSBmaW5hbCBkb2N1bWVudCBpbmNsdWRpbmcgYW55IGNvbW1lbnRzIGFuZCBkaXJlY3RpdmVzIHRoYXQgd291bGQgYmUgYXBwbGllZCB0byBhIHN1YnNlcXVlbnQgZG9jdW1lbnQuXG4gICAgICogQHBhcmFtIGVuZE9mZnNldCAtIFNob3VsZCBiZSBzZXQgaWYgYGZvcmNlRG9jYCBpcyBhbHNvIHNldCwgdG8gc2V0IHRoZSBkb2N1bWVudCByYW5nZSBlbmQgYW5kIHRvIGluZGljYXRlIGVycm9ycyBjb3JyZWN0bHkuXG4gICAgICovXG4gICAgKmVuZChmb3JjZURvYyA9IGZhbHNlLCBlbmRPZmZzZXQgPSAtMSkge1xuICAgICAgICBpZiAodGhpcy5kb2MpIHtcbiAgICAgICAgICAgIHRoaXMuZGVjb3JhdGUodGhpcy5kb2MsIHRydWUpO1xuICAgICAgICAgICAgeWllbGQgdGhpcy5kb2M7XG4gICAgICAgICAgICB0aGlzLmRvYyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZm9yY2VEb2MpIHtcbiAgICAgICAgICAgIGNvbnN0IG9wdHMgPSBPYmplY3QuYXNzaWduKHsgX2RpcmVjdGl2ZXM6IHRoaXMuZGlyZWN0aXZlcyB9LCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICAgICAgY29uc3QgZG9jID0gbmV3IERvY3VtZW50KHVuZGVmaW5lZCwgb3B0cyk7XG4gICAgICAgICAgICBpZiAodGhpcy5hdERpcmVjdGl2ZXMpXG4gICAgICAgICAgICAgICAgdGhpcy5vbkVycm9yKGVuZE9mZnNldCwgJ01JU1NJTkdfQ0hBUicsICdNaXNzaW5nIGRpcmVjdGl2ZXMtZW5kIGluZGljYXRvciBsaW5lJyk7XG4gICAgICAgICAgICBkb2MucmFuZ2UgPSBbMCwgZW5kT2Zmc2V0LCBlbmRPZmZzZXRdO1xuICAgICAgICAgICAgdGhpcy5kZWNvcmF0ZShkb2MsIGZhbHNlKTtcbiAgICAgICAgICAgIHlpZWxkIGRvYztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgQ29tcG9zZXIgfTtcbiIsICJjb25zdCBCUkVBSyA9IFN5bWJvbCgnYnJlYWsgdmlzaXQnKTtcbmNvbnN0IFNLSVAgPSBTeW1ib2woJ3NraXAgY2hpbGRyZW4nKTtcbmNvbnN0IFJFTU9WRSA9IFN5bWJvbCgncmVtb3ZlIGl0ZW0nKTtcbi8qKlxuICogQXBwbHkgYSB2aXNpdG9yIHRvIGEgQ1NUIGRvY3VtZW50IG9yIGl0ZW0uXG4gKlxuICogV2Fsa3MgdGhyb3VnaCB0aGUgdHJlZSAoZGVwdGgtZmlyc3QpIHN0YXJ0aW5nIGZyb20gdGhlIHJvb3QsIGNhbGxpbmcgYVxuICogYHZpc2l0b3JgIGZ1bmN0aW9uIHdpdGggdHdvIGFyZ3VtZW50cyB3aGVuIGVudGVyaW5nIGVhY2ggaXRlbTpcbiAqICAgLSBgaXRlbWA6IFRoZSBjdXJyZW50IGl0ZW0sIHdoaWNoIGluY2x1ZGVkIHRoZSBmb2xsb3dpbmcgbWVtYmVyczpcbiAqICAgICAtIGBzdGFydDogU291cmNlVG9rZW5bXWAgXHUyMDEzIFNvdXJjZSB0b2tlbnMgYmVmb3JlIHRoZSBrZXkgb3IgdmFsdWUsXG4gKiAgICAgICBwb3NzaWJseSBpbmNsdWRpbmcgaXRzIGFuY2hvciBvciB0YWcuXG4gKiAgICAgLSBga2V5PzogVG9rZW4gfCBudWxsYCBcdTIwMTMgU2V0IGZvciBwYWlyIHZhbHVlcy4gTWF5IHRoZW4gYmUgYG51bGxgLCBpZlxuICogICAgICAgdGhlIGtleSBiZWZvcmUgdGhlIGA6YCBzZXBhcmF0b3IgaXMgZW1wdHkuXG4gKiAgICAgLSBgc2VwPzogU291cmNlVG9rZW5bXWAgXHUyMDEzIFNvdXJjZSB0b2tlbnMgYmV0d2VlbiB0aGUga2V5IGFuZCB0aGUgdmFsdWUsXG4gKiAgICAgICB3aGljaCBzaG91bGQgaW5jbHVkZSB0aGUgYDpgIG1hcCB2YWx1ZSBpbmRpY2F0b3IgaWYgYHZhbHVlYCBpcyBzZXQuXG4gKiAgICAgLSBgdmFsdWU/OiBUb2tlbmAgXHUyMDEzIFRoZSB2YWx1ZSBvZiBhIHNlcXVlbmNlIGl0ZW0sIG9yIG9mIGEgbWFwIHBhaXIuXG4gKiAgIC0gYHBhdGhgOiBUaGUgc3RlcHMgZnJvbSB0aGUgcm9vdCB0byB0aGUgY3VycmVudCBub2RlLCBhcyBhbiBhcnJheSBvZlxuICogICAgIGBbJ2tleScgfCAndmFsdWUnLCBudW1iZXJdYCB0dXBsZXMuXG4gKlxuICogVGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgdmlzaXRvciBtYXkgYmUgdXNlZCB0byBjb250cm9sIHRoZSB0cmF2ZXJzYWw6XG4gKiAgIC0gYHVuZGVmaW5lZGAgKGRlZmF1bHQpOiBEbyBub3RoaW5nIGFuZCBjb250aW51ZVxuICogICAtIGB2aXNpdC5TS0lQYDogRG8gbm90IHZpc2l0IHRoZSBjaGlsZHJlbiBvZiB0aGlzIHRva2VuLCBjb250aW51ZSB3aXRoXG4gKiAgICAgIG5leHQgc2libGluZ1xuICogICAtIGB2aXNpdC5CUkVBS2A6IFRlcm1pbmF0ZSB0cmF2ZXJzYWwgY29tcGxldGVseVxuICogICAtIGB2aXNpdC5SRU1PVkVgOiBSZW1vdmUgdGhlIGN1cnJlbnQgaXRlbSwgdGhlbiBjb250aW51ZSB3aXRoIHRoZSBuZXh0IG9uZVxuICogICAtIGBudW1iZXJgOiBTZXQgdGhlIGluZGV4IG9mIHRoZSBuZXh0IHN0ZXAuIFRoaXMgaXMgdXNlZnVsIGVzcGVjaWFsbHkgaWZcbiAqICAgICB0aGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgdG9rZW4gaGFzIGNoYW5nZWQuXG4gKiAgIC0gYGZ1bmN0aW9uYDogRGVmaW5lIHRoZSBuZXh0IHZpc2l0b3IgZm9yIHRoaXMgaXRlbS4gQWZ0ZXIgdGhlIG9yaWdpbmFsXG4gKiAgICAgdmlzaXRvciBpcyBjYWxsZWQgb24gaXRlbSBlbnRyeSwgbmV4dCB2aXNpdG9ycyBhcmUgY2FsbGVkIGFmdGVyIGhhbmRsaW5nXG4gKiAgICAgYSBub24tZW1wdHkgYGtleWAgYW5kIHdoZW4gZXhpdGluZyB0aGUgaXRlbS5cbiAqL1xuZnVuY3Rpb24gdmlzaXQoY3N0LCB2aXNpdG9yKSB7XG4gICAgaWYgKCd0eXBlJyBpbiBjc3QgJiYgY3N0LnR5cGUgPT09ICdkb2N1bWVudCcpXG4gICAgICAgIGNzdCA9IHsgc3RhcnQ6IGNzdC5zdGFydCwgdmFsdWU6IGNzdC52YWx1ZSB9O1xuICAgIF92aXNpdChPYmplY3QuZnJlZXplKFtdKSwgY3N0LCB2aXNpdG9yKTtcbn1cbi8vIFdpdGhvdXQgdGhlIGBhcyBzeW1ib2xgIGNhc3RzLCBUUyBkZWNsYXJlcyB0aGVzZSBpbiB0aGUgYHZpc2l0YFxuLy8gbmFtZXNwYWNlIHVzaW5nIGB2YXJgLCBidXQgdGhlbiBjb21wbGFpbnMgYWJvdXQgdGhhdCBiZWNhdXNlXG4vLyBgdW5pcXVlIHN5bWJvbGAgbXVzdCBiZSBgY29uc3RgLlxuLyoqIFRlcm1pbmF0ZSB2aXNpdCB0cmF2ZXJzYWwgY29tcGxldGVseSAqL1xudmlzaXQuQlJFQUsgPSBCUkVBSztcbi8qKiBEbyBub3QgdmlzaXQgdGhlIGNoaWxkcmVuIG9mIHRoZSBjdXJyZW50IGl0ZW0gKi9cbnZpc2l0LlNLSVAgPSBTS0lQO1xuLyoqIFJlbW92ZSB0aGUgY3VycmVudCBpdGVtICovXG52aXNpdC5SRU1PVkUgPSBSRU1PVkU7XG4vKiogRmluZCB0aGUgaXRlbSBhdCBgcGF0aGAgZnJvbSBgY3N0YCBhcyB0aGUgcm9vdCAqL1xudmlzaXQuaXRlbUF0UGF0aCA9IChjc3QsIHBhdGgpID0+IHtcbiAgICBsZXQgaXRlbSA9IGNzdDtcbiAgICBmb3IgKGNvbnN0IFtmaWVsZCwgaW5kZXhdIG9mIHBhdGgpIHtcbiAgICAgICAgY29uc3QgdG9rID0gaXRlbT8uW2ZpZWxkXTtcbiAgICAgICAgaWYgKHRvayAmJiAnaXRlbXMnIGluIHRvaykge1xuICAgICAgICAgICAgaXRlbSA9IHRvay5pdGVtc1tpbmRleF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW07XG59O1xuLyoqXG4gKiBHZXQgdGhlIGltbWVkaWF0ZSBwYXJlbnQgY29sbGVjdGlvbiBvZiB0aGUgaXRlbSBhdCBgcGF0aGAgZnJvbSBgY3N0YCBhcyB0aGUgcm9vdC5cbiAqXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgdGhlIGNvbGxlY3Rpb24gaXMgbm90IGZvdW5kLCB3aGljaCBzaG91bGQgbmV2ZXIgaGFwcGVuIGlmIHRoZSBpdGVtIGl0c2VsZiBleGlzdHMuXG4gKi9cbnZpc2l0LnBhcmVudENvbGxlY3Rpb24gPSAoY3N0LCBwYXRoKSA9PiB7XG4gICAgY29uc3QgcGFyZW50ID0gdmlzaXQuaXRlbUF0UGF0aChjc3QsIHBhdGguc2xpY2UoMCwgLTEpKTtcbiAgICBjb25zdCBmaWVsZCA9IHBhdGhbcGF0aC5sZW5ndGggLSAxXVswXTtcbiAgICBjb25zdCBjb2xsID0gcGFyZW50Py5bZmllbGRdO1xuICAgIGlmIChjb2xsICYmICdpdGVtcycgaW4gY29sbClcbiAgICAgICAgcmV0dXJuIGNvbGw7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQYXJlbnQgY29sbGVjdGlvbiBub3QgZm91bmQnKTtcbn07XG5mdW5jdGlvbiBfdmlzaXQocGF0aCwgaXRlbSwgdmlzaXRvcikge1xuICAgIGxldCBjdHJsID0gdmlzaXRvcihpdGVtLCBwYXRoKTtcbiAgICBpZiAodHlwZW9mIGN0cmwgPT09ICdzeW1ib2wnKVxuICAgICAgICByZXR1cm4gY3RybDtcbiAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIFsna2V5JywgJ3ZhbHVlJ10pIHtcbiAgICAgICAgY29uc3QgdG9rZW4gPSBpdGVtW2ZpZWxkXTtcbiAgICAgICAgaWYgKHRva2VuICYmICdpdGVtcycgaW4gdG9rZW4pIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW4uaXRlbXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaSA9IF92aXNpdChPYmplY3QuZnJlZXplKHBhdGguY29uY2F0KFtbZmllbGQsIGldXSkpLCB0b2tlbi5pdGVtc1tpXSwgdmlzaXRvcik7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjaSA9PT0gJ251bWJlcicpXG4gICAgICAgICAgICAgICAgICAgIGkgPSBjaSAtIDE7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2kgPT09IEJSRUFLKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gQlJFQUs7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoY2kgPT09IFJFTU9WRSkge1xuICAgICAgICAgICAgICAgICAgICB0b2tlbi5pdGVtcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGkgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGN0cmwgPT09ICdmdW5jdGlvbicgJiYgZmllbGQgPT09ICdrZXknKVxuICAgICAgICAgICAgICAgIGN0cmwgPSBjdHJsKGl0ZW0sIHBhdGgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0eXBlb2YgY3RybCA9PT0gJ2Z1bmN0aW9uJyA/IGN0cmwoaXRlbSwgcGF0aCkgOiBjdHJsO1xufVxuXG5leHBvcnQgeyB2aXNpdCB9O1xuIiwgImV4cG9ydCB7IGNyZWF0ZVNjYWxhclRva2VuLCByZXNvbHZlQXNTY2FsYXIsIHNldFNjYWxhclZhbHVlIH0gZnJvbSAnLi9jc3Qtc2NhbGFyLmpzJztcbmV4cG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gJy4vY3N0LXN0cmluZ2lmeS5qcyc7XG5leHBvcnQgeyB2aXNpdCB9IGZyb20gJy4vY3N0LXZpc2l0LmpzJztcblxuLyoqIFRoZSBieXRlIG9yZGVyIG1hcmsgKi9cbmNvbnN0IEJPTSA9ICdcXHV7RkVGRn0nO1xuLyoqIFN0YXJ0IG9mIGRvYy1tb2RlICovXG5jb25zdCBET0NVTUVOVCA9ICdcXHgwMic7IC8vIEMwOiBTdGFydCBvZiBUZXh0XG4vKiogVW5leHBlY3RlZCBlbmQgb2YgZmxvdy1tb2RlICovXG5jb25zdCBGTE9XX0VORCA9ICdcXHgxOCc7IC8vIEMwOiBDYW5jZWxcbi8qKiBOZXh0IHRva2VuIGlzIGEgc2NhbGFyIHZhbHVlICovXG5jb25zdCBTQ0FMQVIgPSAnXFx4MWYnOyAvLyBDMDogVW5pdCBTZXBhcmF0b3Jcbi8qKiBAcmV0dXJucyBgdHJ1ZWAgaWYgYHRva2VuYCBpcyBhIGZsb3cgb3IgYmxvY2sgY29sbGVjdGlvbiAqL1xuY29uc3QgaXNDb2xsZWN0aW9uID0gKHRva2VuKSA9PiAhIXRva2VuICYmICdpdGVtcycgaW4gdG9rZW47XG4vKiogQHJldHVybnMgYHRydWVgIGlmIGB0b2tlbmAgaXMgYSBmbG93IG9yIGJsb2NrIHNjYWxhcjsgbm90IGFuIGFsaWFzICovXG5jb25zdCBpc1NjYWxhciA9ICh0b2tlbikgPT4gISF0b2tlbiAmJlxuICAgICh0b2tlbi50eXBlID09PSAnc2NhbGFyJyB8fFxuICAgICAgICB0b2tlbi50eXBlID09PSAnc2luZ2xlLXF1b3RlZC1zY2FsYXInIHx8XG4gICAgICAgIHRva2VuLnR5cGUgPT09ICdkb3VibGUtcXVvdGVkLXNjYWxhcicgfHxcbiAgICAgICAgdG9rZW4udHlwZSA9PT0gJ2Jsb2NrLXNjYWxhcicpO1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbi8qKiBHZXQgYSBwcmludGFibGUgcmVwcmVzZW50YXRpb24gb2YgYSBsZXhlciB0b2tlbiAqL1xuZnVuY3Rpb24gcHJldHR5VG9rZW4odG9rZW4pIHtcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAgIGNhc2UgQk9NOlxuICAgICAgICAgICAgcmV0dXJuICc8Qk9NPic7XG4gICAgICAgIGNhc2UgRE9DVU1FTlQ6XG4gICAgICAgICAgICByZXR1cm4gJzxET0M+JztcbiAgICAgICAgY2FzZSBGTE9XX0VORDpcbiAgICAgICAgICAgIHJldHVybiAnPEZMT1dfRU5EPic7XG4gICAgICAgIGNhc2UgU0NBTEFSOlxuICAgICAgICAgICAgcmV0dXJuICc8U0NBTEFSPic7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodG9rZW4pO1xuICAgIH1cbn1cbi8qKiBJZGVudGlmeSB0aGUgdHlwZSBvZiBhIGxleGVyIHRva2VuLiBNYXkgcmV0dXJuIGBudWxsYCBmb3IgdW5rbm93biB0b2tlbnMuICovXG5mdW5jdGlvbiB0b2tlblR5cGUoc291cmNlKSB7XG4gICAgc3dpdGNoIChzb3VyY2UpIHtcbiAgICAgICAgY2FzZSBCT006XG4gICAgICAgICAgICByZXR1cm4gJ2J5dGUtb3JkZXItbWFyayc7XG4gICAgICAgIGNhc2UgRE9DVU1FTlQ6XG4gICAgICAgICAgICByZXR1cm4gJ2RvYy1tb2RlJztcbiAgICAgICAgY2FzZSBGTE9XX0VORDpcbiAgICAgICAgICAgIHJldHVybiAnZmxvdy1lcnJvci1lbmQnO1xuICAgICAgICBjYXNlIFNDQUxBUjpcbiAgICAgICAgICAgIHJldHVybiAnc2NhbGFyJztcbiAgICAgICAgY2FzZSAnLS0tJzpcbiAgICAgICAgICAgIHJldHVybiAnZG9jLXN0YXJ0JztcbiAgICAgICAgY2FzZSAnLi4uJzpcbiAgICAgICAgICAgIHJldHVybiAnZG9jLWVuZCc7XG4gICAgICAgIGNhc2UgJyc6XG4gICAgICAgIGNhc2UgJ1xcbic6XG4gICAgICAgIGNhc2UgJ1xcclxcbic6XG4gICAgICAgICAgICByZXR1cm4gJ25ld2xpbmUnO1xuICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgIHJldHVybiAnc2VxLWl0ZW0taW5kJztcbiAgICAgICAgY2FzZSAnPyc6XG4gICAgICAgICAgICByZXR1cm4gJ2V4cGxpY2l0LWtleS1pbmQnO1xuICAgICAgICBjYXNlICc6JzpcbiAgICAgICAgICAgIHJldHVybiAnbWFwLXZhbHVlLWluZCc7XG4gICAgICAgIGNhc2UgJ3snOlxuICAgICAgICAgICAgcmV0dXJuICdmbG93LW1hcC1zdGFydCc7XG4gICAgICAgIGNhc2UgJ30nOlxuICAgICAgICAgICAgcmV0dXJuICdmbG93LW1hcC1lbmQnO1xuICAgICAgICBjYXNlICdbJzpcbiAgICAgICAgICAgIHJldHVybiAnZmxvdy1zZXEtc3RhcnQnO1xuICAgICAgICBjYXNlICddJzpcbiAgICAgICAgICAgIHJldHVybiAnZmxvdy1zZXEtZW5kJztcbiAgICAgICAgY2FzZSAnLCc6XG4gICAgICAgICAgICByZXR1cm4gJ2NvbW1hJztcbiAgICB9XG4gICAgc3dpdGNoIChzb3VyY2VbMF0pIHtcbiAgICAgICAgY2FzZSAnICc6XG4gICAgICAgIGNhc2UgJ1xcdCc6XG4gICAgICAgICAgICByZXR1cm4gJ3NwYWNlJztcbiAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICByZXR1cm4gJ2NvbW1lbnQnO1xuICAgICAgICBjYXNlICclJzpcbiAgICAgICAgICAgIHJldHVybiAnZGlyZWN0aXZlLWxpbmUnO1xuICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgIHJldHVybiAnYWxpYXMnO1xuICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgIHJldHVybiAnYW5jaG9yJztcbiAgICAgICAgY2FzZSAnISc6XG4gICAgICAgICAgICByZXR1cm4gJ3RhZyc7XG4gICAgICAgIGNhc2UgXCInXCI6XG4gICAgICAgICAgICByZXR1cm4gJ3NpbmdsZS1xdW90ZWQtc2NhbGFyJztcbiAgICAgICAgY2FzZSAnXCInOlxuICAgICAgICAgICAgcmV0dXJuICdkb3VibGUtcXVvdGVkLXNjYWxhcic7XG4gICAgICAgIGNhc2UgJ3wnOlxuICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgIHJldHVybiAnYmxvY2stc2NhbGFyLWhlYWRlcic7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgeyBCT00sIERPQ1VNRU5ULCBGTE9XX0VORCwgU0NBTEFSLCBpc0NvbGxlY3Rpb24sIGlzU2NhbGFyLCBwcmV0dHlUb2tlbiwgdG9rZW5UeXBlIH07XG4iLCAiaW1wb3J0IHsgQk9NLCBET0NVTUVOVCwgRkxPV19FTkQsIFNDQUxBUiB9IGZyb20gJy4vY3N0LmpzJztcblxuLypcblNUQVJUIC0+IHN0cmVhbVxuXG5zdHJlYW1cbiAgZGlyZWN0aXZlIC0+IGxpbmUtZW5kIC0+IHN0cmVhbVxuICBpbmRlbnQgKyBsaW5lLWVuZCAtPiBzdHJlYW1cbiAgW2Vsc2VdIC0+IGxpbmUtc3RhcnRcblxubGluZS1lbmRcbiAgY29tbWVudCAtPiBsaW5lLWVuZFxuICBuZXdsaW5lIC0+IC5cbiAgaW5wdXQtZW5kIC0+IEVORFxuXG5saW5lLXN0YXJ0XG4gIGRvYy1zdGFydCAtPiBkb2NcbiAgZG9jLWVuZCAtPiBzdHJlYW1cbiAgW2Vsc2VdIC0+IGluZGVudCAtPiBibG9jay1zdGFydFxuXG5ibG9jay1zdGFydFxuICBzZXEtaXRlbS1zdGFydCAtPiBibG9jay1zdGFydFxuICBleHBsaWNpdC1rZXktc3RhcnQgLT4gYmxvY2stc3RhcnRcbiAgbWFwLXZhbHVlLXN0YXJ0IC0+IGJsb2NrLXN0YXJ0XG4gIFtlbHNlXSAtPiBkb2NcblxuZG9jXG4gIGxpbmUtZW5kIC0+IGxpbmUtc3RhcnRcbiAgc3BhY2VzIC0+IGRvY1xuICBhbmNob3IgLT4gZG9jXG4gIHRhZyAtPiBkb2NcbiAgZmxvdy1zdGFydCAtPiBmbG93IC0+IGRvY1xuICBmbG93LWVuZCAtPiBlcnJvciAtPiBkb2NcbiAgc2VxLWl0ZW0tc3RhcnQgLT4gZXJyb3IgLT4gZG9jXG4gIGV4cGxpY2l0LWtleS1zdGFydCAtPiBlcnJvciAtPiBkb2NcbiAgbWFwLXZhbHVlLXN0YXJ0IC0+IGRvY1xuICBhbGlhcyAtPiBkb2NcbiAgcXVvdGUtc3RhcnQgLT4gcXVvdGVkLXNjYWxhciAtPiBkb2NcbiAgYmxvY2stc2NhbGFyLWhlYWRlciAtPiBsaW5lLWVuZCAtPiBibG9jay1zY2FsYXIobWluKSAtPiBsaW5lLXN0YXJ0XG4gIFtlbHNlXSAtPiBwbGFpbi1zY2FsYXIoZmFsc2UsIG1pbikgLT4gZG9jXG5cbmZsb3dcbiAgbGluZS1lbmQgLT4gZmxvd1xuICBzcGFjZXMgLT4gZmxvd1xuICBhbmNob3IgLT4gZmxvd1xuICB0YWcgLT4gZmxvd1xuICBmbG93LXN0YXJ0IC0+IGZsb3cgLT4gZmxvd1xuICBmbG93LWVuZCAtPiAuXG4gIHNlcS1pdGVtLXN0YXJ0IC0+IGVycm9yIC0+IGZsb3dcbiAgZXhwbGljaXQta2V5LXN0YXJ0IC0+IGZsb3dcbiAgbWFwLXZhbHVlLXN0YXJ0IC0+IGZsb3dcbiAgYWxpYXMgLT4gZmxvd1xuICBxdW90ZS1zdGFydCAtPiBxdW90ZWQtc2NhbGFyIC0+IGZsb3dcbiAgY29tbWEgLT4gZmxvd1xuICBbZWxzZV0gLT4gcGxhaW4tc2NhbGFyKHRydWUsIDApIC0+IGZsb3dcblxucXVvdGVkLXNjYWxhclxuICBxdW90ZS1lbmQgLT4gLlxuICBbZWxzZV0gLT4gcXVvdGVkLXNjYWxhclxuXG5ibG9jay1zY2FsYXIobWluKVxuICBuZXdsaW5lICsgcGVlayhpbmRlbnQgPCBtaW4pIC0+IC5cbiAgW2Vsc2VdIC0+IGJsb2NrLXNjYWxhcihtaW4pXG5cbnBsYWluLXNjYWxhcihpcy1mbG93LCBtaW4pXG4gIHNjYWxhci1lbmQoaXMtZmxvdykgLT4gLlxuICBwZWVrKG5ld2xpbmUgKyAoaW5kZW50IDwgbWluKSkgLT4gLlxuICBbZWxzZV0gLT4gcGxhaW4tc2NhbGFyKG1pbilcbiovXG5mdW5jdGlvbiBpc0VtcHR5KGNoKSB7XG4gICAgc3dpdGNoIChjaCkge1xuICAgICAgICBjYXNlIHVuZGVmaW5lZDpcbiAgICAgICAgY2FzZSAnICc6XG4gICAgICAgIGNhc2UgJ1xcbic6XG4gICAgICAgIGNhc2UgJ1xccic6XG4gICAgICAgIGNhc2UgJ1xcdCc6XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5jb25zdCBoZXhEaWdpdHMgPSBuZXcgU2V0KCcwMTIzNDU2Nzg5QUJDREVGYWJjZGVmJyk7XG5jb25zdCB0YWdDaGFycyA9IG5ldyBTZXQoXCIwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ei0jOy8/OkAmPSskXy4hfionKClcIik7XG5jb25zdCBmbG93SW5kaWNhdG9yQ2hhcnMgPSBuZXcgU2V0KCcsW117fScpO1xuY29uc3QgaW52YWxpZEFuY2hvckNoYXJzID0gbmV3IFNldCgnICxbXXt9XFxuXFxyXFx0Jyk7XG5jb25zdCBpc05vdEFuY2hvckNoYXIgPSAoY2gpID0+ICFjaCB8fCBpbnZhbGlkQW5jaG9yQ2hhcnMuaGFzKGNoKTtcbi8qKlxuICogU3BsaXRzIGFuIGlucHV0IHN0cmluZyBpbnRvIGxleGljYWwgdG9rZW5zLCBpLmUuIHNtYWxsZXIgc3RyaW5ncyB0aGF0IGFyZVxuICogZWFzaWx5IGlkZW50aWZpYWJsZSBieSBgdG9rZW5zLnRva2VuVHlwZSgpYC5cbiAqXG4gKiBMZXhpbmcgc3RhcnRzIGFsd2F5cyBpbiBhIFwic3RyZWFtXCIgY29udGV4dC4gSW5jb21wbGV0ZSBpbnB1dCBtYXkgYmUgYnVmZmVyZWRcbiAqIHVudGlsIGEgY29tcGxldGUgdG9rZW4gY2FuIGJlIGVtaXR0ZWQuXG4gKlxuICogSW4gYWRkaXRpb24gdG8gc2xpY2VzIG9mIHRoZSBvcmlnaW5hbCBpbnB1dCwgdGhlIGZvbGxvd2luZyBjb250cm9sIGNoYXJhY3RlcnNcbiAqIG1heSBhbHNvIGJlIGVtaXR0ZWQ6XG4gKlxuICogLSBgXFx4MDJgIChTdGFydCBvZiBUZXh0KTogQSBkb2N1bWVudCBzdGFydHMgd2l0aCB0aGUgbmV4dCB0b2tlblxuICogLSBgXFx4MThgIChDYW5jZWwpOiBVbmV4cGVjdGVkIGVuZCBvZiBmbG93LW1vZGUgKGluZGljYXRlcyBhbiBlcnJvcilcbiAqIC0gYFxceDFmYCAoVW5pdCBTZXBhcmF0b3IpOiBOZXh0IHRva2VuIGlzIGEgc2NhbGFyIHZhbHVlXG4gKiAtIGBcXHV7RkVGRn1gIChCeXRlIG9yZGVyIG1hcmspOiBFbWl0dGVkIHNlcGFyYXRlbHkgb3V0c2lkZSBkb2N1bWVudHNcbiAqL1xuY2xhc3MgTGV4ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvKipcbiAgICAgICAgICogRmxhZyBpbmRpY2F0aW5nIHdoZXRoZXIgdGhlIGVuZCBvZiB0aGUgY3VycmVudCBidWZmZXIgbWFya3MgdGhlIGVuZCBvZlxuICAgICAgICAgKiBhbGwgaW5wdXRcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYXRFbmQgPSBmYWxzZTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEV4cGxpY2l0IGluZGVudCBzZXQgaW4gYmxvY2sgc2NhbGFyIGhlYWRlciwgYXMgYW4gb2Zmc2V0IGZyb20gdGhlIGN1cnJlbnRcbiAgICAgICAgICogbWluaW11bSBpbmRlbnQsIHNvIGUuZy4gc2V0IHRvIDEgZnJvbSBhIGhlYWRlciBgfDIrYC4gU2V0IHRvIC0xIGlmIG5vdFxuICAgICAgICAgKiBleHBsaWNpdGx5IHNldC5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYmxvY2tTY2FsYXJJbmRlbnQgPSAtMTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJsb2NrIHNjYWxhcnMgdGhhdCBpbmNsdWRlIGEgKyAoa2VlcCkgY2hvbXBpbmcgaW5kaWNhdG9yIGluIHRoZWlyIGhlYWRlclxuICAgICAgICAgKiBpbmNsdWRlIHRyYWlsaW5nIGVtcHR5IGxpbmVzLCB3aGljaCBhcmUgb3RoZXJ3aXNlIGV4Y2x1ZGVkIGZyb20gdGhlXG4gICAgICAgICAqIHNjYWxhcidzIGNvbnRlbnRzLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5ibG9ja1NjYWxhcktlZXAgPSBmYWxzZTtcbiAgICAgICAgLyoqIEN1cnJlbnQgaW5wdXQgKi9cbiAgICAgICAgdGhpcy5idWZmZXIgPSAnJztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEZsYWcgbm90aW5nIHdoZXRoZXIgdGhlIG1hcCB2YWx1ZSBpbmRpY2F0b3IgOiBjYW4gaW1tZWRpYXRlbHkgZm9sbG93IHRoaXNcbiAgICAgICAgICogbm9kZSB3aXRoaW4gYSBmbG93IGNvbnRleHQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZsb3dLZXkgPSBmYWxzZTtcbiAgICAgICAgLyoqIENvdW50IG9mIHN1cnJvdW5kaW5nIGZsb3cgY29sbGVjdGlvbiBsZXZlbHMuICovXG4gICAgICAgIHRoaXMuZmxvd0xldmVsID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1pbmltdW0gbGV2ZWwgb2YgaW5kZW50YXRpb24gcmVxdWlyZWQgZm9yIG5leHQgbGluZXMgdG8gYmUgcGFyc2VkIGFzIGFcbiAgICAgICAgICogcGFydCBvZiB0aGUgY3VycmVudCBzY2FsYXIgdmFsdWUuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmluZGVudE5leHQgPSAwO1xuICAgICAgICAvKiogSW5kZW50YXRpb24gbGV2ZWwgb2YgdGhlIGN1cnJlbnQgbGluZS4gKi9cbiAgICAgICAgdGhpcy5pbmRlbnRWYWx1ZSA9IDA7XG4gICAgICAgIC8qKiBQb3NpdGlvbiBvZiB0aGUgbmV4dCBcXG4gY2hhcmFjdGVyLiAqL1xuICAgICAgICB0aGlzLmxpbmVFbmRQb3MgPSBudWxsO1xuICAgICAgICAvKiogU3RvcmVzIHRoZSBzdGF0ZSBvZiB0aGUgbGV4ZXIgaWYgcmVhY2hpbmcgdGhlIGVuZCBvZiBpbmNwb21wbGV0ZSBpbnB1dCAqL1xuICAgICAgICB0aGlzLm5leHQgPSBudWxsO1xuICAgICAgICAvKiogQSBwb2ludGVyIHRvIGBidWZmZXJgOyB0aGUgY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgbGV4ZXIuICovXG4gICAgICAgIHRoaXMucG9zID0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2VuZXJhdGUgWUFNTCB0b2tlbnMgZnJvbSB0aGUgYHNvdXJjZWAgc3RyaW5nLiBJZiBgaW5jb21wbGV0ZWAsXG4gICAgICogYSBwYXJ0IG9mIHRoZSBsYXN0IGxpbmUgbWF5IGJlIGxlZnQgYXMgYSBidWZmZXIgZm9yIHRoZSBuZXh0IGNhbGwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBBIGdlbmVyYXRvciBvZiBsZXhpY2FsIHRva2Vuc1xuICAgICAqL1xuICAgICpsZXgoc291cmNlLCBpbmNvbXBsZXRlID0gZmFsc2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2UgIT09ICdzdHJpbmcnKVxuICAgICAgICAgICAgICAgIHRocm93IFR5cGVFcnJvcignc291cmNlIGlzIG5vdCBhIHN0cmluZycpO1xuICAgICAgICAgICAgdGhpcy5idWZmZXIgPSB0aGlzLmJ1ZmZlciA/IHRoaXMuYnVmZmVyICsgc291cmNlIDogc291cmNlO1xuICAgICAgICAgICAgdGhpcy5saW5lRW5kUG9zID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmF0RW5kID0gIWluY29tcGxldGU7XG4gICAgICAgIGxldCBuZXh0ID0gdGhpcy5uZXh0ID8/ICdzdHJlYW0nO1xuICAgICAgICB3aGlsZSAobmV4dCAmJiAoaW5jb21wbGV0ZSB8fCB0aGlzLmhhc0NoYXJzKDEpKSlcbiAgICAgICAgICAgIG5leHQgPSB5aWVsZCogdGhpcy5wYXJzZU5leHQobmV4dCk7XG4gICAgfVxuICAgIGF0TGluZUVuZCgpIHtcbiAgICAgICAgbGV0IGkgPSB0aGlzLnBvcztcbiAgICAgICAgbGV0IGNoID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgIHdoaWxlIChjaCA9PT0gJyAnIHx8IGNoID09PSAnXFx0JylcbiAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbKytpXTtcbiAgICAgICAgaWYgKCFjaCB8fCBjaCA9PT0gJyMnIHx8IGNoID09PSAnXFxuJylcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAoY2ggPT09ICdcXHInKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyW2kgKyAxXSA9PT0gJ1xcbic7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2hhckF0KG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYnVmZmVyW3RoaXMucG9zICsgbl07XG4gICAgfVxuICAgIGNvbnRpbnVlU2NhbGFyKG9mZnNldCkge1xuICAgICAgICBsZXQgY2ggPSB0aGlzLmJ1ZmZlcltvZmZzZXRdO1xuICAgICAgICBpZiAodGhpcy5pbmRlbnROZXh0ID4gMCkge1xuICAgICAgICAgICAgbGV0IGluZGVudCA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoY2ggPT09ICcgJylcbiAgICAgICAgICAgICAgICBjaCA9IHRoaXMuYnVmZmVyWysraW5kZW50ICsgb2Zmc2V0XTtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xccicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gdGhpcy5idWZmZXJbaW5kZW50ICsgb2Zmc2V0ICsgMV07XG4gICAgICAgICAgICAgICAgaWYgKG5leHQgPT09ICdcXG4nIHx8ICghbmV4dCAmJiAhdGhpcy5hdEVuZCkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvZmZzZXQgKyBpbmRlbnQgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNoID09PSAnXFxuJyB8fCBpbmRlbnQgPj0gdGhpcy5pbmRlbnROZXh0IHx8ICghY2ggJiYgIXRoaXMuYXRFbmQpXG4gICAgICAgICAgICAgICAgPyBvZmZzZXQgKyBpbmRlbnRcbiAgICAgICAgICAgICAgICA6IC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjaCA9PT0gJy0nIHx8IGNoID09PSAnLicpIHtcbiAgICAgICAgICAgIGNvbnN0IGR0ID0gdGhpcy5idWZmZXIuc3Vic3RyKG9mZnNldCwgMyk7XG4gICAgICAgICAgICBpZiAoKGR0ID09PSAnLS0tJyB8fCBkdCA9PT0gJy4uLicpICYmIGlzRW1wdHkodGhpcy5idWZmZXJbb2Zmc2V0ICsgM10pKVxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2Zmc2V0O1xuICAgIH1cbiAgICBnZXRMaW5lKCkge1xuICAgICAgICBsZXQgZW5kID0gdGhpcy5saW5lRW5kUG9zO1xuICAgICAgICBpZiAodHlwZW9mIGVuZCAhPT0gJ251bWJlcicgfHwgKGVuZCAhPT0gLTEgJiYgZW5kIDwgdGhpcy5wb3MpKSB7XG4gICAgICAgICAgICBlbmQgPSB0aGlzLmJ1ZmZlci5pbmRleE9mKCdcXG4nLCB0aGlzLnBvcyk7XG4gICAgICAgICAgICB0aGlzLmxpbmVFbmRQb3MgPSBlbmQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVuZCA9PT0gLTEpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hdEVuZCA/IHRoaXMuYnVmZmVyLnN1YnN0cmluZyh0aGlzLnBvcykgOiBudWxsO1xuICAgICAgICBpZiAodGhpcy5idWZmZXJbZW5kIC0gMV0gPT09ICdcXHInKVxuICAgICAgICAgICAgZW5kIC09IDE7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlci5zdWJzdHJpbmcodGhpcy5wb3MsIGVuZCk7XG4gICAgfVxuICAgIGhhc0NoYXJzKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zICsgbiA8PSB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gICAgfVxuICAgIHNldE5leHQoc3RhdGUpIHtcbiAgICAgICAgdGhpcy5idWZmZXIgPSB0aGlzLmJ1ZmZlci5zdWJzdHJpbmcodGhpcy5wb3MpO1xuICAgICAgICB0aGlzLnBvcyA9IDA7XG4gICAgICAgIHRoaXMubGluZUVuZFBvcyA9IG51bGw7XG4gICAgICAgIHRoaXMubmV4dCA9IHN0YXRlO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcGVlayhuKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1ZmZlci5zdWJzdHIodGhpcy5wb3MsIG4pO1xuICAgIH1cbiAgICAqcGFyc2VOZXh0KG5leHQpIHtcbiAgICAgICAgc3dpdGNoIChuZXh0KSB7XG4gICAgICAgICAgICBjYXNlICdzdHJlYW0nOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZVN0cmVhbSgpO1xuICAgICAgICAgICAgY2FzZSAnbGluZS1zdGFydCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlTGluZVN0YXJ0KCk7XG4gICAgICAgICAgICBjYXNlICdibG9jay1zdGFydCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlQmxvY2tTdGFydCgpO1xuICAgICAgICAgICAgY2FzZSAnZG9jJzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VEb2N1bWVudCgpO1xuICAgICAgICAgICAgY2FzZSAnZmxvdyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlRmxvd0NvbGxlY3Rpb24oKTtcbiAgICAgICAgICAgIGNhc2UgJ3F1b3RlZC1zY2FsYXInOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZVF1b3RlZFNjYWxhcigpO1xuICAgICAgICAgICAgY2FzZSAnYmxvY2stc2NhbGFyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VCbG9ja1NjYWxhcigpO1xuICAgICAgICAgICAgY2FzZSAncGxhaW4tc2NhbGFyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VQbGFpblNjYWxhcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgICpwYXJzZVN0cmVhbSgpIHtcbiAgICAgICAgbGV0IGxpbmUgPSB0aGlzLmdldExpbmUoKTtcbiAgICAgICAgaWYgKGxpbmUgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXROZXh0KCdzdHJlYW0nKTtcbiAgICAgICAgaWYgKGxpbmVbMF0gPT09IEJPTSkge1xuICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaENvdW50KDEpO1xuICAgICAgICAgICAgbGluZSA9IGxpbmUuc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsaW5lWzBdID09PSAnJScpIHtcbiAgICAgICAgICAgIGxldCBkaXJFbmQgPSBsaW5lLmxlbmd0aDtcbiAgICAgICAgICAgIGxldCBjcyA9IGxpbmUuaW5kZXhPZignIycpO1xuICAgICAgICAgICAgd2hpbGUgKGNzICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoID0gbGluZVtjcyAtIDFdO1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJyAnIHx8IGNoID09PSAnXFx0Jykge1xuICAgICAgICAgICAgICAgICAgICBkaXJFbmQgPSBjcyAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY3MgPSBsaW5lLmluZGV4T2YoJyMnLCBjcyArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2ggPSBsaW5lW2RpckVuZCAtIDFdO1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJyAnIHx8IGNoID09PSAnXFx0JylcbiAgICAgICAgICAgICAgICAgICAgZGlyRW5kIC09IDE7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IG4gPSAoeWllbGQqIHRoaXMucHVzaENvdW50KGRpckVuZCkpICsgKHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSkpO1xuICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaENvdW50KGxpbmUubGVuZ3RoIC0gbik7IC8vIHBvc3NpYmxlIGNvbW1lbnRcbiAgICAgICAgICAgIHRoaXMucHVzaE5ld2xpbmUoKTtcbiAgICAgICAgICAgIHJldHVybiAnc3RyZWFtJztcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hdExpbmVFbmQoKSkge1xuICAgICAgICAgICAgY29uc3Qgc3AgPSB5aWVsZCogdGhpcy5wdXNoU3BhY2VzKHRydWUpO1xuICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaENvdW50KGxpbmUubGVuZ3RoIC0gc3ApO1xuICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaE5ld2xpbmUoKTtcbiAgICAgICAgICAgIHJldHVybiAnc3RyZWFtJztcbiAgICAgICAgfVxuICAgICAgICB5aWVsZCBET0NVTUVOVDtcbiAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlTGluZVN0YXJ0KCk7XG4gICAgfVxuICAgICpwYXJzZUxpbmVTdGFydCgpIHtcbiAgICAgICAgY29uc3QgY2ggPSB0aGlzLmNoYXJBdCgwKTtcbiAgICAgICAgaWYgKCFjaCAmJiAhdGhpcy5hdEVuZClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldE5leHQoJ2xpbmUtc3RhcnQnKTtcbiAgICAgICAgaWYgKGNoID09PSAnLScgfHwgY2ggPT09ICcuJykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmF0RW5kICYmICF0aGlzLmhhc0NoYXJzKDQpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNldE5leHQoJ2xpbmUtc3RhcnQnKTtcbiAgICAgICAgICAgIGNvbnN0IHMgPSB0aGlzLnBlZWsoMyk7XG4gICAgICAgICAgICBpZiAoKHMgPT09ICctLS0nIHx8IHMgPT09ICcuLi4nKSAmJiBpc0VtcHR5KHRoaXMuY2hhckF0KDMpKSkge1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudCgzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudFZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudE5leHQgPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybiBzID09PSAnLS0tJyA/ICdkb2MnIDogJ3N0cmVhbSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbmRlbnRWYWx1ZSA9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXMoZmFsc2UpO1xuICAgICAgICBpZiAodGhpcy5pbmRlbnROZXh0ID4gdGhpcy5pbmRlbnRWYWx1ZSAmJiAhaXNFbXB0eSh0aGlzLmNoYXJBdCgxKSkpXG4gICAgICAgICAgICB0aGlzLmluZGVudE5leHQgPSB0aGlzLmluZGVudFZhbHVlO1xuICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VCbG9ja1N0YXJ0KCk7XG4gICAgfVxuICAgICpwYXJzZUJsb2NrU3RhcnQoKSB7XG4gICAgICAgIGNvbnN0IFtjaDAsIGNoMV0gPSB0aGlzLnBlZWsoMik7XG4gICAgICAgIGlmICghY2gxICYmICF0aGlzLmF0RW5kKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgnYmxvY2stc3RhcnQnKTtcbiAgICAgICAgaWYgKChjaDAgPT09ICctJyB8fCBjaDAgPT09ICc/JyB8fCBjaDAgPT09ICc6JykgJiYgaXNFbXB0eShjaDEpKSB7XG4gICAgICAgICAgICBjb25zdCBuID0gKHlpZWxkKiB0aGlzLnB1c2hDb3VudCgxKSkgKyAoeWllbGQqIHRoaXMucHVzaFNwYWNlcyh0cnVlKSk7XG4gICAgICAgICAgICB0aGlzLmluZGVudE5leHQgPSB0aGlzLmluZGVudFZhbHVlICsgMTtcbiAgICAgICAgICAgIHRoaXMuaW5kZW50VmFsdWUgKz0gbjtcbiAgICAgICAgICAgIHJldHVybiAnYmxvY2stc3RhcnQnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnZG9jJztcbiAgICB9XG4gICAgKnBhcnNlRG9jdW1lbnQoKSB7XG4gICAgICAgIHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSk7XG4gICAgICAgIGNvbnN0IGxpbmUgPSB0aGlzLmdldExpbmUoKTtcbiAgICAgICAgaWYgKGxpbmUgPT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXROZXh0KCdkb2MnKTtcbiAgICAgICAgbGV0IG4gPSB5aWVsZCogdGhpcy5wdXNoSW5kaWNhdG9ycygpO1xuICAgICAgICBzd2l0Y2ggKGxpbmVbbl0pIHtcbiAgICAgICAgICAgIGNhc2UgJyMnOlxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudChsaW5lLmxlbmd0aCAtIG4pO1xuICAgICAgICAgICAgLy8gZmFsbHRocm91Z2hcbiAgICAgICAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hOZXdsaW5lKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnBhcnNlTGluZVN0YXJ0KCk7XG4gICAgICAgICAgICBjYXNlICd7JzpcbiAgICAgICAgICAgIGNhc2UgJ1snOlxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudCgxKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dLZXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dMZXZlbCA9IDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdmbG93JztcbiAgICAgICAgICAgIGNhc2UgJ30nOlxuICAgICAgICAgICAgY2FzZSAnXSc6XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBhbiBlcnJvclxuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudCgxKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2RvYyc7XG4gICAgICAgICAgICBjYXNlICcqJzpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoVW50aWwoaXNOb3RBbmNob3JDaGFyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2RvYyc7XG4gICAgICAgICAgICBjYXNlICdcIic6XG4gICAgICAgICAgICBjYXNlIFwiJ1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZVF1b3RlZFNjYWxhcigpO1xuICAgICAgICAgICAgY2FzZSAnfCc6XG4gICAgICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgICAgICBuICs9IHlpZWxkKiB0aGlzLnBhcnNlQmxvY2tTY2FsYXJIZWFkZXIoKTtcbiAgICAgICAgICAgICAgICBuICs9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSk7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaENvdW50KGxpbmUubGVuZ3RoIC0gbik7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaE5ld2xpbmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VCbG9ja1NjYWxhcigpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VQbGFpblNjYWxhcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgICpwYXJzZUZsb3dDb2xsZWN0aW9uKCkge1xuICAgICAgICBsZXQgbmwsIHNwO1xuICAgICAgICBsZXQgaW5kZW50ID0gLTE7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIG5sID0geWllbGQqIHRoaXMucHVzaE5ld2xpbmUoKTtcbiAgICAgICAgICAgIGlmIChubCA+IDApIHtcbiAgICAgICAgICAgICAgICBzcCA9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXMoZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50VmFsdWUgPSBpbmRlbnQgPSBzcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNwID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNwICs9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSk7XG4gICAgICAgIH0gd2hpbGUgKG5sICsgc3AgPiAwKTtcbiAgICAgICAgY29uc3QgbGluZSA9IHRoaXMuZ2V0TGluZSgpO1xuICAgICAgICBpZiAobGluZSA9PT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldE5leHQoJ2Zsb3cnKTtcbiAgICAgICAgaWYgKChpbmRlbnQgIT09IC0xICYmIGluZGVudCA8IHRoaXMuaW5kZW50TmV4dCAmJiBsaW5lWzBdICE9PSAnIycpIHx8XG4gICAgICAgICAgICAoaW5kZW50ID09PSAwICYmXG4gICAgICAgICAgICAgICAgKGxpbmUuc3RhcnRzV2l0aCgnLS0tJykgfHwgbGluZS5zdGFydHNXaXRoKCcuLi4nKSkgJiZcbiAgICAgICAgICAgICAgICBpc0VtcHR5KGxpbmVbM10pKSkge1xuICAgICAgICAgICAgLy8gQWxsb3dpbmcgZm9yIHRoZSB0ZXJtaW5hbCBdIG9yIH0gYXQgdGhlIHNhbWUgKHJhdGhlciB0aGFuIGdyZWF0ZXIpXG4gICAgICAgICAgICAvLyBpbmRlbnQgbGV2ZWwgYXMgdGhlIGluaXRpYWwgWyBvciB7IGlzIHRlY2huaWNhbGx5IGludmFsaWQsIGJ1dFxuICAgICAgICAgICAgLy8gZmFpbGluZyBoZXJlIHdvdWxkIGJlIHN1cnByaXNpbmcgdG8gdXNlcnMuXG4gICAgICAgICAgICBjb25zdCBhdEZsb3dFbmRNYXJrZXIgPSBpbmRlbnQgPT09IHRoaXMuaW5kZW50TmV4dCAtIDEgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dMZXZlbCA9PT0gMSAmJlxuICAgICAgICAgICAgICAgIChsaW5lWzBdID09PSAnXScgfHwgbGluZVswXSA9PT0gJ30nKTtcbiAgICAgICAgICAgIGlmICghYXRGbG93RW5kTWFya2VyKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBhbiBlcnJvclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvd0xldmVsID0gMDtcbiAgICAgICAgICAgICAgICB5aWVsZCBGTE9XX0VORDtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VMaW5lU3RhcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgIHdoaWxlIChsaW5lW25dID09PSAnLCcpIHtcbiAgICAgICAgICAgIG4gKz0geWllbGQqIHRoaXMucHVzaENvdW50KDEpO1xuICAgICAgICAgICAgbiArPSB5aWVsZCogdGhpcy5wdXNoU3BhY2VzKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5mbG93S2V5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgbiArPSB5aWVsZCogdGhpcy5wdXNoSW5kaWNhdG9ycygpO1xuICAgICAgICBzd2l0Y2ggKGxpbmVbbl0pIHtcbiAgICAgICAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICAgICAgICAgIHJldHVybiAnZmxvdyc7XG4gICAgICAgICAgICBjYXNlICcjJzpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQobGluZS5sZW5ndGggLSBuKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2Zsb3cnO1xuICAgICAgICAgICAgY2FzZSAneyc6XG4gICAgICAgICAgICBjYXNlICdbJzpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQoMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5mbG93S2V5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5mbG93TGV2ZWwgKz0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2Zsb3cnO1xuICAgICAgICAgICAgY2FzZSAnfSc6XG4gICAgICAgICAgICBjYXNlICddJzpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wdXNoQ291bnQoMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5mbG93S2V5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dMZXZlbCAtPSAxO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZsb3dMZXZlbCA/ICdmbG93JyA6ICdkb2MnO1xuICAgICAgICAgICAgY2FzZSAnKic6XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaFVudGlsKGlzTm90QW5jaG9yQ2hhcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdmbG93JztcbiAgICAgICAgICAgIGNhc2UgJ1wiJzpcbiAgICAgICAgICAgIGNhc2UgXCInXCI6XG4gICAgICAgICAgICAgICAgdGhpcy5mbG93S2V5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VRdW90ZWRTY2FsYXIoKTtcbiAgICAgICAgICAgIGNhc2UgJzonOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHRoaXMuY2hhckF0KDEpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmZsb3dLZXkgfHwgaXNFbXB0eShuZXh0KSB8fCBuZXh0ID09PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mbG93S2V5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnB1c2hDb3VudCgxKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucHVzaFNwYWNlcyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICdmbG93JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBmYWxsdGhyb3VnaFxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLmZsb3dLZXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucGFyc2VQbGFpblNjYWxhcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgICpwYXJzZVF1b3RlZFNjYWxhcigpIHtcbiAgICAgICAgY29uc3QgcXVvdGUgPSB0aGlzLmNoYXJBdCgwKTtcbiAgICAgICAgbGV0IGVuZCA9IHRoaXMuYnVmZmVyLmluZGV4T2YocXVvdGUsIHRoaXMucG9zICsgMSk7XG4gICAgICAgIGlmIChxdW90ZSA9PT0gXCInXCIpIHtcbiAgICAgICAgICAgIHdoaWxlIChlbmQgIT09IC0xICYmIHRoaXMuYnVmZmVyW2VuZCArIDFdID09PSBcIidcIilcbiAgICAgICAgICAgICAgICBlbmQgPSB0aGlzLmJ1ZmZlci5pbmRleE9mKFwiJ1wiLCBlbmQgKyAyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRvdWJsZS1xdW90ZVxuICAgICAgICAgICAgd2hpbGUgKGVuZCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuYnVmZmVyW2VuZCAtIDEgLSBuXSA9PT0gJ1xcXFwnKVxuICAgICAgICAgICAgICAgICAgICBuICs9IDE7XG4gICAgICAgICAgICAgICAgaWYgKG4gJSAyID09PSAwKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBlbmQgPSB0aGlzLmJ1ZmZlci5pbmRleE9mKCdcIicsIGVuZCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE9ubHkgbG9va2luZyBmb3IgbmV3bGluZXMgd2l0aGluIHRoZSBxdW90ZXNcbiAgICAgICAgY29uc3QgcWIgPSB0aGlzLmJ1ZmZlci5zdWJzdHJpbmcoMCwgZW5kKTtcbiAgICAgICAgbGV0IG5sID0gcWIuaW5kZXhPZignXFxuJywgdGhpcy5wb3MpO1xuICAgICAgICBpZiAobmwgIT09IC0xKSB7XG4gICAgICAgICAgICB3aGlsZSAobmwgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3MgPSB0aGlzLmNvbnRpbnVlU2NhbGFyKG5sICsgMSk7XG4gICAgICAgICAgICAgICAgaWYgKGNzID09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgbmwgPSBxYi5pbmRleE9mKCdcXG4nLCBjcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobmwgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gdGhpcyBpcyBhbiBlcnJvciBjYXVzZWQgYnkgYW4gdW5leHBlY3RlZCB1bmluZGVudFxuICAgICAgICAgICAgICAgIGVuZCA9IG5sIC0gKHFiW25sIC0gMV0gPT09ICdcXHInID8gMiA6IDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYXRFbmQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgncXVvdGVkLXNjYWxhcicpO1xuICAgICAgICAgICAgZW5kID0gdGhpcy5idWZmZXIubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHlpZWxkKiB0aGlzLnB1c2hUb0luZGV4KGVuZCArIDEsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxvd0xldmVsID8gJ2Zsb3cnIDogJ2RvYyc7XG4gICAgfVxuICAgICpwYXJzZUJsb2NrU2NhbGFySGVhZGVyKCkge1xuICAgICAgICB0aGlzLmJsb2NrU2NhbGFySW5kZW50ID0gLTE7XG4gICAgICAgIHRoaXMuYmxvY2tTY2FsYXJLZWVwID0gZmFsc2U7XG4gICAgICAgIGxldCBpID0gdGhpcy5wb3M7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBjb25zdCBjaCA9IHRoaXMuYnVmZmVyWysraV07XG4gICAgICAgICAgICBpZiAoY2ggPT09ICcrJylcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrU2NhbGFyS2VlcCA9IHRydWU7XG4gICAgICAgICAgICBlbHNlIGlmIChjaCA+ICcwJyAmJiBjaCA8PSAnOScpXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9ja1NjYWxhckluZGVudCA9IE51bWJlcihjaCkgLSAxO1xuICAgICAgICAgICAgZWxzZSBpZiAoY2ggIT09ICctJylcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucHVzaFVudGlsKGNoID0+IGlzRW1wdHkoY2gpIHx8IGNoID09PSAnIycpO1xuICAgIH1cbiAgICAqcGFyc2VCbG9ja1NjYWxhcigpIHtcbiAgICAgICAgbGV0IG5sID0gdGhpcy5wb3MgLSAxOyAvLyBtYXkgYmUgLTEgaWYgdGhpcy5wb3MgPT09IDBcbiAgICAgICAgbGV0IGluZGVudCA9IDA7XG4gICAgICAgIGxldCBjaDtcbiAgICAgICAgbG9vcDogZm9yIChsZXQgaSA9IHRoaXMucG9zOyAoY2ggPSB0aGlzLmJ1ZmZlcltpXSk7ICsraSkge1xuICAgICAgICAgICAgc3dpdGNoIChjaCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJyAnOlxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnXFxuJzpcbiAgICAgICAgICAgICAgICAgICAgbmwgPSBpO1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdcXHInOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSB0aGlzLmJ1ZmZlcltpICsgMV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghbmV4dCAmJiAhdGhpcy5hdEVuZClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNldE5leHQoJ2Jsb2NrLXNjYWxhcicpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dCA9PT0gJ1xcbicpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IC8vIGZhbGx0aHJvdWdoXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNoICYmICF0aGlzLmF0RW5kKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgnYmxvY2stc2NhbGFyJyk7XG4gICAgICAgIGlmIChpbmRlbnQgPj0gdGhpcy5pbmRlbnROZXh0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ibG9ja1NjYWxhckluZGVudCA9PT0gLTEpXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnROZXh0ID0gaW5kZW50O1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnROZXh0ID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibG9ja1NjYWxhckluZGVudCArICh0aGlzLmluZGVudE5leHQgPT09IDAgPyAxIDogdGhpcy5pbmRlbnROZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjcyA9IHRoaXMuY29udGludWVTY2FsYXIobmwgKyAxKTtcbiAgICAgICAgICAgICAgICBpZiAoY3MgPT09IC0xKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBubCA9IHRoaXMuYnVmZmVyLmluZGV4T2YoJ1xcbicsIGNzKTtcbiAgICAgICAgICAgIH0gd2hpbGUgKG5sICE9PSAtMSk7XG4gICAgICAgICAgICBpZiAobmwgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmF0RW5kKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zZXROZXh0KCdibG9jay1zY2FsYXInKTtcbiAgICAgICAgICAgICAgICBubCA9IHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUcmFpbGluZyBpbnN1ZmZpY2llbnRseSBpbmRlbnRlZCB0YWJzIGFyZSBpbnZhbGlkLlxuICAgICAgICAvLyBUbyBjYXRjaCB0aGF0IGR1cmluZyBwYXJzaW5nLCB3ZSBpbmNsdWRlIHRoZW0gaW4gdGhlIGJsb2NrIHNjYWxhciB2YWx1ZS5cbiAgICAgICAgbGV0IGkgPSBubCArIDE7XG4gICAgICAgIGNoID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgIHdoaWxlIChjaCA9PT0gJyAnKVxuICAgICAgICAgICAgY2ggPSB0aGlzLmJ1ZmZlclsrK2ldO1xuICAgICAgICBpZiAoY2ggPT09ICdcXHQnKSB7XG4gICAgICAgICAgICB3aGlsZSAoY2ggPT09ICdcXHQnIHx8IGNoID09PSAnICcgfHwgY2ggPT09ICdcXHInIHx8IGNoID09PSAnXFxuJylcbiAgICAgICAgICAgICAgICBjaCA9IHRoaXMuYnVmZmVyWysraV07XG4gICAgICAgICAgICBubCA9IGkgLSAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF0aGlzLmJsb2NrU2NhbGFyS2VlcCkge1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGxldCBpID0gbmwgLSAxO1xuICAgICAgICAgICAgICAgIGxldCBjaCA9IHRoaXMuYnVmZmVyW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gJ1xccicpXG4gICAgICAgICAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbLS1pXTtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0Q2hhciA9IGk7IC8vIERyb3AgdGhlIGxpbmUgaWYgbGFzdCBjaGFyIG5vdCBtb3JlIGluZGVudGVkXG4gICAgICAgICAgICAgICAgd2hpbGUgKGNoID09PSAnICcpXG4gICAgICAgICAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbLS1pXTtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdcXG4nICYmIGkgPj0gdGhpcy5wb3MgJiYgaSArIDEgKyBpbmRlbnQgPiBsYXN0Q2hhcilcbiAgICAgICAgICAgICAgICAgICAgbmwgPSBpO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB5aWVsZCBTQ0FMQVI7XG4gICAgICAgIHlpZWxkKiB0aGlzLnB1c2hUb0luZGV4KG5sICsgMSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wYXJzZUxpbmVTdGFydCgpO1xuICAgIH1cbiAgICAqcGFyc2VQbGFpblNjYWxhcigpIHtcbiAgICAgICAgY29uc3QgaW5GbG93ID0gdGhpcy5mbG93TGV2ZWwgPiAwO1xuICAgICAgICBsZXQgZW5kID0gdGhpcy5wb3MgLSAxO1xuICAgICAgICBsZXQgaSA9IHRoaXMucG9zIC0gMTtcbiAgICAgICAgbGV0IGNoO1xuICAgICAgICB3aGlsZSAoKGNoID0gdGhpcy5idWZmZXJbKytpXSkpIHtcbiAgICAgICAgICAgIGlmIChjaCA9PT0gJzonKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHRoaXMuYnVmZmVyW2kgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eShuZXh0KSB8fCAoaW5GbG93ICYmIGZsb3dJbmRpY2F0b3JDaGFycy5oYXMobmV4dCkpKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBlbmQgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNFbXB0eShjaCkpIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dCA9IHRoaXMuYnVmZmVyW2kgKyAxXTtcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdcXHInKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0ID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSAnXFxuJztcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQgPSB0aGlzLmJ1ZmZlcltpICsgMV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5leHQgPT09ICcjJyB8fCAoaW5GbG93ICYmIGZsb3dJbmRpY2F0b3JDaGFycy5oYXMobmV4dCkpKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBpZiAoY2ggPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNzID0gdGhpcy5jb250aW51ZVNjYWxhcihpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjcyA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgaSA9IE1hdGgubWF4KGksIGNzIC0gMik7IC8vIHRvIGFkdmFuY2UsIGJ1dCBzdGlsbCBhY2NvdW50IGZvciAnICMnXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGluRmxvdyAmJiBmbG93SW5kaWNhdG9yQ2hhcnMuaGFzKGNoKSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZW5kID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNoICYmICF0aGlzLmF0RW5kKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0TmV4dCgncGxhaW4tc2NhbGFyJyk7XG4gICAgICAgIHlpZWxkIFNDQUxBUjtcbiAgICAgICAgeWllbGQqIHRoaXMucHVzaFRvSW5kZXgoZW5kICsgMSwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiBpbkZsb3cgPyAnZmxvdycgOiAnZG9jJztcbiAgICB9XG4gICAgKnB1c2hDb3VudChuKSB7XG4gICAgICAgIGlmIChuID4gMCkge1xuICAgICAgICAgICAgeWllbGQgdGhpcy5idWZmZXIuc3Vic3RyKHRoaXMucG9zLCBuKTtcbiAgICAgICAgICAgIHRoaXMucG9zICs9IG47XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgKnB1c2hUb0luZGV4KGksIGFsbG93RW1wdHkpIHtcbiAgICAgICAgY29uc3QgcyA9IHRoaXMuYnVmZmVyLnNsaWNlKHRoaXMucG9zLCBpKTtcbiAgICAgICAgaWYgKHMpIHtcbiAgICAgICAgICAgIHlpZWxkIHM7XG4gICAgICAgICAgICB0aGlzLnBvcyArPSBzLmxlbmd0aDtcbiAgICAgICAgICAgIHJldHVybiBzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhbGxvd0VtcHR5KVxuICAgICAgICAgICAgeWllbGQgJyc7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICAqcHVzaEluZGljYXRvcnMoKSB7XG4gICAgICAgIGxldCBuID0gMDtcbiAgICAgICAgbG9vcDogd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5jaGFyQXQoMCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICchJzpcbiAgICAgICAgICAgICAgICAgICAgbiArPSB5aWVsZCogdGhpcy5wdXNoVGFnKCk7XG4gICAgICAgICAgICAgICAgICAgIG4gKz0geWllbGQqIHRoaXMucHVzaFNwYWNlcyh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWUgbG9vcDtcbiAgICAgICAgICAgICAgICBjYXNlICcmJzpcbiAgICAgICAgICAgICAgICAgICAgbiArPSB5aWVsZCogdGhpcy5wdXNoVW50aWwoaXNOb3RBbmNob3JDaGFyKTtcbiAgICAgICAgICAgICAgICAgICAgbiArPSB5aWVsZCogdGhpcy5wdXNoU3BhY2VzKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBsb29wO1xuICAgICAgICAgICAgICAgIGNhc2UgJy0nOiAvLyB0aGlzIGlzIGFuIGVycm9yXG4gICAgICAgICAgICAgICAgY2FzZSAnPyc6IC8vIHRoaXMgaXMgYW4gZXJyb3Igb3V0c2lkZSBmbG93IGNvbGxlY3Rpb25zXG4gICAgICAgICAgICAgICAgY2FzZSAnOic6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5GbG93ID0gdGhpcy5mbG93TGV2ZWwgPiAwO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaDEgPSB0aGlzLmNoYXJBdCgxKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzRW1wdHkoY2gxKSB8fCAoaW5GbG93ICYmIGZsb3dJbmRpY2F0b3JDaGFycy5oYXMoY2gxKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW5GbG93KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50TmV4dCA9IHRoaXMuaW5kZW50VmFsdWUgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5mbG93S2V5KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZmxvd0tleSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbiArPSB5aWVsZCogdGhpcy5wdXNoQ291bnQoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuICs9IHlpZWxkKiB0aGlzLnB1c2hTcGFjZXModHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBsb29wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWsgbG9vcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbjtcbiAgICB9XG4gICAgKnB1c2hUYWcoKSB7XG4gICAgICAgIGlmICh0aGlzLmNoYXJBdCgxKSA9PT0gJzwnKSB7XG4gICAgICAgICAgICBsZXQgaSA9IHRoaXMucG9zICsgMjtcbiAgICAgICAgICAgIGxldCBjaCA9IHRoaXMuYnVmZmVyW2ldO1xuICAgICAgICAgICAgd2hpbGUgKCFpc0VtcHR5KGNoKSAmJiBjaCAhPT0gJz4nKVxuICAgICAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbKytpXTtcbiAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wdXNoVG9JbmRleChjaCA9PT0gJz4nID8gaSArIDEgOiBpLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgaSA9IHRoaXMucG9zICsgMTtcbiAgICAgICAgICAgIGxldCBjaCA9IHRoaXMuYnVmZmVyW2ldO1xuICAgICAgICAgICAgd2hpbGUgKGNoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRhZ0NoYXJzLmhhcyhjaCkpXG4gICAgICAgICAgICAgICAgICAgIGNoID0gdGhpcy5idWZmZXJbKytpXTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChjaCA9PT0gJyUnICYmXG4gICAgICAgICAgICAgICAgICAgIGhleERpZ2l0cy5oYXModGhpcy5idWZmZXJbaSArIDFdKSAmJlxuICAgICAgICAgICAgICAgICAgICBoZXhEaWdpdHMuaGFzKHRoaXMuYnVmZmVyW2kgKyAyXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2ggPSB0aGlzLmJ1ZmZlclsoaSArPSAzKV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucHVzaFRvSW5kZXgoaSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgICpwdXNoTmV3bGluZSgpIHtcbiAgICAgICAgY29uc3QgY2ggPSB0aGlzLmJ1ZmZlclt0aGlzLnBvc107XG4gICAgICAgIGlmIChjaCA9PT0gJ1xcbicpXG4gICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMucHVzaENvdW50KDEpO1xuICAgICAgICBlbHNlIGlmIChjaCA9PT0gJ1xccicgJiYgdGhpcy5jaGFyQXQoMSkgPT09ICdcXG4nKVxuICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnB1c2hDb3VudCgyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgICpwdXNoU3BhY2VzKGFsbG93VGFicykge1xuICAgICAgICBsZXQgaSA9IHRoaXMucG9zIC0gMTtcbiAgICAgICAgbGV0IGNoO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjaCA9IHRoaXMuYnVmZmVyWysraV07XG4gICAgICAgIH0gd2hpbGUgKGNoID09PSAnICcgfHwgKGFsbG93VGFicyAmJiBjaCA9PT0gJ1xcdCcpKTtcbiAgICAgICAgY29uc3QgbiA9IGkgLSB0aGlzLnBvcztcbiAgICAgICAgaWYgKG4gPiAwKSB7XG4gICAgICAgICAgICB5aWVsZCB0aGlzLmJ1ZmZlci5zdWJzdHIodGhpcy5wb3MsIG4pO1xuICAgICAgICAgICAgdGhpcy5wb3MgPSBpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuO1xuICAgIH1cbiAgICAqcHVzaFVudGlsKHRlc3QpIHtcbiAgICAgICAgbGV0IGkgPSB0aGlzLnBvcztcbiAgICAgICAgbGV0IGNoID0gdGhpcy5idWZmZXJbaV07XG4gICAgICAgIHdoaWxlICghdGVzdChjaCkpXG4gICAgICAgICAgICBjaCA9IHRoaXMuYnVmZmVyWysraV07XG4gICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5wdXNoVG9JbmRleChpLCBmYWxzZSk7XG4gICAgfVxufVxuXG5leHBvcnQgeyBMZXhlciB9O1xuIiwgIi8qKlxuICogVHJhY2tzIG5ld2xpbmVzIGR1cmluZyBwYXJzaW5nIGluIG9yZGVyIHRvIHByb3ZpZGUgYW4gZWZmaWNpZW50IEFQSSBmb3JcbiAqIGRldGVybWluaW5nIHRoZSBvbmUtaW5kZXhlZCBgeyBsaW5lLCBjb2wgfWAgcG9zaXRpb24gZm9yIGFueSBvZmZzZXRcbiAqIHdpdGhpbiB0aGUgaW5wdXQuXG4gKi9cbmNsYXNzIExpbmVDb3VudGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5saW5lU3RhcnRzID0gW107XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTaG91bGQgYmUgY2FsbGVkIGluIGFzY2VuZGluZyBvcmRlci4gT3RoZXJ3aXNlLCBjYWxsXG4gICAgICAgICAqIGBsaW5lQ291bnRlci5saW5lU3RhcnRzLnNvcnQoKWAgYmVmb3JlIGNhbGxpbmcgYGxpbmVQb3MoKWAuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmFkZE5ld0xpbmUgPSAob2Zmc2V0KSA9PiB0aGlzLmxpbmVTdGFydHMucHVzaChvZmZzZXQpO1xuICAgICAgICAvKipcbiAgICAgICAgICogUGVyZm9ybXMgYSBiaW5hcnkgc2VhcmNoIGFuZCByZXR1cm5zIHRoZSAxLWluZGV4ZWQgeyBsaW5lLCBjb2wgfVxuICAgICAgICAgKiBwb3NpdGlvbiBvZiBgb2Zmc2V0YC4gSWYgYGxpbmUgPT09IDBgLCBgYWRkTmV3TGluZWAgaGFzIG5ldmVyIGJlZW5cbiAgICAgICAgICogY2FsbGVkIG9yIGBvZmZzZXRgIGlzIGJlZm9yZSB0aGUgZmlyc3Qga25vd24gbmV3bGluZS5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMubGluZVBvcyA9IChvZmZzZXQpID0+IHtcbiAgICAgICAgICAgIGxldCBsb3cgPSAwO1xuICAgICAgICAgICAgbGV0IGhpZ2ggPSB0aGlzLmxpbmVTdGFydHMubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtaWQgPSAobG93ICsgaGlnaCkgPj4gMTsgLy8gTWF0aC5mbG9vcigobG93ICsgaGlnaCkgLyAyKVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbmVTdGFydHNbbWlkXSA8IG9mZnNldClcbiAgICAgICAgICAgICAgICAgICAgbG93ID0gbWlkICsgMTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGhpZ2ggPSBtaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5saW5lU3RhcnRzW2xvd10gPT09IG9mZnNldClcbiAgICAgICAgICAgICAgICByZXR1cm4geyBsaW5lOiBsb3cgKyAxLCBjb2w6IDEgfTtcbiAgICAgICAgICAgIGlmIChsb3cgPT09IDApXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbGluZTogMCwgY29sOiBvZmZzZXQgfTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5saW5lU3RhcnRzW2xvdyAtIDFdO1xuICAgICAgICAgICAgcmV0dXJuIHsgbGluZTogbG93LCBjb2w6IG9mZnNldCAtIHN0YXJ0ICsgMSB9O1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IHsgTGluZUNvdW50ZXIgfTtcbiIsICJpbXBvcnQgeyB0b2tlblR5cGUgfSBmcm9tICcuL2NzdC5qcyc7XG5pbXBvcnQgeyBMZXhlciB9IGZyb20gJy4vbGV4ZXIuanMnO1xuXG5mdW5jdGlvbiBpbmNsdWRlc1Rva2VuKGxpc3QsIHR5cGUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpXG4gICAgICAgIGlmIChsaXN0W2ldLnR5cGUgPT09IHR5cGUpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBmaW5kTm9uRW1wdHlJbmRleChsaXN0KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN3aXRjaCAobGlzdFtpXS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG59XG5mdW5jdGlvbiBpc0Zsb3dUb2tlbih0b2tlbikge1xuICAgIHN3aXRjaCAodG9rZW4/LnR5cGUpIHtcbiAgICAgICAgY2FzZSAnYWxpYXMnOlxuICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICBjYXNlICdzaW5nbGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgIGNhc2UgJ2RvdWJsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgY2FzZSAnZmxvdy1jb2xsZWN0aW9uJzpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldFByZXZQcm9wcyhwYXJlbnQpIHtcbiAgICBzd2l0Y2ggKHBhcmVudC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2RvY3VtZW50JzpcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuc3RhcnQ7XG4gICAgICAgIGNhc2UgJ2Jsb2NrLW1hcCc6IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ID0gcGFyZW50Lml0ZW1zW3BhcmVudC5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiBpdC5zZXAgPz8gaXQuc3RhcnQ7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnYmxvY2stc2VxJzpcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnQuaXRlbXNbcGFyZW50Lml0ZW1zLmxlbmd0aCAtIDFdLnN0YXJ0O1xuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCBzaG91bGQgbm90IGhhcHBlbiAqL1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbn1cbi8qKiBOb3RlOiBNYXkgbW9kaWZ5IGlucHV0IGFycmF5ICovXG5mdW5jdGlvbiBnZXRGaXJzdEtleVN0YXJ0UHJvcHMocHJldikge1xuICAgIGlmIChwcmV2Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIGxldCBpID0gcHJldi5sZW5ndGg7XG4gICAgbG9vcDogd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgIHN3aXRjaCAocHJldltpXS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdkb2Mtc3RhcnQnOlxuICAgICAgICAgICAgY2FzZSAnZXhwbGljaXQta2V5LWluZCc6XG4gICAgICAgICAgICBjYXNlICdtYXAtdmFsdWUtaW5kJzpcbiAgICAgICAgICAgIGNhc2UgJ3NlcS1pdGVtLWluZCc6XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICBicmVhayBsb29wO1xuICAgICAgICB9XG4gICAgfVxuICAgIHdoaWxlIChwcmV2WysraV0/LnR5cGUgPT09ICdzcGFjZScpIHtcbiAgICAgICAgLyogbG9vcCAqL1xuICAgIH1cbiAgICByZXR1cm4gcHJldi5zcGxpY2UoaSwgcHJldi5sZW5ndGgpO1xufVxuZnVuY3Rpb24gYXJyYXlQdXNoQXJyYXkodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAvLyBNYXkgZXhoYXVzdCBjYWxsIHN0YWNrIHdpdGggbGFyZ2UgYHNvdXJjZWAgYXJyYXlcbiAgICBpZiAoc291cmNlLmxlbmd0aCA8IDFlNSlcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGFyZ2V0LCBzb3VyY2UpO1xuICAgIGVsc2VcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyArK2kpXG4gICAgICAgICAgICB0YXJnZXQucHVzaChzb3VyY2VbaV0pO1xufVxuZnVuY3Rpb24gZml4Rmxvd1NlcUl0ZW1zKGZjKSB7XG4gICAgaWYgKGZjLnN0YXJ0LnR5cGUgPT09ICdmbG93LXNlcS1zdGFydCcpIHtcbiAgICAgICAgZm9yIChjb25zdCBpdCBvZiBmYy5pdGVtcykge1xuICAgICAgICAgICAgaWYgKGl0LnNlcCAmJlxuICAgICAgICAgICAgICAgICFpdC52YWx1ZSAmJlxuICAgICAgICAgICAgICAgICFpbmNsdWRlc1Rva2VuKGl0LnN0YXJ0LCAnZXhwbGljaXQta2V5LWluZCcpICYmXG4gICAgICAgICAgICAgICAgIWluY2x1ZGVzVG9rZW4oaXQuc2VwLCAnbWFwLXZhbHVlLWluZCcpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0LmtleSlcbiAgICAgICAgICAgICAgICAgICAgaXQudmFsdWUgPSBpdC5rZXk7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGl0LmtleTtcbiAgICAgICAgICAgICAgICBpZiAoaXNGbG93VG9rZW4oaXQudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdC52YWx1ZS5lbmQpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheVB1c2hBcnJheShpdC52YWx1ZS5lbmQsIGl0LnNlcCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnZhbHVlLmVuZCA9IGl0LnNlcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBhcnJheVB1c2hBcnJheShpdC5zdGFydCwgaXQuc2VwKTtcbiAgICAgICAgICAgICAgICBkZWxldGUgaXQuc2VwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBBIFlBTUwgY29uY3JldGUgc3ludGF4IHRyZWUgKENTVCkgcGFyc2VyXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IHNyYzogc3RyaW5nID0gLi4uXG4gKiBmb3IgKGNvbnN0IHRva2VuIG9mIG5ldyBQYXJzZXIoKS5wYXJzZShzcmMpKSB7XG4gKiAgIC8vIHRva2VuOiBUb2tlblxuICogfVxuICogYGBgXG4gKlxuICogVG8gdXNlIHRoZSBwYXJzZXIgd2l0aCBhIHVzZXItcHJvdmlkZWQgbGV4ZXI6XG4gKlxuICogYGBgdHNcbiAqIGZ1bmN0aW9uKiBwYXJzZShzb3VyY2U6IHN0cmluZywgbGV4ZXI6IExleGVyKSB7XG4gKiAgIGNvbnN0IHBhcnNlciA9IG5ldyBQYXJzZXIoKVxuICogICBmb3IgKGNvbnN0IGxleGVtZSBvZiBsZXhlci5sZXgoc291cmNlKSlcbiAqICAgICB5aWVsZCogcGFyc2VyLm5leHQobGV4ZW1lKVxuICogICB5aWVsZCogcGFyc2VyLmVuZCgpXG4gKiB9XG4gKlxuICogY29uc3Qgc3JjOiBzdHJpbmcgPSAuLi5cbiAqIGNvbnN0IGxleGVyID0gbmV3IExleGVyKClcbiAqIGZvciAoY29uc3QgdG9rZW4gb2YgcGFyc2Uoc3JjLCBsZXhlcikpIHtcbiAqICAgLy8gdG9rZW46IFRva2VuXG4gKiB9XG4gKiBgYGBcbiAqL1xuY2xhc3MgUGFyc2VyIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb25OZXdMaW5lIC0gSWYgZGVmaW5lZCwgY2FsbGVkIHNlcGFyYXRlbHkgd2l0aCB0aGUgc3RhcnQgcG9zaXRpb24gb2ZcbiAgICAgKiAgIGVhY2ggbmV3IGxpbmUgKGluIGBwYXJzZSgpYCwgaW5jbHVkaW5nIHRoZSBzdGFydCBvZiBpbnB1dCkuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob25OZXdMaW5lKSB7XG4gICAgICAgIC8qKiBJZiB0cnVlLCBzcGFjZSBhbmQgc2VxdWVuY2UgaW5kaWNhdG9ycyBjb3VudCBhcyBpbmRlbnRhdGlvbiAqL1xuICAgICAgICB0aGlzLmF0TmV3TGluZSA9IHRydWU7XG4gICAgICAgIC8qKiBJZiB0cnVlLCBuZXh0IHRva2VuIGlzIGEgc2NhbGFyIHZhbHVlICovXG4gICAgICAgIHRoaXMuYXRTY2FsYXIgPSBmYWxzZTtcbiAgICAgICAgLyoqIEN1cnJlbnQgaW5kZW50YXRpb24gbGV2ZWwgKi9cbiAgICAgICAgdGhpcy5pbmRlbnQgPSAwO1xuICAgICAgICAvKiogQ3VycmVudCBvZmZzZXQgc2luY2UgdGhlIHN0YXJ0IG9mIHBhcnNpbmcgKi9cbiAgICAgICAgdGhpcy5vZmZzZXQgPSAwO1xuICAgICAgICAvKiogT24gdGhlIHNhbWUgbGluZSB3aXRoIGEgYmxvY2sgbWFwIGtleSAqL1xuICAgICAgICB0aGlzLm9uS2V5TGluZSA9IGZhbHNlO1xuICAgICAgICAvKiogVG9wIGluZGljYXRlcyB0aGUgbm9kZSB0aGF0J3MgY3VycmVudGx5IGJlaW5nIGJ1aWx0ICovXG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICAgICAgLyoqIFRoZSBzb3VyY2Ugb2YgdGhlIGN1cnJlbnQgdG9rZW4sIHNldCBpbiBwYXJzZSgpICovXG4gICAgICAgIHRoaXMuc291cmNlID0gJyc7XG4gICAgICAgIC8qKiBUaGUgdHlwZSBvZiB0aGUgY3VycmVudCB0b2tlbiwgc2V0IGluIHBhcnNlKCkgKi9cbiAgICAgICAgdGhpcy50eXBlID0gJyc7XG4gICAgICAgIC8vIE11c3QgYmUgZGVmaW5lZCBhZnRlciBgbmV4dCgpYFxuICAgICAgICB0aGlzLmxleGVyID0gbmV3IExleGVyKCk7XG4gICAgICAgIHRoaXMub25OZXdMaW5lID0gb25OZXdMaW5lO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQYXJzZSBgc291cmNlYCBhcyBhIFlBTUwgc3RyZWFtLlxuICAgICAqIElmIGBpbmNvbXBsZXRlYCwgYSBwYXJ0IG9mIHRoZSBsYXN0IGxpbmUgbWF5IGJlIGxlZnQgYXMgYSBidWZmZXIgZm9yIHRoZSBuZXh0IGNhbGwuXG4gICAgICpcbiAgICAgKiBFcnJvcnMgYXJlIG5vdCB0aHJvd24sIGJ1dCB5aWVsZGVkIGFzIGB7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2UgfWAgdG9rZW5zLlxuICAgICAqXG4gICAgICogQHJldHVybnMgQSBnZW5lcmF0b3Igb2YgdG9rZW5zIHJlcHJlc2VudGluZyBlYWNoIGRpcmVjdGl2ZSwgZG9jdW1lbnQsIGFuZCBvdGhlciBzdHJ1Y3R1cmUuXG4gICAgICovXG4gICAgKnBhcnNlKHNvdXJjZSwgaW5jb21wbGV0ZSA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzLm9uTmV3TGluZSAmJiB0aGlzLm9mZnNldCA9PT0gMClcbiAgICAgICAgICAgIHRoaXMub25OZXdMaW5lKDApO1xuICAgICAgICBmb3IgKGNvbnN0IGxleGVtZSBvZiB0aGlzLmxleGVyLmxleChzb3VyY2UsIGluY29tcGxldGUpKVxuICAgICAgICAgICAgeWllbGQqIHRoaXMubmV4dChsZXhlbWUpO1xuICAgICAgICBpZiAoIWluY29tcGxldGUpXG4gICAgICAgICAgICB5aWVsZCogdGhpcy5lbmQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWR2YW5jZSB0aGUgcGFyc2VyIGJ5IHRoZSBgc291cmNlYCBvZiBvbmUgbGV4aWNhbCB0b2tlbi5cbiAgICAgKi9cbiAgICAqbmV4dChzb3VyY2UpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgIGlmICh0aGlzLmF0U2NhbGFyKSB7XG4gICAgICAgICAgICB0aGlzLmF0U2NhbGFyID0gZmFsc2U7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5zdGVwKCk7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCArPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHR5cGUgPSB0b2tlblR5cGUoc291cmNlKTtcbiAgICAgICAgaWYgKCF0eXBlKSB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYE5vdCBhIFlBTUwgdG9rZW46ICR7c291cmNlfWA7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoeyB0eXBlOiAnZXJyb3InLCBvZmZzZXQ6IHRoaXMub2Zmc2V0LCBtZXNzYWdlLCBzb3VyY2UgfSk7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCArPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGUgPT09ICdzY2FsYXInKSB7XG4gICAgICAgICAgICB0aGlzLmF0TmV3TGluZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5hdFNjYWxhciA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnR5cGUgPSAnc2NhbGFyJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgICAgICB5aWVsZCogdGhpcy5zdGVwKCk7XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdE5ld0xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uTmV3TGluZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25OZXdMaW5lKHRoaXMub2Zmc2V0ICsgc291cmNlLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYXROZXdMaW5lICYmIHNvdXJjZVswXSA9PT0gJyAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgKz0gc291cmNlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZXhwbGljaXQta2V5LWluZCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnbWFwLXZhbHVlLWluZCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnc2VxLWl0ZW0taW5kJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYXROZXdMaW5lKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgKz0gc291cmNlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnZG9jLW1vZGUnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zsb3ctZXJyb3ItZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXROZXdMaW5lID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9mZnNldCArPSBzb3VyY2UubGVuZ3RoO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKiBDYWxsIGF0IGVuZCBvZiBpbnB1dCB0byBwdXNoIG91dCBhbnkgcmVtYWluaW5nIGNvbnN0cnVjdGlvbnMgKi9cbiAgICAqZW5kKCkge1xuICAgICAgICB3aGlsZSAodGhpcy5zdGFjay5sZW5ndGggPiAwKVxuICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgfVxuICAgIGdldCBzb3VyY2VUb2tlbigpIHtcbiAgICAgICAgY29uc3Qgc3QgPSB7XG4gICAgICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgaW5kZW50OiB0aGlzLmluZGVudCxcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2VcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHN0O1xuICAgIH1cbiAgICAqc3RlcCgpIHtcbiAgICAgICAgY29uc3QgdG9wID0gdGhpcy5wZWVrKDEpO1xuICAgICAgICBpZiAodGhpcy50eXBlID09PSAnZG9jLWVuZCcgJiYgdG9wPy50eXBlICE9PSAnZG9jLWVuZCcpIHtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLnN0YWNrLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdkb2MtZW5kJyxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdG9wKVxuICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLnN0cmVhbSgpO1xuICAgICAgICBzd2l0Y2ggKHRvcC50eXBlKSB7XG4gICAgICAgICAgICBjYXNlICdkb2N1bWVudCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLmRvY3VtZW50KHRvcCk7XG4gICAgICAgICAgICBjYXNlICdhbGlhcyc6XG4gICAgICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICAgICAgY2FzZSAnc2luZ2xlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICAgICAgY2FzZSAnZG91YmxlLXF1b3RlZC1zY2FsYXInOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5zY2FsYXIodG9wKTtcbiAgICAgICAgICAgIGNhc2UgJ2Jsb2NrLXNjYWxhcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkKiB0aGlzLmJsb2NrU2NhbGFyKHRvcCk7XG4gICAgICAgICAgICBjYXNlICdibG9jay1tYXAnOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5ibG9ja01hcCh0b3ApO1xuICAgICAgICAgICAgY2FzZSAnYmxvY2stc2VxJzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMuYmxvY2tTZXF1ZW5jZSh0b3ApO1xuICAgICAgICAgICAgY2FzZSAnZmxvdy1jb2xsZWN0aW9uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMuZmxvd0NvbGxlY3Rpb24odG9wKTtcbiAgICAgICAgICAgIGNhc2UgJ2RvYy1lbmQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCogdGhpcy5kb2N1bWVudEVuZCh0b3ApO1xuICAgICAgICB9XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0IHNob3VsZCBub3QgaGFwcGVuICovXG4gICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgIH1cbiAgICBwZWVrKG4pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSBuXTtcbiAgICB9XG4gICAgKnBvcChlcnJvcikge1xuICAgICAgICBjb25zdCB0b2tlbiA9IGVycm9yID8/IHRoaXMuc3RhY2sucG9wKCk7XG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiBzaG91bGQgbm90IGhhcHBlbiAqL1xuICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gJ1RyaWVkIHRvIHBvcCBhbiBlbXB0eSBzdGFjayc7XG4gICAgICAgICAgICB5aWVsZCB7IHR5cGU6ICdlcnJvcicsIG9mZnNldDogdGhpcy5vZmZzZXQsIHNvdXJjZTogJycsIG1lc3NhZ2UgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgeWllbGQgdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB0b3AgPSB0aGlzLnBlZWsoMSk7XG4gICAgICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gJ2Jsb2NrLXNjYWxhcicpIHtcbiAgICAgICAgICAgICAgICAvLyBCbG9jayBzY2FsYXJzIHVzZSB0aGVpciBwYXJlbnQgcmF0aGVyIHRoYW4gaGVhZGVyIGluZGVudFxuICAgICAgICAgICAgICAgIHRva2VuLmluZGVudCA9ICdpbmRlbnQnIGluIHRvcCA/IHRvcC5pbmRlbnQgOiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodG9rZW4udHlwZSA9PT0gJ2Zsb3ctY29sbGVjdGlvbicgJiYgdG9wLnR5cGUgPT09ICdkb2N1bWVudCcpIHtcbiAgICAgICAgICAgICAgICAvLyBJZ25vcmUgYWxsIGluZGVudCBmb3IgdG9wLWxldmVsIGZsb3cgY29sbGVjdGlvbnNcbiAgICAgICAgICAgICAgICB0b2tlbi5pbmRlbnQgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09ICdmbG93LWNvbGxlY3Rpb24nKVxuICAgICAgICAgICAgICAgIGZpeEZsb3dTZXFJdGVtcyh0b2tlbik7XG4gICAgICAgICAgICBzd2l0Y2ggKHRvcC50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnZG9jdW1lbnQnOlxuICAgICAgICAgICAgICAgICAgICB0b3AudmFsdWUgPSB0b2tlbjtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYmxvY2stc2NhbGFyJzpcbiAgICAgICAgICAgICAgICAgICAgdG9wLnByb3BzLnB1c2godG9rZW4pOyAvLyBlcnJvclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdibG9jay1tYXAnOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ID0gdG9wLml0ZW1zW3RvcC5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AuaXRlbXMucHVzaCh7IHN0YXJ0OiBbXSwga2V5OiB0b2tlbiwgc2VwOiBbXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25LZXlMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpdC5zZXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnZhbHVlID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGl0LCB7IGtleTogdG9rZW4sIHNlcDogW10gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9ICFpdC5leHBsaWNpdEtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FzZSAnYmxvY2stc2VxJzoge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpdCA9IHRvcC5pdGVtc1t0b3AuaXRlbXMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdC52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcC5pdGVtcy5wdXNoKHsgc3RhcnQ6IFtdLCB2YWx1ZTogdG9rZW4gfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnZhbHVlID0gdG9rZW47XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdmbG93LWNvbGxlY3Rpb24nOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ID0gdG9wLml0ZW1zW3RvcC5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdCB8fCBpdC52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcC5pdGVtcy5wdXNoKHsgc3RhcnQ6IFtdLCBrZXk6IHRva2VuLCBzZXA6IFtdIH0pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpdC5zZXApXG4gICAgICAgICAgICAgICAgICAgICAgICBpdC52YWx1ZSA9IHRva2VuO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGl0LCB7IGtleTogdG9rZW4sIHNlcDogW10gfSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgc2hvdWxkIG5vdCBoYXBwZW4gKi9cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgodG9wLnR5cGUgPT09ICdkb2N1bWVudCcgfHxcbiAgICAgICAgICAgICAgICB0b3AudHlwZSA9PT0gJ2Jsb2NrLW1hcCcgfHxcbiAgICAgICAgICAgICAgICB0b3AudHlwZSA9PT0gJ2Jsb2NrLXNlcScpICYmXG4gICAgICAgICAgICAgICAgKHRva2VuLnR5cGUgPT09ICdibG9jay1tYXAnIHx8IHRva2VuLnR5cGUgPT09ICdibG9jay1zZXEnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3QgPSB0b2tlbi5pdGVtc1t0b2tlbi5pdGVtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBpZiAobGFzdCAmJlxuICAgICAgICAgICAgICAgICAgICAhbGFzdC5zZXAgJiZcbiAgICAgICAgICAgICAgICAgICAgIWxhc3QudmFsdWUgJiZcbiAgICAgICAgICAgICAgICAgICAgbGFzdC5zdGFydC5sZW5ndGggPiAwICYmXG4gICAgICAgICAgICAgICAgICAgIGZpbmROb25FbXB0eUluZGV4KGxhc3Quc3RhcnQpID09PSAtMSAmJlxuICAgICAgICAgICAgICAgICAgICAodG9rZW4uaW5kZW50ID09PSAwIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0LnN0YXJ0LmV2ZXJ5KHN0ID0+IHN0LnR5cGUgIT09ICdjb21tZW50JyB8fCBzdC5pbmRlbnQgPCB0b2tlbi5pbmRlbnQpKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9wLnR5cGUgPT09ICdkb2N1bWVudCcpXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3AuZW5kID0gbGFzdC5zdGFydDtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wLml0ZW1zLnB1c2goeyBzdGFydDogbGFzdC5zdGFydCB9KTtcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4uaXRlbXMuc3BsaWNlKC0xLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgKnN0cmVhbSgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2RpcmVjdGl2ZS1saW5lJzpcbiAgICAgICAgICAgICAgICB5aWVsZCB7IHR5cGU6ICdkaXJlY3RpdmUnLCBvZmZzZXQ6IHRoaXMub2Zmc2V0LCBzb3VyY2U6IHRoaXMuc291cmNlIH07XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnYnl0ZS1vcmRlci1tYXJrJzpcbiAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5zb3VyY2VUb2tlbjtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlICdkb2MtbW9kZSc6XG4gICAgICAgICAgICBjYXNlICdkb2Mtc3RhcnQnOiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZG9jID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZG9jdW1lbnQnLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBzdGFydDogW11cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnR5cGUgPT09ICdkb2Mtc3RhcnQnKVxuICAgICAgICAgICAgICAgICAgICBkb2Muc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goZG9jKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgeWllbGQge1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICBtZXNzYWdlOiBgVW5leHBlY3RlZCAke3RoaXMudHlwZX0gdG9rZW4gaW4gWUFNTCBzdHJlYW1gLFxuICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZVxuICAgICAgICB9O1xuICAgIH1cbiAgICAqZG9jdW1lbnQoZG9jKSB7XG4gICAgICAgIGlmIChkb2MudmFsdWUpXG4gICAgICAgICAgICByZXR1cm4geWllbGQqIHRoaXMubGluZUVuZChkb2MpO1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnZG9jLXN0YXJ0Jzoge1xuICAgICAgICAgICAgICAgIGlmIChmaW5kTm9uRW1wdHlJbmRleChkb2Muc3RhcnQpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQqIHRoaXMuc3RlcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGRvYy5zdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ2FuY2hvcic6XG4gICAgICAgICAgICBjYXNlICd0YWcnOlxuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICBkb2Muc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYnYgPSB0aGlzLnN0YXJ0QmxvY2tWYWx1ZShkb2MpO1xuICAgICAgICBpZiAoYnYpXG4gICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2goYnYpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHlpZWxkIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYFVuZXhwZWN0ZWQgJHt0aGlzLnR5cGV9IHRva2VuIGluIFlBTUwgZG9jdW1lbnRgLFxuICAgICAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2VcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgKnNjYWxhcihzY2FsYXIpIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ21hcC12YWx1ZS1pbmQnKSB7XG4gICAgICAgICAgICBjb25zdCBwcmV2ID0gZ2V0UHJldlByb3BzKHRoaXMucGVlaygyKSk7XG4gICAgICAgICAgICBjb25zdCBzdGFydCA9IGdldEZpcnN0S2V5U3RhcnRQcm9wcyhwcmV2KTtcbiAgICAgICAgICAgIGxldCBzZXA7XG4gICAgICAgICAgICBpZiAoc2NhbGFyLmVuZCkge1xuICAgICAgICAgICAgICAgIHNlcCA9IHNjYWxhci5lbmQ7XG4gICAgICAgICAgICAgICAgc2VwLnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHNjYWxhci5lbmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgc2VwID0gW3RoaXMuc291cmNlVG9rZW5dO1xuICAgICAgICAgICAgY29uc3QgbWFwID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgIG9mZnNldDogc2NhbGFyLm9mZnNldCxcbiAgICAgICAgICAgICAgICBpbmRlbnQ6IHNjYWxhci5pbmRlbnQsXG4gICAgICAgICAgICAgICAgaXRlbXM6IFt7IHN0YXJ0LCBrZXk6IHNjYWxhciwgc2VwIH1dXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdID0gbWFwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHlpZWxkKiB0aGlzLmxpbmVFbmQoc2NhbGFyKTtcbiAgICB9XG4gICAgKmJsb2NrU2NhbGFyKHNjYWxhcikge1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICBjYXNlICduZXdsaW5lJzpcbiAgICAgICAgICAgICAgICBzY2FsYXIucHJvcHMucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICAgICAgICAgIHNjYWxhci5zb3VyY2UgPSB0aGlzLnNvdXJjZTtcbiAgICAgICAgICAgICAgICAvLyBibG9jay1zY2FsYXIgc291cmNlIGluY2x1ZGVzIHRyYWlsaW5nIG5ld2xpbmVcbiAgICAgICAgICAgICAgICB0aGlzLmF0TmV3TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSAwO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uTmV3TGluZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbmwgPSB0aGlzLnNvdXJjZS5pbmRleE9mKCdcXG4nKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChubCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk5ld0xpbmUodGhpcy5vZmZzZXQgKyBubCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBubCA9IHRoaXMuc291cmNlLmluZGV4T2YoJ1xcbicsIG5sKSArIDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCBzaG91bGQgbm90IGhhcHBlbiAqL1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5zdGVwKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgKmJsb2NrTWFwKG1hcCkge1xuICAgICAgICBjb25zdCBpdCA9IG1hcC5pdGVtc1ttYXAuaXRlbXMubGVuZ3RoIC0gMV07XG4gICAgICAgIC8vIGl0LnNlcCBpcyB0cnVlLWlzaCBpZiBwYWlyIGFscmVhZHkgaGFzIGtleSBvciA6IHNlcGFyYXRvclxuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoaXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5kID0gJ2VuZCcgaW4gaXQudmFsdWUgPyBpdC52YWx1ZS5lbmQgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhc3QgPSBBcnJheS5pc0FycmF5KGVuZCkgPyBlbmRbZW5kLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBpZiAobGFzdD8udHlwZSA9PT0gJ2NvbW1lbnQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kPy5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaCh7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcCkge1xuICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgICAgIGlmIChpdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaCh7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcCkge1xuICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0SW5kZW50ZWRDb21tZW50KGl0LnN0YXJ0LCBtYXAuaW5kZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IG1hcC5pdGVtc1ttYXAuaXRlbXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBwcmV2Py52YWx1ZT8uZW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZW5kKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5UHVzaEFycmF5KGVuZCwgaXQuc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmluZGVudCA+PSBtYXAuaW5kZW50KSB7XG4gICAgICAgICAgICBjb25zdCBhdE1hcEluZGVudCA9ICF0aGlzLm9uS2V5TGluZSAmJiB0aGlzLmluZGVudCA9PT0gbWFwLmluZGVudDtcbiAgICAgICAgICAgIGNvbnN0IGF0TmV4dEl0ZW0gPSBhdE1hcEluZGVudCAmJlxuICAgICAgICAgICAgICAgIChpdC5zZXAgfHwgaXQuZXhwbGljaXRLZXkpICYmXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlICE9PSAnc2VxLWl0ZW0taW5kJztcbiAgICAgICAgICAgIC8vIEZvciBlbXB0eSBub2RlcywgYXNzaWduIG5ld2xpbmUtc2VwYXJhdGVkIG5vdCBpbmRlbnRlZCBlbXB0eSB0b2tlbnMgdG8gZm9sbG93aW5nIG5vZGVcbiAgICAgICAgICAgIGxldCBzdGFydCA9IFtdO1xuICAgICAgICAgICAgaWYgKGF0TmV4dEl0ZW0gJiYgaXQuc2VwICYmICFpdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5sID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdC5zZXAubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3QgPSBpdC5zZXBbaV07XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoc3QudHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmwucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdC5pbmRlbnQgPiBtYXAuaW5kZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBubC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBubC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChubC5sZW5ndGggPj0gMilcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSBpdC5zZXAuc3BsaWNlKG5sWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYW5jaG9yJzpcbiAgICAgICAgICAgICAgICBjYXNlICd0YWcnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoYXROZXh0SXRlbSB8fCBpdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHsgc3RhcnQgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaXQuc2VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2V4cGxpY2l0LWtleS1pbmQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0LnNlcCAmJiAhaXQuZXhwbGljaXRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5leHBsaWNpdEtleSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoYXROZXh0SXRlbSB8fCBpdC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHsgc3RhcnQsIGV4cGxpY2l0S2V5OiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYmxvY2stbWFwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0sIGV4cGxpY2l0S2V5OiB0cnVlIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBjYXNlICdtYXAtdmFsdWUtaW5kJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0LmV4cGxpY2l0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWl0LnNlcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmNsdWRlc1Rva2VuKGl0LnN0YXJ0LCAnbmV3bGluZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oaXQsIHsga2V5OiBudWxsLCBzZXA6IFt0aGlzLnNvdXJjZVRva2VuXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gZ2V0Rmlyc3RLZXlTdGFydFByb3BzKGl0LnN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW3sgc3RhcnQsIGtleTogbnVsbCwgc2VwOiBbdGhpcy5zb3VyY2VUb2tlbl0gfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaXQudmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaCh7IHN0YXJ0OiBbXSwga2V5OiBudWxsLCBzZXA6IFt0aGlzLnNvdXJjZVRva2VuXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGluY2x1ZGVzVG9rZW4oaXQuc2VwLCAnbWFwLXZhbHVlLWluZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLW1hcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyBzdGFydCwga2V5OiBudWxsLCBzZXA6IFt0aGlzLnNvdXJjZVRva2VuXSB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaXNGbG93VG9rZW4oaXQua2V5KSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpbmNsdWRlc1Rva2VuKGl0LnNlcCwgJ25ld2xpbmUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gZ2V0Rmlyc3RLZXlTdGFydFByb3BzKGl0LnN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBpdC5rZXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VwID0gaXQuc2VwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgdHlwZSBndWFyZCBpcyB3cm9uZyBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGl0LmtleTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHR5cGUgZ3VhcmQgaXMgd3JvbmcgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBpdC5zZXA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLW1hcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyBzdGFydCwga2V5LCBzZXAgfV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHN0YXJ0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3QgYWN0dWFsbHkgYXQgbmV4dCBpdGVtXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXQuc2VwID0gaXQuc2VwLmNvbmNhdChzdGFydCwgdGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXQuc2VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihpdCwgeyBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoaXQudmFsdWUgfHwgYXROZXh0SXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcC5pdGVtcy5wdXNoKHsgc3RhcnQsIGtleTogbnVsbCwgc2VwOiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpbmNsdWRlc1Rva2VuKGl0LnNlcCwgJ21hcC12YWx1ZS1pbmQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRlbnQ6IHRoaXMuaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtczogW3sgc3RhcnQ6IFtdLCBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBjYXNlICdhbGlhcyc6XG4gICAgICAgICAgICAgICAgY2FzZSAnc2NhbGFyJzpcbiAgICAgICAgICAgICAgICBjYXNlICdzaW5nbGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICAgICAgY2FzZSAnZG91YmxlLXF1b3RlZC1zY2FsYXInOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZzID0gdGhpcy5mbG93U2NhbGFyKHRoaXMudHlwZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdE5leHRJdGVtIHx8IGl0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaCh7IHN0YXJ0LCBrZXk6IGZzLCBzZXA6IFtdIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKGZzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oaXQsIHsga2V5OiBmcywgc2VwOiBbXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25LZXlMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnYgPSB0aGlzLnN0YXJ0QmxvY2tWYWx1ZShtYXApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidi50eXBlID09PSAnYmxvY2stc2VxJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXQuZXhwbGljaXRLZXkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXQuc2VwICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpbmNsdWRlc1Rva2VuKGl0LnNlcCwgJ25ld2xpbmUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3Aoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiAnVW5leHBlY3RlZCBibG9jay1zZXEtaW5kIG9uIHNhbWUgbGluZSB3aXRoIGtleScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoYXRNYXBJbmRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXAuaXRlbXMucHVzaCh7IHN0YXJ0IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKGJ2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgeWllbGQqIHRoaXMuc3RlcCgpO1xuICAgIH1cbiAgICAqYmxvY2tTZXF1ZW5jZShzZXEpIHtcbiAgICAgICAgY29uc3QgaXQgPSBzZXEuaXRlbXNbc2VxLml0ZW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZCA9ICdlbmQnIGluIGl0LnZhbHVlID8gaXQudmFsdWUuZW5kIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsYXN0ID0gQXJyYXkuaXNBcnJheShlbmQpID8gZW5kW2VuZC5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3Q/LnR5cGUgPT09ICdjb21tZW50JylcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZD8ucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VxLml0ZW1zLnB1c2goeyBzdGFydDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlKVxuICAgICAgICAgICAgICAgICAgICBzZXEuaXRlbXMucHVzaCh7IHN0YXJ0OiBbdGhpcy5zb3VyY2VUb2tlbl0gfSk7XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmF0SW5kZW50ZWRDb21tZW50KGl0LnN0YXJ0LCBzZXEuaW5kZW50KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IHNlcS5pdGVtc1tzZXEuaXRlbXMubGVuZ3RoIC0gMl07XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmQgPSBwcmV2Py52YWx1ZT8uZW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZW5kKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5UHVzaEFycmF5KGVuZCwgaXQuc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcS5pdGVtcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnYW5jaG9yJzpcbiAgICAgICAgICAgIGNhc2UgJ3RhZyc6XG4gICAgICAgICAgICAgICAgaWYgKGl0LnZhbHVlIHx8IHRoaXMuaW5kZW50IDw9IHNlcS5pbmRlbnQpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY2FzZSAnc2VxLWl0ZW0taW5kJzpcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pbmRlbnQgIT09IHNlcS5pbmRlbnQpXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGlmIChpdC52YWx1ZSB8fCBpbmNsdWRlc1Rva2VuKGl0LnN0YXJ0LCAnc2VxLWl0ZW0taW5kJykpXG4gICAgICAgICAgICAgICAgICAgIHNlcS5pdGVtcy5wdXNoKHsgc3RhcnQ6IFt0aGlzLnNvdXJjZVRva2VuXSB9KTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGl0LnN0YXJ0LnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmluZGVudCA+IHNlcS5pbmRlbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ2ID0gdGhpcy5zdGFydEJsb2NrVmFsdWUoc2VxKTtcbiAgICAgICAgICAgIGlmIChidikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaChidik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICB5aWVsZCogdGhpcy5zdGVwKCk7XG4gICAgfVxuICAgICpmbG93Q29sbGVjdGlvbihmYykge1xuICAgICAgICBjb25zdCBpdCA9IGZjLml0ZW1zW2ZjLml0ZW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAodGhpcy50eXBlID09PSAnZmxvdy1lcnJvci1lbmQnKSB7XG4gICAgICAgICAgICBsZXQgdG9wO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHRvcCA9IHRoaXMucGVlaygxKTtcbiAgICAgICAgICAgIH0gd2hpbGUgKHRvcD8udHlwZSA9PT0gJ2Zsb3ctY29sbGVjdGlvbicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGZjLmVuZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29tbWEnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2V4cGxpY2l0LWtleS1pbmQnOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWl0IHx8IGl0LnNlcClcbiAgICAgICAgICAgICAgICAgICAgICAgIGZjLml0ZW1zLnB1c2goeyBzdGFydDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5zdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY2FzZSAnbWFwLXZhbHVlLWluZCc6XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXQgfHwgaXQudmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICBmYy5pdGVtcy5wdXNoKHsgc3RhcnQ6IFtdLCBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpdC5zZXApXG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihpdCwgeyBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ25ld2xpbmUnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2FuY2hvcic6XG4gICAgICAgICAgICAgICAgY2FzZSAndGFnJzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdCB8fCBpdC52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGZjLml0ZW1zLnB1c2goeyBzdGFydDogW3RoaXMuc291cmNlVG9rZW5dIH0pO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpdC5zZXApXG4gICAgICAgICAgICAgICAgICAgICAgICBpdC5zZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaXQuc3RhcnQucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2FsaWFzJzpcbiAgICAgICAgICAgICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3NpbmdsZS1xdW90ZWQtc2NhbGFyJzpcbiAgICAgICAgICAgICAgICBjYXNlICdkb3VibGUtcXVvdGVkLXNjYWxhcic6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZnMgPSB0aGlzLmZsb3dTY2FsYXIodGhpcy50eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpdCB8fCBpdC52YWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGZjLml0ZW1zLnB1c2goeyBzdGFydDogW10sIGtleTogZnMsIHNlcDogW10gfSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGl0LnNlcClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhY2sucHVzaChmcyk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oaXQsIHsga2V5OiBmcywgc2VwOiBbXSB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXNlICdmbG93LW1hcC1lbmQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2Zsb3ctc2VxLWVuZCc6XG4gICAgICAgICAgICAgICAgICAgIGZjLmVuZC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBidiA9IHRoaXMuc3RhcnRCbG9ja1ZhbHVlKGZjKTtcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlIHNob3VsZCBub3QgaGFwcGVuICovXG4gICAgICAgICAgICBpZiAoYnYpXG4gICAgICAgICAgICAgICAgdGhpcy5zdGFjay5wdXNoKGJ2KTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnN0ZXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMucGVlaygyKTtcbiAgICAgICAgICAgIGlmIChwYXJlbnQudHlwZSA9PT0gJ2Jsb2NrLW1hcCcgJiZcbiAgICAgICAgICAgICAgICAoKHRoaXMudHlwZSA9PT0gJ21hcC12YWx1ZS1pbmQnICYmIHBhcmVudC5pbmRlbnQgPT09IGZjLmluZGVudCkgfHxcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMudHlwZSA9PT0gJ25ld2xpbmUnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhcGFyZW50Lml0ZW1zW3BhcmVudC5pdGVtcy5sZW5ndGggLSAxXS5zZXApKSkge1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnBvcCgpO1xuICAgICAgICAgICAgICAgIHlpZWxkKiB0aGlzLnN0ZXAoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudHlwZSA9PT0gJ21hcC12YWx1ZS1pbmQnICYmXG4gICAgICAgICAgICAgICAgcGFyZW50LnR5cGUgIT09ICdmbG93LWNvbGxlY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJldiA9IGdldFByZXZQcm9wcyhwYXJlbnQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gZ2V0Rmlyc3RLZXlTdGFydFByb3BzKHByZXYpO1xuICAgICAgICAgICAgICAgIGZpeEZsb3dTZXFJdGVtcyhmYyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VwID0gZmMuZW5kLnNwbGljZSgxLCBmYy5lbmQubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBzZXAucHVzaCh0aGlzLnNvdXJjZVRva2VuKTtcbiAgICAgICAgICAgICAgICBjb25zdCBtYXAgPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IGZjLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50OiBmYy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyBzdGFydCwga2V5OiBmYywgc2VwIH1dXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uS2V5TGluZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdID0gbWFwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMubGluZUVuZChmYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmxvd1NjYWxhcih0eXBlKSB7XG4gICAgICAgIGlmICh0aGlzLm9uTmV3TGluZSkge1xuICAgICAgICAgICAgbGV0IG5sID0gdGhpcy5zb3VyY2UuaW5kZXhPZignXFxuJykgKyAxO1xuICAgICAgICAgICAgd2hpbGUgKG5sICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbk5ld0xpbmUodGhpcy5vZmZzZXQgKyBubCk7XG4gICAgICAgICAgICAgICAgbmwgPSB0aGlzLnNvdXJjZS5pbmRleE9mKCdcXG4nLCBubCkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlXG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXJ0QmxvY2tWYWx1ZShwYXJlbnQpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2FsaWFzJzpcbiAgICAgICAgICAgIGNhc2UgJ3NjYWxhcic6XG4gICAgICAgICAgICBjYXNlICdzaW5nbGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICBjYXNlICdkb3VibGUtcXVvdGVkLXNjYWxhcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmxvd1NjYWxhcih0aGlzLnR5cGUpO1xuICAgICAgICAgICAgY2FzZSAnYmxvY2stc2NhbGFyLWhlYWRlcic6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLXNjYWxhcicsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgIHByb3BzOiBbdGhpcy5zb3VyY2VUb2tlbl0sXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogJydcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgY2FzZSAnZmxvdy1tYXAtc3RhcnQnOlxuICAgICAgICAgICAgY2FzZSAnZmxvdy1zZXEtc3RhcnQnOlxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdmbG93LWNvbGxlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQ6IHRoaXMuaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICBzdGFydDogdGhpcy5zb3VyY2VUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBlbmQ6IFtdXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhc2UgJ3NlcS1pdGVtLWluZCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Jsb2NrLXNlcScsXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldDogdGhpcy5vZmZzZXQsXG4gICAgICAgICAgICAgICAgICAgIGluZGVudDogdGhpcy5pbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBbeyBzdGFydDogW3RoaXMuc291cmNlVG9rZW5dIH1dXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNhc2UgJ2V4cGxpY2l0LWtleS1pbmQnOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXYgPSBnZXRQcmV2UHJvcHMocGFyZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IGdldEZpcnN0S2V5U3RhcnRQcm9wcyhwcmV2KTtcbiAgICAgICAgICAgICAgICBzdGFydC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdibG9jay1tYXAnLFxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0LFxuICAgICAgICAgICAgICAgICAgICBpbmRlbnQ6IHRoaXMuaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICBpdGVtczogW3sgc3RhcnQsIGV4cGxpY2l0S2V5OiB0cnVlIH1dXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ21hcC12YWx1ZS1pbmQnOiB7XG4gICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXYgPSBnZXRQcmV2UHJvcHMocGFyZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IGdldEZpcnN0S2V5U3RhcnRQcm9wcyhwcmV2KTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYmxvY2stbWFwJyxcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCxcbiAgICAgICAgICAgICAgICAgICAgaW5kZW50OiB0aGlzLmluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXM6IFt7IHN0YXJ0LCBrZXk6IG51bGwsIHNlcDogW3RoaXMuc291cmNlVG9rZW5dIH1dXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgYXRJbmRlbnRlZENvbW1lbnQoc3RhcnQsIGluZGVudCkge1xuICAgICAgICBpZiAodGhpcy50eXBlICE9PSAnY29tbWVudCcpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLmluZGVudCA8PSBpbmRlbnQpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiBzdGFydC5ldmVyeShzdCA9PiBzdC50eXBlID09PSAnbmV3bGluZScgfHwgc3QudHlwZSA9PT0gJ3NwYWNlJyk7XG4gICAgfVxuICAgICpkb2N1bWVudEVuZChkb2NFbmQpIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZSAhPT0gJ2RvYy1tb2RlJykge1xuICAgICAgICAgICAgaWYgKGRvY0VuZC5lbmQpXG4gICAgICAgICAgICAgICAgZG9jRW5kLmVuZC5wdXNoKHRoaXMuc291cmNlVG9rZW4pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGRvY0VuZC5lbmQgPSBbdGhpcy5zb3VyY2VUb2tlbl07XG4gICAgICAgICAgICBpZiAodGhpcy50eXBlID09PSAnbmV3bGluZScpXG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgKmxpbmVFbmQodG9rZW4pIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NvbW1hJzpcbiAgICAgICAgICAgIGNhc2UgJ2RvYy1zdGFydCc6XG4gICAgICAgICAgICBjYXNlICdkb2MtZW5kJzpcbiAgICAgICAgICAgIGNhc2UgJ2Zsb3ctc2VxLWVuZCc6XG4gICAgICAgICAgICBjYXNlICdmbG93LW1hcC1lbmQnOlxuICAgICAgICAgICAgY2FzZSAnbWFwLXZhbHVlLWluZCc6XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMucG9wKCk7XG4gICAgICAgICAgICAgICAgeWllbGQqIHRoaXMuc3RlcCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbmV3bGluZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5vbktleUxpbmUgPSBmYWxzZTtcbiAgICAgICAgICAgIC8vIGZhbGx0aHJvdWdoXG4gICAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLy8gYWxsIG90aGVyIHZhbHVlcyBhcmUgZXJyb3JzXG4gICAgICAgICAgICAgICAgaWYgKHRva2VuLmVuZClcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4uZW5kLnB1c2godGhpcy5zb3VyY2VUb2tlbik7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0b2tlbi5lbmQgPSBbdGhpcy5zb3VyY2VUb2tlbl07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHlwZSA9PT0gJ25ld2xpbmUnKVxuICAgICAgICAgICAgICAgICAgICB5aWVsZCogdGhpcy5wb3AoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHsgUGFyc2VyIH07XG4iLCAiaW1wb3J0IHsgQ29tcG9zZXIgfSBmcm9tICcuL2NvbXBvc2UvY29tcG9zZXIuanMnO1xuaW1wb3J0IHsgRG9jdW1lbnQgfSBmcm9tICcuL2RvYy9Eb2N1bWVudC5qcyc7XG5pbXBvcnQgeyBwcmV0dGlmeUVycm9yLCBZQU1MUGFyc2VFcnJvciB9IGZyb20gJy4vZXJyb3JzLmpzJztcbmltcG9ydCB7IHdhcm4gfSBmcm9tICcuL2xvZy5qcyc7XG5pbXBvcnQgeyBpc0RvY3VtZW50IH0gZnJvbSAnLi9ub2Rlcy9pZGVudGl0eS5qcyc7XG5pbXBvcnQgeyBMaW5lQ291bnRlciB9IGZyb20gJy4vcGFyc2UvbGluZS1jb3VudGVyLmpzJztcbmltcG9ydCB7IFBhcnNlciB9IGZyb20gJy4vcGFyc2UvcGFyc2VyLmpzJztcblxuZnVuY3Rpb24gcGFyc2VPcHRpb25zKG9wdGlvbnMpIHtcbiAgICBjb25zdCBwcmV0dHlFcnJvcnMgPSBvcHRpb25zLnByZXR0eUVycm9ycyAhPT0gZmFsc2U7XG4gICAgY29uc3QgbGluZUNvdW50ZXIgPSBvcHRpb25zLmxpbmVDb3VudGVyIHx8IChwcmV0dHlFcnJvcnMgJiYgbmV3IExpbmVDb3VudGVyKCkpIHx8IG51bGw7XG4gICAgcmV0dXJuIHsgbGluZUNvdW50ZXIsIHByZXR0eUVycm9ycyB9O1xufVxuLyoqXG4gKiBQYXJzZSB0aGUgaW5wdXQgYXMgYSBzdHJlYW0gb2YgWUFNTCBkb2N1bWVudHMuXG4gKlxuICogRG9jdW1lbnRzIHNob3VsZCBiZSBzZXBhcmF0ZWQgZnJvbSBlYWNoIG90aGVyIGJ5IGAuLi5gIG9yIGAtLS1gIG1hcmtlciBsaW5lcy5cbiAqXG4gKiBAcmV0dXJucyBJZiBhbiBlbXB0eSBgZG9jc2AgYXJyYXkgaXMgcmV0dXJuZWQsIGl0IHdpbGwgYmUgb2YgdHlwZVxuICogICBFbXB0eVN0cmVhbSBhbmQgY29udGFpbiBhZGRpdGlvbmFsIHN0cmVhbSBpbmZvcm1hdGlvbi4gSW5cbiAqICAgVHlwZVNjcmlwdCwgeW91IHNob3VsZCB1c2UgYCdlbXB0eScgaW4gZG9jc2AgYXMgYSB0eXBlIGd1YXJkIGZvciBpdC5cbiAqL1xuZnVuY3Rpb24gcGFyc2VBbGxEb2N1bWVudHMoc291cmNlLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGxpbmVDb3VudGVyLCBwcmV0dHlFcnJvcnMgfSA9IHBhcnNlT3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKGxpbmVDb3VudGVyPy5hZGROZXdMaW5lKTtcbiAgICBjb25zdCBjb21wb3NlciA9IG5ldyBDb21wb3NlcihvcHRpb25zKTtcbiAgICBjb25zdCBkb2NzID0gQXJyYXkuZnJvbShjb21wb3Nlci5jb21wb3NlKHBhcnNlci5wYXJzZShzb3VyY2UpKSk7XG4gICAgaWYgKHByZXR0eUVycm9ycyAmJiBsaW5lQ291bnRlcilcbiAgICAgICAgZm9yIChjb25zdCBkb2Mgb2YgZG9jcykge1xuICAgICAgICAgICAgZG9jLmVycm9ycy5mb3JFYWNoKHByZXR0aWZ5RXJyb3Ioc291cmNlLCBsaW5lQ291bnRlcikpO1xuICAgICAgICAgICAgZG9jLndhcm5pbmdzLmZvckVhY2gocHJldHRpZnlFcnJvcihzb3VyY2UsIGxpbmVDb3VudGVyKSk7XG4gICAgICAgIH1cbiAgICBpZiAoZG9jcy5sZW5ndGggPiAwKVxuICAgICAgICByZXR1cm4gZG9jcztcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihbXSwgeyBlbXB0eTogdHJ1ZSB9LCBjb21wb3Nlci5zdHJlYW1JbmZvKCkpO1xufVxuLyoqIFBhcnNlIGFuIGlucHV0IHN0cmluZyBpbnRvIGEgc2luZ2xlIFlBTUwuRG9jdW1lbnQgKi9cbmZ1bmN0aW9uIHBhcnNlRG9jdW1lbnQoc291cmNlLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGxpbmVDb3VudGVyLCBwcmV0dHlFcnJvcnMgfSA9IHBhcnNlT3B0aW9ucyhvcHRpb25zKTtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgUGFyc2VyKGxpbmVDb3VudGVyPy5hZGROZXdMaW5lKTtcbiAgICBjb25zdCBjb21wb3NlciA9IG5ldyBDb21wb3NlcihvcHRpb25zKTtcbiAgICAvLyBgZG9jYCBpcyBhbHdheXMgc2V0IGJ5IGNvbXBvc2UuZW5kKHRydWUpIGF0IHRoZSB2ZXJ5IGxhdGVzdFxuICAgIGxldCBkb2MgPSBudWxsO1xuICAgIGZvciAoY29uc3QgX2RvYyBvZiBjb21wb3Nlci5jb21wb3NlKHBhcnNlci5wYXJzZShzb3VyY2UpLCB0cnVlLCBzb3VyY2UubGVuZ3RoKSkge1xuICAgICAgICBpZiAoIWRvYylcbiAgICAgICAgICAgIGRvYyA9IF9kb2M7XG4gICAgICAgIGVsc2UgaWYgKGRvYy5vcHRpb25zLmxvZ0xldmVsICE9PSAnc2lsZW50Jykge1xuICAgICAgICAgICAgZG9jLmVycm9ycy5wdXNoKG5ldyBZQU1MUGFyc2VFcnJvcihfZG9jLnJhbmdlLnNsaWNlKDAsIDIpLCAnTVVMVElQTEVfRE9DUycsICdTb3VyY2UgY29udGFpbnMgbXVsdGlwbGUgZG9jdW1lbnRzOyBwbGVhc2UgdXNlIFlBTUwucGFyc2VBbGxEb2N1bWVudHMoKScpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChwcmV0dHlFcnJvcnMgJiYgbGluZUNvdW50ZXIpIHtcbiAgICAgICAgZG9jLmVycm9ycy5mb3JFYWNoKHByZXR0aWZ5RXJyb3Ioc291cmNlLCBsaW5lQ291bnRlcikpO1xuICAgICAgICBkb2Mud2FybmluZ3MuZm9yRWFjaChwcmV0dGlmeUVycm9yKHNvdXJjZSwgbGluZUNvdW50ZXIpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRvYztcbn1cbmZ1bmN0aW9uIHBhcnNlKHNyYywgcmV2aXZlciwgb3B0aW9ucykge1xuICAgIGxldCBfcmV2aXZlciA9IHVuZGVmaW5lZDtcbiAgICBpZiAodHlwZW9mIHJldml2ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgX3Jldml2ZXIgPSByZXZpdmVyO1xuICAgIH1cbiAgICBlbHNlIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgJiYgcmV2aXZlciAmJiB0eXBlb2YgcmV2aXZlciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgb3B0aW9ucyA9IHJldml2ZXI7XG4gICAgfVxuICAgIGNvbnN0IGRvYyA9IHBhcnNlRG9jdW1lbnQoc3JjLCBvcHRpb25zKTtcbiAgICBpZiAoIWRvYylcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgZG9jLndhcm5pbmdzLmZvckVhY2god2FybmluZyA9PiB3YXJuKGRvYy5vcHRpb25zLmxvZ0xldmVsLCB3YXJuaW5nKSk7XG4gICAgaWYgKGRvYy5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAoZG9jLm9wdGlvbnMubG9nTGV2ZWwgIT09ICdzaWxlbnQnKVxuICAgICAgICAgICAgdGhyb3cgZG9jLmVycm9yc1swXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZG9jLmVycm9ycyA9IFtdO1xuICAgIH1cbiAgICByZXR1cm4gZG9jLnRvSlMoT2JqZWN0LmFzc2lnbih7IHJldml2ZXI6IF9yZXZpdmVyIH0sIG9wdGlvbnMpKTtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeSh2YWx1ZSwgcmVwbGFjZXIsIG9wdGlvbnMpIHtcbiAgICBsZXQgX3JlcGxhY2VyID0gbnVsbDtcbiAgICBpZiAodHlwZW9mIHJlcGxhY2VyID09PSAnZnVuY3Rpb24nIHx8IEFycmF5LmlzQXJyYXkocmVwbGFjZXIpKSB7XG4gICAgICAgIF9yZXBsYWNlciA9IHJlcGxhY2VyO1xuICAgIH1cbiAgICBlbHNlIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQgJiYgcmVwbGFjZXIpIHtcbiAgICAgICAgb3B0aW9ucyA9IHJlcGxhY2VyO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKVxuICAgICAgICBvcHRpb25zID0gb3B0aW9ucy5sZW5ndGg7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnbnVtYmVyJykge1xuICAgICAgICBjb25zdCBpbmRlbnQgPSBNYXRoLnJvdW5kKG9wdGlvbnMpO1xuICAgICAgICBvcHRpb25zID0gaW5kZW50IDwgMSA/IHVuZGVmaW5lZCA6IGluZGVudCA+IDggPyB7IGluZGVudDogOCB9IDogeyBpbmRlbnQgfTtcbiAgICB9XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgeyBrZWVwVW5kZWZpbmVkIH0gPSBvcHRpb25zID8/IHJlcGxhY2VyID8/IHt9O1xuICAgICAgICBpZiAoIWtlZXBVbmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoaXNEb2N1bWVudCh2YWx1ZSkgJiYgIV9yZXBsYWNlcilcbiAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKG9wdGlvbnMpO1xuICAgIHJldHVybiBuZXcgRG9jdW1lbnQodmFsdWUsIF9yZXBsYWNlciwgb3B0aW9ucykudG9TdHJpbmcob3B0aW9ucyk7XG59XG5cbmV4cG9ydCB7IHBhcnNlLCBwYXJzZUFsbERvY3VtZW50cywgcGFyc2VEb2N1bWVudCwgc3RyaW5naWZ5IH07XG4iLCAiLyoqXG4gKiBZQU1MIGZyb250bWF0dGVyIGluamVjdGlvbiB1dGlsaXR5LlxuICogTm9uLWRlc3RydWN0aXZlOiBwcmVzZXJ2ZXMgZXhpc3RpbmcgZnJvbnRtYXR0ZXIgYW5kIGJvZHkgdGV4dC5cbiAqIEFEUi0wMDM6IEh5YnJpZCBBc3NldCBOb3Rlc1xuICovXG5cbmltcG9ydCB7IHBhcnNlIGFzIHBhcnNlWWFtbCB9IGZyb20gXCJ5YW1sXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXVkaW9NZXRhZGF0YSB7XG4gIGF1ZGlvX3NvdXJjZT86IHN0cmluZztcbiAga2V5Pzogc3RyaW5nO1xuICBrZXlfY29uZmlybWVkPzogYm9vbGVhbjtcbiAgdGVtcG8/OiBudW1iZXI7XG4gIHRlbXBvX2NvbmZpcm1lZD86IGJvb2xlYW47XG4gIHJhd190ZW1wbz86IG51bWJlcjtcbiAgYWx0ZXJuYXRlX3RlbXBvPzogbnVtYmVyO1xuICB0aW1lX3NpZ25hdHVyZT86IHN0cmluZztcbiAgZHVyYXRpb24/OiBzdHJpbmc7XG4gIHRvdGFsX2JhcnM/OiBudW1iZXI7XG4gIGF1ZGlvX3N0YXJ0X29mZnNldD86IG51bWJlcjtcbiAgYW5hbHlzaXNfY29uZmlkZW5jZT86IG51bWJlcjsgLy8gREVQUkVDQVRFRCBcdTIwMTQgZG8gbm90IGRpc3BsYXkgYXMgdHJ1c3QgbWV0cmljXG4gIHN0cnVjdHVyZT86IEFycmF5PHtcbiAgICBzZWdtZW50OiBzdHJpbmc7XG4gICAgYmFyczogW251bWJlciwgbnVtYmVyXTtcbiAgICB0aW1lOiBbc3RyaW5nLCBzdHJpbmddO1xuICB9PjtcbiAgYXJ0aXN0Pzogc3RyaW5nW107XG4gIHByb2R1Y2VyPzogc3RyaW5nW107XG4gIG1peGVyPzogc3RyaW5nW107XG4gIGVuZ2luZWVyPzogc3RyaW5nW107XG4gIG11c2ljaWFucz86IHN0cmluZ1tdO1xuICBwcm9kdWNlcl9pbnN0YWdyYW0/OiBzdHJpbmdbXTtcbiAgc291cmNlX3VybD86IHN0cmluZztcbiAgbGljZW5zZV9zdGF0dXM/OiBzdHJpbmc7XG59XG5cbi8qKiBTZXJpYWxpemUgYW55IHZhbHVlIHRvIFlBTUwgc3RyaW5nLiAqL1xuZnVuY3Rpb24gc2VyaWFsaXplVmFsdWUodmFsOiB1bmtub3duLCBpbmRlbnQgPSAwKTogc3RyaW5nIHtcbiAgaWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkgcmV0dXJuIFwiXCI7XG4gIGlmICh0eXBlb2YgdmFsID09PSBcImJvb2xlYW5cIikgcmV0dXJuIFN0cmluZyh2YWwpO1xuICBpZiAodHlwZW9mIHZhbCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIFN0cmluZyh2YWwpO1xuXG4gIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFwiW11cIjtcblxuICAgIC8vIEFycmF5IG9mIG9iamVjdHM6IGJsb2NrIGZvcm0gKHN0cnVjdHVyZSBzZWdtZW50cylcbiAgICBpZiAodmFsLmV2ZXJ5KCh2KSA9PiB2ICE9PSBudWxsICYmIHR5cGVvZiB2ID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHYpKSkge1xuICAgICAgY29uc3QgcGFkID0gXCIgIFwiLnJlcGVhdChpbmRlbnQpO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgXCJcXG5cIiArXG4gICAgICAgIHZhbFxuICAgICAgICAgIC5tYXAoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhpdGVtIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KVxuICAgICAgICAgICAgICAubWFwKChbazIsIHYyXSkgPT4gYCR7cGFkfSAgICAke2syfTogJHtzZXJpYWxpemVWYWx1ZSh2MiwgaW5kZW50ICsgMil9YClcbiAgICAgICAgICAgICAgLmpvaW4oXCJcXG5cIik7XG4gICAgICAgICAgICByZXR1cm4gYCR7cGFkfSAgLVxcbiR7ZW50cmllc31gO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmpvaW4oXCJcXG5cIilcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gUHJpbWl0aXZlIGFycmF5OiBjb21wYWN0IGlubGluZSBmb3JtXG4gICAgY29uc3QgaXRlbXMgPSB2YWwubWFwKCh2KSA9PiBzZXJpYWxpemVTY2FsYXIodikpO1xuICAgIHJldHVybiBgWyR7aXRlbXMuam9pbihcIiwgXCIpfV1gO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCIpIHtcbiAgICBjb25zdCBwYWQgPSBcIiAgXCIucmVwZWF0KGluZGVudCk7XG4gICAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHZhbCBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPilcbiAgICAgIC5tYXAoKFtrMiwgdjJdKSA9PiBgJHtwYWR9ICAke2syfTogJHtzZXJpYWxpemVWYWx1ZSh2MiwgaW5kZW50ICsgMSl9YCk7XG4gICAgcmV0dXJuIFwiXFxuXCIgKyBlbnRyaWVzLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICByZXR1cm4gc2VyaWFsaXplU2NhbGFyKHZhbCk7XG59XG5cbi8qKiBRdW90ZSBhIHNjYWxhciBpZiBpdCBjb250YWlucyBZQU1MLXNwZWNpYWwgY2hhcmFjdGVycy4gKi9cbmZ1bmN0aW9uIHNlcmlhbGl6ZVNjYWxhcih2YWw6IHVua25vd24pOiBzdHJpbmcge1xuICBpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gXCJcIjtcbiAgaWYgKHR5cGVvZiB2YWwgPT09IFwiYm9vbGVhblwiIHx8IHR5cGVvZiB2YWwgPT09IFwibnVtYmVyXCIpIHJldHVybiBTdHJpbmcodmFsKTtcblxuICBjb25zdCBzdHIgPSBTdHJpbmcodmFsKTtcblxuICBjb25zdCBuZWVkc1F1b3RlcyA9XG4gICAgc3RyID09PSBcIlwiIHx8XG4gICAgc3RyLmluY2x1ZGVzKFwiOlwiKSB8fFxuICAgIHN0ci5pbmNsdWRlcyhcIiNcIikgfHxcbiAgICBzdHIuaW5jbHVkZXMoXCJcXG5cIikgfHxcbiAgICBzdHIuaW5jbHVkZXMoJ1wiJykgfHxcbiAgICBzdHIuc3RhcnRzV2l0aChcIi1cIikgfHxcbiAgICBzdHIuc3RhcnRzV2l0aChcIltcIikgfHxcbiAgICBzdHIuc3RhcnRzV2l0aChcIntcIikgfHxcbiAgICBzdHIgPT09IFwidHJ1ZVwiIHx8XG4gICAgc3RyID09PSBcImZhbHNlXCIgfHxcbiAgICBzdHIgPT09IFwibnVsbFwiIHx8XG4gICAgc3RyID09PSBcIn5cIjtcblxuICBpZiAobmVlZHNRdW90ZXMpIHtcbiAgICByZXR1cm4gYFwiJHtzdHIucmVwbGFjZSgvXFxcXC9nLCBcIlxcXFxcXFxcXCIpLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKX1cImA7XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn1cblxuY29uc3QgRlJPTlRNQVRURVJfREVMSU1JVEVSID0gL14tLS1cXHMqXFxuKFtcXHNcXFNdKj8pXFxuLS0tXFxzKlxcbj8vO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0RnJvbnRtYXR0ZXIoXG4gIGNvbnRlbnQ6IHN0cmluZyxcbiAgbWV0YWRhdGE6IEF1ZGlvTWV0YWRhdGEsXG4pOiBzdHJpbmcge1xuICBjb25zdCBtYXRjaCA9IEZST05UTUFUVEVSX0RFTElNSVRFUi5leGVjKGNvbnRlbnQpO1xuXG4gIGxldCBleGlzdGluZzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcbiAgbGV0IGJvZHkgPSBjb250ZW50O1xuXG4gIGlmIChtYXRjaCkge1xuICAgIGNvbnN0IHlhbWxCbG9jayA9IG1hdGNoWzFdO1xuICAgIHRyeSB7XG4gICAgICBleGlzdGluZyA9IHBhcnNlWWFtbCh5YW1sQmxvY2spIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+IHx8IHt9O1xuICAgIH0gY2F0Y2gge1xuICAgICAgZXhpc3RpbmcgPSB7fTtcbiAgICB9XG4gICAgYm9keSA9IGNvbnRlbnQuc2xpY2UobWF0Y2hbMF0ubGVuZ3RoKTtcbiAgfVxuXG4gIC8vIE1lcmdlOiBtZXRhZGF0YSB3aW5zIG92ZXIgZXhpc3RpbmcgZm9yIG91ciBrZXlzXG4gIGNvbnN0IG1lcmdlZCA9IGNsZWFuVW5kZWZpbmVkKHsgLi4uZXhpc3RpbmcsIC4uLm1ldGFkYXRhIH0pO1xuXG4gIGNvbnN0IGxpbmVzID0gT2JqZWN0LmVudHJpZXMobWVyZ2VkKVxuICAgIC5tYXAoKFtrLCB2XSkgPT4gYCR7a306ICR7c2VyaWFsaXplVmFsdWUodil9YCk7XG5cbiAgaWYgKGxpbmVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGNvbnRlbnQ7XG5cbiAgY29uc3QgbmV3RnJvbnQgPSBgLS0tXFxuJHtsaW5lcy5qb2luKFwiXFxuXCIpfVxcbi0tLVxcbmA7XG4gIHJldHVybiBuZXdGcm9udCArIGJvZHk7XG59XG5cbi8qKiBTdHJpcCB1bmRlZmluZWQgdmFsdWVzIHNvIHRoZXkgZG9uJ3Qgc2VyaWFsaXplLiAqL1xuZnVuY3Rpb24gY2xlYW5VbmRlZmluZWQob2JqOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3Qgb3V0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhvYmopKSB7XG4gICAgaWYgKHYgIT09IHVuZGVmaW5lZCkgb3V0W2tdID0gdjtcbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG4vKiogUGFyc2UgZnJvbnRtYXR0ZXIgZnJvbSByYXcgbm90ZSBjb250ZW50IHVzZWQgYnkgZGFzaGJvYXJkLXByb2Nlc3Nvci4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUZyb250bWF0dGVyKHJhdzogc3RyaW5nKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBtYXRjaCA9IEZST05UTUFUVEVSX0RFTElNSVRFUi5leGVjKHJhdyk7XG4gIGlmICghbWF0Y2gpIHJldHVybiB7fTtcbiAgdHJ5IHtcbiAgICByZXR1cm4gcGFyc2VZYW1sKG1hdGNoWzFdKSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8fCB7fTtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG59XG4iLCAiLy8gQW5hbHlzaXNDb25maXJtTW9kYWwgXHUyMDE0IG9wZW5zIG9uLWRlbWFuZCB3aGVuIHVzZXIgY2xpY2tzIGFuIHVuY29uZmlybWVkIHZhbHVlLlxuLy8gVXNlcyBCcG1Db250cm9sICsgS2V5Q29udHJvbCAocmV1c2FibGUgaW4gZGFzaGJvYXJkIGxhdGVyKS5cbi8vXG4vLyBDU1MgY2xhc3MgaG9va3M6XG4vLyAgLm1hbS1jb25maXJtLW1vZGFsICAgICAgIFx1MjAxNCBNb2RhbCByb290XG4vLyAgLm1hbS1tb2RhbC1oZWFkZXIgICAgICAgIFx1MjAxNCBUaXRsZSBhcmVhXG4vLyAgLm1hbS1tb2RhbC1ib2R5ICAgICAgICAgIFx1MjAxNCBDb250cm9scyBjb250YWluZXJcbi8vICAubWFtLW1vZGFsLXNlY3Rpb24gICAgICAgXHUyMDE0IEJQTSAvIEtleSBzZWN0aW9uIHdyYXBwZXJcbi8vICAubWFtLW1vZGFsLXNlY3Rpb24tbGFiZWwgXHUyMDE0IFwiVGVtcG9cIiAvIFwiS2V5XCIgbGFiZWxcbi8vICAubWFtLW1vZGFsLWZvb3RlciAgICAgICAgXHUyMDE0IFNhdmUgLyBDYW5jZWwgYWN0aW9uc1xuLy8gIC5tYW0tYnRuLXNhdmUgICAgICAgICAgICBcdTIwMTQgQ29tbWl0IGNoYW5nZXNcbi8vICAubWFtLWJ0bi1jYW5jZWwgICAgICAgICAgXHUyMDE0IERpc2NhcmQgY2hhbmdlc1xuXG5pbXBvcnQgeyBNb2RhbCwgQXBwIH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBCcG1Db250cm9sLCBCcG1Db250cm9sU3RhdGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9icG0tY29udHJvbFwiO1xuaW1wb3J0IHsgS2V5Q29udHJvbCwgS2V5Q29udHJvbFN0YXRlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMva2V5LWNvbnRyb2xcIjtcblxuZXhwb3J0IGludGVyZmFjZSBDb25maXJtTW9kYWxEYXRhIHtcbiAgZmlsZU5hbWU6IHN0cmluZztcbiAgYnBtOiBCcG1Db250cm9sU3RhdGU7XG4gIGtleTogS2V5Q29udHJvbFN0YXRlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpcm1Nb2RhbENhbGxiYWNrcyB7XG4gIG9uU2F2ZTogKGRhdGE6IHsgYnBtOiBCcG1Db250cm9sU3RhdGU7IGtleTogS2V5Q29udHJvbFN0YXRlIH0pID0+IHZvaWQ7XG4gIG9uQ2FuY2VsPzogKCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIEFuYWx5c2lzQ29uZmlybU1vZGFsIGV4dGVuZHMgTW9kYWwge1xuICBwcml2YXRlIGRhdGE6IENvbmZpcm1Nb2RhbERhdGE7XG4gIHByaXZhdGUgY2FsbGJhY2tzOiBDb25maXJtTW9kYWxDYWxsYmFja3M7XG4gIHByaXZhdGUgYnBtQ29udHJvbD86IEJwbUNvbnRyb2w7XG4gIHByaXZhdGUga2V5Q29udHJvbD86IEtleUNvbnRyb2w7XG5cbiAgY29uc3RydWN0b3IoYXBwOiBBcHAsIGRhdGE6IENvbmZpcm1Nb2RhbERhdGEsIGNhbGxiYWNrczogQ29uZmlybU1vZGFsQ2FsbGJhY2tzKSB7XG4gICAgc3VwZXIoYXBwKTtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuY2FsbGJhY2tzID0gY2FsbGJhY2tzO1xuICB9XG5cbiAgb25PcGVuKCkge1xuICAgIGNvbnN0IHsgY29udGVudEVsIH0gPSB0aGlzO1xuICAgIGNvbnRlbnRFbC5hZGRDbGFzcyhcIm1hbS1jb25maXJtLW1vZGFsXCIpO1xuXG4gICAgLy8gSGVhZGVyXG4gICAgY29uc3QgaGVhZGVyID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJtYW0tbW9kYWwtaGVhZGVyXCIgfSk7XG4gICAgaGVhZGVyLmNyZWF0ZUVsKFwiaDJcIiwgeyB0ZXh0OiBgQ29uZmlybSBhbmFseXNpczogJHt0aGlzLmRhdGEuZmlsZU5hbWV9YCB9KTtcbiAgICBoZWFkZXIuY3JlYXRlRWwoXCJwXCIsIHtcbiAgICAgIHRleHQ6IFwiVGFwIG9yIGVkaXQgdmFsdWVzIGJlbG93LiBNYXJrIGNvbmZpcm1lZCBvbmx5IHdoZW4gdGhleSBtYXRjaCB5b3VyIGVhcnMuXCIsXG4gICAgICBjbHM6IFwic2V0dGluZy1pdGVtLWRlc2NyaXB0aW9uXCIsXG4gICAgfSk7XG5cbiAgICBjb25zdCBib2R5ID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJtYW0tbW9kYWwtYm9keVwiIH0pO1xuXG4gICAgLy8gQlBNIHNlY3Rpb25cbiAgICBjb25zdCBicG1TZWN0aW9uID0gYm9keS5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLW1vZGFsLXNlY3Rpb25cIiB9KTtcbiAgICBicG1TZWN0aW9uLmNyZWF0ZUVsKFwiaDNcIiwgeyBjbHM6IFwibWFtLW1vZGFsLXNlY3Rpb24tbGFiZWxcIiwgdGV4dDogXCJUZW1wb1wiIH0pO1xuICAgIHRoaXMuYnBtQ29udHJvbCA9IG5ldyBCcG1Db250cm9sKGJwbVNlY3Rpb24sIHRoaXMuZGF0YS5icG0sIHtcbiAgICAgIG9uQ2hhbmdlOiAoYnBtKSA9PiB7XG4gICAgICAgIC8vIExpdmUgdXBkYXRlIGlmIG5lZWRlZCAoZS5nLiwgc3luYyB3aXRoIG5vdGUgcHJldmlldylcbiAgICAgIH0sXG4gICAgICBvbkNvbmZpcm1lZDogKCkgPT4ge1xuICAgICAgICAvLyBPcHRpb25hbDogYXV0by1lbmFibGUga2V5IGNvbmZpcm0gd2hlbiBib3RoIGFyZSBjbG9zZVxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIEtleSBzZWN0aW9uXG4gICAgY29uc3Qga2V5U2VjdGlvbiA9IGJvZHkuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1tb2RhbC1zZWN0aW9uXCIgfSk7XG4gICAga2V5U2VjdGlvbi5jcmVhdGVFbChcImgzXCIsIHsgY2xzOiBcIm1hbS1tb2RhbC1zZWN0aW9uLWxhYmVsXCIsIHRleHQ6IFwiS2V5XCIgfSk7XG4gICAgdGhpcy5rZXlDb250cm9sID0gbmV3IEtleUNvbnRyb2woa2V5U2VjdGlvbiwgdGhpcy5kYXRhLmtleSwge1xuICAgICAgb25DaGFuZ2U6IChrZXksIHNjYWxlKSA9PiB7XG4gICAgICAgIC8vIExpdmUgdXBkYXRlXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gRm9vdGVyOiBTYXZlIC8gQ2FuY2VsXG4gICAgY29uc3QgZm9vdGVyID0gY29udGVudEVsLmNyZWF0ZURpdih7IGNsczogXCJtYW0tbW9kYWwtZm9vdGVyXCIgfSk7XG5cbiAgICBjb25zdCBidG5TYXZlID0gZm9vdGVyLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcIm1hbS1idG4tc2F2ZSBtb2QtY3RhXCIsIHRleHQ6IFwiU2F2ZVwiIH0pO1xuICAgIGJ0blNhdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGlmICh0aGlzLmJwbUNvbnRyb2wgJiYgdGhpcy5rZXlDb250cm9sKSB7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzLm9uU2F2ZSh7XG4gICAgICAgICAgYnBtOiB0aGlzLmJwbUNvbnRyb2wuZ2V0U3RhdGUoKSxcbiAgICAgICAgICBrZXk6IHRoaXMua2V5Q29udHJvbC5nZXRTdGF0ZSgpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGJ0bkNhbmNlbCA9IGZvb3Rlci5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJtYW0tYnRuLWNhbmNlbFwiLCB0ZXh0OiBcIkNhbmNlbFwiIH0pO1xuICAgIGJ0bkNhbmNlbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5jYWxsYmFja3Mub25DYW5jZWw/LigpO1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgb25DbG9zZSgpIHtcbiAgICBjb25zdCB7IGNvbnRlbnRFbCB9ID0gdGhpcztcbiAgICBjb250ZW50RWwuZW1wdHkoKTtcbiAgfVxufVxuIiwgIi8vIFRhcC10ZW1wbyBjb250cm9sbGVyIFx1MjAxNCBhdmVyYWdlcyB0aGUgbGFzdCBOIGludGVyLXRhcCBpbnRlcnZhbHMuXG4vLyBVc2VkIGJ5IEJQTUNvbnRyb2wgKG1vZGFsICsgZGFzaGJvYXJkKS5cblxuZXhwb3J0IGludGVyZmFjZSBUYXBUZW1wb0NhbGxiYWNrcyB7XG4gIG9uQnBtQ2hhbmdlPzogKGJwbTogbnVtYmVyKSA9PiB2b2lkO1xuICBvblRhcD86ICgpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBUYXBUZW1wb0NvbnRyb2xsZXIge1xuICBwcml2YXRlIHRpbWVzOiBudW1iZXJbXSA9IFtdO1xuICBwcml2YXRlIG1heFRhcHM6IG51bWJlcjtcblxuICBjb25zdHJ1Y3RvcihvcHRzOiB7IG1heFRhcHM/OiBudW1iZXIgfSA9IHt9KSB7XG4gICAgdGhpcy5tYXhUYXBzID0gb3B0cy5tYXhUYXBzID8/IDg7XG4gIH1cblxuICAvKiogQ2FsbCBvbiBldmVyeSB0YXAuIFJldHVybnMgdGhlIGN1cnJlbnQgZXN0aW1hdGVkIEJQTSBvciBudWxsIGlmIG5vdCBlbm91Z2ggZGF0YS4gKi9cbiAgdGFwKCk6IG51bWJlciB8IG51bGwge1xuICAgIGNvbnN0IG5vdyA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgIHRoaXMudGltZXMucHVzaChub3cpO1xuXG4gICAgaWYgKHRoaXMudGltZXMubGVuZ3RoID4gdGhpcy5tYXhUYXBzKSB7XG4gICAgICB0aGlzLnRpbWVzLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGltZXMubGVuZ3RoIDwgMikgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBVc2UgdGhlIGxhc3QgdXAtdG8tKG1heFRhcHMtMSkgaW50ZXJ2YWxzXG4gICAgY29uc3QgaW50ZXJ2YWxzOiBudW1iZXJbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy50aW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgaW50ZXJ2YWxzLnB1c2godGhpcy50aW1lc1tpXSAtIHRoaXMudGltZXNbaSAtIDFdKTtcbiAgICB9XG5cbiAgICBjb25zdCBhdmcgPSBpbnRlcnZhbHMucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCkgLyBpbnRlcnZhbHMubGVuZ3RoO1xuICAgIGlmIChhdmcgPD0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBicG0gPSBNYXRoLnJvdW5kKDYwMDAwIC8gYXZnKTtcbiAgICAvLyBTYW5pdHkgY2xhbXBcbiAgICBpZiAoYnBtIDwgTUlOX1NBTkUgfHwgYnBtID4gTUFYX1NBTkUpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBicG07XG4gIH1cblxuICByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLnRpbWVzID0gW107XG4gIH1cbn1cblxuY29uc3QgTUlOX1NBTkUgPSA2MDtcbmNvbnN0IE1BWF9TQU5FID0gMjAwO1xuIiwgIi8vIEJQTUNvbnRyb2wgXHUyMDE0IHJldXNhYmxlIHRlbXBvIHdpZGdldCBmb3IgbW9kYWwgKyBkYXNoYm9hcmQuXG4vLyBDU1MgY2xhc3MgaG9va3MgKGZvciB0aGVtaW5nIGJ5IHVzZXIpOlxuLy8gIC5icG0tY29udHJvbCAgICAgICAgICBcdTIwMTQgcm9vdCBjb250YWluZXJcbi8vICAuYnBtLXZhbHVlICAgICAgICAgICAgXHUyMDE0IGN1cnJlbnQgZGlzcGxheWVkIEJQTVxuLy8gIC5icG0tcmF3ICAgICAgICAgICAgICBcdTIwMTQgcmF3IGRldGVjdCAoc21hbGwsIG11dGVkKVxuLy8gIC5icG0tYWx0ZXJuYXRlICAgICAgICBcdTIwMTQgaGFsZi9kb3VibGUgYWx0ZXJuYXRlIHZhbHVlXG4vLyAgLmJwbS1idG4taGFsdmUgICAgICAgIFx1MjAxNCBoYWx2ZSBidXR0b25cbi8vICAuYnBtLWJ0bi1kb3VibGUgICAgICAgXHUyMDE0IGRvdWJsZSBidXR0b25cbi8vICAuYnBtLWJ0bi10YXAgICAgICAgICAgXHUyMDE0IHRhcC10ZW1wbyBidXR0b25cbi8vICAuYnBtLWJ0bi10YXAtYWN0aXZlICAgXHUyMDE0IHRhcHBlZCByZWNlbnRseSAoYnJpZWYgZmxhc2gpXG4vLyAgLmJwbS1pbnB1dCAgICAgICAgICAgIFx1MjAxNCBtYW51YWwgQlBNIGlucHV0IChpbmxpbmUgZWRpdClcbi8vICAuYnBtLWNvbmZpcm1lZCAgICAgICAgXHUyMDE0IGNvbmZpcm1lZCBzdGF0ZSBmbGFnXG4vLyAgLmJwbS11bmNvbmZpcm1lZCAgICAgIFx1MjAxNCB1bmNvbmZpcm1lZCBzdGF0ZSBmbGFnXG5cbmltcG9ydCB7IFRhcFRlbXBvQ29udHJvbGxlciB9IGZyb20gXCIuL3RhcC10ZW1wb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJwbUNvbnRyb2xDYWxsYmFja3Mge1xuICBvbkNoYW5nZT86IChicG06IG51bWJlcikgPT4gdm9pZDtcbiAgb25Db25maXJtZWQ/OiAoY29uZmlybWVkOiBib29sZWFuKSA9PiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEJwbUNvbnRyb2xTdGF0ZSB7XG4gIGJwbTogbnVtYmVyO1xuICByYXdCcG06IG51bWJlcjtcbiAgYWx0ZXJuYXRlQnBtPzogbnVtYmVyO1xuICBjb25maXJtZWQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBCcG1Db250cm9sIHtcbiAgcHJpdmF0ZSBjb250YWluZXI6IEhUTUxFbGVtZW50O1xuICBwcml2YXRlIHN0YXRlOiBCcG1Db250cm9sU3RhdGU7XG4gIHByaXZhdGUgY2FsbGJhY2tzOiBCcG1Db250cm9sQ2FsbGJhY2tzO1xuICBwcml2YXRlIHRhcENvbnRyb2xsZXI6IFRhcFRlbXBvQ29udHJvbGxlcjtcbiAgcHJpdmF0ZSB0YXBGbGFzaFRpbWVvdXQ/OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwYXJlbnQ6IEhUTUxFbGVtZW50LFxuICAgIGluaXRpYWw6IEJwbUNvbnRyb2xTdGF0ZSxcbiAgICBjYWxsYmFja3M6IEJwbUNvbnRyb2xDYWxsYmFja3MgPSB7fSxcbiAgKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHsgLi4uaW5pdGlhbCB9O1xuICAgIHRoaXMuY2FsbGJhY2tzID0gY2FsbGJhY2tzO1xuICAgIHRoaXMudGFwQ29udHJvbGxlciA9IG5ldyBUYXBUZW1wb0NvbnRyb2xsZXIoeyBtYXhUYXBzOiA4IH0pO1xuICAgIHRoaXMuY29udGFpbmVyID0gdGhpcy5idWlsZChwYXJlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZChwYXJlbnQ6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IHJvb3QgPSBwYXJlbnQuY3JlYXRlRGl2KHsgY2xzOiBcImJwbS1jb250cm9sXCIgfSk7XG5cbiAgICAvLyBWYWx1ZSByb3c6IGN1cnJlbnQgQlBNICsgcmF3IEJQTVxuICAgIGNvbnN0IHZhbHVlUm93ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwiYnBtLXZhbHVlLXJvd1wiIH0pO1xuICAgIHRoaXMucmVuZGVyVmFsdWUodmFsdWVSb3cpO1xuXG4gICAgLy8gQWx0ZXJuYXRlIHN1Z2dlc3Rpb25cbiAgICBpZiAodGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG0pIHtcbiAgICAgIGNvbnN0IGFsdCA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImJwbS1hbHRlcm5hdGUtcm93XCIgfSk7XG4gICAgICBjb25zdCBhbHRCdG4gPSBhbHQuY3JlYXRlRWwoXCJidXR0b25cIiwge1xuICAgICAgICBjbHM6IFwiYnBtLWFsdGVybmF0ZVwiLFxuICAgICAgICB0ZXh0OiBgb3IgJHt0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbX0/YCxcbiAgICAgIH0pO1xuICAgICAgYWx0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmFjY2VwdEFsdGVybmF0ZSgpKTtcbiAgICB9XG5cbiAgICAvLyBBY3Rpb24gcm93OiBoYWx2ZSB8IGRvdWJsZSB8IHRhcFxuICAgIGNvbnN0IGFjdGlvbnMgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJicG0tYWN0aW9uc1wiIH0pO1xuXG4gICAgY29uc3QgYnRuSGFsdmUgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcImJwbS1idG4taGFsdmVcIiwgdGV4dDogXCJcdTAwQkRcIiB9KTtcbiAgICBidG5IYWx2ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zZXRCcG0oTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmJwbSAvIDIpKSk7XG5cbiAgICBjb25zdCBidG5Eb3VibGUgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcImJwbS1idG4tZG91YmxlXCIsIHRleHQ6IFwiXHUwMEQ3MlwiIH0pO1xuICAgIGJ0bkRvdWJsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5zZXRCcG0odGhpcy5zdGF0ZS5icG0gKiAyKSk7XG5cbiAgICBjb25zdCBidG5UYXAgPSBhY3Rpb25zLmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHsgY2xzOiBcImJwbS1idG4tdGFwXCIsIHRleHQ6IFwiVGFwIHRlbXBvXCIgfSk7XG4gICAgYnRuVGFwLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLm9uVGFwKGJ0blRhcCkpO1xuXG4gICAgLy8gQ29uZmlybSB0b2dnbGVcbiAgICBjb25zdCBjb25maXJtUm93ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwiYnBtLWNvbmZpcm0tcm93XCIgfSk7XG4gICAgY29uc3QgY29uZmlybUNiID0gY29uZmlybVJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgdHlwZTogXCJjaGVja2JveFwiIH0pO1xuICAgIGNvbmZpcm1DYi5jaGVja2VkID0gdGhpcy5zdGF0ZS5jb25maXJtZWQ7XG4gICAgY29uZmlybUNiLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZS5jb25maXJtZWQgPSBjb25maXJtQ2IuY2hlY2tlZDtcbiAgICAgIHRoaXMucmVmcmVzaENvbmZpcm1lZFN0YXRlKHJvb3QpO1xuICAgICAgdGhpcy5jYWxsYmFja3Mub25Db25maXJtZWQ/Lih0aGlzLnN0YXRlLmNvbmZpcm1lZCk7XG4gICAgfSk7XG4gICAgY29uZmlybVJvdy5jcmVhdGVTcGFuKHsgdGV4dDogXCIgVGVtcG8gY29uZmlybWVkXCIgfSk7XG4gICAgdGhpcy5yZWZyZXNoQ29uZmlybWVkU3RhdGUocm9vdCk7XG5cbiAgICByZXR1cm4gcm9vdDtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyVmFsdWUoY29udGFpbmVyOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnRhaW5lci5lbXB0eSgpO1xuICAgIGNvbnN0IGRpc3BsYXkgPSBjb250YWluZXIuY3JlYXRlU3Bhbih7IGNsczogXCJicG0tdmFsdWVcIiwgdGV4dDogU3RyaW5nKHRoaXMuc3RhdGUuYnBtKSB9KTtcbiAgICBkaXNwbGF5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnN0YXJ0SW5saW5lRWRpdChkaXNwbGF5KSk7XG5cbiAgICBjb250YWluZXIuY3JlYXRlU3Bhbih7IGNsczogXCJicG0tcmF3XCIsIHRleHQ6IGAgKHJhdyAke3RoaXMuc3RhdGUucmF3QnBtfSlgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGFydElubGluZUVkaXQoZWw6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgaW5wdXQudHlwZSA9IFwibnVtYmVyXCI7XG4gICAgaW5wdXQudmFsdWUgPSBTdHJpbmcodGhpcy5zdGF0ZS5icG0pO1xuICAgIGlucHV0LmNsYXNzTmFtZSA9IFwiYnBtLWlucHV0XCI7XG4gICAgaW5wdXQubWluID0gXCI0MFwiO1xuICAgIGlucHV0Lm1heCA9IFwiMzAwXCI7XG5cbiAgICBlbC5yZXBsYWNlV2l0aChpbnB1dCk7XG4gICAgaW5wdXQuZm9jdXMoKTtcbiAgICBpbnB1dC5zZWxlY3QoKTtcblxuICAgIGNvbnN0IGNvbW1pdCA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHZhbCA9IHBhcnNlSW50KGlucHV0LnZhbHVlLCAxMCk7XG4gICAgICBpZiAoIWlzTmFOKHZhbCkgJiYgdmFsID49IDQwICYmIHZhbCA8PSAzMDApIHtcbiAgICAgICAgdGhpcy5zZXRCcG0odmFsKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVmcmVzaFZhbHVlKCk7XG4gICAgfTtcblxuICAgIGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIGNvbW1pdCk7XG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gXCJFbnRlclwiKSBjb21taXQoKTtcbiAgICAgIGlmIChlLmtleSA9PT0gXCJFc2NhcGVcIikgdGhpcy5yZWZyZXNoVmFsdWUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaFZhbHVlKCkge1xuICAgIGNvbnN0IHJvdyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuYnBtLXZhbHVlLXJvd1wiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAocm93KSB0aGlzLnJlbmRlclZhbHVlKHJvdyk7XG4gIH1cblxuICBwcml2YXRlIHNldEJwbShicG06IG51bWJlcikge1xuICAgIHRoaXMuc3RhdGUuYnBtID0gYnBtO1xuICAgIC8vIFJlY29tcHV0ZSBhbHRlcm5hdGUgZnJvbSBuZXcgZGlzcGxheWVkIHZhbHVlXG4gICAgY29uc3QgZG91YmxlZCA9IGJwbSAqIDI7XG4gICAgY29uc3QgaGFsdmVkID0gTWF0aC5yb3VuZChicG0gLyAyKTtcbiAgICBpZiAoZG91YmxlZCA8PSAyMDAgJiYgZG91YmxlZCAhPT0gYnBtKSB7XG4gICAgICB0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbSA9IGRvdWJsZWQ7XG4gICAgfSBlbHNlIGlmIChoYWx2ZWQgPj0gNjAgJiYgaGFsdmVkICE9PSBicG0pIHtcbiAgICAgIHRoaXMuc3RhdGUuYWx0ZXJuYXRlQnBtID0gaGFsdmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoVmFsdWUoKTtcbiAgICB0aGlzLnJlZnJlc2hBbHRlcm5hdGUoKTtcbiAgICB0aGlzLmNhbGxiYWNrcy5vbkNoYW5nZT8uKHRoaXMuc3RhdGUuYnBtKTtcbiAgfVxuXG4gIHByaXZhdGUgYWNjZXB0QWx0ZXJuYXRlKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbSkge1xuICAgICAgdGhpcy5zZXRCcG0odGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaEFsdGVybmF0ZSgpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuYnBtLWFsdGVybmF0ZS1yb3dcIik7XG4gICAgaWYgKGV4aXN0aW5nKSBleGlzdGluZy5yZW1vdmUoKTtcblxuICAgIGlmICh0aGlzLnN0YXRlLmFsdGVybmF0ZUJwbSkge1xuICAgICAgY29uc3QgYWN0aW9ucyA9IHRoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCIuYnBtLWFjdGlvbnNcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICBjb25zdCBhbHQgPSB0aGlzLmNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwiYnBtLWFsdGVybmF0ZS1yb3dcIiB9KTtcbiAgICAgIGlmIChhY3Rpb25zKSB0aGlzLmNvbnRhaW5lci5pbnNlcnRCZWZvcmUoYWx0LCBhY3Rpb25zKTtcbiAgICAgIGVsc2UgdGhpcy5jb250YWluZXIuYXBwZW5kQ2hpbGQoYWx0KTtcblxuICAgICAgY29uc3QgYnRuID0gYWx0LmNyZWF0ZUVsKFwiYnV0dG9uXCIsIHtcbiAgICAgICAgY2xzOiBcImJwbS1hbHRlcm5hdGVcIixcbiAgICAgICAgdGV4dDogYG9yICR7dGhpcy5zdGF0ZS5hbHRlcm5hdGVCcG19P2AsXG4gICAgICB9KTtcbiAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5hY2NlcHRBbHRlcm5hdGUoKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvblRhcChidG46IEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgY29uc3QgYnBtID0gdGhpcy50YXBDb250cm9sbGVyLnRhcCgpO1xuXG4gICAgLy8gRmxhc2ggdGhlIGJ1dHRvblxuICAgIGJ0bi5jbGFzc0xpc3QuYWRkKFwiYnBtLWJ0bi10YXAtYWN0aXZlXCIpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnRhcEZsYXNoVGltZW91dCk7XG4gICAgdGhpcy50YXBGbGFzaFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IGJ0bi5jbGFzc0xpc3QucmVtb3ZlKFwiYnBtLWJ0bi10YXAtYWN0aXZlXCIpLCAxNTApO1xuXG4gICAgaWYgKGJwbSAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRCcG0oYnBtKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hDb25maXJtZWRTdGF0ZShyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHJvb3QuY2xhc3NMaXN0LnRvZ2dsZShcImJwbS1jb25maXJtZWRcIiwgdGhpcy5zdGF0ZS5jb25maXJtZWQpO1xuICAgIHJvb3QuY2xhc3NMaXN0LnRvZ2dsZShcImJwbS11bmNvbmZpcm1lZFwiLCAhdGhpcy5zdGF0ZS5jb25maXJtZWQpO1xuICB9XG5cbiAgZ2V0U3RhdGUoKTogQnBtQ29udHJvbFN0YXRlIHtcbiAgICByZXR1cm4geyAuLi50aGlzLnN0YXRlIH07XG4gIH1cblxuICBtb3VudChwYXJlbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluZXIucmVtb3ZlKCk7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGFwRmxhc2hUaW1lb3V0KTtcbiAgfVxufVxuIiwgIi8vIEtleUNvbnRyb2wgXHUyMDE0IHJldXNhYmxlIGtleSB3aWRnZXQgZm9yIG1vZGFsICsgZGFzaGJvYXJkLlxuLy8gQ1NTIGNsYXNzIGhvb2tzIChmb3IgdGhlbWluZyBieSB1c2VyKTpcbi8vICAua2V5LWNvbnRyb2wgICAgICAgICAgICBcdTIwMTQgcm9vdCBjb250YWluZXJcbi8vICAua2V5LXZhbHVlICAgICAgICAgICAgICBcdTIwMTQgY3VycmVudCBkaXNwbGF5ZWQga2V5IChlLmcuIFwiQyMgbWlub3JcIilcbi8vICAua2V5LXJlbGF0aXZlICAgICAgICAgICBcdTIwMTQgcmVsYXRpdmUgbWFqb3IvbWlub3IgZGlzcGxheVxuLy8gIC5rZXktYnRuLXNlbWl0b25lLXVwICAgIFx1MjAxNCArMSBzZW1pdG9uZSBidXR0b25cbi8vICAua2V5LWJ0bi1zZW1pdG9uZS1kb3duICBcdTIwMTQgLTEgc2VtaXRvbmUgYnV0dG9uXG4vLyAgLmtleS1idG4tbW9kZS10b2dnbGUgICAgXHUyMDE0IG1ham9yL21pbm9yIHRvZ2dsZVxuLy8gIC5rZXktYnRuLXJlbGF0aXZlICAgICAgIFx1MjAxNCBqdW1wIHRvIHJlbGF0aXZlIGtleVxuLy8gIC5rZXktY29uZmlybWVkICAgICAgICAgIFx1MjAxNCBjb25maXJtZWQgc3RhdGUgZmxhZ1xuLy8gIC5rZXktdW5jb25maXJtZWQgICAgICAgIFx1MjAxNCB1bmNvbmZpcm1lZCBzdGF0ZSBmbGFnXG5cbmNvbnN0IENIUk9NQVRJQyA9IFtcIkNcIiwgXCJDI1wiLCBcIkRcIiwgXCJEI1wiLCBcIkVcIiwgXCJGXCIsIFwiRiNcIiwgXCJHXCIsIFwiRyNcIiwgXCJBXCIsIFwiQSNcIiwgXCJCXCJdO1xuXG4vLyBNaW5vciBcdTIxOTIgcmVsYXRpdmUgbWFqb3JcbmNvbnN0IFJFTEFUSVZFX01BSk9SOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBBbTogXCJDXCIsIEVtOiBcIkdcIiwgQm06IFwiRFwiLCBcIkYjbVwiOiBcIkFcIiwgXCJDI21cIjogXCJFXCIsXG4gIFwiRyNtXCI6IFwiQlwiLCBcIkQjbVwiOiBcIkYjXCIsIFwiQSNtXCI6IFwiQyNcIiwgRG06IFwiRlwiLFxuICBHbTogXCJCYlwiLCBDbTogXCJFYlwiLCBGbTogXCJBYlwiLFxufTtcblxuLy8gTWFqb3IgXHUyMTkyIHJlbGF0aXZlIG1pbm9yXG5jb25zdCBSRUxBVElWRV9NSU5PUjogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgT2JqZWN0LmVudHJpZXMoUkVMQVRJVkVfTUFKT1IpLm1hcCgoW2ssIHZdKSA9PiBbdiwga10pLFxuKTtcblxuZXhwb3J0IGludGVyZmFjZSBLZXlDb250cm9sQ2FsbGJhY2tzIHtcbiAgb25DaGFuZ2U/OiAoa2V5OiBzdHJpbmcsIHNjYWxlOiBzdHJpbmcpID0+IHZvaWQ7XG4gIG9uQ29uZmlybWVkPzogKGNvbmZpcm1lZDogYm9vbGVhbikgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBLZXlDb250cm9sU3RhdGUge1xuICBrZXk6IHN0cmluZzsgICAgLy8gZS5nLiBcIkMjXCIgKHdpdGhvdXQgbSBzdWZmaXgpXG4gIHNjYWxlOiBzdHJpbmc7ICAvLyBcIm1pbm9yXCIgfCBcIm1ham9yXCJcbiAgcmVsYXRpdmVLZXk/OiBzdHJpbmc7XG4gIGNvbmZpcm1lZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEtleUNvbnRyb2wge1xuICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgc3RhdGU6IEtleUNvbnRyb2xTdGF0ZTtcbiAgcHJpdmF0ZSBjYWxsYmFja3M6IEtleUNvbnRyb2xDYWxsYmFja3M7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcGFyZW50OiBIVE1MRWxlbWVudCxcbiAgICBpbml0aWFsOiBLZXlDb250cm9sU3RhdGUsXG4gICAgY2FsbGJhY2tzOiBLZXlDb250cm9sQ2FsbGJhY2tzID0ge30sXG4gICkge1xuICAgIHRoaXMuc3RhdGUgPSB7IC4uLmluaXRpYWwgfTtcbiAgICB0aGlzLmNhbGxiYWNrcyA9IGNhbGxiYWNrcztcbiAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuYnVpbGQocGFyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGQocGFyZW50OiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCByb290ID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJrZXktY29udHJvbFwiIH0pO1xuXG4gICAgLy8gVmFsdWUgcm93XG4gICAgY29uc3QgdmFsdWVSb3cgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJrZXktdmFsdWUtcm93XCIgfSk7XG4gICAgdGhpcy5yZW5kZXJWYWx1ZSh2YWx1ZVJvdyk7XG5cbiAgICAvLyBSZWxhdGl2ZSBrZXkgaGludFxuICAgIHRoaXMucmVuZGVyUmVsYXRpdmUocm9vdCk7XG5cbiAgICAvLyBBY3Rpb24gcm93OiBcdTI2NkQgfCBcdTI2NkYgfCBtb2RlIHRvZ2dsZSB8IHJlbGF0aXZlXG4gICAgY29uc3QgYWN0aW9ucyA9IHJvb3QuY3JlYXRlRGl2KHsgY2xzOiBcImtleS1hY3Rpb25zXCIgfSk7XG5cbiAgICBjb25zdCBidG5Eb3duID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJrZXktYnRuLXNlbWl0b25lLWRvd25cIiwgdGV4dDogXCJcdTI2NkRcIiB9KTtcbiAgICBidG5Eb3duLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnNoaWZ0U2VtaXRvbmUoLTEpKTtcblxuICAgIGNvbnN0IGJ0blVwID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7IGNsczogXCJrZXktYnRuLXNlbWl0b25lLXVwXCIsIHRleHQ6IFwiXHUyNjZGXCIgfSk7XG4gICAgYnRuVXAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuc2hpZnRTZW1pdG9uZSgxKSk7XG5cbiAgICBjb25zdCBidG5Nb2RlID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7XG4gICAgICBjbHM6IFwia2V5LWJ0bi1tb2RlLXRvZ2dsZVwiLFxuICAgICAgdGV4dDogdGhpcy5zdGF0ZS5zY2FsZSA9PT0gXCJtaW5vclwiID8gXCJtYWpvclwiIDogXCJtaW5vclwiLFxuICAgIH0pO1xuICAgIGJ0bk1vZGUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMudG9nZ2xlTW9kZSgpKTtcblxuICAgIGNvbnN0IGJ0blJlbGF0aXZlID0gYWN0aW9ucy5jcmVhdGVFbChcImJ1dHRvblwiLCB7XG4gICAgICBjbHM6IFwia2V5LWJ0bi1yZWxhdGl2ZVwiLFxuICAgICAgdGV4dDogXCJSZWxhdGl2ZVwiLFxuICAgIH0pO1xuICAgIGJ0blJlbGF0aXZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLmp1bXBUb1JlbGF0aXZlKCkpO1xuXG4gICAgLy8gQ29uZmlybSB0b2dnbGVcbiAgICBjb25zdCBjb25maXJtUm93ID0gcm9vdC5jcmVhdGVEaXYoeyBjbHM6IFwia2V5LWNvbmZpcm0tcm93XCIgfSk7XG4gICAgY29uc3QgY29uZmlybUNiID0gY29uZmlybVJvdy5jcmVhdGVFbChcImlucHV0XCIsIHsgdHlwZTogXCJjaGVja2JveFwiIH0pO1xuICAgIGNvbmZpcm1DYi5jaGVja2VkID0gdGhpcy5zdGF0ZS5jb25maXJtZWQ7XG4gICAgY29uZmlybUNiLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0ZS5jb25maXJtZWQgPSBjb25maXJtQ2IuY2hlY2tlZDtcbiAgICAgIHRoaXMucmVmcmVzaENvbmZpcm1lZFN0YXRlKHJvb3QpO1xuICAgICAgdGhpcy5jYWxsYmFja3Mub25Db25maXJtZWQ/Lih0aGlzLnN0YXRlLmNvbmZpcm1lZCk7XG4gICAgfSk7XG4gICAgY29uZmlybVJvdy5jcmVhdGVTcGFuKHsgdGV4dDogXCIgS2V5IGNvbmZpcm1lZFwiIH0pO1xuICAgIHRoaXMucmVmcmVzaENvbmZpcm1lZFN0YXRlKHJvb3QpO1xuXG4gICAgcmV0dXJuIHJvb3Q7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclZhbHVlKGNvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcbiAgICBjb250YWluZXIuZW1wdHkoKTtcbiAgICBjb25zdCBkaXNwbGF5S2V5ID0gdGhpcy5mb3JtYXRLZXlEaXNwbGF5KHRoaXMuc3RhdGUua2V5LCB0aGlzLnN0YXRlLnNjYWxlKTtcbiAgICBjb25zdCBlbCA9IGNvbnRhaW5lci5jcmVhdGVTcGFuKHsgY2xzOiBcImtleS12YWx1ZVwiLCB0ZXh0OiBkaXNwbGF5S2V5IH0pO1xuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB0aGlzLnN0YXJ0SW5saW5lRWRpdChlbCkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJSZWxhdGl2ZShyb290OiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGV4aXN0aW5nID0gcm9vdC5xdWVyeVNlbGVjdG9yKFwiLmtleS1yZWxhdGl2ZS1yb3dcIik7XG4gICAgaWYgKGV4aXN0aW5nKSBleGlzdGluZy5yZW1vdmUoKTtcblxuICAgIGNvbnN0IHJlbGF0aXZlID0gdGhpcy5jb21wdXRlUmVsYXRpdmUoKTtcbiAgICBpZiAoIXJlbGF0aXZlKSByZXR1cm47XG5cbiAgICBjb25zdCByb3cgPSByb290LmNyZWF0ZURpdih7IGNsczogXCJrZXktcmVsYXRpdmUtcm93XCIgfSk7XG4gICAgLy8gSW5zZXJ0IGJlZm9yZSBhY3Rpb25zXG4gICAgY29uc3QgYWN0aW9ucyA9IHJvb3QucXVlcnlTZWxlY3RvcihcIi5rZXktYWN0aW9uc1wiKTtcbiAgICBpZiAoYWN0aW9ucykgcm9vdC5pbnNlcnRCZWZvcmUocm93LCBhY3Rpb25zKTtcbiAgICBlbHNlIHJvb3QuYXBwZW5kQ2hpbGQocm93KTtcblxuICAgIHJvdy5jcmVhdGVTcGFuKHsgY2xzOiBcImtleS1yZWxhdGl2ZVwiLCB0ZXh0OiBgUmVsYXRpdmU6ICR7cmVsYXRpdmV9YCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZm9ybWF0S2V5RGlzcGxheShrZXk6IHN0cmluZywgc2NhbGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHNjYWxlID09PSBcIm1pbm9yXCIgPyBgJHtrZXl9bWAgOiBrZXk7XG4gIH1cblxuICBwcml2YXRlIHBhcnNlS2V5RGlzcGxheShkaXNwbGF5OiBzdHJpbmcpOiB7IGtleTogc3RyaW5nOyBzY2FsZTogc3RyaW5nIH0ge1xuICAgIGlmIChkaXNwbGF5LmVuZHNXaXRoKFwibVwiKSkge1xuICAgICAgcmV0dXJuIHsga2V5OiBkaXNwbGF5LnNsaWNlKDAsIC0xKSwgc2NhbGU6IFwibWlub3JcIiB9O1xuICAgIH1cbiAgICByZXR1cm4geyBrZXk6IGRpc3BsYXksIHNjYWxlOiBcIm1ham9yXCIgfTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRJbmxpbmVFZGl0KGVsOiBIVE1MRWxlbWVudCkge1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIGlucHV0LnZhbHVlID0gdGhpcy5mb3JtYXRLZXlEaXNwbGF5KHRoaXMuc3RhdGUua2V5LCB0aGlzLnN0YXRlLnNjYWxlKTtcbiAgICBpbnB1dC5jbGFzc05hbWUgPSBcImtleS1pbnB1dFwiO1xuXG4gICAgZWwucmVwbGFjZVdpdGgoaW5wdXQpO1xuICAgIGlucHV0LmZvY3VzKCk7XG4gICAgaW5wdXQuc2VsZWN0KCk7XG5cbiAgICBjb25zdCBjb21taXQgPSAoKSA9PiB7XG4gICAgICBjb25zdCBwYXJzZWQgPSB0aGlzLnBhcnNlS2V5RGlzcGxheShpbnB1dC52YWx1ZS50cmltKCkpO1xuICAgICAgaWYgKENIUk9NQVRJQy5pbmNsdWRlcyhwYXJzZWQua2V5KSkge1xuICAgICAgICB0aGlzLnN0YXRlLmtleSA9IHBhcnNlZC5rZXk7XG4gICAgICAgIHRoaXMuc3RhdGUuc2NhbGUgPSBwYXJzZWQuc2NhbGU7XG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xuICAgICAgICB0aGlzLmNhbGxiYWNrcy5vbkNoYW5nZT8uKHRoaXMuc3RhdGUua2V5LCB0aGlzLnN0YXRlLnNjYWxlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgY29tbWl0KTtcbiAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgY29tbWl0KCk7XG4gICAgICAgIGlucHV0LmJsdXIoKTtcbiAgICAgIH1cbiAgICAgIGlmIChlLmtleSA9PT0gXCJFc2NhcGVcIikgdGhpcy5yZWZyZXNoKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNoaWZ0U2VtaXRvbmUoZGVsdGE6IG51bWJlcikge1xuICAgIGNvbnN0IGlkeCA9IENIUk9NQVRJQy5pbmRleE9mKHRoaXMuc3RhdGUua2V5KTtcbiAgICBpZiAoaWR4ID09PSAtMSkgcmV0dXJuO1xuICAgIGNvbnN0IG5ld0lkeCA9IChpZHggKyBkZWx0YSArIDEyKSAlIDEyO1xuICAgIHRoaXMuc3RhdGUua2V5ID0gQ0hST01BVElDW25ld0lkeF07XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgdGhpcy5jYWxsYmFja3Mub25DaGFuZ2U/Lih0aGlzLnN0YXRlLmtleSwgdGhpcy5zdGF0ZS5zY2FsZSk7XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZU1vZGUoKSB7XG4gICAgdGhpcy5zdGF0ZS5zY2FsZSA9IHRoaXMuc3RhdGUuc2NhbGUgPT09IFwibWlub3JcIiA/IFwibWFqb3JcIiA6IFwibWlub3JcIjtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgICB0aGlzLmNhbGxiYWNrcy5vbkNoYW5nZT8uKHRoaXMuc3RhdGUua2V5LCB0aGlzLnN0YXRlLnNjYWxlKTtcbiAgfVxuXG4gIHByaXZhdGUganVtcFRvUmVsYXRpdmUoKSB7XG4gICAgY29uc3QgcmVsYXRpdmUgPSB0aGlzLmNvbXB1dGVSZWxhdGl2ZSh0cnVlKTtcbiAgICBpZiAocmVsYXRpdmUpIHtcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHRoaXMucGFyc2VLZXlEaXNwbGF5KHJlbGF0aXZlKTtcbiAgICAgIHRoaXMuc3RhdGUua2V5ID0gcGFyc2VkLmtleTtcbiAgICAgIHRoaXMuc3RhdGUuc2NhbGUgPSBwYXJzZWQuc2NhbGU7XG4gICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLm9uQ2hhbmdlPy4odGhpcy5zdGF0ZS5rZXksIHRoaXMuc3RhdGUuc2NhbGUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29tcHV0ZVJlbGF0aXZlKGZvckp1bXAgPSBmYWxzZSk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgZGlzcGxheSA9IHRoaXMuZm9ybWF0S2V5RGlzcGxheSh0aGlzLnN0YXRlLmtleSwgdGhpcy5zdGF0ZS5zY2FsZSk7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2NhbGUgPT09IFwibWlub3JcIikge1xuICAgICAgY29uc3QgcmVsID0gUkVMQVRJVkVfTUFKT1JbZGlzcGxheV07XG4gICAgICByZXR1cm4gcmVsIHx8IHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcmVsID0gUkVMQVRJVkVfTUlOT1JbZGlzcGxheV07XG4gICAgICByZXR1cm4gcmVsIHx8IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2goKSB7XG4gICAgY29uc3QgdmFsUm93ID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5rZXktdmFsdWUtcm93XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGlmICh2YWxSb3cpIHRoaXMucmVuZGVyVmFsdWUodmFsUm93KTtcbiAgICB0aGlzLnJlbmRlclJlbGF0aXZlKHRoaXMuY29udGFpbmVyKTtcblxuICAgIGNvbnN0IG1vZGVCdG4gPSB0aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLmtleS1idG4tbW9kZS10b2dnbGVcIikgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKG1vZGVCdG4pIG1vZGVCdG4udGV4dENvbnRlbnQgPSB0aGlzLnN0YXRlLnNjYWxlID09PSBcIm1pbm9yXCIgPyBcIm1ham9yXCIgOiBcIm1pbm9yXCI7XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hDb25maXJtZWRTdGF0ZShyb290OiBIVE1MRWxlbWVudCkge1xuICAgIHJvb3QuY2xhc3NMaXN0LnRvZ2dsZShcImtleS1jb25maXJtZWRcIiwgdGhpcy5zdGF0ZS5jb25maXJtZWQpO1xuICAgIHJvb3QuY2xhc3NMaXN0LnRvZ2dsZShcImtleS11bmNvbmZpcm1lZFwiLCAhdGhpcy5zdGF0ZS5jb25maXJtZWQpO1xuICB9XG5cbiAgZ2V0U3RhdGUoKTogS2V5Q29udHJvbFN0YXRlIHtcbiAgICByZXR1cm4geyAuLi50aGlzLnN0YXRlIH07XG4gIH1cblxuICBtb3VudChwYXJlbnQ6IEhUTUxFbGVtZW50KTogdm9pZCB7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgfVxuXG4gIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluZXIucmVtb3ZlKCk7XG4gIH1cbn1cbiIsICIvLyBTdHJ1Y3R1cmVUaW1lbGluZSBcdTIwMTQgbWFudWFsIHNlZ21lbnQgYmFycyB3aXRoIGhvdmVyIHRvb2x0aXAgYW5kIG9mZnNldCBzbGlkZXIuXG4vL1xuLy8gQ1NTIGNsYXNzIGhvb2tzIChmb3IgdGhlbWluZyBieSB1c2VyKTpcbi8vICAubWFtLXRpbWVsaW5lICAgICAgICAgICAgICBcdTIwMTQgcm9vdCBjb250YWluZXJcbi8vICAubWFtLXRpbWVsaW5lLXRyYWNrICAgICAgICBcdTIwMTQgaG9yaXpvbnRhbCBiYXIgdHJhY2tcbi8vICAubWFtLXRpbWVsaW5lLXNlZ21lbnQgICAgICBcdTIwMTQgaW5kaXZpZHVhbCBjb2xvcmVkIGJhclxuLy8gIC5tYW0tdGltZWxpbmUtc2VnbWVudC1sYWJlbFxuLy8gIC5tYW0tdGltZWxpbmUtb2Zmc2V0LXJvdyAgIFx1MjAxNCBzbGlkZXIgKyBsYWJlbCB3cmFwcGVyXG4vLyAgLm1hbS10aW1lbGluZS1vZmZzZXQtbGFiZWxcbi8vICAubWFtLXRpbWVsaW5lLXNsaWRlciAgICAgICBcdTIwMTQgSFRNTCByYW5nZSBpbnB1dFxuLy8gIC5tYW0tdGltZWxpbmUtdG9vbHRpcCAgICAgIFx1MjAxNCBmbG9hdGluZyBob3ZlciB0b29sdGlwIChhYnMgcG9zaXRpb25lZClcbi8vICAubWFtLXRpbWVsaW5lLWVtcHR5ICAgICAgICBcdTIwMTQgbm8tc2VnbWVudHMgc3RhdGVcblxuZXhwb3J0IGludGVyZmFjZSBTdHJ1Y3R1cmVTZWdtZW50IHtcbiAgaWQ6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgc3RhcnRCYXI6IG51bWJlcjtcbiAgZW5kQmFyOiBudW1iZXI7XG4gIGNvbG9yOiBzdHJpbmc7IC8vIENTUyBjb2xvciB2YWx1ZSAoT2JzaWRpYW4gdmFyIG9yIGxpdGVyYWwpXG59XG5cbmV4cG9ydCBjbGFzcyBTdHJ1Y3R1cmVUaW1lbGluZSB7XG4gIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBzZWdtZW50czogU3RydWN0dXJlU2VnbWVudFtdO1xuICBwcml2YXRlIGJwbTogbnVtYmVyO1xuICBwcml2YXRlIG9mZnNldEJhcnM6IG51bWJlcjtcbiAgcHJpdmF0ZSB0cmFja0VsOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHRvb2x0aXBFbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICBvbk9mZnNldENoYW5nZT86IChvZmZzZXRCYXJzOiBudW1iZXIpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcGFyZW50OiBIVE1MRWxlbWVudCxcbiAgICBzZWdtZW50czogU3RydWN0dXJlU2VnbWVudFtdLFxuICAgIGJwbTogbnVtYmVyLFxuICAgIG9mZnNldEJhcnMgPSAwLFxuICApIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IHBhcmVudC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLXRpbWVsaW5lXCIgfSk7XG4gICAgdGhpcy5zZWdtZW50cyA9IHNlZ21lbnRzO1xuICAgIHRoaXMuYnBtID0gYnBtO1xuICAgIHRoaXMub2Zmc2V0QmFycyA9IG9mZnNldEJhcnM7XG4gIH1cblxuICBtb3VudCgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lci5lbXB0eSgpO1xuXG4gICAgaWYgKHRoaXMuc2VnbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5jcmVhdGVEaXYoe1xuICAgICAgICBjbHM6IFwibWFtLXRpbWVsaW5lLWVtcHR5XCIsXG4gICAgICAgIHRleHQ6IFwiTm8gc3RydWN0dXJlIGRlZmluZWQuIEFkZCBzZWdtZW50cyB0byBmcm9udG1hdHRlcjogc3RydWN0dXJlOiBbLi4uXVwiLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmJ1aWxkT2Zmc2V0Um93KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ29tcHV0ZSB0b3RhbCBzcGFuIChhY2NvdW50aW5nIGZvciBvZmZzZXQgbGVhZC1pbilcbiAgICBjb25zdCB0b3RhbEJhcnMgPSBNYXRoLm1heCguLi50aGlzLnNlZ21lbnRzLm1hcCgocykgPT4gcy5lbmRCYXIpKTtcbiAgICBjb25zdCBlZmZlY3RpdmVUb3RhbCA9IHRvdGFsQmFycyArIHRoaXMub2Zmc2V0QmFycztcblxuICAgIC8vIFRyYWNrIGNvbnRhaW5lclxuICAgIHRoaXMudHJhY2tFbCA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tdGltZWxpbmUtdHJhY2tcIiB9KTtcblxuICAgIC8vIFJlbmRlciBlYWNoIHNlZ21lbnQgYXMgYW4gYWJzb2x1dGVseS1wb3NpdGlvbmVkIHByb3BvcnRpb25hbCBiYXJcbiAgICB0aGlzLnNlZ21lbnRzLmZvckVhY2goKHNlZykgPT4ge1xuICAgICAgY29uc3QgbGVmdFBjdCA9ICgoc2VnLnN0YXJ0QmFyICsgdGhpcy5vZmZzZXRCYXJzKSAvIGVmZmVjdGl2ZVRvdGFsKSAqIDEwMDtcbiAgICAgIGNvbnN0IHdpZHRoUGN0ID0gKChzZWcuZW5kQmFyIC0gc2VnLnN0YXJ0QmFyKSAvIGVmZmVjdGl2ZVRvdGFsKSAqIDEwMDtcblxuICAgICAgY29uc3QgYmFyID0gdGhpcy50cmFja0VsIS5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLXRpbWVsaW5lLXNlZ21lbnRcIiB9KTtcbiAgICAgIGJhci5zdHlsZS5sZWZ0ID0gYCR7bGVmdFBjdH0lYDtcbiAgICAgIGJhci5zdHlsZS53aWR0aCA9IGAke3dpZHRoUGN0fSVgO1xuICAgICAgYmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHNlZy5jb2xvcjtcbiAgICAgIGJhci5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tbWFtLXNlZ21lbnQtY29sb3JcIiwgc2VnLmNvbG9yKTtcblxuICAgICAgYmFyLmNyZWF0ZVNwYW4oe1xuICAgICAgICBjbHM6IFwibWFtLXRpbWVsaW5lLXNlZ21lbnQtbGFiZWxcIixcbiAgICAgICAgdGV4dDogc2VnLmxhYmVsLFxuICAgICAgfSk7XG5cbiAgICAgIGJhci5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB0aGlzLnNob3dUb29sdGlwKHNlZywgYmFyKSk7XG4gICAgICBiYXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbGVhdmVcIiwgKCkgPT4gdGhpcy5oaWRlVG9vbHRpcCgpKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYnVpbGRPZmZzZXRSb3coKTtcbiAgfVxuXG4gIHByaXZhdGUgYnVpbGRPZmZzZXRSb3coKTogdm9pZCB7XG4gICAgY29uc3Qgcm93ID0gdGhpcy5jb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS10aW1lbGluZS1vZmZzZXQtcm93XCIgfSk7XG4gICAgcm93LmNyZWF0ZVNwYW4oe1xuICAgICAgY2xzOiBcIm1hbS10aW1lbGluZS1vZmZzZXQtbGFiZWxcIixcbiAgICAgIHRleHQ6IGBUcmltIGxlYWQtaW46ICR7dGhpcy5vZmZzZXRCYXJzfSBiYXIke3RoaXMub2Zmc2V0QmFycyA9PT0gMSA/IFwiXCIgOiBcInNcIn1gLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2xpZGVyID0gcm93LmNyZWF0ZUVsKFwiaW5wdXRcIiwgeyB0eXBlOiBcInJhbmdlXCIgfSk7XG4gICAgc2xpZGVyLmNsYXNzTmFtZSA9IFwibWFtLXRpbWVsaW5lLXNsaWRlclwiO1xuICAgIHNsaWRlci5taW4gPSBcIjBcIjtcbiAgICBzbGlkZXIubWF4ID0gU3RyaW5nKE1hdGguY2VpbCh0aGlzLm9mZnNldEJhcnMgKyA0KSk7XG4gICAgc2xpZGVyLnZhbHVlID0gU3RyaW5nKHRoaXMub2Zmc2V0QmFycyk7XG4gICAgc2xpZGVyLnN0ZXAgPSBcIjFcIjtcblxuICAgIHNsaWRlci5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKCkgPT4ge1xuICAgICAgY29uc3QgdmFsID0gcGFyc2VJbnQoc2xpZGVyLnZhbHVlLCAxMCk7XG4gICAgICB0aGlzLm9mZnNldEJhcnMgPSB2YWw7XG4gICAgICAvLyBVcGRhdGUgbGFiZWxcbiAgICAgIGNvbnN0IGxhYmVsID0gcm93LnF1ZXJ5U2VsZWN0b3IoXCIubWFtLXRpbWVsaW5lLW9mZnNldC1sYWJlbFwiKTtcbiAgICAgIGlmIChsYWJlbCkge1xuICAgICAgICBsYWJlbC50ZXh0Q29udGVudCA9IGBUcmltIGxlYWQtaW46ICR7dmFsfSBiYXIke3ZhbCA9PT0gMSA/IFwiXCIgOiBcInNcIn1gO1xuICAgICAgfVxuICAgICAgdGhpcy5vbk9mZnNldENoYW5nZT8uKHZhbCk7XG4gICAgICAvLyBSZS1yZW5kZXIgd2l0aCBuZXcgb2Zmc2V0XG4gICAgICB0aGlzLm1vdW50KCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNob3dUb29sdGlwKHNlZzogU3RydWN0dXJlU2VnbWVudCwgYW5jaG9yOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy50cmFja0VsKSByZXR1cm47XG5cbiAgICB0aGlzLnRvb2x0aXBFbCA9IHRoaXMudHJhY2tFbC5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLXRpbWVsaW5lLXRvb2x0aXBcIiB9KTtcbiAgICBjb25zdCBiZWF0TGVuID0gNjAgLyB0aGlzLmJwbTtcbiAgICBjb25zdCBzdGFydFRpbWUgPSBzZWcuc3RhcnRCYXIgKiA0ICogYmVhdExlbjtcbiAgICBjb25zdCBzdGFydFN0ciA9IHRoaXMuZm9ybWF0VGltZShzdGFydFRpbWUpO1xuICAgIGNvbnN0IGVuZFRpbWUgPSBzZWcuZW5kQmFyICogNCAqIGJlYXRMZW47XG4gICAgY29uc3QgZW5kU3RyID0gdGhpcy5mb3JtYXRUaW1lKGVuZFRpbWUpO1xuXG4gICAgdGhpcy50b29sdGlwRWwuaW5uZXJIVE1MID0gYFxuICAgICAgPHN0cm9uZz4ke3NlZy5sYWJlbH08L3N0cm9uZz48YnIvPlxuICAgICAgQmFycyAke3NlZy5zdGFydEJhcn0gXFx1MjAxMyAke3NlZy5lbmRCYXJ9PGJyLz5cbiAgICAgICR7c3RhcnRTdHJ9IFxcdTIwMTMgJHtlbmRTdHJ9XG4gICAgYDtcblxuICAgIC8vIFBvc2l0aW9uIHRvb2x0aXAgYWJvdmUgdGhlIGhvdmVyZWQgYmFyLCBjZW50ZXJlZFxuICAgIGNvbnN0IHRyYWNrUmVjdCA9IHRoaXMudHJhY2tFbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBiYXJSZWN0ID0gYW5jaG9yLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGxlZnQgPSBiYXJSZWN0LmxlZnQgLSB0cmFja1JlY3QubGVmdCArIGJhclJlY3Qud2lkdGggLyAyIC0gNjA7XG4gICAgY29uc3QgdG9wID0gLTQwO1xuICAgIHRoaXMudG9vbHRpcEVsLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcbiAgICB0aGlzLnRvb2x0aXBFbC5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xuICB9XG5cbiAgcHJpdmF0ZSBoaWRlVG9vbHRpcCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50b29sdGlwRWwpIHtcbiAgICAgIHRoaXMudG9vbHRpcEVsLnJlbW92ZSgpO1xuICAgICAgdGhpcy50b29sdGlwRWwgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZm9ybWF0VGltZShzZWM6IG51bWJlcik6IHN0cmluZyB7XG4gICAgY29uc3QgbSA9IE1hdGguZmxvb3Ioc2VjIC8gNjApO1xuICAgIGNvbnN0IHMgPSBNYXRoLmZsb29yKHNlYyAlIDYwKTtcbiAgICBjb25zdCBtcyA9IE1hdGguZmxvb3IoKHNlYyAlIDEpICogMTAwKTtcbiAgICByZXR1cm4gYCR7bX06JHtzLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpfS4ke21zLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgXCIwXCIpfWA7XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xuICB9XG59XG4iLCAiLy8gVHVuZXJOZWVkbGUgXHUyMDE0IGtleS1wb3NpdGlvbiBnYXVnZS4gU3R5bGVkIGJ5IGNvbmZpcm1lZCBzdGF0ZSwgTk9UIGNvbmZpZGVuY2UuXG4vL1xuLy8gQ1NTIGNsYXNzIGhvb2tzIChmb3IgdGhlbWluZyBieSB1c2VyKTpcbi8vICAubWFtLXR1bmVyICAgICAgICAgICAgIFx1MjAxNCByb290IGNvbnRhaW5lclxuLy8gIC5tYW0tdHVuZXItZGlhbCAgICAgICAgXHUyMDE0IGNpcmN1bGFyIGJhY2tncm91bmRcbi8vICAubWFtLXR1bmVyLXRpY2sgICAgICAgIFx1MjAxNCBtYWpvci9taW5vciBwb3NpdGlvbiBtYXJrc1xuLy8gIC5tYW0tdHVuZXItbmVlZGxlICAgICAgXHUyMDE0IGFuaW1hdGVkIHBvaW50ZXJcbi8vICAubWFtLXR1bmVyLW5lZWRsZS1jb25maXJtZWQgICBcdTIwMTQgY29uZmlybWVkIHN0eWxlXG4vLyAgLm1hbS10dW5lci1uZWVkbGUtdW5jb25maXJtZWQgXHUyMDE0IHVuY29uZmlybWVkIHN0eWxlXG4vLyAgLm1hbS10dW5lci1sYWJlbCAgICAgICBcdTIwMTQga2V5IGRpc3BsYXkgYmVsb3cgZGlhbFxuLy8gIC5tYW0tdHVuZXItbGFiZWwtY29uZmlybWVkXG4vLyAgLm1hbS10dW5lci1sYWJlbC11bmNvbmZpcm1lZFxuXG5jb25zdCBDSFJPTUFUSUNfT1JERVIgPSBbXG4gIFwiQ1wiLCBcIkMjXCIsIFwiRFwiLCBcIkQjXCIsIFwiRVwiLCBcIkZcIiwgXCJGI1wiLCBcIkdcIiwgXCJHI1wiLCBcIkFcIiwgXCJBI1wiLCBcIkJcIixcbl07XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHVuZXJOZWVkbGVTdGF0ZSB7XG4gIGtleTogc3RyaW5nOyAgICAgIC8vIGUuZy4gXCJDI1wiXG4gIHNjYWxlOiBzdHJpbmc7ICAgIC8vIFwibWlub3JcIiB8IFwibWFqb3JcIlxuICBjb25maXJtZWQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBUdW5lck5lZWRsZSB7XG4gIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBzdGF0ZTogVHVuZXJOZWVkbGVTdGF0ZTtcbiAgcHJpdmF0ZSBuZWVkbGVFbDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IEhUTUxFbGVtZW50LCBpbml0aWFsOiBUdW5lck5lZWRsZVN0YXRlKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHsgLi4uaW5pdGlhbCB9O1xuICAgIHRoaXMuY29udGFpbmVyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJtYW0tdHVuZXJcIiB9KTtcbiAgfVxuXG4gIG1vdW50KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLmVtcHR5KCk7XG5cbiAgICBjb25zdCBkaWFsID0gdGhpcy5jb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS10dW5lci1kaWFsXCIgfSk7XG5cbiAgICAvLyBSZW5kZXIgcG9zaXRpb24gdGlja3MgZm9yIGVhY2ggY2hyb21hdGljIG5vdGVcbiAgICBDSFJPTUFUSUNfT1JERVIuZm9yRWFjaCgobm90ZSwgaSkgPT4ge1xuICAgICAgY29uc3QgYW5nbGUgPSAoaSAvIDEyKSAqIDM2MDtcbiAgICAgIGNvbnN0IHRpY2sgPSBkaWFsLmNyZWF0ZURpdih7IGNsczogXCJtYW0tdHVuZXItdGlja1wiIH0pO1xuICAgICAgLy8gQ1NTIHRyYW5zZm9ybSBoYW5kbGVzIHBvc2l0aW9uaW5nIHZpYSB0cmFuc2Zvcm06IHJvdGF0ZShhbmdsZSkgdHJhbnNsYXRlWShyYWRpdXMpXG4gICAgICB0aWNrLnNldEF0dHJpYnV0ZShcImRhdGEtbm90ZVwiLCBub3RlKTtcbiAgICAgIHRpY2suc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZSgke2FuZ2xlfWRlZykgdHJhbnNsYXRlWSgtNDVweClgO1xuICAgIH0pO1xuXG4gICAgLy8gTmVlZGxlXG4gICAgdGhpcy5uZWVkbGVFbCA9IGRpYWwuY3JlYXRlRGl2KHtcbiAgICAgIGNsczogYG1hbS10dW5lci1uZWVkbGUgJHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb25maXJtZWRcbiAgICAgICAgICA/IFwibWFtLXR1bmVyLW5lZWRsZS1jb25maXJtZWRcIlxuICAgICAgICAgIDogXCJtYW0tdHVuZXItbmVlZGxlLXVuY29uZmlybWVkXCJcbiAgICAgIH1gLFxuICAgIH0pO1xuICAgIHRoaXMuc2V0TmVlZGxlQW5nbGUodGhpcy5zdGF0ZS5rZXkpO1xuXG4gICAgLy8gTGFiZWxcbiAgICBjb25zdCBsYWJlbCA9IHRoaXMuY29udGFpbmVyLmNyZWF0ZURpdih7XG4gICAgICBjbHM6IGBtYW0tdHVuZXItbGFiZWwgJHtcbiAgICAgICAgdGhpcy5zdGF0ZS5jb25maXJtZWRcbiAgICAgICAgICA/IFwibWFtLXR1bmVyLWxhYmVsLWNvbmZpcm1lZFwiXG4gICAgICAgICAgOiBcIm1hbS10dW5lci1sYWJlbC11bmNvbmZpcm1lZFwiXG4gICAgICB9YCxcbiAgICAgIHRleHQ6IHRoaXMuZm9ybWF0S2V5RGlzcGxheSgpLFxuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlKHN0YXRlOiBUdW5lck5lZWRsZVN0YXRlKTogdm9pZCB7XG4gICAgdGhpcy5zdGF0ZSA9IHsgLi4uc3RhdGUgfTtcbiAgICB0aGlzLnNldE5lZWRsZUFuZ2xlKHRoaXMuc3RhdGUua2V5KTtcbiAgICBpZiAodGhpcy5uZWVkbGVFbCkge1xuICAgICAgdGhpcy5uZWVkbGVFbC5jbGFzc05hbWUgPSBgbWFtLXR1bmVyLW5lZWRsZSAke1xuICAgICAgICB0aGlzLnN0YXRlLmNvbmZpcm1lZFxuICAgICAgICAgID8gXCJtYW0tdHVuZXItbmVlZGxlLWNvbmZpcm1lZFwiXG4gICAgICAgICAgOiBcIm1hbS10dW5lci1uZWVkbGUtdW5jb25maXJtZWRcIlxuICAgICAgfWA7XG4gICAgfVxuICAgIGNvbnN0IGxhYmVsID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcihcIi5tYW0tdHVuZXItbGFiZWxcIik7XG4gICAgaWYgKGxhYmVsKSB7XG4gICAgICBsYWJlbC5jbGFzc05hbWUgPSBgbWFtLXR1bmVyLWxhYmVsICR7XG4gICAgICAgIHRoaXMuc3RhdGUuY29uZmlybWVkXG4gICAgICAgICAgPyBcIm1hbS10dW5lci1sYWJlbC1jb25maXJtZWRcIlxuICAgICAgICAgIDogXCJtYW0tdHVuZXItbGFiZWwtdW5jb25maXJtZWRcIlxuICAgICAgfWA7XG4gICAgICBsYWJlbC50ZXh0Q29udGVudCA9IHRoaXMuZm9ybWF0S2V5RGlzcGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0TmVlZGxlQW5nbGUoa2V5OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBpZHggPSBDSFJPTUFUSUNfT1JERVIuaW5kZXhPZihrZXkpO1xuICAgIGlmIChpZHggPT09IC0xKSByZXR1cm47XG4gICAgY29uc3QgYW5nbGUgPSAoaWR4IC8gMTIpICogMzYwO1xuICAgIGlmICh0aGlzLm5lZWRsZUVsKSB7XG4gICAgICB0aGlzLm5lZWRsZUVsLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGUoJHthbmdsZX1kZWcpYDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZvcm1hdEtleURpc3BsYXkoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5zY2FsZSA9PT0gXCJtaW5vclwiXG4gICAgICA/IGAke3RoaXMuc3RhdGUua2V5fW1gXG4gICAgICA6IHRoaXMuc3RhdGUua2V5O1xuICB9XG5cbiAgZGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcbiAgfVxufVxuIiwgIi8vIENhbWVsb3RXaGVlbCBcdTIwMTQgaW50ZXJhY3RpdmUgaGFybW9uaWMtbWl4aW5nIGd1aWRlLlxuLy8gQ2xpY2sgYW55IGtleSBcdTIxOTIgY2xpcGJvYXJkIGdldHMgYSBEYXRhdmlldyBxdWVyeSBmb3IgdGhhdCBrZXkuXG4vL1xuLy8gQ1NTIGNsYXNzIGhvb2tzIChmb3IgdGhlbWluZyBieSB1c2VyKTpcbi8vICAubWFtLWNhbWVsb3QgICAgICAgICAgICAgIFx1MjAxNCByb290IGNvbnRhaW5lclxuLy8gIC5tYW0tY2FtZWxvdC13aGVlbCAgICAgICAgXHUyMDE0IHNlbGYtY29udGFpbmVkIFNWR1xuLy8gIC5tYW0tY2FtZWxvdC1pbm5lciAgICAgICAgXHUyMDE0IGlubmVyIHJpbmcgKG1pbm9yKVxuLy8gIC5tYW0tY2FtZWxvdC1rZXkgICAgICAgICAgXHUyMDE0IGV2ZXJ5IGtleSBzbG90IChncm91cCBlbGVtZW50KVxuLy8gIC5tYW0tY2FtZWxvdC1rZXktbWFqb3IgICAgXHUyMDE0IG91dGVyLXJpbmcga2V5c1xuLy8gIC5tYW0tY2FtZWxvdC1rZXktbWlub3IgICAgXHUyMDE0IGlubmVyLXJpbmcga2V5c1xuLy8gIC5tYW0tY2FtZWxvdC1jdXJyZW50ICAgICAgXHUyMDE0IHRoZSBjdXJyZW50bHkgZGV0ZWN0ZWQvY29uZmlybWVkIGtleVxuLy8gIC5tYW0tY2FtZWxvdC1jb21wYXRpYmxlICAgXHUyMDE0IGhhcm1vbmljYWxseSBjb21wYXRpYmxlIG5laWdoYm9yc1xuLy8gIC5tYW0tY2FtZWxvdC1sYWJlbCAgICAgICAgXHUyMDE0IHRleHQgaW5zaWRlIGVhY2ggc2xvdFxuLy8gIC5tYW0tY2FtZWxvdC1sZWdlbmQgICAgICAgXHUyMDE0IGJvdHRvbSBsZWdlbmQgbGluZVxuXG5leHBvcnQgdHlwZSBDYW1lbG90S2V5ID0gc3RyaW5nOyAvLyBlLmcuIFwiMUFcIiwgXCI4QlwiXG5cbmNvbnN0IE1BSk9SX0tFWVM6IENhbWVsb3RLZXlbXSA9IFtcbiAgXCIxQlwiLCBcIjJCXCIsIFwiM0JcIiwgXCI0QlwiLCBcIjVCXCIsIFwiNkJcIiwgXCI3QlwiLCBcIjhCXCIsIFwiOUJcIiwgXCIxMEJcIiwgXCIxMUJcIiwgXCIxMkJcIixcbl07XG5jb25zdCBNSU5PUl9LRVlTOiBDYW1lbG90S2V5W10gPSBbXG4gIFwiMUFcIiwgXCIyQVwiLCBcIjNBXCIsIFwiNEFcIiwgXCI1QVwiLCBcIjZBXCIsIFwiN0FcIiwgXCI4QVwiLCBcIjlBXCIsIFwiMTBBXCIsIFwiMTFBXCIsIFwiMTJBXCIsXG5dO1xuXG5jb25zdCBTSEFSUF9UT19OQU1FOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBDOiBcIkNcIiwgXCJDI1wiOiBcIkNzaGFycFwiLCBEYjogXCJEYlwiLFxuICBEOiBcIkRcIiwgXCJEI1wiOiBcIkRzaGFycFwiLCBFYjogXCJFYlwiLFxuICBFOiBcIkVcIiwgRjogXCJGXCIsIFwiRiNcIjogXCJGc2hhcnBcIiwgR2I6IFwiR2JcIixcbiAgRzogXCJHXCIsIFwiRyNcIjogXCJHc2hhcnBcIiwgQWI6IFwiQWJcIixcbiAgQTogXCJBXCIsIFwiQSNcIjogXCJBc2hhcnBcIiwgQmI6IFwiQmJcIixcbiAgQjogXCJCXCIsXG59O1xuXG4vKiogTWFwIGEgc3RhbmRhcmQga2V5IG5hbWUgdG8gQ2FtZWxvdCBub3RhdGlvbi5cbiAqICBJbnB1dCBrZXkgY2FuIGhhdmUgYSB0cmFpbGluZyBcIm1cIiBmb3IgbWlub3IgKGUuZy4gXCJDI21cIikuXG4gKiAgQmFyZSBrZXkgbmFtZXMgbXVzdCBtYXRjaCBleGFjdGx5IChzaGFycHMgd2l0aCAjLCBmbGF0cyB3aXRoIGIgc3VmZml4KS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGtleU5hbWVUb0NhbWVsb3Qoa2V5OiBzdHJpbmcsIHNjYWxlOiBzdHJpbmcpOiBDYW1lbG90S2V5IHwgdW5kZWZpbmVkIHtcbiAgLy8gU3RyaXAgdHJhaWxpbmcgXCJtXCIgKG1pbm9yIG1hcmtlcikgb25seTsgZG8gTk9UIHN0cmlwIHRyYWlsaW5nIFwiYlwiIChmbGF0IHNpZ24pLlxuICBjb25zdCByYXcgPSBrZXkuZW5kc1dpdGgoXCJtXCIpICYmIGtleS5sZW5ndGggPiAxID8ga2V5LnNsaWNlKDAsIC0xKSA6IGtleTtcbiAgY29uc3QgbmFtZSA9IFNIQVJQX1RPX05BTUVbcmF3XTtcbiAgaWYgKCFuYW1lKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gIGNvbnN0IGlzTWlub3IgPSBzY2FsZSA9PT0gXCJtaW5vclwiO1xuICBpZiAoaXNNaW5vcikge1xuICAgIGNvbnN0IG1pbm9yTWFwOiBSZWNvcmQ8c3RyaW5nLCBDYW1lbG90S2V5PiA9IHtcbiAgICAgIENzaGFycDogXCIxMkFcIiwgRGI6IFwiMTJBXCIsXG4gICAgICBEc2hhcnA6IFwiMkFcIiwgIEViOiBcIjJBXCIsXG4gICAgICBGc2hhcnA6IFwiMTFBXCIsIEdiOiBcIjExQVwiLFxuICAgICAgR3NoYXJwOiBcIjFBXCIsICBBYjogXCIxQVwiLFxuICAgICAgQXNoYXJwOiBcIjNBXCIsICBCYjogXCIzQVwiLFxuICAgICAgRjogXCI0QVwiLFxuICAgICAgQzogXCI1QVwiLFxuICAgICAgRzogXCI2QVwiLFxuICAgICAgRDogXCI3QVwiLFxuICAgICAgQTogXCI4QVwiLFxuICAgICAgRTogXCI5QVwiLFxuICAgICAgQjogXCIxMEFcIixcbiAgICB9O1xuICAgIHJldHVybiBtaW5vck1hcFtuYW1lXTtcbiAgfVxuICBjb25zdCBtYWpvck1hcDogUmVjb3JkPHN0cmluZywgQ2FtZWxvdEtleT4gPSB7XG4gICAgQjogXCIxQlwiLFxuICAgIEZzaGFycDogXCIyQlwiLCBHYjogXCIyQlwiLFxuICAgIENzaGFycDogXCIzQlwiLCBEYjogXCIzQlwiLFxuICAgIEdzaGFycDogXCI0QlwiLCBBYjogXCI0QlwiLFxuICAgIERzaGFycDogXCI1QlwiLCBFYjogXCI1QlwiLFxuICAgIEFzaGFycDogXCI2QlwiLCBCYjogXCI2QlwiLFxuICAgIEY6IFwiN0JcIixcbiAgICBDOiBcIjhCXCIsXG4gICAgRzogXCI5QlwiLFxuICAgIEQ6IFwiMTBCXCIsXG4gICAgQTogXCIxMUJcIixcbiAgICBFOiBcIjEyQlwiLFxuICB9O1xuICByZXR1cm4gbWFqb3JNYXBbbmFtZV07XG59XG5cbi8qKiBDb252ZXJ0IENhbWVsb3QgYmFjayB0byBhIERhdGF2aWV3LWZyaWVuZGx5IGtleSBuYW1lLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbWVsb3RUb0tleU5hbWUoY2FtZWxvdDogQ2FtZWxvdEtleSk6IHsga2V5OiBzdHJpbmc7IHNjYWxlOiBzdHJpbmcgfSB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IG1hcDogUmVjb3JkPENhbWVsb3RLZXksIHsga2V5OiBzdHJpbmc7IHNjYWxlOiBzdHJpbmcgfT4gPSB7XG4gICAgXCIxQlwiOiB7IGtleTogXCJCXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjJCXCI6IHsga2V5OiBcIkYjIC8gR2JcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiM0JcIjogeyBrZXk6IFwiQyMgLyBEYlwiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCI0QlwiOiB7IGtleTogXCJHIyAvIEFiXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjVCXCI6IHsga2V5OiBcIkQjIC8gRWJcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiNkJcIjogeyBrZXk6IFwiQSMgLyBCYlwiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCI3QlwiOiB7IGtleTogXCJGXCIsIHNjYWxlOiBcIm1ham9yXCIgfSxcbiAgICBcIjhCXCI6IHsga2V5OiBcIkNcIiwgc2NhbGU6IFwibWFqb3JcIiB9LFxuICAgIFwiOUJcIjogeyBrZXk6IFwiR1wiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCIxMEJcIjogeyBrZXk6IFwiRFwiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCIxMUJcIjogeyBrZXk6IFwiQVwiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCIxMkJcIjogeyBrZXk6IFwiRVwiLCBzY2FsZTogXCJtYWpvclwiIH0sXG4gICAgXCIxQVwiOiB7IGtleTogXCJHIyAvIEFibVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCIyQVwiOiB7IGtleTogXCJEIyAvIEVibVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCIzQVwiOiB7IGtleTogXCJBIyAvIEJibVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCI0QVwiOiB7IGtleTogXCJGbVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCI1QVwiOiB7IGtleTogXCJDbVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCI2QVwiOiB7IGtleTogXCJHbVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCI3QVwiOiB7IGtleTogXCJEbVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCI4QVwiOiB7IGtleTogXCJBbVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCI5QVwiOiB7IGtleTogXCJFbVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gICAgXCIxMEFcIjogeyBrZXk6IFwiQm1cIiwgc2NhbGU6IFwibWlub3JcIiB9LFxuICAgIFwiMTFBXCI6IHsga2V5OiBcIkYjIC8gR2JtXCIsIHNjYWxlOiBcIm1pbm9yXCIgfSxcbiAgICBcIjEyQVwiOiB7IGtleTogXCJDIyAvIERibVwiLCBzY2FsZTogXCJtaW5vclwiIH0sXG4gIH07XG4gIHJldHVybiBtYXBbY2FtZWxvdF07XG59XG5cbi8qKiBSZXR1cm4gdGhlIHNldCBvZiBoYXJtb25pY2FsbHkgY29tcGF0aWJsZSBDYW1lbG90IGtleXMuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tcGF0aWJsZUtleXMoY3VycmVudDogQ2FtZWxvdEtleSk6IENhbWVsb3RLZXlbXSB7XG4gIGNvbnN0IG51bSA9IHBhcnNlSW50KGN1cnJlbnQuc2xpY2UoMCwgLTEpLCAxMCk7IC8vIFwiNkFcIiBcdTIxOTIgNlxuICBjb25zdCBsZXR0ZXIgPSBjdXJyZW50LnNsaWNlKC0xKTsgLy8gXCI2QVwiIFx1MjE5MiBcIkFcIlxuICBjb25zdCBjb21wYXRpYmxlOiBDYW1lbG90S2V5W10gPSBbXTtcblxuICAvLyBTYW1lIG51bWJlciwgb3Bwb3NpdGUgbGV0dGVyIChtYWpvciBcdTIxOTQgbWlub3IgcmVsYXRpdmUpXG4gIGNvbXBhdGlibGUucHVzaChgJHtudW19JHtsZXR0ZXIgPT09IFwiQVwiID8gXCJCXCIgOiBcIkFcIn1gIGFzIENhbWVsb3RLZXkpO1xuXG4gIC8vIFNhbWUgbGV0dGVyLCBcdTAwQjExIG51bWJlciAod2l0aCB3cmFwKVxuICBjb25zdCBwcmV2ID0gbnVtID09PSAxID8gMTIgOiBudW0gLSAxO1xuICBjb25zdCBuZXh0ID0gbnVtID09PSAxMiA/IDEgOiBudW0gKyAxO1xuICBjb21wYXRpYmxlLnB1c2goYCR7cHJldn0ke2xldHRlcn1gIGFzIENhbWVsb3RLZXksIGAke25leHR9JHtsZXR0ZXJ9YCBhcyBDYW1lbG90S2V5KTtcblxuICAvLyBDcm9zcy1sZXR0ZXIgXHUwMEIxMSAoZW5lcmd5IGJvb3N0L2Ryb3ApXG4gIGNvbXBhdGlibGUucHVzaChgJHtwcmV2fSR7bGV0dGVyID09PSBcIkFcIiA/IFwiQlwiIDogXCJBXCJ9YCBhcyBDYW1lbG90S2V5KTtcbiAgY29tcGF0aWJsZS5wdXNoKGAke25leHR9JHtsZXR0ZXIgPT09IFwiQVwiID8gXCJCXCIgOiBcIkFcIn1gIGFzIENhbWVsb3RLZXkpO1xuXG4gIHJldHVybiBjb21wYXRpYmxlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENhbWVsb3RXaGVlbENvbmZpZyB7XG4gIGN1cnJlbnQ6IENhbWVsb3RLZXkgfCB1bmRlZmluZWQ7XG4gIG9uS2V5Q2xpY2s6IChjYW1lbG90OiBDYW1lbG90S2V5LCBkdlF1ZXJ5OiBzdHJpbmcpID0+IHZvaWQ7XG59XG5cbi8qKiBTZWxmLWNvbnRhaW5lZCBTVkcgcmVuZGVyaW5nIG9mIHRoZSBDYW1lbG90IHdoZWVsLlxuICogIE5vZGVzIGFyZSBwb3NpdGlvbmVkIHByZWNpc2VseSB2aWEgdHJpZyBpbnNpZGUgYSBmaXhlZCB2aWV3Qm94LlxuICogIFRoZSBjYWxsZXIganVzdCBuZWVkcyBhIGNvbnRhaW5lciAoYmxvY2sgb3IgZmxleCkgdG8gZHJvcCBpdCBpbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENhbWVsb3RXaGVlbCB7XG4gIHByaXZhdGUgY29udGFpbmVyOiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBjb25maWc6IENhbWVsb3RXaGVlbENvbmZpZztcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IEhUTUxFbGVtZW50LCBjb25maWc6IENhbWVsb3RXaGVlbENvbmZpZykge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuY29udGFpbmVyID0gcGFyZW50LmNyZWF0ZURpdih7IGNsczogXCJtYW0tY2FtZWxvdFwiIH0pO1xuICB9XG5cbiAgbW91bnQoKTogdm9pZCB7XG4gICAgdGhpcy5jb250YWluZXIuZW1wdHkoKTtcblxuICAgIC8vIFNWRyBjYW52YXMgXHUyMDE0IDI2MFx1MDBENzI2MCB2aWV3Qm94IGdpdmVzIGNsZWFuIGNvb3JkaW5hdGVzLlxuICAgIC8vIFRoZSBDU1MgY29uc3VtZXIgY2FuIHNldCB3aWR0aC9oZWlnaHQgb24gLm1hbS1jYW1lbG90XG4gICAgY29uc3QgbnMgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCBcInN2Z1wiKTtcbiAgICBzdmcuc2V0QXR0cmlidXRlKFwidmlld0JveFwiLCBcIjAgMCAyNjAgMjYwXCIpO1xuICAgIHN2Zy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1hbS1jYW1lbG90LXdoZWVsXCIpO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHN2Zyk7XG5cbiAgICBjb25zdCBjeCA9IDEzMDtcbiAgICBjb25zdCBjeSA9IDEzMDtcbiAgICBjb25zdCBvdXRlclIgPSAxMDA7XG4gICAgY29uc3QgaW5uZXJSID0gNjA7XG5cbiAgICAvLyBEcmF3IGFsbCAxMiBwb3NpdGlvbnMgYXJvdW5kIHRoZSBjbG9ja1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTI7IGkrKykge1xuICAgICAgLy8gU3RhcnQgYXQgMTIgbydjbG9jayBhbmQgZ28gY2xvY2t3aXNlXG4gICAgICBjb25zdCBhbmdsZSA9IGkgKiAzMCAtIDkwOyAvLyBkZWdyZWVzXG4gICAgICBjb25zdCBhbmdsZVJhZCA9IChhbmdsZSAqIE1hdGguUEkpIC8gMTgwO1xuXG4gICAgICBjb25zdCBtYWpvcktleSA9IE1BSk9SX0tFWVNbaV07XG4gICAgICBjb25zdCBtaW5vcktleSA9IE1JTk9SX0tFWVNbaV07XG5cbiAgICAgIC8vIE1ham9yIChvdXRlciByaW5nKVxuICAgICAgdGhpcy5yZW5kZXJLZXkoc3ZnLCBjeCwgY3ksIG91dGVyUiwgYW5nbGVSYWQsIG1ham9yS2V5LCBcIm1ham9yXCIpO1xuICAgICAgLy8gTWlub3IgKGlubmVyIHJpbmcpXG4gICAgICB0aGlzLnJlbmRlcktleShzdmcsIGN4LCBjeSwgaW5uZXJSLCBhbmdsZVJhZCwgbWlub3JLZXksIFwibWlub3JcIik7XG4gICAgfVxuXG4gICAgLy8gTGVnZW5kIChIVE1MIGJlbG93IFNWRywgbm90IGluc2lkZSBpdClcbiAgICBjb25zdCBsZWdlbmQgPSB0aGlzLmNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWNhbWVsb3QtbGVnZW5kXCIgfSk7XG4gICAgbGVnZW5kLmNyZWF0ZVNwYW4oeyBjbHM6IFwibWFtLWNhbWVsb3QtY3VycmVudFwiLCB0ZXh0OiBcIlx1MjVDRiBjdXJyZW50IFwiIH0pO1xuICAgIGxlZ2VuZC5jcmVhdGVTcGFuKHsgY2xzOiBcIm1hbS1jYW1lbG90LWNvbXBhdGlibGVcIiwgdGV4dDogXCJcdTI1RTYgY29tcGF0aWJsZSBcIiB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyS2V5KFxuICAgIHN2ZzogU1ZHU1ZHRWxlbWVudCxcbiAgICBjeDogbnVtYmVyLFxuICAgIGN5OiBudW1iZXIsXG4gICAgcmFkaXVzOiBudW1iZXIsXG4gICAgYW5nbGVSYWQ6IG51bWJlcixcbiAgICBrZXk6IENhbWVsb3RLZXksXG4gICAgdHlwZTogXCJtYWpvclwiIHwgXCJtaW5vclwiLFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBucyA9IFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIjtcblxuICAgIGNvbnN0IHggPSBjeCArIHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlUmFkKTtcbiAgICBjb25zdCB5ID0gY3kgKyByYWRpdXMgKiBNYXRoLnNpbihhbmdsZVJhZCk7XG5cbiAgICBjb25zdCBnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCBcImdcIik7XG4gICAgZy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBgbWFtLWNhbWVsb3Qta2V5IG1hbS1jYW1lbG90LWtleS0ke3R5cGV9YCk7XG4gICAgZy5zZXRBdHRyaWJ1dGUoXCJkYXRhLWNhbWVsb3RcIiwga2V5KTtcblxuICAgIC8vIEhpZ2hsaWdodGluZ1xuICAgIGNvbnN0IGNvbXBhdGlibGUgPSB0aGlzLmNvbmZpZy5jdXJyZW50ID8gZ2V0Q29tcGF0aWJsZUtleXModGhpcy5jb25maWcuY3VycmVudCkgOiBbXTtcbiAgICBpZiAodGhpcy5jb25maWcuY3VycmVudCA9PT0ga2V5KSB7XG4gICAgICBnLmNsYXNzTGlzdC5hZGQoXCJtYW0tY2FtZWxvdC1jdXJyZW50XCIpO1xuICAgIH0gZWxzZSBpZiAoY29tcGF0aWJsZS5pbmNsdWRlcyhrZXkpKSB7XG4gICAgICBnLmNsYXNzTGlzdC5hZGQoXCJtYW0tY2FtZWxvdC1jb21wYXRpYmxlXCIpO1xuICAgIH1cblxuICAgIC8vIFRleHQgbGFiZWwgKFNWRyB0ZXh0LCBjZW50ZXJlZCBvbiB0aGUgY2lyY2xlIHBvaW50KVxuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsIFwidGV4dFwiKTtcbiAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibWFtLWNhbWVsb3QtbGFiZWxcIik7XG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ4XCIsIFN0cmluZyh4KSk7XG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ5XCIsIFN0cmluZyh5KSk7XG4gICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKTtcbiAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImRvbWluYW50LWJhc2VsaW5lXCIsIFwibWlkZGxlXCIpO1xuICAgIHRleHQudGV4dENvbnRlbnQgPSBrZXk7XG5cbiAgICBnLmFwcGVuZENoaWxkKHRleHQpO1xuICAgIHN2Zy5hcHBlbmRDaGlsZChnKTtcblxuICAgIC8vIENsaWNrIGhhbmRsZXJcbiAgICBnLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCBtYXRjaCA9IGNhbWVsb3RUb0tleU5hbWUoa2V5KTtcbiAgICAgIGlmICghbWF0Y2gpIHJldHVybjtcbiAgICAgIC8vIFByZWZlciB0aGUgc2hhcnAgc3BlbGxpbmcgZm9yIERhdGF2aWV3IGNvbnNpc3RlbmN5XG4gICAgICBjb25zdCBkdktleSA9IG1hdGNoLmtleS5zcGxpdChcIiAvIFwiKVswXTtcbiAgICAgIGNvbnN0IGR2UXVlcnkgPSBgXFxgXFxgXFxgZGF0YXZpZXdcXG5MSVNUXFxuRlJPTSAjbXVzaWNcXG5XSEVSRSBrZXkgPSBcIiR7ZHZLZXl9XCJcXG5TT1JUIHRlbXBvIEFTQ1xcblxcYFxcYFxcYGA7XG4gICAgICB0aGlzLmNvbmZpZy5vbktleUNsaWNrKGtleSwgZHZRdWVyeSk7XG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGFpbmVyLnJlbW92ZSgpO1xuICB9XG59XG4iLCAiLy8gTXVzaWNEYXNoYm9hcmRQcm9jZXNzb3IgXHUyMDE0IE9ic2lkaWFuIGNvZGUtYmxvY2sgcmVuZGVyZXIgZm9yIGBtdXNpYy1kYXNoYm9hcmRgXG4vLyBEcml2ZW4gZW50aXJlbHkgYnkgZnJvbnRtYXR0ZXIgKHplcm8gYW5hbHlzaXMgYXQgcmVuZGVyIHRpbWUpLlxuLy9cbi8vIENTUyBjbGFzcyBob29rcyAoZm9yIHRoZW1pbmcgYnkgdXNlcik6XG4vLyAgLm1hbS1kYXNoYm9hcmQgICAgICAgICAgICAgXHUyMDE0IHJvb3QgY29udGFpbmVyXG4vLyAgLm1hbS1kYXNoYm9hcmQtaGVhZGVyICAgICAgXHUyMDE0IHRvcCB0aXRsZSBiYXJcbi8vICAubWFtLWRhc2hib2FyZC1tZXRhICAgICAgICBcdTIwMTQgQlBNICsga2V5IHJvd1xuLy8gIC5tYW0tZGFzaGJvYXJkLXNlY3Rpb24gICAgIFx1MjAxNCBzdWItc3VyZmFjZSB3cmFwcGVyXG4vLyAgLm1hbS1kYXNoYm9hcmQtc2VjdGlvbi1sYWJlbFxuLy8gIC5tYW0tZGFzaGJvYXJkLWNvbnRyb2xzICAgIFx1MjAxNCBCUE0gKyBrZXkgcmV1c2FibGUgY29udHJvbHMgYXJlYVxuLy8gIC5tYW0tZGFzaGJvYXJkLXRpbWVsaW5lICAgIFx1MjAxNCBzdHJ1Y3R1cmUgdGltZWxpbmUgY29udGFpbmVyXG4vLyAgLm1hbS1kYXNoYm9hcmQtdHVuZXIgICAgICAgXHUyMDE0IHR1bmVyIGdhdWdlIGNvbnRhaW5lclxuLy8gIC5tYW0tZGFzaGJvYXJkLWNhbWVsb3QgICAgIFx1MjAxNCBDYW1lbG90IHdoZWVsIGNvbnRhaW5lclxuXG5pbXBvcnQgeyBNYXJrZG93blBvc3RQcm9jZXNzb3JDb250ZXh0IH0gZnJvbSBcIm9ic2lkaWFuXCI7XG5pbXBvcnQgeyBCcG1Db250cm9sLCBCcG1Db250cm9sU3RhdGUsIEJwbUNvbnRyb2xDYWxsYmFja3MgfSBmcm9tIFwiLi9icG0tY29udHJvbFwiO1xuaW1wb3J0IHsgS2V5Q29udHJvbCwgS2V5Q29udHJvbFN0YXRlLCBLZXlDb250cm9sQ2FsbGJhY2tzIH0gZnJvbSBcIi4va2V5LWNvbnRyb2xcIjtcbmltcG9ydCB7IFN0cnVjdHVyZVRpbWVsaW5lLCBTdHJ1Y3R1cmVTZWdtZW50IH0gZnJvbSBcIi4vc3RydWN0dXJlLXRpbWVsaW5lXCI7XG5pbXBvcnQgeyBUdW5lck5lZWRsZSB9IGZyb20gXCIuL3R1bmVyLW5lZWRsZVwiO1xuaW1wb3J0IHsgQ2FtZWxvdFdoZWVsLCBrZXlOYW1lVG9DYW1lbG90IH0gZnJvbSBcIi4vY2FtZWxvdC13aGVlbFwiO1xuaW1wb3J0IHsgaW5qZWN0RnJvbnRtYXR0ZXIsIHBhcnNlRnJvbnRtYXR0ZXIgfSBmcm9tIFwiLi4veWFtbC1pbmplY3RvclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIERhc2hib2FyZEZyb250bWF0dGVyIHtcbiAgc291cmNlRmlsZTogc3RyaW5nOyAgICAgICAgICAvLyBhY3RpdmUgZmlsZSBwYXRoXG4gIHRlbXBvOiBudW1iZXI7XG4gIHJhd190ZW1wbz86IG51bWJlcjtcbiAgYWx0ZXJuYXRlX3RlbXBvPzogbnVtYmVyO1xuICB0ZW1wb19jb25maXJtZWQ6IGJvb2xlYW47XG4gIGtleTogc3RyaW5nO1xuICBrZXlfY29uZmlybWVkOiBib29sZWFuO1xuICBkdXJhdGlvbj86IHN0cmluZzsgICAgICAgICAgIC8vIFwiMjozNFwiXG4gIGF1ZGlvX3N0YXJ0X29mZnNldD86IG51bWJlcjsgLy8gYmFycyB0byB0cmltIGxlYWQtaW5cbiAgc3RydWN0dXJlPzogQXJyYXk8e1xuICAgIHNlZ21lbnQ6IHN0cmluZztcbiAgICBiYXJzOiBbbnVtYmVyLCBudW1iZXJdO1xuICAgIHRpbWU/OiBbc3RyaW5nLCBzdHJpbmddO1xuICB9Pjtcbn1cblxuZXhwb3J0IGNsYXNzIE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yIHtcbiAgcHJpdmF0ZSB2YXVsdEFjdGlvbnM6IHtcbiAgICByZWFkRmlsZTogKHBhdGg6IHN0cmluZykgPT4gUHJvbWlzZTxzdHJpbmc+O1xuICAgIG1vZGlmeUZpbGU6IChwYXRoOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbiAgICBnZXRGaWxlQnlQYXRoOiAocGF0aDogc3RyaW5nKSA9PiB7IHBhdGg6IHN0cmluZyB9IHwgbnVsbDtcbiAgfTtcblxuICBjb25zdHJ1Y3Rvcih2YXVsdEFjdGlvbnM6IE11c2ljRGFzaGJvYXJkUHJvY2Vzc29yW1widmF1bHRBY3Rpb25zXCJdKSB7XG4gICAgdGhpcy52YXVsdEFjdGlvbnMgPSB2YXVsdEFjdGlvbnM7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzKFxuICAgIHNvdXJjZTogc3RyaW5nLFxuICAgIGVsOiBIVE1MRWxlbWVudCxcbiAgICBjdHg6IE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIC8vIHNvdXJjZSBpcyBpZ25vcmVkIFx1MjAxNCB0aGUgcHJvY2Vzc29yIHJlYWRzIHRoZSBwYXJlbnQgbm90ZSdzIGZyb250bWF0dGVyXG4gICAgY29uc3QgY29udGFpbmVyID0gZWwuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmRcIiB9KTtcblxuICAgIC8vIFJlc29sdmUgdGhlIHNvdXJjZSBmaWxlXG4gICAgY29uc3QgZmlsZVBhdGggPSBjdHguc291cmNlUGF0aDtcblxuICAgIC8vIFJlYWQgZnJvbnRtYXR0ZXIgZnJvbSB0aGUgdmF1bHRcbiAgICBsZXQgZm06IERhc2hib2FyZEZyb250bWF0dGVyO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByYXcgPSBhd2FpdCB0aGlzLnZhdWx0QWN0aW9ucy5yZWFkRmlsZShmaWxlUGF0aCk7XG4gICAgICBmbSA9IHRoaXMucGFyc2VGcm9udG1hdHRlcihyYXcsIGZpbGVQYXRoKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIGNvbnRhaW5lci5jcmVhdGVFbChcInBcIiwge1xuICAgICAgICBjbHM6IFwibWFtLWRhc2hib2FyZC1lbXB0eVwiLFxuICAgICAgICB0ZXh0OiBcIk5vIG11c2ljIGFuYWx5c2lzIGRhdGEgZm91bmQgaW4gdGhpcyBub3RlLiBSdW4gXFx1MjAxY0FuYWx5emUgYXVkaW9cXHUyMDFkIGZpcnN0LlwiLFxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEhlYWRlciBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBoZWFkZXIgPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtaGVhZGVyXCIgfSk7XG4gICAgaGVhZGVyLmNyZWF0ZUVsKFwiaDNcIiwgeyB0ZXh0OiBmbS5zb3VyY2VGaWxlLnNwbGl0KFwiL1wiKS5wb3AoKSB8fCBcIlVudGl0bGVkXCIgfSk7XG4gICAgaWYgKGZtLmR1cmF0aW9uKSB7XG4gICAgICBoZWFkZXIuY3JlYXRlU3Bhbih7IGNsczogXCJtYW0tZGFzaGJvYXJkLWR1cmF0aW9uXCIsIHRleHQ6IGZtLmR1cmF0aW9uIH0pO1xuICAgIH1cblxuICAgIC8vIFx1MjUwMFx1MjUwMCBNZXRhIHJvdyAoQlBNICsga2V5LCBjb21wYWN0KSBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCBtZXRhID0gY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkLW1ldGFcIiB9KTtcbiAgICBjb25zdCBicG1FbCA9IG1ldGEuY3JlYXRlU3Bhbih7XG4gICAgICBjbHM6IGZtLnRlbXBvX2NvbmZpcm1lZCA/IFwibWFtLW1ldGEtY29uZmlybWVkXCIgOiBcIm1hbS1tZXRhLXVuY29uZmlybWVkXCIsXG4gICAgfSk7XG4gICAgYnBtRWwuc2V0VGV4dChgJHtmbS50ZW1wb30gQlBNYCk7XG4gICAgaWYgKGZtLmFsdGVybmF0ZV90ZW1wbykge1xuICAgICAgYnBtRWwuc2V0VGV4dChgJHtmbS50ZW1wb30gQlBNIChvciAke2ZtLmFsdGVybmF0ZV90ZW1wb30/KWApO1xuICAgIH1cbiAgICBtZXRhLmNyZWF0ZVNwYW4oeyB0ZXh0OiBcIiBcXHUyMDIyIFwiIH0pO1xuICAgIGNvbnN0IGtleUVsID0gbWV0YS5jcmVhdGVTcGFuKHtcbiAgICAgIGNsczogZm0ua2V5X2NvbmZpcm1lZCA/IFwibWFtLW1ldGEtY29uZmlybWVkXCIgOiBcIm1hbS1tZXRhLXVuY29uZmlybWVkXCIsXG4gICAgfSk7XG4gICAga2V5RWwuc2V0VGV4dChmbS5rZXkpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIENvbnRyb2xzIChyZXVzYWJsZSBCUE0gKyBLZXkpIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGNvbnRyb2xzU2VjdGlvbiA9IGNvbnRhaW5lci5jcmVhdGVEaXYoeyBjbHM6IFwibWFtLWRhc2hib2FyZC1zZWN0aW9uXCIgfSk7XG4gICAgY29udHJvbHNTZWN0aW9uLmNyZWF0ZUVsKFwiaDRcIiwgeyBjbHM6IFwibWFtLWRhc2hib2FyZC1zZWN0aW9uLWxhYmVsXCIsIHRleHQ6IFwiQ29udHJvbHNcIiB9KTtcbiAgICBjb25zdCBjb250cm9sc0FyZWEgPSBjb250cm9sc1NlY3Rpb24uY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtY29udHJvbHNcIiB9KTtcblxuICAgIGNvbnN0IGlzTWlub3IgPSBmbS5rZXkuZW5kc1dpdGgoXCJtXCIpO1xuICAgIGNvbnN0IGJhc2VLZXkgPSBpc01pbm9yID8gZm0ua2V5LnNsaWNlKDAsIC0xKSA6IGZtLmtleTtcblxuICAgIGNvbnN0IGJwbVN0YXRlOiBCcG1Db250cm9sU3RhdGUgPSB7XG4gICAgICBicG06IGZtLnRlbXBvLFxuICAgICAgcmF3QnBtOiBmbS5yYXdfdGVtcG8gPz8gZm0udGVtcG8sXG4gICAgICBhbHRlcm5hdGVCcG06IGZtLmFsdGVybmF0ZV90ZW1wbyxcbiAgICAgIGNvbmZpcm1lZDogZm0udGVtcG9fY29uZmlybWVkLFxuICAgIH07XG4gICAgY29uc3Qga2V5U3RhdGU6IEtleUNvbnRyb2xTdGF0ZSA9IHtcbiAgICAgIGtleTogYmFzZUtleSxcbiAgICAgIHNjYWxlOiBpc01pbm9yID8gXCJtaW5vclwiIDogXCJtYWpvclwiLFxuICAgICAgcmVsYXRpdmVLZXk6IHVuZGVmaW5lZCxcbiAgICAgIGNvbmZpcm1lZDogZm0ua2V5X2NvbmZpcm1lZCxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2F2ZVRvRm0gPSBhc3luYyAocGFydGlhbDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJhdyA9IGF3YWl0IHRoaXMudmF1bHRBY3Rpb25zLnJlYWRGaWxlKGZpbGVQYXRoKTtcbiAgICAgICAgY29uc3QgdXBkYXRlZCA9IGluamVjdEZyb250bWF0dGVyKHJhdywgcGFydGlhbCBhcyBhbnkpO1xuICAgICAgICBhd2FpdCB0aGlzLnZhdWx0QWN0aW9ucy5tb2RpZnlGaWxlKGZpbGVQYXRoLCB1cGRhdGVkKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gU2lsZW50IGZhaWwgXHUyMDE0IHZhdWx0IHdyaXRlcyBhcmUgYmVzdC1lZmZvcnQgaW4gZGFzaGJvYXJkXG4gICAgICAgIGNvbnNvbGUud2FybihcIltNQU1dIERhc2hib2FyZCBzYXZlIGZhaWxlZDpcIiwgZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGJwbUNvbnRyb2wgPSBuZXcgQnBtQ29udHJvbChjb250cm9sc0FyZWEsIGJwbVN0YXRlLCB7XG4gICAgICBvbkNoYW5nZTogYXN5bmMgKGJwbSkgPT4ge1xuICAgICAgICBhd2FpdCBzYXZlVG9GbSh7IHRlbXBvOiBicG0sIHRlbXBvX2NvbmZpcm1lZDogdHJ1ZSB9KTtcbiAgICAgIH0sXG4gICAgICBvbkNvbmZpcm1lZDogYXN5bmMgKGNvbmZpcm1lZCkgPT4ge1xuICAgICAgICBhd2FpdCBzYXZlVG9GbSh7IHRlbXBvX2NvbmZpcm1lZDogY29uZmlybWVkIH0pO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICBicG1Db250cm9sLm1vdW50KGNvbnRyb2xzQXJlYSk7XG5cbiAgICBjb25zdCBrZXlDb250cm9sID0gbmV3IEtleUNvbnRyb2woY29udHJvbHNBcmVhLCBrZXlTdGF0ZSwge1xuICAgICAgb25DaGFuZ2U6IGFzeW5jIChrZXksIHNjYWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IGRpc3BsYXkgPSBzY2FsZSA9PT0gXCJtaW5vclwiID8gYCR7a2V5fW1gIDoga2V5O1xuICAgICAgICBhd2FpdCBzYXZlVG9GbSh7IGtleTogZGlzcGxheSwga2V5X2NvbmZpcm1lZDogdHJ1ZSB9KTtcbiAgICAgIH0sXG4gICAgICBvbkNvbmZpcm1lZDogYXN5bmMgKGNvbmZpcm1lZCkgPT4ge1xuICAgICAgICBhd2FpdCBzYXZlVG9GbSh7IGtleV9jb25maXJtZWQ6IGNvbmZpcm1lZCB9KTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAga2V5Q29udHJvbC5tb3VudChjb250cm9sc0FyZWEpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFN0cnVjdHVyZSB0aW1lbGluZSBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCB0aW1lbGluZVNlY3Rpb24gPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvblwiIH0pO1xuICAgIHRpbWVsaW5lU2VjdGlvbi5jcmVhdGVFbChcImg0XCIsIHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvbi1sYWJlbFwiLCB0ZXh0OiBcIlN0cnVjdHVyZVwiIH0pO1xuXG4gICAgY29uc3Qgc2VnbWVudHM6IFN0cnVjdHVyZVNlZ21lbnRbXSA9IChmbS5zdHJ1Y3R1cmUgfHwgW10pLm1hcCgocykgPT4gKHtcbiAgICAgIGlkOiBzLnNlZ21lbnQsXG4gICAgICBsYWJlbDogcy5zZWdtZW50LFxuICAgICAgc3RhcnRCYXI6IHMuYmFyc1swXSxcbiAgICAgIGVuZEJhcjogcy5iYXJzWzFdLFxuICAgICAgY29sb3I6IHRoaXMuY29sb3JGb3JTZWdtZW50KHMuc2VnbWVudCksXG4gICAgfSkpO1xuXG4gICAgY29uc3QgdGltZWxpbmUgPSBuZXcgU3RydWN0dXJlVGltZWxpbmUoXG4gICAgICB0aW1lbGluZVNlY3Rpb24sXG4gICAgICBzZWdtZW50cyxcbiAgICAgIGZtLnRlbXBvLFxuICAgICAgZm0uYXVkaW9fc3RhcnRfb2Zmc2V0ID8/IDAsXG4gICAgKTtcbiAgICB0aW1lbGluZS5vbk9mZnNldENoYW5nZSA9IGFzeW5jIChvZmZzZXQpID0+IHtcbiAgICAgIGF3YWl0IHNhdmVUb0ZtKHsgYXVkaW9fc3RhcnRfb2Zmc2V0OiBvZmZzZXQgfSk7XG4gICAgfTtcbiAgICB0aW1lbGluZS5tb3VudCgpO1xuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFR1bmVyIG5lZWRsZSBcdTI1MDBcdTI1MDBcbiAgICBjb25zdCB0dW5lclNlY3Rpb24gPSBjb250YWluZXIuY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvblwiIH0pO1xuICAgIHR1bmVyU2VjdGlvbi5jcmVhdGVFbChcImg0XCIsIHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvbi1sYWJlbFwiLCB0ZXh0OiBcIlR1bmVyXCIgfSk7XG4gICAgY29uc3QgdHVuZXJDb250YWluZXIgPSB0dW5lclNlY3Rpb24uY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtdHVuZXJcIiB9KTtcbiAgICBjb25zdCB0dW5lciA9IG5ldyBUdW5lck5lZWRsZSh0dW5lckNvbnRhaW5lciwge1xuICAgICAga2V5OiBiYXNlS2V5LFxuICAgICAgc2NhbGU6IGlzTWlub3IgPyBcIm1pbm9yXCIgOiBcIm1ham9yXCIsXG4gICAgICBjb25maXJtZWQ6IGZtLmtleV9jb25maXJtZWQsXG4gICAgfSk7XG4gICAgdHVuZXIubW91bnQoKTtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBDYW1lbG90IHdoZWVsIFx1MjUwMFx1MjUwMFxuICAgIGNvbnN0IGNhbWVsb3RTZWN0aW9uID0gY29udGFpbmVyLmNyZWF0ZURpdih7IGNsczogXCJtYW0tZGFzaGJvYXJkLXNlY3Rpb25cIiB9KTtcbiAgICBjYW1lbG90U2VjdGlvbi5jcmVhdGVFbChcImg0XCIsIHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtc2VjdGlvbi1sYWJlbFwiLCB0ZXh0OiBcIkNhbWVsb3RcIiB9KTtcbiAgICBjb25zdCBjYW1lbG90Q29udGFpbmVyID0gY2FtZWxvdFNlY3Rpb24uY3JlYXRlRGl2KHsgY2xzOiBcIm1hbS1kYXNoYm9hcmQtY2FtZWxvdFwiIH0pO1xuICAgIGNvbnN0IGNhbWVsb3QgPSBuZXcgQ2FtZWxvdFdoZWVsKGNhbWVsb3RDb250YWluZXIsIHtcbiAgICAgIGN1cnJlbnQ6IGtleU5hbWVUb0NhbWVsb3QoYmFzZUtleSwgaXNNaW5vciA/IFwibWlub3JcIiA6IFwibWFqb3JcIiksXG4gICAgICBvbktleUNsaWNrOiAoX2NhbWVsb3RLZXksIGR2UXVlcnkpID0+IHRoaXMuaGFuZGxlQ2FtZWxvdENsaWNrKGR2UXVlcnkpLFxuICAgIH0pO1xuICAgIGNhbWVsb3QubW91bnQoKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VGcm9udG1hdHRlcihyYXc6IHN0cmluZywgc291cmNlUGF0aDogc3RyaW5nKTogRGFzaGJvYXJkRnJvbnRtYXR0ZXIge1xuICAgIGNvbnN0IGZtID0gcGFyc2VGcm9udG1hdHRlcihyYXcpO1xuXG4gICAgaWYgKCFmbS50ZW1wbyAmJiAhZm0ua2V5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBhbmFseXNpcyBkYXRhIGluIGZyb250bWF0dGVyXCIpO1xuICAgIH1cblxuICAgIGxldCBzdHJ1Y3R1cmU6IERhc2hib2FyZEZyb250bWF0dGVyW1wic3RydWN0dXJlXCJdID0gdW5kZWZpbmVkO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGZtLnN0cnVjdHVyZSkpIHtcbiAgICAgIHN0cnVjdHVyZSA9IGZtLnN0cnVjdHVyZSBhcyBhbnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNvdXJjZUZpbGU6IHNvdXJjZVBhdGgsXG4gICAgICB0ZW1wbzogTnVtYmVyKGZtLnRlbXBvID8/IDApLFxuICAgICAgcmF3X3RlbXBvOiBmbS5yYXdfdGVtcG8gPyBOdW1iZXIoZm0ucmF3X3RlbXBvKSA6IHVuZGVmaW5lZCxcbiAgICAgIGFsdGVybmF0ZV90ZW1wbzogZm0uYWx0ZXJuYXRlX3RlbXBvID8gTnVtYmVyKGZtLmFsdGVybmF0ZV90ZW1wbykgOiB1bmRlZmluZWQsXG4gICAgICB0ZW1wb19jb25maXJtZWQ6ICEhZm0udGVtcG9fY29uZmlybWVkLFxuICAgICAga2V5OiBTdHJpbmcoZm0ua2V5ID8/IFwiXCIpLFxuICAgICAga2V5X2NvbmZpcm1lZDogISFmbS5rZXlfY29uZmlybWVkLFxuICAgICAgZHVyYXRpb246IGZtLmR1cmF0aW9uID8gU3RyaW5nKGZtLmR1cmF0aW9uKSA6IHVuZGVmaW5lZCxcbiAgICAgIGF1ZGlvX3N0YXJ0X29mZnNldDogTnVtYmVyKGZtLmF1ZGlvX3N0YXJ0X29mZnNldCA/PyAwKSxcbiAgICAgIHN0cnVjdHVyZSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBjb2xvckZvclNlZ21lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBjb2xvcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICBJbnRybzogXCJ2YXIoLS1jb2xvci1hY2NlbnQpXCIgLFxuICAgICAgVmVyc2U6IFwidmFyKC0taW50ZXJhY3RpdmUtYWNjZW50KVwiLFxuICAgICAgQ2hvcnVzOiBcInZhcigtLWNvbG9yLWdyZWVuKVwiICxcbiAgICAgIEJyaWRnZTogXCJ2YXIoLS1jb2xvci15ZWxsb3cpXCIgLFxuICAgICAgXCJQcmUtY2hvcnVzXCI6IFwidmFyKC0tY29sb3Itb3JhbmdlKVwiICxcbiAgICAgIEhvb2s6IFwidmFyKC0tY29sb3ItcmVkKVwiICxcbiAgICAgIE91dHJvOiBcInZhcigtLWNvbG9yLXB1cnBsZSlcIiAsXG4gICAgICBCcmVha2Rvd246IFwidmFyKC0tY29sb3ItY3lhbilcIiAsXG4gICAgfTtcbiAgICByZXR1cm4gY29sb3JzW25hbWVdIHx8IFwidmFyKC0tdGV4dC1tdXRlZClcIjtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQ2FtZWxvdENsaWNrKGR2UXVlcnk6IHN0cmluZyk6IHZvaWQge1xuICAgIG5hdmlnYXRvci5jbGlwYm9hcmQ/LndyaXRlVGV4dChkdlF1ZXJ5KS5jYXRjaCgoKSA9PiB7IC8qIG5vLW9wICovIH0pO1xuICAgIGNvbnNvbGUubG9nKFwiW01BTV0gQ2FtZWxvdCBrZXkgY2xpY2tlZCBcdTIwMTQgRGF0YXZpZXcgcXVlcnkgY29waWVkIHRvIGNsaXBib2FyZFwiKTtcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQSxJQUFBQSxtQkFBeUU7OztBQ0d6RSxlQUFzQixPQUFPLFFBQXNDO0FBQ2pFLFFBQU0sYUFBYSxNQUFNLE9BQU8sT0FBTyxPQUFPLFdBQVcsTUFBTTtBQUMvRCxRQUFNLFlBQVksTUFBTSxLQUFLLElBQUksV0FBVyxVQUFVLENBQUM7QUFDdkQsU0FBTyxVQUFVLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRTtBQUN0RTs7O0FDUkEsSUFBTSxRQUFRLE9BQU8sSUFBSSxZQUFZO0FBQ3JDLElBQU0sTUFBTSxPQUFPLElBQUksZUFBZTtBQUN0QyxJQUFNLE1BQU0sT0FBTyxJQUFJLFVBQVU7QUFDakMsSUFBTSxPQUFPLE9BQU8sSUFBSSxXQUFXO0FBQ25DLElBQU0sU0FBUyxPQUFPLElBQUksYUFBYTtBQUN2QyxJQUFNLE1BQU0sT0FBTyxJQUFJLFVBQVU7QUFDakMsSUFBTSxZQUFZLE9BQU8sSUFBSSxnQkFBZ0I7QUFD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LFVBQU0sSUFBSSxLQUFLLE1BQU0sTUFBTSxFQUFFO0FBQzdCLFdBQU8sR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUFBLEVBQzlDO0FBQ0Y7IiwKICAibmFtZXMiOiBbImltcG9ydF9vYnNpZGlhbiIsICJyZXMiLCAicmVzIiwgIm1hcCIsICJzY2hlbWEiLCAibm9kZSIsICJzY2hlbWEiLCAiaSIsICJlbmQiLCAiaXNCbG9jayIsICJtYXAiLCAidmFsdWUiLCAibWFwIiwgInNjaGVtYSIsICJzdHJpbmdpZnkiLCAiY29tbWVudCIsICJzdHIiLCAic2NoZW1hIiwgIm1hcCIsICJtYXAiLCAic2NoZW1hIiwgInNjaGVtYSIsICJzZXEiLCAic2VxIiwgInNjaGVtYSIsICJpbnRJZGVudGlmeSIsICJzY2hlbWEiLCAic2VxIiwgInNjaGVtYSIsICJwYWlycyIsICJtYXAiLCAic2NoZW1hIiwgInBhaXJzIiwgIm9tYXAiLCAic2VxIiwgImZsb2F0TmFOIiwgImZsb2F0RXhwIiwgImZsb2F0IiwgImludElkZW50aWZ5IiwgImludFJlc29sdmUiLCAibiIsICJpbnRTdHJpbmdpZnkiLCAiaW50T2N0IiwgImludCIsICJpbnRIZXgiLCAic2NoZW1hIiwgInNldCIsICJtYXAiLCAicmVzIiwgInNjaGVtYSIsICJpbnRPY3QiLCAiaW50IiwgImludEhleCIsICJmbG9hdE5hTiIsICJmbG9hdEV4cCIsICJmbG9hdCIsICJzY2hlbWEiLCAidGFncyIsICJtZXJnZSIsICJzY2hlbWEiLCAicmVzIiwgImNvbXBvc2VOb2RlIiwgImNvbXBvc2VFbXB0eU5vZGUiLCAibWFwIiwgImNvbXBvc2VOb2RlIiwgImNvbXBvc2VFbXB0eU5vZGUiLCAic2VxIiwgImNvbXBvc2VOb2RlIiwgImNvbXBvc2VFbXB0eU5vZGUiLCAiaXNNYXAiLCAibWFwIiwgIkNOIiwgInZhbHVlIiwgImVuZCIsICJzY2hlbWEiLCAidGFnIiwgIkJSRUFLIiwgIlNLSVAiLCAiUkVNT1ZFIiwgInZpc2l0IiwgIlNDQUxBUiIsICJTQ0FMQVIiLCAiaSIsICJjaCIsICJTQ0FMQVIiLCAibWFwIiwgInN0YXJ0IiwgInNlcSIsICJtYXAiXQp9Cg==

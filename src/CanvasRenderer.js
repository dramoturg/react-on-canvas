import reconciler from 'react-reconciler';
import Canvas from './Canvas';
import Rect from './Rect';

function shallowDiff(oldObj, newObj) {
  // Return a diff between the new and the old object
  const uniqueProps = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  const changedProps = Array.from(uniqueProps).filter(
    propName => oldObj[propName] !== newObj[propName]
  );
  return changedProps;
}

function diffProps(oldProps, newProps) {
  // for now we only need to diff the `style` prop:
  const changedStyles = shallowDiff(oldProps.style, newProps.style);
  return changedStyles.length ? newProps.style : null;
}

const Renderer = reconciler({
  getPublicInstance(inst) {
    return inst;
  },

  getRootHostContext(rootInstance) {
    // One can use this 'rootInstance' to pass data from the roots.
    return {};
  },

  getChildHostContext() {
    return {};
  },

  // Commit hooks, useful mainly for react-dom syntethic events
  prepareForCommit() {},
  resetAfterCommit() {},

  createInstance(
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    return new Rect(rootContainerInstance.ctx, props.style || {}, []);
  },

  appendInitialChild(parentInstance, child) {
    //console.log('appendInitialChild', parentInstance, child);
    parentInstance.children.push(child);
  },

  // ReactDOM sets the attributes and text content here.
  // With `false`being returned `commitMount` is never called.
  finalizeInitialChildren(element, type, props) {
    return false; // invoke commitMount? no!
  },

  commitMount(instance, updatePayload, type, oldProps, newProps) {
    //never called (see above)
  },

  // Calculate the updatePayload
  prepareUpdate(element, type, oldProps, newProps) {
    // Return a diff between the new and the old props
    return diffProps(oldProps, newProps);
  },

  commitUpdate(instance, updatePayload, type, oldProps, newProps) {
    //console.log('commitUpdate', arguments);
    if (updatePayload) instance.style = updatePayload;
    //instance.render();
  },

  shouldSetTextContent(type, props) {
    return false;
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    //TODO
    //return new Text(text);
  },

  now: Date.now,
  isPrimaryRenderer: true,
  supportsPersistence: true,

  cloneInstance(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    internalInstanceHandle,
    keepChildren,
    recyclableInstance
  ) {
    // For now we always recycle the instance:
    instance.style = updatePayload;
    return instance;
  },

  createContainerChildSet(container) {
    return [];
  },

  appendChildToContainerChildSet(childSet, child) {
    childSet.push(child);
  },

  finalizeContainerChildren(container, newChildren) {
  },

  replaceContainerChildren(container, newChildren) {
    container.renderChildren(newChildren);
  },
});

const CanvasRenderer = {
  render(element, domContainer, callback) {
    let root = domContainer._reactRootContainer;
    if (!root) {
      domContainer.innerHTML = '';
      const canvas = new Canvas(domContainer);
      const newRoot = Renderer.createContainer(canvas);
      root = domContainer._reactRootContainer = newRoot;
    }
    Renderer.updateContainer(element, root, null, callback);
  },
};

export default CanvasRenderer;

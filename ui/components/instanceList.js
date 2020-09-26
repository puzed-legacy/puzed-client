const mithril = require('mithril');

const instanceItem = require('./instanceItem');

function instanceList (vnode) {
  const { app, project, deployment } = vnode.attrs;

  return {
    oncreate: () => {
      app.listInstances(app, project.id, deployment.id);
    },

    view: (vnode) => {
      const instances = app.state.instances.filter(instance => instance.deploymentId === deployment.id);

      return instances.map(instance => mithril(instanceItem, { key: instance.id, app, project, deployment, instance }));
    }
  };
}

module.exports = instanceList;

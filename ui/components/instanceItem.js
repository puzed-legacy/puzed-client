const mithril = require('mithril');
const m = mithril;
const mui = require('mithui');
const html = require('hyperx')(mithril);
const dateFnsFormat = require('date-fns/format');

function formatDate (maybeDate) {
  try {
    return dateFnsFormat(new Date(parseFloat(maybeDate)), 'dd/MM/yyyy hh:mm:ss');
  } catch (error) {
    return 'Unknown date';
  }
}

const terminal = require('../components/terminal');
const tabbed = require('../components/tabbed');

function instanceLog (app, project, deployment, instance) {
  return {
    oncreate: () => {
      app.readInstanceBuildLog(app, project.id, deployment.id, instance.id);
    },

    view: () => {
      return html`
        <puz-build-log>
          ${mithril(terminal, { content: app.state.buildLogs[instance.id] || instance.buildLog || 'No build log found' })}
        </puz-build-log>
      `;
    }
  };
}

function settings (app, project, deployment, instance) {
  return {
    view: () => html`
      <puz-build-log>
        <div>
          <label>Commit Hash:</label> ${instance.commitHash}
        </div>
        <button onclick=${app.destroyInstance.bind(null, app, project.id, deployment.id, instance.id)}>Destroy</button>
      </puz-build-log>
    `
  };
}

function liveLog (app, project, deployment, instance) {
  const reconnect = event => {
    event.preventDefault();
    app.startInstanceLogs(app, project.id, deployment.id, instance.id);
  };

  return {
    oncreate: () => {
      app.startInstanceLogs(app, project.id, deployment.id, instance.id);
    },

    ondelete: () => {
      app.stopInstanceLogs(app, project.id, deployment.id, instance.id);
    },

    view: () => {
      return html`
        <puz-live-log>
        ${app.state.liveLogs[instance.id] && !app.state.liveLogs[instance.id].abort && instance.status !== 'destroyed' ? html`
            <div class="alert alert-warning">
              Logs are not live. Disconnected.
              <a href="javascript:void(0)" onclick=${reconnect}>Click here to reconnect</a>
            </div>
          ` : ''}

          ${instance.status === 'destroyed' ? html`
            <div class="alert alert-info">
              Logs are not live. Container is destroyed.
            </div>
          ` : ''}
          ${mithril(terminal, { content: (app.state.liveLogs[instance.id] && app.state.liveLogs[instance.id].data) || 'No logs found' })}
        </puz-live-log>
      `;
    }
  };
}

function instanceItem (vnode) {
  const app = vnode.attrs.app;
  const project = vnode.attrs.project;
  const deployment = vnode.attrs.deployment;
  const instance = vnode.attrs.instance;

  function instanceChangeHandler () {
    app.readInstance(app, project.id, deployment.id, instance.id);
  }

  return {
    oncreate: () => app.notifier.on(instance.id, instanceChangeHandler),
    onremove: () => app.notifier.off(instance.id, instanceChangeHandler),
    view: (vnode) => {
      const { app, project, instance } = vnode.attrs;
      const toggleExpanded = event => {
        if (['MUI-DROPDOWN-HEAD', 'A'].includes(event.target.tagName)) {
          return;
        }

        app.toggleExpanded(app, 'instanceExpands', instance.id);
      };

      return html`
        <puz-instance key=${instance.id} class="instance-status-${instance.status} ${app.state.instanceExpands[instance.id] ? 'expanded' : ''}">
          <puz-instance-heading onclick=${toggleExpanded}>
            <div class="nowrap cutoff">${instance.id}</div>
            <div><span class="label label-${instance.status}">${instance.status}</span></div>
            <div class="nowrap">${formatDate(instance.dateCreated)}</div>
            <div>
              ${m(mui.dropdown, { class: 'align-right', head: '☰' }, [
                m('div',
                  m('a', { onclick: app.destroyInstance.bind(null, app, project.id, deployment.id, instance.id) }, 'Destroy instance')
                )
              ])}
            </div>
          </puz-instance-heading>
      
          ${app.state.instanceExpands[instance.id] ? html`
            <puz-instance-content>
      
                ${mithril(tabbed, {
                  app,
                  tabs: [{
                    key: 'buildLogs',
                    title: html`<span>Build Log</span>`,
                    defaultActive: instance.status === 'pending',
                    content: instanceLog(app, project, deployment, instance)
                  }, {
                    key: 'logs',
                    title: html`<span>Logs</span>`,
                    defaultActive: instance.status !== 'pending',
                    content: liveLog(app, project, deployment, instance)
                  }, {
                      key: 'settings',
                      title: html`<span>Settings</span>`,
                      content: settings(app, project, deployment, instance)
                  }]
                })}
      
            </puz-instance-content>
          ` : ''}
        </puz-instance>
      `;
    }
  };
}

module.exports = instanceItem;

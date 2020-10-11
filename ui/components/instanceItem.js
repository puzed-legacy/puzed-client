const mithril = require('mithril');
const m = mithril;
const mui = require('mithui');
const html = require('hyperx')(mithril);
const dateFnsFormat = require('date-fns/format');

const lineChart = require('./lineChart');

function formatDate (maybeDate) {
  try {
    return dateFnsFormat(new Date(parseFloat(maybeDate)), 'dd/MM/yyyy hh:mm:ss');
  } catch (error) {
    return 'Unknown date';
  }
}

const terminal = require('../components/terminal');
const tabbed = require('../components/tabbed');

function instanceLog (app, service, deployment, instance) {
  return {
    oncreate: () => {
      app.readInstanceBuildLog(app, service.id, deployment.id, instance.id);
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

function statistics (app, service, deployment, instance) {
  let chart;

  let cpu;
  let memory;
  let disk;
  let timer;

  return {
    oncreate: () => {
      app.readInstanceStatistics(app, service.id, deployment.id, instance.id);
    },

    onremove: () => {
      clearInterval(timer);
    },

    onupdate: () => {
      if (chart) {
        return;
      }

      const instanceStatistics = app.state.instanceStatistics[instance.id];

      if (instanceStatistics) {
        cpu = instanceStatistics.reduce((result, statistic) => {
          const formattedDate = formatDate(statistic.dateCreated);

          result.date.push(formattedDate);
          result.data.push(statistic.cpuPercent);
          return result;
        }, { date: [], data: [] });

        memory = instanceStatistics.reduce((result, statistic) => {
          const formattedDate = formatDate(statistic.dateCreated);
          const value = parseInt(statistic.memory / 100000);

          result.date.push(formattedDate);
          result.data.push(value);
          return result;
        }, { date: [], data: [] });

        disk = instanceStatistics.reduce((result, statistic) => {
          const formattedDate = formatDate(statistic.dateCreated);
          const value = parseInt(statistic.diskIo);

          result.date.push(formattedDate);
          result.data.push(value);
          return result;
        }, { date: [], data: [] });
      }
    },

    view: () => html`
      <puz-build-log>
        <div>
          <h1>CPU Usage</h1>
          ${m(lineChart, {
            data: cpu,
            title: 'CPU Usage',
            unit: 'percent',
            formatter: items => {
              return `${items[0].axisValueLabel}<br/>${parseFloat(items[0].value).toFixed(2)}%`;
            }
          })}
        </div>
        <div>
          <h1>Memory Usage</h1>
          ${m(lineChart, {
            data: memory,
            title: 'Memory Usage',
            unit: 'mb',
            formatter: items => {
              return `${items[0].axisValueLabel}<br/>${parseFloat(items[0].value).toFixed(2)}mb`;
            }
          })}
        </div>
        <div>
          <h1>Disk IO Usage</h1>
          ${m(lineChart, { data: disk, title: 'Disk IO Usage' })}
        </div>
      </puz-build-log>
    `
  };
}

function settings (app, service, deployment, instance) {
  return {
    view: () => html`
    <puz-build-log>
    <div>
    <label>Commit Hash:</label> ${instance.commitHash}
    </div>
    <button onclick=${app.destroyInstance.bind(null, app, service.id, deployment.id, instance.id)}>Destroy</button>
    </puz-build-log>
    `
  };
}

function liveLog (app, service, deployment, instance) {
  const reconnect = event => {
    event.preventDefault();
    app.startInstanceLogs(app, service.id, deployment.id, instance.id);
  };

  return {
    oncreate: () => {
      app.startInstanceLogs(app, service.id, deployment.id, instance.id);
    },

    ondelete: () => {
      app.stopInstanceLogs(app, service.id, deployment.id, instance.id);
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
  const service = vnode.attrs.service;
  const deployment = vnode.attrs.deployment;
  const instance = vnode.attrs.instance;

  function instanceChangeHandler () {
    app.readInstance(app, service.id, deployment.id, instance.id);
  }

  return {
    oncreate: () => app.notifier.on(instance.id, instanceChangeHandler),
    onremove: () => app.notifier.off(instance.id, instanceChangeHandler),
    view: (vnode) => {
      const { app, service, instance } = vnode.attrs;
      const toggleExpanded = event => {
        if (['MUI-DROPDOWN-HEAD', 'A'].includes(event.target.tagName)) {
          return;
        }

        app.toggleExpanded(app, 'instanceExpands', instance.id);
      };

      function handleDestroyInstance () {
        app.destroyInstance(app, service.id, deployment.id, instance.id);
        document.activeElement.blur();
      }

      return html`
      <puz-instance key=${instance.id} class="instance-status-${instance.status} ${app.state.instanceExpands[instance.id] ? 'expanded' : ''}">
      <puz-instance-heading onclick=${toggleExpanded}>
      <div class="nowrap cutoff">${instance.id}</div>
      <div><span class="label label-${instance.status}">${instance.status}</span></div>
      <div class="nowrap">${formatDate(instance.dateCreated)}</div>
      <div>
      ${m(mui.dropdown, { class: 'align-right', head: '☰' }, [
        m('div',
        m('a', { onclick: handleDestroyInstance }, 'Destroy instance')
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
          content: instanceLog(app, service, deployment, instance)
        }, {
          key: 'logs',
          title: html`<span>Logs</span>`,
          defaultActive: instance.status !== 'pending',
          content: liveLog(app, service, deployment, instance)
        }, {
          key: 'stats',
          title: 'Statistics',
          content: statistics(app, service, deployment, instance)
        }, {
          key: 'settings',
          title: html`<span>Settings</span>`,
          content: settings(app, service, deployment, instance)
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

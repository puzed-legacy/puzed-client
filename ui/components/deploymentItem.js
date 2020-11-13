const mithril = require('mithril');
const mui = require('mithui');
const m = mithril;
const html = require('hyperx')(mithril);

const classcat = require('classcat');
const terminal = require('../components/terminal');
const instanceList = require('../components/instanceList');

function deploymentItem (vnode) {
  const app = vnode.attrs.app;
  const deploymentId = vnode.attrs.deployment.id;
  const serviceId = vnode.attrs.service.id;

  function deploymentChangeHandler () {
    app.readDeployment(app, serviceId, deploymentId);
    app.listInstances(app, serviceId, deploymentId);
  }

  const toggleExpanded = deploymentId => event => {
    if (['MUI-DROPDOWN-HEAD', 'MUI-DROPDOWN-BODY', 'MUI-DROPDOWN', 'A'].includes(event.target.tagName)) {
      return;
    }

    if (['MUI-DROPDOWN-HEAD', 'MUI-DROPDOWN-BODY', 'MUI-DROPDOWN', 'A'].includes(event.target.parentNode.tagName)) {
      return;
    }

    app.toggleExpanded(app, 'deploymentExpands', deploymentId);
  };

  function deploymentHeading (deployment, service) {
    function handleAddNewInstance () {
      app.createInstance(app, service.id, deployment.id);
      document.activeElement.blur();
    }

    function handlePromoteToProduction () {
      app.patchDeployment(app, service.id, deployment.id, {
        autoSwitch: {
          targetDeployment: 'production',
          newTitle: 'production-backup-' + Date.now()
        }
      });
      document.activeElement.blur();
    }

    function handleDestroyDeployment () {
      app.deleteDeployment(app, service.id, deployment.id);
      document.activeElement.blur();
    }
    function handleViewBuildLog () {
      app.readBuildLog(app, service.id, deployment.id);
      app.toggleExpanded(app, 'imageBuildLogExpands', deployment.id);
      document.activeElement.blur();
    }

    return html`
      <puz-deployment-heading onclick=${toggleExpanded(deployment.id)}>
        <div class="nowrap">
          ${deployment.stable
            ? html`
              <img style="width: 25px" src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjZDJmZmNjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTAwIDEwMDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO30KPC9zdHlsZT48cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDkuNSw4OS41Yy0yMi4xLDAtNDAtMTcuOS00MC00MGMwLTIyLjEsMTcuOS00MCw0MC00MGMyMi4xLDAsNDAsMTcuOSw0MCw0MEM4OS41LDcxLjYsNzEuNiw4OS41LDQ5LjUsODkuNXogICBNNjcuNiwzNi40Yy0xLjItMS4yLTMuMS0xLjItNC4zLDBMNDQuMiw1NmwtOC41LTguOGMtMS4yLTEuMi0zLjEtMS4yLTQuMywwYy0xLjIsMS4yLTEuMiwzLjIsMCw0LjRsMTAuNywxMWMxLjIsMS4yLDMuMSwxLjIsNC4zLDAgIGwyMS4zLTIxLjhDNjguOCwzOS42LDY4LjgsMzcuNiw2Ny42LDM2LjR6Ij48L3BhdGg+PC9zdmc+" />
            `
            : html`
              <img style="width: 25px" src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjZmZmZGNjIiB4bWxuczp4PSJodHRwOi8vbnMuYWRvYmUuY29tL0V4dGVuc2liaWxpdHkvMS4wLyIgeG1sbnM6aT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZUlsbHVzdHJhdG9yLzEwLjAvIiB4bWxuczpncmFwaD0iaHR0cDovL25zLmFkb2JlLmNvbS9HcmFwaHMvMS4wLyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iLTIwNSAyMDcgMTAwIDEwMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAtMjA1IDIwNyAxMDAgMTAwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHN3aXRjaD48Zm9yZWlnbk9iamVjdCByZXF1aXJlZEV4dGVuc2lvbnM9Imh0dHA6Ly9ucy5hZG9iZS5jb20vQWRvYmVJbGx1c3RyYXRvci8xMC4wLyIgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSI+PC9mb3JlaWduT2JqZWN0PjxnIGk6ZXh0cmFuZW91cz0ic2VsZiI+PHBhdGggZD0iTS0xMTAuMywyODguNmwtMzkuOC02OC45Yy0yLjItMy44LTcuNy0zLjgtOS45LDBsLTM5LjgsNjguOWMtMi4yLDMuOCwwLjUsOC42LDQuOSw4LjZoNzkuNiAgICBDLTExMC44LDI5Ny4yLTEwOC4xLDI5Mi40LTExMC4zLDI4OC42eiBNLTE1Ni4zLDI0MC44YzIuNC0wLjYsNC44LDAuNiw1LjksMi44YzAuNCwwLjgsMC41LDEuNywwLjQsMi41Yy0wLjIsMi41LTAuMyw1LTAuNCw3LjYgICAgYy0wLjIsMy45LTAuNSw3LjktMC43LDExLjhjLTAuMSwxLjItMC4xLDIuNC0wLjIsMy43Yy0wLjEsMi4xLTEuNywzLjctMy44LDMuN2MtMiwwLTMuNy0xLjYtMy44LTMuNmMtMC4zLTYuMS0wLjctMTIuMi0xLTE4LjMgICAgYy0wLjEtMS42LTAuMi0zLjMtMC4zLTQuOUMtMTYwLjIsMjQzLjctMTU4LjYsMjQxLjQtMTU2LjMsMjQwLjh6IE0tMTU1LDI4Ni42Yy0yLjgsMC01LTIuMy01LTUuMWMwLTIuOCwyLjMtNS4xLDUuMS01LjEgICAgYzIuOCwwLDUsMi4zLDUsNS4yQy0xNTAsMjg0LjMtMTUyLjMsMjg2LjYtMTU1LDI4Ni42eiI+PC9wYXRoPjwvZz48L3N3aXRjaD48L3N2Zz4=" />
            `}
        </div>
        <div class="nowrap cutoff grow">
          <strong>${deployment.title}</strong>
          (${deployment.title === 'production'
            ? html`<a href="https://${service.domain}" target="_blank">visit</a>`
            : html`<a href="https://${deployment.subdomain}--${service.domain}" target="_blank">visit</a>`})
        </div>
        <div class="nowrap cutoff">${deployment.branch || 'unknown'}</div>
        ${deployment.autoSwitch
            ? html`
              <div class="nowrap cutoff">
                <span class="label label-switching">switching</span>
              </div>`
            : ''
        }
        ${deployment.buildStatus === 'building'
            ? html`
              <div class="nowrap cutoff">
                <span class="label label-building">building</span>
              </div>`
            : ''
        }
        ${deployment.buildStatus === 'failed'
            ? html`
              <div class="nowrap cutoff">
                <span class="label label-build-failed">build failed</span>
              </div>`
            : ''
        }
        <div class="nowrap"><span class="label label-${deployment.status}">${deployment.healthyInstances}/${deployment.totalInstances} Instances</span></div>
        <div>
          ${m(mui.dropdown, { class: 'align-right', head: '☰' }, [
            m('div',
              m('a', { onclick: handleViewBuildLog }, 'View build log')
            ),
            m('hr'),
            m('div',
              m('a', { onclick: handleAddNewInstance }, 'Add a new instance')
            ),
            m('div',
              m('a', { href: '#four' }, 'Remove a random instance')
            ),
            m('div', { class: deployment.title === 'production' ? 'disabled' : '' },
              m('a', { onclick: handlePromoteToProduction }, 'Promote to Production')
            ),
            m('hr'),
            m('div', { class: deployment.title === 'production' ? 'disabled' : '' },
              m('a', { onclick: handleDestroyDeployment }, 'Destroy deployment')
            )
          ])}
        </div>
      </puz-deployment-heading>     
    `;
  }

  function deploymentSubmittingHeading (deployment, service) {
    return html`
      <puz-deployment-heading onclick=${toggleExpanded(deployment.id)}>
        <div class="nowrap cutoff grow">
          <strong>${deployment.title}</strong>
        </div>
        <div class="nowrap cutoff">Submitting...</div>
        <div>
          ${m(mui.dropdown, { class: 'align-right', head: '☰' }, [
          ])}
        </div>
      </puz-deployment-heading>     
    `;
  }

  return {
    oncreate: () => app.notifier.on(deploymentId, deploymentChangeHandler),
    onremove: () => app.notifier.off(deploymentId, deploymentChangeHandler),
    view: (vnode) => {
      const { app, service, deployment } = vnode.attrs;

      const deploymentClasses = classcat({
        expanded: app.state.deploymentExpands[deployment.id],
        submitting: deployment.submitting
      });

      const heading = deployment.submitting ? deploymentSubmittingHeading(deployment, service) : deploymentHeading(deployment, service);

      function handleToggleClose (id) {
        app.toggleExpanded(app, 'imageBuildLogExpands', id);
      }

      return html`
        <puz-deployment key=${deployment.id} class="${deploymentClasses}">
          ${heading}
      
          ${app.state.imageBuildLogExpands[deployment.id]
            ? mithril('div',
                mithril('button', { class: 'closeButton', onclick: handleToggleClose.bind(null, deployment.id) }, 'close'),
                mithril(terminal, { content: app.state.buildLogs[deployment.id] || deployment.buildLog || 'No build log found' })
              )
            : ''
          }
          ${app.state.deploymentExpands[deployment.id]
            ? html`
              <puz-deployment-content>
                ${mithril(instanceList, { app, service, deployment })}
              </puz-deployment-content>
            `
            : ''}
        </puz-deployment>
      `;
    }
  };
}

module.exports = deploymentItem;

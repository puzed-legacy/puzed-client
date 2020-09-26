const mithril = require('mithril');
const mui = require('mithui');
const m = mithril;
const html = require('hyperx')(mithril);

const classcat = require('classcat');
const instanceList = require('../components/instanceList');

function deploymentItem (vnode) {
  const app = vnode.attrs.app;
  const deploymentId = vnode.attrs.deployment.id;
  const projectId = vnode.attrs.project.id;

  function deploymentChangeHandler () {
    app.readDeployment(app, projectId, deploymentId);
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

  function deploymentHeading (deployment, project) {
    function handleAddNewInstance () {
      app.createInstance(app, project.id, deployment.id);
      document.activeElement.blur();
    }

    return html`
      <puz-deployment-heading onclick=${toggleExpanded(deployment.id)}>
        <div class="nowrap cutoff">
          <strong>${deployment.title}</strong>
          (${deployment.title === 'production'
            ? html`<a href="https://${project.domain}" target="_blank">visit</a>`
            : html`<a href="https://${deployment.title}--${project.domain}" target="_blank">visit</a>`})
        </div>
        <div class="nowrap cutoff">${deployment.branch}</div>
        <div><span class="label label-${deployment.status}">${deployment.instanceCount} Instances</span></div>
        <div>
          ${m(mui.dropdown, { class: 'align-right', head: '☰' }, [
            m('div',
              m('a', { onclick: handleAddNewInstance }, 'Add a new instance')
            ),
            m('div',
              m('a', { href: '#four' }, 'Remove a random instance')
            ),
            m('div',
              m('a', { href: '#four' }, 'Promote to Production')
            ),
            m('hr'),
            m('div', { class: deployment.title === 'production' ? 'disabled' : '' },
              m('a', { href: '#four' }, 'Destroy deployment')
            )
          ])}
        </div>
      </puz-deployment-heading>     
    `;
  }

  function deploymentSubmittingHeading (deployment, project) {
    return html`
      <puz-deployment-heading onclick=${toggleExpanded(deployment.id)}>
        <div class="nowrap cutoff">
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
      const { app, project, deployment } = vnode.attrs;

      const deploymentClasses = classcat({
        expanded: app.state.deploymentExpands[deployment.id],
        submitting: deployment.submitting
      });

      const heading = deployment.submitting ? deploymentSubmittingHeading(deployment, project) : deploymentHeading(deployment, project);

      return html`
        <puz-deployment key=${deployment.id} class="${deploymentClasses}">
          ${heading}
      
          ${app.state.deploymentExpands[deployment.id] ? html`
            <puz-deployment-content>
              ${mithril(instanceList, { app, project, deployment })}
            </puz-deployment-content>
          ` : ''}
        </puz-deployment>
      `;
    }
  };
}

module.exports = deploymentItem;

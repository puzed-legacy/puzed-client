const m = require('mithril');

const menu = require('../../components/menu');

const successIcon = (props) => {
  return m('div', {
    ...props,
    innerHTML: `
      <svg fill="green" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 100" xml:space="preserve">
        <style type="text/css">
          .st0{fill-rule:evenodd;clip-rule:evenodd;}
        </style>
        <path class="st0" d="M49.5,89.5c-22.1,0-40-17.9-40-40c0-22.1,17.9-40,40-40c22.1,0,40,17.9,40,40C89.5,71.6,71.6,89.5,49.5,89.5z   M67.6,36.4c-1.2-1.2-3.1-1.2-4.3,0L44.2,56l-8.5-8.8c-1.2-1.2-3.1-1.2-4.3,0c-1.2,1.2-1.2,3.2,0,4.4l10.7,11c1.2,1.2,3.1,1.2,4.3,0  l21.3-21.8C68.8,39.6,68.8,37.6,67.6,36.4z">
        </path>
      </svg>
    `
  });
};

const warningIcon = (props) => {
  return m('div', {
    ...props,
    innerHTML: `
      <svg fill="orange" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="-205 207 100 100" style="enable-background:new -205 207 100 100;" xml:space="preserve">
        <switch>
          <foreignObject requiredExtensions="http://ns.adobe.com/AdobeIllustrator/10.0/" x="0" y="0" width="1" height="1"></foreignObject>
          <g i:extraneous="self"><path d="M-110.3,288.6l-39.8-68.9c-2.2-3.8-7.7-3.8-9.9,0l-39.8,68.9c-2.2,3.8,0.5,8.6,4.9,8.6h79.6    C-110.8,297.2-108.1,292.4-110.3,288.6z M-156.3,240.8c2.4-0.6,4.8,0.6,5.9,2.8c0.4,0.8,0.5,1.7,0.4,2.5c-0.2,2.5-0.3,5-0.4,7.6    c-0.2,3.9-0.5,7.9-0.7,11.8c-0.1,1.2-0.1,2.4-0.2,3.7c-0.1,2.1-1.7,3.7-3.8,3.7c-2,0-3.7-1.6-3.8-3.6c-0.3-6.1-0.7-12.2-1-18.3    c-0.1-1.6-0.2-3.3-0.3-4.9C-160.2,243.7-158.6,241.4-156.3,240.8z M-155,286.6c-2.8,0-5-2.3-5-5.1c0-2.8,2.3-5.1,5.1-5.1    c2.8,0,5,2.3,5,5.2C-150,284.3-152.3,286.6-155,286.6z"></path></g>
        </switch>
      </svg>
    `
  });
};

const errorIcon = (props) => {
  return m('div', {
    ...props,
    innerHTML: `
      <svg fill="red" xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="-205 207 100 100" style="enable-background:new -205 207 100 100;" xml:space="preserve">
        <switch>
          <foreignObject requiredExtensions="http://ns.adobe.com/AdobeIllustrator/10.0/" x="0" y="0" width="1" height="1"></foreignObject>
          <g i:extraneous="self"><path d="M-110.3,288.6l-39.8-68.9c-2.2-3.8-7.7-3.8-9.9,0l-39.8,68.9c-2.2,3.8,0.5,8.6,4.9,8.6h79.6    C-110.8,297.2-108.1,292.4-110.3,288.6z M-156.3,240.8c2.4-0.6,4.8,0.6,5.9,2.8c0.4,0.8,0.5,1.7,0.4,2.5c-0.2,2.5-0.3,5-0.4,7.6    c-0.2,3.9-0.5,7.9-0.7,11.8c-0.1,1.2-0.1,2.4-0.2,3.7c-0.1,2.1-1.7,3.7-3.8,3.7c-2,0-3.7-1.6-3.8-3.6c-0.3-6.1-0.7-12.2-1-18.3    c-0.1-1.6-0.2-3.3-0.3-4.9C-160.2,243.7-158.6,241.4-156.3,240.8z M-155,286.6c-2.8,0-5-2.3-5-5.1c0-2.8,2.3-5.1,5.1-5.1    c2.8,0,5,2.3,5,5.2C-150,284.3-152.3,286.6-155,286.6z"></path></g>
        </switch>
      </svg>
    `
  });
};

module.exports = function (app, html) {
  app.listDomains(app);

  return {
    view: () => html`
      <main>
        ${menu(app, html)}
  
        <section>
          <h2>Domains</h2>
          <p>Create or manage your domains.</p>
          <a href="/domains/create">Create new domain</a>

          <h3>Listing your domains</h3>
          <ul>
            ${(app.state.domains || []).map(domain => {
              return html`
                <li>
                  ${domain.verificationStatus === 'success' ? successIcon({ class: 'icon' }) : ''}
                  ${domain.verificationStatus === 'pending' ? warningIcon({ class: 'icon' }) : ''}
                  ${domain.verificationStatus === 'error' ? errorIcon({ class: 'icon' }) : ''}
                  ${domain.domain}
                  ${domain.verificationStatus === 'pending' || domain.verificationStatus === 'failed' ? html`
                    <div class="alert alert-warning">
                      This domain has not been verified and you will not be able to use it.
                      <br />
                      <strong>Add the following TXT record to the domain:</strong>
                      <br />
                      (If you are asked for a subdomain, you can use @)
                      <br />
                      <pre><code>${domain.domain}=${domain.verificationCode}</code></pre>
                    </div>
                  ` : ''}

                  ${domain.verificationStatus === 'error' ? html`
                    <div class="alert alert-danger">
                      This domain could not be verified.
                    </div>
                  ` : ''}
                </li>`;
            })}
          </ul>
        </section>
      </main>
    `
  };
};

module.exports = function (app, html) {
  return {
    view: () => {
      return html`
        <main>
          <div class="loading">
            <div>Loading. Please wait...</div>
          </div>
        </main>
      `;
    }
  };
};

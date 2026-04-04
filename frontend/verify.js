const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('./index.html', 'utf8');

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable"
});

dom.window.onload = () => {
    try {
        console.log("Window loaded");
        // We inject the app.js code because resources="usable" might not resolve local file paths nicely
        const js = fs.readFileSync('./app.js', 'utf8');
        const scriptEl = dom.window.document.createElement('script');
        scriptEl.textContent = js;
        dom.window.document.body.appendChild(scriptEl);

        dom.window.document.getElementById('username').value = 'test';
        dom.window.document.getElementById('password').value = 'test';

        console.log("Type of login:", typeof dom.window.login);
        if (typeof dom.window.login === 'function') {
            const btn = dom.window.document.querySelector('button[onclick="login()"]');
            console.log("Button found:", !!btn);
            
            // mock fetch
            dom.window.fetch = async () => ({ json: async () => ({ message: "Server mock response" }) });
            dom.window.alert = (msg) => console.log("ALERT:", msg);

            console.log("Triggering login click");
            btn.click();
            
            setTimeout(() => {
                const errText = dom.window.document.getElementById("auth-error").innerText;
                const errDisplay = dom.window.document.getElementById("auth-error").style.display;
                console.log("Error text:", errText);
                console.log("Error display:", errDisplay);
            }, 500);
        }
    } catch(e) {
        console.error("Test error:", e);
    }
};

export { parse as default }

function parse(raw) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ThunderStormJS</title>
</head>
<body>
  <div id="app"></div>
  <script type="module">
${raw}
  </script>
  <script>
    (() => {
      const ws = new WebSocket("ws://" + location.host);
      ws.onmessage = ev => {
        if (ev.data === "reload") location.reload();
      };
    })();
  </script>
</body>
</html>`
}

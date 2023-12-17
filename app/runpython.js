const {PythonShell} = require('python-shell')
window.alert(5);
const res = document.querySelector('#output');

function log(message) {
  res.appendChild(55555);
  const p = document.createElement('p');
  p.textContent = message;
  res.appendChild(p);
}
res.append('jjjjj')

res.append('jjjjj')
const path = require('path');
res.append('jjjjj')

PythonShell.run('hello.py', null, function (err, results) {
  if (err) throw err;
  
});
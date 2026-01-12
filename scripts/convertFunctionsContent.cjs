const fs = require('fs');
const path = require('path');

const input = process.argv[2] || path.resolve('d:/downloads/functions(content).json');
const output = process.argv[3] || path.resolve('src/data/functions.json');

function parseSelfAssessment(text) {
  if (!text || typeof text !== 'string') return null;
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length);
  const qas = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('-')) { i++; continue; }
    const opts = [];
    let j = i + 1;
    while (j < lines.length && lines[j].startsWith('-')) {
      let opt = lines[j].replace(/^[-\u2013\u2014]\s*/, '').trim();
      const m = opt.match(/^(.*)\(\+3\s*([^\)]+)\)\s*$/);
      if (m) {
        const text = m[1].trim();
        const attr = m[2].trim();
        opts.push({ text, attr });
      } else {
        opts.push({ text: opt, attr: null });
      }
      j++;
    }
    if (opts.length > 0) {
      qas.push({ question: line, options: opts });
      i = j;
    } else {
      i++;
    }
  }
  return qas.length ? qas : null;
}

try {
  const raw = fs.readFileSync(input, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error('expected top-level array');

  if (fs.existsSync(output)) {
    const bak = output + '.bak';
    fs.copyFileSync(output, bak);
    console.log('Backup made:', bak);
  }

  const out = data.map(entry => {
    const e = Object.assign({}, entry);
    if (!e.selfAssessment) {
      const key1 = e.self_assessment || e['self_assessment'];
      if (key1 && typeof key1 === 'string') {
        const parsed = parseSelfAssessment(key1);
        if (parsed) {
          e.selfAssessment = parsed;
        }
      }
    }
    if (e.self_assessment) delete e.self_assessment;
    if (e['self_assessment']) delete e['self_assessment'];
    return e;
  });

  fs.writeFileSync(output, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', output);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}

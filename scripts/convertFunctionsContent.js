const fs = require('fs');
const path = require('path');

const input = process.argv[2] || path.resolve('d:/downloads/functions(content).json');
const output = process.argv[3] || path.resolve('src/data/functions.json');

function parseSelfAssessment(text) {
  if (!text || typeof text !== 'string') return null;
  // Split into trimmed, non-empty lines
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length);
  const qas = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Skip lines that look like instructions (they often contain punctuation, English letters, or end with '。' and not start with '-')
    if (line.startsWith('-')) {
      // unexpected - skip
      i++; continue;
    }
    // Treat this line as question if next lines are options starting with '-'
    const opts = [];
    let j = i + 1;
    // gather subsequent option lines that start with '-'
    while (j < lines.length && lines[j].startsWith('-')) {
      // strip leading '-'
      let opt = lines[j].replace(/^[-\u2013\u2014]\s*/, '').trim();
      // try to extract text and attribute like 'xxx (+3 气场)'
      const m = opt.match(/^(.*)\(\+3\s*([^\)]+)\)\s*$/);
      if (m) {
        const text = m[1].trim();
        const attr = m[2].trim();
        opts.push({ text, attr });
      } else {
        // fallback: no attr parsed
        opts.push({ text: opt, attr: null });
      }
      j++;
    }
    if (opts.length > 0) {
      qas.push({ question: line, options: opts });
      i = j;
    } else {
      // no options following; skip this line (likely instruction)
      i++;
    }
  }
  return qas.length ? qas : null;
}

try {
  const raw = fs.readFileSync(input, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error('expected top-level array');

  // backup output if exists
  if (fs.existsSync(output)) {
    const bak = output + '.bak';
    fs.copyFileSync(output, bak);
    console.log('Backup made:', bak);
  }

  const out = data.map(entry => {
    const e = Object.assign({}, entry);
    // prefer existing selfAssessment if present
    if (!e.selfAssessment) {
      const key1 = e.self_assessment || e['self_assessment'];
      if (key1 && typeof key1 === 'string') {
        const parsed = parseSelfAssessment(key1);
        if (parsed) {
          e.selfAssessment = parsed;
        }
      }
    }
    // if items exist but have `eff` etc unchanged — keep as-is
    // clean up old key if present
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

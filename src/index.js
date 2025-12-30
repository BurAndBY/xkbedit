const React = require('react');
const { createRoot } = require('react-dom/client');

const e = React.createElement;

const KEY_ROWS = [
  [
    { code: 'TLDE', label: '`' },
    { code: 'AE01', label: '1' },
    { code: 'AE02', label: '2' },
    { code: 'AE03', label: '3' },
    { code: 'AE04', label: '4' },
    { code: 'AE05', label: '5' },
    { code: 'AE06', label: '6' },
    { code: 'AE07', label: '7' },
    { code: 'AE08', label: '8' },
    { code: 'AE09', label: '9' },
    { code: 'AE10', label: '0' },
    { code: 'AE11', label: '-' },
    { code: 'AE12', label: '=' },
    { code: 'BKSP', label: 'Backspace' }
  ],
  [
    { code: 'TAB', label: 'Tab' },
    { code: 'AD01', label: 'Q' },
    { code: 'AD02', label: 'W' },
    { code: 'AD03', label: 'E' },
    { code: 'AD04', label: 'R' },
    { code: 'AD05', label: 'T' },
    { code: 'AD06', label: 'Y' },
    { code: 'AD07', label: 'U' },
    { code: 'AD08', label: 'I' },
    { code: 'AD09', label: 'O' },
    { code: 'AD10', label: 'P' },
    { code: 'AD11', label: '[' },
    { code: 'AD12', label: ']' },
    { code: 'BKSL', label: '\\' }
  ],
  [
    { code: 'CAPS', label: 'Caps' },
    { code: 'AC01', label: 'A' },
    { code: 'AC02', label: 'S' },
    { code: 'AC03', label: 'D' },
    { code: 'AC04', label: 'F' },
    { code: 'AC05', label: 'G' },
    { code: 'AC06', label: 'H' },
    { code: 'AC07', label: 'J' },
    { code: 'AC08', label: 'K' },
    { code: 'AC09', label: 'L' },
    { code: 'AC10', label: ';' },
    { code: 'AC11', label: '\'' },
    { code: 'RTRN', label: 'Enter' }
  ],
  [
    { code: 'LFSH', label: 'Shift' },
    { code: 'AB01', label: 'Z' },
    { code: 'AB02', label: 'X' },
    { code: 'AB03', label: 'C' },
    { code: 'AB04', label: 'V' },
    { code: 'AB05', label: 'B' },
    { code: 'AB06', label: 'N' },
    { code: 'AB07', label: 'M' },
    { code: 'AB08', label: ',' },
    { code: 'AB09', label: '.' },
    { code: 'AB10', label: '/' },
    { code: 'RTSH', label: 'Shift' }
  ],
  [
    { code: 'LCTL', label: 'Ctrl' },
    { code: 'LWIN', label: 'Super' },
    { code: 'LALT', label: 'Alt' },
    { code: 'SPCE', label: 'Space', legend: '[SP]', span: 6 },
    { code: 'RALT', label: 'Alt' },
    { code: 'RWIN', label: 'Menu' },
    { code: 'RCTL', label: 'Ctrl' }
  ]
];

const buildInitialLayout = () => ({});

const toXkbKeysym = symbol => {
  if (!symbol) return 'VoidSymbol';
  const trimmed = symbol.trim();
  if (!trimmed) return 'VoidSymbol';
  if (/^[A-Za-z0-9]$/.test(trimmed)) {
    return trimmed;
  }
  const cp = trimmed.codePointAt(0);
  return 'U' + cp.toString(16).toUpperCase().padStart(4, '0');
};

const createXkbSnippet = layout => {
  const lines = ['xkb_symbols "custom" {'];
  KEY_ROWS.forEach(row =>
    row.forEach(key => {
      const stored = layout[key.code];
      const value = stored === undefined ? key.label : stored;
      lines.push(`    key <${key.code}> { [ ${toXkbKeysym(value)} ] };`);
    })
  );
  lines.push('};');
  return lines.join('\n');
};

const KEY_GAP = 8;

const Keyboard = ({ layout, activeKey, onKeyClick }) =>
  e(
    'div',
    { className: 'keyboard-wrapper' },
    e(
      'div',
      { className: 'keyboard' },
      KEY_ROWS.map((row, rowIdx) =>
        e(
          'div',
          { className: 'key-row', key: rowIdx },
          row.map(key =>
            e(
              'button',
              {
                key: key.code,
                className: `key${activeKey === key.code ? ' key--active' : ''}`,
                onClick: () => onKeyClick(key),
                style: key.span
                  ? {
                      width: `calc(var(--key-size) * ${key.span} + ${(key.span - 1) * KEY_GAP}px)`,
                      flex: `0 0 calc(var(--key-size) * ${key.span} + ${
                        (key.span - 1) * KEY_GAP
                      }px)`
                    }
                  : undefined
              },
              (() => {
                const stored = layout[key.code];
                const legend = key.legend || key.label;
                let display;
                let shrink = false;
                if (stored === undefined) {
                  display = legend;
                  shrink = legend.length > 1;
                } else if (stored === '') {
                  display = '';
                } else {
                  display = stored;
                }
                return e(
                  'span',
                  {
                    className: `key-symbol${shrink ? ' key-symbol--small' : ''}`
                  },
                  display
                );
              })(),
              e('span', { className: 'key-code' }, key.code)
            )
          )
        )
      )
    )
  );

const App = () => {
  const [layout, setLayout] = React.useState(() => buildInitialLayout());
  const [activeKey, setActiveKey] = React.useState(null);

  const xkbSnippet = React.useMemo(() => createXkbSnippet(layout), [layout]);

  const handleKeyClick = key => {
    const currentValue = layout[key.code];
    const promptValue = currentValue === undefined ? key.label : currentValue;
    const nextValue = window.prompt(
      `Symbol to assign to ${key.label} (<${key.code}>)`,
      promptValue
    );
    if (nextValue === null) return;
    setLayout(prev => {
      const copy = Object.assign({}, prev);
      if (nextValue === key.label || nextValue === undefined) {
        delete copy[key.code];
        return copy;
      }
      copy[key.code] = nextValue;
      return copy;
    });
    setActiveKey(key.code);
  };

  const resetLayout = () => {
    if (window.confirm('Reset the layout to the default symbols?')) {
      setLayout(buildInitialLayout());
      setActiveKey(null);
    }
  };

  const downloadSnippet = () => {
    const blob = new Blob([xkbSnippet], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'custom.xkb';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return e(
    'div',
    { className: 'app-shell' },
    e(
      'header',
      { className: 'panel' },
      e('h1', null, 'XKB Layout Painter'),
      e(
        'p',
        null,
        'Click a key, type any glyph (ø, и, 1, etc.), and copy the generated xkb_symbols block.'
      ),
      e(
        'div',
        { className: 'controls' },
        e('button', { type: 'button', onClick: resetLayout }, 'Reset Layout'),
        e('span', { className: 'hint' }, 'Leave the prompt empty to emit VoidSymbol.')
      )
    ),
    e(
      'section',
      { className: 'panel' },
      e('h2', null, 'Keyboard'),
      e(Keyboard, { layout, activeKey, onKeyClick: handleKeyClick })
    ),
    e(
      'section',
      { className: 'panel' },
      e('h2', null, 'xkb_symbols export'),
      e(
        'div',
        { className: 'download-actions' },
        e('button', { type: 'button', onClick: downloadSnippet }, 'Download .xkb'),
        e(
          'span',
          { className: 'hint' },
          'Paste into ~/.xkb/symbols/custom or use xkbcomp.'
        )
      ),
      e('textarea', {
        className: 'snippet',
        readOnly: true,
        value: xkbSnippet,
        onFocus: evt => evt.target.select()
      })
    )
  );
};

const root = createRoot(document.getElementById('root'));
root.render(e(App));

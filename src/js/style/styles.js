var _extend = function(target, ext) {
  for (prop in ext) {
    target[prop] = ext[prop];
  }
};

var styles = {
  html: {
    boxSizing: 'border-box',
    fontSize: '1.0vw'
  },

  '*, *:before, *:after': {
    boxSizing: 'inherit'
  },

  a: {
    color: 'inherit',
    textDecoration: 'none'
  },

  body: {
    fontFamily: 'helvetica, arial',
    fontSize: '3.0rem',

    '&.dark': {
      background: '#000',

      '.slide': {
        background: '#000',
        color: '#fff'
      }
    },

    '&:not(.dark)': {
      code: {
        background: 'none !important'
      }
    }
  },

  img: {
    border: '0'
  },

  h1: {
    fontSize: '6.0rem'
  },

  h2: {
    fontSize: '4.0rem',
    marginTop: '0.5rem',
    marginBottom: '1rem'
  },

  h3: {
    fontSize: '3.0rem',
    marginBottom: '0'
  },

  h4: {
    fontSize: '2.5rem',
    marginBottom: '0'
  },

  ul: {
    listStyleType: 'none',
    margin: '0',
    padding: '0',

    li: {
      margin: '0 0 1rem 0'
    }
  },

  code: {
    fontFamily: 'consolas, monaco, monospace',
    fontSize: '2.5rem',
    whiteSpace: 'pre-wrap',
    margin: '4px',

    '&.small': {
      fontSize: '2.0rem',
    },

    '&.inline': {
      fontSize: 'inherit',
    }
  },

  '.side-by-side': {
    display: 'flex',
    '> *': {
      flex: '1'
    },
    code: {
      fontSize: '2.0rem'
    }
  },

  '.slide': {
    padding: '1vw 3vw',
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    left: '0',
    opacity: '0',
    transition: 'opacity 0.25s linear',
    pointerEvents: 'none',

    aside: {
      display: 'none'
    },

    ul: {
      listStyleType: 'disc',
      padding: '1rem 5rem'
    },

    '&.active': {
      opacity: '1',
      pointerEvents: 'auto'
    },

    '&.dark': {
      color: '#fff',
      background: '#3A3532 !important'
    },

    '&.bright': {
      color: '#fff',
      background: '#2962FF !important'
    },

    '&.fire-mario': {
      background: 'url(assets/fire-mario.png) bottom right no-repeat'
    }
  },

  '.slide-item': {
    opacity: '0',

    '&.active': {
      opacity: '1'
    },

    transition: 'opacity 0.5s ease-in'
  },

  '.icons': {
    fontFamily: "'FontAwesome'",
    fontSize: '4.2rem',
    li: {
      display: 'inline',
      padding: '0 1vw'
    }
  },

  '.flex': {
    display: 'flex'
  },

  '.logos': {
    display: 'flex',
    width: '100%',
    height: '100%',

    '.logo': {
      flex: '1',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      margin: '2rem',

      '&.google': { backgroundImage: 'url(assets/logos/logo-google.png)' },
      '&.youtube': { backgroundImage: 'url(assets/logos/logo-youtube.png)' },
      '&.hbo': { backgroundImage: 'url(assets/logos/logo-hbo.png)' },
      '&.nike': { backgroundImage: 'url(assets/logos/logo-nike.png)' },
      '&.ea': { backgroundImage: 'url(assets/logos/logo-ea.png)' },
      '&.rdio': { backgroundImage: 'url(assets/logos/logo-rdio.png)' }
    }
  },

  '.jobs': {
    display: 'flex',
    width: '100%',
    height: '100%',

    '.job': {
      flex: '1',
      borderTop: '10px #b25538 solid',
      margin: '2rem',
      color: '#3A3532',
      background: '#f6f5f1',
      fontWeight: 'bold',

      img: {
        width: '25%',
        height: 'auto',
        margin: '10px 0'
      }
    }
  },

  '.align-left': {
    textAlign: 'left'
  },

  '.align-center': {
    textAlign: 'center'
  },

  '.center-all': {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

_extend(styles, require('./logo'));
_extend(styles, require('./fontawesome'));

module.exports = styles;

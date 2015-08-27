module.exports = {
  '.grow-logo': {
    position: 'relative',
    width: '160px',
    height: '160px',

    path: {
      fill: '#EFEEEA'
    },

    '.leaf svg': {
      left: '0',
      top: '0'
    },

    '.circle': {
      background: '#eeedea',
      borderRadius: '50%'
    },
    '.drop': {
      top: '0',
      width: '50px',
      height: '100px',
      left: '50%'
    },
    '.drop, .drop svg': {
      position: 'absolute',
      transformOrigin: 'left top'
    },
    '.drop svg': {
      transform: 'scale(0.2)',
      top: '0',
      left: '0'
    },
    '.stem': {
      top: '26%',
      width: '8.5px',
      height: '86px',
      left: '75px',
      transformOrigin: 'top'
    },
    '.leaf.bottom': {
      width: '53px',
      height: '46px',
      top: '48%'
    },
    '.leaf.middle': {
      width: '35px',
      height: '30px',
      top: '35%'
    },
    '.leaf.middle.left': {
      right: '80px'
    },
    '.leaf.middle.right': {
      left: '81px'
    },
    '.leaf.top': {
      width: '22px',
      height: '19px',
      top: '26%'
    },
    '.leaf.top.left': {
      right: '79px'
    },
    '.leaf.top.right': {
      left: '80px'
    },
    '.leaf.left': {
      right: '81px'
    },
    '.leaf.right': {
      left: '82px'
    },

    'polygon, path': {
      fill: '#3A3532'
    },

    '.circle, svg': {
      width: '100%',
      height: '100%'
    },
    '.stem, .leaf, .leaf svg': {
      position: 'absolute'
    }
  }
};

export const mockNodeChild = [
  {
    input: {
      type: 'code',
      value: '```js```'
    },
    output: false,
    paramsOutput: null
  }, {
    input: {
      type: 'code',
      value: ':::'
    },
    output: false,
    paramsOutput: null
  },
  {
    input: {
      type: 'text',
      value: ':::'
    },
    output: true,
    paramsOutput: {
      title: undefined,
      alias: '',
      type: 'div',
      props: {
        className: []
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: :::'
    },
    output: false,
    paramsOutput: null
  },
  {
    input: {
      type: 'text',
      value: '::: \n :::'
    },
    output: false,
    paramsOutput: null
  },
  {
    input: {
      type: 'text',
      value: ':::tip'
    },
    output: true,
    paramsOutput: {
      title: undefined,
      alias: 'tip',
      type: 'div',
      props: {
        className: ['tip']
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: tip'
    },
    output: true,
    paramsOutput: {
      title: undefined,
      alias: 'tip',
      type: 'div',
      props: {
        className: ['tip']
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: tip{id}'
    },
    output: true,
    paramsOutput: {
      title: undefined,
      alias: 'tip',
      type: 'div',
      props: {
        className: ['tip']
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: tip{#id}'
    },
    output: true,
    paramsOutput: {
      title: undefined,
      alias: 'tip',
      type: 'div',
      props: {
        className: ['tip'],
        id: 'id'
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: tip{.class}'
    },
    output: true,
    paramsOutput: {
      title: undefined,
      alias: 'tip',
      type: 'div',
      props: {
        className: ['tip', 'class']
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: tip提示'
    },
    output: true,
    paramsOutput: {
      title: undefined,
      alias: 'tip',
      type: 'div',
      props: {
        className: ['tip']
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: tip 提示'
    },
    output: true,
    paramsOutput: {
      title: '提示',
      alias: 'tip',
      type: 'div',
      props: {
        className: ['tip']
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: tip{id} 提示'
    },
    output: true,
    paramsOutput: {
      title: '提示',
      alias: 'tip',
      type: 'div',
      props: {
        className: ['tip']
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: tip{#id} 提示'
    },
    output: true,
    paramsOutput: {
      title: '提示',
      alias: 'tip',
      type: 'div',
      props: {
        className: ['tip'],
        id: 'id'
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: tip{#id} 提示 :::'
    },
    output: false,
    paramsOutput: null
  },
  {
    input: {
      type: 'text',
      value: '::: tip{#id} 提示 \n:::'
    },
    output: true,
    paramsOutput: {
      title: '提示',
      alias: 'tip',
      type: 'div',
      props: {
        className: ['tip'],
        id: 'id'
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: tip{#id} 提示 \n123:::'
    },
    output: true,
    paramsOutput: {
      title: '提示',
      alias: 'tip',
      type: 'div',
      props: {
        className: ['tip'],
        id: 'id'
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: div 提示'
    },
    output: true,
    paramsOutput: {
      title: '提示',
      alias: '',
      type: 'div',
      props: {
        className: []
      },
    }
  },
  {
    input: {
      type: 'text',
      value: '::: code-group 代码组'
    },
    output: true,
    paramsOutput: {
      title: '代码组',
      alias: 'code-group',
      type: 'div',
      props: {
        className: ['code-group']
      },
    }
  },
]